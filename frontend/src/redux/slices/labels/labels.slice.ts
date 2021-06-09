import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bookmark } from "../../../models/bookmark.model";
import { Label } from "../../../models/label.model";
import { fetchLabelsReducers, fetchLabelDetailsReducers } from "./thunks";

export interface LabelsState {
  list: {
    isLoading: boolean;
    initialized: boolean;
    data: Label[];
  };
  details: {
    isLoading: boolean;
    data: {
      title: string;
      color: string;
      bookmarks: Bookmark[];
    };
  };
}

const initialState: LabelsState = {
  list: {
    isLoading: false,
    initialized: false,
    data: [],
  },
  details: {
    isLoading: false,
    data: {
      title: "",
      color: "",
      bookmarks: [],
    },
  },
};

export const labelsSlice = createSlice({
  name: "labels",
  initialState,
  reducers: {
    updateLabelsDetailsBookmark: (
      state,
      action: PayloadAction<{ bookmarkId: string; data: Partial<Bookmark> }>
    ) => {
      state.details.data.bookmarks = state.details.data.bookmarks.map(
        (bookmark) =>
          bookmark.id === action.payload.bookmarkId
            ? { ...bookmark, ...action.payload.data }
            : bookmark
      );
    },
    deleteLabelsDetailsBookmark: (state, action: PayloadAction<string>) => {
      state.details.data.bookmarks = state.details.data.bookmarks.filter(
        (bookmark) => bookmark.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    fetchLabelsReducers(builder);
    fetchLabelDetailsReducers(builder);
  },
});

export const {
  deleteLabelsDetailsBookmark,
  updateLabelsDetailsBookmark,
} = labelsSlice.actions;

export default labelsSlice.reducer;
