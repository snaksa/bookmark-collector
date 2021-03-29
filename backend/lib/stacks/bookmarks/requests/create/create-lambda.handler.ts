import { v4 as uuidv4 } from 'uuid';
import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import { Validator } from '../../../../shared/validators/validator';
import Bookmark from '../../../../shared/models/bookmark.model';
import BookmarkLabel from '../../../../shared/models/bookmark-label.model';
import { BookmarkService } from '../../../../shared/services/bookmark-service';
import { LabelService } from '../../../../shared/services/label-service';

interface CreateEventData {
    url: string;
    labelIds: string[];
}

class CreateLambdaHandler extends BaseHandler {
    bookmarkService: BookmarkService;
    labelService: LabelService;

    private input: CreateEventData;
    private userId: string;

    constructor() {
        super();

        this.bookmarkService = new BookmarkService(process.env.dbStore ?? '');
        this.labelService = new LabelService(process.env.dbStore ?? '');
    }

    parseEvent(event: any) {
        this.input = JSON.parse(event.body) as CreateEventData;
        this.userId = event.requestContext.authorizer.claims.sub;
    }

    validate() {
        return this.input && Validator.notEmpty(this.input.url);
    }

    authorize(): boolean {
        return this.userId ? true : false;
    }

    async run(): Promise<Response> {
        const bookmark = new Bookmark(uuidv4(), this.userId, this.input.url);
        const save = await this.bookmarkService.save(bookmark);

        if (!save) {
            throw new Error('Could not save bookmark');
        }

        if (this.input.labelIds) {
            const labels = await this.labelService.findByIds(this.input.labelIds, this.userId);

            const bookmarkLabels: Promise<boolean>[] = [];
            for (let i = 0; i < labels.length; i++) {
                const label = labels[i];
                const bookmarkLabel = new BookmarkLabel(label.labelId, bookmark.bookmarkId, this.userId, label.title, label.color, bookmark.bookmarkUrl);
                bookmarkLabels.push(this.bookmarkService.saveLabel(bookmarkLabel));
            }

            await Promise.all(bookmarkLabels);
        }

        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: bookmark.toObject(),
        };
    }
}

export const handler = new CreateLambdaHandler().create();