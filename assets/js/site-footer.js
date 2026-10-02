(function(){
  'use strict';
  const footer=document.querySelector('.site-footer-component');
  if(!footer)return;
  footer.querySelectorAll('a[target="_blank"]').forEach(function(link){
    const rel=(link.getAttribute('rel')||'').split(/\s+/).filter(Boolean);
    if(rel.indexOf('noopener')<0)rel.push('noopener');
    if(rel.indexOf('noreferrer')<0)rel.push('noreferrer');
    link.setAttribute('rel',rel.join(' '));
  });
})();
