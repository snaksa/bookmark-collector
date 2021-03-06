import { Bookmark } from "../../../models/bookmark.model";
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBookmarkDetailsReducers,
  fetchMyListReducers,
  fetchFavoritesReducers,
  fetchArchivedReducers,
  createBookmarkReducers,
  updateBookmarkReducers,
  deleteBookmarkReducers,
  addBookmarkToFavoritesReducer,
  removeBookmarkFromFavoritesReducer,
  addBookmarkToArchivedReducer,
  removeBookmarkFromArchivedReducer,
} from "./thunks";

export interface BookmarksState {
  details: {
    isLoading: boolean;
    data: Bookmark | null;
  };
  myList: {
    isLoading: boolean;
    initialized: boolean;
    data: Bookmark[];
  };
  favorites: {
    isLoading: boolean;
    initialized: boolean;
    data: Bookmark[];
  };
  archived: {
    isLoading: boolean;
    initialized: boolean;
    data: Bookmark[];
  };
}

const initialState: BookmarksState = {
  details: {
    isLoading: false,
    data: null,
  },
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

export const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    fetchBookmarkDetailsReducers(builder);
    fetchMyListReducers(builder);
    fetchFavoritesReducers(builder);
    fetchArchivedReducers(builder);

    createBookmarkReducers(builder);
    updateBookmarkReducers(builder);
    deleteBookmarkReducers(builder);

    addBookmarkToFavoritesReducer(builder);
    removeBookmarkFromFavoritesReducer(builder);

    addBookmarkToArchivedReducer(builder);
    removeBookmarkFromArchivedReducer(builder);
  },
});

export default bookmarksSlice.reducer;
