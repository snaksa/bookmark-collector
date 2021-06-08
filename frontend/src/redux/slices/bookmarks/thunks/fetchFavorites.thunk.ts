import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ErrorType } from "../../../../services/http.service";
import BookmarkService from "../../../../services/bookmark.service";
import { BookmarksState } from "../bookmarks.slice";
import { Bookmark } from "../../../../models/bookmark.model";

export const fetchFavorites = createAsyncThunk<
  Bookmark[],
  void,
  { rejectValue: ErrorType }
>("bookmarks/fetchFavorites", async (_, { rejectWithValue }) => {
  const response = await BookmarkService.getCurrentUserList(false, true);
  if (response.error) {
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Bookmark[];
});

export const fetchFavoritesReducers = (
  builder: ActionReducerMapBuilder<BookmarksState>
) => {
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
  builder.addCase(fetchFavorites.rejected, (state, action) => {
    state.favorites = {
      ...state.favorites,
      error: action.payload ? action.payload.message : "Something went wrong",
    };
  });
};
