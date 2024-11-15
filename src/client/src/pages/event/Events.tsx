import React, { useState, useEffect, useRef } from "react";
import MetaData from "../../MetaData";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  searchRecentEvent,
  searchUpcomingEvents,
  searchOngoingEvents,
  clearErrors,
  searchEventByCategory,
} from "../../actions/event";
import {  useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import EventItem from "../../components/eventItem/EventItem";
import EventSkeletonLoader from "../../components/loaders/EventSkeletonLoader";
import Footer from "../../components/footer/Footer";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Container,
  useMediaQuery,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";

const Event = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentSelection, setCurrentSelection] = useState("Ongoing");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { loading, events, error } = useSelector(
    (state: RootState) => state.eventSearch
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const theme = useTheme();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch<any>(clearErrors());
    }
    if (selectedCategory && selectedCategory !== "All") {
      dispatch<any>(searchEventByCategory(selectedCategory));
    } else if (currentSelection === "Upcoming") {
      dispatch<any>(searchUpcomingEvents());
    } else if (currentSelection === "Recents") {
      dispatch<any>(searchRecentEvent());
    } else {
      dispatch<any>(searchOngoingEvents());
    }
  }, [currentSelection, error, selectedCategory, dispatch]);

  const handleSelection = (selection: string) => {
    setCurrentSelection(selection);
    handleClose();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <MetaData title="Events" />
      <Container maxWidth="md" sx={{ paddingTop: 4, minHeight:`100vh` }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate("/event/new")}
          >
            Create Event
          </Button>
          <Button
            variant="outlined"
             size="small"
            startIcon={<FilterListIcon />}
            onClick={handleMenuClick}
          >
            {currentSelection}
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            {["Ongoing", "Upcoming", "Recents"].map((timeline) => (
              <MenuItem
                key={timeline}
                onClick={() => handleSelection(timeline)}
                selected={timeline === currentSelection}
              >
                {timeline}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <EventHolder>
          {!loading && events?.length === 0 && (
            <Typography>No "{currentSelection}" event found!</Typography>
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
        </EventHolder>
      </Container>
      <Footer />
    </>
  );
};

export default Event;

const EventHolder = styled(Box)`
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
`;
