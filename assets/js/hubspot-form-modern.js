// HubSpot Modal Logic
(function(){
  const modal=document.getElementById('hsFormModal');
  if(!modal) return;
  const openBtns=document.querySelectorAll('.js-open-hs-form');
  const closeBtn=modal.querySelector('.hs-modal-close');
  const overlay=modal.querySelector('.hs-modal-overlay');
  function openModal(e){
    if(e){ e.preventDefault(); }
    modal.classList.add('active');
    modal.style.display='flex';
    document.body.style.overflow='hidden';
  }
  function closeModal(){
    modal.classList.remove('active');
    modal.style.display='none';
    document.body.style.overflow='';
  }
  openBtns.forEach(b=>{ b.addEventListener('click', openModal); });
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  if(overlay) overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && modal.classList.contains('active')) closeModal(); });
})();
