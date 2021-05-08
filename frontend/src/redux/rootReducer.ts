import { combineReducers } from "redux";
import bookmarksReducer from "./bookmarks/bookmarks.reducer";
import labelsReducer from "./labels/labels.reducer";
import userReducer from "./user/user.reducer";

const rootReducer = combineReducers({
  bookmarks: bookmarksReducer,
  labels: labelsReducer,
  user: userReducer,
});

export default rootReducer;
