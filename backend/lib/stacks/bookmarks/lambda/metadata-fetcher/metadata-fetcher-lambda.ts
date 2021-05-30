import { Construct, Duration } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { ITable } from "@aws-cdk/aws-dynamodb";
import * as path from "path";
import { SqsEventSource } from "@aws-cdk/aws-lambda-event-sources";
import { Queue } from "@aws-cdk/aws-sqs";

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
