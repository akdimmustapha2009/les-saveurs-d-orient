document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  window.addEventListener('load', () => {
    document.body.classList.remove('is-loading');
  });
  setTimeout(() => document.body.classList.remove('is-loading'), 1200);

  /* ---------- Header scroll state + scroll progress ---------- */
  const header = document.getElementById('site-header');
  const backToTop = document.getElementById('back-to-top');
  const scrollProgress = document.getElementById('scroll-progress');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- Scrollspy: highlight active nav link ---------- */
  const navLinks = document.querySelectorAll('.nav-link');
  const spySections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (spySections.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spySections.forEach(section => spyObserver.observe(section));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  // Safety net: some browsers throttle IntersectionObserver in background/inactive
  // tabs, which could leave content permanently invisible. Force-reveal after a delay.
  setTimeout(() => {
    revealEls.forEach(el => el.classList.add('in-view'));
  }, 2500);

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat__number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => counterObserver.observe(el));

  // Safety net: force final values if the observer never fires (see reveal note above).
  setTimeout(() => {
    counters.forEach(el => { el.textContent = el.dataset.count; });
  }, 3000);

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const wasOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  /* ---------- Testimonials slider ---------- */
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('testi-prev');
  const nextBtn = document.getElementById('testi-next');
  const dotsWrap = document.getElementById('testimonials-dots');
  if (track && prevBtn && nextBtn && dotsWrap) {
    const slides = Array.from(track.querySelectorAll('.testimonial'));
    let activeIndex = 0;
    let autoplayTimer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Aller au témoignage ' + (i + 1));
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function updateDots() {
      dots.forEach((d, i) => d.classList.toggle('is-active', i === activeIndex));
    }
    function goToSlide(i) {
      activeIndex = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[activeIndex].offsetLeft - track.offsetLeft, behavior: 'smooth' });
      updateDots();
    }
    function startAutoplay() {
      autoplayTimer = setInterval(() => goToSlide(activeIndex + 1), 5500);
    }
    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }

    nextBtn.addEventListener('click', () => { goToSlide(activeIndex + 1); stopAutoplay(); startAutoplay(); });
    prevBtn.addEventListener('click', () => { goToSlide(activeIndex - 1); stopAutoplay(); startAutoplay(); });
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);

    updateDots();
    startAutoplay();
  }

  /* ---------- Gallery lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  document.querySelectorAll('.gallery-item img, .immersion-item img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('is-open');
    });
  });
  const closeLightbox = () => lightbox.classList.remove('is-open');
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ---------- Gallery filters ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        if (match) {
          item.style.display = '';
          requestAnimationFrame(() => item.classList.remove('is-hidden'));
        } else {
          item.classList.add('is-hidden');
          setTimeout(() => {
            if (item.classList.contains('is-hidden')) item.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  /* ---------- Hero cursor glow ---------- */
  const heroEl = document.querySelector('.hero');
  const heroGlow = document.querySelector('.hero__glow');
  if (heroEl && heroGlow && window.matchMedia('(hover: hover)').matches) {
    heroEl.addEventListener('mousemove', (e) => {
      const rect = heroEl.getBoundingClientRect();
      heroGlow.style.setProperty('--x', (e.clientX - rect.left) + 'px');
      heroGlow.style.setProperty('--y', (e.clientY - rect.top) + 'px');
    });
  }

  /* ---------- Back to top ---------- */
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        feedback.textContent = 'Merci de renseigner tous les champs obligatoires.';
        feedback.style.color = '#b04b3d';
        return;
      }
      feedback.style.color = '';
      feedback.textContent = 'Merci pour votre message ! Nous reviendrons vers vous très rapidement.';
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
