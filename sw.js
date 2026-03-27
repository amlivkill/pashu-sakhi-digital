const CACHE_NAME = 'pashu-sakhi-v1.2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/style.css',
    './js/app.js',
    './js/i18n.js',
    './manifest.json',
    './js/components/ActivityForm.js',
    './js/components/AdminDashboard.js',
    './js/components/Dashboard.js',
    './js/components/History.js',
    './js/components/Login.js',
    './js/components/ProductForm.js',
    './js/components/Profile.js',
    './js/components/TreatmentForm.js',
    './js/components/VODashboard.js',
    './js/services/MasterData.js',
    './js/services/db.js',
    './js/services/gps.js',
    './js/services/seeder.js',
    './js/services/sync.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting()) // Force immediate update
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Clearing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Take control immediately
    );
});

self.addEventListener('fetch', (event) => {
    // Basic cache-first strategy
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
