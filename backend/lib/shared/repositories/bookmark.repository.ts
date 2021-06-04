import BookmarkLabel from "../models/bookmark-label.model";
import Bookmark from "../models/bookmark.model";
import Label from "../models/label.model";
import { QueryBuilder } from "../services/query-builder";

export class BookmarkRepository {
  constructor(
    private dbStore: string,
    private reversedDbStore: string = "",
    private dbStoreGSI1: string = ""
  ) {}

  async save(bookmark: Bookmark): Promise<boolean> {
    return new QueryBuilder<Bookmark>().table(this.dbStore).create(bookmark);
  }

  async saveLabel(bookmarkLabel: BookmarkLabel): Promise<boolean> {
    return new QueryBuilder<BookmarkLabel>()
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
        pk: `USER#${bookmark.userId}`,
        sk: `BOOKMARK#${bookmark.bookmarkId}`,
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
    const result = await new QueryBuilder<BookmarkLabel>()
      .table(this.dbStore)
      .index(this.reversedDbStore)
      .sortKeyBeginsWith("LABEL#", "pk")
      .where({
        sk: `BOOKMARK#${bookmarkId}`,
      })
      .all();

    return result.map((bookmarkLabel: BookmarkLabel) =>
      BookmarkLabel.fromDynamoDb(bookmarkLabel)
    );
  }

  async findAll(
    userId: string,
    onlyFavorites = false,
    onlyArchived = false,
    excludeArchived = false
  ): Promise<Bookmark[]> {
    const query = new QueryBuilder<BookmarkLabel>()
      .table(this.dbStore)
      .index(this.dbStoreGSI1)
      .where({
        GSI1: `USER#${userId}`,
      });

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

    const records: BookmarkLabel[] = await query.all();

    const bookmarks: { [key: string]: Bookmark } = {};
    records.forEach((record: BookmarkLabel) => {
      if (!(record.bookmarkId in bookmarks)) {
        bookmarks[record.bookmarkId] = new Bookmark(
          record.bookmarkId,
          record.userId,
          record.bookmarkUrl,
          record.isFavorite,
          record.isArchived,
          record.bookmarkTitle,
          record.bookmarkImage
        );
      }

      if (record.entityType === BookmarkLabel.ENTITY_TYPE) {
        const label = new Label(
          record.labelId,
          record.userId,
          record.title,
          record.color
        );
        bookmarks[record.bookmarkId].addLabel(label);
      }
    });

    return Object.values(bookmarks);
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
