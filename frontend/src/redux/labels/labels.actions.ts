import {
  LABELS_DETAILS_INITIALIZED,
  LABELS_DETAILS_INITIALIZING,
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
