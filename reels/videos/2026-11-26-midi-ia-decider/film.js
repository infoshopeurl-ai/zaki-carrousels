// « Faut-il laisser l'IA décider à notre place ? » (26/11/2026, édition MIDI) : pure function of time.
// Scenes are timed in SECONDS on the voice-over (audio/vo/words.json, placed +0.1 s);
// HITS are converted to beats (120 bpm, 0.5 s per beat) so sfx land on the same frames.
import * as M from './lib/motion.js';

const { W, H, E, prog, lerp, clamp, spring, SPRING, wobble, font, text, fill, rrect } = M;

const C = { ink: '#050506', red: '#FF1F3D', white: '#FFFFFF', grey: '#BEBEC4', dim: '#3A3A40', line: '#16080C', card: '#16161A', edge: '#2C2C33', gold: '#F2C94C' };
const D = 'Display', UI = 'UI';
const sp = (t, t0, cfg = SPRING.snappy) => (t < t0 ? 0 : spring(t - t0, cfg));
const B = (s) => s / 0.5;

// ------------------------------------------------------------------ sound hits (beats)
const HITS = [
  [B(0.0), 'hook', 'impact'],
  [B(2.04), 'plus intelligentes', 'pop', { pitch: 'G5' }],
  [B(3.68), 'decident', 'impact'],
  [B(4.18), 'notre place', 'pop', { pitch: 'E5' }],
  [B(5.6), 'pas tous', 'impact'],
  [B(6.4), 'cut axios', 'whoosh', { len: 0.4 }],
  [B(6.9), 'axios', 'blip', { pitch: 'A5' }],
  [B(8.24), 'anthropic', 'pop', { pitch: 'C5' }],
  [B(9.5), 'claude', 'pop', { pitch: 'E5' }],
  [B(11.76), 'autorite', 'bell', { pitch: 'E6' }],
  [B(12.74), 'superintelligentes', 'pop', { pitch: 'G5' }],
  [B(14.36), 'raison', 'impact'],
  [B(15.14), 'cut meta', 'whoosh', { len: 0.4 }],
  [B(15.34), 'meta', 'impact'],
  [B(16.68), 'refuse', 'impact'],
  [B(18.2), 'societe', 'thud', { pitch: 'C3' }],
  [B(19.56), 'cut altman', 'whoosh', { len: 0.4 }],
  [B(19.82), 'altman', 'impact'],
  [B(21.1), 'openai', 'pop', { pitch: 'E5' }],
  [B(23.02), 'controle', 'click'],
  [B(23.62), 'avenir', 'pop', { pitch: 'G5' }],
  [B(24.38), 'cut amodei', 'whoosh', { len: 0.4 }],
  [B(24.88), 'anthropic 2', 'pop', { pitch: 'C5' }],
  [B(26.02), 'absurde', 'impact'],
  [B(27.98), 'gouvernance', 'thud', { pitch: 'C3' }],
  [B(29.2), 'mauvaise idee', 'impact'],
  [B(29.9), 'cut nuance', 'whoosh', { len: 0.4 }],
  [B(31.12), 'sources', 'pop', { pitch: 'E5' }],
  [B(32.12), 'anonymes', 'impact'],
  [B(33.12), 'cut conseil', 'whoosh', { len: 0.4 }],
  [B(35.3), 'grande decision', 'pop', { pitch: 'G5' }],
  [B(36.28), 'demande', 'click'],
  [B(37.24), 'contre', 'impact'],
  [B(38.08), 'cut question', 'whoosh', { len: 0.4 }],
  [B(39.16), 'volant', 'pop', { pitch: 'C5' }],
  [B(39.7), 'end card', 'impact'],
  [B(39.9), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ["Les géants de l'IA veulent des machines", 0.1], ['plus intelligentes que nous...', 1.78],
  ["mais pas qu'elles décident à notre place.", 3.3], ['Enfin, pas tous.', 4.96],
  ['Selon le média Axios,', 6.4], ["des salariés d'Anthropic,", 7.32], ['le créateur de Claude,', 9.0],
  ["pensent que l'humanité confiera un jour", 9.78], ['son autorité à des IA superintelligentes,', 11.58],
  ["et qu'elle aurait raison.", 13.92],
  ['Chez Meta, Alexandr Wang refuse', 15.14], ["de remettre la société à l'IA.", 17.16],
  ["Sam Altman, le patron d'OpenAI,", 19.56], ['veut que les humains', 22.04], ["gardent le contrôle de l'avenir.", 22.6],
  ["Le patron d'Anthropic", 24.38], ["juge l'accusation absurde :", 25.26],
  ["pour lui, confier la gouvernance à l'IA", 26.88], ['est une mauvaise idée.', 28.78],
  ['Nuance :', 29.9], ["les sources d'Axios sont anonymes.", 31.02],
  ['Le conseil :', 33.12], ['avant de suivre une IA', 33.98], ['sur une grande décision,', 34.96],
  ['demande-lui les arguments contre.', 36.28],
  ['Et toi,', 38.08], ['tu lui laisserais le volant ?', 38.66],
  ["Abonne-toi pour l'actu IA", 39.7], ['de chaque jour.', 40.86],
];
const CAP_Y = 1385;
function captions(ctx, t) {
  let i = -1;
  for (let k = 0; k < CAP.length; k++) if (t >= CAP[k][1] - 0.04) i = k;
  if (i < 0 || t > 42.0) return;
  const [str, t0] = CAP[i];
  const k = sp(t, t0 - 0.04, SPRING.snappy);
  let size = 52;
  ctx.font = font(size, 800, UI);
  let w = ctx.measureText(str).width;
  if (w > W - 160) { size = Math.floor((size * (W - 160)) / w); ctx.font = font(size, 800, UI); w = ctx.measureText(str).width; }
  const f = font(size, 800, UI);
  const x = W / 2, y = CAP_Y + (1 - k) * 18;
  ctx.save();
  ctx.globalAlpha = clamp(k * 1.4);
  rrect(ctx, x - w / 2 - 26, y - 54, w + 52, 76, 16); ctx.fillStyle = 'rgba(0,0,0,0.78)'; ctx.fill();
  text(ctx, str, x, y, f, C.white, 'center');
  ctx.restore();
}

// ------------------------------------------------------------------ shared drawing
function bg(ctx, t, side = 0) {
  fill(ctx, C.ink);
  ctx.save();
  ctx.strokeStyle = C.line; ctx.lineWidth = 1;
  const drift = (t * 12) % 90;
  for (let x = -90 + drift; x < W + 90; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 90) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  const cx = side ? 820 : 260;
  const g = ctx.createRadialGradient(cx, 1650, 40, cx, 1650, 900);
  g.addColorStop(0, 'rgba(120,0,22,0.75)'); g.addColorStop(1, 'rgba(120,0,22,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.restore();
  ctx.translate(0, 110); // the composition sits lower in the frame, above the app's bottom UI
}
function popWord(ctx, str, x, y, size, color, t, t0, align = 'left', fam = D, weight = 400) {
  const k = sp(t, t0, SPRING.bouncy);
  const f = font(size, weight, fam);
  ctx.font = f;
  const w = ctx.measureText(str).width;
  if (k <= 0.001) return w;
  const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  ctx.save();
  ctx.translate(x0, y + (1 - k) * size * 0.5);
  ctx.globalAlpha = clamp(k * 2);
  text(ctx, str, 0, 0, f, color);
  ctx.restore();
  return w;
}
function slam(ctx, str, x, y, size, color, t, t0, align = 'center') {
  const p = prog(t, t0, t0 + 0.16);
  if (p <= 0) return;
  const s = lerp(2.4, 1, E.outCubic(p)) + 0.05 * wobble(t - t0 - 0.16, 3, 7);
  ctx.save();
  ctx.translate(x, y); ctx.scale(s, s);
  ctx.shadowColor = color === C.red ? 'rgba(255,31,61,0.55)' : 'rgba(255,255,255,0.25)'; ctx.shadowBlur = 40;
  text(ctx, str, 0, 0, font(size, 400, D), color, align);
  ctx.restore();
}
function chip(ctx, str, x, y, t, t0, color = C.red, align = 'left') {
  const k = sp(t, t0, SPRING.bouncy);
  if (k <= 0.001) return;
  const f = font(34, 800, UI);
  ctx.font = f; const w = ctx.measureText(str).width + 44;
  const x0 = align === 'center' ? x - w / 2 : x;
  ctx.save(); ctx.translate(x0 + w / 2, y); ctx.scale(k, k);
  rrect(ctx, -w / 2, -38, w, 60, 30); ctx.fillStyle = color; ctx.fill();
  text(ctx, str, 0, 4, f, color === C.red ? C.white : C.ink, 'center');
  ctx.restore();
}
function source(ctx, str, t, t0) {
  const k = clamp((t - t0) / 0.3);
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = k;
  text(ctx, str, W / 2, 1318, font(28, 600, UI), C.grey, 'center');
  ctx.restore();
}
function shakeAt(ctx, t, t0, amp) {
  const d = t - t0; if (d < 0 || d > 0.5) return;
  const a = amp * Math.exp(-d * 9);
  ctx.translate(a * Math.sin(d * 93), a * Math.cos(d * 71));
}
function stamp(ctx, str, x, y, w, size, t, t0, rot = -0.08, color = C.red) {
  const p = prog(t, t0, t0 + 0.14);
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const s = lerp(1.8, 1, E.outCubic(p)) + 0.04 * wobble(t - t0 - 0.14, 3, 7);
  ctx.scale(s, s);
  rrect(ctx, -w / 2, -size * 0.78, w, size * 1.2, 18); ctx.fillStyle = 'rgba(5,5,6,0.9)'; ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 12; ctx.stroke();
  text(ctx, str, 0, size * 0.22, font(size, 400, D), color, 'center');
  ctx.restore();
}
function cross(ctx, x, y, r, k, color = C.red, lw = 26) {
  if (k <= 0) return;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round';
  const a = clamp(k * 2), b = clamp(k * 2 - 1);
  ctx.beginPath(); ctx.moveTo(x - r, y - r); ctx.lineTo(x - r + 2 * r * a, y - r + 2 * r * a); ctx.stroke();
  if (b > 0) { ctx.beginPath(); ctx.moveTo(x + r, y - r); ctx.lineTo(x + r - 2 * r * b, y - r + 2 * r * b); ctx.stroke(); }
  ctx.restore();
}

// ------------------------------------------------------------------ scene props
// a person; (x, y) = feet; height ~ 362*s
function human(ctx, x, y, s, color = C.white) {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(0, -300, 62, 0, M.TAU); ctx.fill();
  rrect(ctx, -95, -220, 190, 220, 70); ctx.fill();
  ctx.restore();
}
// a robot; (x, y) = feet; height ~ 434*s (antenna included)
function robot(ctx, x, y, s, t, eye = C.red) {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = C.grey; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -410); ctx.lineTo(0, -360); ctx.stroke();
  ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, -418, 16 + 4 * Math.sin(t * 8), 0, M.TAU); ctx.fill();
  rrect(ctx, -120, -360, 240, 160, 38); ctx.fillStyle = '#D9D9DE'; ctx.fill();
  rrect(ctx, -92, -332, 184, 104, 28); ctx.fillStyle = C.ink; ctx.fill();
  ctx.fillStyle = eye; for (const ex of [-42, 42]) { ctx.beginPath(); ctx.arc(ex, -280, 17, 0, M.TAU); ctx.fill(); }
  rrect(ctx, -105, -180, 210, 180, 32); ctx.fillStyle = '#D9D9DE'; ctx.fill();
  ctx.fillStyle = C.dim; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-50 + i * 50, -95, 13, 0, M.TAU); ctx.fill(); }
  ctx.restore();
}
// a crown; (x, y) = base centre
function crown(ctx, x, y, s, color = C.gold) {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(-100, -90); ctx.lineTo(-50, -40); ctx.lineTo(0, -110); ctx.lineTo(50, -40); ctx.lineTo(100, -90); ctx.lineTo(90, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C.red; for (const ex of [-50, 0, 50]) { ctx.beginPath(); ctx.arc(ex, -18, 10, 0, M.TAU); ctx.fill(); }
  ctx.restore();
}
// a globe ("la société"); (x, y) = centre
function globe(ctx, x, y, r, t) {
  if (r <= 1) return;
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#0D1526'; ctx.beginPath(); ctx.arc(0, 0, r, 0, M.TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, M.TAU); ctx.clip();
  ctx.strokeStyle = C.grey; ctx.lineWidth = 4;
  for (let i = 1; i <= 2; i++) { ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.33 * i, 0, 0, M.TAU); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke();
  const ph = (t * 0.25) % 1;
  for (let i = 0; i < 3; i++) { const k = Math.cos(((i / 3 + ph) % 1) * Math.PI); ctx.beginPath(); ctx.ellipse(0, 0, Math.abs(k) * r + 1, r, 0, 0, M.TAU); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = C.white; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 0, r, 0, M.TAU); ctx.stroke();
  ctx.restore();
}
// steering wheel; (x, y) = centre
function wheel(ctx, x, y, r, rot, color = C.white) {
  if (r <= 1) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.strokeStyle = color; ctx.lineWidth = r * 0.16; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, 0, r, 0, M.TAU); ctx.stroke();
  ctx.lineWidth = r * 0.12;
  for (const a of [Math.PI / 2, Math.PI * 7 / 6, -Math.PI / 6]) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); ctx.stroke(); }
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, 0, r * 0.24, 0, M.TAU); ctx.fill();
  ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, r * 0.12, 0, M.TAU); ctx.fill();
  ctx.restore();
}
// parliament building ("la gouvernance"); (x, y) = base centre
function capitol(ctx, x, y, s, color = C.grey) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = color;
  ctx.fillRect(-200, -30, 400, 30);
  for (let i = 0; i < 6; i++) ctx.fillRect(-175 + i * 66, -220, 28, 190);
  ctx.fillRect(-210, -250, 420, 30);
  ctx.beginPath(); ctx.moveTo(-220, -250); ctx.lineTo(0, -340); ctx.lineTo(220, -250); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// anonymous person with a question mark; (x, y) = feet
