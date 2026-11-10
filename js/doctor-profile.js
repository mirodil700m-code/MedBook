/* ============================================================
   MedBook — Doctor Profile Modal (to'liq)
   Fayl: js/doctor-profile.js
   ============================================================ */

const DOCTOR_PROFILES = {
  1: {
    about: "12 yillik tajribaga ega kardiolog. Yurak-qon tomir kasalliklari, gipertoniya va infarktdan keyingi reabilitatsiya bo'yicha mutaxassis. 3000+ muvaffaqiyatli davolash.",
    languages: ["O'zbek", "Rus", "Ingliz"],
    education: "Toshkent Tibbiyot Akademiyasi (2013)",
    certificates: [
      { name: "Kardiologiya sertifikati", year: "2020" },
      { name: "EKG mutaxassisi", year: "2019" },
      { name: "Reanimatologiya", year: "2018" },
      { name: "Yevropa Kardiologiya Jamiyati", year: "2021" },
    ],
    reviews: [
      { name: "Zulfiya A.", rating: 5, date: "2 kun oldin", text: "Juda yaxshi shifokor! Har bir tahlilni batafsil tushuntirdi.", initials: "ZA", gradient: "gradient-emerald" },
      { name: "Bekzod M.", rating: 5, date: "1 hafta oldin", text: "Tez va aniq tashxis. Davolash natijasi juda yaxshi.", initials: "BM", gradient: "gradient-cyan" },
      { name: "Dilnoza K.", rating: 4, date: "2 hafta oldin", text: "Professional yondashuv. Faqat navbat biroz uzoq.", initials: "DK", gradient: "gradient-violet" },
    ],
    videoIntro: true,
    stats: { patients: 3200, operations: 450, experience: 12 },
  },
  2: {
    about: "9 yillik tajribaga ega neyrolog. Bosh og'rig'i, migren, uyqu buzilishi va asab tizimi kasalliklari bo'yicha mutaxassis.",
    languages: ["O'zbek", "Rus"],
    education: "Toshkent Tibbiyot Akademiyasi (2016)",
    certificates: [
      { name: "Neyrologiya sertifikati", year: "2021" },
      { name: "EEG mutaxassisi", year: "2020" },
      { name: "Migren davolash", year: "2022" },
    ],
    reviews: [
      { name: "Gulnora S.", rating: 5, date: "3 kun oldin", text: "Migrenimni butunlay davoladi! Katta rahmat.", initials: "GS", gradient: "gradient-amber" },
      { name: "Rustam T.", rating: 5, date: "5 kun oldin", text: "Juda e'tiborli va bilimli shifokor.", initials: "RT", gradient: "gradient-cyan" },
    ],
    videoIntro: true,
    stats: { patients: 2400, operations: 120, experience: 9 },
  },
};

function getDefaultProfile(doctor) {
  return {
    about: `${doctor.experience} yillik tajribaga ega ${doctor.specialty.toLowerCase()}. Malakali mutaxassis, ${doctor.rating} reytingga ega.`,
    languages: ["O'zbek", "Rus"],
    education: "Toshkent Tibbiyot Akademiyasi",
    certificates: [
      { name: `${doctor.specialty} sertifikati`, year: "2022" },
      { name: "Umumiy amaliyot", year: "2020" },
    ],
    reviews: [
      { name: "Anonim bemor", rating: 5, date: "1 hafta oldin", text: "Yaxshi shifokor, tavsiya qilaman.", initials: "AB", gradient: "gradient-emerald" },
    ],
    videoIntro: true,
    stats: { patients: doctor.experience * 200, operations: 50, experience: doctor.experience },
  };
}

