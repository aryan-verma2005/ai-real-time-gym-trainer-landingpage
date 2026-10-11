/**
 * AI-Real-time-GYM-Trainer Landing Page
 * Interactive Logic & Micro-Interactions
 * Creator: Aryan Verma
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initAngleSimulator();
  initLightbox();
  initVideoInteractions();
});

/* ===================================================================
   1. Navbar & Mobile Menu
   =================================================================== */
function initNavbar() {
  const navbar = document.getElementById('mainHeader');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      document.body.classList.toggle('mobile-nav-active');
      const isOpen = document.body.classList.contains('mobile-nav-active');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      mobileMenuBtn.textContent = isOpen ? '✕' : '☰';
    });

    // Close mobile nav on clicking any link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('mobile-nav-active');
        if (mobileMenuBtn) {
          mobileMenuBtn.textContent = '☰';
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Active navigation link tracking
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(section => observer.observe(section));
}

/* ===================================================================
   2. Scroll Reveal Animations
   =================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-up');
  
  if (!('IntersectionObserver' in window)) {
    animatedElements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

/* ===================================================================
   3. Interactive Biomechanics & Joint Angle Simulator
   =================================================================== */
function initAngleSimulator() {
  const slider = document.getElementById('kneeAngleSlider');
  const sliderDisplay = document.getElementById('sliderAngleDisplay');
  const simKneeAngle = document.getElementById('simKneeAngle');
  const simBackAngle = document.getElementById('simBackAngle');
  const simDepthStatus = document.getElementById('simDepthStatus');
  const simCoachMsg = document.getElementById('simCoachMsg');

  if (!slider) return;

  function updateSimulation(kneeDeg) {
    const angle = parseInt(kneeDeg, 10);
    if (sliderDisplay) sliderDisplay.textContent = `${angle}°`;
    if (simKneeAngle) simKneeAngle.textContent = `${angle}°`;

    // Calculate approximate torso/back flexion relative to hip displacement
    const backAngle = Math.round(180 - ((180 - angle) * 0.45));
    if (simBackAngle) simBackAngle.textContent = `${backAngle}°`;

    if (simDepthStatus && simCoachMsg) {
      simDepthStatus.className = 'status-badge';

      if (angle >= 160) {
        simDepthStatus.textContent = 'STANDING';
        simDepthStatus.classList.add('status-standing');
        simCoachMsg.innerHTML = '<strong>Coach:</strong> Ready! Begin your descent, keep chest upright.';
      } else if (angle > 105) {
        simDepthStatus.textContent = 'DEPTH: TOO HIGH';
        simDepthStatus.classList.add('status-half');
        simCoachMsg.innerHTML = '<strong>🤖 Coach:</strong> Go deeper, drive your knees, sit back—achieve full squat depth!';
      } else if (angle >= 75) {
        simDepthStatus.textContent = 'PERFECT DEPTH';
        simDepthStatus.classList.add('status-perfect');
        simCoachMsg.innerHTML = '<strong>🔥 Coach:</strong> Parallel achieved! Pull your chest up, drive through the heels!';
      } else {
        simDepthStatus.textContent = 'DEEP SQUAT';
        simDepthStatus.classList.add('status-perfect');
        simCoachMsg.innerHTML = '<strong>⚡ Coach:</strong> Maximum range reached! Ascend smoothly with upright spine.';
      }
    }
  }

  slider.addEventListener('input', (e) => {
    updateSimulation(e.target.value);
    
    // Clear active state on preset buttons when dragging custom slider
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.classList.remove('active');
    });
  });

  // Expose setSimPreset globally
  window.setSimPreset = function(angle) {
    slider.value = angle;
    updateSimulation(angle);

    // Update preset button active state
    document.querySelectorAll('.preset-btn').forEach(btn => {
      const btnAngle = parseInt(btn.getAttribute('onclick').match(/\d+/)[0], 10);
      if (btnAngle === angle) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  // Initial call
  updateSimulation(slider.value);
}

/* ===================================================================
   4. High-Res Screenshot Modal / Lightbox
   =================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const imgEl = document.getElementById('lightboxImage');
  const titleEl = document.getElementById('lightboxTitle');
  const captionEl = document.getElementById('lightboxCaption');

  if (!modal) return;

  window.openLightbox = function(src, title, caption) {
    imgEl.src = src;
    imgEl.alt = title;
    titleEl.textContent = title;
    captionEl.textContent = caption;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ===================================================================
   5. Video Showcase Interactions
   =================================================================== */
function initVideoInteractions() {
  const video = document.getElementById('demoVideo');
  const watchBtn = document.getElementById('heroWatchBtn');

  if (!video) return;

  if (watchBtn) {
    watchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const demoSection = document.getElementById('demo');
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          video.play().catch(() => {
            // Browser autoplay restrictions may require user interaction
          });
        }, 600);
      }
    });
  }

  // Pause video automatically when scrolled out of view to preserve resources
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && !video.paused) {
          video.pause();
        }
      });
    }, { threshold: 0.2 });

    videoObserver.observe(video);
  }
}
