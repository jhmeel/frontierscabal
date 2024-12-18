import React, { useState, useEffect } from "react";
import {
  IconBxsBookmarkAlt,
  IconFileDocument,
  IconDownload,
  IconBookshelf,
} from "../../assets/icons";
import { FormattedCount, errorParser } from "../../utils/formatter";
import getToken from "../../utils/getToken";
import { useDispatch, useSelector } from "react-redux";
import { deletePastQuestion, clearErrors } from "../../actions/pastquestion";
import { DELETE_PAST_QUESTION_RESET } from "../../constants/pastQuestion";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { isOnline } from "../../utils";
import SpinLoader from "../loaders/SpinLoader";
import LocalForageProvider from "../../utils/localforage";
import {
  getUserDetails,
  clearErrors as clearUserError,
} from "../../actions/user";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import toast from "react-hot-toast";
import styled, { ThemeProvider } from "styled-components";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { RootState } from "../../store";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { Box, Button, Drawer, Typography } from "@mui/material";
const StudyMaterialItem = ({
  _id,
  tag,
  courseTitle,
  sch,
  session,
  downloads,
  postedBy,
  type = "PQ",
}: {
  _id: string;
  tag: string;
  courseTitle: string;
  session: string;
  downloads: number;
  postedBy: any;
  type?: string;
  sch?: string;
}) => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const [filename, setFilename] = useState("");
  const [href, setHref] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState("Idle");
  const [controller, setController] = useState(null);
  const [downloadPointerVisible, setIsDownloadPointerVisible] = useState(false);
  const [courseMaterialDeleteLoading, setCourseMaterialDeleteLoading] =
    useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  let {
    loading: detailsLoading,
    user,
    error: detailsError,
  } = useSelector((state: RootState) => state.userDetails);

  const {
    loading: PastquestionDeleteLoading,
    success,
    error,
  } = useSelector((state: RootState) => state.deletePastQuestion);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch<any>(clearErrors());
    } else if (success) {
      toast.success("Deleted successfully!");
      dispatch({ type: DELETE_PAST_QUESTION_RESET });
      window.location.reload();
    }
  }, [dispatch, success, error, toast]);

  useEffect(() => {
    if (href) {
      const downloadLink = document.createElement("a");
      downloadLink.href = href;
      downloadLink.download = filename;

      document.body.appendChild(downloadLink);

      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }, [href]);

  const DeletePq = async () => {
    const authToken = await getToken();
    if (!authToken) {
      showAuthDialogue();
      return;
    }
    dispatch<any>(deletePastQuestion(authToken, _id));
  };

  const deleteCourseMaterial = async () => {
    setCourseMaterialDeleteLoading(true);
    const authToken = await getToken();
    if (!authToken) {
      showAuthDialogue();
      return;
    }
    try {
      const { data } = await axiosInstance(authToken).delete(
        `/api/v1/course-material/${_id}`
      );
      setCourseMaterialDeleteLoading(false);
      toast.error(data?.message);
      window.location.reload();
    } catch (err) {
      setCourseMaterialDeleteLoading(false);
      toast.error(errorParser(err));
    }
  };

  const showConfirmation = async () => {
    try {
      await fetchUser();
      if (
        user?.username === postedBy?.username ||
        user?.role === "FC:SUPER:ADMIN"
      ) {
        toast((t) => (
          <div>
            <p>{`Are you sure you want to Delete ${courseTitle}`}</p>
            <Button
              onClick={() => {
                if (type === "PQ") {
                  toast.dismiss(t.id);
                  DeletePq();
                } else {
                  toast.dismiss(t.id);
                  deleteCourseMaterial();
                }
              }}
              color="primary"
            >
              Proceed
            </Button>
            <Button
              onClick={() => {
                toast.dismiss(t.id);
                handleViewDocument();
              }}
            >
              View document
            </Button>
          </div>
        ));
      } else {
        handleViewDocument();
      }
    } catch (err) {
      enqueueSnackbar(errorParser(err), { variant: "error" });
    }
  };

  const fetchUser = async () => {
    const authToken = await getToken();
    let username: string = await LocalForageProvider.getItem("FC:USERNAME");
    username && dispatch<any>(getUserDetails(username, authToken));
  };

  useEffect(() => {
    if (detailsError) {
      toast.error(detailsError);
      dispatch<any>(clearUserError());
    }
  }, [dispatch, detailsError]);

  const showAuthDialogue = () => {
    toast((t) => (
      <div>
        <p>Please signup to complete your action!</p>
        <Button
          onClick={() => {
            toast.dismiss(t.id);
            navigate("/signup");
          }}
          color="primary"
        >
          Signup
        </Button>
        <Button onClick={() => toast.dismiss(t.id)}>Cancel</Button>
      </div>
    ));
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    setController(source);
    return () => {
      if (source) {
        source.cancel("Download cancel");
      }
    };
  }, [controller]);

  const handleCancel = () => {
    if (controller) {
      controller.cancel();
      setController(null);
      setDownloadStatus("Cancelled");
    }
  };
  const handleDownload = async () => {
    try {
      const authToken = await getToken();
      if (!isOnline()) {
        toast.error("Check your internet connection and try again!!");
        return;
      } else if (!authToken) {
        showAuthDialogue();
        return;
      }
      setDownloadLoading(true);
      setDownloadStatus("Downloading");

      const cancelTokenSource = axios.CancelToken.source();

      const endpoint =
        type === "PQ"
          ? `/api/v1/past-question/download/${_id}`
          : `/api/v1/course-material/download/${_id}`;

      const response = await axiosInstance(authToken).get(endpoint, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setDownloadProgress(percentCompleted);
        },
        cancelToken: cancelTokenSource.token,
      });

      const filename = `FC:${courseTitle}:${session}.pdf`;
      const blob = new Blob([response.data], { type: "application/pdf" });
      const href = URL.createObjectURL(blob);
      setHref(href);
      setFilename(filename);
      setDownloadLoading(false);
    } catch (err) {
      if (!axios.isCancel(err)) {
        toast.error(errorParser(err));
        setDownloadStatus("Failed");
      }
      setDownloadLoading(false);
    }
  };

  const handleViewDocument = async () => {
    if (!href) {
      await handleDownload();
    }
    setDrawerOpen(true);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <>
      {(courseMaterialDeleteLoading || PastquestionDeleteLoading) && (
        <SpinLoader />
      )}
      <StudyMaterialItemRenderer onDoubleClick={showConfirmation}>
        <div className="pq-tags">
          <span className="pq-tag" title="Course code">
            {type === "PQ" ? `PQ | ${tag}` : `CM | ${tag}`}
          </span>
          <span
            title={downloadLoading ? "Downloading..." : "Download"}
            className="pq-dowload-icon"
          >
            {downloadLoading ? (
              <div
                className="circular-progress"
                onDoubleClick={() => {
                  if (downloadStatus === `Downloading`) {
                    handleCancel();
                  }
                }}
              >
                <CircularProgressbar
                  value={downloadProgress}
                  text={`${downloadProgress}%`}
                  styles={{
                    text: {
                      fill: "#176984",
                    },
                  }}
                />
              </div>
            ) : (
              <IconDownload height="20" width="20" onClick={handleDownload} />
            )}
          </span>
          <span
            className="download-pointer"
            style={{
              visibility: downloadPointerVisible ? "visible" : "hidden",
            }}
          >
            Click the icon to download the material
          </span>
        </div>
        <div
          className="pq-image-holder"
          onClick={() => {
            !downloadLoading && setIsDownloadPointerVisible(true);
            setTimeout(() => setIsDownloadPointerVisible(false), 1000);
          }}
        >
          {type === "PQ" ? (
            <IconFileDocument fill="#fff" className="pq-img" />
          ) : (
            <IconBookshelf fill="#fff" className="pq-img" />
          )}
        </div>
        <div className="pq-details">
          <span title="Course title" className="pq-course-title">
            {courseTitle?.length > 35
              ? `${courseTitle?.slice(0, 35)}...`
              : courseTitle}
          </span>
          {type === "PQ" && (
            <span title="School" className="pq-sch">
              {sch}
            </span>
          )}
        </div>
        <div className="stats">
          <div title="session">{session}</div>
          <div className="pq-download-count" title="Downloads">
            <IconBxsBookmarkAlt fill="#176984" height="18" width="18" />
            &nbsp;|
            <span>{FormattedCount(downloads)}</span>
          </div>
        </div>

        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ p: 2, height: "80vh", overflow: "auto" }}>
            <Document file={href} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber(pageNumber - 1)}
              >
                Previous
              </Button>
              <Typography>
                Page {pageNumber} of {numPages}
              </Typography>
              <Button
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber(pageNumber + 1)}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Drawer>
      </StudyMaterialItemRenderer>
    </>
  );
};

