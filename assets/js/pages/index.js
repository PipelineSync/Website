/* Legacy inline script 6 */
let countersStarted=false;
const counterObserver=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting && !countersStarted){countersStarted=true;document.querySelectorAll('.stat-number[data-target]').forEach(c=>{const target=parseInt(c.dataset.target,10);if(Number.isNaN(target))return;const prefix=c.dataset.prefix||'';const suffix=c.dataset.suffix||'';let cur=0;const inc=target/60;const upd=()=>{cur+=inc;if(cur<target){c.textContent=prefix+Math.floor(cur).toLocaleString()+suffix;requestAnimationFrame(upd);} else {c.textContent=prefix+target.toLocaleString()+suffix;}};upd();});}});},{threshold:0.4});
const statsSec=document.querySelector('.stats');if(statsSec) counterObserver.observe(statsSec);

/* Legacy inline script site-enhancements-script */
/* PipelineSync interaction layer */
(function(){
  'use strict';
  const doc=document;
  const body=doc.body;
  const pathPart=(location.pathname.split('/').filter(Boolean).pop()||'index').toLowerCase();
  const page=pathPart==='index'||pathPart==='index.html'?'index.html':(pathPart.endsWith('.html')?pathPart:pathPart+'.html');
  const reduceMotion=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function escapeHTML(value){
    return String(value||'').replace(/[&<>'"]/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch];});
  }
  function showToast(message){
    let toast=doc.querySelector('.site-toast');
    if(!toast){toast=doc.createElement('div');toast.className='site-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');body.appendChild(toast);}
    toast.textContent=message;
    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer=setTimeout(function(){toast.classList.remove('is-visible');},3000);
  }

  // Scroll progress, sticky-nav state and a back-to-top control.
  const progress=doc.createElement('div');
  progress.className='scroll-progress';
  progress.setAttribute('aria-hidden','true');
  body.appendChild(progress);
  const quick=doc.createElement('div');
  quick.className='site-quick-actions';
  quick.innerHTML='<button type="button" class="site-quick-top" aria-label="Back to top" title="Back to top">↑</button>';
  body.appendChild(quick);
  const topButton=quick.querySelector('.site-quick-top');
  function updateScroll(){
    const max=Math.max(1,doc.documentElement.scrollHeight-window.innerHeight);
    progress.style.width=Math.min(100,Math.max(0,(window.scrollY/max)*100))+'%';
    body.classList.toggle('has-scrolled',window.scrollY>10);
    topButton.classList.toggle('is-visible',window.scrollY>500);
  }
  window.addEventListener('scroll',updateScroll,{passive:true});
  updateScroll();
  topButton.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'});});

  // Smooth same-page anchors without hijacking real page links.
  doc.querySelectorAll('a[href^="#"]').forEach(function(anchor){
    const href=anchor.getAttribute('href');
    if(!href || href==='#') return;
    anchor.addEventListener('click',function(event){
      const target=doc.querySelector(href);
      if(!target) return;
      event.preventDefault();
      target.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'});
      if(history.replaceState) history.replaceState(null,'',href);
    });
  });

  // A lightweight details dialog powers the cards on the service, integrations,
  // resources, process and about pages without adding new dependencies.
  let detailsDialog=null;
  function closeDetails(){
    if(!detailsDialog)return;
    detailsDialog.classList.remove('is-open');
    body.classList.remove('site-dialog-open');
    const old=detailsDialog;
    detailsDialog=null;
    setTimeout(function(){if(old&&old.parentNode)old.parentNode.removeChild(old);},220);
  }
  function openDetails(title,summary,kicker,cta){
    closeDetails();
    detailsDialog=doc.createElement('div');
    detailsDialog.className='site-dialog is-open';
    detailsDialog.setAttribute('role','dialog');
    detailsDialog.setAttribute('aria-modal','true');
    detailsDialog.setAttribute('aria-label',title);
    detailsDialog.innerHTML='<div class="site-dialog-backdrop"></div><div class="site-dialog-card"><button class="site-dialog-close" type="button" aria-label="Close details">&times;</button><span class="site-dialog-kicker">'+escapeHTML(kicker||'PipelineSync')+'</span><h2>'+escapeHTML(title)+'</h2><p>'+escapeHTML(summary||'Explore how PipelineSync can make this part of your go-to-market system clearer, faster and easier to operate.')+'</p><div class="site-dialog-actions"><button type="button" class="btn btn-primary" data-site-open-form>'+escapeHTML(cta||'Book a free consultation')+'</button><button type="button" class="btn btn-outline" data-site-close-dialog>Keep browsing</button></div></div>';
    body.appendChild(detailsDialog);
    body.classList.add('site-dialog-open');
    detailsDialog.querySelector('.site-dialog-close').focus();
    detailsDialog.querySelector('.site-dialog-close').addEventListener('click',closeDetails);
    detailsDialog.querySelector('.site-dialog-backdrop').addEventListener('click',closeDetails);
    detailsDialog.querySelector('[data-site-close-dialog]').addEventListener('click',closeDetails);
  }
  doc.addEventListener('keydown',function(event){if(event.key==='Escape'){closeDetails();}});
  doc.addEventListener('click',function(event){
    const formButton=event.target.closest('[data-site-open-form]');
    if(formButton){
      event.preventDefault();
      closeDetails();
      const trigger=doc.querySelector('.js-open-hs-form');
      if(trigger){setTimeout(function(){trigger.click();},0);}else{showToast('Add your HubSpot form to enable consultations.');}
    }
  });

  function cardText(card){
    const heading=card.querySelector('h4,h3,h2');
    const paragraph=card.querySelector('p');
    const tag=card.querySelector('.tag, .section-label, [class*="tag-"]');
    return {title:heading?heading.textContent.trim():'Explore this capability',summary:paragraph?paragraph.textContent.trim():'See how this capability fits into a more connected RevOps system.',kicker:tag?tag.textContent.trim():'PipelineSync'};
  }
  function makeInteractive(selector,kicker,cta){
    doc.querySelectorAll(selector).forEach(function(card){
      if(card.dataset.interactiveReady==='true')return;
      const info=cardText(card);
      if(!info.title)return;
      card.dataset.interactiveReady='true';
      card.classList.add('interactive-card');
      card.setAttribute('role','button');
      card.setAttribute('tabindex','0');
      card.setAttribute('aria-label','Open details for '+info.title);
      function activate(event){
        const control=event.target&&event.target.closest&&event.target.closest('a,button');
        if(control){
          const href=control.getAttribute('href');
          if(control.tagName==='A' && href==='#'){event.preventDefault();}
          else{return;}
        }
        openDetails(info.title,info.summary,kicker||info.kicker,cta);
      }
      card.addEventListener('click',activate);
      card.addEventListener('keydown',function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();activate(event);}});
    });
  }

  if(page==='solutions.html'){
    makeInteractive('#services .grid-3 > .card','SERVICE DETAIL','Book a free consultation');
    makeInteractive('.timeline-step','HOW WE WORK','Book a free consultation');
  }
  if(page==='integrations.html'){
    makeInteractive('.integration-card','INTEGRATION','Book a free consultation');
  }
  if(page==='resources.html'){
    // Resource cards navigate directly to their live destinations; no generic details popup.
  }
  if(page==='about.html'){
    makeInteractive('.values > .card, .values > .badge-card','OUR APPROACH','Book a free consultation');
    doc.querySelectorAll('.lang-tag').forEach(function(tag){
      tag.setAttribute('role','button');tag.setAttribute('tabindex','0');
      function select(){tag.classList.toggle('is-selected');showToast(tag.textContent.trim()+' delivery is available.');}
      tag.addEventListener('click',select);tag.addEventListener('keydown',function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();select();}});
    });
  }
  if(page==='index.html'){
    doc.querySelectorAll('.rail-step').forEach(function(step){
      step.setAttribute('role','button');step.setAttribute('tabindex','0');
      function select(){
        doc.querySelectorAll('.rail-step').forEach(function(other){other.classList.remove('is-selected');});
        step.classList.add('is-selected');
        const label=step.querySelector('.rail-label');
        showToast((label?label.textContent.trim():'Pipeline stage')+' is part of your connected revenue system.');
      }
      step.addEventListener('click',select);step.addEventListener('keydown',function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();select();}});
    });
    makeInteractive('.hero-cards .card','WHY PIPELINESYNC','Book a free consultation');
  }

  // Resource tabs and FAQ accordions gain accessible state and deep-link support.
  doc.querySelectorAll('.tabs').forEach(function(group){
    const buttons=group.querySelectorAll('.tab-btn');
    buttons.forEach(function(button){
      button.setAttribute('role','tab');
      button.addEventListener('click',function(){
        buttons.forEach(function(item){item.setAttribute('aria-selected',item.classList.contains('active')?'true':'false');});
        if(group.id==='resourceTabs' && history.replaceState){history.replaceState(null,'','#tab-'+button.dataset.tab);}
      });
    });
    buttons.forEach(function(item){item.setAttribute('aria-selected',item.classList.contains('active')?'true':'false');});
    if(group.id==='resourceTabs' && location.hash.indexOf('#tab-')===0){
      const requested=location.hash.slice(5);
      const requestedButton=group.querySelector('[data-tab="'+requested+'"]');
      if(requestedButton)requestedButton.click();
    }
  });
  doc.querySelectorAll('.tab-content').forEach(function(panel){panel.setAttribute('role','tabpanel');});
  doc.querySelectorAll('.accordion-item').forEach(function(item){
    const header=item.querySelector('.accordion-header');
    if(!header)return;
    header.setAttribute('role','button');header.setAttribute('tabindex','0');
    function sync(){header.setAttribute('aria-expanded',item.classList.contains('active')?'true':'false');}
    sync();
    header.addEventListener('click',function(){setTimeout(sync,0);});
    header.addEventListener('keydown',function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();header.click();}});
  });

  // Small tactile feedback on buttons and tabs.
  doc.addEventListener('click',function(event){
    const button=event.target.closest('.btn,.tab-btn');
    if(!button)return;
    button.classList.remove('site-clicked');
    void button.offsetWidth;
    button.classList.add('site-clicked');
  });

  // If scripts are limited, reveal content rather than leaving it invisible.
  if(!('IntersectionObserver' in window)){doc.querySelectorAll('.reveal').forEach(function(el){el.classList.add('active');});}
})();

