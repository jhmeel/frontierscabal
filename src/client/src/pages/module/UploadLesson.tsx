import React, { useState, ChangeEvent, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../../utils/axiosInstance";
import { IconPaste, SuccessIcon } from "../../assets/icons";
import { isYouTubeVideoActive } from "../../utils";
import { useParams } from "react-router-dom";
import getToken from "../../utils/getToken";
import { useSnackbar } from "notistack";
import toast from "react-hot-toast";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import Footer from "../../components/footer/Footer";

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
  }, [updateTitle, updateAim, updateLessonUrl, updateLessonIndex]);

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
        name: event.target.files![0].name,
      });
    };
    reader.readAsDataURL(event.target.files![0]);
  };

  const handleUpload = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const authToken = await getToken();
    const { response, loading } = await isYouTubeVideoActive(lessonUrl);
    setLessonUrlValidationLoading(loading);

    if (!response) {
      toast.error(
        "Invalid lesson URL. The URL may be broken; please recopy and paste it."
      );
      return;
    }

    setLessonUrlActive(true);

    if (!title || !aim) {
      toast.error("Incomplete lesson details. Please fill in the form.");
      return;
    }

    const splittedTitle = title.split(":");
    if (splittedTitle.length !== 2 || !splittedTitle[0].startsWith("L")) {
      toast.error(
        "Incompatible lesson title. The title should contain lesson count in this format -> L1: lesson title"
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
      setLessonUrlValidationLoading(loading);

      if (response) {
        setLessonUrlActive(true);
        setLessonUrl(url);
      } else {
        toast.error(
          "Invalid lesson URL. The URL may be broken; please recopy and paste it."
        );
      }
    } catch (error:any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <CreateLessonWrapper>
        <Typography variant="h5" fontWeight={600}>
          {action === "UPDATE" ? `Update Lesson` : `Create Lesson`}
        </Typography>
        <LessonForm onSubmit={handleUpload}>
          <TextField
            label="Title"
            variant="outlined"
            value={title}
            fullWidth
            required
            placeholder="L1: Introduction to web3.0"
            onChange={handleTitleChange}
            margin="normal"
          />
          <TextField
            label="Aim"
            variant="outlined"
            value={aim}
            fullWidth
            required
            multiline
            rows={4}
            onChange={handleAimChange}
            margin="normal"
          />
          <Box display="flex" alignItems="center" position="relative">
            <TextField
              label="Lesson URL (YouTube)"
              variant="outlined"
              value={lessonUrl}
              fullWidth
              required
              disabled={lessonUrlActive}
              onChange={handleLessonUrlChange}
              margin="normal"
            />
            <IconButton onClick={handlePaste} disabled={lessonUrlActive}>
              {lessonUrlValidationLoading ? (
                <CircularProgress size={24} />
              ) : lessonUrlActive ? (
                <SuccessIcon />
              ) : (
                <IconPaste />
              )}
            </IconButton>
          </Box>
          <Box>
            <label htmlFor="material">
              <Typography variant="body2">
                {material.name
                  ? `✔ ${material.name}`
                  : "Select Lesson Material"}
              </Typography>
            </label>
            <input
              type="file"
              id="material"
              accept=".pdf"
              onChange={handleMaterialChange}
              style={{ display: "none" }}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={uploadProgress > 0}
            sx={{ mt: 2 }}
          >
            {action === "UPDATE" ? `Update` : `Create`}
          </Button>
        </LessonForm>
      </CreateLessonWrapper>
      <Footer />
    </>
  );
};

export default UploadLesson;

const CreateLessonWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const LessonForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 5px;
`;
