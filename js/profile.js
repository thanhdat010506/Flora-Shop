document.addEventListener("DOMContentLoaded", () => {
  const userInfo = document.getElementById("userInfo");
  const editForm = document.getElementById("editForm");
  const editBtn = document.getElementById("editProfile");
  const logoutBtn = document.getElementById("logout");

  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    userInfo.innerHTML = `
      <p style="text-align:center;">Bạn chưa đăng nhập.<br>
      <a href="login.html" class="btn">Đăng nhập ngay</a></p>`;
    editBtn.style.display = "none";
    logoutBtn.style.display = "none";
    return;
  }

  // 🧾 Hiển thị thông tin người dùng
  function renderUserInfo() {
    userInfo.innerHTML = `
      <div class="user-card" style="background:white;padding:20px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
        <h3>${user.fullname || "Người dùng chưa đặt tên"}</h3>
        <p><strong>Email:</strong> ${user.email || "Chưa có"}</p>
        <p><strong>Giới tính:</strong> ${user.gender || "Chưa cập nhật"}</p>
        <p><strong>Địa chỉ:</strong> ${user.address || "Chưa cập nhật"}</p>
        <p><strong>Số điện thoại:</strong> ${user.phone || "Chưa cập nhật"}</p>
        <p><strong>Ngày đăng ký:</strong> ${user.registerDate || "Không rõ"}</p>
      </div>
    `;
  }
  renderUserInfo();

  // 🟢 Nút chỉnh sửa
  editBtn.addEventListener("click", () => {
    editForm.style.display = "block";
    document.getElementById("editFullname").value = user.fullname || "";
    document.getElementById("editEmail").value = user.email || "";
    document.getElementById("editAddress").value = user.address || "";
    document.getElementById("editPhone").value = user.phone || "";
    document.getElementById("editGender").value = user.gender || "";
  });

  // 🟡 Nút hủy chỉnh sửa
  document.getElementById("cancelEdit").addEventListener("click", () => {
    editForm.style.display = "none";
  });

  // 🟢 Cập nhật thông tin
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    user.fullname = document.getElementById("editFullname").value;
    user.email = document.getElementById("editEmail").value;
    user.address = document.getElementById("editAddress").value;
    user.phone = document.getElementById("editPhone").value;
    user.gender = document.getElementById("editGender").value;

    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("Đã cập nhật thông tin!");
    editForm.style.display = "none";
    renderUserInfo();
  });

  // 🔴 Nút đăng xuất
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    alert("Đăng xuất thành công!");
    window.location.href = "login.html";
  });
});
