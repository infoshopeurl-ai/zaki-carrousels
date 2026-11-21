// Muse, l'agent IA de Meta : ratés de vie privée (Reuters, 18/11/2026) : pure function of time.
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
  [B(1.78), 'une ia', 'thud'],
  [B(2.4), 'cut count', 'whoosh', { len: 0.4 }],
  [B(2.5), 'counter', 'type', { len: 0.45 }],
  [B(3.0), 'millions', 'impact'],
  [B(4.38), 'muse', 'pop', { pitch: 'E5' }],
  [B(5.8), 'meta', 'pop', { pitch: 'C6' }],
  [B(6.9), 'usa', 'blip', { pitch: 'A5' }],
  [B(8.3), 'cut apps', 'whoosh', { len: 0.4 }],
  [B(9.0), 'click1', 'click'],
  [B(9.5), 'click2', 'click'],
  [B(10.0), 'click3', 'click'],
  [B(10.8), 'cut probleme', 'whoosh', { len: 0.4 }],
  [B(10.92), 'probleme', 'impact'],
  [B(11.94), 'reuters', 'thud'],
  [B(13.18), 'messages', 'type', { len: 0.9 }],
  [B(14.4), 'cut bank', 'whoosh', { len: 0.4 }],
  [B(15.26), 'soldes', 'pop', { pitch: 'E5' }],
  [B(15.94), 'jamais', 'thud', { pitch: 'C3' }],
  [B(16.8), 'cut airbnb', 'whoosh', { len: 0.4 }],
  [B(17.44), 'airbnb', 'pop', { pitch: 'C5' }],
  [B(18.66), 'sans accord', 'impact'],
  [B(19.5), 'cut chats', 'whoosh', { len: 0.4 }],
  [B(20.1), 'melange', 'blip', { pitch: 'A5' }],
  [B(20.76), 'comptes', 'thud'],
  [B(21.45), 'cut meta', 'whoosh', { len: 0.4 }],
  [B(22.62), 'isoles', 'impact'],
  [B(24.26), 'hallu', 'pop', { pitch: 'C5' }],
  [B(25.02), 'corrigees', 'pop', { pitch: 'E5' }],
  [B(26.08), 'tests', 'pop', { pitch: 'G5' }],
  [B(27.05), 'cut nuance', 'whoosh', { len: 0.4 }],
  [B(27.18), 'nuance', 'thud', { pitch: 'C3' }],
  [B(28.42), 'prouve', 'click'],
  [B(29.5), 'cut conseil', 'whoosh', { len: 0.4 }],
  [B(31.32), 'off1', 'click'],
  [B(32.0), 'off2', 'click'],
  [B(32.56), 'off3', 'click'],
  [B(33.42), 'lock', 'bell', { pitch: 'C6' }],
  [B(33.95), 'cut question', 'whoosh', { len: 0.4 }],
  [B(35.2), 'limite', 'impact'],
  [B(35.85), 'end card', 'impact'],
  [B(36.3), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ['Tu confierais ton ordinateur', 0.1], ['à une IA ?', 1.52],
  ['Plus de 10 millions de personnes', 2.5], ['ont téléchargé Muse,', 3.7], ["l'agent IA de Meta,", 5.08],
  ['lancé en septembre', 6.5], ['aux États-Unis.', 7.42],
  ['Il peut utiliser tes applications', 8.52], ['à ta place.', 9.8],
  ['Problème :', 10.92], ['selon Reuters,', 11.74], ['qui a lu plus de 20 messages internes,', 12.64],
  ['Muse a affiché des soldes bancaires', 14.5], ['jamais partagés,', 15.94],
  ['réservé un Airbnb non remboursable', 16.94], ['sans accord,', 18.66],
  ['et mélangé des conversations', 19.18], ['entre comptes.', 20.48],
  ["Meta parle d'« incidents isolés »,", 21.58], ['souvent des hallucinations', 23.8], ['déjà corrigées,', 24.78], ['sur des versions de test.', 25.78],
  ['Nuance :', 27.18], ['rien ne prouve', 28.02], ['que ces données étaient vraies.', 28.66],
  ['Le conseil :', 29.62], ['vérifie régulièrement', 30.82], ['les autorisations', 31.84], ['données à tes applis IA.', 32.56],
  ['Et toi,', 34.08], ['où mets-tu la limite ?', 34.8],
  ["Abonne-toi pour l'actu IA", 35.9], ['de chaque jour.', 37.04],
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
// an AI "chip" head: square with pins and two eyes
function aiChip(ctx, x, y, s, t, color = C.red) {
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
  text(ctx, 'IA', 0, 68, font(40, 400, D), C.white, 'center');
  ctx.restore();
}
function tie(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(16, 0); ctx.lineTo(10, 18); ctx.lineTo(-10, 18); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-10, 18); ctx.lineTo(10, 18); ctx.lineTo(20, 90); ctx.lineTo(0, 112); ctx.lineTo(-20, 90); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function shield(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, -90); ctx.lineTo(80, -60); ctx.quadraticCurveTo(80, 50, 0, 100); ctx.quadraticCurveTo(-80, 50, -80, -60); ctx.closePath();
  ctx.fillStyle = color; ctx.fill();
  ctx.strokeStyle = C.ink; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-32, 4); ctx.lineTo(-6, 30); ctx.lineTo(38, -22); ctx.stroke();
  ctx.restore();
}
function check(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-4, 16); ctx.lineTo(24, -16); ctx.stroke();
  ctx.restore();
}
function magnifier(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 14; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, 0, 60, 0, M.TAU); ctx.stroke();
  ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(44, 44); ctx.lineTo(100, 100); ctx.stroke();
  ctx.restore();
}

