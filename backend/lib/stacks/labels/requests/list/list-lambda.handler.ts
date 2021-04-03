import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import Label from '../../../../shared/models/label.model';
import { LabelRepository } from '../../../../shared/repositories/label.repository';

class ListLambdaHandler extends BaseHandler {
    private labelRepository: LabelRepository;

    private userId: string;

    constructor() {
        super();

        this.labelRepository = new LabelRepository(process.env.dbStore ?? '');
    }

    parseEvent(event: any) {
        this.userId = event.requestContext.authorizer.claims.sub;
    }

    authorize(): boolean {
        return this.userId ? true : false;
    }

    async run(): Promise<Response> {
        const labels: Label[] = await this.labelRepository.findAll(this.userId);

        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: labels.map((label: Label) => Label.fromDynamoDb(label).toObject()),
        };
    }
}

export const handler = new ListLambdaHandler().create();