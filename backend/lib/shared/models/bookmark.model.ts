import { Model } from "./base.model";
import Label from "./label.model";

export default class Bookmark implements Model {
  static ENTITY_TYPE: string = "bookmark";

  pk: string;
  sk: string;
  GSI1: string;
  entityType: string = Bookmark.ENTITY_TYPE;

  bookmarkId: string;
  isFavorite: boolean;
  isArchived: boolean;
  userId: string;
  bookmarkUrl: string;

  labels: Label[];

  constructor(
    id: string,
    userId: string,
    bookmarkUrl: string,
    isFavorite: boolean = false,
    isArchived: boolean = false
  ) {
    this.pk = `USER#${userId}`;
    this.sk = `BOOKMARK#${id}`;
    this.GSI1 = `USER#${userId}`;

    this.bookmarkId = id;
    this.userId = userId;
    this.bookmarkUrl = bookmarkUrl;
    this.isFavorite = isFavorite;
    this.isArchived = isArchived;

    this.labels = [];
  }

  public addLabel(label: Label) {
    this.labels.push(label);
  }

  public removeLabel(labelId: string) {
    this.labels = this.labels.filter((label) => label.labelId !== labelId);
  }

  public toObject() {
    return {
      id: this.bookmarkId,
      url: this.bookmarkUrl,
      labels: this.labels.map((label: Label) => label.toObject()),
      isFavorite: this.isFavorite,
      isArchived: this.isArchived,
    };
  }

  public toDynamoDbObject(removeKeys: boolean = false): Partial<Bookmark> {
    let result = {};

    if (!removeKeys) {
      result = {
        pk: this.pk,
        sk: this.sk,
      };
    }

    return {
      ...result,
      bookmarkId: this.bookmarkId,
      userId: this.userId,
      bookmarkUrl: this.bookmarkUrl,
      isFavorite: this.isFavorite,
      isArchived: this.isArchived,
      GSI1: this.GSI1,
      entityType: Bookmark.ENTITY_TYPE,
    };
  }

  public static fromDynamoDb(o: Bookmark) {
    return new Bookmark(
      o.bookmarkId,
      o.userId,
      o.bookmarkUrl,
      o.isFavorite,
      o.isArchived
    );
  }
}
