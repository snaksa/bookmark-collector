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

export const fetchBookmarkDetails = createAsyncThunk<
  Bookmark,
  string,
  { rejectValue: ErrorType; dispatch: AppDispatch }
>(
  "bookmarks/fetchBookmarkDetails",
  async (id, { rejectWithValue, dispatch }) => {
    const response = await BookmarkService.getBookmarkDetails(id);
    if (response.error) {
      dispatch(notificationError(response.error.message));
      return rejectWithValue(response.error as ErrorType);
    }

    return response.data as Bookmark;
  }
);

export const fetchBookmarkDetailsReducers = (
  builder: ActionReducerMapBuilder<BookmarksState>
): void => {
  builder.addCase(fetchBookmarkDetails.pending, (state) => {
    state.details.isLoading = true;
  });

  builder.addCase(
    fetchBookmarkDetails.fulfilled,
    (state, action: PayloadAction<Bookmark>) => {
      state.details = {
        ...state.details,
        isLoading: false,
        data: action.payload,
      };
    }
  );
};
