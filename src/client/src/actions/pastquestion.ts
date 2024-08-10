/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    CLEAR_ERRORS,
    DELETE_PAST_QUESTION_FAIL,
    DELETE_PAST_QUESTION_REQUEST,
    DELETE_PAST_QUESTION_SUCCESS,
    NEW_PAST_QUESTION_FAIL,
    NEW_PAST_QUESTION_REQUEST,
    NEW_PAST_QUESTION_SUCCESS,
    PAST_QUESTION_DETAILS_FAIL,
    PAST_QUESTION_DETAILS_REQUEST,
    PAST_QUESTION_DETAILS_SUCCESS,
    PAST_QUESTION_SEARCH_REQUEST,
    PAST_QUESTION_SEARCH_SUCCESS,
    PAST_QUESTION_SEARCH_FAIL,
    PAST_QUESTION_DOWNLOAD_FAIL,
    PAST_QUESTION_DOWNLOAD_SUCCESS,
    PAST_QUESTION_DOWNLOAD_REQUEST,
  } from "../constants/pastQuestion";
  import axiosInstance from "../utils/axiosInstance";
  import { errorParser } from "../utils/formatter";
  import { ACTION } from "../types";
  
  // New PastQuestion
  export const addNewPastQuestion =
    (token: string, pastQuestionData:FormData|Record<string, any>) =>
  async (dispatch: (action: ACTION) => void) => {
      try {
        dispatch({ type: NEW_PAST_QUESTION_REQUEST });
        const { data } = await axiosInstance(token).post(
          "/api/v1/past-question/new",
          pastQuestionData,
        );
  
        dispatch({
          type: NEW_PAST_QUESTION_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: NEW_PAST_QUESTION_FAIL,
          payload: errorParser(error),
        });
      }
    };
  
  // Delete PastQuestion
  export const deletePastQuestion =
    (token:string, pastQuestionId: string) =>
  async (dispatch: (action: ACTION) => void) => {
      try {
        dispatch({ type: DELETE_PAST_QUESTION_REQUEST });
        const { data } = await axiosInstance(token).delete(
          `/api/v1/past-question/${pastQuestionId}`
        );
  
        dispatch({
          type: DELETE_PAST_QUESTION_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: DELETE_PAST_QUESTION_FAIL,
          payload: errorParser(error),
        });
      }
    };
  
  // Get PastQuestion Details
  export const getPastQuestionDetails = (pastQuestionId: string) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: PAST_QUESTION_DETAILS_REQUEST });
      const { data } = await axiosInstance().get(
        `/api/v1/past-question/detail/${pastQuestionId}`
      );
  
      dispatch({
        type: PAST_QUESTION_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PAST_QUESTION_DETAILS_FAIL,
        payload: errorParser(error),
      });
    }
  };
  

  
  export const searchPastQuestionWithCourseTitle =
    (courseTitle: string, page: number) =>
  async (dispatch: (action: ACTION) => void) => {
      try {
        dispatch({ type: PAST_QUESTION_SEARCH_REQUEST });
        const { data } = await axiosInstance().get(
          `/api/v1/past-question/search/title?courseTitle=${courseTitle}&page=${page}`
        );
  
        dispatch({
          type: PAST_QUESTION_SEARCH_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: PAST_QUESTION_SEARCH_FAIL,
          payload: errorParser(error),
        });
      }
    };
  
  export const searchPastQuestionWithCourseTitleAndLevel =
    (courseTitle: string, level: string, page: number) =>
  async (dispatch: (action: ACTION) => void) => {
      try {
        dispatch({ type: PAST_QUESTION_SEARCH_REQUEST });
        const { data } = await axiosInstance().get(
          `/api/v1/past-question/search/CTAL?courseTitle=${courseTitle}&level=${level}&page=${page}`
        );
  
        dispatch({
          type: PAST_QUESTION_SEARCH_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: PAST_QUESTION_SEARCH_FAIL,
          payload: errorParser(error),
        });
      }
    };
  
  export const searchPastQuestionWithCourseTitleSessionAndLevel =
    (courseTitle: string, session: string, level: string, page: number) =>
  async (dispatch: (action: ACTION) => void) => {
      try {
        dispatch({ type: PAST_QUESTION_SEARCH_REQUEST });
        const { data } = await axiosInstance().get(
          `/api/v1/past-question/search/CTSAL?courseTitle=${courseTitle}&session=${session}&level=${level}&page=${page}`
        );
  
        dispatch({
          type: PAST_QUESTION_SEARCH_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: PAST_QUESTION_SEARCH_FAIL,
          payload: errorParser(error),
        });
      }
    };
  
  export const searchPastQuestionWithCourseTitleAndSession =
    (courseTitle: string, session: string, page: number) =>
  async (dispatch: (action: ACTION) => void) => {
      try {
        dispatch({ type: PAST_QUESTION_SEARCH_REQUEST });
        const { data } = await axiosInstance().get(
          `/api/v1/past-question/search/CTAS?courseTitle=${courseTitle}&session=${session}&page=${page}`
        );
  
        dispatch({
          type: PAST_QUESTION_SEARCH_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: PAST_QUESTION_SEARCH_FAIL,
          payload: errorParser(error),
        });
      }
    };
  
  export const searchRecentPastQuestion = (page:number) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: PAST_QUESTION_SEARCH_REQUEST });
      const { data } = await axiosInstance().get(
        `/api/v1/past-question/search/recent?page=${page}`
      );
  
      dispatch({
        type: PAST_QUESTION_SEARCH_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PAST_QUESTION_SEARCH_FAIL,
        payload: errorParser(error),
      });
    }
  };
  
  export const DownloadPastQuestion = (token: string, id: string) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: PAST_QUESTION_DOWNLOAD_REQUEST });
      const response = await axiosInstance(token).get(
        `/api/v1/past-question/download/${id}`,
        { responseType: "blob" }
      );
  
      const disposition = response.headers["content-disposition"];
      const filename = disposition
        ? disposition.match(/filename=(.+)/)[1]
        : "Pastquestion.pdf";
      const data = response.data;
      dispatch({
        type: PAST_QUESTION_DOWNLOAD_SUCCESS,
        payload: { filename, data },
      });
    } catch (error) {
      dispatch({
        type: PAST_QUESTION_DOWNLOAD_FAIL,
        payload: errorParser(error),
      });
    }
  };
  

// Clear All Errors
export const clearErrors = () => (dispatch: (action: ACTION) => void) =>  {
    dispatch({ type: CLEAR_ERRORS });
    };
    