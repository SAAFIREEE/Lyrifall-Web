// Replace these with your real links
const INVITE_URL  = "#"; // e.g., https://discord.com/oauth2/authorize?client_id=...&scope=bot+applications.commands&permissions=...
const SUPPORT_URL = "#"; // e.g., https://discord.gg/yourserver
const GITHUB_URL  = "#"; // e.g., https://github.com/you/lyrifall

for (const id of ["inviteBtn","inviteBtn2"]) {
  const el = document.getElementById(id);
  if (el) el.href = INVITE_URL;
}
for (const id of ["supportBtn","supportBtn2"]) {
  const el = document.getElementById(id);
  if (el) el.href = SUPPORT_URL;
}
for (const id of ["githubBtn","githubBtn2"]) {
  const el = document.getElementById(id);
  if (el) el.href = GITHUB_URL;
}

// Mobile nav
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
    const text = btn.getAttribute('data-copy') || '';
    try {
      await navigator.clipboard.writeText(text);
      const prev = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = prev), 900);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      btn.textContent = 'Copied!'; setTimeout(() => (btn.textContent = 'Copy'), 900);
    }
  });
});

// Reveal animations
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

// Theme toggle (dark/light)
const themeToggle = document.getElementById('themeToggle');
themeToggle?.addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
});

// Tiny glowing canvas bg (no libs)
const c = document.getElementById('glow');
if (c) {
  const ctx = c.getContext('2d');
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  function resize() {
    c.width = innerWidth * DPR;
    c.height = innerHeight * DPR;
  }
  resize();
  addEventListener('resize', resize);
  let t = 0;
  function draw() {
    t += 0.01;
    ctx.clearRect(0,0,c.width,c.height);
    const cx = c.width/2, cy = c.height/2;
    for (let i=0;i<6;i++){
      const r = 220 + 40*Math.sin(t + i);
      const x = cx + Math.cos(t*0.6 + i)* (c.width*0.18);
      const y = cy + Math.sin(t*0.7 + i)* (c.height*0.18);
      const grad = ctx.createRadialGradient(x,y,0,x,y,r*DPR);
      grad.addColorStop(0, `rgba(${80+i*25}, ${140+i*10}, 255, 0.08)`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x,y,r*DPR,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
}
