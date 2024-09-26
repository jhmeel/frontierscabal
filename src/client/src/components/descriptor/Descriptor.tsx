import React, { useState, useEffect } from "react";
import {
  IconArrowTrendUp,
  IconArticleFill,
  IconBookshelf,
  IconCirclePlay,
} from "../../assets/icons";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useSpring, animated, config } from "react-spring";

const Descriptor = () => {
  const [animatedItem, setAnimatedItem] = useState(0);
  const features = [
    {
      icon: <IconBookshelf />,
      text: "Study Materials",
      link: "/study-materials",
      color: "#6C63FF",
      lightColor: "#E8E7FF",
    },
    {
      icon: <IconArticleFill />,
      text: "Articles",
      link: "/blog",
      color: "#4CAF50",
      lightColor: "#E8F5E9",
    },
    {
      icon: <IconArrowTrendUp />,
      text: "Events",
      link: "/events",
      color: "#2196F3",
      lightColor: "#E3F2FD",
    },
    {
      icon: <IconCirclePlay />,
      text: "Modules",
      link: "/modules",
      color: "#DF8D13",
      lightColor: "#FFF3E0",
    },
  ];
  const fadeProps = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(50px)" },
    reset: true,
    reverse: animatedItem % 2 === 0,
    delay: 200,
    config: config.molasses,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedItem((i) => (i + 1) % features.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);


  return (
    <DescriptorWrapper>
      {features.map((item, index) => (
         <animated.div style={index === animatedItem ? fadeProps : {}}>
        <DescriptorItem key={index} color={item.color}>
          <Link to={item.link}>
            <IconWrapper lightColor={item.lightColor} color={item.color}>
              {item.icon}
            </IconWrapper>
            <Text>{item.text}</Text>
          </Link>
        </DescriptorItem>
        </animated.div>
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
  margin: 0 auto;
  width: 100%;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
`;



const DescriptorItem = styled.div`
  background-color: ${(props) => props.color};
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow:0 8px 32px 0 rgba(31, 38, 135, 0.2);
  transition: transform 0.3s ease-in-out;
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

const Text = styled.span`
  font-size: 0.85rem;
  font-family: sans-serif;
  font-weight: 500;
  color: #ccc;
`;
