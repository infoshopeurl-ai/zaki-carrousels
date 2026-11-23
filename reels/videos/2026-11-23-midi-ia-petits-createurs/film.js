// L'IA cite surtout les petits créateurs (étude We Are Watching, nov. 2026) : pure function of time.
// Scenes are timed in SECONDS on the voice-over (audio/vo/words.json, placed +0.1 s);
// HITS are converted to beats (120 bpm, 0.5 s per beat) so sfx land on the same frames.
import * as M from './lib/motion.js';

const { W, H, E, prog, lerp, clamp, spring, SPRING, wobble, font, text, fill, rrect, hash01 } = M;

const C = { ink: '#050506', red: '#FF1F3D', white: '#FFFFFF', grey: '#BEBEC4', dim: '#3A3A40', line: '#16080C', card: '#16161A', edge: '#2C2C33' };
const D = 'Display', UI = 'UI';
const sp = (t, t0, cfg = SPRING.snappy) => (t < t0 ? 0 : spring(t - t0, cfg));
const B = (s) => s / 0.5;

// ------------------------------------------------------------------ sound hits (beats)
const HITS = [
  [B(0.0), 'hook', 'impact'],
  [B(1.72), 'pas besoin', 'pop', { pitch: 'E5' }],
  [B(2.4), 'barre million', 'thud', { pitch: 'C3' }],
  [B(3.46), 'inverse', 'impact'],
  [B(4.42), 'cut etude', 'whoosh', { len: 0.4 }],
  [B(4.6), 'agence', 'click'],
  [B(4.8), 'compteur', 'type', { len: 1.5 }],
  [B(6.7), '805', 'impact'],
  [B(7.64), 'cinq ia', 'pop', { pitch: 'G5' }],
  [B(8.68), 'google', 'blip', { pitch: 'A5' }],
  [B(9.34), 'chatgpt', 'blip', { pitch: 'C6' }],
  [B(10.24), 'cut resultat', 'whoosh', { len: 0.4 }],
  [B(11.26), '84', 'impact'],
  [B(11.4), 'grille', 'pop', { pitch: 'E5' }],
  [B(15.16), 'cent mille', 'thud'],
  [B(16.26), 'cut moitie', 'whoosh', { len: 0.4 }],
  [B(17.2), 'compteur vues', 'type', { len: 0.5 }],
  [B(18.0), '4500', 'impact'],
  [B(19.5), 'cut marques', 'whoosh', { len: 0.4 }],
  [B(20.78), 'france', 'pop', { pitch: 'G5' }],
  [B(21.6), 'barre 2025', 'click'],
  [B(24.22), 'triple', 'impact'],
  [B(24.64), 'stamp x3', 'thud', { pitch: 'C3' }],
  [B(25.48), 'cut nuance', 'whoosh', { len: 0.4 }],
  [B(25.54), 'nuance', 'thud', { pitch: 'C3' }],
  [B(25.9), 'etude', 'pop', { pitch: 'E5' }],
  [B(28.14), 'achat', 'pop', { pitch: 'G5' }],
  [B(29.3), 'cut conseil', 'whoosh', { len: 0.4 }],
  [B(29.6), 'question', 'blip', { pitch: 'A5' }],
  [B(31.4), 'titre', 'type', { len: 0.5 }],
  [B(32.4), 'check', 'bell', { pitch: 'C6' }],
  [B(33.76), 'cut question', 'whoosh', { len: 0.4 }],
  [B(34.62), 'visibilite', 'impact'],
  [B(36.25), 'end card', 'impact'],
  [B(36.7), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ["Pour être cité par l'IA,", 0.1], ["pas besoin d'un million d'abonnés.", 1.72], ["C'est même l'inverse.", 3.28],
  ["L'agence We Are Watching", 4.48], ["a posé 805 questions d'achat", 5.7], ['à 5 IA,', 7.38], ['dont Google et ChatGPT.', 8.58],
  ['Résultat :', 10.3], ['84 % des vidéos de créateurs citées', 11.26], ['viennent de chaînes', 13.74],
  ['de moins de 100 000 abonnés.', 14.68],
  ['Et la moitié de ces vidéos', 16.32], ['font moins de 4 500 vues.', 17.42],
  ['Les marques ont compris :', 19.58], ['en France, le prix médian', 20.68], ["d'une collab avec un micro-influenceur", 22.08],
  ['a triplé en un an.', 23.92],
  ["Nuance : c'est une étude d'agence,", 25.54], ["limitée aux questions d'achat.", 27.36],
  ['Le conseil :', 28.76], ['donne à ta vidéo un titre', 30.04], ['qui reprend la question exacte', 31.18],
  ['que les gens se posent.', 32.72],
  ['Petite chaîne, grande visibilité :', 33.82], ['tu y crois ?', 35.66],
  ["Abonne-toi pour l'actu IA", 36.34], ['de chaque jour.', 37.58],
];
const CAP_Y = 1385;
function captions(ctx, t) {
  let i = -1;
  for (let k = 0; k < CAP.length; k++) if (t >= CAP[k][1] - 0.04) i = k;
  if (i < 0 || t > 39.6) return;
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
// a generic video thumbnail with a play triangle (no real product)
function thumb(ctx, x, y, w, h, color, s = 1) {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -w / 2, -h / 2, w, h, Math.min(w, h) * 0.18); ctx.fillStyle = color; ctx.fill();
  const r = Math.min(w, h) * 0.22;
  ctx.fillStyle = color === C.red ? C.white : color === C.card ? C.red : C.ink;
  ctx.beginPath(); ctx.moveTo(-r * 0.6, -r); ctx.lineTo(r, 0); ctx.lineTo(-r * 0.6, r); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// chat bubble labelled "IA"
function aiBubble(ctx, x, y, s, label, color) {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = color;
  rrect(ctx, -70, -55, 140, 100, 28); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-40, 40); ctx.lineTo(-60, 80); ctx.lineTo(-10, 44); ctx.closePath(); ctx.fill();
  text(ctx, label, 0, 18, font(56, 400, D), color === C.red ? C.white : C.ink, 'center');
  ctx.restore();
}
function cart(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 14; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-110, -80); ctx.lineTo(-75, -80); ctx.lineTo(-45, 40); ctx.lineTo(80, 40); ctx.lineTo(100, -45); ctx.lineTo(-62, -45); ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(-30, 80, 16, 0, M.TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(65, 80, 16, 0, M.TAU); ctx.fill();
  ctx.restore();
}
function check(ctx, x, y, s, p, color) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-60, 0);
  const a = clamp(p * 2), b = clamp(p * 2 - 1);
  ctx.lineTo(lerp(-60, -15, a), lerp(0, 45, a));
  if (b > 0) ctx.lineTo(lerp(-15, 70, b), lerp(45, -55, b));
  ctx.stroke(); ctx.restore();
}
const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// ------------------------------------------------------------------ S1 hook: no need for a million subscribers (0 - 4.42)
function sHook(ctx, t) {
  bg(ctx, t, 0);
  ctx.save();
  shakeAt(ctx, t, 3.46, 18);
  popWord(ctx, 'ÊTRE CITÉ', 90, 340, 140, C.white, t, -0.3);
  popWord(ctx, "PAR L'IA", 90, 470, 130, C.red, t, -0.22);
  // subscriber counter racing to a million, then crossed out
  const ck = sp(t, -0.1, SPRING.gentle);
  ctx.save(); ctx.translate(W / 2, 760); ctx.scale(0.85 + 0.15 * ck, 0.85 + 0.15 * ck);
  rrect(ctx, -420, -150, 840, 300, 36); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
  const n = 1000000 * E.outCubic(prog(t, 0, 2.3));
  text(ctx, fmt(n), 0, 40, font(170, 400, D), C.white, 'center');
  text(ctx, 'ABONNÉS', 0, 110, font(40, 800, UI), C.grey, 'center');
  const x = E.outCubic(prog(t, 2.4, 2.62));
  if (x > 0) {
    ctx.strokeStyle = C.red; ctx.lineWidth = 22; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-380, 60); ctx.lineTo(-380 + 760 * x, 60 - 120 * x); ctx.stroke();
  }
  ctx.restore();
  popWord(ctx, 'PAS BESOIN', W / 2, 1030, 100, C.grey, t, 1.72, 'center');
  slam(ctx, "C'EST L'INVERSE", W / 2, 1200, 140, C.red, t, 3.46);
  ctx.restore();
}

