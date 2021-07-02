import {AppState} from "./app.state";
import {createReducer, on} from "@ngrx/store";
import {loadLabelsAction, loadLabelsFailureAction, loadLabelsSuccessAction} from "./app.actions";

const initialState: AppState = {
  labels: {
    isLoading: false,
    isInitialized: false,
    data: [],
    error: '',
  }
};

export const appReducer = createReducer<AppState>(
  initialState,
  on(loadLabelsAction, (state, action) => {
    return {
      ...state,
      labels: {
        ...state.labels,
        isLoading: true,
      }
    };
  }),
  on(loadLabelsSuccessAction, (state, action) => {
    return {
      ...state,
      labels: {
        ...state.labels,
        isLoading: false,
        isInitialized: true,
        data: action.labels,
      }
    };
  }),
  on(loadLabelsFailureAction, (state, action) => {
    return {
      ...state,
      labels: {
        ...state.labels,
        isLoading: false,
        isInitialized: true,
        error: action.error,
      }
    };
  }),
);
