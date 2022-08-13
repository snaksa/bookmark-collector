import { ModelTypesEnum } from "../enums/model-types.enum";

export interface Model {
  entityType: ModelTypesEnum;
  toObject(): Record<string, unknown>;
  toDynamoDbObject(removeKeys?: boolean): Record<string, unknown>;
}
