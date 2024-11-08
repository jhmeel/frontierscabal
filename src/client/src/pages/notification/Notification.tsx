import React, { useEffect, useState } from "react";
import NotificationItem from "../../components/notificationItem/NotificationItem";
import MetaData from "../../MetaData";
import Footer from "../../components/footer/Footer";
import { NotificationManager } from "../../lib/notificationManager/NotificationManager";
import { Box, Typography, Card, CardContent, Container} from "@mui/material";
import { styled } from "@mui/system";

const NotificationPage: React.FC = (): React.ReactElement => {
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


  return (
    <>
      <MetaData title="Notifications" />
      <NotificationRenderer>
        <Box className="notification-header">
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
        </Box>

        <Box className="notifications-holder">
          {notifications?.length > 0 ? (
            notifications
              .sort((a, b) => b?.date - a?.date)
              .map((not: any, i: number) => (
                <Card
                  sx={{ margin: 2, width: "100%", maxWidth: "600px" }}
                  key={i}
                >
                  <CardContent>
                    <NotificationItem
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
                  </CardContent>
                </Card>
              ))
          ) : (
            <Typography
              sx={{
                fontWeight: 600,
                color: "gray",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 4,
              }}
            >
              No notifications yet
            </Typography>
          )}
        </Box>
      </NotificationRenderer>
      <Footer />
    </>
  );
};

export default NotificationPage;

const NotificationRenderer =  styled(Container)`
  margin-top: 20px;
  margin-bottom: 40px;
  min-height:100vh;

  .notification-header {
    margin-top: 5px;
    width: 100%;
    height: fit-content;
    padding-left: 16px;
    border-bottom: 1px solid #ededed;
    font-weight: 600;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 600px) {
      padding-left: 8px;
      font-size: 18px;
    }
  }

  .notifications-holder {
    padding: 16px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 20px;

    @media (max-width: 600px) {
      padding: 8px;
    }
  }
`;
