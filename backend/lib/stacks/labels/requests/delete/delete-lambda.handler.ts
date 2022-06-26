import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import { DeleteLambdaInput } from "./delete-lambda.input";
import IsLogged from "../../../../shared/decorators/is-logged";

@IsLogged
class DeleteLambdaHandler extends BaseHandler<DeleteLambdaInput> {
  constructor(private readonly labelRepository: LabelRepository) {
    super(DeleteLambdaInput);
  }

  async run(request: DeleteLambdaInput, userId: string): Promise<Response> {
    await this.labelRepository.deleteById(request.path.id, userId);

    return {
      statusCode: ApiGatewayResponseCodes.NO_CONTENT,
      body: {},
    };
  }
}

export const handler = new DeleteLambdaHandler(
  new LabelRepository(process.env.dbStore ?? ''),
).create();
