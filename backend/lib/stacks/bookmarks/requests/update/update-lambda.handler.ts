import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import { Validator } from '../../../../shared/validators/validator';
import {BookmarkRepository} from "../../../../shared/repositories/bookmark.repository";
import BookmarkLabel from "../../../../shared/models/bookmark-label.model";
import {LabelRepository} from "../../../../shared/repositories/label.repository";

interface UpdateEventData {
    url: string;
    labelIds: string[];
}

interface Env {
    dbStore: string;
    reversedDbStore: string;
}

class UpdateLambdaHandler extends BaseHandler {
    private bookmarkRepository: BookmarkRepository;
    private labelRepository: LabelRepository;

    private input: UpdateEventData;
    private userId: string;
    private bookmarkId: string;

    private env: Env = {
        dbStore: process.env.dbStore ?? '',
        reversedDbStore: process.env.reversedDbStore ?? '',
    };

    constructor() {
        super();

        this.bookmarkRepository = new BookmarkRepository(this.env.dbStore, this.env.reversedDbStore);
        this.labelRepository = new LabelRepository(this.env.dbStore);
    }

    parseEvent(event: any) {
        this.input = JSON.parse(event.body) as UpdateEventData;
        this.userId = event.requestContext.authorizer.claims.sub;
        this.bookmarkId = event.pathParameters.id;
    }

    validate() {
        return this.input && (Validator.notEmpty(this.input.url) || Validator.notNull(this.input.labelIds));
    }

    authorize(): boolean {
        return !!this.userId;
    }

    async run(): Promise<Response> {
        const bookmark = await this.bookmarkRepository.findOne(this.bookmarkId, this.userId);

        if (!bookmark)
            return {
                statusCode: ApiGatewayResponseCodes.NOT_FOUND,
                body: {},
            };

        if (this.input.url)
            bookmark.bookmarkUrl = this.input.url;

        if(this.input.labelIds !== null) {
            const newLabelIds = this.input.labelIds;
            const bookmarkLabels = await this.bookmarkRepository.findBookmarkLabelRecords(this.bookmarkId);
            const oldBookmarkLabels = bookmarkLabels.map((bl: BookmarkLabel) => bl.labelId);

            const labels = await this.labelRepository.findByIds(newLabelIds, this.userId);
            const created: Promise<boolean>[] = [];
            labels.forEach(label => {
              const index = oldBookmarkLabels.indexOf(label.labelId);
                if(index === -1) {
                    const bookmarkLabel = new BookmarkLabel(label.labelId, bookmark.bookmarkId, this.userId, label.title, label.color, bookmark.bookmarkUrl);
                    created.push(this.bookmarkRepository.saveLabel(bookmarkLabel));
                } else {
                    oldBookmarkLabels.splice(index, 1);
                }

                bookmark.addLabel(label);
            });

            const deleted: Promise<BookmarkLabel>[] = [];
            oldBookmarkLabels.forEach((labelId: string) => {
              bookmark.removeLabel(labelId);
              deleted.push(this.bookmarkRepository.removeLabel(bookmark.bookmarkId, labelId));
            });

            await Promise.all(created);
            await Promise.all(deleted);
        }

        await this.bookmarkRepository.update(bookmark);

        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: bookmark.toObject(),
        };
    }
}

export const handler = new UpdateLambdaHandler().create();