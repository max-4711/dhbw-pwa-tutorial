console.log("Hello from service worker");

const cacheName = "offline-cache";

const files = [
    '.',
    'about.html',
    'app.js',
    'helpers.js',
    'icon.png',
    'index.html',
    'main.js',
    'manifest.json',
    'style.css'
];

self.addEventListener('install', (event) => {
    event.waitUntil((async() => {
        self.skipWaiting();
        const cache = await caches.open(cacheName);
        await cache.addAll(files);
    })());
});
  
self.addEventListener('activate', (event) => {
    event.waitUntil((async() => {
        self.clients.claim();
    })());
});

self.addEventListener('fetch', (event) => {
    event.respondWith((async () => {
        const url = event.request.url;
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(url);
        
        if (cachedResponse) {
            console.log(`From cache: ${url}`);
            return cachedResponse;
        }
        console.log(`From network: ${url}.`);
        return fetch(url);
    })());
});