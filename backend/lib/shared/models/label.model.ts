import { Model } from "./base.model";
import Bookmark from "./bookmark.model";

export default class Label implements Model {
    static ENTITY_TYPE: string = 'label';

    pk: string;
    sk: string;
    GSI1: string;
    entityType: string = Label.ENTITY_TYPE;

    labelId: string;
    userId: string;
    title: string;
    color: string;

    bookmarks: Bookmark[] = [];

    constructor(id: string, userId: string, title: string, color: string) {
        this.pk = `USER#${userId}`;
        this.sk = `LABEL#${id}`;

        this.labelId = id;
        this.userId = userId;
        this.title = title;
        this.color = color;
    }

    public setBookmarks(bookmarks: Bookmark[]) {
        this.bookmarks = bookmarks;
    }

    public toObject(includeBookmarks: boolean = false) {
        const label: any = {
            id: this.labelId,
            title: this.title,
            color: this.color,
        };

        if(includeBookmarks) {
            label.bookmarks = this.bookmarks.map(bookmark => bookmark.toObject());
        }

        return label;
    }

    public toDynamoDbObject(removeKeys: boolean = false): Partial<Label> {
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
            userId: this.userId,
            title: this.title,
            color: this.color,
            entityType: Label.ENTITY_TYPE,
        };
    }

    public static fromDynamoDb(o: Label) {
        return new Label(o.labelId, o.userId, o.title, o.color);
    }
}