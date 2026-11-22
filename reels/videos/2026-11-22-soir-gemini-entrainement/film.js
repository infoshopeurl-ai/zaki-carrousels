// Gemini sépare historique et entraînement de l'IA (annonce Google, mails du 22/11/2026) : pure function of time.
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
  [B(1.22), 'gemini', 'pop', { pitch: 'E5' }],
  [B(3.02), 'entraine', 'impact'],
  [B(5.4), 'cut change', 'whoosh', { len: 0.4 }],
  [B(5.62), 'ca change', 'impact'],
  [B(6.74), 'separe', 'thud', { pitch: 'C3' }],
  [B(7.6), 'les deux', 'pop', { pitch: 'G5' }],
  [B(8.05), 'cut reglages', 'whoosh', { len: 0.4 }],
  [B(8.24), 'historique', 'click'],
  [B(9.54), 'entrainement', 'click'],
  [B(11.24), 'textes', 'pop', { pitch: 'C6' }],
  [B(11.7), 'pieces', 'pop', { pitch: 'E6' }],
  [B(13.0), 'cut piege', 'whoosh', { len: 0.4 }],
  [B(13.0), 'piege', 'impact'],
  [B(15.82), 'active', 'click'],
  [B(16.72), 'copie', 'blip', { pitch: 'A5' }],
  [B(17.78), 'resteront', 'thud', { pitch: 'C3' }],
  [B(18.5), 'cut defaut', 'whoosh', { len: 0.4 }],
  [B(19.82), 'rien', 'impact'],
  [B(21.0), 'cut coupe', 'whoosh', { len: 0.4 }],
  [B(22.0), 'coupe', 'click'],
  [B(23.0), 'jours', 'type', { len: 0.6 }],
  [B(24.22), 'deux mois', 'impact'],
  [B(25.0), 'humains', 'pop', { pitch: 'C6' }],
  [B(26.05), 'cut deploiement', 'whoosh', { len: 0.4 }],
  [B(28.28), 'mails', 'blip', { pitch: 'A5' }],
  [B(28.92), 'partis', 'pop', { pitch: 'G5' }],
  [B(29.65), 'cut reflexe', 'whoosh', { len: 0.4 }],
  [B(30.84), 'ouvre', 'click'],
  [B(32.54), 'coupe ent', 'click'],
  [B(33.66), 'check', 'bell', { pitch: 'C6' }],
  [B(35.2), 'cut question', 'whoosh', { len: 0.4 }],
  [B(36.26), 'servaient', 'impact'],
  [B(37.45), 'end card', 'impact'],
  [B(37.9), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ['Garder ton historique Gemini,', 0.1], ["c'était accepter que Google", 1.88], ['entraîne son IA', 3.02], ['avec tes conversations.', 3.94],
  ['Ça change.', 5.44], ['Google sépare enfin les deux :', 6.42],
  ["un réglage pour l'historique,", 8.12], ["un autre pour l'entraînement", 9.54], ['des modèles,', 10.48], ['textes et pièces jointes compris.', 11.24],
  ['Le piège :', 13.08], ["si « Conserver l'activité »", 13.94], ['était activé,', 15.6], ['les deux nouveaux réglages', 16.72], ['le resteront.', 17.62],
  ['Donc par défaut,', 18.6], ['rien ne change pour toi.', 19.82],
  ['Et même historique coupé,', 21.1], ['tes discussions sont gardées', 22.72], ['environ 2 mois,', 23.68], ['avec des réviseurs humains.', 24.46],
  ['Le déploiement arrive', 26.14], ['dans les prochaines semaines,', 26.92], ['les mails sont déjà partis.', 28.18],
  ['Le bon réflexe :', 29.74], ['ouvre les paramètres de Gemini', 30.84], ["et coupe l'entraînement", 32.16], ['si tu veux garder tes échanges', 33.24], ['pour toi.', 34.38],
  ['Tu savais que tes discussions', 35.26], ['servaient à ça ?', 36.26],
  ["Abonne-toi pour l'actu IA", 37.54], ['de chaque jour.', 38.88],
];
const CAP_Y = 1385;
function captions(ctx, t) {
  let i = -1;
  for (let k = 0; k < CAP.length; k++) if (t >= CAP[k][1] - 0.04) i = k;
  if (i < 0 || t > 40.4) return;
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
// a settings row: label + on/off switch (on in 0..1, animated)
function toggleRow(ctx, x, y, w, label, on, s = 1, sub = '') {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -w / 2, -70, w, 140, 30); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = on > 0.5 ? C.red : C.edge; ctx.stroke();
  text(ctx, label, -w / 2 + 40, sub ? -2 : 18, font(52, 400, D), C.white);
  if (sub) text(ctx, sub, -w / 2 + 40, 44, font(28, 600, UI), C.grey);
  const sx = w / 2 - 150;
  rrect(ctx, sx, -40, 110, 80, 40); ctx.fillStyle = on > 0.5 ? C.red : C.dim; ctx.fill();
  ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(sx + lerp(40, 70, on), 0, 32, 0, M.TAU); ctx.fill();
  ctx.restore();
}
// a chat bubble
function bubble(ctx, x, y, w, h, right, color) {
  rrect(ctx, x, y, w, h, 28); ctx.fillStyle = color; ctx.fill();
  ctx.beginPath();
  if (right) { ctx.moveTo(x + w - 40, y + h); ctx.lineTo(x + w - 6, y + h + 28); ctx.lineTo(x + w - 80, y + h); }
  else { ctx.moveTo(x + 40, y + h); ctx.lineTo(x + 6, y + h + 28); ctx.lineTo(x + 80, y + h); }
  ctx.closePath(); ctx.fill();
}
function person(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(0, -60, 34, 0, M.TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-60, 40); ctx.quadraticCurveTo(-60, -20, 0, -20); ctx.quadraticCurveTo(60, -20, 60, 40); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function eye(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(-50, 0); ctx.quadraticCurveTo(0, -42, 50, 0); ctx.quadraticCurveTo(0, 42, -50, 0); ctx.stroke();
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, 0, 16, 0, M.TAU); ctx.fill();
  ctx.restore();
}
function envelope(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -110, -70, 220, 140, 14); ctx.fillStyle = color; ctx.fill();
  ctx.strokeStyle = C.ink; ctx.lineWidth = 8; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-100, -60); ctx.lineTo(0, 10); ctx.lineTo(100, -60); ctx.stroke();
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
// the "model" being trained: a chip with pins
function aiChip(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = color;
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(-90 + i * 50, -150, 20, 40); ctx.fillRect(-90 + i * 50, 110, 20, 40);
    ctx.fillRect(-150, -90 + i * 50, 40, 20); ctx.fillRect(110, -90 + i * 50, 40, 20);
  }
  rrect(ctx, -115, -115, 230, 230, 30); ctx.fill();
  text(ctx, 'IA', 0, 34, font(110, 400, D), C.white, 'center');
  ctx.restore();
}

