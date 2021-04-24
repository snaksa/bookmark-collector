import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import { Validator } from '../../../../shared/validators/validator';
import {BookmarkRepository} from "../../../../shared/repositories/bookmark.repository";

interface UpdateEventData {
    url: string;
}

interface Env {
    dbStore: string;
}

class UpdateLambdaHandler extends BaseHandler {
    private bookmarkRepository: BookmarkRepository;

    private input: UpdateEventData;
    private userId: string;
    private bookmarkId: string;

    private env: Env = {
        dbStore: process.env.dbStore ?? '',
    };

    constructor() {
        super();

        this.bookmarkRepository = new BookmarkRepository(this.env.dbStore);
    }

    parseEvent(event: any) {
        this.input = JSON.parse(event.body) as UpdateEventData;
        this.userId = event.requestContext.authorizer.claims.sub;
        this.bookmarkId = event.pathParameters.id;
    }

    validate() {
        return this.input && (Validator.notEmpty(this.input.url));
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

        await this.bookmarkRepository.update(bookmark);

        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: bookmark.toObject(),
        };
    }
}

export const handler = new UpdateLambdaHandler().create();