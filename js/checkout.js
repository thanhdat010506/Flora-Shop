document.addEventListener('DOMContentLoaded', () => {
  // 🔒 Kiểm tra đăng nhập trước khi cho phép thanh toán
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!currentUser) {
    alert('Vui lòng đăng nhập trước khi thanh toán!');
    location.href = 'login.html';
    return;
  }

  const form = document.getElementById('checkoutForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('c_name').value.trim();
    const phone = document.getElementById('c_phone').value.trim();
    const address = document.getElementById('c_address').value.trim();
    const payment = document.getElementById('c_payment').value;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!cart.length) { alert('Giỏ hàng trống'); return; }

    const orders = JSON.parse(localStorage.getItem('history') || '[]');
    const id = Date.now();
    orders.push({
      id,
      name,
      phone,
      address,
      payment,
      items: cart,
      date: new Date().toLocaleString(),
      status: 'Chờ xử lý'
    });
    localStorage.setItem('history', JSON.stringify(orders));
    localStorage.removeItem('cart');
    
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
