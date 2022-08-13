import { v4 as uuid_v4 } from "uuid";
import BookmarkLabel from "../../stacks/bookmarks/models/bookmark-label.model";
import Label from "../../stacks/labels/models/label.model";
import { QueryBuilder } from "../services/query-builder";

export class LabelRepository {
  constructor(private dbStore: string) {}

  async save(label: Label): Promise<boolean> {
    return new QueryBuilder<Label>().table(this.dbStore).create(label);
  }

  async deleteById(labelId: string, userId: string): Promise<Label> {
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
    const records = await new QueryBuilder<BookmarkLabel>()
      .table(this.dbStore)
      .where({
        pk: `LABEL#${labelId}`,
      })
      .all();

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
