// Hiển thị năm hiện tại tự động ở footer
document.getElementById("year2").textContent = new Date().getFullYear();

// Hiệu ứng cuộn xuất hiện (reveal)
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  for (let i = 0; i < reveals.length; i++) {
    const windowHeight = window.innerHeight;
    const revealTop = reveals[i].getBoundingClientRect().top;
    const revealPoint = 100;

    if (revealTop < windowHeight - revealPoint) {
      reveals[i].classList.add("active");
    }
  }
});

// Thêm hiệu ứng CSS khi phần tử xuất hiện
const style = document.createElement("style");
style.innerHTML = `
  .reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s ease; }
  .reveal.active { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);
