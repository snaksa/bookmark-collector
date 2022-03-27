import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, {
  Response,
} from "../../../../shared/base-handler";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import { NotFoundException } from "../../../../shared/exceptions/not-found-exception";
import { UpdateLambdaInput } from "./update-lambda.input";

class UpdateLambdaHandler extends BaseHandler<UpdateLambdaInput> {
  protected isLogged: boolean = true;
  
  constructor(private readonly labelRepository: LabelRepository) {
    super(UpdateLambdaInput);
  }

  async run(input: UpdateLambdaInput, userId: string): Promise<Response> {
    const label = await this.labelRepository.findOne(input.query.id, userId);

    if (!label) {
      throw new NotFoundException(`Label with ID "${input.query.id}" not found`);
    }

    if (input.body.label) label.title = input.body.label;
    if (input.body.color) label.color = input.body.color;

    await this.labelRepository.update(label);

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {
        data: label.toObject(),
      },
    };
  }
}

export const handler = new UpdateLambdaHandler(
  new LabelRepository(process.env.dbStore ?? ''),
).create();
