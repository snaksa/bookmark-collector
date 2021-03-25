import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import { QueryBuilder } from '../../../../shared/services/query-builder';
import Bookmark from '../../../../shared/models/bookmark';

class DeleteLambdaHandler extends BaseHandler {
    private userId: string;
    private bookmarkId: string;

    parseEvent(event: any) {
        this.userId = event.requestContext.authorizer.claims.sub;
        this.bookmarkId = event.pathParameters.id;
    }

    authorize(): boolean {
        return this.userId ? true : false;
    }

    async run(): Promise<Response> {
        let bookmarks: Bookmark[] = await new QueryBuilder<Bookmark>()
        .table(process.env.dbStore ?? '')
        .index(process.env.reversedDbStore ?? '')
        .where({
            sk: `BOOKMARK#${this.bookmarkId}`,
        })
        .all();

        bookmarks = bookmarks.map((bookmark: Bookmark) => Bookmark.fromDynamoDb(bookmark));

        for(let i = 0; i < bookmarks.length; i++) {
            // TODO: delete in parallel
            await new QueryBuilder<Bookmark>()
            .table(process.env.dbStore ?? '')
            .where({
                pk: bookmarks[i].pk,
                sk: bookmarks[i].sk,
            })
            .delete();
        }

        return {
            statusCode: ApiGatewayResponseCodes.NO_CONTENT,
            body: {},
        };
    }
}

export const handler = new DeleteLambdaHandler().create();