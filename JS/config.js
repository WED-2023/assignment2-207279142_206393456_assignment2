// document.addEventListener("DOMContentLoaded", () => {
//   const configForm = document.getElementById("configForm");
//   const durationInput = document.getElementById("gameDuration");
//   const errorEl = document.getElementById("configError");

//   configForm.addEventListener("submit", (e) => {
//     e.preventDefault();

//     const duration = parseInt(durationInput.value);
//     const bgSelected = document.querySelector('input[name="background"]:checked');

//     if (!bgSelected || isNaN(duration) || duration < 2) {
//       errorEl.textContent = "Please complete all fields and set duration to at least 2 minutes.";
//       return;
//     }

//     // Check if user is logged in
//     const user = sessionStorage.getItem("currentUser");
//     if (!user) {
//       alert("Please log in before starting the game.");
//       window.dispatchEvent(new CustomEvent("navigate", { detail: "login" }));
//       return;
//     }

//     const config = {
//       duration,
//       background: bgSelected.value
//     };

//     sessionStorage.setItem("gameConfig", JSON.stringify(config));

//     // Navigate to game screen
//     const event = new CustomEvent("navigate", { detail: "game" });
//     window.dispatchEvent(event);
//   });
// });
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

    // Check if user is logged in
    const user = sessionStorage.getItem("currentUser");
    if (!user) {
      alert("Please log in before starting the game.");
      window.dispatchEvent(new CustomEvent("navigate", { detail: "login" }));
      return;
    }

    // יצירת אובייקט קונפיגורציה
    const config = {
      duration,  // זמן המשחק (בדקות)
      background: bgSelected.value  // רקע שנבחר
    };

    // שמור את הקונפיגורציה ב-sessionStorage
    sessionStorage.setItem("gameConfig", JSON.stringify(config));

    // ניווט למסך המשחק
    const event = new CustomEvent("navigate", { detail: "game" });
    window.dispatchEvent(event);
  });
});
