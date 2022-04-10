import { Model } from "./base.model";
import Bookmark from "./bookmark.model";

export default class Label implements Model {
  static ENTITY_TYPE = "label";

  pk: string;
  sk: string;
  entityType: string = Label.ENTITY_TYPE;

  id: string;
  userId: string;
  title: string;

  bookmarks: Bookmark[] = [];

  constructor(id: string, userId: string, title: string) {
    this.pk = `USER#${userId}`;
    this.sk = `LABEL#${id}`;

    this.id = id;
    this.userId = userId;
    this.title = title;
  }

  public setBookmarks(bookmarks: Bookmark[]): void {
    this.bookmarks = bookmarks;
  }

  public toObject() {
    return {
      id: this.id,
      title: this.title,
      bookmarks: this.bookmarks.map((bookmark) => bookmark.toObject()),
    };
  }

  public toDynamoDbObject(removeKeys = false): Partial<Label> {
    let result = {};

    if (!removeKeys) {
      result = {
        pk: this.pk,
        sk: this.sk,
      };
    }

    return {
      ...result,
      userId: this.userId,
      title: this.title,
      entityType: Label.ENTITY_TYPE,
    };
  }

  public static fromDynamoDb(o: Label): Label {
    const userId = o.pk.split('#')[1];
    const labelId = o.sk.split('#')[1];

    return new Label(labelId, userId, o.title);
  }
}
