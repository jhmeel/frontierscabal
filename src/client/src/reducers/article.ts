import {
  CLEAR_ERRORS,
  DELETE_ARTICLE_FAIL,
  DELETE_ARTICLE_REQUEST,
  DELETE_ARTICLE_RESET,
  DELETE_ARTICLE_SUCCESS,
  LIKE_UNLIKE_ARTICLE_FAIL,
  LIKE_UNLIKE_ARTICLE_REQUEST,
  LIKE_UNLIKE_ARTICLE_RESET,
  LIKE_UNLIKE_ARTICLE_SUCCESS,
  NEW_COMMENT_FAIL,
  NEW_COMMENT_REQUEST,
  NEW_COMMENT_RESET,
  NEW_COMMENT_SUCCESS,
  NEW_ARTICLE_FAIL,
  NEW_ARTICLE_REQUEST,
  NEW_ARTICLE_RESET,
  NEW_ARTICLE_SUCCESS,
  ARTICLE_DETAILS_FAIL,
  ARTICLE_DETAILS_REQUEST,
  ARTICLE_DETAILS_RESET,
  ARTICLE_DETAILS_SUCCESS,
  SAVE_UNSAVE_ARTICLE_FAIL,
  SAVE_UNSAVE_ARTICLE_REQUEST,
  SAVE_UNSAVE_ARTICLE_RESET,
  SAVE_UNSAVE_ARTICLE_SUCCESS,
  NEW_COMMENT_REPLY_REQUEST,
  NEW_COMMENT_REPLY_SUCCESS,
  NEW_COMMENT_REPLY_RESET,
  NEW_COMMENT_REPLY_FAIL,
  ARTICLE_SEARCH_REQUEST,
  ARTICLE_SEARCH_SUCCESS,
  ARTICLE_SEARCH_FAIL,
  ARTICLE_SEARCH_RESET,
  UPDATE_ARTICLE_REQUEST,
  UPDATE_ARTICLE_SUCCESS,
  UPDATE_ARTICLE_FAIL,
  UPDATE_ARTICLE_RESET,
  DELETE_REPLY_FAIL,
  DELETE_REPLY_REQUEST,
  DELETE_REPLY_SUCCESS,
  DELETE_COMMENT_FAIL,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_RESET,
  DELETE_REPLY_RESET,
} from "../constants/article";
import { ARTICLE, ARTICLE_ROOT_STATE } from "../types";

const initialState: ARTICLE = {
  title: undefined,
  content: undefined,
  slug: undefined,
  image: {
    public_id: undefined,
    url: undefined,
  },
  description: undefined,
  type: undefined,
  sanitizedHtml: undefined,
  readDuration: undefined,
  category: undefined,
  pinnedBy: [],
  savedBy: [],
  postedBy: undefined,
  likes: [],
  views: undefined,
  tags: undefined,
  updatedAt: undefined,
  comments: [],
  createdAt: undefined,
};

