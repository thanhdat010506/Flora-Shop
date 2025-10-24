document.addEventListener('DOMContentLoaded', () => {
  // year
  document.getElementById('year')?.textContent = new Date().getFullYear();
  document.getElementById('year2')?.textContent = new Date().getFullYear();

  // nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // reveal on scroll using IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('revealed');
    });
  }, {threshold: 0.12});

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // small hero parallax on mouse move for desktop
  const hero = document.querySelector('.hero-image');
  if (hero && window.innerWidth > 900) {
    document.querySelector('.hero').addEventListener('mousemove', (ev) => {
      const rect = ev.currentTarget.getBoundingClientRect();
      const x = (ev.clientX - rect.left) / rect.width - 0.5;
      const y = (ev.clientY - rect.top) / rect.height - 0.5;
      hero.style.transform = `translate(${x*8}px, ${y*8}px)`;
    });
    document.querySelector('.hero').addEventListener('mouseleave', () => hero.style.transform = 'translate(0,0)');
  }

  // Products: sample data + pagination (3x3)
  const sampleProducts = [];
  for (let i=1;i<=18;i++){
    sampleProducts.push({
      id: i,
      title: `Bó hoa mẫu ${i}`,
      desc: `Bó hoa tươi đẹp, phù hợp làm quà (#${i})`,
      price: (250000 + i*5000).toLocaleString('vi-VN') + '₫',
      img: `https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60&ixid=${i}`
    });
  }

  const perPage = 9;
  let currentPage = 1;
  const grid = document.getElementById('productGrid');
  const pagination = document.getElementById('pagination');

  function renderProducts(page=1){
    currentPage = page;
    const start = (page-1)*perPage;
    const slice = sampleProducts.slice(start, start+perPage);
    grid.innerHTML = slice.map(p => `
      <article class="card">
        <img loading="lazy" src="${p.img}" alt="${p.title}">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        <div class="price">${p.price}</div>
      </article>
    `).join('');
    renderPagination();
  }

  function renderPagination(){
    const total = Math.ceil(sampleProducts.length / perPage);
    pagination.innerHTML = '';
    for (let i=1;i<=total;i++){
      const btn = document.createElement('button');
      btn.className = 'page-btn';
      btn.textContent = i;
      if (i===currentPage) btn.style.fontWeight = '700';
      btn.addEventListener('click', () => renderProducts(i));
      pagination.appendChild(btn);
    }
  }

  renderProducts(1);

  // Newsletter tiny feedback
  document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    alert(`Cảm ơn ${email}! Bạn đã đăng ký nhận tin.`);
    e.target.reset();
  });

  // Accessibility: close mobile nav when clicking outside
  document.addEventListener('click', (ev) => {
    if (!navToggle) return;
    if (!ev.target.closest('.nav')) navLinks.classList.remove('open');
  });
});

