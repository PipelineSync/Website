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

/* ==========================================================================
   Futuristic Interactive CRM Kanban Pipeline (Hero Visual)
   ========================================================================== */
(function() {
  'use strict';

  var kanban = document.getElementById('heroKanban');
  if (!kanban) return;

  var stages = ['qualified', 'architecture', 'closed-won'];
  var stageNames = {
    'qualified': 'Qualified',
    'architecture': 'Architecture',
    'closed-won': 'Closed Won'
  };

  var defaultDistribution = {
    'deal-apex': 'qualified',
    'deal-nova': 'qualified',
    'deal-fintech': 'architecture',
    'deal-vanguard': 'architecture',
    'deal-aero': 'closed-won'
  };

  var dropzones = {};
  stages.forEach(function(s) {
    dropzones[s] = kanban.querySelector('[data-dropzone="' + s + '"]');
  });

  var countEl = kanban.querySelector('[data-kanban-count]');
  var totalEl = kanban.querySelector('[data-kanban-total]');
  var feedText = kanban.querySelector('[data-hud-feed-text]');
  var simToggleBtn = kanban.querySelector('[data-sim-toggle]');
  var resetBtn = kanban.querySelector('[data-kanban-reset]');
  var visualHost = kanban.closest('.n-visual-kanban');

  var autoFlowActive = true;
  var userInteractedUntil = 0;
  var alertTimeout = null;

  function formatMoney(num) {
    return '$' + num.toLocaleString('en-US');
  }

  function formatShortMoney(num) {
    if (num >= 1000) return '$' + Math.round(num / 1000) + 'k';
    return '$' + num;
  }

  function logTelemetry(msg, isWon) {
    if (!feedText) return;
    feedText.textContent = msg;
    feedText.classList.toggle('is-alert', !!isWon);
    clearTimeout(alertTimeout);
    alertTimeout = setTimeout(function() {
      feedText.classList.remove('is-alert');
    }, 3500);
  }

  function pauseAutoFlow(seconds) {
    userInteractedUntil = Date.now() + ((seconds || 10) * 1000);
  }

  function spawnSparks(card) {
    var rect = card.getBoundingClientRect();
    var kanbanRect = kanban.getBoundingClientRect();
    var centerX = (rect.left + rect.width / 2) - kanbanRect.left;
    var centerY = (rect.top + rect.height / 2) - kanbanRect.top;

    var colors = ['#4ade80', '#22e4ff', '#8b5cf6', '#ffffff'];
    for (var i = 0; i < 12; i++) {
      var spark = document.createElement('span');
      spark.className = 'kanban-spark';
      var angle = (Math.PI * 2 * i) / 12 + (Math.random() * 0.4 - 0.2);
      var dist = 30 + Math.random() * 45;
      var dx = Math.cos(angle) * dist + 'px';
      var dy = Math.sin(angle) * dist + 'px';

      spark.style.left = centerX + 'px';
      spark.style.top = centerY + 'px';
      spark.style.setProperty('--dx', dx);
      spark.style.setProperty('--dy', dy);
      spark.style.background = colors[i % colors.length];
      spark.style.boxShadow = '0 0 8px ' + colors[i % colors.length];

      kanban.appendChild(spark);
      (function(s) {
        setTimeout(function() {
          if (s.parentNode) s.parentNode.removeChild(s);
        }, 900);
      })(spark);
    }
  }

  function updatePipelineTotals() {
    var grandTotal = 0;
    var grandCount = 0;

    stages.forEach(function(s, stageIdx) {
      var dz = dropzones[s];
      if (!dz) return;
      var cards = dz.querySelectorAll('.deal-card');
      var stageTotal = 0;

      cards.forEach(function(card) {
        var amt = parseInt(card.dataset.amount, 10) || 0;
        stageTotal += amt;
        grandTotal += amt;
        grandCount++;

        // Update card attributes and buttons
        card.dataset.stage = s;
        var prevBtn = card.querySelector('.btn-prev');
        var nextBtn = card.querySelector('.btn-next');
        if (prevBtn) prevBtn.disabled = (stageIdx === 0);
        if (nextBtn) nextBtn.disabled = (stageIdx === stages.length - 1);

        if (s === 'closed-won') {
          card.classList.add('is-won');
          var wonTag = card.querySelector('.tag-won');
          if (wonTag) wonTag.style.display = '';
        } else {
          card.classList.remove('is-won');
        }
      });

      var countBadge = kanban.querySelector('[data-col-count="' + s + '"]');
      var valBadge = kanban.querySelector('[data-col-val="' + s + '"]');
      if (countBadge) countBadge.textContent = cards.length;
      if (valBadge) valBadge.textContent = formatMoney(stageTotal);
    });

    if (totalEl) totalEl.textContent = formatMoney(grandTotal);
    if (countEl) countEl.textContent = grandCount + (grandCount === 1 ? ' deal' : ' deals');
  }

  function moveDeal(card, targetStage, options) {
    if (!card) return;
    var currentStage = card.dataset.stage;
    if (currentStage === targetStage) return;

    var targetDropzone = dropzones[targetStage];
    if (!targetDropzone) return;

    var opts = options || {};
    var isWon = (targetStage === 'closed-won');
    var dealName = card.querySelector('.deal-name') ? card.querySelector('.deal-name').textContent.trim() : 'Deal';
    var dealAmt = parseInt(card.dataset.amount, 10) || 0;

    // Reparent into new dropzone
    targetDropzone.appendChild(card);
    card.dataset.stage = targetStage;
    card.classList.remove('just-moved');
    void card.offsetWidth; // force reflow for animation
    card.classList.add('just-moved');

    updatePipelineTotals();

    if (isWon) {
      spawnSparks(card);
      logTelemetry('🎉 WON: ' + dealName + ' reached Closed Won (' + formatShortMoney(dealAmt) + ' ARR)', true);
    } else {
      logTelemetry('⚡ ROUTED: ' + dealName + ' → ' + stageNames[targetStage] + ' (' + formatShortMoney(dealAmt) + ')', false);
    }

    if (!opts.isAuto) {
      pauseAutoFlow(12);
    }
  }

  // Bind drag & drop on cards
  function initDragAndDrop() {
    var cards = kanban.querySelectorAll('.deal-card');

    cards.forEach(function(card) {
      card.addEventListener('dragstart', function(e) {
        card.classList.add('is-dragging');
        if (visualHost) visualHost.classList.add('is-interacting');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', card.dataset.dealId);

        stages.forEach(function(s) {
          if (dropzones[s]) dropzones[s].classList.add('can-drop');
        });
        pauseAutoFlow(15);
      });

      card.addEventListener('dragend', function() {
        card.classList.remove('is-dragging');
        if (visualHost) visualHost.classList.remove('is-interacting');
        stages.forEach(function(s) {
          if (dropzones[s]) {
            dropzones[s].classList.remove('can-drop');
            dropzones[s].classList.remove('drag-over');
          }
        });
      });
    });

    stages.forEach(function(s) {
      var dz = dropzones[s];
      if (!dz) return;

      dz.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        dz.classList.add('drag-over');
      });

      dz.addEventListener('dragleave', function(e) {
        if (!dz.contains(e.relatedTarget)) {
          dz.classList.remove('drag-over');
        }
      });

      dz.addEventListener('drop', function(e) {
        e.preventDefault();
        dz.classList.remove('drag-over');
        var dealId = e.dataTransfer.getData('text/plain');
        if (!dealId) return;
        var draggedCard = kanban.querySelector('[data-deal-id="' + dealId + '"]');
        if (draggedCard) {
          moveDeal(draggedCard, s);
        }
      });
    });
  }

  // Touch Drag-and-Drop for mobile / touchscreens
  function initTouchDrag() {
    var activeTouchCard = null;
    var touchStartX = 0;
    var touchStartY = 0;
    var hasMoved = false;

    kanban.addEventListener('touchstart', function(e) {
      var card = e.target.closest('.deal-card');
      if (!card || e.target.closest('.deal-nav-btn')) return;

      activeTouchCard = card;
      var touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      hasMoved = false;
      pauseAutoFlow(12);
    }, { passive: true });

    kanban.addEventListener('touchmove', function(e) {
      if (!activeTouchCard) return;
      var touch = e.touches[0];
      var diffX = Math.abs(touch.clientX - touchStartX);
      var diffY = Math.abs(touch.clientY - touchStartY);

      if (diffX > 10 || diffY > 10) {
        hasMoved = true;
        activeTouchCard.classList.add('is-dragging');
        if (visualHost) visualHost.classList.add('is-interacting');

        // Highlight dropzone under touch point
        var elem = document.elementFromPoint(touch.clientX, touch.clientY);
        var dz = elem ? elem.closest('.column-dropzone') : null;
        stages.forEach(function(s) {
          if (dropzones[s]) {
            dropzones[s].classList.toggle('drag-over', dropzones[s] === dz);
          }
        });
      }
    }, { passive: true });

    kanban.addEventListener('touchend', function(e) {
      if (!activeTouchCard) return;
      if (hasMoved) {
        var touch = e.changedTouches[0];
        var elem = document.elementFromPoint(touch.clientX, touch.clientY);
        var dz = elem ? elem.closest('.column-dropzone') : null;
        if (dz && dz.dataset.dropzone) {
          moveDeal(activeTouchCard, dz.dataset.dropzone);
        }
      }
      activeTouchCard.classList.remove('is-dragging');
      if (visualHost) visualHost.classList.remove('is-interacting');
      stages.forEach(function(s) {
        if (dropzones[s]) dropzones[s].classList.remove('drag-over');
      });
      activeTouchCard = null;
      hasMoved = false;
    });
  }

  // Button clicks: Next / Prev arrows on cards
  kanban.addEventListener('click', function(e) {
    var navBtn = e.target.closest('.deal-nav-btn');
    if (navBtn) {
      e.preventDefault();
      var card = navBtn.closest('.deal-card');
      if (!card) return;
      var currentStage = card.dataset.stage;
      var currentIdx = stages.indexOf(currentStage);
      if (currentIdx === -1) return;

      var dir = navBtn.dataset.dir;
      var nextIdx = dir === 'next' ? currentIdx + 1 : currentIdx - 1;
      if (nextIdx >= 0 && nextIdx < stages.length) {
        moveDeal(card, stages[nextIdx]);
      }
      return;
    }

    var simBtn = e.target.closest('[data-sim-toggle]');
    if (simBtn) {
      e.preventDefault();
      autoFlowActive = !autoFlowActive;
      simBtn.classList.toggle('is-active', autoFlowActive);
      simBtn.setAttribute('aria-pressed', autoFlowActive ? 'true' : 'false');
      var label = simBtn.querySelector('.hud-btn-text');
      if (label) label.textContent = autoFlowActive ? 'Auto-Flow' : 'Paused';
      logTelemetry(autoFlowActive ? '⚡ Auto-Flow simulation resumed' : '⏸ Auto-Flow paused by user', false);
      if (autoFlowActive) pauseAutoFlow(1);
      return;
    }

    var resetTrigger = e.target.closest('[data-kanban-reset]');
    if (resetTrigger) {
      e.preventDefault();
      resetDeals();
      logTelemetry('↺ Pipeline reset to default RevOps architecture', false);
      pauseAutoFlow(8);
      return;
    }
  });

  function resetDeals() {
    Object.keys(defaultDistribution).forEach(function(dealId) {
      var card = kanban.querySelector('[data-deal-id="' + dealId + '"]');
      var targetStage = defaultDistribution[dealId];
      if (card && dropzones[targetStage]) {
        dropzones[targetStage].appendChild(card);
        card.dataset.stage = targetStage;
      }
    });
    updatePipelineTotals();
  }

  // Autonomous Pipeline Stage Moving (Auto-Flow Simulation)
  function runAutoFlowStep() {
    if (!autoFlowActive || Date.now() < userInteractedUntil || document.hidden) return;

    // Find candidates in Stage 1 or 2
    var candidatesStage1 = dropzones['qualified'] ? Array.from(dropzones['qualified'].querySelectorAll('.deal-card')) : [];
    var candidatesStage2 = dropzones['architecture'] ? Array.from(dropzones['architecture'].querySelectorAll('.deal-card')) : [];

    if (candidatesStage2.length > 0 && (Math.random() > 0.4 || candidatesStage1.length === 0)) {
      // Advance an architecture deal to closed-won
      var pick2 = candidatesStage2[Math.floor(Math.random() * candidatesStage2.length)];
      moveDeal(pick2, 'closed-won', { isAuto: true });
    } else if (candidatesStage1.length > 0) {
      // Advance a qualified deal to architecture
      var pick1 = candidatesStage1[Math.floor(Math.random() * candidatesStage1.length)];
      moveDeal(pick1, 'architecture', { isAuto: true });
    } else {
      // All deals are in Closed Won! Reset one back to Qualified to keep the conveyor cycling
      var wonDeals = dropzones['closed-won'] ? Array.from(dropzones['closed-won'].querySelectorAll('.deal-card')) : [];
      if (wonDeals.length > 0) {
        var cycleDeal = wonDeals[0];
        moveDeal(cycleDeal, 'qualified', { isAuto: true });
      }
    }
  }

  // Pause auto flow on mouse hover
  kanban.addEventListener('mouseenter', function() {
    pauseAutoFlow(8);
    if (visualHost) visualHost.classList.add('is-interacting');
  });

  kanban.addEventListener('mouseleave', function() {
    if (visualHost) visualHost.classList.remove('is-interacting');
  });

  // Initialize
  initDragAndDrop();
  initTouchDrag();
  updatePipelineTotals();

  // Run autonomous conveyor step every 4.6 seconds
  setInterval(runAutoFlowStep, 4600);

})();
