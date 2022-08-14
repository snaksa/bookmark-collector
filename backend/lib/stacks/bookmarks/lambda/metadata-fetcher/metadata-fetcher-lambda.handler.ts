import { ApiGatewayResponseCodes } from "../../../../shared/enums/api-gateway-response-codes";
import {
  RequestEventType,
  RequestResponse,
} from "../../../../shared/base-handler";
import { BookmarkRepository } from "../../repositories/bookmark.repository";
import fetch from "node-fetch";
import cheerio from "cheerio";
import { URL } from "url";

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

async function run(
  event: MetadataFetcherLambdaRequestEvent,
  bookmarkRepository: BookmarkRepository
): Promise<RequestResponse> {
  const records: { bookmarkId: string; userId: string }[] = [];
  event.Records.forEach((record: RecordType) => {
    const attributes = record.messageAttributes;
    records.push({
      bookmarkId: attributes.bookmarkId.stringValue,
      userId: attributes.userId.stringValue,
    });
  });

  for (let i = 0; i < records.length; i++) {
    const bookmark = await bookmarkRepository.findOne(
      records[i].bookmarkId,
      records[i].userId
    );

    if (!bookmark) {
      return {
        statusCode: ApiGatewayResponseCodes.NOT_FOUND,
        body: "",
        headers: {},
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

    await bookmarkRepository.update(bookmark);
  }

  return {
    statusCode: ApiGatewayResponseCodes.OK,
    body: "",
    headers: {},
  };
}

export const handler = (event) =>
  run(event, new BookmarkRepository(process.env.dbStore ?? ""));
