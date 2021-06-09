import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, {
  RequestEventType,
  Response,
} from "../../../../shared/base-handler";
import { Validator } from "../../../../shared/validators/validator";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";

interface UpdateEventData {
  label: string;
  color: string;
}

interface Env {
  dbStore: string;
}

class UpdateLambdaHandler extends BaseHandler {
  private labelRepository: LabelRepository;

  private input: UpdateEventData;
  private userId: string;
  private labelId: string;

  private env: Env = {
    dbStore: process.env.dbStore ?? "",
  };

  constructor() {
    super();

    this.labelRepository = new LabelRepository(this.env.dbStore);
  }

  parseEvent(event: RequestEventType) {
    this.input = JSON.parse(event.body) as UpdateEventData;
    this.userId = event.requestContext.authorizer.claims.sub;
    this.labelId = event.pathParameters.id;
  }

  validate() {
    return (
      this.input &&
      (Validator.notEmpty(this.input.label) ||
        Validator.notEmpty(this.input.color))
    );
  }

  authorize(): boolean {
    return !!this.userId;
  }

  async run(): Promise<Response> {
    const label = await this.labelRepository.findOne(this.labelId, this.userId);

    if (!label) {
      throw new NotFoundException(`Label with ID "${this.labelId}" not found`);
    }

    if (this.input.label) label.title = this.input.label;
    if (this.input.color) label.color = this.input.color;

    await this.labelRepository.update(label);

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {
        data: label.toObject(),
      },
    };
  }
}

export const handler = new UpdateLambdaHandler().create();
