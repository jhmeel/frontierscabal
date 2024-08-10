/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CLEAR_ERRORS,
  DELETE_EVENT_FAIL,
  DELETE_EVENT_REQUEST,
  DELETE_EVENT_RESET,
  DELETE_EVENT_SUCCESS,
  NEW_EVENT_FAIL,
  NEW_EVENT_REQUEST,
  NEW_EVENT_RESET,
  NEW_EVENT_SUCCESS,
  EVENT_DETAILS_FAIL,
  EVENT_DETAILS_REQUEST,
  EVENT_DETAILS_RESET,
  EVENT_DETAILS_SUCCESS,
  EVENT_SEARCH_REQUEST,
  EVENT_SEARCH_SUCCESS,
  UPDATE_EVENT_REQUEST,
  UPDATE_EVENT_SUCCESS,
  UPDATE_EVENT_FAIL,
  UPDATE_EVENT_RESET,
  EVENT_SEARCH_FAIL,
  EVENT_SEARCH_RESET,
} from "../constants/event";
import { EVENT, EVENT_ROOT_STATE } from "../types";

const initialState: EVENT = {
  title: undefined,
  description: undefined,
  category: undefined,
  startDate: undefined,
  endDate: undefined,
  slug: undefined,
  avenue: undefined,
  avatar: {
    public_id: undefined,
    url: undefined,
  },
  createdBy: undefined,
  createdAt: undefined,
};

// New Post Reducer
export const newEventReducer = (
  state: EVENT_ROOT_STATE["newEvent"] = { event: initialState },
  { type, payload }: { type: string; payload: any }
) => {
  switch (type) {
    case NEW_EVENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_EVENT_SUCCESS:
      return {
        loading: false,
        success: payload.success,
        event: payload.event,
        message: payload.message,
      };
    case NEW_EVENT_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case NEW_EVENT_RESET:
      return {
        ...state,
        success: false,
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

export const deleteEventReducer = (
  state: EVENT_ROOT_STATE["deleteEvent"] = {},
  { type, payload }: { type: string; payload: any }
) => {
  switch (type) {
    case DELETE_EVENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_EVENT_SUCCESS:
      return {
        loading: false,
        success: payload,
      };
    case DELETE_EVENT_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case DELETE_EVENT_RESET:
      return {
        ...state,
        success: false,
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

export const eventDetailsReducer = (
  state: EVENT_ROOT_STATE["eventDetails"] = {},
  { type, payload }: { type: string; payload: any }
) => {
  switch (type) {
    case EVENT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case EVENT_DETAILS_SUCCESS:
      return {
        loading: false,
        event: payload.event,
      };
    case EVENT_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case EVENT_DETAILS_RESET:
      return {
        loading: false,
        event: {},
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

export const eventSearchReducer = (
  state: EVENT_ROOT_STATE["eventSearch"] = {},
  { type, payload }: { type: string; payload: any }
) => {
  switch (type) {
    case EVENT_SEARCH_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case EVENT_SEARCH_SUCCESS:
      return {
        loading: false,
        events: payload.event,
      };
    case EVENT_SEARCH_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case EVENT_SEARCH_RESET:
      return {
        loading: false,
        events: {},
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

export const eventUpdateReducer = (
  state: EVENT_ROOT_STATE["updateEvent"] = {},
  { type, payload }: { type: string; payload: any }
) => {
  switch (type) {
    case UPDATE_EVENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_EVENT_SUCCESS:
      return {
        loading: false,
        message: payload.message,
        success: true,
      };
    case UPDATE_EVENT_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
        success: false,
      };
    case UPDATE_EVENT_RESET:
      return {
        loading: false,
        events: {},
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
