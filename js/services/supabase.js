/**
 * Supabase Service Manager
 * Handles connection and basic DB operations
 */

const SUPABASE_URL = 'https://owubbqmplvprvponwmio.supabase.co';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Please replace with your actual Anon Key

let supabaseClient = null;
try {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("Supabase client initialized successfully.");
    } else {
        console.warn("Supabase SDK not found on window object.");
    }
} catch (e) {
    console.error("Failed to initialize Supabase client:", e);
    // Alerting for user visibility in absence of console access
    // alert("Supabase Init Error: " + e.message); 
}

window.SupabaseService = {
    /**
     * Upload a single report/entry to Supabase
     * @param {Object} entry - The entry object from IndexedDB
     */
    uploadReport: async (entry) => {
        if (!supabaseClient) {
            console.error("Supabase client not initialized. Check CDN and Keys.");
            throw new Error("Supabase not initialized");
        }

        const { data, error } = await supabaseClient
            .from('reports')
            .insert([
                {
                    id: entry.id,
                    content: entry.data,
                    activity_type: entry.data.activityType || 'other',
                    beneficiary: entry.data.beneficiary || 'internal',
                    created_at: entry.createdAt,
                    sakhi_mobile: JSON.parse(localStorage.getItem('user'))?.mobile || 'unknown'
                }
            ]);

        if (error) {
            console.error("Supabase Insert Error:", error);
            throw error;
        }

        return data;
    },

    /**
     * Fetch reports for the logged in user
     */
    fetchMyReports: async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !supabaseClient) return [];

        const { data, error } = await supabaseClient
            .from('reports')
            .select('*')
            .eq('sakhi_mobile', user.mobile)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase Fetch Error:", error);
            return [];
        }

        return data;
    }
};
