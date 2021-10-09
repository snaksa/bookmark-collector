import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import BaseHandler, {
  RequestEventType,
  Response,
} from "../../../../shared/base-handler";
import { BookmarkRepository } from "../../../../shared/repositories/bookmark.repository";
import fetch from "node-fetch";
import cheerio from "cheerio";
import { URL } from "url";

interface Env {
  dbStore: string;
}

interface RecordType {
  messageAttributes: {
    bookmarkId: {
      stringValue: string;
    };
    userId: {
      stringValue: string;
    };
  };
}

interface MetadataFetcherLambdaRequestEvent extends RequestEventType {
  Records: RecordType[];
}

class MetadataFetcherLambdaHandler extends BaseHandler {
  private bookmarkRepository: BookmarkRepository;
  private records: { bookmarkId: string; userId: string }[] = [];

  private env: Env = {
    dbStore: process.env.dbStore ?? "",
  };

  constructor() {
    super();

    this.bookmarkRepository = new BookmarkRepository(this.env.dbStore);
  }

  parseEvent(event: MetadataFetcherLambdaRequestEvent) {
    this.records = [];
    event.Records.forEach((record: RecordType) => {
      const attributes = record.messageAttributes;
      this.records.push({
        bookmarkId: attributes.bookmarkId.stringValue,
        userId: attributes.userId.stringValue,
      });
    });
  }

  async run(): Promise<Response> {
    for (let i = 0; i < this.records.length; i++) {
      const bookmark = await this.bookmarkRepository.findOne(
        this.records[i].bookmarkId,
        this.records[i].userId
      );

      if (!bookmark) {
        return {
          statusCode: ApiGatewayResponseCodes.NOT_FOUND,
          body: {},
        };
      }

      const response = await fetch(bookmark.bookmarkUrl);
      const text = await response.text();

      const $ = cheerio.load(text);
      const ogTitleElement = $('meta[property="og:title"]');
      let title = $("title").text();

      if (ogTitleElement) {
        title = ogTitleElement.attr("content") ?? title;
      }

      let image = "";
      const ogImageElement = $('meta[property="og:image"]');
      if (ogImageElement) {
        image = ogImageElement.attr("content") ?? image;

        // check if the image URL was provided as relative path
        if (image.length && image[0] === "/") {
          // append protocol, hostname and image path
          const urlObject = new URL(bookmark.bookmarkUrl);
          image = `${urlObject.protocol}//${urlObject.hostname}${image}`;
        }
      }

      bookmark.bookmarkTitle = title;
      bookmark.bookmarkImage = image;

      await this.bookmarkRepository.update(bookmark);
    }

    return {
      statusCode: ApiGatewayResponseCodes.OK,
      body: {},
    };
  }
}

export const handler = new MetadataFetcherLambdaHandler().create();
