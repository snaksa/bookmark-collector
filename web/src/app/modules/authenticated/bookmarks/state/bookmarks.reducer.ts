import {createReducer, on} from '@ngrx/store';
import {
  loadBookmarksAction,
  loadBookmarksFailureAction,
  loadBookmarksSuccessAction,
  toggleArchiveBookmarkSuccessAction,
  deleteBookmarkSuccessAction,
  toggleFavoriteBookmarkSuccessAction, updateBookmarkTagsSuccessAction, createBookmarkSuccessAction,
} from './bookmarks.actions';
import {BookmarksState} from './bookmarks.state';
import { deleteLabelSuccessAction, updateLabelSuccessAction } from '../../labels/state/labels.actions';

const initialState: BookmarksState = {
  list: {
    data: [],
    isLoading: false,
    isInitialized: false,
    error: '',
  },
  favorites: {
    data: [],
    isLoading: false,
    isInitialized: false,
    error: '',
  },
  archived: {
    data: [],
    isLoading: false,
    isInitialized: false,
    error: '',
  },
};

export const bookmarksReducer = createReducer<BookmarksState>(
  initialState,
  on(loadBookmarksAction, (state, action) => {
    return {
      ...state,
      [action.key]: {
        ...state[action.key],
        isLoading: true,
      },
    };
  }),
  on(loadBookmarksSuccessAction, (state, action) => {
    return {
      ...state,
      [action.key]: {
        ...state[action.key],
        isLoading: false,
        isInitialized: true,
        data: action.bookmarks,
      },
    };
  }),
  on(loadBookmarksFailureAction, (state, action) => {
    return {
      ...state,
      [action.key]: {
        ...state[action.key],
        isLoading: false,
        error: action.error,
      },
    };
  }),
  on(toggleFavoriteBookmarkSuccessAction, (state, action) => {
    return {
      ...state,
      list: {
        ...state.list,
        data: state.list.data.map(bookmark => bookmark.id === action.bookmark.id ? action.bookmark : bookmark),
      },
      favorites: {
        ...state.favorites,
        data: !state.favorites.isInitialized ? [] : action.bookmark.isFavorite ?
          [...state.favorites.data, action.bookmark] :
          state.favorites.data.filter(bookmark => bookmark.id !== action.bookmark.id),
      },
      archived: {
        ...state.archived,
        data: state.archived.data.map(bookmark => bookmark.id === action.bookmark.id ? action.bookmark : bookmark),
      }
    };
  }),
  on(toggleArchiveBookmarkSuccessAction, (state, action) => {
    return {
      ...state,
      list: {
        ...state.list,
        data: !action.bookmark.isArchived ?
          [...state.list.data, action.bookmark] :
          state.list.data.filter(bookmark => bookmark.id !== action.bookmark.id),
      },
      favorites: {
        ...state.favorites,
        data: state.favorites.data.map(bookmark => bookmark.id === action.bookmark.id ? action.bookmark : bookmark),
      },
      archived: {
        ...state.archived,
        data: !state.archived.isInitialized ? [] : action.bookmark.isArchived ?
          [...state.archived.data, action.bookmark] :
          state.archived.data.filter(bookmark => bookmark.id !== action.bookmark.id)
      }
    };
  }),
  on(deleteBookmarkSuccessAction, (state, action) => {
    return {
      ...state,
      list: {
        ...state.list,
        data: state.list.data.filter(bookmark => bookmark.id !== action.bookmarkId),
      },
      favorites: {
        ...state.favorites,
        data: state.favorites.data.filter(bookmark => bookmark.id !== action.bookmarkId),
      },
      archived: {
        ...state.archived,
        data: state.archived.data.filter(bookmark => bookmark.id !== action.bookmarkId),
      }
    };
  }),
  on(createBookmarkSuccessAction, (state, action) => {
    return {
      ...state,
      list: {
        ...state.list,
        data: [action.bookmark, ...state.list.data]
      },
    };
  }),
  on(updateBookmarkTagsSuccessAction, (state, action) => {
    return {
      ...state,
      list: {
        ...state.list,
        data: state.list.data.map(bookmark => bookmark.id === action.bookmark.id ? action.bookmark : bookmark),
      },
      favorites: {
        ...state.favorites,
        data: state.favorites.data.map(bookmark => bookmark.id === action.bookmark.id ? action.bookmark : bookmark),
      },
      archived: {
        ...state.archived,
        data: state.archived.data.map(bookmark => bookmark.id === action.bookmark.id ? action.bookmark : bookmark),
      }
    };
  }),
  on(deleteLabelSuccessAction, (state, action) => {
    return {
      ...state,
      list: {
        ...state.list,
        data: state.list.data.map(bookmark => {
          return {
            ...bookmark,
            labels: bookmark.labels.filter(label => label.id !== action.id)
          }
        }),
      },
      favorites: {
        ...state.favorites,
        data: state.favorites.data.map(bookmark => {
          return {
            ...bookmark,
            labels: bookmark.labels.filter(label => label.id !== action.id)
          }
        }),
      },
      archived: {
        ...state.archived,
        data: state.archived.data.map(bookmark => {
          return {
            ...bookmark,
            labels: bookmark.labels.filter(label => label.id !== action.id)
          }
        }),
      }
    };
  }),
  on(updateLabelSuccessAction, (state, action) => {
    return {
      ...state,
      list: {
        ...state.list,
        data: state.list.data.map(bookmark => {
          return {
            ...bookmark,
            labels: bookmark.labels.map(label => label.id !== action.id ? label : {
              ...label,
              title: action.title
            })
          }
        }),
      },
      favorites: {
        ...state.favorites,
        data: state.favorites.data.map(bookmark => {
          return {
            ...bookmark,
            labels: bookmark.labels.map(label => label.id !== action.id ? label : {
              ...label,
              title: action.title
            })
          }
        }),
      },
      archived: {
        ...state.archived,
        data: state.archived.data.map(bookmark => {
          return {
            ...bookmark,
            labels: bookmark.labels.map(label => label.id !== action.id ? label : {
              ...label,
              title: action.title
            })
          }
        }),
      }
    };
  }),
);
