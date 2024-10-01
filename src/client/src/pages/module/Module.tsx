import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/system";
import {
  IconButton,
  Button,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
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
import { enqueueSnackbar } from "notistack";
import Player from "../../lib/player";
import axiosInstance from "../../utils/axiosInstance";
import getToken from "../../utils/getToken";
import { IModule } from "../../types";
import Footer from "../../components/footer/Footer";

const Module: React.FC = (): React.ReactElement => {
  const [activeTab, setActiveTab] = useState<string>("MODULE");
  const [isPlayerActive, setPlayerActive] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();
  const [moduleDetails, setModuleDetails] = useState<IModule | null>(null);
  const [moduleLessons, setModuleLesson] = useState<Array<any> | null>(null);
  const [moduleErr, setModuleErr] = useState<any>(null);

  useEffect(() => {
    const getModule = async () => {
      const authToken = await getToken();
      try {
        const { data } = await axiosInstance(authToken).get(
          `/api/v1/module/${params.moduleId}`
        );
        setModuleDetails(data?.module);
        setModuleLesson(data?.lessons);
        const lessonsWithDurations = await Promise.all(
          data?.lessons.map(async (lesson: any) => {
            const duration = await getVideoDuration(lesson.lessonUrl);
            return {
              ...lesson,
              lessonId: lesson._id,
              lessonUrl: lesson?.lessonMaterial.secureUrl,
              duration,
              isWatched: false,
              progress: 0,
            };
          })
        );

        setModuleLesson(lessonsWithDurations);
      } catch (err: any) {
        enqueueSnackbar(err.message, { variant: "error" });
        setModuleErr(err);
      }
    };

    isOnline() && getModule();
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
    <ModuleContainer>
      <Header>
        <TabButton
          onClick={() => changeTab("MODULE")}
          active={activeTab === "MODULE"}
        >
          <IconBookshelf />
          Module
        </TabButton>
        <TabButton
          onClick={() => changeTab("PLAYLIST")}
          active={activeTab === "PLAYLIST"}
        >
          <IconBxsCommentDetail />
          Playlist
        </TabButton>
      </Header>

      {activeTab === "MODULE" && moduleDetails && (
        <ModuleDetails>
          <Typography variant="h4">{moduleDetails?.title}</Typography>
          <Typography variant="body1">{moduleDetails?.description}</Typography>
          <img
            loading="lazy"
            src={moduleDetails?.avatar.secureUrl}
            alt="Module Banner"
          />
        </ModuleDetails>
      )}

      {activeTab === "MODULE" && moduleLessons && (
        <LessonsContainer>
          <Box>
            <Typography variant="h6">Module</Typography>
            <Typography>
              {moduleDetails?.lessonCount > 1
                ? `${moduleDetails?.lessonCount} Lessons`
                : `${moduleDetails?.lessonCount} Lesson`}
            </Typography>
          </Box>
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
          <Button
            startIcon={<IconAddOutline />}
            onClick={newLesson}
            variant="contained"
            color="primary"
          >
            Add Lesson
          </Button>
        </LessonsContainer>
      )}

      {activeTab === "PLAYLIST" && (
        <PlaylistContainer>
          <Button
            startIcon={<IconChevronLeft />}
            onClick={() => changeTab("MODULE")}
          >
            Back
          </Button>
          <Player lessonsMedia={moduleLessons} moduleTitle={moduleDetails?.title} />
        </PlaylistContainer>
      )}
    </ModuleContainer>


    <Footer/>
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <LessonCard>
      <Box onClick={handlePlayLesson} sx={{ display: 'flex', alignItems: 'center' }}>
        <IconPlayCircle />
        <Typography variant="subtitle1">Lesson {lessonIndex}</Typography>
      </Box>
      <Box>
        <Typography>{title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isWatched ? (
            <CircularProgressbar value={progress} text={`${progress}%`} />
          ) : (
            <IconLock />
          )}
          <Typography>{duration} mins</Typography>
        </Box>
      </Box>
      <IconButton onClick={handleClick}>
        <IconDotsVertical />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handlePlayLesson}>View Lesson</MenuItem>
        <MenuItem>Edit Lesson</MenuItem>
        <MenuItem>Reset Progress</MenuItem>
        <MenuItem>Download Material</MenuItem>
        <MenuItem>Share Lesson</MenuItem>
        <MenuItem>Delete Lesson</MenuItem>
      </Menu>
    </LessonCard>
  );
};


const ModuleContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  padding: '16px',
});

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
});

const TabButton = styled(Button)(({ active }: { active: boolean }) => ({
  backgroundColor: active ? '#176984' : '#f0f0f0',
  color: active ? '#fff' : '#000',
}));

const ModuleDetails = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '16px',
});

const LessonsContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const PlaylistContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const LessonCard = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px',
  border: '1px solid #ddd',
  borderRadius: '4px',
});

