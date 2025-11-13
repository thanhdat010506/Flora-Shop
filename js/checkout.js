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
  const bankInfo = document.getElementById('bankInfo');
  const visaInfo = document.getElementById('visaInfo');

  // 🔧 Xử lý hiển thị form thanh toán theo phương thức
  if (paymentSelect) {
    paymentSelect.addEventListener('change', function() {
      console.log('Payment method changed to:', this.value);
      
      // Ẩn tất cả form
      bankInfo.style.display = 'none';
      visaInfo.style.display = 'none';
      
      // Hiển thị form tương ứng
      if (this.value === 'Chuyển khoản') {
        bankInfo.style.display = 'block';
      } else if (this.value === 'Visa') {
        visaInfo.style.display = 'block';
      }
    });
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
      
      // Validate thông tin thanh toán
      let paymentData = {};
      
      if (payment === 'Chuyển khoản') {
        const cardNumber = document.getElementById('c_cardNumber').value.trim();
        const pin = document.getElementById('c_pin').value.trim();
        
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
        
        paymentData = { cardNumber: '****' + cardNumber.slice(-4) };
      }
      else if (payment === 'Visa') {
        const cardholder = document.getElementById('c_cardholder').value.trim();
        const visaNumber = document.getElementById('c_visaNumber').value.trim();
        const expiry = document.getElementById('c_expiry').value.trim();
        const cvv = document.getElementById('c_cvv').value.trim();
        
        if (!cardholder || !visaNumber || !expiry || !cvv) {
          alert('Vui lòng nhập đầy đủ thông tin thẻ Visa!');
          return;
        }
        
        if (visaNumber.length !== 16 || !/^\d+$/.test(visaNumber)) {
          alert('Số thẻ phải có đúng 16 chữ số!');
          return;
        }
        
        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
          alert('Ngày hết hạn phải theo định dạng MM/YY!');
          return;
        }
        
        if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
          alert('CVV phải có đúng 3 chữ số!');
          return;
        }
        
        paymentData = { 
          cardholder,
          cardNumber: '****' + visaNumber.slice(-4),
          expiry 
        };
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
        paymentData,
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
          ${payment === 'Visa' ? `<p style="margin-bottom:10px;"><strong>Thẻ thanh toán:</strong> ${paymentData.cardNumber}</p>` : ''}
          ${payment === 'Chuyển khoản' ? `<p style="margin-bottom:10px;"><strong>Thẻ thanh toán:</strong> ${paymentData.cardNumber}</p>` : ''}
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
