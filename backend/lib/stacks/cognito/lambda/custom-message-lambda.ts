import { Construct } from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { ServicePrincipal } from "@aws-cdk/aws-iam";
import * as path from "path";

interface CustomMessageLambdaProps {
  userPoolArn?: string;
  domain: string;
}

export class CustomMessageLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: CustomMessageLambdaProps) {
    super(scope, id, {
      entry: path.resolve(__dirname, "./custom-message-lambda.handler.ts"),
      environment: {
        domain: props.domain,
      },
    });

    if (props.userPoolArn) {
      const invokeCognitoTriggerPermission = {
        principal: new ServicePrincipal("cognito-idp.amazonaws.com"),
        sourceArn: props.userPoolArn,
      };

      this.addPermission(
        "InvokeCustomMessageHandlerPermission",
        invokeCognitoTriggerPermission
      );
    }
  }
}
