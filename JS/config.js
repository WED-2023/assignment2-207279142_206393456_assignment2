document.addEventListener("DOMContentLoaded", () => {
  const configForm = document.getElementById("configForm");
  const durationInput = document.getElementById("gameDuration");
  const errorEl = document.getElementById("configError");
  const shootKeyInput = document.getElementById("shootKey");

  // Allow space key to be entered into the shoot key field
  shootKeyInput.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      e.preventDefault();
      shootKeyInput.value = " ";
    }
  });

  configForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const duration = parseInt(durationInput.value);
    const bgSelected = document.querySelector('input[name="background"]:checked');
    const shootKeyRaw = shootKeyInput.value.toLowerCase();
    const allowedKeys = /^[a-z ]$/;

    if (!bgSelected || isNaN(duration) || duration < 2 || !allowedKeys.test(shootKeyRaw)) {
      errorEl.textContent = "Please complete all fields, set duration (min 2) and choose a valid key (a-z or space).";
      return;
    }
    const user = sessionStorage.getItem("currentUser");
    if (!user) {
      alert("Please log in before saving game settings.");
      window.dispatchEvent(new CustomEvent("navigate", { detail: "login" }));
      return;
    }

    const config = {
      duration,
      background: bgSelected.value,
      shootKey: shootKeyRaw === " " ? " " : shootKeyRaw
    };

    sessionStorage.setItem("gameConfig", JSON.stringify(config));

    alert("Settings saved! You may now start the game from the main menu.");
    errorEl.textContent = "";
  });
});
