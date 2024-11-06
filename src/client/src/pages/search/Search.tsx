import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  InputAdornment,
  IconButton,
  Chip,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Search as SearchIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import SpinLoader from '../../components/loaders/SpinLoader';
import UserItem from '../../components/userItem/UserItem';
import HorizontalArticleItem from '../../components/horizontalArticleItem/HorizontalArticleItem';
import StudyMaterialItem from '../../components/studyMaterialItem/StudyMaterialItem';
import Footer from '../../components/footer/Footer';
import { useParams } from 'react-router-dom';

const SearchContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(2),
  
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: '30px',
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },
  },
}));

const HistoryPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  border:'1px solid #ededed'
}));

const TrendingPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  border:'1px solid #ededed',
  backgroundColor: theme.palette.primary.light,
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [trendingTopics] = useState([
    'AI Ethics',
    'Quantum Computing',
    'Climate Change',
    'Space Tourism',
    'Blockchain',
  ]);
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const { query } = useParams();

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(history);

    setSearchTerm(query)
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      const updatedHistory = [searchTerm, ...searchHistory.slice(0, 4)]; // Show only top 5
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));

      try {
        setLoading(true);
        const { data } = await axiosInstance().get(`/api/v1/search-cabal?q=${searchTerm}`);
        setLoading(false);
        setSearchResult(data);
      } catch (err: any) {
        setLoading(false);
        toast.error(err.message);
      }
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <>
      <SearchContainer maxWidth="lg">
        <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 700, mb: 4 }}>
          Explore Frontierscabal
        </Typography>

        <form onSubmit={handleSearch}>
          <SearchBar
            fullWidth
            variant="outlined"
            size='small'
            placeholder="What are you curious about today?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton type="submit" edge="end">
                    <SearchIcon color="action" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>

        {!searchResult && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <HistoryPaper elevation={3}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <HistoryIcon sx={{ mr: 1 }} /> Recent Searches
                  {searchHistory.length > 0 && (
                    <IconButton onClick={handleClearHistory} size="small" sx={{ ml: 'auto' }}>
                      <RefreshIcon />
                    </IconButton>
                  )}
                </Typography>
                {searchHistory.length > 0 ? (
                  <List>
                    {searchHistory.slice(0, 5).map((term, index) => ( 
                      
                      <ListItem button key={index} onClick={() => setSearchTerm(term)}>
                        <ListItemText primary={term} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Your search history will appear here.
                  </Typography>
                )}
              </HistoryPaper>
            </Grid>

            <Grid item xs={12} md={6}>
              <TrendingPaper elevation={3}>
                <Typography variant="h6" gutterBottom>
                  Trending Topics
                </Typography>
                {trendingTopics.map((topic) => (
                  <StyledChip
                    key={topic}
                    label={topic}
                    onClick={() => setSearchTerm(topic)}
                    clickable
                  />
                ))}
              </TrendingPaper>
            </Grid>
          </Grid>
        )}

        {loading && <SpinLoader />}

        {searchResult && (
          <Grid container spacing={1}>
            {/* Render Users */}
            {searchResult?.users?.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    People
                  </Typography>
                </Grid>
                {searchResult?.users.map((usr: any, i: number) => (
                  <Grid item xs={12} sm={6} md={6} key={i}>
                    <UserItem username={usr?.username} bio={usr?.bio} img={usr?.avatar?.url} />
                  </Grid>
                ))}
              </>
            )}

            {/* Render Articles */}
            {searchResult?.articles?.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    Stories
                  </Typography>
                </Grid>
                {searchResult?.articles.map((art: any, i: number) => (
                  <Grid item xs={12} key={i}>
                    <HorizontalArticleItem
                      id={art._id}
                      title={art.title}
                      slug={art.slug}
                      image={art.image?.url}
                      caption={art.sanitizedHtml}
                      category={art.category}
                      postedBy={art.postedBy}
                      readDuration={art.readDuration}
                    />
                  </Grid>
                ))}
              </>
            )}

            {/* Render Past Questions */}
            {searchResult?.pastQuestions?.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    PQ&A
                  </Typography>
                </Grid>
                {searchResult?.pastQuestions.map((pq: any, i: number) => (
                  <Grid item xs={12} sm={6} md={6} key={i}>
                    <StudyMaterialItem
                      _id={pq?._id}
                      tag={pq?.courseCode}
                      courseTitle={pq?.courseTitle}
                      sch={pq?.school}
                      session={pq?.session}
                      downloads={pq?.downloads}
                      postedBy={pq?.postedBy}
                    />
                  </Grid>
                ))}
              </>
            )}

            {/* Render Course Materials */}
            {searchResult?.courseMaterials?.length > 0 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    Course Materials
                  </Typography>
                </Grid>
                {searchResult?.courseMaterials.map((cm: any, i: number) => (
                  <Grid item xs={12} sm={6} md={6} key={i}>
                    <StudyMaterialItem
                      _id={cm?._id}
                      tag={cm?.courseCode}
                      courseTitle={cm?.courseTitle}
                      sch={cm?.school}
                      session={cm?.session}
                      downloads={cm?.downloads}
                      postedBy={cm?.postedBy}
                      type='CM'
                    />
                  </Grid>
                ))}
              </>
            )}
          </Grid>
        )}
      </SearchContainer>
      <Footer />
    </>
  );
};

export default Search;
