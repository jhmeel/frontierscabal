import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { isArray } from "lodash";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import IRCache from "../../utils/cache";
import {
  IconChevronLeft,
  IconChevronRight,
  IconLink,
} from "../../assets/icons";
import LocalForageProvider from "../../utils/localforage";
import { useSnackbar } from "notistack";
import getToken from "../../utils/getToken";

interface Media {
  readonly lessonTitle: string;
  readonly lessonId: string;
  readonly lessonIndex: number;
  readonly lessonUrl: string;
  readonly lessonThumbnail?: string;
  readonly lessonMaterial: string;
  readonly duration: number;
  progress: number | 0;
}

const Player = ({
  lessonsMedia,
  moduleTitle,
}: {
  lessonsMedia: Array<Media | null> | Media | null;
  moduleTitle: string;
}): React.ReactElement => {
  const [currentPlaying, setCurrentPlaying] = useState<Media | null>(null);
  const [playList, setPlayList] = useState<Array<Media | null> | Media | null>(
    lessonsMedia
  );
  const [nextLesson, setNextLesson] = useState<Media | null>(null);
  const [previousLesson, setPreviousLesson] = useState<Media | undefined>(
    undefined
  );
  const [lessonCompleted, setLessonCompleted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleNext = () => {
    if (isArray(playList) && !lessonCompleted && nextLesson) {
      const next = playList.find(
        (media) => media?.lessonIndex === nextLesson?.lessonIndex
      );
      if (next) {
        setPreviousLesson(currentPlaying);
        setCurrentPlaying(next);
        setNextLesson(
          playList.find((media) => media.lessonIndex === next?.lessonIndex + 1)
        );
      } else {
        setLessonCompleted(true);
        toast.success("Congratulations🎉🎉🎉\n You have completed the lesson.");
      }
    } else {
      !isArray(lessonsMedia) && setCurrentPlaying(lessonsMedia);
    }
  };

  const handlePlay = () => {
    if (isArray(playList)) {
      setCurrentPlaying(playList.find((media) => media.lessonIndex === 1));
      setNextLesson(playList.find((media) => media.lessonIndex === 2));
    } else {
      !isArray(playList) && setCurrentPlaying(playList);
    }
  };

  useEffect(() => {
    loadSavedProgress();
  }, [currentPlaying]);

  const loadSavedProgress = async () => {
    // Get saved progress from cache
    const savedProgress = new IRCache(
      LocalForageProvider
    ).restorePreviousSession("FC:IRCACHE:LESSON");
    if (savedProgress && currentPlaying) {
      const lesson: Media = await savedProgress?.find(
        (lessons, i) => lessons.lessonTitle === currentPlaying?.lessonTitle
      );
      setProgress(lesson.progress);

      if (videoRef.current) {
        videoRef.current.currentTime = progress ?? 0;
      }
    }
  };

  const playPrevious = () => {
    setCurrentPlaying(previousLesson);
    const newPrevious = playList?.find(
      (media) => media?.lessonIndex === previousLesson?.lessonIndex - 1
    );
    setPreviousLesson(newPrevious);

    const newNext = playList?.find(
      (media) => media.lessonIndex === previousLesson?.lessonIndex + 1
    );
    if (!newNext) {
      setNextLesson(playList[0]);
    }
    setNextLesson(newNext);
  };

  const playNext = () => {
    handleNext();
  };

  useEffect(() => {
    handlePlay();
  }, []);

  const downloadLessonMaterial = async () => {
    try {
      const authToken = await getToken();
      const response = await axiosInstance(authToken).get(
        `/api/v1/module/lesson/download/${currentPlaying?.lessonId}`,
        {
          responseType: "blob",
        }
      );

      const filename = `FC:${currentPlaying?.lessonTitle}.pdf`;

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
     enqueueSnackbar("Error downloading lesson material",{variant:'error'});
    }
  };

  const resetProgress = () => {
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = progress;
    }
  };

  const handleMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (currentPlaying && videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setProgress(currentTime);

      const savedProgress = new IRCache(
        LocalForageProvider
      ).restorePreviousSession("FC:IRCACHE:LESSON");

      if (savedProgress && isArray(savedProgress)) {
        const lessons: Media[] = savedProgress.filter(
          (lesson, i) => lesson.lessonTitle !== currentPlaying?.lessonTitle
        );
        const updatedCurrent: Media = {
          lessonTitle: currentPlaying.lessonTitle,
          lessonId: currentPlaying.lessonId,
          lessonIndex: currentPlaying.lessonIndex,
          lessonUrl: currentPlaying.lessonUrl,
          lessonThumbnail: currentPlaying.lessonThumbnail,
          lessonMaterial: currentPlaying.lessonMaterial,
          duration: currentPlaying.duration,
          progress: currentTime,
        };
        const updatedProgress = [...lessons, updatedCurrent];
        // Save progress in cache
        new IRCache(LocalForageProvider).save(
          "FC:IRCACHE:LESSON",
          updatedProgress
        );
      }
    }
  };

  useEffect(() => {
    // Set up event listeners
    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", handleMetadata);
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    }

    // Cleanup event listeners
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadedmetadata", handleMetadata);
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  return (
    <Container>
      <LessonVideoContainer>
        <video
          ref={videoRef}
          src={currentPlaying?.lessonUrl}
          poster={currentPlaying?.lessonThumbnail}
          controls
          onEnded={handleNext}
        />
      </LessonVideoContainer>
      <Playing>
        {previousLesson && (
          <div className="previousLesson" title="Previous">
            <IconChevronLeft onClick={playPrevious} className="icon" />
            <span onClick={playPrevious}>
              {previousLesson?.lessonTitle.length > 21
                ? `${previousLesson?.lessonTitle.slice(0, 21)}...`
                : previousLesson?.lessonTitle}
            </span>
          </div>
        )}
        {nextLesson && (
          <div className="nextLesson">
            <span title="Next" onClick={playNext}>
              {nextLesson?.lessonTitle.length > 21
                ? `${nextLesson?.lessonTitle.slice(0, 21)}...`
                : nextLesson?.lessonTitle}
            </span>
            <IconChevronRight onClick={playNext} className="icon" />
          </div>
        )}
      </Playing>

      {currentPlaying?.lessonMaterial && (
        <span
          onClick={downloadLessonMaterial}
          className="lessonMaterialLink"
          title="Download Lesson Material"
        >
          <IconLink className="icon" />
          Download Lesson material
        </span>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100vh;

  .lessonMaterialLink {
    color: grey;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    padding: 10px;
    cursor: pointer;
  }
`;

const Playing = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px;
  gap: 10px;

  .nextLesson,
  .previousLesson {
    display: flex;
    width: fit-content;
    align-items: center;
    gap: 5px;
    padding: 8px 16px;
    border-radius: 5px;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }

  .nextLesson:hover,
  .previousLesson:hover {
    background: #176984;
    transform: scale(1.01);
    transition: transform 0.3s ease-out;
  }

  span:hover {
    color: #fff;
  }

  span {
    color: grey;
    font-size: 12px;
  }
  @media (max-width: 767px) {
    .nextLesson,
    .previousLesson {
      padding: 4px 8px;
    }
  }
`;

const LessonVideoContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 540px;
  max-width: 600px;
  height: 350px;
  margin: 0 auto;
  border: 1px solid #ededed;
  cursor: pointer;
  padding: 0;

  @media (max-width: 767px) {
    & {
      height: 250px;
      width: 380px;
    }
  }

  video {
    height: inherit;
    width: inherit;
    border-radius: 5px;
    object-fit: cover;
  }

  .icon {
    height: 22px;
    width: 22px;
  }
`;
export default Player;
