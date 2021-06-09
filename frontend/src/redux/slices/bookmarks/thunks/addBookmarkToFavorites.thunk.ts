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

export const addBookmarkToFavorites = createAsyncThunk<
  Bookmark,
  string,
  { rejectValue: ErrorType; dispatch: AppDispatch }
>(
  "bookmarks/addBookmarkToFavorites",
  async (id, { rejectWithValue, dispatch }) => {
    const response = await BookmarkService.updateBookmark(id, {
      isFavorite: true,
    });
    if (response.error) {
      dispatch(notificationError(response.error.message));
      return rejectWithValue(response.error as ErrorType);
    }

    return response.data as Bookmark;
  }
);

export const addBookmarkToFavoritesReducer = (
  builder: ActionReducerMapBuilder<BookmarksState>
): void => {
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
};
