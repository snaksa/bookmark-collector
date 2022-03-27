import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, {
  Response,
} from "../../../../shared/base-handler";
import Label from "../../../../shared/models/label.model";
import { LabelRepository } from "../../../../shared/repositories/label.repository";

class ListLambdaHandler extends BaseHandler {
  constructor(private readonly labelRepository: LabelRepository) {
    super();
  }

  authorize(): boolean {
    return !!this.userId;
  }

  async run(): Promise<Response> {
    const labels: Label[] = await this.labelRepository.findAll(this.userId);

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {
        data: labels.map((label: Label) =>
          Label.fromDynamoDb(label).toObject()
        ),
      },
    };
  }
}

export const handler = new ListLambdaHandler(
  new LabelRepository(process.env.dbStore ?? ""),
).create();
