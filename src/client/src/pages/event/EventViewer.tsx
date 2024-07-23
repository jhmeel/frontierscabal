import React, { useState, useEffect } from "react";
import MetaData from "../../MetaData";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getEventDetails, clearErrors } from "../../actions/event";
import SpinLoader from "../../components/loaders/SpinLoader";
import moment from "moment";
import {
  IconBxEditAlt,
  IconCalendarEventFill,
  IconDeleteForeverOutline,
  IconLocationDot,
  IconShare,
} from "../../assets/icons";
import RDotLoader from "../../components/loaders/RDotLoader";
import getToken from "../../utils/getToken";
import axiosInstance from "../../utils/axiosInstance";
import { errorParser } from "../../utils";
import styled from "styled-components";
import toast from "react-hot-toast";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { RootState } from "../../store";


const EventViewer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { loading, error, event } = useSelector((state:RootState) => state.eventDetails);
  const { user } = useSelector((state:RootState) => state.user);
  useEffect(() => {
    if (!params.slug) {
      toast.error("Invalid event");
      return;
    } else if (error) {
      toast.error(error);
      dispatch<any>(clearErrors());
    }
    dispatch<any>(getEventDetails(params.slug));
  }, [dispatch, error, params.slug]);

  const openInGoogleMaps = (venue) => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      venue
    )}`;
    window.open(mapUrl, "_blank");
  };

  const handleEventDelete = async () => {
    try {
      setDeleteLoading(true);
      const authToken = await getToken();
      const { data } = await axiosInstance(authToken).delete(
        `/api/v1/event/${event?._id}`
      );
      setDeleteLoading(false);
      if (data.success) {
        toast.success("Event Deleted");
        navigate("/");
      }
    } catch (error) {
      setDeleteLoading(false);
      toast.error(errorParser(error));
    }
  };

  const handleEventShare = async () => {
    const imgBlob = await fetch(event?.avatar?.url).then((r) => r.blob());
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `${event?.description?.substring(0, 15)}...`,
        url: `https://${window.location.host}/#/event/${event?.slug}`,
        files: [new File([imgBlob], "image.png", { type: imgBlob.type })],
      });
    }
  };
  const showConfirmation = () => {
    enqueueSnackbar(`Are you sure you want to Delete ${event?.title}?`, {
      variant: "info",
      persist: true,
      action: (key) => (
        <>
          <button
            className="snackbar-btn"
            onClick={() => {
              closeSnackbar();
              handleEventDelete();
            }}
          >
            proceed
          </button>
          <button className="snackbar-btn" onClick={() => closeSnackbar()}>
            Cancel
          </button>
        </>
      ),
    });
  };

  return (
    <>
      <MetaData title={`event`} />
      {loading && <SpinLoader />}
      <main>
        <EventViewerRenderer>
          <div className="event-view-header">
            <img src={event?.avatar?.url} alt={event?.title} />
          </div>
          <div className="event-view-content">
            <div className="event-view-card">
              <h1 className="ev-view-tit">{event?.title}</h1>
              <span className="ev-start">
                <IconCalendarEventFill height="18" width="18" fill="#176984" />
                &nbsp; Start:{" "}
                <span className="ev-start-date">
                  {moment(event?.startDate).format("MMMM DD, YYYY [at] HH:mma")}
                </span>
              </span>
              <span className="ev-end">
                <IconCalendarEventFill height="18" width="18" fill="#176984" />
                &nbsp; End:{" "}
                <span className="ev-end-date">
                  {moment(event?.endDate).format("MMMM DD, YYYY [at] HH:mma")}
                </span>
              </span>
              <p className="event-view-cat">{event?.category}</p>
              <h2>About this event</h2>
              <div className="event-view-desc">{event?.description}</div>
              <span className="event-view-location">
                <IconLocationDot height="18" width="18" fill="#176984" />
                Avenue&nbsp;|
                <span
                  style={{ color: "#176984" }}
                  onClick={() => openInGoogleMaps(event?.avenue)}
                >
                  {event?.avenue}
                </span>
              </span>
              <span
                className="event-postedBy"
                onClick={() =>
                  navigate(`/profile/${event?.createdBy?.username}`)
                }
              >
                <span className="ev-contact-us">
                  Contact us&nbsp;|
                  <span className="ev-postedby-usr">
                    @{event?.createdBy?.username}
                  </span>
                </span>
              </span>
            </div>
          </div>

          <div className="evt-reaction-bar">
            {event?.createdBy?.username === user?.username && (
              <Link to={`/event/update/${event?.slug}`}>
                <span title="Edit">
                  <IconBxEditAlt className="evt-view-icon" fill="#000" />
                </span>
              </Link>
            )}

            <span title="Share">
              <IconShare
                className="evt-view-icon"
                onClick={handleEventShare}
                fill="#000"
              />
            </span>
            {event?.createdBy?.username === user?.username && (
              <span title="Delete">
                {deleteLoading ? (
                  <RDotLoader />
                ) : (
                  <IconDeleteForeverOutline
                    className="evt-view-icon"
                    onClick={showConfirmation}
                    fill="#000"
                  />
                )}
              </span>
            )}
          </div>
        </EventViewerRenderer>
      </main>
    </>
  );
};

