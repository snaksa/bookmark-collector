import { CognitoIdentityServiceProvider } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import User from "../../../../shared/models/user.model";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { Validator } from "../../../../shared/validators/validator";
import { UserRepository } from "../../../../shared/repositories/user.repository";

interface RegisterEventData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface Env {
  dbStore: string;
  userIndexByEmail: string;
  cognitoClientId: string;
}

class RegisterLambdaHandler extends BaseHandler {
  private userRepository: UserRepository;
  private input: RegisterEventData;

  private env: Env = {
    dbStore: process.env.dbStore ?? "",
    userIndexByEmail: process.env.userIndexByEmail ?? "",
    cognitoClientId: process.env.cognitoClientId ?? "",
  };

  constructor() {
    super();

    this.userRepository = new UserRepository(
      this.env.dbStore,
      this.env.userIndexByEmail
    );
  }

  parseEvent(event: any) {
    this.input = JSON.parse(event.body) as RegisterEventData;
  }

  validate() {
    return (
      Validator.notEmpty(this.input.firstName) &&
      Validator.notEmpty(this.input.lastName) &&
      Validator.notEmpty(this.input.email) &&
      Validator.notEmpty(this.input.password)
    );
  }

  async run(): Promise<Response> {
    // check if user with the provided email already exists
    const userExists = await this.userRepository.userExists(this.input.email);

    if (userExists) {
      throw new Error("User with this email already exists");
    }

    const registerData = {
      ClientId: this.env.cognitoClientId,
      Username: this.input.email,
      Password: this.input.password,
      UserAttributes: [
        {
          Name: "email",
          Value: this.input.email,
        },
      ],
    };

    try {
      const cognitoidentity = new CognitoIdentityServiceProvider();
      // add user to Cognito
      const signUpResponse = await cognitoidentity
        .signUp(registerData)
        .promise();

      const userSub = signUpResponse.UserSub;

      await this.userRepository.save(
        new User(
          userSub,
          this.input.email,
          this.input.firstName,
          this.input.lastName,
          1
        )
      );

      return {
        statusCode: ApiGatewayResponseCodes.OK,
        body: { id: userSub },
      };
    } catch (err) {
      throw Error("Couldn't create user");
    }
  }
}

export const handler = new RegisterLambdaHandler().create();
