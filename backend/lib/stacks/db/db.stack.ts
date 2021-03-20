import { AttributeType } from '@aws-cdk/aws-dynamodb';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { DynamoDbHelper } from '../../shared/helpers/dynamodbdb-helper';
import { AwsResources } from '../../shared/enums/aws-resources';

export default class DbStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dbStore = DynamoDbHelper.createTable(this, AwsResources.DB_STORE_TABLE, {
        partitionKey: {
            name: 'pk',
            type: AttributeType.STRING,
        },
        sortKey: {
            name: 'sk',
            type: AttributeType.STRING
        },
    });

    dbStore.addGlobalSecondaryIndex({
        indexName: AwsResources.DB_STORE_TABLE_REVERSED,
        partitionKey: {
            name: 'sk',
            type: AttributeType.STRING
        },
        sortKey: {
            name: 'pk',
            type: AttributeType.STRING
        },
    });

    dbStore.addGlobalSecondaryIndex({
        indexName: AwsResources.DB_STORE_TABLE_GSI1,
        partitionKey: {
            name: 'GSI1',
            type: AttributeType.STRING
        },
        sortKey: {
            name: 'sk',
            type: AttributeType.STRING
        },
    });
  }
}
