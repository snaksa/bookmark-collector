import { DynamoDB } from 'aws-sdk';
import BaseHandler, { Response } from '../../../shared/base-handler';
import { ApiGatewayResponseCodes } from '../../../shared/enums/api-gateway-response-codes';
import { StreamEventTypes } from '../../../shared/enums/stream-event-types';
import { Model } from '../../../shared/models/base.model';
import BookmarkLabel from '../../../shared/models/bookmark-label.model';
import Bookmark from '../../../shared/models/bookmark.model';
import Label from '../../../shared/models/label.model';
import { BookmarkRepository } from '../../../shared/repositories/bookmark.repository';
import { LabelRepository } from '../../../shared/repositories/label.repository';

interface StreamEvent {
    type: string;
    object: Model;
}

class StreamLambdaHandler extends BaseHandler {
    private labelRepository: LabelRepository;
    private bookmarkRepository: BookmarkRepository;

    private records: StreamEvent[] = [];

    constructor() {
        super();

        this.labelRepository = new LabelRepository(process.env.dbStore ?? '');
        this.bookmarkRepository = new BookmarkRepository(process.env.dbStore ?? '');
    }

    parseEvent(event: any) {
        event.Records.map((record: any) => {
            const streamEvent: StreamEvent = {
                type: record.eventName,
                object: this.getObject(record.eventName === StreamEventTypes.REMOVE ? record.dynamodb.OldImage : record.dynamodb.NewImage)
            };

            this.records.push(streamEvent);
        })
    }

    getObject(object: any): Model {
        let unmarshalledObject = DynamoDB.Converter.unmarshall(object);

        switch (unmarshalledObject.entityType) {
            case Label.ENTITY_TYPE:
                return Label.fromDynamoDb(unmarshalledObject as Label);
            case BookmarkLabel.ENTITY_TYPE:
                return BookmarkLabel.fromDynamoDb(unmarshalledObject as BookmarkLabel);
            default:
                return Bookmark.fromDynamoDb(unmarshalledObject as Bookmark)
        }
    }

    async updateBookmarkLabels(label: Label) {
        const bookmarkLabels = await this.labelRepository.findBookmarks(label.labelId);

        const updated: Promise<BookmarkLabel>[] = [];
        for (let i = 0; i < bookmarkLabels.length; i++) {
            const bl = bookmarkLabels[i];
            bl.title = label.title;
            bl.color = label.color;

            updated.push(this.labelRepository.updateBookmarks(bl));
        }

        await Promise.all(updated);
    }

    async deleteBookmarkLabels(label: Label) {
        const bookmarkLabels = await this.labelRepository.findBookmarks(label.labelId);

        const updated: Promise<Bookmark>[] = [];
        for (let i = 0; i < bookmarkLabels.length; i++) {
            updated.push(this.bookmarkRepository.deleteByKeys(bookmarkLabels[i].pk, bookmarkLabels[i].sk));
        }

        await Promise.all(updated);
    }

    async run(): Promise<Response> {
        for (let i = 0; i < this.records.length; i++) {
            const record: StreamEvent = this.records[i];
            if (record.type === StreamEventTypes.MODIFY && record.object.entityType === Label.ENTITY_TYPE) {
                await this.updateBookmarkLabels(record.object as Label);
            }
            if (record.type === StreamEventTypes.REMOVE && record.object.entityType === Label.ENTITY_TYPE) {
                await this.deleteBookmarkLabels(record.object as Label);
            }
        }

        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: {}
        };
    }
}

export const handler = new StreamLambdaHandler().create();