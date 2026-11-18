// Anthropic entre en Bourse: pure function of time. window.seek(t) paints frame t.
// Scenes are timed in SECONDS on the voice-over (audio/vo/words.json, placed +0.1 s);
// HITS are converted to beats (120 bpm, 0.5 s per beat) so sfx land on the same frames.
import * as M from './lib/motion.js';

const { W, H, E, prog, lerp, clamp, spring, SPRING, wobble, font, text, fill, rrect, hash01 } = M;

const C = { ink: '#050506', red: '#FF1F3D', white: '#FFFFFF', grey: '#BEBEC4', dim: '#3A3A40', line: '#16080C' };
const D = 'Display', UI = 'UI';
const sp = (t, t0, cfg = SPRING.snappy) => (t < t0 ? 0 : spring(t - t0, cfg));
const B = (s) => s / 0.5;

// ------------------------------------------------------------------ sound hits (beats)
const HITS = [
  [B(0.0), 'hook', 'impact'],
  [B(1.04), 'acheter', 'pop', { pitch: 'E5' }],
  [B(1.84), 'slice out', 'whoosh', { len: 0.3 }],
  [B(2.24), 'des demain', 'blip', { pitch: 'A5' }],
  [B(3.3), 'cut anthropic', 'whoosh', { len: 0.4 }],
  [B(3.46), 'typing', 'type', { len: 1.0 }],
  [B(6.36), 'ticker', 'whoosh', { len: 0.5 }],
  [B(7.3), 'jeudi', 'impact'],
  [B(8.0), 'nasdaq', 'thud'],
  [B(8.8), 'cut prix', 'whoosh', { len: 0.4 }],
  [B(9.42), 'fixe', 'click'],
  [B(11.34), '70', 'pop', { pitch: 'C5' }],
  [B(12.34), '78', 'pop', { pitch: 'G5' }],
  [B(14.1), 'cut foule', 'whoosh', { len: 0.4 }],
  [B(15.0), 'bousculent', 'thud'],
  [B(16.94), 'x6', 'impact'],
  [B(19.4), 'cut revenus', 'whoosh', { len: 0.4 }],
  [B(20.42), '17 milliards', 'impact'],
  [B(22.98), 'x12', 'thud'],
  [B(24.8), 'cut camembert', 'whoosh', { len: 0.4 }],
  [B(24.94), 'amazon', 'pop', { pitch: 'E5' }],
  [B(25.6), 'google', 'pop', { pitch: 'A5' }],
  [B(26.56), 'un quart', 'bell', { pitch: 'E6' }],
  [B(27.75), 'nuance', 'thud', { pitch: 'C3' }],
  [B(28.6), 'perte', 'thud', { pitch: 'C3' }],
  [B(30.38), 'stamp', 'impact'],
  [B(31.2), 'cut courbe', 'whoosh', { len: 0.4 }],
  [B(32.92), 'agites', 'thud', { pitch: 'G2' }],
  [B(34.94), 'perdre', 'impact'],
  [B(35.62), 'et toi', 'thud'],
  [B(36.0), 'pill 1', 'blip', { pitch: 'E5' }],
  [B(36.4), 'pill 2', 'blip', { pitch: 'A5' }],
  [B(37.12), 'end card', 'impact'],
  [B(37.5), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ['Et si tu pouvais acheter', 0.1], ['un morceau de Claude', 1.42], ['dès demain ?', 2.24],
  ['Anthropic,', 3.46], ["l'entreprise qui crée", 4.1], ['cet assistant IA,', 5.02],
  ['entre en Bourse ce jeudi,', 6.36], ['au Nasdaq.', 7.64],
  ['Son prix est fixé ce soir,', 8.88], ['entre 70 et 78 dollars', 10.6], ["l'action.", 13.22],
  ['Les investisseurs', 14.2], ['se bousculent :', 14.86], ['la demande serait', 15.96],
  ["jusqu'à 6 fois supérieure", 16.62], ['aux titres proposés.', 17.92],
  ['La raison ?', 19.46], ['17 milliards de dollars', 20.42], ['de revenus en un trimestre,', 21.54],
  ["12 fois plus qu'un an plus tôt.", 22.98],
  ['Amazon et Google', 24.94], ['en détiennent déjà', 25.84], ["plus d'un quart à eux deux.", 26.56],
  ['Nuance importante :', 27.8], ["Anthropic n'est pas", 29.32], ['encore rentable.', 30.12],
  ['Les premiers jours en Bourse', 31.3], ['sont souvent très agités :', 32.18],
  ['ne mise jamais', 33.64], ['ce que tu ne peux pas perdre.', 34.24],
  ['Tu suivras', 35.62], ['la première cotation ?', 36.02],
  ["Abonne-toi pour l'actu IA", 37.12], ['de chaque jour.', 38.3],
];
const CAP_Y = 1385;
function captions(ctx, t) {
  let i = -1;
  for (let k = 0; k < CAP.length; k++) if (t >= CAP[k][1] - 0.04) i = k;
  if (i < 0) return;
  if (t > 39.4) return;
  const [str, t0] = CAP[i];
  const k = sp(t, t0 - 0.04, SPRING.snappy);
  const f = font(52, 800, UI);
  ctx.font = f;
  const w = ctx.measureText(str).width;
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
  ctx.translate(0, 110);
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

// ------------------------------------------------------------------ S1 hook: a pie, one slice pulled out (0 - 3.3)
function sHook(ctx, t) {
  bg(ctx, t, 0);
  ctx.save(); shakeAt(ctx, t, 0, 14);
  const k0 = 0.85 + 0.15 * sp(t, 0, SPRING.gentle);
  const words1 = [['ET', -0.2], ['SI', -0.2], ['TU', 0.66], ['POUVAIS', 0.74]];
  let x = 90;
  for (const [w, t0] of words1) x += popWord(ctx, w, x, 330, 128, C.white, t, t0 - 0.1) + 26;
  x = 90;
  for (const [w, t0] of [['ACHETER', 1.04], ['UN', 1.3], ['MORCEAU', 1.42]]) x += popWord(ctx, w, x, 460, 128, C.red, t, t0 - 0.08) + 26;
  // the pie
  const cx = W / 2, cy = 860, R = 270 * k0;
  const spin = 0.25 * t;
  const out = E.outBack(prog(t, 1.84, 2.2), 1.4);
  const a0 = -0.55 + spin, a1 = a0 + 0.75;
  ctx.save(); ctx.translate(cx, cy);
  ctx.fillStyle = '#1C1C21';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, a1, a0 + M.TAU); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#2C2C33'; ctx.lineWidth = 4;
  for (let i = 0; i < 6; i++) { const a = a1 + i * ((M.TAU - 0.75) / 6); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R); ctx.stroke(); }
  const am = (a0 + a1) / 2, d = out * 120;
  ctx.translate(Math.cos(am) * d, Math.sin(am) * d);
  ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, a0, a1); ctx.closePath(); ctx.fill();
  ctx.restore();
  if (t > 1.7) {
    const lx = cx + Math.cos(am) * (out * 120 + R * 0.62), ly = cy + Math.sin(am) * (out * 120 + R * 0.62);
    popWord(ctx, 'CLAUDE', lx, ly + 30, 90, C.white, t, 1.84, 'center');
  }
  chip(ctx, 'DÈS DEMAIN ?', W / 2, 1230, t, 2.24, C.red, 'center');
  ctx.restore();
}

