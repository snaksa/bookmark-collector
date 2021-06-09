import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ErrorType } from "../../../../services/http.service";
import BookmarkService from "../../../../services/bookmark.service";
import { BookmarksState } from "../bookmarks.slice";
import { Bookmark } from "../../../../models/bookmark.model";

export const removeBookmarkFromFavorites = createAsyncThunk<
  Bookmark,
  string,
  { rejectValue: ErrorType }
>("bookmarks/removeBookmarkFromFavorites", async (id, { rejectWithValue }) => {
  const response = await BookmarkService.updateBookmark(id, {
    isFavorite: false,
  });
  if (response.error) {
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Bookmark;
});

export const removeBookmarkFromFavoritesReducer = (
  builder: ActionReducerMapBuilder<BookmarksState>
): void => {
  builder.addCase(
    removeBookmarkFromFavorites.fulfilled,
    (state, action: PayloadAction<Bookmark>) => {
      state.myList.data = state.myList.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );

      state.favorites.data = state.favorites.data.filter(
        (item) => item.id !== action.payload.id
      );

      state.archived.data = state.archived.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    }
  );
  builder.addCase(removeBookmarkFromFavorites.rejected, (state, action) => {
    console.log("error");
  });
};
