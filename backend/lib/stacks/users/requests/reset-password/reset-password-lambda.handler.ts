import * as AWS from "aws-sdk";
import BaseHandler, {
  RequestEventType,
  Response,
} from "../../../../shared/base-handler";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import { Validator } from "../../../../shared/validators/validator";
import { GenericException } from "../../../../shared/exceptions/generic-exception";

interface ResetPasswordEventData {
  username: string;
  password: string;
  confirmationCode: string;
}

interface Env {
  cognitoClientId: string;
}

class ResetPasswordHandler extends BaseHandler {
  private input: ResetPasswordEventData;

  private env: Env = {
    cognitoClientId: process.env.cognitoClientId ?? "",
  };

  parseEvent(event: RequestEventType) {
    this.input = JSON.parse(event.body) as ResetPasswordEventData;
  }

  validate() {
    return (
      Validator.notEmpty(this.input.username) &&
      Validator.notEmpty(this.input.password) &&
      Validator.notEmpty(this.input.confirmationCode)
    );
  }

  async run(): Promise<Response> {
    const resetPasswordData = {
      ClientId: this.env.cognitoClientId,
      Username: this.input.username,
      Password: this.input.password,
      ConfirmationCode: this.input.confirmationCode,
    };

    try {
      const cognitoIdentity = new AWS.CognitoIdentityServiceProvider();
      await cognitoIdentity.confirmForgotPassword(resetPasswordData).promise();
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

export const handler = new ResetPasswordHandler().create();
