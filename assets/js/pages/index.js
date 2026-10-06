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

/* Home hero kanban — deals advance through HubSpot deal stages on a loop. */
(function(){
  'use strict';
  var board=document.querySelector('[data-kanban]');
  if(!board)return;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cols=Array.prototype.slice.call(board.querySelectorAll('[data-nk-col]'));
  if(cols.length<2)return;
  var wonEl=board.querySelector('[data-nk-won]');
  var wonAmtEl=board.querySelector('[data-nk-won-amt]');
  var burst=board.querySelector('[data-nk-burst]');
  var hero=board.closest('.hero')||document.body;
  var won=parseInt(wonEl?wonEl.textContent:'0',10)||0;
  var wonAmt=parseInt(wonAmtEl?(wonAmtEl.textContent||'').replace(/[^0-9]/g,''):'0',10)||0;
  var pool=[['Vanta Labs',9],['Hexa Freight',17],['Lumen Care',21],['Orbit Legal',26],['Ferro Foods',14],['Quanta Edu',33],['Solis Energy',19],['Nimbus Retail',23]];
  var poolIdx=0;
  var cursor=0;
  var visible=true;
  function fmt(k){return '$'+k+'k';}
  function setCount(body){
    var col=body.closest?body.closest('.nk-col'):null;
    var count=col?col.querySelector('[data-nk-count]'):null;
    if(count)count.textContent=body.children.length;
  }
  function makeCard(name,amt){
    var el=document.createElement('article');
    el.className='nk-card is-spawn';
    el.setAttribute('data-amt',String(amt));
    el.innerHTML='<span class="nk-card-dot"></span><span class="nk-card-name"></span><span class="nk-card-amt"></span>';
    el.querySelector('.nk-card-name').textContent=name;
    el.querySelector('.nk-card-amt').textContent=fmt(amt);
    window.setTimeout(function(){el.classList.remove('is-spawn');},700);
    return el;
  }
  function pulse(col){
    if(!col)return;
    col.classList.add('is-target');
    window.setTimeout(function(){col.classList.remove('is-target');},950);
  }
  function move(card,targetBody){
    var first=card.getBoundingClientRect();
    var prev=card.parentElement;
    targetBody.appendChild(card);
    setCount(targetBody);
    if(prev&&prev!==targetBody)setCount(prev);
    var last=card.getBoundingClientRect();
    var dx=first.left-last.left;
    var dy=first.top-last.top;
    card.classList.add('is-moving');
    if(card.animate){
      var anim=card.animate([
        {transform:'translate('+dx+'px,'+dy+'px) scale(1.07)'},
        {transform:'translate(0,0) scale(1)'}
      ],{duration:760,easing:'cubic-bezier(.16,1,.3,1)'});
      anim.onfinish=function(){card.classList.remove('is-moving');};
    }else{
      card.classList.remove('is-moving');
    }
  }
  function spawn(){
    var item=pool[poolIdx%pool.length];
    poolIdx+=1;
    cols[0].appendChild(makeCard(item[0],item[1]));
    setCount(cols[0]);
    pulse(cols[0].closest('.nk-col'));
  }
  function win(card,col){
    card.classList.add('is-won');
    won+=1;
    wonAmt+=parseInt(card.getAttribute('data-amt'),10)||0;
    if(wonEl)wonEl.textContent=won;
    if(wonAmtEl)wonAmtEl.textContent=fmt(wonAmt);
    if(burst&&col){
      var br=board.getBoundingClientRect();
      var cr=col.getBoundingClientRect();
      burst.style.left=(cr.left-br.left+cr.width/2)+'px';
      burst.style.top=(cr.top-br.top+cr.height/2)+'px';
      burst.classList.remove('is-on');
      void burst.offsetWidth;
      burst.classList.add('is-on');
    }
    window.setTimeout(function(){
      card.classList.add('is-out');
      window.setTimeout(function(){
        var body=card.parentElement;
        if(card.parentNode)card.parentNode.removeChild(card);
        if(body)setCount(body);
        spawn();
      },520);
    },1600);
  }
  function tick(){
    if(document.hidden||!visible)return;
    var from=-1;
    for(var i=0;i<cols.length-1;i++){
      var idx=(cursor+i)%(cols.length-1);
      if(cols[idx].children.length){from=idx;break;}
    }
    cursor=(cursor+1)%(cols.length-1);
    if(from<0)return;
    var target=cols[from+1];
    if(target.children.length>=3)return;
    var card=cols[from].children[0];
    if(!card)return;
    move(card,target);
    pulse(target.closest('.nk-col'));
    if(from+1===cols.length-1)win(card,target.closest('.nk-col'));
  }
  if(reduced)return; // static, fully populated board for reduced-motion users
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){visible=entry.isIntersecting;});
    },{threshold:0.15});
    io.observe(hero);
  }
  window.setInterval(tick,2600);
})();
