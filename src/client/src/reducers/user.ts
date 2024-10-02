/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ALL_USERS_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  CLEAR_ERRORS,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_FAIL,
  LOGOUT_USER_SUCCESS,
  REGISTER_USER_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_RESET,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_RESET,
  UPDATE_PROFILE_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  FORGOT_PASSWORD_RESET,
} from "../constants/user";
import { USER } from "../types";
import LocalForageProvider from "../utils/localforage";
import { USER_ROOT_STATE } from "../types";

const initialState: Partial<USER> = {
  username: undefined,
  shortname: undefined,
  email: undefined,
  phonenumber: undefined,
  connections: [],
  bio: undefined,
  referralCode: undefined,
  role: undefined,
  avatar: undefined,
  articles: [],
  savedArticles: [],
  tokenBalance: 0,
  social_handles: undefined,
};

export const userReducer = (
  state: USER_ROOT_STATE["user"] = { user: initialState },
  { type, payload }: { type: string; payload: any }
) => {
  switch (type) {
    case LOGIN_USER_REQUEST:
    case REGISTER_USER_REQUEST:
    case LOAD_USER_REQUEST:
      return {
        loading: true,
        isAuthenticated: false,
      };
    case LOGIN_USER_SUCCESS:
    case REGISTER_USER_SUCCESS:
    case LOAD_USER_SUCCESS:
      LocalForageProvider.setAuthToken(payload?.accessToken);
      LocalForageProvider.setItem("FC:USERNAME", payload?.user.username);
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: payload.user,
        token: payload.accessToken,
      };
    case LOGOUT_USER_SUCCESS:
      LocalForageProvider.removeAuthToken();
      LocalForageProvider.removeItem("FC:USERNAME");
      return {
        loading: false,
        user: undefined,
        token: undefined,
        isAuthenticated: false,
        logoutSuccess: true,
      };
    case LOGIN_USER_FAIL:
    case REGISTER_USER_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: undefined,
        token: undefined,
        error: payload,
      };
    case LOAD_USER_FAIL:
      return {
        loading: false,
        isAuthenticated: false,
        user: undefined,
        token: undefined,
        error: payload,
      };
    case LOGOUT_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const forgotPasswordReducer = (
  state: USER_ROOT_STATE["forgotPassword"] = {},
  { type, payload }: { type: string; payload: any }
) => {
  switch (type) {
    case FORGOT_PASSWORD_REQUEST:
    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        message: payload?.message,
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        success: payload?.success,
      };
    case FORGOT_PASSWORD_FAIL:
    case RESET_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case FORGOT_PASSWORD_RESET:
      return {
        ...state,
        message: "",
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return { ...state, loading: false };
  }
};

export const userDetailsReducer = (
  state: USER_ROOT_STATE["userDetails"] = { user: initialState },
  { type, payload }: { type: string; payload: any }
) => {
  switch (type) {
    case USER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case USER_DETAILS_SUCCESS:
      return {
        loading: false,
        user: payload.user,
      };
    case USER_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case USER_DETAILS_RESET:
      return {
        ...state,
        user: initialState,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const allUsersReducer = (
  state: USER_ROOT_STATE["allUsers"] = { users: [] },
  { type, payload }: { type: string; payload: any }
) => {
  switch (type) {
    case ALL_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ALL_USERS_SUCCESS:
      return {
        loading: false,
        users: payload,
      };
    case ALL_USERS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const profileReducer = (
  state: USER_ROOT_STATE["profile"] = {},
  { type, payload }: { type: string; payload: any }
) => {
  switch (type) {
    case UPDATE_PROFILE_REQUEST:
    case UPDATE_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_PROFILE_SUCCESS:
    case UPDATE_PASSWORD_SUCCESS:
      LocalForageProvider.setItem("FC:USERNAME", payload.user.username);
      return {
        ...state,
        loading: false,
        isUpdated: payload.success,
      };
    case UPDATE_PROFILE_FAIL:
    case UPDATE_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case UPDATE_PROFILE_RESET:
    case UPDATE_PASSWORD_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
