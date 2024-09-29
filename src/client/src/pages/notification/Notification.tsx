import React, { useEffect, useState } from "react";
import NotificationItem from "../../components/notificationItem/NotificationItem";
import MetaData from "../../MetaData";
import Footer from "../../components/footer/Footer";
import { NotificationManager } from "../../lib/notificationManager/NotificationManager";
import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const NotificationPage: React.FC = (): React.ReactElement => {
  const [timeframe, setTimeFrame] = useState("Today");
  const [menuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(1);

  const notificationService = NotificationManager.getInstance();

  const loadNotifications = () => {
    const newNotifications = notificationService.getNotifications();
    setNotifications(newNotifications);
    setUnreadCount(notificationService.getUnreadNotificationsCount());
  };

  useEffect(() => {
    loadNotifications();
  }, [notificationService]);

  const toggleTimeFrameMenu = () => {
    setIsMenuOpen(!menuOpen);
  };
  const handleTimeframeSelection = (tf: string) => {
    setTimeFrame(tf);
    toggleTimeFrameMenu();
  };

  const deleteAllNotifications = () => {
    notificationService.deleteAllNotifications();
    window.location.reload();
  };

  return (
    <>
      <MetaData title="Notifications" />
    
        <NotificationRenderer>
          <div className="notification-header">
            <span>Notifications</span>
          </div>

          <div className="notifications-holder">
            {notifications?.length > 0 ? (
              notifications
                .sort((a, b) => b?.date - a?.date)
                .map((not: any, i: number) => (
                  <NotificationItem
                    key={i}
                    id={not?._id}
                    type={not?.type}
                    message={not?.message}
                    slug={not?.slug}
                    date={not?.date}
                    avatar={not?.image || not?.avatar}
                    entityname={
                      not?.articleFrom || not?.eventFrom || not?.username
                    }
                  />
                ))
            ) : (
              <span
                style={{
                  fontWeight: 600,
                  color: "gray",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p>No notifications</p>
              </span>
            )}
          </div>
        </NotificationRenderer>
        <Footer />
  
    </>
  );
};

export default NotificationPage;

const NotificationRenderer = styled.div`
  max-width: 600px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  .notification-header {
    margin-top: 10px;
    width: 100%;
    height: fit-content;
    padding-left: 10px;
    border-bottom: 0.5px solid #ededed;
    font-weight: 600;
    position: relative;
  }
  .notification-header span {
    font-size: medium;
    font-weight: 600;
    cursor: pointer;
  }

  .notifications-holder {
    padding: 4px 8px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 10px;
  }
`;
