import React, { useState, useEffect, useRef } from "react";
import { createWorker } from "tesseract.js";
import { useSelector, useDispatch } from "react-redux";
import RDotLoader from "../../components/loaders/RDotLoader";
import { addNewPastQuestion, clearErrors } from "../../actions/pastquestion";
import ImageEditor from "../../components/imageEditor/ImageEditor";
import { IconCaretDown, IconContentCopy } from "../../assets/icons";
import getToken from "../../utils/getToken";
import { isOnline } from "../../utils";
import { NEW_PAST_QUESTION_RESET } from "../../constants/pastQuestion";
import fcabalLogo from "../../assets/logos/fcabal.png";
import { errorParser } from "../../utils";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useSnackbar } from "notistack";
import { RootState } from "../../store";
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
  const [processedImage, setProcessedImage] = useState<string>("");
  const [isProceessing, setIsProcessing] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [pqImages, setPqImages] = useState<
    Array<{ dataUrl: string; file: File }>
  >([]);
  const [editImage, setEditImage] = useState<boolean>(false);
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [pastquestionDetails, setPastquestionDetails] =
    useState<PastQuestionDetails>({
      courseTitle: "",
      courseCode: "",
      school: "",
      level: "",
      session: "",
      answer: "",
      reference: "",
      pqImg: "",
    });
  const [isMultiple, setIsMultiple] = useState<boolean>(false);
  const [logo, setLogo] = useState<string>("");
  const [selectedDoc, setSelectedDoc] = useState<{ name: string }>({
    name: "",
  });
  const [isTabOpen, setIsTabOpened] = useState<boolean>(false);
  const [courseMaterialLoading, setCourseMaterialLoading] =
    useState<boolean>(false);
  const [activeOption, setActiveOption] = useState<string>("Pastquestion");
  const [courseDoc, setCourseDoc] = useState<string>("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [courseMaterialDetails, setCourseMaterialDetails] =
    useState<CourseMaterialDetails>({
      courseTitle: "",
      courseCode: "",
      level: "",
      session: "",
    });

  const toggleTab = () => {
    setIsTabOpened(!isTabOpen);
  };

  const handleSelection = (it: string) => {
    setActiveOption(it);
    toggleTab();
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDoc({
      name: e.target.files![0].name,
    });

    if (e.target.files![0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setCourseDoc(reader.result as string);
        }
      };
      reader.readAsDataURL(e.target.files![0]);
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

  const tabRef = useRef<HTMLSpanElement>(null);
  const handleClickOutside = (e: MouseEvent) => {
    if (tabRef.current && !tabRef.current.contains(e.target as Node)) {
      setIsTabOpened(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const [selectedFile, setSelectedFile] = useState<{
    file: string;
    name: string;
  }>({
    file: "",
    name: "",
  });

  // Base64 converter
  const convertLogoToBase64 = async (path: string) => {
    fetch(path)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          setLogo(reader.result as string);
        };
        reader.readAsDataURL(blob);
      });
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

      await worker.loadLanguage("eng");
      await worker.initialize("eng");

      const {
        data: { text },
      } = await worker.recognize(croppedImage);
      setProcessedImage(text.trim());

      await worker.terminate();
      setIsProcessing(false);
      toast.success("OCR captured successfully!");
    } catch (err) {
      setIsProcessing(false);
      toast.error(err);
    }
  };

  // Pastquestion image selection handler
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const imagePromises: Promise<{ dataUrl: string; file: File }>[] = [];
    if (isMultiple === true && e.target?.files) {
      const files = e.target.files;
      for (const file of files) {
        const promise = new Promise<{ dataUrl: string; file: File }>(
          (resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({ dataUrl: e.target.result as string, file });
            };
            reader.readAsDataURL(file);
          }
        );
        imagePromises.push(promise);
      }
      const imagesData = await Promise.all(imagePromises);
      imagesData && setPqImages(imagesData);
      return;
    } else {
      const { name, value } = e.target;
      if (name === "pqImg") {
        const reader = new FileReader();

        reader.onload = () => {
          setSelectedFile({
            file: reader.result as string,
            name: e.target?.files![0].name,
          });
        };
        reader.readAsDataURL(e.target?.files![0]);
      }

      setPastquestionDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // To upload course material
    const authToken = await getToken();
    if (activeOption === "Course Material" && courseDoc) {
      if (!courseMaterialDetails.session.includes("/")) {
        toast.error(
          "Invalid session. Session must be in this format -> 2020/2021"
        );
        return;
      }
      setCourseMaterialLoading(true);
      const formData = new FormData();
      formData.append(
        "courseTitle",
        courseMaterialDetails.courseTitle.toUpperCase()
      );
      formData.append(
        "courseCode",
        courseMaterialDetails.courseCode.toUpperCase()
      );
      formData.append("level", courseMaterialDetails.level);
      formData.append("session", courseMaterialDetails.session);
      formData.append("file", courseDoc);

      try {
        const { data } = await axiosInstance(authToken).post(
          "/api/v1/course-material/new",
          formData
        );
        setCourseMaterialLoading(false);
        toast.success(data?.message);
        setCourseMaterialDetails({
          courseTitle: "",
          courseCode: "",
          level: "",
          session: "",
        });
        setSelectedDoc({ name: "" });
        setCourseDoc("");
      } catch (err) {
        setCourseMaterialLoading(false);
        toast.error(errorParser(err));
      }
      return;
    }

    // To upload pastquestion
    await convertLogoToBase64(fcabalLogo);

    if (pqImages.length < 1 && !selectedFile.file) {
      toast.error("Pastquestion image is required");
      return;
    } else if (!pastquestionDetails.session.includes("/")) {
      toast.error(
        "Invalid session. Session must be in this format -> 2020/2021"
      );
      return;
    }

    const formData = new FormData();

    formData.append(
      "courseTitle",
      pastquestionDetails.courseTitle.toUpperCase()
    );
    formData.append("courseCode", pastquestionDetails.courseCode.toUpperCase());
    formData.append("level", pastquestionDetails.level);
    formData.append("session", pastquestionDetails.session);
    formData.append("answer", pastquestionDetails.answer);
    formData.append("school", pastquestionDetails.school.toUpperCase());
    formData.append("reference", pastquestionDetails.reference);
    formData.append("logo", logo);

    if (isMultiple && pqImages.length > 1) {
      for (let i = 0; i < pqImages.length; i++) {
        formData.append(`pqImg${i}`, pqImages[i].dataUrl);
      }
      formData.append("pqImgTotal", pqImages.length.toString());
    } else {
      formData.append("pqImg", croppedImage || selectedFile.file);
    }

    isOnline() &&
      logo &&
      dispatch<any>(addNewPastQuestion(authToken, formData));
  };

  useEffect(() => {
    if (pastquestionError) {
      toast.error(pastquestionError);
      dispatch<any>(clearErrors());
    }
    if (pastquestionSuccess) {
      toast.success("Uploaded successfully!");

      setPastquestionDetails({
        courseTitle: "",
        courseCode: "",
        school: "",
        level: "",
        session: "",
        answer: "",
        reference: "",
        pqImg: "",
      });
      setSelectedFile({
        file: "",
        name: "",
      });
      dispatch({ type: NEW_PAST_QUESTION_RESET });
    }
  }, [dispatch, pastquestionError, pastquestionSuccess]);

  const showPrompt = () => {
    enqueueSnackbar("Are you selecting multiple image files?", {
      variant: "info",
      persist: true,
      action: (key) => (
        <>
          <button
            className="snackbar-btn"
            onClick={() => {
              closeSnackbar();
              setIsMultiple(true);
              document.querySelector("#pq-img")?.click();
            }}
          >
            Yes
          </button>
          <button
            className="snackbar-btn"
            onClick={() => {
              closeSnackbar();
              setIsMultiple(false);
              document.querySelector("#pq-img")?.click();
            }}
          >
            No
          </button>
          <button
            className="snackbar-cancel-btn"
            onClick={() => {
              closeSnackbar();
            }}
          >
            cancel
          </button>
        </>
      ),
    });
  };

  const handleImageEdit = () => {
    setEditImage(true);
  };

  const copyOutput = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(processedImage);
      toast.success("copied to clipboard!");
      return;
    }
    toast.error("failed while copying to clipboard!");
  };

  return (
    <>
      <main>
        <StudyMaterialUploadRenderer
          id="new-pq-form"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <div className="new-pq-form-hd">
            <span
              ref={tabRef}
              className="active-hd-opt"
              title="Study Material Options"
              onClick={toggleTab}
            >
              {activeOption}
              <IconCaretDown className="pq-hd-toggle-icon" />
            </span>
            {isTabOpen && (
              <div className="pq-hd-option">
                <ul>
                  {["Pastquestion", "Course Material"].map((it, i) => (
                    <li key={i} onClick={() => handleSelection(it)}>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {editImage && (
            <ImageEditor
              Image={selectedFile.file}
              onCropImage={setCroppedImage}
              onFinishEdit={() => setEditImage(false)}
              onCancelEdit={() => {
                setCroppedImage("");
                setEditImage(false);
              }}
            />
          )}
          {activeOption === "Pastquestion" ? (
            <>
              <input
                type="text"
                title="Course title"
                name="courseTitle"
                value={pastquestionDetails.courseTitle}
                onChange={handleChange}
                placeholder="Course title"
                required={true}
                autoFocus
                disabled={pastquestionLoading}
              />

              <div className="course-code-level-cont">
                <input
                  type="text"
                  title="Course code"
                  name="courseCode"
                  value={pastquestionDetails.courseCode}
                  onChange={handleChange}
                  placeholder="Course code"
                  required={true}
                  disabled={pastquestionLoading}
                />
                <input
                  type="text"
                  name="level"
                  value={pastquestionDetails.level}
                  title="Level"
                  onChange={handleChange}
                  placeholder="Level"
                  required={true}
                  disabled={pastquestionLoading}
                />
              </div>
              <div className="sesion-school-cont">
                <input
                  type="text"
                  name="session"
                  value={pastquestionDetails.session}
                  title="Session"
                  onChange={handleChange}
                  placeholder="Session"
                  required={true}
                  disabled={pastquestionLoading}
                />
                <input
                  type="text"
                  name="school"
                  value={pastquestionDetails.school}
                  title="School"
                  onChange={handleChange}
                  placeholder="School"
                  required={true}
                  disabled={pastquestionLoading}
                />
              </div>

              <textarea
                name="answer"
                value={pastquestionDetails.answer}
                title="Answer"
                onChange={handleChange}
                placeholder="Answer"
                disabled={pastquestionLoading}
              />
              <textarea
                name="reference"
                value={pastquestionDetails.reference}
                title="Reference"
                onChange={handleChange}
                placeholder="Reference"
                required={pastquestionDetails.answer ? true : false}
                disabled={pastquestionLoading}
              />
              <label className="pq-img" onClick={showPrompt}>
                {selectedFile.name
                  ? `✔${selectedFile.name}`
                  : pqImages.length > 1
                  ? `✔${pqImages.length} image files selected`
                  : "Select pastquestion"}
              </label>
              <input
                id="pq-img"
                name="pqImg"
                type="file"
                accept="image/jpeg, image/png, image/gif"
                onChange={handleChange}
                multiple={isMultiple}
              />
              {selectedFile.file && (
                <span className="image-edit-text" onClick={handleImageEdit}>
                  Edit
                </span>
              )}
              {croppedImage && (
                <button
                  className="process-btn"
                  onClick={processImage}
                  disabled={isProceessing}
                >
                  {isProceessing ? "Processing..." : "Process"}
                  <p>{isProceessing && status}</p>
                </button>
              )}
              <button className="pq-submit-btn" type="submit">
                {pastquestionLoading ? <RDotLoader /> : "Submit"}
              </button>
              {processedImage && (
                <p className="process-output">
                  {`${processedImage.substring(0, 20)}...`}{" "}
                  <span title="Copy" onClick={copyOutput}>
                    <IconContentCopy />
                  </span>
                </p>
              )}
            </>
          ) : (
            <>
              <input
                type="text"
                title="Course title"
                name="courseTitle"
                value={courseMaterialDetails.courseTitle}
                onChange={handleCourseMaterialChange}
                placeholder="Course title"
                required={true}
                autoFocus
                disabled={courseMaterialLoading}
              />
              <div className="course-code-level-cont">
                <input
                  type="text"
                  title="Course code"
                  name="courseCode"
                  value={courseMaterialDetails.courseCode}
                  onChange={handleCourseMaterialChange}
                  placeholder="Course code"
                  required={true}
                  disabled={courseMaterialLoading}
                />
                <input
                  type="text"
                  name="level"
                  value={courseMaterialDetails.level}
                  title="Level"
                  onChange={handleCourseMaterialChange}
                  placeholder="Level"
                  required={true}
                  disabled={courseMaterialLoading}
                />
              </div>
              <input
                type="text"
                name="session"
                value={courseMaterialDetails.session}
                title="Session"
                onChange={handleCourseMaterialChange}
                placeholder="Session"
                required={true}
                disabled={courseMaterialLoading}
              />
              <label className="course-doc-label" htmlFor="course-doc">
                {selectedDoc.name
                  ? `✔${selectedDoc.name}`
                  : "Select a PDF Document"}
              </label>
              <input
                id="course-doc"
                name="course-doc"
                type="file"
                accept=".pdf"
                onChange={handleDocChange}
              />
              <button className="pq-submit-btn" type="submit">
                {courseMaterialLoading ? <RDotLoader /> : "Submit"}
              </button>
            </>
          )}
        </StudyMaterialUploadRenderer>
      </main>
    </>
  );
};

export default OCREngine;

const StudyMaterialUploadRenderer = styled.form`
  max-width: 600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  .course-code-level-cont,
  .sesion-school-cont {
    width: 90%;
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  input {
    width: 95%;
    height: auto;
    font-size: 14px;
    padding: 10px;
    border-radius: 7px;
    outline: none;
    font-weight: 500;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef)
      drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
    margin-top: 10px;
    background-color: #fff;
  }

  input:focus,
  textarea:focus {
    border: 2px solid #176984;
  }
  textarea {
    height: 80px;
    width: 90%;
    font-size: 14px;
    padding: 15px;
    border-radius: 7px;
    outline: none;
    font-weight: 500;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef)
      drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
    margin-top: 10px;
    background-color: #fff;
  }
  input[type="file"] {
    display: none;
  }

  .pq-submit-btn {
    padding: 10px 20px;
    background-color: #176984;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    outline: none;
  }

  .process-btn {
    background-color: transparent;
    border: 1px solid #ededed;
    padding: 10px 20px;
    color: #176984;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }

  .pq-img,
  .course-doc-label {
    font-size: 12px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    font-weight: 600;
    cursor: pointer;
    width: 80%;
    padding: 5px;
  }
  .process-output {
    width: fit-content;
    height: fit-content;
    padding: 5px 10px;
    font-size: 14px;
    text-align: center;
    text-rendering: optimizeLegibility;
    background-color: #e5e5e5;
    border-radius: 5px;
    cursor: pointer;
  }

  .image-edit-text {
    cursor: pointer;
    color: #176984;
  }

  .new-pq-form-hd {
    border-bottom: 1px solid #dedede;
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    width: 100%;
    height: fit-content;
    z-index: 99;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    -moz-backdrop-filter: blur(10px);
    -o-backdrop-filter: blur(10px);
    transform: 0.5s;
  }
  .pq-hd-option {
    position: absolute;
    z-index: 999;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: #fff;
    left: 10px;
    top: 20px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pq-hd-option ul {
    width: 100%;
    font-size: 14px;
    list-style: none;
  }

  .pq-hd-option ul li {
    width: 100%;
    cursor: pointer;
    color: rgb(0, 0, 0);
    border-bottom: 1px solid #ededed;
    padding: 5px 10px;
    font-size: 13px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  .pq-hd-option ul li:hover {
    background-color: #176984;
    color: #fff;
    transition: all 0.3s ease-out;
  }
  .pq-hd-option ul li :last-child {
    border-bottom: none;
  }
  .pq-hd-option ul li :first-child:hover {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .pq-hd-option ul li :last-child:hover {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .pq-hd-toggle-icon,
  .active-hd-opt {
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
  }
`;
