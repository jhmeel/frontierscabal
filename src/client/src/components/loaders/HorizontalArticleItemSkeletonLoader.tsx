import React from 'react';
import { Box, Skeleton } from '@mui/material';
import styled from 'styled-components';

const HorizontalArticleItemSkeletonLoader = () => {
  return (
    <StyledHorizontalArticleItemSkeletonRenderer>
      <Skeleton variant="rectangular" className="art-h-s-img" />
      <Box className="art-s-cont">
        <Skeleton variant="text" className="card_h_title" />
        <Skeleton variant="rectangular" className="card_h_description" />
      </Box>
    </StyledHorizontalArticleItemSkeletonRenderer>
  );
};

const StyledHorizontalArticleItemSkeletonRenderer = styled(Box)`
  height: 300px;
  max-width: 530px;
  width: 500px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid #ededed;
  margin: 10px 6px;
  position: relative;
  border-radius: 8px;
  transition: 0.3s ease-out;
  overflow: hidden;
  cursor: progress;

  @media (max-width: 767px) {
    height: 250px;
    min-width: 340px;
    max-width: 400px;
  }

  .art-h-s-img {
    flex: 30%;
    height: 90%;
    margin: 20px 0;
  }

  .art-s-cont {
    flex: 70%;
    padding: 8px 16px;
    display: flex;
    overflow: hidden;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
  }

  .card_h_title {
    height: 20px;
    width: 90%;
    margin-top: 12px;
  }

  .card_h_description {
    height: 60%;
    width: 90%;
    margin-top: 12px;
  }
`;

export default HorizontalArticleItemSkeletonLoader;                     

