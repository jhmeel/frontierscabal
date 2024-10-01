import React, { useEffect, useState, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { styled } from "@mui/system";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Reply as ReplyIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import moment from "moment";
import { RootState } from "../../store";
import {
  deleteComment,
  addCommentReply,
  clearErrors,
} from "../../actions/article";
import {
  DELETE_COMMENT_RESET,
  NEW_COMMENT_REPLY_RESET,
} from "../../constants/article";
import { FormattedCount } from "../../utils/formatter";
import emptyImage from "../../assets/images/empty_avatar.png";
import ReplyItem from "../replyItem/ReplyItem";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import getToken from "../../utils/getToken";
import toast from "react-hot-toast";

interface Reply {
  _id: string;
  user: {
    username: string;
    avatar?: {
      url?: string;
    };
  };
  date: string;
  replyText: string;
}

interface CommentItemProps {
  articleId: string;
  commentId: string;
  ownersName: string;
  commenterName: string;
  commenterPic: string;
  date: string;
  comment: string;
  replies: Reply[];
}

const CommentItem: React.FC<CommentItemProps> = ({
  articleId,
  commentId,
  ownersName,
  commenterName,
  commenterPic,
  date,
  comment,
  replies,
}) => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showReply, setShowReply] = useState(false);
  const [replyInputedText, setReplyInputedText] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    error: deleteCommentError,
    loading: deleteCommentLoading,
    success: deleteCommentSuccess,
  } = useSelector((state: RootState) => state.deleteComment);

  const {
    error: replyError,
    loading: replyLoading,
    success: replySuccess,
  } = useSelector((state: RootState) => state.newCommentReply);

  useEffect(() => {
    if (replyError) {
      toast.error("Error, try again...");
      dispatch<any>(clearErrors());
    }
    if (replySuccess) {
      toast.success("Replied successfully!");
      dispatch({ type: NEW_COMMENT_REPLY_RESET });
      window.location.reload();
    }
  }, [dispatch, replyError, replySuccess]);

  useEffect(() => {
    if (deleteCommentError) {
      toast.error("Error while deleting your comment... try again");
      dispatch<any>(clearErrors());
    }
    if (deleteCommentSuccess) {
      toast.success("Comment deleted!");
      dispatch({ type: DELETE_COMMENT_RESET });
      window.location.reload();
    }
  }, [dispatch, deleteCommentError, deleteCommentSuccess]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const showAuthDialogue = () => {
    enqueueSnackbar("Please signup to complete your action!", {
      variant: "info",
      persist: true,
      action: (key) => (
        <>
          <Button
            onClick={() => {
              closeSnackbar(key);
              navigate("/signup");
            }}
            color="primary"
          >
            Signup
          </Button>
          <Button onClick={() => closeSnackbar(key)}>Cancel</Button>
        </>
      ),
    });
  };

  const removeComment = async () => {
    handleMenuClose();
    const authToken = await getToken();
    enqueueSnackbar("Are you sure you want to remove your comment?", {
      variant: "warning",
      persist: true,
      action: (key) => (
        <>
          <Button
            onClick={() => {
              dispatch<any>(deleteComment(authToken, articleId, commentId));
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

  const handleShowReply = () => {
    setShowReply(!showReply);
  };

  const handleReplyTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReplyInputedText(e.target.value);
  };

  const handleReply = async () => {
    const authToken = await getToken();
    if (!authToken) {
      showAuthDialogue();
      return;
    }
    dispatch<any>(
      addCommentReply(authToken, articleId, commentId, replyInputedText)
    );
  };

  return (
    <StyledCommentItem>
      {deleteCommentLoading && (
        <CircularProgress size={24} className="delete-loader" />
      )}
      <Box className="comment-container">
        {(user?.username === commenterName ||
          user?.role === "FC:SUPER:ADMIN") && (
          <IconButton
            aria-label="more"
            className="comment-more-icon"
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
          <MenuItem onClick={removeComment}>
            <DeleteIcon fontSize="small" style={{ marginRight: "8px" }} />
            Delete
          </MenuItem>
        </Menu>

        {commenterName === ownersName && (
          <Typography variant="caption" className="comment-owner-tag">
            Author
          </Typography>
        )}

        <Box display="flex" alignItems="center" className="user-info">
          <Avatar
            src={commenterPic || emptyImage}
            alt={commenterName}
            className="user-avatar"
          />
          <Box ml={1}>
            <Typography
              variant="subtitle2"
              component={Link}
              to={`/profile/${commenterName}`}
              className="commenter-name"
            >
              @{commenterName}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {moment(date).fromNow()}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" className="comment-content">
          {comment}
        </Typography>
      </Box>

      <Box className="comment-footer">
        <Button
          size="small"
          onClick={handleShowReply}
          endIcon={<ExpandMoreIcon />}
        >
          {`${FormattedCount(replies?.length) || "0"} ${
            replies?.length > 1 ? "replies" : "reply"
          }`}
        </Button>
      </Box>

      {showReply && (
        <Box className="replies">
          {replies?.length >= 1 && (
            <Typography variant="subtitle1" className="reply-header">
              Replies
            </Typography>
          )}
          <Box className="reply-holder">
            {replies?.length > 0 &&
              replies.map((rep, i) => (
                <ReplyItem
                  articleId={articleId}
                  commentId={commentId}
                  replyId={rep?._id}
                  replyerName={rep?.user.username}
                  replyerPic={rep?.user.avatar?.url || emptyImage}
                  date={rep?.date}
                  replyText={rep?.replyText}
                  key={i}
                />
              ))}
          </Box>
          <Box className="reply-input">
            <TextField
              variant="outlined"
              fullWidth
              placeholder={`Replying to @${commenterName}`}
              value={replyInputedText}
              onChange={handleReplyTextChange}
              size="small"
            />
            {replyInputedText && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleReply}
                startIcon={
                  replyLoading ? <CircularProgress size={16} /> : <ReplyIcon />
                }
                disabled={replyLoading}
              >
                Reply
              </Button>
            )}
          </Box>
        </Box>
      )}
    </StyledCommentItem>
  );
};

export default CommentItem;

const StyledCommentItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  width: "100%",
  maxWidth: "600px",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
  ".delete-loader": {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  ".comment-more-icon": {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  ".comment-owner-tag": {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
  },
  ".user-info": {
    marginBottom: theme.spacing(1),
  },
  ".user-avatar": {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  ".commenter-name": {
    textDecoration: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      textDecoration: "underline",
    },
  },
  ".comment-content": {
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  ".comment-footer": {
    display: "flex",
    justifyContent: "flex-end",
  },
  ".replies": {
    marginTop: theme.spacing(2),
    ".reply-header": {
      marginBottom: theme.spacing(1),
    },
    ".reply-holder": {
      maxHeight: 320,
      overflowY: "auto",
      marginBottom: theme.spacing(1),
    },
    ".reply-input": {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(1),
      marginTop: theme.spacing(1),
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "stretch",
      },
    },
  },
}));