// ------------------------------------------------------------------ S1 hook: keeping history = training Google's AI (0 - 5.4)
function sHook(ctx, t) {
  bg(ctx, t, 0);
  ctx.save();
  shakeAt(ctx, t, 3.02, 16);
  popWord(ctx, 'TON HISTORIQUE', 90, 330, 120, C.white, t, -0.3);
  popWord(ctx, 'GEMINI', 90, 450, 120, C.red, t, -0.2);
  // chat bubbles stacking on the left
  const bub = [[0.0, 260, 0], [0.45, 200, 1], [0.9, 300, 0], [1.4, 220, 1]];
  for (let i = 0; i < bub.length; i++) {
    const [t0, w, r] = bub[i];
    const k = sp(t, t0 - 0.35, SPRING.bouncy);
    if (k <= 0.001) continue;
    // from "entraîne", bubbles slide into the AI chip
    const go = E.inOutCubic(prog(t, 3.1 + i * 0.12, 3.6 + i * 0.12));
    const bx = lerp(90 + (r ? 90 : 0), 760, go), by = lerp(560 + i * 130, 820, go);
    ctx.save(); ctx.globalAlpha = clamp(k * 2) * (1 - go);
    ctx.translate(bx, by); ctx.scale(lerp(k, 0.3, go), lerp(k, 0.3, go));
    bubble(ctx, 0, 0, w, 84, r, r ? C.red : C.grey);
    ctx.fillStyle = r ? 'rgba(255,255,255,0.5)' : 'rgba(5,5,6,0.35)';
    rrect(ctx, 28, 30, w - 90, 22, 11); ctx.fill();
    ctx.restore();
  }
  const ck = sp(t, 2.6, SPRING.bouncy);
  if (ck > 0.001) {
    aiChip(ctx, 800, 820, 0.9 * ck + (t > 3.6 ? 0.05 * wobble(t - 3.6, 3, 6) : 0), C.red);
    popWord(ctx, 'GOOGLE', 800, 1060, 64, C.white, t, 2.78, 'center');
  }
  const ap = E.outCubic(prog(t, 3.0, 3.4));
  if (ap > 0) {
    ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 10; ctx.setLineDash([22, 16]); ctx.lineDashOffset = -t * 120;
    ctx.beginPath(); ctx.moveTo(430, 820); ctx.lineTo(lerp(430, 620, ap), 820); ctx.stroke(); ctx.restore();
  }
  slam(ctx, '= ENTRAÎNER SON IA', W / 2, 1200, 104, C.red, t, 3.02);
  ctx.restore();
}

