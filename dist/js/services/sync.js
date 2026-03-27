// Removed import, assuming window.DB exists

window.SyncManager = {
    // Save entry to local DB and try to sync if online
    addEntry: async (data) => {
        const entry = {
            id: new Date().getTime().toString(), // Simple ID
            data: data,
            synced: false,
            createdAt: new Date().toISOString()
        };

        await window.DB.saveEntry(entry);
        console.log("Entry saved locally:", entry);

        if (navigator.onLine) {
            await window.SyncManager.syncPending();
        } else {
            console.log("Offline: Entry queued for sync.");
        }
    },

    // Sync all pending entries
    syncPending: async () => {
        const entries = await window.DB.getAllEntries();
        const pending = entries.filter(e => !e.synced);

        if (pending.length === 0) return;

        console.log(`Syncing ${pending.length} entries...`);

        // Simulate API call for each
        for (const entry of pending) {
            try {
                await mockApiUpload(entry);
                // After successful sync, we could either delete it or mark it as synced.
                // For this demo, let's delete it from offline queue to keep it clean, 
                // or move to a "history" store. We'll just delete.
                await window.DB.deleteEntry(entry.id);
                console.log(`Entry ${entry.id} synced and removed from queue.`);
            } catch (err) {
                console.error(`Failed to sync entry ${entry.id}`, err);
            }
        }

        alert(`✅ Synced ${pending.length} reports to cloud!`);
    }
};

function mockApiUpload(entry) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Uploaded to Cloud:", entry);
            resolve(true);
        }, 1000); // 1 sec delay per entry
    });
}

// Auto-sync when coming online
window.addEventListener('online', () => {
    console.log("Back Online! Triggering Sync...");
    window.SyncManager.syncPending();
});
