import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";

interface ListLambdaProps {
  dbStore: ITable;
  reversedDbStore: string;
}

export class ListLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: ListLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./list-lambda.handler.ts"),
      environment: {
        dbStore: props.dbStore.tableName,
        reversedDbStore: props.reversedDbStore,
      },
    });

    props.dbStore.grantReadData(this);
  }
}