// ------------------------------------------------------------------ S2 "ça change" : one switch split in two (5.4 - 8.05)
function sSplit(ctx, t) {
  bg(ctx, t, 1);
  ctx.save(); shakeAt(ctx, t, 5.62, 16);
  slam(ctx, 'ÇA CHANGE.', W / 2, 400, 190, C.white, t, 5.44);
  ctx.restore();
  const sp1 = E.inOutCubic(prog(t, 6.74, 7.3));
  const k = sp(t, 5.5, SPRING.bouncy);
  if (k > 0.001) {
    // single big switch that splits horizontally into two
    const gap = 150 * sp1;
    for (let j = 0; j < 2; j++) {
      const dy = (j ? 1 : -1) * gap;
      ctx.save(); ctx.translate(W / 2, 720 + dy); ctx.scale(k, k);
      ctx.beginPath(); ctx.rect(-420, j ? 0 : -160, 840, 160); ctx.clip();
      rrect(ctx, -420, -150, 840, 300, 150); ctx.fillStyle = C.red; ctx.fill();
      ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(270, 0, 120, 0, M.TAU); ctx.fill();
      ctx.restore();
    }
  }
  if (t < 7.6) popWord(ctx, 'UN SEUL RÉGLAGE', W / 2, 1200, 90, C.grey, t, 5.9, 'center');
  slam(ctx, 'COUPÉ EN DEUX', W / 2, 1210, 120, C.red, t, 7.6);
}