function laptop(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -320, -230, 640, 410, 26); ctx.fillStyle = '#1E1E24'; ctx.fill();
  rrect(ctx, -290, -200, 580, 350, 12); ctx.fillStyle = '#0C0C10'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-380, 190); ctx.lineTo(380, 190); ctx.lineTo(330, 236); ctx.lineTo(-330, 236); ctx.closePath();
  ctx.fillStyle = '#2A2A31'; ctx.fill();
  ctx.restore();
}
function cursor(ctx, x, y, s, color = C.white) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 64); ctx.lineTo(16, 50); ctx.lineTo(28, 76); ctx.lineTo(40, 70); ctx.lineTo(28, 45); ctx.lineTo(48, 44); ctx.closePath();
  ctx.fillStyle = color; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.restore();
}
function smiley(ctx, x, y, r, t) {
  ctx.save(); ctx.translate(x, y);
  rrect(ctx, -r, -r, 2 * r, 2 * r, r * 0.42); ctx.fillStyle = C.red; ctx.fill();
  const blink = (t % 2.7) < 0.12 ? 0.15 : 1;
  ctx.fillStyle = C.white;
  for (const ex of [-r * 0.36, r * 0.36]) { ctx.save(); ctx.translate(ex, -r * 0.18); ctx.scale(1, blink); ctx.beginPath(); ctx.ellipse(0, 0, r * 0.11, r * 0.17, 0, 0, M.TAU); ctx.fill(); ctx.restore(); }
  ctx.strokeStyle = C.white; ctx.lineWidth = r * 0.1; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, r * 0.08, r * 0.42, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
  ctx.restore();
}
function appIcon(ctx, x, y, size, label, active, k = 1) {
  if (k <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  rrect(ctx, -size / 2, -size / 2, size, size, size * 0.24); ctx.fillStyle = active ? C.red : C.card; ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = active ? C.red : C.edge; ctx.stroke();
  text(ctx, label[0], 0, size * 0.2, font(size * 0.55, 400, D), active ? C.white : C.grey, 'center');
  text(ctx, label, 0, size / 2 + 44, font(30, 800, UI), active ? C.white : C.grey, 'center');
  ctx.restore();
}
function house(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(0, -90); ctx.lineTo(100, 0); ctx.lineTo(-100, 0); ctx.closePath(); ctx.fill();
  ctx.fillRect(-72, -4, 144, 100);
  ctx.fillStyle = C.ink; rrect(ctx, -20, 30, 40, 66, 6); ctx.fill();
  ctx.restore();
}
function padlock(ctx, x, y, s, color, open = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 18; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-40, -10); ctx.lineTo(-40, -50 - open * 20); ctx.arc(0, -50 - open * 20, 40, Math.PI, 0); ctx.lineTo(40, -10 - open * 40); ctx.stroke();
  rrect(ctx, -66, -14, 132, 110, 18); ctx.fillStyle = color; ctx.fill();
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(0, 30, 13, 0, M.TAU); ctx.fill(); ctx.fillRect(-5, 30, 10, 34);
  ctx.restore();
}
function toggle(ctx, x, y, on) {
  rrect(ctx, x - 56, y - 30, 112, 60, 30); ctx.fillStyle = lerp(0, 1, on) > 0.5 ? C.red : '#2A2A31'; ctx.fill();
  ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(lerp(x - 26, x + 26, on), y, 22, 0, M.TAU); ctx.fill();
}
function bubble(ctx, x, y, w, h, color, left = true) {
  rrect(ctx, x, y, w, h, 22); ctx.fillStyle = color; ctx.fill();
  ctx.beginPath();
  if (left) { ctx.moveTo(x + 10, y + h - 24); ctx.lineTo(x - 14, y + h + 6); ctx.lineTo(x + 34, y + h - 4); }
  else { ctx.moveTo(x + w - 10, y + h - 24); ctx.lineTo(x + w + 14, y + h + 6); ctx.lineTo(x + w - 34, y + h - 4); }
  ctx.closePath(); ctx.fill();
}
function lines(ctx, x, y, n, w, color = '#2E2E35', gap = 34) {
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) { rrect(ctx, x, y + i * gap, w - (i % 2) * w * 0.3, 16, 8); ctx.fill(); }
}

