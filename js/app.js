/* ============================================================
   MedBook — Main Application
   Fayl: js/app.js
   ============================================================ */

/* ============ MODAL HELPERS ============ */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("show");
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("show");
}

/* ============ TOAST ============ */
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const icons = {
    success: "fa-circle-check",
    info: "fa-circle-info",
    warning: "fa-triangle-exclamation",
  };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.success}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(40px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ============ INIT ============ */
document.addEventListener("DOMContentLoaded", () => {
  setLanguage(currentLang);
  initNavbar();
  initMobileMenu();
  initSectionNavigation();
  initLanguageSwitch();
  initModalButtons();
  initScrollReveal();
  initCounters();
  initHeroSearch();
  initDoctorsGrid();
  initFilters();
  initAppointments();
  initSchedule();
  initChat();
  initRipple();
  initNavHighlight();
  initDashboardTabs();
  initWalletButtons();
});

/* ============ NAVBAR ============ */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  });
}

/* ============ MOBILE MENU ============ */
function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    links.classList.toggle("show");
    const icon = toggle.querySelector("i");
    icon.className = links.classList.contains("show") ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  });
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("show");
      toggle.querySelector("i").className = "fa-solid fa-bars";
    });
  });
}

/* ============ LANGUAGE ============ */
function initLanguageSwitch() {
  const btn = document.getElementById("langBtn");
  if (!btn) return;
  const order = ["uz", "ru", "en"];
  btn.addEventListener("click", () => {
    const idx = order.indexOf(currentLang);
    setLanguage(order[(idx + 1) % order.length]);
    showToast(`Til: ${currentLang.toUpperCase()}`, "info");
  });
}

/* ============ MODAL BUTTONS ============ */
function initModalButtons() {
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const findDoctorBtn = document.getElementById("findDoctorBtn");
  const aiSymptomBtn = document.getElementById("aiSymptomBtn");
  const searchBtn = document.getElementById("searchBtn");

  if (loginBtn) loginBtn.addEventListener("click", () => openModal("loginModal"));
  if (registerBtn) registerBtn.addEventListener("click", () => openModal("registerModal"));
  if (findDoctorBtn)
    findDoctorBtn.addEventListener("click", () => {
      const section = document.getElementById("doctors");
      if (typeof window.setActivePage === "function") {
        window.setActivePage("doctors");
      } else if (section) {
        section.style.display = "";
        section.scrollIntoView({ behavior: "smooth" });
      }
    });
  if (aiSymptomBtn) aiSymptomBtn.addEventListener("click", () => {
    if (typeof window.setActivePage === "function") {
      window.setActivePage("features");
    } else {
      openModal("aiModal");
    }
  });
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const q = document.getElementById("heroSearch").value.trim();
      applyDoctorFilters();
      if (typeof window.setActivePage === "function") {
        window.setActivePage("doctors");
      } else {
        document.getElementById("doctors").scrollIntoView({ behavior: "smooth" });
      }
      if (q) showToast(`"${q}" bo'yicha qidirilmoqda...`, "info");
    });
  }

  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("show");
    });
  });

  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.show").forEach((m) => m.classList.remove("show"));
      const shell = document.getElementById("sectionShell");
      if (shell && shell.classList.contains("show")) {
        shell.classList.remove("show");
        document.body.classList.remove("section-focused");
        document.body.classList.remove("no-scroll");
      }
    }
  });
}

