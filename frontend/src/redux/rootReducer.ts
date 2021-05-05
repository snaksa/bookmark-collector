import { combineReducers } from "redux";
import bookmarksReducer from "./bookmarks/bookmarks.reducer";
import labelsReducer from "./labels/labels.reducer";

const rootReducer = combineReducers({
  bookmarks: bookmarksReducer,
  labels: labelsReducer,
});

export default rootReducer;
