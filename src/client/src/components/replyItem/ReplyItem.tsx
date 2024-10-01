import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import moment from "moment";
import { RootState } from "../../store";
import { deleteReply, clearErrors } from "../../actions/article";
import { DELETE_REPLY_RESET } from "../../constants/article";
import emptyImage from "../../assets/images/empty_avatar.png";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import getToken from "../../utils/getToken";
import toast from "react-hot-toast";

interface ReplyItemProps {
  articleId: string;
  commentId: string;
  replyId: string;
  replyerName: string;
  replyerPic: string;
  replyText: string;
  date: string;
}

const ReplyItem: React.FC<ReplyItemProps> = ({
  articleId,
  commentId,
  replyId,
  replyerName,
  replyerPic,
  replyText,
  date,
}) => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    error: deleteReplyError,
    loading: deleteReplyLoading,
    success: deleteReplySuccess,
  } = useSelector((state: RootState) => state.deleteReply);

  useEffect(() => {
    if (deleteReplyError) {
      toast.error("Error while deleting your reply... try again");
      dispatch<any>(clearErrors());
    }
    if (deleteReplySuccess) {
      toast.success("Reply deleted successfully");
      dispatch({ type: DELETE_REPLY_RESET });
      window.location.reload();
    }
  }, [dispatch, deleteReplyError, deleteReplySuccess]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const removeReply = async () => {
    handleMenuClose();
    const authToken = await getToken();
    enqueueSnackbar("Are you sure you want to remove your reply?", {
      variant: "warning",
      persist: true,
      action: (key) => (
        <>
          <Button
            onClick={() => {
              dispatch<any>(
                deleteReply(authToken, articleId, commentId, replyId)
              );
              closeSnackbar(key);
            }}
            color="primary"
          >
            Confirm
          </Button>
          <Button onClick={() => closeSnackbar(key)}>Cancel</Button>
        </>
      ),
    });
  };

  return (
    <StyledReplyItem>
      {deleteReplyLoading && (
        <CircularProgress size={24} className="delete-loader" />
      )}
      <Box className="reply-container">
        {(user?.username === replyerName ||
          user?.role === "FC:SUPER:ADMIN") && (
          <IconButton
            aria-label="more"
            className="reply-more-icon"
            onClick={handleMenuOpen}
            size="small"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          disablePortal
          PaperProps={{
            style: { zIndex: 1500 },
          }}
        >
          <MenuItem onClick={removeReply}>
            <DeleteIcon fontSize="small" style={{ marginRight: "8px" }} />
            Delete
          </MenuItem>
        </Menu>

        <Box display="flex" alignItems="center" className="user-info">
          <Avatar
            src={replyerPic || emptyImage}
            alt={replyerName}
            className="user-avatar"
          />
          <Box ml={1}>
            <Typography
              variant="subtitle2"
              component={Link}
              to={`/profile/${replyerName}`}
              className="replyer-name"
            >
              @{replyerName}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              className="reply-date"
            >
              {moment(date).fromNow()}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" className="reply-content">
          {replyText}
        </Typography>
      </Box>
    </StyledReplyItem>
  );
};

export default ReplyItem;

const StyledReplyItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  width: "100%",
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  ".delete-loader": {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  ".reply-more-icon": {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  ".user-info": {
    marginBottom: theme.spacing(1),
  },
  ".user-avatar": {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  ".replyer-name": {
    textDecoration: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      textDecoration: "underline",
    },
  },
  ".reply-date": {
    display: "block",
  },
  ".reply-content": {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
  },
}));