// ------------------------------------------------------------------ S2 the study: 805 shopping questions to 5 AIs (4.42 - 10.24)
function sStudy(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 4.42, 4.72));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  chip(ctx, 'ÉTUDE WE ARE WATCHING', 90, 330, t, 4.5, C.red);
  chip(ctx, 'NOVEMBRE 2026', 90, 420, t, 5.0, C.white);
  const v = 805 * E.outCubic(prog(t, 4.7, 6.7));
  if (t >= 4.7) {
    ctx.save(); shakeAt(ctx, t, 6.7, 14);
    text(ctx, fmt(v), 90, 680, font(260, 400, D), C.white);
    ctx.restore();
    popWord(ctx, "QUESTIONS D'ACHAT", 90, 770, 80, C.red, t, 6.68);
  }
  // 5 AI bubbles
  for (let i = 0; i < 5; i++) {
    const k = sp(t, 7.64 + i * 0.09, SPRING.bouncy);
    aiBubble(ctx, 150 + i * 195, 930, k, 'IA', i < 2 && t >= 8.68 + i * 0.66 ? C.red : C.white);
  }
  chip(ctx, 'GOOGLE', 70, 1120, t, 8.68, C.red);
  chip(ctx, 'CHATGPT', 300, 1120, t, 9.34, C.red);
  chip(ctx, '+ 3 AUTRES', 560, 1120, t, 9.6, C.white);
  ctx.restore();
  source(ctx, 'We Are Watching (bluelemon), 2 et 3 nov. 2026', t, 5.2);
}

