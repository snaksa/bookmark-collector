import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import Bookmark from '../../../../shared/models/bookmark.model';
import { BookmarkService } from '../../../../shared/services/bookmark-service';

class DeleteLambdaHandler extends BaseHandler {
    private bookmarkService: BookmarkService;

    private userId: string;
    private bookmarkId: string;

    constructor() {
        super();

        this.bookmarkService = new BookmarkService(process.env.dbStore ?? '', process.env.reversedDbStore ?? '');
    }

    parseEvent(event: any) {
        this.userId = event.requestContext.authorizer.claims.sub;
        this.bookmarkId = event.pathParameters.id;
    }

    authorize(): boolean {
        return this.userId ? true : false;
    }

    async run(): Promise<Response> {
        let bookmarks = await this.bookmarkService.findBookmarkRecords(this.bookmarkId);

        // TODO: delete only the main record
        // TODO: delete attached bookmark label records in stream
        const deleteBookmarkRecords: Promise<Bookmark>[] = [];
        for (let i = 0; i < bookmarks.length; i++) {
            deleteBookmarkRecords.push(this.bookmarkService.deleteByKeys(bookmarks[i].pk, bookmarks[i].sk));
        }

        await Promise.all(deleteBookmarkRecords);

        return {
            statusCode: ApiGatewayResponseCodes.NO_CONTENT,
            body: {},
        };
    }
}

export const handler = new DeleteLambdaHandler().create();