import {
  LABELS_DETAILS_DELETE_BOOKMARK,
  LABELS_DETAILS_INITIALIZED,
  LABELS_DETAILS_INITIALIZING,
  LABELS_DETAILS_UPDATE_BOOKMARK,
  LABELS_INITIALIZED,
  LABELS_INITIALIZING,
} from "./labels.types";

export const initializeLabels = () => {
  return {
    type: LABELS_INITIALIZING,
  };
};

export const initializedLabels = (bookmarks: any) => {
  return {
    type: LABELS_INITIALIZED,
    payload: bookmarks,
  };
};

export const initializeLabelsDetails = () => {
  return {
    type: LABELS_DETAILS_INITIALIZING,
  };
};

export const initializedLabelsDetails = (details: any) => {
  return {
    type: LABELS_DETAILS_INITIALIZED,
    payload: details,
  };
};

export const updateLabelsDetailsBookmark = (bookmarkId: string, data: any) => {
  return {
    type: LABELS_DETAILS_UPDATE_BOOKMARK,
    payload: { bookmarkId: bookmarkId, data: data },
  };
};

export const deleteLabelsDetailsBookmark = (bookmarkId: string) => {
  return {
    type: LABELS_DETAILS_DELETE_BOOKMARK,
    payload: bookmarkId,
  };
};
