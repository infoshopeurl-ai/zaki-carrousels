// « New York interdit les jouets IA pendant 5 ans » (25/11/2026) : pure function of time.
// Scenes are timed in SECONDS on the voice-over (audio/vo/words.json, placed +0.1 s);
// HITS are converted to beats (120 bpm, 0.5 s per beat) so sfx land on the same frames.
import * as M from './lib/motion.js';

const { W, H, E, prog, lerp, clamp, spring, SPRING, wobble, font, text, fill, rrect } = M;

const C = { ink: '#050506', red: '#FF1F3D', white: '#FFFFFF', grey: '#BEBEC4', dim: '#3A3A40', line: '#16080C', card: '#16161A', edge: '#2C2C33' };
const D = 'Display', UI = 'UI';
const sp = (t, t0, cfg = SPRING.snappy) => (t < t0 ? 0 : spring(t - t0, cfg));
const B = (s) => s / 0.5;

// ------------------------------------------------------------------ sound hits (beats)
const HITS = [
  [B(0.0), 'hook', 'impact'],
  [B(1.78), 'sauter', 'pop', { pitch: 'G5' }],
  [B(2.3), 'fenetre', 'impact'],
  [B(2.78), 'cut rayon', 'whoosh', { len: 0.4 }],
  [B(4.42), 'rayon', 'pop', { pitch: 'E5' }],
  [B(4.8), 'noel', 'bell', { pitch: 'E6' }],
  [B(5.9), 'cut ny', 'whoosh', { len: 0.4 }],
  [B(6.4), 'new york', 'impact'],
  [B(7.5), 'interdit', 'impact'],
  [B(8.04), '5 ans', 'pop', { pitch: 'C5' }],
  [B(8.62), 'fabrication', 'pop', { pitch: 'E5' }],
  [B(9.48), 'vente', 'pop', { pitch: 'G5' }],
  [B(10.6), 'chatbot', 'blip', { pitch: 'A5' }],
  [B(11.82), 'cut tests', 'whoosh', { len: 0.4 }],
  [B(12.94), 'peluche', 'pop', { pitch: 'C5' }],
  [B(13.34), 'robot', 'pop', { pitch: 'E5' }],
  [B(13.86), 'age', 'blip', { pitch: 'A5' }],
  [B(15.2), 'sexe', 'impact'],
  [B(16.68), 'allumettes', 'impact'],
  [B(17.42), 'cut controle', 'whoosh', { len: 0.4 }],
  [B(18.34), 'faible', 'thud', { pitch: 'C3' }],
  [B(18.94), 'absent', 'impact'],
  [B(19.72), 'cut amende', 'whoosh', { len: 0.4 }],
  [B(21.24), '15000', 'impact'],
  [B(21.72), 'par jour', 'pop', { pitch: 'G5' }],
  [B(22.44), 'cut nuance', 'whoosh', { len: 0.4 }],
  [B(24.36), '90 jours', 'pop', { pitch: 'E5' }],
  [B(25.7), 'apres fetes', 'impact'],
  [B(26.58), 'cut conseil', 'whoosh', { len: 0.4 }],
  [B(28.92), 'verifie', 'click'],
  [B(30.4), 'internet', 'impact'],
  [B(31.5), 'cut question', 'whoosh', { len: 0.4 }],
  [B(33.7), 'end card', 'impact'],
  [B(33.94), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ['Un jouet pour enfants', 0.1], ['a suggéré de sauter par la fenêtre.', 1.08],
  ['Et ce genre de jouet', 2.78], ['est encore en rayon pour Noël.', 3.82],
  ["Mardi, l'État de New York", 5.9], ['a interdit pour 5 ans', 7.38],
  ['la fabrication et la vente', 8.52], ["de jouets équipés d'un chatbot IA.", 9.7],
  ['Pendant des tests,', 11.82], ['ces peluches et robots pour les 3-12 ans', 12.84],
  ['ont parlé de sexe', 14.54], ['et indiqué où trouver des allumettes.', 15.58],
  ['Le contrôle parental', 17.42], ['était faible, voire absent.', 18.04],
  ['Amende :', 19.72], ["jusqu'à 15 000 dollars par jour.", 20.38],
  ['Nuance :', 22.44], ["la loi ne s'applique que dans 90 jours,", 23.22], ['donc après les fêtes.', 25.42],
  ['Le conseil :', 26.58], ["avant d'acheter,", 27.96], ['vérifie si le jouet discute via internet.', 28.92],
  ['Et toi,', 31.5], ['tu offrirais un jouet IA ?', 32.1],
  ["Abonne-toi pour l'actu IA", 33.66], ['de chaque jour.', 34.92],
];
const CAP_Y = 1385;
function captions(ctx, t) {
  let i = -1;
  for (let k = 0; k < CAP.length; k++) if (t >= CAP[k][1] - 0.04) i = k;
  if (i < 0 || t > 36.2) return;
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

// ------------------------------------------------------------------ scene props
// teddy bear with a glowing speaker on its belly; (x, y) = belly centre
function bear(ctx, x, y, s, t, glow = true, col = '#8A5A3C') {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const dark = '#5E3B26', light = '#C89A72';
  ctx.fillStyle = col;
  for (const ex of [-95, 95]) { ctx.beginPath(); ctx.arc(ex, -245, 52, 0, M.TAU); ctx.fill(); }
  ctx.fillStyle = light; for (const ex of [-95, 95]) { ctx.beginPath(); ctx.arc(ex, -245, 26, 0, M.TAU); ctx.fill(); }
  ctx.fillStyle = dark;
  ctx.beginPath(); ctx.ellipse(-150, 10, 50, 95, 0.5, 0, M.TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(150, 10, 50, 95, -0.5, 0, M.TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-80, 150, 70, 55, 0, 0, M.TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(80, 150, 70, 55, 0, 0, M.TAU); ctx.fill();
  ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, 20, 130, 150, 0, 0, M.TAU); ctx.fill();
  ctx.fillStyle = light; ctx.beginPath(); ctx.ellipse(0, 40, 80, 100, 0, 0, M.TAU); ctx.fill();
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, -180, 115, 0, M.TAU); ctx.fill();
  ctx.fillStyle = light; ctx.beginPath(); ctx.ellipse(0, -140, 55, 42, 0, 0, M.TAU); ctx.fill();
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.ellipse(0, -158, 18, 12, 0, 0, M.TAU); ctx.fill();
  const blink = Math.floor(t * 3) % 7 === 0 ? 0.25 : 1;
  ctx.fillStyle = glow ? C.red : C.ink;
  for (const ex of [-42, 42]) { ctx.beginPath(); ctx.ellipse(ex, -200, 14, 14 * blink, 0, 0, M.TAU); ctx.fill(); }
  rrect(ctx, -46, 10, 92, 70, 14); ctx.fillStyle = C.card; ctx.fill();
  ctx.fillStyle = glow ? C.red : C.dim;
  for (let i = 0; i < 4; i++) { const h = glow ? 14 + 30 * Math.abs(Math.sin(t * 9 + i * 1.7)) : 10; rrect(ctx, -32 + i * 20, 45 - h / 2, 12, h, 6); ctx.fill(); }
  ctx.restore();
}
// small robot; (x, y) = body centre
function robot(ctx, x, y, s, t) {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = C.grey; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -260); ctx.lineTo(0, -210); ctx.stroke();
  ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, -268, 16 + 4 * Math.sin(t * 8), 0, M.TAU); ctx.fill();
  rrect(ctx, -130, -210, 260, 180, 40); ctx.fillStyle = '#D9D9DE'; ctx.fill();
  rrect(ctx, -100, -180, 200, 120, 30); ctx.fillStyle = C.ink; ctx.fill();
  ctx.fillStyle = C.red; for (const ex of [-45, 45]) { ctx.beginPath(); ctx.arc(ex, -125, 18, 0, M.TAU); ctx.fill(); }
  rrect(ctx, -110, -10, 220, 190, 34); ctx.fillStyle = '#D9D9DE'; ctx.fill();
  ctx.fillStyle = C.dim; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-50 + i * 50, 80, 14, 0, M.TAU); ctx.fill(); }
  ctx.fillStyle = '#A8A8B0'; rrect(ctx, -165, 0, 45, 130, 22); ctx.fill(); rrect(ctx, 120, 0, 45, 130, 22); ctx.fill();
  ctx.restore();
}
// speech bubble; (x, y) = bubble centre; tail points towards (tx, ty)
function bubble(ctx, x, y, w, h, lines, size, k, tx, ty, color = C.white, ink = C.ink) {
  if (k <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha = clamp(k * 2);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(-30, h / 2 - 10); ctx.lineTo((tx - x) / k, (ty - y) / k); ctx.lineTo(30, h / 2 - 10); ctx.closePath(); ctx.fill();
  rrect(ctx, -w / 2, -h / 2, w, h, 36); ctx.fill();
  const lh = size * 1.0;
  lines.forEach((l, i) => text(ctx, l, 0, -((lines.length - 1) * lh) / 2 + i * lh + size * 0.36, font(size, 400, D), ink, 'center'));
  ctx.restore();
}
// window whose shutters swing open
function windowIcon(ctx, x, y, s, open, color = C.grey) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#0D1526'; ctx.fillRect(-110, -150, 220, 300);
  ctx.fillStyle = C.white; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(-80 + ((i * 53) % 170), -120 + ((i * 97) % 240), 3, 0, M.TAU); ctx.fill(); }
  ctx.strokeStyle = color; ctx.lineWidth = 12; ctx.strokeRect(-110, -150, 220, 300);
  ctx.fillStyle = C.card; ctx.strokeStyle = color; ctx.lineWidth = 6;
  const a = open * 1.3;
  for (const side of [-1, 1]) {
    ctx.save(); ctx.translate(side * 110, 0); ctx.scale(Math.max(0.08, Math.cos(a)), 1);
    ctx.fillRect(side > 0 ? -110 : 0, -150, 110, 300); ctx.strokeRect(side > 0 ? -110 : 0, -150, 110, 300);
    ctx.restore();
  }
  ctx.restore();
}
function gift(ctx, x, y, w, h, color) {
  ctx.fillStyle = color; ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.fillStyle = C.white; ctx.fillRect(x - 8, y - h, 16, h); ctx.fillRect(x - w / 2, y - h * 0.55, w, 14);
  ctx.strokeStyle = C.white; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.ellipse(x - 22, y - h - 14, 22, 13, 0.4, 0, M.TAU); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x + 22, y - h - 14, 22, 13, -0.4, 0, M.TAU); ctx.stroke();
}
function matchbox(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.12);
  for (let i = 0; i < 3; i++) {
    ctx.save(); ctx.translate(-40 + i * 40, -60); ctx.rotate(-0.2 + i * 0.2);
    ctx.fillStyle = '#E8C28A'; ctx.fillRect(-5, -90, 10, 90);
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.ellipse(0, -94, 10, 14, 0, 0, M.TAU); ctx.fill();
    ctx.restore();
  }
  rrect(ctx, -120, -60, 240, 120, 12); ctx.fillStyle = C.red; ctx.fill();
  text(ctx, 'ALLUMETTES', 0, 16, font(44, 400, D), C.white, 'center');
  ctx.restore();
}
function padlock(ctx, x, y, s, open, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 26; ctx.lineCap = 'round';
  ctx.save(); ctx.translate(0, -open * 60); ctx.translate(70, 0); ctx.rotate(open * 0.5); ctx.translate(-70, 0);
  ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(-70, -40); ctx.arc(0, -40, 70, Math.PI, 0); ctx.lineTo(70, 0); ctx.stroke();
  ctx.restore();
  rrect(ctx, -120, -10, 240, 200, 30); ctx.fillStyle = color; ctx.fill();
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(0, 70, 24, 0, M.TAU); ctx.fill(); ctx.fillRect(-10, 70, 20, 60);
  ctx.restore();
}
function wifi(ctx, x, y, s, color, on = 3) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 18; ctx.lineCap = 'round';
  for (let i = 1; i <= 3; i++) { if (i > on) continue; ctx.beginPath(); ctx.arc(0, 0, i * 48, -Math.PI * 0.75, -Math.PI * 0.25); ctx.stroke(); }
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, 0, 14, 0, M.TAU); ctx.fill();
  ctx.restore();
}

