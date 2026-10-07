/* Legacy inline script 6 */
const filterBtns=document.querySelectorAll('#categoryTabs .tab-btn');
const cards=document.querySelectorAll('.integration-card');
filterBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    const cat=btn.dataset.tab;
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    cards.forEach(c=>{
      const cCat=c.dataset.cat;
      if(cat==='all' || cCat===cat){
        c.style.display='';
        // re-trigger reveal animation
        c.classList.remove('active');
        void c.offsetWidth;
        c.classList.add('reveal','active');
      } else {
        c.style.display='none';
      }
    });
  });
});

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

/* Integrations hero: Sync monitor (partials/hero-integrations-sync.njk). Six
   curved links carry packets both ways between the HubSpot core and the tool
   pills while a console streams sync lines. At ~60% of each ~20s lap one link
   degrades (amber retry, red error, green heal); the link rotates each lap.
   Path geometry is sampled once into point tables, so the frame loop only
   writes transforms and opacity. Decorative only. */
(function () {
  'use strict';
  var doc = document;
  var board = doc.querySelector('[data-sy-board]');
  if (!board) return;
  var svg = board.querySelector('[data-sy-svg]');
  var status = board.querySelector('[data-sy-status]');
  var badge = board.querySelector('[data-sy-badge]');
  var cons = board.querySelector('[data-sy-console]');
  var links = [0, 1, 2, 3, 4, 5].map(function (i) { return board.querySelector('[data-sy-link="' + i + '"]'); });
  var tools = [0, 1, 2, 3, 4, 5].map(function (i) { return board.querySelector('[data-sy-tool="' + i + '"]'); });
  var packets = Array.prototype.slice.call(board.querySelectorAll('[data-sy-l]'));
  var lines = cons ? Array.prototype.slice.call(cons.children) : [];
  if (!svg || links.indexOf(null) >= 0 || tools.indexOf(null) >= 0 || !packets.length || lines.length < 4) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var LOOP = 20000, AT = 12000, WARN = 2200, ERR = 2000, HEAL = 1400, TICK = 1700;
  var PERIOD = [1900, 2300, 1700, 2100, 2500, 1800];
  var NAMES = ['salesforce', 'mailchimp', 'google ads', 'slack', 'quickbooks', 'zoom'];
  var N = 48, tables = [];

  function sample() {
    tables = links.map(function (p) {
      var len = 0;
      try { len = p.getTotalLength(); } catch (err) { len = 0; }
      if (!len) return null;
      var pts = [], k, pt;
      for (k = 0; k < N; k++) {
        pt = p.getPointAtLength((len * k) / (N - 1));
        pts.push([pt.x, pt.y]);
      }
      return pts;
    });
    return tables.every(Boolean);
  }

  var pmeta = packets.map(function (el) {
    return { el: el, l: parseInt(el.getAttribute('data-sy-l'), 10) || 0, d: el.getAttribute('data-sy-d') === '1' ? 1 : 0 };
  });

  function placePacket(p, u) {
    var pts = tables[p.l];
    var idx = Math.min(N - 1, Math.max(0, Math.floor(u * N)));
    p.el.style.transform = 'translate(' + pts[idx][0].toFixed(1) + 'px,' + pts[idx][1].toFixed(1) + 'px)';
    p.el.style.opacity = (0.25 + 0.75 * Math.sin(Math.PI * Math.min(1, Math.max(0, u)))).toFixed(3);
  }

  /* Reduced motion: packets parked mid-link, console as marked up. No timers. */
  if (reduced) {
    var ok = sample();
    var park = function () {
      if (!sample()) return;
      pmeta.forEach(function (p) { placePacket(p, (p.l * 0.17 + p.d * 0.5) % 1); });
    };
    if (ok) park(); else window.addEventListener('load', park, { once: true });
    return;
  }

  var buf = lines.map(function (el) { return { text: el.textContent, cls: '' }; });
  function renderCons() {
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].textContent !== buf[i].text) lines[i].textContent = buf[i].text;
      var want = buf[i].cls;
      if (lines[i]._c !== want) {
        lines[i]._c = want;
        lines[i].className = want;
      }
    }
  }
  function push(text, cls) {
    buf.push({ text: text, cls: cls || '' });
    while (buf.length > lines.length) buf.shift();
    renderCons();
  }
  function num(n) { return n.toLocaleString('en-US'); }
  function okLine(tick) {
    var a = NAMES[tick % 6], b = NAMES[(tick + 3) % 6], out = tick % 2 === 0;
    var n = 200 + ((tick * 7919) % 1800);
    var s = (0.6 + ((tick * 104729) % 40) / 10).toFixed(1);
    var unit = a === 'quickbooks' || b === 'quickbooks' ? 'invoices' : (out ? 'events' : 'records');
    return (out ? 'hubspot -> ' + a : a + ' -> hubspot') + ' \u00B7 ' + num(n) + ' ' + unit + ' \u00B7 ' + s + 's \u00B7 ok';
  }

  var CLS = ['is-warn', 'is-err', 'is-heal'];
  function clearFlags() {
    links.forEach(function (p) { p.classList.remove(CLS[0], CLS[1], CLS[2]); });
    tools.forEach(function (p) { p.classList.remove(CLS[0], CLS[1], CLS[2]); });
    badge.classList.remove(CLS[0], CLS[1], CLS[2]);
    status.classList.remove(CLS[0], CLS[1]);
  }
  function flag(list, k, cls) { if (list[k]) list[k].classList.add(cls); }

  var t = 0, last = 0, raf = 0, visible = true, running = false;
  var phase = '', tickN = 0, nextTick = 0;

  function setPhase(key, k) {
    if (key === phase) return;
    phase = key;
    clearFlags();
    if (key === 'w') {
      flag(links, k, CLS[0]); flag(tools, k, CLS[0]); badge.classList.add(CLS[0]);
      badge.textContent = 'retry 1 of 3';
      status.textContent = 'retrying ' + NAMES[k];
      status.classList.add(CLS[0]);
      push(NAMES[k] + ' -> hubspot \u00B7 retry 1 of 3', CLS[0]);
      var tool = tools[k];
      badge.style.left = tool.style.getPropertyValue('--x') || '66.4%';
      badge.style.top = tool.style.getPropertyValue('--y') || '50%';
    } else if (key === 'e') {
      flag(links, k, CLS[1]); flag(tools, k, CLS[1]); badge.classList.add(CLS[1]);
      badge.textContent = 'error \u00B7 queued';
      status.textContent = 'link error \u00B7 queued';
      status.classList.add(CLS[1]);
      push(NAMES[k] + ' -> hubspot \u00B7 error \u00B7 queued', CLS[1]);
    } else if (key === 'h') {
      flag(links, k, CLS[2]); flag(tools, k, CLS[2]); badge.classList.add(CLS[2]);
      var lp = links[k];
      lp.classList.remove(CLS[2]); void svg.offsetWidth; lp.classList.add(CLS[2]);
      badge.textContent = 'retry ok';
      status.textContent = 'healed \u00B7 queue drained';
      push(NAMES[k] + ' -> hubspot \u00B7 retry ok \u00B7 2.4s \u00B7 queue drained', CLS[2]);
    } else {
      status.textContent = 'all systems normal';
    }
  }

  function frame(ts) {
    raf = window.requestAnimationFrame(frame);
    if (!last) last = ts;
    var dt = Math.min(64, ts - last);
    last = ts;
    if (!running || !visible || doc.hidden) return;
    t += dt;
    var lt = t % LOOP, k = Math.floor(t / LOOP) % 6, i;

    if (lt < AT) setPhase('n', k);
    else if (lt < AT + WARN) setPhase('w', k);
    else if (lt < AT + WARN + ERR) setPhase('e', k);
    else if (lt < AT + WARN + ERR + HEAL) setPhase('h', k);
    else setPhase('a', k);

    if (t >= nextTick) {
      nextTick = t + TICK;
      push(okLine(tickN));
      tickN += 1;
    }

    var dark = (phase === 'w' || phase === 'e') ? k : -1;
    for (i = 0; i < pmeta.length; i++) {
      var p = pmeta[i];
      if (p.l === dark) {
        if (p.el.style.opacity !== '0') p.el.style.opacity = '0';
        continue;
      }
      var P = PERIOD[p.l];
      var u = (((t % P) / P) + p.l * 0.13 + p.d * 0.5) % 1;
      placePacket(p, p.d ? 1 - u : u);
    }
  }

  function begin() {
    if (running) return;
    if (!sample()) { window.setTimeout(begin, 400); return; }
    running = true;
    raf = window.requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      visible = entries.some(function (entry) { return entry.isIntersecting; });
    }, { threshold: 0.12 });
    io.observe(board);
  }

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
