import { useDispatch, useSelector } from "react-redux";
import {
  markNotificationRead,
  markAllNotificationRead,
  deleteNotification,
  markNotificationUnRead,
  deleteAllNotification,
  getAllNotification,
} from "../../actions/notification";
import { NOTIFICATION, NOTIFICATIONS } from "../../types";

export class NotificationManager {
  private notifications: NOTIFICATION[];
  private dispatch: ReturnType<typeof useDispatch>;

  constructor() {
    const {notifications} = useSelector((state) => state.notification);
    this.notifications = [...notifications];
    this.dispatch = useDispatch();
  }

  getNotifications(): NOTIFICATION[] {
    // const not: NOTIFICATIONS = this.dispatch(getAllNotification());
    // console.log(not)
    return this.notifications
  }
  getUnreadNotificationsCount(): number {
    return this.notifications.length > 0
      ? this.notifications.filter((n: NOTIFICATION) => !n.read).length
      : 0;
  }

  isNotificationRead(id: string): boolean {
    return this.notifications.some(
      (n: NOTIFICATION) => n._id === id && !n.read
    );
  }

  markNotificationAsRead(id: string): void {
    this.dispatch(markNotificationRead(id));
  }

  markNotificationUnRead(id: string): void {
    this.dispatch(markNotificationUnRead(id));
  }

  markAllNotificationsAsRead(): void {
    this.dispatch(markAllNotificationRead());
  }

  deleteNotification(id: string): void {
    this.dispatch(deleteNotification(id));
  }

  deleteAllNotifications(): void {
    this.dispatch(deleteAllNotification());
  }

  private static instance: NotificationManager;

  static getInstance(): NotificationManager {
    if (NotificationManager.instance) {
      return NotificationManager.instance;
    }

    NotificationManager.instance = new NotificationManager();
    return NotificationManager.instance;
  }
}
