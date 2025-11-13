document.addEventListener('DOMContentLoaded', ()=>{
  const defaultProducts = [
    { id:1, name:'Hoa hồng', category:'Hoa', price:120000, desc:'Biểu tượng của tình yêu và sự lãng mạn, hoa hồng mang vẻ đẹp quyến rũ và đầy cảm xúc.' },
    { id:2, name:'Hoa hướng dương', category:'Hoa', price:90000, desc:'Luôn hướng về ánh sáng, hoa hướng dương thể hiện sự lạc quan, năng lượng tích cực và niềm tin vào tương lai.' },
    { id:3, name:'Cây phát tài', category:'Cây cảnh', price:250000, desc:'Mang lại tài lộc và may mắn, cây phát tài dễ chăm sóc, phù hợp trang trí nhà cửa hoặc văn phòng.' },
    { id:4, name:'Hoa tulip', category:'Hoa', price:150000, desc:'Vẻ đẹp thanh lịch và tinh tế, hoa tulip thường gắn liền với sự sang trọng và tình cảm nhẹ nhàng.' },
    { id:5, name:'Hoa lan', category:'Hoa', price:200000, desc:'Sang trọng và quý phái, hoa lan là biểu tượng của sự cao cấp, thường dùng trong các dịp đặc biệt.' },
    { id:6, name:'Hoa cúc', category:'Hoa', price:80000, desc:'Dễ thương và giản dị, hoa cúc mang đến cảm giác gần gũi, thân thiện và sự bền bỉ trong cuộc sống.' },
    { id:7, name:'Cây bonsai', category:'Cây cảnh', price:350000, desc:'Cây bonsai nhỏ gọn, dáng uốn lượn nghệ thuật, thể hiện sự tinh tế và phong cách sống tĩnh tại.' },
    { id:8, name:'Cây may mắn', category:'Cây cảnh', price:250000, desc:'Lá xanh tươi, tượng trưng cho sự thuận lợi và bình an, thích hợp làm quà tặng ý nghĩa.' },
    { id:9, name:'Hoa mẫu đơn', category:'Hoa', price:180000, desc:'Quý phái và kiêu sa, hoa mẫu đơn tượng trưng cho sự giàu sang, phồn vinh và vẻ đẹp đằm thắm.' },
    { id:10, name:'Cây sen đá', category:'Cây cảnh', price:100000, desc:'Hình dáng độc đáo, chịu hạn tốt, tượng trưng cho sự bền bỉ và tình yêu vĩnh cửu.' },
    { id:11, name:'Hoa cẩm tú cầu', category:'Hoa', price:220000, desc:'Ngọt ngào và lãng mạn, hoa cẩm tú cầu thay đổi màu sắc theo cảm xúc, thể hiện sự tinh tế trong tình yêu.' }
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

  function getProductImage(productId) {
    return `assets/img/id${productId}.jpg`;
  }

  function display(items){
    list.innerHTML = items.map(p=>`

      <div class="product-card" onclick="viewProductDetail(${p.id})" style="cursor:pointer;">
        <img src="${getProductImage(p.id)}" alt="${p.name}" onerror="this.src='assets/img/placeholder.png'">

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
  // 🔒 Kiểm tra đăng nhập
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!user) {
    alert("Vui lòng đăng nhập để mua hàng!");
    location.href = "login.html";
    return;
  }

  // 🔍 Kiểm tra sản phẩm tồn tại
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const prod = products.find(p => p.id === id);
  if (!prod) {
    alert("Sản phẩm không hợp lệ hoặc dữ liệu bị lỗi!");
    return;
  }

  // 🛒 Thêm vào giỏ
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const ex = cart.find(i => i.id === id);
  if (ex) ex.qty++;
  else cart.push({ ...prod, qty: 1 });

  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`Đã thêm "${prod.name}" vào giỏ hàng!`);
}

  function filterProducts(){
    let filtered = JSON.parse(localStorage.getItem('products')||'[]');
    const kw = (search.value||'').toLowerCase();
    const cat = category.value;
    const price = priceRange.value;
    if(kw) filtered = filtered.filter(p=>p.name.toLowerCase().includes(kw));
    if(cat) filtered = filtered.filter(p=>p.category===cat);
    if(price){ 
      const [min,max]=price.split('-').map(Number); 
      filtered = filtered.filter(p=>p.price>=min && p.price<=max); 
    }
    display(filtered);
  }

  if(filterBtn) filterBtn.addEventListener('click', filterProducts);
  display(JSON.parse(localStorage.getItem('products')||'[]'));
});

function viewProductDetail(productId) {
  window.location.href = `detail.html?id=${productId}`;
}