function anon(ctx, x, y, s) {
  if (s <= 0.001) return;
  human(ctx, x, y, s, C.dim);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  text(ctx, '?', 0, -262, font(110, 400, D), C.red, 'center');
  ctx.restore();
}
// balance scale; tilt > 0 = right pan (CONTRE) down; (x, y) = base
function balance(ctx, x, y, s, tilt) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = C.grey; ctx.fillRect(-12, -300, 24, 300); rrect(ctx, -110, -10, 220, 30, 12); ctx.fill();
  ctx.save(); ctx.translate(0, -300); ctx.rotate(tilt * 0.3);
  ctx.fillStyle = C.grey; ctx.fillRect(-300, -10, 600, 20);
  for (const sx of [-1, 1]) {
    ctx.save(); ctx.translate(sx * 290, 0); ctx.rotate(-tilt * 0.3);
    ctx.strokeStyle = C.grey; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-100, 150); ctx.moveTo(0, 0); ctx.lineTo(100, 150); ctx.stroke();
    ctx.fillStyle = sx < 0 ? C.white : C.red;
    ctx.beginPath(); ctx.ellipse(0, 150, 120, 28, 0, 0, Math.PI); ctx.fill();
    text(ctx, sx < 0 ? 'POUR' : 'CONTRE', 0, 130, font(66, 400, D), sx < 0 ? C.white : C.red, 'center');
    ctx.restore();
  }
  ctx.restore();
  ctx.restore();
}

