window.Login = function (onLoginSuccess) {
    const render = () => `
    <div class="flex flex-col justify-between" style="height: 100%">
        <div style="position: absolute; top: 1rem; right: 1rem;">
             <button onclick="window.toggleLanguage()" class="btn" style="background:white; border:1px solid #ddd; padding: 5px 10px;">
                ${window.currentLang === 'en' ? 'हिंदी' : 'English'}
             </button>
        </div>

        <div style="margin-top: 4rem;">
            <div class="text-center mb-4">
                <div style="font-size: 4rem;">🐄</div>
                <h1 class="font-bold" style="font-size: 1.75rem; margin-top: 1rem;">${window.t('app_title')}</h1>
                <p class="text-secondary" style="color: var(--text-secondary);">${window.t('app_subtitle')}</p>
            </div>
            
            <div class="card fade-in" style="border: 2px solid var(--primary-color);">
                <div id="login-container">
                    <div class="form-group">
                        <label class="form-label" for="role-select">${window.t('lbl_role')}</label>
                        <select id="role-select" class="form-input">
                            <option value="sakhi">👩‍🌾 Pashu Sakhi</option>
                            <option value="vo">👨‍⚕️ Veterinary Officer</option>
                            <option value="block">🏢 Block Staff / BMM</option>
                            <option value="admin">🏛️ Admin</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="mobile-input">Phone / मोबाइल</label>
                        <input type="tel" id="mobile-input" class="form-input" value="8650864393" maxlength="10" />
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="password-input">Password / पासवर्ड</label>
                        <input type="password" id="password-input" class="form-input" value="1234" />
                    </div>

                    <button id="btn-login" class="btn btn-primary" style="padding: 1rem; width:100%; margin-bottom:10px;">
                         LOGIN / लॉगिन
                    </button>

                    <button id="btn-bypass" class="btn" style="background:#eee; font-size:11px; padding:5px; width:100%; margin-bottom:10px;">
                        System Bypass (Direct Admin)
                    </button>

                    <button id="btn-simulate-sync" class="btn" style="background:var(--secondary-color); color:white; font-size:11px; padding:10px; width:100%;">
                        🚀 Run 15 Pashu Sakhi Sync Simulation
                    </button>
                </div>
            </div>

            <div class="text-center mt-6">
                <p class="text-xs text-secondary">Quick Pass: 1234</p>
                <button onclick="localStorage.clear(); if(window.caches){caches.keys().then(ns=>ns.forEach(n=>caches.delete(n)));} location.reload(true);" 
                        class="btn" style="background:none; color:red; font-size:12px; text-decoration:underline;">
                    Not working? Click here to Reset / रिसेट
                </button>
            </div>

        </div>
    </div>
    `;

    // Logic
    setTimeout(() => {
        const btnLogin = document.getElementById('btn-login');
        const btnBypass = document.getElementById('btn-bypass');
        const mobileInput = document.getElementById('mobile-input');
        const passwordInput = document.getElementById('password-input');
        const roleSelect = document.getElementById('role-select');

        // Bypass Logic
        if (btnBypass) {
            btnBypass.addEventListener('click', () => {
                console.log("System Bypass Triggered");
                const user = {
                    name: 'Admin User',
                    mobile: '9999999999',
                    role: 'admin',
                    imei: 'BYPASS'
                };
                localStorage.setItem('user', JSON.stringify(user));
                onLoginSuccess(user);
            });
        }

        // Simulation Logic
        const btnSimulate = document.getElementById('btn-simulate-sync');
        if (btnSimulate) {
            btnSimulate.addEventListener('click', async () => {
                if(window.SyncSimulation) {
                    btnSimulate.disabled = true;
                    btnSimulate.innerText = "⏳ Simulating Sync...";
                    try {
                        await window.SyncSimulation.start();
                    } finally {
                        btnSimulate.disabled = false;
                        btnSimulate.innerText = "🚀 Run 15 Pashu Sakhi Sync Simulation";
                    }
                } else {
                    alert("SyncSimulation service not loaded.");
                }
            });
        }

        if (btnLogin) {
            btnLogin.addEventListener('click', () => {
                const mobile = mobileInput.value;
                const role = roleSelect.value;
                console.log("Login Clicked:", { mobile, role });

                const user = {
                    name: 'User',
                    mobile: mobile,
                    role: role,
                    imei: 'TEST_ID'
                };

                // Find real name if possible
                if (window.MasterData) {
                    const record = window.MasterData.getSakhiByMobile(mobile);
                    if (record) {
                        user.name = record.name;
                        Object.assign(user, record);
                    }
                }

                localStorage.setItem('user', JSON.stringify(user));
                onLoginSuccess(user);
            });
        }
    }, 200);

    return render();
}

function getDeviceId() {
    let deviceId = localStorage.getItem('device_binding_id');
    if (!deviceId) {
        deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('device_binding_id', deviceId);
    }
    return deviceId;
}
