import * as AWS from "aws-sdk";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import { GenericException } from "../../../../shared/exceptions/generic-exception";
import { ResetPasswordLambdaInput } from "./reset-password-lambda.input";

class ResetPasswordHandler extends BaseHandler<ResetPasswordLambdaInput> {
  constructor(
    private readonly cognitoIdentity: AWS.CognitoIdentityServiceProvider,
    private readonly cognitoClientId: string
  ) {
    super(ResetPasswordLambdaInput);
  }

  async run(input: ResetPasswordLambdaInput): Promise<Response> {
    try {
      await this.cognitoIdentity
        .confirmForgotPassword({
          ClientId: this.cognitoClientId,
          Username: input.body.username,
          Password: input.body.password,
          ConfirmationCode: input.body.confirmationCode,
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

export const handler = new ResetPasswordHandler(
  new AWS.CognitoIdentityServiceProvider(),
  process.env.cognitoClientId ?? ""
).create();
