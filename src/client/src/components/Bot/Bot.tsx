import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useSpring, animated, config } from "react-spring";
import { FaTimes, FaPaperPlane, FaRegCopy } from "react-icons/fa";
import { MdImageSearch } from "react-icons/md";
import { VscRobot } from "react-icons/vsc";
import axiosInstance from "../../utils/axiosInstance.js";
import { errorParser } from "../../utils/formatter.js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";
import { jelly } from "ldrs";

const BotWrapper = styled.div`
  position: fixed;
  bottom: 30px;
  right: 10px;
  z-index: 10000;
  pointer-events: none;
`;

const rippleEffect = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(52, 152, 219, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
  }
`;

const bounceEffect = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
`;

const BotButton = styled(animated.button)`
  position: absolute;
  bottom: 0;
  right: 2px;
  background-color: #3498db;
  color: white;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
  animation: ${rippleEffect} 1.5s infinite,
    ${bounceEffect} 2s ease-in-out infinite;
  pointer-events: auto;

  &:hover {
    background-color: #2980b9;
  }
`;

const BotContainer = styled(animated.div)`
  position: absolute;
  bottom: 50px;
  right: 0;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  width: 350px;
  height: 500px;
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;
`;

const BotHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #3498db;
  color: white;
`;

const BotTitle = styled.h2`
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color:#ccc;
`;

const CloseButton = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #e74c3c;
  }
`;

const ChatArea = styled.div`
  flex-grow: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const InputArea = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #e0e0e0;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  background-color: #f0f0f0;

  &:focus {
    outline: none;
    background-color: #e8e8e8;
  }
`;

const SendButton = styled.button`
  background-color: transparent;
  color: #3498db;
  border: none;
  font-size: 20px;
  cursor: pointer;
  margin-left: 10px;
  transition: color 0.3s;

  &:hover {
    color: #2980b9;
  }
`;

const ImageButton = styled(SendButton)`
  margin-right: 10px;
`;

const Message = styled.div`
  margin-bottom: 10px;
  padding: 0.75rem 1rem;
  max-width: 80%;
  word-wrap: break-word;
`;

const UserMessage = styled(Message)`
  background-color: #3498db;
  color: white;
  align-self: flex-end;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 0;
`;

const BotMessage = styled(Message)`
  background-color: #f0f0f0;
  color: #333;
  align-self: flex-start;
  display: flex;
  align-items: flex-start;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 20px;
`;

const BotIcon = styled(VscRobot)`
  margin-right: 8px;
  font-size: 20px;
  color: #3498db;
`;

const ErrorMessage = styled(animated.div)`
  color: #e74c3c;
  font-size: 14px;
  padding: 10px;
  background-color: #fadbd8;
  border-radius: 4px;
  margin-top: 10px;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 10px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const CopyButton = styled.button`
  background-color: transparent;
  color: #3498db;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 5px;
  margin-left: 5px;
  transition: color 0.3s;

  &:hover {
    color: #2980b9;
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 150px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const MarkdownContent = styled.div`
  font-size: 14px;
  line-height: 1.4;
  width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;

  p {
    margin-bottom: 8px;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 12px;
    margin-bottom: 8px;
  }

  code {
    font-size: 12px;
    background-color: #e8e8e8;
    padding: 2px 4px;
    border-radius: 4px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-x: auto;
  }
`;

const typewriterEffect = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const TypewriterText = styled.div`
  overflow: hidden;
  white-space: normal;
  animation: ${typewriterEffect} 3s steps(40, end);
`;

const Bot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const chatAreaRef = useRef(null);

  useEffect(() => {
   
      setMessages([
        {
          type: "bot",
          content:
            "Hi! I'm here to assist you in providing answers to past questions, generating quizzes from questions, and answering your academic questions.",
        },
      ]);
     
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const botSpring = useSpring({
    transform: isOpen ? "scale(1)" : "scale(0)",
    opacity: isOpen ? 1 : 0,
    config: config.gentle,
  });

  const buttonSpring = useSpring({
    opacity: isOpen ? 0 : 1,
    config: config.gentle,
  });

  const errorSpring = useSpring({
    opacity: error ? 1 : 0,
    height: error ? "auto" : 0,
    config: config.gentle,
  });

  const handleSend = async () => {
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { type: "user", content: query }]);
    setQuery("");
    setIsLoading(true);
    setError("");

    try {
      const response = await axiosInstance().post("/api/v1/bot/query", {
        query,
      });
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: response.data.article },
      ]);
    } catch (error) {
      setError(errorParser(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError("");

    try {
      const base64Image = await convertToBase64(file);
      setImagePreview(base64Image);
      setMessages((prev) => [
        ...prev,
        { type: "user", content: "", image: base64Image },
      ]);

      const response = await axiosInstance().post("/api/v1/bot/pq-answers", {
        image: base64Image,
      });
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: response.data.answer },
      ]);
    } catch (error) {
      setError(errorParser(error));
    } finally {
      setIsLoading(false);
      setImagePreview(null);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    jelly.register();
  }, []);

  return (
    <BotWrapper>
      <animated.div style={buttonSpring}>
        <BotButton onClick={handleToggle}>
          <VscRobot size={18} /> 
        </BotButton>
      </animated.div>
      <animated.div style={botSpring}>
        <BotContainer>
          <BotHeader>
            <div style={{display:'flex',flexDirection:'column', alignItems:'center'}}> <span style={{display:"flex", alignItems:"center",justifyContent:"center"}}><VscRobot fill="#fff" size={20} />&nbsp;<span style={{fontSize:"13px",color:"#fff"}}>Dex</span></span> 
            <BotTitle>Online</BotTitle></div>
            
        
            <CloseButton onClick={handleToggle}>
              <FaTimes fill="#fff" />
            </CloseButton>
          </BotHeader>
          <ChatArea ref={chatAreaRef}>
            {messages.map((message, index) =>
              message.type === "user" ? (
                <UserMessage key={index}>
                  {message.image && (
                    <ImagePreview src={message.image} alt="User uploaded" />
                  )}
                  {message.content}
                </UserMessage>
              ) : (
                <BotMessage key={index}>
                  <BotIcon />
                  <MarkdownContent>
                  
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    
                  </MarkdownContent>
                  <CopyButton onClick={() => handleCopy(message.content)}>
                    <FaRegCopy />
                  </CopyButton>
                </BotMessage>
              )
            )}
            {isLoading && (
              <div>
                <l-jelly size="30" speed="0.9" color="grey"></l-jelly>
              </div>
            )}
          </ChatArea>
          <animated.div style={errorSpring}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </animated.div>
          <InputArea>
            <ImageButton as="label" htmlFor="imageUpload">
              <MdImageSearch />
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </ImageButton>
            <Input
              type="text"
              placeholder="Type your message..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <SendButton onClick={handleSend}>
              <FaPaperPlane />
            </SendButton>
          </InputArea>
        </BotContainer>
      </animated.div>
    </BotWrapper>
  );
};

export default Bot;