import { Construct } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
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