// ------------------------------------------------------------------ S1 hook: smarter machines, but not deciding for us (0 - 6.4)
function sHook(ctx, t) {
  bg(ctx, t, 0);
  ctx.save(); shakeAt(ctx, t, 3.68, 16);
  popWord(ctx, 'LES GÉANTS', 90, 330, 160, C.white, t, -0.3);
  popWord(ctx, "DE L'IA", 90, 460, 160, C.red, t, -0.3);
  // the machine grows taller than the human on "plus intelligentes"
  const g = E.outBack(prog(t, 1.9, 2.5));
  const rs = lerp(0.8, 1.15, g);
  human(ctx, 290, 1140, 1.0);
  robot(ctx, 760, 1140, rs, t);
  if (t >= 2.04) {
    const k = sp(t, 2.04, SPRING.bouncy);
    const y1 = 1140 - 362, y0 = 1140 - 434 * rs;
    const yy = lerp(y1, y0, clamp(k));
    ctx.save(); ctx.globalAlpha = clamp(k * 2);
    ctx.strokeStyle = C.red; ctx.lineWidth = 10; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(525, y1); ctx.lineTo(525, yy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(500, yy + 30); ctx.lineTo(525, yy); ctx.lineTo(550, yy + 30); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
  // "mais pas qu'elles décident à notre place"
  if (t < 5.6) {
    ctx.save(); shakeAt(ctx, t, 3.68, 16);
    stamp(ctx, 'DÉCIDER ? NON', W / 2, 620, 620, 110, t, 3.68, -0.05, C.red);
    ctx.restore();
    popWord(ctx, 'À NOTRE PLACE', W / 2, 1240, 90, C.white, t, 4.18, 'center');
  }
  // "Enfin, pas tous."
  ctx.save(); shakeAt(ctx, t, 5.6, 18);
  stamp(ctx, 'ENFIN, PAS TOUS', W / 2, 760, 720, 120, t, 5.6, 0.05, C.white);
  ctx.restore();
}

// ------------------------------------------------------------------ S2 Axios: some Anthropic staff think power will pass to AI (6.4 - 15.14)
function sAxios(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 6.4, 6.7));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  chip(ctx, 'SELON AXIOS', 90, 290, t, 6.6, C.white);
  popWord(ctx, 'DES SALARIÉS', 90, 440, 130, C.white, t, 7.76);
  popWord(ctx, "D'ANTHROPIC", 90, 560, 130, C.red, t, 8.24);
  chip(ctx, 'CRÉATEUR DE CLAUDE', 90, 640, t, 9.5, C.red);
  // the crown leaves the human's head and lands on the AI's
  human(ctx, 270, 1240, 0.75 * sp(t, 6.7, SPRING.gentle));
  robot(ctx, 800, 1240, 0.72 * sp(t, 7.1, SPRING.gentle), t);
  const hx = 270, hy = 1240 - 362 * 0.75 - 10, rx = 800, ry = 1240 - 434 * 0.72 + 10;
  const mp = E.inOutCubic(prog(t, 11.76, 12.7));
  const cx = lerp(hx, rx, mp), cy = lerp(hy, ry, mp) - Math.sin(mp * Math.PI) * 160;
  crown(ctx, cx, cy, 0.7 * sp(t, 7.4, SPRING.bouncy));
  if (t < 14.36) {
    popWord(ctx, "L'AUTORITÉ", W / 2, 750, 90, C.gold, t, 11.76, 'center');
    popWord(ctx, 'AUX SUPER-IA', W / 2, 840, 90, C.white, t, 12.74, 'center');
  }
  ctx.restore();
  ctx.save(); shakeAt(ctx, t, 14.36, 16);
  stamp(ctx, 'ET CE SERAIT BIEN', W / 2, 800, 820, 100, t, 14.36, -0.05, C.red);
  ctx.restore();
  source(ctx, 'Axios, 25/11/2026, sources anonymes', t, 7.0);
}

