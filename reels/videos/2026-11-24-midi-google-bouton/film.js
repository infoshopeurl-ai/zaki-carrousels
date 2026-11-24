// Google remplace son bouton « Recherche Google » par 3 raccourcis d'IA (déploiement annoncé le 19/11/2026) : pure function of time.
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
  [B(1.42), 'page', 'pop', { pitch: 'E5' }],
  [B(3.18), 'inchangee', 'thud', { pitch: 'C3' }],
  [B(3.96), 'cut bouton', 'whoosh', { len: 0.4 }],
  [B(4.82), 'bouton', 'click'],
  [B(5.3), 'chute', 'impact'],
  [B(6.66), 'cut date', 'whoosh', { len: 0.4 }],
  [B(6.68), '19 nov', 'impact'],
  [B(9.08), 'ordinateur', 'pop', { pitch: 'G5' }],
  [B(9.82), 'trois', 'impact'],
  [B(11.2), 'images', 'pop', { pitch: 'C5' }],
  [B(12.26), 'fichier', 'pop', { pitch: 'E5' }],
  [B(13.48), 'brainstorm', 'pop', { pitch: 'G5' }],
  [B(14.9), 'cut barre', 'whoosh', { len: 0.4 }],
  [B(15.2), 'barre', 'whoosh', { len: 0.3 }],
  [B(16.48), 'discussions', 'blip', { pitch: 'A5' }],
  [B(17.14), 'gemini', 'bell', { pitch: 'C6' }],
  [B(18.04), 'cut monde', 'whoosh', { len: 0.4 }],
  [B(18.64), 'mondial', 'impact'],
  [B(19.34), 'france', 'pop', { pitch: 'G5' }],
  [B(20.22), 'nuance', 'thud', { pitch: 'C3' }],
  [B(21.46), 'progressif', 'type', { len: 0.5 }],
  [B(22.96), 'entree', 'click'],
  [B(23.74), 'classique', 'pop', { pitch: 'E5' }],
  [B(24.9), 'cut chance', 'whoosh', { len: 0.4 }],
  [B(26.46), 'survit', 'impact'],
  [B(26.78), 'cut conseil', 'whoosh', { len: 0.4 }],
  [B(28.6), 'reponse', 'type', { len: 0.9 }],
  [B(29.88), 'ouvre', 'click'],
  [B(30.24), 'source', 'impact'],
  [B(31.28), 'cut question', 'whoosh', { len: 0.4 }],
  [B(31.78), 'nouvelle page', 'pop', { pitch: 'G5' }],
  [B(32.62), 'end card', 'impact'],
  [B(33.1), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ["Plus de 25 ans que la page d'accueil", 0.1], ["de Google n'avait presque pas bougé.", 1.94],
  ["Et voilà qu'elle perd", 3.96], ['son bouton « Recherche Google ».', 4.66],
  ['Depuis le 19 novembre,', 6.66], ['Google le remplace sur ordinateur', 8.18], ["par trois raccourcis d'IA :", 9.66],
  ['créer des images,', 11.2], ['poser des questions sur un fichier,', 12.26], ['et brainstormer.', 13.48],
  ['Une barre latérale garde aussi', 14.9], ['tes discussions avec Gemini.', 16.38],
  ['Le déploiement est mondial,', 18.04], ['France comprise.', 19.34],
  ['Nuance : il est progressif,', 20.22], ['et la touche Entrée lance toujours', 22.04], ['une recherche classique.', 23.6],
  ["Le bouton « J'ai de la chance » survit.", 24.9],
  ['Le conseil :', 26.78], ["avant de croire une réponse d'IA,", 28.18], ['ouvre au moins une source.', 29.88],
  ['Tu as déjà la nouvelle page ?', 31.28],
  ["Abonne-toi pour l'actu IA", 32.72], ['de chaque jour.', 33.92],
];
const CAP_Y = 1385;
function captions(ctx, t) {
  let i = -1;
  for (let k = 0; k < CAP.length; k++) if (t >= CAP[k][1] - 0.04) i = k;
  if (i < 0 || t > 35.2) return;
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
function magnifier(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(-4, -4, 16, 0, M.TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(8, 8); ctx.lineTo(22, 22); ctx.stroke();
  ctx.restore();
}
// schematic search bar (no logo, house palette)
function searchBar(ctx, x, y, w, t) {
  rrect(ctx, x - w / 2, y - 55, w, 110, 55); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
  magnifier(ctx, x - w / 2 + 60, y, 1.1, C.grey);
  if (Math.floor(t * 2.2) % 2 === 0) { ctx.fillStyle = C.red; ctx.fillRect(x - w / 2 + 110, y - 28, 5, 56); }
}
function pill(ctx, str, x, y, color, txt, size = 34) {
  const f = font(size, 800, UI);
  ctx.font = f; const w = ctx.measureText(str).width + 64;
  rrect(ctx, x - w / 2, y - 44, w, 88, 22); ctx.fillStyle = color; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
  text(ctx, str, x, y + 12, f, txt, 'center');
  return w;
}
function laptop(ctx, x, y, s, color) {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -150, -110, 300, 190, 16); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = color; ctx.stroke();
  ctx.fillStyle = color; rrect(ctx, -200, 90, 400, 26, 13); ctx.fill();
  ctx.fillStyle = C.edge; rrect(ctx, -90, -30, 180, 34, 17); ctx.fill();
  ctx.restore();
}
function iconImage(ctx, s, color) {
  ctx.save(); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 8; ctx.lineJoin = 'round';
  rrect(ctx, -50, -40, 100, 80, 12); ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(22, -14, 10, 0, M.TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-42, 32); ctx.lineTo(-12, -4); ctx.lineTo(8, 18); ctx.lineTo(22, 6); ctx.lineTo(42, 32); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function iconDoc(ctx, s, color) {
  ctx.save(); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 8; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-36, -50); ctx.lineTo(16, -50); ctx.lineTo(38, -28); ctx.lineTo(38, 50); ctx.lineTo(-36, 50); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = color;
  for (let i = 0; i < 3; i++) ctx.fillRect(-20, -14 + i * 20, 42 - i * 8, 7);
  ctx.restore();
}
function iconBulb(ctx, s, color) {
  ctx.save(); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, -12, 32, Math.PI * 0.8, Math.PI * 2.2); ctx.lineTo(14, 26); ctx.lineTo(-14, 26); ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-12, 40); ctx.lineTo(12, 40); ctx.stroke();
  for (const a of [-2.4, -1.57, -0.74]) { ctx.beginPath(); ctx.moveTo(Math.cos(a) * 46, -12 + Math.sin(a) * 46); ctx.lineTo(Math.cos(a) * 60, -12 + Math.sin(a) * 60); ctx.stroke(); }
  ctx.restore();
}
function globe(ctx, x, y, r, t, color, lit) {
  ctx.save(); ctx.translate(x, y);
  ctx.strokeStyle = color; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, M.TAU); ctx.stroke();
  const rot = (t * 0.35) % 1;
  for (let i = 0; i < 4; i++) {
    const ph = ((i / 4 + rot) % 1) * Math.PI;
    const rx = Math.abs(Math.cos(ph)) * r;
    ctx.beginPath(); ctx.ellipse(0, 0, Math.max(1, rx), r, 0, 0, M.TAU); ctx.stroke();
  }
  for (const yy of [-0.5, 0, 0.5]) {
    const hw = Math.sqrt(1 - yy * yy) * r;
    ctx.beginPath(); ctx.moveTo(-hw, yy * r); ctx.lineTo(hw, yy * r); ctx.stroke();
  }
  for (let i = 0; i < 16; i++) {
    const a = hash01(i, 5) * M.TAU, d = Math.sqrt(hash01(i, 9)) * r * 0.85;
    const k = sp(t, lit + i * 0.05, SPRING.bouncy);
    if (k <= 0.001) continue;
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, 15 * k, 0, M.TAU); ctx.fill();
  }
  ctx.restore();
}
function bar(ctx, x, y, w, p, color) {
  rrect(ctx, x - w / 2, y - 40, w, 80, 40); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
  rrect(ctx, x - w / 2 + 10, y - 30, (w - 20) * p, 60, 30); ctx.fillStyle = color; ctx.fill();
}

