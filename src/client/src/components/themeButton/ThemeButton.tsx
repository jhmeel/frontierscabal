import React, { useEffect, useState, useRef } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useDispatch } from "react-redux";
import { changeTheme } from "../../actions/theme";
import { useSelector } from "react-redux";
import { ACTIVETHEME } from "../../types";

const ThemeButton: React.FC = () => {
  const dispatch = useDispatch();
  const activeTheme = useSelector((state) => state.theme);
  const [theme, setTheme] = useState<ACTIVETHEME>(activeTheme.theme.type);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: 0,
    y: window.innerHeight / 2 - 50,
  });
  const boxRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setTheme(theme === "LIGHT" ? "DARK" : "LIGHT");
    dispatch(changeTheme(theme));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newPosition = {
        x: Math.min(
          Math.max(0, e.clientX - boxRef.current!.offsetWidth / 2),
          window.innerWidth - boxRef.current!.offsetWidth
        ),
        y: Math.min(
          Math.max(0, e.clientY - boxRef.current!.offsetHeight / 2),
          window.innerHeight - boxRef.current!.offsetHeight
        ),
      };

      setPosition(newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleSnapToSide = () => {
    setPosition({ x: 0, y: window.innerHeight / 2 - 50 });
  };

  return (
    <>
      <ThemeProvider theme={activeTheme.theme}>
      <ThemeButtonRender>
        <label className="toggle-switch-label">
          <input
            type="checkbox"
            className="toggle-checkbox"
          
            // ref={boxRef}
            // style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            // onMouseDown={handleMouseDown}
            // onDoubleClick={handleSnapToSide}
            // onChange={() => {
            //   toggleTheme();
            // }}
          />
         
        </label>
      </ThemeButtonRender>
      </ThemeProvider>
    </>
  );
};

export default ThemeButton;
const ThemeButtonRender = styled.div`
  position: fixed;
  width: 100px;
  height: 40px;
  --light: #dfe5f0;
  --dark: #28292c;
  --link: rgb(27, 129, 112);
  --link-hover: rgb(54, 74, 119);
  z-index: 9999;
  top: 70%;
  left: -30px;
  transition: background-color 0.3s, transform 0.3s;

  .toggle-switch-label {
    position: absolute;
    width: 100%;
    height: 40px;
    background-color: var(--dark);
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
    cursor: pointer;
  }

  .toggle-checkbox {
    position: absolute;
    display: none;
  }

  .toggle-slider {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 25px;
    -webkit-transition: 0.3s ease-in-out;
    border: 1.5px solid #dfe5f0;
    transition: 0.3s ease-in-out;
  }

  .toggle-checkbox:checked ~ .toggle-slider {
    background-color: var(--light);
  }

  .toggle-slider::before {
    content: "";
    position: absolute;
    top: 8px;
    left: 30px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    -webkit-box-shadow: inset 10px -4px 0px 0px var(--light);
    box-shadow: inset 10px -4px 0px 0px var(--light);
    background-color: var(--dark);
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }

  .toggle-checkbox:checked ~ .toggle-slider::before {
    -webkit-transform: translateX(40px);
    -ms-transform: translateX(40px);
    transform: translateX(40px);
    background-color: rgb(247, 102, 6);
    -webkit-box-shadow: none;
    position: absolute;
    top: 8px;
    box-shadow: none;
  }
`;
