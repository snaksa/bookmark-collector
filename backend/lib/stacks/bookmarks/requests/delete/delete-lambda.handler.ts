import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import Bookmark from '../../../../shared/models/bookmark.model';
import { BookmarkRepository } from '../../../../shared/repositories/bookmark.repository';

class DeleteLambdaHandler extends BaseHandler {
    private bookmarkRepository: BookmarkRepository;

    private userId: string;
    private bookmarkId: string;

    constructor() {
        super();

        this.bookmarkRepository = new BookmarkRepository(process.env.dbStore ?? '', process.env.reversedDbStore ?? '');
    }

    parseEvent(event: any) {
        this.userId = event.requestContext.authorizer.claims.sub;
        this.bookmarkId = event.pathParameters.id;
    }

    authorize(): boolean {
        return this.userId ? true : false;
    }

    async run(): Promise<Response> {
        let bookmarks = await this.bookmarkRepository.findBookmarkRecords(this.bookmarkId);

        const deleteBookmarkRecords: Promise<Bookmark>[] = [];
        bookmarks.forEach(
            bookmark => deleteBookmarkRecords.push(this.bookmarkRepository.deleteByKeys(bookmark.pk, bookmark.sk))
        );

        await Promise.all(deleteBookmarkRecords);

        return {
            statusCode: ApiGatewayResponseCodes.NO_CONTENT,
            body: {},
        };
    }
}

export const handler = new DeleteLambdaHandler().create();