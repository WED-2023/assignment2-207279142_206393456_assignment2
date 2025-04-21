document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const errorEl = document.getElementById("loginError");
  
    form.addEventListener("submit", e => {
      e.preventDefault();
  
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value;
  
      // טען את המשתמשים מה-Session או רשימה ריקה
      const users = JSON.parse(sessionStorage.getItem("users")) || [];
  
      // משתמש ברירת מחדל
      if (username === "p" && password === "testuser") {
        sessionStorage.setItem("currentUser", JSON.stringify({ username: "p", defaultUser: true }));
        document.querySelector('button[data-screen="game"]').click(); // נווט למשחק או קונפיגורציה
        return;
      }
  
      const user = users.find(u => u.username === username && u.password === password);
  
      if (!user) {
        errorEl.textContent = "Username or password is incorrect.";
        return;
      }
  
      // התחברות תקינה
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      document.querySelector('button[data-screen="game"]').click(); // נווט למשחק או קונפיגורציה
    });
  });
  