// ------------------------------------------------------------------ S1 hook: 25 years, the page barely moved (0 - 3.96)
function sHook(ctx, t) {
  bg(ctx, t, 0);
  ctx.save();
  shakeAt(ctx, t, 3.18, 14);
  popWord(ctx, '25 ANS', 90, 360, 230, C.red, t, -0.3);
  popWord(ctx, 'SANS PRESQUE BOUGER', 90, 460, 84, C.white, t, 1.0);
  // the classic page: bar + two buttons
  const pk = sp(t, -0.4, SPRING.gentle);
  ctx.save(); ctx.globalAlpha = clamp(pk * 2); ctx.translate(0, (1 - pk) * 60);
  searchBar(ctx, W / 2, 680, 860, t);
  pill(ctx, 'Recherche Google', 340, 840, C.card, C.white);
  pill(ctx, "J'ai de la chance", 750, 840, C.card, C.white);
  ctx.restore();
  // a timeline running 1998 -> 2026
  const yp = prog(t, -0.2, 2.9);
  const yr = Math.round(lerp(1998, 2026, E.outCubic(yp)));
  text(ctx, '1998', 90, 1030, font(64, 400, D), C.grey);
  ctx.save();
  ctx.strokeStyle = C.edge; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(230, 1010); ctx.lineTo(820, 1010); ctx.stroke();
  ctx.strokeStyle = C.red; ctx.beginPath(); ctx.moveTo(230, 1010); ctx.lineTo(230 + 590 * E.outCubic(yp), 1010); ctx.stroke();
  ctx.restore();
  text(ctx, String(yr), 990, 1030, font(64, 400, D), C.red, 'right');
  stamp(ctx, 'INCHANGÉE', W / 2, 1190, 560, 100, t, 3.18, -0.05, C.white);
  ctx.restore();
}

