document.addEventListener('DOMContentLoaded', ()=>{
  const defaultProducts = [
    { id:1,name:'Hoa hồng',category:'Hoa',price:120000,img:'assets/img/rose.jpg',desc:'Hoa hồng đẹp' },
    { id:2,name:'Hoa hướng dương',category:'Hoa',price:90000,img:'assets/img/sunflower.jpg',desc:'Rạng rỡ' },
    { id:3,name:'Cây phát tài',category:'Cây cảnh',price:250000,img:'assets/img/pachira.jpg',desc:'May mắn' }
  ];
  if(!localStorage.getItem('products') || JSON.parse(localStorage.getItem('products')).length===0){
    localStorage.setItem('products', JSON.stringify(defaultProducts));
  }
  const products = JSON.parse(localStorage.getItem('products'));
  const list = document.getElementById('product-list');
  const search = document.getElementById('search');
  const category = document.getElementById('category');
  const priceRange = document.getElementById('priceRange');
  const filterBtn = document.getElementById('filterBtn');

  function display(items){
    list.innerHTML = items.map(p=>`
      <div class="product-card">
        <img src="${p.img||'assets/img/placeholder.png'}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc||''}</p>
        <p class="price">${p.price.toLocaleString()} VNĐ</p>
        <button class="add-btn" data-id="${p.id}">Thêm vào giỏ</button>
      </div>
    `).join('');
    document.querySelectorAll('.add-btn').forEach(b=>{
      b.addEventListener('click', ()=> {
        const id = Number(b.dataset.id);
        addToCart(id);
      });
    });
  }

  function addToCart(id){
    const prod = JSON.parse(localStorage.getItem('products')).find(p=>p.id===id);
    let cart = JSON.parse(localStorage.getItem('cart')||'[]');
    const ex = cart.find(i=>i.id===id);
    if(ex) ex.qty++; else cart.push({...prod, qty:1});
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Đã thêm vào giỏ');
  }

  function filterProducts(){
    let filtered = JSON.parse(localStorage.getItem('products')||'[]');
    const kw = (search.value||'').toLowerCase();
    const cat = category.value;
    const price = priceRange.value;
    if(kw) filtered = filtered.filter(p=>p.name.toLowerCase().includes(kw));
    if(cat) filtered = filtered.filter(p=>p.category===cat);
    if(price){ const [min,max]=price.split('-').map(Number); filtered = filtered.filter(p=>p.price>=min && p.price<=max); }
    display(filtered);
  }

  if(filterBtn) filterBtn.addEventListener('click', filterProducts);
  display(JSON.parse(localStorage.getItem('products')||'[]'));
});
