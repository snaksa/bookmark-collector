import {
  USER_DETAILS_INITIALIZED,
  USER_DETAILS_INITIALIZING,
  USER_DETAILS_UPDATED,
} from "./user.types";

export const initializeUserDetails = () => {
  return {
    type: USER_DETAILS_INITIALIZING,
  };
};

export const initializedUserDetails = (data: any) => {
  return {
    type: USER_DETAILS_INITIALIZED,
    payload: data,
  };
};

export const updateUserDetails = (data: any) => {
  return {
    type: USER_DETAILS_UPDATED,
    payload: data,
  };
};
