document.addEventListener("DOMContentLoaded", () => {
    // Populate DOB dropdowns
    const daySelect = document.getElementById("dobDay");
    const monthSelect = document.getElementById("dobMonth");
    const yearSelect = document.getElementById("dobYear");
  
    for (let i = 1; i <= 31; i++) {
      daySelect.innerHTML += `<option value="${i}">${i}</option>`;
    }
  
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    months.forEach((month, index) => {
      monthSelect.innerHTML += `<option value="${index + 1}">${month}</option>`;
    });
  
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 1900; y--) {
      yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
    }
  
    // Handle form submit
    document.getElementById("registerForm").addEventListener("submit", e => {
      e.preventDefault();
  
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const email = document.getElementById("email").value.trim();
      const day = daySelect.value;
      const month = monthSelect.value;
      const year = yearSelect.value;
      const errorEl = document.getElementById("registerError");
  
      // Basic checks
      if (!username || !password || !confirmPassword || !firstName || !lastName || !email || !day || !month || !year) {
        errorEl.textContent = "Please fill in all fields.";
        return;
      }
  
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
        errorEl.textContent = "Password must be at least 8 characters and contain both letters and numbers.";
        return;
      }
  
      if (password !== confirmPassword) {
        errorEl.textContent = "Passwords do not match.";
        return;
      }
  
      if (/\d/.test(firstName) || /\d/.test(lastName)) {
        errorEl.textContent = "First and last name cannot contain numbers.";
        return;
      }
  
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        errorEl.textContent = "Invalid email address.";
        return;
      }
  
      // All good - save user (in local/sessionStorage or array)
      const user = {
        username,
        password,
        firstName,
        lastName,
        email,
        dob: `${year}-${month}-${day}`
      };
  
      // Simulate user storage (in real app use DB or backend)
      let users = JSON.parse(sessionStorage.getItem("users")) || [];
      users.push(user);
      sessionStorage.setItem("users", JSON.stringify(users));
  
      alert("Registration successful! You can now login.");
      document.querySelector('button[data-screen="login"]').click();
    });
  });
  