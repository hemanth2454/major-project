// Initial Predefined Courses
const predefinedCourses = {
    tech: [
        { title: "Introduction to HTML & CSS", instructor: "Alice Smith", desc: "Learn the basics of building web pages." },
        { title: "JavaScript for Beginners", instructor: "Bob Johnson", desc: "Start programming interactivity in the browser." },
        { title: "Advanced React Patterns", instructor: "Charlie Brown", desc: "Master modern React development techniques." }
    ],
    culture: [
        { title: "Conversational Spanish", instructor: "Maria Garcia", desc: "Learn to speak Spanish for travel and everyday life." },
        { title: "Japanese Calligraphy basics", instructor: "Kenji Sato", desc: "An introduction to Shodo." }
    ],
    cooking: [
        { title: "Mastering Sourdough bread", instructor: "David Baker", desc: "Bake perfect artisan bread at home." },
        { title: "Authentic Thai Curry", instructor: "Mai Lin", desc: "Learn the secrets of making delicious Thai curry from scratch." }
    ],
    art: [
        { title: "Digital Illustration in Procreate", instructor: "Sarah Artist", desc: "Create stunning digital art using your iPad." },
        { title: "Watercolor Landscapes", instructor: "Emily Chen", desc: "Learn essential watercolor techniques." }
    ]
};

// Get Category from URL
const category = window.location.hash.substring(1) || 'tech'; // Default to tech

// Update Page Title and heading
const categoryNames = {
    tech: "Technical",
    culture: "Cultural & Languages",
    cooking: "Cooking & Culinary",
    art: "Art & Design"
};
document.title = `SkillX | Learn ${categoryNames[category] || category} Skills`;
document.getElementById('categoryTitle').textContent = categoryNames[category] || category;

// Update Teach button link
document.getElementById('teachBtn').addEventListener('click', () => {
    window.location.href = `teach.html#${category}`;
});

// Load Courses
function loadCourses() {
    // One-time auto-reset to clear the corrupted mixed data
    if (localStorage.getItem('skillx_reset') !== 'done') {
        localStorage.removeItem('skillx_courses');
        localStorage.setItem('skillx_reset', 'done');
    }

    // Check localStorage first
    let allCourses = JSON.parse(localStorage.getItem('skillx_courses'));
    
    // Initialize if empty
    if (!allCourses) {
        allCourses = predefinedCourses;
        localStorage.setItem('skillx_courses', JSON.stringify(allCourses));
    }
    
    const categoryCourses = allCourses[category] || [];
    const grid = document.getElementById('coursesGrid');
    grid.innerHTML = '';
    
    if (categoryCourses.length === 0) {
        grid.innerHTML = '<div class="empty-state"><h3>No skills available yet.</h3><p>Be the first to teach something in this category!</p></div>';
        return;
    }
    
    categoryCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <h3 class="course-title">${course.title}</h3>
            <div class="course-meta">Instructed by: <strong>${course.instructor}</strong></div>
            <p class="course-desc">${course.desc}</p>
            <button class="btn btn-primary" style="width: 100%;" onclick="sendJoinRequest('${course.instructor}', '${course.title}')">Request to Join</button>
        `;
        grid.appendChild(card);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', loadCourses);

async function sendJoinRequest(instructor, title) {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        alert("Please login first to request to join a skill session.");
        window.location.href = 'auth.html';
        return;
    }
    const user = JSON.parse(userStr);
    
    // Check if user is requesting to join their own course
    if (user.name === instructor) {
        alert("You cannot join your own session.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                senderName: user.name,
                receiverName: instructor,
                courseTitle: title
            })
        });
        if (response.ok) {
            alert('Join request sent successfully to ' + instructor + '!');
        } else {
            console.error('Failed to send join request. Status:', response.status);
            const errorData = await response.json().catch(() => ({}));
            console.error('Error Details:', errorData);
            alert('Failed to send join request. Please try again.');
        }
    } catch (err) {
        alert('Server unreachable. Please check your connection.');
        console.error('Fetch Error:', err);
    }
}
