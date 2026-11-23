// TikTok étend au monde sa détection des visages détournés par IA (annonce du 19/11/2026) : pure function of time.
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
  [B(1.26), 'scan', 'whoosh', { len: 0.5 }],
  [B(2.22), 'ia', 'pop', { pitch: 'E5' }],
  [B(2.8), 'saurais', 'impact'],
  [B(3.78), 'cut tiktok', 'whoosh', { len: 0.4 }],
  [B(4.64), 'certains', 'click'],
  [B(5.56), 'notif', 'bell', { pitch: 'C6' }],
  [B(6.86), 'cut date', 'whoosh', { len: 0.4 }],
  [B(6.98), '19 nov', 'impact'],
  [B(9.18), 'monde', 'pop', { pitch: 'G5' }],
  [B(9.9), 'detection', 'type', { len: 0.6 }],
  [B(11.44), 'cut id', 'whoosh', { len: 0.4 }],
  [B(12.52), 'id ok', 'bell', { pitch: 'A5' }],
  [B(13.4), 'createurs', 'pop', { pitch: 'E5' }],
  [B(14.0), 'personnalites', 'pop', { pitch: 'G5' }],
  [B(15.1), 'cut match', 'whoosh', { len: 0.4 }],
  [B(15.6), 'alerte', 'blip', { pitch: 'A5' }],
  [B(17.24), 'match', 'impact'],
  [B(18.36), 'signaler', 'click'],
  [B(19.2), 'cut objectif', 'whoosh', { len: 0.4 }],
  [B(20.46), 'urne', 'thud', { pitch: 'C3' }],
  [B(21.46), '2027', 'impact'],
  [B(22.74), 'france', 'pop', { pitch: 'G5' }],
  [B(23.52), 'cut nuance', 'whoosh', { len: 0.4 }],
  [B(23.56), 'nuance', 'thud', { pitch: 'C3' }],
  [B(24.44), 'cadenas', 'click'],
  [B(25.94), 'progressif', 'type', { len: 0.5 }],
  [B(26.96), 'cut conseil', 'whoosh', { len: 0.4 }],
  [B(28.36), 'tout le monde', 'pop', { pitch: 'E5' }],
  [B(29.32), 'formulaire', 'type', { len: 1.2 }],
  [B(31.22), 'deepfake', 'blip', { pitch: 'A5' }],
  [B(32.02), 'sans compte', 'impact'],
  [B(33.22), 'cut question', 'whoosh', { len: 0.4 }],
  [B(33.96), 'confronte', 'pop', { pitch: 'G5' }],
  [B(34.62), 'end card', 'impact'],
  [B(35.1), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ["Si quelqu'un utilisait ton visage", 0.1], ['dans une vidéo IA,', 1.64], ['tu le saurais ?', 2.8],
  ['Sur TikTok, certains', 3.78], ['vont maintenant être prévenus.', 4.86],
  ['Le 19 novembre, la plateforme', 6.86], ['a étendu au monde entier', 8.56], ['sa détection de ressemblance.', 9.74],
  ["Après une vérification d'identité,", 11.44], ['les créateurs et personnalités publiques', 13.3],
  ['sont alertés quand une vidéo', 14.94], ['semble utiliser leur visage,', 16.24], ['et peuvent la signaler.', 17.7],
  ['Objectif affiché :', 19.2], ['les élections européennes de 2027,', 20.38], ['dont celles en France.', 22.32],
  ['Nuance : c\'est réservé', 23.52], ['aux comptes éligibles,', 24.8], ['et le déploiement est progressif.', 25.5],
  ['Le conseil :', 26.96], ['pour tout le monde,', 28.36], ['un formulaire de TikTok', 29.2], ['permet de signaler un deepfake,', 30.1],
  ['même sans compte.', 32.02],
  ['Tu y as déjà été confronté ?', 33.22],
  ["Abonne-toi pour l'actu IA", 34.68], ['de chaque jour.', 35.92],
];
const CAP_Y = 1385;
function captions(ctx, t) {
  let i = -1;
  for (let k = 0; k < CAP.length; k++) if (t >= CAP[k][1] - 0.04) i = k;
  if (i < 0 || t > 37.2) return;
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

// ------------------------------------------------------------------ scene props
// simple head-and-shoulders silhouette
function face(ctx, x, y, s, color, stroke = false) {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(0, -70, 95, 0, M.TAU);
  ctx.moveTo(-170, 210); ctx.quadraticCurveTo(-170, 50, 0, 50); ctx.quadraticCurveTo(170, 50, 170, 210); ctx.closePath();
  if (stroke) { ctx.strokeStyle = color; ctx.lineWidth = 10; ctx.stroke(); } else { ctx.fillStyle = color; ctx.fill(); }
  ctx.restore();
}
// focus brackets around a box
function brackets(ctx, x, y, w, h, color, k) {
  if (k <= 0.001) return;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.globalAlpha = clamp(k * 2);
  const L = 70 * k;
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const cx = x + sx * w / 2, cy = y + sy * h / 2;
    ctx.beginPath(); ctx.moveTo(cx, cy - sy * L); ctx.lineTo(cx, cy); ctx.lineTo(cx - sx * L, cy); ctx.stroke();
  }
  ctx.restore();
}
function phone(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -190, -360, 380, 720, 56); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.edge; ctx.stroke();
  rrect(ctx, -60, -335, 120, 22, 11); ctx.fillStyle = C.ink; ctx.fill();
  ctx.restore();
}
function bell(ctx, x, y, s, color) {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(-60, 40); ctx.quadraticCurveTo(-55, -70, 0, -75); ctx.quadraticCurveTo(55, -70, 60, 40); ctx.lineTo(75, 55); ctx.lineTo(-75, 55); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(0, 72, 18, 0, M.TAU); ctx.fill();
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
  // dots lighting up around the world
  for (let i = 0; i < 14; i++) {
    const a = hash01(i, 5) * M.TAU, d = Math.sqrt(hash01(i, 9)) * r * 0.85;
    const k = sp(t, lit + i * 0.07, SPRING.bouncy);
    if (k <= 0.001) continue;
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, 16 * k, 0, M.TAU); ctx.fill();
  }
  ctx.restore();
}
function lock(ctx, x, y, s, color) {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 26;
  ctx.beginPath(); ctx.arc(0, -40, 70, Math.PI, 0); ctx.lineTo(70, 10); ctx.moveTo(-70, -40); ctx.lineTo(-70, 10); ctx.stroke();
  rrect(ctx, -115, 0, 230, 180, 26); ctx.fillStyle = color; ctx.fill();
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(0, 70, 22, 0, M.TAU); ctx.fill(); ctx.fillRect(-9, 75, 18, 50);
  ctx.restore();
}

