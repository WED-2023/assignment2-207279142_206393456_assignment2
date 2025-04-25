
  document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll('button[data-screen]'); //Searches for buttons that have the data-screen property
    const screens = document.querySelectorAll('.screen'); //Any div that has a class of screen
  
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-screen');
        const targetScreen = document.getElementById(targetId);
    
        const user = JSON.parse(sessionStorage.getItem("currentUser"));
    
        if (targetScreen.classList.contains("protected")) {
          if (!user) {
            alert("You must be logged in to access this screen.");
            showScreen("login");
            return;
          }
          // Check if the user is logged in and if the target screen is "game"
          if (targetId === "game") {
            const config = JSON.parse(sessionStorage.getItem("gameConfig"));
            if (!config) {
              return;
            }
          }
        }
    
        showScreen(targetId);
        updateUIForUser();
      });
    });
  
    function showScreen(screenId) {
      screens.forEach(screen => screen.classList.remove("active"));
      const target = document.getElementById(screenId);
      if (target) target.classList.add("active");
      // Stop background music when leaving the game screen
      if (screenId !== "game") {
        const bgm = document.getElementById("gameMusic");
        if (bgm && !bgm.paused) {
          bgm.pause();
          bgm.currentTime = 0; // Optional: reset to start
        }
      }
      // Clear forms if returning
      if (screenId === "login") {
        document.getElementById("loginForm").reset();
        document.getElementById("loginError").textContent = "";
      }
    
      if (screenId === "register") {
        document.getElementById("registerForm").reset();
        document.getElementById("registerError").textContent = "";
      }
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
      updateUIForUser();
    }
    updateLogoutVisibility();

    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("currentUser");
      sessionStorage.removeItem("gameConfig");
    
      const greeting = document.getElementById("userGreeting");
      if (greeting) greeting.textContent = "";
    
      alert("You have been logged out.");
      updateLogoutVisibility();
      showScreen("login");
    });


    window.showScreen = showScreen;

    window.addEventListener("navigate", (e) => {
      const targetId = e.detail;
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


    function updateUIForUser() {
      const user = JSON.parse(sessionStorage.getItem("currentUser"));
      const loggedIn = !!user;
    
      // navigation buttons
      document.querySelector('[data-screen="login"]').style.display = loggedIn ? "none" : "inline-block";
      document.querySelector('[data-screen="register"]').style.display = loggedIn ? "none" : "inline-block";
      document.getElementById("logoutBtn").style.display = loggedIn ? "inline-block" : "none";
    
      // hide "let's play" and "Settings" if not logged in
      document.querySelector('[data-screen="game"]').style.display = loggedIn ? "inline-block" : "none";
      document.querySelector('[data-screen="config"]').style.display = loggedIn ? "inline-block" : "none";
    
      // Welcome screen buttons
      const welcomeLogin = document.querySelector('#welcome [data-screen="login"]');
      const welcomeRegister = document.querySelector('#welcome [data-screen="register"]');
      if (welcomeLogin) welcomeLogin.style.display = loggedIn ? "none" : "inline-block";
      if (welcomeRegister) welcomeRegister.style.display = loggedIn ? "none" : "inline-block";
    
      // Greeting
      const greeting = document.getElementById("userGreeting");
      if (greeting) greeting.textContent = loggedIn ? `Hello, ${user.firstName || user.username}!` : "";
    
      const buttonBox = document.querySelector('#welcome .button-box');
      if (buttonBox) buttonBox.style.display = loggedIn ? "none" : "block";
    }
    window.updateUIForUser = updateUIForUser;

  });