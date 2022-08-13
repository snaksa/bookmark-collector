import { SQS } from "aws-sdk";
import { v4 as uuid_v4 } from "uuid";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import { BookmarkRepository } from "../../../../shared/repositories/bookmark.repository";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import { GenericException } from "../../../../shared/exceptions/generic-exception";
import { CreateLambdaInput } from "./create-lambda.input";
import Bookmark from "../../models/bookmark.model";
import BookmarkLabel from "../../models/bookmark-label.model";
import IsLogged from "../../../../shared/decorators/is-logged";

@IsLogged
class CreateLambdaHandler extends BaseHandler<CreateLambdaInput> {
  constructor(
    private readonly sqsService: SQS,
    private readonly bookmarkRepository: BookmarkRepository,
    private readonly labelRepository: LabelRepository,
    private readonly queueUrl: string
  ) {
    super(CreateLambdaInput);
  }

  async run(request: CreateLambdaInput, userId: string): Promise<Response> {
    let url = request.body.url;
    if (url.indexOf("http") !== 0) {
      url = `https://${url}`;
    }

    const id = `${new Date().getTime()}-${uuid_v4()}`;
    const bookmark = new Bookmark(id, userId, url, false);
    const save = await this.bookmarkRepository.save(bookmark);

    if (!save) {
      throw new GenericException();
    }

    if (request.body.labelIds) {
      const labels = await this.labelRepository.findByIds(
        request.body.labelIds,
        userId
      );

      const bookmarkLabels: Promise<boolean>[] = [];
      labels.forEach((label) => {
        bookmark.addLabel(label);
        const bookmarkLabel = new BookmarkLabel(
          label.id,
          bookmark.id,
          userId,
          label.title,
          bookmark.url,
          bookmark.isFavorite,
          bookmark.title,
          bookmark.image,
          bookmark.createdOn
        );
        bookmarkLabels.push(this.bookmarkRepository.saveLabel(bookmarkLabel));
      });

      await Promise.all(bookmarkLabels);
    }

    await this.sqsService
      .sendMessage({
        MessageAttributes: {
          bookmarkId: {
            DataType: "String",
            StringValue: bookmark.id,
          },
          userId: {
            DataType: "String",
            StringValue: bookmark.userId,
          },
        },
        MessageBody: "Fetch metadata",
        QueueUrl: this.queueUrl,
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

export const handler = new CreateLambdaHandler(
  new SQS({ apiVersion: "2012-11-05" }),
  new BookmarkRepository(process.env.dbStore ?? ""),
  new LabelRepository(process.env.dbStore ?? ""),
  process.env.queueUrl ?? ""
).create();
