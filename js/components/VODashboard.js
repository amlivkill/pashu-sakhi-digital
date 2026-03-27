window.VODashboard = function (user, navigateTo) {
    const render = () => `
    <header class="flex justify-between items-center mb-4 fade-in">
        <div>
            <h2 class="font-bold" style="font-size: 1.5rem;">${window.t('vo_dashboard_title')}</h2>
            <p class="text-sm text-secondary">${window.t('namaste')}, ${user.name}</p>
        </div>
         <button onclick="(() => { localStorage.removeItem('user'); window.location.reload(); })();" class="btn" style="width:auto; padding:5px 10px; background:#f4f4f4;">Logout</button>
    </header>

    <div class="card mb-4" style="background:#e0f2fe; color:#0369a1;">
        <h3 class="font-bold">Pending Approvals</h3>
        <p class="text-sm">Verify and sign reports submitted by Sakhis.</p>
    </div>

    <div id="vo-list" class="flex flex-col gap-4 pb-24">
        <div class="text-center text-secondary mt-10">
            <span class="spinner" style="display:inline-block;"></span> Loading pending reports...
        </div>
    </div>
    `;

    setTimeout(() => {
        const listContainer = document.getElementById('vo-list');

        // Load Pending Entries 
        window.DB.getAllEntries().then(entries => {
            console.log("VO Dashboard: Total entries in DB:", entries.length);

            // Filter: In a real app we check 'status' === 'pending'. 
            const pending = entries.filter(e => !e.approvalStatus || e.approvalStatus === 'pending');
            console.log("VO Dashboard: Pending entries after filtering:", pending.length);

            if (pending.length === 0) {
                listContainer.innerHTML = `
                <div class="text-center p-8 bg-gray-50 rounded-xl">
                    <p class="text-secondary mb-4">No pending approvals found.</p>
                </div>`;
                return;
            }

            listContainer.innerHTML = pending.map(entry => {
                const date = new Date(entry.createdAt).toLocaleDateString();
                const data = entry.data || {};
                const type = data.activityType || 'Activity';

                // Better details extraction
                const detailItems = [];
                if (data.beneficiary) detailItems.push(`<b>Beneficiary:</b> ${data.beneficiary}`);
                if (data.village) detailItems.push(`<b>Village:</b> ${data.village}`);
                if (data.animal_type) detailItems.push(`<b>Animal:</b> ${data.animal_type}`);
                if (data.medicine) detailItems.push(`<b>Med:</b> ${data.medicine}`);
                if (data.tag_no) detailItems.push(`<b>Tag:</b> ${data.tag_no}`);
                if (data.productType) detailItems.push(`<b>Product:</b> ${data.productType} (${data.quantity})`);

                return `
                <div class="card p-4 fade-in">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-bold uppercase text-primary">${type}</h4>
                        <span class="text-xs bg-gray-200 px-2 py-1 rounded">${date}</span>
                    </div>
                    <div class="text-sm text-secondary mb-4" style="line-height: 1.6;">
                        ${detailItems.join('<br>')}
                    </div>
                    
                    ${data.location ? `<div class="text-xs mb-2 opacity-60">📍 GPS: ${data.location.lat.toFixed(4)}, ${data.location.lng.toFixed(4)}</div>` : ''}

                    <div class="flex gap-2 mt-2">
                        <button class="btn btn-primary btn-approve" data-id="${entry.id}" style="font-size:0.9rem; padding: 10px;">
                             ✅ Approve / अप्रूव
                        </button>
                    </div>
                </div>
                `;
            }).join('');

            // Attach Event Listeners
            document.querySelectorAll('.btn-approve').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const btnEl = e.target.closest('button');
                    const id = btnEl.dataset.id;
                    btnEl.disabled = true;
                    btnEl.innerHTML = "Signing...";
                    approveEntry(id);
                });
            });
        }).catch(err => {
            console.error("Dashboard Load Error:", err);
            listContainer.innerHTML = `<p class="text-error">Error loading reports: ${err.message}</p>`;
        });
    }, 100);

    const approveEntry = async (id) => {
        try {
            const entries = await window.DB.getAllEntries();
            const entry = entries.find(e => e.id === id);
            if (entry) {
                entry.approvalStatus = 'approved';
                entry.approvedBy = user.name;
                entry.approvedAt = new Date().toISOString();
                await window.DB.saveEntry(entry);

                // Show success toast or alert
                alert("✅ Report Digitally Signed!");

                // Refresh local view without hard reload
                navigateTo('dashboard');
            }
        } catch (err) {
            console.error("Approval Error:", err);
            alert("Approval Failed: " + err.message);
        }
    };

    return render();
};
