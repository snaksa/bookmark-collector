import { v4 as uuid_v4 } from "uuid";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { BookmarkRepository } from "../../../../shared/repositories/bookmark.repository";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import Label from "../../../labels/models/label.model";
import BookmarkLabel from "../../../bookmarks/models/bookmark-label.model";
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";
import { UpdateLambdaInput } from "./update-lambda.input";
import IsLogged from "../../../../shared/decorators/is-logged";

@IsLogged
class UpdateLambdaHandler extends BaseHandler<UpdateLambdaInput> {
  constructor(
    private readonly bookmarkRepository: BookmarkRepository,
    private readonly labelRepository: LabelRepository
  ) {
    super(UpdateLambdaInput);
  }

  async run(request: UpdateLambdaInput, userId: string): Promise<Response> {
    const bookmark = await this.bookmarkRepository.findOne(
      request.path.id,
      userId
    );

    if (!bookmark) {
      throw new NotFoundException(
        `Bookmark with ID "${request.path.id}" not found`
      );
    }

    if ("isFavorite" in request.body) {
      bookmark.isFavorite = request.body.isFavorite;
    }

    if (request.body.labelIds) {
      const newLabelIds = request.body.labelIds;
      const bookmarkLabels =
        await this.bookmarkRepository.findBookmarkLabelRecords(request.path.id);

      const oldBookmarkLabels = bookmarkLabels.map(
        (bl: BookmarkLabel) => bl.labelId
      );

      const labels = await this.labelRepository.findByIds(newLabelIds, userId);

      const created: Promise<boolean>[] = [];
      labels.forEach((label) => {
        const index = oldBookmarkLabels.indexOf(label.id);
        if (index === -1) {
          const bookmarkLabel = new BookmarkLabel(
            label.id,
            bookmark.id,
            userId,
            label.title,
            bookmark.url,
            bookmark.isFavorite,
            bookmark.title,
            bookmark.image,
            bookmark.createdOn
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
          this.bookmarkRepository.removeLabel(bookmark.id, labelId)
        );
      });

      await Promise.all(created);
      await Promise.all(deleted);
    }

    await this.bookmarkRepository.update(bookmark);

    if (request.body.newLabels) {
      const created: Promise<boolean>[] = [];
      for (let i = 0; i < request.body.newLabels.length; i++) {
        const label = new Label(uuid_v4(), userId, request.body.newLabels[i]);

        const success = await this.labelRepository.save(label);

        if (success) {
          const bookmarkLabel = new BookmarkLabel(
            label.id,
            bookmark.id,
            userId,
            label.title,
            bookmark.url,
            bookmark.isFavorite,
            bookmark.title,
            bookmark.image,
            bookmark.createdOn
          );

          created.push(this.bookmarkRepository.saveLabel(bookmarkLabel));

          bookmark.addLabel(label);
        }
      }

      await Promise.all(created);
    }

    const bookmarkLabels =
      await this.bookmarkRepository.findBookmarkLabelRecords(request.path.id);
    bookmarkLabels.forEach((bookmarkLabel) =>
      bookmark.addLabel(new Label(bookmarkLabel.labelId, userId, bookmarkLabel.labelTitle))
    );

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
    process.env.dbStore ?? "",
    process.env.reversedDbStore ?? ""
  ),
  new LabelRepository(process.env.dbStore ?? "")
).create();