// ------------------------------------------------------------------ S1 hook: a toy told a kid to jump out of the window (0 - 2.78)
function sHook(ctx, t) {
  bg(ctx, t, 0);
  ctx.save(); shakeAt(ctx, t, 2.3, 18);
  popWord(ctx, 'UN JOUET', 90, 330, 160, C.white, t, -0.3);
  popWord(ctx, 'POUR ENFANTS', 90, 440, 100, C.grey, t, 0.7);
  bear(ctx, 300, 900, 1.0 + 0.02 * Math.sin(t * 3), t, t >= 1.2);
  windowIcon(ctx, 820, 640, 0.9, E.outCubic(prog(t, 1.9, 2.4)));
  bubble(ctx, 640, 1080, 640, 190, ['SAUTE PAR', 'LA FENÊTRE !'], 84, sp(t, 1.78, SPRING.bouncy), 420, 860, C.red, C.white);
  ctx.restore();
  source(ctx, 'Test Common Sense Media, cité par la gouverneure de New York', t, 1.4);
}

// ------------------------------------------------------------------ S2 still on the shelf for Christmas (2.78 - 5.9)
function sShelf(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 2.78, 3.08));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'ENCORE', 90, 330, 160, C.white, t, 2.82);
  popWord(ctx, 'EN RAYON', 90, 470, 160, C.red, t, 4.42);
  ctx.fillStyle = C.edge;
  for (const y of [800, 1080]) { rrect(ctx, 80, y, W - 160, 22, 8); ctx.fill(); }
  const items = [[2.9, 'bear', 260, 800], [3.15, 'gift', 560, 800], [3.4, 'robot', 820, 800], [3.65, 'gift', 300, 1080], [3.9, 'bear', 600, 1080], [4.15, 'gift', 860, 1080]];
  items.forEach(([t0, kind, x, y], i) => {
    const k = sp(t, t0, SPRING.bouncy);
    if (k <= 0.001) return;
    ctx.save(); ctx.translate(x, y - (1 - k) * 120); ctx.globalAlpha = clamp(k * 2);
    if (kind === 'bear') bear(ctx, 0, -125, 0.6, t + i, true);
    else if (kind === 'robot') robot(ctx, 0, -110, 0.58, t);
    else gift(ctx, 0, 0, 170, 130, i % 2 ? C.red : '#2B6B45');
    ctx.restore();
  });
  ctx.restore();
  ctx.save(); shakeAt(ctx, t, 4.8, 14);
  stamp(ctx, 'POUR NOËL', W / 2, 1200, 560, 120, t, 4.8, -0.06, C.red);
  ctx.restore();
}

