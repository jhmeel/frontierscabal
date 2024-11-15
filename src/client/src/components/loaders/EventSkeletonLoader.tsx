import React from "react";
import styled from "styled-components";
import { Box, Skeleton } from "@mui/material";

const EventSkeletonLoader: React.FC = () => {
  return (
    <>
      <EventSkeletonRenderer>
        <Skeleton variant="rectangular" className="ev-s-img"/>
        <Box width={`100%`} display={`flex`} flexDirection={`column`} justifyContent={`center`} alignItems={`center`}>
          <Skeleton variant="rectangular" className="card_ev_description"/>
          <Skeleton variant="text" className="card_ev_btn" />
        </Box>
      </EventSkeletonRenderer>
    </>
  );
};

export default EventSkeletonLoader;

const EventSkeletonRenderer = styled.div`
  position: relative;
  cursor: progress;
  padding: 1rem;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #ededed;
  margin: 0px 5px 10px 5px;
  max-width: 600px;
  width:100%;
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media(max-width: 768px) {
    &{
      width: 105%;
    }
  }

  .ev-s-img {
    border-radius: 50%;
    padding: 4px 13px;
    height: 50px;
    width: 50px;
    align-self: flex-start;
  }
  .card_ev_description {
    height: 50px;
    width: 100%;
    margin-top: 12px;
    margin-bottom: 10px;
  }
  .card_ev_btn {
    padding: 10px 20px;
    width:10%;

  }
`