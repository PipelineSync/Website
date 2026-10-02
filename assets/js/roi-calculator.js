/* Supplied ROI calculator, shared across every PipelineSync page. */
(function(){
  'use strict';
  var quick=document.querySelector('.site-quick-actions');
  var createdQuick=false;
  if(!quick){
    createdQuick=true;
    quick=document.createElement('div');
    quick.className='site-quick-actions';
    quick.innerHTML='<button type="button" class="site-quick-top" aria-label="Back to top" title="Back to top">↑</button>';
    document.body.appendChild(quick);
  }
  if(document.querySelector('.site-roi-panel')) return;
  if(createdQuick){
    var topButton=quick.querySelector('.site-quick-top');
    function updateTop(){topButton.classList.toggle('is-visible',window.scrollY>80);}
    window.addEventListener('scroll',updateTop,{passive:true});
    updateTop();
    topButton.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
  }

  var trigger=document.createElement('button');
  trigger.type='button';
  trigger.className='site-roi-trigger';
  trigger.setAttribute('aria-label','Open ROI calculator');
  trigger.setAttribute('aria-expanded','false');
  trigger.setAttribute('title','ROI calculator');
  trigger.textContent='Calculate ROI';
  quick.insertBefore(trigger,quick.firstChild);

  var panel=document.createElement('section');
  panel.className='site-roi-panel';
  panel.id='siteRoiPanel';
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-modal','true');
  panel.setAttribute('aria-labelledby','siteRoiTitle');
  panel.setAttribute('aria-hidden','true');
  panel.innerHTML=`
    <div class="roi-shell">
      <div class="roi-top">
        <div>
          <h1 id="siteRoiTitle">ROI calculator</h1>
          <p class="roi-sub">Use your assumptions to estimate monthly impact. Benchmark fields are pre-filled with 2026 HubSpot industry figures.</p>
        </div>
        <button class="roi-close" type="button" aria-label="Close ROI calculator">✕</button>
      </div>
      <div class="roi-grid">
        <div class="roi-field roi-slider-field">
          <label class="roi-lab" for="siteRoiLeads">Monthly leads <output class="roi-slider-value" id="siteRoiLeadsValue" for="siteRoiLeads">250</output></label>
          <div class="roi-slider-wrap"><input class="roi-slider" id="siteRoiLeads" type="range" min="0" max="5000" step="10" value="250" aria-valuemin="0" aria-valuemax="5000" aria-valuenow="250"><div class="roi-slider-scale"><span>0</span><span>5,000</span></div></div>
        </div>
        <div class="roi-field roi-slider-field">
          <label class="roi-lab" for="siteRoiDeal">Average deal value <output class="roi-slider-value" id="siteRoiDealValue" for="siteRoiDeal">$3,500</output></label>
          <div class="roi-slider-wrap"><input class="roi-slider" id="siteRoiDeal" type="range" min="0" max="100000" step="500" value="3500" aria-valuemin="0" aria-valuemax="100000" aria-valuenow="3500"><div class="roi-slider-scale"><span>$0</span><span>$100k</span></div></div>
        </div>
        <div class="roi-field roi-slider-field">
          <label class="roi-lab" for="siteRoiCurrent">Current close rate (%) <output class="roi-slider-value" id="siteRoiCurrentValue" for="siteRoiCurrent">12.0%</output></label>
          <div class="roi-slider-wrap"><input class="roi-slider" id="siteRoiCurrent" type="range" min="0" max="100" step="0.5" value="12" aria-valuemin="0" aria-valuemax="100" aria-valuenow="12"><div class="roi-slider-scale"><span>0%</span><span>100%</span></div></div>
        </div>
        <div class="roi-field roi-locked">
          <label class="roi-lab" for="siteRoiImproved">Improved close rate (%) <span class="roi-pill" title="2026 industry benchmark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>2026 benchmark</span></label>
          <input class="roi-input" id="siteRoiImproved" type="text" readonly>
          <div class="roi-hint">Auto-derived: HubSpot CRM users close ~22% more deals. Updates with your current close rate.</div>
        </div>
        <div class="roi-field roi-locked">
          <label class="roi-lab" for="siteRoiHours">Hours saved monthly <span class="roi-pill" title="2026 industry benchmark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>2026 benchmark</span></label>
          <input class="roi-input" id="siteRoiHours" type="text" value="32" readonly>
          <div class="roi-hint">~8 hrs/week reclaimed per employee via workflow &amp; reporting automation.</div>
        </div>
        <div class="roi-field roi-locked">
          <label class="roi-lab" for="siteRoiValHr">Value per saved hour <span class="roi-pill" title="2026 predictive benchmark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>2026 benchmark</span></label>
          <input class="roi-input" id="siteRoiValHr" type="text" value="50" readonly>
          <div class="roi-hint">Fully-loaded blended employee cost, 2026 estimate.</div>
        </div>
        <div class="roi-field full roi-slider-field">
          <label class="roi-lab" for="siteRoiInvest">Monthly CRM investment <output class="roi-slider-value" id="siteRoiInvestValue" for="siteRoiInvest">$2,500</output></label>
          <div class="roi-slider-wrap"><input class="roi-slider" id="siteRoiInvest" type="range" min="500" max="10000" step="500" value="2500" aria-valuemin="500" aria-valuemax="10000" aria-valuenow="2500"><div class="roi-slider-scale"><span>$500</span><span>$10k</span></div></div>
          <div class="roi-reco"><button class="roi-reco-btn" id="siteRoiReco" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 4.6L18.5 9l-4.6 1.4L12 15l-1.9-4.6L5.5 9l4.6-1.4z"/><path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>Ask AI for recommendation</button><div class="roi-reco-out" id="siteRoiRecoOut"></div></div>
        </div>
      </div>
      <button class="roi-calc-btn" id="siteRoiCalc" type="button">Calculate ROI</button>
      <div class="roi-divider"></div>
      <div class="roi-result-hero"><div class="roi-k">Estimated monthly ROI</div><div class="roi-v"><span id="siteRoiPct">-</span></div></div>
      <div class="roi-results-rows" aria-live="polite">
        <div class="roi-result-row"><span class="roi-rk">Incremental revenue</span><span class="roi-rv" id="siteRoiIncRev">-</span></div>
        <div class="roi-result-row"><span class="roi-rk">Time savings value</span><span class="roi-rv" id="siteRoiTimeVal">-</span></div>
        <div class="roi-result-row total"><span class="roi-rk">Estimated monthly return</span><span class="roi-rv" id="siteRoiNetRet">-</span></div>
      </div>
      <p class="roi-foot">Estimates are for planning purposes only. Actual results depend on your business, data, and implementation.<span class="roi-src">2026 benchmarks: close-rate uplift derived from independent HubSpot CRM performance data (~22% more deals closed); hours saved from HubSpot workflow &amp; reporting automation studies; hourly value based on fully-loaded employee cost.</span></p>
    </div>`;
  document.body.appendChild(panel);

  var closeButton=panel.querySelector('.roi-close');
  var calcButton=panel.querySelector('#siteRoiCalc');
  var recoButton=panel.querySelector('#siteRoiReco');
  var recoOut=panel.querySelector('#siteRoiRecoOut');
  function field(id){return panel.querySelector('#'+id);}
  function setOpen(value){
    panel.classList.toggle('is-open',value);
    panel.setAttribute('aria-hidden',value?'false':'true');
    trigger.setAttribute('aria-expanded',value?'true':'false');
    if(value)field('siteRoiLeads').focus();
  }
  trigger.addEventListener('click',function(){setOpen(!panel.classList.contains('is-open'));});
  closeButton.addEventListener('click',function(){setOpen(false);trigger.focus();});
  document.addEventListener('keydown',function(event){if(event.key==='Escape' && panel.classList.contains('is-open')){setOpen(false);trigger.focus();}});

  var CLOSE_RATE_UPLIFT=1.22;
  function money(n){return '$'+Math.round(n).toLocaleString('en-US');}
  var sliderConfig={
    siteRoiLeads:{output:'siteRoiLeadsValue',format:function(value){return Number(value).toLocaleString('en-US');}},
    siteRoiDeal:{output:'siteRoiDealValue',format:function(value){return money(value);}},
    siteRoiCurrent:{output:'siteRoiCurrentValue',format:function(value){return Number(value).toFixed(1)+'%';}},
    siteRoiInvest:{output:'siteRoiInvestValue',format:function(value){return money(value);}}
  };
  function syncSlider(id){
    var control=field(id),config=sliderConfig[id];
    if(!control||!config)return;
    var value=parseFloat(control.value)||0;
    var min=parseFloat(control.min)||0,max=parseFloat(control.max)||100;
    var fill=max>min?((value-min)/(max-min))*100:0;
    var text=config.format(value);
    control.style.setProperty('--roi-fill',fill+'%');
    control.setAttribute('aria-valuenow',String(value));
    control.setAttribute('aria-valuetext',text);
    var output=field(config.output);
    if(output)output.textContent=text;
  }
  function syncAllSliders(){Object.keys(sliderConfig).forEach(syncSlider);}
  function updateImproved(){
    var cur=parseFloat(field('siteRoiCurrent').value)||0;
    field('siteRoiImproved').value=cur?(cur*CLOSE_RATE_UPLIFT).toFixed(1):'';
  }
  function calculate(){
    var leads=parseFloat(field('siteRoiLeads').value)||0;
    var deal=parseFloat(field('siteRoiDeal').value)||0;
    var cur=parseFloat(field('siteRoiCurrent').value)||0;
    var improved=cur*CLOSE_RATE_UPLIFT;
    var hours=parseFloat(field('siteRoiHours').value)||0;
    var valhr=parseFloat(field('siteRoiValHr').value)||0;
    var invest=parseFloat(field('siteRoiInvest').value)||0;
    var incRev=leads*deal*((improved-cur)/100);
    var timeVal=hours*valhr;
    var net=incRev+timeVal-invest;
    var roiPct=invest?(net/invest)*100:0;
    field('siteRoiIncRev').textContent=money(incRev);
    field('siteRoiTimeVal').textContent=money(timeVal);
    field('siteRoiNetRet').textContent=money(net);
    field('siteRoiPct').textContent=Math.round(roiPct).toLocaleString('en-US')+'%';
  }
  function recommend(){
    var leads=parseFloat(field('siteRoiLeads').value)||0;
    var deal=parseFloat(field('siteRoiDeal').value)||0;
    var monthlyPipeline=leads*deal;
    var tier;
    if(leads<100 && monthlyPipeline<200000)tier=1000;
    else if(leads<300)tier=2500;
    else if(leads<1000)tier=5000;
    else tier=8000;
    if(deal>=10000 && tier<8000)tier=Math.min(10000,tier+1500);
    tier=Math.round(tier/500)*500;
    field('siteRoiInvest').value=String(tier);
    syncSlider('siteRoiInvest');
    calculate();
    var L=leads.toLocaleString(),D=money(deal),T=money(tier);
    var answers=[
      "Based on <strong>"+L+" leads/mo</strong> and a <strong>"+D+"</strong> average deal, we'd start you at <strong>"+T+"/mo</strong>. That tier covers the workflow and reporting automation that drives most of the close-rate lift. Adjust the slider if your budget differs.",
      "For your volume (<strong>"+L+" leads</strong> at <strong>"+D+"</strong> each), <strong>"+T+"/mo</strong> is the sweet spot, enough for deal routing, lead scoring and automated follow-up without paying for seats you won't use yet. Scale up once pipeline grows.",
      "Quick take: at <strong>"+L+" leads/mo</strong> your bottleneck is manual follow-up, so put budget toward automation. <strong>"+T+"/mo</strong> unlocks that while keeping ROI healthy. You can revisit as deal value climbs above "+D+".",
      "We recommend <strong>"+T+"/mo</strong>. With <strong>"+L+" leads</strong> and a <strong>"+D+"</strong> deal size, the return comes from converting a few more of those leads, this tier pays for the tooling that makes that happen. Move the slider to model other budgets.",
      "Sizing it up: <strong>"+L+" leads/mo</strong> × <strong>"+D+"</strong> is meaningful pipeline. <strong>"+T+"/mo</strong> is a sensible starting investment, enough automation to reclaim rep hours and lift close rate, without over-committing early."
    ];
    recoOut.innerHTML=answers[Math.floor(Math.random()*answers.length)];
    recoOut.classList.add('show');
  }
  Object.keys(sliderConfig).forEach(function(id){
    field(id).addEventListener('input',function(){
      syncSlider(id);
      if(id==='siteRoiCurrent')updateImproved();
      calculate();
    });
  });
  calcButton.addEventListener('click',calculate);
  recoButton.addEventListener('click',recommend);
  syncAllSliders();
  updateImproved();
  calculate();
})();