// ------------------------------------------------------------------ S3 84 % of cited creator videos come from small channels (10.24 - 16.26)
function sResult(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 10.24, 10.54));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'RÉSULTAT', 90, 330, 90, C.grey, t, 10.28);
  const v = 84 * E.outCubic(prog(t, 10.5, 11.26));
  if (t >= 10.5) {
    ctx.save(); shakeAt(ctx, t, 11.26, 16);
    text(ctx, Math.round(v) + ' %', 90, 580, font(280, 400, D), C.red);
    ctx.restore();
  }
  popWord(ctx, 'DES VIDÉOS DE CRÉATEURS', 90, 650, 62, C.white, t, 12.5);
  popWord(ctx, "CITÉES PAR L'IA", 90, 720, 62, C.white, t, 13.0);
  // 5 x 5 grid of thumbnails: 21 red (small channels) + 4 grey (big)
  const big = new Set([3, 9, 16, 22]);
  for (let i = 0; i < 25; i++) {
    const r = Math.floor(i / 5), c = i % 5;
    const k = sp(t, 11.4 + (r + c) * 0.06, SPRING.bouncy);
    const recolor = t >= 14.44 + hash01(i, 3) * 0.6;
    const col = big.has(i) ? C.dim : recolor ? C.red : C.grey;
    thumb(ctx, 200 + c * 170, 820 + r * 82, 140, 66, col, k);
  }
  ctx.restore();
  chip(ctx, 'CHAÎNES DE MOINS DE 100 000 ABONNÉS', W / 2, 1265, t, 15.16, C.white, 'center');
}

// ------------------------------------------------------------------ S4 half of them have under 4 500 views (16.26 - 19.5)
function sViews(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 16.26, 16.56));
  ctx.save(); ctx.translate((1 - enter) * W * 0.6, 0);
  popWord(ctx, 'LA MOITIÉ', 90, 360, 160, C.white, t, 16.3);
  popWord(ctx, 'DE CES VIDÉOS', 90, 450, 70, C.grey, t, 16.9);
  // video card
  const vk = sp(t, 16.5, SPRING.gentle);
  ctx.save(); ctx.translate(W / 2, 760); ctx.scale(0.8 + 0.2 * vk, 0.8 + 0.2 * vk); ctx.globalAlpha = clamp(vk * 2);
  thumb(ctx, 0, -40, 760, 340, C.card, 1);
  ctx.lineWidth = 4; ctx.strokeStyle = C.edge; rrect(ctx, -380, -210, 760, 340, 60); ctx.stroke();
  const pb = prog(t, 16.5, 19.5);
  rrect(ctx, -340, 90, 680, 12, 6); ctx.fillStyle = C.dim; ctx.fill();
  rrect(ctx, -340, 90, 680 * pb, 12, 6); ctx.fillStyle = C.red; ctx.fill();
  ctx.restore();
  popWord(ctx, 'MOINS DE', 90, 1040, 80, C.grey, t, 17.66);
  const v = 4500 * E.outCubic(prog(t, 17.2, 18.0));
  if (t >= 17.2) {
    ctx.save(); shakeAt(ctx, t, 18.0, 14);
    text(ctx, fmt(v) + ' VUES', 90, 1200, font(170, 400, D), C.red);
    ctx.restore();
  }
  ctx.restore();
  source(ctx, 'Médiane des vidéos citées (We Are Watching)', t, 17.0);
}

