import { v4 as uuid_v4 } from "uuid";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { BookmarkRepository } from "../../../../shared/repositories/bookmark.repository";
import BookmarkLabel from "../../../../shared/models/bookmark-label.model";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import Label from "../../../../shared/models/label.model";
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";
import { UpdateLambdaInput } from "./update-lambda.input";

class UpdateLambdaHandler extends BaseHandler<UpdateLambdaInput> {
  protected isLogged: boolean = true;

  constructor(
    private readonly bookmarkRepository: BookmarkRepository,
    private readonly labelRepository: LabelRepository,
  ) {
    super(UpdateLambdaInput);
  }

  async run(input: UpdateLambdaInput, userId: string): Promise<Response> {
    const bookmark = await this.bookmarkRepository.findOne(
      input.query.id,
      userId
    );

    if (!bookmark) {
      throw new NotFoundException(
        `Bookmark with ID "${input.query.id}" not found`
      );
    }

    if (input.body.url) {
      bookmark.bookmarkUrl = input.body.url;
    }

    bookmark.isFavorite = input.body.isFavorite;
    bookmark.isArchived = input.body.isArchived;

    if (input.body.labelIds) {
      const newLabelIds = input.body.labelIds;
      const bookmarkLabels =
        await this.bookmarkRepository.findBookmarkLabelRecords(input.query.id);

      const oldBookmarkLabels = bookmarkLabels.map(
        (bl: BookmarkLabel) => bl.labelId
      );

      const labels = await this.labelRepository.findByIds(
        newLabelIds,
        userId
      );
      const created: Promise<boolean>[] = [];
      labels.forEach((label) => {
        const index = oldBookmarkLabels.indexOf(label.labelId);
        if (index === -1) {
          const bookmarkLabel = new BookmarkLabel(
            label.labelId,
            bookmark.bookmarkId,
            userId,
            label.title,
            label.color,
            bookmark.bookmarkUrl,
            bookmark.isFavorite,
            bookmark.isArchived,
            bookmark.bookmarkTitle,
            bookmark.bookmarkImage,
            bookmark.bookmarkCreatedAt
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

    if (input.body.newLabels) {
      const created: Promise<boolean>[] = [];
      for (let i = 0; i < input.body.newLabels.length; i++) {
        const label = new Label(
          uuid_v4(),
          userId,
          input.body.newLabels[i],
          "grey"
        );

        const success = await this.labelRepository.save(label);

        if (success) {
          const bookmarkLabel = new BookmarkLabel(
            label.labelId,
            bookmark.bookmarkId,
            userId,
            label.title,
            label.color,
            bookmark.bookmarkUrl,
            bookmark.isFavorite,
            bookmark.isArchived,
            bookmark.bookmarkTitle,
            bookmark.bookmarkImage,
            bookmark.bookmarkCreatedAt
          );

          created.push(this.bookmarkRepository.saveLabel(bookmarkLabel));

          bookmark.addLabel(label);
        }
      }

      await Promise.all(created);
    }

    // if labels are not passed include them to the object
    if (!input.body.labelIds) {
      const bookmarkLabels =
        await this.bookmarkRepository.findBookmarkLabelRecords(input.query.id);
      bookmarkLabels.forEach((label) =>
        bookmark.addLabel(
          new Label(label.labelId, userId, label.title, label.color)
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

export const handler = new UpdateLambdaHandler(
  new BookmarkRepository(
    process.env.dbStore ?? '',
    process.env.reversedDbStore ?? '',
  ),
  new LabelRepository(process.env.dbStore ?? '')
).create();
