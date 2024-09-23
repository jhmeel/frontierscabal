import React, { useState, useEffect } from "react";
import {
  IconArrowTrendUp,
  IconArticleFill,
  IconBookshelf,
  IconCirclePlay,
} from "../../assets/icons";
import { Link } from "react-router-dom";
<<<<<<< HEAD
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
=======
import styled from "styled-components";

const Descriptor = () => {
  const [counts, setCounts] = useState({
    studyMaterials: 0,
    articles: 0,
    events: 0,
    modules: 0,
  });

  const countUp = (target, key) => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const interval = setInterval(() => {
      if (current < target) {
        current += increment;
        setCounts((prev) => ({ ...prev, [key]: Math.floor(current) }));
      } else {
        setCounts((prev) => ({ ...prev, [key]: target }));
        clearInterval(interval);
      }
    }, duration / steps);
  };

  useEffect(() => {
    countUp(200, "studyMaterials");
    countUp(300, "articles");
    countUp(50, "events");
    countUp(10, "modules");
  }, []);

  const items = [
    {
      icon: <IconBookshelf />,
      count: counts.studyMaterials,
      text: "Study Materials",
      link: "/study-materials",
      color: "#6C63FF",
      lightColor: "#E8E7FF",
    },
    {
      icon: <IconArticleFill />,
      count: counts.articles,
      text: "Articles",
      link: "/blog",
      color: "#4CAF50",
      lightColor: "#E8F5E9",
    },
    {
      icon: <IconArrowTrendUp />,
      count: counts.events,
      text: "Events",
      link: "/events",
      color: "#2196F3",
      lightColor: "#E3F2FD",
    },
    {
      icon: <IconCirclePlay />,
      count: counts.modules,
      text: "Modules",
      link: "/modules",
      color: "#DF8D13",
      lightColor: "#FFF3E0",
    },
  ];

  return (
    <DescriptorWrapper>
      {items.map((item, index) => (
        <DescriptorItem key={index} color={item.color}>
          <Link to={item.link}>
            <IconWrapper lightColor={item.lightColor} color={item.color}>
              {item.icon}
            </IconWrapper>
            <Count>{item.count}</Count>
            <Text>{item.text}</Text>
          </Link>
        </DescriptorItem>
      ))}
    </DescriptorWrapper>
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
  );
};

export default Descriptor;
<<<<<<< HEAD
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
=======

const DescriptorWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  margin: 0 auto;
  width: 100%;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
`;

const DescriptorItem = styled.div`
  background-color: ${(props) => props.color};
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid ${(props) => props.color};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  a {
    text-decoration: none;
    color: ${(props) => props.color};
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  margin-bottom: 15px;
  background-color: ${(props) => props.lightColor};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 60%;
    height: 60%;
    fill: ${(props) => props.color};
  }
`;

const Count = styled.span`
  font-size: clamp(1rem, 5vw, 2rem);
  font-weight: bold;
  color: #fff;
  font-family: serif;
  margin-bottom: 10px;
`;

const Text = styled.span`
  font-size: 0.85rem;
  font-family: sans-serif;
  font-weight: 500;
  color: #ccc;
`;
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
