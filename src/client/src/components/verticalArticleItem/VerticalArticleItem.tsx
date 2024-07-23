import { useEffect, useState } from "react";
import { IconBookmark, IconBxsBookmark, IconPinOff } from "../../assets/icons";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/images/my_answer.svg";
import { useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import emptyAvatar from "../../assets/images/empty_avatar.png";
import getToken from "../../utils/getToken";
import RDotLoader from "../loaders/RDotLoader";
import { errorParser, removeHtmlAndHashTags } from "../../utils/formatter";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { RootState } from "../../store";

const VerticalArticleItem = ({
  _id,
  title,
  slug,
  image,
  caption,
  postedBy,
  date,
  category,
  savedBy,
  readDuration,
  pinnedBy,
  onProfile = false,
}:{
  _id:string;
  title:string;
  slug:string;
  image:string;
  caption:string;
  postedBy?:any;
  date:string;
  category:string;
  savedBy?:any;
  readDuration:string;
  pinnedBy?:any;
  onProfile?:boolean;
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [allPinned, setAllPinned] = useState(pinnedBy);
  const { theme } = useSelector((state: RootState) => state.theme);
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    setIsPinned(allPinned?.some((id: string) => id === user?._id));
  }, [allPinned]);

  useEffect(() => {
    setIsSaved(savedBy?.some((id: string) => id === user?._id));
  }, [savedBy]);

  const handlePinAndUnpin = async () => {
    try {
      const authToken = await getToken();
      await axiosInstance(authToken).get(`/api/v1/article/pin/${_id}`);
      setIsPinned(!isPinned);
      toast.success("Article unpinned!");
      window.location.reload();
    } catch (err) {
      toast.error(errorParser(err));
    }
  };

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
  }

  const handleBookmarkToggle = async () => {
    try {
      const authToken = await getToken();
      if (!authToken) {
        showAuthDialogue();
        return;
      }
      setLoading(true);
      const { data } = await axiosInstance(authToken).get(
        `/api/v1/article/bookmark/${_id}`
      );

      if (data.success) {
        setLoading(false);
        setIsSaved(!isSaved);
        toast.success(`${title} ${data.message}`);
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
    }
  };
  const handleCategoryClick = () => {
    navigate({
      pathname: "/blog/search",
      search: `?category=${category}`,
    });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <VerticalArticleRenderer>
          <span
            title={category}
            className="a-category"
            onClick={handleCategoryClick}
          >
            {category}
          </span>
          <div className="article-img">
            <Link to={`/blog/article/${slug}`}>
              <img
                className=""
                draggable="false"
                loading="lazy"
                src={image || img}
                alt={title && `${title?.slice(0, 5)}...`}
              />
            </Link>
          </div>
          <div className="a-content">
            <Link to={`/blog/article/${slug}`}>
              <div className="a-title">
                {title?.length > 25 ? `${title.slice(0, 25)}...` : title}
              </div>
            </Link>
            <div
              className="a-caption"
              dangerouslySetInnerHTML={{
                __html: removeHtmlAndHashTags(`${caption?.slice(0, 90)}...`),
              }}
            />

            <div className="a-meta">
              <div className="a-postedBy">
                <img
                  draggable={false}
                  loading="lazy"
                  src={postedBy?.avatar?.url || emptyAvatar}
                  alt={postedBy?.username}
                />
                <Link to={`/profile/${postedBy?.username}`}>
                  <span className="a-postedby-name">{postedBy?.username}</span>
                </Link>
              </div>
              <span className="read-dur">
                {readDuration === "less than a minute read"
                  ? "1 min read"
                  : readDuration}
              </span>

              {onProfile === true && user?.username === postedBy?.username ? (
                <span
                  title="Unpin"
                  onClick={handlePinAndUnpin}
                  className="a-pin-icon"
                >
                  {isPinned && <IconPinOff height="20px" width="20px" />}
                </span>
              ) : (
                <span
                  onClick={handleBookmarkToggle}
                  className="a-save-icon"
                  title={!isSaved ? "Save" : "Unsave"}
                >
                  {loading ? (
                    <RDotLoader />
                  ) : (
                    (!isSaved && (
                      <IconBookmark height="16px" width="16px" />
                    )) || <IconBxsBookmark height="18px" width="18px" />
                  )}
                </span>
              )}
            </div>
          </div>
        </VerticalArticleRenderer>
      </ThemeProvider>
    </>
  );
};

export default VerticalArticleItem;
const VerticalArticleRenderer = styled.div`
  height: 450px;
  min-width: 320px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
  margin:10px;
  position: relative;
  border-radius: 8px;
  transition: 0.3s ease-out;
  overflow: hidden;

  .a-container:hover {
    transform: scale(1.02);
  }

  .article-img {
    cursor: pointer;
    flex: 50%;
    max-height: 50%;
    min-height: 50%;
    width: 100%;
  }

  .article-img img {
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
  }

  .a-content {
    flex: 50%;
    padding: 8px;
    display: flex;
    height: 100%;
    overflow: hidden;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    background: linear-gradient(-45deg, #16aebc 0%, #176984 100%);
  }
  .a-title {
    font-size: 20px;
    padding: 2px 3px;
    color: #fff;
    font-weight: 700;
    margin-top: 5px;
  }

  .a-caption {
    font-size: 14px;
    color: rgba(117, 117, 117, 1);
    padding: 5px 8px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .a-meta {
    display: flex;
    margin-top: 40px;
    flex-direction: row;
    justify-content: space-between;
    font-size: 12px;
  }
  .a-postedBy {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .a-postedBy img {
    object-fit: cover;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #ededed;
  }

  .a-save-icon,
  .a-pin-icon {
    cursor: pointer;
    position: absolute;
    top: 5px;
    right: 10px;
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    padding: 5px;
    border-radius:30px;
  }

  .a-postedby-name {
    margin-left: 10px;
    color: #ccc;
    font-size: 11px;
  }

  .date,
  .read-dur {
    margin-left: 10px;
    margin-top: 22px;
    color: #ccc;
    font-size: 11px;
  }

  .a-caption {
    color: #ccc;
    max-width: none;
    font-size: 14px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-transform: capitalize;
    text-align: justify;
  }

  .a-category {
    position: absolute;
    left: 3px;
    font-size: 12px;
    top: 50%;
    font-weight: 600;
    color: #ccc;
    padding-left: 2px;
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
      sans-serif;
    background-color: transparent;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    -moz-backdrop-filter: blur(10px);
    -o-backdrop-filter: blur(10px);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    transform: 0.5s;
    padding: 2px 3px;
    cursor: pointer;
  }

  .snackbar-btn {
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
