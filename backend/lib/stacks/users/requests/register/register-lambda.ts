import { Construct } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { ITable } from "@aws-cdk/aws-dynamodb";
import * as path from "path";

interface RegisterLambdaProps {
  dbStore: ITable;
  userIndexByEmail: string;
  cognitoClientId: string;
}

export class RegisterLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: RegisterLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./register-lambda.handler.ts"),
      environment: {
        dbStore: props.dbStore.tableName,
        userIndexByEmail: props.userIndexByEmail,
        cognitoClientId: props.cognitoClientId,
      },
    });

    props.dbStore.grantReadWriteData(this);
  }
}
