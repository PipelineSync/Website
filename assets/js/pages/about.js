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

/* About hero — Coverage ring (partials/hero-about-ring.njk).
   Two counter-rotating rings of role chips around a glass core; a radar sweep
   lights each chip it passes and drops its role into the readout. Below, an
   office-hours marker traverses its strip and three credential counters tick
   up once, then re-tick one digit every third lap. Rotation is applied
   through CSS custom properties so the per-frame work is a few var writes;
   chip radii are cqw units, so no measuring or resize handling is needed.
   Automatic and decorative only: aria-hidden in the markup, no interaction. */
(function () {
  'use strict';
  var doc = document;
  var stage = doc.querySelector('[data-ha-stage]');
  if (!stage) return;
  var chips = Array.prototype.slice.call(stage.querySelectorAll('[data-ha-chip]'));
  var readout = stage.querySelector('[data-ha-readout]');
  var marker = stage.parentNode ? stage.parentNode.querySelector('[data-ha-mk]') : null;
  var counts = Array.prototype.slice.call(doc.querySelectorAll('[data-ha-count]'));
  if (!chips.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var LAP = 16000, SWEEP = 9000, MARK = 12000;
  var bases = chips.map(function (chip) {
    var raw = (chip.style.getPropertyValue('--ha-a') || '0').replace('deg', '');
    return {
      el: chip,
      ring: chip.getAttribute('data-ha-ring') === '1' ? 1 : 0,
      base: parseFloat(raw) || 0,
      role: chip.getAttribute('data-role') || ''
    };
  });

  function norm(d) { d %= 360; return d < 0 ? d + 360 : d; }
  function diff(a, b) { var d = Math.abs(norm(a) - norm(b)) % 360; return d > 180 ? 360 - d : d; }

  var litEl = null;
  function light(sweep, r0, r1) {
    var best = null, bestD = 16;
    for (var k = 0; k < bases.length; k++) {
      var c = bases[k];
      var d = diff(c.base + (c.ring ? r1 : r0), sweep);
      if (d < bestD) { bestD = d; best = c; }
    }
    if (best && best.el !== litEl) {
      if (litEl) litEl.classList.remove('is-lit');
      litEl = best.el;
      litEl.classList.add('is-lit');
      if (readout && readout.textContent !== best.role) readout.textContent = best.role;
    } else if (!best && litEl) {
      litEl.classList.remove('is-lit');
      litEl = null;
    }
  }

  /* Reduced motion: one synchronous composed frame — no timers, no RAF. */
  if (reduced) {
    stage.style.setProperty('--ha-r0', '18deg');
    stage.style.setProperty('--ha-r1', '-24deg');
    stage.style.setProperty('--ha-sw', '120deg');
    if (marker) marker.style.setProperty('--ha-mk', '62%');
    light(120, 18, -24);
    return;
  }

  var targets = counts.map(function (el) { return parseInt(el.getAttribute('data-ha-count'), 10) || 0; });
  var t = 0, last = 0, raf = 0, visible = true, running = false;
  var lap = -1, retick = 0, retickEl = null, retickUntil = 0, countT0 = -1;

  function step(dt) {
    t += dt;
    var r0 = (t / LAP) * 360, r1 = -(t / LAP) * 360, sw = (t / SWEEP) * 360;
    stage.style.setProperty('--ha-r0', r0.toFixed(2) + 'deg');
    stage.style.setProperty('--ha-r1', r1.toFixed(2) + 'deg');
    stage.style.setProperty('--ha-sw', sw.toFixed(2) + 'deg');
    light(sw, r0, r1);
    if (marker) marker.style.setProperty('--ha-mk', (((t % MARK) / MARK) * 100).toFixed(2) + '%');

    /* Credential counters: up once on first entry, then hold. */
    if (countT0 < 0) countT0 = t;
    var ce = t - countT0;
    for (var c = 0; c < counts.length; c++) {
      var p = Math.min(1, Math.max(0, (ce - c * 150) / 1200));
      var v = Math.round(targets[c] * (1 - Math.pow(1 - p, 3)));
      if (counts[c]._v !== v) { counts[c]._v = v; counts[c].textContent = String(v); }
    }

    /* Every third lap, one digit re-ticks and settles back. */
    var L = Math.floor(t / LAP);
    if (L !== lap) {
      lap = L;
      if (L > 0 && L % 3 === 0 && counts.length && ce > 2200) {
        retickEl = counts[retick % counts.length];
        retick += 1;
        retickUntil = t + 450;
        var tv = parseInt(retickEl.getAttribute('data-ha-count'), 10) || 0;
        retickEl.textContent = String(Math.max(0, tv - 1));
        retickEl.classList.add('is-tick');
      }
    }
    if (retickEl && t >= retickUntil) {
      retickEl.textContent = String(parseInt(retickEl.getAttribute('data-ha-count'), 10) || 0);
      retickEl.classList.remove('is-tick');
      retickEl = null;
    }
  }

  function frame(ts) {
    raf = window.requestAnimationFrame(frame);
    if (!last) last = ts;
    var dt = Math.min(64, ts - last);
    last = ts;
    if (!running || !visible || doc.hidden) return;
    step(dt);
  }

  function begin() {
    if (running) return;
    running = true;
    raf = window.requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      visible = entries.some(function (entry) { return entry.isIntersecting; });
    }, { threshold: 0.12 });
    io.observe(stage);
  }

  /* Wait for the preloader so the loop is not spent behind the loading screen. */
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
