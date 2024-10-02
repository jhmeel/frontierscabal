import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaBookmark, FaUnlink } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { enqueueSnackbar, closeSnackbar } from "notistack";
import { FiBookmark } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";
import getToken from "../../utils/getToken";
import { errorParser, removeHtmlAndHashTags } from "../../utils/formatter";
import RDotLoader from "../loaders/RDotLoader";
import { RootState } from "../../store";
import defaultImage from "../../assets/images/my_answer.svg";
import emptyAvatar from "../../assets/images/empty_avatar.png";

type ArticleItemProps = {
  _id: string;
  title: string;
  slug: string;
  image: string;
  caption: string;
  postedBy: any;
  date: string;
  category: string;
  savedBy: string[];
  readDuration: string;
  pinnedBy?: string[];
  onProfile?: boolean;
};

const VerticalArticleItem: React.FC<ArticleItemProps> = ({
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
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    setIsPinned(pinnedBy?.some((id) => id === user?._id));
    setIsSaved(savedBy?.some((id) => id === user?._id));
  }, [pinnedBy, savedBy, user]);

  const handlePinAndUnpin = async () => {
    try {
      const authToken = await getToken();
      await axiosInstance(authToken).get(`/api/v1/article/pin/${_id}`);
      setIsPinned(!isPinned);
      toast.success(isPinned ? "Article unpinned!" : "Article pinned!");
    } catch (err) {
      toast.error(errorParser(err));
    }
  };

  const showAuthDialogue = () => {
    enqueueSnackbar("Please sign up to complete your action!", {
      variant: "info",
      persist: true,
      action: (key) => (
        <>
          <Button onClick={() => { closeSnackbar(); navigate("/signup"); }}>
            Sign Up
          </Button>
          <Button onClick={() => closeSnackbar()}>Cancel</Button>
        </>
      ),
    });
  };

  const handleBookmarkToggle = async () => {
    try {
      const authToken = await getToken();
      if (!authToken) {
        showAuthDialogue();
        return;
      }
      setLoading(true);
      const { data } = await axiosInstance(authToken).get(`/api/v1/article/bookmark/${_id}`);

      if (data.success) {
        setIsSaved(!isSaved);
        toast.success(`${title} ${data.message}`);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <ArticleCard
        as={motion.div}
        whileHover={{ scale: 1.03 }}
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
          <Link to={`/blog/article/${slug}`}>
            <Title>{title?.length > 25 ? `${title?.slice(0, 25)}...` : title}</Title>
          </Link>
          <Caption dangerouslySetInnerHTML={{ __html: removeHtmlAndHashTags(`${caption?.slice(0, 90)}...`) }} />
          <MetaContainer>
            <AuthorInfo>
              <AuthorAvatar src={postedBy?.avatar?.url || emptyAvatar} alt={postedBy?.username} />
              <AuthorName to={`/profile/${postedBy?.username}`}>{postedBy?.username}</AuthorName>
            </AuthorInfo>
            <ReadDuration>{readDuration === "less than a minute read" ? "1 min read" : readDuration}</ReadDuration>
            {onProfile && user?.username === postedBy?.username ? (
              <ActionIcon onClick={handlePinAndUnpin} title={isPinned ? "Unpin" : "Pin"}>
                <FaUnlink />
              </ActionIcon>
            ) : (
              <ActionIcon onClick={handleBookmarkToggle} title={isSaved ? "Unsave" : "Save"}>
                {loading ? <RDotLoader /> : (isSaved ? <FiBookmark /> : <FaBookmark />)}
              </ActionIcon>
            )}
          </MetaContainer>
        </ContentContainer>
      </ArticleCard>
  );
};

export default VerticalArticleItem;


const ArticleCard = styled.div`
  min-width: 320px;
  max-width:320px;
  height: 450px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  border:1px solid #ededed;
  background: #fff;
  position: relative;
  margin-right:8px;
  margin-bottom:15px;
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  height: 50%;
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
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Title = styled.h3`
  margin: 0 0 8px;
  font-size: 18px;
  color:#000;
`;

const Caption = styled.p`
  font-size: 14px;
  color:#666;
  margin-bottom: 16px;
`;

const MetaContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
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
  font-size: 14px;
  color: #000;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ReadDuration = styled.span`
  font-size: 12px;
  color:#000;
`;

const ActionIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color:#000;
  font-size: 18px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  background: #176984;
  color:#fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;

  &:hover {
    opacity: 0.9;
  }
`;