// ------------------------------------------------------------------ S3 Meta's Alexandr Wang refuses (15.14 - 19.56)
function sWang(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 15.14, 15.44));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  ctx.save(); shakeAt(ctx, t, 15.34, 14);
  slam(ctx, 'META', W / 2, 400, 200, C.white, t, 15.34);
  ctx.restore();
  popWord(ctx, 'ALEXANDR WANG', W / 2, 520, 90, C.grey, t, 16.08, 'center');
  // the globe ("la société") slides towards the robot... and is stopped by a red bar
  const gx = lerp(270, 470, E.outCubic(prog(t, 17.7, 18.3)));
  globe(ctx, gx, 820, 150 * sp(t, 15.5, SPRING.bouncy), t);
  robot(ctx, 870, 1060, 0.7 * sp(t, 15.8, SPRING.gentle), t);
  popWord(ctx, 'LA SOCIÉTÉ', gx, 1050, 64, C.white, t, 18.2, 'center');
  const stop = sp(t, 18.2, SPRING.bouncy);
  if (stop > 0.001) {
    ctx.save(); ctx.translate(680, 830); ctx.scale(1, stop);
    ctx.fillStyle = C.red; rrect(ctx, -18, -190, 36, 380, 12); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
  ctx.save(); shakeAt(ctx, t, 16.68, 16);
  stamp(ctx, 'REFUSE', W / 2, 1200, 460, 100, t, 16.68, -0.06, C.red);
  ctx.restore();
  source(ctx, "Alexandr Wang, patron de l'IA chez Meta, essai sur X, 22/11/2026", t, 16.2);
}

