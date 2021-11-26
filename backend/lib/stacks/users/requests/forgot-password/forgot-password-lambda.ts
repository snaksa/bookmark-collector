import { Construct } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import * as path from "path";

interface ForgotPasswordLambdaProps {
  cognitoClientId: string;
}

export class ForgotPasswordLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: ForgotPasswordLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./forgot-password-lambda.handler.ts"),
      environment: {
        cognitoClientId: props.cognitoClientId,
      },
    });
  }
}
