/**
 * Utility functions for Pashu Sakhi Digital
 */

window.utils = {
    /**
     * Share the application link using Web Share API or copy to clipboard
     */
    shareApp: async () => {
        const shareData = {
            title: window.t('app_title'),
            text: window.t('msg_share_text'),
            url: window.location.origin + window.location.pathname
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                console.log("App shared successfully");
            } else {
                // Fallback: Copy to clipboard
                const fullText = `${shareData.text} ${shareData.url}`;
                await navigator.clipboard.writeText(fullText);
                alert("✅ Link copied to clipboard / लिंक कॉपी हो गया!");
            }
        } catch (err) {
            console.error("Shared Failed:", err);
            // Ignore abort errors
            if (err.name !== 'AbortError') {
                alert("Sharing failed. You can copy the URL manually.");
            }
        }
    }
};
