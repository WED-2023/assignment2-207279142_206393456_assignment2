document.addEventListener("DOMContentLoaded", () => {
  const configForm = document.getElementById("configForm");
  const shootKeySelect = document.getElementById("shootKey");
  const durationInput = document.getElementById("gameDuration");
  const errorEl = document.getElementById("configError");

  configForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const shootKey = shootKeySelect.value;
    const duration = parseInt(durationInput.value);
    const bgSelected = document.querySelector('input[name="background"]:checked');

    if (!shootKey || !bgSelected || isNaN(duration) || duration < 2) {
      errorEl.textContent = "Please complete all fields and set duration to at least 2 minutes.";
      return;
    }

    // Check if user is logged in
    const user = sessionStorage.getItem("currentUser");
    if (!user) {
      alert("Please log in before starting the game.");
      window.dispatchEvent(new CustomEvent("navigate", { detail: "login" }));
      return;
    }

    // Save config
    const config = {
      shootKey: shootKey.toUpperCase(),
      duration,
      background: bgSelected.value
    };

    sessionStorage.setItem("gameConfig", JSON.stringify(config));

    // Navigate to game
    const event = new CustomEvent("navigate", { detail: "game" });
    window.dispatchEvent(event);
  });
});
