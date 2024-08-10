import React, { useState, useRef, useEffect } from "react";
import MarkdownEditor from "../../components/markdownEditor/MarkdownEditor";
import MetaData from "../../MetaData";
import CustomEditor from "../../components/customTextEditor/CustomTextEditor";
import { IconCaretDown } from "../../assets/icons";
import styled, { ThemeProvider } from "styled-components";
const EditorPage = () => {
  const [activeEditor, setActiveEditor] = useState("Custom");
  const [isTabOpen, setIsTabOpened] = useState(false);
  const toggleTab = () => {
    setIsTabOpened(!isTabOpen);
  };
  const handleSelection = (it) => {
    setActiveEditor(it);
    toggleTab();
  };
  const tabRef = useRef(null);
  const handleClickOutside = (e) => {
    if (tabRef.current && !tabRef.current.contains(e.target)) {
      setIsTabOpened(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <MetaData title="Editor" />
      <EditorRenderer>
        <div className="main-ed-header">
          <span
            ref={tabRef}
            className="active-editor"
            title="Editor option"
            onClick={toggleTab}
          >
            {activeEditor}
            <IconCaretDown className="editor-toggle-icon" />
          </span>
          {isTabOpen && (
            <div className="editor-option">
              <ul>
                {["Custom", "Markdown"].map((it, i) => (
                  <li key={i} onClick={() => handleSelection(it)}>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="main-editor-holder">
          {activeEditor === "Custom" ? <CustomEditor /> : <MarkdownEditor />}
        </div>
      </EditorRenderer>
    </>
  );
};

export default EditorPage;

const EditorRenderer = styled.div`
  .main-ed-header {
    border-bottom: 1px solid #dedede;
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    width: 100%;
    height: fit-content;
    z-index: 99;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    -moz-backdrop-filter: blur(10px);
    -o-backdrop-filter: blur(10px);
    transform: 0.5s;
  }
  .editor-toggle-icon,
  .active-editor {
    cursor: pointer;
  }
  .editor-option {
    position: absolute;
    z-index: 999;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: #fff;
    left: 10px;
    top: 20px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .editor-option ul {
    width: 100%;
    font-size: 14px;
    list-style: none;
  }
  .editor-option ul li {
    width: 100%;
    cursor: pointer;
    color: rgb(0, 0, 0);
    border-bottom: 1px solid #ededed;
    padding: 5px 10px;
    font-size: 13px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  .editor-option ul li:hover {
    background-color: #176984;
    color: #fff;
    transition: all 0.3s ease-out;
  }
  .editor-option ul li :last-child {
    border-bottom: none;
  }
  .editor-option ul li :first-child:hover {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .editor-option ul li :last-child:hover {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .main-editor-holder {
    position: relative;
    top: 10px;
  }
`;