/* ============ SECTION NAVIGATION ============ */
function initSectionNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const footer = document.querySelector("footer");

  const setActivePage = (pageId) => {
    const validPage = ["home", "features", "doctors", "dashboard", "chat"].includes(pageId) ? pageId : "home";

    document.body.classList.add("page-mode");
    navLinks.forEach((link) => {
      const href = (link.getAttribute("href") || "").replace("#", "");
      link.classList.toggle("active", href === validPage);
    });

    sections.forEach((section) => {
      const shouldShow = section.id === validPage;
      section.style.display = shouldShow ? "" : "none";
      section.classList.toggle("page-hidden", !shouldShow);
      section.classList.toggle("page-active", shouldShow);
    });

    if (footer) footer.style.display = validPage === "home" ? "" : "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState({}, "", `#${validPage}`);
  };

  window.setActivePage = setActivePage;

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = (link.getAttribute("href") || "").replace("#", "");
      if (!targetId) return;
      setActivePage(targetId);
      const menu = document.getElementById("navLinks");
      const toggle = document.getElementById("menuToggle");
      if (menu) menu.classList.remove("show");
      if (toggle) toggle.querySelector("i").className = "fa-solid fa-bars";
    });
  });

  const initialPage = window.location.hash ? window.location.hash.replace("#", "") : "home";
  setActivePage(initialPage);
  window.addEventListener("hashchange", () => {
    const nextPage = window.location.hash ? window.location.hash.replace("#", "") : "home";
    setActivePage(nextPage);
  });
}

/* ============ FEATURE CLICK ============ */
function openFeature(type) {
  const content = document.getElementById("featureContent");
  const features = {
    ai: { title: "AI Simptom Tekshirgich", icon: "fa-brain", desc: "Shikoyatlaringizni yozing — sun'iy intellekt qaysi mutaxassisga uchrashishni tavsiya qiladi.", items: ["Simptomlarni tahlil qilish", "Mutaxassis tavsiyasi", "24/7 ishlaydi"] },
    tele: { title: "Video Konsultatsiya", icon: "fa-video", desc: "WebRTC asosidagi xavfsiz video-qo'ng'iroq.", items: ["Shifokor bilan video", "Fayl almashish", "Chat integratsiyasi"] },
    booking: { title: "Real-time Booking", icon: "fa-calendar-check", desc: "Bo'sh vaqtlarni real vaqtda ko'rish.", items: ["Bir bosishda band qilish", "Bekor qilish", "Vaqtni ko'chirish"] },
    ehr: { title: "Raqamli Tibbiy Tarix", icon: "fa-file-medical", desc: "Barcha tahlillar va retseptlar bir joyda.", items: ["PDF yuklab olish", "Shifokor xulosalari", "Retseptlar"] },
    pill: { title: "Dori Eslatmasi", icon: "fa-pills", desc: "Push-bildirishnomalar orqali dori ichish vaqti.", items: ["Retsept bo'yicha eslatma", "Ovozli bildirishnoma", "Tarix"] },
    map: { title: "Geo-Xarita", icon: "fa-map-location-dot", desc: "Yaqin klinikalarni xaritada ko'ring.", items: ["Eng yaqin klinikalar", "Masofa hisoblash", "Marshrut"] },
    ocr: { title: "OCR Analiz Skaner", icon: "fa-camera", desc: "Qog'oz analizlarni rasmga oling — matn raqamlashtiriladi.", items: ["Rasm yuklash", "Avtomatik o'qish", "Kabinetga saqlash"] },
    pay: { title: "Onlayn To'lov", icon: "fa-credit-card", desc: "Click, Payme, Visa/Mastercard.", items: ["Bir bosishda to'lov", "Refund", "Xavfsiz"] },
    rating: { title: "Reyting va Sharhlar", icon: "fa-star", desc: "Yulduzchali reyting va sharhlar.", items: ["Matnli sharh", "Audio sharh", "Yulduzchali reyting"] },
    favorites: { title: "Sevimli Shifokorlar", icon: "fa-heart", desc: "Doimiy shifokorlarni sevimlilarga qo'shing.", items: ["Tez ulanish", "Tez bron qilish", "Bildirishnoma"] },
    multilang: { title: "3 Tilda Muloqot", icon: "fa-language", desc: "O'zbek, Rus, Ingliz.", items: ["Tez almashtirish", "Sahifa qayta yuklanmaydi", "Saqlanadi"] },
    pdf: { title: "PDF Generator", icon: "fa-file-pdf", desc: "Retsept, tahlil, chek PDF'da.", items: ["Tibbiy blanka", "Yuklab olish", "Chop etish"] },
  };

  const f = features[type];
  if (!f) return;

  if (type === "map") { if(window.openMap) openMap(); return; }
  if (type === "ai") { openModal("aiModal"); return; }
  if (type === "booking") {
    document.getElementById("doctors").scrollIntoView({ behavior: "smooth" });
    showToast("Shifokorni tanlang va 'Band qilish' tugmasini bosing", "info");
    return;
  }

  content.innerHTML = `
    <div class="feature-content">
      <h2><i class="fa-solid ${f.icon}" style="color:var(--emerald)"></i> ${f.title}</h2>
      <p>${f.desc}</p>
      <ul>
        ${f.items.map((i) => `<li><i class="fa-solid fa-check"></i> ${i}</li>`).join("")}
      </ul>
      <button class="btn btn-primary btn-block" data-close="featureModal">
        <i class="fa-solid fa-thumbs-up"></i> Tushundim
      </button>
    </div>
  `;
  content.querySelector("[data-close]").addEventListener("click", () => closeModal("featureModal"));
  openModal("featureModal");
}

