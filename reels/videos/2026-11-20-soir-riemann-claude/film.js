// Un mathématicien d'Anthropic revendique une preuve de l'hypothèse de Riemann avec Claude (20/11/2026): pure function of time.
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
  [B(1.88), '167 ans', 'thud'],
  [B(3.6), 'cut riemann', 'whoosh', { len: 0.4 }],
  [B(5.0), 'riemann', 'impact'],
  [B(6.7), 'celebre', 'pop', { pitch: 'E5' }],
  [B(8.0), 'cut alpoge', 'whoosh', { len: 0.4 }],
  [B(8.9), 'alpoge', 'pop', { pitch: 'C5' }],
  [B(10.6), 'anthropic', 'blip', { pitch: 'A5' }],
  [B(12.04), 'preuve', 'impact'],
  [B(12.6), 'claude', 'pop', { pitch: 'G5' }],
  [B(13.45), 'semaines', 'type', { len: 0.8 }],
  [B(14.55), 'cut 1859', 'whoosh', { len: 0.4 }],
  [B(15.16), '1859', 'thud'],
  [B(17.94), 'p2', 'pop', { pitch: 'C5' }],
  [B(18.18), 'p5', 'pop', { pitch: 'E5' }],
  [B(18.66), 'p11', 'pop', { pitch: 'G5' }],
  [B(19.3), 'p19', 'pop', { pitch: 'C6' }],
  [B(21.1), 'cut note', 'whoosh', { len: 0.4 }],
  [B(22.08), 'pages', 'impact'],
  [B(24.56), 'lean', 'type', { len: 1.2 }],
  [B(26.36), 'verifie', 'bell', { pitch: 'C6' }],
  [B(27.3), 'cut nuance', 'whoosh', { len: 0.4 }],
  [B(27.58), 'nuance', 'thud', { pitch: 'C3' }],
  [B(29.9), 'non validee', 'impact'],
  [B(30.6), 'cut reflexe', 'whoosh', { len: 0.4 }],
  [B(31.78), 'attends', 'thud'],
  [B(33.56), 'partager', 'blip', { pitch: 'E5' }],
  [B(34.7), 'cut question', 'whoosh', { len: 0.4 }],
  [B(35.14), 'crois', 'impact'],
  [B(35.7), 'end card', 'impact'],
  [B(36.2), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ['Un million de dollars,', 0.1], ["et 167 ans d'attente.", 1.32],
  ["C'est l'enjeu de l'hypothèse", 3.72], ['de Riemann,', 4.88], ['le problème de maths', 5.76], ['le plus célèbre au monde.', 6.52],
  ['Cette semaine,', 8.08], ['Levent Alpöge,', 8.98], ['mathématicien chez Anthropic,', 9.78], ["affirme l'avoir démontrée", 11.56], ['avec Claude,', 12.56], ['en six semaines environ.', 13.14],
  ['Posée en 1859,', 14.72], ["l'énigme concerne", 16.66], ['les nombres premiers,', 17.46], ['ceux qui ne se divisent', 18.56], ['que par 1 et par eux-mêmes.', 19.5],
  ['Sa note fait 4 pages,', 21.26], ['et il dit avoir traduit', 22.44], ['toute la preuve dans Lean,', 23.8], ['un langage vérifiable', 25.2], ['par ordinateur.', 26.12],
  ['Nuance :', 27.58], ['aucun expert indépendant', 28.42], ["ne l'a encore validée.", 29.54],
  ['Le réflexe :', 30.8], ['attends toujours la vérification', 31.78], ['avant de partager', 33.12], ['une annonce choc.', 33.9],
  ['Tu y crois ?', 34.9], ["Abonne-toi pour l'actu IA", 35.78], ['de chaque jour.', 37.04],
];
const CAP_Y = 1385;
function captions(ctx, t) {
  let i = -1;
  for (let k = 0; k < CAP.length; k++) if (t >= CAP[k][1] - 0.04) i = k;
  if (i < 0 || t > 38.4) return;
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
function person(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(0, -40, 26, 0, M.TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-44, 40); ctx.quadraticCurveTo(-44, -6, 0, -6); ctx.quadraticCurveTo(44, -6, 44, 40); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function aiChip(ctx, x, y, s, t, color = C.red, label = 'IA') {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = C.grey;
  for (let i = 0; i < 4; i++) {
    const o = -54 + i * 36;
    ctx.fillRect(o - 6, -110, 12, 26); ctx.fillRect(o - 6, 84, 12, 26);
    ctx.fillRect(-110, o - 6, 26, 12); ctx.fillRect(84, o - 6, 26, 12);
  }
  rrect(ctx, -86, -86, 172, 172, 26); ctx.fillStyle = color; ctx.fill();
  const blink = (t % 3.1) < 0.12 ? 0.15 : 1;
  ctx.fillStyle = C.white;
  ctx.save(); ctx.translate(-34, -6); ctx.scale(1, blink); rrect(ctx, -14, -22, 28, 44, 12); ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(34, -6); ctx.scale(1, blink); rrect(ctx, -14, -22, 28, 44, 12); ctx.fill(); ctx.restore();
  text(ctx, label, 0, 68, font(40, 400, D), C.white, 'center');
  ctx.restore();
}
function check(ctx, x, y, s, color) {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-4, 16); ctx.lineTo(24, -16); ctx.stroke();
  ctx.restore();
}

// ------------------------------------------------------------------ S1 hook: 1 000 000 $ prize + 167 years (0 - 3.6)
function sHook(ctx, t) {
  bg(ctx, t, 0);
  ctx.save();
  shakeAt(ctx, t, 1.88, 18);
  popWord(ctx, 'UN PRIX DE', 90, 330, 90, C.grey, t, -0.4);
  ctx.save(); ctx.translate(W / 2, 450); const ps = 1 + 0.03 * Math.sin(t * 5); ctx.scale(ps, ps);
  ctx.shadowColor = 'rgba(255,31,61,0.55)'; ctx.shadowBlur = 40;
  text(ctx, '1 000 000 $', 0, 70, font(190, 400, D), C.red, 'center');
  ctx.restore();
  for (let i = 0; i < 7; i++) {
    const k = sp(t, -0.3 + i * 0.12, SPRING.bouncy);
    if (k <= 0.001) continue;
    const y = 740 - i * 26;
    ctx.save(); ctx.translate(W / 2 + 12 * Math.sin(i * 1.7), y + (1 - k) * -120); ctx.rotate(0.03 * Math.sin(i * 2.3));
    rrect(ctx, -230, -40, 460, 80, 10); ctx.fillStyle = i % 2 ? C.white : C.grey; ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.strokeRect(-200, -26, 400, 52);
    text(ctx, '$', 0, 24, font(64, 400, D), C.ink, 'center');
    ctx.restore();
  }
  const hk = sp(t, 1.7, SPRING.bouncy);
  if (hk > 0.001) {
    ctx.save(); ctx.translate(290, 1020); ctx.scale(hk, hk); ctx.rotate(0.04 * wobble(t - 1.7, 3, 6));
    const sand = clamp((t - 1.7) / 1.9);
    ctx.fillStyle = C.grey; ctx.fillRect(-90, -150, 180, 18); ctx.fillRect(-90, 132, 180, 18);
    ctx.fillStyle = C.red;
    const top = 110 * (1 - sand) + 10;
    ctx.beginPath(); ctx.moveTo(-60 * top / 120, -top); ctx.lineTo(60 * top / 120, -top); ctx.lineTo(4, -4); ctx.lineTo(-4, -4); ctx.closePath(); ctx.fill();
    const bot = 20 + 90 * sand;
    ctx.beginPath(); ctx.moveTo(-64, 128); ctx.lineTo(64, 128); ctx.lineTo(64 * (1 - bot / 130), 128 - bot); ctx.lineTo(-64 * (1 - bot / 130), 128 - bot); ctx.closePath(); ctx.fill();
    ctx.fillRect(-3, -4, 6, 132 - bot);
    ctx.strokeStyle = C.white; ctx.lineWidth = 8; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(-70, -132); ctx.lineTo(70, -132); ctx.lineTo(8, 0); ctx.lineTo(70, 132); ctx.lineTo(-70, 132); ctx.lineTo(-8, 0); ctx.closePath(); ctx.stroke();
    ctx.restore();
  }
  slam(ctx, '167 ANS', 700, 1040, 200, C.white, t, 1.88);
  popWord(ctx, "D'ATTENTE", 700, 1130, 70, C.grey, t, 2.6, 'center');
  ctx.restore();
}

// ------------------------------------------------------------------ S2 the Riemann hypothesis, most famous problem (3.6 - 7.9)
function sRiemann(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 3.6, 3.9));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, "L'HYPOTHÈSE", 90, 360, 130, C.white, t, 3.7);
  slam(ctx, 'DE RIEMANN', W / 2, 520, 180, C.red, t, 5.0);
  const bx = 120, by = 620, bw = W - 240, bh = 470;
  const bk = sp(t, 3.85, SPRING.gentle);
  ctx.save(); ctx.globalAlpha = clamp(bk * 2);
  rrect(ctx, bx, by, bw, bh, 24); ctx.fillStyle = '#101A16'; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = '#3B2A1E'; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  const glyphs = ['1/2', 'S = 0', '2, 3, 5, 7', 'N', '1/N', 'X'];
  for (let i = 0; i < 6; i++) {
    const p = prog(t, 4.0 + i * 0.35, 4.5 + i * 0.35);
    if (p <= 0) continue;
    const x0 = bx + 50, y0 = by + 90 + i * 66;
    ctx.save(); ctx.globalAlpha = p;
    text(ctx, glyphs[i], x0, y0, font(54, 400, D), C.white);
    ctx.beginPath();
    for (let j = 0; j <= 30 * p; j++) { const u = j / 30; const xx = x0 + 230 + 260 * u * (0.6 + 0.4 * ((i * 7) % 3) / 2), yy = y0 - 18 + 12 * Math.sin(u * 14 + i); if (j) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
  const qk = sp(t, 5.3, SPRING.bouncy);
  if (qk > 0.001) {
    ctx.save(); ctx.translate(W - 250, by + 235); ctx.scale(qk, qk); ctx.rotate(0.1 + 0.05 * Math.sin(t * 2));
    ctx.beginPath(); ctx.arc(0, 0, 120, 0, M.TAU); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, '?', 0, 68, font(210, 400, D), C.white, 'center');
    ctx.restore();
  }
  chip(ctx, 'LE PROBLÈME DE MATHS N°1', W / 2, 1200, t, 6.7, C.white, 'center');
  ctx.restore();
}

