document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
});

async function loadDashboardData() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return; 
    
    const user = JSON.parse(userStr);
    const dashboardSection = document.getElementById('dashboard-section');
    const exploreSection = document.getElementById('explore-section');
    const pendingGrid = document.getElementById('pendingRequestsGrid');
    const acceptedGrid = document.getElementById('acceptedRequestsGrid');

    if (!pendingGrid || !acceptedGrid) return;

    let hasDashboardActivity = false;
    pendingGrid.innerHTML = ''; // Clear for refresh
    acceptedGrid.innerHTML = '';

    // Load Pending Requests (where I am the instructor)
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/requests/receiver/${user.name}`);
        if (response.ok) {
            const requests = await response.json();
            if (requests.length > 0) {
                hasDashboardActivity = true;
                requests.forEach(req => {
                    const card = document.createElement('div');
                    card.className = 'skill-card';
                    card.innerHTML = `
                        <div class="skill-content">
                            <h3>${req.courseTitle}</h3>
                            <p><strong>${req.senderName}</strong> wants to join your session.</p>
                            <div class="skill-actions" style="margin-top: 1rem;">
                                <button class="btn btn-primary" onclick="acceptRequest('${req.id}', '${req.senderName}', '${req.receiverName}')">Accept</button>
                                <button class="btn btn-outline" onclick="rejectRequest('${req.id}')">Reject</button>
                            </div>
                        </div>
                    `;
                    pendingGrid.appendChild(card);
                });
            } else {
                pendingGrid.innerHTML = '<p style="color: var(--text-muted);">No pending requests at the moment.</p>';
            }
        }
    } catch (err) {
        console.error('Error fetching received requests', err);
    }

    // Load Accepted Requests (where I am the student)
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/requests/sender/${user.name}`);
        if (response.ok) {
            const requests = await response.json();
            const accepted = requests.filter(r => r.status === 'ACCEPTED');
            if (accepted.length > 0) {
                hasDashboardActivity = true;
                accepted.forEach(req => {
                    const card = document.createElement('div');
                    card.className = 'skill-card';
                    card.innerHTML = `
                        <div class="skill-content">
                            <h3>${req.courseTitle}</h3>
                            <p>Instructor <strong>${req.receiverName}</strong> accepted your request!</p>
                            <div class="skill-actions" style="margin-top: 1rem;">
                                <button class="btn btn-primary" onclick="goToChat('${req.senderName}_${req.receiverName}')">Go to Live Chat</button>
                            </div>
                        </div>
                    `;
                    acceptedGrid.appendChild(card);
                });
            } else {
                acceptedGrid.innerHTML = '<p style="color: var(--text-muted);">No accepted requests yet.</p>';
            }
        }
    } catch (err) {
        console.error('Error fetching sent requests', err);
    }

    if (hasDashboardActivity) {
        dashboardSection.style.display = 'block';
        exploreSection.style.paddingTop = '4rem';
    } else {
        dashboardSection.style.display = 'none';
        exploreSection.style.paddingTop = '10rem';
    }
}

async function acceptRequest(id, sender, receiver) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/requests/${id}/accept`, {
            method: 'PUT'
        });
        if (response.ok) {
            alert('Request accepted! Redirecting to chat...');
            goToChat(`${sender}_${receiver}`);
        } else {
            alert('Failed to accept request.');
        }
    } catch (err) {
        alert('Server unreachable.');
    }
}

async function rejectRequest(id) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/requests/${id}/reject`, {
            method: 'PUT'
        });
        if (response.ok) {
            alert('Request rejected.');
            loadDashboardData(); // Refresh instead of reload
        } else {
            alert('Failed to reject request.');
        }
    } catch (err) {
        alert('Server unreachable.');
    }
}

function goToChat(roomId) {
    window.location.href = `chat.html?room=${roomId}`;
}
