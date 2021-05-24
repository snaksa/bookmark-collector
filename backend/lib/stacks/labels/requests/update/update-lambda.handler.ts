import { v4 as uuidv4 } from "uuid";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { Validator } from "../../../../shared/validators/validator";
import { QueryBuilder } from "../../../../shared/services/query-builder";
import Label from "../../../../shared/models/label.model";
import BookmarkLabel from "../../../../shared/models/bookmark-label.model";
import { LabelRepository } from "../../../../shared/repositories/label.repository";

interface UpdateEventData {
  label: string;
  color: string;
}

interface Env {
  dbStore: string;
}

class UpdateLambdaHandler extends BaseHandler {
  private labelRepository: LabelRepository;

  private input: UpdateEventData;
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
    this.input = JSON.parse(event.body) as UpdateEventData;
    this.userId = event.requestContext.authorizer.claims.sub;
    this.labelId = event.pathParameters.id;
  }

  validate() {
    return (
      this.input &&
      (Validator.notEmpty(this.input.label) ||
        Validator.notEmpty(this.input.color))
    );
  }

  authorize(): boolean {
    return this.userId ? true : false;
  }

  async run(): Promise<Response> {
    const label = await this.labelRepository.findOne(this.labelId, this.userId);

    if (!label)
      return {
        statusCode: ApiGatewayResponseCodes.NOT_FOUND,
        body: {},
      };

    if (this.input.label) label.title = this.input.label;

    if (this.input.color) label.color = this.input.color;

    await this.labelRepository.update(label);

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: label.toObject(),
    };
  }
}

export const handler = new UpdateLambdaHandler().create();
