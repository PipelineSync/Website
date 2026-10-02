// HubSpot Modal Logic
(function(){
  var modal=document.getElementById('hsFormModal');
  if(!modal)return;
  var openBtns=document.querySelectorAll('.js-open-hs-form');
  var closeBtn=modal.querySelector('.hs-modal-close');
  var overlay=modal.querySelector('.hs-modal-overlay');
  function openModal(event){
    if(event)event.preventDefault();
    modal.classList.add('active');
    modal.style.display='flex';
    document.body.style.overflow='hidden';
  }
  function closeModal(){
    modal.classList.remove('active');
    modal.style.display='none';
    document.body.style.overflow='';
  }
  openBtns.forEach(function(button){button.addEventListener('click',openModal);});
  if(closeBtn)closeBtn.addEventListener('click',closeModal);
  if(overlay)overlay.addEventListener('click',closeModal);
  document.addEventListener('keydown',function(event){if(event.key==='Escape'&&modal.classList.contains('active'))closeModal();});
})();
