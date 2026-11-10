/* ============================================================
   MedBook — Theme Manager (to'liq)
   Fayl: js/theme.js
   ============================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "medbook_theme";
  const META_DARK = "#0a0f1c";
  const META_LIGHT = "#f8fafc";
  const META_SEPIA = "#f4ecd8";

  /* ---------- 1. Boshlang'ich tema ---------- */
  function getInitialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light" || stored === "sepia") return stored;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  /* ---------- 2. Temani qo'llash ---------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      if (theme === "dark") meta.setAttribute("content", META_DARK);
      else if (theme === "light") meta.setAttribute("content", META_LIGHT);
      else meta.setAttribute("content", META_SEPIA);
    }

    const icon = document.querySelector("#themeBtn i");
    if (icon) {
      // 3 ta rejim uchun 3 xil ikonka
      if (theme === "dark") icon.className = "fa-solid fa-moon";
      else if (theme === "light") icon.className = "fa-solid fa-sun";
      else if (theme === "sepia") icon.className = "fa-solid fa-book-open";
    }
  }

  /* ---------- 3. Tema almashtirish ---------- */
  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    
    // Ketma-ketlik: Dark -> Light -> Sepia -> Dark ...
    let next = "dark";
    if (current === "dark") next = "light";
    else if (current === "light") next = "sepia";
    else if (current === "sepia") next = "dark";

    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);

    // Tema o'zgarganda xabar berish uchun event
    window.dispatchEvent(new CustomEvent("medbook:themechange", { detail: { theme: next } }));
  }

  /* ---------- 4. Tizim temasiga moslashish ---------- */
  function watchSystemTheme() {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
  }

  /* ---------- 5. Init ---------- */
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);

  document.addEventListener("DOMContentLoaded", () => {
    const themeBtn = document.getElementById("themeBtn");
    if (themeBtn) {
      themeBtn.addEventListener("click", toggleTheme);
    }
    watchSystemTheme();
  });

  /* ---------- 6. Global API ---------- */
  window.MedBookTheme = {
    get: () => document.documentElement.getAttribute("data-theme") || "dark",
    set: (theme) => {
      if (!["dark", "light", "sepia"].includes(theme)) return;
      applyTheme(theme);
      localStorage.setItem(STORAGE_KEY, theme);
    },
    toggle: toggleTheme,
    reset: () => {
      localStorage.removeItem(STORAGE_KEY);
      applyTheme(getInitialTheme());
    },
  };
})();