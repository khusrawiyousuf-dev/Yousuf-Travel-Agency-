/* =========================================================
   YOUSUF TRAVEL AGENCY — Main JavaScript
   Vanilla ES6+ | No dependencies except Three.js (CDN)
   ========================================================= */

'use strict';

/* =========================================================
   1. LOADER
   ========================================================= */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 1200);
  }
});

/* =========================================================
   2. HEADER — Scroll shrink + Back-to-top
   ========================================================= */
const header = document.querySelector('header.site-header');
const backTop = document.getElementById('backTop');

function onScroll() {
  const y = window.scrollY;
  if (header) header.classList.toggle('scrolled', y > 40);
  if (backTop) backTop.classList.toggle('show', y > 500);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =========================================================
   3. MOBILE MENU
   ========================================================= */
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('mainNav');

if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mainNav.classList.toggle('open');
    document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mainNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (mainNav.classList.contains('open') &&
        !mainNav.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      mainNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* =========================================================
   4. ACTIVE NAV LINK
   ========================================================= */
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.main-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* =========================================================
   5. SCROLL REVEAL ANIMATIONS
   ========================================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .timeline-item').forEach(el => {
  revealObserver.observe(el);
});

/* =========================================================
   6. ANIMATED COUNTERS
   ========================================================= */
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const duration = 1800;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = (target * eased).toFixed(decimals);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toFixed(decimals) + suffix;
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* =========================================================
   7. PROJECT FILTERING
   ========================================================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.style.display = '';
        card.style.animation = 'fade-in 0.5s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* =========================================================
   8. PROJECT MODAL
   ========================================================= */
const modalOverlay = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');

function openProjectModal(data) {
  if (!modalOverlay || !modalBody) return;

  modalBody.innerHTML = `
    <div class="modal-image">
      <img src="${data.image}" alt="${data.title}" loading="lazy">
    </div>
    <div class="modal-body">
      <span class="section-eyebrow">${data.categoryLabel}</span>
      <h2>${data.title}</h2>
      <div class="modal-meta">
        <div class="modal-meta-item"><span>Client</span><strong>${data.client}</strong></div>
        <div class="modal-meta-item"><span>Year</span><strong>${data.year}</strong></div>
        <div class="modal-meta-item"><span>Duration</span><strong>${data.duration}</strong></div>
      </div>
      <p>${data.description}</p>
      <div class="modal-tech">
        ${data.tech.map(t => `<span class="project-tag">${t}</span>`).join('')}
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" onclick="showToast('success','Redirecting','Opening project case study...')">
          View Case Study <i class="fas fa-arrow-right"></i>
        </button>
        <button class="btn btn-outline" onclick="closeProjectModal()">Close</button>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

window.closeProjectModal = function () {
  if (modalOverlay) modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
};

if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) window.closeProjectModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeProjectModal();
  });
}

/* =========================================================
   9. 3D TILT EFFECT
   ========================================================= */
function applyTilt(selector, maxTilt = 10) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotY = ((x - centerX) / centerX) * maxTilt;
      const rotX = -((y - centerY) / centerY) * maxTilt;
      el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

applyTilt('.service-card', 8);
applyTilt('.project-card', 6);

/* =========================================================
   10. PARALLAX MOUSE FOLLOW (hero)
   ========================================================= */
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && window.innerWidth > 900) {
  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    const floatCards = heroVisual.querySelectorAll('.hero-float-card');
    floatCards.forEach((card, i) => {
      const depth = (i + 1) * 8;
      card.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  });
}

/* =========================================================
   11. TOAST SYSTEM
   ========================================================= */
let toastContainer;
function ensureToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

window.showToast = function (type, title, message) {
  const container = ensureToastContainer();
  const icons = { success: 'fa-check', error: 'fa-exclamation', info: 'fa-info' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="fas ${icons[type] || icons.info}"></i></div>
    <div class="toast-content">
      <h5>${title}</h5>
      <p>${message}</p>
    </div>
  `;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 4000);
};

/* =========================================================
   12. AUTH MODAL — Login / Signup
   ========================================================= */
const authModal = document.getElementById('authModal');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

function openAuth() {
  if (!authModal) return;
  authModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAuth() {
  if (!authModal) return;
  authModal.classList.remove('active');
  document.body.style.overflow = '';
}

window.openAuth = openAuth;
window.closeAuth = closeAuth;

document.querySelectorAll('[data-open-auth]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openAuth();
  });
});

