import { Model } from "./base.model";
import Label from "./label.model";

export default class Bookmark implements Model {
  static ENTITY_TYPE = "bookmark";

  pk: string;
  sk: string;
  GSI1: string;
  entityType: string = Bookmark.ENTITY_TYPE;

  bookmarkId: string;
  isFavorite: boolean;
  isArchived: boolean;
  userId: string;
  bookmarkUrl: string;
  bookmarkTitle: string;
  bookmarkImage: string;
  createdAt: number;

  labels: Label[];

  constructor(
    id: string,
    userId: string,
    bookmarkUrl: string,
    isFavorite = false,
    isArchived = false,
    title = "",
    image = "",
    createdAt = Date.now()
  ) {
    this.pk = `USER#${userId}`;
    this.sk = `BOOKMARK#${createdAt}#${id}`;
    this.GSI1 = `USER#${userId}`;

    this.bookmarkId = id;
    this.userId = userId;
    this.bookmarkUrl = bookmarkUrl;
    this.isFavorite = isFavorite;
    this.isArchived = isArchived;

    this.bookmarkTitle = title;
    this.bookmarkImage = image;

    this.createdAt = createdAt;

    this.labels = [];
  }

  public addLabel(label: Label): void {
    this.labels.push(label);
  }

  public removeLabel(labelId: string): void {
    this.labels = this.labels.filter((label) => label.labelId !== labelId);
  }

  public toObject() {
    return {
      id: this.bookmarkId,
      url: this.bookmarkUrl,
      title: this.bookmarkTitle,
      image: this.bookmarkImage,
      labels: this.labels.map((label: Label) => label.toObject()),
      isFavorite: this.isFavorite,
      isArchived: this.isArchived,
      createdAt: this.createdAt,
    };
  }

  public toDynamoDbObject(removeKeys = false): Partial<Bookmark> {
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
      bookmarkTitle: this.bookmarkTitle,
      bookmarkImage: this.bookmarkImage,
      isFavorite: this.isFavorite,
      isArchived: this.isArchived,
      createdAt: this.createdAt,
      GSI1: this.GSI1,
      entityType: Bookmark.ENTITY_TYPE,
    };
  }

  public static fromDynamoDb(o: Bookmark): Bookmark {
    return new Bookmark(
      o.bookmarkId,
      o.userId,
      o.bookmarkUrl,
      o.isFavorite,
      o.isArchived,
      o.bookmarkTitle,
      o.bookmarkImage,
      o.createdAt
    );
  }
}