// ------------------------------------------------------------------ S1 hook: would you hand your computer to an AI? (0 - 2.4)
function sHook(ctx, t) {
  bg(ctx, t, 0);
  ctx.save();
  shakeAt(ctx, t, 1.78, 18);
  popWord(ctx, 'TU CONFIERAIS TON', 90, 360, 118, C.white, t, -0.3);
  popWord(ctx, 'ORDINATEUR', 90, 478, 130, C.red, t, -0.22);
  laptop(ctx, W / 2, 800, 1);
  aiChip(ctx, W / 2, 770, 0.95 + 0.03 * Math.sin(t * 4), t);
  // the AI reaches for the keyboard: a cursor sweeps over the screen
  const cx = W / 2 + 200 * Math.cos(t * 2.4), cy = 700 + 90 * Math.sin(t * 3.1);
  cursor(ctx, cx, cy, 1.1);
  slam(ctx, 'À UNE IA ?', W / 2, 1180, 180, C.red, t, 1.6);
  ctx.restore();
}

// ------------------------------------------------------------------ S2 10 million downloads, Muse by Meta, launched in Sept in the US (2.4 - 8.4)
function sCount(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 2.4, 2.7));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  // falling download arrows behind the counter
  for (let i = 0; i < 14; i++) {
    const t0 = 2.6 + i * 0.09;
    if (t < t0) continue;
    const x = 120 + hash01(i, 4) * (W - 240), y = 260 + ((t - t0) * 420 + hash01(i, 7) * 500) % 900;
    ctx.save(); ctx.globalAlpha = 0.22; ctx.strokeStyle = C.red; ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y - 40); ctx.lineTo(x, y); ctx.moveTo(x - 18, y - 18); ctx.lineTo(x, y); ctx.lineTo(x + 18, y - 18); ctx.stroke();
    ctx.restore();
  }
  popWord(ctx, 'PLUS DE', 90, 330, 80, C.grey, t, 2.5);
  const v = Math.round(10 * E.outCubic(prog(t, 2.5, 2.95)));
  if (t >= 2.45) {
    ctx.save(); shakeAt(ctx, t, 3.0, 12);
    text(ctx, String(v), 410, 620, font(320, 400, D), C.red, 'right');
    popWord(ctx, 'MILLIONS', 450, 520, 130, C.white, t, 2.95);
    popWord(ctx, 'DE TÉLÉCHARGEMENTS', 450, 610, 62, C.grey, t, 3.9);
    ctx.restore();
  }
  const mk = sp(t, 4.38, SPRING.bouncy);
  if (mk > 0.001) {
    ctx.save(); ctx.translate(230, 850); ctx.scale(mk, mk);
    smiley(ctx, 0, 0, 110, t);
    ctx.restore();
  }
  popWord(ctx, 'MUSE', 390, 870, 170, C.white, t, 4.45);
  chip(ctx, 'AGENT IA DE META', 396, 940, t, 5.8, C.red);
  chip(ctx, 'SEPTEMBRE 2026', 90, 1130, t, 6.6, C.white);
  chip(ctx, 'ÉTATS-UNIS', 560, 1130, t, 7.5, C.white);
  ctx.restore();
  source(ctx, 'Reuters, 18/11/2026', t, 3.2);
}