// ------------------------------------------------------------------ S2 Anthropic + ticker board (3.3 - 8.8)
function sTicker(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 3.3, 3.6));
  ctx.save(); ctx.translate((1 - enter) * W * 0.6, 0);
  const title = 'ANTHROPIC';
  const n = Math.floor(title.length * prog(t, 3.3, 3.95));
  const tf = font(190, 400, D);
  text(ctx, title.slice(0, n), W / 2, 420, tf, C.white, 'center');
  chip(ctx, "L'ENTREPRISE DERRIÈRE CLAUDE", W / 2, 520, t, 4.2, C.white, 'center');
  // chat bubble: the assistant
  const kq = sp(t, 4.9, SPRING.bouncy) * (1 - E.inCubic(prog(t, 6.1, 6.35)));
  if (kq > 0.001) {
    ctx.save(); ctx.translate(W / 2, 860); ctx.scale(kq, kq);
    rrect(ctx, -300, -150, 600, 260, 60); ctx.fillStyle = '#1C1C21'; ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = C.red; ctx.stroke();
    ctx.fillStyle = '#1C1C21'; ctx.beginPath(); ctx.moveTo(-180, 105); ctx.lineTo(-230, 190); ctx.lineTo(-110, 108); ctx.fill();
    text(ctx, 'CLAUDE', 0, 0, font(120, 400, D), C.white, 'center');
    for (let d = 0; d < 3; d++) { const b = 0.5 + 0.5 * Math.sin(t * 8 - d); ctx.fillStyle = C.red; ctx.globalAlpha = 0.4 + 0.6 * b; ctx.beginPath(); ctx.arc(-50 + d * 50, 60, 13, 0, M.TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  // LED ticker band
  const kb = E.outCubic(prog(t, 6.3, 6.6));
  if (kb > 0) {
    ctx.save(); ctx.globalAlpha = kb;
    ctx.fillStyle = '#0E0E11'; ctx.fillRect(0, 640, W, 150);
    ctx.fillStyle = C.red; ctx.fillRect(0, 640, W, 6); ctx.fillRect(0, 784, W, 6);
    const tape = 'ANT  NASDAQ  ENTRÉE EN BOURSE  ';
    const tf2 = font(96, 400, D); ctx.font = tf2;
    const tw = ctx.measureText(tape).width;
    const off = -((t - 6.3) * 260) % tw;
    for (let xx = off; xx < W; xx += tw) text(ctx, tape, xx, 750, tf2, C.white);
    ctx.restore();
  }
  // calendar page
  const kc = sp(t, 7.3, SPRING.bouncy);
  if (kc > 0.001) {
    ctx.save(); ctx.translate(250, 1020); ctx.rotate(-0.05); ctx.scale(kc, kc);
    rrect(ctx, -150, -150, 300, 300, 26); ctx.fillStyle = C.white; ctx.fill();
    rrect(ctx, -150, -150, 300, 80, 26); ctx.fillStyle = C.red; ctx.fill(); ctx.fillRect(-150, -100, 300, 30);
    text(ctx, 'JEUDI', 0, -88, font(60, 400, D), C.white, 'center');
    text(ctx, '19', 0, 90, font(170, 400, D), C.ink, 'center');
    text(ctx, 'NOV.', 0, 135, font(40, 800, UI), C.ink, 'center');
    ctx.restore();
  }
  slam(ctx, 'NASDAQ', 720, 1000, 150, C.red, t, 8.0);
  popWord(ctx, 'CODE : ANT', 720, 1110, 70, C.white, t, 8.2, 'center');
  ctx.restore();
  source(ctx, 'Source : Yahoo Finance, CNBC, 18 nov. 2026', t, 6.4);
}

// ------------------------------------------------------------------ S3 price range slider (8.8 - 14.1)
function sPrice(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 8.8, 9.1));
  ctx.save(); ctx.translate(0, (1 - enter) * 300); ctx.globalAlpha = enter;
  popWord(ctx, 'PRIX FIXÉ', 90, 400, 170, C.white, t, 8.85);
  popWord(ctx, 'CE SOIR', 90, 560, 170, C.red, t, 9.7);
  // range bar
  const x0 = 150, x1 = W - 150, y = 900;
  const kb = E.outCubic(prog(t, 10.6, 11.2));
  ctx.fillStyle = '#1C1C21'; rrect(ctx, x0, y - 18, x1 - x0, 36, 18); ctx.fill();
  if (kb > 0) { ctx.fillStyle = C.red; rrect(ctx, x0, y - 18, (x1 - x0) * kb, 36, 18); ctx.fill(); }
  const mark = (xx, label, t0) => {
    const k = sp(t, t0, SPRING.bouncy); if (k <= 0.001) return;
    ctx.save(); ctx.translate(xx, y); ctx.scale(k, k);
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(0, 0, 34, 0, M.TAU); ctx.fill();
    text(ctx, label, 0, -70, font(130, 400, D), C.white, 'center');
    ctx.restore();
  };
  mark(x0 + 20, '70 $', 11.34);
  mark(x1 - 20, '78 $', 12.34);
  // cursor hesitating between the two
  if (t > 12.5) {
    const c = 0.5 + 0.42 * Math.sin((t - 12.5) * 3.2);
    const cx = lerp(x0 + 20, x1 - 20, c);
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(cx, y + 40); ctx.lineTo(cx - 26, y + 86); ctx.lineTo(cx + 26, y + 86); ctx.fill();
    text(ctx, '?', cx, y + 170, font(90, 400, D), C.red, 'center');
  }
  chip(ctx, "PAR ACTION", W / 2, 1220, t, 13.3, C.white, 'center');
  ctx.restore();
  source(ctx, 'Fourchette annoncée : 70 à 78 dollars', t, 11.4);
}

