import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSpring, animated, config } from "react-spring";
import { RootState } from "../../store";
import { Button, Container} from "@mui/material";
import studentImg from "../../assets/images/studentIllustrator.png";

const Banner: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [currentImage, setCurrentImage] = useState(0);

  const features = [
    "Unlock Academic Success",
    "Join Vibrant Communities",
    "Collaborate with Peers",
    "Access Study Resources",
    "Stay Updated on Events",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.molasses,
  });

  const textSpring = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    reset: true,
    delay: 200,
    config: config.molasses,
  });

  const float = useSpring({
    from: { transform: "translateY(0px)" },
    to: { transform: "translateY(-20px)" },
    config: {
      duration: 2500,
      tension: 300,
      friction: 10,
    },
    loop: { reverse: true },
  });

  return (
    <BannerContainer style={fadeIn}>
      <ContentWrapper>
        <TextContent>
          <Title>Frontiers Learning Hub</Title>
          <animated.div style={textSpring}>
            <Subtitle>{features[currentImage]}</Subtitle>
          </animated.div>
          <Description>
            Empower your educational journey with our innovative platform.
            Connect, learn, and grow with fellow students from around the world.
          </Description>
          {!user?.username && (
            <Link to="/signup">
              <CtaButton>Get Started</CtaButton>
            </Link>
          )}
        </TextContent>
        <ImageWrapper>
          <animated.div style={float}>
            <StudentImage src={studentImg} alt="Student learning" />
          </animated.div>
        </ImageWrapper>
      </ContentWrapper>
      <BackgroundShapes />
    </BannerContainer>
  );
};

export default Banner;

const rippleEffect = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(234, 239, 243, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(52, 152, 219, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
  }
`;
const BannerContainer = styled(animated.div)`
  background: linear-gradient(135deg,#176984, #DFDFDF);
  min-height: 80vh;
  max-width:100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
`;

const ContentWrapper = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  padding: 1rem 2rem;
  z-index: 1;

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TextContent = styled.div`
  flex: 1;
  max-width: 600px;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1rem;
  line-height: 1.2;
`;

const Subtitle = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CtaButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  margin-bottom:10px;
  animation: ${rippleEffect} 1.5s infinite;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 350px;
  position:absolute;
  right:15px;
  bottom:-25px;
  width: 100%;
  @media(max-width:768px){
    width:50%;
    right:-15px;
  }
`;


const StudentImage = styled.img`
  max-width: 100%;
  height: auto;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.2));
`;

const BackgroundShapes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;

  &::before,
  &::after {
    content: "";
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  &::before {
    width: 300px;
    height: 300px;
    top: -100px;
    right: -100px;
  }

  &::after {
    width: 200px;
    height: 200px;
    bottom: -50px;
    left: -50px;
  }
`;
