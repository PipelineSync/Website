/* Home: hero console tilt-on-scroll and the live deal board. */
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
    var update = function () {
      ticking = false;
      var r = wrap.getBoundingClientRect();
      var vh = window.innerHeight;
      var t = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.9)));
      consoleEl.style.setProperty('--rx', (14 * (1 - t)).toFixed(2) + 'deg');
      consoleEl.style.setProperty('--sc', (0.96 + 0.04 * t).toFixed(3));
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  if (PS.reduceMotion) return;

  var cols = Array.prototype.slice.call(board.querySelectorAll('.board__col'));
  var wonEl = document.getElementById('kpiWon');
  var won = 486;
  var queue = [
    ['Cobalt Labs', 58, 'AR'], ['Meridian Co', 84, 'JD'], ['Pine & Oak', 46, 'MK'],
    ['Sable Group', 110, 'AR'], ['Tidewater', 69, 'JD'], ['Lumen Path', 54, 'MK']
  ];
  var q = 0;

  function count() {
    cols.forEach(function (col) { col.querySelector('.board__head b').textContent = col.querySelectorAll('.deal').length; });
  }
  function makeDeal(d) {
    var el = document.createElement('div');
    el.className = 'deal is-enter';
    el.innerHTML = '<div class="deal__name"></div><div class="deal__meta"><span></span><span></span></div>';
    el.querySelector('.deal__name').textContent = d[0];
    el.querySelectorAll('.deal__meta span')[0].textContent = '$' + d[1] + 'k';
    el.querySelectorAll('.deal__meta span')[1].textContent = d[2];
    el.dataset.value = d[1];
    return el;
  }
  /* FLIP: measure, move in the DOM, animate from the old position. */
  function moveTo(el, col) {
    var first = el.getBoundingClientRect();
    col.insertBefore(el, col.querySelector('.deal'));
    var last = el.getBoundingClientRect();
    el.style.transition = 'none';
    el.style.transform = 'translate(' + (first.left - last.left) + 'px,' + (first.top - last.top) + 'px)';
    void el.offsetWidth;
    el.style.transition = '';
    el.style.transform = '';
  }
  function trim(col, max) {
    var deals = col.querySelectorAll('.deal');
    for (var i = max; i < deals.length; i++) {
      (function (d) { d.style.opacity = '0'; setTimeout(function () { d.remove(); }, 400); })(deals[i]);
    }
  }

  var traveller = null;
  function step() {
    if (document.hidden) return;
    if (!traveller) {
      traveller = makeDeal(queue[q++ % queue.length]);
      cols[0].insertBefore(traveller, cols[0].querySelector('.deal'));
      requestAnimationFrame(function () { traveller.classList.remove('is-enter'); traveller.classList.add('is-moving'); });
      trim(cols[0], 3);
      count();
      return;
    }
    var stage = +traveller.parentNode.dataset.stage + 1;
    moveTo(traveller, cols[stage]);
    if (stage === 3) {
      var t = traveller;
      t.classList.remove('is-moving');
      t.classList.add('is-won');
      won += +t.dataset.value;
      if (wonEl) wonEl.textContent = '$' + won + 'k';
      trim(cols[3], 2);
      traveller = null;
    } else {
      trim(cols[stage], 3);
    }
    count();
  }
  PS.onReady(function () { setTimeout(function () { step(); setInterval(step, 2200); }, 1400); });
})();
