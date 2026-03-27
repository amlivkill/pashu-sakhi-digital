// Removed imports

window.TreatmentForm = function (navigateTo) {
    let locationData = null;
    let photoData = null;

    const render = () => `
    <div class="p-4 fade-in pb-24">
        <header class="flex items-center gap-4 mb-6">
            <button id="btn-back" class="btn" style="width: auto; padding: 0.5rem; background: #e2e8f0;">⬅️</button>
            <h2 class="font-bold text-lg">${window.t('form_treatment_title')}</h2>
        </header>

        <form id="treatment-form" class="flex flex-col gap-4">
            
            <!-- Section 1: Beneficiary Details -->
            <div class="card">
                <h3 class="font-bold mb-4" style="color: var(--primary-color);">1. ${window.t('lbl_beneficiary')}</h3>
                <div class="form-group">
                    <label class="form-label">${window.t('lbl_block')}</label>
                    <select name="block" class="form-input">
                        <option>Augustmuni</option>
                        <option>Jakholi</option>
                        <option>Ukhimath</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">${window.t('lbl_hospital')}</label>
                    <select name="hospital" class="form-input">
                        ${["Munnadeval", "Chandrapuri", "Chauriya Bhardhar", "Sumadi Bhardhar", "Ukhimath", "Rampur Ukhimath", "Sadar Rudraprayag", "Durgadhar", "Jakholi", "Phata", "Sumadi"].map(h => `<option>${h}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">${window.t('lbl_village')}</label>
                    <input type="text" name="village" class="form-input" placeholder="${window.t('lbl_village_hint')}" required />
                </div>
                <div class="form-group">
                    <label class="form-label">${window.t('lbl_beneficiary')}</label>
                    <input type="text" name="beneficiary" class="form-input" placeholder="e.g. Ramesh Singh" required />
                </div>
            </div>

            <!-- Section 2: Animal & Diagnosis -->
            <div class="card">
                <h3 class="font-bold mb-4" style="color: var(--primary-color);">2. ${window.t('lbl_diagnosis')}</h3>
                <div class="form-group">
                    <label class="form-label">${window.t('lbl_animal')}</label>
                    <select name="animal_type" class="form-input">
                        <option>Cow (Badri)</option>
                        <option>Cow (Jersey/HF)</option>
                        <option>Buffalo</option>
                        <option>Goat/Sheep</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">${window.t('lbl_symptoms')}</label>
                    <textarea name="symptoms" class="form-input" rows="2" placeholder="Describe symptoms"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">${window.t('lbl_medicine')}</label>
                    <input type="text" name="medicine" class="form-input" placeholder="e.g. Melonex, Bolus" />
                </div>
                 <div class="form-group">
                    <label class="form-label">${window.t('lbl_fees')}</label>
                    <input type="number" name="fees" class="form-input" placeholder="0" />
                </div>
            </div>

            <!-- Section 3: Evidence (GPS & Photo) -->
            <div class="card" style="border: 2px solid var(--accent-color);">
                <h3 class="font-bold mb-4" style="color: var(--accent-color);">3. ${window.t('lbl_evidence')}</h3>
                
                <!-- GPS -->
                <div class="form-group">
                    <label class="form-label">${window.t('lbl_gps')} *</label>
                    <div id="gps-status" class="flex items-center gap-2 p-3 rounded bg-gray-100">
                        <span>📡</span>
                        <span id="gps-text">Waiting for location...</span>
                    </div>
                </div>

                <!-- Photo -->
                <div class="form-group">
                    <label class="form-label">${window.t('lbl_photo')} *</label>
                    <input type="file" id="photo-input" accept="image/*" capture="environment" class="hidden" />
                    <button type="button" id="btn-camera" class="btn btn-primary" style="background: var(--text-main);">
                        📷 ${window.t('btn_take_photo')}
                    </button>
                    <div id="photo-preview" class="mt-2 hidden">
                        <img id="img-preview" src="" style="width: 100%; border-radius: 8px;" />
                    </div>
                </div>
            </div>

            <button type="submit" class="btn btn-primary" style="padding: 1rem; font-size: 1.2rem;">${window.t('btn_submit')}</button>
        </form>
    </div>
    `;

    setTimeout(() => {
        // Back Button
        document.getElementById('btn-back')?.addEventListener('click', () => {
            navigateTo('dashboard');
        });

        // Initialize GPS
        const gpsText = document.getElementById('gps-text');
        const gpsStatus = document.getElementById('gps-status');

        window.GPS.getCurrentLocation()
            .then(loc => {
                locationData = loc;
                gpsText.innerText = `Lat: ${loc.lat.toFixed(5)}, Lng: ${loc.lng.toFixed(5)}`;
                gpsStatus.classList.add('bg-green-100');
                gpsStatus.classList.remove('bg-gray-100');
            })
            .catch(err => {
                gpsText.innerText = `GPS Error: ${err.message}. Ensure location is enabled.`;
                gpsStatus.classList.add('bg-red-100');
            });

        // Photo Handling
        const photoInput = document.getElementById('photo-input');
        const btnCamera = document.getElementById('btn-camera');
        const photoPreview = document.getElementById('photo-preview');
        const imgPreview = document.getElementById('img-preview');

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
        document.getElementById('treatment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            if (!locationData) {
                alert(window.t('msg_gps_wait'));
                return;
            }
            if (!photoData) {
                alert(window.t('msg_photo_wait'));
                return;
            }

            // Save Entry
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.location = locationData;
            // NOTE: In a real app we would convert the File object to Base64 or Blob here before storing in IDB
            // For this demo, we store metadata. 
            // data.photoName = photoData.name;

            // Fixed for No-Module support
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
