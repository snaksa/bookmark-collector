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
      request.query.cursor,
      +request.query.limit,
      request.query.favorites === 'true',
      request.query.archived === 'true',
      request.query.excludeArchived === 'true'
    );

    const getLabels = result.records.map(async (bookmark, index) => {
      const labels = await this.bookmarkRepository.findLabels(bookmark.bookmarkId);
      bookmark.addLabels(labels);
      result.records[index] = bookmark;
    });

    await Promise.all(getLabels);

    const bookmarks = result.records.map((bookmark: Bookmark) => bookmark.toObject());

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {
        cursor: result.cursor,
        data: bookmarks,
      },
    };
  }
}

export const handler = new ListLambdaHandler(
  new BookmarkRepository(
    process.env.dbStore ?? '',
    process.env.reversedDbStore ?? '',
  ),
).create();
