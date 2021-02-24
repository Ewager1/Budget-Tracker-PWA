const FILES_TO_CACHE = [
  "/",
  "./index.html",
  "./styles.css",
  "./dist/icons/icon_192x192.4052450372b804e8bab9e59e8ae25faa.png",
  "./dist/icons/icon_512x512.a8d33cecbeef5400701959e272e1e041.png",
  "./index.js",
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

//installation step
self.addEventListener("install", function (evt) {
  evt.waitUntil(
    //waitUntil is an async
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Your files were pre-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting(); //waiting step
});

//activation step
self.addEventListener("activate", function (evt) {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        //promise.all makes everything sent to server happen in order
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            //checks if cache exists and replaces if it does
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim(); //this says the service worker is fully created and is "good for use"
});

// fetch eNote: a fetch request is an umbrella any asynch request
self.addEventListener("fetch", function (evt) {
  // cache successful requests to the API
  if (evt.request.url.includes("/api/")) {
    // e note: if you see this api, check the cash for the cached api and respond from there. (this occurs is database is offline)
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then((cache) => {
          return fetch(evt.request)
            .then((response) => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }

              return response;
            })
            .catch((err) => {
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            });
        })
        .catch((err) => console.log(err))
    );

    return;
  }

  // if the request is not for the API, serve static assets using "offline-first" approach.
  // see https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-falling-back-to-network
  evt.respondWith(
    caches.match(evt.request).then(function (response) {
      return response || fetch(evt.request);
    })
  );
});
