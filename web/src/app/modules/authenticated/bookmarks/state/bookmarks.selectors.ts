import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BookmarksState } from './bookmarks.state';

const getBookmarksFeatureState =
  createFeatureSelector<BookmarksState>('bookmarks');

export const getBookmarksListSelector = createSelector(
  getBookmarksFeatureState,
  (state) => state.list
);

export const getFavoriteBookmarksSelector = createSelector(
  getBookmarksFeatureState,
  (state) => state.favorites
);

export const getArchivedBookmarksSelector = createSelector(
  getBookmarksFeatureState,
  (state) => state.archived
);
