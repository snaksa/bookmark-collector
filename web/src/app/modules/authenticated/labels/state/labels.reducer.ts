import { createReducer, on } from '@ngrx/store';
import {
  loadLabelsAction,
  loadLabelsFailureAction,
  loadLabelsSuccessAction,
} from './labels.actions';
import { LabelsState } from './labels.state';

const initialState: LabelsState = {
  isLoading: false,
  isInitialized: false,
  data: [],
  error: '',
};

export const labelsReducer = createReducer<LabelsState>(
  initialState,
  on(loadLabelsAction, (state, action) => {
    return {
      ...state,
      isLoading: true,
    };
  }),
  on(loadLabelsSuccessAction, (state, action) => {
    return {
      ...state,
      isLoading: false,
      isInitialized: true,
      data: action.labels,
    };
  }),
  on(loadLabelsFailureAction, (state, action) => {
    return {
      ...state,
      isLoading: false,
      isInitialized: true,
      error: action.error,
    };
  })
);
