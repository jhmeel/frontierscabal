import React, { useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { Button, TextField, Typography, Avatar, Box } from "@mui/material";
import styled from "styled-components";
import { IconImageEditOutline } from "../../assets/icons";
import { RootState } from "../../store";
import Footer from "../../components/footer/Footer";

interface FormProps {
  title?: string;
  code?: string;
  level?: string;
  description?: string;
}

const CreateModule = () => {
  const [avatar, setAvatar] = useState({ file: "", name: "" });
  const [formData, setFormData] = useState<FormProps>({
    title: "",
    code: "",
    level: "",
    description: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar({
          file: reader.result as string,
          name: e.target.files![0].name,
        });
      }
    };

    e.target.files && reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formInfo = { ...formData, avatar: avatar.file };
   
  };

  return (
    <>
      <StyledBox>
      <Typography variant="h5" fontWeight={600}>
      Create Module
      </Typography>
        <ModuleForm onSubmit={handleSubmit}>
          {avatar?.file && (
            <Avatar
              src={avatar.file}
              alt="Module Avatar"
              sx={{ width: 150, height: 150, mb: 2 }}
            />
          )}

          <TextField
            label="Course Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="Course Code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            required
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            required
            fullWidth
            sx={{ mb: 2 }}
          />

          <label htmlFor="Module-avatar" className="select-avatar">
            <Button variant="outlined" component="label" size="small">
              {(avatar.name && (
                <>
                  <IconImageEditOutline className="icon" />
                  &nbsp;
                  {avatar.name}
                </>
              )) || "Select an avatar"}
              <input
                id="Module-avatar"
                name="avatar"
                type="file"
                accept="image/jpeg, image/png, image/gif"
                onChange={handleAvatar}
                hidden
              />
            </Button>
          </label>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            className="submit-btn"
          
          >
            Submit
          </Button>
        </ModuleForm>
      </StyledBox>
      <Footer />
    </>
  );
};

export default CreateModule;

const StyledBox = styled(Box)`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  
`;

const ModuleForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  .select-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon {
    height: 18px;
    width: 18px;
    fill: #176984;
  }
`;
