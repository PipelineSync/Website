/* PipelineSync glassmorphism + motion layer */
(function(){
  'use strict';
  const doc=document;
  const body=doc.body;
  const prefersReduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Add a subtle 3D tilt to meaningful content images while hovering.
  if(!prefersReduced && finePointer){
    doc.querySelectorAll('.card img,.hero-visual img,.badge-card img').forEach(function(image){
      image.classList.add('site-hover-image');
      image.addEventListener('pointermove',function(event){
        const rect=image.getBoundingClientRect();
        const x=(event.clientX-rect.left)/rect.width-.5;
        const y=(event.clientY-rect.top)/rect.height-.5;
        image.style.setProperty('--img-tilt-x',(x*5).toFixed(2)+'deg');
        image.style.setProperty('--img-tilt-y',(-y*5).toFixed(2)+'deg');
      });
      image.addEventListener('pointerleave',function(){
        image.style.setProperty('--img-tilt-x','0deg');
        image.style.setProperty('--img-tilt-y','0deg');
      });
    });
  }

})();
