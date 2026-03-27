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

        // Load Pending Entries (Simulated: Entries that are NOT yet 'approved')
        window.DB.getAllEntries().then(entries => {
            // Filter: In a real app we check 'status' === 'pending'. 
            // Here we'll assume all synced entries are "pending approval" for demo 
            // OR we add a new 'approvalStatus' field. Let's filter by NO approvalStatus.
            const pending = entries.filter(e => !e.approvalStatus || e.approvalStatus === 'pending');

            if (pending.length === 0) {
                listContainer.innerHTML = `<p class="text-center text-secondary">No pending approvals.</p>`;
                return;
            }

            listContainer.innerHTML = pending.map(entry => {
                const date = new Date(entry.createdAt).toLocaleDateString();
                const type = entry.data.activityType || 'Activity';
                // Show critical info
                const details = `
                    <b>Beneficiary:</b> ${entry.data.beneficiary || 'N/A'}<br>
                    <b>Village:</b> ${entry.data.village || 'N/A'}<br>
                    <b>Hospital:</b> ${entry.data.hospital || 'N/A'}<br>
                    <b>Values:</b> ${entry.data.animal_type || ''} ${entry.data.medicine || ''} ${entry.data.tag_no || ''}
                `;

                return `
                <div class="card p-4">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-bold uppercase text-primary">${type}</h4>
                        <span class="text-xs bg-gray-200 px-2 py-1 rounded">${date}</span>
                    </div>
                    <div class="text-sm text-secondary mb-4" style="line-height: 1.6;">
                        ${details}
                    </div>
                    
                     <!-- Evidence Preview (Mock) -->
                    ${entry.data.location ? `<div class="text-xs mb-2">📍 GPS Verified: ${entry.data.location.lat.toFixed(4)}, ${entry.data.location.lng.toFixed(4)}</div>` : ''}

                    <div class="flex gap-2 mt-2">
                        <button class="btn btn-primary btn-approve" data-id="${entry.id}" style="font-size:0.9rem;">
                             ✅ ${window.t('btn_approve')}
                        </button>
                         <button class="btn btn-reject" data-id="${entry.id}" style="background:#fee2e2; color:#b91c1c; font-size:0.9rem;">
                             ❌ ${window.t('btn_reject')}
                        </button>
                    </div>
                </div>
                `;
            }).join('');

            // Attach Event Listeners
            document.querySelectorAll('.btn-approve').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id || e.target.closest('button').dataset.id;
                    approveEntry(id);
                });
            });

            document.querySelectorAll('.btn-reject').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    alert("Rejected (Demo)");
                    // In real app, update status
                });
            });
        });
    }, 0);

    const approveEntry = async (id) => {
        // Find entry and update status
        // Since our simple DB wrapper doesn't have 'update', we fetch-modify-save.
        // Actually IDB put overwrites if key exists.
        const entries = await window.DB.getAllEntries();
        const entry = entries.find(e => e.id === id);
        if (entry) {
            entry.approvalStatus = 'approved';
            entry.approvedBy = user.name;
            entry.approvedAt = new Date().toISOString();
            await window.DB.saveEntry(entry); // Overwrite
            alert("✅ Report Digitally Signed & Approved!");
            // Refresh
            const newView = window.VODashboard(user, navigateTo);
            document.getElementById('main-content').innerHTML = newView;
            // Re-run scripts (the timeout in render) - tricky in this simple router. 
            // Easier to just reload page or navigate
            window.location.reload();
        }
    };

    return render();
};
