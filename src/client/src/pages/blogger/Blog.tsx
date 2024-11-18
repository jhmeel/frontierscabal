import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  Box,
  Snackbar,
  Alert,
  SwipeableDrawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Create as CreateIcon,
  ArrowForward,
  Category as CategoryIcon,
  Bookmark as BookmarkIcon,
  TrendingUp as TrendingIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import {
  searchArticleByCategory,
  searchRecentArticle,
  clearErrors,
} from "../../actions/article";
import { RootState } from "../../store";
import axiosInstance from "../../utils/axiosInstance";
import VerticalArticleItem from "../../components/verticalArticleItem/VerticalArticleItem";
import Footer from "../../components/footer/Footer";
import { isOnline } from "../../utils";
import Paginator from "../../components/paginator/Paginator";
import VerticalArticleItemSkeletonLoader from "../../components/loaders/VerticalArticleItemSkeletonLoader";

const Section = styled("section")(({ theme }) => ({
  marginBottom: theme.spacing(4),
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(2),
  },
}));

const StyledBanner = styled(Card)(({ theme }) => ({
  position: "relative",
  height: 600,
  [theme.breakpoints.down("md")]: {
    height: 450,
  },
  [theme.breakpoints.down("sm")]: {
    height: 350,
  },
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)",
  },
}));

const FeaturedArticleContent = styled(CardContent)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  color: "white",
  padding: theme.spacing(6),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontSize: "0.85rem",
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  height: 32,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.75rem",
    height: 28,
  },
}));

const StyledDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: "85%",
    maxWidth: 360,
    background: theme.palette.background.default,
    borderTopRightRadius: theme.spacing(3),
    borderBottomRightRadius: theme.spacing(3),
    padding: theme.spacing(2),
  },
}));

const CategoryButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1, 3),
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  textTransform: "none",
  fontSize: "0.9rem",
}));