// ------------------------------------------------------------------ S2 the search button falls off (3.96 - 6.66)
function sDrop(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 3.96, 4.26));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'ET VOILÀ', 90, 340, 150, C.white, t, 3.98);
  searchBar(ctx, W / 2, 520, 860, t);
  const hl = t >= 4.82;
  const dt = Math.max(0, t - 5.3);
  const dy = 0.5 * 4200 * dt * dt, rot = dt * 1.6;
  if (t >= 5.3) {
    ctx.save(); ctx.setLineDash([14, 12]); ctx.strokeStyle = C.red; ctx.lineWidth = 4;
    rrect(ctx, 340 - 175, 680 - 44, 350, 88, 22); ctx.stroke(); ctx.restore();
  }
  pill(ctx, "J'ai de la chance", 750, 680, C.card, C.white);
  ctx.save(); shakeAt(ctx, t, 5.3, 16);
  slam(ctx, 'BOUTON', W / 2, 1000, 170, C.white, t, 5.3);
  slam(ctx, 'SUPPRIMÉ', W / 2, 1170, 170, C.red, t, 5.52);
  ctx.restore();
  if (dy < 1400) {
    ctx.save(); ctx.translate(340, 680 + dy); ctx.rotate(rot);
    const press = t >= 4.82 && t < 5.3 ? 1 + 0.08 * wobble(t - 4.82, 4, 6) : 1;
    ctx.scale(press, press);
    pill(ctx, 'Recherche Google', 0, 0, hl ? C.red : C.card, C.white);
    ctx.restore();
  }
  ctx.restore();
}

// ------------------------------------------------------------------ S3 since 19 Nov, on desktop, 3 AI shortcuts (6.66 - 11.2)
function sDate(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 6.66, 6.96));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  ctx.save(); shakeAt(ctx, t, 6.68, 14);
  slam(ctx, '19 NOVEMBRE', W / 2, 380, 160, C.white, t, 6.68);
  ctx.restore();
  laptop(ctx, 300, 720, 1.0 * sp(t, 7.4, SPRING.bouncy), C.grey);
  chip(ctx, 'SUR ORDINATEUR', 300, 900, t, 9.08, C.white, 'center');
  ctx.save(); shakeAt(ctx, t, 9.82, 16);
  slam(ctx, '3', 790, 860, 420, C.red, t, 9.82);
  ctx.restore();
  popWord(ctx, "RACCOURCIS D'IA", W / 2, 1180, 120, C.white, t, 10.1, 'center');
  ctx.restore();
  source(ctx, 'Robby Stein (Google), via 9to5Google, 19/11/2026', t, 7.4);
}

