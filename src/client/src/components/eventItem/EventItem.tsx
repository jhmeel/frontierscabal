import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Card,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RDotLoader from "../loaders/RDotLoader";
import getToken from "../../utils/getToken";
import { errorParser } from "../../utils/formatter";
import axiosInstance from "../../utils/axiosInstance";
import { RootState } from "../../store";
import toast from "react-hot-toast";


const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  width: "100%",
  maxWidth: 600,
  height: 180,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "transform 0.2s ease-in-out",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}));

const DateBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  left: theme.spacing(2),
  zIndex: 2,
  textAlign: "center",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  boxShadow: theme.shadows[3],
}));

const DateTop = styled(Box)(({ theme }) => ({
  background: "#176984",
  color: theme.palette.common.white,
  padding: theme.spacing(0.5, 1),
  fontWeight: 700,
  fontSize: "0.9rem",
}));

const DateBottom = styled(Box)(({ theme }) => ({
  background: "#1abc9c",
  color: theme.palette.common.white,
  padding: theme.spacing(0.25, 1),
  fontSize: "0.75rem",
}));

const EventAvatar = styled(Box)(({ theme }) => ({
  width: 90,
  height: 90,
  borderRadius: "50%",
  border: `3px solid #176984`,
  overflow: "hidden",
  marginRight: theme.spacing(2),
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

const CategoryBadge = styled(Box)(({ theme }) => ({
  background: "linear-gradient(-45deg, #16aebc 0%, #176984 100%)",
  color: theme.palette.common.white,
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  fontSize: "0.75rem",
  fontWeight: 600,
  cursor: "pointer",
  maxWidth: 90,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  marginTop: theme.spacing(1),
}));

const ViewButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  fontSize: "0.8rem",
  "&:hover": {
    backgroundColor: "#176984",
    color: theme.palette.common.white,
  },
}));


const EventItem = ({
  id,
  slug,
  title,
  category,
  avatar,
  createdBy,
  startDate,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEventDelete = async () => {
    try {
      setDeleteLoading(true);
      const authToken = await getToken();
      const { data } = await axiosInstance(authToken).delete(`/api/v1/event/${id}`);
      setDeleteLoading(false);
      if (data.success) {
        toast.success("Event Deleted");
  
      }
    } catch (error) {
      setDeleteLoading(false);
      toast.error(errorParser(error));
    }
  };

  const showConfirmation = () => {
    handleMenuClose();
    toast((t) => (
      <div>
        <p>{`Are you sure you want to delete ${title}?`}</p>
        <Button
          onClick={() => {
            toast.dismiss(t.id);
            handleEventDelete()
          }}
          color="primary"
        >
          Proceed
        </Button>
        <Button onClick={() => toast.dismiss(t.id)}>Cancel</Button>
      </div>
    ));
  };

  const handleShare = async () => {
    const imgBlob = await fetch(avatar).then((r) => r.blob());
    if (navigator.share) {
      navigator.share({
        title: title,
        url: `https://${window.location.host}/#/event/${slug}`,
        files: [new File([imgBlob], "image.png", { type: imgBlob.type })],
      });
    }
    handleMenuClose();
  };

  const handleCategorySearch = () => {
    navigate({
      pathname: "/events/search",
      search: `?category=${encodeURIComponent(category)}`,
    });
  };

const date = new Date(startDate);
const month = date.toLocaleString("default", { month: "short" }).toUpperCase();
const day = date.getDate();

  return (
    <StyledCard>

      <DateBadge>
        <DateTop>{day}</DateTop>
        <DateBottom>{month}</DateBottom>
      </DateBadge>

      <Box display="flex" alignItems="center" mb={2}>
    
        <EventAvatar>
          <img src={avatar} alt="Event Avatar" loading="lazy" />
        </EventAvatar>
        <Box flex={1}>
          <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <CategoryBadge onClick={handleCategorySearch}>{category}</CategoryBadge>
        </Box>
        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Box textAlign="center" mt={1}>
        <ViewButton
          variant="outlined"
          color="primary"
          onClick={() => navigate(`/event/${slug}`)}
        >
          View Event
        </ViewButton>
      </Box>

      {/* Dropdown Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleShare}>
          <ShareIcon sx={{ mr: 1 }} /> Share
        </MenuItem>
        {user?.username === createdBy?.username && (
          <>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate(`/event/update/${slug}`);
              }}
            >
              <EditIcon sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={showConfirmation}>
              {deleteLoading ? (
                <RDotLoader />
              ) : (
                <>
                  <DeleteIcon sx={{ mr: 1, color: "crimson" }} /> Delete
                </>
              )}
            </MenuItem>
          </>
        )}
      </Menu>
    </StyledCard>
  );
};

export default EventItem;
