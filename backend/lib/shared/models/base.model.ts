export interface Model {
    entityType: string;
    toObject(): object;
    toDynamoDbObject(removeKeys?: boolean): object;
}