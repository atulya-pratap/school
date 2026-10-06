const SUPABASE_URL = "https://pzplzdgdlnjfwbklxbfd.supabase.co";
const SUPABASE_KEY = "sb_publishable_N3pli21Nl9PtLXeFkiuizg_W5Aw5MpM";

// Security feature: Escapes HTML tags to prevent XSS attacks from database text
function sanitizeHTML(str) {
    if (!str) return "";
    const tempDiv = document.createElement('div');
    tempDiv.textContent = str;
    return tempDiv.innerHTML;
}

async function loadStudents() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/students?select=*`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (!response.ok) {
            console.error("Failed to load students:", await response.text());
            document.getElementById("students-container").innerHTML = `<p class="loading-state">Error loading students. Please try again later.</p>`;
            return;
        }

        const students = await response.json();
        const container = document.getElementById("students-container");
        
        container.innerHTML = ""; // Clear loading state

        if (students.length === 0) {
            container.innerHTML = `<p class="loading-state">No students found yet.</p>`;
            return;
        }

        students.forEach(student => {
            const card = document.createElement("div");
            card.className = "student-card";

            // Using the sanitizer to ensure safe data rendering
            const safeName = sanitizeHTML(student.name);
            const safeClass = sanitizeHTML(student.class);
            const safeSection = sanitizeHTML(student.section);
            const safeBio = sanitizeHTML(student.bio || "No bio yet.");

            card.innerHTML = `
                <h3>${safeName}</h3>
                <p class="student-meta">Class ${safeClass} • Section ${safeSection}</p>
                <p class="student-bio">${safeBio}</p>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Network or parsing error:", error);
        document.getElementById("students-container").innerHTML = `<p class="loading-state">Connection error. Please check your internet.</p>`;
    }
}

// Initialize
loadStudents();
