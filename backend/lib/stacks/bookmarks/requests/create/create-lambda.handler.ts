import { v4 as uuid_v4 } from "uuid";
import { SQS } from "aws-sdk";
import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, { Response } from "../../../../shared/base-handler";
import Bookmark from "../../../../shared/models/bookmark.model";
import BookmarkLabel from "../../../../shared/models/bookmark-label.model";
import { BookmarkRepository } from "../../../../shared/repositories/bookmark.repository";
import { LabelRepository } from "../../../../shared/repositories/label.repository";
import { GenericException } from "../../../../shared/exceptions/generic-exception";
import { CreateLambdaInput } from "./create-lambda.input";

class CreateLambdaHandler extends BaseHandler<CreateLambdaInput> {
  protected isLogged: boolean = true;

  constructor(
    private readonly sqsService: SQS,
    private readonly bookmarkRepository: BookmarkRepository,
    private readonly labelRepository: LabelRepository,
    private readonly queueUrl: string,
  ) {
    super(CreateLambdaInput);
  }

  async run(input: CreateLambdaInput, userId: string): Promise<Response> {
    let url = input.url;
    if (url.indexOf("http") !== 0) {
      url = `https://${url}`;
    }

    const bookmark = new Bookmark(uuid_v4(), userId, url, false, false);
    const save = await this.bookmarkRepository.save(bookmark);

    if (!save) {
      throw new GenericException();
    }

    if (input.labelIds) {
      const labels = await this.labelRepository.findByIds(
        input.labelIds,
        userId
      );

      const bookmarkLabels: Promise<boolean>[] = [];
      labels.forEach((label) => {
        bookmark.addLabel(label);
        const bookmarkLabel = new BookmarkLabel(
          label.labelId,
          bookmark.bookmarkId,
          userId,
          label.title,
          label.color,
          bookmark.bookmarkUrl,
          bookmark.isFavorite,
          bookmark.isArchived,
          bookmark.bookmarkTitle,
          bookmark.bookmarkImage,
          bookmark.bookmarkCreatedAt
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
            StringValue: bookmark.bookmarkId,
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
  new BookmarkRepository(process.env.dbStore ?? ''),
  new LabelRepository(process.env.dbStore ?? ''),
  process.env.queueUrl ?? '',
).create();
