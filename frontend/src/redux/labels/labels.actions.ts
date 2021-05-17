import { Bookmark } from "../../models/bookmark.model";
import { Label } from "../../models/label.model";
import {
  LABELS_DETAILS_DELETE_BOOKMARK,
  LABELS_DETAILS_INITIALIZED,
  LABELS_DETAILS_INITIALIZING,
  LABELS_DETAILS_UPDATE_BOOKMARK,
  LABELS_INITIALIZED,
  LABELS_INITIALIZING,
} from "./labels.types";

interface ActionResponse {
  type: string;
}

export const initializeLabels = (): ActionResponse => {
  return {
    type: LABELS_INITIALIZING,
  };
};

export const initializedLabels = (
  labels: Label[]
): ActionResponse & { payload: Label[] } => {
  return {
    type: LABELS_INITIALIZED,
    payload: labels,
  };
};

export const initializeLabelsDetails = (): ActionResponse => {
  return {
    type: LABELS_DETAILS_INITIALIZING,
  };
};

export const initializedLabelsDetails = (
  label: Label
): ActionResponse & { payload: Label } => {
  return {
    type: LABELS_DETAILS_INITIALIZED,
    payload: label,
  };
};

export const updateLabelsDetailsBookmark = (
  bookmarkId: string,
  data: Partial<Bookmark>
): ActionResponse & {
  payload: { bookmarkId: string; data: Partial<Bookmark> };
} => {
  return {
    type: LABELS_DETAILS_UPDATE_BOOKMARK,
    payload: { bookmarkId: bookmarkId, data: data },
  };
};

export const deleteLabelsDetailsBookmark = (
  bookmarkId: string
): ActionResponse & { payload: string } => {
  return {
    type: LABELS_DETAILS_DELETE_BOOKMARK,
    payload: bookmarkId,
  };
};
