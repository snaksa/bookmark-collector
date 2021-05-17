import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bookmark } from "../../models/bookmark.model";
import { Label } from "../../models/label.model";

interface LabelsState {
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
    initializeLabels: (state) => {
      state.list.isLoading = true;
    },
    initializedLabels: (state, action: PayloadAction<Label[]>) => {
      state.list.isLoading = false;
      state.list.initialized = true;
      state.list.data = action.payload;
    },
    initializeLabelsDetails: (state) => {
      state.details.isLoading = true;
    },
    initializedLabelsDetails: (state, action: PayloadAction<Label>) => {
      state.details.isLoading = false;
      state.details.data = action.payload;
    },
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
});

export const {
  initializeLabels,
  initializedLabels,
  initializeLabelsDetails,
  initializedLabelsDetails,
  deleteLabelsDetailsBookmark,
  updateLabelsDetailsBookmark,
} = labelsSlice.actions;

export default labelsSlice.reducer;