export default EventViewer;


const EventViewerRenderer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  
  .ev-view-tit {
    font-size: 20px;
    text-align: center;
    text-transform: uppercase;
  }
  
  .event-view-header {
    width: 100%;
    max-height: 200px;
    min-height: 200px;
    position: relative;
    border-bottom: 1px solid #ededed;
  }
  .event-view-header img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    position: absolute;
  }
  
  .ev-start,
  .ev-end {
    display: flex;
    gap: 5px;
    align-items: center;
    font-size: 12px;
    text-transform: capitalize;
    font-weight: 700;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  .ev-start-date,
  .ev-end-date {
    font-weight: 500;
  }
  .event-view-content {
    width: 100%;
    height: fit-content;
    position: relative;
  }
  .event-view-card {
    background-color: #fff;
    border-radius: 4px;
    padding: 20px 10px;
    margin: 12px;
    text-decoration: none;
    overflow: hidden;
    border: 1px solid #ccc;
    position: relative;
  }
  
  .event-view-cat {
    font-size: 12px;
    background-color: #176984;
    font-weight: 500;
    color: #fff;
    width: fit-content;
    padding: 3px 6px;
    margin: 5px 10px;
  }
  
  .event-view-desc {
    font-size: 16px;
    margin: 5px;
    color: grey;
  }
  
  .event-view-location {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-weight: 600;
    padding-bottom: 20px;
    cursor: pointer;
  }
  .ev-contact-us {
    position: absolute;
    right: 10px;
    bottom: 0;
    padding: 10px 5px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .event-postedBy {
    font-size: 14px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    color: black;
    cursor: pointer;
    font-weight: 600;
  }
  .ev-postedby-usr {
    color: #176984;
  }
  @media (max-width: 767px) {
    .ev-view-tit {
      font-size: 16px;
    }
    .event-view-cat {
      font-size: 10px;
    }
  
    .ev-start,
    .ev-end {
      font-size: 11px;
    }
    .event-view-location {
      font-size: 12px;
    }
    .event-view-desc {
      font-size: 14px;
    }
    .art-view-icon {
      height: 18px;
      width: 18px;
    }
  }
  
  .evt-reaction-bar {
    width: fit-content;
    padding: 10px 20px;
    background-color: #000000;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    position: fixed;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    z-index: 995;
  }
  .evt-view-icon {
    height: 24px;
    width: 24px;
    position: relative;
    fill: rgb(148, 146, 146);
    cursor: pointer;
  }
  .evt-view-cont-txt {
    cursor: pointer;
    font-size: 12px;
    color: #fff;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  
  .snackbar-btn {
    padding: 6px 12px;
    color: #000;
    border: none;
    border-radius: 5px;
    margin-right: 5px;
    cursor: pointer;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  

`
