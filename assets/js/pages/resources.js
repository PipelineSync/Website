/* Legacy inline script 6 */
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const tab=btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
    const target=document.getElementById('tab-'+tab);
    if(target) target.classList.add('active');
  });
});
document.querySelectorAll('.accordion-item').forEach(item=>{
  const header=item.querySelector('.accordion-header');
  if(!header) return;
  header.addEventListener('click',()=>{
    const wasActive=item.classList.contains('active');
    document.querySelectorAll('.accordion-item').forEach(i=>i.classList.remove('active'));
    if(!wasActive) item.classList.add('active');
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
    // Guide, blog/article, and SOP cards use direct destinations or remain static.
    // They do not open the generic resource details popup.
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

/* Legacy inline script resource-guide-box-links */
/* Make each featured guide card open its linked resource when the card surface is clicked. */
(function(){
  'use strict';
  document.querySelectorAll('#tab-guides [data-guide-url]').forEach(function(card){
    var url=card.getAttribute('data-guide-url');
    if(!url)return;
    card.setAttribute('role','link');
    card.setAttribute('tabindex','0');
    function openGuide(event){
      if(event.target.closest && event.target.closest('a,button,input,select,textarea'))return;
      window.location.href=url;
    }
    card.addEventListener('click',openGuide);
    card.addEventListener('keydown',function(event){
      if((event.key==='Enter'||event.key===' ') && !(event.target.closest && event.target.closest('a,button,input,select,textarea'))){
        event.preventDefault();
        window.location.href=url;
      }
    });
  });
})();

/* Legacy inline script resources-loading-screen-script */
/* Resources page loading screen */
(function(){
  'use strict';
  var screen=document.getElementById('resourcesLoadingScreen');
  var bar=document.getElementById('resourcesLoadingBar');
  var percent=document.getElementById('resourcesLoadingPercent');
  var status=document.getElementById('resourcesLoadingStatus');
  if(!screen)return;
  var progress=0;
  var finished=false;
  var started=Date.now();
  var messages=['Getting your guides ready...','Organizing the playbooks for you...','Getting the practical insights ready...','You’re almost there...'];
  var messageIndex=0;
  var pulse=setInterval(function(){
    if(finished)return;
    progress=Math.min(92,progress+Math.max(1,Math.round((100-progress)*.08)));
    bar.style.width=progress+'%';
    percent.textContent=progress+'%';
    messageIndex=Math.min(messages.length-1,Math.floor(progress/25));
    status.textContent=messages[messageIndex];
  },120);
  function finish(){
    if(finished)return;
    finished=true;
    clearInterval(pulse);
    var elapsed=Date.now()-started;
    var remaining=Math.max(0,700-elapsed);
    progress=100;
    bar.style.width='100%';
    percent.textContent='100%';
    status.textContent='You’re all set.';
    setTimeout(function(){screen.classList.add('is-hidden');screen.setAttribute('aria-hidden','true');},remaining);
  }
  if(document.readyState==='complete')finish();
  else window.addEventListener('load',finish,{once:true});
  /* Safety fallback prevents a slow third-party asset from leaving the page covered. */
  setTimeout(finish,5000);
})();

/* Legacy inline script resource-blog-box-links */
/* Make each blog/article card keyboard and pointer accessible. */
(function(){
  'use strict';
  document.querySelectorAll('#tab-blog [data-blog-url]').forEach(function(card){
    var url=card.getAttribute('data-blog-url');
    if(!url)return;
    card.setAttribute('role','link');
    card.setAttribute('tabindex','0');
    function openArticle(event){
      if(event.target.closest && event.target.closest('a,button,input,select,textarea'))return;
      window.location.href=url;
    }
    card.addEventListener('click',openArticle);
    card.addEventListener('keydown',function(event){
      if((event.key==='Enter'||event.key===' ') && !(event.target.closest && event.target.closest('a,button,input,select,textarea'))){
        event.preventDefault();
        window.location.href=url;
      }
    });
  });
})();

/* Legacy inline script resource-sop-box-links */
/* Make each SOP/template card keyboard and pointer accessible. */
(function(){
  'use strict';
  document.querySelectorAll('#tab-sops [data-sop-url]').forEach(function(card){
    var url=card.getAttribute('data-sop-url');
    if(!url)return;
    card.setAttribute('role','link');
    card.setAttribute('tabindex','0');
    function openResource(event){
      if(event.target.closest && event.target.closest('a,button,input,select,textarea'))return;
      window.location.href=url;
    }
    card.addEventListener('click',openResource);
    card.addEventListener('keydown',function(event){
      if((event.key==='Enter'||event.key===' ') && !(event.target.closest && event.target.closest('a,button,input,select,textarea'))){
        event.preventDefault();
        window.location.href=url;
      }
    });
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
