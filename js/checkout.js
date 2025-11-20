document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!currentUser) {
    alert('Vui lòng đăng nhập trước khi thanh toán!');
    location.href = 'login.html';
    return;
  }

  const CART_KEY = `cart_${currentUser.username}`;
  const form = document.getElementById('checkoutForm');
  const savedAddressRadio = document.getElementById('savedAddress');
  const newAddressRadio = document.getElementById('newAddress');
  const savedAddressContainer = document.getElementById('savedAddressContainer');
  const newAddressContainer = document.getElementById('newAddressContainer');
  const savedAddressSelect = document.getElementById('savedAddressSelect');

  // Hiển thị địa chỉ đã lưu của user
  if (currentUser.address) {
    savedAddressSelect.innerHTML = `<option value="${currentUser.address}">${currentUser.address}</option>`;
  }

  // Xử lý chuyển đổi giữa địa chỉ đã lưu và địa chỉ mới
  savedAddressRadio.addEventListener('change', () => {
    savedAddressContainer.style.display = 'block';
    newAddressContainer.style.display = 'none';
  });

  newAddressRadio.addEventListener('change', () => {
    savedAddressContainer.style.display = 'none';
    newAddressContainer.style.display = 'block';
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('c_name').value.trim();
    const phone = document.getElementById('c_phone').value.trim();
    
    let address = '';
    if (savedAddressRadio.checked) {
      address = savedAddressSelect.value;
    } else {
      address = document.getElementById('c_address').value.trim();
    }
    
    const payment = document.getElementById('c_payment').value;

    if (!address) {
      alert('Vui lòng chọn hoặc nhập địa chỉ giao hàng!');
      return;
    }

    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!cart.length) { 
      alert('Giỏ hàng trống'); 
      return; 
    }

    // Tính tổng tiền để hiển thị trong admin
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const orders = JSON.parse(localStorage.getItem('history') || '[]');
    const id = Date.now();
    
    // SỬA: Định dạng đơn hàng khớp với admin
    const newOrder = {
      id,
      name,
      phone,
      address,
      payment,
      items: cart,
      total: total, // Thêm tổng tiền
      date: new Date().toLocaleString(),
      status: 'Chờ xử lý'
    };
    
    // SỬA QUAN TRỌNG: Thêm đơn hàng mới vào ĐẦU mảng (unshift thay vì push)
    orders.unshift(newOrder);
    localStorage.setItem('history', JSON.stringify(orders));
    localStorage.removeItem(CART_KEY);

    const main = document.querySelector('main');
    main.innerHTML = `
      <div class="success-message" style="text-align:center; padding:50px 20px;">
        <h2 style="color:#2f6f3e; margin-bottom:20px;">🎉 Đặt hàng thành công!</h2>
        <p style="margin-bottom:30px; font-size:1.1em;">Cảm ơn bạn đã mua hàng tại Flora Shop</p>
        <p style="margin-bottom:10px;"><strong>Mã đơn hàng:</strong> #${id}</p>
        <p style="margin-bottom:10px;"><strong>Người nhận:</strong> ${name}</p>
        <p style="margin-bottom:10px;"><strong>Địa chỉ:</strong> ${address}</p>
        <p style="margin-bottom:30px;"><strong>Phương thức thanh toán:</strong> ${payment}</p>
        <div style="display:flex; gap:15px; justify-content:center;">
          <a href="index.html" class="btn" style="background:#2f6f3e; color:white; padding:10px 20px; border-radius:8px; text-decoration:none;">Về trang chủ</a>
          <a href="history.html" class="btn" style="background:#e9f5ec; color:#2f6f3e; padding:10px 20px; border-radius:8px; text-decoration:none;">Xem đơn hàng</a>
          <a href="products.html" class="btn" style="background:#47945a; color:white; padding:10px 20px; border-radius:8px; text-decoration:none;">Tiếp tục mua hàng</a>
        </div>
      </div>
    `;
  });
});