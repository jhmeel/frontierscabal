import React from 'react';
import { Box, Skeleton } from '@mui/material';
import styled from 'styled-components';


const PastquestionSkeletonLoader = () => {
  return (
    <StyledPastquestionSkeletonRenderer>
      <Skeleton variant="rectangular" className="pq-sk_tag" />
      <Skeleton variant="circular" className="pq-s-img" />
      <Skeleton variant="text" className="pq-sk_title" />
      <Skeleton variant="text" className="card_ev_description" />
    </StyledPastquestionSkeletonRenderer>
  );
};

const StyledPastquestionSkeletonRenderer = styled(Box)`
  color: #2e2e2f;
  cursor: pointer;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ededed;
  margin-bottom: 1rem;
  border: 3px dashed transparent;
  max-width: 30%;
  min-width: 30%;
  margin-right: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 767px) {
    max-width: 400px;
    min-width: 350px;
  }

  .pq-s-img {
    margin: 1rem auto;
    width: 3rem;
    height: 3rem;
  }

  .card_ev_description {
    height: 20px;
    width: 90%;
    margin-top: 12px;
    margin-bottom: 10px;
  }

  .pq-sk_tag {
    padding: 10px 20px;
    width: fit-content;
    align-self: flex-start;
  }

  .pq-sk_title {
    padding: 5px 10px;
    align-self: center;
    width: fit-content;
    margin-top: 10px;
  }
`;


export default PastquestionSkeletonLoader;

