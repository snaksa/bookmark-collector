export interface Model {
  entityType: string;
  toObject(): Record<string, unknown>;
  toDynamoDbObject(removeKeys?: boolean): Record<string, unknown>;
}
