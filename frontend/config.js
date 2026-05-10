/**
 * Global Configuration for SkillX Frontend
 * Use this file to set the connection to the backend server.
 */
const CONFIG = {
    // The base URL for the Spring Boot REST API
    API_BASE_URL: `https://skill-exchange-eitb.onrender.com/api`,

    // The WebSocket endpoint for Chat features
    WS_URL: `wss://skill-exchange-eitb.onrender.com/ws`
};

// Export for console debugging if needed
window.APP_CONFIG = CONFIG;
