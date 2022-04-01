import { CognitoIdentityServiceProvider } from "aws-sdk";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import User from "../../../../shared/models/user.model";
import { UserRepository } from "../../../../shared/repositories/user.repository";
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";
import { UserAlreadyExistsException } from "../../../../shared/exceptions/user-already-exists-exception";
import { UpdateLambdaInput } from "./update-lambda.input";

class UpdateLambdaHandler extends BaseHandler<UpdateLambdaInput> {
  protected isLogged: boolean = true;

  constructor(
    private readonly cognitoIdentity: CognitoIdentityServiceProvider,
    private readonly userRepository: UserRepository,
    private readonly cognitoUserPoolId: string,
  ) {
    super(UpdateLambdaInput);
  }

  async run(input: UpdateLambdaInput, userId: string): Promise<Response> {
    const user: User | null = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    if (input.email && input.email !== user.email) {
      // check if user with the provided email already exists
      const userExistsInDb = await this.userRepository.userExists(input.email);

      if (userExistsInDb) {
        throw new UserAlreadyExistsException();
      }

      //update email attribute in Cognito
      // add user to Cognito
      await this.cognitoIdentity
        .adminUpdateUserAttributes({
          Username: user.email,
          UserPoolId: this.cognitoUserPoolId,
          UserAttributes: [
            {
              Name: "email",
              Value: input.email,
            },
          ],
        })
        .promise();

      user.GSI1 = input.email;
      user.email = input.email;
    }

    if (input.firstName) {
      user.firstName = input.firstName;
    }

    if (input.lastName) {
      user.lastName = input.lastName;
    }

    await this.userRepository.update(user);

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {
        data: user.toObject(),
      },
    };
  }
}

export const handler = new UpdateLambdaHandler(
  new CognitoIdentityServiceProvider(),
  new UserRepository(
    process.env.dbStore ?? '',
    process.env.userIndexByEmail ?? ''
  ),
  process.env.cognitoUserPoolId ?? '',
).create();
