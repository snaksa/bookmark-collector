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

export const fetchMyList = createAsyncThunk<
  Bookmark[],
  void,
  { rejectValue: ErrorType; dispatch: AppDispatch }
>("bookmarks/fetchMyList", async (_, { rejectWithValue, dispatch }) => {
  const response = await BookmarkService.getCurrentUserList(true);
  if (response.error) {
    dispatch(notificationError(response.error.message));
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Bookmark[];
});

export const fetchMyListReducers = (
  builder: ActionReducerMapBuilder<BookmarksState>
): void => {
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
};