function openDoctorProfile(doctorId) {
  const doctor = MEDBOOK_DATA.doctors.find((d) => d.id == doctorId);
  if (!doctor) return;

  const profile = DOCTOR_PROFILES[doctorId] || getDefaultProfile(doctor);
  const content = document.getElementById("doctorProfileContent");
  if (!content) return;

  const stars = "★".repeat(Math.round(doctor.rating)) + "☆".repeat(5 - Math.round(doctor.rating));
  const favorites = JSON.parse(localStorage.getItem("medbook_favorites") || "[]");
  const isFav = favorites.includes(doctor.id);

  content.innerHTML = `
    <div class="profile-hero">
      <div class="profile-header">
        <div class="profile-avatar ${doctor.gradient}">${doctor.initials}</div>
        <div class="profile-info">
          <h2>${doctor.name}</h2>
          <div class="profile-specialty">${doctor.specialty}</div>
          <div class="profile-rating">
            <span><span class="stars">${stars}</span> ${doctor.rating}</span>
            <span><i class="fa-solid fa-briefcase"></i> ${doctor.experience} yil</span>
            <span><i class="fa-solid fa-money-bill"></i> ${(doctor.price / 1000).toFixed(0)}k so'm</span>
            ${doctor.availableToday ? '<span style="color:var(--emerald);"><i class="fa-solid fa-circle"></i> Bugun bo\'sh</span>' : ''}
          </div>
        </div>
        <button class="fav-btn ${isFav ? "active" : ""}" data-fav="${doctor.id}" style="width:44px;height:44px;">
          <i class="fa-${isFav ? "solid" : "regular"} fa-heart"></i>
        </button>
      </div>
    </div>
    <div class="profile-body">
      <div class="profile-tabs">
        <button class="profile-tab active" data-ptab="about"><i class="fa-solid fa-user"></i> Haqida</button>
        <button class="profile-tab" data-ptab="schedule"><i class="fa-solid fa-calendar"></i> Taqvim</button>
        <button class="profile-tab" data-ptab="certs"><i class="fa-solid fa-certificate"></i> Sertifikatlar</button>
        <button class="profile-tab" data-ptab="reviews"><i class="fa-solid fa-star"></i> Sharhlar (${profile.reviews.length})</button>
      </div>

      <div class="profile-tab-content active" data-ptab="about">
        <div class="profile-stats">
          <div class="profile-stat">
            <div class="profile-stat-value">${profile.stats.patients.toLocaleString()}+</div>
            <div class="profile-stat-label">Bemorlar</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-value">${profile.stats.operations}</div>
            <div class="profile-stat-label">Amaliyotlar</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-value">${profile.stats.experience}</div>
            <div class="profile-stat-label">Yillik tajriba</div>
          </div>
        </div>
        ${profile.videoIntro ? `
          <div class="profile-video" id="videoIntro">
            <div class="play-btn"><i class="fa-solid fa-play"></i></div>
            <div class="profile-video-label"><i class="fa-solid fa-video"></i> Video tanishuv (1:24)</div>
          </div>
        ` : ""}
        <h4 style="margin-bottom:8px;font-family:var(--font-display);">Tavsif</h4>
        <p class="profile-about">${profile.about}</p>
                <!-- JONLI NAVBAT QO'SHILDI -->
        <div class="live-queue">
          <div class="queue-header">
            <span class="dot online" style="background:var(--emerald); animation:pulse 2s infinite;"></span>
            <h4>Jonli navbat</h4>
          </div>
          <div class="queue-body">
            <div class="queue-stat">
              <span>Hozir navbatda:</span>
              <strong>3 kishi</strong>
            </div>
            <div class="queue-stat">
              <span>Taxminiy kutish:</span>
              <strong>~20 daqiqa</strong>
            </div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px;">
          <div>
            <h4 style="font-size:0.82rem;color:var(--text-muted);margin-bottom:6px;">Ta'lim</h4>
            <p style="font-size:0.85rem;">${profile.education}</p>
          </div>
          <div>
            <h4 style="font-size:0.82rem;color:var(--text-muted);margin-bottom:6px;">Tillar</h4>
            <p style="font-size:0.85rem;">${profile.languages.join(", ")}</p>
          </div>
        </div>
      </div>

      <div class="profile-tab-content" data-ptab="schedule">
        <h4 style="margin-bottom:12px;font-family:var(--font-display);">Bo'sh vaqtlar</h4>
        <div class="profile-schedule-days" id="profileDays"></div>
        <div class="profile-schedule" id="profileSlots"></div>
      </div>

      <div class="profile-tab-content" data-ptab="certs">
        <h4 style="margin-bottom:12px;font-family:var(--font-display);">Sertifikatlar va litsenziyalar</h4>
        <div class="certificates-grid">
          ${profile.certificates.map((c) => `
            <div class="cert-card">
              <i class="fa-solid fa-award"></i>
              <h5>${c.name}</h5>
              <span>${c.year}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="profile-tab-content" data-ptab="reviews">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
          <div style="font-size:2.4rem;font-family:var(--font-display);font-weight:800;color:var(--emerald);">${doctor.rating}</div>
          <div>
            <div style="color:var(--amber);font-size:1.1rem;">${stars}</div>
            <div style="font-size:0.8rem;color:var(--text-muted);">${profile.reviews.length} sharh asosida</div>
          </div>
        </div>
        ${profile.reviews.map((r) => `
          <div class="review-item">
            <div class="review-header">
              <span class="review-avatar ${r.gradient}">${r.initials}</span>
              <div class="review-meta">
                <h5>${r.name}</h5>
                <span>${r.date}</span>
              </div>
              <div class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
            </div>
            <p class="review-text">${r.text}</p>
          </div>
        `).join("")}
      </div>

      <div class="profile-actions">
        <button class="btn btn-primary" data-book-profile="${doctor.id}">
          <i class="fa-solid fa-calendar-plus"></i> Band qilish
        </button>
        <button class="btn btn-ghost" data-chat-profile="${doctor.id}">
          <i class="fa-solid fa-message"></i> Xabar yozish
        </button>
      </div>
    </div>
  `;

  content.querySelectorAll(".profile-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      content.querySelectorAll(".profile-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      content.querySelectorAll(".profile-tab-content").forEach((c) => c.classList.remove("active"));
      const target = content.querySelector(`.profile-tab-content[data-ptab="${tab.dataset.ptab}"]`);
      if (target) target.classList.add("active");
    });
  });

  content.querySelector("[data-fav]")?.addEventListener("click", (e) => {
    toggleFavorite(doctor.id, e.currentTarget);
  });

  content.querySelector("#videoIntro")?.addEventListener("click", () => {
    showToast("Video yuklanmoqda...", "info");
  });

  content.querySelector("[data-book-profile]")?.addEventListener("click", () => {
    closeModal("doctorProfileModal");
    openBooking(doctor.id);
  });

  content.querySelector("[data-chat-profile]")?.addEventListener("click", () => {
    closeModal("doctorProfileModal");
    document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" });
    showToast(`${doctor.name} bilan chat`, "info");
  });

  renderProfileSchedule(doctor);

  openModal("doctorProfileModal");
}

function renderProfileSchedule(doctor) {
  const daysEl = document.getElementById("profileDays");
  const slotsEl = document.getElementById("profileSlots");
  if (!daysEl || !slotsEl) return;

  const today = new Date();
  const weekdays = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }

  const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"];
  const bookedMap = {
    0: ["09:30", "11:00", "14:30"],
    1: ["10:00", "15:00"],
    2: ["09:00", "11:30"],
  };

  const renderSlots = (dayIndex) => {
    const booked = bookedMap[dayIndex] || [];
    slotsEl.innerHTML = times.map((t) => {
      const isBooked = booked.includes(t);
      return `<div class="profile-slot ${isBooked ? "booked" : "available"}" data-time="${t}">${t}</div>`;
    }).join("");

    slotsEl.querySelectorAll(".profile-slot.available").forEach((el) => {
      el.addEventListener("click", () => {
        slotsEl.querySelectorAll(".profile-slot").forEach((s) => s.classList.remove("selected"));
        el.classList.add("selected");
        showToast(`${el.dataset.time} tanlandi`, "info");
      });
    });
  };

  daysEl.innerHTML = days.map((d, i) => {
    const label = i === 0 ? "Bugun" : i === 1 ? "Ertaga" : weekdays[d.getDay()];
    return `<div class="schedule-day ${i === 0 ? "active" : ""}" data-day="${i}">
      <div style="font-size:0.68rem;opacity:0.7;">${label}</div>
      <div>${d.getDate()}.${String(d.getMonth() + 1).padStart(2, "0")}</div>
    </div>`;
  }).join("");

  daysEl.querySelectorAll(".schedule-day").forEach((el) => {
    el.addEventListener("click", () => {
      daysEl.querySelectorAll(".schedule-day").forEach((d) => d.classList.remove("active"));
      el.classList.add("active");
      renderSlots(+el.dataset.day);
    });
  });

  renderSlots(0);
}

window.openDoctorProfile = openDoctorProfile;