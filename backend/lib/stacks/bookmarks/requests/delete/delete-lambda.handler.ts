import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import { QueryBuilder } from '../../../../shared/services/query-builder';
import Label from '../../../../shared/models/label';
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

        // TODO: foreach the fetched bookmarks and delete by the PK and SK
        // for(let i = 0; i < bookmarks.length; i++) {
            await new QueryBuilder<Bookmark>()
            .table(process.env.dbStore ?? '')
            .where({
                pk: `USER#${this.userId}`,
                sk: `BOOKMARK#${this.bookmarkId}`,
            })
            .delete();
        // }
        

        return {
            statusCode: ApiGatewayResponseCodes.NO_CONTENT,
            body: {},
        };
    }
}

export const handler = new DeleteLambdaHandler().create();