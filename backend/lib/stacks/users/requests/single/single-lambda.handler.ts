import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, {
  RequestEventType,
  Response,
} from "../../../../shared/base-handler";
import { UserRepository } from "../../../../shared/repositories/user.repository";

interface Env {
  dbStore: string;
}

class SingleLambdaHandler extends BaseHandler {
  private userRepository: UserRepository;

  private userId: string;

  private env: Env = {
    dbStore: process.env.dbStore ?? "",
  };

  constructor() {
    super();

    this.userRepository = new UserRepository(this.env.dbStore);
  }

  parseEvent(event: RequestEventType) {
    this.userId = event.requestContext.authorizer.claims.sub;
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

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {
        data: user.toObject(),
      },
    };
  }
}

export const handler = new SingleLambdaHandler().create();