// ------------------------------------------------------------------ S3 Alpöge (Anthropic) + Claude, six weeks (7.9 - 14.55)
function sAlpoge(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 8.05, 8.35));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  chip(ctx, 'CETTE SEMAINE', 90, 300, t, 8.05, C.red);
  const pk = sp(t, 8.1, SPRING.bouncy);
  if (pk > 0.001) {
    ctx.save(); ctx.translate(280, 680); ctx.scale(pk, pk);
    rrect(ctx, -200, -210, 400, 420, 26); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
    person(ctx, 0, -40, 2.0, C.white);
    if (t >= 8.95) text(ctx, 'LEVENT ALPÖGE', 0, 120, font(62, 400, D), C.white, 'center');
    if (t >= 9.7) text(ctx, 'MATHÉMATICIEN', 0, 172, font(30, 800, UI), C.grey, 'center');
    ctx.restore();
  }
  chip(ctx, 'CHEZ ANTHROPIC', 280, 950, t, 10.6, C.white, 'center');
  const plk = sp(t, 12.5, SPRING.bouncy);
  if (plk > 0.001) text(ctx, '+', 540, 720, font(Math.max(1, 140 * plk), 400, D), C.red, 'center');
  const ck = sp(t, 12.6, SPRING.bouncy);
  if (ck > 0.001) {
    ctx.save(); ctx.translate(800, 680); ctx.scale(ck, ck);
    rrect(ctx, -200, -210, 400, 420, 26); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.red; ctx.stroke();
    aiChip(ctx, 0, -40, 0.9, t, C.red, 'IA');
    text(ctx, 'CLAUDE', 0, 150, font(70, 400, D), C.white, 'center');
    ctx.restore();
  }
  stamp(ctx, 'UNE PREUVE ?', 690, 300, 520, 96, t, 12.04, 0.06, C.red);
  const wk = sp(t, 13.3, SPRING.snappy);
  if (wk > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(wk * 2); ctx.translate(0, (1 - wk) * 30);
    text(ctx, '6 SEMAINES', 90, 1150, font(110, 400, D), C.white);
    for (let i = 0; i < 6; i++) {
      const on = t >= 13.45 + i * 0.12;
      rrect(ctx, 560 + i * 72, 1068, 58, 72, 10); ctx.fillStyle = on ? C.red : '#24242A'; ctx.fill();
    }
    text(ctx, 'OCT.', 560, 1188, font(26, 600, UI), C.grey); text(ctx, 'NOV.', 982, 1188, font(26, 600, UI), C.grey, 'right');
    ctx.restore();
  }
  ctx.restore();
  source(ctx, "Annonce du 20/11/2026 (Tom's Hardware, Scientific American)", t, 9.2);
}

