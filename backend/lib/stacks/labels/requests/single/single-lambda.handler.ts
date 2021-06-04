import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, {
  RequestEventType,
  Response,
} from "../../../../shared/base-handler";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import Bookmark from "../../../../shared/models/bookmark.model";
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";

interface Env {
  dbStore: string;
}

class SingleLambdaHandler extends BaseHandler {
  private labelRepository: LabelRepository;

  private userId: string;
  private labelId: string;

  private env: Env = {
    dbStore: process.env.dbStore ?? "",
  };

  constructor() {
    super();

    this.labelRepository = new LabelRepository(this.env.dbStore);
  }

  parseEvent(event: RequestEventType) {
    this.userId = event.requestContext.authorizer.claims.sub;
    this.labelId = event.pathParameters.id;
  }

  authorize(): boolean {
    return !!this.userId;
  }

  async run(): Promise<Response> {
    const label = await this.labelRepository.findOne(this.labelId, this.userId);

    if (!label) {
      throw new NotFoundException(`Label with ID "${this.labelId}" not found`);
    }

    const labelBookmarks = await this.labelRepository.findBookmarks(
      this.labelId
    );

    const bookmarks = labelBookmarks.map(
      (labelBookmark) =>
        new Bookmark(
          labelBookmark.bookmarkId,
          this.userId,
          labelBookmark.bookmarkUrl,
          labelBookmark.isFavorite,
          labelBookmark.isArchived,
          labelBookmark.bookmarkTitle,
          labelBookmark.bookmarkImage
        )
    );
    label.setBookmarks(bookmarks);

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: label.toObject(true),
    };
  }
}

export const handler = new SingleLambdaHandler().create();
