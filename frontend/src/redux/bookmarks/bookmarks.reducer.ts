import {
  BOOKMARKS_INITIALIZING,
  BOOKMARK_UPDATED,
  BOOKMARKS_INITIALIZED,
  BOOKMARK_DELETE,
  BOOKMARKS_FAVORITES_INITIALIZING,
  BOOKMARKS_FAVORITES_INITIALIZED,
  BOOKMARK_ADD_TO_FAVORITES,
  BOOKMARK_REMOVE_FROM_FAVORITES,
  BOOKMARK_ADD_TO_ARCHIVED,
  BOOKMARK_REMOVE_FROM_ARCHIVED,
  BOOKMARKS_ARCHIVED_INITIALIZING,
  BOOKMARKS_ARCHIVED_INITIALIZED,
  BOOKMARK_ADD_NEW,
} from "./bookmarks.types";

const INITIAL_STATE = {
  myList: {
    isLoading: false,
    initialized: false,
    data: [],
  },
  favorites: {
    initialized: false,
    isLoading: false,
    data: [],
  },
  archived: {
    initialized: false,
    isLoading: false,
    data: [],
  },
};

const reducer = (
  state = INITIAL_STATE,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case BOOKMARKS_INITIALIZING:
      return {
        ...state,
        myList: {
          ...state.myList,
          isLoading: true,
        },
      };
    case BOOKMARKS_INITIALIZED:
      return {
        ...state,
        myList: {
          isLoading: false,
          initialized: true,
          data: [...action.payload],
        },
      };
    case BOOKMARK_ADD_NEW:
      return {
        ...state,
        myList: {
          data: [...state.myList.data, action.payload],
        },
      };
    case BOOKMARK_ADD_TO_FAVORITES:
      return {
        ...state,
        myList: {
          ...state.myList,
          data: state.myList.data.map((item: any) =>
            item.id === action.payload.id ? action.payload : item
          ),
        },
        favorites: {
          ...state.favorites,
          data: state.favorites.data.length
            ? [...state.favorites.data, action.payload]
            : [],
        },
        archived: {
          ...state.archived,
          data: state.archived.data.map((item: any) =>
            item.id === action.payload.id ? action.payload : item
          ),
        },
      };
    case BOOKMARK_REMOVE_FROM_FAVORITES:
      return {
        ...state,
        myList: {
          ...state.myList,
          data: state.myList.data.map((item: any) =>
            item.id === action.payload.id ? action.payload : item
          ),
        },
        favorites: {
          ...state.favorites,
          data: state.favorites.data.filter(
            (item: any) => item.id !== action.payload.id
          ),
        },
        archived: {
          ...state.archived,
          data: state.archived.data.map((item: any) =>
            item.id === action.payload.id ? action.payload : item
          ),
        },
      };

    case BOOKMARK_ADD_TO_ARCHIVED:
      return {
        ...state,
        myList: {
          ...state.myList,
          data: state.myList.data.filter(
            (item: any) => item.id !== action.payload.id
          ),
        },
        favorites: {
          ...state.favorites,
          data: state.favorites.data.map((item: any) =>
            item.id === action.payload.id ? action.payload : item
          ),
        },
        archived: {
          ...state.archived,
          data: state.archived.data.length
            ? [...state.archived.data, action.payload]
            : [],
        },
      };
    case BOOKMARK_REMOVE_FROM_ARCHIVED:
      return {
        ...state,
        myList: {
          ...state.myList,
          data: [...state.myList.data, action.payload],
        },
        favorites: {
          ...state.favorites,
          data: state.favorites.data.map((item: any) =>
            item.id === action.payload.id ? action.payload : item
          ),
        },
        archived: {
          ...state.archived,
          data: state.archived.data.filter(
            (item: any) => item.id !== action.payload.id
          ),
        },
      };

    case BOOKMARK_UPDATED:
      return {
        ...state,
        myList: {
          ...state.myList,
          data: state.myList.data.map((item: any) =>
            item.id === action.payload.id ? action.payload : item
          ),
        },
        favorites: {
          ...state.favorites,
          data: state.favorites.data.map((item: any) =>
            item.id === action.payload.id ? action.payload : item
          ),
        },
        archived: {
          ...state.archived,
          data: state.archived.data.map((item: any) =>
            item.id === action.payload.id ? action.payload : item
          ),
        },
      };
    case BOOKMARK_DELETE:
      return {
        ...state,
        myList: {
          ...state.myList,
          data: state.myList.data.filter(
            (item: any) => item.id !== action.payload
          ),
        },
        favorites: {
          ...state.favorites,
          data: state.favorites.data.filter(
            (item: any) => item.id !== action.payload
          ),
        },
        archived: {
          ...state.archived,
          data: state.archived.data.filter(
            (item: any) => item.id !== action.payload
          ),
        },
      };

    case BOOKMARKS_FAVORITES_INITIALIZING:
      return {
        ...state,
        favorites: {
          ...state.favorites,
          isLoading: true,
        },
      };
    case BOOKMARKS_FAVORITES_INITIALIZED:
      return {
        ...state,
        favorites: {
          isLoading: false,
          initialized: true,
          data: action.payload,
        },
      };

    case BOOKMARKS_ARCHIVED_INITIALIZING:
      return {
        ...state,
        archived: {
          ...state.archived,
          isLoading: true,
        },
      };
    case BOOKMARKS_ARCHIVED_INITIALIZED:
      return {
        ...state,
        archived: {
          isLoading: false,
          initialized: true,
          data: action.payload,
        },
      };

    default:
      return state;
  }
};

export default reducer;
