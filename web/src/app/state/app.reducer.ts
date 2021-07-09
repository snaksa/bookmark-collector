import { createReducer, on } from '@ngrx/store';
import { loadUserAction, loadUserFailureAction, loadUserSuccessAction } from './app.actions';
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
  })
);
