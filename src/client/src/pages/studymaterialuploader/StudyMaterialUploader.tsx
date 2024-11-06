import React, { useState, useEffect, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { useSelector, useDispatch } from 'react-redux';
import { addNewPastQuestion, clearErrors } from '../../actions/pastquestion';
import ImageEditor from '../../components/imageEditor/ImageEditor';
import getToken from '../../utils/getToken';
import { isOnline } from '../../utils';
import { NEW_PAST_QUESTION_RESET } from '../../constants/pastQuestion';
import fcabalLogo from '../../assets/logos/fcabal.png';
import { errorParser } from '../../utils';
import axiosInstance from '../../utils/axiosInstance';
import styled from 'styled-components';
import { RootState } from '../../store';
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import Footer from '../../components/footer/Footer';

interface PastQuestionDetails {
  courseTitle: string;
  courseCode: string;
  school: string;
  level: string;
  session: string;
  answer: string;
  reference: string;
  pqImg: string;
}

interface CourseMaterialDetails {
  courseTitle: string;
  courseCode: string;
  level: string;
  session: string;
}

const OCREngine: React.FC = () => {
  const {
    loading: pastquestionLoading,
    success: pastquestionSuccess,
    error: pastquestionError,
  } = useSelector((state: RootState) => state.newPastQuestion);
  const dispatch = useDispatch();
  const [processedImage, setProcessedImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [pqImages, setPqImages] = useState<
    Array<{ dataUrl: string; file: File }>
  >([]);
  const [editImage, setEditImage] = useState<boolean>(false);
  const [croppedImage, setCroppedImage] = useState<string>('');
  const [pastquestionDetails, setPastquestionDetails] =
    useState<PastQuestionDetails>({
      courseTitle: '',
      courseCode: '',
      school: '',
      level: '',
      session: '',
      answer: '',
      reference: '',
      pqImg: '',
    });
  const [isMultiple, setIsMultiple] = useState<boolean>(false);
  const [logo, setLogo] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<{ name: string }>({
    name: '',
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeOption, setActiveOption] = useState<string>('Pastquestion');
  const [courseDoc, setCourseDoc] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [courseMaterialLoading, setCourseMaterialLoading] =
    useState<boolean>(false);
  const [courseMaterialDetails, setCourseMaterialDetails] =
    useState<CourseMaterialDetails>({
      courseTitle: '',
      courseCode: '',
      level: '',
      session: '',
    });

  const [selectedFile, setSelectedFile] = useState<{
    file: string;
    name: string;
  }>({
    file: '',
    name: '',
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelection = (option: string) => {
    setActiveOption(option);
    handleClose();
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedDoc({
        name: e.target.files[0].name,
      });

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setCourseDoc(reader.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCourseMaterialChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCourseMaterialDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Base64 converter
  const convertLogoToBase64 = async (path: string) => {
    try {
      const response = await fetch(path);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error converting logo to base64:', error);
    }
  };

  // OCR generator
  const processImage = async () => {
    try {
      setIsProcessing(true);

      const worker = await createWorker({
        logger: (m) => {
          setStatus(m.status);
          console.log(m);
        },
      });

      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      const {
        data: { text },
      } = await worker.recognize(croppedImage);
      setProcessedImage(text.trim());

      await worker.terminate();
      setIsProcessing(false);
      setSnackbarMessage('OCR captured successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      setIsProcessing(false);
      setSnackbarMessage('Error processing image');
      setSnackbarOpen(true);
    }
  };

  // Pastquestion image selection handler
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'pqImg' && e.target instanceof HTMLInputElement && e.target.files) {
      if (isMultiple) {
        const files = e.target.files;
        const imagePromises = Array.from(files).map(
          (file) =>
            new Promise<{ dataUrl: string; file: File }>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                resolve({ dataUrl: e.target!.result as string, file });
              };
              reader.readAsDataURL(file);
            })
        );

        const imagesData = await Promise.all(imagePromises);
        setPqImages(imagesData);
      } else {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          setSelectedFile({
            file: reader.result as string,
            name: file.name,
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setPastquestionDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const authToken = await getToken();

    if (activeOption === 'Course Material' && courseDoc) {
      if (!courseMaterialDetails.session.includes('/')) {
        setSnackbarMessage(
          'Invalid session. Session must be in this format -> 2020/2021'
        );
        setSnackbarOpen(true);
        return;
      }
      setCourseMaterialLoading(true);
      const formData = new FormData();
      formData.append(
        'courseTitle',
        courseMaterialDetails.courseTitle.toUpperCase()
      );
      formData.append(
        'courseCode',
        courseMaterialDetails.courseCode.toUpperCase()
      );
      formData.append('level', courseMaterialDetails.level);
      formData.append('session', courseMaterialDetails.session);
      formData.append('file', courseDoc);

      try {
        const { data } = await axiosInstance(authToken).post(
          '/api/v1/course-material/new',
          formData
        );
        setCourseMaterialLoading(false);
        setSnackbarMessage(data?.message);
        setSnackbarOpen(true);
        setCourseMaterialDetails({
          courseTitle: '',
          courseCode: '',
          level: '',
          session: '',
        });
        setSelectedDoc({ name: '' });
        setCourseDoc('');
      } catch (err) {
        setCourseMaterialLoading(false);
        setSnackbarMessage(errorParser(err));
        setSnackbarOpen(true);
      }
      return;
    }

    // To upload pastquestion
    await convertLogoToBase64(fcabalLogo);

    if (pqImages.length < 1 && !selectedFile.file) {
      setSnackbarMessage('Pastquestion image is required');
      setSnackbarOpen(true);
      return;
    } else if (!pastquestionDetails.session.includes('/')) {
      setSnackbarMessage(
        'Invalid session. Session must be in this format -> 2020/2021'
      );
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();

    formData.append(
      'courseTitle',
      pastquestionDetails.courseTitle.toUpperCase()
    );
    formData.append('courseCode', pastquestionDetails.courseCode.toUpperCase());
    formData.append('level', pastquestionDetails.level);
    formData.append('session', pastquestionDetails.session);
    formData.append('answer', pastquestionDetails.answer);
    formData.append('school', pastquestionDetails.school.toUpperCase());
    formData.append('reference', pastquestionDetails.reference);
    formData.append('logo', logo);

    if (isMultiple && pqImages.length > 1) {
      pqImages.forEach((image, index) => {
        formData.append(`pqImg${index}`, image.dataUrl);
      });
      formData.append('pqImgTotal', pqImages.length.toString());
    } else {
      formData.append('pqImg', croppedImage || selectedFile.file);
    }

    isOnline() &&
      logo &&
      dispatch<any>(addNewPastQuestion(authToken, formData));
  };

  useEffect(() => {
    if (pastquestionError) {
      setSnackbarMessage(pastquestionError);
      setSnackbarOpen(true);
      dispatch<any>(clearErrors());
    }
    if (pastquestionSuccess) {
      setSnackbarMessage('Uploaded successfully!');
      setSnackbarOpen(true);

      setPastquestionDetails({
        courseTitle: '',
        courseCode: '',
        school: '',
        level: '',
        session: '',
        answer: '',
        reference: '',
        pqImg: '',
      });
      setSelectedFile({
        file: '',
        name: '',
      });
      dispatch({ type: NEW_PAST_QUESTION_RESET });
    }
  }, [dispatch, pastquestionError, pastquestionSuccess]);

  const handleImageEdit = () => {
    setEditImage(true);
  };

  const copyOutput = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(processedImage);
      setSnackbarMessage('Copied to clipboard!');
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage('Failed to copy to clipboard');
      setSnackbarOpen(true);
    }
  };

  return (
    <StyledPaper elevation={1}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} display={`flex`} flexDirection={`column`} alignItems={`center`} justifyContent={`center`}>
        <Box sx={{ display: 'flex',justifyContent: 'space-between', mb: 2 }}  width={`100%`}>
          <Typography variant="h1">{activeOption}</Typography>
          <Button
          size='small'
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
            endIcon={<ExpandMoreIcon />}
          >
            Options
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleSelection('Pastquestion')}>
              Pastquestion
            </MenuItem>
            <MenuItem onClick={() => handleSelection('Course Material')}>
              Course Material
            </MenuItem>
          </Menu>
        </Box>

        {editImage && (
          <ImageEditor
            Image={selectedFile.file}
            onCropImage={setCroppedImage}
            onFinishEdit={() => setEditImage(false)}
            onCancelEdit={() => {
              setCroppedImage('');
              setEditImage(false);
            }}
          />
        )}

        {activeOption === 'Pastquestion' ? (
          <>
            <TextField
             size='small'
              fullWidth
              label="Course Title"
              name="courseTitle"
              value={pastquestionDetails.courseTitle}
              onChange={handleChange}
              required
              margin="normal"
              disabled={pastquestionLoading}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
               size='small'
                fullWidth
                label="Course Code"
                name="courseCode"
                value={pastquestionDetails.courseCode}
                onChange={handleChange}
                required
                margin="normal"
                disabled={pastquestionLoading}
              />
              <TextField
               size='small'
                fullWidth
                label="Level"
                name="level"
                value={pastquestionDetails.level}
                onChange={handleChange}
                required
                margin="normal"
                disabled={pastquestionLoading}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
               size='small'
                fullWidth
                label="Session"
                name="session"
                value={pastquestionDetails.session}
                onChange={handleChange}
                required
                margin="normal"
                disabled={pastquestionLoading}
              />
              <TextField
               size='small'
                fullWidth
                label="School"
                name="school"
                value={pastquestionDetails.school}
                onChange={handleChange}
                required
                margin="normal"
                disabled={pastquestionLoading}
              />
            </Box>
            <TextField
             size='small'
              fullWidth
              label="Answer"
              name="answer"
              value={pastquestionDetails.answer}
              onChange={handleChange}
              multiline
              rows={4}
              margin="normal"
              disabled={pastquestionLoading}
            />
            <TextField
             size='small'
              fullWidth
              label="Reference"
              name="reference"
              value={pastquestionDetails.reference}
              onChange={handleChange}
              required={Boolean(pastquestionDetails.answer)}
              margin="normal"
              disabled={pastquestionLoading}
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                multiple={isMultiple}
                type="file"
                onChange={handleChange}
                name="pqImg"
              />
              <label htmlFor="raised-button-file">
                <Button variant="outlined" component="span" fullWidth sx={{ mt: 2, mb: 2 }}>
                  {selectedFile.name
                    ? `✔${selectedFile.name}`
                    : pqImages.length > 1
                    ? `✔${pqImages.length} image files selected`
                    : "Select pastquestion"}
                </Button>
              </label>
              <div>
              {selectedFile.file && (
                <Button size='small' onClick={handleImageEdit}>
                  Edit Image
                </Button>
              )}
              {croppedImage && (
                <Button
                 size='small'
                  onClick={processImage}
                  disabled={isProcessing}
                  variant="contained"
                  sx={{ mt: 2, mb: 2 }}
                >
                  {isProcessing ? 'Processing...' : 'Process'}
                </Button>
              )}
              </div>
             
              {isProcessing && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Status: {status}
                </Typography>
              )}
              <Button
               size='small'
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={pastquestionLoading}
              >
                {pastquestionLoading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
              {processedImage && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    {`${processedImage.substring(0, 20)}...`}
                  </Typography>
                  <IconButton onClick={copyOutput} size="small">
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              )}
            </>
          ) : (
            <>
              <TextField
               size='small'
                fullWidth
                label="Course Title"
                name="courseTitle"
                value={courseMaterialDetails.courseTitle}
                onChange={handleCourseMaterialChange}
                required
                margin="normal"
                disabled={courseMaterialLoading}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                 size='small'
                  fullWidth
                  label="Course Code"
                  name="courseCode"
                  value={courseMaterialDetails.courseCode}
                  onChange={handleCourseMaterialChange}
                  required
                  margin="normal"
                  disabled={courseMaterialLoading}
                />
                <TextField
                 size='small'
                  fullWidth
                  label="Level"
                  name="level"
                  value={courseMaterialDetails.level}
                  onChange={handleCourseMaterialChange}
                  required
                  margin="normal"
                  disabled={courseMaterialLoading}
                />
              </Box>
              <TextField
               size='small'
                fullWidth
                label="Session"
                name="session"
                value={courseMaterialDetails.session}
                onChange={handleCourseMaterialChange}
                required
                margin="normal"
                disabled={courseMaterialLoading}
              />
              <input
                accept="application/pdf"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleDocChange}
              />
              <label htmlFor="raised-button-file">
                <Button  size='small' variant="outlined" component="span" fullWidth sx={{ mt: 2, }}>
                  {selectedDoc.name
                    ? `✔${selectedDoc.name}`
                    : "Select a PDF Document"}
                </Button>
              </label>
              <Button
               size='small'
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={courseMaterialLoading}
              >
                {courseMaterialLoading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </>
          )}
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />

  
      </StyledPaper>
      
    );
  };
  
  export default OCREngine;
  
  const StyledPaper = styled(Paper)`
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  `;