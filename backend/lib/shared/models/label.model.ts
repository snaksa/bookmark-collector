import { BaseModel } from "./base.model";

export default class Label implements BaseModel {
    static ENTITY_TYPE: string = 'label';

    pk: string;
    sk: string;
    GSI1: string;
    entityType: string = Label.ENTITY_TYPE;

    labelId: string;
    userId: string;
    title: string;
    color: string;

    constructor(id: string, userId: string, title: string, color: string) {
        this.pk = `USER#${userId}`;
        this.sk = `LABEL#${id}`;

        this.labelId = id;
        this.userId = userId;
        this.title = title;
        this.color = color;
    }

    public toObject() {
        return {
            id: this.labelId,
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