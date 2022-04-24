import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { DynamoDbHelper, LoggerHelper as Logger } from "../helpers";
import { Model } from "../models/base.model";
import PaginatedResult from "../models/pagination.model";

export class QueryBuilder<T extends Model> {
  db: DynamoDbHelper;

  // table to be queried
  tableName = "";

  // index to be queried
  indexName?: string = "";

  // columns to be fetched
  fields?: string[] = [];

  // conditions to be applied
  conditions: Record<string, unknown> = {};

  // filter expression to be applied
  filterExpression: Record<string, unknown> = {};

  // sortKey condition to begin with
  beginsWith: string;

  // sortKey attribute name
  fieldBeginsWith: string;

  // paginated cursor value
  cursor: Record<string, string>;

  // page limit value
  limit: number;

  // sort direction
  sort: boolean = true; // ASC = true, DESC = false

  constructor() {
    this.db = new DynamoDbHelper();
  }

  table(tableName: string): QueryBuilder<T> {
    if (!tableName) {
      throw Error("Table name not specified");
    }

    this.tableName = tableName;

    return this;
  }

  index(indexName: string): QueryBuilder<T> {
    if (!indexName) {
      throw Error("Index name not specified");
    }

    this.indexName = indexName;

    return this;
  }

  select(fields: string[] = []): QueryBuilder<T> {
    if (!fields.length) {
      throw Error("Fields not provided");
    }

    this.fields = fields;

    return this;
  }

  where(conditions: Record<string, unknown>): QueryBuilder<T> {
    if (!Object.entries(conditions).length) {
      throw Error("Conditions not provided");
    }

    this.conditions = conditions;

    return this;
  }

  filter(filterExpression: Record<string, unknown>): QueryBuilder<T> {
    this.filterExpression = filterExpression;

    return this;
  }

  sortKeyBeginsWith(
    beginsWith: string,
    fieldBeginsWith = "sk"
  ): QueryBuilder<T> {
    this.beginsWith = beginsWith;
    this.fieldBeginsWith = fieldBeginsWith;

    return this;
  }

  setCursor(cursor: Record<string, string>): QueryBuilder<T> {
    this.cursor = cursor;;
    return this;
  }

  setLimit(limit: number): QueryBuilder<T> {
    this.limit = limit;
    return this;
  }

  setSort(asc: boolean): QueryBuilder<T> {
    this.sort = asc;
    return this;
  }


  async one(): Promise<T | null> {
    if (!this.tableName) Error("Table name not specified");
    if (!this.conditions) Error("Conditions not specified");

    Logger.info(
      `Fetching ${this.tableName} single record with ${JSON.stringify(
        this.conditions
      )} keys`
    );

    const params = {
      TableName: this.tableName,
      Key: this.conditions,
    };

    const result = await this.db.getItem(params);

    if (result.$response.error) {
      Logger.error(result.$response.error);
      throw Error("Could not get record");
    }

    if (
      !result.$response.data ||
      Object.keys(result.$response.data).length === 0
    ) {
      Logger.error("Could not find record");
      return null;
    }

    return result.$response.data.Item as T;
  }

  async all(): Promise<T[]> {
    if (!this.tableName) Error("Table name not specified");
    if (!this.conditions) Error("Conditions not specified");

    Logger.info(
      `Fetching ${this.tableName} records with ${JSON.stringify(
        this.conditions
      )} keys` + (this.indexName ? ` and index ${this.indexName}` : "")
    );

    const conditionExpression: string[] = [];
    let conditionExpressionAttributes: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(this.conditions)) {
      conditionExpression.push(`${key} = :${key}`);
      conditionExpressionAttributes = {
        [`:${key}`]: value,
        ...conditionExpressionAttributes,
      };
    }

    const filterExpressionConditions: string[] = [];
    if (Object.entries(this.filterExpression).length) {
      for (const [key, value] of Object.entries(this.filterExpression)) {
        console.log("Filter by key and value:", key, value);
        filterExpressionConditions.push(`${key} = :${key}`);
        conditionExpressionAttributes = {
          [`:${key}`]: value,
          ...conditionExpressionAttributes,
        };
      }
    }

    if (this.beginsWith) {
      conditionExpression.push(
        `begins_with(${this.fieldBeginsWith}, :${this.fieldBeginsWith})`
      );
      conditionExpressionAttributes = {
        [`:${this.fieldBeginsWith}`]: this.beginsWith,
        ...conditionExpressionAttributes,
      };
    }

    const params = {
      TableName: this.tableName,
      IndexName: this.indexName ? this.indexName : undefined,
      KeyConditionExpression: conditionExpression.join(" and "),
      ExpressionAttributeValues: conditionExpressionAttributes,
      FilterExpression: filterExpressionConditions.length
        ? filterExpressionConditions.join(" and ")
        : undefined,
    };

    if (this.limit) {
      console.log('set limit: ', this.limit);
      params['Limit'] = this.limit;
    }

    console.log('set sort ASC: ', this.sort);
    params['ScanIndexForward'] = this.sort;

    if (this.cursor) {
      console.log('cursor: ', this.conditions);
      params['ExclusiveStartKey'] = this.cursor;
    }

    const result: T[] = [];
    let dbResult;
    do {
      dbResult = await this.db.getAll(params);
      if (this.limit && result.length + dbResult.Items.length > this.limit) {
        result.push(...dbResult.Items.slice(0, this.limit - result.length));
      } else {
        result.push(...dbResult.Items);
      }
      params['ExclusiveStartKey'] = dbResult.LastEvaluatedKey;
    } while (this.limit && result.length < this.limit && dbResult.LastEvaluatedKey);

    return result;
  }

  async create(item: T): Promise<boolean> {
    if (!this.tableName) Error("Table name not specified");

    Logger.info(
      `Creating ${this.tableName} record with ${JSON.stringify(item)}`
    );

    const params = {
      TableName: this.tableName,
      Item: item.toDynamoDbObject(),
    };

    const result = await this.db.putItem(params);

    if (result.$response.error) {
      Logger.error(result.$response.error);
      throw Error("Could not create record");
    }

    return true;
  }

  async update(item: Partial<T>): Promise<T> {
    if (!this.tableName) Error("Table name not specified");

    Logger.info(
      `Updating ${this.tableName} record with ${JSON.stringify(item)}`
    );

    const updateExpression: string[] = [];
    let updateExpressionAttributes: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(item)) {
      updateExpression.push(`${key} = :${key}`);
      updateExpressionAttributes = {
        [`:${key}`]: value,
        ...updateExpressionAttributes,
      };
    }

    const params = {
      TableName: this.tableName,
      Key: this.conditions,
      UpdateExpression: `set ${updateExpression.join(", ")}`,
      ExpressionAttributeValues: updateExpressionAttributes,
      ReturnValues: "ALL_NEW",
    };

    const result = await this.db.updateItem(params);

    if (result.$response.error) {
      throw Error("Could not update record");
    }

    return result.$response.data as T;
  }

  async delete(): Promise<T> {
    if (!this.tableName) Error("Table name not specified");
    if (!this.conditions) Error("Conditions not specified");

    Logger.info(
      `Deleting ${this.tableName} record with ${JSON.stringify(
        this.conditions
      )} keys`
    );

    const params = {
      TableName: this.tableName ?? "",
      Key: this.conditions,
      ReturnValues: "ALL_OLD",
    };

    const result = await this.db.deleteItem(params);

    if (result.$response.error) {
      Logger.error(result.$response.error);
      throw Error("Could not delete record");
    }

    return result.$response.data as T;
  }
}
