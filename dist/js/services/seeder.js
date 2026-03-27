window.Seeder = {
    init: async () => {
        const entries = await window.DB.getAllEntries();
        if (entries.length === 0) {
            console.log("Seeding 5 sample records...");
            const sampleData = [
                {
                    id: "seed_1",
                    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
                    synced: true,
                    data: {
                        activityType: "treatment",
                        block: "Augustmuni",
                        hospital: "Munnadeval",
                        village: "Sari",
                        beneficiary: "Ramesh Singh",
                        animal_type: "Cow (Badri)",
                        medicine: "Melonex",
                        fees: "200",
                        location: { lat: 30.2937, lng: 79.2132 }
                    }
                },
                {
                    id: "seed_2",
                    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
                    synced: true,
                    data: {
                        activityType: "vaccination",
                        block: "Jakholi",
                        hospital: "Jakholi",
                        village: "Bhardar",
                        beneficiary: "Sita Devi",
                        animal_type: "Buffalo",
                        vaccine: "FMD",
                        batch: "BATCH-001",
                        location: { lat: 30.2990, lng: 79.2150 }
                    }
                },
                {
                    id: "seed_3",
                    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                    synced: false,
                    data: {
                        activityType: "badri",
                        block: "Ukhimath",
                        hospital: "Ukhimath",
                        village: "Makku",
                        beneficiary: "Gopal Rawat",
                        tag_no: "10023",
                        milk_am: "4",
                        milk_pm: "3.5",
                        location: { lat: 30.4832, lng: 79.2312 }
                    }
                },
                {
                    id: "seed_4",
                    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
                    synced: true,
                    data: {
                        activityType: "awareness",
                        block: "Augustmuni",
                        hospital: "Chandrapuri",
                        village: "Chandrapuri",
                        topic: "De-worming Best Practices",
                        attendees: "15",
                        location: { lat: 30.3000, lng: 79.1000 }
                    }
                },
                {
                    id: "seed_5",
                    createdAt: new Date().toISOString(),
                    synced: false,
                    data: {
                        activityType: "insurance",
                        block: "Jakholi",
                        hospital: "Chirbatiya",
                        village: "Chirbatiya",
                        beneficiary: "Vikram Singh",
                        tag_no: "998877",
                        company: "United India",
                        premium: "1500",
                        location: { lat: 30.3500, lng: 78.9500 }
                    }
                }
            ];

            for (const entry of sampleData) {
                await window.DB.saveEntry(entry);
            }
            console.log("Seeding complete.");

            // Notify user in UI (Toast or Alert) if app is already loaded
            // But usually this runs on boot.
        }
    }
};
