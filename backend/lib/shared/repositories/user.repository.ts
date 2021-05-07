import User from "../models/user.model";
import { QueryBuilder } from "../services/query-builder";
import Label from "../models/label.model";

export class UserRepository {
  constructor(private dbStore: string, private userIndexByEmail: string = "") {}

  async userExists(email: string): Promise<boolean> {
    const result = await new QueryBuilder<User>()
      .table(this.dbStore ?? "")
      .index(this.userIndexByEmail ?? "")
      .where({
        GSI1: email,
      })
      .all();

    return result.length > 0;
  }

  async findOne(userId: string): Promise<User | null> {
    const user = await new QueryBuilder<User>()
      .table(this.dbStore)
      .where({
        pk: `USER#${userId}`,
        sk: "USER",
      })
      .one();

    return user ? User.fromDynamoDb(user) : null;
  }

  async update(user: User): Promise<User> {
    const updated = await new QueryBuilder<User>()
      .table(this.dbStore)
      .where({
        pk: `USER#${user.userId}`,
        sk: "USER",
      })
      .update(user.toDynamoDbObject(true));

    return User.fromDynamoDb(updated);
  }

  async save(user: User): Promise<boolean> {
    return await new QueryBuilder<User>().table(this.dbStore).create(user);
  }
}
