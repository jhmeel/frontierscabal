import React, { useEffect, lazy, Suspense, useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/header/Header";
import Bot from "./components/Bot/Bot";
import toast, { useToasterStore } from "react-hot-toast";
import { PrivateRoute } from "./components/privateRoute/PrivateRoute";
import { isOnline } from "./utils";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "./theme/theme";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "./actions/notification";
import ScrollReveal from "scrollreveal";
import { IconCloudOffline16 } from "./assets/icons";
import MultiTextLoader from "./components/loaders/multiTextLoader";
import MainLoader from "./components/loaders/MainLoader";
import { messaging } from "./firebase";
import { onMessage } from "firebase/messaging";
import { NOTIFICATION } from "./types";
import getToken from "./utils/getToken";
import axiosInstance from "./utils/axiosInstance";

const CreateModulePage = lazy(() => import("./pages/module/CreateModule"));
const HomePage = lazy(() => import("./pages/home/Home"));
const ModulePage = lazy(() => import("./pages/module/Module"));
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

const ChatRoomPage = lazy(() => import("./pages/chat/ChatRoom"));
const ChatPage = lazy(() => import("./pages/chat/Chats"));

const DiscussionList = lazy(
  () => import("./components/discusssion/DiscussionList")
);
const DiscussionRoom = lazy(() => import("./pages/discussion/Discussion"));
const CreateDiscussion = lazy(
  () => import("./components/discusssion/CreateDiscussion")
);
const Pricing = lazy(() => import("./pages/billing/Billing"));

function App() {
  const { pathname } = useLocation();
  const { user } = useSelector((state: any) => state.user);

  const theme = useMemo(() => getTheme("light"), ["light"]);

  const dispatch = useDispatch();

  const { toasts } = useToasterStore();

  const TOAST_LIMIT = 2;
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  // Function to send the subscription to the server
  const subscribe = async (subscription:any) => {
    try {
      const authToken = await getToken();
      if (authToken) {
        await axiosInstance(authToken).post(
          "/api/v1/push-subscription",
          JSON.stringify(subscription)
        );
        console.log("Subscription to webpush done successfully!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    navigator.serviceWorker &&
      navigator.serviceWorker.register("/firebase-messaging-sw.js");

    navigator.serviceWorker.ready
      .then(async (registration) => {
        try {
          let subscription = await registration.pushManager.getSubscription();
          if (!subscription) {
            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey:
                "BOxh7Wy4nDeWLSGi9BWUzzvfJw0EFDub2iDU0HoWLQ9PAX6DwwAx8yKtXBL3P5XkwaSMgXXye-odg69N_ui_2QM",
            });

            // Send subscription to server
            await subscribe(subscription);
          }

          // Listen for push subscription change
          navigator.serviceWorker.addEventListener(
            "pushsubscriptionchange",
            async (event) => {
              console.log("Push subscription has changed.");
              const newSubscription = event?.newSubscription;
              await subscribe(newSubscription);
            }
          );
        } catch (err) {
          console.log(err);
        }

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                // A new service worker is installed but not yet active.
                // You can notify the user or take some action here.
                console.log(
                  "New content is available and will be used when all " +
                    "tabs for this page are closed. See https://bit.ly/CRA-PWA."
                );

                // Optionally, you can force the new service worker to become active
                // by calling registration.waiting.postMessage({ action: "skipWaiting" });
                // This will skip the "waiting" state and activate the new service worker immediately.

                // You might want to show a UI message to the user, asking them to reload the page.
              }
            };
          }
        };
      })
      .catch((error) => {
        console.error("Error during service worker registration:", error);
      });
  }, []);

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
    // Foreground notifications
    const unsubscribe = onMessage(messaging, (payload: any) => {
      const { title, body, avatar, image } = payload.notification;

      dispatch<any>(addNotification(payload?.notification as NOTIFICATION));

      toast.custom((t) => (
        <div
          style={{
            animation: t.visible
              ? "enter 0.3s ease-in-out"
              : "leave 0.3s ease-in-out",
            maxWidth: "320px",
            width: "100%",
            backgroundColor: "white",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            pointerEvents: "auto",
            display: "flex",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ flex: "1", padding: "16px", width: "0" }}>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div style={{ flexShrink: "0", paddingTop: "2px" }}>
                <img
                  style={{
                    height: "40px",
                    width: "40px",
                    borderRadius: "9999px",
                  }}
                  src={avatar || image}
                  alt=""
                />
              </div>
              <div style={{ marginLeft: "12px", flex: "1" }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "rgb(17, 24, 39)",
                    margin: "0",
                  }}
                >
                  {title}
                </p>
                <p
                  style={{
                    marginTop: "4px",
                    fontSize: "14px",
                    color: "rgb(107, 114, 128)",
                  }}
                >
                  {body}
                </p>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              borderLeft: "1px solid rgb(229, 231, 235)",
            }}
          >
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "0 8px 8px 0",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "500",
                color: "teal",
                backgroundColor: "transparent",
                cursor: "pointer",
                outline: "none",
              }}
            >
              Close
            </button>
          </div>
        </div>
      ));
    });
    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const notificationChannel = new BroadcastChannel("FC:NOTIFICATION:CHANNEL");
    notificationChannel.addEventListener("message", (event) => {
      if (event.data && event.data?.type === "push-notification") {
        dispatch<any>(addNotification(event.data.message));
      }
    });
    return () => {
      notificationChannel.close();
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

  const regex =
    /^\/(biller|discuss-room|chat|login|signup|password\/forgot)(\/.*)?$/;
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
          {!regex.test(pathname) && (
            <>
              <Header />
              <Bot />
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
            {/*<Route
              path="/module/:moduleId"
              element={
                <PrivateRoute>
                  <ModulePage />
                </PrivateRoute>
              }
            />
           <Route
              path="/modules"
              element={
                <PrivateRoute>
                  <ModuleListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/module/new"
              element={
                <PrivateRoute>
                  <CreateModulePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/lesson/new/:moduleId"
              element={
                <PrivateRoute>
                  <UploadLessonPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/lesson/update/:lessonId"
              element={
                <PrivateRoute>
                  <UpdateLessonPage />
                </PrivateRoute>
              }
            />*/}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/search" element={<BlogPage />} />
            <Route path="/blog/article/:slug" element={<ArticleViewPage />} />
            <Route
              path="/blog/article/new"
              element={
                <PrivateRoute>
                  <EditorPage />
                </PrivateRoute>
              }
            />
            <Route path="/search" element={<SearchPage />} />

            <Route
              path="/discuss"
              element={
                <PrivateRoute>
                  <DiscussionList currentUser={user} />
                </PrivateRoute>
              }
            />
            <Route
              path="/discuss-room/:discussionId"
              element={
                <PrivateRoute>
                  <DiscussionRoom currentUser={user} />
                </PrivateRoute>
              }
            />

            <Route
              path="/discuss/create"
              element={
                <PrivateRoute>
                  <CreateDiscussion currentUser={user} />
                </PrivateRoute>
              }
            />

            <Route path="/biller" element={<Pricing />} />

            <Route path="/events" element={<EventPage />} />
            <Route path="/event/:slug" element={<EventViewPage />} />
            <Route path="/events/search" element={<EventPage />} />
            <Route path="/event/new" element={<NewEventPage />} />
            <Route path="/event/update/:slug" element={<UpdateEventPage />} />

            <Route
              path="/study-materials"
              element={
                <PrivateRoute>
                  <StudyMaterialPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/study-material/new"
              element={
                <PrivateRoute>
                  <StudyMaterialUploadPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile/:username"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile/"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <PrivateRoute>
                  <EditProfilePage />
                </PrivateRoute>
              }
            />
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

            <Route
              path="/personalize"
              element={
                <PrivateRoute>
                  <PersonalizePage />
                </PrivateRoute>
              }
            />

            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />

            <Route
              path="/chat/:username"
              element={
                <PrivateRoute>
                  <ChatRoomPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/chats"
              element={
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </>
  );
}

export default App;
