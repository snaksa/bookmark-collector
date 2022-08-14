import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import Bookmark from "../../models/bookmark.model";
import { BookmarkRepository } from "../../repositories/bookmark.repository";
import { ListLambdaInput } from "./list-lambda.input";
import IsLogged from "../../../../shared/decorators/is-logged";

@IsLogged
class ListLambdaHandler extends BaseHandler<ListLambdaInput> {
  constructor(private readonly bookmarkRepository: BookmarkRepository) {
    super(ListLambdaInput);
  }

  async run(request: ListLambdaInput, userId: string): Promise<Response> {
    const result = await this.bookmarkRepository.findAll(
      userId,
      request.query.favorites === "true",
    );

    const getLabels = result.map(async (bookmark, index) => {
      const labels = await this.bookmarkRepository.findLabels(
        bookmark.id
      );
      bookmark.addLabels(labels);
      result[index] = bookmark;
    });

    await Promise.all(getLabels);

    const bookmarks = result.map((bookmark: Bookmark) =>
      bookmark.toObject()
    );

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {
        data: bookmarks,
      },
    };
  }
}

export const handler = new ListLambdaHandler(
  new BookmarkRepository(
    process.env.dbStore ?? "",
    process.env.reversedDbStore ?? ""
  )
).create();