/* ============ SCROLL REVEAL ============ */
function initScrollReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => observer.observe(el));
}

/* ============ COUNTERS ============ */
function initCounters() {
  const counters = document.querySelectorAll(".stat-value[data-count]");
  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const isDecimal = el.dataset.decimal === "true";
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 1800, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = isDecimal ? (target * eased).toFixed(1) : Math.floor(target * eased).toLocaleString("ru-RU");
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { animate(e.target); observer.unobserve(e.target); } }),
    { threshold: 0.5 }
  );
  counters.forEach((c) => observer.observe(c));
}

/* ============ HERO SEARCH ============ */
function initHeroSearch() {
  const input = document.getElementById("heroSearch");
  const box = document.getElementById("searchSuggestions");
  if (!input || !box) return;

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 1) { box.classList.remove("show"); return; }
    const results = MEDBOOK_DATA.searchPool.filter((r) => r.text.toLowerCase().includes(q));
    if (!results.length) { box.classList.remove("show"); return; }
    box.innerHTML = results.slice(0, 6).map((r) => {
      if (r.type === "doctor") {
        return `<div class="suggestion-item">
          <span class="avatar-sm ${r.gradient}">${r.initials}</span>
          <div><strong>${r.text}</strong><br><small style="color:var(--text-muted)">Shifokor</small></div>
        </div>`;
      }
      return `<div class="suggestion-item">
        <span class="avatar-sm gradient-cyan"><i class="fa-solid ${r.icon}"></i></span>
        <div><strong>${r.text}</strong><br><small style="color:var(--text-muted)">${r.type === "symptom" ? "Simptom" : "Mutaxassislik"}</small></div>
      </div>`;
    }).join("");
    box.classList.add("show");

    box.querySelectorAll(".suggestion-item").forEach((item, i) => {
      item.addEventListener("click", () => {
        input.value = results[i].text;
        box.classList.remove("show");
        document.getElementById("searchBtn").click();
      });
    });
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !box.contains(e.target)) box.classList.remove("show");
  });
}

/* ============ DOCTORS GRID ============ */
function initDoctorsGrid() {
  renderDoctors(MEDBOOK_DATA.doctors);
  renderRecommendedDoctors();
}

