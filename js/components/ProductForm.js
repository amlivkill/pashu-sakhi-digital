window.ProductForm = function (navigateTo) {
    let locationData = null;
    let photoData = null; // In a real app, we'd capture this

    const render = () => `
    <div class="fade-in pb-24">
        <!-- Header -->
        <header class="flex items-center gap-4 p-4 border-b bg-white sticky top-0 z-10">
            <button class="btn-icon" id="btn-back">⬅️</button>
            <h2 class="font-bold text-lg">${window.t('nav_products')}</h2>
            <div style="flex:1"></div>
            <div id="gps-status" class="text-xs text-secondary">📍 GPS...</div>
        </header>

        <form id="product-form" class="p-4 flex flex-col gap-4">
            
            <!-- Farmer Details -->
            <div class="card p-4">
                <h3 class="font-bold text-sm mb-2 uppercase text-primary">${window.t('lbl_farmer')}</h3>
                <div class="form-group">
                    <label class="form-label">${window.t('lbl_farmer')}</label>
                    <input type="text" name="farmerName" class="form-input" required />
                </div>
                <div class="form-group">
                    <label class="form-label">${window.t('lbl_block')}</label>
                    <select name="block" class="form-input">
                        <option>Augustmuni</option>
                        <option>Jakholi</option>
                        <option>Ukhimath</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">${window.t('lbl_village')}</label>
                    <input type="text" name="village" class="form-input" placeholder="${window.t('lbl_village_hint')}" required />
                </div>
                <div class="form-group">
                     <label class="form-label">Contact Number / मोबाइल</label>
                     <input type="tel" name="mobile" class="form-input" maxlength="10" />
                </div>
            </div>

            <!-- Product Details -->
            <div class="card p-4">
                <h3 class="font-bold text-sm mb-2 uppercase text-primary">${window.t('lbl_product')}</h3>
                
                <div class="form-group">
                    <label class="form-label">${window.t('lbl_product')}</label>
                    <select name="productType" class="form-input">
                        <option value="Ghee">${window.t('prod_ghee')}</option>
                        <option value="Milk">${window.t('prod_milk')}</option>
                        <option value="Paneer">${window.t('prod_paneer')}</option>
                        <option value="Buttermilk">${window.t('prod_buttermilk')}</option>
                        <option value="Curd">${window.t('prod_curd')}</option>
                    </select>
                </div>

                <div class="flex gap-4">
                    <div class="form-group flex-1">
                        <label class="form-label">${window.t('lbl_quantity')}</label>
                        <input type="number" step="0.1" name="quantity" class="form-input" placeholder="0.0" required />
                    </div>
                    <div class="form-group flex-1">
                        <label class="form-label">Unit</label>
                        <input type="text" class="form-input" value="Kg/Ltr" disabled style="background:#f4f4f4"/>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">${window.t('lbl_price')}</label>
                    <input type="number" name="price" class="form-input" required />
                </div>

                <div class="form-group">
                    <label class="form-label">${window.t('lbl_date')}</label>
                    <input type="date" name="date" class="form-input" value="${new Date().toISOString().split('T')[0]}" required />
                </div>
            </div>

            <!-- Evidence -->
            <div class="card p-4">
                <div class="flex items-center gap-4 mb-4">
                     <div id="photo-preview" class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs">No Photo</div>
                     <label class="btn btn-primary flex-1 text-center">
                        📷 Take Photo
                        <input type="file" accept="image/*" capture="environment" id="photo-input" class="hidden" />
                     </label>
                </div>
            </div>

            <button type="submit" class="btn btn-primary" style="padding: 1rem;">
                💾 Save Product Listing
            </button>

        </form>
    </div>
    `;

    setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        // Ensure Back Button works first
        document.getElementById('btn-back').addEventListener('click', () => {
            navigateTo('dashboard');
        });

        // Pre-fill fields if user is an official Sakhi
        if (user && user.block) {
            const blockSelect = document.querySelector('select[name="block"]');
            const villageInput = document.querySelector('input[name="village"]');
            if (blockSelect) blockSelect.value = user.block;
            if (villageInput) villageInput.value = user.village || '';
        }

        // GPS - Fixed method name
        window.GPS.getCurrentLocation().then(loc => {
            locationData = loc;
            const el = document.getElementById('gps-status');
            if (el) el.innerText = `📍 ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`;
        }).catch(err => {
            const el = document.getElementById('gps-status');
            if (el) el.innerText = `📍 GPS Failed`;
        });

        // Photo
        document.getElementById('photo-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    photoData = evt.target.result;
                    document.getElementById('photo-preview').innerHTML = `<img src="${photoData}" class="w-full h-full object-cover rounded" />`;
                };
                reader.readAsDataURL(file);
            }
        });

        // Submit
        document.getElementById('product-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            // Add Extras
            data.location = locationData;
            data.photo = photoData; // Base64 string
            data.status = 'available'; // Default Status
            data.activityType = 'product_listing'; // Special activity type

            const entry = {
                id: window.crypto.randomUUID(),
                data: data,
                createdAt: new Date().toISOString(),
                synced: false
            };

            await window.DB.saveEntry(entry);

            // Success Transition
            alert("✅ Product Listed Successfully!");
            navigateTo('profile');
        });

    }, 200);

    return render();
};
