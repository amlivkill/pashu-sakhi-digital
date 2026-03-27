const DB_NAME = 'pashu_sakhi_db';
const DB_VERSION = 1;
const STORE_NAME = 'entries';

// Global Scope for file:// protocol support
window.DB = {
    open: () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => reject("Database error: " + event.target.errorCode);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "id" });
                }
            };

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    },

    saveEntry: async (entry) => {
        const db = await window.DB.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(entry);

            request.onsuccess = () => resolve(entry.id);
            request.onerror = (e) => reject(e);
        });
    },

    getAllEntries: async () => {
        const db = await window.DB.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e);
        });
    },

    deleteEntry: async (id) => {
        const db = await window.DB.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e);
        });
    }
};
