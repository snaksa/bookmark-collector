import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ErrorType } from "../../../../services/http.service";
import BookmarkService from "../../../../services/bookmark.service";
import { BookmarksState } from "../bookmarks.slice";
import { Bookmark } from "../../../../models/bookmark.model";
import { AppDispatch } from "../../../store";
import { notificationError } from "../../notifications/notifications.slice";

export const createBookmark = createAsyncThunk<
  Bookmark,
  string,
  { rejectValue: ErrorType; dispatch: AppDispatch }
>("bookmarks/createBookmark", async (url, { rejectWithValue, dispatch }) => {
  const response = await BookmarkService.createBookmark(url);
  if (response.error) {
    dispatch(notificationError(response.error.message));
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
};
