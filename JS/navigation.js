document.addEventListener("DOMContentLoaded", () => {
    // Handle screen switching by button click
    const buttons = document.querySelectorAll('button[data-screen]'); //Searches for buttons that have the data-screen property
    const screens = document.querySelectorAll('.screen'); //Any div that has a class of screen
  
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-screen');
  
        screens.forEach(screen => {
          screen.classList.remove('active');
        });
  
        const targetScreen = document.getElementById(targetId);
        if (targetScreen) {
          targetScreen.classList.add('active');
        }
      });
    });
  



    // Handle About modal
    const aboutBtn = document.getElementById("aboutBtn");
    const aboutModal = document.getElementById("aboutModal");
  
    aboutBtn.addEventListener("click", () => {
      aboutModal.style.display = "flex";
    });

    // Close modal by clicking outside
    window.addEventListener("click", e => {
      if (e.target === aboutModal) {
        aboutModal.style.display = "none";
      }
    });

    // Close modal with ESC
    window.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        aboutModal.style.display = "none";
      }
    });


    // Close modal with X button
    const closeBtn = aboutModal.querySelector("button");
    closeBtn.addEventListener("click", () => {
      aboutModal.style.display = "none";
    });
  });