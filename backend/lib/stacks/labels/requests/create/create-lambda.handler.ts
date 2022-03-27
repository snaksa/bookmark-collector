import { v4 as uuid_v4 } from "uuid";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, {
  RequestEventType,
  Response,
} from "../../../../shared/base-handler";
import Label from "../../../../shared/models/label.model";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import { GenericException } from "../../../../shared/exceptions/generic-exception";
import { CreateLambdaInput } from "./create-lambda.input";

class CreateLambdaHandler extends BaseHandler<CreateLambdaInput> {
  constructor(private readonly labelRepository: LabelRepository) {
    super(CreateLambdaInput);
  }

  authorize(): boolean {
    return !!this.userId;
  }

  async run(input: CreateLambdaInput): Promise<Response> {
    const label = new Label(
      uuid_v4(),
      this.userId,
      input.label,
      input.color
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

export const handler = new CreateLambdaHandler(
  new LabelRepository(process.env.dbStore || ""),
).create();
