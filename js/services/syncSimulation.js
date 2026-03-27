/**
 * Sync Simulation Service
 * Generates the first set of reports for 15 Pashu Sakhis and simulates sync.
 */

window.SyncSimulation = {
    pashuSakhis: [
        { name: "Smt. Rekha Devi", mobile: "8650864393", hospital: "Rudraprayag Sadar", block: "Augustyamuni" },
        { name: "Smt. Shivdei Devi", mobile: "8171073067", hospital: "Augustyamuni", block: "Augustyamuni" },
        { name: "Smt. Rajni Devi", mobile: "9627482998", hospital: "Durgadhar", block: "Augustyamuni" },
        { name: "Smt. Kusum Devi", mobile: "9627317779", hospital: "Kyunja", block: "Augustyamuni" },
        { name: "Smt. Beena Devi", mobile: "8057603414", hospital: "Sumadi Bhardar", block: "Jakholi" },
        { name: "Smt. Anju Devi", mobile: "9068422301", hospital: "Sumadi Bhardar", block: "Jakholi" },
        { name: "Smt. Sunita Devi", mobile: "7830244522", hospital: "Sumadi Bhardar", block: "Jakholi" },
        { name: "Smt. Aruna Devi", mobile: "8532845881", hospital: "Chauria Bhardar", block: "Jakholi" },
        { name: "Smt. Sama Devi", mobile: "7466835845", hospital: "Jakholi", block: "Jakholi" },
        { name: "Smt. Geeta Devi", mobile: "7467853036", hospital: "Ukhimath", block: "Ukhimath" },
        { name: "Smt. Neema Devi", mobile: "9761783511", hospital: "Ukhimath", block: "Ukhimath" },
        { name: "Smt. Rekha Devi", mobile: "9897937642", hospital: "Ukhimath", block: "Ukhimath" },
        { name: "Smt. Shanta Devi", mobile: "9675728705", hospital: "Phata", block: "Ukhimath" },
        { name: "Smt. Deepa Devi", mobile: "9536802661", hospital: "Phata", block: "Ukhimath" },
        { name: "Smt. Munni Devi", mobile: "8958720275", hospital: "Rampur", block: "Ukhimath" }
    ],

    activityTypes: [
        { type: 'treatment', icon: '💉', fields: { animal_type: ['Cow', 'Buffalo', 'Goat'], medicine: ['Melonex', 'Atropine', 'B-Complex'], fees: ['150', '200', '300'] } },
        { type: 'vaccination', icon: '💊', fields: { animal_type: ['Buffalo', 'Goat'], vaccine: ['FMD', 'HS', 'BQ'], batch: ['B-2024', 'B-2025'] } },
        { type: 'census', icon: '📝', fields: { animal_type: ['Badri Cow', 'Sheep'], tag_no: ['TN99', 'TN88', 'TN77'] } }
    ],

    villages: ['Dangi', 'Kandara', 'Sari', 'Makku', 'Giriya', 'Devshal'],
    beneficiaries: ['Ram Singh', 'Deepa Devi', 'Vikram Negi', 'Sohan Lal', 'Priya Thapliyal'],

    start: async () => {
        console.log("🚀 Starting Live Data Sync Simulation for 15 Pashu Sakhis...");
        
        // 1. Patch Supabase to simulate success
        const originalUpload = window.SupabaseService.uploadReport;
        window.SupabaseService.uploadReport = async (entry) => {
            console.log(`[SimSync] Uploading report for ${entry.id}...`);
            await new Promise(r => setTimeout(r, 100)); // Simulate network latency
            return { success: true };
        };

        let totalReports = 0;

        for (const sakhi of window.SyncSimulation.pashuSakhis) {
            console.log(`Generating data for ${sakhi.name}...`);
            
            // Set current sakhi in local storage for the sync logic to pick up the mobile
            localStorage.setItem('user', JSON.stringify({ name: sakhi.name, mobile: sakhi.mobile, role: 'sakhi' }));

            for (let i = 1; i <= 5; i++) {
                const act = window.SyncSimulation.activityTypes[Math.floor(Math.random() * window.SyncSimulation.activityTypes.length)];
                const date = new Date();
                
                const entryData = {
                    activityType: act.type,
                    village: window.SyncSimulation.villages[Math.floor(Math.random() * window.SyncSimulation.villages.length)],
                    beneficiary: window.SyncSimulation.beneficiaries[Math.floor(Math.random() * window.SyncSimulation.beneficiaries.length)],
                    block: sakhi.block,
                    hospital: sakhi.hospital,
                    sakhiName: sakhi.name,
                    location: { lat: 30.29 + (Math.random() * 0.1), lng: 79.21 + (Math.random() * 0.1) }
                };

                // Add specific fields
                Object.keys(act.fields).forEach(key => {
                    const values = act.fields[key];
                    entryData[key] = values[Math.floor(Math.random() * values.length)];
                });

                const entry = {
                    id: `sim_${sakhi.mobile}_${i}`,
                    createdAt: date.toISOString(),
                    synced: false,
                    data: entryData
                };

                await window.DB.saveEntry(entry);
                totalReports++;
            }
        }

        console.log(`✅ Generated ${totalReports} reports. Triggering Sync...`);
        
        // 2. Trigger Sync
        await window.SyncManager.syncPending();

        // 3. Restore original service
        window.SupabaseService.uploadReport = originalUpload;
        
        console.log("🎊 Simulation Complete! 15 Pashu Sakhis have performed their first Live Data Sync.");
        alert(`✅ Simulation Success!\n15 Pashu Sakhis synced ${totalReports} reports.`);
    }
};