// ------------------------------------------------------------------ S4 the three shortcuts (11.2 - 14.9)
function sTrio(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 11.2, 11.5));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'À LA PLACE', 90, 330, 140, C.white, t, 11.22);
  searchBar(ctx, W / 2, 480, 900, t);
  const items = [
    ['Créer des images', iconImage, 11.2],
    ['Questions sur un fichier', iconDoc, 12.26],
    ['Brainstormer', iconBulb, 13.48],
  ];
  items.forEach(([lab, ico, t0], i) => {
    const k = sp(t, t0, SPRING.bouncy);
    if (k <= 0.001) return;
    const y = 680 + i * 170;
    const active = t >= t0 && t < (items[i + 1] ? items[i + 1][2] : 14.9);
    ctx.save(); ctx.translate(W / 2 + (1 - k) * -300, y); ctx.globalAlpha = clamp(k * 2);
    rrect(ctx, -430, -70, 860, 140, 30); ctx.fillStyle = active ? C.red : C.card; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = active ? C.red : C.edge; ctx.stroke();
    ctx.save(); ctx.translate(-340, 0); ico(ctx, 0.9, C.white); ctx.restore();
    text(ctx, lab, -250, 18, font(54, 800, UI), C.white);
    ctx.restore();
  });
  ctx.restore();
  source(ctx, 'Brief IA, Siècle Digital, 23/11/2026', t, 11.6);
}

// ------------------------------------------------------------------ S5 sidebar keeps Gemini chats (14.9 - 18.04)
function sSidebar(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 14.9, 15.2));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'BARRE LATÉRALE', 90, 340, 140, C.white, t, 14.95);
  rrect(ctx, 90, 420, 900, 640, 30); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
  const sk = E.outCubic(prog(t, 15.2, 15.7));
  ctx.save(); rrect(ctx, 90, 420, 900, 640, 30); ctx.clip();
  ctx.fillStyle = '#1E1E23'; ctx.fillRect(90 - 340 * (1 - sk), 420, 340, 640);
  ctx.fillStyle = C.red; ctx.fillRect(90 + 340 * sk - 8, 420, 8, 640);
  for (let i = 0; i < 5; i++) {
    const k = sp(t, 16.2 + i * 0.16, SPRING.bouncy);
    if (k <= 0.001) continue;
    ctx.save(); ctx.globalAlpha = clamp(k * 2); ctx.translate(110 - 340 * (1 - sk), 450 + i * 115 + (1 - k) * 30);
    rrect(ctx, 0, 0, 290, 90, 16); ctx.fillStyle = i === 0 ? C.red : C.card; ctx.fill();
    ctx.fillStyle = i === 0 ? C.white : C.grey; ctx.fillRect(24, 26, 200 - i * 18, 14); ctx.fillStyle = i === 0 ? '#FFD0D7' : C.dim; ctx.fillRect(24, 52, 140, 10);
    ctx.restore();
  }
  rrect(ctx, 480, 480, 470, 80, 40); ctx.fillStyle = C.ink; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
  magnifier(ctx, 525, 520, 0.8, C.grey);
  const b1 = sp(t, 16.5, SPRING.bouncy), b2 = sp(t, 16.9, SPRING.bouncy);
  if (b1 > 0.001) { ctx.save(); ctx.globalAlpha = clamp(b1 * 2); rrect(ctx, 640, 640, 310, 90, 24); ctx.fillStyle = C.white; ctx.fill(); ctx.restore(); }
  if (b2 > 0.001) { ctx.save(); ctx.globalAlpha = clamp(b2 * 2); rrect(ctx, 480, 770, 360, 130, 24); ctx.fillStyle = C.edge; ctx.fill(); ctx.restore(); }
  ctx.restore();
  chip(ctx, 'TES DISCUSSIONS GEMINI', W / 2, 1150, t, 17.14, C.red, 'center');
  ctx.restore();
}