export default StudyMaterialItem;

const StudyMaterialItemRenderer = styled.div`
  position: relative;
  color: #2e2e2f;
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ededed;
  margin-bottom: 1rem;
  max-width: 600px;
  width: 96%;
  max-height: 220px;
  overflow: hidden;
  cursor: pointer;

  .circular-progress {
    height: 45px;
    width: 45px;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    & {
      min-width: 96%;
      margin: 0 auto;
    }

    .circular-progress {
      height: 30px;
      width: 30px;
    }
  }

  .pq-dowload-icon {
    cursor: pointer;
  }

  .pq-details {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
    padding: 5px;
  }
  .pq-course-title {
    display: inline-block;
    width: fit-content;
    padding: 3px 6px;
    font-size: 14px;
    font-weight: 500;
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
      sans-serif;
    text-transform: capitalize;
    text-align: center;
  }
  .pq-sch {
    display: inline-block;
    width: fit-content;
    background-color: #176984;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 600;
    color: #fff;
  }

  .task:hover {
    box-shadow: rgba(99, 99, 99, 0.3) 0px 2px 8px 0px;
    border-color: rgba(162, 179, 207, 0.2) !important;
  }
  .pq-image-holder {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    background-color: #176984;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    animation: animate 0.6s linear alternate-reverse infinite;
    -webkit-animation: animate 0.6s linear alternate-reverse infinite;
    -moz-animation: animate 0.6s linear alternate-reverse infinite;
    -o-animation: animate 0.6s linear alternate-reverse infinite;
    transition: 0.6s ease;
  }
  .pq-img {
    width: 2rem;
    height: 2rem;
  }

  .task p {
    font-size: 15px;
    margin: 1.2rem 0;
  }

  .pq-tag {
    border-radius: 100px;
    padding: 4px 13px;
    font-size: 12px;
    color: #ffffff;
    background-color: #176984;
  }

  .pq-tags {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .stats {
    width: 100%;
    color: #9fa4aa;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
  }

  .pq-download-count {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .pq-download-count span {
    text-align: center;
    font-weight: 600;
    color: #176984;
    padding: 2px;
    position: relative;
  }
  @keyframes animate {
    from {
      transform: scale(1);
    }

    to {
      transform: scale(1.09);
    }
  }

  .snackbar-btn {
    padding: 6px 12px;
    color: #000;
    border: none;
    border-radius: 5px;
    margin-right: 5px;
    cursor: pointer;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }

  .download-pointer {
    color: #fff;
    background-color: #000;
    padding: 5px 10px;
    border-radius: 5px;
    opacity: 1;
    transition-duration: 1s;
    position: absolute;
    z-index: 1;
    visibility: hidden;
    text-align: center;
    width: fit-content;
    top: 50px;
    right: 10px;
    font-size: 12px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }

  .download-pointer::after {
    content: "";
    position: absolute;
    top: -15px;
    right: 8px;
    border: 8px solid transparent;
    border-bottom-color: rgb(0, 0, 0);
  }
`;
