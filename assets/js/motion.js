/* PipelineSync — motion layer for the neon theme.
   Smooth scrolling (Lenis), staggered scroll reveals, hero headline split,
   parallax, pointer spotlights, magnetic buttons, scroll progress.
   Purely presentational: never changes text content. */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Keep the legacy `.reveal` blocks reliable: tall sections never reach a 12% threshold
     on small screens, which left them invisible. */
  var legacy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('active'); legacy.unobserve(e.target); } });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  doc.querySelectorAll('.reveal').forEach(function (el) { legacy.observe(el); });

  if (reduced) {
    doc.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('active'); });
    return;
  }

  /* ---------- Scroll reveals with stagger ---------- */
  var groups = [
    '.section-label', '.eyebrow', '.section h2', '.section > .container > p', '.lead',
    '.grid-2 > *', '.grid-3 > *', '.grid-4 > *', '.stats-inner > *', '.timeline > *', '.steps > *',
    '.accordion-item', '.guide-card', '.aside-card', '.policy-card', '.integration-card',
    '.logo-carousel-shell', '.home-credential-bar', '.dark-cta > .container > *', '.footer-inner > *'
  ];
  var targets = [];
  doc.querySelectorAll(groups.join(',')).forEach(function (el) {
    if (el.closest('.hero') || el.closest('.hs-modal') || el.closest('.site-roi-panel') || el.closest('.mobile-menu')) return;
    if (el.classList.contains('n-reveal')) return;
    el.classList.add('n-reveal');
    var parent = el.parentElement;
    var siblings = parent ? Array.prototype.filter.call(parent.children, function (c) { return c.classList.contains('n-reveal'); }) : [];
    var idx = Math.max(0, siblings.indexOf(el));
    el.style.setProperty('--n-delay', Math.min(idx * 0.08, 0.48) + 's');
    targets.push(el);
  });
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('n-in'); revealer.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(function (el) { revealer.observe(el); });
  // Integrations tabs re-render cards; reveal anything shown later.
  doc.addEventListener('click', function (ev) {
    if (ev.target.closest('.tab-btn')) setTimeout(function () {
      doc.querySelectorAll('.n-reveal:not(.n-in)').forEach(function (el) {
        var r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('n-in');
      });
    }, 60);
  });

  /* ---------- Hero headline word split (text preserved) ---------- */
  doc.querySelectorAll('.hero h1, .guide-hero h1').forEach(function (h1) {
    var i = 0;
    Array.prototype.slice.call(h1.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        var frag = doc.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(part)); return; }
          var s = doc.createElement('span'); s.className = 'n-word'; s.style.setProperty('--i', i++); s.textContent = part;
          frag.appendChild(s);
        });
        h1.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.tagName !== 'BR') {
        node.classList.add('n-word'); node.style.setProperty('--i', i++);
      }
    });
    if (h1.closest('.hero')) h1.classList.add('n-split');
    requestAnimationFrame(function () { setTimeout(function () { h1.classList.add('n-split-in'); }, 120); });
  });

  /* ---------- Scroll progress bar ---------- */
  var bar = doc.querySelector('.scroll-progress');
  if (!bar) {
    bar = doc.createElement('div'); bar.className = 'n-progress'; bar.setAttribute('aria-hidden', 'true');
    bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;width:100%;transform-origin:0 50%;transform:scaleX(0);z-index:10060;pointer-events:none;background:linear-gradient(90deg,#22e4ff,#8b5cf6,#ff3fd2);box-shadow:0 0 12px rgba(34,228,255,.8)';
    doc.body.appendChild(bar);
  }


  /* ---------- Process rail fill ---------- */
  var rails = Array.prototype.slice.call(doc.querySelectorAll('.n-rail .timeline, .n-rail .steps'));
  function updateRails() {
    rails.forEach(function (r) {
      var b = r.getBoundingClientRect();
      var p = (innerHeight * 0.85 - b.top) / (b.height + innerHeight * 0.35);
      r.style.setProperty('--n-progress', Math.max(0, Math.min(1, p)).toFixed(3));
    });
  }

  /* ---------- Count-up stats (final text identical to the markup) ---------- */
  var counted = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      counted.unobserve(e.target);
      var el = e.target, final = el.textContent, m = final.match(/^(\D*)(\d+)(.*)$/);
      if (!m) return;
      var target = +m[2], t0 = performance.now(), dur = 1600;
      (function tick(t) {
        var k = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - k, 4);
        el.textContent = m[1] + Math.round(target * eased) + m[3];
        if (k < 1) requestAnimationFrame(tick); else el.textContent = final;
      })(t0);
    });
  }, { threshold: 0.6 });
  doc.querySelectorAll('.stat-number').forEach(function (el) { counted.observe(el); });

  /* ---------- Parallax ---------- */
  var parallax = [];
  doc.querySelectorAll('.hero-visual, .guide-hero-inner, .hero .hero-inner').forEach(function (el, n) {
    el.classList.add('n-parallax'); parallax.push({ el: el, speed: el.classList.contains('hero-visual') ? -0.12 : 0.08 });
  });

  function onScroll(y) {
    var max = root.scrollHeight - innerHeight;
    if (bar.classList.contains('n-progress')) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    updateRails();
    if (y < innerHeight * 1.4) parallax.forEach(function (p) { p.el.style.transform = 'translate3d(0,' + (y * p.speed).toFixed(1) + 'px,0)'; });
  }

  /* ---------- Smooth scroll (Lenis, loaded from CDN; native scroll if unavailable) ---------- */
  ['.site-roi-panel', '.hs-modal', '.mobile-menu', '.site-dialog', '.logo-carousel-viewport', '.tabs'].forEach(function (sel) {
    doc.querySelectorAll(sel).forEach(function (el) { el.setAttribute('data-lenis-prevent', ''); });
  });
  function startNative() { addEventListener('scroll', function () { onScroll(scrollY); }, { passive: true }); onScroll(scrollY); }
  function startLenis() {
    if (!window.Lenis) return startNative();
    var lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, anchors: { offset: -88 }, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on('scroll', function (e) { onScroll(e.scroll); });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    // Pause smooth scrolling while overlays lock the page.
    // NOTE: only consult <body> here. Lenis adds a `lenis-stopped` class to
    // <html> (styled `overflow:hidden` in theme-neon.css), so reading the root
    // element's computed overflow would see Lenis's own lock and deadlock:
    // stop() -> root hidden -> observer still sees "locked" -> start() never runs.
    new MutationObserver(function () {
      var locked = getComputedStyle(doc.body).overflow === 'hidden';
      locked ? lenis.stop() : lenis.start();
    }).observe(doc.body, { attributes: true, attributeFilter: ['class', 'style'] });
    onScroll(scrollY);
  }
  var s = doc.createElement('script');
  s.src = 'https://unpkg.com/lenis@1.1.20/dist/lenis.min.js';
  s.async = true; s.onload = startLenis; s.onerror = startNative;
  doc.head.appendChild(s);

  if (!finePointer) return;

  /* ---------- Pointer spotlight on glass cards ---------- */
  doc.addEventListener('pointermove', function (e) {
    var card = e.target.closest && e.target.closest('.card,.stat,.metric,.badge-card,.timeline-step,.step,.integration-card');
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ---------- Hero visual tilt ---------- */
  doc.querySelectorAll('.n-visual').forEach(function (v) {
    var host = v.closest('.hero') || v;
    host.addEventListener('pointermove', function (e) {
      var r = host.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      v.style.transform = 'perspective(900px) rotateY(' + (x * 10).toFixed(2) + 'deg) rotateX(' + (-y * 10).toFixed(2) + 'deg)';
    });
    host.addEventListener('pointerleave', function () { v.style.transform = ''; });
  });

  /* ---------- Magnetic primary buttons ---------- */
  doc.querySelectorAll('.btn-primary, .hero .btn').forEach(function (btn) {
    btn.addEventListener('pointermove', function (e) {
      var r = btn.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) * 0.18, y = (e.clientY - r.top - r.height / 2) * 0.3;
      btn.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + (y - 2).toFixed(1) + 'px,0)';
    });
    btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
  });
})();
