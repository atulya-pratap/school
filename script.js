async function loadStudents() {
    try {
        // Updated table name from 'students' to 'student'
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/student?select=*`,
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
            container.innerHTML = `<p class="loading-state">No student profiles found yet.</p>`;
            return;
        }

        students.forEach(student => {
            const card = document.createElement("div");
            card.className = "student-card";

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
