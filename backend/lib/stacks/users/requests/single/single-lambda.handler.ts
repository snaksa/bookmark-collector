import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { UserRepository } from "../../repositories/user.repository";
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";
import IsLogged from "../../../../shared/decorators/is-logged";

@IsLogged
class SingleLambdaHandler extends BaseHandler {
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
  new UserRepository(process.env.dbStore ?? "")
).create();
