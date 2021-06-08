import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ErrorType } from "../../../../services/http.service";
import BookmarkService from "../../../../services/bookmark.service";
import { BookmarksState } from "../bookmarks.slice";
import { Bookmark } from "../../../../models/bookmark.model";

export const addBookmarkToFavorites = createAsyncThunk<
  Bookmark,
  string,
  { rejectValue: ErrorType }
>("bookmarks/addBookmarkToFavorites", async (id, { rejectWithValue }) => {
  const response = await BookmarkService.updateBookmark(id, {
    isFavorite: true,
  });
  if (response.error) {
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Bookmark;
});

export const addBookmarkToFavoritesReducer = (
  builder: ActionReducerMapBuilder<BookmarksState>
) => {
  builder.addCase(
    addBookmarkToFavorites.fulfilled,
    (state, action: PayloadAction<Bookmark>) => {
      state.myList.data = state.myList.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );

      state.favorites.data = state.favorites.data.length
        ? [...state.favorites.data, action.payload]
        : [];

      state.archived.data = state.archived.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    }
  );
  builder.addCase(addBookmarkToFavorites.rejected, (state, action) => {
    console.log("error");
  });
};
