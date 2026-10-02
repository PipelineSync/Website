(function(){
      var menu=document.getElementById('mobileMenu'),button=document.querySelector('.hamburger');
      if(button&&menu){button.addEventListener('click',function(){var open=menu.classList.toggle('is-open');button.setAttribute('aria-expanded',open?'true':'false');});menu.querySelectorAll('a').forEach(function(link){link.addEventListener('click',function(){menu.classList.remove('is-open');button.setAttribute('aria-expanded','false');});});}
      var top=document.querySelector('.site-quick-top');
      function updateTop(){if(top)top.classList.toggle('is-visible',window.scrollY>80);}
      window.addEventListener('scroll',updateTop,{passive:true});updateTop();
      if(top)top.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
    })();
