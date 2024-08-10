import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiPlus, FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import VerticalArticleItem from "../../components/verticalArticleItem/VerticalArticleItem";
import Footer from "../../components/footer/Footer";
import MetaData from "../../MetaData";
import Paginator from "../../components/paginator/Paginator";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  searchArticleByCategory,
  searchArticleByTitle,
  searchRecentArticle,
  clearErrors,
} from "../../actions/article";
import styled from "styled-components";
import { isOnline } from "../../utils";
import VerticalArticleItemSkeletonLoader from "../../components/loaders/VerticalArticleItemSkeletonLoader";
import LocalForageProvider from "../../utils/localforage";
import toast from "react-hot-toast";
import { RootState } from "../../store";
import axiosInstance from "../../utils/axiosInstance.js";


const BlogPage: React.FC = (): React.ReactElement => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [optionVisible, setIsOptionVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [userInterest, setUserInterest] = useState<string[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const { theme } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch<any>();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    error: articleError,
    totalPages,
    articles,
    loading,
  } = useSelector((state: RootState) => state.articleSearch);

  const [trendingArticles, setTrendingArticles] = useState<any[]>([]);
  const [trendingFetchErr, setTrendingFetchError] = useState("");
  const [trendingLoading, setTrendingLoading] = useState(false);

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
  }, []);

  const toggleOptionVisible = () => {
    setIsOptionVisible(!optionVisible);
  };

  const handleSelectedCategory = (category: string) => {
    navigate({
      pathname: "/blog/search",
      search: `?category=${encodeURIComponent(category)}`,
    });
    toggleOptionVisible();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSubscription = useCallback(() => {
    if (selectedCategory && selectedCategory !== "All") {
      setUserInterest((prevInterests) => [...prevInterests, selectedCategory]);

      LocalForageProvider.getItem("FC:USER:INTERESTS", async (err, val) => {
        if (err) {
          console.error(err);
          return;
        }

        const parsedInterests = JSON.parse(val as string) || {};
        const updatedInt = { ...parsedInterests, [selectedCategory]: true };

        await LocalForageProvider.setItem(
          "FC:USER:INTERESTS",
          JSON.stringify(updatedInt)
        );

        toast.success(`You have added ${selectedCategory} to your interests!`);
      });
    }
  }, [selectedCategory]);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => 
        prevIndex === trendingArticles.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [trendingArticles.length]);

  const nextBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === trendingArticles.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === 0 ? trendingArticles.length - 1 : prevIndex - 1
    );
  };


  useEffect(() => {
    LocalForageProvider.getItem("FC:USER:INTERESTS", (err, val) => {
      const parsed = JSON.parse(val as string) || {};
      setUserInterest(Object.keys(parsed).filter((key) => parsed[key] === true));
    });
  }, []);

  useEffect(() => {
    const search = location.search;
    const searchCatg = new URLSearchParams(search).get("category");
    searchCatg && setSelectedCategory(decodeURIComponent(searchCatg.trim()));
  }, [location]);

  useEffect(() => {
    const fetchArticles = () => {
      if (articleError) {
        toast.error(articleError);
        dispatch(clearErrors());
      } else if (searchQuery) {
        dispatch(searchArticleByTitle(searchQuery));
      } else if (selectedCategory && selectedCategory !== "All") {
        dispatch(searchArticleByCategory(selectedCategory, page));
      } else if (!selectedCategory && userInterest.length) {
        dispatch(searchRecentArticle(userInterest, page));
      } else if (!userInterest || userInterest.length === 0) {
        dispatch(
          searchRecentArticle(
            ["Tech", "Personal Dev", "Finance", "Food", "Music"],
            page
          )
        );
      }
    };
    if (searchQuery || selectedCategory || userInterest.length) {
      isOnline() && fetchArticles();
    }
  }, [
    location,
    selectedCategory,
    searchQuery,
    articleError,
    page,
    userInterest,
    dispatch,
  ]);

  const optionRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (e: MouseEvent) => {
    if (optionRef.current && !optionRef.current.contains(e.target as Node)) {
      setIsOptionVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      <MetaData title="Blog" />
      <BlogRenderer theme={theme}>
        {trendingArticles.length > 0 && <BannerCarousel theme={theme}>
      <AnimatePresence initial={false}>
        <motion.div 
          key={currentBannerIndex}
          className="banner-slide"
          style={{
            backgroundImage: `url(${trendingArticles[currentBannerIndex].Article.image?.url})`,
          }}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.5 }}
        >
          <div className="banner-content">
            <h2>{trendingArticles[currentBannerIndex].Article.title}</h2>
            <p>{trendingArticles[currentBannerIndex].Article.description?.slice(0, 120)}...</p>
            <button onClick={() => navigate(`/blog/article/${trendingArticles[currentBannerIndex].Article.slug}`)}>Read More</button>
          </div>
        </motion.div>
      </AnimatePresence>
      <button className="banner-nav prev" onClick={prevBanner}><FiChevronLeft /></button>
      <button className="banner-nav next" onClick={nextBanner}><FiChevronRight /></button>
    </BannerCarousel>}

        <div className="blog-header">
          <div
            ref={optionRef}
            className="selected-category"
            title="Categories"
            onClick={toggleOptionVisible}
          >
            <FiFilter className="category-filter-icon" />
            <span>{selectedCategory}</span>
            <motion.div
              animate={{ rotate: optionVisible ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FiChevronDown className="category-chevron-icon" />
            </motion.div>
          </div>

          {selectedCategory !== "All" &&
            !userInterest.includes(selectedCategory) && (
              <motion.button
                title="Add to my interests"
                className="subscribe-btn"
                onClick={handleSubscription}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlus />
                <span>Add</span>
              </motion.button>
            )}
        </div>
        <AnimatePresence>
          {optionVisible && (
            <motion.div
              className="categories-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="categories-menu-options">
                {[
                  "All",
                  "Tech",
                  "Science",
                  "News",
                  "Education",
                  "Personal Dev",
                  "Fiction",
                  "Finance",
                  "Fashion",
                  "Culture",
                  "Food",
                  "History",
                  "Music",
                  "Lifestyle",
                  "Business",
                  "Religion",
                  "Sport",
                  "Movies",
                ]
                  .sort()
                  .map((opt) => (
                    <motion.li
                      key={opt}
                      onClick={() => handleSelectedCategory(opt)}
                      whileHover={{ backgroundColor: theme === 'light' ? "#f0f0f0" : "#2a2a2a" }}
                    >
                      {opt}
                    </motion.li>
                  ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="blog-article-list">
          {!loading && articles?.length === 0 && (
            <span className="no-results">
              No result found for <b>{selectedCategory}</b>
            </span>
          )}
          {articles?.length > 0
            ? articles.map((art: any, i: number) => (
                <VerticalArticleItem
                  _id={art._id}
                  title={art.title}
                  slug={art.slug}
                  image={art.image?.url}
                  caption={art.content}
                  category={art.category}
                  postedBy={art.postedBy}
                  date={art.createdAt}
                  savedBy={art?.savedBy}
                  pinnedBy={art?.pinnedBy}
                  readDuration={art.readDuration}
                  key={i}
                />
              ))
            : loading &&
              Array(12)
                .fill(null)
                .map((_, i) => <VerticalArticleItemSkeletonLoader key={i} />)}
        </div>
      </BlogRenderer>
      <BlogFooter theme={theme}>
        <Paginator
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </BlogFooter>
      <Footer />
    </>
  );
};

export default BlogPage;

const BlogRenderer = styled.div<{ theme: string }>`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  color:#333;


  .blog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    width: 100%;
    height: 60px;
    z-index: 99;
    backdrop-filter: blur(10px);
    background-color:#338AA5;
    transition: 0.3s;
    color:#fff;
  }

  .selected-category {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    span{
        color:#fff;
    }


    .category-filter-icon,
    .category-chevron-icon {
      margin-right: 8px;
      stroke:#fff;
    }
  }

  .categories-menu {
    position: absolute;
    z-index: 999;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color:#fff;
    top: 20%;
    left: 20px;
    max-height: 300px;
    overflow-y: auto;
    max-width: 200px;
  }

  .categories-menu-options {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .categories-menu ul li {
    padding: 12px 15px;
    transition: 0.2s ease-out;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      color: #f0f0f0;
    }
  }

  .subscribe-btn {
    display: flex;
    align-items: center;
    background-color: #007bff;
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;
    transition: 0.2s;

    svg {
      margin-right: 5px;
    }
  }

  .blog-article-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
  }

  .no-results {
    grid-column: 1 / -1;
    text-align: center;
    font-size: 18px;
    color:#b0b0b0;
    margin-top: 40px;
  }

  @media (max-width: 768px) {
    .blog-header {
      padding: 15px;
    }

    .categories-menu {
      left: 15px;
      width: calc(100% - 30px);
    }

    .blog-article-list {
      grid-template-columns: 1fr;
      padding: 15px;
    }
  }
`;

const BannerCarousel = styled.div<{ theme: string }>`
  width: 100%;
  height: 400px;
  position: relative;
  overflow: hidden;

  .banner-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .banner-slide {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .banner-content {
    text-align: center;
    color: white;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 10px;
    max-width: 80%;

    h2 {
      color: #ccc;
      font-size: 28px;
      margin-bottom: 10px;
      font-weight: 700;
    }

    p {
      color: #ccc;
      font-size: 18px;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    button {
      padding: 10px 20px;
      font-size: 14px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 16px;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.2s;

      &:hover {
        background-color: #0056b3;
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  .banner-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(51, 138, 165, 0.7);
    color: white;
    border: none;
    font-size: 24px;
    padding: 15px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    border-radius: 50%;

    &:hover {
      background-color: rgba(51, 138, 165, 1);
      transform: translateY(-50%) scale(1.1);
    }

    &:active {
      transform: translateY(-50%) scale(1);
    }

    &.prev {
      left: 20px;
    }

    &.next {
      right: 20px;
    }
  }

  @media (max-width: 768px) {
    height: 300px;

    .banner-content {
      h2 {
        font-size: 22px;
      }

      p {
        font-size: 13px;
      }

      button {
        font-size: 16px;
        padding: 10px 20px;
      }
    }

    .banner-nav {
      font-size: 20px;
      padding: 12px;
    }
  }
`;

const BlogFooter = styled.div<{ theme: string }>`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px 0;
`;