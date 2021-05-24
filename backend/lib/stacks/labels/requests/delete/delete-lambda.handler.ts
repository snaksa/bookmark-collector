import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { LabelRepository } from "../../../../shared/repositories/label.repository";

interface Env {
  dbStore: string;
}

class DeleteLambdaHandler extends BaseHandler {
  private labelRepository: LabelRepository;

  private userId: string;
  private labelId: string;

  private env: Env = {
    dbStore: process.env.dbStore ?? "",
  };

  constructor() {
    super();

    this.labelRepository = new LabelRepository(this.env.dbStore);
  }

  parseEvent(event: any) {
    this.userId = event.requestContext.authorizer.claims.sub;
    this.labelId = event.pathParameters.id;
  }

  authorize(): boolean {
    return this.userId ? true : false;
  }

  async run(): Promise<Response> {
    await this.labelRepository.deleteById(this.labelId, this.userId);

    return {
      statusCode: ApiGatewayResponseCodes.NO_CONTENT,
      body: {},
    };
  }
}

export const handler = new DeleteLambdaHandler().create();