// ------------------------------------------------------------------ S1 hook: your face in an AI video? (0 - 3.78)
function sHook(ctx, t) {
  bg(ctx, t, 0);
  ctx.save();
  shakeAt(ctx, t, 2.8, 16);
  popWord(ctx, 'TON VISAGE', 90, 330, 150, C.white, t, -0.3);
  popWord(ctx, 'DANS UNE VIDÉO IA', 90, 430, 84, C.red, t, 1.64);
  // video frame with a face, scanned
  const vk = sp(t, -0.2, SPRING.gentle);
  ctx.save(); ctx.translate(W / 2, 760); ctx.scale(0.85 + 0.15 * vk, 0.85 + 0.15 * vk);
  rrect(ctx, -300, -240, 600, 440, 40); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
  ctx.save(); rrect(ctx, -300, -240, 600, 440, 40); ctx.clip();
  face(ctx, 0, 10, 1, t >= 2.22 ? C.red : C.grey);
  // scan line sweeping
  if (t >= 1.26) {
    const p = ((t - 1.26) / 1.1) % 1;
    const yy = -240 + p * 440;
    ctx.fillStyle = 'rgba(255,31,61,0.35)'; ctx.fillRect(-300, yy - 30, 600, 30);
    ctx.fillStyle = C.red; ctx.fillRect(-300, yy, 600, 6);
  }
  ctx.restore();
  chip(ctx, 'IA', 200, -180, t, 2.22, C.red);
  ctx.restore();
  slam(ctx, 'TU LE SAURAIS ?', W / 2, 1190, 140, C.white, t, 2.8);
  ctx.restore();
}

