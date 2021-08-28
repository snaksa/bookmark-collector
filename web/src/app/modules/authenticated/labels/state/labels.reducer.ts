import { createReducer, on } from '@ngrx/store';
import {
  loadLabelsAction,
  loadLabelsFailureAction,
  loadLabelsSuccessAction,
  updateNewLabelsAction,
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
  }),
  on(updateNewLabelsAction, (state, action) => {
    const data = [...state.data];

    action.labels.map(label => {
      const exists = data.find(item => item.id === label.id);
      if(!exists) {
        data.push(label);
      }
    })

    return {
      ...state,
      data: data
    };
  })
);
