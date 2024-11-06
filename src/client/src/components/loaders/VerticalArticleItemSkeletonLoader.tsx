import React from 'react';
import { Box, Skeleton } from '@mui/material';
import styled from 'styled-components';


const VerticalArticleItemSkeletonLoader = () => {
  return (
    <StyledVerticalArticleItemSkeletonRenderer>
      <Skeleton variant="rectangular" className="art-s-img" />
      <Skeleton variant="text" className="card_v_title" />
      <Skeleton variant="text" className="card_v_description" />
      <Skeleton variant="text" className="card_v_description" />
    </StyledVerticalArticleItemSkeletonRenderer>
  );
};

const StyledVerticalArticleItemSkeletonRenderer = styled(Box)`
  height: 450px;
  min-width: 320px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background:#fff;
  border: 1px solid #ededed;
  margin: 10px;
  position: relative;
  border-radius: 8px;
  transition: 0.3s ease-out;
  cursor: progress;

  .art-s-img {
    height: 50%;
    width: 90%;
    margin-top: 10px;
    border-radius: 8px;
  }

  .card_v_title {
    height: 20px;
    width: 90%;
    margin-top: 12px;
    margin-bottom: 10px;
  }

  .card_v_description {
    height: 5%;
    width: 90%;
    margin-top: 10px;
  }
`;

export default  VerticalArticleItemSkeletonLoader;