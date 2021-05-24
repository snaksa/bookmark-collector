import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import Label from "../../../../shared/models/label.model";
import { LabelRepository } from "../../../../shared/repositories/label.repository";

interface Env {
  dbStore: string;
}

class ListLambdaHandler extends BaseHandler {
  private labelRepository: LabelRepository;

  private userId: string;

  private env: Env = {
    dbStore: process.env.dbStore ?? "",
  };

  constructor() {
    super();

    this.labelRepository = new LabelRepository(this.env.dbStore);
  }

  parseEvent(event: any) {
    this.userId = event.requestContext.authorizer.claims.sub;
  }

  authorize(): boolean {
    return this.userId ? true : false;
  }

  async run(): Promise<Response> {
    const labels: Label[] = await this.labelRepository.findAll(this.userId);

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: labels.map((label: Label) => Label.fromDynamoDb(label).toObject()),
    };
  }
}

export const handler = new ListLambdaHandler().create();
