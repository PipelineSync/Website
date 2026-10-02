const observer=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('active')})},{threshold:0.12});
// Hero reveals are owned by page-motion.js: they wait for the preloader to
// clear so each page's entrance signature is actually visible.
document.querySelectorAll('.reveal').forEach(el=>{if(!el.closest('.hero'))observer.observe(el)});
