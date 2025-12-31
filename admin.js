const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || user.role !== "admin") location.href = "index.html";

window.logout = function() {
  localStorage.clear();
  location.href = "index.html";
};

const usersTable = document.querySelector("#usersTable tbody");
const appointmentsTable = document.querySelector("#appointmentsTable tbody");
const searchInput = document.getElementById("search");

// Fetch all users
async function loadUsers() {
  try {
    const res = await fetch(`${BASE_URL}/admin/users`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    renderUsers(data);
  } catch (err) {
    console.error(err);
  }
}

// Fetch all appointments
async function loadAppointments() {
  try {
    const res = await fetch(`${BASE_URL}/admin/appointments`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    renderAppointments(data);
  } catch (err) {
    console.error(err);
  }
}

// Render users table
function renderUsers(users) {
  usersTable.innerHTML = users.map(u => `
    <tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>
        <button class="action-btn delete" onclick="deleteUser('${u.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

// Render appointments table
function renderAppointments(appts) {
  appointmentsTable.innerHTML = appts.map(a => `
    <tr>
      <td>${a.user}</td>
      <td>${a.date}</td>
      <td>${a.reason}</td>
      <td>${a.status}</td>
      <td>
        ${a.status === "pending" ? `
        <button class="action-btn approve" onclick="updateAppointment('${a.id}','approved')">Approve</button>
        <button class="action-btn reject" onclick="updateAppointment('${a.id}','rejected')">Reject</button>
        ` : ""}
        <button class="action-btn delete" onclick="deleteAppointment('${a.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

// Delete user
window.deleteUser = async function(id) {
  if (!confirm("Delete this user?")) return;
  try {
    const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) loadUsers();
  } catch (err) { console.error(err); }
};

// Update appointment status
window.updateAppointment = async function(id, status) {
  try {
    const res = await fetch(`${BASE_URL}/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) loadAppointments();
  } catch(err){ console.error(err); }
};

// Delete appointment
window.deleteAppointment = async function(id) {
  if (!confirm("Delete this appointment?")) return;
  try {
    const res = await fetch(`${BASE_URL}/admin/appointments/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) loadAppointments();
  } catch(err){ console.error(err); }
}

// Search filter
searchInput.addEventListener("input", () => {
  const filter = searchInput.value.toLowerCase();
  Array.from(usersTable.rows).forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(filter) ? "" : "none";
  });
  Array.from(appointmentsTable.rows).forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(filter) ? "" : "none";
  });
});

// Initial load
loadUsers();
loadAppointments();