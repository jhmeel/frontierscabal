import React from 'react'
import styled from 'styled-components'
const RDotLoader:React.FC = () => {
  return (
<Spinner>
<div className="dot"></div>
<div className="dot"></div>
<div className="dot"></div>
<div className="dot"></div>
<div className="dot"></div>
</Spinner>


  )
}

export default RDotLoader

const Spinner = styled.div`
 
  width: 30px;
  height: 30px;
  position: relative;
  z-index: 99;
  cursor:progress;
 
 
.dot {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
 }
 
.dot::after {
  content: "";
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #ccc;
 }
 
 @keyframes spin {
  to {
   transform: rotate(360deg);
  }
 }
 
.dot {
  animation: spin 2s infinite;
 }
 
.dot:nth-child(2) {
  animation-delay: 100ms;
 }
 
.dot:nth-child(3) {
  animation-delay: 200ms;
 }
 
.dot:nth-child(4) {
  animation-delay: 300ms;
 }
 
.dot:nth-child(5) {
  animation-delay: 400ms;
 }
`
