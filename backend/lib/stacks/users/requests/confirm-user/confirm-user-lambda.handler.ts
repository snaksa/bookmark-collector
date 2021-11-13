import * as AWS from "aws-sdk";
import BaseHandler, {
  RequestEventType,
  Response,
} from "../../../../shared/base-handler";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import { Validator } from "../../../../shared/validators/validator";
import { GenericException } from "../../../../shared/exceptions/generic-exception";

interface ConfirmUserEventData {
  username: string;
  code: string;
}

interface Env {
  cognitoClientId: string;
}

class ConfirmUserHandler extends BaseHandler {
  private input: ConfirmUserEventData;

  private env: Env = {
    cognitoClientId: process.env.cognitoClientId ?? "",
  };

  parseEvent(event: RequestEventType) {
    this.input = JSON.parse(event.body) as ConfirmUserEventData;
  }

  validate() {
    return (
      Validator.notEmpty(this.input.username) &&
      Validator.notEmpty(this.input.code)
    );
  }

  async run(): Promise<Response> {
    const data = {
      ClientId: this.env.cognitoClientId,
      Username: this.input.username,
      ConfirmationCode: this.input.code,
    };

    try {
      const cognitoIdentity = new AWS.CognitoIdentityServiceProvider();
      await cognitoIdentity.confirmSignUp(data).promise();
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

export const handler = new ConfirmUserHandler().create();
