/* ============================================================
   MedBook — Tools (Kalkulyator & Ovozli qidiruv)
   Fayl: js/tools.js
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. BMI (Tana vazni indeksi) Kalkulyatori
  const calcBmiBtn = document.getElementById("calcBmiBtn");
  if (calcBmiBtn) {
    calcBmiBtn.addEventListener("click", () => {
      const w = parseFloat(document.getElementById("bmiWeight").value);
      const h = parseFloat(document.getElementById("bmiHeight").value) / 100; // metrga o'tkazish
      
      if (!w || !h) {
        showToast("Iltimos, vazn va bo'yni kiriting", "warning");
        return;
      }
      
      const bmi = (w / (h * h)).toFixed(1);
      let status = "";
      let color = "";
      
      if (bmi < 18.5) { status = "Kam vazn"; color = "var(--amber)"; }
      else if (bmi < 25) { status = "Normal"; color = "var(--emerald)"; }
      else if (bmi < 30) { status = "Ortiqcha vazn"; color = "var(--amber)"; }
      else { status = "Semizlik"; color = "var(--rose)"; }

      const res = document.getElementById("bmiResult");
      res.classList.add("show");
      res.innerHTML = `<span>Sizning BMI: </span><strong style="color:${color}">${bmi} (${status})</strong>`;
    });
  }

  // 2. Suv Kalkulyatori
  const calcWaterBtn = document.getElementById("calcWaterBtn");
  if (calcWaterBtn) {
    calcWaterBtn.addEventListener("click", () => {
      const w = parseFloat(document.getElementById("waterWeight").value);
      
      if (!w) {
        showToast("Iltimos, vaznni kiriting", "warning");
        return;
      }
      
      // O'rtacha 1 kg vaznga 30 ml suv
      const water = (w * 30) / 1000;
      const res = document.getElementById("waterResult");
      res.classList.add("show");
      res.innerHTML = `<span>Kunlik suv normasi: </span><strong style="color:var(--cyan)">${water.toFixed(1)} litr</strong>`;
    });
  }
});
  // 4. Bildirishnomalar Markazi
  const notifBtn = document.getElementById("notifBtn");
  const notifDropdown = document.getElementById("notifDropdown");
  
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Boshqa joyga bosilganda yopilib ketmasligi uchun
      notifDropdown.classList.toggle("show");
    });

    // Ekranning boshqa joyi bosilganda oynani yopish
    document.addEventListener("click", (e) => {
      if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
        notifDropdown.classList.remove("show");
      }
        // Qidiruv tugmasini to'g'ridan-to'g'ri ulash (kafolatlangan ishlaydi)
  const mainSearchBtn = document.getElementById("searchBtn");
  const mainSearchInput = document.getElementById("heroSearch");

  if (mainSearchBtn && mainSearchInput) {
    mainSearchBtn.addEventListener("click", () => {
      const q = mainSearchInput.value.trim().toLowerCase();
      if (typeof MEDBOOK_DATA !== 'undefined') {
        let list = MEDBOOK_DATA.doctors.filter((d) => {
          return d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q);
        });
        
        if (typeof renderDoctors === "function") {
          renderDoctors(list);
        }
        
        if (q) {
          showToast(`"${q}" bo'yicha qidirilmoqda...`, "info");
        }
        
        document.getElementById("doctors").scrollIntoView({ behavior: "smooth" });
      }
    });
  }
    });
  }
  