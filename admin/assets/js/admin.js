/* ================== 🌿 Flora Admin Helper ================== */
(function () {
  function requireAdmin() {
    if (!localStorage.getItem("isAdmin")) {
      location.href = "admin_login.html";
      return false;
    }
    return true;
  }

  function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
  }
  function setUsers(u) {
    localStorage.setItem("users", JSON.stringify(u));
  }

  function getProducts() {
    return JSON.parse(localStorage.getItem("products") || "[]");
  }
  function setProducts(p) {
    localStorage.setItem("products", JSON.stringify(p));
  }

  function getOrders() {
    // Lấy dữ liệu đơn hàng từ history
    return JSON.parse(localStorage.getItem("history") || "[]");
  }
  function setOrders(o) {
    localStorage.setItem("history", JSON.stringify(o));
  }

  window.Admin = { requireAdmin, getUsers, setUsers, getProducts, setProducts, getOrders, setOrders };
})();

/* ================== 🌿 Main ================== */
document.addEventListener("DOMContentLoaded", () => {
  /* ================== 🌿 Quản lý người dùng ================== */
  let users = Admin.getUsers();
  const userTable = document.querySelector("#ulist tbody");
  const modal = document.getElementById("userModal");
  const addUserBtn = document.getElementById("addUserBtn");
  const saveUserBtn = document.getElementById("saveUserBtn");
  const cancelUserBtn = document.getElementById("cancelUserBtn");
  let editIndex = -1;

  function renderUsers() {
    if (!userTable) return;
    if (users.length === 0) {
      userTable.innerHTML = `<tr><td colspan="4">Chưa có người dùng nào</td></tr>`;
      return;
    }
    userTable.innerHTML = users
      .map(
        (u, i) => `
        <tr>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${u.role}</td>
          <td>
            <button class="btn-edit" onclick="openUserModal(true, ${i})">✏️</button>
            <button class="btn-del" onclick="deleteUser(${i})">🗑️</button>
          </td>
        </tr>`
      )
      .join("");
    Admin.setUsers(users);
  }

  function openUserModal(edit = false, i = null) {
    if (!modal) return;
    modal.style.display = "flex";
    if (edit) {
      editIndex = i;
      document.getElementById("modalTitle").textContent = "Sửa người dùng";
      const u = users[i];
      document.getElementById("userName").value = u.name;
      document.getElementById("userEmail").value = u.email;
      document.getElementById("userRole").value = u.role;
    } else {
      editIndex = -1;
      document.getElementById("modalTitle").textContent = "Thêm người dùng";
      document.getElementById("userName").value = "";
      document.getElementById("userEmail").value = "";
      document.getElementById("userRole").value = "user";
    }
  }

  function closeUserModal() {
    if (!modal) return;
    modal.style.display = "none";
  }
addUserBtn?.addEventListener("click", () => openUserModal(false));
  cancelUserBtn?.addEventListener("click", closeUserModal);

  saveUserBtn?.addEventListener("click", () => {
    const name = document.getElementById("userName").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const role = document.getElementById("userRole").value;
    if (!name || !email) return alert("Vui lòng nhập đủ thông tin!");
    if (editIndex >= 0) users[editIndex] = { name, email, role };
    else users.push({ name, email, role });
    Admin.setUsers(users);
    renderUsers();
    closeUserModal();
  });

  function deleteUser(i) {
    if (confirm("Xóa người dùng này?")) {
      users.splice(i, 1);
      Admin.setUsers(users);
      renderUsers();
    }
  }
window.openUserModal = openUserModal;
window.deleteUser = deleteUser;


  renderUsers();


  /* ================== 🌿 Quản lý sản phẩm ================== */
  let products = Admin.getProducts();
  const productTable = document.querySelector("#plist tbody");
  const pmodal = document.getElementById("productModal");
  const addProductBtn = document.getElementById("addProductBtn");
  const saveProductBtn = document.getElementById("saveProductBtn");
  const cancelProductBtn = document.getElementById("cancelProductBtn");
  let editProductIndex = -1;

  function renderProducts() {
    if (!productTable) return;
    if (products.length === 0) {
      productTable.innerHTML = `<tr><td colspan="5">Chưa có sản phẩm nào</td></tr>`;
      return;
    }
    productTable.innerHTML = products
      .map(
        (p, i) => `
        <tr>
          <td>${p.name}</td>
          <td>${p.price.toLocaleString()}₫</td>
          <td><img src="${p.image}" alt="" width="60"></td>
          <td>${p.desc || ""}</td>
          <td>
            <button class="btn-edit" onclick="openProductModal(true, ${i})">✏️</button>
            <button class="btn-del" onclick="deleteProduct(${i})">🗑️</button>
          </td>
        </tr>`
      )
      .join("");
    Admin.setProducts(products);
  }

  function openProductModal(edit = false, i = null) {
    if (!pmodal) return;
    pmodal.style.display = "flex";
    if (edit) {
      editProductIndex = i;
      document.getElementById("modalTitle").textContent = "Sửa sản phẩm";
      const p = products[i];
      document.getElementById("pname").value = p.name;
      document.getElementById("pprice").value = p.price;
      document.getElementById("pimage").value = p.image;
      document.getElementById("pdesc").value = p.desc;
    } else {
      editProductIndex = -1;
      document.getElementById("modalTitle").textContent = "Thêm sản phẩm";
      document.getElementById("pname").value = "";
      document.getElementById("pprice").value = "";
      document.getElementById("pimage").value = "";
      document.getElementById("pdesc").value = "";
    }
  }
function closeProductModal() {
    if (!pmodal) return;
    pmodal.style.display = "none";
  }

  function deleteProduct(i) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      products.splice(i, 1);
      Admin.setProducts(products);
      renderProducts();
    }
  }
