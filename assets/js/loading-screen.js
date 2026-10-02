/* Shared visitor-friendly loading screen */
(function(){
  'use strict';
  var screen=document.getElementById('pipelineLoadingScreen');
  var bar=document.getElementById('pipelineLoadingBar');
  var percent=document.getElementById('pipelineLoadingPercent');
  var status=document.getElementById('pipelineLoadingStatus');
  if(!screen)return;
  var progress=0;
  var finished=false;
  var started=Date.now();
  var messages=['Getting your page ready...','We’re getting everything ready for you...','We’re bringing your content into view...','You’re almost there...'];
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
