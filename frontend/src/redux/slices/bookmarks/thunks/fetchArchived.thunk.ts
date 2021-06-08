import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ErrorType } from "../../../../services/http.service";
import BookmarkService from "../../../../services/bookmark.service";
import { BookmarksState } from "../bookmarks.slice";
import { Bookmark } from "../../../../models/bookmark.model";

export const fetchArchived = createAsyncThunk<
  Bookmark[],
  void,
  { rejectValue: ErrorType }
>("bookmarks/fetchArchived", async (_, { rejectWithValue }) => {
  const response = await BookmarkService.getCurrentUserList(false, false, true);
  if (response.error) {
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Bookmark[];
});

export const fetchArchivedReducers = (
  builder: ActionReducerMapBuilder<BookmarksState>
) => {
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
  builder.addCase(fetchArchived.rejected, (state, action) => {
    state.archived = {
      ...state.archived,
      error: action.payload ? action.payload.message : "Something went wrong",
    };
  });
};
