document.addEventListener("DOMContentLoaded", () => {
    const configForm = document.getElementById("configForm");
  
    configForm.addEventListener("submit", e => {
      e.preventDefault();
  
      const shootKey = document.getElementById("shootKey").value;
      const duration = parseInt(document.getElementById("gameDuration").value);
      const shipColor = document.getElementById("shipColor").value;
  
      if (duration < 2) {
        alert("Game must be at least 2 minutes.");
        return;
      }
  
      // Save config in session
      sessionStorage.setItem("gameConfig", JSON.stringify({
        shootKey,
        duration,
        shipColor
      }));
  
      // Go to game
      document.querySelector('button[data-screen="game"]').click();
    });
  });
  