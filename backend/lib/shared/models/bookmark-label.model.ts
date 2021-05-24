import { Model } from "./base.model";

export default class BookmarkLabel implements Model {
  static ENTITY_TYPE: string = "bookmarkLabel";

  pk: string;
  sk: string;
  GSI1: string;
  entityType: string = BookmarkLabel.ENTITY_TYPE;

  labelId: string;
  bookmarkId: string;
  userId: string;
  bookmarkUrl: string;
  isFavorite: boolean;
  isArchived: boolean;
  title: string;
  color: string;

  constructor(
    labelId: string,
    bookmarkId: string,
    userId: string,
    title: string = "",
    color: string = "",
    bookmarkUrl: string = "",
    isFavorite: boolean = false,
    isArchived: boolean = false
  ) {
    this.pk = `LABEL#${labelId}`;
    this.sk = `BOOKMARK#${bookmarkId}`;
    this.GSI1 = `USER#${userId}`;

    this.labelId = labelId;
    this.bookmarkId = bookmarkId;
    this.userId = userId;
    this.title = title;
    this.color = color;
    this.bookmarkUrl = bookmarkUrl;
    this.isFavorite = isFavorite;
    this.isArchived = isArchived;
  }

  public toObject() {
    return {
      labelId: this.labelId,
      bookmarkId: this.bookmarkId,
      bookmarkUrl: this.bookmarkUrl,
      title: this.title,
      color: this.color,
    };
  }

  public toDynamoDbObject(removeKeys: boolean = false): Partial<BookmarkLabel> {
    let result = {};

    if (!removeKeys) {
      result = {
        pk: this.pk,
        sk: this.sk,
      };
    }

    return {
      ...result,
      labelId: this.labelId,
      bookmarkId: this.bookmarkId,
      userId: this.userId,
      title: this.title,
      color: this.color,
      bookmarkUrl: this.bookmarkUrl,
      isFavorite: this.isFavorite,
      isArchived: this.isArchived,
      GSI1: this.GSI1,
      entityType: BookmarkLabel.ENTITY_TYPE,
    };
  }

  public static fromDynamoDb(o: BookmarkLabel) {
    return new BookmarkLabel(
      o.labelId,
      o.bookmarkId,
      o.userId,
      o.title,
      o.color,
      o.bookmarkUrl,
      o.isFavorite,
      o.isArchived
    );
  }
}
