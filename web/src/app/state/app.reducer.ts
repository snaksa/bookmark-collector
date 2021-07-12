import { createReducer, on } from '@ngrx/store';
import {
  loadUserAction,
  loadUserFailureAction,
  loadUserSuccessAction,
  updateUserAction,
  updateUserFailureAction,
  updateUserSuccessAction,
} from './app.actions';
import { ApplicationState } from './app.state';

const initialState: ApplicationState = {
  currentUser: {
    isLoading: false,
    isInitialized: false,
    data: {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
    },
    error: '',
    updating: false,
  },
};

export const appReducer = createReducer<ApplicationState>(
  initialState,
  on(loadUserAction, (state, action) => {
    return {
      ...state,
      currentUser: {
        ...state.currentUser,
        isLoading: true,
      },
    };
  }),
  on(loadUserSuccessAction, (state, action) => {
    return {
      ...state,
      currentUser: {
        ...state.currentUser,
        isLoading: false,
        isInitialized: true,
        data: action.user,
      },
    };
  }),
  on(loadUserFailureAction, (state, action) => {
    return {
      ...state,
      currentUser: {
        ...state.currentUser,
        isLoading: false,
        isInitialized: true,
        error: action.error,
      },
    };
  }),
  on(updateUserAction, (state, action) => {
    return {
      ...state,
      currentUser: {
        ...state.currentUser,
        updating: true,
      },
    };
  }),
  on(updateUserSuccessAction, (state, action) => {
    return {
      ...state,
      currentUser: {
        ...state.currentUser,
        updating: false,
        data: action.user,
      },
    };
  }),
  on(updateUserFailureAction, (state, action) => {
    return {
      ...state,
      currentUser: {
        ...state.currentUser,
        updating: false,
        error: action.error,
      },
    };
  })
);
