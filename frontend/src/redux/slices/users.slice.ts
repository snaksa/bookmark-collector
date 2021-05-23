import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../models/user.model";

interface UsersState {
  details: {
    isLoading: boolean;
    initialized: boolean;
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
    data: {
      firstName: "",
      lastName: "",
      email: "",
      id: "",
    },
  },
};

export const usersSlice = createSlice({
  name: "labels",
  initialState,
  reducers: {
    initializeUserDetails: (state) => {
      state.details.isLoading = true;
    },
    initializedUserDetails: (state, action: PayloadAction<User>) => {
      state.details = {
        ...state.details,
        isLoading: false,
        initialized: true,
        data: action.payload,
      };
    },
    updateUserDetails: (state, action: PayloadAction<User>) => {
      state.details = {
        ...state.details,
        data: action.payload,
      };
    },
  },
});

export const {
  initializeUserDetails,
  initializedUserDetails,
  updateUserDetails,
} = usersSlice.actions;

export default usersSlice.reducer;
