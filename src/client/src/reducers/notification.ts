/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ADD_NOTIFICATION,
  MARK_ALL_NOTIFICATION_READ,
  MARK_NOTIFICATION_READ,
  DELETE_NOTIFICATION,
  GET_ALL_NOTIFICATIONS,
  DELETE_ALL_NOTIFICATIONS,
  MARK_NOTIFICATION_UNREAD,
} from "../constants/notification";
import { ACTION, NOTIFICATION, NOTIFICATIONS } from "../types";

const initialState: NOTIFICATIONS = {
  notifications: [],
};

export const notificationReducer = (state = initialState, action: ACTION) => {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map((notification: NOTIFICATION) =>
          notification._id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };
    case MARK_ALL_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map((notification: NOTIFICATION) => [
          { ...notification, read: true },
        ]),
      };
    case DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification: NOTIFICATION) => notification._id !== action.payload
        ),
      };
    case GET_ALL_NOTIFICATIONS:
      // Return all notifications as-is
      return state;
    case MARK_NOTIFICATION_UNREAD:
      return {
        ...state,
        notifications: state.notifications.map((notification: NOTIFICATION) =>
          notification._id === action.payload
            ? { ...notification, read: false }
            : notification
        ),
      };
    case DELETE_ALL_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};
