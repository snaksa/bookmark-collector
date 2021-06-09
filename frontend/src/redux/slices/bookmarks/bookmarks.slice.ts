import { Bookmark } from "../../../models/bookmark.model";
import { createSlice } from "@reduxjs/toolkit";
import {
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
  myList: {
    isLoading: boolean;
    initialized: boolean;
    error: string;
    data: Bookmark[];
  };
  favorites: {
    isLoading: boolean;
    initialized: boolean;
    error: string;
    data: Bookmark[];
  };
  archived: {
    isLoading: boolean;
    initialized: boolean;
    error: string;
    data: Bookmark[];
  };
}

const initialState: BookmarksState = {
  myList: {
    isLoading: false,
    initialized: false,
    error: "",
    data: [],
  },
  favorites: {
    initialized: false,
    isLoading: false,
    error: "",
    data: [],
  },
  archived: {
    initialized: false,
    isLoading: false,
    error: "",
    data: [],
  },
};

export const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
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
