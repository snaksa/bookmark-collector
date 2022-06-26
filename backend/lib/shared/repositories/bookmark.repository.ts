import BookmarkLabel from "../models/bookmark-label.model";
import Bookmark from "../models/bookmark.model";
import Label from "../models/label.model";
import PaginatedResult from "../models/pagination.model";
import { QueryBuilder } from "../services/query-builder";

export class BookmarkRepository {
  constructor(private dbStore: string, private reversedDbStore: string = "") {}

  async save(bookmark: Bookmark): Promise<boolean> {
    return new QueryBuilder<Bookmark>().table(this.dbStore).create(bookmark);
  }

  async saveLabel(bookmarkLabel: BookmarkLabel): Promise<boolean> {
    return await new QueryBuilder<BookmarkLabel>()
      .table(this.dbStore)
      .create(bookmarkLabel);
  }

  async removeLabel(
    bookmarkId: string,
    labelId: string
  ): Promise<BookmarkLabel> {
    return new QueryBuilder<BookmarkLabel>()
      .table(this.dbStore)
      .where({
        pk: `LABEL#${labelId}`,
        sk: `BOOKMARK#${bookmarkId}`,
      })
      .delete();
  }

  async update(bookmark: Bookmark): Promise<Bookmark> {
    const updated = await new QueryBuilder<Bookmark>()
      .table(this.dbStore)
      .where({
        pk: bookmark.pk,
        sk: bookmark.sk,
      })
      .update(bookmark.toDynamoDbObject(true));

    return Bookmark.fromDynamoDb(updated);
  }

  async findOne(bookmarkId: string, userId: string): Promise<Bookmark | null> {
    const bookmark = await new QueryBuilder<Bookmark>()
      .table(this.dbStore)
      .where({
        pk: `USER#${userId}`,
        sk: `BOOKMARK#${bookmarkId}`,
      })
      .one();

    return bookmark ? Bookmark.fromDynamoDb(bookmark) : null;
  }

  async findBookmarkRecords(
    bookmarkId: string
  ): Promise<(Bookmark | BookmarkLabel)[]> {
    const query = new QueryBuilder<Bookmark | BookmarkLabel>()
      .table(this.dbStore)
      .index(this.reversedDbStore)
      .where({
        sk: `BOOKMARK#${bookmarkId}`,
      });

    return await query.all();
  }

  async findBookmarkLabelRecords(bookmarkId: string): Promise<BookmarkLabel[]> {
    const records = await new QueryBuilder<BookmarkLabel>()
      .table(this.dbStore)
      .index(this.reversedDbStore)
      .sortKeyBeginsWith("LABEL#", "pk")
      .where({
        sk: `BOOKMARK#${bookmarkId}`,
      })
      .all();

    return records.map((bookmarkLabel: BookmarkLabel) =>
      BookmarkLabel.fromDynamoDb(bookmarkLabel)
    );
  }

  async findAll(
    userId: string,
    cursor: string,
    limit = 10,
    onlyFavorites = false,
    onlyArchived = false,
    excludeArchived = false
  ): Promise<PaginatedResult<Bookmark>> {
    const query = new QueryBuilder<Bookmark>()
      .table(this.dbStore)
      .where({
        pk: `USER#${userId}`,
      })
      .sortKeyBeginsWith("BOOKMARK")
      .setLimit(limit)
      .setSort(false);

    if (cursor) {
      query.setCursor({
        pk: `USER#${userId}`,
        sk: `BOOKMARK#${cursor}`,
      });
    }
    if (onlyFavorites) {
      console.log("Include only favorites");
      query.filter({
        isFavorite: true,
      });
    }

    if (onlyArchived) {
      console.log("Include only archived");
      query.filter({
        isArchived: true,
      });
    }

    if (excludeArchived) {
      console.log("Exclude archived");
      query.filter({
        isArchived: false,
      });
    }

    const records = await query.all();
    const newCursor = records.length
      ? records[records.length - 1].bookmarkId
      : "";

    const bookmarks = records.map((record: Bookmark) => {
      return new Bookmark(
        record.bookmarkId,
        record.userId,
        record.bookmarkUrl,
        record.isFavorite,
        record.isArchived,
        record.bookmarkTitle,
        record.bookmarkImage,
        record.bookmarkCreatedAt
      );
    });

    return new PaginatedResult(bookmarks, newCursor);
  }

  async findLabels(id: string): Promise<Label[]> {
    const query = new QueryBuilder<BookmarkLabel>()
      .table(this.dbStore)
      .index(this.reversedDbStore)
      .where({
        sk: `BOOKMARK#${id}`,
      })
      .sortKeyBeginsWith("LABEL", "pk");

    const records: BookmarkLabel[] = await query.all();

    const labels = records.map((record: BookmarkLabel) => {
      return new Label(record.labelId, record.userId, record.title);
    });

    return labels;
  }

  async deleteByKeys(pk: string, sk: string): Promise<Bookmark> {
    return new QueryBuilder<Bookmark>()
      .table(this.dbStore)
      .where({
        pk: pk,
        sk: sk,
      })
      .delete();
  }
}
