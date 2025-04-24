document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorEl = document.getElementById("loginError");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    const users = JSON.parse(sessionStorage.getItem("users")) || [];

    // Default test user login
    if (username === "p" && password === "testuser") {
      const user = { username: "p", defaultUser: true };
      sessionStorage.setItem("currentUser", JSON.stringify(user));

      // Update UI for logged-in state
      if (typeof updateUIForUser === "function") updateUIForUser();


      const greeting = document.getElementById("userGreeting");
      if (greeting) {
        greeting.textContent = `Hello, ${user.username}!`;
      }

      // Navigate to welcome screen
      const event = new CustomEvent("navigate", { detail: "welcome" });
      window.dispatchEvent(event);
      return;
    }

    // Check against registered users
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      errorEl.textContent = "Username or password is incorrect.";
      return;
    }

    sessionStorage.setItem("currentUser", JSON.stringify(user));
    //sessionStorage.setItem("username", username);

    // Update UI for logged-in state
    if (typeof updateUIForUser === "function") updateUIForUser();


    const greeting = document.getElementById("userGreeting");
    if (greeting) {
      greeting.textContent = `Hello, ${user.firstName || user.username}!`;
    }

    // Navigate to welcome screen
    const event = new CustomEvent("navigate", { detail: "welcome" });
    window.dispatchEvent(event);
  });
});
