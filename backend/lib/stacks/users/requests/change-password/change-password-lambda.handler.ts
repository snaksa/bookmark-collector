import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { Validator } from "../../../../shared/validators/validator";
import { CognitoIdentityServiceProvider } from "aws-sdk";

interface UpdateEventData {
  oldPassword: string;
  newPassword: string;
  accessToken: string;
}

class ChangePasswordLambdaHandler extends BaseHandler {
  private userId: string;
  private input: UpdateEventData;

  parseEvent(event: any) {
    this.input = JSON.parse(event.body) as UpdateEventData;
    this.userId = event.requestContext.authorizer.claims.sub;
  }

  validate() {
    return (
      Validator.notEmpty(this.input.oldPassword) ||
      Validator.notEmpty(this.input.newPassword)
    );
  }

  authorize(): boolean {
    return !!this.userId;
  }

  async run(): Promise<Response> {
    //update email attribute in Cognito
    const cognitoidentity = new CognitoIdentityServiceProvider();

    // change user password
    const changePasswordResponse = await cognitoidentity
      .changePassword({
        PreviousPassword: this.input.oldPassword,
        ProposedPassword: this.input.newPassword,
        AccessToken: this.input.accessToken,
      })
      .promise();

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {},
    };
  }
}

export const handler = new ChangePasswordLambdaHandler().create();
