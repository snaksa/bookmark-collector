import { CognitoIdentityServiceProvider } from "aws-sdk";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { UserRepository } from "../../repositories/user.repository";
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";
import { ChangePasswordLambdaInput } from "./change-password-lambda.input";
import IsLogged from "../../../../shared/decorators/is-logged";

@IsLogged
class ChangePasswordLambdaHandler extends BaseHandler<ChangePasswordLambdaInput> {
  constructor(
    private readonly cognitoIdentity: CognitoIdentityServiceProvider,
    private readonly userRepository: UserRepository,
    private readonly userPoolId: string
  ) {
    super(ChangePasswordLambdaInput);
  }

  async run(
    request: ChangePasswordLambdaInput,
    userId: string
  ): Promise<Response> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    // TODO: check if the old password is correct

    // change user password
    await this.cognitoIdentity
      .adminSetUserPassword({
        Username: user.email,
        Password: request.body.newPassword,
        UserPoolId: this.userPoolId,
        Permanent: true,
      })
      .promise();

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {},
    };
  }
}

export const handler = new ChangePasswordLambdaHandler(
  new CognitoIdentityServiceProvider(),
  new UserRepository(process.env.dbStore ?? ""),
  process.env.userPoolId ?? ""
).create();
