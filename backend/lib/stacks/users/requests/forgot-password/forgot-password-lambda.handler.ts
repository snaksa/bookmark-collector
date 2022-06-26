import * as AWS from "aws-sdk";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import { GenericException } from "../../../../shared/exceptions/generic-exception";
import { ForgotPasswordLambdaInput } from "./forgot-password-lambda.input";

class ForgotPasswordHandler extends BaseHandler<ForgotPasswordLambdaInput> {
  constructor(
    private readonly cognitoIdentity: AWS.CognitoIdentityServiceProvider,
    private readonly cognitoClientId: string
  ) {
    super(ForgotPasswordLambdaInput);
  }

  async run(request: ForgotPasswordLambdaInput): Promise<Response> {
    try {
      await this.cognitoIdentity
        .forgotPassword({
          ClientId: this.cognitoClientId,
          Username: request.body.username,
        })
        .promise();
    } catch (err) {
      throw new GenericException();
    }

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {
        data: {
          success: true,
        },
      },
    };
  }
}

export const handler = new ForgotPasswordHandler(
  new AWS.CognitoIdentityServiceProvider(),
  process.env.cognitoClientId ?? ""
).create();
