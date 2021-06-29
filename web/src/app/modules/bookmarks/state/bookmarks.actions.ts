import { createAction, props } from '@ngrx/store';
import { Bookmark } from '../../shared/models/bookmark.model';
import { BookmarkType } from './bookmark-type.enum';

export const loadBookmarksAction = createAction(
  '[Bookmarks API] Load List',
  props<{ key: BookmarkType }>()
);

export const loadBookmarksSuccessAction = createAction(
  '[Bookmarks API] Load List Success',
  props<{ bookmarks: Bookmark[]; key: BookmarkType }>()
);

export const loadBookmarksFailureAction = createAction(
  '[Bookmarks API] Load List Failure',
  props<{ error: string; key: BookmarkType }>()
);
