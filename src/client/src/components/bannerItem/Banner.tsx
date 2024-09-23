import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import styled, { keyframes} from "styled-components";
import { IconArrowRight } from "../../assets/icons";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import getToken from "../../utils/getToken";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axiosInstance from "../../utils/axiosInstance";
import { isOnline } from "../../utils";
import RDotLoader from "../loaders/RDotLoader";
import toast from "react-hot-toast";
import { RoughNotation } from "react-rough-notation";
import { RootState } from "../../store";


const Banner: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [authToken, setAuthToken] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "Unlock Your Academic Success! Access Course Materials, Past Questions & Answers",
    "Engage with a Vibrant Blog Community",
    "Connect and Collaborate with Fellow Frontiers",
    "Read and write inspiring articles which span series of categories - including finance, personal dev, tech, science and more...",
    "Stay Informed with Event Notifier",
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((currentImage + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentImage]);

  const handleNextClick = () => {
    setCurrentImage((currentImage + 1) % images.length);
  };

  useEffect(() => {
    const setToken = async () => {
      const t: string = await getToken();
      setAuthToken(t);
    };
    setToken();
  }, []);

  return (
    <>
        <BannerContainer className="banner">
            <div className="banner-main">
              <BannerText className="b-p-h">
                Welcome to the frontiers zone,
                <br />
                <RoughNotation
                  padding={0}
                  color="#176984"
                  type="underline"
                  show={true}
                >
                  where you will -
                </RoughNotation>
              </BannerText>
              <TypeWriter>{images[currentImage]}</TypeWriter>
              <div className="go-corner">
                <div className="go-arrow" title="Next">
                  <ArrowRight onClick={handleNextClick} />
                </div>
              </div>
              {(!user?.username || !authToken) && (
                <Link to="/signup">
                  <CtaBtn title="Get Started!" className="b-cta-btn">
                    Get Started!
                  </CtaBtn>
                </Link>
              )}
            </div>
        </BannerContainer>
    </>
  );
};


//not in use
const ShowCarousel = () => {
  const [trendingFetchErr, setTrendingFetchError] = useState("");
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [trendingArticles, setTrendingArticles] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getTrendingArticles = async () => {
      try {
        setTrendingLoading(true);
        const { data } = await axiosInstance().get(`/api/v1/article/trending`);
        setTrendingLoading(false);
        setTrendingArticles(data?.articles);
      } catch (err: any) {
        setTrendingLoading(false);
        setTrendingFetchError(err.message);
      }
    };
    isOnline() && getTrendingArticles();
  }, [toast, trendingFetchErr]);

  const handleImageClick = (slug: string) => {
    navigate(`/blog/article/${slug}`);
  };

  return (
    <>
      {trendingArticles.length > 0 ? (
        <CarouselContainer
          className="b-carousel"
          autoPlay={true}
          showThumbs={false}
          showStatus={false}
          infiniteLoop={true}
          interval={1500}
        >
          {trendingArticles.map((art: any, i: number) => (
            <React.Fragment key={i}>
              <img src={art.Article?.image?.url} alt={art.Article?.title} />
              <MetaDetail className="carousel-meta-detail">
                <div>
                  <CarouselMetaTitle
                    onClick={() => handleImageClick(art.Article?.slug)}
                  >
                    {art.Article?.title}
                  </CarouselMetaTitle>
                  <span className="carousel-meta-date">
                    {art.Article?.postedBy?.username} •{" "}
                    {new Date(art.Article?.createdAt).toDateString()}
                  </span>
                </div>
                <CarouselMetaCatg>{art.Article?.category}</CarouselMetaCatg>
              </MetaDetail>
            </React.Fragment>
          ))}
        </CarouselContainer>
      ) : (
        <RDotLoader />
      )}
    </>
=======
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSpring, animated, config } from "react-spring";
import { RootState } from "../../store";

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
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
  );
};

export default Banner;

