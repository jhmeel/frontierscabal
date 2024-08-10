import { useEffect, useState } from "react";
import { isOnline } from "../../utils";
import { useParams } from "react-router-dom";
import getToken from "../../utils/getToken";
import axiosInstance from "../../utils/axiosInstance";
import { useSnackbar } from "notistack";
import UploadLesson from "./UploadLesson";
import { ILesson } from "../../types";

const UpdateLesson = () => {
  const param = useParams();
  const [lesson, setLesson] = useState<ILesson|null>(null);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const getLessonDetails = async () => {
      const authToken = await getToken();
      try {
        const { data } = await axiosInstance(authToken).get(
          `/api/v1/module/lesson/${param.lessonId}`
        );
        setLesson(data.lesson);
      } catch (err: any) {
        enqueueSnackbar(err.message, { variant: "error" });
      }
    };
    isOnline() && getLessonDetails();
  }, []);

  return (
    <div>
      <UploadLesson
        lessonId={lesson?._id}
        updateTitle={lesson?.lessonTitle}
        updateAim={lesson?.lessonAim}
        updateLessonUrl={lesson?.lessonUrl}
        updateLessonIndex={lesson?.lessonIndex}
        action="UPDATE"
      />
    </div>
  );
};

export default UpdateLesson;
