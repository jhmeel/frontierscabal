import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Box,
} from "@mui/material";
import styled from "styled-components";
import emptyImg from "../../assets/images/empty_avatar.png";

const StyledCard = styled(Card)`
  display: flex;
  margin-bottom: 12px;
  padding: 12px;
  transition: all 0.3s ease-in-out;
  border-radius: 8px;
  border: 1pz solid #ededed;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-left: 16px;
  @media (max-width: 600px) {
    padding-left: 0;
    align-items: center;
    text-align: center;
  }
`;

const UserName = styled(Typography)`
  font-weight: 600;
  font-size: 1.1rem;
`;

const UserBio = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #666;
`;

const ButtonWrapper = styled(Box)`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  gap: 8px;
  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const ViewButton = styled(Button)`
  color: #fff;
`;

const MessageButton = styled(Button)`
  color: #fff;
`;

interface UserItemProps {
  username: string;
  bio: string;
  img: string;
}

const UserItem: React.FC<UserItemProps> = ({ username, bio, img }) => {
  const navigate = useNavigate();

  return (
    <StyledCard>
      <Avatar
        src={img || emptyImg}
        alt={username}
        sx={{ width: 60, height: 60 }}
      />
      <ContentWrapper>
        <UserName variant="h2">{username}</UserName>
        <UserBio variant="body1">{bio}</UserBio>
        <ButtonWrapper>
          <ViewButton
            variant="contained"
            size="small"
            onClick={() => navigate(`/profile/${username}`)}
          >
            View Profile
          </ViewButton>
          <MessageButton
            variant="outlined"
            size="small"
            onClick={() => navigate(`/chat/${username}`)}
          >
            Message
          </MessageButton>
        </ButtonWrapper>
      </ContentWrapper>
    </StyledCard>
  );
};

export default UserItem;
