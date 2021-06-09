import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ErrorType } from "../../../../services/http.service";
import { UsersState } from "../users.slice";
import { User } from "../../../../models/user.model";
import UserService from "../../../../services/user.service";

export const fetchUserDetails = createAsyncThunk<
  User,
  void,
  { rejectValue: ErrorType }
>("users/fetchDetails", async (_, { rejectWithValue }) => {
  const response = await UserService.getCurrentUserDetails();
  if (response.error) {
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as User;
});

export const fetchUserDetailsReducers = (
  builder: ActionReducerMapBuilder<UsersState>
): void => {
  builder.addCase(fetchUserDetails.pending, (state) => {
    state.details.isLoading = true;
  });

  builder.addCase(
    fetchUserDetails.fulfilled,
    (state, action: PayloadAction<User>) => {
      state.details = {
        ...state.details,
        isLoading: false,
        initialized: true,
        data: action.payload,
      };
    }
  );

  builder.addCase(fetchUserDetails.rejected, (state, action) => {
    console.log("error");
  });
};