// ------------------------------------------------------------------ S4 the crowd: demand x6 (14.1 - 19.4)
function person(ctx, x, y, s, col) {
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(x, y - 30 * s, 16 * s, 0, M.TAU); ctx.fill();
  rrect(ctx, x - 22 * s, y - 8 * s, 44 * s, 52 * s, 18 * s); ctx.fill();
}
function sCrowd(ctx, t) {
  bg(ctx, t, 1);
  ctx.save(); shakeAt(ctx, t, 16.94, 20);
  popWord(ctx, 'LES INVESTISSEURS', 90, 360, 110, C.white, t, 14.2);
  popWord(ctx, 'SE BOUSCULENT', 90, 470, 110, C.red, t, 14.9);
  // one share (ticket) and 6 rows of people rushing
  const kt = sp(t, 14.3, SPRING.bouncy);
  ctx.save(); ctx.translate(250, 840); ctx.scale(kt, kt);
  rrect(ctx, -120, -170, 240, 340, 22); ctx.fillStyle = C.white; ctx.fill();
  text(ctx, '1', 0, 40, font(200, 400, D), C.ink, 'center');
  text(ctx, 'ACTION', 0, 130, font(46, 800, UI), C.ink, 'center');
  ctx.restore();
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 5; c++) {
      const i = r * 5 + c;
      const t0 = 14.4 + hash01(i, 3) * 2.2;
      const p = E.outCubic(prog(t, t0, t0 + 0.5));
      if (p <= 0) continue;
      const tx = 470 + c * 100, ty = 640 + r * 88;
      const x = lerp(W + 80, tx, p) + (t > 15 ? Math.sin(t * 9 + i) * 3 : 0);
      person(ctx, x, ty, 0.95, i % 5 === 0 ? C.red : C.grey);
    }
  }
  if (t >= 16.85) {
    ctx.fillStyle = 'rgba(5,5,6,0.88)'; ctx.fillRect(0, 1020, W, 230);
    slam(ctx, 'DEMANDE X6', W / 2, 1210, 200, C.red, t, 16.94);
  }
  ctx.restore();
  source(ctx, "Jusqu'à 6 fois l'offre selon Bloomberg (via Yahoo Finance)", t, 17.0);
}

