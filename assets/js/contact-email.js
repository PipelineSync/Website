(function(){
  'use strict';
  const email=['allentrinidad','@','pipelinesync','.net'].join('');
  document.querySelectorAll('[data-contact-email]').forEach(function(link){
    link.href='mailto:'+email;
    link.textContent=email;
  });
})();
