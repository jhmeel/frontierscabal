import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  FaBookmark,
  FaRegBookmark,
  FaEdit,
  FaShareAlt,
  FaTrash,
} from "react-icons/fa";

import axiosInstance from "../../utils/axiosInstance";
import getToken from "../../utils/getToken";
import { errorParser, removeHtmlAndHashTags } from "../../utils/formatter";
import RDotLoader from "../loaders/RDotLoader";
import { RootState } from "../../store";

import defaultImage from "../../assets/images/group_study.svg";
import emptyAvatar from "../../assets/images/empty_avatar.png";
import { MoreVert } from "@mui/icons-material";
import { Button } from "@mui/material";

const HorizontalArticleItem = ({
  id,
  title,
  slug,
  image,
  caption,
  postedBy,
  category,
  savedBy = [],
  readDuration,
  pinnedBy = [],
  onProfile = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSaved, setIsSaved] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user } = useSelector((state:RootState) => state.user);

  const menuRef = useRef(null);

  useEffect(() => {
    setIsSaved(savedBy.includes(user?._id));
    setIsPinned(pinnedBy.includes(user?._id));
  }, [savedBy, pinnedBy, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
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
      const { data } = await axiosInstance(authToken).get(
        `/api/v1/article/bookmark/${id}`
      );
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
    const imgBlob = await fetch(image).then((res) => res.blob());
    if (navigator.share) {
      navigator.share({
        title,
        text: removeHtmlAndHashTags(caption),
        url: `https://${window.location.host}/#/blog/article/${slug}`,
        files: [new File([imgBlob], "image.png", { type: imgBlob.type })],
      });
    }
  };

  const showAuthDialogue = () => {
    toast((t) => (
      <div>
        <p>Please signup to complete your action!</p>
        <Button
          onClick={() => {
            toast.dismiss(t.id);
            navigate("/signup");
          }}
          color="primary"
        >
          Signup
        </Button>
        <Button onClick={() => toast.dismiss(t.id)}>Cancel</Button>
      </div>
    ));
  };

  const handlePinToggle = async () => {
    try {
      const authToken = await getToken();
      await axiosInstance(authToken).get(`/api/v1/article/pin/${id}`);
      setIsPinned(!isPinned);
      toast.success(isPinned ? "Article unpinned!" : "Article pinned!");
    } catch (error) {
      toast.error(errorParser(error));
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
      const { data } = await axiosInstance(authToken).delete(
        `/api/v1/article/${id}`
      );
      if (data?.success) {
        toast.success("Article deleted successfully!");
      }
    } catch (error) {
      toast.error(errorParser(error));
    } finally {
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirmation = () => {
    toast((t) => (
      <div>
        <p>{`Are you sure you want to delete ${title}?`}</p>
        <Button
          onClick={() => {
            toast.dismiss(t.id);
            handleDelete();
          }}
          color="primary"
        >
          Proceed
        </Button>
        <Button onClick={() => toast.dismiss(t.id)}>Cancel</Button>
      </div>
    ));
  };

  return (
    <Card as={motion.div} whileHover={{ scale: 1.02 }}>
      <Badge onClick={() => navigate(`/blog/search?category=${category}`)}>
        {category}
      </Badge>
      <ImageWrapper>
        <Link to={`/blog/article/${slug}`}>
          <Image src={image || defaultImage} alt={title} />
        </Link>
      </ImageWrapper>
      <Content>
        {onProfile ? (
          <MenuWrapper ref={menuRef}>
            <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <MoreVert />
            </MenuButton>
            <AnimatePresence>
              {isMenuOpen && (
                <DropdownMenu
                  as={motion.div}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {user?.username === postedBy?.username && (
                    <DropdownItem onClick={handleEdit}>
                      <FaEdit /> Edit
                    </DropdownItem>
                  )}
                  <DropdownItem onClick={handleShare}>
                    <FaShareAlt /> Share
                  </DropdownItem>
                  {(user?.username === postedBy?.username ||
                    user?.role === "FC:SUPER:ADMIN") && (
                    <DropdownItem onClick={showDeleteConfirmation}>
                      {deleteLoading ? <RDotLoader /> : <FaTrash />} Delete
                    </DropdownItem>
                  )}
                </DropdownMenu>
              )}
            </AnimatePresence>
          </MenuWrapper>
        ) : (
          <Bookmark onClick={handleBookmarkToggle}>
            {bookmarkLoading ? (
              <RDotLoader />
            ) : isSaved ? (
              <FaBookmark />
            ) : (
              <FaRegBookmark />
            )}
          </Bookmark>
        )}
        <Link to={`/blog/article/${slug}`}>
          <Title>
            {title?.length > 60 ? `${title.slice(0, 60)}...` : title}
          </Title>
        </Link>
        <Description
          dangerouslySetInnerHTML={{
            __html: removeHtmlAndHashTags(`${caption?.slice(0, 120)}...`),
          }}
        />
        <Metadata>
          <Author>
            <Avatar
              src={postedBy?.avatar?.url || emptyAvatar}
              alt={postedBy?.username}
            />
            <Username to={`/profile/${postedBy?.username}`}>
              {postedBy?.username}
            </Username>
          </Author>
          <Duration>
            {readDuration === "less than a minute read"
              ? "1 min read"
              : readDuration}
          </Duration>
        </Metadata>
      </Content>
    </Card>
  );
};

export default HorizontalArticleItem;

const Card = styled.div`
  display: flex;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #ededed;
  max-width: 600px;
  width: 100%;
  height: 220px;
  margin-top: 5px;
  position: relative;
`;

const Badge = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  z-index: 1;
  cursor: pointer;
`;

const ImageWrapper = styled.div`
  flex: 0 0 40%;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
  margin-bottom: 16px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const Metadata = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Username = styled(Link)`
  font-size: 0.8rem;
  color: #333;
  font-weight: 600;
`;

const Duration = styled.span`
  font-size: 0.6rem;
  color: #999;
`;

const Bookmark = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
`;

const MenuWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 10;
  width: 200px;
`;

const DropdownItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.9rem;

  &:hover {
    background: #f8f8f8;
  }

  svg {
    margin-right: 8px;
  }
`;
