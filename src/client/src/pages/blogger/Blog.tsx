import React, { useState, useEffect, useRef, useCallback } from "react";
import { IconAddOutline, IconFilter } from "../../assets/icons";
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
import styled, { ThemeProvider } from "styled-components";
import { isOnline } from "../../utils";
import VerticalArticleItemSkeletonLoader from "../../components/loaders/VerticalArticleItemSkeletonLoader";
import LocalForageProvider from "../../utils/localforage";
import toast from "react-hot-toast";
import { RootState } from "../../store";

const BlogPage: React.FC = (): React.ReactElement => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [optionVisible, setIsOptionVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [userInterest, setUserInterest] = useState([]);
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
  const handlePageChange = () => {
    setPage((prev) => prev + 1);
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
  }, [selectedCategory, setUserInterest, toast]);

  useEffect(() => {
    LocalForageProvider.getItem("FC:USER:INTERESTS", (err, val) => {
      val = JSON.parse(val as string);
      val &&
        setUserInterest(Object.keys(val).filter((key) => val[key] === true));
    });
  }, []);

  useEffect(() => {
    const search = location.search;
    const searchCatg = new URLSearchParams(search).get("category");
    searchCatg && setSelectedCategory(decodeURIComponent(searchCatg.trim()));
  }, [selectedCategory, location]);

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
    toast,
  ]);

  const optionRef = useRef(null);
  const handleClickOutside = (e) => {
    if (optionRef.current && !optionRef.current.contains(e.target)) {
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
      <BlogRenderer>
        <div className="blog-header">
          <span
            ref={optionRef}
            className="seleccted-catg"
            title="Categories"
            onClick={toggleOptionVisible}
          >
            <IconFilter
              className="catg-filter-icon"
              onClick={toggleOptionVisible}
            />
            &nbsp;&nbsp;
            {selectedCategory}
          </span>

          {selectedCategory !== "All" &&
            !userInterest.includes(selectedCategory) && (
              <button
                title="Add to my interests"
                className="subscribe-to-art-btn"
                onClick={handleSubscription}
              >
                <IconAddOutline fill="#FFF" height="18px" width="15px" />
                Add
              </button>
            )}
        </div>
        {optionVisible && (
          <div className="categories-menu">
            <ul className="categories-menu-options">
              {[
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
                  <li key={opt} onClick={() => handleSelectedCategory(opt)}>
                    {opt}
                  </li>
                ))}
            </ul>
          </div>
        )}

        <div className="blog-article-list">
          {!loading && articles?.length == 0 && (
            <span>
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
      <BlogFooter>
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
const BlogRenderer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;

  .blog-header {
    border-bottom: 1px solid #dedede;
    display: flex;
    position: fixed;
    justify-content: space-between;
    align-items: center;
    padding: 20px 5px 0px 0px;
    width: 100%;
    height: fit-content;
    z-index: 99;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    -moz-backdrop-filter: blur(10px);
    -o-backdrop-filter: blur(10px);
    transform: 0.5s;
  }
  .categories-menu {
    position: fixed;
    z-index: 999;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: #fff;
    top: 15%;
    left: 10px;
    height: 300px;
    overflow-y: scroll;
  }
  .categories-menu ul li {
    border-bottom: 0.5px solid #dedede;
    padding: 5px 10px;
    transition: 0.3s ease-out;
    font-size: 12px;
    border-radius: 3px;
    cursor: pointer;
  }
  .categories-menu ul li:hover {
    background-color: rgb(1, 95, 123);
    color: #fff;
  }

  .seleccted-catg {
    font-size: 16px;
    font-weight: 700;
    color: #000;
    padding: 3px 6px;
    cursor: pointer;
  }

  .catg-filter-icon {
    cursor: pointer;
    height: 20px;
    width: 20px;
  }
  .s-opt-caret-downIcon {
    cursor: pointer;
  }

  .blog-article-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 50px;
    justify-content: space-evenly;
    align-items: center;
    padding: 10px 20px;
  }
  .subscribe-to-art-btn {
    display: flex;
    align-items: center;
    background-color: crimson;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
      "Lucida Sans", Arial, sans-serif;
    margin: 0px 5px 5px 10px;
    font-size: 12px;
  }
`;
const BlogFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

`;
