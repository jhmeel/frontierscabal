import axiosInstance from "../utils/axiosInstance";
import { errorParser } from "../utils/formatter";
import {
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
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
} from "../constants/user";
import { ACTION } from "../types";

// Login User
export const loginUser = (email: string, password: string) => async (dispatch: (action: ACTION) => void) => {
  try {
    dispatch({ type: LOGIN_USER_REQUEST });
    const { data } = await axiosInstance().post("/api/v1/login", { email, password });
    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOGIN_USER_FAIL,
      payload: errorParser(error),
    });
  }
};

// Register User
export const registerUser = (userData: FormData|Record<string, any>) => async (dispatch: (action: ACTION) => void) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });
    const { data } = await axiosInstance().post("/api/v1/signup", userData);
    dispatch({
      type: REGISTER_USER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: errorParser(error),
    });
  }
};

// Load User
export const loadUser = (token: string) => async (dispatch: (action: ACTION) => void) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });
    const { data } = await axiosInstance(token).get("/api/v1/profile");
    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: errorParser(error),
    });
  }
};

// Logout User
export const logoutUser = () => async (dispatch: (action: ACTION) => void) => {
  try {
    await axiosInstance().get("/api/v1/logout");
    dispatch({ type: LOGOUT_USER_SUCCESS });
  } catch (error) {
    dispatch({
      type: LOGOUT_USER_FAIL,
      payload: errorParser(error),
    });
  }
};

// Get User Details
export const getUserDetails = (username: string, token: string) => async (dispatch: (action: ACTION) => void) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const { data } = await axiosInstance(token).get(`/api/v1/user/${username}`);
    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: errorParser(error),
    });
  }
};

// Get User Details By ID
export const getUserDetailsById = (userId: string, token: string) => async (dispatch: (action: ACTION) => void) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const { data } = await axiosInstance(token).get(`/api/v1/userdetails/${userId}`);
    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: errorParser(error),
    });
  }
};

// Forgot Password
export const forgotPassword = (email: string) => async (dispatch: (action: ACTION) => void) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });
    const { data } = await axiosInstance().post("/api/v1/password/forgot", { email });
    dispatch({
      type: FORGOT_PASSWORD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: errorParser(error),
    });
  }
};

// Reset Password
export const resetPassword = (token?: string, password?: string) => async (dispatch: (action: ACTION) => void) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });
    const { data } = await axiosInstance().put(`/api/v1/password/reset/${token}`, { password });
    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: errorParser(error),
    });
  }
};

// Update User Profile
export const updateProfile = (token?: string, userData?:FormData)=> async (dispatch: (action: ACTION) => void) => {

try {
  dispatch({ type: UPDATE_PROFILE_REQUEST });

  const { data } = await axiosInstance(token).put(
    "/api/v1/update/profile",
    userData
  );

  dispatch({
    type: UPDATE_PROFILE_SUCCESS,
    payload: data,
  });
} catch (error) {
  dispatch({
    type: UPDATE_PROFILE_FAIL,
    payload: errorParser(error),
  });
}
};

// Update User Password
export const  updatePassword = (token?: string, passwords?: FormData | any)=> async (dispatch: (action: ACTION) => void) => {
try {
  dispatch({ type: UPDATE_PASSWORD_REQUEST });

  const { data } = await axiosInstance(token).put(
    "/api/v1/update/password",
    passwords
  );

  dispatch({
    type: UPDATE_PASSWORD_SUCCESS,
    payload: data,
  });
} catch (error) {
  dispatch({
    type: UPDATE_PASSWORD_FAIL,
    payload: errorParser(error),
  });
}
};

// Clear All Errors
export const clearErrors = () => (dispatch: (action: ACTION) => void) =>  {
dispatch({ type: CLEAR_ERRORS });
};

