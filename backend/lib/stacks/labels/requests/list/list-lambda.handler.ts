import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, {
  Response,
} from "../../../../shared/base-handler";
import Label from "../../../../shared/models/label.model";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import IsLogged from "../../../../shared/decorators/is-logged";

@IsLogged
class ListLambdaHandler extends BaseHandler {
  constructor(private readonly labelRepository: LabelRepository) {
    super();
  }

  async run(input, userId: string): Promise<Response> {
    const labels: Label[] = await this.labelRepository.findAll(userId);

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {
        data: labels.map((label: Label) => label.toObject()),
      },
    };
  }
}

export const handler = new ListLambdaHandler(
  new LabelRepository(process.env.dbStore ?? ""),
).create();
