import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
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
