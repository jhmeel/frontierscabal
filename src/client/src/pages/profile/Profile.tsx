import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { clearErrors, logoutUser } from "../../actions/user";
import MetaData from "../../MetaData";
import { useSnackbar } from "notistack";
import EmptyAvatar from "../../assets/images/empty_avatar.png";
import Footer from "../../components/footer/Footer";
import getToken from "../../utils/getToken";
import { isOnline } from "../../utils";
import {
  IconContentCopy,
  IconAccountEdit,
  IconLogout,
  IconBxsBookmarks,
  IconLinkAdd,
  IconCalendarEventFill,
  IconBxEditAlt,
  IconSetting,
  PasswordIcon,
  IconSchool,
} from "../../assets/icons";
import { IoIosCall } from "react-icons/io";
import { SiMinutemailer } from "react-icons/si";
import {
  Article as ArticleIcon,
  Code as CodeIcon,
  Science as ScienceIcon,
  Newspaper as NewspaperIcon,
  School as SchoolIcon,
  EmojiObjects as PersonalDevIcon,
  AutoStories as FictionIcon,
  AttachMoney as FinanceIcon,
  Checkroom as FashionIcon,
  Museum as CultureIcon,
  Restaurant as FoodIcon,
  Call,
} from "@mui/icons-material";
import {
  getBookmarkedArticle,
  getUserArticles,
  clearErrors as clearBookmarkArticleError,
} from "../../actions/article";
import HorizontalArticleItem from "../../components/horizontalArticleItem/HorizontalArticleItem";
import RDotLoader from "../../components/loaders/RDotLoader";
import SpinLoader from "../../components/loaders/SpinLoader";
import moment from "moment";
import VerticalArticleItem from "../../components/verticalArticleItem/VerticalArticleItem";
import { ARTICLE, IModule, USER } from "../../types";
import styled from "styled-components";
import LocalForageProvider from "../../utils/localforage";
import { RootState } from "../../store";
import { getUserDetails } from "../../actions/user.js";
import { Button, Chip, Tooltip } from "@mui/material";
import toast from "react-hot-toast";

