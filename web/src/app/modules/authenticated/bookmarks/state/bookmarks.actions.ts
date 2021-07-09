import { createAction, props } from '@ngrx/store';
import { Bookmark } from '../../../shared/models/bookmark.model';
import { BookmarkType } from './bookmark-type.enum';

export const loadBookmarksAction = createAction('[Bookmarks API] Load List', props<{ key: BookmarkType }>());

export const loadBookmarksSuccessAction = createAction(
  '[Bookmarks API] Load List Success',
  props<{ bookmarks: Bookmark[]; key: BookmarkType }>()
);

export const loadBookmarksFailureAction = createAction(
  '[Bookmarks API] Load List Failure',
  props<{ error: string; key: BookmarkType }>()
);

export const toggleFavoriteBookmarkAction = createAction(
  '[Bookmarks API] Toggle Favorite Bookmark',
  props<{ bookmarkId: string; isFavorite: boolean }>()
);

export const toggleFavoriteBookmarkSuccessAction = createAction(
  '[Bookmarks API] Toggle Favorite Bookmark Success',
  props<{ bookmark: Bookmark }>()
);

export const toggleFavoriteBookmarkFailureAction = createAction(
  '[Bookmarks API] Toggle Favorite Bookmark Failure',
  props<{ error: string }>()
);

export const toggleArchiveBookmarkAction = createAction(
  '[Bookmarks API] Toggle Archive Bookmark',
  props<{ bookmarkId: string; isArchived: boolean }>()
);

export const toggleArchiveBookmarkSuccessAction = createAction(
  '[Bookmarks API] Toggle Archive Bookmark Success',
  props<{ bookmark: Bookmark }>()
);

export const toggleArchiveBookmarkFailureAction = createAction(
  '[Bookmarks API] Toggle Archive Bookmark Failure',
  props<{ error: string }>()
);

export const deleteBookmarkAction = createAction('[Bookmarks API] Delete Bookmark', props<{ bookmarkId: string }>());

export const deleteBookmarkSuccessAction = createAction(
  '[Bookmarks API] Delete Bookmark Success',
  props<{ bookmarkId: string }>()
);

export const deleteBookmarkFailureAction = createAction(
  '[Bookmarks API] Delete Bookmark Failure',
  props<{ error: string }>()
);

export const updateBookmarkTagsAction = createAction(
  '[Bookmarks API] Update Bookmark Tags',
  props<{ bookmarkId: string; labelIds: string[]; newLabels: string[] }>()
);

export const updateBookmarkTagsSuccessAction = createAction(
  '[Bookmarks API] Update Bookmark Tags Success',
  props<{ bookmark: Bookmark }>()
);

export const updateBookmarkTagsFailureAction = createAction(
  '[Bookmarks API] Update Bookmark Tags Failure',
  props<{ error: string }>()
);

export const createBookmarkAction = createAction('[Bookmarks API] Create Bookmark', props<{ url: string }>());

export const createBookmarkSuccessAction = createAction(
  '[Bookmarks API] Create Bookmark Success',
  props<{ bookmark: Bookmark }>()
);

export const createBookmarkFailureAction = createAction(
  '[Bookmarks API] Create Bookmark Failure',
  props<{ error: string }>()
);
