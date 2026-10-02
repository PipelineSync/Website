(function(){
      var menu=document.getElementById('mobileMenu');
      var button=document.querySelector('.hamburger');
      if(button&&menu){
        button.addEventListener('click',function(){
          var open=menu.classList.toggle('is-open');
          button.setAttribute('aria-expanded',open?'true':'false');
        });
        menu.querySelectorAll('a').forEach(function(link){link.addEventListener('click',function(){menu.classList.remove('is-open');button.setAttribute('aria-expanded','false');});});
      }
      var email=['allentrinidad','@','pipelinesync','.net'].join('');
      document.querySelectorAll('[data-contact-email]').forEach(function(link){link.href='mailto:'+email;link.textContent=email;});
    })();
