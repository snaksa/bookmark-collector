import { Construct } from "constructs";
import { AttributeType, StreamViewType } from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy, StackProps } from "aws-cdk-lib";
import { EventSourceMapping, StartingPosition } from "aws-cdk-lib/aws-lambda";
import { DynamoDbHelper } from "../../shared/helpers/dynamodbdb-helper";
import { AwsResources } from "../../shared/enums/aws-resources";
import { StreamLambda } from "./lambda/stream-lambda";
import { BaseStack } from "../base.stack";
import { BuildConfig } from "../../shared/services/environment.service";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export class DbStack extends BaseStack {
  constructor(
    scope: Construct,
    id: string,
    buildConfig: BuildConfig,
    props?: StackProps
  ) {
    super(scope, id, buildConfig, props);

    let store;
    if (!buildConfig.dbTableArn) {
      store = DynamoDbHelper.createTable(
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

      store.addGlobalSecondaryIndex({
        indexName: buildConfig.envSpecific(
          AwsResources.DB_STORE_TABLE_REVERSED
        ),
        partitionKey: {
          name: "sk",
          type: AttributeType.STRING,
        },
        sortKey: {
          name: "pk",
          type: AttributeType.STRING,
        },
      });

      store.addGlobalSecondaryIndex({
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
    } else {
      store = this.dbStore;
    }

    const streamLambda = new StreamLambda(
      this,
      buildConfig.envSpecific("DbStoreStream"),
      {
        dbStore: store,
        reversedDbStore: buildConfig.envSpecific(
          AwsResources.DB_STORE_TABLE_REVERSED
        ),
      }
    );

    const policy = new PolicyStatement();
    policy.addActions(
      "dynamodb:DescribeStream",
      "dynamodb:GetRecords",
      "dynamodb:GetShardIterator",
      "dynamodb:ListStreams"
    );
    policy.addResources(
      buildConfig.dbTableStreamArn ?? store.tableStreamArn ?? ""
    );
    streamLambda.addToRolePolicy(policy);

    new EventSourceMapping(
      this,
      buildConfig.envSpecific("DbStoreStreamEventSourceMapping"),
      {
        target: streamLambda,
        startingPosition: StartingPosition.TRIM_HORIZON,
        batchSize: 5,
        bisectBatchOnError: true,
        retryAttempts: 10,
        eventSourceArn: buildConfig.dbTableStreamArn ?? store.tableStreamArn,
      }
    );
  }
}
