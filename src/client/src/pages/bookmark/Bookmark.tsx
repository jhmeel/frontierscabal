import React, { useState, useEffect } from "react";
import Footer from "../../components/footer/Footer";
import MetaData from "../../MetaData";
import VerticalArticleItem from "../../components/verticalArticleItem/VerticalArticleItem";
import { useDispatch, useSelector } from "react-redux";
import Paginator from "../../components/paginator/Paginator";
import { getBookmarkedArticle, clearErrors } from "../../actions/article";
import getToken from "../../utils/getToken";
import { isOnline } from "../../utils";
import VerticalArticleItemSkeletonLoader from "../../components/loaders/VerticalArticleItemSkeletonLoader";
import toast from "react-hot-toast";
import styled from "styled-components";
import { ARTICLE } from "../../types";
import { RootState } from "../../store";


const BookmarksPage = () => {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const handlePageChange = () => {
    setPage((prev) => prev + 1);
  };
  const { user } = useSelector((state:RootState) => state.user);
  const {
    error: articleError,
    totalPages,
    articles,
    loading,
  }: {
    error: string;
    totalPages: number;
    articles: ARTICLE[];
    loading: boolean;
  } = useSelector((state:RootState) => state.articleSearch);

  useEffect(() => {
    if (articleError) {
      toast.error(articleError);
      dispatch<any>(clearErrors());
    }
    const getBookmarks = async () => {
      const authToken = await getToken();
      dispatch<any>(getBookmarkedArticle(authToken, page));
    };
    isOnline() && getBookmarks();
  }, [page, articleError, dispatch]);
  return (
    <>
      <MetaData title="Bookmarks" />
      <main>
        <BookmarkRenderer>
          {articles?.length
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
                  readDuration={art?.readDuration}
                  key={i}
                />
              ))
            : loading || !loading
            ? Array(12)
                .fill(null)
                .map((_, i) => <VerticalArticleItemSkeletonLoader key={i} />)
            : loading &&
              articles?.length == 0 && <span>No Bookmark found!</span>}
        </BookmarkRenderer>
        {articles && (
          <BookmarkFooter>
            <Paginator
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </BookmarkFooter>
        )}
        <Footer />
      </main>
    </>
  );
};

export default BookmarksPage;
const BookmarkRenderer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  max-width: 100%;
  min-height: 100vh;
  padding: 5px 10px;
  @media (max-width: 767px) {
    & {
      justify-content: center;
    }
  }
`;
const BookmarkFooter = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
