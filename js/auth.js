/* ============================================================
   MedBook — Authentication (to'liq)
   Fayl: js/auth.js
   ============================================================ */

const AUTH_KEY = "medbook_user";
const USERS_KEY = "medbook_users";

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); }
  catch { return null; }
}

function setCurrentUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function getAllUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}

function saveAllUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  updateAuthUI();
  showToast("Tizimdan chiqdingiz", "info");
}

function updateAuthUI() {
  const user = getCurrentUser();
  const loginPrompt = document.getElementById("loginPrompt");
  const dashboardContent = document.getElementById("dashboardContent");
  const userName = document.getElementById("userName");
  const userAvatar = document.getElementById("userAvatar");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");

  if (user) {
    if (loginPrompt) loginPrompt.style.display = "none";
    if (dashboardContent) dashboardContent.style.display = "grid";
    if (userName) userName.textContent = user.name;
    if (userAvatar) {
      userAvatar.textContent = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (loginBtn) {
      loginBtn.innerHTML = `<i class="fa-solid fa-user"></i><span>${user.name.split(" ")[0]}</span>`;
      loginBtn.onclick = () => {
        document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" });
      };
    }
    if (registerBtn) registerBtn.style.display = "none";
  } else {
    if (loginPrompt) loginPrompt.style.display = "block";
    if (dashboardContent) dashboardContent.style.display = "none";
    if (loginBtn) {
      loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i><span>Kirish</span>';
      loginBtn.onclick = () => openModal("loginModal");
    }
    if (registerBtn) registerBtn.style.display = "";
  }
}

function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "Error");
  if (input) input.classList.add("error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("show");
  }
}

function clearFieldError(fieldId) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "Error");
  if (input) input.classList.remove("error");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.remove("show");
  }
}

function clearAllErrors(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
    el.classList.remove("show");
  });
  form.querySelectorAll("input").forEach((el) => el.classList.remove("error"));
}

function validatePhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  return /^(\+998|998|0)?[0-9]{9}$/.test(cleaned);
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return "weak";
  if (score <= 2) return "medium";
  if (score <= 3) return "strong";
  return "very-strong";
}

function setButtonLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.classList.add("loading");
    btn.disabled = true;
  } else {
    btn.classList.remove("loading");
    btn.disabled = false;
  }
}

function handleLogin(e) {
  e.preventDefault();
  clearAllErrors("loginForm");

  const phone = document.getElementById("loginPhone").value.trim();
  const password = document.getElementById("loginPassword").value;
  const submitBtn = document.getElementById("loginSubmitBtn");

  let valid = true;

  if (!phone) {
    showFieldError("loginPhone", "Telefon raqamni kiriting");
    valid = false;
  } else if (!validatePhone(phone)) {
    showFieldError("loginPhone", "Noto'g'ri telefon raqam formati");
    valid = false;
  }

  if (!password) {
    showFieldError("loginPassword", "Parolni kiriting");
    valid = false;
  } else if (password.length < 6) {
    showFieldError("loginPassword", "Parol kamida 6 belgi bo'lishi kerak");
    valid = false;
  }

  if (!valid) return;

  setButtonLoading(submitBtn, true);

  setTimeout(() => {
    const users = getAllUsers();
    let user = users.find((u) => u.phone === phone);
    if (!user) {
      user = { name: "Aziza Karimova", phone: phone, createdAt: new Date().toISOString() };
    }
    setCurrentUser({ ...user, loginAt: new Date().toISOString() });
    updateAuthUI();
    setButtonLoading(submitBtn, false);
    closeModal("loginModal");
    showToast(`Xush kelibsiz, ${user.name.split(" ")[0]}! 🎉`, "success");
    setTimeout(() => {
      document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" });
    }, 300);
  }, 900);
}

