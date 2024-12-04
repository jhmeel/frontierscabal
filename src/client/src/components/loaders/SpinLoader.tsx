import React, { useEffect } from "react";
import styled from "styled-components";
import { ring } from "ldrs";

const SpinLoader: React.FC = () => {
  useEffect(() => {
    ring.register();
  }, []);
  return (
    <Loader>
      <l-ring
        size="40"
        stroke="5"
        bg-opacity="0"
        speed="2"
        color="#4285f4"
      ></l-ring>
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
`;