// ------------------------------------------------------------------ S3 the two new settings (8.05 - 13.0)
function sTwo(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 8.05, 8.35));
  ctx.save(); ctx.translate((1 - enter) * W * 0.6, 0);
  popWord(ctx, '2 RÉGLAGES', 90, 360, 150, C.white, t, 8.1);
  popWord(ctx, 'SÉPARÉS', 90, 470, 110, C.red, t, 8.4);
  toggleRow(ctx, W / 2, 640, 900, 'HISTORIQUE', E.outCubic(prog(t, 8.8, 9.1)), sp(t, 8.24, SPRING.bouncy), 'Combien de temps tes discussions restent');
  toggleRow(ctx, W / 2, 830, 900, 'ENTRAÎNEMENT DES MODÈLES', E.outCubic(prog(t, 10.6, 10.9)), sp(t, 9.54, SPRING.bouncy), "Si Google s'en sert pour son IA");
  // what goes into training: texts + attachments
  const tk = sp(t, 11.24, SPRING.bouncy);
  if (tk > 0.001) {
    ctx.save(); ctx.translate(330, 1060); ctx.scale(tk, tk);
    rrect(ctx, -170, -90, 340, 180, 24); ctx.fillStyle = C.white; ctx.fill();
    for (let i = 0; i < 4; i++) { rrect(ctx, -130, -60 + i * 34, 260 - i * 40, 16, 8); ctx.fillStyle = '#9A9AA2'; ctx.fill(); }
    ctx.restore();
    popWord(ctx, 'TEXTES', 330, 1225, 60, C.white, t, 11.3, 'center');
  }
  const pk = sp(t, 11.7, SPRING.bouncy);
  if (pk > 0.001) {
    ctx.save(); ctx.translate(760, 1060); ctx.scale(pk, pk); ctx.rotate(0.05);
    rrect(ctx, -120, -100, 240, 200, 16); ctx.fillStyle = C.red; ctx.fill();
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.moveTo(-90, 70); ctx.lineTo(-20, -20); ctx.lineTo(30, 40); ctx.lineTo(60, 10); ctx.lineTo(95, 70); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(55, -45, 22, 0, M.TAU); ctx.fill();
    ctx.restore();
    popWord(ctx, 'PIÈCES JOINTES', 760, 1225, 60, C.white, t, 11.8, 'center');
  }
  ctx.restore();
  source(ctx, 'Google, blog officiel Gemini, 11/2026', t, 9.0);
}

// ------------------------------------------------------------------ S4 the trap: old ON copied to both new (13.0 - 18.5)
function sTrap(ctx, t) {
  bg(ctx, t, 1);
  stamp(ctx, 'LE PIÈGE', W / 2, 330, 560, 130, t, 13.0, -0.06, C.red);
  const ok = sp(t, 13.3, SPRING.bouncy);
  const oldOn = E.outCubic(prog(t, 15.82, 16.1));
  toggleRow(ctx, W / 2, 560, 900, "CONSERVER L'ACTIVITÉ", oldOn, ok, 'Ancien réglage');
  // copy arrows
  const ap = E.inOutCubic(prog(t, 16.72, 17.2));
  if (ap > 0) {
    ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 10; ctx.lineCap = 'round';
    for (const x of [300, 780]) {
      ctx.beginPath(); ctx.moveTo(W / 2, 640); ctx.lineTo(lerp(W / 2, x, ap), lerp(640, 790, ap)); ctx.stroke();
    }
    ctx.restore();
  }
  const nk = sp(t, 16.9, SPRING.bouncy);
  const nOn = E.outCubic(prog(t, 17.5, 17.8));
  toggleRow(ctx, 300, 880, 440, 'HISTORIQUE', nOn, nk);
  toggleRow(ctx, 780, 880, 440, 'ENTRAÎNEMENT', nOn, nk);
  ctx.save(); shakeAt(ctx, t, 17.78, 14);
  slam(ctx, 'RESTENT ACTIVÉS', W / 2, 1150, 120, C.red, t, 17.78);
  ctx.restore();
  source(ctx, 'Mail Google Gemini aux utilisateurs, 22/11/2026', t, 14.2);
}

