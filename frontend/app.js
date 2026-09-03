const apiUrl = "http://localhost:5000/api";
const statusMessage = document.querySelector("#status");
const profilePanel = document.querySelector("#profile-panel");
const authForms = document.querySelectorAll(".auth-form");
const tabs = document.querySelector(".tabs");

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status ${type}`;
}

function showProfile(user, token) {
  document.querySelector("#profile-name").textContent = user.name;
  document.querySelector("#profile-email").textContent = user.email;
  document.querySelector("#profile-mobile").textContent = user.mobile;
  document.querySelector("#profile-token").value = token;
  tabs.classList.add("hidden");
  authForms.forEach((form) => form.classList.add("hidden"));
  profilePanel.classList.remove("hidden");
}

function showLogin() {
  profilePanel.classList.add("hidden");
  tabs.classList.remove("hidden");
  authForms.forEach((form) => form.classList.add("hidden"));
  document.querySelector("#login-form").classList.remove("hidden");
  document.querySelector('[data-form="login-form"]').classList.add("active");
  document
    .querySelector('[data-form="register-form"]')
    .classList.remove("active");
}

async function sendRequest(path, payload) {
  const response = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Something went wrong.");
  }

  return result;
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((item) => item.classList.remove("active"));
    authForms.forEach((form) => form.classList.add("hidden"));
    tab.classList.add("active");
    document.querySelector(`#${tab.dataset.form}`).classList.remove("hidden");
    showStatus("", "");
  });
});

document
  .querySelector("#register-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const result = await sendRequest("/auth/register", payload);
      showStatus(result.message, "success");
      event.currentTarget.reset();
    } catch (error) {
      showStatus(error.message, "error");
    }
  });

document
  .querySelector("#login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const result = await sendRequest("/auth/login", payload);
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("authUser", JSON.stringify(result.user));
      showProfile(result.user, result.token);
      showStatus(`${result.message} Welcome, ${result.user.name}.`, "success");
      event.currentTarget.reset();
    } catch (error) {
      showStatus(error.message, "error");
    }
  });

document.querySelector("#logout-button").addEventListener("click", () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
  showLogin();
  showStatus("You have been logged out.", "success");
});

const savedToken = localStorage.getItem("authToken");
const savedUser = localStorage.getItem("authUser");

if (savedToken && savedUser) {
  showProfile(JSON.parse(savedUser), savedToken);
}
