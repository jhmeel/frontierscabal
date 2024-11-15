import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
  Paper,
  Badge,
  Drawer,
  Button,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Comment as CommentIcon,
  Share,
  Edit,
  Delete,
  Close,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import moment from "moment";
import {
  getArticleDetails,
  searchArticleByCategory,
  clearErrors,
  likeArticle,
} from "../../actions/article";
import HorizontalArticleItem from "../../components/horizontalArticleItem/HorizontalArticleItem";
import Footer from "../../components/footer/Footer";
import Comment from "./Comment";
import getToken from "../../utils/getToken";
import { FormattedCount, errorParser } from "../../utils";
import { isOnline } from "../../utils";
import axiosInstance from "../../utils/axiosInstance";
import { RootState } from "../../store";
import SpinLoader from "../../components/loaders/SpinLoader";
import { closeSnackbar, enqueueSnackbar } from "notistack";

const StyledArticleViewer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
}));

const ArticleHeader = styled(Box)(({ theme }) => ({
  position: "relative",
  height: 400,
  [theme.breakpoints.down("sm")]: {
    height: 300,
  },
}));

const HeaderImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const ProgressBar = styled(motion.div)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: 4,
  background: theme.palette.primary.main,
  transformOrigin: "0%",
  zIndex: 9999,
}));

const ArticleInfo = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  background: "rgba(0, 0, 0, 0.6)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const AuthorInfo = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

const ArticleContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  "& img": {
    maxWidth: "100%",
    height: "auto",
  },
}));

const ArticleTags = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const ReactionBar = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(3),
  left: "35%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(1, 2),
  borderRadius: 30,
  zIndex: 1000,
  transition: "opacity 0.3s ease-in-out",
  "@media (max-width: 768px)": {
    left: "10%",
    transform: "translateX(-50%)",
  },
}));

const RelatedArticles = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
}));

const CommentDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "100%",
    maxWidth: 600,
    margin: "auto",
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
}));

const CommentDrawerHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ArticleViewer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [liked, setLiked] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showReactionBar, setShowReactionBar] = useState(true);

  const { user } = useSelector((state: RootState) => state.user);
  const {
    article,
    loading: articleLoading,
    error: articleError,
  } = useSelector((state: RootState) => state.articleDetails);
  const { articles: relatedArticles } = useSelector(
    (state: RootState) => state.articleSearch
  );

  useEffect(() => {
    if (articleError) {
      toast.error(articleError);
      dispatch<any>(clearErrors());
    }
  }, [articleError]);

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

    if (showReactionBar) {
      setShowReactionBar(false);
    }
    clearTimeout(window.scrollTimer);
    window.scrollTimer = setTimeout(() => {
      setShowReactionBar(true);
    }, 1000);
  }, [showReactionBar]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(window.scrollTimer);
    };
  }, [handleScroll]);

  const handleLike = async () => {
    const authToken = await getToken();
    if (!authToken) {
      navigate("/login");
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
        console.error("Error sharing:", error);
      }
    } else {
      toast.error("Web Share API not supported");
    }
  };

  const handleDelete = async () => {
    const proceed = async () => {
      try {
        const authToken = await getToken();
        await axiosInstance(authToken).delete(
          `/api/v1/article/${article?._id}`
        );
        toast.success("Article deleted successfully!");
      } catch (error) {
        toast.error(errorParser(error));
      }
    };

    enqueueSnackbar("Are you sure you want to delete this article?", {
      variant: "warning",
      persist: true,
      action: (key) => (
        <>
          <Button
            onClick={() => {
              proceed();
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

  if (articleLoading) {
    return <SpinLoader />;
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
            <Avatar
              src={article?.postedBy?.avatar?.url}
              alt={article?.postedBy?.username}
            />
            <Box>
              <Typography color="#fff" variant="subtitle2">
                {article?.postedBy?.username}
              </Typography>
              <Typography color="#fff" variant="caption">
                {moment(article?.createdAt).format("MMMM DD, YYYY")}
              </Typography>
            </Box>
          </AuthorInfo>
          <Chip label={article?.category} color="primary" size="small" />
        </ArticleInfo>
      </ArticleHeader>

      <ArticleContent>
        <Typography variant="h1" fontSize={28} gutterBottom>
          {article?.title}
        </Typography>
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: article?.sanitizedHtml }}
        />
        <ArticleTags>
          {article?.tags?.split(",").map((tag, index) => (
            <Chip
              key={index}
              label={`#${tag.trim()}`}
              onClick={() =>
                navigate(`/search?query=${encodeURIComponent(tag.trim())}`)
              }
              clickable
            />
          ))}
        </ArticleTags>
      </ArticleContent>

      <AnimatePresence>
        {showReactionBar && (
          <ReactionBar
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            elevation={3}
          >
            <IconButton
              onClick={handleLike}
              color={liked ? "secondary" : "default"}
              sx={{ marginRight: 2, color: liked ? "crimson" : "inherit" }}
            >
              <Badge
                badgeContent={FormattedCount(article?.likes?.length)}
                color="primary"
              >
                {liked ? <Favorite /> : <FavoriteBorder />}
              </Badge>
            </IconButton>

            <IconButton onClick={() => setCommentOpen(true)}>
              <Badge
                badgeContent={FormattedCount(article?.comments?.length)}
                color="primary"
              >
                <CommentIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={handleShare} sx={{ marginLeft: 2 }}>
              <Share />
            </IconButton>
            {article?.postedBy?.username === user?.username && (
              <>
                <IconButton
                  onClick={() =>
                    navigate(`/blog/article/update/${article?.slug}`)
                  }
                  sx={{ marginLeft: 2 }}
                >
                  <Edit />
                </IconButton>
                <IconButton onClick={handleDelete} sx={{ marginLeft: 2 }}>
                  <Delete />
                </IconButton>
              </>
            )}
          </ReactionBar>
        )}
      </AnimatePresence>

      {relatedArticles.length > 1 && (
        <RelatedArticles>
          <Typography variant="h5" gutterBottom>
            You may also like
          </Typography>
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-around"
            gap={2}
          >
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
                  pinnedBy={art.pinnedBy}
                />
              ))}
          </Box>
        </RelatedArticles>
      )}

      <Footer />

      <CommentDrawer
        anchor="bottom"
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
      >
        <CommentDrawerHeader>
          <Typography variant="h6">Comments</Typography>
          <IconButton onClick={() => setCommentOpen(false)}>
            <Close />
          </IconButton>
        </CommentDrawerHeader>
        <Box sx={{ padding: 2, maxHeight: "60vh", overflow: "auto" }}>
          <Comment
            username={user?.username}
            article={article}
            comments={article?.comments}
            onClose={() => setCommentOpen(false)}
          />
        </Box>
      </CommentDrawer>
    </StyledArticleViewer>
  );
};

export default ArticleViewer;
