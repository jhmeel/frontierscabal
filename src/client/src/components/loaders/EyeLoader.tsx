import React from "react";
import styled from "styled-components";
const EyeLoader = () => {
  return (
    <EyeLoaderRenderer>
      <svg
        height="108px"
        width="108px"
        viewBox="0 0 128 128"
        className="loader"
      >
        <defs>
          <clipPath id="loader-eyes">
            <circle
              transform="rotate(-40,64,64) translate(0,-56)"
              r="8"
              cy="64"
              cx="64"
              className="loader__eye1"
            ></circle>
            <circle
              transform="rotate(40,64,64) translate(0,-56)"
              r="8"
              cy="64"
              cx="64"
              className="loader__eye2"
            ></circle>
          </clipPath>
          <linearGradient y2="1" x2="0" y1="0" x1="0" id="loader-grad">
            <stop stop-color="#000" offset="0%"></stop>
            <stop stop-color="#fff" offset="100%"></stop>
          </linearGradient>
          <mask id="loader-mask">
            <rect
              fill="url(#loader-grad)"
              height="128"
              width="128"
              y="0"
              x="0"
            ></rect>
          </mask>
        </defs>
        <g
          stroke-dasharray="175.93 351.86"
          stroke-width="12"
          stroke-linecap="round"
        >
          <g>
            <rect
              clip-path="url(#loader-eyes)"
              height="64"
              width="128"
              fill="#176984"
            ></rect>
            <g stroke="#176984" fill="none">
              <circle
                transform="rotate(180,64,64)"
                r="56"
                cy="64"
                cx="64"
                className="loader__mouth1"
              ></circle>
              <circle
                transform="rotate(0,64,64)"
                r="56"
                cy="64"
                cx="64"
                className="loader__mouth2"
              ></circle>
            </g>
          </g>
          <g mask="url(#loader-mask)">
            <rect
              clip-path="url(#loader-eyes)"
              height="64"
              width="128"
              fill="hsl(193.1004366812227, 89.80392156862744%, 50%)"
            ></rect>
            <g stroke="hsl(193.1004366812227, 89.80392156862744%, 50%)" fill="none">
              <circle
                transform="rotate(180,64,64)"
                r="56"
                cy="64"
                cx="64"
                className="loader__mouth1"
              ></circle>
              <circle
                transform="rotate(0,64,64)"
                r="56"
                cy="64"
                cx="64"
                className="loader__mouth2"
              ></circle>
            </g>
          </g>
        </g>
      </svg>
    </EyeLoaderRenderer>
  );
};

export default EyeLoader;

const EyeLoaderRenderer = styled.div`
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  .loader {
    width: 5em;
    height: 5em;
  }

  .loader__eye1,
  .loader__eye2,
  .loader__mouth1,
  .loader__mouth2 {
    animation: eye1 3s ease-in-out infinite;
  }

  .loader__eye1,
  .loader__eye2 {
    transform-origin: 64px 64px;
  }

  .loader__eye2 {
    animation-name: eye2;
  }

  .loader__mouth1 {
    animation-name: mouth1;
  }

  .loader__mouth2 {
    animation-name: mouth2;
    visibility: hidden;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg: hsl(var(--hue), 90%, 10%);
      --fg: hsl(var(--hue), 90%, 90%);
    }
  }

  @keyframes eye1 {
    from {
      transform: rotate(-260deg) translate(0, -56px);
    }

    50%,
    60% {
      animation-timing-function: cubic-bezier(0.17, 0, 0.58, 1);
      transform: rotate(-40deg) translate(0, -56px) scale(1);
    }

    to {
      transform: rotate(225deg) translate(0, -56px) scale(0.35);
    }
  }

  @keyframes eye2 {
    from {
      transform: rotate(-260deg) translate(0, -56px);
    }

    50% {
      transform: rotate(40deg) translate(0, -56px) rotate(-40deg) scale(1);
    }

    52.5% {
      transform: rotate(40deg) translate(0, -56px) rotate(-40deg) scale(1, 0);
    }

    55%,
    70% {
      animation-timing-function: cubic-bezier(0, 0, 0.28, 1);
      transform: rotate(40deg) translate(0, -56px) rotate(-40deg) scale(1);
    }

    to {
      transform: rotate(150deg) translate(0, -56px) scale(0.4);
    }
  }

  @keyframes eyeBlink {
    from,
    25%,
    75%,
    to {
      transform: scaleY(1);
    }

    50% {
      transform: scaleY(0);
    }
  }

  @keyframes mouth1 {
    from {
      animation-timing-function: ease-in;
      stroke-dasharray: 0 351.86;
      stroke-dashoffset: 0;
    }

    25% {
      animation-timing-function: ease-out;
      stroke-dasharray: 175.93 351.86;
      stroke-dashoffset: 0;
    }

    50% {
      animation-timing-function: steps(1, start);
      stroke-dasharray: 175.93 351.86;
      stroke-dashoffset: -175.93;
      visibility: visible;
    }

    75%,
    to {
      visibility: hidden;
    }
  }

  @keyframes mouth2 {
    from {
      animation-timing-function: steps(1, end);
      visibility: hidden;
    }

    50% {
      animation-timing-function: ease-in-out;
      visibility: visible;
      stroke-dashoffset: 0;
    }

    to {
      stroke-dashoffset: -351.86;
    }
  }
`;
