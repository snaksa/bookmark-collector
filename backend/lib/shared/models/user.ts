import { BaseModel } from "./base-model";


export default class User implements BaseModel {
    pk: string;
    sk: string = 'USER';
    entityType: string = 'user';
    GSI1: string;
    status: number;

    constructor(id: string, email: string, status: number) {
        this.pk = `USER#${id}`;
        this.GSI1 = email;
        this.status = status;
    }

    public toObject() {
        return {
            pk: this.pk,
            sk: this.sk,
            entityType: this.entityType,
            GSI1: this.GSI1,
            status: this.status,
        };
    }

    public toDynamoDbObject() {
        return {
            // TODO: implement
        };
    }
}