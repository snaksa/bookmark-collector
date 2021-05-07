import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import User from "../../../../shared/models/user.model";
import { UserRepository } from "../../../../shared/repositories/user.repository";
import { Validator } from "../../../../shared/validators/validator";
import { CognitoIdentityServiceProvider } from "aws-sdk";

interface Env {
  dbStore: string;
  userIndexByEmail: string;
  cognitoUserPoolId: string;
}

interface UpdateEventData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

class UpdateLambdaHandler extends BaseHandler {
  private userRepository: UserRepository;

  private userId: string;
  private input: UpdateEventData;

  private env: Env = {
    dbStore: process.env.dbStore ?? "",
    userIndexByEmail: process.env.userIndexByEmail ?? "",
    cognitoUserPoolId: process.env.cognitoUserPoolId ?? "",
  };

  constructor() {
    super();

    this.userRepository = new UserRepository(
      this.env.dbStore,
      this.env.userIndexByEmail
    );
  }

  parseEvent(event: any) {
    this.input = JSON.parse(event.body) as UpdateEventData;
    this.userId = event.requestContext.authorizer.claims.sub;
  }

  validate() {
    return (
      Validator.notEmpty(this.input.firstName) ||
      Validator.notEmpty(this.input.lastName) ||
      Validator.notEmpty(this.input.email)
    );
  }

  authorize(): boolean {
    return this.userId ? true : false;
  }

  async run(): Promise<Response> {
    const user: User | null = await this.userRepository.findOne(this.userId);
    if (!user) {
      return {
        statusCode: ApiGatewayResponseCodes.NOT_FOUND,
        body: {},
      };
    }

    if (this.input.email && this.input.email !== user.email) {
      // check if user with the provided email already exists
      const userExistsInDb = await this.userRepository.userExists(
        this.input.email
      );

      if (userExistsInDb) {
        throw new Error("User with this email already exists");
      }

      //update email attribute in Cognito
      const cognitoidentity = new CognitoIdentityServiceProvider();
      // add user to Cognito
      const signUpResponse = await cognitoidentity
        .adminUpdateUserAttributes({
          Username: user.email,
          UserPoolId: this.env.cognitoUserPoolId,
          UserAttributes: [
            {
              Name: "email",
              Value: this.input.email,
            },
          ],
        })
        .promise();

      user.GSI1 = this.input.email;
      user.email = this.input.email;
    }

    if (this.input.firstName) {
      user.firstName = this.input.firstName;
    }

    if (this.input.lastName) {
      user.lastName = this.input.lastName;
    }

    await this.userRepository.update(user);

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: user.toObject(),
    };
  }
}

export const handler = new UpdateLambdaHandler().create();