// ------------------------------------------------------------------ S3 it uses your apps for you (8.4 - 10.8)
const APPS = [['MAIL', 250, 700], ['BANQUE', 540, 700], ['AGENDA', 830, 700], ['PHOTOS', 250, 990], ['MESSAGES', 540, 990], ['FICHIERS', 830, 990]];
const CLICKS = [[1, 9.0], [4, 9.5], [5, 10.0]];
function sApps(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 8.4, 8.7));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'IL UTILISE', 90, 360, 130, C.white, t, 8.45);
  popWord(ctx, 'TES APPLIS À TA PLACE', 90, 470, 92, C.red, t, 9.2);
  APPS.forEach(([l, x, y], i) => {
    const k = sp(t, 8.5 + i * 0.07, SPRING.bouncy);
    const c = CLICKS.find((q) => q[0] === i);
    const on = c && t >= c[1];
    const pk = on ? 1 + 0.12 * wobble(t - c[1], 3, 7) : 1;
    appIcon(ctx, x, y, 180, l, on, k * pk);
  });
  // cursor path: start bottom right, hop between clicked apps
  const pts = [[980, 1200, 8.6], ...CLICKS.map(([i, tc]) => [APPS[i][1] + 20, APPS[i][2] + 10, tc])];
  let px = pts[0][0], py = pts[0][1];
  for (let j = 1; j < pts.length; j++) {
    const p = E.inOutCubic(prog(t, pts[j][2] - 0.4, pts[j][2]));
    if (p > 0) { px = lerp(pts[j - 1][0], pts[j][0], p); py = lerp(pts[j - 1][1], pts[j][1], p); }
  }
  if (t >= 8.6) {
    cursor(ctx, px, py, 1.3);
    rrect(ctx, px + 60, py + 70, 150, 50, 25); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, 'MUSE', px + 135, py + 106, font(40, 400, D), C.white, 'center');
  }
  ctx.restore();
}

// ------------------------------------------------------------------ S4 problem: Reuters read 20+ internal messages (10.8 - 14.4)
function sProblem(ctx, t) {
  bg(ctx, t, 1);
  ctx.save(); shakeAt(ctx, t, 10.92, 18);
  slam(ctx, 'PROBLÈME', W / 2, 430, 220, C.red, t, 10.92);
  chip(ctx, 'ENQUÊTE REUTERS', W / 2, 560, t, 11.94, C.white, 'center');
  for (let i = 0; i < 5; i++) {
    const t0 = 11.95 + i * 0.25;
    const k = sp(t, t0, SPRING.snappy);
    if (k <= 0.001) continue;
    const y = 660 + i * 106;
    ctx.save(); ctx.globalAlpha = clamp(k * 2); ctx.translate((1 - k) * 200, 0);
    rrect(ctx, 120, y, W - 240, 88, 18); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
    ctx.fillStyle = i % 2 ? C.grey : C.red; ctx.beginPath(); ctx.arc(176, y + 44, 26, 0, M.TAU); ctx.fill();
    text(ctx, 'MESSAGE INTERNE', 226, y + 40, font(28, 800, UI), C.white);
    rrect(ctx, 226, y + 54, 300 + 120 * hash01(i, 2), 14, 7); ctx.fillStyle = '#2E2E35'; ctx.fill();
    ctx.restore();
  }
  stamp(ctx, 'PLUS DE 20', W / 2 + 170, 960, 460, 110, t, 13.18, 0.08, C.red);
  ctx.restore();
}

