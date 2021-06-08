import { v4 as uuid_v4 } from "uuid";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, {
  RequestEventType,
  Response,
} from "../../../../shared/base-handler";
import { Validator } from "../../../../shared/validators/validator";
import { BookmarkRepository } from "../../../../shared/repositories/bookmark.repository";
import BookmarkLabel from "../../../../shared/models/bookmark-label.model";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import Label from "../../../../shared/models/label.model";
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";

interface UpdateEventData {
  url: string;
  labelIds: string[];
  newLabels: string[];
  isFavorite: boolean;
  isArchived: boolean;
}

interface Env {
  dbStore: string;
  reversedDbStore: string;
}

class UpdateLambdaHandler extends BaseHandler {
  private bookmarkRepository: BookmarkRepository;
  private labelRepository: LabelRepository;

  private input: UpdateEventData;
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
    this.labelRepository = new LabelRepository(this.env.dbStore);
  }

  parseEvent(event: RequestEventType) {
    this.input = JSON.parse(event.body) as UpdateEventData;
    this.userId = event.requestContext.authorizer.claims.sub;
    this.bookmarkId = event.pathParameters.id;
  }

  validate() {
    return (
      this.input &&
      (Validator.notEmpty(this.input.url) ||
        Validator.notNull(this.input.labelIds) ||
        "isFavorite" in this.input ||
        "isArchived" in this.input)
    );
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
      throw new NotFoundException(
        `Bookmark with ID "${this.bookmarkId}" not found`
      );
    }

    if (this.input.url) bookmark.bookmarkUrl = this.input.url;

    if ("isFavorite" in this.input) bookmark.isFavorite = this.input.isFavorite;
    if ("isArchived" in this.input) bookmark.isArchived = this.input.isArchived;

    if (this.input.url) bookmark.bookmarkUrl = this.input.url;

    if (this.input.labelIds) {
      const newLabelIds = this.input.labelIds;
      const bookmarkLabels =
        await this.bookmarkRepository.findBookmarkLabelRecords(this.bookmarkId);

      const oldBookmarkLabels = bookmarkLabels.map(
        (bl: BookmarkLabel) => bl.labelId
      );

      const labels = await this.labelRepository.findByIds(
        newLabelIds,
        this.userId
      );
      const created: Promise<boolean>[] = [];
      labels.forEach((label) => {
        const index = oldBookmarkLabels.indexOf(label.labelId);
        if (index === -1) {
          const bookmarkLabel = new BookmarkLabel(
            label.labelId,
            bookmark.bookmarkId,
            this.userId,
            label.title,
            label.color,
            bookmark.bookmarkUrl,
            bookmark.isFavorite,
            bookmark.isArchived,
            bookmark.bookmarkTitle,
            bookmark.bookmarkImage
          );
          created.push(this.bookmarkRepository.saveLabel(bookmarkLabel));
        } else {
          oldBookmarkLabels.splice(index, 1);
        }

        bookmark.addLabel(label);
      });

      const deleted: Promise<BookmarkLabel>[] = [];
      oldBookmarkLabels.forEach((labelId: string) => {
        bookmark.removeLabel(labelId);
        deleted.push(
          this.bookmarkRepository.removeLabel(bookmark.bookmarkId, labelId)
        );
      });

      await Promise.all(created);
      await Promise.all(deleted);
    }

    await this.bookmarkRepository.update(bookmark);

    if (this.input.newLabels) {
      const created: Promise<boolean>[] = [];
      for (let i = 0; i < this.input.newLabels.length; i++) {
        const label = new Label(
          uuid_v4(),
          this.userId,
          this.input.newLabels[i],
          "grey"
        );

        const success = await this.labelRepository.save(label);

        if (success) {
          const bookmarkLabel = new BookmarkLabel(
            label.labelId,
            bookmark.bookmarkId,
            this.userId,
            label.title,
            label.color,
            bookmark.bookmarkUrl,
            bookmark.isFavorite,
            bookmark.isArchived,
            bookmark.bookmarkTitle,
            bookmark.bookmarkImage
          );

          created.push(this.bookmarkRepository.saveLabel(bookmarkLabel));

          bookmark.addLabel(label);
        }
      }

      await Promise.all(created);
    }

    // if labels are not passed include them to the object
    if (!this.input.labelIds) {
      const bookmarkLabels =
        await this.bookmarkRepository.findBookmarkLabelRecords(this.bookmarkId);
      bookmarkLabels.forEach((label) =>
        bookmark.addLabel(
          new Label(label.labelId, this.userId, label.title, label.color)
        )
      );
    }

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {
        data: bookmark.toObject(),
      },
    };
  }
}

export const handler = new UpdateLambdaHandler().create();
