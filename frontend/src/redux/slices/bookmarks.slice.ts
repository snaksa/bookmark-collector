import { Bookmark } from "../../models/bookmark.model";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorType } from "../../services/http.service";
import BookmarkService from "../../services/bookmark.service";

interface BookmarksState {
  myList: {
    isLoading: boolean;
    initialized: boolean;
    error: string;
    data: Bookmark[];
  };
  favorites: {
    isLoading: boolean;
    initialized: boolean;
    error: string;
    data: Bookmark[];
  };
  archived: {
    isLoading: boolean;
    initialized: boolean;
    error: string;
    data: Bookmark[];
  };
}

const initialState: BookmarksState = {
  myList: {
    isLoading: false,
    initialized: false,
    error: "",
    data: [],
  },
  favorites: {
    initialized: false,
    isLoading: false,
    error: "",
    data: [],
  },
  archived: {
    initialized: false,
    isLoading: false,
    error: "",
    data: [],
  },
};

export const fetchCurrentUserBookmarks = createAsyncThunk<
  Bookmark[],
  void,
  { rejectValue: ErrorType }
>("bookmarks/fetchCurrentUserBookmarks", async (_, { rejectWithValue }) => {
  const response = await BookmarkService.getCurrentUserList(true);
  if (response.error) {
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Bookmark[];
});

export const fetchCurrentUserFavoriteBookmarks = createAsyncThunk<
  Bookmark[],
  void,
  { rejectValue: ErrorType }
>(
  "bookmarks/fetchCurrentUserFavoriteBookmarks",
  async (_, { rejectWithValue }) => {
    const response = await BookmarkService.getCurrentUserList(false, true);
    if (response.error) {
      return rejectWithValue(response.error as ErrorType);
    }

    return response.data as Bookmark[];
  }
);

export const fetchCurrentUserArchivedBookmarks = createAsyncThunk<
  Bookmark[],
  void,
  { rejectValue: ErrorType }
>(
  "bookmarks/fetchCurrentUserArchivedBookmarks",
  async (_, { rejectWithValue }) => {
    const response = await BookmarkService.getCurrentUserList(
      false,
      false,
      true
    );
    if (response.error) {
      return rejectWithValue(response.error as ErrorType);
    }

    return response.data as Bookmark[];
  }
);

export const createBookmark = createAsyncThunk<
  Bookmark,
  string,
  { rejectValue: ErrorType }
>("bookmarks/createBookmark", async (url, { rejectWithValue }) => {
  const response = await BookmarkService.createBookmark(url);
  if (response.error) {
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Bookmark;
});

export const addBookmarkToFavorites = createAsyncThunk<
  Bookmark,
  string,
  { rejectValue: ErrorType }
>("bookmarks/addBookmarkToFavorites", async (id, { rejectWithValue }) => {
  const response = await BookmarkService.updateBookmark(id, {
    isFavorite: true,
  });
  if (response.error) {
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Bookmark;
});

export const removeBookmarkFromFavorites = createAsyncThunk<
  Bookmark,
  string,
  { rejectValue: ErrorType }
>("bookmarks/removeBookmarkFromFavorites", async (id, { rejectWithValue }) => {
  const response = await BookmarkService.updateBookmark(id, {
    isFavorite: false,
  });
  if (response.error) {
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Bookmark;
});

export const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
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
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUserBookmarks.pending, (state) => {
      state.myList.isLoading = true;
    });
    builder.addCase(
      fetchCurrentUserBookmarks.fulfilled,
      (state, action: PayloadAction<Bookmark[]>) => {
        state.myList = {
          ...state.myList,
          isLoading: false,
          initialized: true,
          data: action.payload,
        };
      }
    );
    builder.addCase(fetchCurrentUserBookmarks.rejected, (state, action) => {
      state.myList = {
        ...state.myList,
        error: action.payload ? action.payload.message : "Something went wrong",
      };
    });

    builder.addCase(fetchCurrentUserFavoriteBookmarks.pending, (state) => {
      state.favorites.isLoading = true;
    });
    builder.addCase(
      fetchCurrentUserFavoriteBookmarks.fulfilled,
      (state, action: PayloadAction<Bookmark[]>) => {
        state.favorites = {
          ...state.favorites,
          isLoading: false,
          initialized: true,
          data: action.payload,
        };
      }
    );
    builder.addCase(
      fetchCurrentUserFavoriteBookmarks.rejected,
      (state, action) => {
        state.favorites = {
          ...state.favorites,
          error: action.payload
            ? action.payload.message
            : "Something went wrong",
        };
      }
    );

    builder.addCase(fetchCurrentUserArchivedBookmarks.pending, (state) => {
      state.archived.isLoading = true;
    });
    builder.addCase(
      fetchCurrentUserArchivedBookmarks.fulfilled,
      (state, action: PayloadAction<Bookmark[]>) => {
        state.archived = {
          ...state.archived,
          isLoading: false,
          initialized: true,
          data: action.payload,
        };
      }
    );
    builder.addCase(
      fetchCurrentUserArchivedBookmarks.rejected,
      (state, action) => {
        state.archived = {
          ...state.archived,
          error: action.payload
            ? action.payload.message
            : "Something went wrong",
        };
      }
    );

    builder.addCase(
      createBookmark.fulfilled,
      (state, action: PayloadAction<Bookmark>) => {
        state.myList.data = [...state.myList.data, action.payload];
      }
    );
    builder.addCase(createBookmark.rejected, (state, action) => {
      console.log("error");
    });

    builder.addCase(
      addBookmarkToFavorites.fulfilled,
      (state, action: PayloadAction<Bookmark>) => {
        state.myList.data = state.myList.data.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );

        state.favorites.data = state.favorites.data.length
          ? [...state.favorites.data, action.payload]
          : [];

        state.archived.data = state.archived.data.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      }
    );
    builder.addCase(addBookmarkToFavorites.rejected, (state, action) => {
      console.log("error");
    });

    builder.addCase(
      removeBookmarkFromFavorites.fulfilled,
      (state, action: PayloadAction<Bookmark>) => {
        state.myList.data = state.myList.data.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );

        state.favorites.data = state.favorites.data.filter(
          (item) => item.id !== action.payload.id
        );

        state.archived.data = state.archived.data.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      }
    );
    builder.addCase(removeBookmarkFromFavorites.rejected, (state, action) => {
      console.log("error");
    });
  },
});

export const {
  updateBookmark,
  deleteBookmark,

  addToArchivedBookmark,
  removeFromArchivedBookmark,
} = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
