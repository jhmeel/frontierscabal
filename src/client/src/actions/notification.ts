/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ADD_NOTIFICATION,
    MARK_ALL_NOTIFICATION_READ,
    GET_ALL_NOTIFICATIONS,
    MARK_NOTIFICATION_READ,
    DELETE_NOTIFICATION,
    DELETE_ALL_NOTIFICATIONS,
    MARK_NOTIFICATION_UNREAD,
  } from "../constants/notification";
  import { ACTION, NOTIFICATION } from "../types";
  export const addNotification = (notification:NOTIFICATION) => (dispatch: (action: ACTION) => void) =>  {
    dispatch({
      type: ADD_NOTIFICATION,
      payload: notification,
    });
  };
 
  export const markNotificationRead = (id: string) => (dispatch: (action: ACTION) => void) =>  {
    
    dispatch({
      type: MARK_NOTIFICATION_READ,
      payload: id,
    });
  };
  export const markAllNotificationRead = () => (dispatch: (action: ACTION) => void) =>  {
    dispatch({
      type: MARK_ALL_NOTIFICATION_READ,
    });
  };
  
  export const deleteNotification = (id: string) => (dispatch: (action: ACTION) => void) =>  {
    dispatch({
      type: DELETE_NOTIFICATION,
      payload: id,
    });
  };
  
  export const markNotificationUnRead = (id: string) => (dispatch: (action: ACTION) => void) =>  {
    dispatch({
      type: MARK_NOTIFICATION_UNREAD,
      payload: id,
    });
  };
  export const deleteAllNotification = () => (dispatch: (action: ACTION) => void) =>  {
    dispatch({
      type: DELETE_ALL_NOTIFICATIONS,
    });
  };
  
  export const getAllNotification = () => (dispatch: (action: ACTION) => void) =>  {
    dispatch({
      type: GET_ALL_NOTIFICATIONS,
    });
  };
  