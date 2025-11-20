document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});

function loadCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');
    
    if (!currentUser) {
        cartList.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">Vui lòng đăng nhập để xem giỏ hàng!</p>';
        cartTotal.innerHTML = '';
        return;
    }

    const key = `cart_${currentUser.username}`;
    const cart = JSON.parse(localStorage.getItem(key) || '[]');

    if (cart.length === 0) {
        cartList.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">Giỏ hàng của bạn đang trống</p>';
        cartTotal.innerHTML = '<h3>Tổng tiền: 0 VNĐ</h3>';
        return;
    }

    let total = 0;
    let html = '';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        html += `
        <div class="cart-item">
            <img src="${item.image || item.img || 'assets/img/placeholder.jpg'}" 
                 alt="${item.name}" 
                 onerror="this.src='assets/img/placeholder.jpg'">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p class="price">${item.price.toLocaleString()} VNĐ</p>
                <div class="qty">
                    <button onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <button class="rm" onclick="removeFromCart(${index})">Xóa</button>
        </div>
        `;
    });

    cartList.innerHTML = html;
    cartTotal.innerHTML = `<h3>Tổng tiền: ${total.toLocaleString()} VNĐ</h3>`;
}

function updateQuantity(index, change) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const key = `cart_${currentUser.username}`;
    const cart = JSON.parse(localStorage.getItem(key) || '[]');
    
    cart[index].qty += change;
    
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem(key, JSON.stringify(cart));
    loadCart();
}

function removeFromCart(index) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const key = `cart_${currentUser.username}`;
    const cart = JSON.parse(localStorage.getItem(key) || '[]');
    
    cart.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(cart));
    loadCart();
}