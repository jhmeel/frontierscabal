import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  IconAddOutline,
  IconBookshelf,
  IconBxsCommentDetail,
  IconChevronLeft,
  IconClock,
  IconDotsVertical,
  IconLock,
  IconPlayCircle,
} from "../../assets/icons";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { isOnline, getVideoDuration } from "../../utils";
import { enqueueSnackbar, useSnackbar } from "notistack";
import Player from "../../lib/player";
import axiosInstance from "../../utils/axiosInstance";
import getToken from "../../utils/getToken";
import vid1 from "../../assets/_danish__.zehen__-20230611-0001.mp4";
import vid2 from "../../assets/_foyr-20230513-0001.mp4";
import vid3 from "../../assets/2c2b5204d914479c9935a7d529d79002.mp4";
import vid4 from "../../assets/2ec83c3ca9d24a51a1a71cf59028fddb.mp4";
import vid5 from "../../assets/04b4ccdd02fd467e896d3491fbbd3eaa.mp4";
import vid6 from "../../assets/11d04b3cad78434f86782edf6b0f87ff.mp4";
import { IModule } from "../../types";
const Module: React.FC = (): React.ReactElement => {
  const [activeTab, setActiveTab] = useState<string>("MODULE");
  const [isPlayerActive, setPlayerActive] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [moduleDetails, setModuleDetails] = useState<IModule | null>(null);
  const [moduleLessons, setModuleLesson] = useState<Array<any> | null>(null);
  const [moduleErr, setModuleErr] = useState<any>(null);

  const demoDetails: IModule = {
    title: "Introduction to anatomy",
    description:
      "Get to know about anatomy, major landmarks in the body and planes.",
    avatar: {
      secureUrl: "",
    },
    lessonCount: 6,
    lessons: [
      {
        lessonTitle: "Introduction to anatomy",
        lessonIndex: "1",
        description:
          "Get to know about anatomy, major landmarks in the body and planes.",
        lessonUrl: vid1,
        duration: 23,
        isWatched: true,
        progress: 20,
        lessonMaterial: "/",
      },
      {
        lessonIndex: "2",
        lessonTitle: "Introduction to the mamary gland",
        description: "Get to know more about the breast.",
        lessonUrl: vid2,
        duration: 23,
        isWatched: false,
        progress: 10,
        lessonMaterial: "/",
      },
      {
        lessonIndex: "3",
        lessonTitle: "Introduction to the mamary gland",
        description: "Get to know more about the breast.",
        lessonUrl: vid3,
        duration: 23,
        isWatched: false,
        progress: 10,
        lessonMaterial: "/",
      },
      {
        lessonIndex: "4",
        lessonTitle: "Introduction to the mamary gland",
        description: "Get to know more about the breast.",
        lessonUrl: vid4,
        duration: 23,
        isWatched: true,
        progress: 10,
        lessonMaterial: "/",
      },
      {
        lessonIndex: "5",
        lessonTitle: "Introduction to the mamary gland",
        description: "Get to know more about the breast.",
        lessonUrl: vid5,
        duration: 23,
        isWatched: false,
        progress: 10,
        lessonMaterial: "/",
      },
      {
        lessonIndex: "6",
        lessonTitle: "Introduction to the mamary gland",
        description: "Get to know more about the breast.",
        lessonUrl: vid6,
        duration: 23,
        isWatched: true,
        progress: 10,
        lessonMaterial: "/",
      },
    ],
  };

  useEffect(() => {
    // const getModule = async () => {
    //   const authToken = await getToken();
    //   try {
    //     const { data } = await axiosInstance(authToken).get(
    //       `/api/v1/module/${params.moduleId}`
    //     );
    //     setModuleDetails(data?.module);
    //     setModuleLesson(data?.lessons);
    //     const lessonsWithDurations = await Promise.all(
    //       data?.lessons.map(async (lesson: any) => {
    //         const duration = await getVideoDuration(lesson.lessonUrl);
    //         return {
    //           ...lesson,
    //           lessonId: lesson._id,
    //           lessonUrl: lesson?.lessonMaterial.secureUrl,
    //           duration,
    //           isWatched: false,
    //           progress: 0,
    //         };
    //       })
    //     );

    //     setModuleLesson(lessonsWithDurations);
    //   } catch (err: any) {
    //     enqueueSnackbar(err.message, { variant: "error" });
    //     setModuleErr(err);
    //   }
    // };

    // isOnline() && getModule();

    setModuleDetails(demoDetails);
    setModuleLesson(demoDetails?.lessons);
  }, [moduleErr, enqueueSnackbar]);

  const onPlay = () => {
    setActiveTab("PLAYLIST");
  };

  const changeTab = (tab: "MODULE" | "PLAYLIST") => {
    setActiveTab(tab);
  };

  const newLesson = () => {
    navigate(`/lesson/new/${params.moduleId}`);
  };
  return (
    <>
      <ModuleRenderer>
        <header className="module-header">
          <span
            onClick={() => changeTab("MODULE")}
            className={activeTab === "MODULE" ? "activeTab" : "nonActive"}
          >
            <IconBookshelf className="icon" /> Module |
          </span>
          <span
            onClick={() => changeTab("PLAYLIST")}
            className={activeTab === "PLAYLIST" ? "activeTab" : "nonActive"}
          >
            <IconBxsCommentDetail className="icon" /> Playlist
          </span>
        </header>
        {activeTab === "MODULE" && moduleDetails && (
          <div className="module-details">
            <div>
              <h2 className="module_title">{moduleDetails?.title}</h2>
              <p className="module-desc">{moduleDetails?.description}</p>
            </div>
            <img
              loading="lazy"
              className="module-banner"
              src={moduleDetails?.avatar.secureUrl}
              alt="module Banner"
            />
          </div>
        )}
        {activeTab === "MODULE" && moduleLessons && (
          <ModuleTableCont>
            <ModulePreHeader>
              <h3>Module</h3>
              <span className="lesson-count">
                {moduleDetails?.lessonCount > 1
                  ? `${moduleDetails?.lessonCount} Lessons`
                  : `${moduleDetails?.lessonCount} Lesson`}
              </span>
            </ModulePreHeader>
            {moduleLessons.map((les, i) => (
              <LessonCardItem
                key={i}
                lessonId={les._id}
                moduleId={moduleDetails._id}
                title={les?.lessonTitle}
                duration={les?.duration}
                isWatched={les?.isWatched}
                progress={les?.progress}
                lessonIndex={les?.lessonIndex}
                handlePlayLesson={onPlay}
              />
            ))}
            <div className="add-new-lesson">
              <button onClick={newLesson}>
                <IconAddOutline className="icon" fill="#fff" />
                &nbsp; Add Lesson
              </button>
            </div>
          </ModuleTableCont>
        )}
      </ModuleRenderer>

      {activeTab === "PLAYLIST" && (
        <Playlist>
          <span
            title="back"
            className="back"
            onClick={() => changeTab("MODULE")}
          >
            <IconChevronLeft />| back
          </span>
          <div className="player-cont">
            <Player
              lessonsMedia={moduleLessons}
              moduleTitle={moduleDetails?.title}
            />
          </div>
        </Playlist>
      )}
    </>
  );
};

