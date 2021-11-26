import { Construct } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import * as path from "path";

interface ResetPasswordLambdaProps {
  cognitoClientId: string;
}

export class ResetPasswordLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: ResetPasswordLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./reset-password-lambda.handler.ts"),
      environment: {
        cognitoClientId: props.cognitoClientId,
      },
    });
  }
}
