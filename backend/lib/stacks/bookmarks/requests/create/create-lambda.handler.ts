import { v4 as uuidv4 } from 'uuid';
import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import { Validator } from '../../../../shared/validators/validator';
import { QueryBuilder } from '../../../../shared/services/query-builder';
import Bookmark from '../../../../shared/models/bookmark';
import Label from '../../../../shared/models/label';
import BookmarkLabel from '../../../../shared/models/bookmark-label';

interface CreateEventData {
    url: string;
    labelIds: string[];
}

class CreateLambdaHandler extends BaseHandler {
    private input: CreateEventData;
    private userId: string;

    parseEvent(event: any) {
        this.input = JSON.parse(event.body) as CreateEventData;
        this.userId = event.requestContext.authorizer.claims.sub;
    }

    validate() {
        return this.input && Validator.notEmpty(this.input.url);
    }

    authorize(): boolean {
        return this.userId ? true : false;
    }

    async run(): Promise<Response> {
        const bookmark = new Bookmark(uuidv4(), this.userId, this.input.url);
        await new QueryBuilder<Bookmark>()
            .table(process.env.dbStore ?? '')
            .create(bookmark);

        if (this.input.labelIds) {
            for (let i = 0; i < this.input.labelIds.length; i++) {
                const label = await new QueryBuilder<Label>()
                    .table(process.env.dbStore ?? '')
                    .where({
                        pk: `USER#${this.userId}`,
                        sk: `LABEL#${this.input.labelIds[i]}`
                    })
                    .one();

                if (label) {
                    const bookmarkLabel = new BookmarkLabel(label.id, bookmark.bookmarkId, this.userId, label.title, label.color, bookmark.bookmarkUrl);
                    
                    // TODO: create the records in parallel
                    await new QueryBuilder<BookmarkLabel>()
                        .table(process.env.dbStore ?? '')
                        .create(bookmarkLabel);
                }
            }
        }

        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: bookmark.toObject(),
        };
    }
}

export const handler = new CreateLambdaHandler().create();