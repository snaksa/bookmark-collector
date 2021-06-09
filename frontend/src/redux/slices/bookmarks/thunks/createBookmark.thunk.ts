import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ErrorType } from "../../../../services/http.service";
import BookmarkService from "../../../../services/bookmark.service";
import { BookmarksState } from "../bookmarks.slice";
import { Bookmark } from "../../../../models/bookmark.model";

export const createBookmark = createAsyncThunk<
  Bookmark,
  string,
  { rejectValue: ErrorType }
>("bookmarks/createBookmark", async (url, { rejectWithValue }) => {
  const response = await BookmarkService.createBookmark(url);
  if (response.error) {
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Bookmark;
});

export const createBookmarkReducers = (
  builder: ActionReducerMapBuilder<BookmarksState>
): void => {
  builder.addCase(
    createBookmark.fulfilled,
    (state, action: PayloadAction<Bookmark>) => {
      state.myList.data = [...state.myList.data, action.payload];
    }
  );
  builder.addCase(createBookmark.rejected, (state, action) => {
    console.log("error");
  });
};