// ------------------------------------------------------------------ S5 revenue x12 (19.4 - 24.8)
function sRevenue(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 19.4, 19.7));
  ctx.save(); ctx.translate(0, (1 - enter) * -300);
  popWord(ctx, 'LA RAISON ?', 90, 360, 120, C.white, t, 19.46);
  ctx.save(); shakeAt(ctx, t, 20.42, 18);
  slam(ctx, '17 MILLIARDS $', W / 2, 560, 170, C.red, t, 20.42);
  ctx.restore();
  chip(ctx, 'EN UN TRIMESTRE', W / 2, 650, t, 22.0, C.white, 'center');
  const base = 1240, maxH = 380;
  const bars = [
    { x: 200, label: 'T3 2025', v: 1 / 12, t0: 20.9, t1: 21.4, col: C.grey, top: '1,4 MD $' },
    { x: 600, label: 'T3 2026', v: 1, t0: 22.98, t1: 23.8, col: C.red, top: '17 MD $' },
  ];
  for (const b of bars) {
    const g = E.outCubic(prog(t, b.t0, b.t1)) + (t > b.t1 ? 0.012 * wobble(t - b.t1, 2.5, 6) : 0);
    const h = Math.max(0, b.v * maxH * g);
    if (g <= 0) continue;
    ctx.fillStyle = b.col; ctx.fillRect(b.x, base - h - 60, 280, h);
    text(ctx, b.label, b.x + 140, base, font(54, 400, D), C.white, 'center');
    if (g > 0.7) text(ctx, b.top, b.x + 140, base - h - 84, font(64, 400, D), b.col === C.red ? C.red : C.white, 'center');
  }
  const bk = E.outBack(prog(t, 23.3, 23.6), 1.6);
  if (bk > 0) {
    ctx.save(); ctx.translate(480, 900); ctx.scale(bk, bk);
    rrect(ctx, -100, -55, 200, 100, 22); ctx.fillStyle = C.white; ctx.fill();
    text(ctx, 'X12', 0, 30, font(90, 400, D), C.ink, 'center');
    ctx.restore();
  }
  ctx.restore();
  source(ctx, "Source : document d'introduction en Bourse (S-1), juillet-sept.", t, 20.6);
}

