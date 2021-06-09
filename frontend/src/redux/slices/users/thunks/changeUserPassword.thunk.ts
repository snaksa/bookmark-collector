import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorType } from "../../../../services/http.service";
import { User } from "../../../../models/user.model";
import UserService from "../../../../services/user.service";
import { notificationError } from "../../notifications/notifications.slice";
import { AppDispatch } from "../../../store";

type ChangeUserPasswordType = {
  oldPassword: string;
  newPassword: string;
};

export const changeUserPassword = createAsyncThunk<
  User,
  ChangeUserPasswordType,
  { rejectValue: ErrorType; dispatch: AppDispatch }
>("users/changeUserPassword", async (data, { rejectWithValue, dispatch }) => {
  const response = await UserService.changePassword(
    data.oldPassword,
    data.newPassword
  );
  if (response.error) {
    dispatch(notificationError(response.error.message));
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as User;
});
