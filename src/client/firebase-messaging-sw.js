/* eslint-disable no-undef */

importScripts("https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.6.0/firebase-messaging.js");

const CACHE_VERSION = "v1";
const CACHE_NAME = `fcabalCache-${CACHE_VERSION}`;

firebase.initializeApp({
  apiKey: "AIzaSyDhjjVtYMqQ06Etm_UpXz2AJcNt0Iev5no",
  authDomain: "frontierscabal-60fc0.firebaseapp.com",
  projectId: "frontierscabal-60fc0",
  storageBucket: "frontierscabal-60fc0.appspot.com",
  messagingSenderId: "906918820628",
  appId: "1:906918820628:web:80d2faf389a5e6cc9de001",
  measurementId: "G-GFK3K092CB",
});

const messaging = firebase.messaging();
const notificationChannel = new BroadcastChannel("FC:NOTIFICATION:CHANNEL");

// Handle background push notifications
messaging.onBackgroundMessage((payload) => {
  const notificationData = payload.notification || {};
  const title =
    notificationData?.articleFrom ||
    notificationData?.username ||
    notificationData?.eventFrom ||
    "New Notification";

  const icon = notificationData?.avatar;
  const image = notificationData?.image;
  const body = notificationData?.message;
  const badge = "/src/assets/logos/fcabal.png";
  const timeframe = notificationData?.date || Date.now();

  const options = {
    body,
    icon,
    image,
    badge,
    vibrate: [100, 50, 100],
    timestamp: timeframe,
  };

  // Broadcast the notification to the app
  notificationChannel.postMessage({
    type: "push-notification",
    message: notificationData,
  });

  // Show the notification
  self.registration.showNotification(title, options);
});

// Handle notification click events
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(
      `https://frontierscabal.com/#${event.notification?.data?.slug || `/`}`
    )
  );
});

// Caching logic
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (
        response &&
        !navigator.onLine &&
        self.location.hostname !== "localhost"
      ) {
        console.log("Found in Cache");
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              if (event.request.method !== "POST") {
                cache.put(event.request, responseClone);
              }
            });
          }

          return response;
        })
        .catch((err) => {
          console.log("Error Fetching & Caching New Data", err);
        });
    })
  );
});

// Handle messages for skipping waiting
self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
