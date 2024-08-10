const CACHE_VERSION = "v1";
const CACHE_NAME = `fcabalCache-${CACHE_VERSION}`;

self.addEventListener("install", function (event) {
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
      // .then(() => {
      //   return caches.open(CACHE_NAME).then(function (cache) {
      //     return cache.add("/Offline.html");
      //   });
      // })
      .then(() => {
        // Ensure that the new service worker activates immediately
        return self.clients.claim();
      })
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
      //  else if (!response && !navigator.onLine) {
      //   return caches.match("/Offline.html");
      // }

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
        .catch(function (err) {
          console.log("Error Fetching & Caching New Data", err);
        });
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});

// Handle push notifications
self.addEventListener("push", (event) => {
  if (!(self.Notification && self.Notification.permission === "granted")) {
    //notifications aren't supported or permission not granted!
    return;
  }
  const notificationData = event.data?.json();
  const title =
    notificationData?.articleFrom ||
    notificationData?.username ||
    notificationData?.eventFrom;

  const icon = notificationData?.avatar;
  const image = notificationData?.image;
  const timeframe = notificationData?.date || Date.now();
  const body = notificationData?.message;
  const badge = "/icon-48x48.png";

  const options = {
    icon,
    image,
    timeframe,
    body,
    badge,
    vibrate: [100, 50, 100],
  };
  event.waitUntil(self.registration.showNotification(title, options));
  const bc = new BroadcastChannel("push-channel");
  bc.postMessage({
    type: "push-notification",
    message: notificationData,
  });
});
// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("https://frontierscabal.com"));
});
