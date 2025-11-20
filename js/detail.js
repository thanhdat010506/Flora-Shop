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

const EXTRA_IMAGES_BY_NAME = {
  'Hoa hồng': [
    'https://happyflower.vn/tin-tuc/app/uploads/hoa-hong-do-tuoi-1.jpg',
    'https://hoanguyethy.com/wp-content/uploads/2020/02/hoa-hong-do.jpg',
    'https://dienhoahaiha.com/wp-content/uploads/2025/01/bo-hoa-hong-do-9-bong-Tinh-yeu-bat-diet.png'
  ],
  'Hoa hướng dương': [
    'https://th.bing.com/th/id/R.4f1c68a31aec02ba788cc8d6da0140ab?rik=zoX%2fZ1cxvFw5ww&pid=ImgRaw&r=0',
    'https://cdn.tgdd.vn/Files/2021/08/03/1372812/dac-diem-nguon-goc-va-y-nghia-dac-biet-cua-hoa-huong-duong-202206031122479117.jpeg',
    'https://hoatuoiangel.com/upload/elfinder/z6223592962627_35723dd22a8beaa6c9881f6ef1bc6795.jpg'
  ],
  'Cây phát tài': [
    'https://caycanhhanoi.org/wp-content/uploads/2016/10/phat-tai-nui-2.jpg',
    'https://phuongtrunggreen.com/resource/images/2024/10/cay-phat-tai-nui.jpg',
    'https://res.cloudinary.com/dtfpvrnp2/image/upload/v1757056075/gfbfumooxdbo1nllrl7j.webp'
  ],
  'Hoa tulip': [
    'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/03/anh-hoa-Tulip-43.jpg',
    'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
    'https://hoatuoihoangtran.com/uploads/source/hoa-tuilip/hoa-tulip.jpg'
  ],
  'Hoa lan': [
    'https://file.hstatic.net/200000455983/file/hoa-lan_038806fb332840c7a4c128c0b5dd6592_grande.png',
    'https://hoanguyethy.com/wp-content/uploads/2019/10/hoa-lan-ho-diep-3-1024x576.jpg',
    'https://hoatuoihoamy.com/wp-content/uploads/2022/10/Hinh-21.jpg'
  ],
  'Hoa cúc': [
    'https://hoanguyethy.com/wp-content/uploads/2020/02/hoa-cuc.jpg',
    'https://hoatuoi360.vn/uploads/file/b%E1%BB%95%20sungg/hoa-cuc-04.jpg',
    'https://stc.hoatuoihoangnga.com/data/uploads/products/1123/bo-hoa-cuc-mau-don-vang-mix-baby-tang-sinh-nhat-dep.3.jpg?v=1702549757'
  ],
  'Cây bonsai': [
    'https://upload.wikimedia.org/wikipedia/commons/f/f9/Trident_Maple_bonsai_52%2C_October_10%2C_2008.jpg',
    'https://lg.com.vn/wp-content/uploads/2024/09/bonsai08-jpg.webp',
    'https://sieuthiphanbon.vn/uploads/cay-canh-nghe-thuat.jpg'
  ],
  'Cây sen đá': [
    'https://tecwood.com.vn/upload/images/cay-sen-da-nho-dep.jpg',
    'https://tecwood.com.vn/upload/images/cac-loai-sen-da.jpg',
    'https://storage.googleapis.com/cdn_dlhf_vn/blog/342203593_902022677743224_2881015991655890699_n-768x768.png'
  ],
  'Hoa mẫu đơn': [
    'https://aiva.com.vn/wp-content/uploads/2024/09/y-nghia-cua-hoa-mau-don-1.jpg',
    'https://cdn.tgdd.vn/Files/2021/12/01/1401712/tat-tan-tat-ve-cac-loai-hoa-mau-don-y-nghia-hoa-mau-don-202112012030443603.jpg',
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiBvYM5JwuV5Rvgvbt4BUGuhHDp79BljToH59VgWdjqZXWu2EAPpNuDDo9XNjmIbX1I2kCgxvjlzRjXthq2cJlascnYf2rlaySVutT4hvrba9v1fsx5BUeGjaJc11gvKeVes8FxB7cCZeZ2WoNpha3mvavD8s50FmBZ-FT7gA9Juli8aCrBgvs1tA/s500/hoa-mau-don-do-2.png'
  ],
  'Cây may mắn': [
    'https://hatgiongdalat.com/asset/upload/image/hat-giong-cay-may-man.jpg?v=20190410',
    'https://images2.thanhnien.vn/528068263637045248/2023/2/3/base64-1675431307022507617572.png',
    'https://mowgarden.com/wp-content/uploads/2023/03/cay-co-may-man-chau-su-1.jpg'
  ],
  'Hoa ly': [
    'https://phale.com.vn/wp-content/uploads/2024/08/f3337b80b5b3e26944653e0891d8e1b1.jpg',
    'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-ly-do-2-1.jpg',
    'https://shophoatuoi.saigonhoa.com/wp-content/uploads/2024/05/hoa-ly-hong-tha-binh.jpg'
  ],
  'Hoa cẩm tú cầu': [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4dazDYrkHVsNQDIvRWJylFz7yD0tJsXMLew&s',
    'https://nflower.vn/wp-content/uploads/2020/04/hoa-cam-tu-cau.jpg',
    'https://flowercorner.b-cdn.net/image/cache/catalog/products/B%C3%B3%20Hoa/bo-hoa-cam-tu-cau-dam-me.jpg.webp'
  ]
};

const mainImage = `assets/img/id${product.id}.jpg`;
const images = [mainImage, ...(EXTRA_IMAGES_BY_NAME[product.name] || [])];


  
  productDetail.innerHTML = `
    <div class="detail-container">
      <div class="detail-gallery">
        <img 
          src="${images[0]}" 
          alt="${product.name}" 
          class="detail-main-image"
          onerror="this.src='assets/img/placeholder.png'">

        <div class="detail-thumbs">
          ${images
            .map(
              (src, index) => `
                <img 
                  src="${src}" 
                  data-src="${src}"
                  class="detail-thumb ${index === 0 ? 'active' : ''}" 
                  alt="${product.name} ảnh ${index + 1}"
                  onerror="this.src='assets/img/placeholder.png'">
              `
            )
            .join('')}
        </div>
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

    // 🔹 Đổi ảnh lớn khi click vào thumbnail
  const mainImageEl = document.querySelector('.detail-main-image');
  const thumbEls = document.querySelectorAll('.detail-thumb');

  thumbEls.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.dataset.src;
      mainImageEl.src = src;

      thumbEls.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });


  document.getElementById('addToCartBtn').addEventListener('click', () => {
    addToCart(product.id);
    alert('Đã thêm vào giỏ hàng! 🛒');
  });
  
  document.getElementById('buyNowBtn').addEventListener('click', () => {
    addToCart(product.id);
    window.location.href = 'checkout.html';
  });
  
  function addToCart(id) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      window.location.href = 'login.html';
      return;
    }
    
    const CART_KEY = `cart_${currentUser.username}`;
    
    const prod = products.find(p => p.id === id);
    let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
      existingItem.qty++;
    } else {
      cart.push({ ...prod, qty: 1 });
    }
    
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
});