if (authModal) {
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuth();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAuth();
  });
}

// Tab switching
authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    authTabs.forEach(t => t.classList.toggle('active', t === tab));
    authForms.forEach(form => {
      form.classList.toggle('active', form.id === `${target}Form`);
    });
  });
});

/* =========================================================
   13. PASSWORD VISIBILITY TOGGLE
   ========================================================= */
document.querySelectorAll('.password-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.parentElement.querySelector('input');
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.innerHTML = show ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
  });
});

/* =========================================================
   14. VALIDATION HELPERS
   ========================================================= */
function setError(input, message) {
  const group = input.closest('.form-group');
  if (!group) return;
  input.classList.add('error');
  let errEl = group.querySelector('.form-error');
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.className = 'form-error';
    group.appendChild(errEl);
  }
  errEl.textContent = message;
  errEl.classList.add('show');
}

function clearError(input) {
  const group = input.closest('.form-group');
  if (!group) return;
  input.classList.remove('error');
  const errEl = group.querySelector('.form-error');
  if (errEl) errEl.classList.remove('show');
}

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

/* =========================================================
   15. LOGIN FORM
   ========================================================= */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('[name="loginEmail"]');
    const pass = loginForm.querySelector('[name="loginPassword"]');
    let ok = true;

    clearError(email); clearError(pass);

    if (!email.value.trim()) { setError(email, 'Email is required'); ok = false; }
    else if (!isEmail(email.value.trim())) { setError(email, 'Please enter a valid email'); ok = false; }

    if (!pass.value) { setError(pass, 'Password is required'); ok = false; }
    else if (pass.value.length < 6) { setError(pass, 'Minimum 6 characters'); ok = false; }

    if (!ok) return;

    showToast('success', 'Welcome back!', 'You have been logged in successfully.');
    loginForm.reset();
    setTimeout(closeAuth, 900);
  });

  loginForm.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', () => clearError(inp));
  });
}

/* =========================================================
   16. SIGNUP FORM
   ========================================================= */
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = signupForm.querySelector('[name="signupName"]');
    const email = signupForm.querySelector('[name="signupEmail"]');
    const pass = signupForm.querySelector('[name="signupPassword"]');
    const confirm = signupForm.querySelector('[name="signupConfirm"]');
    let ok = true;

    [name, email, pass, confirm].forEach(clearError);

    if (!name.value.trim()) { setError(name, 'Full name required'); ok = false; }
    else if (name.value.trim().length < 2) { setError(name, 'Name too short'); ok = false; }

    if (!email.value.trim()) { setError(email, 'Email required'); ok = false; }
    else if (!isEmail(email.value.trim())) { setError(email, 'Invalid email'); ok = false; }

    if (!pass.value) { setError(pass, 'Password required'); ok = false; }
    else if (pass.value.length < 6) { setError(pass, 'Minimum 6 characters'); ok = false; }

    if (!confirm.value) { setError(confirm, 'Please confirm password'); ok = false; }
    else if (confirm.value !== pass.value) { setError(confirm, 'Passwords do not match'); ok = false; }

    if (!ok) return;

    showToast('success', 'Account Created', `Welcome aboard, ${name.value.trim()}!`);
    signupForm.reset();
    setTimeout(closeAuth, 900);
  });

  signupForm.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', () => clearError(inp));
  });
}

/* =========================================================
   17. CONTACT FORM VALIDATION
   ========================================================= */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('[name="name"]');
    const email = contactForm.querySelector('[name="email"]');
    const subject = contactForm.querySelector('[name="subject"]');
    const message = contactForm.querySelector('[name="message"]');
    let ok = true;

    [name, email, subject, message].forEach(clearError);

    if (!name.value.trim()) { setError(name, 'Please enter your name'); ok = false; }
    if (!email.value.trim()) { setError(email, 'Please enter your email'); ok = false; }
    else if (!isEmail(email.value.trim())) { setError(email, 'Invalid email format'); ok = false; }
    if (!subject.value.trim()) { setError(subject, 'Please enter a subject'); ok = false; }
    if (!message.value.trim()) { setError(message, 'Please enter a message'); ok = false; }
    else if (message.value.trim().length < 10) { setError(message, 'Message is too short'); ok = false; }

    if (!ok) return;

    const successEl = document.getElementById('contactSuccess');
    if (successEl) {
      successEl.classList.add('show');
      setTimeout(() => successEl.classList.remove('show'), 6000);
    }
    showToast('success', 'Message Sent', 'We will get back to you within 24 hours.');
    contactForm.reset();
  });

  contactForm.querySelectorAll('input, textarea').forEach(inp => {
    inp.addEventListener('input', () => clearError(inp));
  });
}

