import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Snackbar,
  Tooltip,
  useMediaQuery,
  Container,
  Paper,
  Chip,
  Divider,
  Avatar,
  Badge
} from "@mui/material";
import { styled } from "@mui/system";
import {
  IconBxEditAlt,
  IconCalendarEventFill,
  IconDeleteForeverOutline,
  IconShare,
  IconPin
} from "../../assets/icons";
import { getEventDetails, clearErrors } from "../../actions/event";
import MetaData from "../../MetaData";
import SpinLoader from "../../components/loaders/SpinLoader";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
import getToken from "../../utils/getToken";
import { RootState } from "../../store";

const EventWrapper = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  position: "relative",
  minHeight: "90vh"
}));

const HeaderSection = styled(Paper)(({ theme }) => ({
  position: "relative",
  height: "60vh",
  borderRadius: theme.spacing(3),
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
}));

const HeaderImage = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8));
  }
`;

const EventContent = styled(Paper)(({ theme }) => ({
  position: "relative",
  marginTop: theme.spacing(-10),
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: "800px",
  padding: theme.spacing(2),
  borderRadius: theme.spacing(3),
  backgroundColor: "rgba(255, 255, 255, 0.98)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
}));

const DateBadge = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(-3),
  right: theme.spacing(4),
  padding: theme.spacing(2,3),
  borderRadius: theme.spacing(2),
  background: theme.palette.primary.main,
  color: "white",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
}));

const LocationChip = styled(Chip)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2, 1),
  '& .MuiChip-icon': {
    color: theme.palette.primary.main
  }
}));

const ActionBar = styled(motion.div)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(4),
  left: "25%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: theme.spacing(2),
  padding: theme.spacing(1,2),
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(12px)",
  borderRadius: theme.spacing(3),
  border: "1px solid #ededed",
  zIndex: 1000
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: theme.spacing(1.5),
  '&:hover': {
    background: theme.palette.primary.main,
    color: "white",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
  },
  transition: "all 0.3s ease"
}));

const EventViewer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { loading, error, event } = useSelector((state: RootState) => state.eventDetails);
  const { user } = useSelector((state: RootState) => state.user);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [scrolling, setScrolling] = useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (!slug) {
      setSnackbarMessage("Invalid event.");
      setSnackbarOpen(true);
      return;
    }
    if (error) {
      setSnackbarMessage(error);
      setSnackbarOpen(true);
      dispatch<any>(clearErrors());
    }
    dispatch<any>(getEventDetails(slug));

    const handleScroll = () => {
      setScrolling(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch, error, slug]);

  const handleEventDelete = async () => {
    setDeleteLoading(true);
    try {
      const authToken = await getToken();
      const { data } = await axiosInstance(authToken).delete(`/api/v1/event/${event?._id}`);
      setDeleteLoading(false);
      if (data.success) {
        setSnackbarMessage("Event deleted successfully.");
        setSnackbarOpen(true);
        navigate("/");
      }
    } catch (err) {
      setDeleteLoading(false);
      setSnackbarMessage("Failed to delete event.");
      setSnackbarOpen(true);
    }
  };

  const handleEventShare = async () => {
    try {
      const imgBlob = await fetch(event?.avatar?.url).then((r) => r.blob());
      if (navigator.share) {
        navigator.share({
          title: event?.title,
          text: `${event?.description?.substring(0, 15)}...`,
          url: `https://${window.location.host}/#/event/${event?.slug}`,
          files: [new File([imgBlob], "image.png", { type: imgBlob.type })]
        });
      }
    } catch (error) {
      setSnackbarMessage("Failed to share event.");
      setSnackbarOpen(true);
    }
  };

  if (loading) return <SpinLoader />;

  return (
    <>
      <MetaData title={`Event - ${event?.title || "Loading..."}`} />
      <EventWrapper maxWidth="lg">
        <HeaderSection>
          <HeaderImage>
            <img src={event?.avatar?.url} alt={event?.title} />
          </HeaderImage>
        </HeaderSection>

        <EventContent elevation={0}>
          <DateBadge elevation={2} style={{display:"flex", gap:"5px", justifyContent:"center", alignItems:"center"}}>
          <IconCalendarEventFill fontSize={26}/>
            <div>
            <Typography variant="subtitle2" fontWeight="bold">
              {moment(event?.startDate).format("MMM DD")} - {moment(event?.endDate).format("MMM DD, YYYY")}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {moment(event?.startDate).format("HH:mm A")} - {moment(event?.endDate).format("HH:mm A")}
            </Typography>
            </div>
        
            
          </DateBadge>

          <Box sx={{ mt: 3 }}>
            <Typography 
              variant={isMobile ? "h2" : "h1"} 
              fontWeight="bold"
              color="text.primary"
              gutterBottom
            >
              {event?.title}
            </Typography>
            
            <Chip 
              label={event?.category}
              color="primary"
              sx={{ mb: 3 }}
            />

            <Divider sx={{ my: 3 }} />

            <Typography 
              variant="body1" 
              color="text.primary"
              sx={{ 
                mb: 4,
                lineHeight: 1.8,
              }}
            >
              {event?.description}
            </Typography>

            <LocationChip
              icon={<IconPin />}
              label={event?.avenue}
              onClick={() => window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event?.avenue)}`,
                "_blank"
              )}
            />
            
            <Box sx={{ mt: 4, display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src={event?.createdBy?.avatar?.url} />
              <Box>
                <Typography variant="subtitle2" color="text.primary" fontWeight="bold">
                  {event?.createdBy?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Event Organizer
                </Typography>
              </Box>
            </Box>
          </Box>
        </EventContent>

        <AnimatePresence>
          {!scrolling && (
            <ActionBar
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {event?.createdBy?.username === user?.username && (
                <Tooltip title="Edit">
                  <Link to={`/event/update/${event?.slug}`}>
                    <ActionButton>
                      <IconBxEditAlt />
                    </ActionButton>
                  </Link>
                </Tooltip>
              )}
              
              <Tooltip title="Share">
                <ActionButton onClick={handleEventShare}>
                  <IconShare />
                </ActionButton>
              </Tooltip>

              {event?.createdBy?.username === user?.username && (
                <Tooltip title="Delete">
                  <ActionButton onClick={handleEventDelete} color="error">
                    {deleteLoading ? <SpinLoader size={20} /> : <IconDeleteForeverOutline />}
                  </ActionButton>
                </Tooltip>
              )}
            </ActionBar>
          )}
        </AnimatePresence>

        <Snackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          autoHideDuration={3000}
        />
      </EventWrapper>
    </>
  );
};

export default EventViewer;