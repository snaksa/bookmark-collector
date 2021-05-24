import { combineReducers } from "redux";
import bookmarksReducer from "./slices/bookmarks.slice";
import labelsReducer from "./slices/labels.slice";
import userReducer from "./slices/users.slice";
import { AnyAction } from "@reduxjs/toolkit";

const appReducer = combineReducers({
  bookmarks: bookmarksReducer,
  labels: labelsReducer,
  user: userReducer,
});

type RootState = ReturnType<typeof appReducer>;

const rootReducer = (
  state: RootState | undefined,
  action: AnyAction
): RootState => {
  if (action.type === "app/logout") {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
