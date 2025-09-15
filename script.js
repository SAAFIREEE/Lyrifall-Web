// Mobile nav toggle
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger && nav) {
  burger.addEventListener('click', () => {
    const open = nav.style.display === 'flex';
    nav.style.display = open ? 'none' : 'flex';
    burger.setAttribute('aria-expanded', String(!open));
  });
}

// Copy buttons
document.querySelectorAll('.copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.getAttribute('data-copy') || '/setup';
    try {
      await navigator.clipboard.writeText(text);
      const prev = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = prev), 1000);
    } catch {}
  });
});

// Reveal animation
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
},{threshold:0.12});
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

// Simple visualizer bars in mock player
(function(){
  const viz = document.getElementById('viz');
  if (!viz) return;
  const n = 32;
  for (let i=0;i<n;i++){
    const b = document.createElement('span');
    b.style.position='absolute';
    b.style.bottom='0';
    b.style.left = (i*(100/n))+'%';
    b.style.width = (100/n - 1)+'%';
    b.style.background = 'linear-gradient(180deg, rgba(90,200,255,.95), rgba(122,92,255,.95))';
    b.style.borderRadius = '6px 6px 0 0';
    viz.appendChild(b);
  }
  let t=0;
  function anim(){
    t+=0.04;
    [...viz.children].forEach((bar,i)=>{
      const h = 8 + Math.abs(Math.sin(t+i*0.3))*24 + Math.abs(Math.cos(t*0.7+i*0.15))*16;
      bar.style.height = h+'px';
      bar.style.opacity = 0.55 + 0.45*Math.sin(t+i*0.1);
    });
    requestAnimationFrame(anim);
  }
  anim();
})();

// Aurora / particle background on canvas
(function(){
  const c = document.getElementById('bg');
  if (!c) return;
  const ctx = c.getContext('2d');
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  function resize(){
    c.width = innerWidth * DPR;
    c.height = innerHeight * DPR;
  }
  resize(); addEventListener('resize', resize);
  const dots = new Array(80).fill(0).map(()=> ({
    x: Math.random()*c.width,
    y: Math.random()*c.height,
    r: 40 + Math.random()*90,
    vx: -0.2 + Math.random()*0.4,
    vy: -0.2 + Math.random()*0.4
  }));
  let t=0;
  function draw(){
    t+=0.006;
    ctx.clearRect(0,0,c.width,c.height);
    dots.forEach((d,i)=>{
      d.x += d.vx; d.y += d.vy;
      if (d.x<-100) d.x=c.width+100; if (d.x>c.width+100) d.x=-100;
      if (d.y<-100) d.y=c.height+100; if (d.y>c.height+100) d.y=-100;
      const grad = ctx.createRadialGradient(d.x,d.y,0,d.x,d.y,d.r);
      grad.addColorStop(0, `rgba(${100+60*Math.sin(t+i)}, ${150+30*Math.cos(t+i*0.7)}, 255, 0.055)`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
