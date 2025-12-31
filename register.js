window.register = async function() {
    const nameInput = document.getElementById("name").value;
    const emailInput = document.getElementById("email").value;
    const passwordInput = document.getElementById("password").value;

    if (!nameInput || !emailInput || !passwordInput) return alert("Fill all fields");

    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: nameInput, email: emailInput, password: passwordInput })
        });

        const data = await res.json();
        if (!res.ok) return alert(data.message || "Register failed");

        alert("Registered successfully! Please login.");
        location.href = "index.html";
    } catch(err) {
        alert("Cannot connect to server. Check internet.");
        console.error(err);
    }
}