const LessonCardItem = ({
  lessonId,
  moduleId,
  title,
  lessonIndex,
  isWatched,
  progress,
  duration,
  handlePlayLesson,
}: {
  moduleId: string;
  lessonId: string;
  title: string;
  lessonIndex: number;
  isWatched: boolean;
  progress: number;
  duration: number;
  handlePlayLesson: () => void;
}) => {
  const [menuActive, setMenuActive] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [newY, setNewY] = useState<number>(0);
  const navigate = useNavigate();

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setMenuActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const showMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.scrollY === 0) {
      setNewY(e.clientY - 280);
    } else {
      setNewY(e.clientY - 250);
    }
    setMenuActive(!menuActive);
  };

  const toggleMenuActive = () => {
    setMenuActive(!menuActive);
  };

  const deleteLesson = async () => {
    toggleMenuActive();
    const authToken = await getToken();
    try {
      const { data } = await axiosInstance(authToken).get(
        `/api/v1/module/lesson/delete?moduleId=${moduleId}&lessonId=${lessonId}`
      );

      enqueueSnackbar(data?.message, { variant: "success" });
    } catch (err: any) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  const editLesson = () => {
    navigate(`/lesson/update/${lessonId}`);
  };

  const shareLesson = async () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: `https://${window.location.host}/#/module/${moduleId}`,
      });
    }
  };

  const downloadLessonMaterial = async () => {
    try {
      const authToken = await getToken();
      const response = await axiosInstance(authToken).get(
        `/api/v1/module/lesson/download/${lessonId}`,
        {
          responseType: "blob",
        }
      );

      const filename = `FC:${title}.pdf`;

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const href = URL.createObjectURL(blob);

      if (href) {
        const downloadLink = document.createElement("a");
        downloadLink.href = href;
        downloadLink.download = filename;

        document.body.appendChild(downloadLink);

        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    } catch (error) {
      enqueueSnackbar("Error downloading lesson material", {
        variant: "error",
      });
    }
  };
  return (
    <LessonCard ref={menuRef}>
      <span className="PIL" title="Play" onClick={handlePlayLesson}>
        <IconPlayCircle className="playIcon" />
        Lesson {lessonIndex}
      </span>
      <div className="lesson-details">
        <div className="title" title="Lesson Title">
          {title}
        </div>
        {isWatched ? (
          <div className="circular-progress">
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              styles={{
                path: {
                  stroke: `rgba(23,80,137, ${progress / 100})`,
                },
                text: {
                  fill: "#175089",
                  fontSize: "14px",
                },
              }}
            />
          </div>
        ) : (
          <IconLock className="icon" fill="grey" />
        )}
        <div className="duration" title="Lesson duration">
          <IconClock className="icon" />
          {duration}
        </div>
      </div>
      <div className="menu" onClick={showMenu}>
        <IconDotsVertical className="icon" fill="grey" />
        {menuActive && (
          <div className="lesson-menu" style={{ top: newY }}>
            <ul>
              <li onClick={handlePlayLesson} title="View Lesson">
                View Lesson
              </li>
              <li onClick={editLesson} title="Edit Lesson">
                Edit Lesson
              </li>
              <li onClick={() => {}} title="Reset Progress">
                Reset Progress
              </li>
              <li
                onClick={downloadLessonMaterial}
                title="Download Lesson Material"
              >
                Download Lesson Material
              </li>
              <li onClick={shareLesson} title="Share Lesson">
                Share Lesson
              </li>
              <li onClick={deleteLesson} title="Delete Lesson">
                Delete Lesson
              </li>
            </ul>
          </div>
        )}
      </div>
    </LessonCard>
  );
};

