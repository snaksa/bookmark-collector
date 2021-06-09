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

export const addBookmarkToArchived = createAsyncThunk<
  Bookmark,
  string,
  { rejectValue: ErrorType; dispatch: AppDispatch }
>(
  "bookmarks/addBookmarkToArchived",
  async (id, { rejectWithValue, dispatch }) => {
    const response = await BookmarkService.updateBookmark(id, {
      isArchived: true,
    });
    if (response.error) {
      dispatch(notificationError(response.error.message));
      return rejectWithValue(response.error as ErrorType);
    }

    return response.data as Bookmark;
  }
);

export const addBookmarkToArchivedReducer = (
  builder: ActionReducerMapBuilder<BookmarksState>
): void => {
  builder.addCase(
    addBookmarkToArchived.fulfilled,
    (state, action: PayloadAction<Bookmark>) => {
      state.myList.data = state.myList.data.filter(
        (item) => item.id !== action.payload.id
      );

      state.favorites.data = state.favorites.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );

      state.archived.data = state.archived.data.length
        ? [...state.archived.data, action.payload]
        : [];
    }
  );
};
