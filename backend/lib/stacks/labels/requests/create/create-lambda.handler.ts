import { v4 as uuid_v4 } from "uuid";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import { GenericException } from "../../../../shared/exceptions/generic-exception";
import { CreateLambdaInput } from "./create-lambda.input";
import Label from "../../../../shared/models/label.model";
import IsLogged from "../../../../shared/decorators/is-logged";

@IsLogged
class CreateLambdaHandler extends BaseHandler<CreateLambdaInput> {
  constructor(private readonly labelRepository: LabelRepository) {
    super(CreateLambdaInput);
  }

  async run(request: CreateLambdaInput, userId: string): Promise<Response> {
    const label = new Label(uuid_v4(), userId, request.body.label);
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
  new LabelRepository(process.env.dbStore || "")
).create();
