import React from "react";
import styled from "styled-components";

const PastquestionSkeletonLoader: React.FC = () => {
  return (
    <>

        <PastquestionSkeletonRenderer>
          <div className="card__skeleton pq-sk_tag"></div>
          <div className="card__skeleton pq-s-img"></div>
          <div className="card__skeleton pq-sk_title"></div>
          <div className="card__skeleton card_ev_description"></div>
        </PastquestionSkeletonRenderer>
  
    </>
  );
};

export default PastquestionSkeletonLoader;

const PastquestionSkeletonRenderer = styled.div`
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
    & {
      max-width: 400px;
      min-width: 350px;
    }
  }
  .pq-s-img {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    background-color: #e2feee;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    animation: animate 0.6s linear alternate-reverse infinite;
    transition: 0.6s ease;
  }
  .card__skeleton {
    background-color: rgba(243, 243, 243, 1);
    animation: pulse 1s infinite;
  }

  .card_ev_description {
    height: 20px;
    width: 90%;
    margin-top: 12px;
    border-radius: 0%;
    margin-bottom: 10px;
  }
  .pq-sk_tag {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    width: fit-content;
    align-self: flex-start;
  }
  .pq-sk_title {
    padding: 5px 10px;
    align-self: center;
    border: none;
    width: fit-content;
    margin-top: 10px;
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
