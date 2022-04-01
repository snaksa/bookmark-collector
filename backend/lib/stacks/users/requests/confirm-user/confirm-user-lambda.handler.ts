import * as AWS from "aws-sdk";
import BaseHandler, { Response, } from "../../../../shared/base-handler";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import { GenericException } from "../../../../shared/exceptions/generic-exception";
import { ConfirmPasswordLambdaInput } from "./change-password-lambda.input";

class ConfirmUserHandler extends BaseHandler<ConfirmPasswordLambdaInput> {
  constructor(
    private readonly cognitoIdentity: AWS.CognitoIdentityServiceProvider,
    private readonly cognitoClientId: string,

  ) {
    super(ConfirmPasswordLambdaInput);
  }

  async run(input: ConfirmPasswordLambdaInput): Promise<Response> {
    try {
      await this.cognitoIdentity
        .confirmSignUp({
          ClientId: this.cognitoClientId,
          Username: input.username,
          ConfirmationCode: input.code,
        })
        .promise();
    } catch (err) {
      console.log(err);
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

export const handler = new ConfirmUserHandler(
  new AWS.CognitoIdentityServiceProvider(),
  process.env.cognitoClientId ?? '',
).create();
