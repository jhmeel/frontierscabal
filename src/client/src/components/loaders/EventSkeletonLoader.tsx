import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const EventSkeletonLoader: React.FC = () => {

  return (
    <>

        <EventSkeletonRenderer>
          <div className="card__skeleton ev-s-img"></div>
          <div className="card__skeleton card_ev_description"></div>
          <div className="card__skeleton card_ev_btn"></div>
      
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
  border: 1px solid #ededed;
  margin: 0px 5px 10px 5px;
  max-width: 600px;
  min-width: 550px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 767px) {
    & {
      min-width: 340px;
      max-width: 340px;
    }
  }

  .ev-s-img {
    border-radius: 50%;
    padding: 4px 13px;
    height: 50px;
    width: 50px;
    align-self: flex-start;
  }
  .card__skeleton {
    background-color: rgba(243, 243, 243, 1);
    animation: pulse 1s infinite;
    
  }

  .card_ev_description {
    height: 20px;
    width: 90%;
    margin-top: 12px;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  .card_ev_btn {
    padding: 10px 20px;
    border-radius: 8px;
 
  }

  @keyframes pulse {
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;
