document.addEventListener('DOMContentLoaded', ()=>{
  const list = document.getElementById('order-list');
  const orders = JSON.parse(localStorage.getItem('history')||'[]');
  if(!orders.length){ list.innerHTML='<p>Chưa có đơn hàng</p>'; return; }
  list.innerHTML = orders.map(o=>`
    <div class="order-card">
      <h3>Đơn #${o.id}</h3>
      <p><b>Ngày:</b> ${o.date}</p>
      <p><b>Người nhận:</b> ${o.name}</p>
      <p><b>Địa chỉ:</b> ${o.address}</p>
      <p><b>Thanh toán:</b> ${o.payment}</p>
      <p><b>Trạng thái:</b> ${o.status}</p>
      <ul>${o.items.map(i=>`<li>${i.name} x ${i.qty}</li>`).join('')}</ul>
    </div>
  `).join('');
});