/* Legacy inline script home-hero-motion-script */
/* Home hero motion */
(function(){
  'use strict';
  const hero=document.querySelector('#home.hero');
  if(!hero)return;
  const visual=hero.querySelector('.hero-visual');
  const reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if(reduced)return;
  function startHero(){
    if(!visual)return;
    visual.classList.add('hero-animate','is-floating');
    const values=visual.querySelectorAll('.metric .value');
    values.forEach(function(value){
      if(value.dataset.heroCounted==='true')return;
      const target=parseInt(value.textContent,10);
      if(isNaN(target))return;
      value.dataset.heroCounted='true';
      let current=0;
      const tick=function(){
        current=Math.min(target,current+Math.max(1,Math.ceil(target/22)));
        value.textContent=current+'%';
        if(current<target)window.requestAnimationFrame(tick);
      };
      value.textContent='0%';
      window.requestAnimationFrame(tick);
    });
  }
  if(visual){
    if(visual.classList.contains('active'))startHero();
    else{
      const watch=new MutationObserver(function(){
        if(visual.classList.contains('active')){startHero();watch.disconnect();}
      });
      watch.observe(visual,{attributes:true,attributeFilter:['class']});
      window.setTimeout(startHero,900);
    }
    const stages=visual.querySelectorAll('.rail-step');
    let stage=0;
    function pulseStage(){
      stages.forEach(function(item){item.classList.remove('is-live');});
      if(stages.length){stages[stage%stages.length].classList.add('is-live');stage+=1;}
    }
    pulseStage();
    window.setInterval(function(){if(!document.hidden)pulseStage();},2600);
  }
  if(finePointer && visual){
    hero.addEventListener('pointermove',function(event){
      const rect=hero.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      visual.style.setProperty('--hero-shift-x',(x*10).toFixed(1)+'px');
      visual.style.setProperty('--hero-shift-y',(y*8).toFixed(1)+'px');
    },{passive:true});
    hero.addEventListener('pointerleave',function(){
      visual.style.setProperty('--hero-shift-x','0px');
      visual.style.setProperty('--hero-shift-y','0px');
    });
  }
})();

