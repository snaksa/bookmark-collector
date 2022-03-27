import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, {
  Response,
} from "../../../../shared/base-handler";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import Bookmark from "../../../../shared/models/bookmark.model";
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";
import { SingleLambdaInput } from "./single-lambda.input";

class SingleLambdaHandler extends BaseHandler<SingleLambdaInput> {
  protected isLogged: boolean = true;

  constructor(private readonly labelRepository: LabelRepository) {
    super(SingleLambdaInput);
  }

  async run(input: SingleLambdaInput, userId: string): Promise<Response> {
    const label = await this.labelRepository.findOne(input.id, userId);

    if (!label) {
      throw new NotFoundException(`Label with ID "${input.id}" not found`);
    }

    const labelBookmarks = await this.labelRepository.findBookmarks(
      input.id
    );

    const bookmarks = labelBookmarks.map(
      (labelBookmark) =>
        new Bookmark(
          labelBookmark.bookmarkId,
          userId,
          labelBookmark.bookmarkUrl,
          labelBookmark.isFavorite,
          labelBookmark.isArchived,
          labelBookmark.bookmarkTitle,
          labelBookmark.bookmarkImage,
          labelBookmark.bookmarkCreatedAt
        )
    );
    label.setBookmarks(
      bookmarks.sort((a, b) => {
        return b.bookmarkCreatedAt - a.bookmarkCreatedAt;
      })
    );

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {
        data: label.toObject(true),
      },
    };
  }
}

export const handler = new SingleLambdaHandler(
  new LabelRepository(process.env.dbStore ?? "")
).create();
