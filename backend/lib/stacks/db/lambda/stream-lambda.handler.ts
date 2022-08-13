import { DynamoDB } from "aws-sdk";
import {
  RequestEventType,
  RequestResponse,
} from "../../../shared/base-handler";
import { ApiGatewayResponseCodes } from "../../../shared/enums/api-gateway-response-codes";
import { StreamEventTypes } from "../../../shared/enums/stream-event-types";
import { Model } from "../../../shared/models/base.model";
import BookmarkLabel from "../../../shared/models/bookmark-label.model";
import Bookmark from "../../../shared/models/bookmark.model";
import Label from "../../../shared/models/label.model";
import { BookmarkRepository } from "../../../shared/repositories/bookmark.repository";
import { LabelRepository } from "../../../shared/repositories/label.repository";
import { AttributeMap } from "aws-sdk/clients/dynamodb";

interface StreamEvent {
  type: string;
  object: Model;
}

interface RecordType {
  eventName: string;
  dynamodb: {
    OldImage: AttributeMap;
    NewImage: AttributeMap;
  };
}

interface StreamLambdaEventType extends RequestEventType {
  Records: RecordType[];
}

function getObject(object: AttributeMap): Model | null {
  const unmarshalledObject = DynamoDB.Converter.unmarshall(object);

  switch (unmarshalledObject.entityType) {
    case Label.ENTITY_TYPE:
      return Label.fromDynamoDb(unmarshalledObject as Label);
    default:
      return null;
  }
}

async function deleteBookmarkLabels(
  label: Label,
  labelRepository: LabelRepository,
  bookmarkRepository: BookmarkRepository
) {
  const bookmarkLabels = await labelRepository.findBookmarks(label.id);

  const updated: Promise<Bookmark>[] = [];
  for (let i = 0; i < bookmarkLabels.length; i++) {
    updated.push(
      bookmarkRepository.deleteByKeys(
        bookmarkLabels[i].pk,
        bookmarkLabels[i].sk
      )
    );
  }

  await Promise.all(updated);
}

async function run(
  event: StreamLambdaEventType,
  labelRepository: LabelRepository,
  bookmarkRepository: BookmarkRepository
): Promise<RequestResponse> {
  const records: StreamEvent[] = [];
  event.Records.map((record) => {
    const object = getObject(
      record.eventName === StreamEventTypes.REMOVE
        ? record.dynamodb.OldImage
        : record.dynamodb.NewImage
    );

    if (object) {
      const streamEvent: StreamEvent = {
        type: record.eventName,
        object: object,
      };

      records.push(streamEvent);
    }
  });

  for (let i = 0; i < records.length; i++) {
    const record: StreamEvent = records[i];
    if (
      record.type === StreamEventTypes.REMOVE &&
      record.object.entityType === Label.ENTITY_TYPE
    ) {
      await deleteBookmarkLabels(
        record.object as Label,
        labelRepository,
        bookmarkRepository
      );
    }
  }

  return {
    statusCode: ApiGatewayResponseCodes.OK,
    body: "",
    headers: {},
  };
}

export const handler = (event) =>
  run(
    event,
    new LabelRepository(process.env.dbStore ?? ""),
    new BookmarkRepository(
      process.env.dbStore ?? "",
      process.env.reversedDbStore ?? ""
    )
  );
