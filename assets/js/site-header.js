(function(){
  'use strict';
  const header=document.querySelector('.site-header-component');
  if(!header || header.dataset.initialized==='true')return;
  header.dataset.initialized='true';
  const pathname=location.pathname.replace(/\/+$/, '/') || '/';
  const currentPage=pathname==='/'?'index.html':(pathname.split('/').filter(Boolean).pop()||'index')+'.html';
  const isResourcePage=pathname==='/resources/' || pathname.indexOf('/resources/')===0;

  function updateHeaderScroll(){
    document.body.classList.toggle('has-scrolled',window.scrollY>10);
  }
  window.addEventListener('scroll',updateHeaderScroll,{passive:true});
  updateHeaderScroll();
  header.querySelectorAll('.nav-links a,.mobile-menu a').forEach(function(link){
    const href=(link.getAttribute('href')||'').split('#')[0].split('?')[0].toLowerCase();
    const hrefPart=href.split('/').filter(Boolean).pop()||'index';
    const hrefPage=hrefPart==='index'||hrefPart==='index.html'?'index.html':(hrefPart.endsWith('.html')?hrefPart:hrefPart+'.html');
    const isResourcesLink=hrefPage==='resources.html';
    if(hrefPage===currentPage || (isResourcePage && isResourcesLink)){
      link.classList.add('active');
      link.setAttribute('aria-current','page');
      if(link.closest('.mobile-menu'))link.style.color='var(--navy,#06245B)';
    }
  });
  const hamburger=header.querySelector('#hamburger');
  const mobileMenu=header.querySelector('#mobileMenu');
  if(hamburger&&mobileMenu){
    hamburger.addEventListener('click',function(){
      const isOpen=hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active',isOpen);
      hamburger.setAttribute('aria-expanded',isOpen?'true':'false');
      document.body.style.overflow=isOpen?'hidden':'';
    });
    mobileMenu.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click',function(){
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded','false');
        document.body.style.overflow='';
      });
    });
  }
  header.querySelectorAll('.js-open-hs-form').forEach(function(button){
    button.addEventListener('click',function(event){
      event.preventDefault();
      const modal=document.getElementById('hsFormModal');
      if(!modal)return;
      modal.classList.add('active');
      modal.style.display='flex';
      document.body.style.overflow='hidden';
    });
  });

  // Shared professional cursor for every page, header surface and footer surface.
  window.PipelineSyncCursor=window.PipelineSyncCursor||function(){
    if(document.documentElement.dataset.pipelineCursorReady==='true')return;
    document.documentElement.dataset.pipelineCursorReady='true';
    const prefersReduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer=window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if(prefersReduced || !finePointer || document.querySelector('.cursor-dot'))return;
    const dot=document.createElement('div');
    const ring=document.createElement('div');
    dot.className='cursor-dot';ring.className='cursor-ring';
    dot.setAttribute('aria-hidden','true');ring.setAttribute('aria-hidden','true');
    document.body.appendChild(dot);document.body.appendChild(ring);
    document.body.classList.add('cursor-enabled');
    let targetX=-100,targetY=-100,ringX=-100,ringY=-100,frame=0;
    function render(){
      ringX+=(targetX-ringX)*.2;
      ringY+=(targetY-ringY)*.2;
      ring.style.transform='translate3d('+ringX+'px,'+ringY+'px,0)';
      if(Math.abs(targetX-ringX)>.1 || Math.abs(targetY-ringY)>.1){frame=requestAnimationFrame(render);}
      else{frame=0;ringX=targetX;ringY=targetY;ring.style.transform='translate3d('+ringX+'px,'+ringY+'px,0)';}
    }
    function move(event){
      targetX=event.clientX;targetY=event.clientY;
      dot.style.transform='translate3d('+targetX+'px,'+targetY+'px,0)';
      document.body.classList.add('cursor-visible');
      if(!frame)frame=requestAnimationFrame(render);
    }
    function hide(){
      document.body.classList.remove('cursor-visible','cursor-hover','cursor-pressed');
    }
    function isInteractive(target){
      return target && target.closest && target.closest('[data-cursor-surface],a,button,.card,.interactive-card,.tab-btn,.lang-tag,img,.rail-step,.accordion-header');
    }
    window.addEventListener('pointermove',move,{passive:true});
    document.addEventListener('pointerover',function(event){
      if(isInteractive(event.target))document.body.classList.add('cursor-hover');
    });
    document.addEventListener('pointerout',function(event){
      if(event.relatedTarget && isInteractive(event.relatedTarget))return;
      document.body.classList.remove('cursor-hover');
      if(!event.relatedTarget)hide();
    });
    window.addEventListener('pointerdown',function(){document.body.classList.add('cursor-pressed');});
    window.addEventListener('pointerup',function(){document.body.classList.remove('cursor-pressed');});
    window.addEventListener('pointercancel',function(){document.body.classList.remove('cursor-pressed');});
    window.addEventListener('blur',hide);
  };
  window.PipelineSyncCursor();
})();
