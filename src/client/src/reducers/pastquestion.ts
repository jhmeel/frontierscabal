/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CLEAR_ERRORS,
  DELETE_PAST_QUESTION_FAIL,
  DELETE_PAST_QUESTION_REQUEST,
  DELETE_PAST_QUESTION_SUCCESS,
  NEW_PAST_QUESTION_FAIL,
  NEW_PAST_QUESTION_REQUEST,
  NEW_PAST_QUESTION_SUCCESS,
  DELETE_PAST_QUESTION_RESET,
  PAST_QUESTION_DETAILS_FAIL,
  PAST_QUESTION_DETAILS_REQUEST,
  PAST_QUESTION_DETAILS_RESET,
  PAST_QUESTION_DETAILS_SUCCESS,
  NEW_PAST_QUESTION_RESET,
  PAST_QUESTION_SEARCH_REQUEST,
  PAST_QUESTION_SEARCH_SUCCESS,
  PAST_QUESTION_SEARCH_FAIL,
  PAST_QUESTION_SEARCH_RESET,
} from "../constants/pastQuestion";
import { PASTQUESTION, PASTQUESTION_ROOT_STATE } from "../types";

const initialState: PASTQUESTION = {
  courseTitle: undefined,
  courseCode: undefined,
  session: undefined,
  level: undefined,
  file: {
    public_id: undefined,
    url: undefined,
  },
  downloads: 0,
  school: undefined,
  pdfFile: {
    public_id: undefined,
    url: undefined,
  },
  isAnswered: undefined,

  postedBy: undefined,
  createdAt: undefined,
};

// New pastquestion Reducer
export const newPastQuestionReducer = (
  state: PASTQUESTION_ROOT_STATE["newPastquestion"] = {
    pastQuestion: initialState,
  },
  { type, payload }: { type: string; payload: any }
) => {
  switch (type) {
    case NEW_PAST_QUESTION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_PAST_QUESTION_SUCCESS:
      return {
        loading: false,
        success: payload.success,
        pastQuestion: payload.pastQuestion,
      };
    case NEW_PAST_QUESTION_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case NEW_PAST_QUESTION_RESET:
      return {
        ...state,
        success: false,
        loadin: false,
        pastQuestion: {},
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

export const deletePastQuestionReducer = (
  state: PASTQUESTION_ROOT_STATE["deletePastQuestion"] = {},
  { type, payload }: { type: string; payload: any }
) => {
  switch (type) {
    case DELETE_PAST_QUESTION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_PAST_QUESTION_SUCCESS:
      return {
        loading: false,
        success: payload.success,
      };
    case DELETE_PAST_QUESTION_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case DELETE_PAST_QUESTION_RESET:
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

export const pastQuestionDetailsReducer = (
  state: PASTQUESTION_ROOT_STATE["pastQuestionDetails"] = {},
  { type, payload }: { type: string; payload: any }
) => {
  switch (type) {
    case PAST_QUESTION_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case PAST_QUESTION_DETAILS_SUCCESS:
      return {
        loading: false,
        pastQuestion: payload.pastQuestion,
      };
    case PAST_QUESTION_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case PAST_QUESTION_DETAILS_RESET:
      return {
        loading: false,
        pastQuestion: {},
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

export const pastQuestionSearchReducer = (
  state: PASTQUESTION_ROOT_STATE["pastQuestionSearch"] = {},
  { type, payload }: { type: string; payload: any }
) => {
  switch (type) {
    case PAST_QUESTION_SEARCH_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case PAST_QUESTION_SEARCH_SUCCESS:
      return {
        loading: false,
        pastQuestion: payload.pastQuestions,
        totalPages: payload.totalPages,
      };
    case PAST_QUESTION_SEARCH_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case PAST_QUESTION_SEARCH_RESET:
      return {
        loading: false,
        pastQuestion: {},
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