// ------------------------------------------------------------------ S6 ownership pie (24.8 - 27.7)
function sOwners(ctx, t) {
  bg(ctx, t, 1);
  const cx = W / 2, cy = 780, R = 300;
  const k = sp(t, 24.8, SPRING.gentle);
  ctx.save(); ctx.translate(cx, cy); ctx.scale(0.85 + 0.15 * k, 0.85 + 0.15 * k); ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#1C1C21'; ctx.beginPath(); ctx.arc(0, 0, R, 0, M.TAU); ctx.fill();
  const segA = 0.147 * M.TAU * E.outCubic(prog(t, 24.94, 25.4));
  const segG = 0.137 * M.TAU * E.outCubic(prog(t, 25.6, 26.05));
  if (segA > 0) { ctx.fillStyle = C.red; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, 0, segA); ctx.closePath(); ctx.fill(); }
  if (segG > 0) { ctx.fillStyle = C.white; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, 0.147 * M.TAU, 0.147 * M.TAU + segG); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(0, 0, R * 0.5, 0, M.TAU); ctx.fill();
  ctx.restore();
  popWord(ctx, 'AMAZON 14,7 %', 90, 300, 90, C.red, t, 24.94);
  popWord(ctx, 'GOOGLE 13,7 %', W - 90, 1220, 90, C.white, t, 25.6, 'right');
  const kq = E.outBack(prog(t, 26.56, 26.8), 1.8);
  if (kq > 0) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(kq, kq);
    text(ctx, '+ 1/4', 0, 40, font(130, 400, D), C.white, 'center');
    ctx.restore();
  }
  source(ctx, 'Part du capital, actions sans droit de vote (S-1)', t, 25.0);
}

// ------------------------------------------------------------------ S7 caveat stamp (27.7 - 31.2)
function sCaveat(ctx, t) {
  bg(ctx, t, 0);
  slam(ctx, 'NUANCE', W / 2, 420, 180, C.white, t, 27.75);
  chip(ctx, 'IMPORTANTE', W / 2, 510, t, 28.4, C.red, 'center');
  ctx.save(); shakeAt(ctx, t, 28.6, 12);
  popWord(ctx, '-567 M$', W / 2, 730, 190, C.red, t, 28.6, 'center');
  popWord(ctx, "DE PERTE D'EXPLOITATION AU 3E TRIMESTRE", W / 2, 800, 34, C.grey, t, 28.8, 'center', UI, 800);
  ctx.restore();
  popWord(ctx, 'ANTHROPIC', W / 2, 960, 120, C.white, t, 29.32, 'center');
  const p = prog(t, 30.38, 30.52);
  if (p > 0) {
    ctx.save();
    ctx.translate(W / 2, 1140); ctx.rotate(-0.06);
    const s = lerp(1.8, 1, E.outCubic(p)) + 0.04 * wobble(t - 30.52, 3, 7);
    ctx.scale(s, s);
    ctx.strokeStyle = C.red; ctx.lineWidth = 10;
    rrect(ctx, -440, -85, 880, 140, 16); ctx.stroke();
    text(ctx, 'PAS ENCORE RENTABLE', 0, 30, font(104, 400, D), C.red, 'center');
    ctx.restore();
  }
  source(ctx, "Source : document d'introduction en Bourse (S-1)", t, 28.9);
}