// New Post Reducer
export const newArticleReducer = (
    state: ARTICLE_ROOT_STATE["newArticle"] = { article: initialState },
    { type, payload }: { type: string; payload: any }
  ) => {
  switch (type) {
    case NEW_ARTICLE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_ARTICLE_SUCCESS:
      return {
        loading: false,
        success: payload.success,
        article: payload.article,
      };
    case NEW_ARTICLE_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case NEW_ARTICLE_RESET:
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

export const likeArticleReducer =(
    state: ARTICLE_ROOT_STATE["likeArticle"] = {},
    { type, payload }: { type: string; payload: any }
  ) => {
  switch (type) {
    case LIKE_UNLIKE_ARTICLE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LIKE_UNLIKE_ARTICLE_SUCCESS:
      return {
        loading: false,
        success: payload.success,
        message: payload.message,
      };
    case LIKE_UNLIKE_ARTICLE_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case LIKE_UNLIKE_ARTICLE_RESET:
      return {
        ...state,
        success: false,
        loading: false,
        message: undefined,
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

export const newCommentReducer = (
    state: ARTICLE_ROOT_STATE["newComment"] = {},
    { type, payload }: { type: string; payload: any }
  ) => {
  switch (type) {
    case NEW_COMMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_COMMENT_SUCCESS:
      return {
        loading: false,
        success: payload.success,
      };
    case NEW_COMMENT_RESET:
      return {
        ...state,
        loading: false,
        success: false,
      };
    case NEW_COMMENT_FAIL:
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

export const bookmarkArticleReducer = (
    state: ARTICLE_ROOT_STATE["bookmarkArticle"] = {},
    { type, payload }: { type: string; payload: any }
  ) => {
  switch (type) {
    case SAVE_UNSAVE_ARTICLE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case SAVE_UNSAVE_ARTICLE_SUCCESS:
      return {
        loading: false,
        success: payload.success,
        message: payload.message,
      };
    case SAVE_UNSAVE_ARTICLE_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: payload,
      };
    case SAVE_UNSAVE_ARTICLE_RESET:
      return {
        ...state,
        success: false,
        message: "",
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

export const deleteArticleReducer = (
    state: ARTICLE_ROOT_STATE["deleteArticle"] = {},
    { type, payload }: { type: string; payload: any }
  ) => {
  switch (type) {
    case DELETE_ARTICLE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_ARTICLE_SUCCESS:
      return {
        loading: false,
        success: payload.success,
      };
    case DELETE_ARTICLE_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case DELETE_ARTICLE_RESET:
      return {
        ...state,
        loading: false,
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

export const articleDetailsReducer = (
    state: ARTICLE_ROOT_STATE["articleDetails"] = {},
    { type, payload }: { type: string; payload: any }
  ) => {
  switch (type) {
    case ARTICLE_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ARTICLE_DETAILS_SUCCESS:
      return {
        loading: false,
        article: payload.article,
      };
    case ARTICLE_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case ARTICLE_DETAILS_RESET:
      return {
        loading: false,
        article: {},
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

export const newCommentReplyReducer = (
    state: ARTICLE_ROOT_STATE["newCommentReply"] = {},
    { type, payload }: { type: string; payload: any }
  ) => {
  switch (type) {
    case NEW_COMMENT_REPLY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_COMMENT_REPLY_SUCCESS:
      return {
        loading: false,
        success: payload.success,
      };
    case NEW_COMMENT_REPLY_RESET:
      return {
        ...state,
        loading: false,
        success: false,
      };
    case NEW_COMMENT_REPLY_FAIL:
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

export const articleSearchReducer = (
    state: ARTICLE_ROOT_STATE["articleSearch"] = {},
    { type, payload }: { type: string; payload: any }
  ) => {
  switch (type) {
    case ARTICLE_SEARCH_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ARTICLE_SEARCH_SUCCESS:
      return {
        loading: false,
        articles: payload.articles,
        totalPages: payload.totalPages,
      };
    case ARTICLE_SEARCH_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case ARTICLE_SEARCH_RESET:
      return {
        loading: false,
        article: {},
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

export const updateArticleReducer =(
    state: ARTICLE_ROOT_STATE["updateArticle"] = {},
    { type, payload }: { type: string; payload: any }
  ) => {
  switch (type) {
    case UPDATE_ARTICLE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_ARTICLE_SUCCESS:
      return {
        loading: false,
        success: payload.success,
        message: payload.message,
      };
    case UPDATE_ARTICLE_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case UPDATE_ARTICLE_RESET:
      return {
        loading: false,
        article: {},
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

export const deleteCommentReducer = (
    state: ARTICLE_ROOT_STATE["deleteComment"] = {},
    { type, payload }: { type: string; payload: any }
  ) => {
  switch (type) {
    case DELETE_COMMENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_COMMENT_SUCCESS:
      return {
        loading: false,
        success: payload.success,
      };
    case DELETE_COMMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case DELETE_COMMENT_RESET:
      return {
        ...state,
        success: false,
        loading: false,
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

export const deleteReplyReducer = (
    state: ARTICLE_ROOT_STATE["deleteReply"] = {},
    { type, payload }: { type: string; payload: any }
  ) => {
  switch (type) {
    case DELETE_REPLY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_REPLY_SUCCESS:
      return {
        loading: false,
        success: payload.success,
      };
    case DELETE_REPLY_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case DELETE_REPLY_RESET:
      return {
        ...state,
        success: false,
        loading: false,
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
