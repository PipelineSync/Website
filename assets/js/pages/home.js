/* Home: hero console tilt-on-scroll and the interactive Revenue Pipeline board. */
(function () {
  'use strict';
  var PS = window.PipelineSync || { onReady: function (f) { f(); }, reduceMotion: false };
  var wrap = document.getElementById('heroConsole');
  var board = document.getElementById('heroBoard');
  if (!wrap || !board) return;
  var consoleEl = wrap.querySelector('.console');

  /* Console flattens from a tilted perspective as it scrolls into view. */
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

  var cols = Array.prototype.slice.call(board.querySelectorAll('.board__col'));
  var lists = cols.map(function (c) { return c.querySelector('.board__list'); });
  var stageNames = cols.map(function (c) { return c.getAttribute('aria-label'); });
  var resetBtn = document.getElementById('resetBoard');
  var status = document.getElementById('boardStatus');
  var modeLabel = document.getElementById('boardMode');
  var wonEl = document.getElementById('kpiWon');
  var initialHTML = lists.map(function (l) { return l.innerHTML; });
  var WON_BASE = 354; // closed revenue this quarter outside the deals shown on the board
  var queue = [
    ['Cobalt Labs', 58, 'AR'], ['Meridian Co', 84, 'JD'], ['Pine & Oak', 46, 'MK'],
    ['Sable Group', 110, 'AR'], ['Tidewater', 69, 'JD'], ['Lumen Path', 54, 'MK'],
    ['Orion Group', 39, 'MK'], ['Kestrel', 88, 'AR'], ['Solstice', 91, 'JD']
  ];
  var q = 0;

  var deals = function (list) { return Array.prototype.slice.call(list.querySelectorAll('.deal')); };
  var stageOf = function (deal) { return +deal.closest('.board__col').dataset.stage; };
  var nameOf = function (deal) { return deal.querySelector('.deal__name').textContent; };
  var announce = function (msg) { if (status) status.textContent = msg; };

  function label(deal) {
    deal.setAttribute('aria-label', nameOf(deal) + ', $' + deal.dataset.value + 'k, ' + stageNames[stageOf(deal)] + '. Use left and right arrow keys to change stage.');
  }
  function refresh() {
    var won = WON_BASE;
    cols.forEach(function (col, i) {
      var ds = deals(lists[i]);
      var sum = ds.reduce(function (a, d) { return a + (+d.dataset.value); }, 0);
      col.querySelector('.board__head b').textContent = ds.length;
      col.querySelector('.board__sum').textContent = '$' + sum + 'k';
      ds.forEach(function (d) { d.classList.toggle('is-won', i === 3); label(d); });
      if (i === 3) won += sum;
    });
    if (wonEl) wonEl.textContent = '$' + won + 'k';
  }
  function makeDeal(d) {
    var el = document.createElement('div');
    el.className = 'deal is-enter';
    el.tabIndex = 0;
    el.dataset.value = d[1];
    el.setAttribute('aria-roledescription', 'draggable deal');
    el.innerHTML = '<div class="deal__name"></div><div class="deal__meta"><span></span><span></span></div>';
    el.querySelector('.deal__name').textContent = d[0];
    el.querySelectorAll('.deal__meta span')[0].textContent = '$' + d[1] + 'k';
    el.querySelectorAll('.deal__meta span')[1].textContent = d[2];
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.remove('is-enter'); }); });
    return el;
  }
  /* Insert keeping the "Add deal" button last in Qualified. */
  function place(deal, stage, before) {
    var list = lists[stage];
    var anchor = before || (stage === 0 ? list.querySelector('.board__add') : null);
    list.insertBefore(deal, anchor);
  }
  /* FLIP so a moved card glides from its old spot. */
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
  function celebrate(deal) {
    deal.classList.remove('is-pop'); void deal.offsetWidth; deal.classList.add('is-pop');
    if (wonEl) { wonEl.classList.remove('is-bump'); void wonEl.offsetWidth; wonEl.classList.add('is-bump'); }
  }
  function moved(deal, from) {
    var to = stageOf(deal);
    refresh();
    if (to === 3 && from !== 3) { celebrate(deal); announce(nameOf(deal) + ' closed won. Won this quarter is now ' + wonEl.textContent + '.'); }
    else if (to !== from) announce(nameOf(deal) + ' moved to ' + stageNames[to] + '.');
  }

  /* ---------- Auto demo until the visitor takes over ---------- */
  var demoTimer = null, traveller = null, userMode = false;
  function takeOver() {
    if (userMode) return;
    userMode = true;
    clearInterval(demoTimer);
    if (traveller) traveller.classList.remove('is-moving');
    traveller = null;
    if (modeLabel) modeLabel.textContent = 'Your board';
    wrap.classList.add('is-user');
    resetBtn.hidden = false;
  }
  function demoStep() {
    if (document.hidden || userMode) return;
    if (!traveller) {
      traveller = makeDeal(queue[q++ % queue.length]);
      place(traveller, 0, lists[0].querySelector('.deal'));
      traveller.classList.add('is-moving');
      var extra = deals(lists[0]).slice(3);
      extra.forEach(function (d) { d.remove(); });
      refresh();
      return;
    }
    var from = stageOf(traveller);
    moveWithFlip(traveller, from + 1, lists[from + 1].querySelector('.deal'));
    if (from + 1 === 3) {
      traveller.classList.remove('is-moving');
      moved(traveller, from);
      deals(lists[3]).slice(2).forEach(function (d) { d.remove(); });
      traveller = null;
    } else {
      deals(lists[from + 1]).slice(3).forEach(function (d) { if (d !== traveller) d.remove(); });
    }
    refresh();
  }
  if (!PS.reduceMotion) PS.onReady(function () { setTimeout(function () { if (!userMode) { demoStep(); demoTimer = setInterval(demoStep, 2400); } }, 1400); });
  board.addEventListener('focusin', takeOver);

  /* ---------- Pointer drag (mouse, pen, touch) ---------- */
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
  board.addEventListener('pointerdown', function (e) {
    var deal = e.target.closest('.deal');
    if (!deal || e.button > 0) return;
    drag = { deal: deal, id: e.pointerId, x0: e.clientX, y0: e.clientY, started: false, from: stageOf(deal) };
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (!drag.started) {
      if (Math.hypot(dx, dy) < 6) return;
      takeOver();
      drag.started = true;
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
    }
    e.preventDefault();
    drag.ghost.style.transform = 'translate(' + (e.clientX - drag.ox) + 'px,' + (e.clientY - drag.oy) + 'px) rotate(-2deg) scale(1.04)';
    var col = colAt(e.clientX, e.clientY);
    cols.forEach(function (c) { c.classList.toggle('is-over', c === col); });
    /* Nudge the board sideways when dragging near its edges (phone layout scrolls). */
    var br = board.getBoundingClientRect();
    if (board.scrollWidth > board.clientWidth) {
      if (e.clientX < br.left + 40) board.scrollLeft -= 12;
      else if (e.clientX > br.right - 40) board.scrollLeft += 12;
    }
  }, { passive: false });
  function endDrag(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    var d = drag; drag = null;
    if (!d.started) return;
    cols.forEach(function (c) { c.classList.remove('is-over'); });
    document.body.classList.remove('is-dragging');
    var col = e && e.type === 'pointerup' ? colAt(e.clientX, e.clientY) : null;
    var target = col ? +col.dataset.stage : d.from;
    var gr = d.ghost.getBoundingClientRect();
    d.ghost.remove();
    d.deal.classList.remove('is-placeholder');
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
    moved(d.deal, d.from);
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  /* ---------- Keyboard: arrows change stage, up/down reorder ---------- */
  board.addEventListener('keydown', function (e) {
    var deal = e.target.closest('.deal');
    if (!deal) return;
    var from = stageOf(deal);
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      var to = from + (e.key === 'ArrowRight' ? 1 : -1);
      if (to < 0 || to > 3) return;
      e.preventDefault();
      moveWithFlip(deal, to, lists[to].querySelector('.deal'));
      deal.focus();
      moved(deal, from);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      var sibs = deals(lists[from]);
      var i = sibs.indexOf(deal);
      var j = i + (e.key === 'ArrowDown' ? 1 : -1);
      if (j < 0 || j >= sibs.length) return;
      e.preventDefault();
      moveWithFlip(deal, from, e.key === 'ArrowDown' ? sibs[j].nextElementSibling : sibs[j]);
      deal.focus();
    }
  });

  /* ---------- Add / reset ---------- */
  board.addEventListener('click', function (e) {
    if (!e.target.closest('.board__add')) return;
    takeOver();
    var d = makeDeal(queue[q++ % queue.length]);
    place(d, 0, lists[0].querySelector('.deal'));
    refresh();
    announce(nameOf(d) + ' added to Qualified.');
  });
  resetBtn.addEventListener('click', function () {
    lists.forEach(function (l, i) { l.innerHTML = initialHTML[i]; });
    refresh();
    announce('Board reset.');
  });

  refresh();
})();