/* =========================================================
   18. SMOOTH SCROLL FOR ANCHOR LINKS
   ========================================================= */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.length > 1 && href !== '#') {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

/* =========================================================
   19. THREE.JS — HERO 3D VISUAL (Home page only)
   ========================================================= */
function initHeroThree() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55, canvas.clientWidth / canvas.clientHeight, 0.1, 1000
  );
  camera.position.z = 5.2;

  const renderer = new THREE.WebGLRenderer({
    canvas, alpha: true, antialias: true, powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  // Lights
  scene.add(new THREE.AmbientLight(0x2f6bff, 0.9));
  const l1 = new THREE.PointLight(0x00e5ff, 2.2, 30);
  l1.position.set(4, 3, 5);
  scene.add(l1);
  const l2 = new THREE.PointLight(0x7b2cbf, 1.6, 30);
  l2.position.set(-5, -3, 3);
  scene.add(l2);

  // Main Icosahedron (core)
  const coreGeo = new THREE.IcosahedronGeometry(1.55, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x0a1a36,
    emissive: 0x003a5c,
    emissiveIntensity: 0.7,
    metalness: 0.9,
    roughness: 0.25,
    flatShading: true,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  // Wireframe outer shell
  const shellGeo = new THREE.IcosahedronGeometry(2.25, 1);
  const shellMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    wireframe: true,
    transparent: true,
    opacity: 0.28,
  });
  const shell = new THREE.Mesh(shellGeo, shellMat);
  scene.add(shell);

  // Outer ring
  const ringGeo = new THREE.TorusGeometry(2.85, 0.012, 8, 100);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff, transparent: true, opacity: 0.6,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.4;
  scene.add(ring);

  const ring2 = new THREE.Mesh(ringGeo.clone(), new THREE.MeshBasicMaterial({
    color: 0x7b2cbf, transparent: true, opacity: 0.45,
  }));
  ring2.scale.setScalar(1.15);
  ring2.rotation.x = -Math.PI / 3;
  ring2.rotation.y = Math.PI / 3;
  scene.add(ring2);

  // Particles
  const particleCount = 420;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const c1 = new THREE.Color(0x00e5ff);
  const c2 = new THREE.Color(0x2f6bff);

  for (let i = 0; i < particleCount; i++) {
    const r = 3 + Math.random() * 4.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    const mixed = c1.clone().lerp(c2, Math.random());
    colors[i * 3] = mixed.r;
    colors[i * 3 + 1] = mixed.g;
    colors[i * 3 + 2] = mixed.b;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Mouse interaction
  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  });

  // Resize
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);

  // Animate
  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    requestAnimationFrame(animate);

    target.x += (mouse.x - target.x) * 0.05;
    target.y += (mouse.y - target.y) * 0.05;

    core.rotation.y = t * 0.35 + target.x * 0.9;
    core.rotation.x = t * 0.22 + target.y * 0.7;
    shell.rotation.y = -t * 0.25 + target.x * 0.6;
    shell.rotation.x = t * 0.18 + target.y * 0.5;

    ring.rotation.z = t * 0.4 + target.x * 0.3;
    ring2.rotation.z = -t * 0.35 + target.y * 0.3;

    particles.rotation.y = t * 0.08;
    particles.rotation.x = t * 0.04;

    renderer.render(scene, camera);
  }
  animate();
}

document.addEventListener('DOMContentLoaded', initHeroThree);

/* =========================================================
   20. SERVICE "LEARN MORE" INTERACTION
   ========================================================= */
document.querySelectorAll('.service-link').forEach(btn => {
  btn.addEventListener('click', () => {
    const title = btn.closest('.service-card')?.querySelector('h3')?.textContent || 'Service';
    showToast('info', title, 'Detailed service information is coming soon.');
  });
});

/* =========================================================
   21. CONSOLE SIGNATURE
   ========================================================= */
console.log(
  '%c◆ YOUSUF TRAVEL AGENCY %c— Beyond the Horizon',
  'color:#00e5ff;font-weight:bold;font-size:14px;',
  'color:#7b2cbf;font-size:12px;'
);