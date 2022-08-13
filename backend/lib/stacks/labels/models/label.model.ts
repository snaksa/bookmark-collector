import { Model } from "../../../shared/models/model";
import { ModelTypesEnum } from "../../../shared/enums/model-types.enum";
import Bookmark from '../../bookmarks/models/bookmark.model';

export default class Label implements Model {
  static ENTITY_TYPE = ModelTypesEnum.LABEL;

  entityType: ModelTypesEnum = Label.ENTITY_TYPE;
  pk: string;
  sk: string;
  bookmarks: Bookmark[];

  constructor(
    public id: string, 
    public userId: string, 
    public title: string, 
    public createdOn: number = Date.now()
    ) {
    this.pk = `USER#${userId}`;
    this.sk = `LABEL#${id}`;
  }

  setBookmarks(list: Bookmark[]) {
    this.bookmarks = list;
  }


  public toObject() {
    return {
      id: this.id,
      title: this.title,
      createdOn: this.createdOn,
      bookmarks: this.bookmarks.map(bookmark => bookmark.toObject())
    };
  }

  public toDynamoDbObject(): Partial<Label> {
    return {
      pk: this.pk,
      sk: this.sk,
      title: this.title,
      createdOn: this.createdOn,
      entityType: Label.ENTITY_TYPE,
    };
  }

  public static fromDynamoDb(o: Label): Label {
    const userId = o.pk.split("#")[1];
    const labelId = o.sk.split("#")[1];

    return new Label(labelId, userId, o.title, o.createdOn);
  }
}
