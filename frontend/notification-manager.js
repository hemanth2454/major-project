/**
 * notification-manager.js
 * Handles real-time notifications via WebSockets
 */

(function() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    const user = JSON.parse(userStr);
    let stompClient = null;

    // Create Toast Container if not exists
    function createToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
    }

    function showToast(message, type = 'info', onClickAction = null) {
        createToastContainer();
        const container = document.getElementById('toast-container');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <span style="margin-left: 10px; font-size: 0.8rem; opacity: 0.7;">✕</span>
        `;

        if (onClickAction) {
            toast.onclick = onClickAction;
        } else {
            toast.onclick = () => toast.remove();
        }

        container.appendChild(toast);

        // Auto remove after 8 seconds
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.5s ease-in forwards';
            setTimeout(() => toast.remove(), 500);
        }, 8000);
    }

    function connect() {
        const socket = new SockJS(CONFIG.WS_URL);
        stompClient = Stomp.over(socket);
        stompClient.debug = null; // Disable debug logging for cleaner console

        stompClient.connect({}, function (frame) {
            console.log('Connected to WebSocket: ' + frame);
            
            // Subscribe to personal notifications
            stompClient.subscribe(`/topic/notifications/${user.name}`, function (notification) {
                const request = JSON.parse(notification.body);
                handleNotification(request);
            });
        }, function (error) {
            console.error('WebSocket Error: ', error);
            // Retry connection after 5 seconds
            setTimeout(connect, 5000);
        });
    }

    function handleNotification(request) {
        // If I am the receiver (instructor) and a request is PENDING
        if (request.receiverName === user.name && request.status === 'PENDING') {
            showToast(`New Request: <strong>${request.senderName}</strong> wants to join "${request.courseTitle}"`, 'info', () => {
                window.location.href = 'skills.html';
            });
            // If we are already on skills.html, refresh the lists
            if (window.location.pathname.includes('skills.html')) {
                if (typeof loadDashboardData === 'function') {
                    loadDashboardData();
                } else {
                    window.location.reload();
                }
            }
        }

        // If I am the sender (student) and the request was ACCEPTED
        if (request.senderName === user.name && request.status === 'ACCEPTED') {
            showToast(`Request Accepted! <strong>${request.receiverName}</strong> is ready for "${request.courseTitle}"`, 'success', () => {
                window.location.href = `chat.html?room=${request.senderName}_${request.receiverName}`;
            });
            // If on skills.html, refresh
            if (window.location.pathname.includes('skills.html')) {
                window.location.reload();
            }
        }

        // If I am the sender (student) and the request was REJECTED
        if (request.senderName === user.name && request.status === 'REJECTED') {
            showToast(`Request Rejected: Your request for "${request.courseTitle}" was declined.`, 'info');
            if (window.location.pathname.includes('skills.html')) {
                window.location.reload();
            }
        }
    }

    // Initialize
    window.addEventListener('load', () => {
        // We need SockJS and STOMP libraries
        // If they are not present, they should be added to the HTML
        if (typeof SockJS !== 'undefined' && typeof Stomp !== 'undefined') {
            connect();
        } else {
            console.warn('SockJS or Stomp not found. Please include them in your HTML.');
        }
    });

})();
