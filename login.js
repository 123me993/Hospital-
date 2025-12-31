window.login = async function() {
    const emailInput = document.getElementById("email").value;
    const passwordInput = document.getElementById("password").value;

    if (!emailInput || !passwordInput) return alert("Please enter email & password");

    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailInput, password: passwordInput })
        });

        const data = await res.json();

        if (!res.ok) return alert(data.message || "Login failed");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "admin") {
            location.href = "admin.html";
        } else {
            location.href = "dashboard.html";
        }
    } catch (err) {
        alert("Cannot connect to server. Check your internet.");
        console.error(err);
    }
}