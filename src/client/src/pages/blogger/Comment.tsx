import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  List,
  ListItem,
  Divider,
  Slide,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Send as SendIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import CommentItem from "../../components/commentItem/CommentItem";
import { FormattedCount } from "../../utils";
import { RootState } from "../../store";
import { useSocket } from "../../context/SocketProvider";

const CommentContainer = styled(motion.div)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  height: "80vh",
  width:"100%",
  backgroundColor: theme.palette.background.paper,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[10],
  display: "flex",
  flexDirection: "column",
  zIndex: theme.zIndex.modal,
}));

const CommentHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const CommentList = styled(List)(({ theme }) => ({
  flexGrow: 1,
  width: "100%",
  display:`flex`,
  justifyContent:`center`,
  overflowY: "auto",
  padding: theme.spacing(2),
}));

const CommentInputContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

interface CommentProps {
  username: string;
  article: any;
  comments: any[];
  onClose: () => void;
}

const Comment: React.FC<CommentProps> = ({
  username,
  article,
  comments,
  onClose,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useSelector((state: RootState) => state.user);
  const [comment, setComment] = useState("");
  const socket = useSocket();
  const [commentLoading, setCommentLoading] = useState(false);

  const handleCommentSubmit = async () => {
    setCommentLoading(true);
    if (!user?._id) {
      navigate("/login");
      return;
    }
    if (socket && article?._id && user?._id && comment?.trim()) {
      socket.emit(
        "new_comment",
        {
          articleId: article._id,
          userId: user._id,
          commentText: comment.trim(),
        },
        (response:any) => {
          setCommentLoading(false);
          if (response.success) {
            toast.success("Comment added!");
            setComment("");
          } else {
            toast.error(
              response?.error || "Failed to add comment, try again later."
            );
          }
        }
      );
    }
  };

  const commentListVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const commentItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <CommentContainer
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <CommentHeader>
          <Typography variant="h6">
            <CommentIcon /> Comments ({FormattedCount(comments?.length)})
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </CommentHeader>

        <CommentList>
          <AnimatePresence>
            <motion.div
              variants={commentListVariants}
              initial="hidden"
              animate="visible"
              style={{ width: "100%",display:`flex`,flexDirection:`column`,justifyContent:`flex-start`,alignItems:`center` }}
              
            >
              {comments?.map((comment, index) => (
               
                  <ListItem disablePadding style={{ width: "100%",display:`flex`,flexDirection:`column`,justifyContent:`flex-start` }}>
                    <CommentItem
                      articleId={article._id}
                      commentId={comment._id}
                      ownersName={article?.postedBy?.username}
                      commenterName={comment?.user?.username}
                      commenterPic={comment?.user.avatar?.url}
                      date={comment.comment[0]?.date}
                      comment={comment.comment[0]?.commentText}
                      replies={comment.comment[0]?.replies}
                    />
                  </ListItem>
                  
                
              ))}
            </motion.div>
          </AnimatePresence>
        </CommentList>

        <CommentInputContainer>
          <Avatar
            src={user?.avatar?.url}
            alt={user?.username}
            sx={{ marginRight: 2 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            multiline
            maxRows={3}
            sx={{ marginRight: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={
              commentLoading ? <CircularProgress size={16} /> : <SendIcon />
            }
            onClick={handleCommentSubmit}
            disabled={commentLoading || !comment.trim()}
          >
            {isMobile ? "" : "Post"}
          </Button>
        </CommentInputContainer>
      </CommentContainer>
    </Slide>
  );
};

export default Comment;
