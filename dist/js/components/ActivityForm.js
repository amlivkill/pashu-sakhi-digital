window.ActivityForm = function (type, navigateTo) {
    let locationData = null;
    let photoData = null;

    const hospitals = [
        "Munnadeval", "Chandrapuri", "Chauriya Bhardhar", "Sumadi Bhardhar",
        "Ukhimath", "Rampur Ukhimath", "Sadar Rudraprayag", "Durgadhar",
        "Jakholi", "Phata", "Sumadi"
    ];

    // Configuration for each form type
    const formConfig = {
        'vaccination': {
            title: window.t('act_vaccination'),
            fields: [
                { name: 'block', label: window.t('lbl_block'), type: 'select', options: ['Augustmuni', 'Jakholi', 'Ukhimath'] },
                { name: 'hospital', label: window.t('lbl_hospital'), type: 'select', options: hospitals },
                { name: 'village', label: window.t('lbl_village'), type: 'text', placeholder: window.t('lbl_village_hint'), required: true },
                { name: 'beneficiary', label: window.t('lbl_beneficiary'), type: 'text', required: true },
                { name: 'animal_type', label: window.t('lbl_animal'), type: 'select', options: ['Cow', 'Buffalo', 'Goat', 'Sheep'] },
                { name: 'vaccine', label: 'Vaccine Name / टीका का नाम', type: 'text', placeholder: 'FMD, HS, etc.' },
                { name: 'batch', label: 'Batch No / बैच संख्या', type: 'text' }
            ]
        },
        'tagging': {
            title: window.t('act_tagging'),
            fields: [
                { name: 'block', label: window.t('lbl_block'), type: 'select', options: ['Augustmuni', 'Jakholi', 'Ukhimath'] },
                { name: 'hospital', label: window.t('lbl_hospital'), type: 'select', options: hospitals },
                { name: 'village', label: window.t('lbl_village'), type: 'text', placeholder: window.t('lbl_village_hint'), required: true },
                { name: 'beneficiary', label: window.t('lbl_beneficiary'), type: 'text', required: true },
                { name: 'animal_type', label: window.t('lbl_animal'), type: 'select', options: ['Cow', 'Buffalo'] },
                { name: 'tag_no', label: 'Tag Number / टैग संख्या', type: 'number', required: true },
                { name: 'gender', label: 'Gender / लिंग', type: 'select', options: ['Male', 'Female'] }
            ]
        },
        'census': {
            title: window.t('act_census'),
            fields: [
                { name: 'block', label: window.t('lbl_block'), type: 'select', options: ['Augustmuni', 'Jakholi', 'Ukhimath'] },
                { name: 'hospital', label: window.t('lbl_hospital'), type: 'select', options: hospitals },
                { name: 'village', label: window.t('lbl_village'), type: 'text', placeholder: window.t('lbl_village_hint'), required: true },
                { name: 'count_cow', label: 'No. of Cows / गायों की संख्या', type: 'number' },
                { name: 'count_buffalo', label: 'No. of Buffaloes / भैंसों की संख्या', type: 'number' },
                { name: 'count_goat', label: 'No. of Goats/Sheep / बकरी/भेड़', type: 'number' }
            ]
        },
        'badri': {
            title: window.t('act_badri'),
            fields: [
                { name: 'block', label: window.t('lbl_block'), type: 'select', options: ['Augustmuni', 'Jakholi', 'Ukhimath'] },
                { name: 'hospital', label: window.t('lbl_hospital'), type: 'select', options: hospitals },
                { name: 'village', label: window.t('lbl_village'), type: 'text', placeholder: window.t('lbl_village_hint'), required: true },
                { name: 'beneficiary', label: window.t('lbl_beneficiary'), type: 'text', required: true },
                { name: 'tag_no', label: 'Tag Number (Badri) / टैग संख्या', type: 'number', required: true },
                { name: 'milk_am', label: 'Milk (Morning) / दूध (सुबह) Ltr', type: 'number' },
                { name: 'milk_pm', label: 'Milk (Evening) / दूध (शाम) Ltr', type: 'number' }
            ]
        },
        'insurance': {
            title: window.t('act_insurance'),
            fields: [
                { name: 'block', label: window.t('lbl_block'), type: 'select', options: ['Augustmuni', 'Jakholi', 'Ukhimath'] },
                { name: 'hospital', label: window.t('lbl_hospital'), type: 'select', options: hospitals },
                { name: 'village', label: window.t('lbl_village'), type: 'text', placeholder: window.t('lbl_village_hint'), required: true },
                { name: 'beneficiary', label: window.t('lbl_beneficiary'), type: 'text', required: true },
                { name: 'tag_no', label: 'Tag Number / टैग संख्या', type: 'number' },
                { name: 'premium', label: 'Premium Amount / प्रीमियम राशि (₹)', type: 'number' },
                { name: 'company', label: 'Insurance Company / कंपनी', type: 'text' }
            ]
        },
        'awareness': {
            title: window.t('act_awareness'),
            fields: [
                { name: 'block', label: window.t('lbl_block'), type: 'select', options: ['Augustmuni', 'Jakholi', 'Ukhimath'] },
                { name: 'hospital', label: window.t('lbl_hospital'), type: 'select', options: hospitals },
                { name: 'village', label: window.t('lbl_village'), type: 'text', placeholder: window.t('lbl_village_hint'), required: true },
                { name: 'topic', label: 'Topic / विषय', type: 'text', placeholder: 'Deworming, Nutrition...' },
                { name: 'attendees', label: 'No. of Attendees / उपस्थित लोग', type: 'number' }
            ]
        },
        'other': {
            title: window.t('act_other'),
            fields: [
                { name: 'block', label: window.t('lbl_block'), type: 'select', options: ['Augustmuni', 'Jakholi', 'Ukhimath'] },
                { name: 'hospital', label: window.t('lbl_hospital'), type: 'select', options: hospitals },
                { name: 'village', label: window.t('lbl_village'), type: 'text', placeholder: window.t('lbl_village_hint'), required: true },
                { name: 'description', label: 'Activity Description / विवरण', type: 'textarea' },
                { name: 'income', label: 'Income Generated / आय (₹)', type: 'number' }
            ]
        }
    };

    const config = formConfig[type] || { title: 'Activity', fields: [] };

    const renderFields = () => {
        return config.fields.map(field => {
            if (field.type === 'select') {
                return `
                <div class="form-group">
                    <label class="form-label">${field.label}</label>
                    <select name="${field.name}" class="form-input">
                        ${field.options.map(opt => `<option>${opt}</option>`).join('')}
                    </select>
                </div>`;
            } else if (field.type === 'textarea') {
                return `
                <div class="form-group">
                    <label class="form-label">${field.label}</label>
                    <textarea name="${field.name}" class="form-input" rows="3"></textarea>
                </div>`;
            } else {
                return `
                <div class="form-group">
                    <label class="form-label">${field.label}</label>
                    <input type="${field.type}" name="${field.name}" class="form-input" placeholder="" ${field.required ? 'required' : ''} />
                </div>`;
            }
        }).join('');
    };

    const render = () => `
    <div class="p-4 fade-in pb-24">
        <header class="flex items-center gap-4 mb-6">
            <button id="btn-back-gen" class="btn" style="width: auto; padding: 0.5rem; background: #e2e8f0;">⬅️</button>
            <h2 class="font-bold text-lg">${config.title}</h2>
        </header>

        <form id="generic-form" class="flex flex-col gap-4">
            
            <div class="card">
                <h3 class="font-bold mb-4" style="color: var(--primary-color);">Details</h3>
                ${renderFields()}
            </div>

            <!-- Evidence Section (Common) -->
            <div class="card" style="border: 2px solid var(--accent-color);">
                <h3 class="font-bold mb-4" style="color: var(--accent-color);">${window.t('lbl_evidence')}</h3>
                
                <div class="form-group">
                    <label class="form-label">${window.t('lbl_gps')} *</label>
                    <div id="gps-status-gen" class="flex items-center gap-2 p-3 rounded bg-gray-100">
                        <span>📡</span>
                        <span id="gps-text-gen">Waiting for location...</span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">${window.t('lbl_photo')} *</label>
                    <input type="file" id="photo-input-gen" accept="image/*" capture="environment" class="hidden" />
                    <button type="button" id="btn-camera-gen" class="btn btn-primary" style="background: var(--text-main);">
                        📷 ${window.t('btn_take_photo')}
                    </button>
                    <div id="photo-preview-gen" class="mt-2 hidden">
                        <img id="img-preview-gen" src="" style="width: 100%; border-radius: 8px;" />
                    </div>
                </div>
            </div>

            <button type="submit" class="btn btn-primary" style="padding: 1rem; font-size: 1.2rem;">${window.t('btn_submit')}</button>
        </form>
    </div>
    `;

    setTimeout(() => {
        // Back Button
        document.getElementById('btn-back-gen')?.addEventListener('click', () => {
            navigateTo('dashboard');
        });

        // Initialize GPS
        const gpsText = document.getElementById('gps-text-gen');
        const gpsStatus = document.getElementById('gps-status-gen');

        window.GPS.getCurrentLocation()
            .then(loc => {
                locationData = loc;
                gpsText.innerText = `Lat: ${loc.lat.toFixed(5)}, Lng: ${loc.lng.toFixed(5)}`;
                gpsStatus.classList.add('bg-green-100');
                gpsStatus.classList.remove('bg-gray-100');
            })
            .catch(err => {
                gpsText.innerText = `GPS Error: ${err.message}`;
                gpsStatus.classList.add('bg-red-100');
            });

        // Photo Handling
        const photoInput = document.getElementById('photo-input-gen');
        const btnCamera = document.getElementById('btn-camera-gen');
        const photoPreview = document.getElementById('photo-preview-gen');
        const imgPreview = document.getElementById('img-preview-gen');

        btnCamera.addEventListener('click', () => {
            photoInput.click();
        });

        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                photoData = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    imgPreview.src = e.target.result;
                    photoPreview.classList.remove('hidden');
                    btnCamera.innerText = window.t('btn_retake');
                };
                reader.readAsDataURL(file);
            }
        });

        // Form Submit
        document.getElementById('generic-form').addEventListener('submit', (e) => {
            e.preventDefault();
            if (!locationData) {
                alert(window.t('msg_gps_wait'));
                return;
            }
            if (!photoData) {
                alert(window.t('msg_photo_wait'));
                return;
            }

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.location = locationData;
            data.activityType = type;

            if (window.SyncManager) {
                window.SyncManager.addEntry(data).then(() => {
                    navigateTo('dashboard');
                    alert(window.t('msg_saved'));
                });
            } else {
                alert("Error: SyncManager not loaded");
            }
        });

    }, 0);

    return render();
}
