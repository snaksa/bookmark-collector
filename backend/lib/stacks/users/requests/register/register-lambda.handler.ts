import { CognitoIdentityServiceProvider } from "aws-sdk";
import User from "../../../../shared/models/user.model";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { UserRepository } from "../../../../shared/repositories/user.repository";
import { GenericException } from "../../../../shared/exceptions/generic-exception";
import { RegisterLambdaInput } from "./register-lambda.input";

class RegisterLambdaHandler extends BaseHandler<RegisterLambdaInput> {
  constructor(
    private readonly cognitoIdentity: CognitoIdentityServiceProvider,
    private readonly userRepository: UserRepository,
    private readonly cognitoClientId: string,
  ) {
    super(RegisterLambdaInput);
  }

  async run(input: RegisterLambdaInput): Promise<Response> {
    // check if user with the provided email already exists
    const userExists = await this.userRepository.userExists(input.email);

    if (userExists) {
      throw new Error("User with this email already exists");
    }

    try {
      // add user to Cognito
      const signUpResponse = await this.cognitoIdentity
        .signUp({
          ClientId: this.cognitoClientId,
          Username: input.email,
          Password: input.password,
          UserAttributes: [
            {
              Name: "email",
              Value: input.email,
            },
          ],
        })
        .promise();

      const userSub = signUpResponse.UserSub;

      await this.userRepository.save(
        new User(
          userSub,
          input.email,
          input.firstName,
          input.lastName,
          1
        )
      );

      return {
        statusCode: ApiGatewayResponseCodes.CREATED,
        body: {
          data: {
            id: userSub,
          },
        },
      };
    } catch (err) {
      console.log(err);
      throw new GenericException();
    }
  }
}

export const handler = new RegisterLambdaHandler(
  new CognitoIdentityServiceProvider(),
  new UserRepository(
    process.env.dbStore ?? '',
    process.env.userIndexByEmail ?? ''
  ),
  process.env.cognitoClientId ?? '',
).create();
