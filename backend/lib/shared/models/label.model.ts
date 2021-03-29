import { BaseModel } from "./base.model";

export default class Label implements BaseModel {
    static ENTITY_TYPE: string = 'label';

    pk: string;
    sk: string;
    GSI1: string;
    entityType: string = Label.ENTITY_TYPE;

    id: string;
    userId: string;
    title: string;
    color: string;

    constructor(id: string, userId: string, title: string, color: string) {
        this.pk = `USER#${this.userId}`;
        this.sk = `LABEL#${this.id}`;

        this.id = id;
        this.userId = userId;
        this.title = title;
        this.color = color;
    }

    public toObject() {
        return {
            id: this.id,
            title: this.title,
            color: this.color,
        };
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
            id: this.id,
            userId: this.userId,
            title: this.title,
            color: this.color,
            entityType: Label.ENTITY_TYPE,
        };
    }

    public static fromDynamoDb(o: Label) {
        return new Label(o.id, o.userId, o.title, o.color);
    }
}