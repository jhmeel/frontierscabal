/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CLEAR_ERRORS,
  DELETE_ARTICLE_FAIL,
  DELETE_ARTICLE_REQUEST,
  DELETE_ARTICLE_SUCCESS,
  LIKE_UNLIKE_ARTICLE_FAIL,
  LIKE_UNLIKE_ARTICLE_REQUEST,
  LIKE_UNLIKE_ARTICLE_SUCCESS,
  NEW_COMMENT_FAIL,
  NEW_COMMENT_REQUEST,
  NEW_COMMENT_SUCCESS,
  NEW_ARTICLE_FAIL,
  NEW_ARTICLE_REQUEST,
  NEW_ARTICLE_SUCCESS,
  ARTICLE_DETAILS_FAIL,
  ARTICLE_DETAILS_REQUEST,
  ARTICLE_DETAILS_SUCCESS,
  ARTICLE_SEARCH_REQUEST,
  ARTICLE_SEARCH_SUCCESS,
  ARTICLE_SEARCH_FAIL,
  SAVE_UNSAVE_ARTICLE_FAIL,
  SAVE_UNSAVE_ARTICLE_REQUEST,
  SAVE_UNSAVE_ARTICLE_SUCCESS,
  NEW_COMMENT_REPLY_REQUEST,
  NEW_COMMENT_REPLY_SUCCESS,
  NEW_COMMENT_REPLY_FAIL,
  UPDATE_ARTICLE_FAIL,
  UPDATE_ARTICLE_SUCCESS,
  UPDATE_ARTICLE_REQUEST,
  DELETE_REPLY_FAIL,
  DELETE_REPLY_REQUEST,
  DELETE_REPLY_SUCCESS,
  DELETE_COMMENT_FAIL,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_REQUEST,
} from "../constants/article";
import axiosInstance from "../utils/axiosInstance";
import { errorParser } from "../utils/formatter";
import { ACTION } from "../types";

// New Article
export const addNewArticle =
  (token?: string, articleData?: FormData | any) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: NEW_ARTICLE_REQUEST });
      const { data } = await axiosInstance(token).post(
        "/api/v1/article/new",
        articleData
      );

      dispatch({
        type: NEW_ARTICLE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: NEW_ARTICLE_FAIL,
        payload: errorParser(error),
      });
    }
  };

// bookmarkOrUnBookmark
export const bookmarkOrUnBookmarkArticle =
  (token: string, articleId: string) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: SAVE_UNSAVE_ARTICLE_REQUEST });
      const { data } = await axiosInstance(token).get(
        `/api/v1/article/bookmark/${articleId}`
      );

      dispatch({
        type: SAVE_UNSAVE_ARTICLE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SAVE_UNSAVE_ARTICLE_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Like | Unlike Article
export const likeArticle =
  (token: string, articleId: string) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: LIKE_UNLIKE_ARTICLE_REQUEST });
      const { data } = await axiosInstance(token).get(
        `/api/v1/article/${articleId}`
      );

      dispatch({
        type: LIKE_UNLIKE_ARTICLE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: LIKE_UNLIKE_ARTICLE_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Add Comment
export const addComment =
  (token: string, articleId: string, commentText: string) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: NEW_COMMENT_REQUEST });

      const { data } = await axiosInstance(token).post(
        `/api/v1/article/comment/${articleId}/''`,
        { commentText }
      );

      dispatch({
        type: NEW_COMMENT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: NEW_COMMENT_FAIL,
        payload: errorParser(error),
      });
    }
  };

