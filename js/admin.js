/* ===== Flora Shop Admin (LocalStorage) =====
 * - One-file JS cho nhanh: auth, storage, products, orders, users, charts
 */

const Admin = (() => {
  /* ---------- helpers ---------- */
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];
  const fmtVND = n => (n || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
  const nowISO = () => new Date().toISOString();

  /* ---------- storage ---------- */
  const K = {
    users: 'fs_users',
    products: 'fs_products',
    orders: 'fs_orders',
    adminSession: 'fs_adminSession',
  };
  const read = (k, def = []) => {
    try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; }
  };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  /* ---------- seed data ---------- */
  function seedIfEmpty() {
    let users = read(K.users);
    if (users.length === 0) {
      users = [
        { id: uid('u'), name: 'Admin', email: 'admin@flora.shop', passwordHash: '123456', role: 'admin', locked: false, createdAt: nowISO() },
        { id: uid('u'), name: 'Nguyễn Hoa', email: 'hoa@example.com', passwordHash: '123456', role: 'user', locked: false, createdAt: nowISO() },
      ];
      write(K.users, users);
    }

    let products = read(K.products);
    if (products.length === 0) {
      products = [
        { id: uid('p'), name: 'Monstera Deliciosa', price: 250000, category: 'Cây để bàn', stock: 15, img: 'images/monstera.jpg', desc: 'Cây dễ chăm, lọc không khí.', createdAt: nowISO(), updatedAt: nowISO(), active: true },
        { id: uid('p'), name: 'Lan Hồ Điệp', price: 350000, category: 'Hoa tươi', stock: 8, img: 'images/lan.jpg', desc: 'Hoa tặng sang trọng.', createdAt: nowISO(), updatedAt: nowISO(), active: true },
        { id: uid('p'), name: 'Kim Tiền', price: 180000, category: 'Cây phong thủy', stock: 20, img: 'images/kimtien.jpg', desc: 'Tượng trưng tài lộc.', createdAt: nowISO(), updatedAt: nowISO(), active: true },
      ];
      write(K.products, products);
    }

    let orders = read(K.orders);
    if (orders.length === 0) {
      const uId = users[1]?.id;
      orders = [
        { id: uid('o'), userId: uId, items: [{ productId: products[0].id, qty: 1, price: products[0].price }], total: products[0].price, status: 'paid', createdAt: nowISO() },
        { id: uid('o'), userId: uId, items: [{ productId: products[2].id, qty: 2, price: products[2].price }], total: products[2].price * 2, status: 'shipping', createdAt: nowISO() },
      ];
      write(K.orders, orders);
    }
  }

  /* ---------- auth ---------- */
  function initLogin() {
    seedIfEmpty();
    const form = qs('#adminLoginForm');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = qs('#email').value.trim().toLowerCase();
      const pass = qs('#password').value;

      const users = read(K.users);
      const u = users.find(x => x.email.toLowerCase() === email && x.passwordHash === pass && x.role === 'admin');
      const msg = qs('#loginMsg');

      if (!u) {
        msg.textContent = 'Sai thông tin hoặc không có quyền admin.';
        return;
      }
      if (u.locked) {
        msg.textContent = 'Tài khoản admin đang bị khóa.';
        return;
      }

      write(K.adminSession, { adminId: u.id, time: nowISO() });
      window.location.href = 'admin.html'; // ✅ chuyển đúng tên file
    });
  }

  function guardAdmin() {
    const s = read(K.adminSession, null);
    if (!s?.adminId) {
      window.location.href = 'admin_login.html'; // ✅ đúng tên file login
      return;
    }
  }

  /* ---------- UI Tabs ---------- */
  function initTabs() {
    qsa('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        qsa('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        qsa('.tab').forEach(t => t.classList.remove('active'));
        qs('#tab-' + tab).classList.add('active');

        if (tab === 'dashboard') renderDashboard();
        if (tab === 'products') renderProducts();
        if (tab === 'orders') renderOrders();
        if (tab === 'users') renderUsers();
      });
    });
  }

  /* ---------- Dashboard ---------- */
  let revChart;
  function renderDashboard() {
    const orders = read(K.orders);
    const products = read(K.products);
    qs('#activeProducts').textContent = products.filter(p => p.active).length;

    const todayStr = new Date().toISOString().slice(0, 10);
    qs('#ordersToday').textContent = orders.filter(o => (o.createdAt || '').slice(0, 10) === todayStr).length;

    const month = new Date().toISOString().slice(0, 7);
    const rev = orders.filter(o => o.status !== 'cancelled' && (o.createdAt || '').slice(0, 7) === month)
      .reduce((s, o) => s + (o.total || 0), 0);
    qs('#revMonth').textContent = fmtVND(rev);

    const days = [...Array(7)].map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });
    const sums = days.map(d =>
      orders.filter(o => (o.createdAt || '').slice(0, 10) === d && o.status !== 'cancelled')
        .reduce((s, o) => s + o.total, 0)
    );

    const ctx = qs('#revenueChart');
    if (revChart) revChart.destroy();
    revChart = new Chart(ctx, {
      type: 'line',
      data: { labels: days, datasets: [{ label: 'Doanh thu theo ngày', data: sums }] },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
  }

  /* ---------- Products ---------- */
  function renderProducts() {
    const tbody = qs('#productTbody'); tbody.innerHTML = '';
    const products = read(K.products);
    for (const p of products) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>${fmtVND(p.price)}</td>
        <td>${p.stock}</td>
        <td>${p.active ? 'Bán' : 'Ẩn'}</td>
        <td class="right">
          <button data-id="${p.id}" class="btn-outline btnEdit">Sửa</button>
          <button data-id="${p.id}" class="btn-danger btnDel">Xoá</button>
        </td>`;
      tbody.appendChild(tr);
    }

    qs('#btnNewProduct')?.addEventListener('click', () => openProductForm());
    qs('#btnCancelProduct')?.addEventListener('click', closeProductForm);
    qs('#productForm')?.addEventListener('submit', saveProduct);

    qsa('.btnEdit', tbody).forEach(b => b.addEventListener('click', () => openProductForm(b.dataset.id)));
    qsa('.btnDel', tbody).forEach(b => b.addEventListener('click', () => deleteProduct(b.dataset.id)));
  }

  function openProductForm(id = null) {
    const wrap = qs('#productFormWrap'); wrap.classList.remove('hidden');
    const title = qs('#pfTitle');
    const p = read(K.products).find(x => x.id === id);
    title.textContent = p ? 'Sửa sản phẩm' : 'Thêm sản phẩm';
    qs('#pfMsg').textContent = '';

    qs('#pId').value = p?.id || '';
    qs('#pName').value = p?.name || '';
    qs('#pPrice').value = p?.price || '';
    qs('#pStock').value = p?.stock || 0;
    qs('#pCategory').value = p?.category || 'Cây để bàn';
    qs('#pActive').value = String(p?.active ?? true);
    qs('#pImg').value = p?.img || '';
    qs('#pDesc').value = p?.desc || '';
  }

  function closeProductForm() { qs('#productFormWrap').classList.add('hidden'); }

  function saveProduct(e) {
    e.preventDefault();
    const id = qs('#pId').value || uid('p');
    const prod = {
      id,
      name: qs('#pName').value.trim(),
      price: Number(qs('#pPrice').value),
      category: qs('#pCategory').value,
      stock: Number(qs('#pStock').value),
      img: qs('#pImg').value.trim(),
      desc: qs('#pDesc').value.trim(),
      active: qs('#pActive').value === 'true',
      updatedAt: nowISO(),
    };
    let list = read(K.products);
    const ix = list.findIndex(x => x.id === id);
    if (ix >= 0) list[ix] = { ...list[ix], ...prod };
    else list.unshift({ ...prod, createdAt: nowISO() });
    write(K.products, list);

    qs('#pfMsg').textContent = 'Đã lưu sản phẩm.';
    renderProducts();
    setTimeout(closeProductForm, 300);
  }

  function deleteProduct(id) {
    if (!confirm('Xoá sản phẩm này?')) return;
    let list = read(K.products);
    list = list.filter(x => x.id !== id);
    write(K.products, list);
    renderProducts();
  }

  /* ---------- Orders ---------- */
  function renderOrders() {
    const tbody = qs('#orderTbody'); tbody.innerHTML = '';
    const statusF = qs('#orderStatusFilter').value;
    const orders = read(K.orders).filter(o => !statusF || o.status === statusF);
    const users = read(K.users);

    for (const o of orders) {
      const user = users.find(u => u.id === o.userId);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${o.id.slice(0, 10)}...</td>
        <td>${user?.name || 'Ẩn danh'}</td>
        <td>${fmtVND(o.total)}</td>
        <td>${(o.createdAt || '').slice(0, 10)}</td>
        <td>
          <select data-id="${o.id}" class="orderStatus">
            ${['pending', 'paid', 'shipping', 'done', 'cancelled'].map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </td>
        <td class="right"><button class="btn-outline btnView" data-id="${o.id}">Chi tiết</button></td>`;
      tbody.appendChild(tr);
    }

    qs('#orderStatusFilter')?.addEventListener('change', renderOrders, { once: true });
    qsa('.orderStatus', tbody).forEach(sel => sel.addEventListener('change', (e) => {
      let list = read(K.orders);
      const id = e.target.dataset.id;
      const ix = list.findIndex(x => x.id === id);
      if (ix >= 0) { list[ix].status = e.target.value; write(K.orders, list); renderDashboard(); }
    }));
    qsa('.btnView', tbody).forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.id;
      const o = read(K.orders).find(x => x.id === id);
      const products = read(K.products);
      const lines = o.items.map(it => {
        const p = products.find(pp => pp.id === it.productId);
        return `- ${p?.name || 'SP'} x ${it.qty} = ${fmtVND(it.price * it.qty)}`;
      }).join('\n');
      alert(`Đơn ${id}\nTrạng thái: ${o.status}\nTổng: ${fmtVND(o.total)}\n\nChi tiết:\n${lines}`);
    }));
  }

  /* ---------- Users ---------- */
  function renderUsers() {
    const tbody = qs('#userTbody'); tbody.innerHTML = '';
    const users = read(K.users);
    for (const u of users) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>${u.locked ? '🔒' : '🔓'}</td>
        <td class="right">
          <button class="btn-outline btnRole" data-id="${u.id}">Đổi vai trò</button>
          <button class="btn-danger btnLock" data-id="${u.id}">${u.locked ? 'Mở khoá' : 'Khoá'}</button>
        </td>`;
      tbody.appendChild(tr);
    }
    qsa('.btnRole', tbody).forEach(b => b.addEventListener('click', () => {
      let list = read(K.users);
      const u = list.find(x => x.id === b.dataset.id);
      if (!u) return;
      u.role = (u.role === 'admin') ? 'user' : 'admin';
      write(K.users, list); renderUsers();
    }));
    qsa('.btnLock', tbody).forEach(b => b.addEventListener('click', () => {
      let list = read(K.users);
      const u = list.find(x => x.id === b.dataset.id);
      if (!u) return;
      u.locked = !u.locked;
      write(K.users, list); renderUsers();
    }));
  }

  /* ---------- Settings ---------- */
  function initSettings() {
    qs('#btnSeed')?.addEventListener('click', () => { seedIfEmpty(); qs('#setMsg').textContent = 'Đã tạo dữ liệu mẫu.'; renderDashboard(); renderProducts(); renderOrders(); renderUsers(); });
    qs('#btnReset')?.addEventListener('click', () => {
      if (!confirm('Xoá toàn bộ dữ liệu demo?')) return;
      [K.users, K.products, K.orders].forEach(k => localStorage.removeItem(k));
      qs('#setMsg').textContent = 'Đã xoá dữ liệu.';
      renderProducts(); renderOrders(); renderUsers(); renderDashboard();
    });
  }

  /* ---------- bootstrap ---------- */
  function initAdmin() {
    guardAdmin();
    seedIfEmpty();
    initTabs();
    initSettings();
    renderDashboard();

    // ✅ Nút đăng xuất (bổ sung xác nhận)
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
          localStorage.removeItem(K.adminSession);
          alert('Đã đăng xuất thành công!');
          window.location.href = 'admin_login.html';
        }
      });
    }
  }

  return { initLogin, initAdmin };
})();