// ------------------------------------------------------------------ S4 1859, prime numbers (14.55 - 21.1)
function isPrime(n) { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
function sPrimes(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 14.55, 14.85));
  ctx.save(); ctx.translate((1 - enter) * -W * 0.6, 0);
  popWord(ctx, 'POSÉE EN', 90, 345, 100, C.grey, t, 14.65);
  slam(ctx, '1859', 720, 345, 200, C.white, t, 15.16);
  popWord(ctx, 'LES NOMBRES PREMIERS', W / 2, 490, 100, C.red, t, 17.46, 'center');
  const cols = 7, cell = 112, g = 14, gx = (W - (cols * cell + (cols - 1) * g)) / 2, gy = 545;
  for (let n = 1; n <= 35; n++) {
    const i = n - 1, r = Math.floor(i / cols), c = i % cols;
    const k = sp(t, 14.85 + 0.025 * i, SPRING.snappy);
    if (k <= 0.001) continue;
    const pr = isPrime(n);
    const tl = 17.78 + 0.08 * n;
    const lit = pr && t >= tl;
    const x = gx + c * (cell + g) + cell / 2, y = gy + r * (cell + g) + cell / 2;
    const wob = lit ? 0.12 * wobble(t - tl, 3, 7) : 0;
    ctx.save(); ctx.translate(x, y); ctx.scale(k * (1 + wob), k * (1 + wob));
    rrect(ctx, -cell / 2, -cell / 2, cell, cell, 16); ctx.fillStyle = lit ? C.red : '#1C1C22'; ctx.fill();
    text(ctx, String(n), 0, 24, font(64, 400, D), lit ? C.white : (t >= 17.78 && !pr ? C.dim : C.grey), 'center');
    ctx.restore();
  }
  chip(ctx, 'DIVISIBLES PAR 1 ET PAR EUX-MÊMES', W / 2, 1218, t, 19.1, C.white, 'center');
  ctx.restore();
  source(ctx, 'Hypothèse énoncée par Bernhard Riemann en 1859', t, 15.4);
}

