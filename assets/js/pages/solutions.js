/* Solutions: hero stack steps through the four engagement stages. */
(function () {
  'use strict';
  var PS = window.PipelineSync || { onReady: function (f) { f(); }, reduceMotion: false };
  var items = Array.prototype.slice.call(document.querySelectorAll('#heroStack .stack__item'));
  if (!items.length) return;
  var labels = { queued: 'Queued', active: 'In progress', done: 'Done' };
  function paint(active) {
    items.forEach(function (item, i) {
      var state = i < active ? 'done' : i === active ? 'active' : 'queued';
      item.classList.toggle('is-active', state === 'active');
      item.classList.toggle('is-done', state === 'done');
      item.querySelector('.stack__status').textContent = labels[state];
    });
  }
  if (PS.reduceMotion) { paint(items.length); return; }
  var i = 0;
  PS.onReady(function () {
    paint(0);
    setInterval(function () { i = (i + 1) % (items.length + 1); paint(i); }, 1800);
  });
})();
