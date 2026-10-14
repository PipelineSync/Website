/* Integrations: category filter for the library grid. */
(function () {
  'use strict';
  var buttons = Array.prototype.slice.call(document.querySelectorAll('#categoryTabs [data-filter]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('#integrationGrid .int-card'));
  var status = document.getElementById('integrationCount');
  if (!buttons.length) return;
  function apply(filter) {
    var shown = 0;
    buttons.forEach(function (b) {
      var on = b.dataset.filter === filter;
      b.setAttribute('aria-pressed', String(on));
    });
    cards.forEach(function (card) {
      var match = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('is-hidden', !match);
      card.classList.remove('is-shown');
      if (match) {
        card.classList.add('is-in');
        card.style.setProperty('--i', shown++);
        void card.offsetWidth;
        card.classList.add('is-shown');
      }
    });
    if (status) status.textContent = shown + ' integrations shown';
  }
  buttons.forEach(function (b) { b.addEventListener('click', function () { apply(b.dataset.filter); }); });
})();
