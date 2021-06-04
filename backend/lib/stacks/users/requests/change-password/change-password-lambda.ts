import { Construct } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import * as path from "path";
import { ITable } from "@aws-cdk/aws-dynamodb";
import { Policy, PolicyStatement } from "@aws-cdk/aws-iam";

interface ChangePasswordLambdaProps {
  dbStore: ITable;
  cognitoUserPoolId: string;
  cognitoUserPoolArn: string;
}

export class ChangePasswordLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: ChangePasswordLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./change-password-lambda.handler.ts"),
      environment: {
        dbStore: props.dbStore.tableName,
        userPoolId: props.cognitoUserPoolId,
      },
    });

    props.dbStore.grantReadData(this);

    this.role?.attachInlinePolicy(
      new Policy(this, "user-pool-change-user-password-policy", {
        statements: [
          new PolicyStatement({
            actions: ["cognito-idp:AdminSetUserPassword"],
            resources: [props.cognitoUserPoolArn],
          }),
        ],
      })
    );
  }
}
