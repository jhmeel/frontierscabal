import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import emptyImg from "../../assets/images/empty_avatar.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";


const UserItem= ({
  username,
  bio,
  img,
}: {
  username: string;
  bio: string;
  img: string;
}):React.ReactElement => {
  const navigate = useNavigate();
  const { theme } = useSelector((state: RootState) => state.theme);
  return (
    <>
      <ThemeProvider theme={theme}>
        <UserItemRenderer>
          <div className="usr-avt-img">
            <img src={img || emptyImg} />
          </div>

          <div className="usr-avt-main">
            <span className="usr-avt-usrname">{username}</span>
            <p className="usr-avt-bio">
              {bio?.length > 75 ? `${bio.slice(0, 75)}...` : bio}
            </p>
            <button
              className="avt-view-prof"
              onClick={() => navigate(`/profile/${username}`)}
            >
              View
            </button>
          </div>
        </UserItemRenderer>
      </ThemeProvider>
    </>
  );
};

export default UserItem;

const UserItemRenderer = styled.div`
  position: relative;
  color: #2e2e2f;
  background-color: #fff;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
  margin-bottom: 1rem;
  border: 3px dashed transparent;
  max-width: 600px;
  min-width: 450px;
  max-height: 130px;
  min-height: 100px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  cursor: pointer;

  .usr-avt-img {
    position: relative;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    flex: 15%;
  }
  .usr-avt-img img {
    position: absolute;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    object-fit: cover;
  }
  .usr-avt-main {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
  }
  .usr-avt-usrname {
    text-align: center;
    font-weight: 600;
  }
  .usr-avt-bio {
    color: grey;
    font-size: 12px;
    text-align: center;
  }
  .avt-view-prof {
    border: none;
    padding: 5px 10px;
    width: fit-content;
    border-radius: 5px;
    background-color: #176984;
    color: #fff;
    font-size: 12px;
    align-self: center;
    cursor: pointer;
    margin-top: 8px;
  }
  @media (max-width: 767px) {
    .usr-avt-cont {
      min-width: 330px;
      max-width: 330px;
    }
  }
`;
