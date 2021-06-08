import { Bookmark } from "../../../models/bookmark.model";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ErrorType } from "../../../services/http.service";
import BookmarkService from "../../../services/bookmark.service";
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

export const removeBookmarkFromArchived = createAsyncThunk<
  Bookmark,
  string,
  { rejectValue: ErrorType }
>("bookmarks/removeBookmarkFromArchived", async (id, { rejectWithValue }) => {
  const response = await BookmarkService.updateBookmark(id, {
    isArchived: false,
  });
  if (response.error) {
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Bookmark;
});

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
