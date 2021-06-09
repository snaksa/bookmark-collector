import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationsState {
  data: {
    message: string;
    timestamp: number;
  };
}

const initialState: NotificationsState = {
  data: {
    message: "",
    timestamp: 0,
  },
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    notificationError: (state, action: PayloadAction<string>) => {
      state.data = {
        message: action.payload,
        timestamp: Date.now(),
      };
    },
  },
});

export const { notificationError } = notificationsSlice.actions;

export default notificationsSlice.reducer;
