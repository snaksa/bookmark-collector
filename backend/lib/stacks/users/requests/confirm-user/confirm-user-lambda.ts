import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

interface ConfirmUserLambdaProps {
  cognitoClientId: string;
}

export class ConfirmUserLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: ConfirmUserLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./confirm-user-lambda.handler.ts"),
      environment: {
        cognitoClientId: props.cognitoClientId,
      },
    });
  }
}
