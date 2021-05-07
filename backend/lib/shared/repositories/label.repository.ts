import BookmarkLabel from "../models/bookmark-label.model";
import Label from "../models/label.model";
import { QueryBuilder } from "../services/query-builder";

export class LabelRepository {
  constructor(private dbStore: string) {}

  async save(label: Label): Promise<boolean> {
    return new QueryBuilder<Label>().table(this.dbStore).create(label);
  }

  async update(label: Label): Promise<Label> {
    const updated = await new QueryBuilder<Label>()
      .table(this.dbStore)
      .where({
        pk: `USER#${label.userId}`,
        sk: `LABEL#${label.labelId}`,
      })
      .update(label.toDynamoDbObject(true));

    return Label.fromDynamoDb(updated);
  }

  async deleteById(labelId: string, userId: string) {
    return new QueryBuilder<Label>()
      .table(this.dbStore)
      .where({
        pk: `USER#${userId}`,
        sk: `LABEL#${labelId}`,
      })
      .delete();
  }

  async findOne(labelId: string, userId: string): Promise<Label | null> {
    const label = await new QueryBuilder<Label>()
      .table(this.dbStore)
      .where({
        pk: `USER#${userId}`,
        sk: `LABEL#${labelId}`,
      })
      .one();

    return label ? Label.fromDynamoDb(label) : null;
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

  async findBookmarks(labelId: string): Promise<BookmarkLabel[]> {
    const result = await new QueryBuilder<BookmarkLabel>()
      .table(this.dbStore)
      .where({
        pk: `LABEL#${labelId}`,
      })
      .all();

    return result.map((bookmarkLabel: BookmarkLabel) =>
      BookmarkLabel.fromDynamoDb(bookmarkLabel)
    );
  }

  async updateBookmarks(bookmarkLabel: BookmarkLabel) {
    const updated = await new QueryBuilder<BookmarkLabel>()
      .table(this.dbStore)
      .where({
        pk: `LABEL#${bookmarkLabel.labelId}`,
        sk: `BOOKMARK#${bookmarkLabel.bookmarkId}`,
      })
      .update(bookmarkLabel.toDynamoDbObject(true));

    return BookmarkLabel.fromDynamoDb(updated);
  }
}