// ------------------------------------------------------------------ S8 volatile chart + advice (31.2 - 35.5)
function sVolatile(ctx, t) {
  bg(ctx, t, 1);
  popWord(ctx, 'PREMIERS JOURS', 90, 360, 120, C.white, t, 31.3);
  popWord(ctx, 'EN BOURSE', 90, 470, 120, C.red, t, 31.8);
  const x0 = 110, x1 = W - 110, yM = 760;
  const N = 40;
  const pts = Array.from({ length: N }, (_, i) => [lerp(x0, x1, i / (N - 1)), yM + (hash01(i, 17) - 0.5) * (i < 4 ? 60 : 260) - (i / N) * 30]);
  const drawn = prog(t, 31.3, 33.4) * (N - 1);
  ctx.save(); shakeAt(ctx, t, 32.92, 14);
  ctx.strokeStyle = C.dim; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x0, yM); ctx.lineTo(x1, yM); ctx.stroke();
  ctx.strokeStyle = C.red; ctx.lineWidth = 9; ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let i = 0; i <= Math.floor(drawn); i++) { if (i) ctx.lineTo(pts[i][0], pts[i][1]); else ctx.moveTo(pts[i][0], pts[i][1]); }
  const fi = Math.floor(drawn), fr = drawn - fi;
  if (fi < N - 1) ctx.lineTo(lerp(pts[fi][0], pts[fi + 1][0], fr), lerp(pts[fi][1], pts[fi + 1][1], fr));
  ctx.stroke();
  ctx.restore();
  chip(ctx, 'TRÈS AGITÉS', W / 2, 640, t, 32.85, C.white, 'center');
  if (t >= 33.55) {
    ctx.fillStyle = 'rgba(5,5,6,0.9)'; ctx.fillRect(0, 930, W, 360);
    popWord(ctx, 'NE MISE JAMAIS', W / 2, 1040, 110, C.white, t, 33.64, 'center');
    popWord(ctx, 'CE QUE TU NE PEUX PAS', W / 2, 1130, 74, C.grey, t, 34.24, 'center');
    slam(ctx, 'PERDRE.', W / 2, 1268, 130, C.red, t, 34.94);
  }
  source(ctx, "Information, pas un conseil d'investissement", t, 33.7);
}

// ------------------------------------------------------------------ S9 question + end card (35.5 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 0);
  const up = E.inOutCubic(prog(t, 37.0, 37.4));
  ctx.save(); ctx.translate(0, -up * 1400);
  slam(ctx, 'ET TOI ?', W / 2, 600, 260, C.white, t, 35.62);
  popWord(ctx, 'Tu suivras la 1re cotation ?', W / 2, 720, 50, C.grey, t, 35.74, 'center', UI, 600);
  const pill = (str, y, t0, red) => {
    const k = sp(t, t0, SPRING.bouncy); if (k <= 0.001) return;
    ctx.save(); ctx.translate(W / 2, y); ctx.scale(k, k);
    rrect(ctx, -380, -70, 760, 120, 60);
    if (red) { ctx.fillStyle = C.red; ctx.fill(); } else { ctx.lineWidth = 6; ctx.strokeStyle = C.white; ctx.stroke(); }
    text(ctx, str, 0, 14, font(56, 800, UI), C.white, 'center');
    ctx.restore();
  };
  pill('Oui, de près', 880, 36.0, false);
  pill('Non, trop risqué', 1040, 36.4, true);
  ctx.restore();
  if (t >= 37.05) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 37.12, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 37.3, 'center');
    const k = sp(t, 37.5, SPRING.bouncy);
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
    if (t < 3.3) sHook(ctx, t);
    else if (t < 8.8) sTicker(ctx, t);
    else if (t < 14.1) sPrice(ctx, t);
    else if (t < 19.4) sCrowd(ctx, t);
    else if (t < 24.8) sRevenue(ctx, t);
    else if (t < 27.7) sOwners(ctx, t);
    else if (t < 31.2) sCaveat(ctx, t);
    else if (t < 35.5) sVolatile(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
