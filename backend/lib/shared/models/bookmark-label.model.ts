import { Model } from "./base.model";

export default class BookmarkLabel implements Model {
  static ENTITY_TYPE = "bookmarkLabel";

  pk: string;
  sk: string;
  GSI1: string;
  entityType: string = BookmarkLabel.ENTITY_TYPE;

  labelId: string;
  bookmarkId: string;
  userId: string;
  bookmarkUrl: string;
  bookmarkTitle: string;
  bookmarkImage: string;
  bookmarkCreatedAt: number;
  isFavorite: boolean;
  isArchived: boolean;
  title: string;

  constructor(
    labelId: string,
    bookmarkId: string,
    userId: string,
    title = "",
    bookmarkUrl = "",
    isFavorite = false,
    isArchived = false,
    bookmarkTitle = "",
    bookmarkImage = "",
    bookmarkCreatedAt = Date.now()
  ) {
    this.pk = `LABEL#${labelId}`;
    this.sk = `BOOKMARK#${bookmarkId}`;
    this.GSI1 = `USER#${userId}`;

    this.labelId = labelId;
    this.bookmarkId = bookmarkId;
    this.userId = userId;
    this.title = title;
    this.bookmarkUrl = bookmarkUrl;
    this.isFavorite = isFavorite;
    this.isArchived = isArchived;
    this.bookmarkTitle = bookmarkTitle;
    this.bookmarkImage = bookmarkImage;
    this.bookmarkCreatedAt = bookmarkCreatedAt;
  }

  public toObject() {
    return {
      labelId: this.labelId,
      bookmarkId: this.bookmarkId,
      bookmarkUrl: this.bookmarkUrl,
      bookmarkTitle: this.bookmarkTitle,
      bookmarkImage: this.bookmarkImage,
      bookmarkCreatedAt: this.bookmarkCreatedAt,
      title: this.title,
    };
  }

  public toDynamoDbObject(removeKeys = false): Partial<BookmarkLabel> {
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
      bookmarkUrl: this.bookmarkUrl,
      bookmarkTitle: this.bookmarkTitle,
      bookmarkImage: this.bookmarkImage,
      bookmarkCreatedAt: this.bookmarkCreatedAt,
      isFavorite: this.isFavorite,
      isArchived: this.isArchived,
      GSI1: this.GSI1,
      entityType: BookmarkLabel.ENTITY_TYPE,
    };
  }

  public static fromDynamoDb(o: BookmarkLabel): BookmarkLabel {
    return new BookmarkLabel(
      o.labelId,
      o.bookmarkId,
      o.userId,
      o.title,
      o.bookmarkUrl,
      o.isFavorite,
      o.isArchived,
      o.bookmarkTitle,
      o.bookmarkImage,
      o.bookmarkCreatedAt
    );
  }
}
