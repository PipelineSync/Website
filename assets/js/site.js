/* PipelineSync shared site behavior: loader, header, menu, reveal, motion, modal, tabs, cursor. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  /* ---------- Loading screen ---------- */
  (function loader() {
    var screen = $('#pipelineLoadingScreen');
    if (!screen) return;
    var bar = $('#pipelineLoadingBar');
    var pct = $('#pipelineLoadingPercent');
    var status = $('#pipelineLoadingStatus');
    var messages = [status.textContent, 'We’re getting everything ready for you...', 'We’re bringing your content into view...', 'You’re almost there...'];
    var progress = 0, done = false, started = Date.now();
    var tick = setInterval(function () {
      if (done) return;
      progress = Math.min(92, progress + Math.max(1, Math.round((100 - progress) * 0.09)));
      bar.style.width = progress + '%';
      pct.textContent = progress + '%';
      status.textContent = messages[Math.min(messages.length - 1, Math.floor(progress / 25))];
    }, 110);
    function finish() {
      if (done) return;
      done = true;
      clearInterval(tick);
      bar.style.width = '100%';
      pct.textContent = '100%';
      status.textContent = 'You’re all set.';
      setTimeout(function () {
        screen.classList.add('is-hidden');
        screen.setAttribute('aria-hidden', 'true');
        doc.dispatchEvent(new CustomEvent('ps:ready'));
      }, Math.max(0, 450 - (Date.now() - started)));
    }
    // Lift the screen as soon as the HTML is parsed (not on window load) so images, fonts and
    // third-party scripts never hold the page hidden; cap at 800 ms either way.
    if (doc.readyState !== 'loading') finish();
    else doc.addEventListener('DOMContentLoaded', finish, { once: true });
    setTimeout(finish, 800);
  })();

  function onReady(fn) {
    var screen = $('#pipelineLoadingScreen');
    if (!screen || screen.classList.contains('is-hidden')) fn();
    else doc.addEventListener('ps:ready', fn, { once: true });
  }
  window.PipelineSync = { onReady: onReady, reduceMotion: reduceMotion };

  /* ---------- Header: scrolled state + sliding nav pill ---------- */
  var header = $('#siteHeader');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var nav = $('.nav');
  if (nav) {
    var pill = $('.nav__pill', nav);
    var current = $('[aria-current="page"]', nav);
    var place = function (link) {
      if (!link) { pill.style.opacity = '0'; return; }
      pill.style.width = link.offsetWidth + 'px';
      pill.style.transform = 'translateX(' + link.offsetLeft + 'px)';
      pill.style.opacity = '1';
    };
    $$('a', nav).forEach(function (link) {
      link.addEventListener('mouseenter', function () { place(link); });
      link.addEventListener('focus', function () { place(link); });
    });
    nav.addEventListener('mouseleave', function () { place(current); });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { place(current); });
    place(current);
    window.addEventListener('resize', function () { place(current); });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = $('#menuToggle');
  var menu = $('#mobileMenu');
  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('is-open', open);
      doc.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); toggle.focus(); } });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* ---------- Headline word split ---------- */
  $$('[data-split]').forEach(function (el) {
    var i = 0;
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(part)); return; }
            var span = doc.createElement('span');
            span.className = 'word';
            span.style.setProperty('--i', i++);
            span.textContent = part;
            frag.appendChild(span);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          if (child.classList.contains('gradient-text')) {
            child.classList.add('word');
            child.style.setProperty('--i', i++);
          } else walk(child);
        }
      });
    };
    walk(el);
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    el.classList.add('split-ready');
    onReady(function () { requestAnimationFrame(function () { el.classList.add('is-in'); }); });
  });

  /* ---------- Scroll reveal (auto-stagger siblings) ---------- */
  $$('[data-stagger]').forEach(function (group) {
    Array.prototype.slice.call(group.children).forEach(function (child, idx) {
      child.classList.add('reveal');
      child.style.setProperty('--d', idx % 8);
    });
  });
  var revealTargets = $$('.reveal, [data-inview]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        entry.target.dispatchEvent(new CustomEvent('ps:inview'));
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    onReady(function () { revealTargets.forEach(function (el) { io.observe(el); }); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); el.dispatchEvent(new CustomEvent('ps:inview')); });
  }

  /* ---------- Count-up numbers ---------- */
  $$('[data-count]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var render = function (v) { el.innerHTML = prefix + Math.round(v).toLocaleString('en-US') + (suffix ? '<sup>' + suffix + '</sup>' : ''); };
    if (reduceMotion) { render(target); return; }
    render(0);
    var host = el.closest('[data-inview]') || el;
    if (!host.hasAttribute('data-inview')) { host.setAttribute('data-inview', ''); if (window.IntersectionObserver) { var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { o.disconnect(); host.dispatchEvent(new CustomEvent('ps:inview')); } }); }, { threshold: .4 }); onReady(function () { o.observe(host); }); } }
    host.addEventListener('ps:inview', function () {
      var start = performance.now(), dur = 1600;
      var step = function (now) {
        var t = Math.min(1, (now - start) / dur);
        render(target * (1 - Math.pow(1 - t, 4)));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { once: true });
  });

  /* ---------- Timeline progress ---------- */
  $$('.timeline').forEach(function (tl) {
    $$('.step', tl).forEach(function (s, i) { s.style.setProperty('--i', i); });
    tl.setAttribute('data-inview', '');
    tl.addEventListener('ps:inview', function () { tl.style.setProperty('--p', 1); });
  });
  if (reduceMotion || !('IntersectionObserver' in window)) $$('.timeline').forEach(function (tl) { tl.classList.add('is-in'); tl.style.setProperty('--p', 1); });
  else {
    var tio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); e.target.style.setProperty('--p', 1); tio.unobserve(e.target); } }); }, { threshold: .35 });
    onReady(function () { $$('.timeline').forEach(function (tl) { tio.observe(tl); }); });
  }

  /* ---------- Card spotlight (pointer-follow glow) ---------- */
  if (finePointer && !reduceMotion) {
    doc.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.card');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });

    /* Magnetic primary buttons */
    $$('.btn-primary.btn-lg, [data-magnetic]').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.18;
        var y = (e.clientY - r.top - r.height / 2) * 0.28;
        btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- Tabs (with ?tab= deep links) ---------- */
  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = doc.getElementById(t.getAttribute('aria-controls'));
        if (panel) {
          panel.hidden = !on;
          if (on) { panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering'); $$('.reveal', panel).forEach(function (r) { r.classList.add('is-in'); }); }
        }
      });
      if (focus) tab.focus();
      list.dispatchEvent(new CustomEvent('ps:tab', { detail: tab.getAttribute('data-tab') }));
    };
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        select(tab);
        if (list.hasAttribute('data-sync-url')) {
          var url = new URL(window.location.href);
          url.searchParams.set('tab', tab.getAttribute('data-tab'));
          history.replaceState(null, '', url);
        }
      });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
    if (list.hasAttribute('data-sync-url')) {
      var requested = new URLSearchParams(window.location.search).get('tab');
      var match = requested && tabs.filter(function (t) { return t.getAttribute('data-tab') === requested; })[0];
      if (match) select(match);
    }
  });

  /* ---------- Whole-card links (keyboard accessible) ---------- */
  $$('[data-card-url]').forEach(function (card) {
    var url = card.getAttribute('data-card-url');
    card.addEventListener('click', function (e) {
      if (e.target.closest('a,button')) return;
      if (e.metaKey || e.ctrlKey) window.open(url, '_blank');
      else window.location.href = url;
    });
  });

  /* ---------- HubSpot consultation modal ---------- */
  var modal = $('#hsFormModal');
  if (modal) {
    var lastFocus = null;
    var closeBtn = $('.hs-modal-close', modal);
    var formScriptLoaded = false;
    var loadFormScript = function () {
      if (formScriptLoaded) return;
      formScriptLoaded = true;
      var script = doc.createElement('script');
      script.src = 'https://js-na2.hsforms.net/forms/embed/247123252.js';
      script.defer = true;
      doc.body.appendChild(script);
    };
    // Fetch the HubSpot form embed only when someone shows intent, keeping it off the critical path.
    doc.addEventListener('pointerover', function (e) { if (e.target.closest && e.target.closest('.js-open-hs-form')) loadFormScript(); }, { passive: true });
    doc.addEventListener('focusin', function (e) { if (e.target.closest && e.target.closest('.js-open-hs-form')) loadFormScript(); });
    var openModal = function (e) {
      if (e) e.preventDefault();
      loadFormScript();
      lastFocus = doc.activeElement;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      doc.body.style.overflow = 'hidden';
      setTimeout(function () { closeBtn.focus(); }, 50);
    };
    var closeModal = function () {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      doc.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    doc.addEventListener('click', function (e) {
      var trigger = e.target.closest && e.target.closest('.js-open-hs-form');
      if (trigger) openModal(e);
    });
    closeBtn.addEventListener('click', closeModal);
    $('.hs-modal-overlay', modal).addEventListener('click', closeModal);
    doc.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab') {
        var f = $$('a[href],button,iframe,input,select,textarea', modal).filter(function (el) { return el.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && doc.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && doc.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* ---------- Back to top ---------- */
  var quick = doc.createElement('div');
  quick.className = 'site-quick-actions';
  quick.setAttribute('aria-label', 'Quick actions');
  quick.innerHTML = '<button type="button" class="site-quick-top" aria-label="Back to top" title="Back to top"><i class="fa-solid fa-arrow-up" aria-hidden="true"></i></button>';
  doc.body.appendChild(quick);
  var topBtn = $('.site-quick-top', quick);
  var updateTop = function () {
    topBtn.classList.toggle('is-visible', window.scrollY > 400);
    quick.classList.toggle('is-compact', window.scrollY > 120);
  };
  window.addEventListener('scroll', updateTop, { passive: true });
  updateTop();
  topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

  /* ---------- Reading progress (long-form pages) ---------- */
  var article = $('.guide-card, .policy-card');
  if (article) {
    var bar = doc.createElement('div');
    bar.className = 'reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(bar);
    var updateBar = function () {
      var r = article.getBoundingClientRect();
      var total = r.height - window.innerHeight * 0.6;
      bar.style.setProperty('--p', Math.max(0, Math.min(1, -r.top / Math.max(1, total))));
    };
    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
  }

  /* ---------- Custom cursor (fine pointers only) ---------- */
  if (finePointer && !reduceMotion) {
    var dot = doc.createElement('div'), ring = doc.createElement('div');
    dot.className = 'cursor-dot'; ring.className = 'cursor-ring';
    dot.setAttribute('aria-hidden', 'true'); ring.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(dot); doc.body.appendChild(ring);
    doc.body.classList.add('cursor-enabled');
    var tx = -100, ty = -100, rx = -100, ry = -100, raf = 0;
    var render = function () {
      rx += (tx - rx) * 0.2; ry += (ty - ry) * 0.2;
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      raf = (Math.abs(tx - rx) > 0.1 || Math.abs(ty - ry) > 0.1) ? requestAnimationFrame(render) : 0;
    };
    var interactive = 'a,button,.card,.deal,[role="tab"],summary,input,label';
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
      doc.body.classList.add('cursor-visible');
      if (!raf) raf = requestAnimationFrame(render);
    }, { passive: true });
    doc.addEventListener('pointerover', function (e) { doc.body.classList.toggle('cursor-hover', !!(e.target.closest && e.target.closest(interactive))); });
    doc.addEventListener('pointerleave', function () { doc.body.classList.remove('cursor-visible'); });
    window.addEventListener('pointerdown', function () { doc.body.classList.add('cursor-pressed'); });
    window.addEventListener('pointerup', function () { doc.body.classList.remove('cursor-pressed'); });
    window.addEventListener('blur', function () { doc.body.classList.remove('cursor-visible'); });
  }

  root.classList.add('is-ready');
})();
