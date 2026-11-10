/* ============================================================
   MedBook — AI Symptom Checker
   ============================================================ */

const SYMPTOM_MAP = {
  bosh: { specialty: "Neyrolog", advice: "Bosh og'rig'i ko'pincha stress yoki charchoqdan. Neyrologga uchrashni tavsiya qilamiz." },
  isitma: { specialty: "Terapevt", advice: "Isitma — infeksiya belgisi. Terapevtga murojaat qiling." },
  "yo'tal": { specialty: "Terapevt", advice: "Yo'tal nafas yo'llari kasalligini ko'rsatishi mumkin." },
  qorin: { specialty: "Terapevt", advice: "Qorin og'rig'i jiddiy bo'lishi mumkin. Terapevtga zudlik bilan boring." },
  yurak: { specialty: "Kardiolog", advice: "Yurak sohasidagi og'riq — kardiologga murojaat qiling." },
  "ko'z": { specialty: "Oftalmolog", advice: "Ko'z muammolari — oftalmologga boring." },
  teri: { specialty: "Dermatolog", advice: "Teri toshmasi — dermatologga uchrashing." },
  bola: { specialty: "Pediatr", advice: "Bolalar salomatligi — pediatrga murojaat qiling." },
  hol: { specialty: "Terapevt", advice: "Holsizlik — umumiy tekshiruvdan o'ting." },
};

function addSymptom(text) {
  const input = document.getElementById("aiInput");
  input.value = input.value ? input.value + ", " + text : text;
  input.focus();
}

function analyzeSymptoms() {
  const input = document.getElementById("aiInput").value.toLowerCase().trim();
  const resultBox = document.getElementById("aiResult");

  if (!input) {
    showToast("Iltimos, shikoyatlaringizni yozing", "warning");
    return;
  }

  resultBox.innerHTML = `<p><i class="fa-solid fa-spinner fa-spin"></i> AI tahlil qilmoqda...</p>`;
  resultBox.classList.add("show");

  setTimeout(() => {
    let specialty = "Terapevt";
    let advice = "Umumiy tekshiruv uchun terapevtga murojaat qiling.";

    for (const [key, val] of Object.entries(SYMPTOM_MAP)) {
      if (input.includes(key)) {
        specialty = val.specialty;
        advice = val.advice;
        break;
      }
    }

    resultBox.innerHTML = `
      <h4><i class="fa-solid fa-circle-check"></i> Tavsiya</h4>
      <p>${advice}</p>
      <div class="recommendation">
        <strong>Mutaxassislik:</strong> ${specialty}<br>
        <strong>Uchrashuv:</strong> ${specialty} shifokoriga yozilishni tavsiya qilamiz
      </div>
      <button class="btn btn-primary btn-block" style="margin-top:16px;" data-specialty="${specialty}">
        <i class="fa-solid fa-user-doctor"></i> ${specialty} shifokorini topish
      </button>
    `;

    resultBox.querySelector("button").addEventListener("click", () => {
      closeModal("aiModal");
      scrollToDoctor(specialty);
    });
  }, 1200);
}

function scrollToDoctor(specialty) {
  const select = document.getElementById("filterSpecialty");
  if (select) select.value = specialty;
  applyDoctorFilters();
  document.getElementById("doctors").scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("aiAnalyze");
  if (btn) btn.addEventListener("click", analyzeSymptoms);

  document.querySelectorAll(".chip[data-symptom]").forEach((chip) => {
    chip.addEventListener("click", () => addSymptom(chip.dataset.symptom));
  });
});