import { Construct } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { ITable } from "@aws-cdk/aws-dynamodb";
import * as path from "path";

interface ListLambdaProps {
  dbStore: ITable;
  reversedDbStore: string;
}

export class SingleLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: ListLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./single-lambda.handler.ts"),
      environment: {
        dbStore: props.dbStore.tableName,
        reversedDbStore: props.reversedDbStore,
      },
    });

    props.dbStore.grantReadData(this);
  }
}
