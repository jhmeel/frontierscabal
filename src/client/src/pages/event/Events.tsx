import React, { useState, useEffect, useRef } from "react";
import MetaData from "../../MetaData";
import styled, { ThemeProvider } from "styled-components";
import { IconFilter } from "../../assets/icons";
import EventItem from "../../components/eventItem/EventItem";
import Footer from "../../components/footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  searchRecentEvent,
  searchUpcomingEvents,
  searchOngoingEvents,
  clearErrors,
  searchEventByCategory,
} from "../../actions/event";
import { isOnline } from "../../utils";
import EventSkeletonLoader from "../../components/loaders/EventSkeletonLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../store";

const Event = () => {
  const dispatch = useDispatch();
  const [currentSelection, setCurrentSelection] = useState("Ongoing");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { loading, events, error } = useSelector(
    (state: RootState) => state.eventSearch
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const location = useLocation();
  const navigate = useNavigate();
  const toggleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleSelection = (selection: string) => {
    navigate({
      pathname: "/events/search",
      search: `?selection=${encodeURIComponent(selection)}`,
    });
    toggleMenuOpen();
  };
  const events_timelines = ["Ongoing", "Upcoming", "Recents"];

  useEffect(() => {
    const search = location.search;

    const searchCatg = new URLSearchParams(search).get("category");
    searchCatg && setSelectedCategory(decodeURIComponent(searchCatg.trim()));

    const searchSelection = new URLSearchParams(search).get("selection");
    if (searchSelection) {
      const regex = new RegExp(decodeURIComponent(searchSelection.trim()), "i");
      for (const timeline of events_timelines) {
        if (regex.test(timeline)) {
          setCurrentSelection(timeline);
          return;
        } else {
          setCurrentSelection("Ongoing");
        }
      }
    }
  }, [location, selectedCategory, currentSelection]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch<any>(clearErrors());
    }
    if (selectedCategory && selectedCategory !== "All" && isOnline()) {
      dispatch<any>(searchEventByCategory(selectedCategory));
    } else if (currentSelection == "Upcoming" && isOnline()) {
      dispatch<any>(searchUpcomingEvents());
    } else if (currentSelection === "Recents" && isOnline()) {
      dispatch<any>(searchRecentEvent());
    } else {
      isOnline() && dispatch<any>(searchOngoingEvents());
    }
  }, [currentSelection, error, dispatch]);

  const menuRef = useRef(null);

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsMenuOpen(false);
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
      <MetaData title="Events" />
      <main>
        <EventRenderer>
          <div className="event-header">
            <span
              ref={menuRef}
              className="e-selection"
              onClick={toggleMenuOpen}
            >
              <IconFilter className="e-filter-icon" />
              &nbsp;&nbsp;
              {currentSelection}
            </span>
            {isMenuOpen && (
              <div className="e-menu">
                <ul>
                  {events_timelines.map((e, i) => (
                    <li key={i} onClick={() => handleSelection(e)}>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="event-holder">
            {!loading && events?.length == 0 && (
              <span>No "{currentSelection}" event found!</span>
            )}

            {events?.length
              ? events.map((eve, i) => (
                  <EventItem
                    key={i}
                    id={eve?._id}
                    slug={eve?.slug}
                    title={eve?.title}
                    avatar={eve?.avatar.url}
                    description={eve?.description}
                    category={eve?.category}
                    createdBy={eve?.createdBy}
                  />
                ))
              : loading && Array(10)
                  .fill(null)
                  .map((_, i) => <EventSkeletonLoader key={i} />)}
          </div>
        </EventRenderer>
        <Footer />
      </main>
    </>
  );
};

export default Event;

const EventRenderer = styled.div`
  max-width: 600px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  .event-header {
    position: fixed;
    width: inherit;
    padding-top: 20px;
    border-bottom: 1px solid #ededed;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    -moz-backdrop-filter: blur(10px);
    -o-backdrop-filter: blur(10px);
    transform: 0.5s;
    z-index: 99;
  }
  .e-selection {
    margin-left: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
  }

  .e-menu {
    position: fixed;
    left: 10px;
    z-index: 999;
    background-color: #fff;
    height: fit-content;
    width: fit-content;
    border-radius: 5px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  }
  .e-menu ul {
    list-style: none;
  }

  .e-menu li {
    padding: 8px;
    border-bottom: 1px solid #ededed;
    font-size: 12px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    font-weight: 600;
    cursor: pointer;
  }
  .e-menu li:hover {
    background-color: #176984;
    color: #fff;
  }

  .e-menu li:first-child:hover {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .e-menu li:last-child {
    border-bottom: none;
  }
  .e-menu li:last-child:hover {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .e-filter-icon {
    cursor: pointer;
    height: 18px;
    width: 18px;
  }
  .event-holder {
    max-width: 600px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    top: 52px;
    margin-bottom: 40px;
    padding: 5px 10px;
  }
`;
