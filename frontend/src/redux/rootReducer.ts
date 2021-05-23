import { combineReducers } from "redux";
import bookmarksReducer from "./slices/bookmarks.slice";
import labelsReducer from "./slices/labels.slice";
import userReducer from "./slices/users.slice";

const rootReducer = combineReducers({
  bookmarks: bookmarksReducer,
  labels: labelsReducer,
  user: userReducer,
});

export default rootReducer;
