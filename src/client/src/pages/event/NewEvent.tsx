import React, { useEffect, useState, useRef } from "react";
import {
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addNewEvent, updateEvent, clearErrors } from "../../actions/event";
import { RootState } from "../../store";
import RDotLoader from "../../components/loaders/RDotLoader";
import { IconCaretDown } from "../../assets/icons";
import toast from "react-hot-toast";
import getToken from "../../utils/getToken";
import { NEW_EVENT_RESET, UPDATE_EVENT_RESET } from "../../constants/event";
import { isOnline } from "../../utils";

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
  const [anchorEl, setAnchorEl] = useState<any>(null);

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
  const handleAvatar = (e: any) => {
    const reader = new FileReader();
    reader.onload = () =>
      reader.readyState === 2 && setAvatar(reader.result as string);
    e.target.files && reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!category) {
      toast.error(`event Category is required!`);
      return;
    } else if (!avatar) {
      toast.error(`event avatar is required!`);
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

  const handleCategorySelect = (selected: string) => {
    setCategory(selected);
    setAnchorEl(null);
  };

  return (
    <EventContainer component="form" onSubmit={handleSubmit}>
      <Typography variant={"h5"} fontWeight={700} gutterBottom>
        {action === `Update` ? `Update Event` : `Create Event`}
      </Typography>

      {avatar && <StyledImg src={avatar} loading="lazy" />}
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e: any) => setTitle(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e: any) => setDescription(e.target.value)}
        multiline
        rows={3}
        required
      />

      <DateContainer>
        <TextField
          label="Start Date"
          type="datetime-local"
          value={startDate}
          onChange={(e: any) => setStartDate(e.target.value)}
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="datetime-local"
          value={endDate}
          onChange={(e: any) => setEndDate(e.target.value)}
          required
          InputLabelProps={{ shrink: true }}
        />
      </DateContainer>

      <TextField
        fullWidth
        label="Avenue"
        value={avenue}
        onChange={(e: any) => setAvenue(e.target.value)}
        required
      />

      <Button variant="outlined" component="label" color="primary">
        Upload Avatar
        <input hidden accept="image/*" type="file" onChange={handleAvatar} />
      </Button>

      <Box>
        <TextField
          label="Category"
          size="small"
          value={category}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={(e: any) => setAnchorEl(e.currentTarget)}>
                  <IconCaretDown />
                </IconButton>
              </InputAdornment>
            ),
          }}
          readOnly
        />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {[
            "Fashion Shows",
            "Film Festivals",
            "Religious Gatherings",
            "Comedy Shows",
            "Conference",
            "Workshop",
            "Meetup",
            "Webinar",
            "Hackathon",
          ].map((opt) => (
            <MenuItem key={opt} onClick={() => handleCategorySelect(opt)}>
              {opt}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={loading}
      >
        {loading || updateLoading ? (
          <RDotLoader />
        ) : action == "New" ? (
          "Create"
        ) : (
          "Update"
        )}
      </Button>
    </EventContainer>
  );
};

export default NewEvent;

const EventContainer = styled(Box)(({ theme }) => ({
  maxWidth: 600,
  margin: "auto",
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const StyledImg = styled("img")({
  width: "100%",
  maxHeight: 200,
  objectFit: "cover",
  borderRadius: 8,
  marginBottom: 16,
});

const DateContainer = styled(Box)({
  display: "flex",
  gap: 16,
});