// ------------------------------------------------------------------ S5 4-page note + Lean, checked by computer (21.1 - 27.3)
const CODE = ['theorem riemann :', '  RiemannHypothesis', '  := by ...'];
function sLean(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 21.1, 21.4));
  ctx.save(); ctx.translate((1 - enter) * W * 0.6, 0);
  popWord(ctx, 'UNE NOTE DE', 90, 340, 100, C.grey, t, 21.2);
  for (let i = 0; i < 4; i++) {
    const k = sp(t, 21.6 + i * 0.16, SPRING.bouncy);
    if (k <= 0.001) continue;
    ctx.save(); ctx.translate(210 + i * 40, 680 + i * 14); ctx.rotate(-0.18 + i * 0.1); ctx.scale(k, k);
    rrect(ctx, -110, -150, 220, 300, 12); ctx.fillStyle = C.white; ctx.fill();
    ctx.fillStyle = '#D6D6DC';
    for (let j = 0; j < 6; j++) { rrect(ctx, -80, -110 + j * 36, 160 - 40 * (j % 2), 14, 7); ctx.fill(); }
    text(ctx, String(i + 1), 80, 130, font(40, 400, D), C.red, 'right');
    ctx.restore();
  }
  slam(ctx, '4 PAGES', 820, 345, 150, C.red, t, 22.08);
  const lk = sp(t, 23.8, SPRING.gentle);
  if (lk > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(lk * 2); ctx.translate(0, (1 - lk) * 40);
    const x = 470, y = 520, w = 520, h = 360;
    rrect(ctx, x, y, w, h, 20); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
    ctx.fillStyle = '#24242A'; ctx.fillRect(x + 3, y + 3, w - 6, 60);
    [C.red, C.grey, C.dim].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 34 + i * 30, y + 33, 9, 0, M.TAU); ctx.fill(); });
    text(ctx, 'LEAN', x + w - 30, y + 50, font(48, 400, D), C.white, 'right');
    const total = CODE.join('').length;
    const typed = prog(t, 24.56, 25.8) * total;
    let acc = 0;
    CODE.forEach((l, i) => {
      const n = Math.floor(clamp((typed - acc) / l.length) * l.length); acc += l.length;
      if (n <= 0) return;
      text(ctx, l.slice(0, n), x + 30, y + 140 + i * 66, font(34, 600, UI), C.white);
    });
    ctx.restore();
  }
  const vk = sp(t, 25.6, SPRING.bouncy);
  if (vk > 0.001) {
    ctx.save(); ctx.translate(W / 2, 1110); ctx.scale(vk, vk);
    rrect(ctx, -420, -80, 840, 160, 28); ctx.fillStyle = C.red; ctx.fill();
    ctx.beginPath(); ctx.arc(-330, 0, 50, 0, M.TAU); ctx.fillStyle = C.white; ctx.fill();
    check(ctx, -330, 0, t >= 26.36 ? 1.4 * clamp(sp(t, 26.36, SPRING.bouncy)) : 0, C.red);
    text(ctx, 'VÉRIFIABLE', 60, -6, font(78, 400, D), C.white, 'center');
    text(ctx, 'PAR ORDINATEUR', 60, 52, font(44, 400, D), C.white, 'center');
    ctx.restore();
  }
  ctx.restore();
}

