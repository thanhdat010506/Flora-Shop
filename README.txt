Flora_Shop_v7 - mã nguồn demo (không ảnh)
- Mở http://localhost:8000 sau khi chạy `python -m http.server 8000`
- Admin: đăng nhập admin/admin (123456) tại admin/admin_login.html
- Ảnh đặt vào assets/img/, kích thước gợi ý: product 800x600, hero 1600x800
- Dữ liệu lưu bằng localStorage (users, products, cart, history)
Flora_Shop_v7/
│
├── index.html
├── products.html
├── cart.html
├── checkout.html
├── history.html
├── login.html
├── register.html
├── about.html
├── contact.html
│
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── img/        ← để trống, bạn chèn ảnh vào đây
│
├── js/
│   ├── products.js
│   ├── cart.js
│   ├── checkout.js
│   └── history.js
│
├── admin/
│   ├── admin_login.html
│   ├── dashboard.html
│   ├── manage_products.html
|   ├── manage_users.html
|   ├── manage_orders.html
│   └── assets/
│       └── js/
│           └── admin.js
│
└── README.txt
