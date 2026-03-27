window.Profile = function (user, navigateTo) {

    // Incentive Calculation Logic
    const calculateIncentive = (product, quantity, price, buyerConnected, isPremium) => {
        let incentive = 0;
        const saleValue = quantity * price;
        incentive += saleValue * 0.02; // 2% Commission

        if (buyerConnected) incentive += 50;
        if (isPremium && quantity > 5 && product === 'Ghee') incentive += 100;

        return Math.round(incentive);
    };

    const render = () => `
    <div class="fade-in pb-24">
        
        <!-- Header -->
        <header class="p-6 bg-primary text-white" style="border-radius: 0 0 20px 20px;">
            <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl">
                    👩‍🌾
                </div>
                <div>
                    <h2 class="font-bold text-xl">${user.name || 'Pashu Sakhi'}</h2>
                    <p class="text-sm opacity-90">${user.role === 'sakhi' ? window.t('role_sakhi') : user.role}</p>
                    <p class="text-xs opacity-75">${user.mobile || ''}</p>
                </div>
            </div>
            
            <!-- Incentive Card -->
            <div class="mt-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 flex justify-between items-center">
                <div>
                    <label class="text-xs opacity-75 uppercase tracking-wider">${window.t('lbl_earnings')}</label>
                    <div class="text-3xl font-bold" id="total-earnings">₹0</div>
                </div>
                <div class="text-right">
                    <div class="text-xs opacity-75">This Month</div>
                    <div class="font-bold" id="month-earnings">₹0</div>
                </div>
            </div>
        </header>

        <!-- Identity Section (Only for Official Sakhis) -->
        ${user.shg ? `
        <div class="px-4 -mt-4">
            <div class="card p-4 shadow-lg border-none" style="background: white;">
                <div class="grid grid-cols-2 gap-y-4">
                    <div>
                        <label class="text-[10px] text-secondary uppercase font-bold">${window.t('lbl_shg')}</label>
                        <div class="text-xs font-bold text-gray-800">${user.shg}</div>
                    </div>
                    <div>
                        <label class="text-[10px] text-secondary uppercase font-bold">${window.t('lbl_clf')}</label>
                        <div class="text-xs font-bold text-gray-800">${user.clf}</div>
                    </div>
                    <div class="col-span-2 border-t pt-3 mt-1">
                        <label class="text-[10px] text-secondary uppercase font-bold">${window.t('lbl_bank')}</label>
                        <div class="text-xs font-bold text-gray-800">${user.bank} - ${user.account}</div>
                        <div class="text-[10px] text-secondary uppercase font-bold mt-1">IFSC: ${user.ifsc}</div>
                    </div>
                    <div class="border-t pt-3 mt-1">
                        <label class="text-[10px] text-secondary uppercase font-bold">${window.t('lbl_village')}</label>
                        <div class="text-xs font-bold text-gray-800">${user.village}</div>
                    </div>
                    <div class="border-t pt-3 mt-1 text-right">
                        <label class="text-[10px] text-secondary uppercase font-bold">${window.t('lbl_block')}</label>
                        <div class="text-xs font-bold text-gray-800">${user.block}</div>
                    </div>
                </div>
            </div>
        </div>
        ` : ''}

        <!-- Product List Section -->
        <div class="p-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-lg">${window.t('nav_products')}</h3>
                <button id="btn-add-product" class="btn btn-primary text-xs" style="width:auto; padding: 5px 12px;">
                    + Start Listing
                </button>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-2 mb-4">
                <div class="card p-3 text-center">
                    <div class="text-2xl font-bold text-primary" id="stat-listed">0</div>
                    <div class="text-xs text-secondary">${window.t('lbl_total_listed')}</div>
                </div>
                <div class="card p-3 text-center">
                    <div class="text-2xl font-bold text-green-600" id="stat-sold">0</div>
                    <div class="text-xs text-secondary">${window.t('lbl_sold')}</div>
                </div>
            </div>

            <!-- List -->
            <div id="product-list" class="flex flex-col gap-3">
                <div class="text-center text-secondary py-8">Loading products...</div>
            </div>
        </div>

        <div class="p-4">
            <button id="btn-share-app" class="btn w-full mb-3" style="background:#e0e7ff; color:#4338ca; border: 1px solid #c7d2fe; padding: 1rem; font-weight: bold;">
                🔗 ${window.t('btn_share_app')}
            </button>
            <button id="btn-logout" class="btn w-full" style="background:#fee2e2; color:#b91c1c; border: 1px solid #fca5a5; padding: 1rem; font-weight: bold;">
                🚪 Logout / लॉगआउट
            </button>
            <p class="text-center text-[10px] text-secondary mt-4 opacity-50">App Version 1.1.2 (Offline Ready)</p>
        </div>

    </div>
    `;

    setTimeout(async () => {
        // Event Listener for Add
        document.getElementById('btn-add-product').addEventListener('click', () => {
            navigateTo('product-form');
        });

        // Fetch Data
        const entries = await window.DB.getAllEntries();
        // Filter for 'product_listing' activity type
        const products = entries.filter(e => e.data.activityType === 'product_listing');

        // Calculate Stats
        let totalEarnings = 0;
        let soldCount = 0;

        const listHTML = products.map(entry => {
            const p = entry.data;
            let statusColor = 'bg-blue-100 text-blue-800';
            let statusLabel = window.t('status_available');
            let actions = '';

            // Calculate incentive for this item
            const isSold = p.status === 'sold';
            const isInterested = p.status === 'interested';

            // Re-calculate incentive based on current state to display
            const currentIncentive = calculateIncentive(
                p.productType,
                parseFloat(p.quantity),
                parseFloat(p.price),
                isInterested || isSold,
                false // Premium check simplified for now
            );

            if (isSold) {
                statusColor = 'bg-green-100 text-green-800';
                statusLabel = window.t('status_sold');
                soldCount++;
                totalEarnings += currentIncentive;
            } else if (isInterested) {
                statusColor = 'bg-orange-100 text-orange-800';
                statusLabel = window.t('status_interested');
                actions = `
                    <button class="btn-action-sold btn text-xs bg-green-600 text-white mt-2" data-id="${entry.id}">
                        ✅ ${window.t('btn_mark_sold')}
                    </button>
                `;
            } else {
                actions = `
                    <button class="btn-action-interested btn text-xs bg-orange-500 text-white mt-2" data-id="${entry.id}">
                         👋 ${window.t('btn_mark_interested')}
                    </button>
                `;
            }

            return `
            <div class="card p-3 flex gap-3">
                <div class="w-20 h-20 bg-gray-200 rounded shrink-0 overflow-hidden">
                    ${p.photo ? `<img src="${p.photo}" class="w-full h-full object-cover">` : `<div class="w-full h-full flex items-center justify-center text-xs text-secondary">No Img</div>`}
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-start">
                        <h4 class="font-bold">${p.productType}</h4>
                        <span class="px-2 py-0.5 rounded text-xs font-bold ${statusColor}">${statusLabel}</span>
                    </div>
                    <div class="text-sm text-secondary mt-1">
                        ${p.quantity} Unit • ₹${p.price}<br>
                        👨‍🌾 ${p.farmerName} (${p.village})
                    </div>
                    ${!isSold ? actions : `<div class="text-xs text-green-700 font-bold mt-2">Earned: ₹${currentIncentive}</div>`}
                </div>
            </div>
            `;
        }).join('');

        document.getElementById('product-list').innerHTML = listHTML || '<div class="text-center text-secondary">No products listed yet.</div>';

        // Update Stats
        document.getElementById('stat-listed').innerText = products.length;
        document.getElementById('stat-sold').innerText = soldCount;
        document.getElementById('total-earnings').innerText = `₹${totalEarnings}`;
        document.getElementById('month-earnings').innerText = `₹${totalEarnings}`; // Assuming all are this month for now

        // Attach Action Listeners
        document.querySelectorAll('.btn-action-interested').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                const entry = products.find(p => p.id === id);
                if (entry) {
                    entry.data.status = 'interested'; // Update Status
                    await window.DB.saveEntry(entry);
                    // Reload
                    const newView = window.Profile(user, navigateTo);
                    document.getElementById('main-content').innerHTML = newView;
                }
            });
        });

        document.querySelectorAll('.btn-action-sold').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                const entry = products.find(p => p.id === id);
                if (entry) {
                    entry.data.status = 'sold'; // Update Status
                    await window.DB.saveEntry(entry);
                    // Reload
                    const newView = window.Profile(user, navigateTo);
                    document.getElementById('main-content').innerHTML = newView;
                }
            });
        });

        const btnLogout = document.getElementById('btn-logout');
        const btnShare = document.getElementById('btn-share-app');

        if (btnShare) {
            btnShare.addEventListener('click', () => {
                window.utils.shareApp();
            });
        }

        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                if (confirm("Are you sure you want to logout? / क्या आप लॉगआउट करना चाहते हैं?")) {
                    localStorage.removeItem('user');
                    window.location.reload();
                }
            });
        }

    }, 200);

    return render();
};
