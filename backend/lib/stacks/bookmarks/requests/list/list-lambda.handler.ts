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
    private favorites: boolean;
    private archived: boolean;
    private excludeArchived: boolean;

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

        this.favorites = false;
        this.archived = false;
        this.excludeArchived = false;

        const queryParams = event.queryStringParameters;
        if(queryParams) {
            this.favorites = queryParams.favorites === '1';
            this.archived = queryParams.archived === '1';
            this.excludeArchived = queryParams.excludeArchived === '1';
        }
    }

    authorize(): boolean {
        return !!this.userId;
    }

    async run(): Promise<Response> {
        const result = await this.bookmarkRepository.findAll(this.userId, this.favorites, this.archived, this.excludeArchived);

        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: result.map((bookmark: Bookmark) => bookmark.toObject()),
        };
    }
}

export const handler = new ListLambdaHandler().create();