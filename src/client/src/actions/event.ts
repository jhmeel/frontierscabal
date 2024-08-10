/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CLEAR_ERRORS,
  DELETE_EVENT_FAIL,
  DELETE_EVENT_REQUEST,
  DELETE_EVENT_SUCCESS,
  NEW_EVENT_FAIL,
  NEW_EVENT_REQUEST,
  NEW_EVENT_SUCCESS,
  EVENT_DETAILS_FAIL,
  EVENT_DETAILS_REQUEST,
  EVENT_DETAILS_SUCCESS,
  EVENT_SEARCH_REQUEST,
  EVENT_SEARCH_SUCCESS,
  EVENT_SEARCH_FAIL,
  UPDATE_EVENT_REQUEST,
  UPDATE_EVENT_SUCCESS,
  UPDATE_EVENT_FAIL,
} from "../constants/event";
import axiosInstance from "../utils/axiosInstance";
import { errorParser } from "../utils/formatter";
import { ACTION } from "../types";
// New EVENT
export const addNewEvent =
  (eventData: FormData | Record<string, any>, token: string) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: NEW_EVENT_REQUEST });

      const { data } = await axiosInstance(token).post(
        "/api/v1/event/new",
        eventData
      );

      dispatch({
        type: NEW_EVENT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: NEW_EVENT_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Delete EVENT
export const deleteEvent =
  (token: string, eventId: string) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: DELETE_EVENT_REQUEST });
      const { data } = await axiosInstance(token).delete(
        `/api/v1/event/${eventId}`
      );

      dispatch({
        type: DELETE_EVENT_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: DELETE_EVENT_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Get EVENT Details
export const getEventDetails =
  (slug: string) => async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: EVENT_DETAILS_REQUEST });
      const { data } = await axiosInstance().get(`/api/v1/event/${slug}`);

      dispatch({
        type: EVENT_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: EVENT_DETAILS_FAIL,
        payload: errorParser(error),
      });
    }
  };


export const searchRecentEvent =
  () => async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: EVENT_SEARCH_REQUEST });
      const { data } = await axiosInstance().get(`/api/v1/events/recent`);

      dispatch({
        type: EVENT_SEARCH_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: EVENT_SEARCH_FAIL,
        payload: errorParser(error),
      });
    }
  };

export const searchOngoingEvents =
  () => async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: EVENT_SEARCH_REQUEST });
      const { data } = await axiosInstance().get(`/api/v1/events/ongoing`);

      dispatch({
        type: EVENT_SEARCH_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: EVENT_SEARCH_FAIL,
        payload: errorParser(error),
      });
    }
  };

export const searchUpcomingEvents =
  () => async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: EVENT_SEARCH_REQUEST });
      const { data } = await axiosInstance().get(`/api/v1/events/upcoming`);

      dispatch({
        type: EVENT_SEARCH_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: EVENT_SEARCH_FAIL,
        payload: errorParser(error),
      });
    }
  };

export const searchEventByCategory =
  (category: string) => async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: EVENT_SEARCH_REQUEST });
      const { data } = await axiosInstance().get(
        `/api/v1/events/category/${category}`
      );

      dispatch({
        type: EVENT_SEARCH_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: EVENT_SEARCH_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Update
export const updateEvent =
  (token: string, id: string, updateData: FormData | Record<string, any>) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: UPDATE_EVENT_REQUEST });

      const { data } = await axiosInstance(token).put(
        `/api/v1/event/update/${id}`,
        updateData
      );

      dispatch({
        type: UPDATE_EVENT_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_EVENT_FAIL,
        payload: errorParser(error),
      });
    }
  };


  // Clear All Errors
export const clearErrors = () => (dispatch: (action: ACTION) => void) => {
    dispatch({ type: CLEAR_ERRORS });
  };
  