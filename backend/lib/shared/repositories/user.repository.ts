import User from "../models/user.model";
import { QueryBuilder } from "../services/query-builder";

export class UserRepository {
    constructor(private dbStore: string, private userIndexByEmail: string = '') { }

    async userExists(email: string): Promise<boolean> {
        const result = await new QueryBuilder<User>()
            .table(this.dbStore ?? '')
            .index(this.userIndexByEmail ?? '')
            .where({
                GSI1: email
            })
            .all();

        return result.length > 0;
    }

    async save(user: User): Promise<boolean> {
        return await new QueryBuilder<User>()
            .table(this.dbStore)
            .create(user);
    }
}