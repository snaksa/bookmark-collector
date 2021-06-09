import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ErrorType } from "../../../../services/http.service";
import BookmarkService from "../../../../services/bookmark.service";
import { BookmarksState } from "../bookmarks.slice";
import { Bookmark } from "../../../../models/bookmark.model";

export const updateBookmark = createAsyncThunk<
  Bookmark,
  { id: string; labelIds: string[]; newLabels: string[] },
  { rejectValue: ErrorType }
>("bookmarks/updateBookmark", async (data, { rejectWithValue }) => {
  const response = await BookmarkService.updateLabels(
    data.id,
    data.labelIds,
    data.newLabels
  );
  if (response.error) {
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Bookmark;
});
export const updateBookmarkReducers = (
  builder: ActionReducerMapBuilder<BookmarksState>
): void => {
  builder.addCase(
    updateBookmark.fulfilled,
    (state, action: PayloadAction<Bookmark>) => {
      state.myList.data = state.myList.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );

      state.favorites.data = state.favorites.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );

      state.archived.data = state.archived.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    }
  );
  builder.addCase(updateBookmark.rejected, (state, action) => {
    console.log("error");
  });
};
