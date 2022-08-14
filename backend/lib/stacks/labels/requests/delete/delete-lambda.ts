import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";

interface DeleteLambdaProps {
  dbStore: ITable;
  reversedDbStore: string;
}

export class DeleteLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: DeleteLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./delete-lambda.handler.ts"),
      environment: {
        dbStore: props.dbStore.tableName,
        reversedDbStore: props.reversedDbStore,
      },
    });

    props.dbStore.grantReadWriteData(this);
  }
}
