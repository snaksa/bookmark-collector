import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import Bookmark from "../../../../shared/models/bookmark.model";
import { BookmarkRepository } from "../../../../shared/repositories/bookmark.repository";
import { ListLambdaInput } from "./list-lambda.input";

class ListLambdaHandler extends BaseHandler<ListLambdaInput> {
  protected isLogged: boolean = true;

  constructor(private readonly bookmarkRepository: BookmarkRepository) {
    super(ListLambdaInput);
  }

  async run(request: ListLambdaInput, userId: string): Promise<Response> {
    const result = await this.bookmarkRepository.findAll(
      userId,
      request.query.favorites === 'true',
      request.query.archived === 'true',
      request.query.excludeArchived === 'true'
    );

    const bookmarks = result.map((bookmark: Bookmark) => bookmark.toObject());

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {
        data: bookmarks.sort((a, b) => {
          return b.createdAt - a.createdAt;
        }),
      },
    };
  }
}

export const handler = new ListLambdaHandler(
  new BookmarkRepository(
    process.env.dbStore ?? '',
    process.env.reversedDbStore ?? '',
    process.env.dbStoreGSI1 ?? '',
  ),
).create();
