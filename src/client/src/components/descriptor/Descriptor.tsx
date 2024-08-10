import React, { useState, useEffect } from "react";
import {
  IconArrowTrendUp,
  IconArticleFill,
  IconBookshelf,
  IconCirclePlay,
} from "../../assets/icons";
import { Link } from "react-router-dom";
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
  );
};

export default Descriptor;

const DescriptorWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

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
  color:#fff;
  font-family:serif;
  margin-bottom: 10px;
`;

const Text = styled.span`
  font-size: 0.85rem;
  font-family:sans-serif;
  font-weight: 500;
  color:#ccc;
`;