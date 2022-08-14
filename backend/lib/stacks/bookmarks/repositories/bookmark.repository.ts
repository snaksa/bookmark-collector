import Bookmark from "../models/bookmark.model";
import BookmarkLabel from "../models/bookmark-label.model";
import Label from "../../labels/models/label.model";
import { QueryBuilder } from "../../../shared/services/query-builder";

export class BookmarkRepository {
  constructor(private dbStore: string, private reversedDbStore: string = "") {}

  async save(bookmark: Bookmark): Promise<boolean> {
    return new QueryBuilder<Bookmark>().table(this.dbStore).create(bookmark);
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

  async findAll(
    userId: string,
    onlyFavorites = false,
  ): Promise<Bookmark[]> {
    const query = new QueryBuilder<Bookmark>()
      .table(this.dbStore)
      .where({
        pk: `USER#${userId}`,
      })
      .sortKeyBeginsWith("BOOKMARK")
      .setSort(false);

    if (onlyFavorites) {
      console.log("Include only favorites");
      query.filter({
        isFavorite: true,
      });
    }

    const records = await query.all();
    const bookmarks = records.map((record: Bookmark) => {
      return Bookmark.fromDynamoDb(record);
    });

    return bookmarks;
  }

  async deleteById(id: string): Promise<Bookmark> {
    return new QueryBuilder<Bookmark>()
      .table(this.dbStore)
      .index(this.reversedDbStore)
      .where({
        sk: `BOOKMARK#${id}`,
      })
      .delete();
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
      return new Label(record.labelId, record.userId, record.labelTitle);
    });

    return labels;
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
}
