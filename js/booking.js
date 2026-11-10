/* ============================================================
   MedBook — Booking System
   ============================================================ */

function openBooking(doctorId) {
  const doctor = MEDBOOK_DATA.doctors.find((d) => d.id == doctorId);
  if (!doctor) return;

  const content = document.getElementById("bookingContent");
  const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"];
  const booked = ["09:30", "11:00"];

  content.innerHTML = `
    <h2><i class="fa-solid fa-calendar-plus" style="color:var(--emerald)"></i> Qabulga yozilish</h2>
    <div class="booking-doctor">
      <span class="avatar-xl ${doctor.gradient}">${doctor.initials}</span>
      <div>
        <h3>${doctor.name}</h3>
        <span class="spec" style="color:var(--emerald)">${doctor.specialty}</span>
      </div>
    </div>
    <p style="color:var(--text-muted);font-size:0.9rem;">Bo'sh vaqtni tanlang:</p>
    <div class="booking-slots" id="bookingSlots">
      ${times
        .map((t) => {
          const isBooked = booked.includes(t);
          return `<div class="booking-slot ${isBooked ? "disabled" : ""}" data-time="${t}">${t}</div>`;
        })
        .join("")}
    </div>
    <button class="btn btn-primary btn-block" id="confirmBooking" style="margin-top:16px;">
      <i class="fa-solid fa-check"></i> Tasdiqlash
    </button>
  `;

  openModal("bookingModal");

  let selectedTime = null;
  content.querySelectorAll(".booking-slot").forEach((el) => {
    el.addEventListener("click", () => {
      if (el.classList.contains("disabled")) return;
      content.querySelectorAll(".booking-slot").forEach((s) => s.classList.remove("selected"));
      el.classList.add("selected");
      selectedTime = el.dataset.time;
    });
  });

  document.getElementById("confirmBooking").addEventListener("click", () => {
    if (!selectedTime) {
      showToast("Vaqtni tanlang", "warning");
      return;
    }
    closeModal("bookingModal");
    showToast(`${doctor.name} — ${selectedTime} ga yozildingiz! ✅`, "success");

    // Add to appointments
    const user = getCurrentUser();
    if (user) {
      const date = new Date();
      const dateStr = `${date.getDate()}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
      MEDBOOK_DATA.appointments.push({
        id: Date.now(),
        doctor: doctor.name,
        specialty: doctor.specialty,
        date: dateStr,
        time: selectedTime,
        status: "pending",
        initials: doctor.initials,
        gradient: doctor.gradient,
      });
      renderAppointments();
    }
  });
}