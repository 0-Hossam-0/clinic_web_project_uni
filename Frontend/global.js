const BASE_URL = "http://127.0.0.1:5000";

if (document.getElementById("appointments-list")) {
  document.getElementById("appointments-list").style.display = "none";
}

// ===== MODAL FUNCTIONS =====
function openModal(key) {
  const data = servicesData[key];
  document.getElementById("modal-icon").textContent = data.icon;
  document.getElementById("modal-title").textContent = data.title;
  document.getElementById("modal-desc").textContent = data.desc;
  const list = document.getElementById("modal-list");
  list.innerHTML = "";
  data.points.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    list.appendChild(li);
  });
  document.getElementById("service-modal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModalBtn() {
  document.getElementById("service-modal").classList.remove("active");
  document.body.style.overflow = "";
}

function closeModal(event) {
  if (event.target.id === "service-modal") {
    closeModalBtn();
  }
}

// ===== APPOINTMENT FUNCTIONS =====
async function addAppointment() {
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let department = document.getElementById("department").value;
  let date = document.getElementById("date").value;
  let time = document.getElementById("time").value;

  if (name === "" || phone === "" || department === "" || date === "" || time === "") {
    alert("⚠️ من فضلك املأ جميع الحقول!");
    return;
  }

  let newAppointment = {
    id: Date.now(),
    name: name,
    phone: phone.trim(),
    department: department,
    date: date,
    time: time,
  };

  await fetch(`${BASE_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAppointment),
  });
  alert("✅ تم الحجز بنجاح! اضغط على 'عرض حجوزاتي' لرؤيتها.");
  clearInputs();
}

function clearInputs() {
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("date").value = "";
  document.getElementById("time").value = "";
}

async function deleteAppointment(id, phone) {
  if (confirm("هل تريد حذف هذا الموعد فعلاً؟")) {
    await fetch(`${BASE_URL}/appointments/` + id, { method: "DELETE" });
    alert("تم الحذف بنجاح");
    showMyHistory(phone);
  }
}

async function editAppointment(id, name, phone, department, date, time) {
  let newName = prompt("اسم المريض:", name);
  let newPhone = prompt("رقم الهاتف:", phone);
  let newDepartment = prompt("القسم:", department);
  let newDate = prompt("التاريخ (YYYY-MM-DD):", date);
  let newTime = prompt("الوقت:", time);

  if (!newName || !newPhone || !newDate || !newTime) {
    alert("❌ تم إلغاء التعديل");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/appointments/` + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        phone: newPhone,
        department: newDepartment,
        date: newDate ? new Date(newDate).toISOString().split("T")[0] : null,
        time: newTime,
      }),
    });

    alert("✅ تم التعديل بنجاح!");
    showMyHistory(newPhone);
  } catch (err) {
    alert("❌ حصل خطأ: " + err.message);
    console.error(err);
  }
}

async function showMyHistory(searchPhone = null) {
  if (!searchPhone) {
    searchPhone = prompt("أدخل رقم الموبايل الذي حجزت به:");
  }
  if (!searchPhone) return;

  try {
    const response = await fetch(`${BASE_URL}/appointments/phone/${searchPhone}`);
    const userAppointments = await response.json();

    let tableBody = document.getElementById("table-body");
    let tableSection = document.getElementById("appointments-list");
    tableBody.innerHTML = "";

    if (userAppointments.length > 0) {
      tableSection.style.display = "block";
      userAppointments.forEach((app, index) => {
        let newRow = document.createElement("tr");
        newRow.innerHTML = `
          <td>${index + 1}</td>
          <td>${app.name}</td>
          <td>${app.phone}</td>
          <td>${app.department || "-"}</td>
          <td>${app.date}</td>
          <td>${app.time}</td>
          <td><button class="btn-delete" onclick="deleteAppointment(${app.id}, '${app.phone}')">🗑️ حذف</button></td>
          <td><button class="btn-update" onclick="editAppointment(${app.id}, '${app.name}', '${app.phone}','${app.department}', '${app.date}' , '${app.time}')">✏️ تعديل</button></td>
        `;
        tableBody.appendChild(newRow);
      });
      tableSection.scrollIntoView({ behavior: "smooth" });
      document.getElementById("no-appointments").style.display = "none";
    } else {
      alert("للأسف، مفيش أي حجز مسجل برقم: " + searchPhone);
      tableSection.style.display = "none";
    }
  } catch (err) {
    alert("❌ حصل خطأ عند جلب البيانات: " + err.message);
    console.error(err);
  }
}