function renderDoctors(list) {
  const grid = document.getElementById("doctorsGrid");
  if (!grid) return;
  const favorites = JSON.parse(localStorage.getItem("medbook_favorites") || "[]");

  if (!list.length) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px;">Shifokor topilmadi. Filtrlarni o'zgartiring.</p>`;
    return;
  }

  grid.innerHTML = list.map((d) => {
    const isFav = favorites.includes(d.id);
    return `
    <div class="doctor-card-lg" data-id="${d.id}">
      <div class="header">
        <span class="avatar-xl ${d.gradient}">${d.initials}</span>
        <div class="info" style="flex:1;">
          <h3>${d.name}</h3>
          <span class="spec">${d.specialty}</span>
        </div>
        <button class="fav-btn ${isFav ? "active" : ""}" data-fav="${d.id}">
          <i class="fa-${isFav ? "solid" : "regular"} fa-heart"></i>
        </button>
      </div>
      <div class="meta-grid">
        <span><i class="fa-solid fa-star"></i> ${d.rating} reyting</span>
        <span><i class="fa-solid fa-briefcase"></i> ${d.experience} yil</span>
        <span><i class="fa-solid fa-money-bill"></i> ${(d.price / 1000).toFixed(0)}k so'm</span>
        <span><i class="fa-solid fa-calendar"></i> ${d.availableToday ? "Bugun bo'sh" : "Ertaga"}</span>
      </div>
      <div class="actions">
        <button class="btn btn-primary" data-book="${d.id}">
          <i class="fa-solid fa-calendar-plus"></i> Band qilish
        </button>
        <button class="btn btn-ghost" data-profile="${d.id}">
          <i class="fa-solid fa-eye"></i> Profil
        </button>
      </div>
    </div>
  `;
  }).join("");

  grid.querySelectorAll("[data-fav]").forEach((btn) => {
    btn.addEventListener("click", () => toggleFavorite(+btn.dataset.fav, btn));
  });
  grid.querySelectorAll("[data-book]").forEach((btn) => {
    btn.addEventListener("click", () => openBooking(+btn.dataset.book));
  });
  // ✅ TO'G'RILANGAN PROFIL TUGMASI
  grid.querySelectorAll("[data-profile]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (typeof window.openDoctorProfile === "function") {
        window.openDoctorProfile(+btn.dataset.profile);
      } else {
        showToast("Profil yuklanmadi. Sahifani yangilang.", "warning");
      }
    });
  });
}

function renderRecommendedDoctors() {
  const grid = document.getElementById("recommendedDoctors");
  if (!grid) return;
  grid.innerHTML = MEDBOOK_DATA.doctors.slice(0, 4).map((d) => `
    <div class="doctor-card" data-profile="${d.id}">
      <div class="doctor-card-header">
        <span class="avatar ${d.gradient}">${d.initials}</span>
        <div>
          <h4>${d.name}</h4>
          <span class="specialty">${d.specialty}</span>
        </div>
      </div>
      <div class="doctor-meta">
        <span class="rating"><i class="fa-solid fa-star"></i>${d.rating}</span>
        <span>${d.experience} yil</span>
        <span>${(d.price / 1000).toFixed(0)}k</span>
      </div>
      <button class="btn btn-primary btn-book" data-book="${d.id}">
        <i class="fa-solid fa-calendar-plus"></i> <span>Band qilish</span>
      </button>
    </div>
  `).join("");

  grid.querySelectorAll("[data-book]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      openBooking(+el.dataset.book);
    });
  });

  grid.querySelectorAll(".doctor-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (typeof window.openDoctorProfile === "function") {
        window.openDoctorProfile(+card.dataset.profile);
      }
    });
  });
}

function toggleFavorite(id, btn) {
  const favs = JSON.parse(localStorage.getItem("medbook_favorites") || "[]");
  const idx = favs.indexOf(id);
  if (idx >= 0) {
    favs.splice(idx, 1);
    btn.classList.remove("active");
    btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    showToast("Sevimlilardan olib tashlandi", "info");
  } else {
    favs.push(id);
    btn.classList.add("active");
    btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    showToast("Sevimlilarga qo'shildi ❤️", "success");
  }
  localStorage.setItem("medbook_favorites", JSON.stringify(favs));
  renderFavorites();
}

/* ============ FILTERS ============ */
function initFilters() {
  const btn = document.getElementById("applyFilters");
  if (btn) btn.addEventListener("click", applyDoctorFilters);
}

function applyDoctorFilters() {
  const specialty = document.getElementById("filterSpecialty")?.value || "";
  const rating = parseFloat(document.getElementById("filterRating")?.value || 0);
  const price = parseFloat(document.getElementById("filterPrice")?.value || 0);
  const today = document.getElementById("filterToday")?.value || "all";
  const q = (document.getElementById("heroSearch")?.value || "").toLowerCase();

  let list = MEDBOOK_DATA.doctors.filter((d) => {
    if (specialty && d.specialty !== specialty) return false;
    if (rating && d.rating < rating) return false;
    if (price && d.price > price) return false;
    if (today === "yes" && !d.availableToday) return false;
    if (today === "no" && d.availableToday) return false;
    if (q && !d.name.toLowerCase().includes(q) && !d.specialty.toLowerCase().includes(q)) return false;
    return true;
  });

  renderDoctors(list);
}

