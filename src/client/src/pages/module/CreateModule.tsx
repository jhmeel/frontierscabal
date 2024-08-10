import React, { useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import { IconImageEditOutline } from "../../assets/icons";
import { RootState } from "../../store";

interface FormProps {
  title?: string;
  code?: string;
  level?: string;
  description?: string;
}

const CreateModule = () => {
  const { theme } = useSelector((state:RootState) => state.theme);
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
          name: e.target.files[0].name,
        });
      }
    };

    e.target.files && reader.readAsDataURL(e.target.files[0]);
  };
  
  const handleSubmit = async (e:ChangeEvent<HTMLFormElement>)=>{
      e.preventDefault()
      const formInfo = {...formData, avatar:avatar.file}
      
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <ModuleForm onSubmit={handleSubmit}>
          {avatar?.file && <img className="module-img" src={avatar.file}/>}
          <div className="input-cont">
            <label>Course Title<span className="required">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              autoFocus
            />
          </div>
          <div className="input-cont">
            <label>Course Code<span className="required">*</span></label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
              autoFocus
            />
          </div>
          <div className="input-cont">
            <label>Description<span className="required">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              autoFocus
            />
          </div>
            <div className="input-cont">
            <label htmlFor="Module-avatar" className="select-avatar">
              {(avatar.name && (
                <>
                  <IconImageEditOutline className="icon" />
                  &nbsp;
                  {avatar.name}
                </>
              )) ||
                "Select an avatar"}
            </label>
            <input
              id="Module-avatar"
              name="avatar"
              type="file"
              accept="image/jpeg, image/png, image/gif"
              onChange={handleAvatar}
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </ModuleForm>
      </ThemeProvider>
    </>
  );
};

export default CreateModule;

const ModuleForm = styled.form`
  max-width: 600px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: auto;
  align-items: center;
  overflow: hidden;
  gap: 10px;
  margin: 0 auto;
  padding-top:10px;
  position: relative;

  h2 {
    padding: 10px 0px 0px 5px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    position: absolute;
    top: 0;
    left: 25px;
  }
  .input-cont {
    width: 100%;
    height: fit-content;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .input-cont label {
    font-size: 14px;
    color: #000000;
    font-weight: 600;
    width: 90%;
  }
  .input-cont input {
    width: 90%;
    height: auto;
    border-radius: 8px;
    outline: none;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef)
      drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
    padding:10px;
    font-size: medium;
  }
  .input-cont input:focus,
  .input-cont textarea:focus {
    border: 2px solid #176984;
  }
  .input-cont textarea {
    width: 90%;
    height: 70px;
    border-radius: 8px;
    outline: none;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef)
      drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
    padding: 10px;
    font-size: medium;
  }
  input[name="avatar"] {
    display: none;
  }
  .select-avatar {
    font-size: 12px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    font-weight: 500;
    cursor: pointer;
    width: fit-content;
    width: 80%;
    text-align: center;
  }
  
  
  .submit-btn {
    padding: 8px 16px;
    background-color: #176984;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    width: fit-content;
    font-size: 12px;
  }
  .submit-btn:hover {
    transform: scale(1.01);
    transition: transform 0.3s ease-out;
  }

  .module-img {
    width: 90%;
    height: 230px;
    object-fit: cover;
    cursor: pointer;
    margin: 5px;
    border-radius: 5px;
    padding: 10px;
    border:2px solid #ededed;
  }

  @media (max-width: 767px) {
    .module-img {
      height: 200px;
    }
  }

  .icon {
    height: 18px;
    width: 18px;
    cursor: pointer;
    fill: #176984;
  }
`;