// ------------------------------------------------------------------ S4 Sam Altman: humans keep control of the future (19.56 - 24.38)
function sAltman(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 19.56, 19.86));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  // road to the future
  const rp = E.outCubic(prog(t, 19.7, 20.5));
  ctx.save(); ctx.globalAlpha = rp;
  ctx.fillStyle = C.card;
  ctx.beginPath(); ctx.moveTo(W / 2 - 50, 620); ctx.lineTo(W / 2 + 50, 620); ctx.lineTo(W / 2 + 420, 1240); ctx.lineTo(W / 2 - 420, 1240); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C.grey;
  const off = (t * 1.4) % 1;
  for (let i = 0; i < 6; i++) {
    const z = (i + off) / 6, y = lerp(630, 1180, z * z), w = lerp(6, 30, z * z), h = lerp(10, 60, z * z);
    ctx.fillRect(W / 2 - w / 2, y, w, h);
  }
  ctx.restore();
  ctx.save(); shakeAt(ctx, t, 19.82, 14);
  slam(ctx, 'SAM ALTMAN', W / 2, 400, 170, C.white, t, 19.82);
  ctx.restore();
  chip(ctx, "PATRON D'OPENAI", W / 2, 490, t, 21.1, C.red, 'center');
  const wk = sp(t, 22.36, SPRING.bouncy);
  const rot = 0.25 * Math.sin((t - 22.36) * 2.2) * clamp(t - 22.36);
  wheel(ctx, W / 2, 1020, 160 * wk, rot, C.white);
  popWord(ctx, 'LE CONTRÔLE', 90, 700, 100, C.white, t, 23.02);
  popWord(ctx, "DE L'AVENIR", W - 90, 810, 100, C.red, t, 23.62, 'right');
  ctx.restore();
  source(ctx, 'Sam Altman, sur X, 4/11/2026', t, 20.2);
}

