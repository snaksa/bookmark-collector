import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { BookmarkRepository } from "../../../../shared/repositories/bookmark.repository";
import Label from "../../../../shared/models/label.model";
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";
import { SingleLambdaInput } from "./single-lambda.input";
import IsLogged from "../../../../shared/decorators/is-logged";

@IsLogged
class SingleLambdaHandler extends BaseHandler<SingleLambdaInput> {
  constructor(private readonly bookmarkRepository: BookmarkRepository) {
    super(SingleLambdaInput);
  }

  async run(request: SingleLambdaInput, userId: string): Promise<Response> {
    const bookmark = await this.bookmarkRepository.findOne(
      request.path.id,
      userId
    );

    if (!bookmark) {
      throw new NotFoundException(
        `Bookmark with ID "${request.path.id}" not found`
      );
    }

    const bookmarkLabels =
      await this.bookmarkRepository.findBookmarkLabelRecords(request.path.id);

    bookmarkLabels.forEach((label) =>
      bookmark.addLabel(
        new Label(label.labelId, userId, label.title)
      )
    );

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {
        data: bookmark.toObject(),
      },
    };
  }
}

export const handler = new SingleLambdaHandler(
  new BookmarkRepository(
    process.env.dbStore ?? '',
    process.env.reversedDbStore ?? '',
  ),
).create();
