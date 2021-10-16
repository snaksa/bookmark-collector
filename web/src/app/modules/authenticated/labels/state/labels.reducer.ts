import { createReducer, on } from '@ngrx/store';
import {
  deleteLabelAction, deleteLabelFailureAction, deleteLabelSuccessAction,
  loadLabelsAction,
  loadLabelsFailureAction,
  loadLabelsSuccessAction, updateLabelFailureAction, updateLabelSuccessAction,
  updateNewLabelsAction
} from './labels.actions';
import { LabelsState } from './labels.state';

const initialState: LabelsState = {
  isLoading: false,
  isInitialized: false,
  data: [],
  error: ''
};

export const labelsReducer = createReducer<LabelsState>(
  initialState,
  on(loadLabelsAction, (state, action) => {
    return {
      ...state,
      isLoading: true
    };
  }),
  on(loadLabelsSuccessAction, (state, action) => {
    return {
      ...state,
      isLoading: false,
      isInitialized: true,
      data: action.labels
    };
  }),
  on(loadLabelsFailureAction, (state, action) => {
    return {
      ...state,
      isLoading: false,
      isInitialized: true,
      error: action.error
    };
  }),
  on(deleteLabelAction, (state, action) => {
    return {
      ...state
    };
  }),
  on(deleteLabelSuccessAction, (state, action) => {
    return {
      ...state,
      data: state.data.filter(label => label.id !== action.id)
    };
  }),
  on(deleteLabelFailureAction, (state, action) => {
    return {
      ...state,
      error: action.error
    };
  }),
  on(updateNewLabelsAction, (state, action) => {
    const data = [...state.data];

    action.labels.map(label => {
      const exists = data.find(item => item.id === label.id);
      if (!exists) {
        data.push(label);
      }
    });

    return {
      ...state,
      data: data
    };
  }),
  on(updateLabelSuccessAction, (state, action) => {
    return {
      ...state,
      data: state.data.map(label => label.id !== action.id ? label : {
        ...label,
        title: action.title
      })
    };
  }),
  on(updateLabelFailureAction, (state, action) => {
    return {
      ...state,
      error: action.error
    };
  })
);
