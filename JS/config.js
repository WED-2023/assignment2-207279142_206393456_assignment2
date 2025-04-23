document.addEventListener("DOMContentLoaded", () => {
  const configForm = document.getElementById("configForm");
  const shootKey = document.getElementById("shootKey").value;

  // Listen for key press to set shoot key
  shootKey.addEventListener("keydown", (e) => {
    e.preventDefault();
    const key = e.code === "Space" ? "Space" : e.key.toUpperCase();
    shootKey.value = key;
  });

  configForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const shootKey = shootKey.value;
    const duration = parseInt(document.getElementById("gameDuration").value);
    const bgSelected = document.querySelector('input[name="background"]:checked');

    const errorEl = document.getElementById("configError");

    if (!shootKey || !bgSelected || isNaN(duration) || duration < 2) {
      errorEl.textContent = "Please complete all fields and set duration to at least 2 minutes.";
      return;
    }

    const config = {
      shootKey,
      duration,
      background: bgSelected.value
    };

    sessionStorage.setItem("gameConfig", JSON.stringify(config));

    // Go to game
    const event = new CustomEvent("navigate", { detail: "game" });
    window.dispatchEvent(event);
  });
});
