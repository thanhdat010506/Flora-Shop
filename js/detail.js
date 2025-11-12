document.addEventListener('DOMContentLoaded', () => {
  const productDetail = document.getElementById('product-detail');
  
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));
  
  if (!productId) {
    productDetail.innerHTML = '<p style="text-align:center; padding:50px;">Sản phẩm không tồn tại</p>';
    return;
  }
  
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    productDetail.innerHTML = '<p style="text-align:center; padding:50px;">Sản phẩm không tìm thấy</p>';
    return;
  }
  
  productDetail.innerHTML = `
    <div class="detail-container">
      <div class="detail-image">
        <img src="assets/img/id${product.id}.jpg" alt="${product.name}" 
             onerror="this.src='assets/img/placeholder.png'">
      </div>
      <div class="detail-info">
        <h1>${product.name}</h1>
        <p class="detail-category">Danh mục: ${product.category}</p>
        <p class="detail-price">${product.price.toLocaleString()} VNĐ</p>
        <p class="detail-desc">${product.desc || 'Sản phẩm chất lượng cao từ Flora Shop'}</p>
        
        <div class="detail-actions">
          <button id="addToCartBtn" class="btn-buy">
            <i class="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
          </button>
          <button id="buyNowBtn" class="btn-buy-now">
            <i class="fas fa-bolt"></i> Mua ngay
          </button>
        </div>
        
        <div class="product-features">
          <h3>Đặc điểm nổi bật:</h3>
          <ul>
            <li>✅ Chất lượng cao, tươi mới</li>
            <li>✅ Giao hàng nhanh chóng</li>
            <li>✅ Đóng gói cẩn thận</li>
            <li>✅ Hỗ trợ tư vấn 24/7</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('addToCartBtn').addEventListener('click', () => {
    addToCart(product.id);
    alert('Đã thêm vào giỏ hàng! 🛒');
  });
  
  document.getElementById('buyNowBtn').addEventListener('click', () => {
    addToCart(product.id);
    window.location.href = 'checkout.html';
  });
  
  function addToCart(id) {
    const prod = products.find(p => p.id === id);
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
      existingItem.qty++;
    } else {
      cart.push({ ...prod, qty: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
  }
});