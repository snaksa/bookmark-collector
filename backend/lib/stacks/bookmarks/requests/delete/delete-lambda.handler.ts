import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import Bookmark from "../../../../shared/models/bookmark.model";
import { BookmarkRepository } from "../../../../shared/repositories/bookmark.repository";
import { DeleteLambdaInput } from "./delete-lambda.input";
import IsLogged from "../../../../shared/decorators/is-logged";

@IsLogged
class DeleteLambdaHandler extends BaseHandler<DeleteLambdaInput> {
  constructor(private readonly bookmarkRepository: BookmarkRepository) {
    super(DeleteLambdaInput);
  }

  async run(request: DeleteLambdaInput): Promise<Response> {
    const bookmarks = await this.bookmarkRepository.findBookmarkRecords(
      request.path.id
    );

    // TODO: check if the bookmark belongs to the current user
    const deleteBookmarkRecords: Promise<Bookmark>[] = [];
    bookmarks.forEach((bookmark) =>
      deleteBookmarkRecords.push(
        this.bookmarkRepository.deleteByKeys(bookmark.pk, bookmark.sk)
      )
    );

    await Promise.all(deleteBookmarkRecords);

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