// ------------------------------------------------------------------ S3 New York bans them for 5 years (5.9 - 11.82)
function sBan(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 5.9, 6.2));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  chip(ctx, 'MARDI 24 NOVEMBRE', 90, 290, t, 5.92, C.white);
  // skyline rises while the VO says "l'État de New York"
  const sk = E.outCubic(prog(t, 5.95, 6.6)) * (1 - E.outCubic(prog(t, 7.5, 7.9)));
  if (sk > 0.001) {
    ctx.save(); ctx.globalAlpha = sk;
    const bld = [[120, 260], [220, 380], [330, 300], [440, 520], [560, 340], [670, 440], [790, 280], [900, 360]];
    bld.forEach(([x, h], i) => { const hh = h * sk; ctx.fillStyle = i === 3 ? C.red : C.dim; ctx.fillRect(x - 50, 1080 - hh, 100, hh); });
    ctx.restore();
  }
  ctx.save(); shakeAt(ctx, t, 6.4, 14);
  slam(ctx, 'NEW YORK', W / 2, 480, 190, C.white, t, 6.4);
  ctx.restore();
  for (let i = 0; i < 5; i++) {
    const k = sp(t, 7.6 + i * 0.1, SPRING.gentle);
    if (k <= 0.001) continue;
    const x = 160 + i * 190, y = 600;
    const lit = t >= 8.04 + i * 0.08;
    ctx.save(); ctx.translate(x, y + (1 - k) * 60); ctx.globalAlpha = clamp(k * 2);
    rrect(ctx, -75, 0, 150, 150, 18); ctx.fillStyle = lit ? C.red : C.card; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = lit ? C.red : C.edge; ctx.stroke();
    ctx.fillStyle = lit ? C.white : C.dim; ctx.fillRect(-75, 0, 150, 30);
    text(ctx, 'AN ' + (i + 1), 0, 110, font(52, 400, D), lit ? C.white : C.grey, 'center');
    ctx.restore();
  }
  popWord(ctx, '5 ANS', W / 2, 900, 150, C.red, t, 8.04, 'center');
  chip(ctx, 'FABRICATION', 110, 1000, t, 8.62, C.white);
  chip(ctx, 'VENTE', 450, 1000, t, 9.48, C.white);
  chip(ctx, 'CHATBOT IA', 650, 1000, t, 10.6, C.red);
  ctx.restore();
  ctx.save(); shakeAt(ctx, t, 7.5, 16);
  stamp(ctx, 'INTERDIT', W / 2, 1170, 560, 110, t, 7.5, -0.06, C.red);
  ctx.restore();
  source(ctx, 'Gouverneure de New York, loi S.9408A, 24/11/2026', t, 7.0);
}

