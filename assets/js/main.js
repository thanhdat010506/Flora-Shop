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

/* ---------- Seed dữ liệu admin và user demo ---------- */
(function seedUsers() {
  if (!localStorage.getItem("users_seed_v7")) {
    const users = [
      { id: "u_admin", username: "admin123", password: "123456", role: "admin", fullName: "Quản trị" },
      { id: "u_user", username: "user123", password: "123456", role: "user", fullName: "Khách Demo" }
    ];
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("users_seed_v7", "ok");
  }
})();

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

/* ---------- Đăng ký ---------- */
const regForm = document.getElementById("regForm");
if (regForm) {
  regForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("rname").value.trim();
    const username = document.getElementById("ruser").value.trim();
    const password = document.getElementById("rpass").value.trim();

    // ⚠️ Kiểm tra không để trống
    if (!fullName || !username || !password) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // ⚠️ Họ tên chỉ gồm chữ và khoảng trắng (không số, không ký tự lạ)
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
    if (!nameRegex.test(fullName)) {
      alert("Họ tên chỉ được chứa chữ cái và khoảng trắng, không có số hoặc ký tự đặc biệt!");
      return;
    }

    // ⚠️ Username: phải có cả chữ và số, không ký tự lạ
    const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
    if (!usernameRegex.test(username)) {
      alert("Tên đăng nhập phải có cả chữ và số, và không chứa ký tự đặc biệt!");
      return;
    }

    const users = readUsers();
    if (users.some((u) => u.username === username)) {
      alert("Tên đăng nhập đã tồn tại!");
      return;
    }

    const id = "u_" + Math.random().toString(36).slice(2, 9);
    users.push({ id, username, password, role: "user", fullName });
    saveUsers(users);

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
// 🌿 Kiểm tra trạng thái đăng nhập khi bấm icon người
document.addEventListener('DOMContentLoaded', () => {
  const userIcon = document.querySelector('.fa-user, .fa-regular.fa-user');

  if (userIcon) {
    userIcon.addEventListener('click', (e) => {
      e.preventDefault();

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (currentUser) {
        // Nếu đã đăng nhập -> đến trang thông tin cá nhân
        window.location.href = 'profile.html';
      } else {
        // Nếu chưa đăng nhập -> đến trang đăng nhập
        window.location.href = 'login.html';
      }
    });
  }
});
document.getElementById("registerForm").addEventListener("submit", function(e){
  e.preventDefault();
  
  const user = {
    fullname: document.getElementById("fullname").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    address: document.getElementById("address").value,
    phone: document.getElementById("phone").value,
    gender: document.getElementById("gender").value,
    registerDate: new Date().toLocaleDateString()
  };
  
  localStorage.setItem("currentUser", JSON.stringify(user));
  alert("Đăng ký thành công!");
  location.href = "profile.html";
});

