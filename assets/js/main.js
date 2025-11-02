document.addEventListener('DOMContentLoaded', function(){
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav ul');
  if(menuToggle) menuToggle.addEventListener('click', ()=> navMenu.classList.toggle('show'));
});
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let current = 0;

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
  }

  document.querySelector(".next").addEventListener("click", () => {
    current = (current + 1) % slides.length;
    showSlide(current);
  });

  document.querySelector(".prev").addEventListener("click", () => {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  });

  // Auto slide 5s/lần
  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 5000);
});
