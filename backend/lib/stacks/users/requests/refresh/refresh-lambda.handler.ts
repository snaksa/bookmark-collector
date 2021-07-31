import * as AWS from "aws-sdk";
import BaseHandler, {
  RequestEventType,
  Response,
} from "../../../../shared/base-handler";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import { Validator } from "../../../../shared/validators/validator";
import { WrongCredentialsException } from "../../../../shared/exceptions/wrong-credentials-exception";

interface RefreshTokenEventData {
  refreshToken: string;
}

interface Env {
  cognitoClientId: string;
}

class RefreshTokenHandler extends BaseHandler {
  private input: RefreshTokenEventData;

  private env: Env = {
    cognitoClientId: process.env.cognitoClientId ?? "",
  };

  parseEvent(event: RequestEventType) {
    this.input = JSON.parse(event.body) as RefreshTokenEventData;
  }

  validate() {
    return Validator.notEmpty(this.input.refreshToken);
  }

  async run(): Promise<Response> {
    const authenticationData = {
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: this.env.cognitoClientId,
      AuthParameters: {
        REFRESH_TOKEN: this.input.refreshToken,
      },
    };

    let authenticationDetails;

    try {
      const cognitoIdentity = new AWS.CognitoIdentityServiceProvider();
      authenticationDetails = await cognitoIdentity
        .initiateAuth(authenticationData)
        .promise();
    } catch (err) {
      throw new WrongCredentialsException();
    }

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {
        data: {
          tokens: authenticationDetails.AuthenticationResult,
        },
      },
    };
  }
}

export const handler = new RefreshTokenHandler().create();