const LessonCard = styled.div`
  display: flex;
  flex-direction: row;
  background: #fff;
  border: 2px solid #176984;
  border-radius: 5px;
  margin-bottom: 10px;
  height: 55px;
  justify-content: space-between;
  overflow: hidden;
  max-width: 600px;
  width: 600px;

  .PIL {
    display: flex;
    gap: 5px;
    align-items: center;
    color: grey;
    font-size: 12px;
    text-align: center;
    padding: 5px;
    cursor: pointer;
    margin-right: 15px;
  }

  .playIcon {
    width: 22px;
    height: 22px;
    fill: crimson;
    cursor: pointer;
  }

  .lesson-details {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .title {
    font-weight: 500;
    font-size: 12px;
    color: grey;
  }

  .circular-progress {
    height: 40px;
    width: 40px;
    cursor: pointer;
  }

  .icon {
    width: 22px;
    height: 22px;
    padding: 2px;
    cursor: pointer;
  }

  .duration {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 12px;
    color: grey;
    gap: 2px;
  }

  .menu {
    padding: 5px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .lesson-menu {
    position: absolute;
    display: inline-block;
    flex-direction: column;
    width: fit-content;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
    background: #fff;
    border-radius: 5px;
    right: 5%;
  }

  .lesson-menu ul {
    list-style: none;
    display: inline-block;
    flex-direction: column;
  }

  .lesson-menu ul li {
    padding: 10px 20px;
    font-size: 12px;
    color: grey;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
  }

  .lesson-menu ul li:last-child {
    border-bottom: none;
  }

  .lesson-menu ul li:first-child:hover {
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }

  .lesson-menu ul li:last-child:hover {
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .lesson-menu ul li:hover {
    background: lightgrey;
    transform: scale(1.01);
    transition: transform 0.3s ease-out;
  }

  @media (max-width: 767px) {
    & {
      width: 98%;
      margin: 2px 5px;
    }

    .circular-progress {
      height: 35px;
      width: 35px;
    }

    .playIcon {
      width: 20px;
      height: 20px;
    }
  }
`;

const ModuleTableCont = styled.div`
  max-width: 600px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  .add-new-lesson {
    padding: 5px 10px;
  }

  .add-new-lesson button {
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    background: #176984;
    color: #fff;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .add-new-lesson button:hover {
    transform: scale(1.01);
    transition: transform 0.3s ease-out;
  }
`;

const ModulePreHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .lesson-count {
    font-size: 12px;
    color: grey;
  }

  @media (max-width: 767px) {
    & {
      width: 98%;
      margin: 2px 5px;
    }
  }
`;

const Playlist = styled.div`
  position: absolute;
  width: 100%;
  min-height: 300px;
  padding: 10px 20px;
  z-index: 99;
  top: 15%;
  background: rgb(212, 205, 205, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  -moz-backdrop-filter: blur(10px);
  -o-backdrop-filter: blur(10px);
  border: 1px solid #ededed;
  transform: 0.5s;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  align-items: center;

  h3 {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .back {
    position: absolute;
    top: 5%;
    left: 5px;
    padding: 5px 10px;
    border: 1px solid #ededed;
    border-radius: 5px;
    background: #fff;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .player-cont {
    margin-top: 30px;
  }
  @media (max-width: 767px) {
    .back {
      top: 0;
    }
  }
`;

const ModuleRenderer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  position: relative;

  .module-details {
    margin: 5px 10px;
    height: 200px;
    padding: 10px;
    width: 600px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .module-desc {
      font-size: 12px;
      color: grey;
    }
  }

  @media (max-width: 767px) {
    .module-details {
      width: 100%;
    }
    header {
      background-color: #fff;
    }
    .module_title {
      font-size: 15px;
    }

    header span {
      font-size: 12px;
    }

    .icon {
      width: 16px;
      height: 16px;
    }
  }

  .module-details .module-banner {
    width: 150px;
    cursor: pointer;
  }

  header {
    padding: 10px 5px;
    width: 100%;
    display: flex;
    gap: 10px;
    position: fixed;
  }

  header span {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    transition: all 0.3s ease-in;
  }

  .activeTab {
    border-bottom: 2px solid #176980;
    font-weight: 600;
    padding: 0px 5px;
  }

  .icon {
    width: 20px;
    height: 20px;
    fill: grey;
  }
`;

export default Module;
