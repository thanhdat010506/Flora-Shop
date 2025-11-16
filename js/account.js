// account.js
document.addEventListener('DOMContentLoaded', () => {
  const userData = JSON.parse(localStorage.getItem('currentUser'));

  // Nếu chưa đăng nhập → quay về login
  if (!userData) {
    alert('Bạn cần đăng nhập để xem thông tin tài khoản.');
    window.location.href = 'login.html';
    return;
  }

  // Hiển thị thông tin tài khoản
  document.getElementById('username').textContent = userData.username || 'Người dùng mới';
  document.getElementById('regEmail').textContent = userData.email || 'Chưa cập nhật';
  document.getElementById('registerDate').textContent = userData.registerDate || 'Không xác định';

  // --- PHẦN SỬA ĐỂ TRUY XUẤT DỮ LIỆU THẬT ---

  // 1. Hàm giả định tính tổng tiền (Dữ liệu 'history' không lưu sẵn total)
  const calculateTotal = (items) => {
      // Giả định: Tính tổng dựa trên số lượng sản phẩm (qty) và một giá cơ bản (100,000₫/sản phẩm)
      // Cần có giá thực tế trong dữ liệu cart để tính chính xác.
      if (!items || items.length === 0) return '0₫';
      
      let totalAmount = 0;
      items.forEach(item => {
          // Giả định mỗi item có giá 100,000₫
          totalAmount += (item.qty || 1) * 100000; 
      });
      
      return totalAmount.toLocaleString('vi-VN') + '₫'; 
  };
  
  // 2. Truy xuất dữ liệu thực tế từ localStorage (khóa 'history')
  const allOrders = JSON.parse(localStorage.getItem('history') || '[]');
  
  const historyBody = document.getElementById('historyBody');

  if (allOrders.length === 0) {
      historyBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Chưa có giao dịch nào được ghi nhận.</td></tr>';
  } else {
      // 3. Chuẩn bị dữ liệu hiển thị (Đảo ngược để đơn mới nhất lên đầu)
      const transactionsToDisplay = allOrders.slice().reverse().map(order => ({
          id: `#${order.id}`, 
          // Chỉ lấy ngày, bỏ phần giờ/phút
          date: order.date.split(',')[0].trim(), 
          total: calculateTotal(order.items), // Tính tổng giả định
          status: order.status
      }));

      // 4. Chèn dữ liệu vào bảng
      historyBody.innerHTML = transactionsToDisplay.map(tx => `
        <tr>
          <td>${tx.id}</td>
          <td>${tx.date}</td>
          <td>${tx.total}</td>
          <td>${tx.status}</td>
        </tr>
      `).join('');
  }
  // --- KẾT THÚC PHẦN SỬA ---

  // Xử lý đăng xuất
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  });
});