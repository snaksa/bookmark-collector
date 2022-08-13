import { Model } from "../../../shared/models/model";
import { ModelTypesEnum } from "../../../shared/enums/model-types.enum";

export default class BookmarkLabel implements Model {
  static ENTITY_TYPE = ModelTypesEnum.BOOKMARK_LABEL;

  pk: string;
  sk: string;
  entityType: ModelTypesEnum = BookmarkLabel.ENTITY_TYPE;

  constructor(
    public labelId: string,
    public bookmarkId: string,
    public userId: string,
    public labelTitle = "",
    public url = "",
    public isFavorite = false,
    public bookmarkTitle = "",
    public image = "",
    public createdOn = Date.now()
  ) {
    this.pk = `LABEL#${labelId}`;
    this.sk = `BOOKMARK#${bookmarkId}`;
  }

  public toObject() {
    return {
      labelId: this.labelId,
      bookmarkId: this.bookmarkId,
      url: this.url,
      bookmarkTitle: this.bookmarkTitle,
      image: this.image,
      createdOn: this.createdOn,
      labelTitle: this.labelTitle,
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
      userId: this.userId,
      bookmarkTitle: this.bookmarkTitle,
      url: this.url,
      labelTitle: this.labelTitle,
      image: this.image,
      createdOn: this.createdOn,
      isFavorite: this.isFavorite,
      entityType: BookmarkLabel.ENTITY_TYPE,
    };
  }

  public static fromDynamoDb(o: BookmarkLabel): BookmarkLabel {
    return new BookmarkLabel(
      o.labelId,
      o.bookmarkId,
      o.userId,
      o.labelTitle,
      o.url,
      o.isFavorite,
      o.bookmarkTitle,
      o.image,
      o.createdOn
    );
  }
}
