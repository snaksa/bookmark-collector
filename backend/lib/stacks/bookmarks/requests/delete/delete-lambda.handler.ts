import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { BookmarkRepository } from "../../repositories/bookmark.repository";
import { DeleteLambdaInput } from "./delete-lambda.input";
import IsLogged from "../../../../shared/decorators/is-logged";

@IsLogged
class DeleteLambdaHandler extends BaseHandler<DeleteLambdaInput> {
  constructor(private readonly bookmarkRepository: BookmarkRepository) {
    super(DeleteLambdaInput);
  }

  async run(request: DeleteLambdaInput): Promise<Response> {
    await this.bookmarkRepository.deleteById(request.path.id);

    return {
      statusCode: ApiGatewayResponseCodes.NO_CONTENT,
      body: {},
    };
  }
}

export const handler = new DeleteLambdaHandler(
  new BookmarkRepository(
    process.env.dbStore ?? "",
    process.env.reversedDbStore ?? ""
  )
).create();
