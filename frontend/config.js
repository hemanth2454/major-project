/**
 * Global Configuration for SkillX Frontend
 * Use this file to set the connection to the backend server.
 */
const hostname = window.location.hostname;

// Determine if we are deployed on a public cloud frontend service
const isCloudHosted = hostname.includes('onrender.com') || 
                      hostname.includes('vercel.app') || 
                      hostname.includes('netlify.app') || 
                      hostname.includes('github.io');

const CONFIG = {
    // If cloud-hosted, point to the Render backend. Otherwise, assume backend is on the same machine/IP at port 8080.
    API_BASE_URL: isCloudHosted 
        ? `https://major-project-42do.onrender.com/api` 
        : `http://${hostname}:8080/api`,

    // The WebSocket endpoint for Chat features
    WS_URL: isCloudHosted 
        ? `wss://major-project-42do.onrender.com/ws`
        : `ws://${hostname}:8080/ws`
};

// Export for console debugging if needed
window.APP_CONFIG = CONFIG;
