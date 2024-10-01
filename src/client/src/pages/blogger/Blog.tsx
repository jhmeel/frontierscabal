import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Container, Grid, Typography, Button, Card, CardContent, 
  CardMedia, Chip, TextField, Drawer, IconButton, useMediaQuery,
  useTheme, AppBar, Toolbar, InputAdornment
} from '@mui/material';
import { 
  FilterList as FilterListIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
  Create as CreateIcon
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { 
  searchArticleByCategory, 
  searchArticleByTitle, 
  searchRecentArticle, 
  clearErrors 
} from '../../actions/article';
import { RootState } from '../../store';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import VerticalArticleItem from '../../components/verticalArticleItem/VerticalArticleItem';
import Footer from '../../components/footer/Footer';

const StyledBanner = styled('div')(({ theme }) => ({
  height: '50vh',
  position: 'relative',
  marginBottom: theme.spacing(4),
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  paddingTop: '56.25%', // 16:9 aspect ratio
}));

const StyledCardContent = styled(CardContent)( {
  flexGrow: 1,
});

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingArticles, setTrendingArticles] = useState<any[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { articles, loading, error: articleError, totalPages } = useSelector((state: RootState) => state.articleSearch);

  const observerTarget = useRef(null);

  useEffect(() => {
    const fetchTrendingArticles = async () => {
      try {
        const { data } = await axiosInstance().get('/api/v1/article/trending');
        setTrendingArticles(data?.articles);
      } catch (err: any) {
        toast.error('Failed to fetch trending articles');
      }
    };
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

  const fetchArticles = useCallback(() => {
    if (articleError) {
      toast.error(articleError);
      dispatch(clearErrors());
    } else if (searchQuery) {
      dispatch(searchArticleByTitle(searchQuery, page));
    } else if (selectedCategory && selectedCategory !== 'All') {
      dispatch(searchArticleByCategory(selectedCategory, page));
    } else {
      dispatch(searchRecentArticle(['Tech', 'Personal Dev', 'Finance', 'Food', 'Music'], page));
    }
  }, [dispatch, articleError, searchQuery, selectedCategory, page]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prevPage => prevPage + 1);
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
  }, [hasMore, loading]);

  useEffect(() => {
    setHasMore(page < totalPages);
  }, [page, totalPages]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryDrawerOpen(false);
    setPage(1);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setIsCategoryDrawerOpen(true)}
          >
            <FilterListIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Blog
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            style={{ marginRight: theme.spacing(2) }}
          />
          <IconButton color="primary" onClick={() => navigate('/blog/article/new')}>
            <CreateIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" style={{ marginTop: theme.spacing(4) }}>
        <StyledBanner style={{ backgroundImage: `url(${trendingArticles[currentBannerIndex]?.Article.image?.url})` }}>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: theme.spacing(2) }}>
            <Typography variant="h2" component="h1" gutterBottom>
              {trendingArticles[currentBannerIndex]?.Article.title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {trendingArticles[currentBannerIndex]?.Article.description?.slice(0, 100)}...
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate(`/blog/article/${trendingArticles[currentBannerIndex]?.Article.slug}`)}
              style={{ marginTop: theme.spacing(2) }}
            >
              Read More
            </Button>
          </div>
          {!isMobile && (
            <>
              <IconButton 
                style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)' }} 
                onClick={() => setCurrentBannerIndex(prev => prev === 0 ? trendingArticles.length - 1 : prev - 1)}
              >
                <ChevronLeftIcon style={{ fontSize: 40, color: 'white' }} />
              </IconButton>
              <IconButton 
                style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)' }} 
                onClick={() => setCurrentBannerIndex(prev => (prev + 1) % trendingArticles.length)}
              >
                <ChevronRightIcon style={{ fontSize: 40, color: 'white' }} />
              </IconButton>
            </>
          )}
        </StyledBanner>

        <Grid container spacing={4} justifyContent="center" >
          {articles?.map((art) => (
            <Grid item key={art._id}  justifyContent="center">
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
            </Grid>
          ))}
        </Grid>

        <div ref={observerTarget} style={{ height: '20px' }} />
      </Container>

      <Drawer
        anchor="left"
        open={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
      >
        <div style={{ width: 250, padding: theme.spacing(2) }}>
          <Typography variant="h6" gutterBottom>Categories</Typography>
          {['All', 'Tech', 'Science', 'News', 'Education', 'Personal Dev', 'Finance', 'Fashion', 'Culture', 'Food', 'Music'].map((category) => (
            <Button
              key={category}
              fullWidth
              onClick={() => handleCategorySelect(category)}
              style={{ justifyContent: 'flex-start', marginBottom: theme.spacing(1) }}
              variant={selectedCategory === category ? 'contained' : 'text'}
              color="primary"
            >
              {category}
            </Button>
          ))}
        </div>
      </Drawer>
      <Footer/>
    </>
  );
};

export default BlogPage;
