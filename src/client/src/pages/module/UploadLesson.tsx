import React, { useState, ChangeEvent, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../utils/axiosInstance";
import { IconPaste, SuccessIcon } from "../../assets/icons";
import RDotLoader from "../../components/loaders/RDotLoader";
import { isYouTubeVideoActive } from "../../utils";
import { useParams } from "react-router-dom";
import getToken from "../../utils/getToken";
import { useSnackbar } from "notistack";
import toast from "react-hot-toast";

const UploadLesson = ({
  lessonId,
  updateTitle,
  updateAim,
  updateLessonUrl,
  updateLessonIndex,
  action = "NEW",
}: {
  lessonId?: string;
  updateTitle?: string;
  updateAim?: string;
  updateLessonUrl?: string;
  updateLessonIndex?: string;
  action?: "NEW" | "UPDATE";
}) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [aim, setAim] = useState<string>("");
  const [lessonUrl, setLessonUrl] = useState<string>("");
  const [lessonIndex, setLessonIndex] = useState<string>("");
  const [lessonUrlActive, setLessonUrlActive] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (updateTitle && updateAim && updateLessonUrl && updateLessonIndex) {
      setTitle(updateTitle);
      setAim(updateAim);
      setLessonIndex(updateLessonIndex);
      setLessonUrl(updateLessonUrl);
    }
  }, []);

  const [material, setMaterial] = useState<{
    name: string;
    file: string;
  }>({
    name: "",
    file: "",
  });
  const [lessonUrlValidationLoading, setLessonUrlValidationLoading] =
    useState<boolean>(false);

  const params = useParams();

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleAimChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAim(event.target.value);
  };

  const handleLessonUrlChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const url = event.target.value;
    setLessonUrl(url);
  };

  const handleMaterialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    reader.onload = () => {
      setMaterial({
        file: reader.result as string,
        name: event.target.files[0].name,
      });
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const handleUpload = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const authToken = await getToken();
    const { response, loading } = await isYouTubeVideoActive(lessonUrl);
    setLessonUrlValidationLoading(loading);

    if (!response) {
      toast.error(
        "Invalid lesson URL.\n The URL may be broken; please recopy and paste it"
      );
      return;
    }

    setLessonUrlActive(true);

    if (!title || !aim) {
      toast.error("Incomplete lesson details.\n Please fill in the form");
      return;
    }

    const splittedTitle = title.split(":");
    if (splittedTitle.length !== 2 || !splittedTitle[0].startsWith("L")) {
      toast.error(
        "Incompatible lesson title.\n The title should contain lesson count in this format -> L1: lesson title"
      );
      return;
    }
    setLessonIndex(splittedTitle[0][1]);

    const formData = new FormData();
    formData.append("lessonTitle", title);
    formData.append("lessonAim", aim);
    formData.append("lessonUrl", lessonUrl);
    formData.append("lessonIndex", lessonIndex);
    formData.append("lessonMaterial", material.file);

    try {
      if (action === "NEW") {
        const { data } = await axiosInstance(authToken).post(
          `api/v1/module/lesson/new/${params?.moduleId}`,
          formData,
          {
            onUploadProgress(progressEvent) {
              const progress = Math.round(
                (progressEvent.loaded / progressEvent!.total) * 100
              );
              setUploadProgress(progress);
            },
          }
        );
        enqueueSnackbar(data.message, { variant: "success" });
      } else {
        //update lesson
        const { data } = await axiosInstance(authToken).put(
          `api/v1/module/lesson/update/${lessonId}`,
          formData,
          {
            onUploadProgress(progressEvent) {
              const progress = Math.round(
                (progressEvent.loaded / progressEvent!.total) * 100
              );
              setUploadProgress(progress);
            },
          }
        );
        enqueueSnackbar(data.message, { variant: "success" });
      }
    } catch (err: any) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  const handlePaste = async () => {
    try {
      const url = await navigator.clipboard.readText();

      if (!url) return;

      const { response, loading } = await isYouTubeVideoActive(url);

      if (loading) {
        setLessonUrlValidationLoading(loading);
      }

      if (response) {
        setLessonUrlActive(true);
        setLessonUrl(url);
      } else {
        toast.error(
          "Invalid lesson URL.\n The URL may be broken; please recopy and paste it"
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <CreateLessonWrapper>
      <LessonForm onSubmit={handleUpload}>
        <div className="input-cont">
          <label htmlFor="title">Title<span className="required">*</span></label>
          <input
            type="text"
            id="title"
            value={title}
            autoFocus
            required
            placeholder="L1: Introduction to web3.0"
            onChange={handleTitleChange}
          />
        </div>
        <div className="input-cont">
          <label htmlFor="aim">Aim<span className="required">*</span></label>
          <textarea required id="aim" value={aim} onChange={handleAimChange} />
        </div>
        <div className="input-cont">
          <div>
            <label htmlFor="video" title="Lesson Youtube url">
              Lesson URL (Youtube)<span className="required">*</span>
            </label>
            <span
              title={!lessonUrlActive ? "Paste" : "Active"}
              className="verified"
            >
              {!lessonUrl && !lessonUrlActive ? (
                <IconPaste onClick={handlePaste} className="icon" />
              ) : lessonUrlValidationLoading ? (
                <RDotLoader />
              ) : (
                lessonUrlActive && <SuccessIcon className="icon" />
              )}
            </span>
            <input
              type="text"
              autoFocus
              required
              value={lessonUrl}
              disabled={lessonUrlActive}
              onChange={handleLessonUrlChange}
            />
          </div>
        </div>
        <div className="material-cont">
          <div>
            {" "}
            <label htmlFor="material" title="Select Material">
              {material.name ? `✔ ${material.name}` : "Select Lesson Material"}
            </label>
            <input
              type="file"
              id="material"
              accept=".pdf"
              onChange={handleMaterialChange}
            />
          </div>
        </div>
        <button
          className="upload-btn"
          type="submit"
          disabled={uploadProgress > 0 ? true : false}
        >
          {action == "UPDATE" ? `Update` : `Create`}
        </button>
      </LessonForm>
    </CreateLessonWrapper>
  );
};

export default UploadLesson;

const CreateLessonWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  overflow: hidden;
`;

const LessonForm = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 10px 5px;
  border-radius: 5px;
  max-width: 600px;
  @media (max-width: 767px) {
    & {
      width: 100%;
      margin: 0 auto;
    }
  }
  .input-cont {
    width: 100%;
    height: fit-content;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 5px 10px;
  }
  .verified {
    position: absolute;
    bottom: 30px;
    right: 90px;
  }
  .input-cont label {
    font-size: 14px;
    color: #000000;
    font-weight: 600;
    width: 90%;
  }
  .input-cont input,
  .input-cont textarea {
    width: 90%;
    height: auto;
    border-radius: 8px;
    outline: none;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef)
      drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
    padding: 10px;
    font-size: medium;
  }
  input:focus,
  textarea:focus {
    border: 2px solid #176984;
  }
  #video,
  #material {
    display: none;
  }

  .video-cont label {
    border: 1px solid #ededed;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 13px;
    color: grey;
    font-weight: 500;
    background: #fff;
    cursor: pointer;
  }
  ::placeholder {
    font-size: 12px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  .material-cont label {
    font-size: 12px;
    color: grey;
    font-weight: 500;
    cursor: pointer;
  }
  .video-cont,
  .material-cont {
    width: 90%;
    height: fit-content;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 5px 10px;
  }
  video,
  img {
    height: 50px;
    width: 50px;
    border-radius: 5px;
    border: 1px solid #ededed;
  }
  .icon {
    position: absolute;
    height: 16px;
    width: 16px;
    cursor: pointer;
    fill: #176984;
    z-index: 10;
  }
  .tick {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9;
  }
  .upload-btn {
    padding: 8px 16px;
    background: #176984;
    color: #fff;
    cursor: pointer;
    width: fit-content;
    font-size: 12px;
    margin-left: 10px;
    border-radius: 4px;
    border: none;
  }
  .upload-btn:hover {
    transform: scale(1.01);
    transition: transform 0.3s ease-out;
  }
`;
