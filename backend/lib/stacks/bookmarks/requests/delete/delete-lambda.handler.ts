import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import Bookmark from "../../../../shared/models/bookmark.model";
import { BookmarkRepository } from "../../../../shared/repositories/bookmark.repository";

interface Env {
  dbStore: string;
  reversedDbStore: string;
}

class DeleteLambdaHandler extends BaseHandler {
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
    return this.userId ? true : false;
  }

  async run(): Promise<Response> {
    let bookmarks = await this.bookmarkRepository.findBookmarkRecords(
      this.bookmarkId
    );

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

export const handler = new DeleteLambdaHandler().create();
