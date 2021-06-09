import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ErrorType } from "../../../../services/http.service";
import { UsersState } from "../users.slice";
import { User } from "../../../../models/user.model";
import UserService from "../../../../services/user.service";
import { notificationError } from "../../notifications/notifications.slice";
import { AppDispatch } from "../../../store";

type UpdateUserDetailsType = {
  email: string;
  firstName: string;
  lastName: string;
};

export const updateUserDetails = createAsyncThunk<
  User,
  UpdateUserDetailsType,
  { rejectValue: ErrorType; dispatch: AppDispatch }
>("users/updateUserDetails", async (data, { rejectWithValue, dispatch }) => {
  const response = await UserService.updateUserDetails(data);
  if (response.error) {
    dispatch(notificationError(response.error.message));
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as User;
});

export const updateUserDetailsReducers = (
  builder: ActionReducerMapBuilder<UsersState>
): void => {
  builder.addCase(
    updateUserDetails.fulfilled,
    (state, action: PayloadAction<User>) => {
      state.details = {
        ...state.details,
        data: action.payload,
      };
    }
  );
};
