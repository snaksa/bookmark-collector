import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, {
  RequestEventType,
  Response,
} from "../../../../shared/base-handler";
import User from "../../../../shared/models/user.model";
import { UserRepository } from "../../../../shared/repositories/user.repository";
import { Validator } from "../../../../shared/validators/validator";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";
import { UserAlreadyExistsException } from "../../../../shared/exceptions/user-already-exists-exception";

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

  parseEvent(event: RequestEventType) {
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
    return !!this.userId;
  }

  async run(): Promise<Response> {
    const user: User | null = await this.userRepository.findOne(this.userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${this.userId}" not found`);
    }

    if (this.input.email && this.input.email !== user.email) {
      // check if user with the provided email already exists
      const userExistsInDb = await this.userRepository.userExists(
        this.input.email
      );

      if (userExistsInDb) {
        throw new UserAlreadyExistsException();
      }

      //update email attribute in Cognito
      const cognitoIdentity = new CognitoIdentityServiceProvider();
      // add user to Cognito
      await cognitoIdentity
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
      body: {
        data: user.toObject(),
      },
    };
  }
}

export const handler = new UpdateLambdaHandler().create();
