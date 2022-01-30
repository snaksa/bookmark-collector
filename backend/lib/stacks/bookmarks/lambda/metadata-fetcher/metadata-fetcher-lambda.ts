import { Construct } from "constructs";
import { Duration } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Queue } from "aws-cdk-lib/aws-sqs";
import * as path from "path";

interface MetadataFetcherLambdaProps {
  dbStore: ITable;
  queue: Queue;
}

export class MetadataFetcherLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: MetadataFetcherLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./metadata-fetcher-lambda.handler.ts"),
      environment: {
        dbStore: props.dbStore.tableName,
      },
      timeout: Duration.seconds(120),
    });

    props.dbStore.grantReadWriteData(this);
    this.addEventSource(new SqsEventSource(props.queue));
  }
}
