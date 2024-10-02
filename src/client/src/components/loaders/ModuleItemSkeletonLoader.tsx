import React from 'react';
import { Box, Skeleton } from '@mui/material';
import styled from 'styled-components';

const ModuleItemSkeletonLoader = () => {
  return (
    <StyledSkeletonWrapper>
      <Skeleton variant="rectangular" className="art-s-img" />
      <Skeleton variant="text" className="card_v_title" />
      <Skeleton variant="text" className="card_v_description" />
      <Skeleton variant="text" className="card_v_description" />
    </StyledSkeletonWrapper>
  );
};

export default ModuleItemSkeletonLoader;

const StyledSkeletonWrapper = styled(Box)`
  height: 330px;
  min-width: 350px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ededed;
  margin: 10px 5px 5px 5px;
  position: relative;
  border-radius: 8px;
  transition: 0.3s ease-out;
  cursor: progress;
  padding: 10px;

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
    border-radius: 5px;
  }

  .card_v_description {
    height: 5%;
    width: 90%;
    margin-top: 10px;
    border-radius: 5px;
  }
`;