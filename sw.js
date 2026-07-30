// Scarce service worker — makes the site installable and lets already-
// visited pages load offline. Deliberately does NOT cache anything
// from the Supabase API (ratings, calculations, your portfolio data) —
// that's live financial data, and showing a stale cached calculation
// while offline would be actively misleading, not just inconvenient.
// Only the static page shell (HTML/CSS/JS/icons) is cached.

var CACHE_NAME = "scarce-shell-v1";
var SHELL_FILES = [
  "index.html", "shared.css", "shared.js", "manifest.json",
  "icons/icon-192.png", "icons/icon-512.png"
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(SHELL_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(names.filter(function(n){ return n !== CACHE_NAME; }).map(function(n){ return caches.delete(n); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(event){
  var url = new URL(event.request.url);

  // Never intercept Supabase API calls — always go to the network so
  // ratings, calculations, and your own data are never served stale.
  if(url.hostname.indexOf("supabase.co") !== -1){
    return;
  }

  // Same-origin static files: network first, fall back to cache if offline
  event.respondWith(
    fetch(event.request).then(function(res){
      var resClone = res.clone();
      caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, resClone); });
      return res;
    }).catch(function(){
      return caches.match(event.request);
    })
  );
});