// ------------------------------------------------------------------ S6 global rollout, France included (18.04 - 20.22)
function sWorld(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 18.04, 18.34));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'DÉPLOIEMENT', W / 2, 330, 110, C.grey, t, 18.06, 'center');
  ctx.save(); shakeAt(ctx, t, 18.64, 14);
  slam(ctx, 'MONDIAL', W / 2, 470, 170, C.white, t, 18.64);
  ctx.restore();
  globe(ctx, W / 2, 800, 270, t, C.grey, 18.7);
  chip(ctx, 'FRANCE COMPRISE', W / 2, 1170, t, 19.34, C.red, 'center');
  ctx.restore();
  source(ctx, 'Siècle Digital, 23/11/2026', t, 18.5);
}

// ------------------------------------------------------------------ S7 caveat: progressive; Enter still does a classic search (20.22 - 24.9)
function sNuance(ctx, t) {
  bg(ctx, t, 0);
  slam(ctx, 'NUANCE', W / 2, 380, 180, C.white, t, 20.22);
  const bk = sp(t, 21.2, SPRING.gentle);
  if (bk > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(bk * 2);
    bar(ctx, W / 2, 540, 760, 0.1 + 0.35 * E.outCubic(prog(t, 21.46, 22.3)), C.red);
    ctx.restore();
    popWord(ctx, 'PROGRESSIF', W / 2, 680, 90, C.red, t, 21.46, 'center');
  }
  chip(ctx, 'PAS ENCORE CHEZ TOUT LE MONDE', W / 2, 770, t, 21.9, C.white, 'center');
  const kk = sp(t, 22.3, SPRING.bouncy);
  if (kk > 0.001) {
    const press = t >= 22.96 ? 1 - 0.12 * Math.exp(-(t - 22.96) * 7) : 1;
    ctx.save(); ctx.translate(290, 980); ctx.scale(kk * press, kk * press);
    rrect(ctx, -170, -95, 340, 190, 28); ctx.fillStyle = C.edge; ctx.fill();
    rrect(ctx, -160, -110, 320, 180, 26); ctx.fillStyle = t >= 22.96 ? C.white : C.card; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = C.grey; ctx.stroke();
    text(ctx, 'ENTRÉE', 0, 2, font(70, 400, D), t >= 22.96 ? C.ink : C.white, 'center');
    ctx.restore();
  }
  popWord(ctx, 'RECHERCHE', 750, 940, 90, C.white, t, 23.74, 'center');
  popWord(ctx, 'CLASSIQUE', 750, 1030, 90, C.red, t, 23.95, 'center');
  chip(ctx, 'TOUJOURS LÀ', 750, 1120, t, 24.2, C.white, 'center');
}

// ------------------------------------------------------------------ S8 "J'ai de la chance" survives (24.9 - 26.78)
function sLucky(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 24.9, 25.2));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'ET LE BOUTON', 90, 360, 120, C.white, t, 24.95);
  const k = sp(t, 25.3, SPRING.bouncy);
  ctx.save(); ctx.translate(W / 2, 700); ctx.scale(1.6 * k, 1.6 * k);
  pill(ctx, "J'ai de la chance", 0, 0, C.white, C.ink, 40);
  ctx.restore();
  const gk = sp(t, 25.1, SPRING.gentle);
  if (gk > 0.001) { ctx.save(); ctx.globalAlpha = 0.5 * clamp(gk * 2); ctx.translate(W / 2, 520); pill(ctx, 'Recherche Google', 0, 0, C.card, C.grey); ctx.strokeStyle = C.red; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-190, 0); ctx.lineTo(-190 + 380 * E.outCubic(prog(t, 25.3, 25.6)), 0); ctx.stroke(); ctx.restore(); }
  ctx.save(); shakeAt(ctx, t, 26.46, 16);
  stamp(ctx, 'SURVIT', W / 2, 1010, 520, 150, t, 26.46, -0.07, C.red);
  ctx.restore();
  ctx.restore();
}

