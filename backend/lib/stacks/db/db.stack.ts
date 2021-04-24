import { AttributeType, StreamViewType } from '@aws-cdk/aws-dynamodb';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { DynamoEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { StartingPosition } from '@aws-cdk/aws-lambda';
import { DynamoDbHelper } from '../../shared/helpers/dynamodbdb-helper';
import { AwsResources } from '../../shared/enums/aws-resources';
import { StreamLambda } from './lambda/stream-lambda';
import { BaseStack } from '../base.stack';

export default class DbStack extends BaseStack {
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
            stream: StreamViewType.NEW_AND_OLD_IMAGES,
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

        new StreamLambda(this, 'DbStoreStream', { dbStore: dbStore, reversedDbStore: AwsResources.DB_STORE_TABLE_REVERSED })
            .addEventSource(new DynamoEventSource(
                dbStore,
                {
                    startingPosition: StartingPosition.TRIM_HORIZON,
                    batchSize: 5,
                    bisectBatchOnError: true,
                    retryAttempts: 10,
                }
            ));
    }
}
