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
            
            <div class="card fade-in">
                <div id="step-mobile">
                    <div class="form-group">
                        <label class="form-label">${window.t('lbl_role')}</label>
                        <select id="role-select" class="form-input" style="font-weight:bold;">
                            <option value="sakhi">👩‍🌾 ${window.t('role_sakhi')}</option>
                            <option value="vo">👨‍⚕️ ${window.t('role_vo')}</option>
                            <option value="admin">🏛️ ${window.t('role_admin')}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">${window.t('login_mobile_label')}</label>
                        <input type="tel" id="mobile-input" class="form-input" placeholder="9876543210" maxlength="10" />
                    </div>
                    <div class="form-group">
                        <button id="btn-get-otp" class="btn btn-primary">${window.t('login_get_otp')}</button>
                    </div>
                </div>

                <div id="step-otp" class="hidden">
                    <div class="form-group">
                        <label class="form-label">${window.t('login_enter_otp')}</label>
                        <input type="number" id="otp-input" class="form-input" placeholder="XXXX" maxlength="4" />
                        <p class="text-sm mt-4 text-center" style="color: var(--text-secondary);">${window.t('otp_sent_to')} <span id="sent-mobile"></span></p>
                    </div>
                    <div class="form-group">
                        <button id="btn-verify-otp" class="btn btn-primary">${window.t('login_verify')}</button>
                    </div>
                </div>
            </div>
            
            <div id="device-check" class="text-center mt-4 hidden">
                 <p class="text-sm">${window.t('device_checking')} <span class="spinner" style="display:inline-block; width:10px; height:10px; border-width:2px;"></span></p>
            </div>

        </div>
        <div class="text-center text-sm text-secondary" style="margin-bottom: 2rem; color: var(--text-secondary);">
            ${window.t('reap_branding')} <br>
            ${window.t('footer_text')}
        </div>
    </div>
    `;

    // Logic
    setTimeout(() => {
        const btnGetOtp = document.getElementById('btn-get-otp');
        const btnVerifyOtp = document.getElementById('btn-verify-otp');
        const stepMobile = document.getElementById('step-mobile');
        const stepOtp = document.getElementById('step-otp');
        const mobileInput = document.getElementById('mobile-input');
        const sentMobile = document.getElementById('sent-mobile');
        const deviceCheck = document.getElementById('device-check');
        const roleSelect = document.getElementById('role-select');

        if (btnGetOtp) {
            btnGetOtp.addEventListener('click', () => {
                const mobile = mobileInput.value;
                if (mobile.length === 10) {
                    stepMobile.classList.add('hidden');
                    stepOtp.classList.remove('hidden');
                    sentMobile.innerText = mobileInput.value;
                } else {
                    alert('Please enter valid mobile number');
                }
            });
        }

        if (btnVerifyOtp) {
            btnVerifyOtp.addEventListener('click', () => {
                const otp = document.getElementById('otp-input').value;
                if (otp === '1234') {
                    stepOtp.classList.add('hidden');
                    deviceCheck.classList.remove('hidden');

                    // Simulate Device Check & Login
                    setTimeout(() => {
                        const user = {
                            name: roleSelect.value === 'sakhi' ? 'Sakhi' : (roleSelect.value === 'vo' ? 'Dr. Sharma' : 'Admin'),
                            mobile: mobileInput.value,
                            role: roleSelect.value || 'sakhi',
                            imei: getDeviceId()
                        };
                        localStorage.setItem('user', JSON.stringify(user));
                        onLoginSuccess(user);
                    }, 1500);
                } else {
                    alert("Invalid OTP (Try 1234)");
                }
            });
        }
    }, 0);

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
