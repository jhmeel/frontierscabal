import React, { useCallback, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Button,
  Container,
  CircularProgress,
  Tabs,
  Tab,
  Drawer,
  IconButton,
  Slider,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  Article as ArticleIcon,
  VideoLibrary as VideoLibraryIcon,
  ChevronRight as ChevronRightIcon,
  Book as BookIcon,
  Close as CloseIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Search as SearchIcon,
  Code as CodeIcon,
  Science as ScienceIcon,
  Newspaper as NewspaperIcon,
  School as SchoolIcon,
  EmojiObjects as PersonalDevIcon,
  AutoStories as FictionIcon,
  AttachMoney as FinanceIcon,
  Checkroom as FashionIcon,
  Museum as CultureIcon,
  Restaurant as FoodIcon,
  Star as StarIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from "@mui/icons-material";
import Footer from "../../components/footer/Footer";
import VerticalArticleItemSkeletonLoader from "../../components/loaders/VerticalArticleItemSkeletonLoader";
import VerticalArticleItem from "../../components/verticalArticleItem/VerticalArticleItem";
import Banner from "../../components/bannerItem/Banner";
import Descriptor from "../../components/descriptor/Descriptor";
import MsgItem from "../../components/msgItem/MsgItem";
import ModuleItemSkeletonLoader from "../../components/loaders/ModuleItemSkeletonLoader";
import { ModuleItem } from "../../components/moduleItem/ModuleItem";
import FactGenerator from "../../components/factGen";
import { isOnline } from "../../utils";
import axiosInstance from "../../utils/axiosInstance";
import {
  clearErrors as clearArticleErrors,
  searchRecentArticle,
} from "../../actions/article";
import { RootState } from "../../store";
import LocalForageProvider from "../../utils/localforage";
import HorizontalArticleItemSkeletonLoader from "../../components/loaders/HorizontalArticleItemSkeletonLoader";
import HorizontalArticleItem from "../../components/horizontalArticleItem/HorizontalArticleItem";
import toast from "react-hot-toast";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [trendingArticles, setTrendingArticles] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [randomFetchArticle, setRandomFetchArticle] = useState([]);
  const [randomSelectedCategory, setRandomSelectedCategory] = useState("");
  const [randomFetchLoading, setRandomFetchLoading] = useState(false);
  const [userInterest, setUserInterest] = useState([]);
  const [modules, setModules] = useState([]);
  const [moduleLoading, setModuleLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [popularBooks, setPopularBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);

  const [bookCategories, setBookCategories] = useState([
    "Fiction",
    "Non-fiction",
    "Science",
    "Technology",
    "Business",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("Fiction");
  const [categoryBooks, setCategoryBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isReading, setIsReading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [libraryPickOfTheDay, setLibraryPickOfTheDay] = useState<any>(null);

  const [bookContent, setBookContent] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);

  const [categories, setCategories] = useState({
    Tech: false,
    Science: false,
    News: false,
    Education: false,
    Personal_dev: false,
    Fiction: false,
    Finance: false,
    Fashion: false,
    Culture: false,
    Food: false,
  });

  const {
    error: recentArticleError,
    articles: recentArticles,
    loading: recentArticleLoading,
  } = useSelector((state: RootState) => state.articleSearch);

  useEffect(() => {
    if (isAuthenticated && user?.username) {
      LocalForageProvider.getItem(`FC:${user.username}:INTERESTS`, (err, val: any) => {
        if (val) {
          const parsedVal = JSON.parse(val);
          setCategories(prevCategories => ({
            ...prevCategories,
            ...parsedVal,
          }));
        }
      });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const fetchCategoryBooks = async () => {
      try {
        setBooksLoading(true);
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=subject:${selectedCategory}&orderBy=newest&maxResults=10`
        );
        setCategoryBooks(response.data.items);
        setBooksLoading(false);
      } catch (error) {
        console.error("Error fetching category books:", error);
        setBooksLoading(false);
      }
    };

    fetchCategoryBooks();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchLibraryPickOfTheDay = async () => {
      try {
        const response = await axios.get(
          "https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&maxResults=1"
        );
        setLibraryPickOfTheDay(response.data.items[0]);
      } catch (error) {
        console.error("Error fetching library pick of the day:", error);
      }
    };

    fetchLibraryPickOfTheDay();
  }, []);

  useEffect(() => {
    const getTrendingArticles = async () => {
      try {
        setTrendingLoading(true);
        const { data } = await axiosInstance().get(`/api/v1/article/trending`);
        setTrendingLoading(false);
        setTrendingArticles(data?.articles);
      } catch (err: any) {
        setTrendingLoading(false);
        enqueueSnackbar(err.message, { variant: "error" });
      }
    };
    isOnline() && getTrendingArticles();
  }, [enqueueSnackbar]);



  const fetchRecentArticles = useCallback(() => {
    if (!userInterest || userInterest.length === 0) {
      setUserInterest(["Personal Dev", "Tech", "Science", "Culture"]);
      dispatch<any>(searchRecentArticle(userInterest, page));
      return;
    } else {
      dispatch<any>(searchRecentArticle(userInterest, page));
    }
  }, [dispatch, userInterest, page]);

  useEffect(() => {
    if (recentArticleError) {
      dispatch<any>(clearArticleErrors());
    }
    isOnline() && fetchRecentArticles();
  }, [dispatch, enqueueSnackbar, fetchRecentArticles]);
  useEffect(() => {
    const getRandomArticle = async () => {
      try {
        setRandomFetchLoading(true);
        const categories = [
          "Tech",
          "Science",
          "News",
          "Education",
          "Personal Dev",
          "Finance",
          "Fashion",
          "Food",
        ];
        const randCategory =
          categories[Math.floor(Math.random() * categories.length)];
        setRandomSelectedCategory(randCategory);
        const { data } = await axiosInstance().get(
          `/api/v1/article/search/?category=${randCategory}&page=${page}`
        );
        setRandomFetchLoading(false);
        setRandomFetchArticle(data?.articles);
      } catch (err: any) {
        setRandomFetchLoading(false);
        enqueueSnackbar(err.message, { variant: "error" });
      }
    };

    isOnline() && getRandomArticle();
  }, [enqueueSnackbar, page]);

  useEffect(() => {
    const getModules = async () => {
      try {
        setModuleLoading(true);
        const { data } = await axiosInstance().get(`/api/v1/modules`);
        setModules(data?.modules);
        setModuleLoading(false);
      } catch (err: any) {
        setModuleLoading(false);
        enqueueSnackbar(err.message, { variant: "error" });
      }
    };
    isOnline() && getModules();
  }, [enqueueSnackbar]);

  
  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
    utteranceRef.current = new SpeechSynthesisUtterance();
  }, []);

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  const handleBookSelect = async (book: any) => {
    setSelectedBook(book);
    setIsReading(true);
    try {
      const response = await axios.get(book.volumeInfo.previewLink);
      setBookContent(response.data);
    } catch (error) {
      console.error("Error fetching book content:", error);
      setBookContent("");
    }
    LocalForageProvider.getItem(`book-progress-${book.id}`, (err, val: any) => {
      if (val) {
        setCurrentTime(val.currentTime);
      }
    });
  };

  const handleCloseReading = () => {
    setIsReading(false);
    stopSpeaking();
    if (audio) {
      LocalForageProvider.setItem(`book-progress-${selectedBook.id}`, {
        currentTime: audio.currentTime,
      });
    }
  };

  const handlePlayPause = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      startSpeaking();
    }
  };

  const startSpeaking = () => {
    if (speechSynthesisRef.current && utteranceRef.current) {
      utteranceRef.current.text = bookContent;
      speechSynthesisRef.current.speak(utteranceRef.current);
      setIsSpeaking(true);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSeek = (event: Event, newValue: number | number[]) => {
    if (audio && typeof newValue === 'number') {
      audio.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    try {
      setBooksLoading(true);
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=10`
      );
      setCategoryBooks(response.data.items);
      setBooksLoading(false);
    } catch (error) {
      console.error("Error searching books:", error);
      setBooksLoading(false);
    }
  };

  const handleBookmark = () => {
    // Implement bookmarking functionality
    enqueueSnackbar("Book bookmarked successfully!", { variant: "success" });
  };

  const handleShare = () => {
    // Implement sharing functionality
    enqueueSnackbar("Share link copied to clipboard!", { variant: "success" });
  };

  const handleDownload = () => {
    // Implement download functionality
    enqueueSnackbar("Book download started!", { variant: "success" });
  };

  const handleFontSizeIncrease = () => {
    setFontSize(prevSize => Math.min(prevSize + 2, 24));
  };

  const handleFontSizeDecrease = () => {
    setFontSize(prevSize => Math.max(prevSize - 2, 12));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Tech":
        return <CodeIcon />;
      case "Science":
        return <ScienceIcon />;
      case "News":
        return <NewspaperIcon />;
      case "Education":
        return <SchoolIcon />;
      case "Personal_dev":
        return <PersonalDevIcon />;
      case "Fiction":
        return <FictionIcon />;
      case "Finance":
        return <FinanceIcon />;
      case "Fashion":
        return <FashionIcon />;
      case "Culture":
        return <CultureIcon />;
      case "Food":
        return <FoodIcon />;
      default:
        return <ArticleIcon />;
    }
  };

  const handleViewMore = (route: string) => () => {
    navigate(route);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <HomeWrapper>
      <Banner />
      <Descriptor />
      
      <Section>
        <SectionTitle>
          <Box display="flex" alignItems="center">
            <BookIcon />
            <Typography variant="h5" component="h2" ml={1}>Library Pick of the Day</Typography>
          </Box>
        </SectionTitle>
        {libraryPickOfTheDay && (
          <LibraryPickCard>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <BookCover
                  src={libraryPickOfTheDay.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192'}
                  alt={libraryPickOfTheDay.volumeInfo.title}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h4">{libraryPickOfTheDay.volumeInfo.title}</Typography>
                <Typography variant="subtitle1">{libraryPickOfTheDay.volumeInfo.authors?.join(', ')}</Typography>
                <Typography variant="body1" mt={2}>
                  {libraryPickOfTheDay.volumeInfo.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBookSelect(libraryPickOfTheDay)}
                  sx={{ mt: 2 }}
                >
                  Read Now
                </Button>
              </Grid>
            </Grid>
          </LibraryPickCard>
        )}
      </Section>
      <MsgItemWrapper>
        <MsgItem />
      </MsgItemWrapper>
      {isAuthenticated && (
        <Section>
          <SectionTitle>
            <Box display="flex" alignItems="center">
              <ArticleIcon />
              <Typography variant="h5" component="h2" ml={1}>Following</Typography>
            </Box>
          </SectionTitle>
          <CategoriesScrollContainer>
            {Object.entries(categories).map(([category, isSelected]) => (
              isSelected && (
                <CategoryChip key={category} icon={getCategoryIcon(category)} label={category.replace('_', ' ')} />
              )
            ))}
          </CategoriesScrollContainer>
        </Section>
      )}

      <Section>
        <SectionTitle>
          <Box display="flex" alignItems="center">
            <TrendingUpIcon />
            <Typography variant="h5" component="h2" ml={1}>Top Stories</Typography>
          </Box>
          <ViewMoreButton
            endIcon={<ChevronRightIcon />}
            onClick={handleViewMore("/blog")}
          >
            View More
          </ViewMoreButton>
        </SectionTitle>
        <TrendingArticlesWrapper>
          {trendingLoading
            ? Array(10)
                .fill(null)
                .map((_, i) => <VerticalArticleItemSkeletonLoader key={i} />)
            : trendingArticles.map((art: any, i: number) => (
                <VerticalArticleItem
                  _id={art.Article._id}
                  title={art.Article.title}
                  slug={art.Article.slug}
                  image={art.Article.image?.url}
                  caption={art.Article.content}
                  category={art.Article.category}
                  postedBy={art.Article.postedBy}
                  date={art.Article.createdAt}
                  savedBy={art.Article.savedBy}
                  readDuration={art.Article.readDuration}
                  key={i}
                />
              ))}
        </TrendingArticlesWrapper>
      </Section>

      <Section>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <SectionTitle>
              <Box display="flex" alignItems="center">
                <VideoLibraryIcon />
                <Typography variant="h5" component="h2" ml={1}>Modules</Typography>
              </Box>
              <ViewMoreButton
                endIcon={<ChevronRightIcon />}
                onClick={handleViewMore("/modules")}
              >
                View More
              </ViewMoreButton>
            </SectionTitle>
            <ModuleListWrapper>
              {moduleLoading
                ? Array(10)
                    .fill(null)
                    .map((_, i) => <ModuleItemSkeletonLoader key={i} />)
                : modules.map((mod: any, i: number) => (
                    <ModuleItem
                      key={i}
                      _id={mod?._id}
                      title={mod?.title}
                      description={mod?.description}
                      banner={mod?.banner}
                    />
                  ))}
            </ModuleListWrapper>
          </Grid>
          <Grid item xs={12} md={4}>
            <FactGenerator />
          </Grid>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>
          <Box display="flex" alignItems="center">
            <BookIcon />
            <Typography variant="h5" component="h2" ml={1}>Books by Category</Typography>
          </Box>
        </SectionTitle>
        <SearchBarWrapper>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search books..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={handleSearch}>Search</Button>
                </InputAdornment>
              ),
            }}
          />
        </SearchBarWrapper>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {bookCategories.map((category) => (
            <Tab key={category} label={category} value={category} />
          ))}
        </Tabs>
        <Grid container spacing={2} mt={2}>
          {booksLoading ? (
            <CircularProgress />
          ) : (
            categoryBooks?.map((book: any) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                <BookCard onClick={() => handleBookSelect(book)}>
                  <BookCover src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192'} alt={book.volumeInfo.title} />
                  <Typography variant="subtitle1">{book.volumeInfo.title}</Typography>
                  <Typography variant="body2">{book.volumeInfo.authors?.join(', ')}</Typography>
                  <Typography variant="caption">{book.volumeInfo.publishedDate}</Typography>
                  <RatingWrapper>
                    <StarIcon />
                    <Typography variant="body2">{book.volumeInfo.averageRating || 'N/A'}</Typography>
                  </RatingWrapper>
                </BookCard>
              </Grid>
            ))
          )}
        </Grid>
      </Section>

      <Section>
        <SectionTitle>
          <Box display="flex" alignItems="center">
            <ArticleIcon />
            <Typography variant="h5" component="h2" ml={1}>Recent Stories</Typography>
          </Box>
          <ViewMoreButton
            endIcon={<ChevronRightIcon />}
            onClick={handleViewMore("/blog")}
          >
            View More
          </ViewMoreButton>
        </SectionTitle>
        <Grid container spacing={2}>
          {recentArticleLoading
            ? Array(12)
                .fill(null)
                .map((_, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <HorizontalArticleItemSkeletonLoader />
                  </Grid>
                ))
            : recentArticles?.map((art: any, i: number) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <HorizontalArticleItem
                    id={art._id}
                    title={art.title}
                    slug={art.slug}
                    image={art.image?.url}
                    caption={art.content}
                    category={art.category}
                    postedBy={art.postedBy}
                    savedBy={art?.savedBy}
                    readDuration={art.readDuration}
                    pinnedBy={art.pinnedBy}
                  />
                </Grid>
              ))}
        </Grid>
      </Section>

      <Drawer
        anchor="right"
        open={isReading}
        onClose={handleCloseReading}
        PaperProps={{
          style: { width: '80%', maxWidth: '1000px' },
        }}
      >
        <ReadingDrawerContent>
          <IconButton
            aria-label="close"
            onClick={handleCloseReading}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedBook && (
            <>
              <Typography variant="h4" component="h2" gutterBottom>
                {selectedBook.volumeInfo.title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                By {selectedBook.volumeInfo.authors?.join(', ')}
              </Typography>
              <ActionTray>
                <Tooltip title="Bookmark">
                  <IconButton onClick={handleBookmark}>
                    <BookmarkIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton onClick={handleShare}>
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                  <IconButton onClick={handleDownload}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Increase font size">
                  <IconButton onClick={handleFontSizeIncrease}>
                    <ZoomInIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Decrease font size">
                  <IconButton onClick={handleFontSizeDecrease}>
                    <ZoomOutIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={isSpeaking ? "Stop speaking" : "Start speaking"}>
                  <IconButton onClick={handlePlayPause}>
                    {isSpeaking ? <VolumeOffIcon /> : <VolumeUpIcon />}
                  </IconButton>
                </Tooltip>
              </ActionTray>
              <BookContent style={{ fontSize: `${fontSize}px` }}>
                {bookContent ? (
                  <div dangerouslySetInnerHTML={{ __html: bookContent }} />
                ) : (
                  <iframe
                    src={selectedBook.volumeInfo.previewLink}
                    width="100%"
                    height="600px"
                    title={selectedBook.volumeInfo.title}
                  />
                )}
              </BookContent>
            </>
          )}
        </ReadingDrawerContent>
      </Drawer>

      <Footer />
    </HomeWrapper>
  );
};

