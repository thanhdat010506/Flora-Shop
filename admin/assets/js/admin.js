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
    return JSON.parse(localStorage.getItem("history") || "[]");
  }
  function setOrders(o) {
    localStorage.setItem("history", JSON.stringify(o));
  }
  window.Admin = { requireAdmin, getUsers, setUsers, getProducts, setProducts, getOrders, setOrders };
})();

<<<<<<< HEAD
/* ================== 🌿 Seed dữ liệu demo ================== */
=======
function renderProducts() {
  tbody.innerHTML = products
    .map(
      (p, i) => `
    <tr>
      <td>${p.name}</td>
      <td>${p.price.toLocaleString()}đ</td>
      <td><img src="${p.image || ''}" alt="" width="60"></td>
      <td>${p.desc || ''}</td>
      <td>
        <button onclick="editProduct(${i})">✏️</button>
        <button onclick="deleteProduct(${i})">🗑️</button>
      </td>
    </tr>`
    )
    .join("");
  localStorage.setItem("products", JSON.stringify(products));
}

document
  .getElementById("addProductForm")
  ?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = pname.value.trim();
    const price = parseInt(pprice.value);
    const image = pimage.value.trim();
    const desc = pdesc.value.trim();
    if (!name || isNaN(price)) return alert("Điền đủ thông tin!");
    products.push({ name, price, image, desc });
    renderProducts();
    e.target.reset();
  });

function editProduct(i) {
  const p = products[i];
  const name = prompt("Tên mới:", p.name);
  const price = parseInt(prompt("Giá mới:", p.price));
  const image = prompt("Link ảnh mới:", p.image);
  const desc = prompt("Mô tả mới:", p.desc);
  if (name && !isNaN(price)) {
    products[i] = { name, price, image, desc };
    renderProducts();
  }
}

function deleteProduct(i) {
  if (confirm("Xóa sản phẩm này?")) {
    products.splice(i, 1);
    renderProducts();
  }
}

renderProducts();
>>>>>>> 8685dec1e4d3243d85daa2b26178a771f92e6956
if (!localStorage.getItem("users")) {
  const demoUsers = [
    { name: "Nguyễn Văn A", email: "a@gmail.com", role: "user" },
    { name: "Trần Thị B", email: "b@gmail.com", role: "user" },
    { name: "Admin", email: "admin@flora.com", role: "admin" },
  ];
  localStorage.setItem("users", JSON.stringify(demoUsers));
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
}

if (!localStorage.getItem("history")) {
  localStorage.setItem("history", JSON.stringify([]));
}

/* ================== 🌿 Quản lý người dùng ================== */
let users = Admin.getUsers();
const userTable = document.querySelector("#ulist tbody");

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
        <button class="btn-edit" onclick="openModal(true, ${i})">✏️</button>
        <button class="btn-del" onclick="deleteUser(${i})">🗑️</button>
      </td>
    </tr>`
    )
    .join("");
  Admin.setUsers(users);
}

const modal = document.getElementById("userModal");
const addUserBtn = document.getElementById("addUserBtn");
const saveUserBtn = document.getElementById("saveUserBtn");
const cancelUserBtn = document.getElementById("cancelUserBtn");
let editIndex = -1;

function openModal(edit = false, i = null) {
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

function closeModal() {
  modal.style.display = "none";
}

addUserBtn?.addEventListener("click", () => openModal(false));
cancelUserBtn?.addEventListener("click", closeModal);

saveUserBtn?.addEventListener("click", () => {
  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const role = document.getElementById("userRole").value;
  if (!name || !email) return alert("Vui lòng nhập đủ thông tin!");

  if (editIndex >= 0) users[editIndex] = { name, email, role };
  else users.push({ name, email, role });

  Admin.setUsers(users);
  renderUsers();
  closeModal();
});

function deleteUser(i) {
  if (confirm("Xóa người dùng này?")) {
    users.splice(i, 1);
    Admin.setUsers(users);
    renderUsers();
  }
}

renderUsers();

/* ================== 🌿 Quản lý sản phẩm ================== */
let products = Admin.getProducts();
const productTable = document.querySelector("#plist tbody");

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

// Modal thêm/sửa sản phẩm
const pmodal = document.getElementById("productModal");
const addProductBtn = document.getElementById("addProductBtn");
const saveProductBtn = document.getElementById("saveProductBtn");
const cancelProductBtn = document.getElementById("cancelProductBtn");
let editProductIndex = -1;

function openProductModal(edit = false, i = null) {
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
  pmodal.style.display = "none";
}

addProductBtn?.addEventListener("click", () => openProductModal(false));
cancelProductBtn?.addEventListener("click", closeProductModal);

saveProductBtn?.addEventListener("click", () => {
  const name = document.getElementById("pname").value.trim();
  const price = parseInt(document.getElementById("pprice").value.trim());
  const image = document.getElementById("pimage").value.trim();
  const desc = document.getElementById("pdesc").value.trim();
  if (!name || !price || !image) return alert("Vui lòng nhập đầy đủ thông tin!");

  const product = { name, price, image, desc };
  if (editProductIndex >= 0) products[editProductIndex] = product;
  else products.push(product);

  Admin.setProducts(products);
  renderProducts();
  closeProductModal();
});

function deleteProduct(i) {
  if (confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
    products.splice(i, 1);
    Admin.setProducts(products);
    renderProducts();
  }
}

renderProducts();

/* ================== 🌿 Logout ================== */
function logout() {
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("currentUser");
  location.href = "admin_login.html";
}
window.logout = logout;
