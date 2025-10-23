//Đăng kí
document.getElementById("registerForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = regName.value.trim();
    const email = regEmail.value.trim();
    const password = regPassword.value.trim();

    if (!name || !email || !password) return alert("Vui lòng nhập đầy đủ thông tin!");
    if (localStorage.getItem(email)) return alert("Email đã được đăng ký!");

    localStorage.setItem(email, JSON.stringify({ name, email, password, history: [] }));
    alert("Đăng ký thành công!");
    window.location.href = "login.html";
});

//Đăng nhập
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    const user = JSON.parse(localStorage.getItem(email));
    if (!user || user.password !== password) return alert("Sai email hoặc mật khẩu!");

    sessionStorage.setItem("loggedInUser", email);
    alert("Đăng nhập thành công!");
    window.location.href = "shop.html";
});

//Trang shop
if (window.location.pathname.includes("shop.html")) {
    const email = sessionStorage.getItem("loggedInUser");
    if (!email) {
        alert("Bạn cần đăng nhập để vào cửa hàng!");
        window.location.href = "login.html";
    } else {
        const user = JSON.parse(localStorage.getItem(email));
        document.getElementById("username").textContent = `Xin chào, ${user.name}!`;

        // Nút đăng xuất
        document.getElementById("logoutBtn").addEventListener("click", () => {
            sessionStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
        });

        // Nút Mua hàng
        document.querySelectorAll(".buyBtn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const item = btn.dataset.item;
                const date = new Date().toLocaleString();

                user.history.push(`${item} - Ngày: ${date}`);
                localStorage.setItem(email, JSON.stringify(user));

                alert(`Đã mua ${item} thành công!`);
            });
        });
    }
}

//Trang lịch sử
if (window.location.pathname.includes("history.html")) {
    const email = sessionStorage.getItem("loggedInUser");
    if (!email) window.location.href = "login.html";

    const user = JSON.parse(localStorage.getItem(email));
    document.getElementById("username").textContent = `Xin chào, ${user.name}!`;

    const list = document.getElementById("historyList");

    if (!user.history || user.history.length === 0) {
        list.innerHTML = "<li>Chưa có đơn hàng nào.</li>";
    } else {
        user.history.forEach((item) => {
            const div = document.createElement("div");
            div.className = "order-card";
            if (typeof item === "object") {
                div.innerHTML = `
                    <h3 class="product-name">${item.name}</h3>
                    <img src="${item.image}" alt="${item.name}" class="product-image">
                    <p><strong>Số lượng:</strong> ${item.quantity}</p>
                    <p><strong>Ngày mua:</strong> ${item.date} - ${item.time}</p>
                    <p><strong>Thành tiền:</strong> ${item.total}₫</p>
                `;
            }
            else {
                div.innerHTML = `<p>${item}</p>`;
            }

            list.appendChild(div);
        });
    }

    document.getElementById("logoutBtn").addEventListener("click", () => {
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });
}



