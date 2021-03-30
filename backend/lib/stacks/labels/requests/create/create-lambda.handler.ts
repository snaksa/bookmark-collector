import { v4 as uuidv4 } from 'uuid';
import { ApiGatewayResponseCodes } from '../../../../shared/enums/api-gateway-response-codes';
import BaseHandler, { Response } from '../../../../shared/base-handler';
import { Validator } from '../../../../shared/validators/validator';
import Label from '../../../../shared/models/label.model';
import { LabelService } from '../../../../shared/services/label-service';

interface CreateEventData {
    label: string;
    color: string;
}

class CreateLambdaHandler extends BaseHandler {
    private labelService: LabelService;

    private input: CreateEventData;
    private userId: string;

    constructor() {
        super();

        this.labelService = new LabelService(process.env.dbStore ?? '');
    }

    parseEvent(event: any) {
        this.input = JSON.parse(event.body) as CreateEventData;
        this.userId = event.requestContext.authorizer.claims.sub;
    }

    validate() {
        return this.input && Validator.notEmpty(this.input.label) && Validator.notEmpty(this.input.color);
    }

    authorize(): boolean {
        return this.userId ? true : false;
    }

    async run(): Promise<Response> {
        const label = new Label(uuidv4(), this.userId, this.input.label, this.input.color);
        const save = await this.labelService.save(label);

        if(!save) {
            throw new Error('Could not save label');
        }

        return {
            statusCode: ApiGatewayResponseCodes.OK,
            body: label.toObject(),
        };
    }
}

export const handler = new CreateLambdaHandler().create();