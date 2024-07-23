import React from "react";
import MetaData from "../../MetaData";
import { Link } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import notfoundsvg from "../../assets/images/outer_space.svg";
import { useSelector } from "react-redux";
const Notfound = () => {
  const { theme } = useSelector((state) => state.theme);

  return (
    <>
      <MetaData title="404_Notfound" />
      <ThemeProvider theme={theme}>
        <NotfoundRenderer>
          <img src={notfoundsvg} />
          <h1 className="srry">Sorry, this page isn't available.</h1>
          <p className="m-info">
            The link you followed may be broken, or the page may have been
            removed.
          </p>
          <Link to="/" className="g-home" title="Home">
            Go to Home
          </Link>
        </NotfoundRenderer>
      </ThemeProvider>
    </>
  );
};

export default Notfound;

const NotfoundRenderer = styled.div`
  height:100vh;
  max-width: 600px;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  margin: 0 auto;

 img{
  max-width: 400px;
  height: auto;
 }
.srry{
  text-align: center;
}
.m-info{
  color:rgb(54, 31, 73);
  text-align: center;
  font-weight: 600;
  font-size: 16px;
}
.g-home{
font-weight: 600;
font-size: 12px;
margin-top:5px;
background-color:#176984;
color: #fff;
border-radius: 5px;
padding: 5px 10px;
}

`;
