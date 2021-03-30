export interface BaseModel {
    toObject(): object;
    toDynamoDbObject(removeKeys?: boolean): object;
}