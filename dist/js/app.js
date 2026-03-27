// Removed Imports - relying on global window variables loaded via script tags
const Login = window.Login;
const Dashboard = window.Dashboard;
const TreatmentForm = window.TreatmentForm;

// Mock Global State
const state = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isOffline: !navigator.onLine
};

// --- DOM Elements ---
const mainContent = document.getElementById('main-content');
const bottomNav = document.getElementById('bottom-nav');
const offlineIndicator = document.getElementById('offline-indicator');

// Update Nav Labels from i18n
function updateNavLabels() {
    const navItems = document.querySelectorAll('.nav-item .label');
    if (navItems.length > 0) {
        navItems[0].innerText = window.t('nav_home');
        navItems[1].innerText = window.t('nav_history');
        navItems[2].innerText = window.t('nav_sync');
        navItems[3].innerText = window.t('nav_profile');
    }
}

// --- Router ---
function navigate(route) {
    console.log("Navigating to:", route);

    // Auth Guard
    if (route !== 'login' && !state.user) {
        navigate('login');
        return;
    }

    updateNavLabels();

    let viewHTML = '';

    // Role Based Redirection for Home
    if (route === 'dashboard') {
        if (state.user.role === 'vo') {
            viewHTML = window.VODashboard(state.user, navigate);
            bottomNav.classList.add('hidden'); // VO has no bottom nav in this demo
        } else if (state.user.role === 'admin') {
            viewHTML = window.AdminDashboard(state.user, navigate);
            bottomNav.classList.add('hidden'); // Admin has no bottom nav
        } else {
            // Default Sakhi
            viewHTML = window.Dashboard(state.user, navigate);
            bottomNav.classList.remove('hidden');
        }
    } else {
        // Other Routes
        switch (route) {
            case 'login':
                viewHTML = window.Login(handleLoginSuccess);
                bottomNav.classList.add('hidden');
                break;
            case 'history':
                viewHTML = window.HistoryView(navigate);
                bottomNav.classList.remove('hidden');
                break;
            case 'form-treatment':
                viewHTML = window.TreatmentForm(navigate);
                bottomNav.classList.add('hidden');
                break;
            case 'product-form':
                viewHTML = window.ProductForm(navigate);
                bottomNav.classList.add('hidden');
                break;
            case 'profile':
                viewHTML = window.Profile(state.user, navigate);
                bottomNav.classList.remove('hidden');
                break;
            default:
                if (route.startsWith('form-')) {
                    const type = route.replace('form-', '');
                    viewHTML = window.ActivityForm(type, navigate);
                    bottomNav.classList.add('hidden');
                } else {
                    // Fallback
                    viewHTML = window.Dashboard(state.user, navigate);
                    bottomNav.classList.remove('hidden');
                }
                break;
        }
    }

    mainContent.innerHTML = viewHTML;
}

function handleLoginSuccess(user) {
    state.user = user;
    localStorage.setItem('user', JSON.stringify(user));
    navigate('dashboard');
}

// --- Init ---
function init() {
    // Navigation Handling
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove active class from all
            navItems.forEach(n => n.classList.remove('active'));
            // Add to click target (bubbling)
            const target = e.currentTarget;
            target.classList.add('active');

            const route = target.dataset.target; // dashboard, history, etc.
            navigate(route);
        });
    });

    if (!state.user) {
        navigate('login');
    } else {
        navigate('dashboard');
    }

    // Network Listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    // Seed Sample Data
    if (window.Seeder) {
        window.Seeder.init();
    }
}

function updateOnlineStatus() {
    state.isOffline = !navigator.onLine;
    if (state.isOffline) {
        offlineIndicator.classList.remove('hidden');
    } else {
        offlineIndicator.classList.add('hidden');
    }
}

// Start App
init();
