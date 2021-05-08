import {
  USER_DETAILS_INITIALIZED,
  USER_DETAILS_INITIALIZING,
  USER_DETAILS_UPDATED,
} from "./user.types";

const INITIAL_STATE = {
  details: {
    isLoading: false,
    initialized: false,
    data: {
      firstName: "",
      lastName: "",
      email: "",
    },
  },
};

const reducer = (
  state = INITIAL_STATE,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case USER_DETAILS_INITIALIZING:
      return {
        ...state,
        details: {
          ...state.details,
          isLoading: true,
        },
      };
    case USER_DETAILS_INITIALIZED:
      return {
        ...state,
        details: {
          isLoading: false,
          initialized: true,
          data: { ...action.payload },
        },
      };
    case USER_DETAILS_UPDATED:
      return {
        ...state,
        details: {
          ...state.details,
          data: { ...action.payload },
        },
      };

    default:
      return state;
  }
};

export default reducer;
