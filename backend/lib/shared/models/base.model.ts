export interface BaseModel {
    entityType: string;
    toObject(): object;
    toDynamoDbObject(removeKeys?: boolean): object;
}