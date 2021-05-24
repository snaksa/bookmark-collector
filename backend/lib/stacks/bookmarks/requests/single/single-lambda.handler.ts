import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import Bookmark from "../../../../shared/models/bookmark.model";
import { BookmarkRepository } from "../../../../shared/repositories/bookmark.repository";
import Label from "../../../../shared/models/label.model";

interface Env {
  dbStore: string;
  reversedDbStore: string;
}

class SingleLambdaHandler extends BaseHandler {
  private bookmarkRepository: BookmarkRepository;
  private userId: string;
  private bookmarkId: string;

  private env: Env = {
    dbStore: process.env.dbStore ?? "",
    reversedDbStore: process.env.reversedDbStore ?? "",
  };

  constructor() {
    super();

    this.bookmarkRepository = new BookmarkRepository(
      this.env.dbStore,
      this.env.reversedDbStore
    );
  }

  parseEvent(event: any) {
    this.userId = event.requestContext.authorizer.claims.sub;
    this.bookmarkId = event.pathParameters.id;
  }

  authorize(): boolean {
    return !!this.userId;
  }

  async run(): Promise<Response> {
    const bookmark = await this.bookmarkRepository.findOne(
      this.bookmarkId,
      this.userId
    );

    if (!bookmark) {
      return {
        statusCode: ApiGatewayResponseCodes.NOT_FOUND,
        body: {},
      };
    }

    const bookmarkLabels =
      await this.bookmarkRepository.findBookmarkLabelRecords(this.bookmarkId);

    bookmarkLabels.forEach((label) =>
      bookmark.addLabel(
        new Label(label.labelId, this.userId, label.title, label.color)
      )
    );

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: bookmark.toObject(),
    };
  }
}

export const handler = new SingleLambdaHandler().create();
