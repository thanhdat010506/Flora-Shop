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

if (!Admin.requireAdmin()) {
  throw new Error("Not admin");
}

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
      id: 1,
      name: "Hoa Hồng Đỏ",
      category: "Hoa",
      price: 180000,
      image: "https://th.bing.com/th/id/OIP.KgUlM9X5f_062u7a_6bAxQHaFk?w=245&h=183&c=7&r=0&o=7&dpr=2&pid=1.7",
      desc: "Biểu tượng của tình yêu và sự ngọt ngào.",
    },
    {
      id: 2,
      name: "Hoa Hướng Dương",
      category: "Hoa",
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

document.addEventListener("DOMContentLoaded", () => {
  renderUsers();
  renderProducts();
  updateDashboardStats();
});

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
  if (!modal) return;
  modal.style.display = "flex";

  if (edit) {
    editIndex = i;
    const u = users[i];
    document.getElementById("modalTitle").textContent = "Sửa người dùng";
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
  if (modal) modal.style.display = "none";
}

addUserBtn?.addEventListener("click", () => openModal(false));
cancelUserBtn?.addEventListener("click", closeModal);

saveUserBtn?.addEventListener("click", () => {
  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const role = document.getElementById("userRole").value;

  if (!name || !email) return alert("Vui lòng nhập đủ thông tin!");

  if (editIndex >= 0) users[editIndex] = { ...users[editIndex], name, email, role };
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

window.openModal = openModal;
window.deleteUser = deleteUser;

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
        <td><img src="${p.image}" width="60"></td>
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

const pmodal = document.getElementById("productModal");
const addProductBtn = document.getElementById("addProductBtn");
const saveProductBtn = document.getElementById("saveProductBtn");
const cancelProductBtn = document.getElementById("cancelProductBtn");
let editProductIndex = -1;

function openProductModal(edit = false, i = null) {
  if (!pmodal) return;
  pmodal.style.display = "flex";

  const fileInput = document.getElementById("pimageFile");
  if (fileInput) fileInput.value = "";

  if (edit) {
    editProductIndex = i;
    const p = products[i];
    document.getElementById("modalTitle").textContent = "Sửa sản phẩm";
    document.getElementById("pname").value = p.name;
    document.getElementById("pprice").value = p.price;
    document.getElementById("pimage").value = p.image || "";
    document.getElementById("pdesc").value = p.desc || "";
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
  if (pmodal) pmodal.style.display = "none";
}

addProductBtn?.addEventListener("click", () => openProductModal(false));
cancelProductBtn?.addEventListener("click", closeProductModal);

saveProductBtn?.addEventListener("click", () => {
  const name = document.getElementById("pname").value.trim();
  const price = parseInt(document.getElementById("pprice").value.trim());
  const linkImage = document.getElementById("pimage").value.trim();
  const fileInput = document.getElementById("pimageFile");
  const desc = document.getElementById("pdesc").value.trim();

  if (!name || !price) return alert("Vui lòng nhập tên và giá!");

  let finalImage = linkImage;

  if (fileInput && fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = e => {
      finalImage = e.target.result;
      saveProduct(name, price, finalImage, desc);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    saveProduct(name, price, finalImage, desc);
  }
});

function saveProduct(name, price, image, desc) {
  let product;

  if (editProductIndex >= 0) {
    const old = products[editProductIndex];
    product = { ...old, name, price, image, desc };
  } else {
    const ids = products
      .map(p => parseInt(p.id))
      .filter(n => !isNaN(n));
    const maxId = ids.length ? Math.max(...ids) : 0;

    product = {
      id: maxId + 1,
      name,
      price,
      image,
      desc,
      category: "Hoa",
    };
  }

  if (editProductIndex >= 0) products[editProductIndex] = product;
  else products.push(product);

  Admin.setProducts(products);
  renderProducts();
  closeProductModal();
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

window.applyFilter = function applyFilter() {
  const addr = document.getElementById("filterAddress")?.value.toLowerCase() || "";
  const date = document.getElementById("filterDate")?.value || "";

  let orders = Admin.getOrders();

  if (addr) orders = orders.filter(o => (o.address || "").toLowerCase().includes(addr));
  if (date) orders = orders.filter(o => (o.date || "").startsWith(date));

  const tbody = document.querySelector("#orderTable tbody");
  if (!tbody) return;

  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="6">Không tìm thấy đơn phù hợp</td></tr>`;
    return;
  }

  tbody.innerHTML = orders
    .map(o => {
      const sum = (o.items || []).reduce(
        (s, it) => s + (it.price || 0) * (it.qty || 0),
        0
      );
      return `
      <tr>
        <td>${o.id}</td>
        <td>${o.name}</td>
        <td>${o.date}</td>
        <td>${sum.toLocaleString()}đ</td>
        <td>${o.status}</td>
        <td><button onclick="alert('Đơn #${o.id}\\nKhách: ${o.name}\\nĐịa chỉ: ${o.address}\\nTrạng thái: ${o.status}')">Xem</button></td>
      </tr>`;
    })
    .join("");
};

function updateDashboardStats() {
  const revEl = document.getElementById("tRevenue");
  const ordersEl = document.getElementById("tOrders");
  if (!revEl && !ordersEl) return;

  const orders = Admin.getOrders();

  let totalRevenue = 0;
  orders.forEach(o => {
    const orderTotal = (o.items || []).reduce(
      (sum, it) => sum + (it.price || 0) * (it.qty || 0),
      0
    );
    totalRevenue += orderTotal;
  });

  if (revEl) revEl.textContent = totalRevenue.toLocaleString() + "đ";
  if (ordersEl) ordersEl.textContent = orders.length + " đơn";
}

function logout() {
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("currentUser");
  location.href = "admin_login.html";
}
window.logout = logout;
