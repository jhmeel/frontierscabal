import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Fade,
  useMediaQuery,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Comment as CommentIcon,
  Share,
  Edit,
  Delete,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import moment from 'moment';

import {
  getArticleDetails,
  searchArticleByCategory,
  clearErrors,
  likeArticle,
} from '../../actions/article';
import {
  LIKE_UNLIKE_ARTICLE_RESET,
  NEW_COMMENT_RESET,
  NEW_COMMENT_REPLY_RESET,
} from '../../constants/article';
import HorizontalArticleItem from '../../components/horizontalArticleItem/HorizontalArticleItem';
import Footer from '../../components/footer/Footer';
import Comment from './Comment';
import getToken from '../../utils/getToken';
import { FormattedCount, errorParser } from '../../utils';
import { isOnline } from '../../utils';
import axiosInstance from '../../utils/axiosInstance';
import { RootState } from '../../store';

const StyledArticleViewer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

const ArticleHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 400,
  [theme.breakpoints.down('sm')]: {
    height: 300,
  },
}));

const HeaderImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const ProgressBar = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: 4,
  background: theme.palette.primary.main,
  transformOrigin: '0%',
  zIndex: 9999,
}));

const ArticleInfo = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  background: 'rgba(0, 0, 0, 0.6)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const AuthorInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

const ArticleContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  '& img': {
    maxWidth: '100%',
    height: 'auto',
  },
}));

const ArticleTags = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const ReactionBar = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: 30,
  zIndex: 1000,
}));

const RelatedArticles = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
}));

const ArticleViewer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [liked, setLiked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { user } = useSelector((state: RootState) => state.user);
  const { article, loading: articleLoading } = useSelector((state: RootState) => state.articleDetails);
  const { articles: relatedArticles } = useSelector((state: RootState) => state.articleSearch);

  useEffect(() => {
    if (slug && isOnline()) {
      dispatch(getArticleDetails(slug) as any);
      dispatch(searchArticleByCategory(article?.category, 1) as any);
    }
  }, [dispatch, slug, article?.category]);

  useEffect(() => {
    setLiked(article?.likes?.includes(user?._id));
  }, [article?.likes, user?._id]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const totalDocScrollLength = docHeight - windowHeight;
    const scroll = `${scrollTop / totalDocScrollLength}`;
    setScrollProgress(parseFloat(scroll));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleLike = async () => {
    const authToken = await getToken();
    if (!authToken) {
      toast.error('Please log in to like articles');
      return;
    }
    if (isOnline()) {
      dispatch(likeArticle(authToken, article?._id) as any);
      setLiked(!liked);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      toast.error('Web Share API not supported');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const authToken = await getToken();
        await axiosInstance(authToken).delete(`/api/v1/article/${article?._id}`);
        toast.success('Article deleted successfully!');
        navigate('/');
      } catch (error) {
        toast.error(errorParser(error));
      }
    }
  };

  if (articleLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <StyledArticleViewer>
      <ProgressBar
        style={{ scaleX: scrollProgress }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress }}
      />
      <ArticleHeader>
        <HeaderImage src={article?.image?.url} alt={article?.title} />
        <ArticleInfo>
          <AuthorInfo>
            <Avatar src={article?.postedBy?.avatar?.url} alt={article?.postedBy?.username} />
            <Box>
              <Typography variant="subtitle2">{article?.postedBy?.username}</Typography>
              <Typography variant="caption">
                {moment(article?.createdAt).format('MMMM DD, YYYY')}
              </Typography>
            </Box>
          </AuthorInfo>
          <Chip label={article?.category} color="primary" size="small" />
        </ArticleInfo>
      </ArticleHeader>

      <ArticleContent>
        <Typography variant="h3" gutterBottom>
          {article?.title}
        </Typography>
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: article?.sanitizedHtml }}
        />
        <ArticleTags>
          {article?.tags?.split(',').map((tag, index) => (
            <Chip
              key={index}
              label={`#${tag.trim()}`}
              onClick={() => navigate(`/search?query=${encodeURIComponent(tag.trim())}`)}
              clickable
            />
          ))}
        </ArticleTags>
      </ArticleContent>

      <ReactionBar elevation={3}>
        <IconButton onClick={handleLike} color={liked ? 'secondary' : 'default'}>
          {liked ? <Favorite /> : <FavoriteBorder />} 
        </IconButton>
        <Typography variant="caption">{FormattedCount(article?.likes?.length)}</Typography>
        &nbsp;| <IconButton onClick={() => setCommentOpen(true)}>
          <CommentIcon/>
        </IconButton>
        &nbsp;| <IconButton onClick={handleShare}>
          <Share />
        </IconButton>
        {article?.postedBy?.username === user?.username && (
          <>
            &nbsp;| <IconButton onClick={() => navigate(`/blog/article/update/${article?.slug}`)}>
              <Edit />
            </IconButton>
            &nbsp;|<IconButton onClick={handleDelete}>
              <Delete />
            </IconButton>
          </>
        )}
      </ReactionBar>

      <RelatedArticles>
        <Typography variant="h5" gutterBottom>
          You may also like
        </Typography>
        <Box display="flex" flexWrap="wrap" justifyContent="space-around" gap={2}>
          {relatedArticles
            ?.filter((art) => art?.title !== article?.title)
            .slice(0, isMobile ? 2 : 4)
            .map((art) => (
              <HorizontalArticleItem
               key={art._id}  
               id={art._id}
              title={art.title}
              slug={art.slug}
              image={art.image?.url}
              caption={art.sanitizedHtml}
              category={art.category}
              postedBy={art.postedBy}
              readDuration={art.readDuration}
              pinnedBy={art.pinnedBy}/>
            ))}
        </Box>
      </RelatedArticles>

      <Footer />

      <AnimatePresence>
        {commentOpen && (
          <Fade in={commentOpen}>
            <Box
              position="fixed"
              bottom={0}
              left={0}
              right={0}
              zIndex={9999}
              maxHeight="60vh"
              overflow="auto"
              bgcolor="background.paper"
            >
              <Comment
                username={user?.username}
                article={article}
                comments={article?.comments}
                onClose={() =>setCommentOpen(false)}
              />
            </Box>
          </Fade>
        )}
      </AnimatePresence>
    </StyledArticleViewer>
  );
};

export default ArticleViewer;