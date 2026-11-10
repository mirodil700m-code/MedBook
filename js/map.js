/* ============================================================
   MedBook — Map & Clinics
   ============================================================ */

const CLINICS = [
  { name: "MedBook Central", address: "Toshkent, Amir Temur 108", distance: "1.2 km" },
  { name: "Shifo Klinikasi", address: "Toshkent, Chilonzor 5", distance: "2.8 km" },
  { name: "Doctor D", address: "Toshkent, Yunusobod 12", distance: "4.5 km" },
  { name: "Akfa Medline", address: "Toshkent, Yashnobod 3", distance: "6.1 km" },
  { name: "Horev Medical", address: "Toshkent, Mirzo Ulug'bek 7", distance: "8.3 km" },
];

function openMap() {
  const list = document.getElementById("clinicsList");
  if (list) {
    list.innerHTML = CLINICS.map(
      (c) => `
      <div class="clinic-item" onclick="showToast('${c.name} — marshrut qurilmoqda...','info')">
        <h5>${c.name}</h5>
        <p><i class="fa-solid fa-location-dot"></i> ${c.address}</p>
        <span class="distance"><i class="fa-solid fa-route"></i> ${c.distance}</span>
      </div>
    `
    ).join("");
  }
  openModal("mapModal");
}