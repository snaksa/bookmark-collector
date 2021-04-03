import { Model } from "./base.model";


export default class User implements Model {
    static ENTITY_TYPE: string = 'user';

    pk: string;
    sk: string = 'USER';
    entityType: string = 'user';
    GSI1: string;

    id: string;
    status: number;

    constructor(id: string, email: string, status: number) {
        this.pk = `USER#${id}`;
        this.GSI1 = email;

        this.id = id;
        this.status = status;
    }

    public toObject() {
        return {
            pk: this.pk,
            sk: this.sk,
            GSI1: this.GSI1,
            status: this.status,
        };
    }

    public toDynamoDbObject(removeKeys: boolean = false) {
        let result = {};

        if(!removeKeys) {
            result = {
                pk: this.pk,
                sk: this.sk,
            };
        }

        return {
            ...result,
            entityType: User.ENTITY_TYPE,
            GSI1: this.GSI1,
            status: this.status,
        };
    }
}