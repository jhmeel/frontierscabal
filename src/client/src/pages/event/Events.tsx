import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Stack,
  Chip,
  Paper,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Event as EventIcon,
  Add as AddIcon,
  FilterList,
  Close,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import MetaData from "../../MetaData";
import Footer from "../../components/footer/Footer";
import EventSkeletonLoader from "../../components/loaders/EventSkeletonLoader";
import {
  searchRecentEvent,
  searchUpcomingEvents,
  searchOngoingEvents,
  clearErrors,
  searchEventByCategory,
} from "../../actions/event";
import { RootState } from "../../store";
import EventItem from "../../components/eventItem/EventItem";

const EVENT_CATEGORIES = [
  "All",
  "Fashion Shows",
  "Film Festivals",
  "Religious Gatherings",
  "Comedy Shows",
  "Conference",
  "Workshop",
  "Meetup",
  "Webinar",
  "Hackathon",
];

const EVENT_TIMELINES = ["Ongoing", "Upcoming", "Recents"];

const Event: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [currentTimeline, setCurrentTimeline] = useState("Ongoing");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { loading, events, error } = useSelector(
    (state: RootState) => state.eventSearch
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch<any>(clearErrors());
    }

    if (selectedCategory && selectedCategory !== "All") {
      dispatch<any>(searchEventByCategory(selectedCategory));
    } else if (currentTimeline === "Upcoming") {
      dispatch<any>(searchUpcomingEvents());
    } else if (currentTimeline === "Recents") {
      dispatch<any>(searchRecentEvent());
    } else {
      dispatch<any>(searchOngoingEvents());
    }
  }, [currentTimeline, error, selectedCategory, dispatch]);

  const FilterContent = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: isMobile ? 2 : 0,
      }}
    >
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Timeline
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {EVENT_TIMELINES.map((timeline) => (
            <Chip
              key={timeline}
              label={timeline}
              variant={currentTimeline === timeline ? "filled" : "outlined"}
              color="primary"
              onClick={() => {
                setCurrentTimeline(timeline);
                setMobileFilterOpen(false);
              }}
            />
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Category
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {EVENT_CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={category}
              variant={selectedCategory === category ? "filled" : "outlined"}
              color="secondary"
              onClick={() => {
                setSelectedCategory(category);
                setMobileFilterOpen(false);
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <MetaData title="Events" />
      <EventContainer maxWidth="md">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "flex-start",
              marginBottom: 2,
            }}
          >
            <Typography
              variant={"h5"}
              fontWeight={700}
              display={`flex`}
              alignItems={`center`}
            >
              <EventIcon
                sx={{ fontSize: isMobile ? 24 : 32, color: "primary.main" }}
              />{" "}
              Events
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              width: isMobile ? "100%" : "auto",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              size={"small"}
              onClick={() => navigate("/event/new")}
            >
              Create
            </Button>

            {isMobile ? (
              <Button
                startIcon={<FilterList />}
                variant="outlined"
                size="small"
                onClick={() => setMobileFilterOpen(true)}
              >
                Filters
              </Button>
            ) : null}
          </Box>
        </Box>

        {!isMobile && <FilterContent />}

        <AnimatePresence>
          {!loading && events?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "50vh",
                  textAlign: "center",
                }}
              >
                <EventIcon
                  sx={{
                    fontSize: isMobile ? 80 : 100,
                    color: "text.secondary",
                    mb: 2,
                  }}
                />
                <Typography variant={"h6"} color="text.secondary">
                  No "{currentTimeline}" events found
                </Typography>
              </Box>
            </motion.div>
          ) : (
            <Stack spacing={2} mt={3}>
              {loading
                ? Array(5)
                    .fill(null)
                    .map((_, i) => <EventSkeletonLoader key={i} />)
                : events?.map((eve, i) => (
                    <EventItem
                      key={i}
                      id={eve?._id}
                      slug={eve?.slug}
                      title={eve?.title}
                      avatar={eve?.avatar.url}
                      category={eve?.category}
                      createdBy={eve?.createdBy}
                      startDate={eve?.startDate}
                    />
                  ))}
            </Stack>
          )}
        </AnimatePresence>
      </EventContainer>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="bottom"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Filter Events</Typography>
          <IconButton onClick={() => setMobileFilterOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <FilterContent />
      </Drawer>

      <Footer />
    </>
  );
};

const EventContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

const StyledEventPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: theme.spacing(3),
  transition: "all 0.3s ease",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(1.5),
  },
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[6],
  },
}));

export default Event;
