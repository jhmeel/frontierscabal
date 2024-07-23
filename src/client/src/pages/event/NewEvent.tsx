import React, { useEffect, useState, useRef } from "react";
import MetaData from "../../MetaData";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconCaretDown } from "../../assets/icons";
import { addNewEvent, clearErrors, updateEvent } from "../../actions/event";
import RDotLoader from "../../components/loaders/RDotLoader";
import getToken from "../../utils/getToken";
import { isOnline } from "../../utils";
import { NEW_EVENT_RESET, UPDATE_EVENT_RESET } from "../../constants/event";
import styled from "styled-components";
import toast from "react-hot-toast";
import { RootState } from "../../store";

const NewEvent = ({
  eveId,
  eveTitle,
  eveDescription,
  eveCategory,
  eveAvenue,
  eveAvatar,
  eveStartDate,
  eveEndDate,
  slug,
  action = "New",
}: {
  eveId?: string;
  eveTitle?: string;
  eveDescription?: string;
  eveCategory?: string;
  eveAvenue?: string;
  eveAvatar?: string;
  eveStartDate?: string;
  eveEndDate?: string;
  slug?: string;
  action?: "New" | "Update";
}) => {
  const [title, setTitle] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [category, setCategory] = useState<string | undefined>("");
  const [startDate, setStartDate] = useState<string | undefined>("");
  const [endDate, setEndDate] = useState<string | undefined>("");
  const [avenue, setAvenue] = useState<string | undefined>("");
  const [avatar, setAvatar] = useState<string | undefined>("");
  const [optionVisible, setIsOptionVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success, event, message, error } = useSelector(
    (state: RootState) => state.newEvent
  );
  const {
    loading: updateLoading,
    message: updateMessage,
    error: updateError,
  } = useSelector((state: RootState) => state.eventUpdate);

  const handleAvatar = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result as string);
      }
    };

    e.target.files && reader.readAsDataURL(e.target.files[0]);
  };
  useEffect(() => {
    if (
      eveTitle ||
      eveDescription ||
      eveAvenue ||
      eveStartDate ||
      eveEndDate ||
      eveAvatar ||
      eveCategory
    ) {
      setTitle(eveTitle);
      setDescription(eveDescription);
      setAvatar(eveAvatar);
      setAvenue(eveAvenue);
      setCategory(eveCategory);
      setStartDate(eveStartDate);
      setEndDate(eveEndDate);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.error(`Event Category is required!`);
      return;
    } else if (!avatar) {
      toast.error(`Event avatar is required!`);
      return;
    }

    const authToken = await getToken();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("avenue", avenue);
    formData.append("startDate", Date.parse(startDate).toString());
    formData.append("endDate", Date.parse(endDate).toString());
    formData.append("avatar", avatar);
    {
      action === "New" && isOnline()
        ? dispatch<any>(addNewEvent(formData, authToken))
        : isOnline() && dispatch<any>(updateEvent(authToken, eveId, formData));
    }
  };

  const toggleOptionVisible = () => {
    setIsOptionVisible(!optionVisible);
  };
  const handleSelectedCategory = (category: string) => {
    setCategory(category);
    toggleOptionVisible();
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch<any>(clearErrors());
    } else if (success) {
      toast.success("Event created successfully");
      dispatch({ type: NEW_EVENT_RESET });
      navigate(`/event/${event?.slug}`);
    }
  }, [dispatch, error, success, navigate]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
      dispatch<any>(clearErrors());
    } else if (updateMessage) {
      toast.success("Event updated successfully");
      dispatch({ type: UPDATE_EVENT_RESET });
      navigate(`/event/${slug}`);
    }
  }, [toast, updateError, updateMessage, navigate]);

  const cRef = useRef(null);
  const handleClickOutside = (e) => {
    if (cRef.current && !cRef.current.contains(e.target)) {
      setIsOptionVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      <MetaData title="New-Event" />
      <NewEventFormRenderer
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {avatar && <img src={avatar} loading="lazy" />}
        <div className="eve-inp-cont">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            title="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required={true}
            autoFocus
          />
        </div>
        <div className="eve-inp-cont">
          <label htmlFor="desription">Description:</label>
          <textarea
            title="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required={true}
          />
        </div>

        <div className="event-date-cont">
          <div className="eve-inp-cont">
            <label htmlFor="startdate">Start Date:</label>
            <input
              type="datetime-local"
              title="Event Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required={true}
            />
          </div>
          <div className="eve-inp-cont">
            <label htmlFor="enddate">End Date:</label>
            <input
              type="datetime-local"
              title="Event End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required={true}
            />
          </div>
        </div>

        <div className="eve-inp-cont">
          <label htmlFor="avenue">Avenue:</label>

          <input
            type="text"
            value={avenue}
            title="Event Avenue"
            onChange={(e) => setAvenue(e.target.value)}
            required={true}
          />
        </div>
        <div className="eve-inp-cont">
          <label htmlFor="event-avatar" className="ne-select-avatar">
            {"Select event banner"}
          </label>
          <input
            id="event-avatar"
            name="avatar"
            type="file"
            accept="image/jpeg, image/png, image/gif"
            onChange={handleAvatar}
          />
        </div>
        <div
          className="nw-event-category"
          onClick={toggleOptionVisible}
          ref={cRef}
        >
          <span className="event-selected-catg" title="Categories">
            {category}
          </span>
          <span className="catg-toggle-icon">
            {!category && "Select a category"}
          </span>
          <IconCaretDown
            className="catg-toggle-icon"
            onClick={toggleOptionVisible}
          />

          {optionVisible && (
            <div className="event-categories-menu">
              <ul className="event-categories-menu-options">
                {[
                  "Fashion Shows",
                  "Film Festivals",
                  "Workshops and Seminars",
                  "Charity Galas",
                  "Dinner Party",
                  "Symposium",
                  "Colloquium",
                  "Conference",
                  "Business Conferences",
                  "Comedy Shows",
                  "Literary Festivals",
                  "Trade Exhibitions",
                  "Dance Performances",
                  "Health and Wellness Retreats",
                  "Praise and worship",
                  "Jummat Prayer",
                  "Religious Gatherings",
                ]
                  .sort()
                  .map((opt) => (
                    <li key={opt} onClick={() => handleSelectedCategory(opt)}>
                      {opt}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        <button type="submit">
          {loading || updateLoading ? (
            <RDotLoader />
          ) : action == "New" ? (
            "Create"
          ) : (
            "Update"
          )}
        </button>
      </NewEventFormRenderer>
    </>
  );
};

export default NewEvent;

const NewEventFormRenderer = styled.form`
  max-width: 600px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  margin: 0 auto;
  justify-content: center;
  gap: 10px;
  font-family: "Inter", sans-serif;

  .eve-inp-cont {
    width: 100%;
    height: fit-content;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .eve-inp-cont label {
    font-size: 0.75rem;
    color: #8b8e98;
    font-weight: 600;
    width: 90%;
  }
  input {
    width: 95%;
    height: auto;
    border-radius: 8px;
    outline: none;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef)
      drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
    padding: 10px;
    font-size: medium;
  }
  textarea {
    width: 90%;
    height: 70px;
    border-radius: 8px;
    outline: none;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef)
      drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
    padding: 10px;
    font-size: medium;
  }
  input[id="event-avatar"] {
    display: none;
  }
  input:focus,
  textarea:focus {
    border: 2px solid #176984;
  }
  .ne-select-avatar {
    font-size: 12px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    font-weight: 600;
    cursor: pointer;
    width: fit-content;
    padding: 5px;
    width: 80%;
  }

  .event-date-cont {
    width: 40%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  button {
    padding: 10px 20px;
    background-color: #176984;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }

  img {
    width: 90%;
    height: 230px;
    object-fit: cover;
    cursor: pointer;
    margin: 5px;
    border-radius: 5px;
    border: 2px solid #ededed;
  }

  .nw-event-category {
    color: rgb(0, 0, 0);
    cursor: pointer;
  }

  .event-categories-menu {
    position: absolute;
    z-index: 999;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: #fff;
    top: 55%;
    right: 38%;
    max-height: 300px;
    min-height: 30px;
    overflow-y: scroll;
  }
  @media (max-width: 767px) {
    .event-categories-menu {
      top: 50%;
      right: 20%;
    }
    img {
      height: 200px;
    }
  }
  .event-categories-menu ul li {
    border-bottom: 0.5px solid #dedede;
    padding: 5px 10px;
    transition: 0.3s ease-out;
    font-size: 12px;
    border-radius: 3px;
    cursor: pointer;
  }
  .event-categories-menu ul li:hover {
    background-color: rgb(1, 95, 123);
    color: #fff;
  }

  .event-selected-catg {
    font-size: 14px;
    font-weight: 700;
    color: #000;
    padding: 3px 6px;
    cursor: pointer;
  }
  .catg-toggle-icon {
    cursor: pointer;
    font-size: small;
    color: gray;
  }
`;
