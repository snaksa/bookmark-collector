import { createSlice } from "@reduxjs/toolkit";
import { fetchUserDetailsReducers } from "./thunks/fetchUserDetails.thunk";

export interface UsersState {
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

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    fetchUserDetailsReducers(builder);
  },
});

export default usersSlice.reducer;
