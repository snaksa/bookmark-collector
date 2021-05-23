import { Bookmark } from "../../models/bookmark.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookmarksState {
  myList: {
    isLoading: boolean;
    initialized: boolean;
    data: Bookmark[];
  };
  favorites: {
    isLoading: boolean;
    initialized: boolean;
    data: Bookmark[];
  };
  archived: {
    isLoading: boolean;
    initialized: boolean;
    data: Bookmark[];
  };
}

const initialState: BookmarksState = {
  myList: {
    isLoading: false,
    initialized: false,
    data: [],
  },
  favorites: {
    initialized: false,
    isLoading: false,
    data: [],
  },
  archived: {
    initialized: false,
    isLoading: false,
    data: [],
  },
};

export const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    initializeBookmarks: (state) => {
      state.myList.isLoading = true;
    },
    initializedBookmarks: (state, action: PayloadAction<Bookmark[]>) => {
      state.myList = {
        ...state.myList,
        isLoading: false,
        initialized: true,
        data: action.payload,
      };
    },
    addNewBookmark: (state, action: PayloadAction<Bookmark>) => {
      state.myList.data = [...state.myList.data, action.payload];
    },
    addToFavoritesBookmark: (state, action: PayloadAction<Bookmark>) => {
      state.myList.data = state.myList.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );

      state.favorites.data = state.favorites.data.length
        ? [...state.favorites.data, action.payload]
        : [];

      state.archived.data = state.archived.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeFromFavoritesBookmark: (state, action: PayloadAction<Bookmark>) => {
      state.myList.data = state.myList.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );

      state.favorites.data = state.favorites.data.filter(
        (item) => item.id !== action.payload.id
      );

      state.archived.data = state.archived.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    updateBookmark: (state, action: PayloadAction<Bookmark>) => {
      state.myList.data = state.myList.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );

      state.favorites.data = state.favorites.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );

      state.archived.data = state.archived.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    deleteBookmark: (state, action: PayloadAction<string>) => {
      state.myList.data = state.myList.data.filter(
        (item) => item.id !== action.payload
      );

      state.favorites.data = state.favorites.data.filter(
        (item) => item.id !== action.payload
      );

      state.archived.data = state.archived.data.filter(
        (item) => item.id !== action.payload
      );
    },
    initializeFavoriteBookmarks: (state) => {
      state.favorites.isLoading = true;
    },
    initializedFavoriteBookmarks: (
      state,
      action: PayloadAction<Bookmark[]>
    ) => {
      state.favorites.isLoading = false;
      state.favorites.initialized = true;
      state.favorites.data = action.payload;
    },
    initializeArchivedBookmarks: (state) => {
      state.archived.isLoading = true;
    },
    initializedArchivedBookmarks: (
      state,
      action: PayloadAction<Bookmark[]>
    ) => {
      state.archived.isLoading = false;
      state.archived.initialized = true;
      state.archived.data = action.payload;
    },

    addToArchivedBookmark: (state, action: PayloadAction<Bookmark>) => {
      state.myList.data = state.myList.data.filter(
        (item) => item.id !== action.payload.id
      );

      state.favorites.data = state.favorites.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );

      state.archived.data = state.archived.data.length
        ? [...state.archived.data, action.payload]
        : [];
    },
    removeFromArchivedBookmark: (state, action: PayloadAction<Bookmark>) => {
      state.myList.data = [...state.myList.data, action.payload];

      state.favorites.data = state.favorites.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );

      state.archived.data = state.archived.data.filter(
        (item) => item.id !== action.payload.id
      );
    },
  },
});

export const {
  initializeBookmarks,
  initializedBookmarks,
  addNewBookmark,
  updateBookmark,
  deleteBookmark,

  initializeFavoriteBookmarks,
  initializedFavoriteBookmarks,
  addToFavoritesBookmark,
  removeFromFavoritesBookmark,

  initializeArchivedBookmarks,
  initializedArchivedBookmarks,
  addToArchivedBookmark,
  removeFromArchivedBookmark,
} = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
