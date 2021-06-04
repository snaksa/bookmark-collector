import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { PromiseResult } from "aws-sdk/lib/request";
import { AWSError } from "aws-sdk";

export class DynamoDbHelper {
  dynamoDb: DocumentClient;

  constructor() {
    this.dynamoDb = new DocumentClient();
  }

  getAll(
    params: DocumentClient.QueryInput
  ): Promise<PromiseResult<DocumentClient.QueryOutput, AWSError>> {
    return this.dynamoDb.query(params).promise();
  }

  getItem(
    params: DocumentClient.GetItemInput
  ): Promise<PromiseResult<DocumentClient.GetItemOutput, AWSError>> {
    return this.dynamoDb.get(params).promise();
  }

  putItem(
    params: DocumentClient.PutItemInput
  ): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> {
    return this.dynamoDb.put(params).promise();
  }

  updateItem(
    params: DocumentClient.UpdateItemInput
  ): Promise<PromiseResult<DocumentClient.UpdateItemOutput, AWSError>> {
    return this.dynamoDb.update(params).promise();
  }

  deleteItem(
    params: DocumentClient.DeleteItemInput
  ): Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError>> {
    return this.dynamoDb.delete(params).promise();
  }
}
