import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../models/user.model";
import UserService from "../../services/user.service";
import { ErrorType } from "../../services/http.service";

interface UsersState {
  details: {
    isLoading: boolean;
    initialized: boolean;
    error: string;
    data: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  };
}

const initialState: UsersState = {
  details: {
    isLoading: false,
    initialized: false,
    error: "",
    data: {
      id: "",
      email: "",
      firstName: "",
      lastName: "",
    },
  },
};

export const fetchDetails = createAsyncThunk<
  User,
  void,
  { rejectValue: ErrorType }
>("users/fetchDetails", async (_, { rejectWithValue }) => {
  const response = await UserService.details();
  if (response.error) {
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as User;
});

export const usersSlice = createSlice({
  name: "labels",
  initialState,
  reducers: {
    updateUserDetails: (state, action: PayloadAction<User>) => {
      state.details = {
        ...state.details,
        data: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDetails.pending, (state) => {
      state.details.isLoading = true;
    });

    builder.addCase(
      fetchDetails.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.details = {
          ...state.details,
          isLoading: false,
          initialized: true,
          data: action.payload,
        };
      }
    );

    builder.addCase(fetchDetails.rejected, (state, action) => {
      state.details = {
        ...state.details,
        error: action.payload ? action.payload.message : "Something went wrong",
      };
    });
  },
});

export const { updateUserDetails } = usersSlice.actions;

export default usersSlice.reducer;
