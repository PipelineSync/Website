const observer=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('active')})},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
