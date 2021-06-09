import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ErrorType } from "../../../../services/http.service";
import BookmarkService from "../../../../services/bookmark.service";
import { BookmarksState } from "../bookmarks.slice";

export const deleteBookmark = createAsyncThunk<
  string,
  string,
  { rejectValue: ErrorType }
>("bookmarks/deleteBookmark", async (id, { rejectWithValue }) => {
  const response = await BookmarkService.deleteBookmark(id);
  if (response.error) {
    return rejectWithValue(response.error as ErrorType);
  }

  return id;
});

export const deleteBookmarkReducers = (
  builder: ActionReducerMapBuilder<BookmarksState>
): void => {
  builder.addCase(
    deleteBookmark.fulfilled,
    (state, action: PayloadAction<string>) => {
      state.myList.data = state.myList.data.filter(
        (item) => item.id !== action.payload
      );

      state.favorites.data = state.favorites.data.filter(
        (item) => item.id !== action.payload
      );

      state.archived.data = state.archived.data.filter(
        (item) => item.id !== action.payload
      );
    }
  );
  builder.addCase(deleteBookmark.rejected, (state, action) => {
    console.log("error");
  });
};
