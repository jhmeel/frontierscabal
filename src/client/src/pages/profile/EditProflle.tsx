import React, { ChangeEvent, useEffect, useState } from "react";
import MetaData from "../../MetaData";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, clearErrors } from "../../actions/user";
import getToken from "../../utils/getToken";
import { isOnline } from "../../utils";
import RDotLoader from "../../components/loaders/RDotLoader";
import { UPDATE_PROFILE_RESET } from "../../constants/user";
import { RootState } from "../../store";
import { Button, TextField, Typography, Avatar, Box, Paper, Grid } from "@mui/material";
import styled from "styled-components";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const { error, isUpdated, loading } = useSelector((state: RootState) => state.profile);

  const [updatedInfo, setUpdatedInfo] = useState({
    username: "",
    phonenumber: "",
    email: "",
    school: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setUpdatedInfo({
        username: user.username,
        phonenumber: user.phonenumber,
        email: user.email,
        school: user.school,
        bio: user.bio,
      });
    }
  }, [user]);

  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatar, setAvatar] = useState("");

  const handleUpdate = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (updatedInfo.bio.split(" ").length > 20) {
      enqueueSnackbar("Your bio should not be more than 20 words", { variant: "error" });
      return;
    } else if (!emailRegex.test(updatedInfo.email)) {
      enqueueSnackbar("Invalid email address", { variant: "error" });
      return;
    }

    const authToken = await getToken();
    const formData = new FormData();
    formData.append("username", updatedInfo.username);
    formData.append("phonenumber", updatedInfo.phonenumber);
    formData.append("email", updatedInfo.email);
    formData.append("bio", updatedInfo.bio);
    formData.append("school", updatedInfo.school);
    formData.append("avatar", avatar);

    isOnline() && dispatch(updateProfile(authToken, formData));
  };

  const handleDataChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result as string);
          setAvatar(reader.result as string);
        }
      };

      e.target?.files && reader.readAsDataURL(e.target.files[0]);
    } else {
      setUpdatedInfo({ ...updatedInfo, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch<any>(clearErrors());
    }
    if (isUpdated) {
      enqueueSnackbar("Profile updated!!", { variant: "success" });
      dispatch({ type: UPDATE_PROFILE_RESET });
      navigate(`/profile/${updatedInfo.username}`);
    }
  }, [dispatch, error, isUpdated, enqueueSnackbar, navigate, updatedInfo.username]);

  return (
    <>
      <MetaData title="Edit Profile" />
      <StyledEditProfile>
        <Paper elevation={1} className="edit-profile-container">
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Edit Profile
          </Typography>

          <Box display="flex" alignItems="center" flexDirection="column" className="profile-avatar">
            {avatarPreview && (
              <Avatar src={avatarPreview} alt="Avatar" sx={{ width: 85, height: 85 }} />
            )}
          </Box>

          <form onSubmit={handleUpdate} encType="multipart/form-data">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  name="username"
                  value={updatedInfo.username}
                  onChange={handleDataChange}
                  fullWidth
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={updatedInfo.email}
                  onChange={handleDataChange}
                  fullWidth
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  name="phonenumber"
                  type="number"
                  value={updatedInfo.phonenumber}
                  onChange={handleDataChange}
                  fullWidth
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="School"
                  name="school"
                  value={updatedInfo.school}
                  onChange={handleDataChange}
                  fullWidth
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Bio"
                  name="bio"
                  value={updatedInfo.bio}
                  onChange={handleDataChange}
                  fullWidth
                  multiline
                  required
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="avatar">
                  <input
                    style={{ display: "none" }}
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleDataChange}
                  />
                  <Button component="span" variant="outlined" color="primary">
                    Upload Avatar
                  </Button>
                </label>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  className="update-button"
                >
                  {loading ? (
                    <>
                      <RDotLoader />
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </StyledEditProfile>
    </>
  );
};

export default EditProfile;

const StyledEditProfile = styled.div`
  width: 100%;
  max-width: 600px;
  height: 100vh;
  display: flex;
  justify-content: center;

  .edit-profile-container {
    width: 60%;
    padding: 20px;
    border-radius: 12px;
  }

  .profile-avatar {
    margin-bottom: 16px;
  }

  @media (max-width: 767px) {
    .edit-profile-container {
      width: 100%;
      padding: 16px;
    }

    h4 {
      font-size: 16px;
    }
  }

  .update-button {
    margin-top: 16px;
  }
`;
