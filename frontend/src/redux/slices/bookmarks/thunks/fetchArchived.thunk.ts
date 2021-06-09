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

export const fetchArchived = createAsyncThunk<
  Bookmark[],
  void,
  { rejectValue: ErrorType; dispatch: AppDispatch }
>("bookmarks/fetchArchived", async (_, { rejectWithValue, dispatch }) => {
  const response = await BookmarkService.getCurrentUserList(false, false, true);
  if (response.error) {
    dispatch(notificationError(response.error.message));
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Bookmark[];
});

export const fetchArchivedReducers = (
  builder: ActionReducerMapBuilder<BookmarksState>
): void => {
  builder.addCase(fetchArchived.pending, (state) => {
    state.archived.isLoading = true;
  });
  builder.addCase(
    fetchArchived.fulfilled,
    (state, action: PayloadAction<Bookmark[]>) => {
      state.archived = {
        ...state.archived,
        isLoading: false,
        initialized: true,
        data: action.payload,
      };
    }
  );
};
