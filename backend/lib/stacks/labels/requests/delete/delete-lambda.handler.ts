import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { LabelRepository } from "../../repositories/label.repository";
import { DeleteLambdaInput } from "./delete-lambda.input";
import IsLogged from "../../../../shared/decorators/is-logged";
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";

@IsLogged
class DeleteLambdaHandler extends BaseHandler<DeleteLambdaInput> {
  constructor(private readonly labelRepository: LabelRepository) {
    super(DeleteLambdaInput);
  }

  async run(request: DeleteLambdaInput, userId: string): Promise<Response> {
    const label = await this.labelRepository.findOne(request.path.id, userId);
    if(!label) {
      throw new NotFoundException(
        `Label with ID "${request.path.id}" not found`
      );
    }

    await this.labelRepository.deleteById(request.path.id);

    return {
      statusCode: ApiGatewayResponseCodes.NO_CONTENT,
      body: {},
    };
  }
}

export const handler = new DeleteLambdaHandler(
  new LabelRepository(
    process.env.dbStore ?? "",
    process.env.reversedDbStore ?? ""
  )
).create();