// ------------------------------------------------------------------ S5 bank balances never shared (14.4 - 16.8)
function sBank(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 14.4, 14.7));
  ctx.save(); ctx.translate((1 - enter) * W * 0.6, 0);
  popWord(ctx, 'SOLDES', 90, 360, 130, C.white, t, 14.5);
  popWord(ctx, 'BANCAIRES', 90, 480, 130, C.red, t, 15.26);
  const ck = sp(t, 14.7, SPRING.gentle);
  if (ck > 0.001) {
    ctx.save(); ctx.translate(W / 2, 750); ctx.rotate(-0.04); ctx.scale(0.9 + 0.1 * ck, 0.9 + 0.1 * ck); ctx.globalAlpha = clamp(ck * 2);
    rrect(ctx, -360, -200, 720, 420, 34); ctx.fillStyle = '#1E1E24'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
    rrect(ctx, -300, -140, 100, 76, 14); ctx.fillStyle = C.grey; ctx.fill();
    text(ctx, 'SOLDE', -300, 20, font(40, 800, UI), C.grey);
    const v = 2722.58 * E.outCubic(prog(t, 15.0, 15.9));
    const s = Math.floor(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ',' + String(Math.round((v % 1) * 100)).padStart(2, '0') + ' $';
    if (t >= 15.0) text(ctx, s, -300, 150, font(140, 400, D), C.white);
    ctx.restore();
  }
  stamp(ctx, 'JAMAIS PARTAGÉ', W / 2, 1150, 700, 104, t, 15.94, -0.06, C.red);
  ctx.restore();
  source(ctx, 'Exemple cité par Reuters, 18/11/2026', t, 15.2);
}

// ------------------------------------------------------------------ S6 non-refundable Airbnb booked without consent (16.8 - 19.5)
function sAirbnb(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 16.8, 17.1));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'UN AIRBNB', 90, 360, 140, C.white, t, 16.9);
  popWord(ctx, 'NON REMBOURSABLE', 90, 470, 96, C.red, t, 17.8);
  const ck = sp(t, 17.3, SPRING.gentle);
  if (ck > 0.001) {
    ctx.save(); ctx.translate(W / 2, 800); ctx.scale(0.9 + 0.1 * ck, 0.9 + 0.1 * ck); ctx.rotate(0.03); ctx.globalAlpha = clamp(ck * 2);
    rrect(ctx, -360, -220, 720, 420, 26); ctx.fillStyle = C.white; ctx.fill();
    house(ctx, -210, 0, 1.1, C.red);
    text(ctx, 'RÉSERVATION', -60, -100, font(62, 400, D), C.ink);
    ctx.save(); ctx.translate(-60, -60); lines(ctx, 0, 0, 3, 320, '#D6D6DC'); ctx.restore();
    const ok = t >= 17.9;
    rrect(ctx, -60, 80, 300, 70, 35); ctx.fillStyle = ok ? C.ink : '#D6D6DC'; ctx.fill();
    if (ok) text(ctx, 'PAYÉ', 90, 132, font(54, 400, D), C.white, 'center');
    ctx.restore();
  }
  stamp(ctx, 'SANS ACCORD', W / 2, 1110, 620, 110, t, 18.66, -0.07, C.red);
  ctx.restore();
}