/* ============ APPOINTMENTS ============ */
function initAppointments() {
  renderAppointments();
}

function renderAppointments() {
  const list = document.getElementById("appointmentList");
  const allList = document.getElementById("allAppointments");
  const stats = document.getElementById("statAppointments");

  const html = MEDBOOK_DATA.appointments.map((a) => `
    <div class="appointment-item">
      <span class="avatar ${a.gradient}">${a.initials}</span>
      <div class="appointment-info">
        <h4>${a.doctor}</h4>
        <span>${a.specialty} · ${a.date}</span>
      </div>
      <div class="appointment-time">
        <strong>${a.time}</strong>
        <span class="badge ${a.status}">${a.status === "confirmed" ? "Tasdiqlangan" : "Kutilmoqda"}</span>
      </div>
    </div>
  `).join("");

  if (list) list.innerHTML = html;
  if (allList) allList.innerHTML = html;
  if (stats) stats.textContent = MEDBOOK_DATA.appointments.length;
  if (document.getElementById("statTests")) document.getElementById("statTests").textContent = 5;
  if (document.getElementById("statPills")) document.getElementById("statPills").textContent = 3;
  if (document.getElementById("statBalance")) document.getElementById("statBalance").innerHTML = '245 000 <small>so\'m</small>';

  renderFavorites();
}

/* ============ FAVORITES ============ */
function renderFavorites() {
  const list = document.getElementById("favoritesList");
  if (!list) return;
  const favs = JSON.parse(localStorage.getItem("medbook_favorites") || "[]");
  if (!favs.length) {
    list.innerHTML = `<p style="color:var(--text-muted);padding:20px;">Sevimlilar yo'q. Shifokorlar bo'limidan ❤️ bosib qo'shing.</p>`;
    return;
  }
  const docs = MEDBOOK_DATA.doctors.filter((d) => favs.includes(d.id));
  list.innerHTML = docs.map((d) => `
    <div class="record-item">
      <span class="avatar ${d.gradient}">${d.initials}</span>
      <div class="record-info">
        <h5>${d.name}</h5>
        <span>${d.specialty} · ⭐ ${d.rating}</span>
      </div>
      <button class="btn btn-primary" data-book="${d.id}">
        <i class="fa-solid fa-calendar-plus"></i> Band qilish
      </button>
    </div>
  `).join("");

  list.querySelectorAll("[data-book]").forEach((btn) => {
    btn.addEventListener("click", () => openBooking(+btn.dataset.book));
  });
}

/* ============ DASHBOARD TABS ============ */
function initDashboardTabs() {
  document.querySelectorAll(".dash-link[data-tab]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = link.dataset.tab;
      document.querySelectorAll(".dash-link").forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      document.querySelectorAll(".dash-tab").forEach((t) => t.classList.remove("active"));
      const target = document.querySelector(`.dash-tab[data-tab="${tab}"]`);
      if (target) target.classList.add("active");
    });
  });

  document.querySelectorAll("[data-tab]:not(.dash-link)").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = link.dataset.tab;
      const tabLink = document.querySelector(`.dash-link[data-tab="${tab}"]`);
      if (tabLink) tabLink.click();
    });
  });

  const newBookingBtn = document.getElementById("newBookingBtn");
  if (newBookingBtn) {
    newBookingBtn.addEventListener("click", () => {
      document.getElementById("doctors").scrollIntoView({ behavior: "smooth" });
    });
  }

  renderPrescriptions();
  renderRecords();
}

function renderPrescriptions() {
  const list = document.getElementById("prescriptionsList");
  if (!list) return;
  const items = [
    { name: "Aspirin 100mg", doctor: "Dr. Dilshod Rahimov", duration: "30 kun" },
    { name: "Vitamin D3", doctor: "Dr. Malika Yusupova", duration: "60 kun" },
    { name: "Omeprazol 20mg", doctor: "Dr. Sardor Aliyev", duration: "14 kun" },
  ];
  list.innerHTML = items.map((p) => `
    <div class="prescription-item">
      <div class="prescription-icon"><i class="fa-solid fa-pills"></i></div>
      <div class="prescription-info">
        <h5>${p.name}</h5>
        <span>${p.doctor} · ${p.duration}</span>
      </div>
      <button class="btn btn-ghost" data-pdf>
        <i class="fa-solid fa-download"></i> PDF
      </button>
    </div>
  `).join("");

  list.querySelectorAll("[data-pdf]").forEach((btn) => {
    btn.addEventListener("click", () => showToast("PDF yuklanmoqda...", "info"));
  });
}