/* Legacy inline script trusted-logos-script */
/* Trusted-by client logo carousel */
(function(){
  'use strict';
  const carousel=document.querySelector('[data-logo-carousel]');
  if(!carousel)return;
  const track=carousel.querySelector('.logo-carousel-track');
  if(!track)return;
  const originals=Array.from(track.children);
  if(!originals.length)return;
  // Duplicate the sequence so the CSS marquee can loop with no visible reset.
  originals.forEach(function(slide){
    const clone=slide.cloneNode(true);
    clone.setAttribute('aria-hidden','true');
    clone.querySelectorAll('img').forEach(function(img){img.setAttribute('alt','');img.removeAttribute('loading');});
    track.appendChild(clone);
  });
})();

/* Legacy inline script faq-dropdown-script */
/* Accessible FAQ dropdown controls. */
(function(){
  'use strict';
  var items=document.querySelectorAll('.accordion-item');
  if(!items.length)return;
  items.forEach(function(item,index){
    var header=item.querySelector('.accordion-header');
    var body=item.querySelector('.accordion-body');
    if(!header||!body||item.dataset.faqReady==='true')return;
    var button=header;
    if(header.tagName.toLowerCase()!=='button'){
      button=document.createElement('button');
      button.className=header.className;
      button.innerHTML=header.innerHTML;
      header.replaceWith(button);
    }
    var bodyId=body.id||('faq-answer-'+(index+1));
    body.id=bodyId;
    body.setAttribute('role','region');
    button.type='button';
    button.id=bodyId+'-button';
    button.setAttribute('aria-controls',bodyId);
    button.setAttribute('aria-expanded',item.classList.contains('active')?'true':'false');
    body.setAttribute('aria-labelledby',button.id);
    item.dataset.faqReady='true';
    button.addEventListener('click',function(){
      var wasOpen=item.classList.contains('active');
      items.forEach(function(other){
        other.classList.remove('active');
        var otherButton=other.querySelector('.accordion-header');
        if(otherButton)otherButton.setAttribute('aria-expanded','false');
      });
      if(!wasOpen){
        item.classList.add('active');
        button.setAttribute('aria-expanded','true');
      }
    });
  });
})();

