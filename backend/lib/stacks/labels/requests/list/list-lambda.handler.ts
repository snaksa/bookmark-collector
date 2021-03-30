import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import Label from '../../../../shared/models/label.model';
import { LabelService } from '../../../../shared/services/label-service';

class ListLambdaHandler extends BaseHandler {
    private labelService: LabelService;

    private userId: string;

    constructor() {
        super();

        this.labelService = new LabelService(process.env.dbStore ?? '');
    }

    parseEvent(event: any) {
        this.userId = event.requestContext.authorizer.claims.sub;
    }

    authorize(): boolean {
        return this.userId ? true : false;
    }

    async run(): Promise<Response> {
        const labels: Label[] = await this.labelService.findAll(this.userId);

        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: labels.map((label: Label) => Label.fromDynamoDb(label).toObject()),
        };
    }
}

export const handler = new ListLambdaHandler().create();