function renderRecords() {
  const list = document.getElementById("recordsList");
  if (!list) return;
  const items = [
    { name: "Umumiy qon tahlili", date: "10.01.2025", status: "Yaxshi" },
    { name: "Bioximik tahlil", date: "08.01.2025", status: "Normada" },
    { name: "EKG", date: "05.01.2025", status: "Yaxshi" },
    { name: "UZI", date: "28.12.2024", status: "Normada" },
    { name: "Rentgen", date: "20.12.2024", status: "Yaxshi" },
  ];
  list.innerHTML = items.map((r) => `
    <div class="record-item">
      <div class="record-icon"><i class="fa-solid fa-file-waveform"></i></div>
      <div class="record-info">
        <h5>${r.name}</h5>
        <span>${r.date} · ${r.status}</span>
      </div>
      <button class="btn btn-ghost" data-pdf>
        <i class="fa-solid fa-download"></i>
      </button>
    </div>
  `).join("");

  list.querySelectorAll("[data-pdf]").forEach((btn) => {
    btn.addEventListener("click", () => showToast("PDF yuklanmoqda...", "info"));
  });
}

/* ============ WALLET ============ */
function initWalletButtons() {
  const topup = document.getElementById("topupBtn");
  const history = document.getElementById("historyBtn");
  if (topup) topup.addEventListener("click", () => showToast("To'lov tizimiga o'tilmoqda...", "info"));
  if (history) history.addEventListener("click", () => showToast("Tranzaksiyalar tarixi", "info"));
}