function handleRegister(e) {
  e.preventDefault();
  clearAllErrors("registerForm");

  const name = document.getElementById("regName").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;
  const agree = document.getElementById("regAgree").checked;
  const submitBtn = document.getElementById("registerSubmitBtn");

  let valid = true;

  if (!name) {
    showFieldError("regName", "Ismingizni kiriting");
    valid = false;
  } else if (name.length < 3) {
    showFieldError("regName", "Ism kamida 3 belgi bo'lishi kerak");
    valid = false;
  } else if (!/^[a-zA-Z\u0400-\u04FF\s'\-]+$/.test(name)) {
    showFieldError("regName", "Faqat harflar va bo'shliq");
    valid = false;
  }

  if (!phone) {
    showFieldError("regPhone", "Telefon raqamni kiriting");
    valid = false;
  } else if (!validatePhone(phone)) {
    showFieldError("regPhone", "Noto'g'ri telefon raqam formati");
    valid = false;
  } else {
    const existing = getAllUsers().find((u) => u.phone === phone);
    if (existing) {
      showFieldError("regPhone", "Bu raqam allaqachon ro'yxatdan o'tgan");
      valid = false;
    }
  }

  if (!password) {
    showFieldError("regPassword", "Parolni kiriting");
    valid = false;
  } else if (password.length < 6) {
    showFieldError("regPassword", "Parol kamida 6 belgi bo'lishi kerak");
    valid = false;
  }

  if (!confirmPassword) {
    showFieldError("regConfirmPassword", "Parolni tasdiqlang");
    valid = false;
  } else if (password !== confirmPassword) {
    showFieldError("regConfirmPassword", "Parollar mos emas");
    valid = false;
  }

  if (!agree) {
    const agreeErr = document.getElementById("regAgreeError");
    if (agreeErr) {
      agreeErr.textContent = "Shartlarga rozilik bering";
      agreeErr.classList.add("show");
    }
    valid = false;
  }

  if (!valid) return;

  setButtonLoading(submitBtn, true);

  setTimeout(() => {
    const newUser = { name, phone, password, createdAt: new Date().toISOString() };
    const users = getAllUsers();
    users.push(newUser);
    saveAllUsers(users);
    setCurrentUser(newUser);
    updateAuthUI();
    setButtonLoading(submitBtn, false);
    closeModal("registerModal");
    showToast(`Ro'yxatdan o'tdingiz, ${name.split(" ")[0]}! 🎉`, "success");

    document.getElementById("registerForm").reset();
    const meter = document.getElementById("passwordStrength");
    if (meter) meter.className = "password-strength";

    setTimeout(() => {
      document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" });
    }, 300);
  }, 1100);
}

function handleForgot(e) {
  e.preventDefault();
  clearAllErrors("forgotForm");
  const phone = document.getElementById("forgotPhone").value.trim();
  if (!phone) {
    showFieldError("forgotPhone", "Telefon raqamni kiriting");
    return;
  }
  if (!validatePhone(phone)) {
    showFieldError("forgotPhone", "Noto'g'ri telefon raqam");
    return;
  }
  showToast("SMS kod yuborildi! 📱", "success");
  closeModal("forgotModal");
  document.getElementById("forgotForm").reset();
}

function biometricLogin() {
  showToast("Biometrik tekshirilmoqda...", "info");
  setTimeout(() => {
    const user = { name: "Aziza Karimova", phone: "+998901234567" };
    setCurrentUser(user);
    updateAuthUI();
    closeModal("loginModal");
    showToast("Biometrik kirish muvaffaqiyatli! 🎉", "success");
    setTimeout(() => {
      document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" });
    }, 300);
  }, 1200);
}

function initPasswordToggles() {
  document.querySelectorAll(".password-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.toggle);
      if (!input) return;
      const icon = btn.querySelector("i");
      if (input.type === "password") {
        input.type = "text";
        icon.className = "fa-regular fa-eye-slash";
      } else {
        input.type = "password";
        icon.className = "fa-regular fa-eye";
      }
    });
  });
}

function initPasswordStrength() {
  const input = document.getElementById("regPassword");
  const meter = document.getElementById("passwordStrength");
  if (!input || !meter) return;
  input.addEventListener("input", () => {
    const val = input.value;
    meter.className = "password-strength";
    if (!val) return;
    const strength = getPasswordStrength(val);
    meter.classList.add(strength);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
  initPasswordToggles();
  initPasswordStrength();

  document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
  document.getElementById("registerForm")?.addEventListener("submit", handleRegister);
  document.getElementById("forgotForm")?.addEventListener("submit", handleForgot);

  document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });

  document.getElementById("loginPromptBtn")?.addEventListener("click", () => openModal("loginModal"));
  document.getElementById("registerPromptBtn")?.addEventListener("click", () => openModal("registerModal"));

  document.querySelectorAll("[data-switch]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.switch;
      document.querySelectorAll(".modal-overlay.show").forEach((m) => m.classList.remove("show"));
      if (target === "register") openModal("registerModal");
      else if (target === "login") openModal("loginModal");
    });
  });

  document.getElementById("forgotPassword")?.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal("loginModal");
    openModal("forgotModal");
  });

  document.getElementById("biometricBtn")?.addEventListener("click", biometricLogin);

  document.querySelectorAll("[data-social]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const provider = btn.dataset.social;
      btn.disabled = true;
      showToast(`${provider} orqali kirish...`, "info");
      setTimeout(() => {
        setCurrentUser({ name: "Aziza Karimova", phone: "+998901234567", provider });
        updateAuthUI();
        closeModal("loginModal");
        showToast(`${provider} orqali kirdingiz! 🎉`, "success");
        btn.disabled = false;
      }, 1000);
    });
  });

  document.getElementById("loginPhone")?.addEventListener("input", () => clearFieldError("loginPhone"));
  document.getElementById("loginPassword")?.addEventListener("input", () => clearFieldError("loginPassword"));
  document.getElementById("regName")?.addEventListener("input", () => clearFieldError("regName"));
  document.getElementById("regPhone")?.addEventListener("input", () => clearFieldError("regPhone"));
  document.getElementById("regPassword")?.addEventListener("input", () => clearFieldError("regPassword"));
  document.getElementById("regConfirmPassword")?.addEventListener("input", () => clearFieldError("regConfirmPassword"));
  document.getElementById("forgotPhone")?.addEventListener("input", () => clearFieldError("forgotPhone"));
});