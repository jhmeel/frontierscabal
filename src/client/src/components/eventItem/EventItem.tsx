import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconBxEditAlt,
  IconDeleteForeverOutline,
  IconDotsHorizontal,
  IconShare,
} from "../../assets/icons";
import styled from "styled-components";
import { useSelector } from "react-redux";
import getToken from "../../utils/getToken";
import { useSnackbar } from "notistack";
import RDotLoader from "../loaders/RDotLoader";
import { errorParser } from "../../utils/formatter";
import axiosInstance from "../../utils/axiosInstance";
import { RootState } from "../../store";
const EventItem = ({
  id,
  slug,
  title,
  description,
  category,
  avatar,
  createdBy,
}) => {
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [optionVisible, setIsOptionVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user } = useSelector((state:RootState) => state.user);
  const handleEventDelete = async () => {
    try {
      setDeleteLoading(true);
      const authToken = await getToken();
      closeSnackbar();
      const { data } = await axiosInstance(authToken).delete(
        `/api/v1/event/${id}`
      );
      setDeleteLoading(false);
      if (data.success) {
        enqueueSnackbar("Event Deleted", { variant: "success" });
        window.location.reload();
      }
    } catch (error) {
      setDeleteLoading(false);
      enqueueSnackbar(errorParser(error), { variant: "error" });
    }
  };

  const showConfirmation = () => {
    toggleOptionVisible();
    enqueueSnackbar("Are you sure you want to delete the event?", {
      variant: "info",
      persist: true,
      action: (key) => (
        <>
          <button className="snackbar-btn" onClick={() => handleEventDelete()}>
            Proceed
          </button>
          <button className="snackbar-btn" onClick={() => closeSnackbar()}>
            No
          </button>
        </>
      ),
    });
  };
  const toggleOptionVisible = () => {
    setIsOptionVisible(!optionVisible);
  };
  const optionRef = useRef(null);
  const handleClickOutside = (e) => {
    if (optionRef.current && !optionRef.current.contains(e.target)) {
      setIsOptionVisible(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleShare = async () => {
    const imgBlob = await fetch(avatar).then((r) => r.blob());
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: `https://${window.location.host}/#/event/${slug}`,
        files: [new File([imgBlob], "image.png", { type: imgBlob.type })],
      });
    }
  };
  const handleCategorySearch = () => {
    navigate({
      pathname: "/events/search",
      search: `?category=${encodeURIComponent(category)}`,
    });
  };
  return (
    <>
        <EventItemRenderer>
          <div className="event-item-head" ref={optionRef}>
            <div className="event-avatar">
              <img src={avatar} loading="lazy" alt="" />
            </div>

            <span onClick={toggleOptionVisible}>
              <IconDotsHorizontal height="20" width="20" />
              <div>
                {optionVisible && (
                  <div className="event-it-menu">
                    <ul className="event-it-menu-options">
                      <li title="Share" onClick={handleShare}>
                        <IconShare height="22" width="22" />
                        &nbsp; Share
                      </li>
                      {user?.username === createdBy?.username && (
                        <li
                          title="Edit"
                          onClick={() => navigate(`/event/update/${slug}`)}
                        >
                          <IconBxEditAlt height="22" width="22" />
                          &nbsp; Edit
                        </li>
                      )}
                      {user?.username === createdBy?.username && (
                        <li title="Delete" onClick={showConfirmation}>
                          {deleteLoading ? (
                            <RDotLoader />
                          ) : (
                            <IconDeleteForeverOutline
                              height="22"
                              width="22"
                              fill="crimson"
                            />
                          )}
                          &nbsp; Delete
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </span>
          </div>
          <div className="event-details">
            <span className="event-category" onClick={handleCategorySearch}>
              {category?.length > 14 ? `${category.slice(0, 14)}...` : category}
            </span>
            <span className="event-title">
              {title?.length > 20 ? `${title.slice(0, 20)}...` : title}
            </span>
            <p className="event-desc">
              {description?.length > 100
                ? `${description.slice(0, 100)}...`
                : description}
            </p>
          </div>
          <div className="event-option">
            <button
              className="e-mar"
              onClick={() => navigate(`/event/${slug}`)}
            >
              View
            </button>
          </div>
        </EventItemRenderer>
  
    </>
  );
};

export default EventItem;
const EventItemRenderer = styled.div`
  position: relative;
  color: #2e2e2f;
  background-color: #fff;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
  margin-bottom: 1rem;
  border: 3px dashed transparent;
  max-width: 600px;
  min-width: 500px;
  max-height: 200px;
  overflow: hidden;

  @media (max-width: 767px) {
    .event-item-cont {
      min-width: 340px;
      max-width: 340px;
    }
  }
  .event-item-head {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    position: relative;
    height: 30px;
  }
  .event-item-cont p {
    font-size: 15px;
    margin: 1.2rem 0;
  }

  .event-avatar {
    border-radius: 50%;
    padding: 4px 13px;
    height: 60px;
    width: 60px;
    border: 2px solid #176984;
    position: relative;
  }
  .event-avatar img {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 50%;
  }
  .event-option {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .event-it-menu {
    position: absolute;
    width: fit-content;
    height: fit-content;
    right: 10px;
    top: 20px;
    z-index: 999;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: #fff;
  }
  .event-it-menu-options li {
    display: flex;
    align-items: center;
    border-bottom: 0.1px solid #ededed;
    padding: 6px 12px;
    transition: 0.3s ease-in-out;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    text-align: center;
    font-size: 13px;
    gap: 6px;
    cursor: pointer;
  }

  .event-it-menu-options li:hover {
    background-color: rgb(1, 95, 123);
    color: #fff;
  }

  .event-details {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 5px 10px 0px;
    flex-direction: column;
    max-height: 70px;
  }
  .event-title {
    font-size: 16px;
    font-weight: 600;
  }
  .event-desc {
    font-size: 13px;
    color: gray;
    margin: 10px 0px;
    height: 30px;
    line-height: 1.3rem;
    width: 100%;
    text-align: center;
  }
  .event-category {
    position: absolute;
    left: 0px;
    bottom: 0;
    font-size: 10px;
    font-weight: 600;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    padding: 3px;
    z-index: 9;
    background: linear-gradient(-45deg, #16aebc 0%, #176984 100%);
    color: #fff;
    max-width: 100px;
    max-height: 30px;
    cursor: pointer;
    overflow: hidden;
  }

  .event-option button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7px 15px;
    border: none;
    border-radius: 16px;
    background-color: transparent;
    border: 2px solid #176984;
    color: #176984;
    cursor: pointer;
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    margin-top: 15px;
  }
  .event-option button:hover {
    background-color: #176984;
    color: #fff;
    transition: 0.3s ease-in;
  }
`;
