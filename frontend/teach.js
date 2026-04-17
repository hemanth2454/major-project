// Get Category from URL to set default dropdown value
const initialCategory = window.location.hash.substring(1) || 'tech';
document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('courseCategory');
    if (categorySelect) {
        categorySelect.value = initialCategory;
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        const nameInput = document.getElementById('courseInstructor');
        if (nameInput) {
            nameInput.value = user.name;
        }
    }
});

document.getElementById('teachForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('courseTitle').value;
    const instructor = document.getElementById('courseInstructor').value;
    const desc = document.getElementById('courseDesc').value;
    const category = document.getElementById('courseCategory').value;
    
    // Get existing courses
    let allCourses = JSON.parse(localStorage.getItem('skillx_courses'));
    
    // If not initialized, doing it here just in case they went to Teach immediately
    if (!allCourses) {
        // Initial Predefined Courses
        allCourses = {
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
    }
    
    if (!allCourses[category]) {
        allCourses[category] = [];
    }
    
    // Add new course
    allCourses[category].push({
        title,
        instructor,
        desc
    });
    
    // Save back to local storage
    localStorage.setItem('skillx_courses', JSON.stringify(allCourses));
    
    // Notify and redriect
    alert('Skill registered successfully!');
    window.location.href = `courses.html#${category}`;
});
