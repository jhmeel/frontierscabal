import React, { useEffect, useState, useRef } from "react";
import { IconCaretDown } from "../../assets/icons";
import StudyMaterialItem from "../../components/studyMaterialItem/StudyMaterialItem";
import CourseList from "../../assets/courses/CourseList";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../../MetaData";
import Footer from "../../components/footer/Footer";
import Paginator from "../../components/paginator/Paginator";
import {
  clearErrors,
  searchPastQuestionWithCourseTitleSessionAndLevel,
  searchRecentPastQuestion,
} from "../../actions/pastquestion";
import SpinLoader from "../../components/loaders/SpinLoader";
import { isOnline } from "../../utils";
import PastquestionSkeletonLoader from "../../components/loaders/PastquestionSkeletonLoader";
import axiosInstance from "../../utils/axiosInstance";
import { errorParser } from "../../utils/formatter";
import toast from "react-hot-toast";
import styled from "styled-components";
import { RootState } from "../../store";

const StudyMaterial = () => {
  const dispatch = useDispatch();
  const [selectedSession, setSelectedLevel] = useState("");
  const [selectedLevel, setSelectedSession] = useState("");
  const [courseMaterial, setCourseMaterial] = useState([]);
  const [recentCourseMaterial, setRecentCourseMaterial] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState({
    name: "All",
    code: "All",
  });
  const [optionVisible, setIsOptionVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [courseOptionVisible, setCourseOptionVisible] = useState(false);

  const {
    error: pastQuestionError,
    totalPages,
    pastQuestion,
    loading,
  } = useSelector((state: RootState) => state.pastQuestionSearch);

  const toggleOptionVisible = () => {
    setIsOptionVisible(!optionVisible);
  };
  const toggleCourseOptionVisible = () => {
    setCourseOptionVisible(!courseOptionVisible);
  };

  const handleSessionChange = (e) => {
    setSelectedSession(e.target.value);
    setIsOptionVisible(false);
  };
  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
    setIsOptionVisible(false);
  };

  const handleSelectedCourse = (course: any) => {
    setSelectedCourse({ name: course.name, code: course.code });
    toggleCourseOptionVisible();
  };

  const handlePageChange = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (pastQuestionError) {
      toast.error(pastQuestionError);
      dispatch<any>(clearErrors());
    }

    if (
      selectedCourse.name !== "All" &&
      selectedCourse.code !== "All" &&
      selectedSession &&
      selectedLevel
    ) {
      isOnline() &&
        dispatch<any>(
          searchPastQuestionWithCourseTitleSessionAndLevel(
            selectedCourse.name,
            selectedLevel,
            selectedSession,
            page
          )
        );
    } else {
      isOnline() && dispatch<any>(searchRecentPastQuestion(page));
    }
  }, [selectedCourse, selectedSession, selectedLevel, page, dispatch]);

  useEffect(() => {
    const searchCourses = async () => {
      try {
        const { data } = await axiosInstance().get(
          `/api/v1/search/course-material/CTSAL?courseTitle=${selectedCourse}&session=${selectedSession}&level=${selectedLevel}&page=${page}`
        );
        setCourseMaterial(data?.courseMaterial);
      } catch (err) {
        toast.error(errorParser(err));
      }
    };

    if (
      selectedCourse.name !== "All" &&
      selectedCourse.code !== "All" &&
      selectedSession &&
      selectedLevel
    ) {
      isOnline() && searchCourses();
    }
  }, [selectedCourse, selectedSession, selectedLevel]);

  useEffect(() => {
    const fetchRecentCourseMaterials = async () => {
      try {
        const { data } = await axiosInstance().get(
          `/api/v1/search/course-material/recent`
        );
        setRecentCourseMaterial(data?.courseMaterial);
      } catch (err) {
        toast.error(errorParser(err));
      }
    };
    if (selectedCourse.name == "All" && selectedCourse.code == "All") {
      isOnline() && fetchRecentCourseMaterials();
    }
  }, [selectedCourse, dispatch, page]);

  const Sessions = [
    "2015/2016",
    "2016/2017",
    "2017/2018",
    "2018/219",
    "2019/2020",
    "2020/2021",
    "2021/2022",
    "2022/2023",
  ];
  const Levels = [
    "100",
    "200",
    "300",
    "400",
    "500",
    "Professional Exam",
    "Post Graduate",
  ];

  const optionRef = useRef(null);
  const courseRef = useRef(null);
  const handleClickOutside = (e) => {
    if (optionRef.current && !optionRef.current.contains(e.target)) {
      setIsOptionVisible(false);
    }
  };
  const handleCourseClickOutside = (e) => {
    if (courseRef.current && !courseRef.current.contains(e.target)) {
      setCourseOptionVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("click", handleCourseClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("click", handleCourseClickOutside);
    };
  }, []);
  return (
    <>
      <MetaData title="Study Materials" />
      <main>
        {loading && <SpinLoader />}
        <StudyMaterialRenderer>
          <div className="demarcator">
            <div className="options-bar" ref={optionRef}>
              <span className="selectedOption" onClick={toggleOptionVisible}>
                {selectedCourse.code}-{selectedSession}-{selectedLevel}
              </span>
              <IconCaretDown
                className="s-opt-caret-downIcon"
                onClick={toggleOptionVisible}
              />
              {optionVisible && (
                <div className="options">
                  <select
                    id="session"
                    value={selectedSession}
                    onChange={handleSessionChange}
                  >
                    <option id="sess-val" value="">
                      Select a session
                    </option>
                    {Sessions.map((sess) => (
                      <option id="sess-val" key={sess} value={sess}>
                        {sess}
                      </option>
                    ))}
                  </select>
                  <span className="hr"></span>
                  <select
                    id="level"
                    value={selectedLevel}
                    onChange={handleLevelChange}
                  >
                    <option value="">Select a level</option>
                    {Levels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="course-option" ref={courseRef}>
              <span
                className="selected-course"
                onClick={toggleCourseOptionVisible}
              >
                {selectedCourse.code}{" "}
                <IconCaretDown
                  fill="#fff"
                  onClick={toggleCourseOptionVisible}
                />
              </span>
              {courseOptionVisible && (
                <div className="course-list">
                  <ul>
                    {CourseList.sort().map((course) => (
                      <li
                        key={course.code}
                        onClick={() => handleSelectedCourse(course)}
                      >
                        {course.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="pq-list">
            {loading
              ? Array(12)
                  .fill(null)
                  .map((_, i) => <PastquestionSkeletonLoader key={i} />)
              : !loading &&
                pastQuestion?.length == 0 &&
                courseMaterial.length == 0 && <span>No records found!</span>}
            {pastQuestion?.length > 0 &&
              pastQuestion.map((pq: any, i: number) => (
                <StudyMaterialItem
                  key={i}
                  _id={pq?._id}
                  tag={pq?.courseCode}
                  courseTitle={pq?.courseTitle}
                  sch={pq?.school}
                  session={pq?.session}
                  downloads={pq?.downloads}
                  postedBy={pq?.postedBy}
                />
              ))}
            {courseMaterial.length > 0 &&
              courseMaterial.map((cm: any, i: number) => (
                <StudyMaterialItem
                  key={i}
                  _id={cm?._id}
                  tag={cm?.courseCode}
                  courseTitle={cm?.courseTitle}
                  session={cm?.session}
                  downloads={cm?.downloads}
                  postedBy={cm?.postedBy}
                  type="Course Material"
                />
              ))}
            {selectedCourse.name === "All" &&
              recentCourseMaterial.length > 0 &&
              recentCourseMaterial.map((cm: any, i: number) => (
                <StudyMaterialItem
                  key={i}
                  _id={cm?._id}
                  tag={cm?.courseCode}
                  courseTitle={cm?.courseTitle}
                  session={cm?.session}
                  downloads={cm?.downloads}
                  postedBy={cm?.postedBy}
                  type="Course Material"
                />
              ))}
          </div>
        </StudyMaterialRenderer>
        <PqFooter>
          <Paginator
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </PqFooter>
        <Footer />
      </main>
    </>
  );
};

export default StudyMaterial;

const StudyMaterialRenderer = styled.div`
  max-width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;

  .demarcator {
    border-bottom: 1px solid #dedede;
    display: flex;
    position: fixed;
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
  .options {
    position: fixed;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: #fff;
    z-index: 999;
    padding: 6px 12px;
  }
  .options #session {
    margin-bottom: 6px;
    border-bottom: 0.5px solid #dedede;
  }
  .hr {
    width: 100%;
    height: 1px;
    background-color: #dedede;
  }
  .options #session,
  #level {
    padding: 5px 10px;
    cursor: pointer;
    border: none;
    font-size: 14px;
  }
  .options select option {
    border-bottom: 0.5px solid #dedede;
    padding: 5px 10px;
    transition: 0.3s ease-out;
    font-size: 14px;
    font-weight: 500;
    border-radius: 3px;
    cursor: pointer;
  }
  .options select option:hover {
    background-color: #176489;
    color: #fff;
  }
  .options select:focus {
    outline: none;
    border: 1px solid #176489;
  }

  .selectedOption,
  .selected-course {
    font-size: 14px;
    font-weight: 700;
    color: #000;
    padding: 3px 6px;
    cursor: pointer;
  }
  .selected-course {
    background-color: #176489;
    color: #fff;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  .pq-list {
    position: relative;
    top: 52px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px 3px;
    padding: 5px 10px;
    flex-wrap: wrap;
    max-width: 100%;
    gap: 8px;
  }

  @media (max-width: 767px) {
    .pq-list {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 0;
      padding: 0;
    }
    .course-list {
      left: 50%;
    }
  }

  .course-list {
    position: fixed;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: #fff;
    z-index: 999;
    left: 75%;
    height: 300px;
    overflow-y: scroll;
  }
  .course-list ul li {
    border-bottom: 0.5px solid #dedede;
    padding: 6px 12px;
    transition: 0.3s ease-out;
    font-size: 12px;
    border-radius: 3px;
    color: #000;
    cursor: pointer;
  }

  .course-list ul li:hover {
    background-color: rgb(1, 95, 123);
    color: #fff;
  }

  .s-opt-caret-downIcon {
    cursor: pointer;
  }
`;

const PqFooter = styled.div`
  height: 60px;
  width: 100%;
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