// ------------------------------------------------------------------ S5 brands: micro-influencer price tripled (19.5 - 25.48)
function sPrice(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 19.5, 19.8));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'LES MARQUES', 90, 360, 150, C.white, t, 19.6);
  popWord(ctx, 'ONT COMPRIS', 90, 470, 100, C.red, t, 20.02);
  chip(ctx, 'EN FRANCE', 90, 560, t, 20.78, C.white);
  // brands pick small creators: a row of thumbnails turning red, cleared when the bars arrive
  const fade = 1 - clamp((t - 21.4) / 0.3);
  if (fade > 0) {
    ctx.save(); ctx.globalAlpha = fade;
    for (let i = 0; i < 8; i++) {
      const r = Math.floor(i / 4), c = i % 4;
      const k = sp(t, 19.62 + i * 0.05, SPRING.bouncy);
      thumb(ctx, 210 + c * 220, 900 + r * 150, 180, 110, t >= 20.02 + i * 0.08 ? C.red : C.grey, k);
    }
    ctx.restore();
  }
  popWord(ctx, "PRIX MÉDIAN D'UNE COLLAB", 90, 660, 46, C.grey, t, 21.6, 'left', UI, 800);
  popWord(ctx, 'MICRO-INFLUENCEUR', 90, 720, 46, C.grey, t, 22.96, 'left', UI, 800);
  // bar race 2025 vs 2026
  const base = 1200;
  const k1 = E.outCubic(prog(t, 21.6, 22.0));
  if (t >= 21.6) {
    const h = 110 * k1;
    rrect(ctx, 220, base - h, 220, h, 14); ctx.fillStyle = C.grey; ctx.fill();
    text(ctx, '2025', 330, base + 60, font(56, 400, D), C.grey, 'center');
    text(ctx, '1 000 €', 330, base - h - 24, font(64, 400, D), C.white, 'center');
  }
  const k2 = E.outCubic(prog(t, 23.6, 24.22));
  if (t >= 23.6) {
    const h = 330 * k2;
    rrect(ctx, 620, base - h, 220, h, 14); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, '2026', 730, base + 60, font(56, 400, D), C.red, 'center');
    ctx.save(); shakeAt(ctx, t, 24.22, 14);
    text(ctx, fmt(3000 * k2) + ' €', 730, base - h - 24, font(64, 400, D), C.white, 'center');
    ctx.restore();
  }
  stamp(ctx, 'X3', 520, 860, 220, 130, t, 24.64, -0.1, C.red);
  ctx.restore();
  source(ctx, 'Matriochka Influences, via Blog du Modérateur, 08/09/2026', t, 22.0);
}

// ------------------------------------------------------------------ S6 caveat: one agency study, shopping questions only (25.48 - 29.3)
function sNuance(ctx, t) {
  bg(ctx, t, 1);
  slam(ctx, 'NUANCE', W / 2, 380, 180, C.white, t, 25.54);
  const dk = sp(t, 25.9, SPRING.bouncy);
  if (dk > 0.001) {
    ctx.save(); ctx.translate(290, 760); ctx.scale(dk, dk); ctx.rotate(-0.05);
    rrect(ctx, -170, -210, 340, 420, 24); ctx.fillStyle = C.white; ctx.fill();
    for (let i = 0; i < 6; i++) { ctx.fillStyle = i === 0 ? C.red : '#C8C8CE'; ctx.fillRect(-120, -150 + i * 55, i === 0 ? 240 : 240 - (i % 3) * 50, 20); }
    ctx.restore();
    popWord(ctx, '1 ÉTUDE', 290, 1070, 84, C.white, t, 26.7, 'center');
    popWord(ctx, "D'AGENCE", 290, 1150, 64, C.grey, t, 26.9, 'center');
  }
  const ck = sp(t, 27.36, SPRING.bouncy);
  if (ck > 0.001) {
    cart(ctx, 790, 760, 1.6 * ck, C.red);
    popWord(ctx, 'ACHATS', 790, 1070, 84, C.red, t, 28.14, 'center');
    popWord(ctx, 'SEULEMENT', 790, 1150, 64, C.grey, t, 28.3, 'center');
  }
}

