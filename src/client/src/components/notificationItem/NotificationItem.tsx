import React, { useState, useRef, useEffect } from "react";
import {
  IconDeleteForeverOutline,
  IconDotsVertical,
  IconSpeaker,
} from "../../assets/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import styled, { ThemeProvider } from "styled-components";
import { NotificationManager } from "../../lib/notificationManager/NotificationManager";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const NotificationItem = ({
  id,
  type,
  message,
  slug,
  avatar,
  entityname,
  date,
}) => {
  const navigate = useNavigate();
  const [opened, setIsOpened] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const { theme } = useSelector((state: RootState) => state.theme);
  const notificationService = NotificationManager.getInstance();

  const handleRemove = () => {
    notificationService.deleteNotification(id);
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsOpened(!opened);
  };

  const handleMarking = () => {
    if (isRead) {
      notificationService.markNotificationUnRead(id);
    } else {
      notificationService.markNotificationAsRead(id);
    }
    window.location.reload();
  };
  const handleView = () => {
    navigate(slug);
  };

  const handleSelection = (selection: string) => {
    toggleMenu();
    if (selection === "marking") {
      handleMarking();
    } else if (selection === "delete") {
      handleRemove();
    }
  };
  const handleUpdate = () => {
    navigate("/profile/edit");
  };

  const optionRef = useRef(null);
  const handleClickOutside = (e) => {
    if (optionRef.current && !optionRef.current.contains(e.target)) {
      setIsOpened(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsRead(notificationService.isNotificationRead(id));
  }, [notificationService, handleMarking]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <NotificationItemRenderer>
          <div className="notification-head">
            {avatar ? (
              <div className="not-avatar">
                <img src={avatar} loading="lazy" alt="" />
                <span className="not-item-username">{entityname}</span>
              </div>
            ) : (
              <span className="sx-m-icon">
                <IconSpeaker height="20px" width="20px" />
              </span>
            )}
            <span ref={optionRef}>
              <IconDotsVertical className="not-dot-icon" onClick={toggleMenu} />
            </span>
            {opened && (
              <div className="not-menu">
                <ul className="not-menu-items">
                  <li onClick={() => handleSelection("delete")}>Delete</li>
                  {!isRead && (
                    <li onClick={() => handleSelection("marking")}>
                      {isRead ? "Mark as unread" : "Mark as read"}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="notification-details">
            <p>
              {message?.length > 95 ? `${message?.slice(0, 95)}...` : message}
            </p>
          </div>
          <div className="not-option">
            <button
              className="mar"
              onClick={type === "NEW:USER" ? handleUpdate : handleMarking}
            >
              {type === "NEW:USER"
                ? "Update"
                : isRead
                ? "Mark as unread"
                : "Mark as read"}
            </button>
            <button onClick={() => handleView()}>View</button>
          </div>
          <p className="not-date">{moment(date).fromNow()}</p>
        </NotificationItemRenderer>
      </ThemeProvider>
    </>
  );
};

export default NotificationItem;
const NotificationItemRenderer = styled.div`
  position: relative;
  color: #2e2e2f;
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ededed;
  margin-bottom: 1rem;
  max-width: 600px;
  min-width: 500px;
  height: fit-content;
  overflow: hidden;
  margin-bottom: 5px;

  @media (max-width: 767px) {
    & {
      min-width: 335px;
      max-width: 400px;
    }
  }

  .notification-head {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }
  .notification-item-cont p {
    margin: 1rem 0;
  }

  .not-avatar {
    border-radius: 50%;
    padding: 4px 13px;
    height: 50px;
    width: 50px;
    position: relative;
    border: 2px solid #176984;
    margin: 5px;
  }
  .not-avatar img {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    border-radius: 50%;
  }
  .not-item-username {
    margin-left: 40px;
    font-weight: 600;
    font-size: 12px;
    color: gray;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  .not-option {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .notification-details p {
    font-size: 13px;
    text-align: center;
    margin-bottom: 10px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  .not-option button {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    background-color: #176984;
    color: #fff;
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  .not-option .mar {
    background-color: transparent;
    border: 1px solid #ccc;
    margin-right: 5px;
    transition: 0.3s ease-out;
    color: #2e2e2f;
  }
  .not-option .mar:hover {
    background-color: #176984;
    color: #fff;
  }

  .not-menu {
    position: absolute;
    height: fit-content;
    width: max-content;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: #ffffff;
    z-index: 100000;
    top: 8%;
    right: 5%;
  }
  .not-menu .not-menu-items li {
    display: flex;
    align-items: center;
    border-bottom: 0.1px solid #ededed;
    padding: 6px 12px;
    transition: 0.3s ease-in-out;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    text-align: center;
    font-size: 13px;
    gap: 8px;
    cursor: pointer;
  }
  .not-menu .not-menu-items li {
    color: #000;
  }
  .not-menu .not-menu-items li:hover {
    background-color: gray;
    color: #fff;
  }
  .not-menu .not-menu-items li:first-child:hover {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .not-menu .not-menu-items li:last-child:hover {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .not-dot-icon,
  .not-list-icon {
    cursor: pointer;
    height: 20px;
    width: 20px;
  }

  .sx-m-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    background-color: rgba(96, 165, 250, 1);
    padding: 0.5rem;
    color: rgba(255, 255, 255, 1);
  }
  .not-date {
    font-size: 10px;
    color: #8b8e98;
  }
`;
