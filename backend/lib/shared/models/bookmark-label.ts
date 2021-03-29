import { BaseModel } from "./base-model";

export default class BookmarkLabel implements BaseModel {
    pk: string;
    sk: string;
    labelId: string;
    bookmarkId: string;
    userId: string;
    url: string;
    title: string;
    color: string;
    GSI1: string;
    entityType: string = 'bookmarkLabel';

    constructor(labelId: string, bookmarkId: string, userId: string, title: string = '', color: string = '', url: string = '') {
        this.labelId = labelId;
        this.bookmarkId = bookmarkId;
        this.pk = `LABEL#${labelId}`;
        this.sk = `BOOKMARK#${bookmarkId}`;
        this.userId = userId;
        this.title = title;
        this.color = color;
        this.url = url;
        this.GSI1 = `USER#${this.userId}`
    }

    public toObject() {
        return {
            labelId: this.labelId,
            bookmarkId: this.bookmarkId,
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
            labelId: this.labelId,
            bookmarkId: this.bookmarkId,
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