import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, CardContent, Typography, Avatar, Button, Box } from "@mui/material";
import styled from "styled-components";
import emptyImg from "../../assets/images/empty_avatar.png";
import { RootState } from "../../store";
const StyledCard = styled(Card)`
  display: flex;
  margin-bottom:4px;
  transition: all 0.3s ease-in-out;


`;

const ContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const UserName = styled(Typography)`
  font-weight: 600;
`;

const UserBio = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ViewButton = styled(Button)`
  align-self: flex-end;
  margin-top:2px;
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
        <CardContent sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Avatar
            src={img || emptyImg}
            alt={username}
            sx={{ width: 60, height: 60, marginRight: 2 }}
          />
          <ContentWrapper>
            <UserName variant="h2" gutterBottom>
              {username}
            </UserName>
            <UserBio variant="body1" color="text.secondary">
              {bio}
            </UserBio>
            <ViewButton
              variant="contained"
              size="small"
              style={{color:"#fff"}}
              color="primary"
              onClick={() => navigate(`/profile/${username}`)}
            >
              View Profile
            </ViewButton>
          </ContentWrapper>
        </CardContent>
      </StyledCard>
  );
};

export default UserItem;