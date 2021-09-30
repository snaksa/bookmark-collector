import { Construct } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { ITable } from "@aws-cdk/aws-dynamodb";
import * as path from "path";
import { Policy, PolicyStatement } from "@aws-cdk/aws-iam";

interface RegisterLambdaProps {
  dbStore: ITable;
  userIndexByEmail: string;
  cognitoClientId: string;
  cognitoUserPoolArn: string;
  userPoolId: string;
}

export class RegisterLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: RegisterLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./register-lambda.handler.ts"),
      environment: {
        dbStore: props.dbStore.tableName,
        userIndexByEmail: props.userIndexByEmail,
        cognitoClientId: props.cognitoClientId,
        userPoolId: props.userPoolId,
      },
    });

    props.dbStore.grantReadWriteData(this);

    this.role?.attachInlinePolicy(
      new Policy(this, "user-pool-admin-confirm-signup", {
        statements: [
          new PolicyStatement({
            actions: ["cognito-idp:AdminConfirmSignUp"],
            resources: [props.cognitoUserPoolArn],
          }),
        ],
      })
    );
  }
}
