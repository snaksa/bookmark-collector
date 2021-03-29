import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import { QueryBuilder } from '../../../../shared/services/query-builder';
import Label from '../../../../shared/models/label.model';
import Bookmark from '../../../../shared/models/bookmark.model';
import BookmarkLabel from '../../../../shared/models/bookmark-label.model';

class ListLambdaHandler extends BaseHandler {
    private userId: string;

    parseEvent(event: any) {
        this.userId = event.requestContext.authorizer.claims.sub;
    }

    authorize(): boolean {
        return this.userId ? true : false;
    }

    async run(): Promise<Response> {
        const records: BookmarkLabel[] = await new QueryBuilder<BookmarkLabel>()
            .table(process.env.dbStore ?? '')
            .index(process.env.dbStoreGSI1 ?? '')
            .where({
                GSI1: `USER#${this.userId}`,
            })
            .all();

        let bookmarks: {[key: string]: Bookmark} = {};

        records.forEach((record: BookmarkLabel) => {
            if(!(record.bookmarkId in bookmarks)) {
                bookmarks[record.bookmarkId] = new Bookmark(record.bookmarkId, record.userId, record.bookmarkUrl);
            }

            if(record.entityType === 'bookmark') {
                bookmarks[record.bookmarkId].bookmarkId = record.bookmarkId;
                bookmarks[record.bookmarkId].userId = record.userId;
                bookmarks[record.bookmarkId].bookmarkUrl = record.bookmarkUrl;
            }

            if(record.entityType === 'bookmarkLabel') {
                const l = new Label(record.labelId, record.userId, record.title, record.color);
                bookmarks[record.bookmarkId].addLabel(l);
            }

        });

        const result = [];
        for (let [key, value] of Object.entries(bookmarks)) {
            result.push(value.toObject());
        }

        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: result,
        };
    }
}

export const handler = new ListLambdaHandler().create();