document.addEventListener('DOMContentLoaded', ()=>{
  const listDiv = document.getElementById('cart-list');
  const totalDiv = document.getElementById('cart-total');

  function render(){
    let cart = JSON.parse(localStorage.getItem('cart')||'[]');
    if(cart.length===0){ listDiv.innerHTML='<p>Giỏ hàng trống</p>'; totalDiv.innerHTML=''; return; }
    listDiv.innerHTML = cart.map((it,idx)=>`
      <div class="cart-item">
        <img src="${it.img||'assets/img/placeholder.png'}" alt="${it.name}">
        <div><h4>${it.name}</h4><p>${it.price.toLocaleString()} VNĐ</p>
         <div class="qty"><button data-i="${idx}" class="dec">-</button><span>${it.qty}</span><button data-i="${idx}" class="inc">+</button></div>
        </div>
        <button data-i="${idx}" class="rm">Xóa</button>
      </div>
    `).join('');
    const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
    totalDiv.innerHTML = `<h3>Tổng: ${total.toLocaleString()} VNĐ</h3>`;
    document.querySelectorAll('.dec').forEach(b=>b.addEventListener('click',()=> changeQty(b.dataset.i,-1)));
    document.querySelectorAll('.inc').forEach(b=>b.addEventListener('click',()=> changeQty(b.dataset.i,1)));
    document.querySelectorAll('.rm').forEach(b=>b.addEventListener('click',()=> removeItem(b.dataset.i)));
  }

  function changeQty(i,delta){ let cart=JSON.parse(localStorage.getItem('cart')||'[]'); cart[i].qty+=delta; if(cart[i].qty<=0) cart.splice(i,1); localStorage.setItem('cart', JSON.stringify(cart)); render(); }
  function removeItem(i){ let cart=JSON.parse(localStorage.getItem('cart')||'[]'); cart.splice(i,1); localStorage.setItem('cart', JSON.stringify(cart)); render(); }

  render();
});