export default Home;

const HomeWrapper = styled.div`
  max-width: 100%;
  overflow-x: hidden;
`;

const MsgItemWrapper = styled.div`
  border-top: 1px solid #ededed;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Section = styled(Container)`
  margin-top: 40px;
  margin-bottom: 40px;
`;

const SectionTitle = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ViewMoreButton = styled(Button)`
  color: #176984;
  text-transform: none;
`;

const TrendingArticlesWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding-bottom: 16px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
`;

const ModuleListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const BookCard = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }
`;

const BookCover = styled.img`
  width: 128px;
  height: 192px;
  object-fit: cover;
  margin-bottom: 8px;
  border-radius: 4px;
`;

const RatingWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
`;

const ReadingDrawerContent = styled(Box)`
  padding: 32px;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const BookContent = styled(Box)`
  margin-top: 24px;
  margin-bottom: 24px;
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
`;

const SearchBarWrapper = styled(Box)`
  margin-bottom: 16px;
`;

const CategoriesScrollContainer = styled(Box)`
  display: flex;
  overflow-x: auto;
  gap: 8px;
  padding-bottom: 16px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
`;

const CategoryChip = styled(Chip)`
  &:hover {
    background-color: #e0e0e0;
  }
`;

const LibraryPickCard = styled(Paper)`
  padding: 24px;
  margin-top: 16px;
`;

const ActionTray = styled(Box)`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 16px;
`;