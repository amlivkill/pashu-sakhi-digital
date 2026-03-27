window.Seeder = {
    init: async () => {
        const entries = await window.DB.getAllEntries();
        if (entries.length === 0) {
            console.log("Seeding 50 mock records for 1 month simulation...");
            const activityTypes = [
                { type: 'treatment', icon: '💉', fields: { animal_type: ['Cow', 'Buffalo', 'Goat'], medicine: ['Melonex', 'Atropine', 'B-Complex'], fees: ['150', '200', '300'] } },
                { type: 'vaccination', icon: '💊', fields: { animal_type: ['Buffalo', 'Goat'], vaccine: ['FMD', 'HS', 'BQ'], batch: ['B-2024', 'B-2025'] } },
                { type: 'product_listing', icon: '🥛', fields: { productType: ['Ghee', 'Fresh Milk', 'Paneer'], quantity: ['2', '5', '10'], price: ['100', '500', '1200'], farmerName: ['Rajesh', 'Suntia', 'Kamla'], status: ['available', 'interested', 'sold'] } },
                { type: 'census', icon: '📝', fields: { animal_type: ['Badri Cow', 'Sheep'], tag_no: ['TN99', 'TN88', 'TN77'] } }
            ];

            const villages = ['Dangi', 'Kandara', 'Sari', 'Makku', 'Giriya', 'Devshal'];
            const beneficiaries = ['Ram Singh', 'Deepa Devi', 'Vikram Negi', 'Sohan Lal', 'Priya Thapliyal'];

            const mockData = [];
            const now = new Date();

            for (let i = 1; i <= 50; i++) {
                const act = activityTypes[Math.floor(Math.random() * activityTypes.length)];
                const daysAgo = Math.floor(Math.random() * 30);
                const date = new Date(now.getTime() - (86400000 * daysAgo));

                const entryData = {
                    activityType: act.type,
                    village: villages[Math.floor(Math.random() * villages.length)],
                    beneficiary: beneficiaries[Math.floor(Math.random() * beneficiaries.length)],
                    block: "Augustyamuni",
                    hospital: "Veterinary Hospital Munnadeval",
                    location: { lat: 30.29 + (Math.random() * 0.1), lng: 79.21 + (Math.random() * 0.1) }
                };

                // Add specific fields
                Object.keys(act.fields).forEach(key => {
                    const values = act.fields[key];
                    entryData[key] = values[Math.floor(Math.random() * values.length)];
                });

                // For product listings, add a mock photo
                if (act.type === 'product_listing') {
                    entryData.photo = "https://images.unsplash.com/photo-1550583760-b80c103126f5?auto=format&fit=crop&w=200&q=80";
                }

                mockData.push({
                    id: `seed_${i}`,
                    createdAt: date.toISOString(),
                    synced: Math.random() > 0.3,
                    data: entryData
                });
            }

            for (const entry of mockData) {
                await window.DB.saveEntry(entry);
            }
            console.log("Seeding complete. 50 records ready for VO.");
            localStorage.setItem('seeded', 'true');
        }
    }
};
