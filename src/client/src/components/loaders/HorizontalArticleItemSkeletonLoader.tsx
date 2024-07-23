import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const HorizontalArticleItemSkeletonLoader: React.FC = () => {
  return (
    <>
    
        <HorizontalArticleItemSkeletonRenderer>
          <div className="card_h_skeleton art-h-s-img"></div>
          <div className="art-s-cont">
            <div className="card_h_skeleton card_h_title"></div>
            <div className="card_h_skeleton card_h_description"></div>
          </div>
        </HorizontalArticleItemSkeletonRenderer>

    </>
  );  
};

export default HorizontalArticleItemSkeletonLoader;                     

const HorizontalArticleItemSkeletonRenderer = styled.div`
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
    & {
      height: 250px;
      min-width: 340px;
      max-width: 400px;
    }
  }
  .art-h-s-img {
    flex: 30%;
    width: 100%;
    height: 90%;
    padding: 20px 0px 20px 0px;
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
  .card_h_skeleton {
    background-color: rgba(243, 243, 243, 1);
    animation: pulse 1s infinite;
  }

  .card_h_title {
    height: 20px;
    width: 90%;
    border-radius: 0%;
    margin-top: 12px;
  }

  .card_h_description {
    height: 60%;
    width: 90%;
    margin-top: 12px;
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
