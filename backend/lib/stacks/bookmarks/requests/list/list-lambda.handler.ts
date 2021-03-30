import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import Bookmark from '../../../../shared/models/bookmark.model';
import { BookmarkService } from '../../../../shared/services/bookmark-service';

class ListLambdaHandler extends BaseHandler {
    private bookmarkService: BookmarkService;

    private userId: string;

    constructor() {
        super();

        this.bookmarkService = new BookmarkService(process.env.dbStore ?? '', process.env.reversedDbStore ?? '', process.env.dbStoreGSI1 ?? '');
    }

    parseEvent(event: any) {
        this.userId = event.requestContext.authorizer.claims.sub;
    }

    authorize(): boolean {
        return this.userId ? true : false;
    }

    async run(): Promise<Response> {
        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: (await this.bookmarkService.findAll(this.userId)).map((bookmark: Bookmark) => bookmark.toObject()),
        };
    }
}

export const handler = new ListLambdaHandler().create();