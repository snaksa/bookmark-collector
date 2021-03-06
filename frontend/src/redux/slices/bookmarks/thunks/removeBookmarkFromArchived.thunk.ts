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

export const removeBookmarkFromArchived = createAsyncThunk<
  Bookmark,
  string,
  { rejectValue: ErrorType; dispatch: AppDispatch }
>(
  "bookmarks/removeBookmarkFromArchived",
  async (id, { rejectWithValue, dispatch }) => {
    const response = await BookmarkService.updateBookmark(id, {
      isArchived: false,
    });
    if (response.error) {
      dispatch(notificationError(response.error.message));
      return rejectWithValue(response.error as ErrorType);
    }

    return response.data as Bookmark;
  }
);

export const removeBookmarkFromArchivedReducer = (
  builder: ActionReducerMapBuilder<BookmarksState>
): void => {
  builder.addCase(
    removeBookmarkFromArchived.fulfilled,
    (state, action: PayloadAction<Bookmark>) => {
      state.myList.data = [...state.myList.data, action.payload];

      state.favorites.data = state.favorites.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );

      state.archived.data = state.archived.data.filter(
        (item) => item.id !== action.payload.id
      );
    }
  );
};