<<<<<<< HEAD
const BannerContainer = styled.div`
  display: flex;
  max-width: 100%;
  height: fit-content;
  position: relative;
  justify-content: center;

  .banner-main {
    display: flex;
    align-items:flex-start;
    justify-content:center;
    flex-direction:column;
    position: relative;
    width: 100%;
    height: 320px;
    background-color: #f2f8f9;
    padding: 32px 24px;
    text-decoration: none;
    z-index: 0;
    overflow: hidden;
    @media(max-width:767px){
      height: 260px;
    }
  
  }

  .banner-main:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: -16px;
    right: -16px;
    background: #176984;
    height: 32px;
    width: 32px;
    border-radius: 32px;
    transform: scale(1);
    transform-origin: 50% 50%;
    transition: transform 0.25s ease-out;
  }
  .banner-main .b-p-h {
    font-weight: 700;
    font-size: 32px;
    line-height:2.5rem;
    @media(max-width:767px){
      font-size: 24px;
      line-height:1.8rem;
    }
  }
  .banner-main:hover:before {
    transform: scale(100);
  }
  .banner-main:hover p.typeWriter::before {
    background-color: #fff;
  }
  .banner-main:hover p {
    transition: all 0.3s ease-out;
    color: rgba(255, 255, 255, 0.8);
  }

  .banner-main:hover h3 {
    transition: all 0.3s ease-out;
    color: #fff;
  }
  .banner-main:hover .b-cta-btn {
    background-color: #fff;
    color: #176984;
  }
  .go-corner {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 42px;
    height: 42px;
    overflow: hidden;
    top: 0;
    right: 0;
    background-color: #176984;
    border-radius: 0 4px 0 32px;
  }

  .b-arrow-right {
    margin-top: -4px;
    margin-right: -4px;
    height: 22px;
    width: 22px;
    fill: white;
    cursor: pointer;
    font-family: courier, sans;
  }
`;

const CarouselContainer = styled(Carousel)`
  max-width: 100%;
  height: 300px;
  position: relative;

  .control-dots {
    visibility: hidden;
  }
  @media (max-width: 767px) {
    .b-carousel,
    .carousel-slider {
      height: 250px;
    }

    .carousel-meta-detail {
      top: 200px;
      padding-bottom: 5px;
    }
    .carousel-meta-catg {
      font-size: 10px;
    }

    .carousel-meta-title {
      font-size: 14px;
    }
    .banner .b-p-h {
      font-size: 16px;
    }

    .banner p.typeWriter {
      font-size: 13px;
    }
  }
`;
const blink = keyframes`
  0%, 75%, 100% {
    opacity: 1;
  }
  25% {
    opacity: 0;
  }


  
`;

const MetaDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  position: absolute;
  text-transform: capitalize;
  top: 240px;
  height: 65px;
  width: 100%;
  text-align: justify;
  padding: 0px 10px;
  font-family: Georgia, "Times New Roman", Times, serif;
  background: rgba(218, 216, 216, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  -moz-backdrop-filter: blur(10px);
  -o-backdrop-filter: blur(10px);
  box-shadow: 0 0px 3px rgba(223, 222, 222, 0.02);
  transform: 0.5s;
`;

const CarouselMetaTitle = styled.p`
  color: #ffffff;
  font-size: large;
  cursor: pointer;
  font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
  word-wrap: break-word;
  line-height: 1.2rem;
  padding-top: 3px;
`;

const CarouselMetaCatg = styled.p`
  font-size: 12px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  color: #ffffff;
`;

const BannerText = styled.p`
  font-size: 20px;
  font-weight: 500;
  line-height: 20px;
  color: #000000;
`;

const TypeWriter = styled.p`
  font-size: 16px;
  font-weight: 500;
  font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
  text-transform: capitalize;
  color: #000;
  line-height: 1.5rem;
  padding-top: 20px;
  text-align: justify;

  &::before {
    position: absolute;
    content: "";
    height: 16px;
    width: 3px;
    background-color: #176984;
    animation: ${blink} 1s infinite;
    animation-timing-function: step-end;
  }
`;

const ArrowRight = styled(IconArrowRight)`
  margin-top: -4px;
  margin-right: -4px;
  height: 22px;
  width: 22px;
  fill: white;
  cursor: pointer;
  font-family: courier, sans;
`;

const CtaBtn = styled.button`
  width: fit-content;
  padding: 10px 20px;
  background-color: #176984;
  border: none;
  cursor: pointer;
  color: #fff;
  margin-top: 25px;
  font-weight: 700;
  transition: 0.3s ease-out;
  border-radius: 4px;

  &:hover {
    background-color: #fff;
    color: #176984;
  }
`;
=======
const BannerContainer = styled(animated.div)`
  background: linear-gradient(135deg,#176984, #DFDFDF);
  min-height: 100vh;
  max-width:100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
`;

const ContentWrapper = styled.div`
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
  max-width: 500px;
  width: 100%;
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
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
