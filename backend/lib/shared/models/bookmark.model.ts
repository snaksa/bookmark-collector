import { BaseModel } from "./base.model";
import Label from "./label.model";

export default class Bookmark implements BaseModel {
    static ENTITY_TYPE: string = 'bookmark';

    pk: string;
    sk: string;
    GSI1: string;
    entityType: string = Bookmark.ENTITY_TYPE;

    bookmarkId: string;
    userId: string;
    bookmarkUrl: string;

    labels: Label[];

    constructor(id: string, userId: string, bookmarkUrl: string) {
        this.pk = `USER#${userId}`;
        this.sk = `BOOKMARK#${id}`;
        this.GSI1 = `USER#${userId}`;

        this.bookmarkId = id;
        this.userId = userId;
        this.bookmarkUrl = bookmarkUrl;

        this.labels = [];
    }

    public addLabel(label: Label) {
        this.labels.push(label);
    }

    public toObject() {
        return {
            id: this.bookmarkId,
            url: this.bookmarkUrl,
            labels: this.labels.map((label: Label) => label.toObject()),
        };
    }

    public toDynamoDbObject(removeKeys: boolean = false): Partial<Bookmark> {
        let result = {};

        if (!removeKeys) {
            result = {
                pk: this.pk,
                sk: this.sk,
            };
        }

        return {
            ...result,
            bookmarkId: this.bookmarkId,
            userId: this.userId,
            bookmarkUrl: this.bookmarkUrl,
            GSI1: this.GSI1,
            entityType: Bookmark.ENTITY_TYPE,
        };
    }

    public static fromDynamoDb(o: Bookmark) {
        return new Bookmark(o.bookmarkId, o.userId, o.bookmarkUrl);
    }
}