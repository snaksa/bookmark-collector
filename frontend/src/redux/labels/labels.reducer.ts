import {
  LABELS_DETAILS_INITIALIZED,
  LABELS_DETAILS_INITIALIZING,
  LABELS_INITIALIZED,
  LABELS_INITIALIZING,
} from "./labels.types";

const INITIAL_STATE = {
  list: {
    isLoading: false,
    initialized: false,
    data: [],
  },
  details: {
    isLoading: false,
    data: {},
  },
};

const reducer = (
  state = INITIAL_STATE,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case LABELS_INITIALIZING:
      return {
        ...state,
        list: {
          ...state.list,
          isLoading: true,
        },
      };
    case LABELS_INITIALIZED:
      return {
        ...state,
        list: {
          isLoading: false,
          initialized: true,
          data: [...action.payload],
        },
      };

    case LABELS_DETAILS_INITIALIZING:
      return {
        ...state,
        details: {
          ...state.details,
          isLoading: true,
        },
      };
    case LABELS_DETAILS_INITIALIZED:
      return {
        ...state,
        details: {
          isLoading: false,
          data: action.payload,
        },
      };

    default:
      return state;
  }
};

export default reducer;
