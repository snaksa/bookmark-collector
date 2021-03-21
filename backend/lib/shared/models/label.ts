import { BaseModel } from "./base-model";

export default class Label implements BaseModel {
    id: string;
    userId: string;
    title: string;
    color: string;
    entityType: string = 'label';

    constructor(id: string, userId: string, title: string, color: string) {
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
            entityType: this.entityType,
        };
    }

    public toDynamoDbObject(removeKeys: boolean = false): Partial<Label> {
        let result = {};

        if (!removeKeys) {
            result = {
                pk: `USER#${this.userId}`,
                sk: `LABEL#${this.id}`,
            };
        }

        return {
            ...result,
            id: this.id,
            userId: this.userId,
            title: this.title,
            color: this.color,
            entityType: this.entityType,
        };
    }

    public static fromDynamoDb(o: Label) {
        console.log(o);
        return new Label(o.id, o.userId, o.title, o.color);
    }
}