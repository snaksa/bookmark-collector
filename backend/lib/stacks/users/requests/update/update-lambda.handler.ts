import { CognitoIdentityServiceProvider } from "aws-sdk";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import User from "../../models/user.model";
import { UserRepository } from "../../repositories/user.repository";
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";
import { UserAlreadyExistsException } from "../../../../shared/exceptions/user-already-exists-exception";
import { UpdateLambdaInput } from "./update-lambda.input";
import IsLogged from "../../../../shared/decorators/is-logged";

@IsLogged
class UpdateLambdaHandler extends BaseHandler<UpdateLambdaInput> {
  constructor(
    private readonly cognitoIdentity: CognitoIdentityServiceProvider,
    private readonly userRepository: UserRepository,
    private readonly cognitoUserPoolId: string
  ) {
    super(UpdateLambdaInput);
  }

  async run(request: UpdateLambdaInput, userId: string): Promise<Response> {
    const user: User | null = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    if (request.body.email && request.body.email !== user.email) {
      // check if user with the provided email already exists
      const userExistsInDb = await this.userRepository.userExists(
        request.body.email
      );

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
              Value: request.body.email,
            },
          ],
        })
        .promise();

      user.GSI1 = request.body.email;
      user.email = request.body.email;
    }

    if (request.body.firstName) {
      user.firstName = request.body.firstName;
    }

    if (request.body.lastName) {
      user.lastName = request.body.lastName;
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
    process.env.dbStore ?? "",
    process.env.reversedDbStore ?? ""
  ),
  process.env.cognitoUserPoolId ?? ""
).create();
