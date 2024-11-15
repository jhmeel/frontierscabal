import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Box, Typography, Button, IconButton, Snackbar, useMediaQuery } from "@mui/material";
import { styled } from "@mui/system";
import { getEventDetails, clearErrors } from "../../actions/event";
import { IconBxEditAlt, IconCalendarEventFill, IconDeleteForeverOutline, IconLocationDot, IconShare } from "../../assets/icons";
import MetaData from "../../MetaData";
import SpinLoader from "../../components/loaders/SpinLoader";
import moment from "moment";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import getToken from "../../utils/getToken";
import { RootState } from "../../store";

const EventViewer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { loading, error, event } = useSelector((state: RootState) => state.eventDetails);
  const { user } = useSelector((state: RootState) => state.user);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (!slug) {
      toast.error("Invalid event");
      return;
    }
    if (error) {
      toast.error(error);
      dispatch<any>(clearErrors());
    }
    dispatch<any>(getEventDetails(slug));
  }, [dispatch, error, slug]);

  const handleEventDelete = async () => {
    setDeleteLoading(true);
    try {
      const authToken = await getToken();
      const { data } = await axiosInstance(authToken).delete(`/api/v1/event/${event?._id}`);
      setDeleteLoading(false);
      if (data.success) {
        toast.success("Event Deleted");
        navigate("/");
      }
    } catch (error:any) {
      setDeleteLoading(false);
      toast.error(error.message || "Failed to delete event.");
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

  const confirmDelete = () => setSnackbarOpen(true);
  const closeSnackbar = () => setSnackbarOpen(false);

  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <>
      <MetaData title={`Event - ${event?.title || "Loading..."}`} />
      {loading && <SpinLoader />}
      <Box sx={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
        <Header>
          <img src={event?.avatar?.url} alt={event?.title} />
        </Header>
        <Content>
          <Typography variant="h4" gutterBottom>{event?.title}</Typography>
          <Box display="flex" alignItems="center" gap="8px">
            <IconCalendarEventFill height={20} />
            <Typography>{moment(event?.startDate).format("MMMM DD, YYYY [at] HH:mma")}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap="8px">
            <IconCalendarEventFill height={20} />
            <Typography>{moment(event?.endDate).format("MMMM DD, YYYY [at] HH:mma")}</Typography>
          </Box>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            {event?.category}
          </Typography>
          <Typography variant="body1">{event?.description}</Typography>
          <Box display="flex" alignItems="center" gap="8px" mt={2}>
            <IconLocationDot height={20} />
            <Typography 
              color="secondary"
              sx={{ cursor: "pointer" }}
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event?.avenue)}`, "_blank")}
            >
              {event?.avenue}
            </Typography>
          </Box>
        </Content>

        <ActionBar>
          {event?.createdBy?.username === user?.username && (
            <Link to={`/event/update/${event?.slug}`}>
              <IconButton aria-label="Edit">
                <IconBxEditAlt />
              </IconButton>
            </Link>
          )}
          <IconButton aria-label="Share" onClick={handleEventShare}>
            <IconShare />
          </IconButton>
          {event?.createdBy?.username === user?.username && (
            <IconButton aria-label="Delete" onClick={confirmDelete}>
              {deleteLoading ? <SpinLoader size={20} /> : <IconDeleteForeverOutline />}
            </IconButton>
          )}
        </ActionBar>

        <Snackbar
          open={snackbarOpen}
          onClose={closeSnackbar}
          message={`Are you sure you want to delete ${event?.title}?`}
          action={
            <>
              <Button color="secondary" onClick={handleEventDelete}>Confirm</Button>
              <Button color="primary" onClick={closeSnackbar}>Cancel</Button>
            </>
          }
        />
      </Box>
    </>
  );
};

export default EventViewer;

const Header = styled("div")`
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Content = styled("div")`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: -40px;
  position: relative;
`;

const ActionBar = styled("div")`
  display: flex;
  justify-content: center;
  gap: 16px;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background-color: #333;
  border-radius: 50px;
  z-index: 1000;
`;