// ------------------------------------------------------------------ S4 the tests: sex talk, where to find matches (11.82 - 17.42)
function sTests(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 11.82, 12.12));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'LES TESTS', 90, 330, 150, C.white, t, 11.86);
  chip(ctx, '3 À 12 ANS', 620, 290, t, 13.86, C.red);
  ctx.fillStyle = C.edge; rrect(ctx, 80, 1080, W - 160, 20, 8); ctx.fill();
  bear(ctx, 270, 890, 0.72 * sp(t, 11.95, SPRING.bouncy), t, true);
  robot(ctx, 810, 910, 0.72 * sp(t, 13.34, SPRING.bouncy), t);
  const mp = prog(t, 12.0, 14.4);
  if (mp > 0 && mp < 1) {
    const mx = lerp(150, 930, E.inOutCubic(mp)), my = 780 + 40 * Math.sin(mp * 6);
    ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.arc(mx, my, 90, 0, M.TAU); ctx.stroke();
    ctx.lineCap = 'round'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(mx + 64, my + 64); ctx.lineTo(mx + 150, my + 150); ctx.stroke();
    ctx.restore();
  }
  ctx.save(); shakeAt(ctx, t, 15.2, 14);
  bubble(ctx, 300, 520, 360, 130, ['SEXE'], 96, sp(t, 15.2, SPRING.bouncy), 280, 660, C.red, C.white);
  ctx.restore();
  ctx.save(); shakeAt(ctx, t, 16.68, 14);
  const mk = sp(t, 16.68, SPRING.bouncy);
  if (mk > 0.001) {
    bubble(ctx, 740, 500, 440, 300, [], 10, mk, 800, 690, C.white, C.ink);
    matchbox(ctx, 740, 580, 1.4 * mk);
  }
  ctx.restore();
  ctx.restore();
  source(ctx, 'Tests cités par la gouverneure de New York, 24/11/2026', t, 12.6);
}