// ------------------------------------------------------------------ S5 Dario Amodei: "absurde", AI governance is a bad idea (24.38 - 29.9)
function sAmodei(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 24.38, 24.68));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'LE PATRON', 90, 330, 130, C.white, t, 24.42);
  popWord(ctx, "D'ANTHROPIC", 90, 450, 130, C.red, t, 24.88);
  chip(ctx, 'DARIO AMODEI', 90, 530, t, 25.1, C.white);
  // parliament with a robot on top, crossed out
  const ck = sp(t, 24.7, SPRING.gentle), rk = sp(t, 27.66, SPRING.bouncy);
  if (ck > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(ck * 2);
    capitol(ctx, W / 2, 1180, 1.0 * ck, C.grey);
    robot(ctx, W / 2, 840 - (1 - rk) * 60, 0.4 * rk, t);
    ctx.restore();
  }
  popWord(ctx, "L'IA AU POUVOIR", W / 2, 630, 90, C.white, t, 27.98, 'center');
  cross(ctx, W / 2, 960, 220, prog(t, 29.2, 29.5), C.red, 30);
  ctx.restore();
  if (t < 27.66) {
    ctx.save(); shakeAt(ctx, t, 26.02, 18);
    stamp(ctx, 'ABSURDE', W / 2, 860, 560, 150, t, 26.02, -0.06, C.red);
    ctx.restore();
  }
  ctx.save(); shakeAt(ctx, t, 29.2, 16);
  stamp(ctx, 'MAUVAISE IDÉE', W / 2, 1210, 680, 96, t, 29.2, 0.04, C.white);
  ctx.restore();
  source(ctx, 'Dario Amodei, sur X, 25/11/2026', t, 25.4);
}

