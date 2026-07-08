/* ============================================================
   LES SAVEURS D'ORIENT BY JIHANE – main.js
   ============================================================ */

// --- Navbar scroll effect ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

// --- Hamburger menu ---
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.innerHTML = isOpen
    ? '<i class="fa-solid fa-xmark" style="color:#fff;font-size:1.4rem"></i>'
    : '<span></span><span></span><span></span>';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
  });
});

// --- Back to top ---
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- FAQ accordion ---
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer   = item.querySelector('.faq-answer');
  if (!question || !answer) return;
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = null;
      }
    });
    item.classList.toggle('open', !isOpen);
    answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
  });
});

// --- Témoignages slider ---
const temoTrack = document.getElementById('temoignagesTrack');
if (temoTrack) {
  const cards = Array.from(temoTrack.querySelectorAll('.temoignage-card'));
  const dotsWrap = document.getElementById('temoDots');
  let current = 0;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'temoignage-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Témoignage ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.temoignage-dot'));

  function goTo(index) {
    cards[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + cards.length) % cards.length;
    cards[current].classList.add('active');
    dots[current].classList.add('active');
  }
  cards[0].classList.add('active');

  document.getElementById('temoPrev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('temoNext').addEventListener('click', () => goTo(current + 1));

  setInterval(() => goTo(current + 1), 6000);
}

// --- Contact form ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Message envoyé !';
    btn.style.background = 'linear-gradient(135deg, #2e7d32, #43a047)';
    btn.style.color = '#fff';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      e.target.reset();
    }, 3500);
  });
}

// ============================================================
//  SCROLL ANIMATIONS
// ============================================================
const animVariants = {
  'fade-up':    { from: 'opacity:0;transform:translateY(40px)',  to: 'opacity:1;transform:translateY(0)' },
  'fade-left':  { from: 'opacity:0;transform:translateX(-50px)', to: 'opacity:1;transform:translateX(0)' },
  'fade-right': { from: 'opacity:0;transform:translateX(50px)',  to: 'opacity:1;transform:translateX(0)' },
  'zoom-in':    { from: 'opacity:0;transform:scale(0.9)',         to: 'opacity:1;transform:scale(1)' },
};

function applyFrom(el, variant) {
  variant.from.split(';').forEach(rule => {
    const [prop, val] = rule.split(':');
    el.style[prop.trim().replace(/-([a-z])/g, (_, l) => l.toUpperCase())] = val.trim();
  });
}
function applyTo(el, variant) {
  variant.to.split(';').forEach(rule => {
    const [prop, val] = rule.split(':');
    el.style[prop.trim().replace(/-([a-z])/g, (_, l) => l.toUpperCase())] = val.trim();
  });
}

const animTargets = [
  { sel: '.section-header',    anim: 'fade-up',    delay: 0 },
  { sel: '.about-visual',      anim: 'fade-left',  delay: 0 },
  { sel: '.about-text',        anim: 'fade-right', delay: 100 },
  { sel: '.value-item',        anim: 'fade-up',    delay: 80,  stagger: true },
  { sel: '.mission-card',      anim: 'fade-up',    delay: 70,  stagger: true },
  { sel: '.solidarite-icon',   anim: 'zoom-in',    delay: 0 },
  { sel: '.public-card',       anim: 'fade-up',    delay: 60,  stagger: true },
  { sel: '.modalite-card',     anim: 'fade-up',    delay: 100, stagger: true },
  { sel: '.pourquoi-card',     anim: 'fade-up',    delay: 60,  stagger: true },
  { sel: '.programme-col',     anim: 'fade-up',    delay: 100, stagger: true },
  { sel: '.formation-card',    anim: 'fade-up',    delay: 70,  stagger: true },
  { sel: '.galerie-item',      anim: 'zoom-in',    delay: 60,  stagger: true },
  { sel: '.temoignages-slider', anim: 'fade-up',   delay: 0 },
  { sel: '.faq-item',          anim: 'fade-up',    delay: 50,  stagger: true },
  { sel: '.contact-info',      anim: 'fade-left',  delay: 0 },
  { sel: '.contact-form-wrap', anim: 'fade-right', delay: 100 },
];

const scrollObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.revealed) {
      entry.target.dataset.revealed = 'true';
      const delay = +entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.style.transition = 'opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1)';
        applyTo(entry.target, animVariants[entry.target.dataset.anim || 'fade-up']);
      }, delay);
    }
  });
}, { threshold: 0.12 });

animTargets.forEach(({ sel, anim, delay, stagger }) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.dataset.anim  = anim;
    el.dataset.delay = stagger ? delay * i : delay;
    applyFrom(el, animVariants[anim]);
    scrollObserver.observe(el);
  });
});