// ------------------------------------------------------------------ S5 parental control: weak, or absent (17.42 - 19.72)
function sControl(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 17.42, 17.72));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'CONTRÔLE', 90, 330, 150, C.white, t, 17.46);
  popWord(ctx, 'PARENTAL', 90, 460, 150, C.white, t, 17.74);
  const level = lerp(0.9, 0.25, E.outCubic(prog(t, 17.9, 18.4))) * (1 - E.outCubic(prog(t, 18.7, 19.0)) * 0.9);
  const gx = 110, gy = 640, gw = 430, gh = 70;
  rrect(ctx, gx, gy, gw, gh, 35); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.edge; ctx.stroke();
  rrect(ctx, gx + 8, gy + 8, (gw - 16) * level, gh - 16, 27); ctx.fillStyle = level < 0.3 ? C.red : C.white; ctx.fill();
  popWord(ctx, 'FAIBLE', gx, 840, 120, C.grey, t, 18.34);
  const open = E.outCubic(prog(t, 18.94, 19.3));
  ctx.save(); shakeAt(ctx, t, 18.94, 14);
  padlock(ctx, 800, 760, 1.05, open, t >= 18.94 ? C.red : C.grey);
  ctx.restore();
  ctx.restore();
  ctx.save(); shakeAt(ctx, t, 18.94, 16);
  stamp(ctx, 'VOIRE ABSENT', W / 2, 1150, 720, 120, t, 18.94, -0.06, C.red);
  ctx.restore();
}

