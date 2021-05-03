import { combineReducers } from "redux";
import bookmarksReducer from "./bookmarks/bookmarks.reducer";

const rootReducer = combineReducers({
  bookmarks: bookmarksReducer,
});

export default rootReducer;