// ------------------------------------------------------------------ S7 conversations mixed up between accounts (19.5 - 21.45)
function phone(ctx, x, y, label, t, t0, red) {
  const k = sp(t, t0, SPRING.bouncy);
  if (k <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  rrect(ctx, -170, -250, 340, 500, 40); ctx.fillStyle = '#1E1E24'; ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = red ? C.red : C.edge; ctx.stroke();
  rrect(ctx, -150, -230, 300, 460, 28); ctx.fillStyle = '#0C0C10'; ctx.fill();
  text(ctx, label, 0, -180, font(44, 400, D), C.grey, 'center');
  bubble(ctx, -130, -140, 190, 64, '#2A2A31', true);
  bubble(ctx, -60, -40, 190, 64, C.grey, false);
  ctx.restore();
}
function sChats(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 19.5, 19.8));
  ctx.save(); ctx.translate((1 - enter) * W * 0.6, 0);
  popWord(ctx, 'CONVERSATIONS', 90, 360, 128, C.white, t, 19.6);
  popWord(ctx, 'MÉLANGÉES', 90, 480, 128, C.red, t, 20.1);
  ctx.save(); shakeAt(ctx, t, 20.76, 14);
  phone(ctx, 290, 880, 'COMPTE A', t, 19.7, false);
  phone(ctx, 790, 880, 'COMPTE B', t, 19.85, t >= 20.76);
  // a bubble jumps from account A to account B
  const p = E.inOutCubic(prog(t, 20.1, 20.7));
  if (t >= 20.0) {
    const x = lerp(170, 680, p), y = 940 - Math.sin(p * Math.PI) * 260;
    ctx.save(); ctx.translate(x, y); ctx.rotate(0.15 * Math.sin(p * Math.PI));
    bubble(ctx, -10, -32, 200, 64, C.red, p < 0.5);
    text(ctx, 'PRIVÉ', 90, 16, font(44, 400, D), C.white, 'center');
    ctx.restore();
  }
  ctx.restore();
  ctx.restore();
}

// ------------------------------------------------------------------ S8 Meta: isolated incidents, hallucinations, fixed, test versions (21.45 - 27.05)
const DEF = [['HALLUCINATIONS', 24.26, 900], ['DÉJÀ CORRIGÉES', 25.02, 1010], ['VERSIONS DE TEST', 26.08, 1120]];
function sMeta(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 21.45, 21.75));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'LA RÉPONSE DE META', 90, 330, 84, C.grey, t, 21.58);
  const bk = sp(t, 21.7, SPRING.bouncy);
  if (bk > 0.001) {
    ctx.save(); ctx.translate(W / 2, 560); ctx.scale(bk, bk);
    bubble(ctx, -420, -170, 840, 320, C.card, true);
    ctx.lineWidth = 4; ctx.strokeStyle = C.edge; rrect(ctx, -420, -170, 840, 320, 22); ctx.stroke();
    ctx.restore();
  }
  slam(ctx, 'INCIDENTS', W / 2, 555, 170, C.white, t, 22.62);
  slam(ctx, 'ISOLÉS', W / 2, 700, 150, C.red, t, 22.9);
  DEF.forEach(([l, t0, y]) => {
    const k = sp(t, t0, SPRING.bouncy);
    if (k <= 0.001) return;
    ctx.save(); ctx.translate(140 + (1 - clamp(k)) * 40, y); ctx.globalAlpha = clamp(k * 2);
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(24, -28, 20, 0, M.TAU); ctx.fill();
    text(ctx, l, 70, 6, font(88, 400, D), C.white);
    ctx.restore();
  });
  ctx.restore();
  source(ctx, 'Daniel Roberts, porte-parole de Meta (Reuters, TechCrunch)', t, 22.0);
}