/* Home hero — futuristic animated deal-stage board (partials/hero-kanban.njk).
   Two actors share one board:
     1. the demo loop — a deal card travels the condensed HubSpot stages and docks
        at the top of the column it reaches, pushing that column's cards down one
        place (no column keeps a reserved empty slot: cards always start at the
        top, and a column's bottom card is clipped out of view while a deal is
        docked there);
     2. the visitor — with a mouse, any deal card can be dragged into another
        stage, and the loop keeps running while they do it.
   Stage counters, stage-weight bars and the won-this-quarter figure are all
   derived from the board's own state, so the loop and the visitor stay in sync.
   Presentational only: the whole board is aria-hidden in the markup. */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  var board = doc.querySelector('[data-hb-board]');
  if (!board) return;
  var grid = board.querySelector('[data-hb-grid]');
  var deal = board.querySelector('[data-hb-deal]');
  var link = board.querySelector('[data-hb-link]');
  var burst = board.querySelector('[data-hb-burst]');
  var wonReadout = board.querySelector('[data-hb-won-value]');
  var hint = board.querySelector('[data-hb-hint]');
  var HINT_IDLE = hint ? hint.textContent : '';
  var cols = Array.prototype.slice.call(board.querySelectorAll('[data-hb-col]'));
  if (!grid || !deal || cols.length < 2) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var stages = cols.map(function (col) {
    return {
      el: col,
      body: col.querySelector('[data-hb-body]'),
      countEl: col.querySelector('[data-hb-count]'),
      name: (((col.querySelector('.hb-col-name') || {}).textContent) || '').trim()
    };
  }).filter(function (stage) { return !!stage.body; });
  if (stages.length < 2) return;
  var lastIndex = stages.length - 1;

  var pool = [];
  try { pool = JSON.parse(board.getAttribute('data-hb-deals') || '[]') || []; } catch (err) { pool = []; }
  if (!pool.length) pool = [{ name: 'New deal', value: '$50k', owner: 'PS' }];

  var nameEl = deal.querySelector('[data-hb-deal-name]');
  var valueEl = deal.querySelector('[data-hb-deal-value]');
  var ownerEl = deal.querySelector('[data-hb-deal-owner]');
  var tagEl = deal.querySelector('[data-hb-deal-tag]');

  /* ---------- geometry: layout space, so the board's 3D tilt can't skew it ---------- */
  var points = [];
  var dealW = 0, dealH = 0;

  function offsetIn(el, rootEl) {
    var x = 0, y = 0, node = el;
    while (node && node !== rootEl) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent; }
    return node === rootEl ? { x: x, y: y } : null;
  }
  /* Displayed cards only: a card being dragged is hidden, so it leaves its column. */
  function liveCards(stage) {
    return Array.prototype.filter.call(stage.body.children, function (child) {
      return child.classList && child.classList.contains('hb-card') && child.offsetParent !== null;
    });
  }
  function measure() {
    var ref = null;
    for (var k = 0; k < stages.length && !ref; k++) {
      var list = liveCards(stages[k]);
      if (list.length) ref = list[0];
    }
    if (!ref || !ref.offsetWidth) return false;

    dealH = Math.round(ref.offsetHeight);
    dealW = Math.round(ref.offsetWidth);
    deal.style.width = dealW + 'px';
    deal.style.height = dealH + 'px';

    points = stages.map(function (stage) {
      var cs = window.getComputedStyle(stage.body);
      var gap = parseFloat(cs.rowGap || cs.gap) || 0;
      var padL = parseFloat(cs.paddingLeft) || 0;
      var padT = parseFloat(cs.paddingTop) || 0;
      var cards = liveCards(stage);
      var content = 0;
      cards.forEach(function (card) { content += card.offsetHeight; });
      content += gap * Math.max(0, cards.length - 1);

      /* Height = exactly the resting cards (content-box). Pushing them down one
         slot therefore slides the last card out of the clip box instead of
         resizing the column, so the board never changes height mid-lap. */
      stage.body.style.height = content ? Math.round(content) + 'px' : '';
      stage.body.style.setProperty('--hb-shift', (dealH + gap) + 'px');

      var p = offsetIn(stage.body, grid);
      if (!p) {
        var a = stage.body.getBoundingClientRect(), b = grid.getBoundingClientRect();
        p = { x: a.left - b.left, y: a.top - b.top };
      }
      /* Dock point = the column's first card position, i.e. the content box top-left. */
      return { x: p.x + padL, y: p.y + padT };
    });
    return true;
  }

  function place(x, y, rot) {
    deal.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)' + (rot ? ' rotate(' + rot.toFixed(2) + 'deg)' : '');
  }
  function ease(u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }

  function readValue(text) {
    return parseInt(String(text).replace(/[^0-9]/g, ''), 10) || 0;
  }

  /* ---------- derived readouts: counters, stage weights, won-this-quarter ---------- */
  var dockedIndex = -1;
  var wonTotal = parseInt(board.getAttribute('data-hb-won') || '0', 10) || 0;

  function syncShares() {
    var counts = stages.map(function (stage, k) {
      return liveCards(stage).length + (k === dockedIndex ? 1 : 0);
    });
    var total = counts.reduce(function (sum, n) { return sum + n; }, 0) || 1;
    stages.forEach(function (stage, k) {
      stage.el.style.setProperty('--hb-share', ((counts[k] / total) * 100).toFixed(1) + '%');
    });
  }
  function setCount(stage, value) {
    if (!stage.countEl || stage.countEl.textContent === String(value)) return;
    stage.countEl.textContent = value;
    stage.countEl.classList.add('is-flip');
    window.clearTimeout(stage._flipTimer);
    stage._flipTimer = window.setTimeout(function () { stage.countEl.classList.remove('is-flip'); }, 180);
  }
  function renderCounts() {
    stages.forEach(function (stage, k) {
      setCount(stage, liveCards(stage).length + (k === dockedIndex ? 1 : 0));
    });
    syncShares();
  }
  function renderWon() {
    if (wonReadout) wonReadout.textContent = '$' + wonTotal + 'k+';
  }
  /* A deal that reaches Closed Won is cashed in; dragging it back out refunds it. */
  function cashAmount(amount) {
    wonTotal += amount;
    renderWon();
  }
  function cashCard(card) {
    if (!card || card.dataset.cashed) return;
    card.dataset.cashed = '1';
    cashAmount(readValue((card.querySelector('b') || {}).textContent));
  }
  function uncashCard(card) {
    if (!card || !card.dataset.cashed) return;
    delete card.dataset.cashed;
    cashAmount(-readValue((card.querySelector('b') || {}).textContent));
  }
  function setDeal(data) {
    if (nameEl) nameEl.textContent = data.name || '';
    if (valueEl) valueEl.textContent = data.value || '';
    if (ownerEl) ownerEl.textContent = data.owner || '';
  }
  function setHint(text) {
    if (hint && hint.textContent !== text) hint.textContent = text;
  }

  /* ---------- column states: only one column makes room for a docking deal ---------- */
  function setOpen(index, on) {
    if (stages[index]) stages[index].body.classList.toggle('is-incoming', !!on);
  }
  function clearOpen() {
    stages.forEach(function (stage) { stage.body.classList.remove('is-incoming'); });
  }
  function focusStage(index) {
    stages.forEach(function (stage, k) { stage.el.classList.toggle('is-current', k === index); });
  }
  function flashStage(index) {
    var el = stages[index].el;
    el.classList.remove('is-flash');
    void el.offsetWidth;
    el.classList.add('is-flash');
  }

  /* ---------- demo loop ---------- */
  var DWELL = 2100, TRAVEL = 950, WIN_HOLD = 2500, FADE = 480, OPEN_AT = 0.72;
  var i = 0, phase = 'dwell', t = 0, dealIndex = 0, opened = false;
  var visible = true, running = false, last = 0, raf = 0;

  function dock(index) {
    clearOpen();
    focusStage(index);
    setOpen(index, true);
    dockedIndex = index;
    if (tagEl) tagEl.textContent = stages[index].name;
    place(points[index] ? points[index].x : 0, points[index] ? points[index].y : 0, 0);
    renderCounts();
  }

  function startTravel() {
    phase = 'travel';
    t = 0;
    opened = false;
    deal.classList.add('is-moving');
    setOpen(i, false);              /* the column it leaves closes back up */
    dockedIndex = -1;
    renderCounts();
    if (link) link.classList.add('is-on');
  }

  function step(dt) {
    if (!points.length) return;

    if (phase === 'dwell') {
      t += dt;
      if (t >= DWELL) {
        if (i === lastIndex) {
          phase = 'win';
          t = 0;
          deal.classList.add('is-won');
          cashAmount(readValue(valueEl ? valueEl.textContent : ''));
          flashStage(i);
          if (burst) {
            burst.style.transform = 'translate3d(' + (points[i].x + dealW / 2).toFixed(1) + 'px,' + (points[i].y + dealH / 2).toFixed(1) + 'px,0)';
            burst.classList.remove('is-on');
            void burst.offsetWidth;
            burst.classList.add('is-on');
          }
        } else {
          startTravel();
        }
      }
      return;
    }

    if (phase === 'travel') {
      t += dt;
      var u = Math.min(1, t / TRAVEL);
      var e = ease(u);
      var from = points[i], to = points[i + 1];
      var x = from.x + (to.x - from.x) * e;
      var y = from.y + (to.y - from.y) * e - Math.sin(Math.PI * u) * 16;
      place(x, y, -2.2 * Math.sin(Math.PI * u));
      if (link) {
        var startX = from.x + dealW;
        var beam = x - startX;
        if (beam > 0) {
          link.style.width = beam.toFixed(1) + 'px';
          link.style.transform = 'translate3d(' + startX.toFixed(1) + 'px,' + (from.y + dealH / 2 - 1).toFixed(1) + 'px,0)';
        } else {
          link.style.width = '0px';
        }
      }
      /* Make room in the destination just before the card lands, so it slides
         into the top place instead of on top of an occupied one. */
      if (!opened && u >= OPEN_AT) { opened = true; setOpen(i + 1, true); }
      if (u >= 1) {
        i += 1;
        phase = 'dwell';
        t = 0;
        deal.classList.remove('is-moving');
        if (link) { link.classList.remove('is-on'); link.style.width = '0px'; }
        dock(i);
        flashStage(i);
      }
      return;
    }

    if (phase === 'win') {
      t += dt;
      if (t >= WIN_HOLD) { phase = 'reset'; t = 0; deal.classList.remove('is-won', 'is-ready'); }
      return;
    }

    /* reset — the closed deal leaves the board and the next one takes the first
       stage. Every column is explicitly returned to its resting arrangement so
       Closed Won can never be left holding an empty top slot. */
    t += dt;
    if (t < FADE) return;
    dealIndex = (dealIndex + 1) % pool.length;
    i = 0;
    t = 0;
    phase = 'dwell';
    clearOpen();
    setDeal(pool[dealIndex]);
    dock(0);
    deal.classList.add('is-ready');
  }

  function frame(ts) {
    raf = window.requestAnimationFrame(frame);
    if (!last) last = ts;
    var dt = Math.min(64, ts - last);
    last = ts;
    if (!running || !visible || doc.hidden) return;
    step(dt);
  }

  /* ---------- visitor drag: move a deal card into another stage (mouse only) ---------- */
  var drag = null;
  var dragEnabled = finePointer && !reduced;

  function columnAt(x, y) {
    for (var k = 0; k < stages.length; k++) {
      var r = stages[k].el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return k;
    }
    return -1;
  }
  function stageIndexFor(el) {
    for (var k = 0; k < stages.length; k++) { if (stages[k].el === el) return k; }
    return -1;
  }
  function setDropTarget(index) {
    stages.forEach(function (stage, k) {
      stage.el.classList.toggle('is-drop-target', k === index);
      stage.body.classList.toggle('is-targeting', !!drag && k === index && k !== drag.from);
    });
  }
  function makeGhost(card) {
    var rect = card.getBoundingClientRect();
    var ghost = card.cloneNode(true);
    ghost.className = 'hb-card hb-drag-ghost' + (card.classList.contains('is-won') ? ' is-won' : '');
    ghost.style.left = rect.left + 'px';
    ghost.style.top = rect.top + 'px';
    ghost.style.width = rect.width + 'px';
    ghost.style.height = rect.height + 'px';
    doc.body.appendChild(ghost);
    return { el: ghost, rect: rect };
  }
  function dropIn(card) {
    card.classList.remove('hb-drop-in');
    void card.offsetWidth;
    card.classList.add('hb-drop-in');
    window.setTimeout(function () { card.classList.remove('hb-drop-in'); }, 460);
  }
  function moveCard(card, from, to) {
    var wasWon = card.classList.contains('is-won');
    card.style.display = '';
    stages[to].body.insertBefore(card, stages[to].body.firstChild);
    dropIn(card);

    if (to === lastIndex) {
      card.classList.add('is-won');
      if (!wasWon) cashCard(card);
    } else if (wasWon) {
      card.classList.remove('is-won');
      uncashCard(card);
    }

    /* The column that just received a new top card closes its made-room gap. */
    stages[to].body.classList.remove('is-targeting');
    renderCounts();
    flashStage(to);
    if (from !== to) flashStage(from);
  }

  function onDown(e) {
    if (!dragEnabled || drag) return;
    if (e.pointerType && e.pointerType !== 'mouse') return;
    if (e.button !== undefined && e.button !== 0) return;
    var card = e.target.closest ? e.target.closest('.hb-card') : null;
    if (!card || !grid.contains(card)) return;
    var from = stageIndexFor(card.closest('[data-hb-col]'));
    if (from < 0) return;

    var rect = card.getBoundingClientRect();
    drag = {
      card: card, from: from, target: -1, active: false,
      x0: e.clientX, y0: e.clientY,
      grabX: e.clientX - rect.left, grabY: e.clientY - rect.top,
      rect: rect, ghost: null
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('blur', onCancel);
    doc.addEventListener('keydown', onKey);
    e.preventDefault();
  }

  function onMove(e) {
    if (!drag) return;
    if (!drag.active) {
      if (Math.abs(e.clientX - drag.x0) + Math.abs(e.clientY - drag.y0) < 6) return;
      var made = makeGhost(drag.card);
      drag.active = true;
      drag.ghost = made.el;
      drag.rect = made.rect;
      drag.card.style.display = 'none';
      board.classList.add('is-dragging');
      root.classList.add('hb-dragging');
      setHint('Drop on a stage');
      renderCounts();
    }
    var left = e.clientX - drag.grabX, top = e.clientY - drag.grabY;
    drag.ghost.style.transform = 'translate3d(' + (left - drag.rect.left).toFixed(1) + 'px,' + (top - drag.rect.top).toFixed(1) + 'px,0) rotate(1.5deg) scale(1.04)';
    var target = columnAt(e.clientX, e.clientY);
    if (target !== drag.target) { drag.target = target; setDropTarget(target); }
  }

  function detach() {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
    window.removeEventListener('blur', onCancel);
    doc.removeEventListener('keydown', onKey);
  }
  function endDrag(commit) {
    if (!drag) return;
    var d = drag;
    drag = null;
    detach();
    board.classList.remove('is-dragging');
    root.classList.remove('hb-dragging');
    setDropTarget(-1);
    setHint(HINT_IDLE);

    if (!d.active) return;
    if (d.ghost) d.ghost.remove();

    if (commit && d.target >= 0 && d.target !== d.from) {
      moveCard(d.card, d.from, d.target);
      return;
    }
    /* cancelled or dropped on the stage it came from: put it back untouched */
    d.card.style.display = '';
    dropIn(d.card);
    renderCounts();
  }
  function onUp() { endDrag(true); }
  function onCancel() { endDrag(false); }
  function onKey(e) { if (e.key === 'Escape') endDrag(false); }

  if (dragEnabled) {
    grid.addEventListener('pointerdown', onDown);
    /* Hover still spotlights a stage (the loop deliberately keeps running). */
    cols.forEach(function (col) {
      col.addEventListener('pointerenter', function () {
        if (drag) return;
        board.classList.add('is-hovered');
      });
      col.addEventListener('pointerleave', function () {
        board.classList.remove('is-hovered');
      });
    });
  }

  /* ---------- start ---------- */
  function begin() {
    if (running) return;
    if (!measure()) { window.setTimeout(begin, 400); return; }
    running = true;

    if (reduced) {
      /* Static board: the card rests mid-pipeline in its own top place, no timers. */
      i = Math.max(0, Math.min(lastIndex, stages.length - 2));
      setDeal(pool[0]);
      dock(i);
      deal.classList.add('is-ready');
      return;
    }

    setDeal(pool[0]);
    dock(0);
    deal.classList.add('is-ready');
    raf = window.requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      visible = entries.some(function (entry) { return entry.isIntersecting; });
    }, { threshold: 0.12 });
    io.observe(board);
  }

  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      if (drag && drag.active) return;
      if (!measure()) return;
      var target = points[i] || points[0];
      if (target && (phase === 'dwell' || phase === 'win')) place(target.x, target.y, 0);
    }, 160);
  });

  /* Wait for the preloader, exactly like the reveal layer does, so the board
     animation is not spent behind the loading screen. */
  var loader = doc.getElementById('pipelineLoadingScreen');
  if (!loader) {
    begin();
  } else {
    var started = false;
    var go = function () { if (started) return; started = true; window.setTimeout(begin, 120); };
    var mo = new MutationObserver(function () {
      if (loader.classList.contains('is-hidden')) { mo.disconnect(); go(); }
    });
    mo.observe(loader, { attributes: true, attributeFilter: ['class'] });
    window.setTimeout(function () { mo.disconnect(); go(); }, 6000);
  }
})();