const ArticleGrid = styled(Grid)(({ theme }) => ({
  "& .MuiGrid-item": {
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(3),
    },
  },
}));

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [trendingArticles, setTrendingArticles] = useState<any[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showTrending, setShowTrending] = useState(false);
  const [displayedArticles, setDisplayedArticles] = useState<any[]>([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  const {
    articles,
    loading,
    error: articleError,
    totalPages,
  } = useSelector((state: RootState) => state.articleSearch);

  const observerTarget = useRef(null);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchTrendingArticles = async () => {
    try {
      setTrendingLoading(true);
      const { data } = await axiosInstance().get("/api/v1/article/trending");
      setTrendingArticles(data?.articles);
      return data?.articles;
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
      return [];
    } finally {
      setTrendingLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingArticles();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) =>
        prevIndex === trendingArticles.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [trendingArticles.length]);

  const fetchArticles = useCallback(async () => {
    try {
      if (!showTrending) {
        if (selectedCategory && selectedCategory !== "All") {
          dispatch(searchArticleByCategory(selectedCategory, page));
        } else {
          dispatch(searchRecentArticle(["Tech", "Finance", "Food"], page));
        }
      }
    } catch (err) {
    
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  }, [selectedCategory, showTrending, page]);

  useEffect(() => {
    if (!loading && hasMore) {
      fetchArticles();
    }
  }, [page]);

  useEffect(() => {
    setDisplayedArticles(showTrending ? trendingArticles : articles || []);
  }, [showTrending, trendingArticles, articles]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !showTrending) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, showTrending]);

  useEffect(() => {
    setHasMore(page < totalPages);
  }, [page, totalPages]);

  const handleCategorySelect = (category: string) => {
    setShowTrending(false);
    setSelectedCategory(category);
    setIsDrawerOpen(false);
    setPage(1);
  };

  const handleTrendingClick = async () => {
    setShowTrending(true);
    setSelectedCategory("");
    setIsDrawerOpen(false);
    setPage(1);
    await fetchTrendingArticles();
  };

  const categories = [
    "All",
    "Tech",
    "Science",
    "News",
    "Education",
    "Personal Dev",
    "Finance",
    "Fashion",
    "Culture",
    "Food",
    "Music",
  ];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchArticles();
  };

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
          <CategoryIcon />
        </Avatar>
        <Typography variant="h6">Categories</Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List sx={{ flexGrow: 1 }}>
        <ListItem button onClick={() => navigate("/")} sx={{ mb: 1 }}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

       

        <ListItem button onClick={() => navigate("/bookmarks")} sx={{ mb: 3 }}>
          <ListItemIcon>
            <BookmarkIcon />
          </ListItemIcon>
          <ListItemText primary="Bookmarks" />
        </ListItem>

        <Typography
          variant="subtitle2"
          sx={{ px: 2, mb: 1, color: "text.secondary" }}
        >
          Browse Categories
        </Typography>

        {categories.map((category) => (
          <ListItem
            button
            key={category}
            selected={selectedCategory === category}
            onClick={() => handleCategorySelect(category)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              },
            }}
          >
            <ListItemText primary={category} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              color="inherit"
              onClick={() => setIsDrawerOpen(true)}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                background: `#000`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Blog
            </Typography>
          </Box>

          <IconButton
            color="primary"
            onClick={() => navigate("/blog/article/new")}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            <CreateIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{
          mt: { xs: 2, sm: 4 },
          mb: 4,
          flexGrow: 1,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Section>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBannerIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StyledBanner>
                <CardMedia
                  component="img"
                  height={isMobile ? "350" : isMedium ? "450" : "600"}
                  image={
                    trendingArticles[currentBannerIndex]?.Article.image?.url
                  }
                  alt={trendingArticles[currentBannerIndex]?.Article.title}
                  sx={{
                    objectFit: "cover",
                    transform: "scale(1.1)",
                    transition: "transform 0.3s ease-in-out",
                  }}
                />
                <FeaturedArticleContent>
                  <CategoryChip
                    label={
                      trendingArticles[currentBannerIndex]?.Article.category
                    }
                    color="primary"
                  />
                  <Typography
                    variant={"h1"}
                    gutterBottom
                    sx={{
                      fontWeight: 800,
                      mb: 3,
                      fontSize: isMobile ? 26 : 44,
                    }}
                  >
                    {trendingArticles[currentBannerIndex]?.Article.title}
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.8,
                        fontWeight: 500,
                      }}
                    >
                      {
                        trendingArticles[currentBannerIndex]?.Article
                          .readDuration
                      }
                    </Typography>
                    <Button
                      variant="contained"
                      size={"medium"}
                      onClick={() =>
                        navigate(
                          `/blog/article/${trendingArticles[currentBannerIndex]?.Article.slug}`
                        )
                      }
                      endIcon={<ArrowForward />}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                      }}
                    >
                      Read More
                    </Button>
                  </Box>
                </FeaturedArticleContent>
              </StyledBanner>
            </motion.div>
          </AnimatePresence>
        </Section>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexWrap: "wrap",
            gap: 1,
            mb: 4,
            mt: 2,
          }}
        >
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              variant={selectedCategory === category ? "filled" : "outlined"}
              color="secondary"
              onClick={() => handleCategorySelect(category)}
              sx={{
                background:
                  selectedCategory === category
                    ? "linear-gradient(45deg, #8d6bfe 30%, #53ffe5 90%)"
                    : "transparent",
              }}
            />
          ))}
        </Box>

        <ArticleGrid
          container
          spacing={{ xs: 2, md: 4 }}
          columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}
          sx={{
            mt: 4,
            "& > .MuiGrid-item": {
              display: "flex",
              justifyContent: "center",
              alignItem: "center",
            },
          }}
        >
          {displayedArticles?.length ? (
            displayedArticles.map((art) => (
              <Grid item xs={1} key={art._id}>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItem={"center"}
                  sx={{
                    width: "100%",
                    maxWidth: 400,
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                    },
                  }}
                >
                  <VerticalArticleItem
                    _id={art._id}
                    title={art.title}
                    slug={art.slug}
                    image={art.image?.url}
                    caption={art.content}
                    category={art.category}
                    postedBy={art.postedBy}
                    date={art.createdAt}
                    savedBy={art.savedBy}
                    readDuration={art.readDuration}
                  />
                </Box>
              </Grid>
            ))
          ) : (
            <>
              {loading && (
                <>
                  {Array(6)
                    .fill(null)
                    .map((_, i) => (
                      <Grid item xs={1} key={i}>
                        <Box
                          display={"flex"}
                          justifyContent={"center"}
                          alignItem={"center"}
                          sx={{
                            width: "100%",
                            maxWidth: 400,
                            transition: "transform 0.3s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-8px)",
                            },
                          }}
                        >
                          <VerticalArticleItemSkeletonLoader />
                        </Box>
                      </Grid>
                    ))}
                </>
              )}
            </>
          )}
        </ArticleGrid>

        <Paginator
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Container>

      <StyledDrawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpen={() => setIsDrawerOpen(true)}
        disableSwipeToOpen={!isMobile}
        PaperProps={{
          sx: {
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(to bottom, #2C3E50, #1A1A1A)"
                : "linear-gradient(to bottom, #FFFFFF, #F5F5F5)",
          },
        }}
      >
        {drawerContent}
      </StyledDrawer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity as "error" | "success"}
          sx={{
            width: "100%",
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default BlogPage;
