import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import fcabal from '../../assets/logos/fcabal.png';
import knowledgeShareImg from "../../assets/images/youngStudent.png";
import joinImg from "../../assets/images/communityStudent.png";
import onlineVidImg from "../../assets/images/happyStudent.png";

const MsgItem = () => {
  const [currentMsg, setCurrentMsg] = useState(0);

  const messages = [
    {
      title: "A Home For Everyone!!",
      paragraph: `Your ultimate platform for academic excellence!\n
      We cater to the needs of students, lecturers, and researchers alike, 
      offering a treasure trove of course materials, past questions and answers to help you ace your exams and unlock your true potential.`,
      image: onlineVidImg,
      btn: "",
      link: "",
    },
    {
      title: "Join Our Telegram Community!!",
      paragraph: `Get Involved in the community on Telegram!`,
      image: joinImg,
      btn: "Join",
      link: "https://t.me/frontierscabal",
    },
    {
      title: "Empower the world with your knowledge!!",
      paragraph: `Begin uploading your school past questions and course materials today!`,
      image: knowledgeShareImg,
      btn: "Upload",
      link: "/study-material/new",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsg((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <>
  
        <MsgItemRenderer id={"MsgItem"}>
          <div className="msg-card">
            <img className="msgcard-logo" src={fcabal} alt="fcabal" />
            <div className="m-content">
              <p className="m-heading">{messages[currentMsg].title}</p>
              <p className="m-para">{messages[currentMsg].paragraph}</p>
              {messages[currentMsg].link && (
                <Link to={messages[currentMsg].link}>
                  <button className="m-btn" title={messages[currentMsg].btn}>
                    {messages[currentMsg].btn}
                  </button>
                </Link>
              )}
              {messages[currentMsg].image && (
                <img className='m-card-avt' src={messages[currentMsg].image} alt="image" />
              )}
            </div>
          </div>
        </MsgItemRenderer>
    </>
  );
};

export default MsgItem

const MsgItemRenderer = styled.div`
   position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 70%;
    height: 300px;
    flex-direction: column;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
    padding: 15px 20px;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.320, 1);
    margin-right: 8px;
    position:relative;
    border-radius: 4px;

 
  .msgcard-logo{
    height: auto;
    width:80px;
    position:absolute;
    top:0;
    left:5px;
    margin-bottom: 5px;
  }
  .m-content {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-top: 40px;
    gap: 10px;
    color:gray;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.320, 1);
  }
.m-card-avt{
    position: absolute;
    max-width: 160px;
    height: auto;
    right: 30px;
    bottom: 0;
  }
 .m-heading {
    font-weight: bold;
    font-size: 24px;
    text-align: center;
  }
  
 .m-para {
    font-size: 16px;
    color:gray;
    width: 70%;
  }
  
  .m-btn {
    color: #e8e8e8;
    text-decoration: none;
    padding: 15px 30px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    background: linear-gradient(-45deg, #4abcc4 0%, #176984 100% );
    border-radius: 5px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
  
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(-45deg, #4abcc4 0%, #176984 100% );
    z-index: -1;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.320, 1);
  }
  
 &:hover::before {
    height: 100%;
  }
  
&:hover {
    box-shadow: none;
  }
 &:hover .m-content .m-para{
    color: #ccc;
  }
  
  &:hover .btn {
    color: #212121;
    background: #e8e8e8;
  }
  
 .btn:hover {
    outline: 2px solid #e8e8e8;
    background: transparent;
    color: #e8e8e8;
  }
  
.btn:active {
    box-shadow: none;
  }
  

  @media(max-width:767px){
    &{
      width: 100%;
      max-height: 500px;
      min-height: 500px;
      justify-content: flex-start;
    }
    .m-content .m-heading {
      font-size: 22px;
      margin-top: 5px;
    }
    .m-content .m-para{
      font-size:14px;
      width: 100%;
  }
}
`;
