/**
 * Global Configuration for SkillX Frontend
 * Use this file to set the connection to the backend server.
 */
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const CONFIG = {
    // The base URL for the Spring Boot REST API
    API_BASE_URL: isLocalhost 
        ? `http://localhost:8080/api` 
        : `https://major-project-42do.onrender.com/api`,

    // The WebSocket endpoint for Chat features
    WS_URL: isLocalhost 
        ? `ws://localhost:8080/ws` 
        : `wss://major-project-42do.onrender.com/ws`
};

// Export for console debugging if needed
window.APP_CONFIG = CONFIG;
