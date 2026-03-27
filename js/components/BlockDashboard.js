window.BlockDashboard = function (user, navigateTo) {
    let currentBlockFilter = 'All';
    const blocks = ['All', 'Augustyamuni', 'Jakholi', 'Ukhimath'];

    const render = () => `
    <header class="flex justify-between items-center mb-4 fade-in">
        <div>
            <h2 class="font-bold" style="font-size: 1.5rem;">${window.t('block_dashboard_title')}</h2>
            <p class="text-sm text-secondary">${window.t('namaste')}, ${user.name}</p>
        </div>
         <button onclick="(() => { localStorage.removeItem('user'); window.location.reload(); })();" class="btn" style="width:auto; padding:5px 10px; background:#f4f4f4;">Logout</button>
    </header>

    <div class="card mb-4" style="background:#f0fdf4; color:#166534; border: 1px solid #bbf7d0;">
        <h3 class="font-bold">${window.t('lbl_filter_block')}</h3>
        <div class="flex gap-2 mt-2 overflow-x-auto pb-2">
            ${blocks.map(b => `
                <button class="block-filter-btn btn ${currentBlockFilter === b ? 'btn-primary' : ''}" 
                        style="padding:5px 15px; font-size:12px; white-space:nowrap; ${currentBlockFilter === b ? '' : 'background:white; color:black; border:1px solid #ddd;'}"
                        data-block="${b}">
                    ${b === 'All' ? 'सभी (All)' : b}
                </button>
            `).join('')}
        </div>
    </div>

    <div id="block-report-list" class="flex flex-col gap-4 pb-24">
        <div class="text-center text-secondary mt-10">
            <span class="spinner" style="display:inline-block;"></span> Loading reports...
        </div>
    </div>
    `;

    const loadReports = async () => {
        const listContainer = document.getElementById('block-report-list');
        if (!listContainer) return;

        try {
            const entries = await window.DB.getAllEntries();
            let filtered = entries;

            if (currentBlockFilter !== 'All') {
                filtered = entries.filter(e => e.data && e.data.block === currentBlockFilter);
            }

            // Sort by date desc
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            if (filtered.length === 0) {
                listContainer.innerHTML = `
                <div class="text-center p-8 bg-gray-50 rounded-xl">
                    <p class="text-secondary">No reports found for ${currentBlockFilter}.</p>
                </div>`;
                return;
            }

            listContainer.innerHTML = filtered.map(entry => {
                const date = new Date(entry.createdAt).toLocaleDateString();
                const data = entry.data || {};
                const type = data.activityType || 'Activity';
                const status = entry.approvalStatus || 'pending';
                const statusColor = status === 'approved' ? '#166534' : '#9a3412';

                const detailItems = [];
                if (data.sakhiName) detailItems.push(`<b>Sakhi:</b> ${data.sakhiName}`);
                if (data.beneficiary) detailItems.push(`<b>Beneficiary:</b> ${data.beneficiary}`);
                if (data.village) detailItems.push(`<b>Village:</b> ${data.village}`);
                if (data.block) detailItems.push(`<b>Block:</b> ${data.block}`);
                if (data.animal_type) detailItems.push(`<b>Animal:</b> ${data.animal_type}`);

                return `
                <div class="card p-4 fade-in" style="border-left: 4px solid ${statusColor}">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h4 class="font-bold uppercase text-primary">${type}</h4>
                            <span class="text-xs text-secondary">${date}</span>
                        </div>
                        <span class="text-xs px-2 py-1 rounded" style="background:${statusColor}22; color:${statusColor}; font-weight:bold;">
                            ${status.toUpperCase()}
                        </span>
                    </div>
                    <div class="text-sm text-secondary mb-4" style="line-height: 1.5;">
                        ${detailItems.join(' | ')}
                    </div>
                    
                    <div class="flex gap-2">
                        <button class="btn btn-primary btn-check-report" data-id="${entry.id}" style="font-size:0.8rem; padding: 8px;">
                             👁️ View Details
                        </button>
                        ${status !== 'approved' ? `
                            <button class="btn btn-secondary btn-approve-block" data-id="${entry.id}" style="font-size:0.8rem; padding: 8px; background:#166534; color:white;">
                                ✅ Verify
                            </button>
                        ` : ''}
                    </div>
                </div>
                `;
            }).join('');

            // Attach listeners
            document.querySelectorAll('.btn-approve-block').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.closest('button').dataset.id;
                    await approveReport(id);
                });
            });

            document.querySelectorAll('.btn-check-report').forEach(btn => {
                btn.addEventListener('click', (e) => {
                   const id = e.target.closest('button').dataset.id;
                   alert("Full Report View for " + id + "\n(Details would be shown in a modal in production)");
                });
            });

        } catch (err) {
            console.error("Block Dashboard Error:", err);
            listContainer.innerHTML = `<p class="text-error">Error: ${err.message}</p>`;
        }
    };

    const approveReport = async (id) => {
        const entries = await window.DB.getAllEntries();
        const entry = entries.find(e => e.id === id);
        if (entry) {
            entry.approvalStatus = 'approved';
            entry.approvedBy = `${user.name} (Block)`;
            entry.approvedAt = new Date().toISOString();
            await window.DB.saveEntry(entry);
            alert("✅ Report Verified by Block Staff");
            loadReports();
        }
    };

    const attachBlockListeners = () => {
        // Block Filter Listeners
        document.querySelectorAll('.block-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentBlockFilter = e.target.dataset.block;
                // Re-render the whole thing to update active button
                document.getElementById('main-content').innerHTML = render();
                setTimeout(() => {
                    loadReports();
                    attachBlockListeners(); // Re-attach after re-render
                }, 0);
            });
        });
    };

    setTimeout(() => {
        loadReports();
        attachBlockListeners();
    }, 100);

    return render();
};
