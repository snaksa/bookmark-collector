import { Construct } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { Policy, PolicyStatement } from "@aws-cdk/aws-iam";
import * as path from "path";

export class ChangePasswordLambda extends NodejsFunction {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./change-password-lambda.handler.ts"),
      environment: {},
    });

    // this.role?.attachInlinePolicy(
    //   new Policy(this, "user-pool-update-attributes-policy", {
    //     statements: [
    //       new PolicyStatement({
    //         actions: ["cognito-idp:AdminUpdateUserAttributes"],
    //         resources: [props.cognitoUserPoolArn],
    //       }),
    //     ],
    //   })
    // );
  }
}