type ActiveList = "MY_ARTICLES" | "READING_LIST";

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const params = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [pinnedArticles, setPinnedArticles] = useState<ARTICLE[]>([]);
  let { user: currentUser } = useSelector((state: RootState) => state.user);
  let {
    loading: detailsLoading,
    user,
    error: detailsError,
  }: { loading: boolean; user: USER; error: any } = useSelector(
    (state: RootState) => state.userDetails
  );
  const { logoutSuccess, error: logoutError } = useSelector(
    (state: RootState) => state.user
  );

  const {
    loading: articleLoading,
    error: articleError,
    articles: articles,
  }: { loading: boolean; articles: ARTICLE[]; error: any } = useSelector(
    (state: RootState) => state.articleSearch
  );

  const [isPTabOpen, setIsPTabOpened] = useState(false);
  const [userInterest, setUserInterest] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [activeUList, setActiveUList] = useState<ActiveList>("MY_ARTICLES");
  const [curriculum, setCurriculum] = useState<Array<IModule> | null>(null);

  const fetchArticles = useCallback(async () => {
    const authToken = await getToken();
    let username: string =
      params?.username || (await LocalForageProvider.getItem("FC:USERNAME"));
    if (activeUList === "MY_ARTICLES" && authToken && username) {
      dispatch<any>(getUserArticles(authToken, username));
    } else if (activeUList === "READING_LIST" && authToken) {
      dispatch<any>(getBookmarkedArticle(authToken, page));
    }
  }, [activeUList, dispatch, page, params?.username]);

  const fetchUser = useCallback(async () => {
    const authToken = await getToken();
    let username: string =
      params?.username || (await LocalForageProvider.getItem("FC:USERNAME"));
    username && dispatch<any>(getUserDetails(username, authToken));
  }, []);
  useEffect(() => {
    if (isOnline()) {
      fetchArticles();
      fetchUser();
    }
  }, [fetchArticles, fetchUser]);

  useEffect(() => {
    LocalForageProvider.getItem(
      `FC:${currentUser?.username}:INTERESTS`,
      (err, val: any) => {
        val = JSON.parse(val);
        val &&
          setUserInterest(Object.keys(val).filter((key) => val[key] === true));
      }
    );
  }, []);
  useEffect(() => {
    if (logoutError) {
      enqueueSnackbar(logoutError, { variant: "error" });
      dispatch<any>(clearErrors());
    }
  }, [dispatch, logoutError]);

  const togglePTab = () => {
    setIsPTabOpened(!isPTabOpen);
  };

  const handleClick = (to: string) => {
    togglePTab();
    navigate(to);
  };

  const referralUrl = `https://${window.location.hostname}/#/signup/${user?.referralCode}`;

  const handleFriendInvite = () => {
    if (navigator.share) {
      navigator.share({
        title: "Friend Invite",
        text: "Please click on the link to signup on frontierscabal",
        url: referralUrl,
      });
    }
  };

  const copyCode = () => {
    if (referralUrl) {
      navigator.clipboard.writeText(referralUrl);
      enqueueSnackbar("Referral url copied!", { variant: "info" });
      togglePTab();
    }
    return;
  };

  const showConfirmation = () => {
    togglePTab();
    toast((t) => (
      <div>
        <p>Are you sure you want to log out?</p>
        <Button
          onClick={() => {
            toast.dismiss(t.id);
            logout();
          }}
          color="primary"
        >
          Proceed
        </Button>
        <Button onClick={() => toast.dismiss(t.id)}>Cancel</Button>
      </div>
    ));
  };

  const ptabRef = useRef<HTMLSpanElement>(null);
  const handleClickOutside = (e: MouseEvent) => {
    if (ptabRef.current && !ptabRef.current.contains(e.target as Node)) {
      setIsPTabOpened(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const logout = () => {
    closeSnackbar();
    dispatch<any>(logoutUser());
    navigate("/login");
  };

  const mailUser = () => {
    const mail = `mailto:${user?.email}`;
    window.open(mail, "_blank");
  };

  const handleCall = async () => {
    try {
      const url = `tel:${user?.phonenumber}`;
      window.location.href = url;
    } catch (error) {
      enqueueSnackbar("Failed to initiate call. Please try again later.", {
        variant: `error`,
      });
    }
  };
  const isCurrentUser = currentUser?.username === user?.username;
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Tech":
        return <CodeIcon />;
      case "Science":
        return <ScienceIcon />;
      case "News":
        return <NewspaperIcon />;
      case "Education":
        return <SchoolIcon />;
      case "Personal_dev":
        return <PersonalDevIcon />;
      case "Fiction":
        return <FictionIcon />;
      case "Finance":
        return <FinanceIcon />;
      case "Fashion":
        return <FashionIcon />;
      case "Culture":
        return <CultureIcon />;
      case "Food":
        return <FoodIcon />;
      default:
        return <ArticleIcon />;
    }
  };
  return (
    <>
      <MetaData title="Profile" />
      <>
        {detailsLoading && <SpinLoader />}
        <ProfileRenderer>
          <div className="profile-user-item">
            <div className="user-card">
              <div className="user-card-header">
                {isCurrentUser && (
                  <>
                    <span
                      ref={ptabRef}
                      className="u-setting"
                      title="Setting"
                      onClick={togglePTab}
                    >
                      <IconSetting height="20" width="20" fill="#000" />
                    </span>
                    {isPTabOpen && (
                      <div className="u-nav-tab">
                        <ul id="u-ul">
                          <li
                            title="Edit profile"
                            onClick={() => handleClick("/profile/edit")}
                          >
                            <IconAccountEdit className="u-ul-icon" />
                            Edit profile
                          </li>
                          <li
                            title="Reset password"
                            onClick={() => handleClick("/password/update")}
                          >
                            <PasswordIcon className="u-ul-icon" />
                            Reset password
                          </li>
                          <li
                            title="Bookmarked Articles"
                            onClick={() => handleClick("/bookmarks")}
                          >
                            <IconBxsBookmarks className="u-ul-icon" />
                            Bookmarked Articles
                          </li>

                          <li
                            title="Invite friends"
                            onClick={() => handleFriendInvite()}
                          >
                            <IconLinkAdd className="u-ul-icon" />
                            Invite friends
                          </li>
                          {user?.username && (
                            <li onClick={showConfirmation}>
                              <IconLogout fill="#000" className="u-ul-icon" />
                              Logout
                            </li>
                          )}
                          <li className="ref-url" title="Referral url">
                            {referralUrl.slice(0, referralUrl.length / 3)}
                            <span title="Copy" onClick={copyCode}>
                              <IconContentCopy
                                className="ref-copy-icon"
                                fill="#fff"
                              />
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="user-card-img">
                <img
                  loading="lazy"
                  src={
                    user?.username !== currentUser?.username
                      ? user?.avatar?.url || EmptyAvatar
                      : currentUser?.avatar?.url || EmptyAvatar
                  }
                />
                {isCurrentUser && (
                  <span className="u-edit-prof" title="Edit">
                    <IconAccountEdit
                      fill="gray"
                      height="28px"
                      width="28  px"
                      onClick={() => handleClick("/profile/edit")}
                    />
                  </span>
                )}
              </div>
              <div className="user-card-info">
                <h3 className="modal-username">
                  {user?.username !== currentUser?.username
                    ? user?.username
                    : currentUser.username}
                </h3>

                {!isCurrentUser && (
                  <div className="p-cnt-cont">
                    <Tooltip title="Call">
                      <div className="usr-call" onClick={handleCall}>
                        Call &nbsp;
                        <IoIosCall size={24} />
                      </div>
                    </Tooltip>
                    <Tooltip title="Mail">
                      <div title="Mail" className="usr-mail" onClick={mailUser}>
                        Mail&nbsp;
                        <SiMinutemailer fill="#fff" size={24} />
                      </div>
                    </Tooltip>
                  </div>
                )}

                <div className="user-bio-segment">
                  <p className="user-bio">
                    {user?.username !== currentUser?.username
                      ? user?.bio
                      : currentUser?.bio}
                  </p>
                  {(currentUser?.school || user?.school) && (
                    <p className="user-sch">
                      <IconSchool height="16" width="16" fill="black" />{" "}
                      {user?.username !== currentUser?.username
                        ? user.school
                        : currentUser.school}
                    </p>
                  )}
                  <p className="user-joined-date">
                    <IconCalendarEventFill
                      height="16"
                      width="16"
                      fill="black"
                    />{" "}
                    Joined{" "}
                    {user?.username !== currentUser?.username
                      ? moment(user?.createdAt).format("MMMM YYYY")
                      : moment(currentUser?.createdAt).format("MMMM YYYY")}
                  </p>
                </div>
              </div>

              {isCurrentUser && (
                <div className="user-interest-segment">
                  <div className="user-interest-header">
                    <span>Interests</span>

                    <span
                      title="Manage interest"
                      className="manage-interest"
                      onClick={() => navigate("/personalize")}
                    >
                      Manage
                      <IconBxEditAlt fill="gray" height="20px" width="20px" />
                    </span>
                  </div>
                  <div className="user-interest-holder">
                    {userInterest.map((int, _) => (
                      <div
                        key={int}
                        className="user-interest-item"
                        onClick={() => {
                          (user && currentUser?.username === user?.username) ||
                            (currentUser?.username && navigate("/bookmarks"));
                        }}
                      >
                        <CategoryChip
                          key={int}
                          icon={getCategoryIcon(int)}
                          label={int.replace("_", " ")}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/*pinnedArticles?.length > 0 && (
                <div className="pinned-article-segment">
                  <div className="pinned-article-header">
                    <IconBxsPin /> Pinned
                  </div>
                  <div className="pinned-article-list">
                    {pinnedArticles
                      .sort((a, b) => b - a)
                      ?.map((art: any, i: number) => (
                        <VerticalArticleItem
                          _id={art._id}
                          title={art.title}
                          slug={art.slug}
                          image={art.image?.url}
                          caption={art.content}
                          category={art.category}
                          postedBy={art.postedBy}
                          date={art.createdAt}
                          savedBy={art.savedBy}
                          readDuration={art.readDuration}
                          pinnedBy={art.pinnedBy}
                          onProfile={
                            (user &&
                              user?.username === currentUser?.username) ||
                            currentUser?.username
                          }
                          key={i}
                        />
                      ))}
                  </div>
                </div>
              )*/}

              <div className="u-articles-segment">
                <div className="u-art-head">
                  {isCurrentUser ? (
                    <>
                      <span
                        className={
                          activeUList === "MY_ARTICLES"
                            ? "u-list-active"
                            : "u-list-inactive"
                        }
                        onClick={() => setActiveUList("MY_ARTICLES")}
                      >
                        Articles
                      </span>
                      <span
                        className={
                          activeUList === "READING_LIST"
                            ? "u-list-active"
                            : "u-list-inactive"
                        }
                        onClick={() => setActiveUList("READING_LIST")}
                      >
                        Reading List
                      </span>
                    </>
                  ) : (
                    <span className="">Articles</span>
                  )}
                </div>

                <div className="u-article-list">
                  {activeUList === "READING_LIST" && articles?.length === 0 ? (
                    <span style={{ color: "grey", fontSize: "14px" }}>
                      No story was found in your reading list ☹
                    </span>
                  ) : activeUList === "MY_ARTICLES" &&
                    articles?.length === 0 &&
                    !isCurrentUser ? (
                    <span style={{ color: "grey", fontSize: "14px" }}>
                      This user has no stories ☹
                    </span>
                  ) : activeUList === "MY_ARTICLES" &&
                    articles?.length === 0 &&
                    isCurrentUser ? (
                    <>
                      <span style={{ color: "grey", fontSize: "14px" }}>
                        Your story list is empty!
                      </span>
                      &nbsp;
                      <Link to="/blog/article/new">
                        <span style={{ color: "grey" }}>
                          write
                          <IconBxEditAlt fill="grey" />
                        </span>
                      </Link>
                    </>
                  ) : articleLoading ? (
                    <RDotLoader />
                  ) : activeUList === "MY_ARTICLES" && articles?.length > 0 ? (
                    articles?.map((art: any, i: number) => (
                      <HorizontalArticleItem
                        id={art._id}
                        title={art.title}
                        slug={art.slug}
                        image={art.image?.url}
                        caption={art.content}
                        category={art.category}
                        postedBy={art.postedBy}
                        readDuration={art.readDuration}
                        key={i}
                        savedBy={art.savedBy}
                        pinnedBy={art.pinnedBy}
                        onProfile={isCurrentUser}
                      />
                    ))
                  ) : (
                    activeUList === "READING_LIST" &&
                    articles?.length > 0 &&
                    articles?.map((art: any, i: number) => (
                      <HorizontalArticleItem
                        id={art._id}
                        title={art.title}
                        slug={art.slug}
                        image={art.image?.url}
                        caption={art.content}
                        category={art.category}
                        postedBy={art.postedBy}
                        readDuration={art.readDuration}
                        key={i}
                        savedBy={art.savedBy}
                        pinnedBy={art.pinnedBy}
                        onProfile={!isCurrentUser}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </ProfileRenderer>
        <Footer />
      </>
    </>
  );
};

export default Profile;

const ProfileRenderer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .user-card {
    width: 100%;
    height: fit-content;
    min-height: 100vh;
    background: #fff;
    overflow: visible;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .user-card-img {
    --size: 100px;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    transform: translateY(-50%);
    position: relative;
    transition: all 0.3s ease-in-out;
    top: 50px;
  }
  .user-card-img img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 50%;
    cursor: pointer;
  }
  .user-card-img::before {
    content: "";
    border-radius: inherit;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    border: 4px solid #057a85;
    border-style: inset;
  }
  .p-cnt-cont {
    display: flex;
    flex: row;
    padding: 2px 4px;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .usr-call {
    background-color: #b7c7c9;
    color: #fff;
  }
  .usr-mail {
    background-color: #0b4457;
    color: #fff;
  }
  .usr-call,
  .usr-mail {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-weight: 600;
  }
  .usr-conn span {
    border-left: 1px solid #ccc;
    padding-left: 5px;
    color: gray;
  }
  .user-card-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5px;
    overflow-y: hidden;
    gap: 10px;
    width: 100%;
    margin-top: 10px;
  }

  .user-card:hover .user-card-img {
    --size: 120px;
    width: var(--size);
    height: var(--size);
  }

  .ref-url {
    background-color: #176984;
    color: #fff;
    cursor: copy;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-family: "Inter", sans-serif;
  }

  .ref-copy-icon {
    height: 20px;
    width: 20px;
    cursor: pointer;
  }

  .user-card-header {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 5px;
  }

  .u-nav-tab {
    border: 1px solid #ededed;
    background-color: #fff;
    border-radius: 5px;
    position: fixed;
    right: 20px;
    top: 95px;
    max-width: 200px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  #u-ul {
    width: 100%;
    list-style: none;
  }
  #u-ul li {
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
    color: rgb(0, 0, 0);
    border-bottom: 1px solid #ededed;
    padding: 10px;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  #u-ul li:hover {
    background-color: #176984;
    color: #fff;
    transition: all 0.3s ease-out;
  }
  #u-ul li span:hover {
    color: #fff;
    transition: all 0.3s ease-out;
  }

  #u-ul li:last-child {
    border-bottom: none;
  }
  #u-ul li:first-child:hover {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  #u-ul li:last-child:hover {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .u-ul-icon {
    height: 18px;
    width: 18px;
    margin-right: 13px;
  }
  .u-edit-prof {
    position: absolute;
    left: 85%;
    bottom: -10px;
    cursor: pointer;
  }

  .u-setting {
    padding: 5px;
    border-radius: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
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

  .user-bio-segment {
    max-width: 600px;
    height: fit-content;
    font-weight: 600;
    font-size: 18px;
    padding: 5px 10px;
    border-left: 3px solid #176984;
  }

  .user-bio {
    font-size: 0.75rem;
    color: #8b8e98;
    font-weight: 600;
    text-overflow: hidden;
    text-align: flex-start;
    white-space: wrap;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    padding-bottom: 6px;
  }
  .user-joined-date,
  .user-sch {
    display: flex;
    gap: 4px;
    font-size: 12px;
    color: #000000;
    text-overflow: hidden;
    text-align: flex-start;
    white-space: wrap;
    font-weight: 600;
    font-family: "Inter", sans-serif;
  }
  .user-sch {
    padding-top: 5px;
  }

  .pinned-article-segment {
    width: 100%;
    height: fit-content;
    border-top: 1px solid #ededed;
    font-weight: 600;
    font-size: 18px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .pinned-article-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-bottom: 5px;
    gap: 4px;
    align-items: center;
  }
  .pinned-article-list {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    overflow-x: scroll;
    padding: 0px 5px;
  }

  .user-interest-segment {
    width: 100%;
    height: fit-content;
    border-top: 1px solid #ededed;
    border-bottom: 1px solid #ededed;
    font-weight: 600;
    font-size: 18px;
    padding: 5px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
  }
  .user-interest-header {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  .manage-interest {
    display: flex;
    font-size: 14px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    color: grey;
    cursor: pointer;
  }
  .user-interest-holder {
    height: fit-content;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    padding: 5px;
    gap: 5px;
    overflow-x: auto;
  }

  .user-interest-holder::-webkit-scrollbar {
    display: none;
  }

  .user-interest-item {
    width: fit-content;
    height: fit-content;
    border-radius: 25px;
    border: 1.5px solid #176984;
    padding: 5px 10px;
    font-size: 0.75rem;
    color: #8b8e98;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: 0.3s ease-in;
    cursor: pointer;
  }
  .user-interest-item:hover {
    background-color: #176984;
    color: #ffffff;
  }

  .u-articles-segment {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: fit-content;
    border-bottom: 1px solid #ededed;
    font-weight: 600;
    font-size: 18px;
    position: relative;
    padding: 5px 10px;
  }
  .u-art-head {
    width: 100%;
    display: flex;
    gap: 20px;
    margin-bottom: 5px;
    border-bottom: 1px solid #ededed;
  }
  .u-list-active {
    color: #000;
    border-bottom: 3px solid #176984;
    padding: 3px 6px;
    transition: 0.3s ease-in-out;
    cursor: pointer;
    font-family: "Inter", sans-serif;
    font-size: 15px;
  }
  .u-list-inactive {
    font-family: "Inter", sans-serif;
    color: grey;
    cursor: pointer;
    font-size: 15px;
  }
  .u-article-list {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: 10px;
    flex-wrap: wrap;
  }

  @media (max-width: 767px) {
    .user-interest-item {
      font-size: 0.65rem;
    }

    .manage-interest {
      font-size: 15px;
    }
    #u-ul li {
      font-size: 10px;
    }
    .u-ul-icon,
    .ref-copy-icon {
      height: 14px;
      width: 14px;
    }
  }
`;

const CategoryChip = styled(Chip)`
  &:hover {
    background-color: #176984;
    color: #ffffff;
  }
`;
