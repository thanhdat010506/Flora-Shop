// DÙNG LẠI CODE ACCOUNT.JS BẠN ĐÃ GỬI (ĐÃ CHUẨN HÓA TRẠNG THÁI)

document.addEventListener('DOMContentLoaded', () => {
  // --- BƯỚC 1: KIỂM TRA ĐĂNG NHẬP & TÌM THÔNG TIN ĐẦY ĐỦ CỦA NGƯỜI DÙNG ---

  const simplifiedUserData = JSON.parse(localStorage.getItem('currentUser'));
  const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
  const userData = allUsers.find(u => u.username === simplifiedUserData?.username);

  if (!userData) {
    // Không cần alert, chỉ cần redirect
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
    return;
  }

  // Cập nhật lại currentUser (để đồng bộ)
  localStorage.setItem('currentUser', JSON.stringify(userData));

  // --- BƯỚC 2: HIỂN THỊ THÔNG TIN TÀI KHOẢN ---
  document.getElementById('username').textContent = userData.username || 'Người dùng mới';

  const regNameElement = document.getElementById('regName');
  if (regNameElement) regNameElement.textContent = userData.name || 'Chưa cập nhật';

  document.getElementById('regEmail').textContent = userData.email || 'Chưa cập nhật';

  const regAddressElement = document.getElementById('regAddress');
  if (regAddressElement) regAddressElement.textContent = userData.address || 'Chưa cập nhật';

  const registrationDate = userData.createdDate || userData.registerDate || 'Không xác định';
  const registerDateElement = document.getElementById('registerDate');
  if (registerDateElement) registerDateElement.textContent = registrationDate;


  // --- BƯỚC 3: XỬ LÝ LỊCH SỬ ĐƠN HÀNG VÀ BỘ LỌC ---
  const historyBody = document.getElementById('historyBody');
  const filterContainer = document.getElementById('history-filter'); // Container chứa nút lọc

  if (!historyBody || !filterContainer) return;

  // Lấy TOÀN BỘ đơn hàng của người dùng đang đăng nhập (chỉ 1 lần)
  const allOrders = JSON.parse(localStorage.getItem('history') || '[]');
  // ⭐ BIẾN QUAN TRỌNG: Lưu trữ danh sách đơn hàng KHÔNG LỌC
  const userOrders = allOrders.filter(order => order.username === userData.username);

  // Hàm tính tổng tiền CHÍNH XÁC
  const calculateTotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((total, item) => total + (item.qty || 1) * (item.price || 0), 0);
  };

  // Hàm hiển thị chi tiết sản phẩm
  const renderOrderDetails = (items) => {
    // Hiển thị tên sản phẩm và số lượng
    return items.map(i => `${i.name} x ${i.qty}`).join('<br>');
  };

  // --- Hàm HIỂN THỊ ĐƠN HÀNG (Sử dụng lại) ---
  const displayOrders = (orders) => {
    if (orders.length === 0) {
      // Cập nhật colspan thành 6 để khớp với 6 cột
      historyBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 15px 0;">Chưa có giao dịch nào phù hợp với bộ lọc.</td></tr>';
      return;
    }

    // Đảo ngược để đơn mới nhất lên đầu
    const transactionsToDisplay = orders.slice().reverse().map(order => {
      const totalAmount = order.total || calculateTotal(order.items);
      let displayDate = order.date ? order.date.split('T')[0].trim() : 'Không rõ ngày';

      // Định dạng màu trạng thái THEO YÊU CẦU MỚI
      let statusColor = '#333';
      // ⭐ Logic này đã đúng với trạng thái mới:
      if (order.status === 'Đã giao') {
        statusColor = '#2f6f3e'; // Xanh lá đậm: Đã giao
      } else if (order.status === 'Đã xác nhận') {
        statusColor = '#007bff'; // Xanh dương: Đã xác nhận/Đã xử lý
      } else if (order.status === 'Chờ xác nhận') {
        statusColor = '#ffc107'; // Vàng: Chờ xác nhận/Chưa xử lý
      }

      return {
        id: `#${order.id}`,
        date: displayDate,
        details: renderOrderDetails(order.items),
        total: totalAmount.toLocaleString('vi-VN') + '₫',
        payment: order.payment || 'Không rõ',
        status: `<span style="font-weight: 600; color: ${statusColor};">${order.status}</span>`
      };
    });

    // Chèn dữ liệu vào bảng
    historyBody.innerHTML = transactionsToDisplay.map(tx => `
            <tr>
                <td>${tx.id}</td>
                <td>${tx.date}</td>
                <td>${tx.details}</td>
                <td>${tx.payment}</td>
                <td>${tx.total}</td>
                <td>${tx.status}</td>
            </tr>
        `).join('');
  }

  // --- Hàm LỌC ĐƠN HÀNG ---
  const filterHistory = (status) => {
    // 1. Cập nhật trạng thái active cho nút
    filterContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    // ⭐ Tuyến này sẽ dùng giá trị data-status="Chờ xác nhận" để tìm nút
    filterContainer.querySelector(`[data-status="${status}"]`).classList.add('active');

    let filteredOrders = [];
    if (status === 'Tất cả') {
      filteredOrders = userOrders;
    } else {
      // ⭐ Tuyến này sẽ dùng giá trị data-status="Chờ xác nhận" để lọc o.status
      filteredOrders = userOrders.filter(o => o.status === status);
    }

    // 2. Hiển thị danh sách đã lọc
    displayOrders(filteredOrders);
  };

  // --- Xử lý sự kiện khi nhấn nút Lọc ---
  filterContainer.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
      const statusToFilter = e.target.dataset.status;
      filterHistory(statusToFilter);
    });
  });

  // --- Khởi tạo trang: Lọc và hiển thị 'Tất cả' lần đầu ---
  filterHistory('Tất cả');


  // --- BƯỚC 4: XỬ LÝ ĐĂNG XUẤT ---
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  });
});
