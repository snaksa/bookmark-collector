import BookmarkLabel from "../../bookmarks/models/bookmark-label.model";
import Label from "../models/label.model";
import { QueryBuilder } from "../../../shared/services/query-builder";

export class LabelRepository {
  constructor(private dbStore: string, private reversedDbStore: string = "") { }

  async save(label: Label): Promise<boolean> {
    return new QueryBuilder<Label>().table(this.dbStore).create(label);
  }

  async deleteById(labelId: string): Promise<Label> {
    return new QueryBuilder<Label>()
      .table(this.dbStore)
      .index(this.reversedDbStore)
      .where({
        sk: `LABEL#${labelId}`,
      })
      .delete();
  }

  async findOne(labelId: string, userId: string): Promise<Label | null> {
    const labels = await new QueryBuilder<Label>()
      .table(this.dbStore)
      .where({
        pk: `USER#${userId}`,
        sk: `LABEL#${labelId}`,
      })
      .all();

    return labels.length ? Label.fromDynamoDb(labels[0]) : null;
  }

  async findAll(userId: string): Promise<Label[]> {
    const labels = await new QueryBuilder<Label>()
      .table(this.dbStore)
      .where({
        pk: `USER#${userId}`,
      })
      .sortKeyBeginsWith("LABEL#")
      .all();

    return labels.map((label: Label) => Label.fromDynamoDb(label));
  }

  async findBookmarks(labelId: string, onlyFavorites = false): Promise<BookmarkLabel[]> {
    const query = new QueryBuilder<BookmarkLabel>()
      .table(this.dbStore)
      .where({
        pk: `LABEL#${labelId}`,
      });

    if (onlyFavorites) {
      query.filter({
        isFavorite: true,
      });
    }

    const records = await query.all();

    return records.map((bookmarkLabel: BookmarkLabel) =>
      BookmarkLabel.fromDynamoDb(bookmarkLabel)
    );
  }

  async updateBookmarks(bookmarkLabel: BookmarkLabel): Promise<BookmarkLabel> {
    const updated = await new QueryBuilder<BookmarkLabel>()
      .table(this.dbStore)
      .where({
        pk: bookmarkLabel.pk,
        sk: bookmarkLabel.sk,
      })
      .update(bookmarkLabel.toDynamoDbObject(true));

    return BookmarkLabel.fromDynamoDb(updated);
  }

  async findByIds(labelIds: string[], userId: string): Promise<Label[]> {
    const labels: Promise<Label | null>[] = [];
    for (let i = 0; i < labelIds.length; i++) {
      labels.push(this.findOne(labelIds[i], userId));
    }

    return (await Promise.all(labels))
      .filter((label): label is Label => label !== null)
      .map((label: Label) => Label.fromDynamoDb(label));
  }
}
