console.log("1. Script started loading...");

const SUPABASE_URL = "https://pzplzdgdlnjfwbklxbfd.supabase.co";
const SUPABASE_KEY = "sb_publishable_N3pli21Nl9PtLXeFkiuizg_W5Aw5MpM";

function sanitizeHTML(str) {
    if (!str) return "";
    const tempDiv = document.createElement('div');
    tempDiv.textContent = str;
    return tempDiv.innerHTML;
}

async function loadStudents() {
    console.log("2. loadStudents function called");
    try {
        console.log("3. Attempting to fetch data from Supabase...");
        
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/student?select=*`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`
                }
            }
        );
        
        console.log("4. Fetch completed. Status:", response.status);

        if (!response.ok) {
            const errText = await response.text();
            console.error("API Error details:", errText);
            document.getElementById("students-container").innerHTML = `<p class="loading-state">Error: ${errText}</p>`;
            return;
        }

        const students = await response.json();
        console.log("5. Data parsed successfully:", students);
        
        const container = document.getElementById("students-container");
        container.innerHTML = ""; 

        if (!Array.isArray(students)) {
            console.error("Expected an array but got:", typeof students);
            container.innerHTML = `<p class="loading-state">Data format error. Check console.</p>`;
            return;
        }

        if (students.length === 0) {
            console.log("6. Request succeeded, but the table is empty (or blocked by RLS).");
            container.innerHTML = `<p class="loading-state">No student profiles found yet.</p>`;
            return;
        }

        console.log("7. Rendering students to UI...");
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
        
        console.log("8. Finished rendering.");

    } catch (error) {
        console.error("9. Network or parsing crash:", error);
        document.getElementById("students-container").innerHTML = `<p class="loading-state">Error: ${error.message}</p>`;
    }
}

loadStudents();