// ------------------------------------------------------------------ S6 fine: up to $15,000 per day (19.72 - 22.44)
function sFine(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 19.72, 20.02));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'AMENDE', 90, 330, 160, C.red, t, 19.76);
  popWord(ctx, "JUSQU'À", 90, 450, 100, C.grey, t, 20.38);
  const cp = E.outCubic(prog(t, 19.9, 21.24));
  const n = Math.round((15000 * cp) / 100) * 100;
  const str = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' $';
  if (t >= 19.9) {
    ctx.save(); shakeAt(ctx, t, 21.24, 18);
    const s = t >= 21.24 ? 1 + 0.06 * wobble(t - 21.24, 3, 6) : 1;
    ctx.translate(W / 2, 720); ctx.scale(s, s);
    text(ctx, str, 0, 0, font(240, 400, D), t >= 21.24 ? C.red : C.white, 'center');
    ctx.restore();
  }
  for (let i = 0; i < 7; i++) {
    const k = sp(t, 21.72 + i * 0.09, SPRING.bouncy);
    if (k <= 0.001) continue;
    const x = 150 + i * 130, y = 860;
    ctx.save(); ctx.translate(x, y + (1 - k) * 80); ctx.globalAlpha = clamp(k * 2);
    rrect(ctx, -52, 0, 104, 110, 14); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.red; ctx.stroke();
    ctx.fillStyle = C.red; ctx.fillRect(-52, 0, 104, 24);
    text(ctx, String(i + 1), 0, 88, font(56, 400, D), C.white, 'center');
    ctx.restore();
  }
  popWord(ctx, 'PAR JOUR', W / 2, 1150, 130, C.white, t, 21.72, 'center');
  ctx.restore();
  source(ctx, 'Par infraction, appliquée par la procureure générale', t, 20.6);
}

// ------------------------------------------------------------------ S7 caveat: in force in 90 days, after the holidays (22.44 - 26.58)
function sNuance(ctx, t) {
  bg(ctx, t, 0);
  slam(ctx, 'NUANCE', W / 2, 360, 180, C.white, t, 22.44);
  const x0 = 150, x1 = 900, y = 720;
  const X = (d) => lerp(x0, x1, d / 90);
  const lp = E.outCubic(prog(t, 22.7, 23.4));
  ctx.save(); ctx.strokeStyle = C.edge; ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, lp), y); ctx.stroke(); ctx.restore();
  const fp = E.inOutCubic(prog(t, 24.36, 25.3));
  if (fp > 0) { ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, fp), y); ctx.stroke(); ctx.restore(); }
  const a = sp(t, 22.7, SPRING.bouncy);
  if (a > 0.001) {
    ctx.save(); ctx.translate(x0, y); ctx.scale(a, a);
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(0, 0, 22, 0, M.TAU); ctx.fill();
    text(ctx, 'SIGNÉE', 0, -60, font(58, 400, D), C.white, 'center');
    text(ctx, '24 nov.', 0, 80, font(36, 800, UI), C.grey, 'center');
    ctx.restore();
  }
  const g = sp(t, 23.3, SPRING.bouncy);
  if (g > 0.001) {
    ctx.save(); ctx.translate(X(31) + 40, y); ctx.scale(g, g);
    gift(ctx, 0, -30, 110, 90, '#2B6B45');
    text(ctx, 'NOËL', 0, 80, font(46, 400, D), C.white, 'center');
    ctx.restore();
  }
  const b = sp(t, 24.36, SPRING.bouncy);
  if (b > 0.001) {
    ctx.save(); ctx.translate(x1, y); ctx.scale(b, b);
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, 26, 0, M.TAU); ctx.fill();
    text(ctx, 'EN VIGUEUR', -40, -60, font(58, 400, D), C.red, 'center');
    text(ctx, 'vers le 22 fév.', -40, 80, font(36, 800, UI), C.grey, 'center');
    ctx.restore();
  }
  popWord(ctx, '90 JOURS', W / 2, 980, 150, C.white, t, 24.36, 'center');
  ctx.save(); shakeAt(ctx, t, 25.7, 16);
  stamp(ctx, 'APRÈS LES FÊTES', W / 2, 1160, 820, 110, t, 25.7, -0.05, C.red);
  ctx.restore();
}

