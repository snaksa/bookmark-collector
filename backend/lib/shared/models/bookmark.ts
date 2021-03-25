import { BaseModel } from "./base-model";

export default class Bookmark implements BaseModel {
    id: string;
    userId: string;
    url: string;
    GSI1: string;
    entityType: string = 'bookmark';

    constructor(id: string, userId: string, url: string) {
        this.id = id;
        this.userId = userId;
        this.url = url;
        this.GSI1 = `USER#${this.userId}`
    }

    public toObject() {
        return {
            id: this.id,
            url: this.url,
            entityType: this.entityType,
        };
    }

    public toDynamoDbObject(removeKeys: boolean = false): Partial<Bookmark> {
        let result = {};

        if (!removeKeys) {
            result = {
                pk: `USER#${this.userId}`,
                sk: `BOOKMARK#${this.id}`,
            };
        }

        return {
            ...result,
            id: this.id,
            userId: this.userId,
            url: this.url,
            GSI1: this.GSI1,
            entityType: this.entityType,
        };
    }

    public static fromDynamoDb(o: Bookmark) {
        return new Bookmark(o.id, o.userId, o.url);
    }
}