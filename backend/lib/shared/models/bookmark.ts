import { BaseModel } from "./base-model";
import Label from "./label";

export default class Bookmark implements BaseModel {
    pk: string;
    sk: string;
    bookmarkId: string;
    userId: string;
    url: string;
    GSI1: string;
    entityType: string = 'bookmark';
    labels: Label[];

    constructor(id: string, userId: string, url: string, pk: string = '', sk: string = '') {
        this.pk = pk;
        this.sk = sk;
        this.bookmarkId = id;
        this.userId = userId;
        this.url = url;
        this.GSI1 = `USER#${this.userId}`;
        this.labels = [];
    }

    public addLabel(label: Label) {
        this.labels.push(label);
    }

    public toObject() {
        return {
            id: this.bookmarkId,
            url: this.url,
            entityType: this.entityType,
            labels: this.labels.map((label: Label) => label.toObject()),
        };
    }

    public toDynamoDbObject(removeKeys: boolean = false): Partial<Bookmark> {
        let result = {};

        if (!removeKeys) {
            result = {
                pk: `USER#${this.userId}`,
                sk: `BOOKMARK#${this.bookmarkId}`,
            };
        }

        return {
            ...result,
            bookmarkId: this.bookmarkId,
            userId: this.userId,
            url: this.url,
            GSI1: this.GSI1,
            entityType: this.entityType,
        };
    }

    public static fromDynamoDb(o: Bookmark) {
        return new Bookmark(o.bookmarkId, o.userId, o.url, o.pk, o.sk);
    }
}