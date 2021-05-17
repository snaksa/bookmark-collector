import { Bookmark } from "../../models/bookmark.model";
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

interface ActionResponse {
  type: string;
}

export const initializeBookmarks = (): ActionResponse => {
  return {
    type: BOOKMARKS_INITIALIZING,
  };
};

export const initializedBookmarks = (
  bookmarks: Bookmark[]
): ActionResponse & { payload: Bookmark[] } => {
  return {
    type: BOOKMARKS_INITIALIZED,
    payload: bookmarks,
  };
};

export const addNewBookmark = (
  bookmark: Bookmark
): ActionResponse & { payload: Bookmark } => {
  return {
    type: BOOKMARK_ADD_NEW,
    payload: bookmark,
  };
};

export const addToFavoritesBookmark = (
  bookmark: Bookmark
): ActionResponse & { payload: Bookmark } => {
  return {
    type: BOOKMARK_ADD_TO_FAVORITES,
    payload: bookmark,
  };
};

export const removeFromFavoritesBookmark = (
  bookmark: Bookmark
): ActionResponse & { payload: Bookmark } => {
  return {
    type: BOOKMARK_REMOVE_FROM_FAVORITES,
    payload: bookmark,
  };
};

export const addToArchivedBookmark = (
  bookmark: Bookmark
): ActionResponse & { payload: Bookmark } => {
  return {
    type: BOOKMARK_ADD_TO_ARCHIVED,
    payload: bookmark,
  };
};

export const removeFromArchivedBookmark = (
  bookmark: Bookmark
): ActionResponse & { payload: Bookmark } => {
  return {
    type: BOOKMARK_REMOVE_FROM_ARCHIVED,
    payload: bookmark,
  };
};

export const updateBookmark = (
  bookmark: Bookmark
): ActionResponse & { payload: Bookmark } => {
  return {
    type: BOOKMARK_UPDATED,
    payload: bookmark,
  };
};

export const deleteBookmark = (
  bookmarkId: string
): ActionResponse & { payload: string } => {
  return {
    type: BOOKMARK_DELETE,
    payload: bookmarkId,
  };
};

export const initializeFavoriteBookmarks = (): ActionResponse => {
  return {
    type: BOOKMARKS_FAVORITES_INITIALIZING,
  };
};

export const initializedFavoriteBookmarks = (
  bookmarks: Bookmark[]
): ActionResponse & { payload: Bookmark[] } => {
  return {
    type: BOOKMARKS_FAVORITES_INITIALIZED,
    payload: bookmarks,
  };
};

export const initializeArchivedBookmarks = (): ActionResponse => {
  return {
    type: BOOKMARKS_ARCHIVED_INITIALIZING,
  };
};

export const initializedArchivedBookmarks = (
  bookmarks: Bookmark[]
): ActionResponse & { payload: Bookmark[] } => {
  return {
    type: BOOKMARKS_ARCHIVED_INITIALIZED,
    payload: bookmarks,
  };
};
