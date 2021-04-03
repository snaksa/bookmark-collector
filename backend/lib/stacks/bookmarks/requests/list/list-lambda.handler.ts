import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import Bookmark from '../../../../shared/models/bookmark.model';
import { BookmarkRepository } from '../../../../shared/repositories/bookmark.repository';

class ListLambdaHandler extends BaseHandler {
    private bookmarkRepository: BookmarkRepository;

    private userId: string;

    constructor() {
        super();

        this.bookmarkRepository = new BookmarkRepository(process.env.dbStore ?? '', process.env.reversedDbStore ?? '', process.env.dbStoreGSI1 ?? '');
    }

    parseEvent(event: any) {
        this.userId = event.requestContext.authorizer.claims.sub;
    }

    authorize(): boolean {
        return this.userId ? true : false;
    }

    async run(): Promise<Response> {
        const result = await this.bookmarkRepository.findAll(this.userId);
        
        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: result.map((bookmark: Bookmark) => bookmark.toObject()),
        };
    }
}

export const handler = new ListLambdaHandler().create();