// ------------------------------------------------------------------ S6 caveat: Axios's sources are anonymous (29.9 - 33.12)
function sNuance(ctx, t) {
  bg(ctx, t, 1);
  slam(ctx, 'NUANCE', W / 2, 400, 200, C.white, t, 29.9);
  popWord(ctx, "LES SOURCES D'AXIOS", W / 2, 540, 90, C.grey, t, 31.02, 'center');
  for (let i = 0; i < 3; i++) {
    const k = sp(t, 30.2 + i * 0.14, SPRING.bouncy);
    anon(ctx, 260 + i * 280, 1040 + (1 - k) * 80, 0.8 * k);
  }
  ctx.save(); shakeAt(ctx, t, 32.12, 16);
  stamp(ctx, 'ANONYMES', W / 2, 1200, 540, 100, t, 32.12, -0.05, C.red);
  ctx.restore();
}

// ------------------------------------------------------------------ S7 advice: ask the AI for the arguments against (33.12 - 38.08)
function sAdvice(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 33.12, 33.42));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'LE CONSEIL', 90, 330, 150, C.red, t, 33.16);
  popWord(ctx, 'GRANDE DÉCISION ?', 90, 450, 90, C.white, t, 35.3);
  // chat input typing the prompt
  const bk = sp(t, 33.6, SPRING.gentle);
  if (bk > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(bk * 2); ctx.translate(0, (1 - bk) * 80);
    rrect(ctx, 90, 520, W - 180, 120, 60); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
    const msg = 'Donne-moi les arguments contre.';
    const n = Math.floor(msg.length * prog(t, 36.28, 37.2));
    const shown = t < 36.28 ? '' : msg.slice(0, n);
    text(ctx, shown || 'Pose ta question...', 140, 596, font(42, 600, UI), shown ? C.white : C.dim);
    if (shown && Math.floor(t * 3) % 2 === 0) { ctx.font = font(42, 600, UI); ctx.fillStyle = C.red; ctx.fillRect(140 + ctx.measureText(shown).width + 6, 556, 4, 52); }
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(W - 150, 580, 40, 0, M.TAU); ctx.fill();
    ctx.restore();
  }
  // balance swings, then tips to CONTRE once asked
  const sk = sp(t, 34.0, SPRING.gentle);
  if (sk > 0.001) {
    const tilt = -0.5 + 0.5 * E.outCubic(prog(t, 34.2, 34.9)) + 0.9 * E.outBack(prog(t, 37.24, 37.8));
    ctx.save(); ctx.globalAlpha = clamp(sk * 2);
    balance(ctx, W / 2, 1190, 0.95, tilt);
    ctx.restore();
  }
  ctx.restore();
}

// ------------------------------------------------------------------ S8 question + end card (38.08 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 1);
  const up = E.inOutCubic(prog(t, 39.55, 39.9));
  ctx.save(); ctx.translate(0, -up * 1400);
  slam(ctx, 'ET TOI ?', W / 2, 420, 220, C.white, t, 38.08);
  popWord(ctx, 'TU LUI LAISSERAIS', W / 2, 600, 110, C.white, t, 38.66, 'center');
  popWord(ctx, 'LE VOLANT ?', W / 2, 740, 140, C.red, t, 39.16, 'center');
  wheel(ctx, W / 2, 1040, 170 * sp(t, 38.3, SPRING.bouncy), 0.3 * Math.sin(t * 2), C.white);
  ctx.restore();
  if (t >= 39.55) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 39.65, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 39.85, 'center');
    const k = sp(t, 39.9, SPRING.bouncy);
    ctx.save(); ctx.translate(W / 2, 1010); ctx.scale(k, k);
    rrect(ctx, -280, -66, 560, 124, 62); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, 'Abonne-toi', 0, 18, font(60, 800, UI), C.white, 'center');
    ctx.restore();
    popWord(ctx, 'Réponds en commentaire', W / 2, 1180, 44, C.grey, t, 40.3, 'center', UI, 600);
    ctx.restore();
  }
}

M.film({
  fonts: [font(100, 400, D), font(40, 400, UI), font(40, 600, UI), font(40, 800, UI)],
  hits: HITS,
  draw(ctx, u, t) {
    if (t < 6.4) sHook(ctx, t);
    else if (t < 15.14) sAxios(ctx, t);
    else if (t < 19.56) sWang(ctx, t);
    else if (t < 24.38) sAltman(ctx, t);
    else if (t < 29.9) sAmodei(ctx, t);
    else if (t < 33.12) sNuance(ctx, t);
    else if (t < 38.08) sAdvice(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
