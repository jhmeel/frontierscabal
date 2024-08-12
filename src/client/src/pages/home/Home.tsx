import React, { useCallback, useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Banner from "../../components/bannerItem/Banner";
import { useSelector } from "react-redux";
import Footer from "../../components/footer/Footer";
import Descriptor from "../../components/descriptor/Descriptor";
import MsgItem from "../../components/msgItem/MsgItem";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import VerticalArticleItem from "../../components/verticalArticleItem/VerticalArticleItem";
import VerticalArticleItemSkeletonLoader from "../../components/loaders/VerticalArticleItemSkeletonLoader";
import {
  IconArrowTrendUp,
  IconArticleFill,
  IconCalendarEventFill,
  IconChevronRight,
  IconClockRotateLeft,
  IconVideoTwentyFour,
} from "../../assets/icons";
import FactGenerator from "../../components/factGen";
import testImg from "../../assets/images/online_article.svg";
import EventItem from "../../components/eventItem/EventItem";
import EventSkeletonLoader from "../../components/loaders/EventSkeletonLoader";
import HorizontalArticleItem from "../../components/horizontalArticleItem/HorizontalArticleItem";
import HorizontalArticleItemSkeletonLoader from "../../components/loaders/HorizontalArticleItemSkeletonLoader";
import LocalForageProvider from "../../utils/localforage";
import {
  clearErrors as clearArticleErrors,
  searchRecentArticle,
} from "../../actions/article";
import {
  searchOngoingEvents,
  clearErrors as clearEventErrors,
} from "../../actions/event";
import { isOnline } from "../../utils";
import axiosInstance from "../../utils/axiosInstance";
import { ModuleItem } from "../../components/moduleItem/ModuleItem";
import ModuleItemSkeletonLoader from "../../components/loaders/ModuleItemSkeletonLoader";
import { RootState } from "../../store";
const Home: React.FC = () => {
  const { theme } = useSelector((state: RootState) => state.theme);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [trendingFetchErr, setTrendingFetchError] = useState("");
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [randomFetchArticle, setRandomFetchArticle] = useState([]);
  const [isRandomFetchErr, setIsRandomFetchErr] = useState("");
  const [randomSelectedCategory, setRandomSelectedCategory] = useState("");
  const [randomFetchLoading, setRandomFetchLoading] = useState(false);
  const [upComingEvents, setUpComingEvents] = useState([]);
  const [userInterest, setUserInterest] = useState([]);
  const [modules, setModules] = useState([]);
  const [moduleFetchErr, setModuleFetchErr] = useState("");
  const [moduleLoading, setModuleLoading] = useState(false);
  const [page, setPage] = useState(1);

  const {
    error: recentArticleError,
    articles: recentArticles,
    loading: recentArticleLoading,
  } = useSelector((state: RootState) => state.articleSearch);

  const {
    loading: eventsLoading,
    events,
    error: eventError,
  } = useSelector((state: RootState) => state.eventSearch);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    LocalForageProvider.getItem("FC:HAS:WELCOME:USER", (err, res) => {
      if (isAuthenticated && user?.username && !res) {
        enqueueSnackbar(`Welcome ${user?.username}!`, {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          style: {
            backgroundColor: "#176984",
            color: "#fff",
          },
        });
        LocalForageProvider.setItem("FC:HAS:WELCOME:USER", true);
      }
    });
  }, [isAuthenticated, user, enqueueSnackbar]);

  useEffect(() => {
    LocalForageProvider.getItem("FC:USER:INTERESTS", (err, val: string) => {
      val = JSON.parse(val);
      val &&
        setUserInterest(Object.keys(val).filter((key) => val[key] === true));
    });
  }, []);

  //Recent fetch
  const fetchRecentArticles = useCallback(() => {
    if (!userInterest || userInterest.length === 0) {
      setUserInterest(["Personal Dev", "Tech", "Science", "Culture"]);
      dispatch<any>(searchRecentArticle(userInterest, page));
      return;
    } else {
      dispatch<any>(searchRecentArticle(userInterest, page));
    }
  }, [dispatch, userInterest, page]);

  const fetchOngoingEvents = useCallback(() => {
    dispatch<any>(searchOngoingEvents());
  }, [dispatch]);

  useEffect(() => {
    if (recentArticleError) {
      dispatch<any>(clearArticleErrors());
    }
    isOnline() && fetchRecentArticles();
  }, [dispatch, enqueueSnackbar, fetchRecentArticles]);

  //Trending fetch
  useEffect(() => {
    const getTrendingArticles = async () => {
      try {
        setTrendingLoading(true);
        const { data } = await axiosInstance().get(`/api/v1/article/trending`);
        setTrendingLoading(false);

        setTrendingArticles(data?.articles);
      } catch (err: any) {
        setTrendingLoading(false);
        setTrendingFetchError(err.message);
      }
    };
    isOnline() && getTrendingArticles();
  }, [enqueueSnackbar, trendingFetchErr]);

  useEffect(() => {
    const getUpComingEvents = async () => {
      try {
        const { data } = await axiosInstance().get(`/api/v1/events/upcoming`);
        setUpComingEvents(data?.event);
      } catch (err) {}
    };
    getUpComingEvents();
  }, []);
  //Random fetch
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
        setIsRandomFetchErr(err.message);
      }
    };

    isOnline() && getRandomArticle();
  }, [enqueueSnackbar, isRandomFetchErr]);

  //Fetch Modules

  useEffect(() => {
    const getModules = async () => {
      try {
        setModuleLoading(true);
        const { data } = await axiosInstance().get(`/api/v1/modules`);
        setModules(data?.modules);
        setModuleLoading(false);
      } catch (err: any) {
        setModuleLoading(false);
        setModuleFetchErr(err.message);
      }
    };
    isOnline() && getModules();
  }, [enqueueSnackbar, moduleFetchErr]);

  useEffect(() => {
    if (isRandomFetchErr) {
      setIsRandomFetchErr("");
    } else if (trendingFetchErr) {
      setTrendingFetchError("");
    }
  }, [isRandomFetchErr, trendingFetchErr]);
  //Ongoing event fetch
  useEffect(() => {
    if (eventError) {
      dispatch<any>(clearEventErrors());
    }
    isOnline() && fetchOngoingEvents();
  }, [dispatch, fetchOngoingEvents]);

  const handleViewMoreArticle = () => {
    navigate("/blog");
  };

  const handleViewMoreEvents = () => {
    navigate("/events");
  };

  const handleViewMoreModule = () => {
    navigate("/modules");
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <HomeRenderer>
          <Banner />
          <Descriptor />
          <div className="msg-holder">
            <MsgItem />
          </div>

          <div className="trending-article-list-header">
            <div className="icon-title-tag">
              <IconArrowTrendUp fill="#000" height="20" width="20" />{" "}
              <h2>Top Stories</h2>
            </div>

            <div className="view-more" onClick={handleViewMoreArticle}>
              <span>View More</span>
              <IconChevronRight
                className="view-more-icon"
                fill="#176984"
                height="26px"
                width="26px"
              />
            </div>
          </div>

          <div className="trending-articles">
            {trendingArticles?.length
              ? trendingArticles.map((art: any, i: number) => (
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
                ))
              : Array(10)
                  .fill(null)
                  .map((_, i) => <VerticalArticleItemSkeletonLoader key={i} />)}
          </div>
          <div className="module_fact_cont">
            <div className="module_cont">
              <div className="module-header">
                <div className="icon-title-tag">
                  <IconVideoTwentyFour fill="#000" height="20" width="20" />
                  <h2>Module</h2>
                </div>

                <div className="view-more" onClick={handleViewMoreModule}>
                  <span>View More</span>
                  <IconChevronRight
                    className="view-more-icon"
                    fill="#176984"
                    height="26px"
                    width="26px"
                  />
                </div>
              </div>
              <div className="module_list">
                {modules.length
                  ? modules.map((mod: any, i: number) => (
                      <ModuleItem
                        key={i}
                        _id={mod?._id}
                        title="title"
                        description="description"
                        banner={testImg}
                      />
                    ))
                  : Array(10)
                      .fill(null)
                      .map((_: any, i: number) => (
                        <ModuleItemSkeletonLoader key={i} />
                      ))}
              </div>
            </div>
            <FactGenerator />
          </div>

          {/* upcoming events */}
          <div className="upcoming-events">
            <div className="upcoming-events-list-header">
              <div className="icon-title-tag">
                <IconCalendarEventFill fill="#000" height="20" width="20" />
                <h2>Upcoming Events</h2>
              </div>

              <div className="view-more" onClick={handleViewMoreEvents}>
                <span>View More</span>
                <IconChevronRight
                  className="view-more-icon"
                  fill="#176984"
                  height="26px"
                  width="26px"
                />
              </div>
            </div>
            <div className="upcoming-events-list">
              {upComingEvents?.length > 0
                ? upComingEvents.map((eve: any, i: number) => (
                    <EventItem
                      id={eve?._id}
                      slug={eve?.slug}
                      title={eve?.title}
                      avatar={eve?.avatar?.url}
                      description={eve?.description}
                      category={eve?.category}
                      createdBy={eve?.createdBy}
                      key={i}
                    />
                  ))
                : Array(6)
                    .fill(null)
                    .map((_, i) => <EventSkeletonLoader key={i} />)}
            </div>
          </div>

          {/* Recent Articles */}
          <div className="recent-article">
            <div className="recent-article-list-header">
              <div className="icon-title-tag">
                <IconClockRotateLeft height="18" width="18" fill="#000" />
                <h2>Recent Stories</h2>
              </div>
              <div className="view-more" onClick={handleViewMoreArticle}>
                <span>View More</span>
                <IconChevronRight
                  className="view-more-icon"
                  fill="#176984"
                  height="26px"
                  width="26px"
                />
              </div>
            </div>
            <div className="recent-article-list-holder">
              {recentArticles?.length
                ? recentArticles.map((art: any, i: number) => (
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
                      key={i}
                    />
                  ))
                : Array(12)
                    .fill(null)
                    .map((_, i) => (
                      <HorizontalArticleItemSkeletonLoader key={i} />
                    ))}
            </div>
          </div>

          {/* Random Article Category */}
          <div className="random-article">
            <div className="random-article-list-header">
              <div className="icon-title-tag">
                <IconArticleFill height="20" width="20" fill="#000" />
                <h2>{randomSelectedCategory}</h2>
              </div>
              <div className="view-more" onClick={handleViewMoreArticle}>
                <span>View More</span>
                <IconChevronRight
                  className="view-more-icon"
                  fill="#176984"
                  height="26px"
                  width="26px"
                />
              </div>
            </div>
            <div className="random-article-list-holder">
              {randomFetchArticle?.length
                ? randomFetchArticle.map((art: any, i: number) => (
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
                      key={i}
                    />
                  ))
                : Array(12)
                    .fill(null)
                    .map((_, i) => (
                      <HorizontalArticleItemSkeletonLoader key={i} />
                    ))}
            </div>
          </div>
        </HomeRenderer>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default Home;

const HomeRenderer = styled.div`
  max-width: 100%;
  overflow-x:hidden;

  .msg-holder {
    border-top: 1px solid #ededed;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  .trending-article-list-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-top: 1px solid #ededed;
    padding-left: 5px;
  }
  .trending-article-list-header h2 {
    padding: 3px;
    font-size: 18px;
    color: #000;
  }
  .icon-title-tag {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .view-more {
    padding: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 9;
    cursor: pointer;
  }
  .view-more span {
    color: #176984;
    font-size: 12px;
    font-family: 500;
  }
  .view-more-icon {
    border-radius: 50%;
    padding: 6px;
    cursor: pointer;
    z-index: 9;
  }
  .trending-articles {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    overflow-x: scroll;
    padding: 0px 10px 0px 10px;
    gap: 5px;
  }
  .module-header {
    width: 100%;
    position: absolute;
    top: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-top: 1px solid #ededed;
    padding-left: 5px;
  }
  .module_fact_cont {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    border-top: 1px solid #ededed;
  }

  .module_cont {
    position: relative;
    display: flex;
    flex-direction: row;
    width: 70%;
  }
  .module_list {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    overflow-x: scroll;
    padding: 0px 10px 0px 10px;
  }
  .upcoming-events-list-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 5px;
    border-bottom: 1px solid #ededed;
  }
  .upcoming-events-list-header h2 {
    padding: 3px;
    cursor: pointer;
    font-size: 18px;
    color: #000;
  }
  .upcoming-events-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    overflow-x: scroll;
    padding: 5px 10px 5px 10px;
  }
  .upcoming-events {
    max-width: 100%;
    display: flex;
    margin-top: 5px;
    flex-direction: column;
  }

  .recent-article {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
    max-width: 100%;
    gap: 5px;
  }
  .recent-article-list-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid #ededed;
 
  }

  .recent-article-list-header h2 {
    padding: 3px;
    font-size: 18px;
    color: #000;
  }

  .recent-article-list-holder {
   display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: center;
    width: 90%;
    gap: 10px;
    padding:3px;
  }
  .random-article {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
    margin-bottom: 10px;
    max-width: 100%;
    gap: 5px;
  }
  .random-article-list-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid #ededed;
    padding-left: 5px;
  }

  .random-article-list-header h2 {
    padding: 3px;
    font-size: 18px;
    color: #000;
  }

  .random-article-list-holder {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: center;
    width: 90%;
    gap: 10px;
    padding:3px;
  }
  @media (max-width: 767px) {
    .module_fact_cont {
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .upcoming-events-list-header,
    .recent-article-list-header h2,
    .random-article-list-header h2 {
      font-size: 16px;
    }
    h2,
    .module-header h2 {
      font-size: 16px;
    }
    .module_cont {
      width: 100%;
    }
    .module_list {
      margin-top: 35px;
    }
  }
`;
