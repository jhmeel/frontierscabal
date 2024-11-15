import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
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
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { addComment, clearErrors } from '../../actions/article';
import { NEW_COMMENT_RESET } from '../../constants/article';
import CommentItem from '../../components/commentItem/CommentItem';
import getToken from '../../utils/getToken';
import { FormattedCount } from '../../utils';
import { RootState } from '../../store';

const CommentContainer = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: '80vh',
  backgroundColor: theme.palette.background.paper,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[10],
  display: 'flex',
  flexDirection: 'column',
  zIndex: theme.zIndex.modal,
}));

const CommentHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const CommentList = styled(List)(({ theme }) => ({
  flexGrow: 1,
  width:'100%',
  overflowY: 'auto',
  padding: theme.spacing(2),

}));

const CommentInputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

interface CommentProps {
  username: string;
  article: any;
  comments: any[];
  onClose: () => void;
}

const Comment: React.FC<CommentProps> = ({ username, article, comments, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { loading, success, error } = useSelector((state: RootState) => state.newComment);
  const { user } = useSelector((state: RootState) => state.user);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors() as any);
    }
    if (success) {
      toast.success('Comment added');
      dispatch({ type: NEW_COMMENT_RESET });
      setComment('');
    }
  }, [dispatch, success, error]);

  const handleCommentSubmit = async () => {
    const authToken = await getToken();
    if (!authToken) {
      navigate('/login');
      return;
    }
    if (comment.trim()) {
      dispatch(addComment(authToken, article?._id, comment) as any);
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
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
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
            <motion.div variants={commentListVariants} initial="hidden" animate="visible">
              {comments?.map((comment, index) => (   
                <motion.div key={comment._id} variants={commentItemVariants}>
                  <ListItem disablePadding>
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
                  {index < comments.length - 1 && <Divider variant="inset" component="li" />}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </CommentList>

        <CommentInputContainer>
          <Avatar src={user?.avatar?.url} alt={user?.username} sx={{ marginRight: 2 }} />
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
            endIcon={<SendIcon />}
            onClick={handleCommentSubmit}
            disabled={loading || !comment.trim()}
          >
            {isMobile ? '' : 'Post'}
          </Button>
        </CommentInputContainer>
      </CommentContainer>
    </Slide>
  );
};

export default Comment; 