import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { UserRepository } from "../../../../shared/repositories/user.repository";
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";

class SingleLambdaHandler extends BaseHandler {
  protected isLogged: boolean = true;

  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async run(input, userId): Promise<Response> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {
        data: user.toObject(),
      },
    };
  }
}

export const handler = new SingleLambdaHandler(
  new UserRepository(process.env.dbStore ?? '')
).create();
