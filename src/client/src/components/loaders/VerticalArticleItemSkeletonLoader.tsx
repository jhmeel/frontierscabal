import React from "react";
import styled from "styled-components";

const VerticalArticleItemSkeletonLoader: React.FC = () => {
  return (
    <>
      <VerticalArticleItemSkeletonRenderer>
          <div className="card_v_skeleton art-s-img"></div>
          <div className="card_v_skeleton card_v_title"></div>
          <div className="card_v_skeleton card_v_description"></div>
           <div className="card_v_skeleton card_v_description"></div>
        </VerticalArticleItemSkeletonRenderer>
      </>
  );
};

export default VerticalArticleItemSkeletonLoader;

const VerticalArticleItemSkeletonRenderer = styled.div`
  height: 450px;
  min-width: 320px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
    border-radius: inherit;
  }
  .card_v_skeleton {
    background-color: rgba(243, 243, 243, 1);
    animation: pulse 1s infinite;
  }

  .card_v_title {
    height: 20px;
    width: 90%;
    margin-top: 12px;
    margin-bottom:10px;
    border-radius: 5px;
  }

  .card_v_description {
    height: 5%;
    width: 90%;
    margin-top: 10px;
    border-radius: 5px;
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
