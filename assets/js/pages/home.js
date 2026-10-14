/* Home: hero console — tilt-on-scroll, dashboard views, and the interactive Revenue Pipeline board. */
(function () {
  'use strict';
  var PS = window.PipelineSync || { onReady: function (f) { f(); }, reduceMotion: false };
  var wrap = document.getElementById('heroConsole');
  var board = document.getElementById('heroBoard');
  if (!wrap || !board) return;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var consoleEl = $('.console', wrap);

  /* ---------- Console flattens as it scrolls into view ---------- */
  if (!PS.reduceMotion) {
    var ticking = false;
    var tilt = function () {
      ticking = false;
      var r = wrap.getBoundingClientRect();
      var t = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight * 0.9)));
      consoleEl.style.setProperty('--rx', (14 * (1 - t)).toFixed(2) + 'deg');
      consoleEl.style.setProperty('--sc', (0.96 + 0.04 * t).toFixed(3));
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(tilt); } }, { passive: true });
    tilt();
  }

  /* ---------- Dashboard views ---------- */
  var viewBtns = $$('[data-view]', wrap);
  var panels = $$('[data-view-panel]', wrap);
  function showView(name) {
    viewBtns.forEach(function (b) {
      var on = b.dataset.view === name;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    panels.forEach(function (p) {
      var on = p.dataset.viewPanel === name;
      p.hidden = !on;
      if (on) { p.classList.remove('is-shown'); void p.offsetWidth; p.classList.add('is-shown'); }
    });
    if (name === 'reports') updateFunnel();
    if (name === 'pipeline') syncStageTabs();
  }
  viewBtns.forEach(function (b) { b.addEventListener('click', function () { showView(b.dataset.view); }); });

  /* ---------- Board state ---------- */
  var cols = $$('.board__col', board);
  var lists = cols.map(function (c) { return $('.board__list', c); });
  var stageNames = cols.map(function (c) { return c.getAttribute('aria-label'); });
  var stageTabs = $$('[data-stage-tab]', wrap);
  var resetBtn = $('#resetBoard');
  var status = $('#boardStatus');
  var modeLabel = $('#boardMode');
  var wonEl = $('#kpiWon');
  var openEl = $('#kpiOpen');
  var feed = $('#activityFeed');
  var initialHTML = lists.map(function (l) { return l.innerHTML; });
  var WON_BASE = 354; // closed revenue this quarter outside the deals shown on the board
  var queue = [
    ['Cobalt Labs', 58, 'AR'], ['Meridian Co', 84, 'JD'], ['Pine & Oak', 46, 'MK'],
    ['Sable Group', 110, 'AR'], ['Tidewater', 69, 'JD'], ['Lumen Path', 54, 'MK'],
    ['Orion Group', 39, 'MK'], ['Kestrel', 88, 'AR'], ['Solstice', 91, 'JD']
  ];
  var q = 0;

  var deals = function (list) { return $$('.deal', list); };
  var stageOf = function (deal) { return +deal.closest('.board__col').dataset.stage; };
  var nameOf = function (deal) { return $('.deal__name', deal).textContent; };
  var announce = function (msg) { if (status) status.textContent = msg; };

  function refresh() {
    var won = WON_BASE, open = 0;
    cols.forEach(function (col, i) {
      var ds = deals(lists[i]);
      var sum = ds.reduce(function (a, d) { return a + (+d.dataset.value); }, 0);
      $('.board__head b', col).textContent = ds.length;
      $('.board__sum', col).textContent = '$' + sum + 'k';
      if (stageTabs[i]) $('b', stageTabs[i]).textContent = ds.length;
      ds.forEach(function (d) {
        d.classList.toggle('is-won', i === 3);
        d.setAttribute('aria-label', nameOf(d) + ', $' + d.dataset.value + 'k, ' + stageNames[i] + '. Use left and right arrow keys to change stage.');
      });
      if (i === 3) won += sum; else open += sum;
    });
    if (wonEl) wonEl.textContent = '$' + won + 'k';
    if (openEl) openEl.textContent = '$' + open + 'k';
    updateFunnel();
  }
  function updateFunnel() {
    var counts = lists.map(function (l) { return deals(l).length; });
    var max = Math.max.apply(null, counts.concat(1));
    $$('[data-funnel]', wrap).forEach(function (li, i) {
      $('b', li).textContent = counts[i];
      $('.funnel__bar span', li).style.width = (counts[i] / max * 100) + '%';
    });
  }
  function log(icon, html) {
    if (!feed) return;
    var li = document.createElement('li');
    li.className = 'is-new';
    li.innerHTML = '<i class="fa-solid ' + icon + '" aria-hidden="true"></i><span>' + html + '</span><time>just now</time>';
    feed.insertBefore(li, feed.firstChild);
    $$('li', feed).forEach(function (el, i) { if (i > 0) $('time', el).textContent = i < 3 ? i * 2 + 'm' : (i - 1) + 'h'; if (i > 4) el.remove(); });
  }
  function makeDeal(d) {
    var el = document.createElement('div');
    el.className = 'deal is-enter';
    el.tabIndex = 0;
    el.dataset.value = d[1];
    el.setAttribute('aria-roledescription', 'draggable deal');
    el.innerHTML = '<div class="deal__name"></div><div class="deal__meta"><span></span><span></span></div>';
    $('.deal__name', el).textContent = d[0];
    $$('.deal__meta span', el)[0].textContent = '$' + d[1] + 'k';
    $$('.deal__meta span', el)[1].textContent = d[2];
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.remove('is-enter'); }); });
    return el;
  }
  /* Insert, keeping "Add deal" last in Qualified. */
  function place(deal, stage, before) {
    var list = lists[stage];
    list.insertBefore(deal, before || (stage === 0 ? $('.board__add', list) : null));
  }
  function moveWithFlip(deal, stage, before) {
    var first = deal.getBoundingClientRect();
    place(deal, stage, before);
    if (PS.reduceMotion) return;
    var last = deal.getBoundingClientRect();
    deal.style.transition = 'none';
    deal.style.transform = 'translate(' + (first.left - last.left) + 'px,' + (first.top - last.top) + 'px)';
    void deal.offsetWidth;
    deal.style.transition = '';
    deal.style.transform = '';
  }
  function bump(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  function moved(deal, from, byVisitor) {
    var to = stageOf(deal);
    refresh();
    if (to === from) return;
    if (to === 3) {
      bump(deal, 'is-pop'); bump(wonEl, 'is-bump');
      log('fa-trophy', '<b>' + nameOf(deal) + '</b> closed won · $' + deal.dataset.value + 'k');
      if (byVisitor) announce(nameOf(deal) + ' closed won. Won this quarter is now ' + wonEl.textContent + '.');
    } else {
      log('fa-arrow-right-arrow-left', '<b>' + nameOf(deal) + '</b> moved to ' + stageNames[to]);
      if (byVisitor) announce(nameOf(deal) + ' moved to ' + stageNames[to] + '.');
    }
  }

  /* ---------- Phone layout: stage switcher + board follows the action ---------- */
  var scrollable = function () { return board.scrollWidth > board.clientWidth + 4; };
  function setActiveTab(best) {
    stageTabs.forEach(function (t, i) { t.classList.toggle('is-active', i === best); t.setAttribute('aria-current', i === best ? 'true' : 'false'); });
    var strip = stageTabs[best] && stageTabs[best].parentNode;
    if (strip && strip.scrollWidth > strip.clientWidth) strip.scrollTo({ left: stageTabs[best].offsetLeft - strip.offsetLeft - 8, behavior: PS.reduceMotion ? 'auto' : 'smooth' });
  }
  function scrollToStage(i, smooth) {
    if (!scrollable()) return;
    setActiveTab(i);
    board.scrollTo({ left: cols[i].offsetLeft - board.offsetLeft - 2, behavior: smooth && !PS.reduceMotion ? 'smooth' : 'auto' });
  }
  function syncStageTabs() {
    var mid = board.scrollLeft + board.clientWidth / 2, best = 0, bestD = Infinity;
    cols.forEach(function (c, i) {
      var center = c.offsetLeft - board.offsetLeft + c.offsetWidth / 2;
      var d = Math.abs(center - mid);
      if (d < bestD) { bestD = d; best = i; }
    });
    if (board.scrollLeft < 8) best = 0;
    if (!stageTabs[best] || !stageTabs[best].classList.contains('is-active')) setActiveTab(best);
  }
  stageTabs.forEach(function (t, i) { t.addEventListener('click', function () { userTouched(); scrollToStage(i, true); }); });
  var syncTimer = 0;
  board.addEventListener('scroll', function () { clearTimeout(syncTimer); syncTimer = setTimeout(syncStageTabs, 120); }, { passive: true });

  /* ---------- Auto demo: keeps running, steps aside while the visitor works ---------- */
  var traveller = null, lastTouch = 0, dragging = false, everTouched = false;
  function userTouched() {
    lastTouch = Date.now();
    if (!everTouched) {
      everTouched = true;
      resetBtn.hidden = false;
      wrap.classList.add('is-user');
    }
    if (modeLabel) modeLabel.textContent = 'Paused';
  }
  var demoPaused = function () { return dragging || Date.now() - lastTouch < 5000 || board.contains(document.activeElement) && document.activeElement.classList.contains('deal'); };
  function trim(stage, max) {
    var ds = deals(lists[stage]).filter(function (d) { return d !== traveller && !d.dataset.user; });
    var extra = deals(lists[stage]).length - max;
    for (var i = ds.length - 1; i >= 0 && extra > 0; i--, extra--) {
      (function (d) { d.classList.add('is-leaving'); setTimeout(function () { d.remove(); refresh(); }, 350); })(ds[i]);
    }
  }
  function demoStep() {
    if (document.hidden) return;
    if (demoPaused()) return;
    if (modeLabel) modeLabel.textContent = 'Live';
    if (traveller && !traveller.isConnected) traveller = null;
    if (!traveller) {
      traveller = makeDeal(queue[q++ % queue.length]);
      place(traveller, 0, $('.deal', lists[0]));
      traveller.classList.add('is-moving');
      log('fa-route', '<b>' + nameOf(traveller) + '</b> qualified · routed to ' + $$('.deal__meta span', traveller)[1].textContent);
      trim(0, 4);
      refresh();
      if (Date.now() - lastTouch > 8000) scrollToStage(0, true);
      return;
    }
    var from = stageOf(traveller);
    if (from >= 3) { traveller.classList.remove('is-moving'); traveller = null; return; }
    moveWithFlip(traveller, from + 1, $('.deal', lists[from + 1]));
    if (Date.now() - lastTouch > 8000) scrollToStage(from + 1, true);
    moved(traveller, from, false);
    if (from + 1 === 3) { traveller.classList.remove('is-moving'); traveller = null; trim(3, 3); }
    else trim(from + 1, 4);
  }
  if (!PS.reduceMotion) PS.onReady(function () { setTimeout(function () { demoStep(); setInterval(demoStep, 2400); }, 1400); });
  board.addEventListener('focusin', function (e) { if (e.target.classList.contains('deal')) userTouched(); });

  /* ---------- Pointer drag with edge auto-scroll ---------- */
  var drag = null;
  function colAt(x, y) {
    var el = document.elementFromPoint(x, y);
    return el && el.closest ? el.closest('#heroBoard .board__col') : null;
  }
  function beforeAt(list, y, self) {
    var items = deals(list).filter(function (d) { return d !== self; });
    for (var i = 0; i < items.length; i++) {
      var r = items[i].getBoundingClientRect();
      if (y < r.top + r.height / 2) return items[i];
    }
    return null;
  }
  function autoScroll() {
    if (!drag || !drag.started) return;
    var br = board.getBoundingClientRect(), edge = Math.min(64, br.width * 0.18), v = 0;
    if (drag.x < br.left + edge) v = -Math.ceil((br.left + edge - drag.x) / edge * 14);
    else if (drag.x > br.right - edge) v = Math.ceil((drag.x - (br.right - edge)) / edge * 14);
    if (v && scrollable()) {
      board.scrollLeft += v;
      var col = colAt(drag.x, drag.y);
      cols.forEach(function (c) { c.classList.toggle('is-over', c === col); });
    }
    drag.raf = requestAnimationFrame(autoScroll);
  }
  board.addEventListener('pointerdown', function (e) {
    var deal = e.target.closest('.deal');
    if (!deal || e.button > 0) return;
    drag = { deal: deal, id: e.pointerId, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, started: false, from: stageOf(deal) };
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    drag.x = e.clientX; drag.y = e.clientY;
    if (!drag.started) {
      if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 6) return;
      drag.started = true; dragging = true;
      userTouched();
      if (drag.deal === traveller) { traveller.classList.remove('is-moving'); traveller = null; }
      var r = drag.deal.getBoundingClientRect();
      drag.ox = drag.x0 - r.left; drag.oy = drag.y0 - r.top;
      var ghost = drag.deal.cloneNode(true);
      ghost.className = 'deal deal--ghost' + (drag.deal.classList.contains('is-won') ? ' is-won' : '');
      ghost.removeAttribute('tabindex');
      ghost.setAttribute('aria-hidden', 'true');
      ghost.style.width = r.width + 'px';
      document.body.appendChild(ghost);
      drag.ghost = ghost;
      drag.deal.classList.add('is-placeholder');
      document.body.classList.add('is-dragging');
      board.classList.add('is-dragging');
      drag.raf = requestAnimationFrame(autoScroll);
    }
    e.preventDefault();
    drag.ghost.style.transform = 'translate(' + (e.clientX - drag.ox) + 'px,' + (e.clientY - drag.oy) + 'px) rotate(-2deg) scale(1.04)';
    var col = colAt(e.clientX, e.clientY);
    cols.forEach(function (c) { c.classList.toggle('is-over', c === col); });
  }, { passive: false });
  function endDrag(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    var d = drag; drag = null; dragging = false;
    if (!d.started) return;
    cancelAnimationFrame(d.raf);
    userTouched();
    cols.forEach(function (c) { c.classList.remove('is-over'); });
    document.body.classList.remove('is-dragging');
    board.classList.remove('is-dragging');
    var col = e.type === 'pointerup' ? colAt(e.clientX, e.clientY) : null;
    var target = col ? +col.dataset.stage : d.from;
    var gr = d.ghost.getBoundingClientRect();
    d.ghost.remove();
    d.deal.classList.remove('is-placeholder');
    d.deal.dataset.user = '1';
    var before = col ? beforeAt(lists[target], e.clientY, d.deal) : d.deal.nextElementSibling;
    place(d.deal, target, before && before.classList.contains('deal') ? before : null);
    if (!PS.reduceMotion) {
      var last = d.deal.getBoundingClientRect();
      d.deal.style.transition = 'none';
      d.deal.style.transform = 'translate(' + (gr.left - last.left) + 'px,' + (gr.top - last.top) + 'px)';
      void d.deal.offsetWidth;
      d.deal.style.transition = '';
      d.deal.style.transform = '';
    }
    moved(d.deal, d.from, true);
    scrollToStage(target, true);
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  /* ---------- Keyboard: ← → change stage, ↑ ↓ reorder ---------- */
  board.addEventListener('keydown', function (e) {
    var deal = e.target.closest('.deal');
    if (!deal) return;
    var from = stageOf(deal);
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      var to = from + (e.key === 'ArrowRight' ? 1 : -1);
      if (to < 0 || to > 3) return;
      e.preventDefault();
      userTouched();
      if (deal === traveller) { traveller.classList.remove('is-moving'); traveller = null; }
      deal.dataset.user = '1';
      moveWithFlip(deal, to, $('.deal', lists[to]));
      scrollToStage(to, true);
      deal.focus({ preventScroll: true });
      moved(deal, from, true);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      var sibs = deals(lists[from]), i = sibs.indexOf(deal), j = i + (e.key === 'ArrowDown' ? 1 : -1);
      if (j < 0 || j >= sibs.length) return;
      e.preventDefault();
      moveWithFlip(deal, from, e.key === 'ArrowDown' ? sibs[j].nextElementSibling : sibs[j]);
      deal.focus({ preventScroll: true });
    }
  });

  /* ---------- Add / reset ---------- */
  board.addEventListener('click', function (e) {
    if (!e.target.closest('.board__add')) return;
    userTouched();
    var d = makeDeal(queue[q++ % queue.length]);
    d.dataset.user = '1';
    place(d, 0, $('.deal', lists[0]));
    refresh();
    log('fa-plus', '<b>' + nameOf(d) + '</b> added to Qualified');
    announce(nameOf(d) + ' added to Qualified.');
  });
  resetBtn.addEventListener('click', function () {
    traveller = null;
    lists.forEach(function (l, i) { l.innerHTML = initialHTML[i]; });
    refresh();
    scrollToStage(0, true);
    announce('Board reset.');
  });

  /* ---------- Contacts search ---------- */
  var search = $('#contactSearch');
  if (search) {
    var rows = $$('#contactRows tr');
    var countEl = $('#contactCount');
    search.addEventListener('input', function () {
      var term = search.value.trim().toLowerCase(), shown = 0;
      rows.forEach(function (r) { var hit = r.textContent.toLowerCase().indexOf(term) > -1; r.hidden = !hit; if (hit) shown++; });
      countEl.textContent = shown + (shown === 1 ? ' contact' : ' contacts');
    });
  }

  /* ---------- Workflows: switches + live enrolment counters ---------- */
  $$('.flow .switch', wrap).forEach(function (sw) {
    sw.addEventListener('click', function () {
      var on = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', String(on));
      sw.closest('.flow').classList.toggle('is-on', on);
    });
  });
  if (!PS.reduceMotion) {
    setInterval(function () {
      if (document.hidden) return;
      var live = $$('.flow.is-on', wrap);
      if (!live.length) return;
      var flow = live[Math.floor(Math.random() * live.length)];
      var n = $('[data-enrolled]', flow);
      n.dataset.enrolled = +n.dataset.enrolled + 1 + Math.floor(Math.random() * 3);
      n.textContent = (+n.dataset.enrolled).toLocaleString('en-US');
      bump(flow, 'is-tick');
    }, 1300);
  }

  refresh();
  syncStageTabs();
})();
