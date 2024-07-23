import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, 
} from "reduxjs-toolkit-persist";
import localForage from "localforage";
import {
  allUsersReducer,
  forgotPasswordReducer,
  profileReducer,
  userDetailsReducer,
  userReducer,
} from "./reducers/user";

import {
  newEventReducer,
  deleteEventReducer,
  eventDetailsReducer,
  eventSearchReducer,
  eventUpdateReducer,
} from "./reducers/event";
import {
  deleteArticleReducer,
  likeArticleReducer,
  newCommentReducer,
  newArticleReducer,
  articleSearchReducer,
  articleDetailsReducer,
  bookmarkArticleReducer,
  newCommentReplyReducer,
  updateArticleReducer,
  deleteCommentReducer,
  deleteReplyReducer,
} from "./reducers/article";
import {
  newPastQuestionReducer,
  deletePastQuestionReducer,
  pastQuestionDetailsReducer,
  pastQuestionSearchReducer,
} from "./reducers/pastquestion";

import { notificationReducer } from "./reducers/notification";
import { themeReducer } from "./reducers/theme";

const reducer = combineReducers({
  //users
  user: userReducer,
  userDetails: userDetailsReducer,
  allUsers: allUsersReducer,
  forgotPassword: forgotPasswordReducer,
  profile: profileReducer,

  //article
  newArticle: newArticleReducer,
  likeArticle: likeArticleReducer,
  newComment: newCommentReducer,
  bookmarkArticle: bookmarkArticleReducer,
  deleteArticle: deleteArticleReducer,
  articleDetails: articleDetailsReducer,
  newCommentReply: newCommentReplyReducer,
  articleSearch: articleSearchReducer,
  updateArticle: updateArticleReducer,
  deleteComment: deleteCommentReducer,
  deleteReply: deleteReplyReducer,

  //pastquestion
  newPastQuestion: newPastQuestionReducer,
  deletePastQuestion: deletePastQuestionReducer,
  pastQuestionDetails: pastQuestionDetailsReducer,
  pastQuestionSearch: pastQuestionSearchReducer,


  //events
  newEvent: newEventReducer,
  deleteEvent: deleteEventReducer,
  eventDetails: eventDetailsReducer,
  eventSearch: eventSearchReducer,
  eventUpdate: eventUpdateReducer,

  //notification
  notification: notificationReducer,

  //theme
  theme: themeReducer,
});
type  ROOT_REDUCER = ReturnType<typeof reducer>

localForage.config({
  name: "frontierscabal",
  storeName: "fcState",
  version: 1,
  driver: [
    localForage.INDEXEDDB,
    localForage.WEBSQL,
    localForage.LOCALSTORAGE,
  ],
  size: 200 * 1024 * 1024,
});

const persistConfig:any = {
  key: "root",
  storage: localForage,
  whitelist: [
    "user",
    "userDetails",
    "allUsers",
    "forgotPassword",
    "profile",
    "newArticle",
    "likeArticle",
    "newComment",
    "bookmarkArticle",
    "deleteArticle",
    "articleDetails",
    "newCommentReply",
    "articleSearch",
    "updateArticle",
    "newPastQuestion",
    "deletePastQuestion",
    "pastQuestionDetails",
    "pastQuestionSearch",
    "newEvent",
    "deleteEvent",
    "eventDetails",
    "eventSearch",
    "eventUpdate",
    "notification",
    "theme",
  ],
};

const persistedReducer = persistReducer<ROOT_REDUCER, any>(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);
