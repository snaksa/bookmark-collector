import { DynamoDB } from 'aws-sdk';
import BaseHandler, { Response } from '../../../shared/base-handler';
import { BaseModel } from '../../../shared/models/base.model';
import BookmarkLabel from '../../../shared/models/bookmark-label.model';
import Bookmark from '../../../shared/models/bookmark.model';
import Label from '../../../shared/models/label.model';
import { BookmarkService } from '../../../shared/services/bookmark-service';
import { LabelService } from '../../../shared/services/label-service';

enum EventTypes {
    INSERT = 'INSERT',
    MODIFY = 'MODIFY',
    REMOVE = 'REMOVE'
}

interface StreamEvent {
    type: string;
    object: BaseModel;
}

class StreamLambdaHandler extends BaseHandler {
    private labelService: LabelService;
    private bookmarkService: BookmarkService;

    private records: StreamEvent[] = [];

    constructor() {
        super();

        this.labelService = new LabelService(process.env.dbStore ?? '');
        this.bookmarkService = new BookmarkService(process.env.dbStore ?? '');
    }

    parseEvent(event: any) {
        event.Records.map((record: any) => {
            const e: StreamEvent = {
                type: record.eventName,
                object: this.getObject(record.eventName === EventTypes.REMOVE ? record.dynamodb.OldImage : record.dynamodb.NewImage)
            };

            this.records.push(e);
        })
    }

    getObject(object: any): BaseModel {
        let unmarshalledObject = DynamoDB.Converter.unmarshall(object);
        let result: BaseModel;

        switch (unmarshalledObject.entityType) {
            case Label.ENTITY_TYPE:
                result = Label.fromDynamoDb(unmarshalledObject as Label);
                break;
            case BookmarkLabel.ENTITY_TYPE:
                result = BookmarkLabel.fromDynamoDb(unmarshalledObject as BookmarkLabel);
                break;
            default:
                result = Bookmark.fromDynamoDb(unmarshalledObject as Bookmark)
        }

        return result;

    }

    async updateBookmarkLabels(label: Label) {
        const bookmarkLabels = await this.labelService.findBookmarks(label.labelId);

        const updated: Promise<BookmarkLabel>[] = [];
        for (let i = 0; i < bookmarkLabels.length; i++) {
            const bl = bookmarkLabels[i];
            bl.title = label.title;
            bl.color = label.color;

            updated.push(this.labelService.updateBookmarks(bl));
        }

        await Promise.all(updated);
    }

    async deleteBookmarkLabels(label: Label) {
        const bookmarkLabels = await this.labelService.findBookmarks(label.labelId);

        const updated: Promise<Bookmark>[] = [];
        for (let i = 0; i < bookmarkLabels.length; i++) {
            updated.push(this.bookmarkService.deleteByKeys(bookmarkLabels[i].pk, bookmarkLabels[i].sk));
        }

        await Promise.all(updated);
    }

    async run(): Promise<Response> {
        for(let i = 0; i < this.records.length; i++) {
            const record: StreamEvent = this.records[i];
            if (record.type === EventTypes.MODIFY && record.object.entityType === Label.ENTITY_TYPE) {
                await this.updateBookmarkLabels(record.object as Label);
            }
            if (record.type === EventTypes.REMOVE && record.object.entityType === Label.ENTITY_TYPE) {
                await this.deleteBookmarkLabels(record.object as Label);
            }
        }

        return {
            statusCode: 200,
            body: {}
        };
    }
}

export const handler = new StreamLambdaHandler().create();