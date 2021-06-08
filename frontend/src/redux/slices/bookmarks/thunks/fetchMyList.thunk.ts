import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ErrorType } from "../../../../services/http.service";
import BookmarkService from "../../../../services/bookmark.service";
import { BookmarksState } from "../bookmarks.slice";
import { Bookmark } from "../../../../models/bookmark.model";

export const fetchMyList = createAsyncThunk<
  Bookmark[],
  void,
  { rejectValue: ErrorType }
>("bookmarks/fetchMyList", async (_, { rejectWithValue }) => {
  const response = await BookmarkService.getCurrentUserList(true);
  if (response.error) {
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Bookmark[];
});

export const fetchMyListReducers = (
  builder: ActionReducerMapBuilder<BookmarksState>
) => {
  builder.addCase(fetchMyList.pending, (state) => {
    state.myList.isLoading = true;
  });

  builder.addCase(
    fetchMyList.fulfilled,
    (state, action: PayloadAction<Bookmark[]>) => {
      state.myList = {
        ...state.myList,
        isLoading: false,
        initialized: true,
        data: action.payload.map((b) => b),
      };
    }
  );

  builder.addCase(fetchMyList.rejected, (state, action) => {
    state.myList = {
      ...state.myList,
      error: action.payload ? action.payload.message : "Something went wrong",
    };
  });
};
