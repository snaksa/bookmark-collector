import { AttributeType, StreamViewType } from "@aws-cdk/aws-dynamodb";
import { Construct, RemovalPolicy, StackProps } from "@aws-cdk/core";
import { DynamoEventSource } from "@aws-cdk/aws-lambda-event-sources";
import { StartingPosition } from "@aws-cdk/aws-lambda";
import { DynamoDbHelper } from "../../shared/helpers/dynamodbdb-helper";
import { AwsResources } from "../../shared/enums/aws-resources";
import { StreamLambda } from "./lambda/stream-lambda";
import { BaseStack } from "../base.stack";
import { BuildConfig } from "../../shared/services/environment.service";

export class DbStack extends BaseStack {
  constructor(
    scope: Construct,
    id: string,
    buildConfig: BuildConfig,
    props?: StackProps
  ) {
    super(scope, id, buildConfig, props);

    const dbStore = DynamoDbHelper.createTable(
      this,
      buildConfig.envSpecific(AwsResources.DB_STORE_TABLE),
      {
        partitionKey: {
          name: "pk",
          type: AttributeType.STRING,
        },
        sortKey: {
          name: "sk",
          type: AttributeType.STRING,
        },
        stream: StreamViewType.NEW_AND_OLD_IMAGES,
        removalPolicy: buildConfig.isProd
          ? RemovalPolicy.RETAIN
          : RemovalPolicy.DESTROY,
      }
    );

    dbStore.addGlobalSecondaryIndex({
      indexName: buildConfig.envSpecific(AwsResources.DB_STORE_TABLE_REVERSED),
      partitionKey: {
        name: "sk",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "pk",
        type: AttributeType.STRING,
      },
    });

    dbStore.addGlobalSecondaryIndex({
      indexName: buildConfig.envSpecific(AwsResources.DB_STORE_TABLE_GSI1),
      partitionKey: {
        name: "GSI1",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: AttributeType.STRING,
      },
    });

    new StreamLambda(this, buildConfig.envSpecific("DbStoreStream"), {
      dbStore: dbStore,
      reversedDbStore: buildConfig.envSpecific(
        AwsResources.DB_STORE_TABLE_REVERSED
      ),
    }).addEventSource(
      new DynamoEventSource(dbStore, {
        startingPosition: StartingPosition.TRIM_HORIZON,
        batchSize: 5,
        bisectBatchOnError: true,
        retryAttempts: 10,
      })
    );
  }
}
