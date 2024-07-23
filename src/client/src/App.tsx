import React, { useEffect, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/header/Header";
import toast, { useToasterStore } from "react-hot-toast";
import {
  PrivateRoute,
  AdminOnlyRoute,
} from "./components/privateRoute/PrivateRoute";
import { isOnline } from "./utils";

import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "./actions/notification";
import ScrollReveal from "scrollreveal";
import { IconCloudOffline16 } from "./assets/icons";
import MultiTextLoader from "./components/loaders/multiTextLoader";
import MainLoader from "./components/loaders/MainLoader";

const CreateModulePage = lazy(() => import("./pages/module/CreateModule"));
const HomePage = lazy(() => import("./pages/home/Home"));
const ModulePage = lazy(() => import("./pages/module/Module"));
const Misc = lazy(() => import("./pages/misc/Misc"));
const ModuleListPage = lazy(() => import("./pages/module/ModuleList"));
const HelpPage = lazy(() => import("./pages/help/Help"));
const ContactUsPage = lazy(() => import("./pages/contactus/ContactUs"));

const SignupPage = lazy(() => import("./pages/auth/Signup"));
const LoginPage = lazy(() => import("./pages/auth/Login"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPassword"));

const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPassword"));
const ProfilePage = lazy(() => import("./pages/profile/Profile"));
const EditProfilePage = lazy(() => import("./pages/profile/EditProflle"));
const UploadLessonPage = lazy(() => import("./pages/module/UploadLesson"));
const BookmarksPage = lazy(() => import("./pages/bookmark/Bookmark"));
const UpdateArticlePage = lazy(() => import("./pages/blogger/UpdateArticle"));
const UpdateLessonPage = lazy(() => import("./pages/module/UpdateLesson"));
const NotificationPage = lazy(
  () => import("./pages/notification/Notification")
);
const SearchPage = lazy(() => import("./pages/search/Search"));
const BlogPage = lazy(() => import("./pages/blogger/Blog"));
const EventPage = lazy(() => import("./pages/event/Events"));
const UpdateEventPage = lazy(() => import("./pages/event/UpdateEvent"));
const ArticleViewPage = lazy(() => import("./pages/blogger/ArticleViewer"));
const EventViewPage = lazy(() => import("./pages/event/EventViewer"));
const NewEventPage = lazy(() => import("./pages/event/NewEvent"));
const EditorPage = lazy(() => import("./pages/blogger/Editor"));
const PrivacyPolicyPage = lazy(
  () => import("./pages/privacy_policy/PrivacyPolicy")
);
const TermsOfServicePage = lazy(
  () => import("./pages/terms_of_service/TermsOfService")
);
const StudyMaterialPage = lazy(
  () => import("./pages/study_material/StudyMaterial")
);
const StudyMaterialUploadPage = lazy(
  () => import("./pages/studymaterialuploader/StudyMaterialUploader")
);
const PersonalizePage = lazy(() => import("./pages/personalize/Personalize"));

const NotFoundPage = lazy(() => import("./pages/notfound/Notfound"));
const UpdatePasswordPage = lazy(() => import("./pages/auth/UpdatePassword"));

function App() {
  const { pathname } = useLocation();
  const { user } = useSelector((state: any) => state.user);
  const { theme } = useSelector((state: any) => state.theme);
  const dispatch = useDispatch();

  const { toasts } = useToasterStore();

  const TOAST_LIMIT = 2;
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  useEffect(() => {
    const sr: any = ScrollReveal({
      origin: "top",
      distance: "80px",
      duration: 2000,
      reset: true,
    });

    sr.reveal(
      [
        `#MsgItem`,
        "trending-articles",
        "module_list",
        "upcoming-events-list",
        "recent-article-list-holder",
      ],
      { opacity: 0, interval: 300 }
    );
  }, []);

  useEffect(() => {
    const tId = setTimeout(() => {
      if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    }, 10000);
    clearTimeout(tId);
  }, []);

  useEffect(() => {
    const bc = new BroadcastChannel("push-channel");
    bc.addEventListener("message", (event) => {
      if (event.data && event.data?.type === "push-notification") {
        dispatch<any>(addNotification(event.data.message));
      }
    });
    return () => {
      bc.removeEventListener("message", () => {});
    };
  }, []);

  useEffect(() => {
    if (!isOnline()) {
      toast("You are currently offline!", {
        style: {
          backgroundColor: "gray",
          color: "#fff",
        },
        icon: <IconCloudOffline16 />,
      });
    }
  }, [pathname]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);
  return (
    <>
      <Suspense
        fallback={
          pathname === "/" ? (
            <div>
              <MultiTextLoader />
            </div>
          ) : (
            <div>
              <MainLoader />
            </div>
          )
        }
      >
        {!["/login", "/#/login", "/signup", "/#/signup"].includes(pathname) && (
          <>
            <Header />
          </>
        )}
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/:refCode" element={<SignupPage />} />
          <Route path="/password/forgot" element={<ForgotPasswordPage />} />
          <Route
            path="/password/reset/:token"
            element={<ResetPasswordPage />}
          />

          <Route path="/password/update" element={<UpdatePasswordPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<HomePage />} />
          <Route path="/module/:moduleId" element={<ModulePage />} />
          <Route path="/modules" element={<ModuleListPage />} />
          <Route path="/module/new" element={<CreateModulePage />} />
          <Route path="/lesson/new/:moduleId" element={<UploadLessonPage />} />
          <Route
            path="/lesson/update/:lessonId"
            element={<UpdateLessonPage />}
          />

          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/search" element={<BlogPage />} />
          <Route path="/blog/article/:slug" element={<ArticleViewPage />} />
          <Route path="/blog/article/new" element={<EditorPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/event/:slug" element={<EventViewPage />} />
          <Route path="/events/search" element={<EventPage />} />
          <Route path="/event/new" element={<NewEventPage />} />
          <Route path="/event/update/:slug" element={<UpdateEventPage />} />

          <Route path="/study-materials" element={<StudyMaterialPage />} />
          <Route
            path="/study-material/new"
            element={<StudyMaterialUploadPage />}
          />

          <Route path="/profile/:username" element={<ProfilePage />} />

          <Route
            path="/profile/"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route
            path="/bookmarks"
            element={
              <PrivateRoute>
                <BookmarksPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/blog/article/new"
            element={
              <PrivateRoute>
                <EditorPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/blog/article/update/:slug"
            element={
              <PrivateRoute>
                <UpdateArticlePage />
              </PrivateRoute>
            }
          />
          <Route path="/personalize" element={<PersonalizePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />

          {
            //<Route path="/misc" element={<Misc />} />
          }
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
