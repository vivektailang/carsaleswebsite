/* =========================================
   MAIN JAVASCRIPT
   ========================================= */

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });
}

// Animate on scroll (Intersection Observer)
const animateElements = document.querySelectorAll('.animate-in');
if (animateElements.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animateElements.forEach(el => observer.observe(el));
}

// Counter animation
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

const counterEls = document.querySelectorAll('[data-target]');
if (counterEls.length > 0) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));
}

// Show notification
function showNotification(message, icon = '✓') {
  let notification = document.querySelector('.notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
      <div class="notification-icon">${icon}</div>
      <span class="notification-text"></span>
      <button class="notification-close" aria-label="Close">✕</button>
    `;
    document.body.appendChild(notification);
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('show');
    });
  }
  notification.querySelector('.notification-text').textContent = message;
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 3500);
}

// Wishlist / Favorite button
document.querySelectorAll('.car-action-btn[data-action="wishlist"]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.toggle('active');
    if (btn.classList.contains('active')) {
      btn.innerHTML = '♥';
      btn.style.color = '#e63946';
      showNotification('Added to your wishlist!', '♥');
    } else {
      btn.innerHTML = '♡';
      btn.style.color = '';
      showNotification('Removed from wishlist');
    }
  });
});

// Car card click to detail page
document.querySelectorAll('.car-card[data-id]').forEach(card => {
  card.addEventListener('click', () => {
    window.location.href = `car-detail.html?id=${card.dataset.id}`;
  });
});

// Range slider display
document.querySelectorAll('input[type="range"]').forEach(slider => {
  const display = slider.parentElement.querySelector('.range-max') || slider.parentElement.querySelector('.range-current');
  if (display) {
    slider.addEventListener('input', () => {
      const value = parseInt(slider.value).toLocaleString();
      if (slider.dataset.prefix) {
        display.textContent = slider.dataset.prefix + value;
      } else if (slider.dataset.suffix) {
        display.textContent = value + slider.dataset.suffix;
      } else {
        display.textContent = value;
      }
    });
  }
});

// Tab functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabGroup = btn.closest('[data-tabs]') || btn.parentElement;
    const target = btn.dataset.tab;

    tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const contentParent = btn.closest('.detail-main') || document;
    contentParent.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    const targetContent = contentParent.querySelector(`[data-tab-content="${target}"]`);
    if (targetContent) targetContent.classList.add('active');
  });
});

// Gallery thumbnail switcher
document.querySelectorAll('.thumbnail').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const gallery = thumb.closest('.detail-gallery');
    if (!gallery) return;
    
    gallery.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    
    const mainImg = gallery.querySelector('.main-image img');
    const thumbImg = thumb.querySelector('img');
    if (mainImg && thumbImg) {
      mainImg.src = thumbImg.src;
    }
  });
});

// Inventory filter form
const filterForm = document.querySelector('.filter-form');
if (filterForm) {
  const allCards = Array.from(document.querySelectorAll('.car-card'));
  
  filterForm.addEventListener('change', filterCars);

  function filterCars() {
    const make = filterForm.querySelector('[name="make"]')?.value;
    const minPrice = parseInt(filterForm.querySelector('[name="minPrice"]')?.value || '0');
    const maxPrice = parseInt(filterForm.querySelector('[name="maxPrice"]')?.value || '999999');
    const bodyType = filterForm.querySelector('[name="bodyType"]')?.value;

    allCards.forEach(card => {
      const cardMake = card.dataset.make;
      const cardPrice = parseInt(card.dataset.price || '0');
      const cardType = card.dataset.type;

      const makeMatch = !make || make === 'all' || cardMake === make;
      const priceMatch = cardPrice >= minPrice && cardPrice <= maxPrice;
      const typeMatch = !bodyType || bodyType === 'all' || cardType === bodyType;

      card.style.display = (makeMatch && priceMatch && typeMatch) ? '' : 'none';
    });

    // Update count
    const visible = allCards.filter(c => c.style.display !== 'none').length;
    const countEl = document.querySelector('.inventory-count strong');
    if (countEl) countEl.textContent = visible;
  }

  const resetBtn = document.querySelector('.filter-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      filterForm.reset();
      allCards.forEach(card => card.style.display = '');
      const countEl = document.querySelector('.inventory-count strong');
      if (countEl) countEl.textContent = allCards.length;
    });
  }
}

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      contactForm.reset();
      showNotification('Message sent! We\'ll be in touch shortly.', '✓');
    }, 1500);
  });
}

// Search form on homepage
const searchForm = document.querySelector('.search-form');
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const make = searchForm.querySelector('[name="make"]')?.value || '';
    const minPrice = searchForm.querySelector('[name="minPrice"]')?.value || '';
    const maxPrice = searchForm.querySelector('[name="maxPrice"]')?.value || '';
    const bodyType = searchForm.querySelector('[name="bodyType"]')?.value || '';
    window.location.href = `inventory.html?make=${make}&minPrice=${minPrice}&maxPrice=${maxPrice}&bodyType=${bodyType}`;
  });
}

// Active nav link
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  const linkPath = link.getAttribute('href') || '';
  if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
    link.classList.add('active');
  }
});