// ------------------------------------------------------------------ S6 caveat: no independent expert has validated it (27.3 - 30.6)
function sCaveat(ctx, t) {
  bg(ctx, t, 1);
  slam(ctx, 'NUANCE', W / 2, 440, 190, C.white, t, 27.58);
  for (let i = 0; i < 5; i++) {
    const k = sp(t, 27.9 + i * 0.12, SPRING.bouncy);
    if (k <= 0.001) continue;
    const x = 160 + i * 190, y = 730;
    person(ctx, x, y, 1.7 * k, C.grey);
    ctx.save(); ctx.globalAlpha = clamp(k);
    ctx.beginPath(); ctx.arc(x + 50, y - 125, 32, 0, M.TAU); ctx.fillStyle = C.dim; ctx.fill();
    text(ctx, '?', x + 50, y - 107, font(52, 400, D), C.white, 'center');
    ctx.restore();
  }
  popWord(ctx, 'AUCUN EXPERT INDÉPENDANT', W / 2, 930, 80, C.white, t, 28.9, 'center');
  stamp(ctx, 'PAS ENCORE VALIDÉE', W / 2, 1110, 820, 100, t, 29.9, -0.05, C.red);
  source(ctx, "Prix Clay : publication, puis au moins 2 ans d'examen", t, 28.0);
}

