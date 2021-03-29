import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import { QueryBuilder } from '../../../../shared/services/query-builder';
import Label from '../../../../shared/models/label.model';

class ListLambdaHandler extends BaseHandler {
    private userId: string;

    parseEvent(event: any) {
        this.userId = event.requestContext.authorizer.claims.sub;
    }

    authorize(): boolean {
        return this.userId ? true : false;
    }

    async run(): Promise<Response> {
        const labels: Label[] = await new QueryBuilder<Label>()
            .table(process.env.dbStore ?? '')
            .where({
                pk: `USER#${this.userId}`,
            })
            .skBeginsWith('LABEL#')
            .all();

        const labelObjects = labels.map((label: Label) => {
            return Label.fromDynamoDb(label).toObject();
        });

        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: labelObjects,
        };
    }
}

export const handler = new ListLambdaHandler().create();