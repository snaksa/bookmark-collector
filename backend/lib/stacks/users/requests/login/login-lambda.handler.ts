import * as AWS from "aws-sdk";
import BaseHandler, {
  RequestEventType,
  Response,
} from "../../../../shared/base-handler";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import { Validator } from "../../../../shared/validators/validator";
import { WrongCredentialsException } from "../../../../shared/exceptions/wrong-credentials-exception";

interface LoginEventData {
  email: string;
  password: string;
}

interface Env {
  cognitoClientId: string;
}

class LoginHandler extends BaseHandler {
  private input: LoginEventData;

  private env: Env = {
    cognitoClientId: process.env.cognitoClientId ?? "",
  };

  parseEvent(event: RequestEventType) {
    this.input = JSON.parse(event.body) as LoginEventData;
  }

  validate() {
    return (
      Validator.notEmpty(this.input.email) &&
      Validator.notEmpty(this.input.password)
    );
  }

  async run(): Promise<Response> {
    const authenticationData = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: this.env.cognitoClientId,
      AuthParameters: {
        USERNAME: this.input.email,
        PASSWORD: this.input.password,
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
        data: { tokens: authenticationDetails.AuthenticationResult },
      },
    };
  }
}

export const handler = new LoginHandler().create();
