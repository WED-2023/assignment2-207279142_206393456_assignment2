document.addEventListener("DOMContentLoaded", () => {
  const configForm = document.getElementById("configForm");
  const durationInput = document.getElementById("gameDuration");
  const errorEl = document.getElementById("configError");

  configForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const duration = parseInt(durationInput.value);
    const bgSelected = document.querySelector('input[name="background"]:checked');

    if (!bgSelected || isNaN(duration) || duration < 2) {
      errorEl.textContent = "Please complete all fields and set duration to at least 2 minutes.";
      return;
    }

    // בדיקת התחברות
    const user = sessionStorage.getItem("currentUser");
    if (!user) {
      alert("Please log in before saving game settings.");
      window.dispatchEvent(new CustomEvent("navigate", { detail: "login" }));
      return;
    }

    const config = {
      duration,
      background: bgSelected.value
    };
    sessionStorage.setItem("gameConfig", JSON.stringify(config));

    // הצגת הודעה בלבד
    alert("Settings saved! You may now start the game from the main menu.");
    errorEl.textContent = "";
  });
});
