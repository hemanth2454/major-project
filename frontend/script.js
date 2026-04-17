const API_BASE_URL = CONFIG.API_BASE_URL;

document.addEventListener('DOMContentLoaded', () => {
    console.log('SkillX Frontend Initialized');

    // UI Tab Switching for Auth Page
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');

    if (loginTab && registerTab) {
        loginTab.onclick = () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            errorMessage.style.display = 'none';
        };

        registerTab.onclick = () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
            errorMessage.style.display = 'none';
        };
    }

    // Handle Login
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(data));
                    alert('Login successful!');
                    window.location.href = 'index.html';
                } else {
                    showError(data.error || 'Login failed');
                }
            } catch (err) {
                showError('Server connection failed');
            }
        };
    }

    // Handle Register
    if (registerForm) {
        registerForm.onsubmit = async (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Registration successful! Please login.');
                    loginTab.click();
                } else {
                    showError(data.error || 'Registration failed');
                }
            } catch (err) {
                showError('Server connection failed');
            }
        };
    }

    function showError(msg) {
        if (errorMessage) {
            errorMessage.textContent = msg;
            errorMessage.style.display = 'block';
        }
    }

    // Landing Page Buttons
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    if (loginBtn) loginBtn.onclick = () => window.location.href = 'auth.html';
    if (registerBtn) registerBtn.onclick = () => window.location.href = 'auth.html';

    // Global Navbar & Profile Logic
    initNavbar();
    initFooter();
});

function initFooter() {
    const footerTemplate = `
        <footer class="footer">
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-col">
                        <a href="index.html" class="footer-logo">Skill<span>X</span></a>
                        <p class="footer-desc">Empowering people to share their skills and learn from each other in a collaborative, modern environment.</p>
                        <div class="social-links">
                            <a href="#" class="social-icon">𝕏</a>
                            <a href="#" class="social-icon">in</a>
                            <a href="#" class="social-icon">gh</a>
                        </div>
                    </div>
                    
                    <div class="footer-col">
                        <h4>Quick Links</h4>
                        <ul class="footer-links">
                            <li><a href="index.html">Home</a></li>
                            <li><a href="skills.html">Explore Skills</a></li>
                            <li><a href="chat.html">Live Chat</a></li>
                            <li><a href="auth.html">Join Community</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-col">
                        <h4>Categories</h4>
                        <ul class="footer-links">
                            <li><a href="courses.html#tech">Technical</a></li>
                            <li><a href="courses.html#cooking">Cooking</a></li>
                            <li><a href="courses.html#art">Art & Design</a></li>
                            <li><a href="courses.html#culture">Culture</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-col">
                        <h4>Contact Us</h4>
                        <ul class="footer-contact">
                            <li><span class="icon">✉️</span> support@skillx.com</li>
                            <li><span class="icon">📍</span> 123 Learning Street, Tech Hub</li>
                            <li><span class="icon">📞</span> +1 (555) 000-SKILL</li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p>&copy; 2026 SkillX Platform. All rights reserved.</p>
                    <div class="footer-bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    `;

    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
        placeholder.innerHTML = footerTemplate;
    } else {
        // Fallback: Append to body if placeholder is missing
        const footerDiv = document.createElement('div');
        footerDiv.id = 'footer-placeholder';
        footerDiv.innerHTML = footerTemplate;
        document.body.appendChild(footerDiv);
    }
}

function initNavbar() {
    const userStr = localStorage.getItem('user');
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    if (userStr) {
        const user = JSON.parse(userStr);
        // Remove existing login/register buttons if present
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        if (loginBtn) loginBtn.parentElement.remove();
        if (registerBtn) registerBtn.parentElement.remove();

        // Create Profile Dropdown
        const li = document.createElement('li');
        li.className = 'profile-dropdown-container';
        li.innerHTML = `
            <div class="profile-trigger">
                <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                <span class="user-name">${user.name}</span>
            </div>
            <div class="profile-dropdown-menu">
                <div style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-weight: 700;">${user.name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${user.email}</div>
                </div>
                <button class="dropdown-item" onclick="openEditProfileModal()">
                    <span>👤</span> Edit Profile
                </button>
                <a href="skills.html" class="dropdown-item">
                    <span>📊</span> My Dashboard
                </a>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item" onclick="handleLogout()" style="color: #ef4444;">
                    <span>🚪</span> Logout
                </button>
            </div>
        `;
        navLinks.appendChild(li);
    }
}

function handleLogout() {
    localStorage.removeItem('user');
    alert('Logged out successfully');
    window.location.href = 'index.html';
}

function openEditProfileModal() {
    const user = JSON.parse(localStorage.getItem('user'));
    // Ensure modal exists in DOM
    let modal = document.getElementById('editProfileModal');
    if (!modal) {
        // Inject modal if it doesn't exist (failsafe)
        modal = document.createElement('div');
        modal.id = 'editProfileModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal" onclick="closeEditProfileModal()">&times;</button>
                <div class="modal-header">
                    <h2>Edit Your Profile</h2>
                    <p style="color: var(--text-muted);">Update your account details</p>
                </div>
                <form id="editProfileForm">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="editName" class="form-control" value="${user.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" id="editEmail" class="form-control" value="${user.email}" required>
                    </div>
                    <button type="submit" class="btn btn-primary auth-btn" style="width: 100%; margin-top: 1rem;">Save Changes</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('editProfileForm').onsubmit = handleUpdateProfile;
    }
    modal.classList.add('active');
}

function closeEditProfileModal() {
    document.getElementById('editProfileModal').classList.remove('active');
}

async function handleUpdateProfile(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data));
            alert('Profile updated successfully!');
            closeEditProfileModal();
            window.location.reload();
        } else {
            alert(data.error || 'Update failed');
        }
    } catch (err) {
        alert('Server connection failed');
    }
}