/* ============ SCHEDULE ============ */
function initSchedule() {
  const container = document.getElementById("timeSlots");
  const currentDateEl = document.getElementById("currentDate");
  if (!container || !currentDateEl) return;

  let currentDate = new Date();
  let slots = MEDBOOK_DATA.timeSlots.map((s) => ({ ...s }));

  const formatDate = (d) => {
    const months = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
    const weekdays = ["Yak","Dush","Sesh","Chor","Pay","Jum","Shan"];
    return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()} — ${weekdays[d.getDay()]}`;
  };

  const render = () => {
    currentDateEl.textContent = formatDate(currentDate);
    container.innerHTML = slots.map((s, i) => `
      <div class="slot ${s.status}" data-index="${i}">${s.time}</div>
    `).join("");

    container.querySelectorAll(".slot").forEach((el) => {
      el.addEventListener("click", () => {
        const idx = +el.dataset.index;
        const slot = slots[idx];
        if (slot.status === "booked") { showToast("Bu vaqt band", "warning"); return; }
        if (slot.status === "break") { showToast("Tanaffus", "warning"); return; }
        slot.status = slot.status === "selected" ? "available" : "selected";
        render();
      });
    });
  };

  render();

  document.getElementById("prevDay")?.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1);
    render();
  });
  document.getElementById("nextDay")?.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 1);
    render();
  });
  document.getElementById("closeAllSlots")?.addEventListener("click", () => {
    slots = slots.map((s) => (s.status === "available" || s.status === "selected") ? { ...s, status: "break" } : s);
    render();
    showToast("Barcha bo'sh vaqtlar yopildi", "info");
  });
  document.getElementById("saveSchedule")?.addEventListener("click", () => {
    const sel = slots.filter((s) => s.status === "selected").length;
    showToast(`Jadval saqlandi. Tanlangan: ${sel} ta slot.`, "success");
  });
}

/* ============ CHAT ============ */
function initChat() {
  const convList = document.getElementById("conversationList");
  const messagesEl = document.getElementById("chatMessages");
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const activeName = document.getElementById("activeChatName");
  const activeAvatar = document.getElementById("activeChatAvatar");
  if (!convList || !messagesEl) return;

  let activeConv = 1;

  const renderConversations = () => {
    convList.innerHTML = MEDBOOK_DATA.conversations.map((c) => `
      <div class="conversation ${c.id === activeConv ? "active" : ""}" data-id="${c.id}">
        <span class="avatar ${c.gradient}">${c.initials}</span>
        <div class="conversation-info">
          <h5>${c.name}</h5>
          <p>${c.lastMessage}</p>
        </div>
        <div class="conversation-meta">
          <span>${c.time}</span>
          ${c.unread > 0 ? `<span class="unread-badge">${c.unread}</span>` : ""}
        </div>
      </div>
    `).join("");

    convList.querySelectorAll(".conversation").forEach((el) => {
      el.addEventListener("click", () => {
        activeConv = +el.dataset.id;
        const conv = MEDBOOK_DATA.conversations.find((c) => c.id === activeConv);
        if (activeName) activeName.textContent = conv.name;
        if (activeAvatar) {
          activeAvatar.textContent = conv.initials;
          activeAvatar.className = `avatar ${conv.gradient}`;
        }
        renderConversations();
        renderMessages();
      });
    });
  };

  const renderMessages = () => {
    const msgs = MEDBOOK_DATA.messages.filter((m) => m.conversationId === activeConv);
    messagesEl.innerHTML = msgs.map((m) => `
      <div class="message ${m.sender === "patient" ? "outgoing" : "incoming"}">
        <div class="message-bubble">${m.text}</div>
        <span class="message-time">${m.time}</span>
      </div>
    `).join("");
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    MEDBOOK_DATA.messages.push({ id: Date.now(), conversationId: activeConv, text, sender: "patient", time });
    input.value = "";
    renderMessages();

    setTimeout(() => {
      const typing = document.createElement("div");
      typing.className = "typing-indicator";
      typing.innerHTML = "<span></span><span></span><span></span>";
      messagesEl.appendChild(typing);
      messagesEl.scrollTop = messagesEl.scrollHeight;

      setTimeout(() => {
        typing.remove();
        const replies = ["Tushundim, rahmat!", "Yaxshi, tahlil natijalarini kutaman.", "Albatta, yordam beraman.", "Qabulga yozib qo'ydim."];
        MEDBOOK_DATA.messages.push({
          id: Date.now(),
          conversationId: activeConv,
          text: replies[Math.floor(Math.random() * replies.length)],
          sender: "doctor",
          time,
        });
        renderMessages();
      }, 1500);
    }, 600);
  };

  sendBtn?.addEventListener("click", sendMessage);
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); sendMessage(); }
  });

  document.getElementById("newChatBtn")?.addEventListener("click", () => showToast("Yangi chat", "info"));
  document.getElementById("attachBtn")?.addEventListener("click", () => showToast("Fayl biriktirish", "info"));
  document.getElementById("emojiBtn")?.addEventListener("click", () => showToast("Emoji", "info"));
  document.getElementById("videoCallBtn")?.addEventListener("click", () => openFeature("tele"));
  document.getElementById("phoneCallBtn")?.addEventListener("click", () => showToast("Qo'ng'iroq...", "info"));
  document.getElementById("chatInfoBtn")?.addEventListener("click", () => showToast("Chat ma'lumotlari", "info"));

  renderConversations();
  renderMessages();
}

/* ============ RIPPLE ============ */
function initRipple() {
  document.addEventListener("click", (e) => {
    const target = e.target.closest(".btn");
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const circle = document.createElement("span");
    circle.className = "ripple-effect";
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = size + "px";
    circle.style.left = e.clientX - rect.left - size / 2 + "px";
    circle.style.top = e.clientY - rect.top - size / 2 + "px";
    target.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  });
}

/* ============ NAV HIGHLIGHT ============ */
function initNavHighlight() {
  const sections = ["home", "features", "doctors", "dashboard", "chat", "tools"];
  const navLinks = document.querySelectorAll(".nav-link");
  window.addEventListener("scroll", () => {
    let current = "home";
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (window.scrollY >= el.offsetTop - 150) current = id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  });
} 