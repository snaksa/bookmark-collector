import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";

interface RegisterLambdaProps {
  dbStore: ITable;
  reversedDbStore: string;
  cognitoClientId: string;
}

export class RegisterLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: RegisterLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./register-lambda.handler.ts"),
      environment: {
        dbStore: props.dbStore.tableName,
        reversedDbStore: props.reversedDbStore,
        cognitoClientId: props.cognitoClientId,
      },
    });

    props.dbStore.grantReadWriteData(this);

    this.role?.attachInlinePolicy(
      new Policy(this, "register-user-send-email-ses", {
        statements: [
          new PolicyStatement({
            actions: ["ses:SendEmail", "ses:SendRawEmail"],
            resources: ["*"],
          }),
        ],
      })
    );
  }
}
