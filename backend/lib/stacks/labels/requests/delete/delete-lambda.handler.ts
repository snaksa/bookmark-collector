import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import { QueryBuilder } from '../../../../shared/services/query-builder';
import Label from '../../../../shared/models/label.model';
import { LabelService } from '../../../../shared/services/label-service';

class DeleteLambdaHandler extends BaseHandler {
    private labelService: LabelService;

    private userId: string;
    private labelId: string;

    constructor() {
        super();

        this.labelService = new LabelService(process.env.dbStore ?? '');
    }

    parseEvent(event: any) {
        this.userId = event.requestContext.authorizer.claims.sub;
        this.labelId = event.pathParameters.id;
    }

    authorize(): boolean {
        return this.userId ? true : false;
    }

    async run(): Promise<Response> {
        await this.labelService.deleteById(this.labelId, this.userId);
        // TODO: delete attached bookmarks in stream

        return {
            statusCode: ApiGatewayResponseCodes.NO_CONTENT,
            body: {},
        };
    }
}

export const handler = new DeleteLambdaHandler().create();