import {
  LABELS_DETAILS_DELETE_BOOKMARK,
  LABELS_DETAILS_INITIALIZED,
  LABELS_DETAILS_INITIALIZING,
  LABELS_DETAILS_UPDATE_BOOKMARK,
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
    data: {
      bookmarks: [],
    },
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
    case LABELS_DETAILS_UPDATE_BOOKMARK:
      return {
        ...state,
        details: {
          isLoading: false,
          data: {
            ...state.details.data,
            bookmarks: state.details.data.bookmarks.map((bookmark: any) =>
              bookmark.id === action.payload.bookmarkId
                ? { ...bookmark, ...action.payload.data }
                : bookmark
            ),
          },
        },
      };
    case LABELS_DETAILS_DELETE_BOOKMARK:
      return {
        ...state,
        details: {
          isLoading: false,
          data: {
            ...state.details.data,
            bookmarks: state.details.data.bookmarks.filter(
              (bookmark: any) => bookmark.id !== action.payload
            ),
          },
        },
      };

    default:
      return state;
  }
};

export default reducer;
