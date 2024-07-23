import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getArticleDetails,
  searchArticleByCategory,
  clearErrors,
  likeArticle,
} from "../../actions/article";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  LIKE_UNLIKE_ARTICLE_RESET,
  NEW_COMMENT_REPLY_RESET,
  NEW_COMMENT_RESET,
} from "../../constants/article";
import {
  IconBxEditAlt,
  IconBxsCommentDetail,
  IconDeleteForeverOutline,
  IconHeartFill,
  IconShare,
} from "../../assets/icons";
import HorizontalArticleItem from "../../components/horizontalArticleItem/HorizontalArticleItem";
import HorizontalArticleItemSkeletonLoader from "../../components/loaders/HorizontalArticleItemSkeletonLoader";
import Footer from "../../components/footer/Footer";
import SpinLoader from "../../components/loaders/SpinLoader";
import Comment from "./Comment";
import getToken from "../../utils/getToken";
import { FormattedCount, errorParser } from "../../utils";
import emptyAvatar from "../../assets/images/empty_avatar.png";
import MetaData from "../../MetaData";
import styled from "styled-components";
import { isOnline } from "../../utils";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import RDotLoader from "../../components/loaders/RDotLoader";
import toast from "react-hot-toast";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { RootState } from "../../store";

const ArticleViewer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFilled, setIsFilled] = useState(false);
  const [allLikes, setAllLikes] = useState([]);
  const [isCommentActive, setIsCommentActive] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>();

  const {
    loading: likeLoading,
    success: likeSuccess,
    message: likeMessage,
    error: likeError,
  } = useSelector((state: RootState) => state.likeArticle);
  const {
    loading: commentLoading,
    success: commentSuccess,
    error: commentError,
  } = useSelector((state: RootState) => state.newComment);
  const {
    loading: detailsLoading,
    article,
    error: detailsError,
  } = useSelector((state: RootState) => state.articleDetails);
  const {
    loading: replyLoading,
    success: replySuccess,
    error: replyError,
  } = useSelector((state: RootState) => state.newCommentReply);
  const {
    loading: searchLoading,
    articles: relatedArticles,
    error: searchError,
    totalPages,
  } = useSelector((state: RootState) => state.articleSearch);

  useEffect(() => {
    if (detailsError) {
      toast.error(detailsError);
      dispatch<any>(clearErrors());
    } else {
      if (params.slug && isOnline()) {
        dispatch<any>(getArticleDetails(params.slug));
        dispatch<any>(searchArticleByCategory(article?.category, 1));
      } else {
        toast.error("Request not sent, retrying...");
        dispatch<any>(clearErrors());
      }
    }
  }, [dispatch, params, toast, detailsError, article?.category, searchError]);
  useEffect(() => {
    setAllLikes(article?.likes);
  }, [article?.likes]);

  useEffect(() => {
    setIsFilled(allLikes?.some((id) => id === user?._id));
  }, [article, allLikes]);

  useEffect(() => {
    if (likeError) {
      toast.error(likeError);
      dispatch<any>(clearErrors());
    } else if (likeSuccess) {
      setIsFilled(!isFilled);
      toast.success(likeMessage);
      dispatch({ type: LIKE_UNLIKE_ARTICLE_RESET });
      window.location.reload();
    } else if (commentError) {
      toast.error(commentError);
      dispatch<any>(clearErrors());
    } else if (commentSuccess) {
      toast.success("comment added");
      dispatch({ type: NEW_COMMENT_RESET });
      window.location.reload();
    } else if (replyError) {
      toast.error("Something went wrong!, try again");
      dispatch<any>(clearErrors());
    } else if (replySuccess) {
      toast.success("reply added");
      dispatch({ type: NEW_COMMENT_REPLY_RESET });
      window.location.reload();
    }
  }, [
    dispatch,
    toast,
    likeError,
    commentError,
    likeSuccess,
    commentSuccess,
    replyError,
    replySuccess,
    article,
    user?.username,
  ]);

  const showAuthDialogue = () => {
    enqueueSnackbar("Please signup to complete your action!", {
      variant: "info",
      persist: true,
      action: (key) => (
        <>
          <button
            className="snackbar-btn"
            onClick={() => {
              closeSnackbar();
              navigate("/signup");
            }}
          >
            Signup
          </button>
          <button className="snackbar-btn" onClick={() => closeSnackbar()}>
            Cancel
          </button>
        </>
      ),
    });
  };
  const handleLike = async () => {
    const authToken = await getToken();
    if (!authToken) {
      showAuthDialogue();
      return;
    }
    isOnline() &&
      !likeLoading &&
      dispatch<any>(likeArticle(authToken, article?._id));

    return () => dispatch<string | any>(LIKE_UNLIKE_ARTICLE_RESET);
  };

  const handleArticleShare = async () => {
    const imgBlob = await fetch(article?.image?.url).then((r) => r.blob());
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.description,
        url: window.location.href,
        files: [new File([imgBlob], "file.png", { type: imgBlob.type })],
      });
    }
  };
  const showConfirmation = () => {
    enqueueSnackbar(`Are you sure you want to Delete ${article?.title}?`, {
      variant: "info",
      persist: true,
      action: (key) => (
        <>
          <button
            className="snackbar-btn"
            onClick={() => handleArticleDelete()}
          >
            Proceed
          </button>
          <button className="snackbar-btn" onClick={() => closeSnackbar()}>
            cancle
          </button>
        </>
      ),
    });
  };

  const handleArticleDelete = async () => {
    try {
      const authToken = await getToken();
      setDeleteLoading(true);

      const { data } = await axiosInstance(authToken).delete(
        `/api/v1/article/${article?._id}`
      );

      setDeleteLoading(false);

      if (data.success) {
        toast.success("Article deleted successfully!");
      }
      navigate("/");
    } catch (error) {
      setDeleteLoading(false);
      toast.error(errorParser(error));
    }
  };

  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const newHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setHeight(newHeight);
      const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
      if (scrollRef.current) {
        (scrollRef.current as HTMLDivElement).style.width = `${
          (scrollTop / newHeight) * 100
        }%`;
      }
    };

    updateScroll();

    window.addEventListener("scroll", updateScroll);

    return () => window.removeEventListener("scroll", updateScroll);
  }, []);
  const randomColor = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return "#" + n.slice(0, 6);
  };

  const handleTagSeartch = (tag: string) => {
    const query = encodeURIComponent(tag.trim());
    navigate({
      pathname: "/search",
      search: `?query=${query}`,
    });
  };
  return (
    <>
      {detailsLoading && <SpinLoader />}
      <MetaData
        title={article?.title}
        description={article?.description}
        img={article?.image?.url}
        url={`https://${window.location.host}/#/blog/article/${article?.slug}`}
      />
      <script type="application/ld+json">
        {`
            {
              "@context":"http://schema.org",
              "@type":"Article",
              "headline":"${article?.title}",
              "datePublished":"${new Date(article?.createdAt)}",
              "author":{
                "@type":"Person",
                "name":"${article?.postedBy?.username}"
              },
              "description":"${article?.description}",
              "url":"${`https://${window.location.host}/#/blog/article/${article?.slug}`}",
              "image":"${article?.image?.url}"
              }
            `}
      </script>
      <ArticleViewerRenderer>
        <div className="art-view-header">
          <div className="art-view-scroll-progress" ref={scrollRef}></div>
          <div className="art-view-image-holder">
            <img
              src={article?.image?.url}
              alt={article?.title}
              loading="lazy"
            />
          </div>
          <div className="art-pub-info">
            <div className="art-posted-by">
              <img
                src={article?.postedBy?.avatar?.url || emptyAvatar}
                loading="lazy"
              />
              <span className="art-view-category">
                {article?.category || "category"}
              </span>
              <div className="art-posted-by-meta">
                <Link to={`/profile/${article?.postedBy?.username}`}>
                  {" "}
                  <span className="art-posted-by-name">
                    {article?.postedBy?.username}
                  </span>
                </Link>
                <span className="art-posted-date">
                  {moment(article?.createdAt).format("MMMM DD, YYYY")}
                </span>
              </div>
            </div>
            <span className="art-pub-read-time">
              {article?.readDuration === "less than a minute read"
                ? "1 min read"
                : article?.readDuration}
            </span>
          </div>
        </div>
        <div className="article-view-content">
          <h1 title="Title" className="art-view-title">
            {article?.title}
          </h1>
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article?.sanitizedHtml }}
          />
          <div className="art-view-tags">
            {article?.tags?.split(",")?.map((tag: string, i: number) => (
              <span
                onClick={() => handleTagSeartch(tag)}
                style={{ border: `1.5px solid ${randomColor()}` }}
                key={i}
                className="tag-item"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </ArticleViewerRenderer>
      <ArticleReactionBar>
        <span
          className="art-viw-like-icon"
          title={isFilled ? "Unlike" : "Like"}
        >
          <IconHeartFill
            className={!isFilled ? "art-view-icon" : "art-view-icon-like"}
            onClick={handleLike}
            fill={isFilled ? "crimson" : "#000"}
          />

          <span>{`${FormattedCount(allLikes?.length)}`}</span>
        </span>
        <span
          className="art-view-comment-icon"
          title="Comment"
          onClick={() => setIsCommentActive(true)}
        >
          <IconBxsCommentDetail className="art-view-icon" fill="#000" />
          <span>
            {article?.comments.length > 99 ? "99+" : article?.comments.length}
          </span>
        </span>
        {article?.postedBy?.username === user?.username && (
          <Link to={`/blog/article/update/${article?.slug}`}>
            <span title="Edit">
              <IconBxEditAlt className="art-view-icon" fill="#000" />
            </span>
          </Link>
        )}

        <span title="Share">
          <IconShare
            className="art-view-icon"
            onClick={handleArticleShare}
            fill="#000"
          />
        </span>
        {article?.postedBy?.username === user?.username && (
          <span title="Delete">
            {deleteLoading ? (
              <RDotLoader />
            ) : (
              <IconDeleteForeverOutline
                className="art-view-icon"
                onClick={showConfirmation}
                fill="#000"
              />
            )}
          </span>
        )}
      </ArticleReactionBar>

      <ArticleViewFooter>
        {relatedArticles?.length > 0 &&
        relatedArticles.filter((art: any) => art?.title !== article?.title)
          ?.length > 0 ? (
          <>
            <h2>You may also like</h2>
            <div className="art-view-more">
              {relatedArticles
                .filter((art: any) => art?.title !== article?.title)
                .map((art: any, i: number) => (
                  <HorizontalArticleItem
                    id={art._id}
                    title={art.title}
                    slug={art.slug}
                    image={art.image?.url}
                    caption={art.sanitizedHtml}
                    category={art.category}
                    postedBy={art.postedBy}
                    readDuration={art.readDuration}
                    pinnedBy={art.pinnedBy}
                    key={i}
                  />
                ))}
            </div>
          </>
        ) : (
          <div className="art-view-more">
            {Array(6)
              .fill(5)
              .map((_, i) => (
                <HorizontalArticleItemSkeletonLoader key={i} />
              ))}
          </div>
        )}
        {isCommentActive && (
          <div className="art-view-comment">
            <Comment
              username={user?.username}
              article={article}
              comments={article?.comments}
              remover={() => setIsCommentActive(false)}
            />
          </div>
        )}
      </ArticleViewFooter>
      <Footer />
    </>
  );
};

export default ArticleViewer;
const ArticleViewerRenderer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;

  .art-view-header {
    width: 100%;
    min-height: 300px;
    max-height: 400px;
    display: flex;
    flex-direction: column;
  }
  .art-view-scroll-progress {
    position: fixed;
    top: 0;
    width: 0%;
    height: 4px;
    background-color: #7983ff;
    z-index: 999999;
  }
  .art-view-image-holder {
    width: 100%;
    height: 300px;
    border-bottom: 1px solid #ededed;
    position: relative;
  }
  .art-view-image-holder img {
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
    cursor: pointer;
  }
  .art-view-category {
    position: absolute;
    top: 45%;
    left: 0;
    color: #176984;
    font-size: 14px;
    font-weight: 600;
    padding: 5px;
    z-index: 99;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    -moz-backdrop-filter: blur(10px);
    -o-backdrop-filter: blur(10px);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    transform: 0.5s;
    cursor: pointer;
  }

  .art-pub-info {
    width: 100%;
    padding: 5px 20px;
    display: flex;
    flex-direction: row;
    gap: 15px;
    align-items: center;
    justify-content: space-between;
  }

  .art-posted-by img {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    cursor: pointer;
  }

  .art-posted-by-meta {
    display: flex;
    flex-direction: row;
  }
  .art-pub-read-time {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    font-size: 12px;
    color: #000;
  }
  .art-posted-by-name {
    font-size: 14px;
    color: gray;
    position: relative;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }
  .art-posted-by-name::after {
    content: "—";
    color: gray;
    margin: 3px;
  }
  .art-posted-date {
    position: relative;
    top: 4px;
    font-size: 12px;
    color: gray;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  .art-view-title {
    font-size: 3rem;
    font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 700;
    padding: 5px;
    word-wrap: break-word;
  }
  .article-view-content {
    width: 100%;
    position: relative;
    padding: 10px 5px;
    margin-top: 5px;
  }
  .art-content {
    width: inherit;
    line-height: 28px;
  }
  .art-view-tags {
    height: fit-content;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    padding: 10px;
  }
  .art-view-tags:hover .tag-item:not(:hover) {
    opacity: 0.5;
  }
  .tag-item {
    width: fit-content;
    height: fit-content;
    font-size: 14px;
    border-radius: 25px;
    cursor: pointer;
    padding: 5px 10px;
    background-color: transparent;
    color: rgb(43, 41, 41);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 3px;
    transition: opacity 0.3s ease-in;
  }

  .tag-item:hover {
    background-color: transparent;
    color: rgb(43, 41, 41);
  }
  @media (max-width: 767px) {
    .art-view-category {
      top: 30%;
    }
    .art-view-title {
      font-size: 1.6rem;
    }
    .art-view-icon,
    .art-view-icon-like {
      height: 18px;
      width: 18px;
    }
    .art-view-header {
      max-height: 350px;
    }
  }
`;
const ArticleReactionBar = styled.div`
  width: fit-content;
  padding: 10px 20px;
  background-color: #000000;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  z-index: 995;

  @media (max-width: 767px) {
    .art-view-category {
      top: 30%;
    }
    .art-view-title {
      font-size: 1.6rem;
    }
    .art-view-icon,
    .art-view-icon-like {
      height: 18px;
      width: 18px;
    }
    .art-view-header {
      max-height: 350px;
    }
  }
  span {
    cursor: pointer;
  }

  .art-view-icon {
    height: 24px;
    width: 24px;
    position: relative;
    fill: rgb(148, 146, 146);
  }
  .art-view-icon-like {
    height: 22px;
    width: 22px;
    animation: like 0.5s linear;
    position: relative;
  }
  .art-viw-like-icon span {
    content: "";
    position: absolute;
    width: 20px;
    max-width: 22px;
    height: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    color: #ccc;
    top: 30px;
    left: 20px;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
      "Lucida Sans", Arial, sans-serif;
  }
  .art-view-comment-icon {
    position: relative;
  }
  .art-view-comment-icon span {
    content: "";
    position: absolute;
    height: 18px;
    width: 18px;
    border-radius: 50%;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: crimson;
    text-align: center;
    color: #fff;
    top: -5px;
    left: 8px;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
      "Lucida Sans", Arial, sans-serif;
  }

  @keyframes like {
    0% {
      transform: scale(0.2);
      opacity: 0.7;
    }
    25% {
      transform: scale(0.6);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.04);
      opacity: 0.9;
    }
    100% {
      transform: scale(0.4);
      opacity: 1;
    }
  }

  @-moz-keyframes splash-12 {
    40% {
      background: crimson;
      box-shadow: 0 -18px 0 -8px crimson, 16px -8px 0 -8px crimson,
        16px 8px 0 -8px crimson, 0 18px 0 -8px crimson, -16px 8px 0 -8px crimson,
        -16px -8px 0 -8px crimson;
    }

    100% {
      background: crimson;
      box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent,
        32px 16px 0 -10px transparent, 0 36px 0 -10px transparent,
        -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
  }

  @-webkit-keyframes splash-12 {
    40% {
      background: crimson;
      box-shadow: 0 -18px 0 -8px crimson, 16px -8px 0 -8px crimson,
        16px 8px 0 -8px crimson, 0 18px 0 -8px crimson, -16px 8px 0 -8px crimson,
        -16px -8px 0 -8px crimson;
    }

    100% {
      background: crimson;
      box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent,
        32px 16px 0 -10px transparent, 0 36px 0 -10px transparent,
        -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
  }

  @-o-keyframes splash-12 {
    40% {
      background: crimson;
      box-shadow: 0 -18px 0 -8px crimson, 16px -8px 0 -8px crimson,
        16px 8px 0 -8px crimson, 0 18px 0 -8px crimson, -16px 8px 0 -8px crimson,
        -16px -8px 0 -8px crimson;
    }

    100% {
      background: crimson;
      box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent,
        32px 16px 0 -10px transparent, 0 36px 0 -10px transparent,
        -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
  }

  @keyframes splash-12 {
    40% {
      background: crimson;
      box-shadow: 0 -18px 0 -8px crimson, 16px -8px 0 -8px crimson,
        16px 8px 0 -8px crimson, 0 18px 0 -8px crimson, -16px 8px 0 -8px crimson,
        -16px -8px 0 -8px crimson;
    }

    100% {
      background: crimson;
      box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent,
        32px 16px 0 -10px transparent, 0 36px 0 -10px transparent,
        -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
  }
`;
const ArticleViewFooter = styled.div`
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding: 5px;

  .art-view-more {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
    flex-wrap: wrap;
    border-top: 1px solid #ededed;
    padding-top: 5px;
    gap: 10px;
  }
  .art-view-comment {
    position: fixed;
    width: 100%;
    height: fit-content;
    bottom: 0;
    left: 0;
    z-index: 999;
  }

  .toast-btn {
    padding: 6px 12px;
    color: #000;
    border: none;
    border-radius: 5px;
    margin-right: 5px;
    cursor: pointer;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
`;
