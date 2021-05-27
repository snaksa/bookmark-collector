import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { Validator } from "../../../../shared/validators/validator";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { UserRepository } from "../../../../shared/repositories/user.repository";

interface UpdateEventData {
  oldPassword: string;
  newPassword: string;
}

interface Env {
  dbStore: string;
  userPoolId: string;
}

class ChangePasswordLambdaHandler extends BaseHandler {
  private userRepository: UserRepository;

  private userId: string;
  private input: UpdateEventData;

  private env: Env = {
    dbStore: process.env.dbStore ?? "",
    userPoolId: process.env.userPoolId ?? ""
  };

  constructor() {
    super();

    this.userRepository = new UserRepository(this.env.dbStore);
  }

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
    const user = await this.userRepository.findOne(this.userId);
    if (!user) {
      return {
        statusCode: ApiGatewayResponseCodes.NOT_FOUND,
        body: {},
      };
    }

    // TODO: check if the old password is correct

    const cognitoidentity = new CognitoIdentityServiceProvider();

    // change user password
    const changePasswordResponse = await cognitoidentity
      .adminSetUserPassword({
        Username: user.email,
        Password: this.input.newPassword,
        UserPoolId: this.env.userPoolId,
        Permanent: true,
      })
      .promise();

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {},
    };
  }
}

export const handler = new ChangePasswordLambdaHandler().create();
