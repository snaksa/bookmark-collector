import { BaseModel } from "./base-model";

export default class BookmarkLabel implements BaseModel {
    pk: string;
    sk: string;
    userId: string;
    url: string;
    title: string;
    color: string;
    GSI1: string;
    entityType: string = 'bookmarkLabel';

    constructor(pk: string, sk: string, userId: string, title: string = '', color: string = '', url: string = '') {
        this.pk = pk;
        this.sk = sk;
        this.userId = userId;
        this.title = title;
        this.color = color;
        this.url = url;
        this.GSI1 = `USER#${this.userId}`
    }

    public toObject() {
        return {
            url: this.url,
            title: this.title,
            color: this.color,
            entityType: this.entityType,
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
            userId: this.userId,
            title: this.title,
            color: this.color,
            url: this.url,
            GSI1: this.GSI1,
            entityType: this.entityType,
        };
    }

    public static fromDynamoDb(o: BookmarkLabel) {
        return new BookmarkLabel(o.pk, o.sk, o.userId, o.title, o.color, o.url);
    }
}