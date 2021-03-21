export interface BaseModel {
    toObject(): object;
    toDynamoDbObject(): object;
}