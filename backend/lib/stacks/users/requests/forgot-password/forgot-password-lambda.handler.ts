import * as AWS from "aws-sdk";
import BaseHandler, {
  RequestEventType,
  Response,
} from "../../../../shared/base-handler";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import { Validator } from "../../../../shared/validators/validator";
import { GenericException } from "../../../../shared/exceptions/generic-exception";

interface ForgotPasswordEventData {
  username: string;
}

interface Env {
  cognitoClientId: string;
}

class ForgotPasswordHandler extends BaseHandler {
  private input: ForgotPasswordEventData;

  private env: Env = {
    cognitoClientId: process.env.cognitoClientId ?? "",
  };

  parseEvent(event: RequestEventType) {
    this.input = JSON.parse(event.body) as ForgotPasswordEventData;
  }

  validate() {
    return Validator.notEmpty(this.input.username);
  }

  async run(): Promise<Response> {
    const forgotPasswordData = {
      ClientId: this.env.cognitoClientId,
      Username: this.input.username,
    };

    try {
      const cognitoIdentity = new AWS.CognitoIdentityServiceProvider();
      await cognitoIdentity.forgotPassword(forgotPasswordData).promise();
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

export const handler = new ForgotPasswordHandler().create();
