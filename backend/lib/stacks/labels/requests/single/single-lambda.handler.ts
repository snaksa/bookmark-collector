import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import Bookmark from '../../../bookmarks/models/bookmark.model';
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";
import { SingleLambdaInput } from "./single-lambda.input";
import IsLogged from "../../../../shared/decorators/is-logged";

@IsLogged
class SingleLambdaHandler extends BaseHandler<SingleLambdaInput> {
  constructor(private readonly labelRepository: LabelRepository) {
    super(SingleLambdaInput);
  }

  async run(request: SingleLambdaInput, userId: string): Promise<Response> {
    const label = await this.labelRepository.findOne(request.path.id, userId);

    if (!label) {
      throw new NotFoundException(
        `Label with ID "${request.path.id}" not found`
      );
    }

    const labelBookmarks = await this.labelRepository.findBookmarks(
      request.path.id
    );

    const bookmarks = labelBookmarks.map(
      (labelBookmark) =>
        new Bookmark(
          labelBookmark.bookmarkId,
          userId,
          labelBookmark.url,
          labelBookmark.isFavorite,
          labelBookmark.bookmarkTitle,
          labelBookmark.image,
          labelBookmark.createdOn
        )
    );
    
    label.setBookmarks(
      bookmarks.sort((a, b) => {
        return b.createdOn - a.createdOn;
      })
    );

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {
        data: label.toObject(),
      },
    };
  }
}

export const handler = new SingleLambdaHandler(
  new LabelRepository(process.env.dbStore ?? "")
).create();
