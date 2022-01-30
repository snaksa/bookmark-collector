import { Construct } from "constructs";
import { Duration } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Queue } from "aws-cdk-lib/aws-sqs";
import * as path from "path";

interface CreateLambdaProps {
  dbStore: ITable;
  queue: Queue;
}

export class CreateLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: CreateLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./create-lambda.handler.ts"),
      environment: {
        dbStore: props.dbStore.tableName,
        queueUrl: props.queue.queueUrl,
      },
      timeout: Duration.seconds(10), // TODO: remove when moved to SQS
    });

    props.dbStore.grantReadWriteData(this);
    props.queue.grantSendMessages(this);
  }
}
