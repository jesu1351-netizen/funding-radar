document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Sticky Navbar Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
      }
    });

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }

  // Scroll Animations (Intersection Observer)
  const animElements = document.querySelectorAll('.pain-card, .feature-row, .pricing-card');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  animElements.forEach(el => {
    el.classList.add('scroll-anim'); // Add baseline animation class
    observer.observe(el);
  });

  // Counter animation for Hero section
  const counterEl = document.querySelector('.hero-title .counter');
  if (counterEl) {
    let count = 0;
    const target = parseInt(counterEl.textContent, 10) || 3;
    const duration = 2000; // 2 seconds
    const interval = Math.floor(duration / target);

    const timer = setInterval(() => {
      count++;
      counterEl.textContent = count;
      if (count >= target) {
        clearInterval(timer);
      }
    }, interval);
  }
});