// ------------------------------------------------------------------ S7 advice: wait for verification before sharing (30.6 - 34.7)
function sAdvice(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 30.6, 30.9));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'LE RÉFLEXE', 90, 380, 150, C.red, t, 30.8);
  slam(ctx, 'ATTENDS', W / 2, 570, 170, C.white, t, 31.78);
  const pk = sp(t, 31.0, SPRING.gentle);
  if (pk > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(pk * 2); ctx.translate(W / 2, 870); ctx.scale(0.9 + 0.1 * pk, 0.9 + 0.1 * pk);
    rrect(ctx, -380, -170, 760, 340, 30); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
    chip(ctx, 'ANNONCE CHOC', -340, -100, t, 31.1, C.red);
    text(ctx, 'VÉRIFICATION', -340, 10, font(32, 800, UI), C.grey);
    const vp = E.inOutCubic(prog(t, 32.56, 33.5));
    rrect(ctx, -340, 34, 680, 30, 15); ctx.fillStyle = '#24242A'; ctx.fill();
    if (vp > 0.01) { rrect(ctx, -340, 34, 680 * vp, 30, 15); ctx.fillStyle = C.red; ctx.fill(); }
    const on = t >= 33.56;
    ctx.save(); ctx.translate(200, 118); ctx.scale(1 + (on ? 0.1 * wobble(t - 33.56, 3, 7) : 0), 1);
    rrect(ctx, -130, -34, 260, 64, 32); ctx.fillStyle = on ? C.white : '#24242A'; ctx.fill();
    text(ctx, 'PARTAGER', 0, 14, font(42, 400, D), on ? C.ink : C.dim, 'center');
    ctx.restore();
    if (!on) {
      ctx.save(); ctx.translate(-250, 122); ctx.fillStyle = C.grey;
      ctx.strokeStyle = C.grey; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, -14, 18, Math.PI, 0); ctx.stroke();
      rrect(ctx, -26, -14, 52, 42, 8); ctx.fill();
      ctx.restore();
    } else check(ctx, -250, 118, 1.3 * clamp(sp(t, 33.56, SPRING.bouncy)), C.red);
    ctx.restore();
  }
  chip(ctx, 'AVANT DE PARTAGER', W / 2, 1180, t, 33.12, C.white, 'center');
  ctx.restore();
}

// ------------------------------------------------------------------ S8 question + end card (34.7 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 1);
  const up = E.inOutCubic(prog(t, 35.6, 36.0));
  ctx.save(); ctx.translate(0, -up * 1400);
  popWord(ctx, 'ET TOI ?', W / 2, 500, 150, C.grey, t, 34.75, 'center');
  slam(ctx, 'TU Y CROIS ?', W / 2, 760, 200, C.red, t, 35.14);
  popWord(ctx, 'Réponds en commentaire', W / 2, 900, 44, C.grey, t, 35.3, 'center', UI, 600);
  ctx.restore();
  if (t >= 35.62) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 35.7, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 35.9, 'center');
    const k = sp(t, 36.2, SPRING.bouncy);
    ctx.save(); ctx.translate(W / 2, 1010); ctx.scale(k, k);
    rrect(ctx, -280, -66, 560, 124, 62); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, 'Abonne-toi', 0, 18, font(60, 800, UI), C.white, 'center');
    ctx.restore();
    ctx.restore();
  }
}

M.film({
  fonts: [font(100, 400, D), font(40, 400, UI), font(40, 600, UI), font(40, 800, UI)],
  hits: HITS,
  draw(ctx, u, t) {
    if (t < 3.6) sHook(ctx, t);
    else if (t < 8.05) sRiemann(ctx, t);
    else if (t < 14.55) sAlpoge(ctx, t);
    else if (t < 21.1) sPrimes(ctx, t);
    else if (t < 27.3) sLean(ctx, t);
    else if (t < 30.6) sCaveat(ctx, t);
    else if (t < 34.7) sAdvice(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
