import { v4 as uuid_v4 } from "uuid";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, {
  RequestEventType,
  Response,
} from "../../../../shared/base-handler";
import { Validator } from "../../../../shared/validators/validator";
import Label from "../../../../shared/models/label.model";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import { GenericException } from "../../../../shared/exceptions/generic-exception";

interface CreateEventData {
  label: string;
  color: string;
}

interface Env {
  dbStore: string;
}

class CreateLambdaHandler extends BaseHandler {
  private labelRepository: LabelRepository;

  private input: CreateEventData;
  private userId: string;

  private env: Env = {
    dbStore: process.env.dbStore ?? "",
  };

  constructor() {
    super();

    this.labelRepository = new LabelRepository(this.env.dbStore);
  }

  parseEvent(event: RequestEventType) {
    this.input = JSON.parse(event.body) as CreateEventData;
    this.userId = event.requestContext.authorizer.claims.sub;
  }

  validate() {
    return (
      this.input &&
      Validator.notEmpty(this.input.label) &&
      Validator.notEmpty(this.input.color)
    );
  }

  authorize(): boolean {
    return !!this.userId;
  }

  async run(): Promise<Response> {
    const label = new Label(
      uuid_v4(),
      this.userId,
      this.input.label,
      this.input.color
    );
    const save = await this.labelRepository.save(label);

    if (!save) {
      throw new GenericException();
    }

    return {
      statusCode: ApiGatewayResponseCodes.CREATED,
      body: {
        data: label.toObject(),
      },
    };
  }
}

export const handler = new CreateLambdaHandler().create();
