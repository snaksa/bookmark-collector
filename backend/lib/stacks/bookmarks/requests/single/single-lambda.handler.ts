import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { BookmarkRepository } from "../../../../shared/repositories/bookmark.repository";
import Label from "../../../../shared/models/label.model";
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";
import { SingleLambdaInput } from "./single-lambda.input";

class SingleLambdaHandler extends BaseHandler<SingleLambdaInput> {
  protected isLogged: boolean = true;

  constructor(private readonly bookmarkRepository: BookmarkRepository) {
    super(SingleLambdaInput);
  }

  async run(input: SingleLambdaInput, userId: string): Promise<Response> {
    const bookmark = await this.bookmarkRepository.findOne(
      input.id,
      userId
    );

    if (!bookmark) {
      throw new NotFoundException(
        `Bookmark with ID "${input.id}" not found`
      );
    }

    const bookmarkLabels =
      await this.bookmarkRepository.findBookmarkLabelRecords(input.id);

    bookmarkLabels.forEach((label) =>
      bookmark.addLabel(
        new Label(label.labelId, userId, label.title, label.color)
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
