import { DynamoDbHelper, LoggerHelper as Logger } from "../helpers";
import { BaseModel } from "../models/base.model";

export class QueryBuilder<T extends BaseModel> {
    db: DynamoDbHelper;

    // table to be queried
    tableName: string = '';

    // index to be queried
    indexName?: string = '';

    // columns to be fetched
    fields?: string[] = [];

    // conditions to be applied
    conditions: object = {};

    constructor() {
        this.db = new DynamoDbHelper();
    }

    table(tableName: string): QueryBuilder<T> {
        if (!tableName) {
            throw Error('Table name not specified');
        }

        this.tableName = tableName;

        return this;
    }

    index(indexName: string): QueryBuilder<T> {
        if (!indexName) {
            throw Error('Index name not specified');
        }

        this.indexName = indexName;

        return this;
    }

    select(fields: string[] = []): QueryBuilder<T> {
        if (!fields.length) {
            throw Error('Fields not provided');
        }

        this.fields = fields;

        return this;
    }

    where(conditions: { [index: string]: any; }): QueryBuilder<T> {
        if (!Object.entries(conditions).length) {
            throw Error('Conditions not provided');
        }

        this.conditions = conditions;

        return this;
    }

    beginsWith: string;
    skBeginsWith(str: string): QueryBuilder<T> {
        this.beginsWith = str;

        return this;
    }

    async one(): Promise<T | null> {
        if (!this.tableName) Error('Table name not specified');
        if (!this.conditions) Error('Conditions not specified');

        Logger.info(`Fetching ${this.tableName} single record with ${JSON.stringify(this.conditions)} keys`);

        const params = {
            TableName: this.tableName,
            Key: this.conditions
        };

        const result = await this.db.getItem(params);

        if (result.$response.error) {
            Logger.error(result.$response.error);
            throw Error("Could not get record");
        }

        if (!result.$response.data || Object.keys(result.$response.data).length === 0) {
            Logger.error("Could not find record");
            return null;
        }

        return result.$response.data.Item as T;
    }

    async all(): Promise<T[]> {
        if (!this.tableName) Error('Table name not specified');
        if (!this.conditions) Error('Conditions not specified');

        Logger.info(
            `Fetching ${this.tableName} records with ${JSON.stringify(this.conditions)} keys`
            + (this.indexName ? ` and index ${this.indexName}` : '')
        );

        const conditionExpression: string[] = [];
        let conditionExpressionAttributes: object = {};
        for (const [key, value] of Object.entries(this.conditions)) {
            conditionExpression.push(`${key} = :${key}`);
            conditionExpressionAttributes = { [`:${key}`]: value, ...conditionExpressionAttributes };
        };

        if(this.beginsWith) {
            conditionExpression.push(`begins_with(sk, :sk)`);
            conditionExpressionAttributes = { [`:sk`]: this.beginsWith, ...conditionExpressionAttributes };
        }

        const params = {
            TableName: this.tableName,
            IndexName: this.indexName ? this.indexName : undefined,
            KeyConditionExpression: conditionExpression.join(' and '),
            ExpressionAttributeValues: conditionExpressionAttributes,
        };

        const result = await this.db.getAll(params);

        if (result.$response.error) {
            Logger.error(result.$response.error);
            throw Error("Could not get records");
        }

        return result.Items as T[];
    }

    async create(item: T): Promise<boolean> {
        if (!this.tableName) Error('Table name not specified');

        Logger.info(`Creating ${this.tableName} record with ${JSON.stringify(item)}`);

        const params = {
            TableName: this.tableName,
            Item: item.toDynamoDbObject()
        };

        const result = await this.db.putItem(params);

        if (result.$response.error) {
            Logger.error(result.$response.error);
            throw Error("Could not create record");
        }

        return true;
    }

    async update(item: Partial<T>): Promise<T> {
        if (!this.tableName) Error('Table name not specified');

        Logger.info(`Updating ${this.tableName} record with ${JSON.stringify(item)}`);

        const updateExpression: string[] = [];
        let updateExpressionAttributes: object = {};
        for (const [key, value] of Object.entries(item)) {
            updateExpression.push(`${key} = :${key}`);
            updateExpressionAttributes = { [`:${key}`]: value, ...updateExpressionAttributes };
        }

        let params = {
            TableName: this.tableName,
            Key: this.conditions,
            UpdateExpression: `set ${updateExpression.join(', ')}`,
            ExpressionAttributeValues: updateExpressionAttributes,
            ReturnValues: "ALL_NEW"
        };

        const result = await this.db.updateItem(params);

        if (result.$response.error) {
            throw Error("Could not update record");
        }

        return result.$response.data as T;
    }

    async delete(): Promise<T> {
        if (!this.tableName) Error('Table name not specified');
        if (!this.conditions) Error('Conditions not specified');

        Logger.info(`Deleting ${this.tableName} record with ${JSON.stringify(this.conditions)} keys`);

        const params = {
            TableName: this.tableName ?? '',
            Key: this.conditions,
            ReturnValues: "ALL_OLD"
        };

        const result = await this.db.deleteItem(params);

        if (result.$response.error) {
            Logger.error(result.$response.error);
            throw Error("Could not delete record");
        }

        return result.$response.data as T;
    }
}