// ------------------------------------------------------------------ S9 advice: open at least one source (26.78 - 31.28)
function sAdvice(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 26.78, 27.08));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'LE CONSEIL', 90, 340, 150, C.red, t, 26.8);
  const ck = sp(t, 26.85, SPRING.gentle);
  ctx.save(); ctx.translate(W / 2, 680); ctx.scale(0.85 + 0.15 * ck, 0.85 + 0.15 * ck); ctx.globalAlpha = clamp(ck * 2);
  rrect(ctx, -430, -230, 860, 460, 36); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
  text(ctx, "RÉPONSE DE L'IA", -380, -160, font(34, 800, UI), C.grey);
  const lp = prog(t, 27.9, 29.4);
  for (let i = 0; i < 4; i++) {
    const p = clamp(lp * 4 - i);
    if (p <= 0) continue;
    ctx.fillStyle = C.white; rrect(ctx, -380, -115 + i * 58, (i === 3 ? 420 : 760) * p, 26, 13); ctx.fill();
  }
  const sk = sp(t, 29.5, SPRING.bouncy);
  if (sk > 0.001) {
    const press = t >= 29.88 ? 1 - 0.1 * Math.exp(-(t - 29.88) * 8) : 1;
    ctx.save(); ctx.translate(-220, 160); ctx.scale(sk * press, sk * press);
    rrect(ctx, -160, -40, 320, 80, 40); ctx.fillStyle = t >= 29.88 ? C.red : C.ink; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.red; ctx.stroke();
    text(ctx, 'Source 1', 0, 13, font(38, 800, UI), C.white, 'center');
    ctx.restore();
    const pp = E.outCubic(prog(t, 29.3, 29.85));
    ctx.save(); ctx.translate(lerp(250, -170, pp), lerp(300, 185, pp));
    ctx.fillStyle = C.white; ctx.strokeStyle = C.ink; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 70); ctx.lineTo(18, 54); ctx.lineTo(32, 84); ctx.lineTo(44, 78); ctx.lineTo(30, 48); ctx.lineTo(52, 48); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
  stamp(ctx, 'OUVRE UNE SOURCE', W / 2, 1150, 800, 110, t, 30.24, -0.05, C.red);
  ctx.restore();
}

// ------------------------------------------------------------------ S10 question + end card (31.28 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 1);
  const up = E.inOutCubic(prog(t, 32.55, 32.9));
  ctx.save(); ctx.translate(0, -up * 1400);
  slam(ctx, 'ET TOI ?', W / 2, 480, 220, C.white, t, 31.28);
  const pk = sp(t, 31.3, SPRING.bouncy);
  ctx.save(); ctx.translate(W / 2, 720); ctx.scale(pk, pk);
  searchBar(ctx, 0, 0, 760, t);
  ctx.restore();
  popWord(ctx, 'DÉJÀ LA NOUVELLE PAGE ?', W / 2, 1000, 96, C.red, t, 31.78, 'center');
  ctx.restore();
  if (t >= 32.55) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 32.65, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 32.85, 'center');
    const k = sp(t, 33.1, SPRING.bouncy);
    ctx.save(); ctx.translate(W / 2, 1010); ctx.scale(k, k);
    rrect(ctx, -280, -66, 560, 124, 62); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, 'Abonne-toi', 0, 18, font(60, 800, UI), C.white, 'center');
    ctx.restore();
    popWord(ctx, 'Réponds en commentaire', W / 2, 1180, 44, C.grey, t, 33.4, 'center', UI, 600);
    ctx.restore();
  }
}

M.film({
  fonts: [font(100, 400, D), font(40, 400, UI), font(40, 600, UI), font(40, 800, UI)],
  hits: HITS,
  draw(ctx, u, t) {
    if (t < 3.96) sHook(ctx, t);
    else if (t < 6.66) sDrop(ctx, t);
    else if (t < 11.2) sDate(ctx, t);
    else if (t < 14.9) sTrio(ctx, t);
    else if (t < 18.04) sSidebar(ctx, t);
    else if (t < 20.22) sWorld(ctx, t);
    else if (t < 24.9) sNuance(ctx, t);
    else if (t < 26.78) sLucky(ctx, t);
    else if (t < 31.28) sAdvice(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