// ------------------------------------------------------------------ S2 TikTok: some will now be warned (3.78 - 6.86)
function sWarn(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 3.78, 4.08));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'SUR TIKTOK', 90, 340, 150, C.white, t, 3.82);
  popWord(ctx, 'CERTAINS SERONT', 90, 440, 80, C.grey, t, 4.64);
  phone(ctx, 300, 830, 0.85);
  ctx.save(); rrect(ctx, 300 - 140, 830 - 250, 280, 500, 30); ctx.clip(); face(ctx, 300, 900, 0.75 * sp(t, 3.9, SPRING.gentle), C.dim); ctx.restore();
  // notification sliding down on the phone
  const nk = sp(t, 5.56, SPRING.bouncy);
  if (nk > 0.001) {
    ctx.save(); ctx.translate(300, 620 + (1 - nk) * -80); ctx.globalAlpha = clamp(nk * 2);
    rrect(ctx, -150, -55, 300, 110, 24); ctx.fillStyle = C.white; ctx.fill();
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(-100, 0, 28, 0, M.TAU); ctx.fill();
    ctx.fillStyle = C.ink; ctx.fillRect(-55, -22, 170, 16); ctx.fillStyle = '#C8C8CE'; ctx.fillRect(-55, 8, 130, 14);
    ctx.restore();
  }
  const bw = t >= 5.56 ? 0.12 * wobble(t - 5.56, 4, 4) : 0;
  ctx.save(); ctx.translate(780, 800); ctx.rotate(bw);
  bell(ctx, 0, 0, 1.6 * sp(t, 4.9, SPRING.bouncy), t >= 5.56 ? C.red : C.grey);
  ctx.restore();
  slam(ctx, 'PRÉVENUS', 760, 1130, 120, C.red, t, 5.56);
  ctx.restore();
}

// ------------------------------------------------------------------ S3 19 Nov: worldwide likeness detection (6.86 - 11.44)
function sWorld(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 6.86, 7.16));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  ctx.save(); shakeAt(ctx, t, 6.98, 14);
  slam(ctx, '19 NOVEMBRE', 90 + 330, 360, 150, C.white, t, 6.98);
  ctx.restore();
  globe(ctx, W / 2, 740, 260, t, C.grey, 8.66);
  popWord(ctx, 'MONDE ENTIER', W / 2, 1100, 120, C.red, t, 9.18, 'center');
  // typed label
  const lab = 'DÉTECTION DE RESSEMBLANCE';
  const n = Math.floor(lab.length * prog(t, 9.9, 10.5));
  if (n > 0) text(ctx, lab.slice(0, n), W / 2, 1200, font(54, 800, UI), C.white, 'center');
  ctx.restore();
  source(ctx, 'TikTok, Safety and Innovation Forum, Londres', t, 7.4);
}

// ------------------------------------------------------------------ S4 ID check, creators and public figures (11.44 - 15.1)
function sId(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 11.44, 11.74));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, "VÉRIFICATION", 90, 340, 130, C.white, t, 11.5);
  popWord(ctx, "D'IDENTITÉ", 90, 450, 110, C.red, t, 11.82);
  // ID card
  const ck = sp(t, 11.6, SPRING.gentle);
  ctx.save(); ctx.translate(W / 2, 720); ctx.scale(0.85 + 0.15 * ck, 0.85 + 0.15 * ck); ctx.rotate(-0.04);
  rrect(ctx, -330, -170, 660, 340, 30); ctx.fillStyle = C.white; ctx.fill();
  rrect(ctx, -290, -120, 200, 240, 18); ctx.fillStyle = '#D9D9DE'; ctx.fill();
  ctx.save(); rrect(ctx, -290, -120, 200, 240, 18); ctx.clip(); face(ctx, -190, 30, 0.6, C.dim); ctx.restore();
  for (let i = 0; i < 4; i++) { ctx.fillStyle = i === 0 ? C.ink : '#B8B8BE'; ctx.fillRect(-50, -90 + i * 55, i === 0 ? 300 : 260 - i * 40, 24); }
  ctx.restore();
  check(ctx, 820, 860, 1.1, prog(t, 12.52, 12.9), C.red);
  chip(ctx, 'CRÉATEURS', 90, 1090, t, 13.4, C.red);
  chip(ctx, 'PERSONNALITÉS PUBLIQUES', 400, 1090, t, 14.0, C.white);
  ctx.restore();
}

