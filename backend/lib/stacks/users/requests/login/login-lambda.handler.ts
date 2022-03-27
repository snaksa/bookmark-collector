import * as AWS from "aws-sdk";
import BaseHandler, {
  Response,
} from "../../../../shared/base-handler";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import { WrongCredentialsException } from "../../../../shared/exceptions/wrong-credentials-exception";
import { LoginLambdaInput } from "./login.input";

class LoginHandler extends BaseHandler<LoginLambdaInput> {
  constructor(
    private readonly cognitoIdentity: AWS.CognitoIdentityServiceProvider,
    private readonly cognitoClientId: string,
  ) {
    super(LoginLambdaInput);
  }

  async run(input: LoginLambdaInput): Promise<Response> {
    const authenticationData = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: this.cognitoClientId,
      AuthParameters: {
        USERNAME: input.email,
        PASSWORD: input.password,
      },
    };

    try {
      const authenticationDetails = await this.cognitoIdentity
        .initiateAuth(authenticationData)
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

export const handler = new LoginHandler(
  new AWS.CognitoIdentityServiceProvider(),
  process.env.cognitoClientId ?? "",
).create();
