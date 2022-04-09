import * as AWS from "aws-sdk";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import { WrongCredentialsException } from "../../../../shared/exceptions/wrong-credentials-exception";
import { RefreshLambdaInput } from "./refresh-lambda.input";

class RefreshTokenHandler extends BaseHandler<RefreshLambdaInput> {
  constructor(
    private readonly cognitoIdentity: AWS.CognitoIdentityServiceProvider,
    private readonly cognitoClientId: string,
  ) {
    super(RefreshLambdaInput);
  }

  async run(request: RefreshLambdaInput): Promise<Response> {
    try {
      const authenticationDetails = await this.cognitoIdentity
        .initiateAuth({
          AuthFlow: "REFRESH_TOKEN_AUTH",
          ClientId: this.cognitoClientId,
          AuthParameters: {
            REFRESH_TOKEN: request.body.refreshToken,
          },
        })
        .promise();

      return {
        statusCode: ApiGatewayResponseCodes.OK,
        body: {
          data: {
            tokens: authenticationDetails.AuthenticationResult,
          },
        },
      };
    } catch (err) {
      throw new WrongCredentialsException();
    }
  }
}

export const handler = new RefreshTokenHandler(
  new AWS.CognitoIdentityServiceProvider(),
  process.env.cognitoClientId ?? ''
).create();