// ------------------------------------------------------------------ S5 by default nothing changes (18.5 - 21.0)
function sDefault(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 18.42, 18.7));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'PAR DÉFAUT', W / 2, 400, 160, C.white, t, 18.4, 'center');
  // before / after: identical
  const bk = sp(t, 18.6, SPRING.bouncy), ak = sp(t, 19.3, SPRING.bouncy);
  for (const [x, k, lab] of [[280, bk, 'AVANT'], [800, ak, 'APRÈS']]) {
    if (k <= 0.001) continue;
    ctx.save(); ctx.translate(x, 720); ctx.scale(k, k);
    rrect(ctx, -200, -170, 400, 340, 30); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
    text(ctx, lab, 0, -100, font(56, 400, D), C.grey, 'center');
    aiChip(ctx, 0, 40, 0.5, C.red);
    ctx.restore();
  }
  popWord(ctx, '=', W / 2, 770, 140, C.white, t, 19.5, 'center');
  ctx.restore();
  ctx.save(); shakeAt(ctx, t, 19.82, 16);
  stamp(ctx, 'RIEN NE CHANGE', W / 2, 1120, 820, 130, t, 19.82, -0.05, C.red);
  ctx.restore();
}

// ------------------------------------------------------------------ S6 history off: still kept ~2 months, human reviewers (21.0 - 26.05)
function sTwoMonths(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 20.85, 21.15));
  ctx.save(); ctx.translate((1 - enter) * W * 0.6, 0);
  toggleRow(ctx, W / 2, 320, 900, 'HISTORIQUE', 1 - E.outCubic(prog(t, 22.0, 22.3)), sp(t, 20.9, SPRING.bouncy), t >= 22.0 ? 'Coupé' : 'Activé');
  popWord(ctx, 'ENCORE GARDÉES', 90, 520, 90, C.white, t, 22.72);
  // 60-day calendar filling up
  const n = Math.floor(60 * E.outCubic(prog(t, 23.0, 24.22)));
  if (t >= 21.3) {
    for (let i = 0; i < 60; i++) {
      const cx = 110 + (i % 10) * 52, cy = 590 + Math.floor(i / 10) * 52;
      rrect(ctx, cx, cy, 40, 40, 8); ctx.fillStyle = i < n ? C.red : C.dim; ctx.fill();
    }
  }
  ctx.save(); shakeAt(ctx, t, 24.22, 14);
  slam(ctx, '2 MOIS', 840, 780, 170, C.white, t, 24.22);
  ctx.restore();
  // human reviewers looking
  const hk = sp(t, 24.9, SPRING.bouncy);
  if (hk > 0.001) {
    for (let i = 0; i < 3; i++) {
      const k = sp(t, 24.9 + i * 0.15, SPRING.bouncy);
      person(ctx, 230 + i * 150, 1160, 1.0 * k, i === 1 ? C.red : C.grey);
    }
    eye(ctx, 830, 1000, 1.3 * hk, C.white);
    popWord(ctx, 'RÉVISEURS', 830, 1110, 64, C.white, t, 25.0, 'center');
    popWord(ctx, 'HUMAINS', 830, 1180, 64, C.red, t, 25.34, 'center');
  }
  ctx.restore();
  source(ctx, 'Mail Google 22/11, Digital Trends 17/11/2026', t, 23.0);
}

// ------------------------------------------------------------------ S7 rollout in the coming weeks, mails already sent (26.05 - 29.65)
function sRollout(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 26.05, 26.35));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'DÉPLOIEMENT', 90, 370, 150, C.white, t, 26.14);
  chip(ctx, 'PROCHAINES SEMAINES', 90, 460, t, 27.2, C.red);
  // timeline of weeks
  const lp = E.outCubic(prog(t, 26.7, 27.6));
  if (lp > 0) {
    ctx.save(); ctx.strokeStyle = C.grey; ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(110, 600); ctx.lineTo(lerp(110, 970, lp), 600); ctx.stroke();
    for (let i = 0; i < 5; i++) {
      const x = 110 + i * 215;
      if (x > lerp(110, 970, lp) + 1) continue;
      ctx.fillStyle = i === 0 ? C.red : C.grey; ctx.beginPath(); ctx.arc(x, 600, i === 0 ? 22 : 14, 0, M.TAU); ctx.fill();
    }
    ctx.restore();
  }
  // envelopes stacking
  for (let i = 0; i < 5; i++) {
    const k = sp(t, 27.5 + i * 0.18, SPRING.bouncy);
    if (k <= 0.001) continue;
    envelope(ctx, 260 + i * 22 + hash01(i, 3) * 20, 920 - i * 34, 1.3 * k, i === 4 ? C.red : C.white);
  }
  popWord(ctx, 'LES MAILS', 790, 820, 80, C.white, t, 28.28, 'center');
  ctx.save(); shakeAt(ctx, t, 28.92, 12);
  slam(ctx, 'DÉJÀ PARTIS', 790, 940, 110, C.red, t, 28.92);
  ctx.restore();
  ctx.restore();
}

