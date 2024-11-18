import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
  CopyAllOutlined,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import moment from "moment";
import { RootState } from "../../store";
import emptyImage from "../../assets/images/empty_avatar.png";
import toast from "react-hot-toast";
import { useSocket } from "../../context/SocketProvider";

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteReplyLoading, setDeleteReplyLoading] = useState(false);
  const socket = useSocket();
  const navigate = useNavigate()

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const removeReply = async () => {
    if(!user?._id){
      navigate("/login")
      return
    }
    handleMenuClose();
    toast((t) => (
      <div>
        <p>Are you sure you want to remove your reply?</p>
        <Button
          onClick={() => {
            setDeleteReplyLoading(true);
            if (socket) {
              socket.emit(
                "delete_reply",
                { articleId, commentId, replyId },
                (response: any) => {
                  setDeleteReplyLoading(false);
                  if (response.success) {
                    toast.success("Removed successfully");
                  } else {
                    toast.error(
                      response.error ||
                        "Failed to remove reply, try again later"
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

  const copyReply = async () => {
    try {
      await navigator.clipboard.writeText(replyText);
      toast.success("Copied!");
    } catch (error) {
      console.error("Error copying text to clipboard:", error);
    }
  };

  return (
    <StyledReplyItem>
      {deleteReplyLoading && (
        <CircularProgress size={24} className="delete-loader" />
      )}
      <Box className="reply-container">
      
          <IconButton
            aria-label="more"
            className="reply-more-icon"
            onClick={handleMenuOpen}
            size="small"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
      
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          elevation={1}
          onClose={handleMenuClose}
          disablePortal
          PaperProps={{
            style: { zIndex: 1500 },
          }}
        >
          <MenuItem onClick={copyReply}>
            <CopyAllOutlined fontSize="small" style={{ marginRight: "8px" }} />
            Copy text
          </MenuItem>
          {user.username == replyerName && (
            <MenuItem onClick={removeReply}>
              <DeleteIcon fontSize="small" style={{ marginRight: "8px" }} />
              Delete
            </MenuItem>
          )}
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
