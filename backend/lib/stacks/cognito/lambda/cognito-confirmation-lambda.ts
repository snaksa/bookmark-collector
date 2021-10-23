import { Construct } from "@aws-cdk/core";
import { ServicePrincipal } from "@aws-cdk/aws-iam";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import * as path from "path";

interface DeleteLambdaProps {
  userPoolArn?: string;
}

export class CognitoConfirmationLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: DeleteLambdaProps) {
    super(scope, id, {
      entry: path.resolve(
        __dirname,
        "./cognito-confirmation-lambda.handler.ts"
      ),
    });

    if (props.userPoolArn) {
      const invokeCognitoTriggerPermission = {
        principal: new ServicePrincipal("cognito-idp.amazonaws.com"),
        sourceArn: props.userPoolArn,
      };

      this.addPermission(
        "InvokePreSignUpHandlerPermission",
        invokeCognitoTriggerPermission
      );
    }
  }
}
