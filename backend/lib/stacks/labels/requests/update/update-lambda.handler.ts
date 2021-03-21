import { v4 as uuidv4 } from 'uuid';
import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import { Validator } from '../../../../shared/validators/validator';
import { QueryBuilder } from '../../../../shared/services/query-builder';
import Label from '../../../../shared/models/label';

interface UpdateEventData {
    label: string;
    color: string;
}

class UpdateLambdaHandler extends BaseHandler {
    private input: UpdateEventData;
    private userId: string;
    private labelId: string;

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
        const result = await new QueryBuilder<Label>()
            .table(process.env.dbStore ?? '')
            .where({
                pk: `USER#${this.userId}`,
                sk: `LABEL#${this.labelId}`
            })
            .one();

        if (!result) {
            return {
                statusCode: ApiGatewayResponseCodes.NOT_FOUND,
                body: {},
            };
        }
        
        const label = Label.fromDynamoDb(result);
        if(this.input.label) {
            label.title = this.input.label;
        }
        if(this.input.color) {
            label.color = this.input.color;
        }

        await new QueryBuilder<Label>()
            .table(process.env.dbStore ?? '')
            .where({
                pk: `USER#${this.userId}`,
                sk: `LABEL#${this.labelId}`
            })
            .update(label.toDynamoDbObject(true));

        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: label.toObject(),
        };
    }
}

export const handler = new UpdateLambdaHandler().create();