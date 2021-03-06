import { Construct } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { ITable } from "@aws-cdk/aws-dynamodb";
import * as path from "path";

interface StreamLambdaProps {
  dbStore: ITable;
  reversedDbStore: string;
}

export class StreamLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: StreamLambdaProps) {
    console.log(path.resolve(__dirname, "./stream-lambda.handler.ts"));
    super(scope, id, {
      entry: path.resolve(__dirname, "./stream-lambda.handler.ts"),
      environment: {
        dbStore: props.dbStore.tableName,
        reversedDbStore: props.reversedDbStore,
      },
    });

    props.dbStore.grantReadWriteData(this);
  }
}
