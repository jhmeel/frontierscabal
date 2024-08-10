import React from "react";
import MetaData from "../../MetaData";
import ReactMarkdown from "react-markdown";
import { readingTime } from "reading-time-estimator";
import styled from "styled-components";
import {  IconChevronLeft } from "../../assets/icons";
import remarkGfm from "remark-gfm";

const Previewer = ({
  img,
  content,
  removeFunc,
}: {
  img: string;
  content: string;
  removeFunc: () => void;
}):React.ReactElement => {
   const { text, words } = readingTime(content);

  return (
    <>
      <MetaData title="Article Preview" />
      <ArticlePreviewer>
        <div className="a-prev-header" style={{height: img?'290px':'50px'}}>
          <span title="Exit preview"
            className="back"
            onClick={removeFunc}
          >
            <IconChevronLeft />| back
          
          </span>
          {img && <img className="pre-img" src={img} loading="lazy" />}
          <div className="meta-art-detail">
            <span>{text}</span>
            <span>Words: {words}</span>
          </div>
        </div>
        <div className="pre-mark-down-holder">
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => (
                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.8rem",
                    padding: "3px 6px",
                    width: "100%",
                  }}
                  {...props}
                />
              ),
            }}
            remarkPlugins={[remarkGfm]}
            className="pre-mark-down"
            children={content}
          />
        </div>
        </ArticlePreviewer>
      </>
 
  );
};

export default Previewer;


const ArticlePreviewer = styled.div`
height: fit-content;
width: 100%;
display: flex;
flex-direction: column;
background-color: #fff;
padding: 0px 5px;
overflow:hidden;

.a-prev-header {
width: 100%;
border-bottom: 1px solid #ccc;
margin-top: 10px;
position: relative;
}

.pre-img {
width: 100%;
height: 100%;
object-fit: cover;
border-radius: 10px;
padding: 6px;
}
.pre-mark-down-holder {
padding: 5px 10px;
margin-top: 50px ;
margin-bottom: 5px;
width: 100%;
}

.back {
  position: absolute;
  top: 50%;
  left: 5px;
  padding: 5px 10px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background: #fff;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 99;
}
.meta-art-detail {
width: 100%;
display: flex;
padding: 4px 8px;
align-items: center;
justify-content: space-between;
border-bottom: 1px solid #ccc;
font-size: 12px;
text-transform: capitalize;
font-weight: 600;
}

`