export const getBookmarkedArticle =
  (token?: string, page?: number) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: ARTICLE_SEARCH_REQUEST });
      const { data } = await axiosInstance(token).get(
        `/api/v1/article/bookmarked?page=${page}`
      );

      dispatch({
        type: ARTICLE_SEARCH_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ARTICLE_SEARCH_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Delete Article
export const deleteArticle =
  (token: string, articleId: string) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: DELETE_ARTICLE_REQUEST });
      const { data } = await axiosInstance(token).delete(
        `/api/v1/article/${articleId}`
      );

      dispatch({
        type: DELETE_ARTICLE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DELETE_ARTICLE_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Get Article Details
export const getArticleDetails =
  (slug: string) => async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: ARTICLE_DETAILS_REQUEST });
      const { data } = await axiosInstance().get(
        `/api/v1/article/detail/${slug}`
      );

      dispatch({
        type: ARTICLE_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ARTICLE_DETAILS_FAIL,
        payload: errorParser(error),
      });
    }
  };



export const addCommentReply =
  (token: string, articleId: string, commentId: string, replyText: string) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: NEW_COMMENT_REPLY_REQUEST });

      const { data } = await axiosInstance(token).post(
        `/api/v1/article/comment/reply/${articleId}/${commentId}/''`,
        { replyText }
      );

      dispatch({
        type: NEW_COMMENT_REPLY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: NEW_COMMENT_REPLY_FAIL,
        payload: errorParser(error),
      });
    }
  };

export const searchRecentArticle =
  (categories: string[], page: number) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: ARTICLE_SEARCH_REQUEST });
      const { data } = await axiosInstance().get(
        `/api/v1/article/recent?categories=${categories}&page=${page}`
      );

      dispatch({
        type: ARTICLE_SEARCH_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ARTICLE_SEARCH_FAIL,
        payload: errorParser(error),
      });
    }
  };

export const searchArticleByTitle =
  (title: string) => async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: ARTICLE_SEARCH_REQUEST });
      const { data } = await axiosInstance().get(
        `/api/v1/article/search?title=${title}`
      );

      dispatch({
        type: ARTICLE_SEARCH_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ARTICLE_SEARCH_FAIL,
        payload: errorParser(error),
      });
    }
  };

export const searchArticleByCategory =
  (category: string, page: number) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: ARTICLE_SEARCH_REQUEST });
      const { data } = await axiosInstance().get(
        `/api/v1/article/search/?category=${category}&page=${page}`
      );

      dispatch({
        type: ARTICLE_SEARCH_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ARTICLE_SEARCH_FAIL,
        payload: errorParser(error),
      });
    }
  };

export const updateArticle =
  (token?: string, id?: string, updateData?: FormData | any) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: UPDATE_ARTICLE_REQUEST });

      const { data } = await axiosInstance(token).put(
        `/api/v1/article/${id}`,
        updateData
      );

      dispatch({
        type: UPDATE_ARTICLE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_ARTICLE_FAIL,
        payload: errorParser(error),
      });
    }
  };

export const getUserArticles =
  (token: string, username: string) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: ARTICLE_SEARCH_REQUEST });
      const { data } = await axiosInstance(token).get(
        `/api/v1/articles/${username}`
      );

      dispatch({
        type: ARTICLE_SEARCH_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ARTICLE_SEARCH_FAIL,
        payload: errorParser(error),
      });
    }
  };

// Delete comment
export const deleteComment =
  (token: string, articleId: string, commentId: string) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: DELETE_COMMENT_REQUEST });
      const { data } = await axiosInstance(token).delete(
        `/api/v1/article/comment/${articleId}/${commentId}`
      );

      dispatch({
        type: DELETE_COMMENT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DELETE_COMMENT_FAIL,
        payload: errorParser(error),
      });
    }
  };

export const deleteReply =
  (token: string, articleId: string, commentId: string, replyId: string) =>
  async (dispatch: (action: ACTION) => void) => {
    try {
      dispatch({ type: DELETE_REPLY_REQUEST });
      const { data } = await axiosInstance(token).delete(
        `/api/v1/article/comment/reply/${articleId}/${commentId}/${replyId}`
      );

      dispatch({
        type: DELETE_REPLY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DELETE_REPLY_FAIL,
        payload: errorParser(error),
      });
    }
  };


  // Clear All Errors
export const clearErrors = () => (dispatch: (action: ACTION) => void) => {
    dispatch({ type: CLEAR_ERRORS });
  };