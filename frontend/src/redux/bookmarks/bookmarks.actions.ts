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
    BOOKMARKS_ARCHIVED_INITIALIZING, BOOKMARKS_ARCHIVED_INITIALIZED, BOOKMARK_ADD_NEW
} from './bookmarks.types';

export const initializeBookmarks = () => {
    return {
        type: BOOKMARKS_INITIALIZING,
    };
};

export const initializedBookmarks = (bookmarks: any) => {
    return {
        type: BOOKMARKS_INITIALIZED,
        payload: bookmarks
    };
};

export const addNewBookmark = (bookmark: any) => {
    return {
        type: BOOKMARK_ADD_NEW,
        payload: bookmark
    };
};

export const addToFavoritesBookmark = (bookmark: any) => {
    return {
        type: BOOKMARK_ADD_TO_FAVORITES,
        payload: bookmark
    };
};

export const removeFromFavoritesBookmark = (bookmark: any) => {
    return {
        type: BOOKMARK_REMOVE_FROM_FAVORITES,
        payload: bookmark
    };
};

export const addToArchivedBookmark = (bookmark: any) => {
    return {
        type: BOOKMARK_ADD_TO_ARCHIVED,
        payload: bookmark
    };
};

export const removeFromArchivedBookmark = (bookmark: any) => {
    return {
        type: BOOKMARK_REMOVE_FROM_ARCHIVED,
        payload: bookmark
    };
};

export const updateBookmark = (bookmark: any) => {
    return {
        type: BOOKMARK_UPDATED,
        payload: bookmark
    };
};

export const deleteBookmark = (bookmarkId: string) => {
    return {
        type: BOOKMARK_DELETE,
        payload: bookmarkId
    };
};

export const initializeFavoriteBookmarks = () => {
    return {
        type: BOOKMARKS_FAVORITES_INITIALIZING,
    };
};

export const initializedFavoriteBookmarks = (bookmarks: any) => {
    return {
        type: BOOKMARKS_FAVORITES_INITIALIZED,
        payload: bookmarks
    };
};

export const initializeArchivedBookmarks = () => {
    return {
        type: BOOKMARKS_ARCHIVED_INITIALIZING,
    };
};

export const initializedArchivedBookmarks = (bookmarks: any) => {
    return {
        type: BOOKMARKS_ARCHIVED_INITIALIZED,
        payload: bookmarks
    };
};