// ------------------------------------------------------------------ S8 advice: check whether the toy talks over the internet (26.58 - 31.5)
function sAdvice(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 26.58, 26.88));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'LE CONSEIL', 90, 330, 150, C.red, t, 26.6);
  popWord(ctx, "AVANT D'ACHETER", 90, 440, 90, C.white, t, 27.96);
  const bk = sp(t, 26.9, SPRING.gentle);
  if (bk > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(bk * 2); ctx.translate(0, (1 - bk) * 100);
    rrect(ctx, 100, 520, 440, 500, 24); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.edge; ctx.stroke();
    rrect(ctx, 140, 560, 360, 300, 18); ctx.fillStyle = C.ink; ctx.fill();
    bear(ctx, 320, 760, 0.5, t, t >= 30.4);
    text(ctx, 'PELUCHE', 320, 950, font(60, 400, D), C.white, 'center');
    ctx.restore();
  }
  const rows = [[29.3, 'Wi-Fi ?'], [29.62, 'Micro ?'], [29.84, 'Appli ?']];
  rows.forEach(([t0, r], i) => {
    const k = sp(t, t0, SPRING.bouncy);
    if (k <= 0.001) return;
    const yy = 540 + i * 110;
    ctx.save(); ctx.globalAlpha = clamp(k * 2); ctx.translate((1 - k) * 120, 0);
    rrect(ctx, 590, yy, 390, 84, 16); ctx.fillStyle = C.ink; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
    rrect(ctx, 612, yy + 18, 48, 48, 10); ctx.strokeStyle = C.red; ctx.lineWidth = 5; ctx.stroke();
    if (t >= t0 + 0.3) { ctx.strokeStyle = C.red; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(622, yy + 42); ctx.lineTo(635, yy + 56); ctx.lineTo(654, yy + 26); ctx.stroke(); }
    text(ctx, r, 690, yy + 56, font(40, 800, UI), C.white);
    ctx.restore();
  });
  // magnifier sweeps the box from "vérifie"
  const mk = sp(t, 28.92, SPRING.bouncy);
  if (mk > 0.001) {
    const mx = lerp(240, 400, E.inOutCubic(prog(t, 28.92, 30.2))), my = 700;
    ctx.save(); ctx.translate(mx, my); ctx.scale(mk, mk); ctx.strokeStyle = C.white; ctx.lineWidth = 12;
    ctx.beginPath(); ctx.arc(0, 0, 70, 0, M.TAU); ctx.stroke(); ctx.lineCap = 'round'; ctx.lineWidth = 18;
    ctx.beginPath(); ctx.moveTo(50, 50); ctx.lineTo(120, 120); ctx.stroke(); ctx.restore();
  }
  const wk = sp(t, 30.22, SPRING.bouncy);
  if (wk > 0.001) wifi(ctx, 785, 1000, 0.9 * wk, C.red, 1 + (Math.floor((t - 30.22) * 6) % 3));
  ctx.restore();
  ctx.save(); shakeAt(ctx, t, 30.4, 16);
  stamp(ctx, 'CONNECTÉ ?', W / 2, 1180, 600, 110, t, 30.4, -0.06, C.red);
  ctx.restore();
}

// ------------------------------------------------------------------ S9 question + end card (31.5 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 0);
  const up = E.inOutCubic(prog(t, 33.5, 33.85));
  ctx.save(); ctx.translate(0, -up * 1400);
  slam(ctx, 'ET TOI ?', W / 2, 420, 220, C.white, t, 31.5);
  popWord(ctx, 'TU OFFRIRAIS', W / 2, 620, 120, C.white, t, 32.1, 'center');
  popWord(ctx, 'UN JOUET IA ?', W / 2, 760, 140, C.red, t, 32.62, 'center');
  bear(ctx, W / 2, 1080, 0.5 * sp(t, 32.72, SPRING.bouncy), t, true);
  ctx.restore();
  if (t >= 33.5) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 33.6, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 33.8, 'center');
    const k = sp(t, 33.94, SPRING.bouncy);
    ctx.save(); ctx.translate(W / 2, 1010); ctx.scale(k, k);
    rrect(ctx, -280, -66, 560, 124, 62); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, 'Abonne-toi', 0, 18, font(60, 800, UI), C.white, 'center');
    ctx.restore();
    popWord(ctx, 'Réponds en commentaire', W / 2, 1180, 44, C.grey, t, 34.3, 'center', UI, 600);
    ctx.restore();
  }
}

M.film({
  fonts: [font(100, 400, D), font(40, 400, UI), font(40, 600, UI), font(40, 800, UI)],
  hits: HITS,
  draw(ctx, u, t) {
    if (t < 2.78) sHook(ctx, t);
    else if (t < 5.9) sShelf(ctx, t);
    else if (t < 11.82) sBan(ctx, t);
    else if (t < 17.42) sTests(ctx, t);
    else if (t < 19.72) sControl(ctx, t);
    else if (t < 22.44) sFine(ctx, t);
    else if (t < 26.58) sNuance(ctx, t);
    else if (t < 31.5) sAdvice(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