// ------------------------------------------------------------------ S9 caveat: nothing proves the data was real (27.05 - 29.5)
function sNuance(ctx, t) {
  bg(ctx, t, 0);
  slam(ctx, 'NUANCE', W / 2, 440, 190, C.white, t, 27.18);
  const gk = sp(t, 27.5, SPRING.snappy);
  if (gk > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(gk * 2);
    const sw = Math.sin((t - 27.5) * 5.2);
    const px = W / 2 + 260 * sw;
    rrect(ctx, 120, 590, W - 240, 130, 65); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
    text(ctx, 'VRAI', 270, 680, font(80, 400, D), sw < -0.3 ? C.white : C.dim, 'center');
    text(ctx, 'INVENTÉ', W - 270, 680, font(80, 400, D), sw > 0.3 ? C.white : C.dim, 'center');
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(px, 655, 44, 0, M.TAU); ctx.fill();
    text(ctx, '?', px, 682, font(76, 400, D), C.white, 'center');
    ctx.restore();
  }
  popWord(ctx, 'RIEN NE PROUVE', W / 2, 960, 120, C.white, t, 28.02, 'center');
  popWord(ctx, 'QUE C\'ÉTAIT VRAI', W / 2, 1090, 120, C.red, t, 28.9, 'center');
  source(ctx, "Reuters n'a pas pu vérifier si les soldes étaient réels", t, 27.8);
}

// ------------------------------------------------------------------ S10 advice: check the permissions given to your AI apps (29.5 - 33.95)
const PERMS = [['FICHIERS', 99], ['MESSAGES', 31.32], ['BANQUE', 32.0], ['POSITION', 32.56]];
function sAdvice(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 29.5, 29.8));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'LE CONSEIL', 90, 380, 150, C.red, t, 29.62);
  const pk = sp(t, 29.72, SPRING.gentle);
  if (pk > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(pk * 2); ctx.translate(0, (1 - pk) * 40);
    rrect(ctx, 120, 480, W - 240, 600, 30); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
    text(ctx, 'AUTORISATIONS DE L\'AGENT IA', 170, 560, font(36, 800, UI), C.grey);
    PERMS.forEach(([l, t0], i) => {
      const y = 660 + i * 112;
      const on = 1 - E.outCubic(prog(t, t0, t0 + 0.2));
      text(ctx, l, 170, y + 28, font(76, 400, D), on > 0.5 ? C.white : C.dim);
      toggle(ctx, W - 220, y, on);
      if (i < PERMS.length - 1) { ctx.fillStyle = C.edge; ctx.fillRect(170, y + 56, W - 340, 2); }
    });
    ctx.restore();
  }
  const lk = sp(t, 33.42, SPRING.bouncy);
  if (lk > 0.001) padlock(ctx, W - 190, 380, 0.9 * lk, C.white, 0);
  chip(ctx, 'VÉRIFIE TES AUTORISATIONS', W / 2, 1180, t, 30.85, C.white, 'center');
  ctx.restore();
}

// ------------------------------------------------------------------ S11 question + end card (33.95 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 0);
  const up = E.inOutCubic(prog(t, 35.7, 36.1));
  ctx.save(); ctx.translate(0, -up * 1400);
  popWord(ctx, 'ET TOI ?', W / 2, 460, 150, C.grey, t, 33.97, 'center');
  popWord(ctx, 'OÙ METS-TU', W / 2, 660, 170, C.white, t, 34.8, 'center');
  slam(ctx, 'LA LIMITE ?', W / 2, 850, 180, C.red, t, 35.2);
  popWord(ctx, 'Réponds en commentaire', W / 2, 990, 44, C.grey, t, 35.35, 'center', UI, 600);
  ctx.restore();
  if (t >= 35.72) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 35.85, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 36.05, 'center');
    const k = sp(t, 36.3, SPRING.bouncy);
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
    if (t < 2.4) sHook(ctx, t);
    else if (t < 8.4) sCount(ctx, t);
    else if (t < 10.8) sApps(ctx, t);
    else if (t < 14.4) sProblem(ctx, t);
    else if (t < 16.8) sBank(ctx, t);
    else if (t < 19.5) sAirbnb(ctx, t);
    else if (t < 21.45) sChats(ctx, t);
    else if (t < 27.05) sMeta(ctx, t);
    else if (t < 29.5) sNuance(ctx, t);
    else if (t < 33.95) sAdvice(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
