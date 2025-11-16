document.addEventListener('DOMContentLoaded', function(){
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav ul');
  if(menuToggle) menuToggle.addEventListener('click', ()=> navMenu.classList.toggle('show'));
});
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let current = 0;

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
  }

  document.querySelector(".next").addEventListener("click", () => {
    current = (current + 1) % slides.length;
    showSlide(current);
  });

  document.querySelector(".prev").addEventListener("click", () => {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  });

  // Auto slide 5s/lần
  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 5000);
});

/* ===== 🌿 Flora Shop Auth Logic ===== */

/* ---------- Hàm đọc / ghi user ---------- */
function readUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

/* ---------- Đăng nhập ---------- */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const u = document.getElementById("username").value.trim();
    const p = document.getElementById("password").value.trim();

    if (!u || !p) return alert("Vui lòng nhập đầy đủ thông tin!");

    const users = readUsers();
    const found = users.find((x) => x.username === u && x.password === p);
    if (!found) return alert("Sai tài khoản hoặc mật khẩu!");

    localStorage.setItem("currentUser", JSON.stringify(found));
    if (found.role === "admin") {
      localStorage.setItem("isAdmin", "true");
      location.href = "admin/dashboard.html";
    } else {
      localStorage.removeItem("isAdmin");
      location.href = "index.html";
    }
  });
}

const regForm = document.getElementById("regForm");
if (regForm) {
  regForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Lấy dữ liệu từ form
    const fullName = document.getElementById("rname").value.trim();
    const username = document.getElementById("ruser").value.trim();
    const password = document.getElementById("rpass").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const address = document.getElementById("regAddress").value.trim();

    // ⚠️ Kiểm tra không để trống
    if (!fullName || !username || !password || !email || !address) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // ⚠️ Họ tên chỉ gồm chữ và khoảng trắng
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
    if (!nameRegex.test(fullName)) {
      alert("Họ tên chỉ được chứa chữ cái và khoảng trắng!");
      return;
    }

    // ⚠️ Username: phải có cả chữ và số, không ký tự lạ
    const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
    if (!usernameRegex.test(username)) {
      alert("Tên đăng nhập phải có cả chữ và số, và không chứa ký tự đặc biệt!");
      return;
    }

    // Đọc users từ localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // ⚠️ Kiểm tra trùng username
    if (users.some(u => u.username.trim() === username)) {
      alert("Tên đăng nhập đã tồn tại!");
      return;
    }

    // Tạo id duy nhất
    const id = "u_" + Math.random().toString(36).slice(2, 9);

    // Thêm user mới vào mảng
    users.push({
      id,
      username,
      password,
      fullName,
      role: "user",
      email,
      address,
      registerDate: new Date().toLocaleDateString()
    });

    // Lưu lại vào localStorage
    localStorage.setItem("users", JSON.stringify(users));

    alert("Đăng ký thành công! Hãy đăng nhập để tiếp tục.");
    location.href = "login.html";
  });
}


/* ---------- Đăng xuất ---------- */
function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isAdmin");
  location.href = "../login.html";
}
window.logout = logout;

