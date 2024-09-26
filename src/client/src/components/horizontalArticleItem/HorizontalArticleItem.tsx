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
  readDuration: string;
  savedBy?: string[];
  pinnedBy?: string[];
  onProfile?: boolean;
}

const HorizontalArticleItem: React.FC<HorizontalArticleItemProps> = ({
  id,
  title,
  slug,
  image,
  caption,
  postedBy,
  category,
  savedBy,
  readDuration,
  pinnedBy,
  onProfile = false,
}) => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSaved, setIsSaved] = useState(false);
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

  const handleBookmarkToggle = async () => {
    try {
      const authToken = await getToken();
      if (!authToken) {
        showAuthDialogue();
        return;
      }
      setBookmarkLoading(true);
      const { data } = await axiosInstance(authToken).get(`/api/v1/article/bookmark/${id}`);

      if (data.success) {
        setIsSaved(!isSaved);
        toast.success(`${title} ${data.message}`);
      }
    } catch (error) {
      toast.error(errorParser(error));
    } finally {
      setBookmarkLoading(false);
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
  const showAuthDialogue = () => {
    enqueueSnackbar("Please signup to complete your action!", {
      variant: "info",
      persist: true,
      action: (key) => (
        <>
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

  const handlePinAndUnpin = async () => {
    try {
      const authToken = await getToken();
      await axiosInstance(authToken).get(`/api/v1/article/pin/${id}`);
      setIsPinned(!isPinned);
      toast.success(isPinned ? "Article unpinned!" : "Article pinned!");
      window.location.reload();
    } catch (err) {
      toast.error(errorParser(err));
    }
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    navigate(`/blog/article/update/${slug}`);
  };

  const handleDelete = async () => {
    try {
      const authToken = await getToken();
      setDeleteLoading(true);
      const { data } = await axiosInstance(authToken).delete(`/api/v1/article/${id}`);
      if (data?.success) {
        toast.success("Article deleted successfully!");
      }
    } catch (error) {
      toast.error(errorParser(error));
    } finally {
      setDeleteLoading(false);
    }
  };

  const showConfirmation = () => {
    enqueueSnackbar(`Are you sure you want to delete ${title}?`, {
      variant: "info",
      persist: true,
      action: (key) => (
        <>
          <Button onClick={handleDelete}>Proceed</Button>
          <Button onClick={() => closeSnackbar()}>Cancel</Button>
        </>
      ),
    });
  };

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
  );
};

export default HorizontalArticleItem;

const ArticleCard = styled.div`
  display: flex;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
border:1px solid #ededed;
  max-width: 600px;
  width:100%;
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
