import { createReducer, on } from '@ngrx/store';
import { UsersState } from './users.state';
import { loadUserAction, loadUserFailureAction, loadUserSuccessAction } from './users.actions';

const initialState: UsersState = {
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

export const usersReducer = createReducer<UsersState>(
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
