/* Shared professional cursor for every page surface. */
(function(){
  'use strict';
  if(document.documentElement.dataset.pipelineCursorReady==='true')return;
  document.documentElement.dataset.pipelineCursorReady='true';
  var prefersReduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer=window.matchMedia&&window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if(prefersReduced||!finePointer||document.querySelector('.cursor-dot'))return;
  var dot=document.createElement('div');
  var ring=document.createElement('div');
  dot.className='cursor-dot';ring.className='cursor-ring';
  dot.setAttribute('aria-hidden','true');ring.setAttribute('aria-hidden','true');
  document.body.appendChild(dot);document.body.appendChild(ring);
  document.body.classList.add('cursor-enabled');
  var targetX=-100,targetY=-100,ringX=-100,ringY=-100,frame=0;
  function render(){
    ringX+=(targetX-ringX)*.2;
    ringY+=(targetY-ringY)*.2;
    ring.style.transform='translate3d('+ringX+'px,'+ringY+'px,0)';
    if(Math.abs(targetX-ringX)>.1||Math.abs(targetY-ringY)>.1)frame=requestAnimationFrame(render);
    else{frame=0;ringX=targetX;ringY=targetY;ring.style.transform='translate3d('+ringX+'px,'+ringY+'px,0)';}
  }
  function move(event){
    targetX=event.clientX;targetY=event.clientY;
    dot.style.transform='translate3d('+targetX+'px,'+targetY+'px,0)';
    document.body.classList.add('cursor-visible');
    if(!frame)frame=requestAnimationFrame(render);
  }
  function hide(){document.body.classList.remove('cursor-visible','cursor-hover','cursor-pressed');}
  function isInteractive(target){
    return target&&target.closest&&target.closest('a,button,.card,.interactive-card,.tab-btn,.lang-tag,img,.rail-step,.accordion-header,[role="link"]');
  }
  window.addEventListener('pointermove',move,{passive:true});
  document.addEventListener('pointerover',function(event){if(isInteractive(event.target))document.body.classList.add('cursor-hover');});
  document.addEventListener('pointerout',function(event){
    if(event.relatedTarget&&isInteractive(event.relatedTarget))return;
    document.body.classList.remove('cursor-hover');
    if(!event.relatedTarget)hide();
  });
  window.addEventListener('pointerdown',function(){document.body.classList.add('cursor-pressed');});
  window.addEventListener('pointerup',function(){document.body.classList.remove('cursor-pressed');});
  window.addEventListener('pointercancel',function(){document.body.classList.remove('cursor-pressed');});
  window.addEventListener('blur',hide);
})();
