import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import { DeleteLambdaInput } from "./delete-lambda.input";

class DeleteLambdaHandler extends BaseHandler<DeleteLambdaInput> {
  constructor(private readonly labelRepository: LabelRepository) {
    super(DeleteLambdaInput);
  }

  authorize(): boolean {
    return this.userId ? true : false;
  }

  async run(input: DeleteLambdaInput): Promise<Response> {
    await this.labelRepository.deleteById(input.id, this.userId);

    return {
      statusCode: ApiGatewayResponseCodes.NO_CONTENT,
      body: {},
    };
  }
}

export const handler = new DeleteLambdaHandler(
  new LabelRepository(process.env.dbStore ?? ''),
).create();
