import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Container, Grid, Typography, Button, Card, CardContent, 
  CardMedia, Chip, TextField, Drawer, IconButton, useMediaQuery,
  useTheme, AppBar, Toolbar, InputAdornment,
  Box
} from '@mui/material';
import { 
  FilterList as FilterListIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
  Create as CreateIcon,
  ArrowForward
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


const Section = styled('section')(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));


const StyledBanner = styled(Card)(({ theme }) => ({
  position: 'relative',
  height: 400,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  borderRadius: 4,
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
  },
}));

const FeaturedArticleContent = styled(CardContent)({
  position: 'relative',
  zIndex: 1,
  color: 'white',
});

const CategoryChip = styled(Chip)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontSize:'0.5rem',
  fontWeight: 600,
}));

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
         
          />
          <IconButton color="primary" onClick={() => navigate('/blog/article/new')}>
            <CreateIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      

      <Container maxWidth="lg" style={{ marginTop: theme.spacing(4) }}>
        
      <Section>
        <StyledBanner>
          <CardMedia
            component="img"
            height="400"
            image={trendingArticles[currentBannerIndex]?.Article.image?.url}
            alt={trendingArticles[currentBannerIndex]?.Article.title}
          />
          <FeaturedArticleContent>
            <CategoryChip label={trendingArticles[currentBannerIndex]?.Article.category} color="primary" />
            <Typography variant="h4" gutterBottom>
              {trendingArticles[currentBannerIndex]?.Article.title}
            </Typography>
           
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="caption">
                {trendingArticles[currentBannerIndex]?.Article.readDuration}
              </Typography>
              <Button  onClick={() => navigate(`/blog/article/${trendingArticles[currentBannerIndex]?.Article.slug}`)}  variant="contained" style={{fontSize:"0.6rem"}} color="primary" endIcon={<ArrowForward/>}>
                Read More
              </Button>
            </Box>
          </FeaturedArticleContent>
        </StyledBanner>
      </Section>
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
