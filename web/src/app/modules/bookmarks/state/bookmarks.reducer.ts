import { createReducer, on } from '@ngrx/store';
import {
  loadBookmarksAction,
  loadBookmarksFailureAction,
  loadBookmarksSuccessAction,
} from './bookmarks.actions';
import { BookmarksState } from './bookmarks.state';

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
  })
);