// ------------------------------------------------------------------ S5 alert when a video seems to use their face, report it (15.1 - 19.2)
function sMatch(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 15.1, 15.4));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'ALERTE', 90, 340, 160, C.red, t, 15.14);
  // original face vs AI video face, linked by match lines
  const k1 = sp(t, 15.2, SPRING.bouncy), k2 = sp(t, 15.92, SPRING.bouncy);
  ctx.save(); ctx.translate(270, 660); ctx.scale(k1, k1);
  rrect(ctx, -170, -190, 340, 380, 34); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
  ctx.save(); rrect(ctx, -170, -190, 340, 380, 34); ctx.clip(); face(ctx, 0, 20, 0.9, C.white); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.translate(810, 660); ctx.scale(k2, k2);
  rrect(ctx, -170, -190, 340, 380, 34); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
  ctx.save(); rrect(ctx, -170, -190, 340, 380, 34); ctx.clip(); face(ctx, 0, 20, 0.9, C.grey); ctx.restore();
  ctx.restore();
  chip(ctx, 'VIDÉO IA', 690, 440, t, 16.0, C.red);
  // match lines draw between the two faces
  const lp = E.outCubic(prog(t, 16.54, 17.24));
  if (lp > 0) {
    ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 6; ctx.setLineDash([18, 14]);
    for (const yy of [-80, -40, 0]) { ctx.beginPath(); ctx.moveTo(380, 640 + yy); ctx.lineTo(380 + 320 * lp, 640 + yy); ctx.stroke(); }
    ctx.restore();
  }
  brackets(ctx, 810, 660, 380, 420, C.red, sp(t, 17.24, SPRING.bouncy));
  ctx.save(); shakeAt(ctx, t, 17.24, 12);
  slam(ctx, 'MÊME VISAGE', W / 2, 1000, 110, C.white, t, 17.24);
  ctx.restore();
  // report button pressed
  const bk = sp(t, 17.7, SPRING.bouncy);
  if (bk > 0.001) {
    const press = t >= 18.36 ? 1 - 0.08 * Math.exp(-(t - 18.36) * 8) : 1;
    ctx.save(); ctx.translate(W / 2, 1160); ctx.scale(bk * press, bk * press);
    rrect(ctx, -240, -56, 480, 104, 52); ctx.fillStyle = t >= 18.36 ? C.red : C.card; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = C.red; ctx.stroke();
    text(ctx, 'SIGNALER', 0, 18, font(56, 800, UI), C.white, 'center');
    ctx.restore();
  }
  ctx.restore();
}

// ------------------------------------------------------------------ S6 goal: European elections 2027, incl. France (19.2 - 23.52)
function sVote(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 19.2, 19.5));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'OBJECTIF', 90, 340, 150, C.white, t, 19.24);
  popWord(ctx, 'LES ÉLECTIONS EUROPÉENNES', 90, 430, 62, C.grey, t, 20.38, 'left', UI, 800);
  // ballot box with a ballot dropping in
  const bk = sp(t, 19.6, SPRING.gentle);
  ctx.save(); ctx.translate(320, 830); ctx.scale(0.8 + 0.2 * bk, 0.8 + 0.2 * bk);
  const dp = E.inCubic(prog(t, 19.9, 20.46));
  if (t < 20.6) {
    ctx.save(); ctx.translate(0, -300 + dp * 230);
    rrect(ctx, -90, -60, 180, 120, 10); ctx.fillStyle = C.white; ctx.fill();
    ctx.strokeStyle = C.red; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-5, 25); ctx.lineTo(40, -25); ctx.stroke();
    ctx.restore();
  }
  rrect(ctx, -200, -80, 400, 300, 26); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.grey; ctx.stroke();
  rrect(ctx, -110, -90, 220, 24, 12); ctx.fillStyle = C.ink; ctx.fill();
  text(ctx, 'VOTE', 0, 110, font(90, 400, D), C.grey, 'center');
  ctx.restore();
  ctx.save(); shakeAt(ctx, t, 21.46, 16);
  slam(ctx, '2027', 790, 860, 230, C.red, t, 21.46);
  ctx.restore();
  chip(ctx, 'DONT LA FRANCE', W / 2, 1180, t, 22.74, C.white, 'center');
  ctx.restore();
  source(ctx, 'AFP, 20/11/2026', t, 20.0);
}

