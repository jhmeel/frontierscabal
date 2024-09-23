<<<<<<< HEAD
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  IconBookmark,
  IconBxEditAlt,
  IconBxsBookmark,
  IconDeleteForeverOutline,
  IconDotsHorizontal,
  IconPin,
  IconPinOff,
  IconShareForwardFill,
} from "../../assets/icons";
import { Link } from "react-router-dom";
import img from "../../assets/images/group_study.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import getToken from "../../utils/getToken";
import emptyAvatar from "../../assets/images/empty_avatar.png";
import RDotLoader from "../loaders/RDotLoader";
import { errorParser, removeHtmlAndHashTags } from "../../utils/formatter";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { RootState } from "../../store";
const HorizontalArticleItem = ({
=======
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { enqueueSnackbar, closeSnackbar } from "notistack";
import { FaBookmark, FaRegBookmark, FaEllipsisH, FaEdit, FaPen, FaUnlink, FaShareAlt, FaTrash } from "react-icons/fa";

import axiosInstance from "../../utils/axiosInstance";
import getToken from "../../utils/getToken";
import { errorParser, removeHtmlAndHashTags } from "../../utils/formatter";
import RDotLoader from "../loaders/RDotLoader";
import { RootState } from "../../store";

import defaultImage from "../../assets/images/group_study.svg";
import emptyAvatar from "../../assets/images/empty_avatar.png";

interface HorizontalArticleItemProps {
  id: string;
  title: string;
  slug: string;
  image: string;
  caption: string;
  postedBy: any;
  category: string;
  savedBy: string[];
  readDuration: string;
  pinnedBy: string[];
  onProfile?: boolean;
}

const HorizontalArticleItem: React.FC<HorizontalArticleItemProps> = ({
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
  id,
  title,
  slug,
  image,
  caption,
  postedBy,
  category,
<<<<<<< HEAD
  readDuration,
  savedBy,
  pinnedBy,
  onProfile = false,
}:{
  id:string;
  title:string;
  slug:string;
  image:string;
  caption:string;
  postedBy?:any;
  category:string;
  savedBy?:any;
  readDuration:string;
  pinnedBy?:any;
  onProfile?:boolean;
=======
  savedBy,
  readDuration,
  pinnedBy,
  onProfile = false,
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSaved, setIsSaved] = useState(false);
<<<<<<< HEAD
  const [allSavedBy, setAllSavedBy] = useState(savedBy);
  const [isPinned, setIsPinned] = useState(false);
  const [allPinned, setAllPinned] = useState(pinnedBy);
  const [isOpened, setIsopen] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user } = useSelector((state:RootState) => state.user);

  const toggleMenu = () => {
    setIsopen(!isOpened);
  };

  useEffect(() => {
    setIsSaved(allSavedBy?.some((id) => id === user?._id));
  }, [allSavedBy]);

  useEffect(() => {
    setIsPinned(allPinned?.some((id) => id === user?._id));
  }, [allPinned]);
=======
  const [isPinned, setIsPinned] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsSaved(savedBy?.some((id) => id === user?._id));
    setIsPinned(pinnedBy?.some((id) => id === user?._id));
  }, [savedBy, pinnedBy, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e

  const handleBookmarkToggle = async () => {
    try {
      const authToken = await getToken();
      if (!authToken) {
        showAuthDialogue();
        return;
      }
      setBookmarkLoading(true);
<<<<<<< HEAD
      const { data } = await axiosInstance(authToken).get(
        `/api/v1/article/bookmark/${id}`
      );

      if (data.success) {
        setBookmarkLoading(false);
=======
      const { data } = await axiosInstance(authToken).get(`/api/v1/article/bookmark/${id}`);

      if (data.success) {
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
        setIsSaved(!isSaved);
        toast.success(`${title} ${data.message}`);
      }
    } catch (error) {
<<<<<<< HEAD
      setBookmarkLoading(false);
      toast.error(errorParser(error));
=======
      toast.error(errorParser(error));
    } finally {
      setBookmarkLoading(false);
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
    }
  };

  const handleShare = async () => {
    const imgBlob = await fetch(image).then((r) => r.blob());
    if (navigator.share) {
      navigator.share({
        title: title,
        text: removeHtmlAndHashTags(caption),
        url: `https://${window.location.host}/#/blog/article/${slug}`,
        files: [new File([imgBlob], "file.png", { type: imgBlob.type })],
      });
    }
  };
<<<<<<< HEAD
=======

>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
  const showAuthDialogue = () => {
    enqueueSnackbar("Please signup to complete your action!", {
      variant: "info",
      persist: true,
      action: (key) => (
        <>
<<<<<<< HEAD
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
=======
          <Button onClick={() => { closeSnackbar(); navigate("/signup"); }}>
            Signup
          </Button>
          <Button onClick={() => closeSnackbar()}>
            Cancel
          </Button>
        </>
      ),
    });
  };

>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
  const handlePinAndUnpin = async () => {
    try {
      const authToken = await getToken();
      await axiosInstance(authToken).get(`/api/v1/article/pin/${id}`);
      setIsPinned(!isPinned);
<<<<<<< HEAD
      if (isPinned === false) {
        toast.success("Article pinned!");
      } else {
        toast.success("Article unpinned!");
      }
=======
      toast.success(isPinned ? "Article unpinned!" : "Article pinned!");
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
      window.location.reload();
    } catch (err) {
      toast.error(errorParser(err));
    }
  };

  const handleEdit = () => {
<<<<<<< HEAD
    toggleMenu();
=======
    setIsMenuOpen(false);
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
    navigate(`/blog/article/update/${slug}`);
  };

  const handleDelete = async () => {
    try {
      const authToken = await getToken();
      setDeleteLoading(true);
<<<<<<< HEAD

      const { data } = await axiosInstance(authToken).delete(
        `/api/v1/article/${id}`
      );

      setDeleteLoading(false);

=======
      const { data } = await axiosInstance(authToken).delete(`/api/v1/article/${id}`);
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
      if (data?.success) {
        toast.success("Article deleted successfully!");
      }
    } catch (error) {
<<<<<<< HEAD
      setDeleteLoading(false);
      toast.error(errorParser(error));
    }
  };
  const showConfirmation = () => {
    
=======
      toast.error(errorParser(error));
    } finally {
      setDeleteLoading(false);
    }
  };

  const showConfirmation = () => {
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
    enqueueSnackbar(`Are you sure you want to delete ${title}?`, {
      variant: "info",
      persist: true,
      action: (key) => (
        <>
<<<<<<< HEAD
          <button className="snackbar-btn" onClick={() => handleDelete()}>
            Proceed
          </button>
          <button className="snackbar-btn" onClick={() => closeSnackbar()}>
            No
          </button>
=======
          <Button onClick={handleDelete}>Proceed</Button>
          <Button onClick={() => closeSnackbar()}>Cancel</Button>
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
        </>
      ),
    });
  };
<<<<<<< HEAD
  
  const handleCategoryClick = () => {
    navigate({
      pathname: "/blog/search",
      search: `?category=${category}`,
    });
  };

  const tabRef = useRef(null);
  const handleClickOutside = (e) => {
    if (tabRef.current && !tabRef.current.contains(e.target)) {
      setIsopen(false);
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
        <HorizontalArticleRenderer>
          <span
            title={category}
            className="h-a-category"
            onClick={handleCategoryClick}
          >
            {category}
          </span>
          <div className="h-article-img">
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
          <div className="h-a-content">
            {onProfile ? (
              <>
                <span onClick={toggleMenu} ref={tabRef}>
                  <IconDotsHorizontal className="h-a-p-dot-icon" />
                </span>
                {isOpened && (
                  <div className="h-a-p-menu">
                    <ul className="h-a-p-menu-items">
                      {user?.username === postedBy?.username && (
                        <li title="Edit" onClick={handleEdit}>
                          <IconBxEditAlt className="h-a-p-menu-icon" />
                          Edit
                        </li>
                      )}
                      {user?.username === postedBy?.username && (
                        <li
                          title={isPinned ? "Unpin" : "Pin"}
                          onClick={handlePinAndUnpin}
                        >
                          {isPinned ? (
                            <IconPinOff className="h-a-p-menu-icon" />
                          ) : (
                            <IconPin className="h-a-p-menu-icon" />
                          )}
                          {isPinned ? "Unpin" : "Pin"}
                        </li>
                      )}

                      <li title="Share" onClick={handleShare}>
                        <IconShareForwardFill className="h-a-p-menu-icon" />
                        Share
                      </li>
                      {(user?.username === postedBy?.username ||
                        user?.role === "FC:SUPER:ADMIN") && (
                        <li title="Delete" onClick={showConfirmation}>
                          {deleteLoading ? (
                            <RDotLoader />
                          ) : (
                            <IconDeleteForeverOutline className="h-a-p-menu-icon" />
                          )}
                          Delete
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <span
                title={!isSaved ? "Save" : "Unsave"}
                onClick={handleBookmarkToggle}
                className="h-a-save-icon"
              >
                {bookmarkLoading ? (
                  <RDotLoader />
                ) : (
                  (!isSaved && <IconBookmark height="16px" width="16px" />) || (
                    <IconBxsBookmark height="18px" width="18px" />
                  )
                )}
              </span>
            )}
            <Link to={`/blog/article/${slug}`}>
              <div className="h-a-title">
                {title?.length > 35 ? `${title.slice(0, 40)}...` : title}
              </div>
            </Link>
            <div
              className="h-a-caption"
              dangerouslySetInnerHTML={{
                __html: removeHtmlAndHashTags(`${caption?.slice(0, 120)}...`),
              }}
            />

            <div className="h-a-meta">
              <div className="h-a-postedBy">
                <img
                  draggable={false}
                  loading="lazy"
                  src={postedBy?.avatar?.url || emptyAvatar}
                  alt={postedBy?.username}
                />
                <Link to={`/profile/${postedBy?.username}`}>
                  <span className="h-a-postedBy-name">
                    {postedBy?.username}
                  </span>
                </Link>
              </div>
              <span className="h-a-read-dur">
                {readDuration === "less than a minute read"
                  ? "1 min read"
                  : readDuration}
              </span>
            </div>
          </div>
        </HorizontalArticleRenderer>
    </>
=======

  return (
    <ArticleCard
      as={motion.div}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <CategoryBadge onClick={() => navigate(`/blog/search?category=${category}`)}>
        {category}
      </CategoryBadge>
      <ImageContainer>
        <Link to={`/blog/article/${slug}`}>
          <ArticleImage src={image || defaultImage} alt={title} />
        </Link>
      </ImageContainer>
      <ContentContainer>
        {onProfile ? (
          <MenuContainer ref={menuRef}>
            <MenuIcon onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <FaEllipsisH size={20} />
            </MenuIcon>
            <AnimatePresence>
              {isMenuOpen && (
                <Menu
                  as={motion.div}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {user?.username === postedBy?.username && (
                    <MenuItem onClick={handleEdit}>
                      <FaEdit /> Edit
                    </MenuItem>
                  )}
                  {user?.username === postedBy?.username && (
                    <MenuItem onClick={handlePinAndUnpin}>
                      {isPinned ? <FaUnlink /> : <FaPen />} {isPinned ? "Unpin" : "Pin"}
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleShare}>
                    <FaShareAlt /> Share
                  </MenuItem>
                  {(user?.username === postedBy?.username || user?.role === "FC:SUPER:ADMIN") && (
                    <MenuItem onClick={showConfirmation}>
                      {deleteLoading ? <RDotLoader /> : <FaTrash />} Delete
                    </MenuItem>
                  )}
                </Menu>
              )}
            </AnimatePresence>
          </MenuContainer>
        ) : (
          <BookmarkIcon onClick={handleBookmarkToggle}>
            {bookmarkLoading ? (
              <RDotLoader />
            ) : isSaved ? (
              <FaBookmark size={20}/>
            ) : (
              <FaRegBookmark size={20}/>
            )}
          </BookmarkIcon>
        )}
        <Link to={`/blog/article/${slug}`}>
          <Title>{title?.length > 60 ? `${title.slice(0, 60)}...` : title}</Title>
        </Link>
        <Caption dangerouslySetInnerHTML={{ __html: removeHtmlAndHashTags(`${caption?.slice(0, 120)}...`) }} />
        <MetaContainer>
          <AuthorInfo>
            <AuthorAvatar src={postedBy?.avatar?.url || emptyAvatar} alt={postedBy?.username} />
            <AuthorName to={`/profile/${postedBy?.username}`}>
              {postedBy?.username}
            </AuthorName>
          </AuthorInfo>
          <ReadDuration>
            {readDuration === "less than a minute read" ? "1 min read" : readDuration}
          </ReadDuration>
        </MetaContainer>
      </ContentContainer>
    </ArticleCard>
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
  );
};

export default HorizontalArticleItem;

<<<<<<< HEAD
const HorizontalArticleRenderer = styled.div`
  height: 250px;
  padding: 4px;
  width: 100%;
  max-width: 544px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid #ededed;
  margin: 0 auto;
  position: relative;
  border-radius: 8px;
  transition: 0.3s ease-out;
  background-color: #fff;
  overflow: hidden;

  .h-a-container:hover {
    transform: scale(1.01);
  }

  .h-article-img {
    cursor: pointer;
    flex: 30%;
    width: 100%;
    height: 100%;
    padding: 20px 0px 20px 0px;
  }

  .h-article-img img {
    border-radius: 5px;
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
  }

  .h-a-content {
    flex: 70%;
    padding: 8px 16px;
    display: flex;
    overflow: hidden;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
  }
  .h-a-p-menu {
    position: absolute;
    height: fit-content;
    width: fit-content;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: #fff;
    z-index: 99;
    right: 25px;
    top: 15px;
  }

  .h-a-p-menu .h-a-p-menu-items li {
    border-bottom: 0.1px solid #ccc;
    padding: 5px 10px;
    transition: 0.3s ease-in-out;
    color: #000;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }

  .h-a-p-menu .h-a-p-menu-items li:hover {
    background-color: #176984;
    color: #fff;
  }
  .h-a-p-menu .h-a-p-menu-items li:first-child:hover {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .h-a-p-menu .h-a-p-menu-items li:last-child:hover {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .h-a-p-menu .h-a-p-menu-items li:last-child {
    border-bottom: none;
  }

  .h-a-p-menu-icon {
    height: 20px;
    width: 20px;
    fill: black;
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

  .h-a-title {
    font-size: 22px;
    font-weight: 700;
    padding: 2px 3px;
    color: rgb(0, 0, 0);
  }

  .h-a-caption {
    font-weight: 500;
    color: rgba(117, 117, 117, 1);
    padding: 8px 16px;
    max-width: none;
    font-size: 14px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    flex: 40%;
    max-height: 45%;
    min-height: 45%;
  }

  .h-a-meta {
    display: flex;
    flex: 20%;
    max-height: 20%;
    min-height: 20%;
    flex-direction: row;
    justify-content: space-between;
    font-size: 12px;
    position: relative;
    top: 10px;
  }
  .h-a-postedBy {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .h-a-postedBy img {
    object-fit: cover;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #ededed;
  }
  .h-a-postedBy-name {
    color: #000;
    font-weight: 500;
    font-size: 12px;
    margin-left: 5px;
    font-family: Arial, Helvetica, sans-serif;
  }

  .h-a-save-icon {
    cursor: pointer;
    position: absolute;
    top: 5px;
    right: 10px;
  }
  .h-a-p-dot-icon {
    cursor: pointer;
    position: absolute;
    top: 10px;
    height: 20px;
    width: 20px;
    right: 8px;
  }
  .date,
  .h-a-read-dur {
    margin-left: 0px;
    margin-top: 22px;
    color: #000;
    font-weight: 500;
    font-size: 12px;
  }

  .h-a-category {
    position: absolute;
    left: 0px;
    font-size: 12px;
    top: 54%;
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
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    transform: 0.5s;
    padding: 2px 3px;
    cursor: pointer;
  }

  @media (max-width: 767px) {
    .h-a-title {
      font-size: medium;
    }
    .h-a-caption {
      font-size: small;
    }
    .date,
    .h-a-read-dur {
      font-size: 10px;
    }
    .h-a-container {
      height: 250px;
    }
  }


`;
=======
const ArticleCard = styled.div`
  display: flex;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  height: 220px;
  margin-top:5px;
  position: relative;
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: clamp(0.7rem, 1vw, 0.75rem);
  z-index: 1;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  flex: 0 0 40%;
  overflow: hidden;
`;

const ArticleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`;

const Caption = styled.p`
  font-size: clamp(0.75rem, 1.5vw, 0.9rem);
  color: #666;
  font-weight:500;
  margin-bottom: 16px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const MetaContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
`;

const AuthorName = styled(Link)`
  font-size: clamp(0.75rem, 1.2vw, 0.9rem);
  color: #333;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ReadDuration = styled.span`
  font-size: clamp(0.5rem, 1vw, 0.75rem);
  color: #666;
`;

const BookmarkIcon = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  color: #176984;
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`;

const MenuIcon = styled.div`
  cursor: pointer;
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  color: #333;
`;

const Menu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const MenuItem = styled.div`
  padding: 8px 16px;
  font-size: clamp(0.75rem, 1.2vw, 0.9rem);
  color: #333;
  cursor: pointer;
  display: flex;
  font-weight:500;
  align-items: center;

  &:hover {
    background-color: #f5f5f5;
  }

  svg {
    margin-right: 8px;
  }
`;

const Button = styled.button`
  background-color: #176984;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: clamp(0.875rem, 1.2vw, 1rem);
  margin-right: 8px;

  &:hover {
    background-color: #124e63;
  }
`;
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
