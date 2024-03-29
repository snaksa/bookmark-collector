import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

interface LoginLambdaProps {
  cognitoClientId: string;
}

export class LoginLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: LoginLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./login-lambda.handler.ts"),
      environment: {
        cognitoClientId: props.cognitoClientId,
      },
    });
  }
}