// ------------------------------------------------------------------ S7 caveat: eligible accounts only, gradual rollout (23.52 - 26.96)
function sNuance(ctx, t) {
  bg(ctx, t, 0);
  slam(ctx, 'NUANCE', W / 2, 380, 180, C.white, t, 23.4);
  lock(ctx, 290, 760, 1.2 * sp(t, 23.85, SPRING.bouncy), C.red);
  popWord(ctx, 'COMPTES', 290, 1050, 84, C.white, t, 24.6, 'center');
  popWord(ctx, 'ÉLIGIBLES', 290, 1130, 64, C.grey, t, 25.1, 'center');
  // rollout progress bar
  const pk = sp(t, 25.6, SPRING.gentle);
  if (pk > 0.001) {
    ctx.save(); ctx.translate(790, 760); ctx.globalAlpha = clamp(pk * 2);
    rrect(ctx, -190, -40, 380, 80, 40); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
    const p = 0.08 + 0.32 * E.outCubic(prog(t, 25.94, 26.9));
    rrect(ctx, -180, -30, 360 * p, 60, 30); ctx.fillStyle = C.red; ctx.fill();
    ctx.restore();
    popWord(ctx, 'DÉPLOIEMENT', 790, 1050, 84, C.red, t, 25.94, 'center');
    popWord(ctx, 'PROGRESSIF', 790, 1130, 64, C.grey, t, 26.44, 'center');
  }
}

// ------------------------------------------------------------------ S8 advice: TikTok form, for everyone, even without an account (26.96 - 33.22)
function sAdvice(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 26.96, 27.26));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'LE CONSEIL', 90, 340, 150, C.red, t, 26.75);
  chip(ctx, 'POUR TOUT LE MONDE', 90, 430, t, 28.36, C.white);
  // form card
  const fk = sp(t, 27.4, SPRING.gentle);
  ctx.save(); ctx.translate(W / 2, 780); ctx.scale(0.85 + 0.15 * fk, 0.85 + 0.15 * fk); ctx.globalAlpha = clamp(fk * 2);
  rrect(ctx, -430, -230, 860, 460, 36); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
  text(ctx, 'FORMULAIRE TIKTOK', -380, -160, font(34, 800, UI), C.grey);
  const fields = ['Signaler un deepfake', 'Lien de la vidéo', 'Ton e-mail'];
  for (let i = 0; i < 3; i++) {
    rrect(ctx, -380, -120 + i * 110, 760, 84, 18); ctx.fillStyle = C.ink; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = i === 0 && t >= 31.22 ? C.red : C.edge; ctx.stroke();
    const p = prog(t, 29.5 + i * 0.6, 30.4 + i * 0.6 + (i === 0 ? 0.8 : 0));
    const s = fields[i];
    text(ctx, s.slice(0, Math.floor(s.length * p)), -350, -66 + i * 110, font(40, i === 0 ? 800 : 600, UI), i === 0 ? C.white : C.grey);
  }
  ctx.restore();
  stamp(ctx, 'MÊME SANS COMPTE', W / 2, 1160, 760, 110, t, 32.02, -0.05, C.red);
  ctx.restore();
  source(ctx, 'Formulaire de signalement vie privée de TikTok', t, 29.6);
}

// ------------------------------------------------------------------ S9 question + end card (33.22 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 0);
  const up = E.inOutCubic(prog(t, 34.6, 34.95));
  ctx.save(); ctx.translate(0, -up * 1400);
  slam(ctx, 'ET TOI ?', W / 2, 480, 220, C.white, t, 33.22);
  face(ctx, W / 2, 760, 0.9 * sp(t, 33.4, SPRING.bouncy), C.red);
  popWord(ctx, 'DÉJÀ CONFRONTÉ ?', W / 2, 1120, 110, C.grey, t, 33.96, 'center');
  ctx.restore();
  if (t >= 34.62) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 34.7, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 34.9, 'center');
    const k = sp(t, 35.1, SPRING.bouncy);
    ctx.save(); ctx.translate(W / 2, 1010); ctx.scale(k, k);
    rrect(ctx, -280, -66, 560, 124, 62); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, 'Abonne-toi', 0, 18, font(60, 800, UI), C.white, 'center');
    ctx.restore();
    popWord(ctx, 'Réponds en commentaire', W / 2, 1180, 44, C.grey, t, 35.4, 'center', UI, 600);
    ctx.restore();
  }
}

M.film({
  fonts: [font(100, 400, D), font(40, 400, UI), font(40, 600, UI), font(40, 800, UI)],
  hits: HITS,
  draw(ctx, u, t) {
    if (t < 3.78) sHook(ctx, t);
    else if (t < 6.86) sWarn(ctx, t);
    else if (t < 11.44) sWorld(ctx, t);
    else if (t < 15.1) sId(ctx, t);
    else if (t < 19.2) sMatch(ctx, t);
    else if (t < 23.52) sVote(ctx, t);
    else if (t < 26.96) sNuance(ctx, t);
    else if (t < 33.22) sAdvice(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
