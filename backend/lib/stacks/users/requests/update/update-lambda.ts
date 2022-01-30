import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import * as path from "path";

interface ListLambdaProps {
  dbStore: ITable;
  userIndexByEmail: string;
  cognitoUserPoolId: string;
  cognitoUserPoolArn: string;
}

export class UpdateLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: ListLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./update-lambda.handler.ts"),
      environment: {
        dbStore: props.dbStore.tableName,
        userIndexByEmail: props.userIndexByEmail,
        cognitoUserPoolId: props.cognitoUserPoolId,
      },
    });

    props.dbStore.grantReadWriteData(this);

    this.role?.attachInlinePolicy(
      new Policy(this, "user-pool-update-attributes-policy", {
        statements: [
          new PolicyStatement({
            actions: ["cognito-idp:AdminUpdateUserAttributes"],
            resources: [props.cognitoUserPoolArn],
          }),
        ],
      })
    );
  }
}
