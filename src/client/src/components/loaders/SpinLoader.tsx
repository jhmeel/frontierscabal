import React from "react";
import styled from "styled-components";
import { CircleLoaderIcon } from "../../assets/icons";

const SpinLoader:React.FC = () => {
  return (
   <Loader>
     <CircleLoaderIcon className='custom-loader'/> 
   </Loader>
  );
}; 

export default SpinLoader;
const Loader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 998;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  -moz-backdrop-filter: blur(8px);
  -o-backdrop-filter: blur(8px);
  cursor: progress;

.custom-loader {
  width: 4em;
  transform-origin: center;
  animation: rotate4 2s linear infinite;
}

@keyframes rotate4 {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash4 {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }

  100% {
    stroke-dashoffset: -125px;
  }
}

`