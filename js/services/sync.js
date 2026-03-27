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

        // Send to Supabase
        for (const entry of pending) {
            try {
                // Using the new Supabase Service
                await window.SupabaseService.uploadReport(entry);
                
                // After successful sync, mark as synced in local DB
                entry.synced = true;
                await window.DB.saveEntry(entry); 
                
                console.log(`Entry ${entry.id} synced to Supabase.`);
            } catch (err) {
                console.error(`Failed to sync entry ${entry.id}`, err);
            }
        }

        alert(`✅ Synced ${pending.length} reports to Supabase Cloud!`);
    }
};

// Auto-sync when coming online
window.addEventListener('online', () => {
    console.log("Back Online! Triggering Sync...");
    window.SyncManager.syncPending();
});
