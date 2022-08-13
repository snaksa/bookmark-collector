import { Model } from "../../../shared/models/model";
import { ModelTypesEnum } from "../../../shared/enums/model-types.enum";
import Label from '../../labels/models/label.model';

export default class Bookmark implements Model {
  static ENTITY_TYPE = ModelTypesEnum.BOOKMARK;

  entityType: ModelTypesEnum = Bookmark.ENTITY_TYPE;
  pk: string;
  sk: string;
  
  labels: Label[];

  constructor(
    public id: string,
    public userId: string,
    public url: string,
    public isFavorite = false,
    public title = "",
    public image = "",
    public createdOn = Date.now()
  ) {
    this.pk = `USER#${userId}`;
    this.sk = `BOOKMARK#${id}`;

    this.labels = [];
  }

  public addLabel(label: Label): void {
    this.labels.push(label);
  }

  public addLabels(labels: Label[]): void {
    this.labels = labels;
  }

  public removeLabel(labelId: string): void {
    this.labels = this.labels.filter((label) => label.id !== labelId);
  }

  public toObject() {
    return {
      id: this.id,
      url: this.url,
      title: this.title,
      image: this.image,
      isFavorite: this.isFavorite,
      created: this.createdOn,
      labels: this.labels.map((label: Label) => label.toObject()),
    };
  }

  public toDynamoDbObject(removeKeys: boolean = false): Partial<Bookmark> {
    let result = {};

    if(!removeKeys) {
      result = {
        pk: this.pk,
        sk: this.sk,
      };
    }
    return {
      ...result,
      url: this.url,
      title: this.title,
      image: this.image,
      isFavorite: this.isFavorite,
      createdOn: this.createdOn,
      entityType: Bookmark.ENTITY_TYPE,
    };
  }

  public static fromDynamoDb(o: Bookmark): Bookmark {
    
    const userId = o.pk.split("#")[1];
    const bookmarkId = o.sk.split("#")[1];
    return new Bookmark(
      bookmarkId,
      o.userId,
      o.url,
      o.isFavorite,
      o.title,
      o.image,
      o.createdOn
    );
  }
}
