// ---- Set your real links here ----
const INVITE_URL = "https://discord.com/oauth2/authorize?client_id=1208042394813997066&permissions=414468009280&integration_type=0&scope=bot"; // e.g., https://discord.com/oauth2/authorize?client_id=...&scope=bot+applications.commands&permissions=...
const SUPPORT_URL = "https://discord.gg/XTpYaeaCtV"; // e.g., https://discord.gg/your-server
// ----------------------------------

for (const id of ["inviteBtn","inviteBtn2","inviteBtn3"]) {
  const el = document.getElementById(id);
  if (el) el.href = INVITE_URL;
}
for (const id of ["supportBtn","supportBtn2"]) {
  const el = document.getElementById(id);
  if (el) el.href = SUPPORT_URL;
}

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

// Copy /setup
document.querySelectorAll('.copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.getAttribute('data-copy') || '/setup';
    try {
      await navigator.clipboard.writeText(text);
      const prev = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = prev), 900);
    } catch {}
  });
});

// Reveal-on-scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
},{threshold:0.12});
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

// Canvas: animated reactive ring + drifting music notes (simple CPU-friendly)
const c = document.getElementById('ring');
if (c) {
  const ctx = c.getContext('2d');
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  function resize(){
    c.width = innerWidth * DPR;
    c.height = Math.max(560, innerHeight * 0.78) * DPR;
  }
  resize();
  addEventListener('resize', resize);

  // floating notes
  const notes = new Array(24).fill(0).map((_,i)=>{
    const angle = Math.random()*Math.PI*2;
    return {
      x: (Math.random()*innerWidth)*DPR,
      y: (Math.random()*c.height),
      s: 0.6 + Math.random()*0.9,
      v: 0.3 + Math.random()*0.7,
      a: angle
    };
  });

  let t = 0;
  function draw() {
    t += 0.012;
    ctx.clearRect(0,0,c.width,c.height);

    // gradient bg aura
    const g = ctx.createLinearGradient(0,0,c.width,0);
    g.addColorStop(0,'rgba(106,211,255,0.08)'); // ring1
    g.addColorStop(1,'rgba(122,92,255,0.08)');  // ring2
    ctx.fillStyle = g;
    ctx.fillRect(0,0,c.width,c.height);

    const cx = c.width/2;
    const cy = c.height/2.1;
    const baseR = Math.min(c.width, c.height)*0.26;

    // outer animated ring (fake "spectrum")
    for (let i=0;i<160;i++){
      const p = i/160;
      const amp = 8 + Math.sin(t*3 + p*16)*10 + Math.cos(t*2 + p*22)*6;
      const r = baseR + amp*DPR;
      const a = p*Math.PI*2;
      const x1 = cx + Math.cos(a)*(r-2*DPR);
      const y1 = cy + Math.sin(a)*(r-2*DPR);
      const x2 = cx + Math.cos(a)*r;
      const y2 = cy + Math.sin(a)*r;
      ctx.strokeStyle = `rgba(${110+80*p|0}, ${150+40*p|0}, 255, ${0.35+0.35*Math.sin(t+p*6)})`;
      ctx.lineWidth = 2.2*DPR;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    }

    // inner glow
    const rg = ctx.createRadialGradient(cx,cy,0,cx,cy,baseR*1.1);
    rg.addColorStop(0,'rgba(122,92,255,0.25)');
    rg.addColorStop(1,'rgba(122,92,255,0)');
    ctx.fillStyle = rg;
    ctx.beginPath(); ctx.arc(cx,cy,baseR*1.1,0,Math.PI*2); ctx.fill();

    // floating music notes
    notes.forEach(n=>{
      n.x += Math.cos(n.a)*n.v*DPR;
      n.y += Math.sin(n.a)*n.v*DPR;
      n.a += (Math.random()-0.5)*0.01;

      if (n.x < -20*DPR) n.x = c.width+20*DPR;
      if (n.x > c.width+20*DPR) n.x = -20*DPR;
      if (n.y < -20*DPR) n.y = c.height+20*DPR;
      if (n.y > c.height+20*DPR) n.y = -20*DPR;

      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.scale(n.s*DPR, n.s*DPR);
      ctx.fillStyle = 'rgba(216,231,255,0.7)';
      // simple eighth note shape
      ctx.beginPath();
      ctx.moveTo(0,0); ctx.arc(0,0,6,0,Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(6,-12); ctx.lineTo(6,0);
      ctx.strokeStyle='rgba(216,231,255,0.7)';
      ctx.lineWidth=2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(6,-12); ctx.quadraticCurveTo(14,-14,12,-4);
      ctx.stroke();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }
  draw();
}
