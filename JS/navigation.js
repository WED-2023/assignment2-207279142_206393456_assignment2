
  document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll('button[data-screen]'); //Searches for buttons that have the data-screen property
    const screens = document.querySelectorAll('.screen'); //Any div that has a class of screen
  
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-screen');
        const targetScreen = document.getElementById(targetId);
  
        if (targetScreen.classList.contains("protected")) {
          const user = JSON.parse(sessionStorage.getItem("currentUser"));
          if (!user) {
            alert("You must be logged in to access this screen.");
            showScreen("login");
            return;
          }
        }
  
        showScreen(targetId);
      });
    });
  
    function showScreen(screenId) {
      screens.forEach(screen => screen.classList.remove("active"));
      const target = document.getElementById(screenId);
      if (target) target.classList.add("active");
    }
  
    // About
    const aboutBtn = document.getElementById("aboutBtn");
    const aboutModal = document.getElementById("aboutModal");
  
    aboutBtn.addEventListener("click", () => {
      aboutModal.style.display = "flex";
    });
  
    window.addEventListener("click", e => {
      if (e.target === aboutModal) {
        aboutModal.style.display = "none";
      }
    });
  
    window.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        aboutModal.style.display = "none";
      }
    });
  
    const closeBtn = aboutModal.querySelector("button");
    closeBtn.addEventListener("click", () => {
      aboutModal.style.display = "none";
    });

    // Logout functionality
    const logoutBtn = document.getElementById("logoutBtn");

    function updateLogoutVisibility() {
      const user = JSON.parse(sessionStorage.getItem("currentUser"));
      const loginBtn = document.querySelector('button[data-screen="login"]');
      const greeting = document.getElementById("userGreeting");
    
      logoutBtn.style.display = user ? "inline-block" : "none";
      loginBtn.style.display = user ? "none" : "inline-block";
    
      if (greeting) {
        greeting.textContent = user ? `שלום, ${user.firstName || user.username}!` : "";
      }
    }
    updateLogoutVisibility();

    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("currentUser");
      sessionStorage.removeItem("gameConfig"); 
      alert("You have been logged out.");
      updateLogoutVisibility();
      showScreen("login");
    });


    window.showScreen = showScreen;

    window.addEventListener("navigate", (e) => {
      showScreen(e.detail);
});
  });