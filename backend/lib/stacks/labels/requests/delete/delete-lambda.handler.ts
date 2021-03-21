import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import { QueryBuilder } from '../../../../shared/services/query-builder';
import Label from '../../../../shared/models/label';

class DeleteLambdaHandler extends BaseHandler {
    private userId: string;
    private labelId: string;

    parseEvent(event: any) {
        this.userId = event.requestContext.authorizer.claims.sub;
        this.labelId = event.pathParameters.id;
    }

    authorize(): boolean {
        return this.userId ? true : false;
    }

    async run(): Promise<Response> {
        const label: Label = await new QueryBuilder<Label>()
            .table(process.env.dbStore ?? '')
            .where({
                pk: `USER#${this.userId}`,
                sk: `LABEL#${this.labelId}`,
            })
            .delete();

        return {
            statusCode: ApiGatewayResponseCodes.NO_CONTENT,
            body: {},
        };
    }
}

export const handler = new DeleteLambdaHandler().create();