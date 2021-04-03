import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import Bookmark from '../../../../shared/models/bookmark.model';
import { BookmarkRepository } from '../../../../shared/repositories/bookmark.repository';

interface Env {
    dbStore: string,
    reversedDbStore: string,
    dbStoreGSI1: string,
}

class ListLambdaHandler extends BaseHandler {
    private bookmarkRepository: BookmarkRepository;

    private userId: string;

    private env: Env = {
        dbStore: process.env.dbStore ?? '',
        reversedDbStore: process.env.reversedDbStore ?? '',
        dbStoreGSI1: process.env.dbStoreGSI1 ?? '',
    };

    constructor() {
        super();

        this.bookmarkRepository = new BookmarkRepository(this.env.dbStore, this.env.reversedDbStore, this.env.dbStoreGSI1);
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