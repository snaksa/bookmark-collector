import { Model } from "../../../shared/models/model";
import { ModelTypesEnum } from "../../../shared/enums/model-types.enum";

export default class User implements Model {
  static ENTITY_TYPE = ModelTypesEnum.USER;

  pk: string;
  sk = "USER";
  entityType = User.ENTITY_TYPE;
  GSI1: string;

  id: string;
  status: number;
  userStatus: number;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;

  constructor(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    status: number
  ) {
    this.pk = `USER#${id}`;
    this.userId = id;
    this.GSI1 = email;
    this.email = email;

    this.id = id;
    this.status = status;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public toObject() {
    return {
      id: this.id,
      email: this.GSI1,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }

  public toDynamoDbObject(removeKeys = false) {
    let result = {};

    if (!removeKeys) {
      result = {
        pk: this.pk,
        sk: this.sk,
      };
    }

    return {
      ...result,
      entityType: User.ENTITY_TYPE,
      GSI1: this.GSI1,
      userStatus: this.status,
      userId: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }

  public static fromDynamoDb(o: User): User {
    return new User(o.userId, o.GSI1, o.firstName, o.lastName, o.userStatus);
  }
}