// ------------------------------------------------------------------ S8 advice: open settings, turn training off (29.65 - 35.2)
function sAdvice(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 29.65, 29.95));
  ctx.save(); ctx.translate((1 - enter) * W * 0.6, 0);
  popWord(ctx, 'LE BON RÉFLEXE', 90, 360, 130, C.red, t, 29.74);
  const pk = sp(t, 30.0, SPRING.gentle);
  if (pk > 0.001) {
    ctx.save(); ctx.translate(W / 2, 760); ctx.scale(0.85 + 0.15 * pk, 0.85 + 0.15 * pk); ctx.globalAlpha = clamp(pk * 2);
    rrect(ctx, -440, -290, 880, 580, 40); ctx.fillStyle = '#0E0E11'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
    text(ctx, 'PARAMÈTRES  >  GEMINI', -390, -200, font(60, 400, D), C.white);
    ctx.fillStyle = C.dim; ctx.fillRect(-390, -170, 780, 4);
    ctx.restore();
    toggleRow(ctx, W / 2, 680, 800, 'HISTORIQUE', 1, pk);
    const off = 1 - E.outCubic(prog(t, 32.54, 32.84));
    ctx.save(); shakeAt(ctx, t, 32.54, 10);
    toggleRow(ctx, W / 2, 860, 800, 'ENTRAÎNEMENT', off, pk, t >= 32.54 ? 'Désactivé' : '');
    ctx.restore();
  }
  check(ctx, W - 170, 1160, 1.1, prog(t, 33.66, 34.0), C.red);
  popWord(ctx, 'TES ÉCHANGES', 90, 1150, 84, C.white, t, 33.66);
  popWord(ctx, 'RESTENT À TOI', 90, 1240, 70, C.grey, t, 34.2);
  ctx.restore();
}

// ------------------------------------------------------------------ S9 question + end card (35.2 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 0);
  const up = E.inOutCubic(prog(t, 37.3, 37.65));
  ctx.save(); ctx.translate(0, -up * 1400);
  popWord(ctx, 'ET TOI ?', W / 2, 420, 150, C.grey, t, 35.26, 'center');
  popWord(ctx, 'TU SAVAIS QUE TES DISCUSSIONS', W / 2, 600, 64, C.white, t, 35.46, 'center');
  ctx.save(); shakeAt(ctx, t, 36.26, 14);
  slam(ctx, 'SERVAIENT À ÇA ?', W / 2, 800, 140, C.red, t, 36.26);
  ctx.restore();
  chip(ctx, 'OUI', 380, 1000, t, 36.6, C.white, 'center');
  chip(ctx, 'NON', 700, 1000, t, 36.75, C.red, 'center');
  popWord(ctx, 'Réponds en commentaire', W / 2, 1120, 44, C.grey, t, 36.9, 'center', UI, 600);
  ctx.restore();
  if (t >= 37.32) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 37.45, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 37.65, 'center');
    const k = sp(t, 37.9, SPRING.bouncy);
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
    if (t < 5.4) sHook(ctx, t);
    else if (t < 8.05) sSplit(ctx, t);
    else if (t < 13.0) sTwo(ctx, t);
    else if (t < 18.5) sTrap(ctx, t);
    else if (t < 21.0) sDefault(ctx, t);
    else if (t < 26.05) sTwoMonths(ctx, t);
    else if (t < 29.65) sRollout(ctx, t);
    else if (t < 35.2) sAdvice(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