window.openProductModal = openProductModal;
window.deleteProduct = deleteProduct;


  addProductBtn?.addEventListener("click", () => openProductModal(false));
  cancelProductBtn?.addEventListener("click", closeProductModal);

  saveProductBtn?.addEventListener("click", () => {
  const name = document.getElementById("pname").value.trim();
  const priceInput = document.getElementById("pprice").value.trim();
  const image = document.getElementById("pimage").value.trim();
  const desc = document.getElementById("pdesc").value.trim();

  // Kiểm tra trống
  if (!name || !priceInput || !image) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // Chỉ cho phép số dương
  const price = Number(priceInput);

  if (isNaN(price)) {
    alert("Giá phải là một số!");
    return;
  }

  if (price <= 0) {
    alert("Giá sản phẩm phải lớn hơn 0!");
    return;
  }

  const product = { name, price, image, desc };

  // Thêm hoặc sửa
  if (editProductIndex >= 0) products[editProductIndex] = product;
  else products.push(product);

  Admin.setProducts(products);
  renderProducts();
  closeProductModal();
});

  renderProducts();

  /* ================== 🌿 Quản lý đơn hàng (Mới) ================== */
  let orders = Admin.getOrders();
  const orderTable = document.querySelector("#olist tbody");
  const filterStartDateInput = document.getElementById("filterStartDate");
  const filterEndDateInput = document.getElementById("filterEndDate");
  
  // ✨ Bổ sung input địa chỉ
  const filterAddressInput = document.getElementById("filterAddress");
  
  const applyFilterBtn = document.getElementById("applyOrderFilterBtn");
  const resetFilterBtn = document.getElementById("resetOrderFilterBtn");

  function formatDate(dateString) {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  }

  function renderOrders(currentOrders = orders) {
    if (!orderTable) return;
    if (currentOrders.length === 0) {
      orderTable.innerHTML = `<tr><td colspan="5">Chưa có đơn hàng nào</td></tr>`;
      return;
    }
    orderTable.innerHTML = currentOrders
      .map(
        (o) => `
        <tr>
          <td>${o.id}</td>
          <td>${formatDate(o.date)}</td>
          <td>${o.total.toLocaleString()}₫</td>
          <td>${o.status}</td>
          <td>
            <button class="btn-detail" onclick="viewOrderDetails('${o.id}')">Xem</button>
          </td>
        </tr>`
      )
      .join("");
  }

  function filterOrdersByDateAndAddress() {
    const startDateStr = filterStartDateInput?.value;
    const endDateStr = filterEndDateInput?.value;
    const addressStr = filterAddressInput?.value.trim().toLowerCase();

    if (!startDateStr && !endDateStr && !addressStr) {
      renderOrders(orders);
      return;
    }

    const filtered = orders.filter(order => {
      const orderDate = new Date(order.date); 
      let isAfterStart = true;
      let isBeforeEnd = true;
      let matchesAddress = true;

      if (startDateStr) {
        const startDate = new Date(startDateStr);
        isAfterStart = orderDate >= startDate;
      }

      if (endDateStr) {
        const endDate = new Date(endDateStr);
        endDate.setDate(endDate.getDate() + 1);
        isBeforeEnd = orderDate < endDate;
      }

      if (addressStr) {
        matchesAddress = order.address?.toLowerCase().includes(addressStr);
      }

      return isAfterStart && isBeforeEnd && matchesAddress;
    });

    renderOrders(filtered);
  }

  function resetOrderFilter() {
    if(filterStartDateInput) filterStartDateInput.value = "";
    if(filterEndDateInput) filterEndDateInput.value = "";
    if(filterAddressInput) filterAddressInput.value = ""; // ✨ reset input địa chỉ
    renderOrders(orders);
  }

  // Event listeners cho nút Lọc
  applyFilterBtn?.addEventListener("click", filterOrdersByDateAndAddress);
  resetFilterBtn?.addEventListener("click", resetOrderFilter);

  // Hàm dummy để xem chi tiết (có thể mở rộng sau)
  window.viewOrderDetails = (orderId) => {
      console.log('Xem chi tiết đơn hàng:', orderId);
      alert('Chức năng xem chi tiết đơn hàng (ID: ' + orderId + ') chưa được triển khai.');
  };

  // Initial render nếu đang ở trang quản lý đơn hàng
  const isOrderPage = document.querySelector('h1')?.textContent.includes('Đơn hàng');
  if (isOrderPage) renderOrders();
});


  /* ================== 🌿 Logout ================== */
  function logout() {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("currentUser");
    location.href = "admin_login.html";
  }
  window.logout = logout;

  /* ================== 🌿 Demo data (nếu localStorage trống) ================== */
  if (!localStorage.getItem("users")) {
    const demoUsers = [
      { name: "Nguyễn Văn A", email: "a@gmail.com", role: "user" },
      { name: "Trần Thị B", email: "b@gmail.com", role: "user" },
      { name: "Admin", email: "admin@flora.com", role: "admin" },
    ];
    localStorage.setItem("users", JSON.stringify(demoUsers));
    users = demoUsers;
    renderUsers();
  }

  if (!localStorage.getItem("products")) {
    const demoProducts = [
      {
        name: "Hoa Hồng Đỏ",
        price: 180000,
        image: "https://th.bing.com/th/id/OIP.KgUlM9X5f_062u7a_6bAxQHaFk?w=245&h=183&c=7&r=0&o=7&dpr=2&pid=1.7",
        desc: "Biểu tượng của tình yêu và sự ngọt ngào.",
      },
      {
        name: "Hoa Hướng Dương",
        price: 220000,
        image: "https://th.bing.com/th/id/OIP.lUsydUZW4GscBrT3Cxi6HAHaE8?w=247&h=180&c=7&r=0&o=7&dpr=2&pid=1.7",
        desc: "Hoa của niềm tin và hy vọng, hướng về ánh sáng.",
      },
    ];
    localStorage.setItem("products", JSON.stringify(demoProducts));
    products = demoProducts;
    renderProducts();
  }
// Khởi tạo dữ liệu demo cho đơn hàng (history) và đảm bảo có trường date
  if (!localStorage.getItem("history")) {
    const today = new Date().toISOString().split('T')[0]; // Lấy ngày hôm nay: YYYY-MM-DD
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0]; // Lấy ngày hôm qua

    const demoOrders = [
        { id: "ORD001", date: yesterdayStr, total: 400000, status: "Đã giao" },
        { id: "ORD002", date: today, total: 180000, status: "Đang xử lý" },
        { id: "ORD003", date: today, total: 220000, status: "Đã giao" },
    ];
    localStorage.setItem("history", JSON.stringify(demoOrders));
    orders = demoOrders; // Cập nhật mảng orders cục bộ
    const orderTableExists = document.querySelector("#olist tbody");
    if (orderTableExists) renderOrders(); 
  }