document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('checkoutForm');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name=document.getElementById('c_name').value.trim();
    const phone=document.getElementById('c_phone').value.trim();
    const address=document.getElementById('c_address').value.trim();
    const payment=document.getElementById('c_payment').value;
    const cart = JSON.parse(localStorage.getItem('cart')||'[]');
    if(!cart.length){ alert('Giỏ hàng trống'); return; }
    const orders = JSON.parse(localStorage.getItem('history')||'[]');
    const id = Date.now();
    orders.push({ id, name, phone, address, payment, items: cart, date: new Date().toLocaleString(), status:'Chờ xử lý' });
    localStorage.setItem('history', JSON.stringify(orders));
    localStorage.removeItem('cart');
    alert('Đặt hàng thành công');
    location.href='history.html';
  });
});
