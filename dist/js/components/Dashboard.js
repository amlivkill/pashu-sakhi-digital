window.Dashboard = function (user, navigateTo) {
    // Helper for cards
    const ActivityCard = (icon, label, route) => `
        <button class="card flex flex-col items-center justify-center p-4 gap-2 activity-btn" 
                data-route="${route}"
                style="border: none; cursor: pointer; height: 120px; transition: transform 0.1s;">
            <span style="font-size: 2.5rem;">${icon}</span>
            <span class="font-bold text-sm text-center">${label}</span>
        </button>
    `;

    const render = () => `
    <header class="flex justify-between items-center mb-4 fade-in">
        <div>
            <div class="flex gap-2 items-center">
                <h2 class="font-bold" style="font-size: 1.5rem;">${window.t('namaste')}, ${user.name || 'Sakhi'}! 🙏</h2>
                 <button onclick="window.toggleLanguage()" style="background:none; border:none; font-size:1.2rem; cursor:pointer;" title="Change Language">
                    🌐
                 </button>
            </div>
            <p class="text-sm text-secondary" style="color: var(--text-secondary);">${new Date().toLocaleDateString(window.currentLang === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div style="background: white; padding: 0.5rem; border-radius: 50%; box-shadow: var(--shadow-sm);">
            👤
        </div>
    </header>

    <div class="card fade-in" style="background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%); color: white;">
        <div class="flex justify-between items-center">
            <div>
                <p class="text-sm" style="opacity: 0.9">${window.t('monthly_earnings')}</p>
                <h3 class="font-bold" style="font-size: 2rem;">₹ 4,250</h3>
            </div>
             <div style="font-size: 2.5rem; opacity: 0.5;">💰</div>
        </div>
        <div class="mt-4 flex gap-2">
            <span class="text-sm" style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 10px;">${window.t('pending')}: ₹750</span>
            <span class="text-sm" style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 10px;">${window.t('paid')}: ₹3,500</span>
        </div>
    </div>

    <h3 class="font-bold mb-4 mt-4">${window.t('new_entry')}</h3>
    <div class="fade-in" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding-bottom: 2rem;">
        ${ActivityCard('💉', window.t('act_treatment'), 'form-treatment')}
        ${ActivityCard('💊', window.t('act_vaccination'), 'form-vaccination')}
        ${ActivityCard('🏷️', window.t('act_tagging'), 'form-tagging')}
        ${ActivityCard('📝', window.t('act_census'), 'form-census')}
        ${ActivityCard('🐄', window.t('act_badri'), 'form-badri')}
        ${ActivityCard('🛡️', window.t('act_insurance'), 'form-insurance')}
        ${ActivityCard('📢', window.t('act_awareness'), 'form-awareness')}
        ${ActivityCard('➕', window.t('act_other'), 'form-other')}
    </div>
    `;

    setTimeout(() => {
        const btns = document.querySelectorAll('.activity-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const route = btn.dataset.route;
                navigateTo(route);
            });
        });
    }, 0);

    return render();
}
