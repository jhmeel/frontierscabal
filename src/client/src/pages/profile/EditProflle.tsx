import React, { ChangeEvent } from "react";
import MetaData from "../../MetaData";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import getToken from "../../utils/getToken";
import { updateProfile, clearErrors } from "../../actions/user";
import { isOnline } from "../../utils";
import RDotLoader from "../../components/loaders/RDotLoader";
import { UPDATE_PROFILE_RESET } from "../../constants/user";
import styled from "styled-components";
import { RootState } from "../../store";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { user } = useSelector((state:RootState) => state.user);
  const { error, isUpdated, loading } = useSelector(
    (state:RootState) => state.profile
  );

  const [updatedInfo, setUpdatedInfo] = useState({
    username: "",
    phonenumber: "",
    email: "",
    school: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setUpdatedInfo((prev) => ({
        ...prev,
        username: user.username,
        phonenumber: user.phonenumber,
        email: user.email,
        school: user.school,
        bio: user.bio,
      }));
    }
  }, []);

  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const { username, phonenumber, email, school, bio } = updatedInfo;
  const [avatar, setAvatar] = useState("");

  const handleUpdate = async (e:ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (updatedInfo.bio.split(" ").length > 20) {
      enqueueSnackbar("Your bio should not be more than 20 words", {
        variant: "error",
      });
      return;
    } else if (!emailRegex.test(updatedInfo.email)) {
      enqueueSnackbar("Invalid email address", {
        variant: "error",
      });
      return;
    }

    const authToken: string | undefined = await getToken();
    const formData = new FormData();

    formData.append("username", updatedInfo.username);
    formData.append("phonenumber", updatedInfo.phonenumber);
    formData.append("email", updatedInfo.email);
    formData.append("bio", updatedInfo.bio);
    formData.append("school", updatedInfo.school);
    formData.append("avatar", avatar);

    isOnline() && dispatch<any>(updateProfile(authToken, formData));
  };

  const handleDataChange = (e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result as string) ;
          setAvatar(reader.result as string);
        }
      };

      e.target?.files && reader.readAsDataURL(e.target.files[0]);
    }

    setUpdatedInfo({ ...updatedInfo, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch<any>(clearErrors());
    }
    if (isUpdated) {
      enqueueSnackbar("profile updated!!", { variant: "success" });
      dispatch({ type: UPDATE_PROFILE_RESET });
      navigate(`/profile/${updatedInfo.username}`);
    }
  }, [dispatch, error, isUpdated]);
  return (
    <>
      <MetaData title="Edit-Profile" />
      <EditprofileRenderer>
        <div className="ed-header">
          <h2>Edit profile</h2>
          {avatar && (
            <img
              alt=""
              src={avatarPreview}
              width={85}
              height={85}
              loading="lazy"
              draggable={false}
            />
          )}
        </div>
        <form
          className="ed-form"
          onSubmit={handleUpdate}
          encType="multipart/form-data"
        >
          <div className="ed-input-container">
            <label htmlFor="Username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleDataChange}
              disabled={loading}
              autoFocus
              required
            />
          </div>

          <div className="ed-input-container">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              autoFocus
              onChange={handleDataChange}
              disabled={loading}
              required
            />
          </div>
          <div className="ed-input-row-grp">
          <div className="ed-input-container">
            <label htmlFor="phone">Phone:</label>
            <input
              type="number"
              id="phonenumber"
              name="phonenumber"
              min={0}
              value={phonenumber}
              onChange={handleDataChange}
              disabled={loading}
              required
            />
          </div>
          <div className="ed-input-container">
            <label htmlFor="school">school:</label>
            <input
              type="text"
              id="school"
              name="school"
              placeholder=""
              value={school}
              onChange={handleDataChange}
              disabled={loading}
              required
            />
          </div>
          </div>

          <div className="ed-input-container">
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Tell us about you, not more than 20 words"
              value={bio}
              onChange={handleDataChange}
              disabled={loading}
              required
            />
          </div>
         
          <div className="ed-input-container">
            <label className="avatar" htmlFor="avatar">
              Select profile picture
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              className="ed-avatar-inp"
              accept="image/*"
              onChange={handleDataChange}
            />
          </div>

          <button type="submit" className="update-button" disabled={loading}>
            {loading ? (
              <>
                <RDotLoader />
                <span>Updating...</span>{" "}
              </>
            ) : (
              "Update"
            )}
          </button>
        </form>
      </EditprofileRenderer>
    </>
  );
};

export default EditProfile;

const EditprofileRenderer = styled.div`
  width: 100%;
  min-width: 400px;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  @media (max-width: 767px) {
    &,
    .ed-form,
    .ed-header {
      min-width: 100%;
    }
    h2 {
      font-size: 16px;
      padding: 10px;
    }
  }
  .ed-header {
    display: flex;
    flex-direction: column;
    width: 60%;
  }
  img {
    border: 4px solid #176984;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    margin: 4px 8px;
  }
  .ed-form {
    width: 60%;
    padding: 10px;
    height: fit-content;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #fff;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.12), 0px 2px 4px 0px rgba(0, 0, 0, 0.14);

  }

  .ed-avatar-inp {
    display: none;
  }
  .avatar {
    padding: 4px 8px;
    border-radius: 5px;
    cursor: pointer;
    color: rgb(13, 1, 1);
    margin: 10px;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  .ed-input-row-grp{
    width: 100%;
    display: flex;
    flex-direction:row;
    gap:10px;
  }

  .ed-input-container {
    width: 100%;
    height: fit-content;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .ed-input-container label {
    font-size: 0.75rem;
    color: #8b8e98;
    font-weight: 600;
  }

  .ed-input-container input,
  textarea {
    width: auto;
    height: auto;
    margin-bottom: 5px;
    padding: 15px;
    border-radius: 7px;
    outline: none;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef)
      drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
  }
  .ed-input-container input:focus,
  textarea:focus{
    outline:1px solid #176984;
  }

  .update-button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 20px;
    width: 100%;
    border: none;
    border-radius: 24px;
    outline: none;
    color: rgb(255, 255, 255);
    background-color: #176984;
    font-size: 14px;
    cursor: pointer;
  }
  .update-button span {
    color: #fff;
  }
`;
