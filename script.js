const SUPABASE_URL = "https://pzplzdgdlnjfwbklxbfd.supabase.co";
const SUPABASE_KEY = "sb_publishable_N3pli21Nl9PtLXeFkiuizg_W5Aw5MpM";

async function loadStudents() {
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
        return;
    }

    const students = await response.json();

    const container = document.getElementById("students-container");

    container.innerHTML = "";

    students.forEach(student => {
        const card = document.createElement("div");

        card.className = "student-card";

        card.innerHTML = `
            <h3>${student.name}</h3>
            <p>Class ${student.class} • Section ${student.section}</p>
            <p>${student.bio || "No bio yet."}</p>
        `;

        container.appendChild(card);
    });
}

loadStudents();
