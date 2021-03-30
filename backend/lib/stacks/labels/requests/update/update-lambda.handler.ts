import { v4 as uuidv4 } from 'uuid';
import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import { Validator } from '../../../../shared/validators/validator';
import { QueryBuilder } from '../../../../shared/services/query-builder';
import Label from '../../../../shared/models/label.model';
import BookmarkLabel from '../../../../shared/models/bookmark-label.model';
import { LabelService } from '../../../../shared/services/label-service';

interface UpdateEventData {
    label: string;
    color: string;
}

class UpdateLambdaHandler extends BaseHandler {
    private labelService: LabelService;

    private input: UpdateEventData;
    private userId: string;
    private labelId: string;

    constructor() {
        super();

        this.labelService = new LabelService(process.env.dbStore ?? '');
    }

    parseEvent(event: any) {
        this.input = JSON.parse(event.body) as UpdateEventData;
        this.userId = event.requestContext.authorizer.claims.sub;
        this.labelId = event.pathParameters.id;
    }

    validate() {
        return this.input && (Validator.notEmpty(this.input.label) || Validator.notEmpty(this.input.color));
    }

    authorize(): boolean {
        return this.userId ? true : false;
    }

    async run(): Promise<Response> {
        const label = await this.labelService.findOne(this.labelId, this.userId);

        if (!label) {
            return {
                statusCode: ApiGatewayResponseCodes.NOT_FOUND,
                body: {},
            };
        }

        if (this.input.label) {
            label.title = this.input.label;
        }
        if (this.input.color) {
            label.color = this.input.color;
        }

        await this.labelService.update(label);

        // TODO: update bookmark labels in stream
        const bookmarkLabels = await this.labelService.findBookmarks(label.labelId);

        const updated: Promise<BookmarkLabel>[] = [];
        for (let i = 0; i < bookmarkLabels.length; i++) {
            const bl = bookmarkLabels[i];

            if (this.input.label) {
                bl.title = this.input.label;
            }
            
            if (this.input.color) {
                bl.color = this.input.color;
            }

            updated.push(this.labelService.updateBookmarks(bl));
        }

        await Promise.all(updated);

        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: label.toObject(),
        };
    }
}

export const handler = new UpdateLambdaHandler().create();