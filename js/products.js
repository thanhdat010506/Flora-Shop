document.addEventListener('DOMContentLoaded', ()=>{
  const defaultProducts = [
    { id:1, name:'Hoa hồng', category:'Hoa', price:120000, desc:'Bó hoa hồng đỏ tươi, thích hợp tặng sinh nhật, kỷ niệm và các dịp đặc biệt. Hoa được tuyển chọn kỹ, cánh dày và lâu tàn.' },
    { id:2, name:'Hoa hướng dương', category:'Hoa', price:90000, desc:'Hoa hướng dương rực rỡ, tượng trưng cho niềm tin và sự lạc quan. Thích hợp trang trí phòng khách, quán cà phê hoặc làm quà động viên.' },
    { id:3, name:'Cây phát tài', category:'Cây cảnh', price:250000, desc:'Cây phát tài xanh tốt, dễ chăm sóc, thường được đặt ở phòng khách hoặc bàn làm việc với ý nghĩa thu hút tài lộc và may mắn.' },
    { id:4, name:'Hoa tulip', category:'Hoa', price:150000, desc:'Hoa tulip thanh lịch với gam màu nhẹ nhàng, mang phong cách châu Âu hiện đại. Phù hợp làm quà tặng sang trọng hoặc trang trí bàn tiệc.' },
    { id:5, name:'Hoa lan', category:'Hoa', price:200000, desc:'Chậu hoa lan quý phái, bông to và nở bền. Rất được ưa chuộng trong các dịp khai trương, tân gia hoặc chúc mừng đối tác.' },
    { id:6, name:'Hoa cúc', category:'Hoa', price:80000, desc:'Hoa cúc tươi tắn với màu sắc dịu nhẹ, thích hợp cắm bình trang trí bàn ăn, góc học tập hoặc không gian làm việc.' },
    { id:7, name:'Cây bonsai', category:'Cây cảnh', price:350000, desc:'Cây bonsai dáng đẹp, mang phong cách nghệ thuật, giúp không gian trở nên tinh tế và thư giãn hơn. Phù hợp đặt tại phòng khách hoặc văn phòng.'},
    { id:8, name:'Cây may mắn', category:'Cây cảnh', price:250000, desc:'Chậu cây may mắn nhỏ gọn, dễ chăm, phù hợp đặt trên bàn làm việc. Lá xanh tươi giúp giảm căng thẳng và tạo điểm nhấn cho không gian.' },
    { id:9, name:'Hoa mẫu đơn', category:'Hoa', price:180000, desc:'Hoa mẫu đơn sang trọng, tượng trưng cho sự vương giả và thịnh vượng. Thường được dùng trong các bó hoa cao cấp, trang trí sảnh hoặc phòng khách.' },
    { id:10, name:'Cây sen đá', category:'Cây cảnh', price:100000, desc:'Cây sen đá xinh xắn, chịu hạn tốt, rất phù hợp cho người mới bắt đầu chơi cây cảnh. Thích hợp đặt trên bàn học, bàn làm việc hoặc kệ sách.' },
    { id:11, name:'Hoa cẩm tú cầu', category:'Hoa', price:220000, desc:'Hoa cẩm tú cầu nhiều bông, màu sắc dịu ngọt. Phù hợp trang trí ban công, sân vườn nhỏ hoặc làm quà tặng cho người thân, bạn bè.' }
  ];

  if(!localStorage.getItem('products') || JSON.parse(localStorage.getItem('products')).length===0){
    localStorage.setItem('products', JSON.stringify(defaultProducts));
  }

  const products = JSON.parse(localStorage.getItem('products'));
  const list = document.getElementById('product-list');
  const pagination = document.getElementById('pagination');
  const search = document.getElementById('search');
  const category = document.getElementById('category');
  const priceRange = document.getElementById('priceRange');
  const filterBtn = document.getElementById('filterBtn');

  const productsPerPage = 6; // số sản phẩm mỗi trang
  let currentPage = 1;
  let filteredProducts = [...products];

  function getProductImage(productId) {
    return `assets/img/id${productId}.jpg`;
  }

  function display(items){
    // tính chỉ số trang hiện tại
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const itemsToShow = items.slice(start, end);

    list.innerHTML = itemsToShow.map(p=>`
      <div class="product-card" onclick="viewProductDetail(${p.id})" style="cursor:pointer;">
        <img src="${p.image ? p.image : 'assets/img/id' + p.id + '.jpg'}"
          alt="${p.name}"
          onerror="this.src='assets/img/placeholder.png'">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc||''}</p>
        <p class="price">${p.price.toLocaleString()} VNĐ</p>

        <div class="product-actions">
          <input type="number" min="1" value="1" class="qty-input">
          <button class="add-btn" data-id="${p.id}">Thêm vào giỏ</button>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.add-btn').forEach(b=>{
      b.addEventListener('click', (e)=> {
        e.stopPropagation(); 
        const id = Number(b.dataset.id);
        const card = b.closest('.product-card');
        const qtyInput = card ? card.querySelector('.qty-input') : null;
        const qty = qtyInput && Number(qtyInput.value) > 0 ? Number(qtyInput.value) : 1;

        addToCart(id, qty);
        if (qtyInput) qtyInput.value = 1;
      });
    });

    document.querySelectorAll('.qty-input').forEach(input => {
      ['click', 'focus', 'input', 'change'].forEach(evt => {
        input.addEventListener(evt, e => {
          e.stopPropagation();
        });
      });
    });

    // phân trang
    setupPagination(items.length);
  }

  function setupPagination(totalItems){
    if(!pagination) return;
    pagination.innerHTML = '';

    const pageCount = Math.ceil(totalItems / productsPerPage);

    for(let i=1; i<=pageCount; i++){
      const btn = document.createElement('button');
      btn.innerText = i;
      if(i === currentPage) btn.classList.add('active');
      btn.addEventListener('click', ()=>{
        currentPage = i;
        display(filteredProducts);
      });
      pagination.appendChild(btn);
    }
  }

  function addToCart(id, quantity = 1){
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) {
      alert("Vui lòng đăng nhập để mua hàng!");
      location.href = "login.html";
      return;
    }

    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const prod = products.find(p => p.id === id);
    if (!prod) {
      alert("Sản phẩm không hợp lệ hoặc dữ liệu bị lỗi!");
      return;
    }

    const key = `cart_${user.username}`;
    let cart = JSON.parse(localStorage.getItem(key) || '[]');
    const ex = cart.find(i => i.id === id);

    const qty = Number(quantity) > 0 ? Number(quantity) : 1;

    if (ex) ex.qty += qty;
    else cart.push({ ...prod, qty });

    localStorage.setItem(key, JSON.stringify(cart));
    alert(`Đã thêm ${qty} "${prod.name}" vào giỏ hàng!`);
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

    filteredProducts = filtered;
    currentPage = 1; // reset về trang 1
    display(filteredProducts);
  }

  if(filterBtn) filterBtn.addEventListener('click', filterProducts);

  display(filteredProducts);
});

function viewProductDetail(productId) {
  window.location.href = `detail.html?id=${productId}`;
}
