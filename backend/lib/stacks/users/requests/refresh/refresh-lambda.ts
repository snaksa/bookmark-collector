import { Construct } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import * as path from "path";

interface RefreshLambdaProps {
  cognitoClientId: string;
}

export class RefreshLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: RefreshLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./refresh-lambda.handler.ts"),
      environment: {
        cognitoClientId: props.cognitoClientId,
      },
    });
  }
}
