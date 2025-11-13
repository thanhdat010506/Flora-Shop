document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Checkout page loaded');
  
  // 🔒 Kiểm tra đăng nhập
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!currentUser) {
    alert('Vui lòng đăng nhập trước khi thanh toán!');
    location.href = 'login.html';
    return;
  }

  const CART_KEY = `cart_${currentUser.username}`;
  const form = document.getElementById('checkoutForm');
  const paymentSelect = document.getElementById('c_payment');
  const cardInfo = document.getElementById('cardInfo');

  // 🔧 THÊM: Xử lý hiển thị form thẻ khi chọn Chuyển khoản
  if (paymentSelect && cardInfo) {
    paymentSelect.addEventListener('change', function() {
      console.log('Payment method changed to:', this.value);
      if (this.value === 'Chuyển khoản') {
        cardInfo.style.display = 'block';
      } else {
        cardInfo.style.display = 'none';
      }
    });
    console.log('✅ Payment change listener added');
  }

  // Xử lý submit form
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      console.log('✅ Form submitted');
      
      const name = document.getElementById('c_name').value.trim();
      const phone = document.getElementById('c_phone').value.trim();
      const address = document.getElementById('c_address').value.trim();
      const payment = document.getElementById('c_payment').value;
      
      console.log('Form data:', { name, phone, address, payment });
      
      // Lấy thông tin thẻ nếu là Chuyển khoản
      let cardNumber = '';
      let pin = '';
      
      if (payment === 'Chuyển khoản') {
        cardNumber = document.getElementById('c_cardNumber').value.trim();
        pin = document.getElementById('c_pin').value.trim();
        
        console.log('Card info:', { cardNumber, pin });
        
        // Validate thông tin thẻ
        if (!cardNumber || !pin) {
          alert('Vui lòng nhập đầy đủ thông tin thẻ!');
          return;
        }
        
        if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
          alert('Mã thẻ phải có đúng 16 chữ số!');
          return;
        }
        
        if (pin.length !== 6 || !/^\d+$/.test(pin)) {
          alert('Mã PIN phải có đúng 6 chữ số!');
          return;
        }
      }
      
      // Kiểm tra giỏ hàng
      const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      console.log('Cart items:', cart);
      
      if (!cart.length) { 
        alert('Giỏ hàng trống'); 
        return; 
      }

      // Lưu đơn hàng
      const orders = JSON.parse(localStorage.getItem('history') || '[]');
      const id = Date.now();
      
      orders.push({
        id,
        name,
        phone,
        address,
        payment,
        cardInfo: payment === 'Chuyển khoản' ? { cardNumber: '****' + cardNumber.slice(-4) } : null,
        items: cart,
        date: new Date().toLocaleString(),
        status: 'Chờ xử lý'
      });
      
      localStorage.setItem('history', JSON.stringify(orders));
      localStorage.removeItem(CART_KEY);
      
      console.log('✅ Order saved, redirecting...');
      
      // Hiển thị thông báo thành công
      const main = document.querySelector('main');
      main.innerHTML = `
        <div class="success-message" style="text-align:center; padding:50px 20px;">
          <h2 style="color:#2f6f3e; margin-bottom:20px;">🎉 Đặt hàng thành công!</h2>
          <p style="margin-bottom:30px; font-size:1.1em;">Cảm ơn bạn đã mua hàng tại Flora Shop</p>
          <p style="margin-bottom:10px;"><strong>Mã đơn hàng:</strong> #${id}</p>
          <p style="margin-bottom:10px;"><strong>Người nhận:</strong> ${name}</p>
          <p style="margin-bottom:10px;"><strong>Địa chỉ:</strong> ${address}</p>
          <p style="margin-bottom:10px;"><strong>Phương thức thanh toán:</strong> ${payment}</p>
          ${payment === 'Chuyển khoản' ? `<p style="margin-bottom:10px;"><strong>Thẻ thanh toán:</strong> ****${cardNumber.slice(-4)}</p>` : ''}
          <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">
            <a href="index.html" class="btn" style="background:#2f6f3e; color:white; padding:10px 20px; border-radius:8px; text-decoration:none;">Về trang chủ</a>
            <a href="history.html" class="btn" style="background:#e9f5ec; color:#2f6f3e; padding:10px 20px; border-radius:8px; text-decoration:none;">Xem đơn hàng</a>
            <a href="products.html" class="btn" style="background:#47945a; color:white; padding:10px 20px; border-radius:8px; text-decoration:none;">Tiếp tục mua hàng</a>
          </div>
        </div>
      `;
    });
    
    console.log('✅ Form submit listener added');
  }
});
