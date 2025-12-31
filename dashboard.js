const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token) location.href = "index.html";

const appointmentsContainer = document.getElementById("appointments");

// Fetch user appointments
async function loadAppointments() {
  try {
    const res = await fetch(`${BASE_URL}/appointments/user/${user.id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    renderAppointments(data);
  } catch (err) {
    console.error(err);
  }
}

// Render appointments
function renderAppointments(appts) {
  if (!appts.length) {
    appointmentsContainer.innerHTML = "<p>No appointments yet.</p>";
    return;
  }
  appointmentsContainer.innerHTML = appts.map(a => `
    <div class="appointment-card">
      <h4>${a.reason}</h4>
      <p>Date: ${a.date}</p>
      <p>Status: <strong>${a.status}</strong></p>
    </div>
  `).join("");
}

// Logout
function logout() {
  localStorage.clear();
  location.href = "index.html";
}

// Initial load
loadAppointments();

// Poll every 5 seconds for live updates
setInterval(loadAppointments, 5000);

window.logout = logout;