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
import { useSocket } from "../../context/SocketProvider";
import { ARTICLE } from "../../types";
import { IconHeartFill } from "../../assets/icons";

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
  padding: theme.spacing(2),
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

const ReactionBarContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(2),
  zIndex: 1000,
  pointerEvents: "none",
}));

const ReactionBar = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1),
  background: "rgba(255, 255, 255, 0.95)",
  borderRadius: theme.spacing(3),
  border: "1px solid #ededed",
  pointerEvents: "auto",
  width: "auto",
  maxWidth: "300px",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
    gap: theme.spacing(1),
    width: "calc(100% - 32px)", 
    justifyContent: "space-around"
  }
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
  const socket = useSocket();

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
  const [updatedArticle, setUpdatedArticle] = useState<any>(article);

  useEffect(() => {
    if (socket && updatedArticle?._id) {
      socket.emit("join_article", updatedArticle._id);

      socket.on("comment_added", (response: ARTICLE) => {
        setUpdatedArticle(response);
      });

      socket.on("reply_added", (response: ARTICLE) => {
        setUpdatedArticle(response);
      });

      socket.on("comment_deleted", (response: ARTICLE) => {
        setUpdatedArticle(response);
      });

      socket.on("reply_deleted", (response: ARTICLE) => {
        setUpdatedArticle(response);
      });

      socket.on("like_updated", (response: ARTICLE) => {
        setUpdatedArticle(response);
      });

      return () => {
        socket.emit("leaveArticleRoom", { articleId: article._id });
        socket.off("comment_added");
        socket.off("reply_added");
        socket.off("comment_deleted");
        socket.off("reply_deleted");
        socket.off("like_updated");
      };
    }
  }, [socket, article?._id, slug, dispatch]);

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
    if (!user?._id) {
      navigate("/login");
      return;
    }
    if (isOnline()) {
      if (socket && article?._id) {
        socket.emit(
          "toggle_like",
          { articleId: article._id, userId: user._id },
          (response: any) => {
            if (response.success) {
              setLiked(!liked);
            } else {
              toast.error(
                response?.error || "Failed to update like, try again later"
              );
            }
          }
        );
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: updatedArticle?.title,
          text: updatedArticle?.description,
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
          `/api/v1/article/${updatedArticle?._id}`
        );
        toast.success("Article deleted successfully!");
      } catch (error) {
        toast.error(errorParser(error));
      }
    };

    toast((t) => (
      <div>
        <p>{`Are you sure you want to delete ${updatedArticle?.title}?`}</p>
        <Button
          onClick={() => {
            toast.dismiss(t.id);
            proceed();
          }}
          color="primary"
        >
          Proceed
        </Button>
        <Button onClick={() => toast.dismiss(t.id)}>Cancel</Button>
      </div>
    ));
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
        <HeaderImage
          src={updatedArticle?.image?.url}
          alt={updatedArticle?.title}
        />
        <ArticleInfo>
          <AuthorInfo>
            <Avatar
              src={updatedArticle?.postedBy?.avatar?.url}
              alt={updatedArticle?.postedBy?.username}
            />
            <Box>
              <Typography color="#fff" variant="subtitle2">
                {updatedArticle?.postedBy?.username}
              </Typography>
              <Typography color="#fff" variant="caption">
                {moment(updatedArticle?.createdAt).format("MMMM DD, YYYY")}
              </Typography>
            </Box>
          </AuthorInfo>
          <Chip label={updatedArticle?.category} color="primary" size="small" />
        </ArticleInfo>
      </ArticleHeader>

      <ArticleContent>
        <Typography variant="h1" fontSize={28} gutterBottom>
          {updatedArticle?.title}
        </Typography>
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: updatedArticle?.sanitizedHtml }}
        />
        <ArticleTags>
          {updatedArticle?.tags?.split(",").map((tag, index) => (
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
        <ReactionBarContainer>
          <ReactionBar
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            elevation={1}
          >
            <IconButton
              onClick={handleLike}
              color={liked ? "secondary" : "default"}
            >
              <Badge
                badgeContent={FormattedCount(updatedArticle?.likes?.length)}
                color="primary"
              >
                {<IconHeartFill fill={liked ? "crimson" : "gray"} />}
              </Badge>
            </IconButton>

            <IconButton onClick={() => setCommentOpen(true)}>
              <Badge
                badgeContent={FormattedCount(updatedArticle?.comments?.length)}
                color="primary"
              >
                <CommentIcon />
              </Badge>
            </IconButton>

            <IconButton onClick={handleShare}>
              <Share />
            </IconButton>

            {updatedArticle?.postedBy?.username === user?.username && (
              <>
                <IconButton
                  onClick={() =>
                    navigate(`/blog/article/update/${updatedArticle?.slug}`)
                  }
                >
                  <Edit />
                </IconButton>
                <IconButton onClick={handleDelete}>
                  <Delete />
                </IconButton>
              </>
            )}
          </ReactionBar>
        </ReactionBarContainer>
      )}
    </AnimatePresence>

      {relatedArticles?.length > 1 && (
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

        <Comment
          username={user?.username}
          article={updatedArticle}
          comments={updatedArticle?.comments}
          onClose={() => setCommentOpen(false)}
        />
      </CommentDrawer>
    </StyledArticleViewer>
  );
};

export default ArticleViewer;
