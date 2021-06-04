import { v4 as uuid_v4 } from "uuid";
import { SQS } from "aws-sdk";

import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, {
  RequestEventType,
  Response,
} from "../../../../shared/base-handler";
import { Validator } from "../../../../shared/validators/validator";
import Bookmark from "../../../../shared/models/bookmark.model";
import BookmarkLabel from "../../../../shared/models/bookmark-label.model";
import { BookmarkRepository } from "../../../../shared/repositories/bookmark.repository";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import { GenericException } from "../../../../shared/exceptions/generic-exception";

interface CreateEventData {
  url: string;
  labelIds: string[];
}

interface Env {
  dbStore: string;
  queueUrl: string;
}

class CreateLambdaHandler extends BaseHandler {
  private bookmarkRepository: BookmarkRepository;
  private labelRepository: LabelRepository;

  private input: CreateEventData;
  private userId: string;

  private env: Env = {
    dbStore: process.env.dbStore ?? "",
    queueUrl: process.env.queueUrl ?? "",
  };

  constructor() {
    super();

    this.bookmarkRepository = new BookmarkRepository(this.env.dbStore);
    this.labelRepository = new LabelRepository(this.env.dbStore);
  }

  parseEvent(event: RequestEventType) {
    this.input = JSON.parse(event.body) as CreateEventData;
    this.userId = event.requestContext.authorizer.claims.sub;
  }

  validate() {
    return this.input && Validator.notEmpty(this.input.url);
  }

  authorize(): boolean {
    return !!this.userId;
  }

  async run(): Promise<Response> {
    let url = this.input.url;
    if (url.indexOf("http") !== 0) {
      url = `https://${url}`;
    }

    const bookmark = new Bookmark(uuid_v4(), this.userId, url, false, false);
    const save = await this.bookmarkRepository.save(bookmark);

    if (!save) {
      throw new GenericException();
    }

    if (this.input.labelIds) {
      const labels = await this.labelRepository.findByIds(
        this.input.labelIds,
        this.userId
      );

      const bookmarkLabels: Promise<boolean>[] = [];
      labels.forEach((label) => {
        bookmark.addLabel(label);
        const bookmarkLabel = new BookmarkLabel(
          label.labelId,
          bookmark.bookmarkId,
          this.userId,
          label.title,
          label.color,
          bookmark.bookmarkUrl,
          bookmark.isFavorite,
          bookmark.isArchived,
          bookmark.bookmarkTitle,
          bookmark.bookmarkImage
        );
        bookmarkLabels.push(this.bookmarkRepository.saveLabel(bookmarkLabel));
      });

      await Promise.all(bookmarkLabels);
    }

    const sqs = new SQS({ apiVersion: "2012-11-05" });
    await sqs
      .sendMessage({
        MessageAttributes: {
          bookmarkId: {
            DataType: "String",
            StringValue: bookmark.bookmarkId,
          },
          userId: {
            DataType: "String",
            StringValue: bookmark.userId,
          },
        },
        MessageBody: "Fetch metadata",
        QueueUrl: this.env.queueUrl,
      })
      .promise();

    return {
      statusCode: ApiGatewayResponseCodes.CREATED,
      body: {
        data: bookmark.toObject(),
      },
    };
  }
}

export const handler = new CreateLambdaHandler().create();
