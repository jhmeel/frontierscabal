import React, { useState, useEffect } from "react";
import {
  IconArrowTrendUp,
  IconArticleFill,
  IconBookshelf,
  IconCirclePlay,
} from "../../assets/icons";
import { Link } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";

const Descriptor = () => {

  const [count1, setCount1] = useState(0);
  const [count3, setCount3] = useState(0);
  const [count4, setCount4] = useState(0);
  const [count5, setCount5] = useState(0);

  const countDown = (val: number, setCount: React.Dispatch<React.SetStateAction<number>>) => {
    const duration = 3000;
    const interval = duration / val;
    let curr: number = 0;

    const it = setInterval(() => {
      if (curr < val) {
        curr++;
        setCount(curr);
      } else {
        clearInterval(it);
      }
    }, interval);
  };

  useEffect(() => {
    countDown(200, setCount1);
    countDown(300, setCount3);
    countDown(50, setCount4);
    countDown(10, setCount5);
  }, []);

  return (
    <>
        <DescriptorRenderer>
          <div className="des-item des-item--1">
            <Link to="/study-materials">
              <IconBookshelf fill="rgba(149,149,255,1)" className="des-icon" />
            </Link>
            <span className="des-value"> {count1} </span>
            <Link to="/study-materials">
              <span className="text text--1">Study Materials</span>
            </Link>
          </div>

          <div className="des-item des-item--3">
            <Link to="/blog">
              <IconArticleFill fill="rgba(66,193,110,1)" className="des-icon" />
            </Link>
            <span className="des-value"> {count3} </span>
            <Link to="/blog">
              <span className="text text--3">Articles</span>
            </Link>
          </div>

          <div className="des-item des-item--4">
            <Link to="/events">
              <IconArrowTrendUp fill="#134248" className="des-icon" />
            </Link>
            <span className="des-value"> {count4} </span>
            <Link to="/events">
              <span className="text text--4">Events</span>
            </Link>
          </div>
          <div className="des-item des-item--5">
            <Link to="/modules">
              <IconCirclePlay fill=" #3f7b9e" className="des-icon" />
            </Link>
            <span className="des-value"> {count5} </span>
            <Link to="/modules">
              <span className="text text--5">Modules</span>
            </Link>
          </div>
        </DescriptorRenderer>

    </>
  );
};

export default Descriptor;
const DescriptorRenderer = styled.div`
  width: 100%;
  height: 150px;
  color: white;
  display: flex;
  margin-top: 5px;

  .des-item {
    width: 100px;
    flex: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
  }

  .des-item:hover {
    -webkit-transform: scale(0.95);
    -ms-transform: scale(0.95);
    transform: scale(0.95);
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    border-radius: 4px;
  }

  .des-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 7px;
  }

  .des-item--1 {
    background: #8686be;
  }

  .des-item--3 {
    background: #a9ecbf;
  }

  .des-item--4 {
    background: #38a1ac;
  }
    .des-item--5 {
    background: #04517e;
  }


  .des-value {
    font-size: 25px;
    font-weight: bold;
    color: aliceblue;
  }

  .text {
    font-size: 13px;
    font-weight: 600;
    text-align: center;
  }

  .text--1 {
    color: rgba(149, 149, 255, 1);
  }

  .text--3 {
    color: rgba(66, 193, 110, 1);
  }

  .text--4 {
    color: #134248;
  }
  .text--5 {
    color: #3f7b9e;
  }
`;
