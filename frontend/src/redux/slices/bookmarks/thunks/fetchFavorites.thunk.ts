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

export const fetchFavorites = createAsyncThunk<
  Bookmark[],
  void,
  { rejectValue: ErrorType; dispatch: AppDispatch }
>("bookmarks/fetchFavorites", async (_, { rejectWithValue, dispatch }) => {
  const response = await BookmarkService.getCurrentUserList(false, true);
  if (response.error) {
    dispatch(notificationError(response.error.message));
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Bookmark[];
});

export const fetchFavoritesReducers = (
  builder: ActionReducerMapBuilder<BookmarksState>
): void => {
  builder.addCase(fetchFavorites.pending, (state) => {
    state.favorites.isLoading = true;
  });
  builder.addCase(
    fetchFavorites.fulfilled,
    (state, action: PayloadAction<Bookmark[]>) => {
      state.favorites = {
        ...state.favorites,
        isLoading: false,
        initialized: true,
        data: action.payload,
      };
    }
  );
};
