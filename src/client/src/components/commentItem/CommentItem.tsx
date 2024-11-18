import React, { useState, ChangeEvent, useEffect } from "react";
import { useSelector } from "react-redux";
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
  CopyAllOutlined,
} from "@mui/icons-material";
import moment from "moment";
import { FormattedCount } from "../../utils/formatter";
import emptyImage from "../../assets/images/empty_avatar.png";
import { useSocket } from "../../context/SocketProvider";
import ReplyItem from "../replyItem/ReplyItem";
import toast from "react-hot-toast";
import { RootState } from "../../store";

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
  const navigate = useNavigate();
  const [showReply, setShowReply] = useState(false);
  const [replyInputedText, setReplyInputedText] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deletingComment, setDeletingComment] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const socket = useSocket();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const showAuthDialogue = () => {
    toast((t) => (
      <div>
        <p>Please signup to complete your action!</p>
        <Button
          onClick={() => {
            toast.dismiss(t.id);
            navigate("/signup");
          }}
          color="primary"
        >
          Signup
        </Button>
        <Button onClick={() => toast.dismiss(t.id)}>Cancel</Button>
      </div>
    ));
  };

  const removeComment = () => {
    handleMenuClose();
    toast((t) => (
      <div>
        <p>Are you sure you want to delete this comment?</p>
        <Button
          onClick={() => {
            setDeletingComment(true);
            if (socket) {
              socket.emit(
                "delete_comment",
                { articleId, commentId, userId: user._id },
                (response: any) => {
                  setDeletingComment(false);
                  if (response.success) {
                    toast.success("Comment deleted successfully");
                  } else {
                    toast.error(
                      response.error ||
                        "Failed to delete comment, try again later"
                    );
                  }
                }
              );
            }

            toast.dismiss(t.id);
          }}
          color="primary"
        >
          Confirm
        </Button>
        <Button onClick={() => toast.dismiss(t.id)}>Cancel</Button>
      </div>
    ));
  };

  const handleShowReply = () => {
    setShowReply(!showReply);
  };

  const handleReplyTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReplyInputedText(e.target.value);
  };

  const handleReply = async () => {
    if (!user?._id) {
      showAuthDialogue();
      return;
    }
    setReplyLoading(true);

    if (socket && commentId && replyInputedText) {
      socket.emit(
        "new_reply",
        {
          articleId,
          commentId,
          userId: user._id,
          replyText: replyInputedText.trim(),
        },
        (response: any) => {
          setReplyLoading(false);
          if (response.success) {
            toast.success("Reply added!");
            setReplyInputedText("");
          } else {
            toast.error(
              response?.error || "Failed to add reply, try again later."
            );
          }
        }
      );
    }
  };
  const copyComment = async () => {
    try {
      await navigator.clipboard.writeText(comment);
      toast.success("Copied!");
    } catch (error) {
      console.error("Error copying text to clipboard:", error);
    }
  };

  return (
    <StyledCommentItem>
      {deletingComment && (
        <CircularProgress size={24} className="delete-loader" />
      )}
      <Box className="comment-container">
        <IconButton
          aria-label="more"
          className="comment-more-icon"
          onClick={handleMenuOpen}
          size="small"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={copyComment}>
            <CopyAllOutlined fontSize="small" style={{ marginRight: "8px" }} />
            Copy text
          </MenuItem>
          {commenterName === user?.username && (
            <MenuItem onClick={removeComment}>
              <DeleteIcon fontSize="small" style={{ marginRight: "8px" }} />
              Delete
            </MenuItem>
          )}
        </Menu>

        <Box display="flex" alignItems="center" className="user-info">
          <Avatar
            src={commenterPic || emptyImage}
            alt={commenterName}
            className="user-avatar"
          />
          <Box ml={1}>
            <Typography
            mr={1}
              variant="subtitle2"
              component={Link}
              to={`/profile/${commenterName}`}
              className="commenter-name"
            >
              {commenterName === ownersName ? `@Owner` : `@${commenterName}`}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              className="comment-date"
            >
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
                disabled={replyLoading || !replyInputedText.trim()}
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