// ------------------------------------------------------------------ S7 advice: the title = the exact question (29.3 - 33.76)
function sAdvice(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 29.3, 29.6));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'LE CONSEIL', 90, 360, 150, C.red, t, 29.36);
  // the question someone asks
  const qk = sp(t, 29.6, SPRING.bouncy);
  if (qk > 0.001) {
    ctx.save(); ctx.translate(W / 2, 560); ctx.scale(qk, qk);
    rrect(ctx, -440, -70, 880, 130, 40); ctx.fillStyle = C.white; ctx.fill();
    ctx.beginPath(); ctx.moveTo(340, 50); ctx.lineTo(390, 110); ctx.lineTo(300, 58); ctx.closePath(); ctx.fill();
    text(ctx, 'Quel aspirateur pour un studio ?', 0, 16, font(44, 600, UI), C.ink, 'center');
    ctx.restore();
  }
  // the video title being typed
  const vk = sp(t, 30.1, SPRING.gentle);
  ctx.save(); ctx.translate(W / 2, 880); ctx.scale(0.85 + 0.15 * vk, 0.85 + 0.15 * vk); ctx.globalAlpha = clamp(vk * 2);
  rrect(ctx, -440, -170, 880, 340, 36); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
  thumb(ctx, -280, -40, 220, 150, C.red, 1);
  text(ctx, 'TITRE DE TA VIDÉO', -140, -80, font(30, 800, UI), C.grey);
  const msg = ['Quel aspirateur', 'pour un studio ?'];
  const p = prog(t, 31.4, 32.4);
  const total = msg[0].length + msg[1].length;
  const n = Math.floor(total * p);
  const l1 = msg[0].slice(0, Math.min(n, msg[0].length));
  const l2 = msg[1].slice(0, Math.max(0, n - msg[0].length));
  text(ctx, l1, -140, -10, font(50, 800, UI), C.white);
  text(ctx, l2, -140, 56, font(50, 800, UI), C.white);
  ctx.restore();
  check(ctx, W - 170, 1100, 1.1, prog(t, 32.4, 32.8), C.red);
  popWord(ctx, 'TITRE = LA QUESTION', 90, 1200, 96, C.white, t, 32.5);
  ctx.restore();
  source(ctx, '57 % des vidéos citées reprennent la question dans leur titre', t, 31.0);
}

// ------------------------------------------------------------------ S8 question + end card (33.76 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 1);
  const up = E.inOutCubic(prog(t, 36.2, 36.55));
  ctx.save(); ctx.translate(0, -up * 1400);
  popWord(ctx, 'PETITE CHAÎNE', W / 2, 400, 130, C.white, t, 33.82, 'center');
  // small thumbnail radiating big rings: small channel, big reach
  const rk = sp(t, 34.0, SPRING.bouncy);
  if (rk > 0.001) {
    ctx.save(); ctx.translate(W / 2, 680);
    if (t >= 34.62) {
      for (let i = 0; i < 4; i++) {
        const ph = ((t - 34.62) * 0.8 + i / 4) % 1;
        ctx.globalAlpha = (1 - ph) * 0.8; ctx.strokeStyle = C.red; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(0, 0, 50 + ph * 260, 0, M.TAU); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    thumb(ctx, 0, 0, 120, 86, C.red, rk);
    ctx.restore();
  }
  ctx.save(); shakeAt(ctx, t, 34.62, 14);
  slam(ctx, 'GRANDE VISIBILITÉ', W / 2, 1010, 120, C.red, t, 34.62);
  ctx.restore();
  popWord(ctx, 'TU Y CROIS ?', W / 2, 1150, 96, C.grey, t, 35.66, 'center');
  ctx.restore();
  if (t >= 36.22) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 36.3, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 36.5, 'center');
    const k = sp(t, 36.7, SPRING.bouncy);
    ctx.save(); ctx.translate(W / 2, 1010); ctx.scale(k, k);
    rrect(ctx, -280, -66, 560, 124, 62); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, 'Abonne-toi', 0, 18, font(60, 800, UI), C.white, 'center');
    ctx.restore();
    popWord(ctx, 'Réponds en commentaire', W / 2, 1180, 44, C.grey, t, 37.0, 'center', UI, 600);
    ctx.restore();
  }
}

M.film({
  fonts: [font(100, 400, D), font(40, 400, UI), font(40, 600, UI), font(40, 800, UI)],
  hits: HITS,
  draw(ctx, u, t) {
    if (t < 4.42) sHook(ctx, t);
    else if (t < 10.24) sStudy(ctx, t);
    else if (t < 16.26) sResult(ctx, t);
    else if (t < 19.5) sViews(ctx, t);
    else if (t < 25.48) sPrice(ctx, t);
    else if (t < 29.3) sNuance(ctx, t);
    else if (t < 33.76) sAdvice(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
