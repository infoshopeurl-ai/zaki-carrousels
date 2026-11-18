// L'IA nous fait bosser plus: pure function of time. window.seek(t) paints frame t.
// Scenes are timed in SECONDS on the voice-over (audio/vo/words.json, placed +0.1 s);
// HITS are converted to beats (120 bpm, 0.5 s per beat) so sfx land on the same frames.
import * as M from './lib/motion.js';

const { W, H, E, prog, lerp, clamp, spring, SPRING, wobble, font, text, fill, rrect, hash01 } = M;

const C = { ink: '#050506', red: '#FF1F3D', white: '#FFFFFF', grey: '#BEBEC4', dim: '#3A3A40', line: '#16080C' };
const D = 'Display', UI = 'UI';
const sp = (t, t0, cfg = SPRING.snappy) => (t < t0 ? 0 : spring(t - t0, cfg));
// Scene times below are written on the first voice take; TMAP re-times them onto the current
// take (Vincent) from the word alignment: pairs of [new seconds, old seconds].
const TMAP = [[0.0, 0.0], [0.1, 0.1], [0.62, 0.36], [0.88, 0.62], [1.0, 0.74], [1.16, 0.9], [1.44, 1.22], [1.62, 1.42], [1.82, 1.66], [2.38, 2.1], [2.52, 2.2], [2.86, 2.5], [3.32, 2.94], [3.4, 3.04], [3.56, 3.16], [3.68, 3.32], [3.9, 3.56], [4.26, 4.12], [4.7, 4.46], [4.92, 4.7], [5.18, 4.96], [5.84, 5.52], [5.96, 5.66], [6.2, 5.86], [6.32, 5.98], [6.6, 6.26], [6.78, 6.44], [6.92, 6.56], [7.34, 7.02], [7.8, 7.5], [7.96, 7.68], [8.28, 8.04], [8.46, 8.22], [8.78, 8.62], [9.04, 8.82], [9.38, 9.12], [9.84, 9.74], [10.0, 9.92], [10.22, 10.14], [10.36, 10.34], [10.48, 10.46], [10.76, 10.74], [10.94, 10.92], [11.2, 11.16], [11.7, 11.64], [11.92, 11.86], [12.4, 12.2], [13.12, 12.98], [14.06, 13.58], [14.3, 13.8], [14.42, 13.94], [14.64, 14.16], [14.74, 14.24], [15.0, 14.46], [15.3, 14.76], [15.4, 14.84], [15.62, 15.04], [15.74, 15.24], [16.12, 15.68], [16.54, 16.08], [16.62, 16.16], [16.92, 16.46], [17.46, 16.84], [17.74, 17.04], [18.88, 18.32], [19.46, 18.68], [19.68, 18.9], [20.1, 19.32], [20.2, 19.42], [20.32, 19.54], [20.58, 19.78], [20.9, 20.08], [21.34, 20.48], [21.58, 20.76], [21.96, 21.16], [22.1, 21.32], [22.4, 21.64], [22.6, 21.86], [23.02, 22.3], [23.36, 22.62], [23.58, 22.84], [23.8, 23.12], [24.18, 23.56], [24.5, 23.84], [24.76, 24.08], [24.92, 24.22], [25.04, 24.34], [25.22, 24.5], [25.6, 24.9], [26.16, 25.28], [26.48, 25.58], [26.96, 26.04], [27.04, 26.1], [27.08, 26.12], [27.2, 26.28], [27.38, 26.44], [27.7, 26.72], [27.86, 26.86], [27.94, 26.94], [28.3, 27.38], [28.9, 27.96], [29.0, 28.22], [29.28, 28.48], [29.38, 28.58], [29.66, 28.88], [30.18, 29.34], [30.48, 29.6], [30.6, 29.72], [30.76, 29.88], [30.98, 30.14], [31.3, 30.42], [31.54, 30.64], [31.98, 30.96], [32.08, 31.04], [32.36, 31.3], [32.48, 31.42], [32.68, 31.62], [33.18, 32.02], [33.32, 32.14], [33.76, 32.6], [34.14, 32.98], [34.24, 33.1], [34.42, 33.26], [34.76, 33.66], [34.94, 33.82], [35.08, 33.98], [35.34, 34.26], [35.66, 34.62], [35.82, 34.86], [36.04, 35.1], [36.48, 35.5], [36.66, 35.64], [36.84, 35.78], [37.22, 36.16], [37.4, 36.38], [37.52, 36.48], [37.66, 36.62], [37.86, 36.8], [38.02, 36.96], [38.2, 37.18], [38.6, 37.52], [38.7, 37.66], [38.8, 37.74], [38.84, 37.8], [39.16, 38.16], [39.52, 38.52], [39.78, 38.78], [39.98, 38.96], [40.14, 39.12], [40.26, 39.24], [40.48, 39.44], [40.74, 39.68], [40.88, 39.76], [41.06, 39.96], [41.34, 40.22], [51.34, 50.22]];
function interp(x, i, j) {
  if (x <= TMAP[0][i]) return TMAP[0][j] + (x - TMAP[0][i]);
  for (let k = 1; k < TMAP.length; k++) {
    if (x <= TMAP[k][i]) { const [p, q] = [TMAP[k - 1], TMAP[k]]; return p[j] + ((x - p[i]) / (q[i] - p[i])) * (q[j] - p[j]); }
  }
  const L = TMAP[TMAP.length - 1]; return L[j] + (x - L[i]);
}
const toOld = (t) => interp(t, 0, 1), toNew = (t) => interp(t, 1, 0);
const B = (s) => toNew(s) / 0.5; // old-take seconds -> beats on the new take

// ------------------------------------------------------------------ sound hits (beats)
const HITS = [
  [B(0.0), 'hook title', 'impact'],
  [B(0.9), 'gagner du temps', 'pop', { pitch: 'E5' }],
  [B(2.1), 'strike', 'whoosh', { len: 0.3, from: 2400, to: 600 }],
  [B(3.56), '+90 MIN slam', 'impact'],
  [B(4.7), 'par jour', 'click'],
  [B(5.4), 'cut dots', 'whoosh', { len: 0.4 }],
  [B(5.7), 'counter', 'type', { len: 1.6 }],
  [B(7.6), '6 mois', 'blip', { pitch: 'A5' }],
  [B(8.55), 'cut bars', 'whoosh', { len: 0.4 }],
  [B(10.2), 'bar IA lands', 'thud'],
  [B(12.4), 'bar sans lands', 'thud', { pitch: 'C3' }],
  [B(12.9), '+90 bracket', 'pop', { pitch: 'A5' }],
  [B(13.57), 'cut notifs', 'whoosh', { len: 0.4 }],
  [B(15.24), 'mails x2', 'impact'],
  [B(16.84), 'messages +145', 'thud'],
  [B(18.35), 'cut HBR', 'whoosh', { len: 0.4 }],
  [B(18.9), 'HBR typing', 'type', { len: 1.5 }],
  [B(21.3), '8 mois', 'blip', { pitch: 'E6' }],
  [B(23.84), 'pause dej invaded', 'thud'],
  [B(25.19), 'attention', 'thud', { pitch: 'C3' }],
  [B(26.0), 'un lien', 'thud', { pitch: 'G2' }],
  [B(26.72), 'stamp', 'impact'],
  [B(27.65), 'cut piege', 'whoosh', { len: 0.4 }],
  [B(29.6), 'task checked', 'bell', { pitch: 'A5' }],
  [B(30.64), 'new task 1', 'pop', { pitch: 'C5' }],
  [B(31.04), 'new task 2', 'pop', { pitch: 'A4' }],
  [B(32.0), 'cut conseil', 'whoosh', { len: 0.4 }],
  [B(34.62), 'lock', 'impact'],
  [B(35.5), 'et toi', 'thud'],
  [B(36.62), 'pill 1', 'blip', { pitch: 'E5' }],
  [B(37.66), 'pill 2', 'blip', { pitch: 'A5' }],
  [B(38.52), 'end card', 'impact'],
  [B(38.9), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ["L'IA devait te faire", 0.1], ['gagner du temps.', 0.9], ['En réalité,', 2.1], ["elle peut t'en coûter", 2.94],
  ['90 minutes par jour.', 3.56], ['Une étude a suivi', 5.52], ['plus de 9 000 salariés', 6.26], ['pendant 6 mois.', 7.5],
  ["Avec l'IA :", 8.62], ["jusqu'à 9 heures", 9.12], ['de travail par jour.', 10.34], ['Sans : 7 h 36.', 11.64],
  ["Après l'arrivée de l'IA,", 13.58], ['les mails ont doublé.', 14.76], ['Les messages :', 16.08], ['plus 145 %.', 16.84],
  ['Une étude publiée dans', 18.32], ['la Harvard Business Review', 19.54], ["l'a observé pendant 8 mois :", 20.48],
  ["l'IA se glisse partout,", 22.3], ['même dans la pause déjeuner.', 23.84], ['Attention,', 25.28], ["c'est un lien,", 26.04],
  ['pas une preuve.', 26.72], ['Mais le piège est connu :', 27.7], ['une tâche va plus vite,', 28.88],
  ['alors on en ajoute une autre.', 30.42], ['Le conseil :', 32.02], ["le temps gagné grâce à l'IA,", 32.98],
  ['garde-le.', 34.62], ['Et toi ?', 35.5], ["L'IA te fait gagner du temps", 36.16], ["ou elle t'en rajoute ?", 37.18],
  ["Abonne-toi pour l'actu IA", 38.52], ['de chaque jour.', 39.68],
];
const CAP_Y = 1385;
function captions(ctx, t) {
  let i = -1;
  for (let k = 0; k < CAP.length; k++) if (t >= CAP[k][1] - 0.04) i = k;
  if (i < 0) return;
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
  ctx.translate(0, 110); // the composition sits lower in the frame, above the app's bottom UI
}
// A word that springs up from below its baseline.
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

// ------------------------------------------------------------------ S1 hook: the clock (0 - 5.4)
function sClock(ctx, t) {
  bg(ctx, t, 0);
  ctx.save();
  shakeAt(ctx, t, 3.56, 26);
  const words1 = [["L'IA", 0.0], ['DEVAIT', 0.36], ['TE', 0.62], ['FAIRE', 0.74]];
  let x = 90;
  for (const [w, t0] of words1) x += popWord(ctx, w, x, 400, 132, C.white, t, t0 - 0.12) + 26;
  x = 90;
  const words2 = [['GAGNER', 0.9], ['DU', 1.22], ['TEMPS.', 1.42]];
  let xEnd = 90;
  for (const [w, t0] of words2) { const ww = popWord(ctx, w, x, 530, 132, C.red, t, t0 - 0.08); x += ww + 26; xEnd = x - 26; }
  const sp2 = E.outCubic(prog(t, 2.1, 2.45));
  if (sp2 > 0) { ctx.fillStyle = C.white; ctx.fillRect(84, 478, (xEnd - 84 + 12) * sp2, 12); }
  // the clock
  const k = 0.8 + 0.2 * sp(t, 0, SPRING.gentle);
  const hitK = prog(t, 3.56, 3.9);
  const cx = W / 2, cy = lerp(930, 860, E.outCubic(hitK)), R = 270 * lerp(1, 0.78, E.outCubic(hitK)) * k;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = C.white; ctx.lineWidth = 12;
  ctx.beginPath(); ctx.arc(0, 0, R, 0, M.TAU); ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * M.TAU;
    ctx.lineWidth = i % 3 ? 5 : 10;
    ctx.beginPath(); ctx.moveTo(Math.cos(a) * R * 0.82, Math.sin(a) * R * 0.82); ctx.lineTo(Math.cos(a) * R * 0.92, Math.sin(a) * R * 0.92); ctx.stroke();
  }
  const spin = t < 3.56 ? 0.6 * t * t : 0.6 * 3.56 * 3.56 + (t - 3.56) * 14;
  const mA = -Math.PI / 2 + spin, hA = -Math.PI / 2 + spin / 12;
  ctx.lineCap = 'round';
  ctx.strokeStyle = C.white; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(hA) * R * 0.5, Math.sin(hA) * R * 0.5); ctx.stroke();
  ctx.strokeStyle = C.red; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(mA) * R * 0.78, Math.sin(mA) * R * 0.78); ctx.stroke();
  ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, 16, 0, M.TAU); ctx.fill();
  if (t >= 3.56) {
    const cp = E.outExpo(prog(t, 3.56, 3.8));
    ctx.strokeStyle = C.white; ctx.lineWidth = 4;
    for (let c = 0; c < 4; c++) {
      ctx.beginPath();
      const px = R * (c < 2 ? -0.95 : 0.95), py = R * (c % 2 ? -0.3 : 0.25);
      ctx.moveTo(px, py);
      for (let s = 1; s <= 5; s++) {
        if (s / 5 > cp) break;
        ctx.lineTo(px * (1 - s / 5) + (hash01(c * 9 + s, 4) - 0.5) * 70, py * (1 - s / 5) + (hash01(c * 9 + s, 7) - 0.5) * 70);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
  slam(ctx, '+90 MIN', W / 2, 1180, 290, C.red, t, 3.56);
  popWord(ctx, 'PAR JOUR', W / 2, 1290, 96, C.white, t, 4.62, 'center');
  ctx.restore();
}

// ------------------------------------------------------------------ S2 9 140 people (5.4 - 8.55)
function sPeople(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 5.4, 5.75));
  ctx.save(); ctx.translate((1 - enter) * W * 0.6, 0);
  const tq = Math.floor(t * 15) / 15;
  const n = Math.round(9140 * E.inOutSine(prog(tq, 5.7, 7.35)));
  const str = n >= 1000 ? `${Math.floor(n / 1000)} ${String(n % 1000).padStart(3, '0')}` : String(n);
  text(ctx, str, W / 2, 470, font(300, 400, D), C.white, 'center');
  popWord(ctx, 'SALARIÉS SUIVIS', W / 2, 565, 84, C.red, t, 6.9, 'center');
  // 910 dots = about 1 dot per 10 people
  const cols = 35, rows = 26, gap = 23, x0 = (W - (cols - 1) * gap) / 2, y0 = 630;
  const shown = 910 * prog(t, 5.7, 7.35);
  for (let i = 0; i < cols * rows; i++) {
    const order = hash01(i, 11) * 910;
    const a = clamp((shown - order) / 40);
    if (a <= 0) continue;
    const cx = x0 + (i % cols) * gap, cy = y0 + Math.floor(i / cols) * gap;
    ctx.fillStyle = hash01(i, 3) < 0.5 ? C.red : C.white;
    ctx.globalAlpha = 0.35 + 0.65 * a;
    ctx.beginPath(); ctx.arc(cx, cy, 6.5 * a, 0, M.TAU); ctx.fill();
  }
  ctx.globalAlpha = 1;
  chip(ctx, 'PENDANT 6 MOIS', W / 2, 1245, t, 7.6, C.red, 'center');
  ctx.restore();
  source(ctx, 'Source : ActivTrak, 467 entreprises, avril-sept. 2026', t, 6.2);
}

// ------------------------------------------------------------------ S3 the bar race (8.55 - 13.5)
function sBars(ctx, t) {
  bg(ctx, t, 0);
  const base = 1180, perH = 76;
  const enter = E.outCubic(prog(t, 8.55, 8.85));
  ctx.save(); ctx.translate(0, (1 - enter) * 300); ctx.globalAlpha = enter;
  ctx.strokeStyle = C.dim; ctx.lineWidth = 2;
  for (let h = 0; h <= 10; h += 2) {
    const y = base - h * perH;
    ctx.beginPath(); ctx.moveTo(120, y); ctx.lineTo(W - 90, y); ctx.stroke();
    text(ctx, `${h} H`, 100, y + 10, font(28, 600, UI), C.grey, 'right');
  }
  const bars = [
    { x: 200, label: 'AVEC IA', hours: 9.1, col: C.red, t0: 8.8, t1: 10.2, top: "JUSQU'À 9 H" },
    { x: 600, label: 'SANS IA', hours: 7.6, col: C.grey, t0: 11.5, t1: 12.4, top: '7 H 36' },
  ];
  for (const b of bars) {
    const g = E.outCubic(prog(t, b.t0, b.t1)) + (t > b.t1 ? 0.012 * wobble(t - b.t1, 2.5, 6) : 0);
    const h = b.hours * perH * g;
    ctx.fillStyle = b.col;
    ctx.fillRect(b.x, base - h, 280, h);
    text(ctx, b.label, b.x + 140, base + 70, font(64, 400, D), C.white, 'center');
    if (t >= b.t1 - 0.1) popWord(ctx, b.top, b.x + 140, base - h - 26, 78, b.col === C.red ? C.red : C.white, t, b.t1 - 0.1, 'center');
  }
  const bk = E.outBack(prog(t, 12.9, 13.2), 1.6);
  if (bk > 0) {
    const yTop = base - 9.1 * perH, yLow = base - 7.6 * perH;
    ctx.strokeStyle = C.white; ctx.lineWidth = 6; ctx.setLineDash([14, 12]);
    ctx.beginPath(); ctx.moveTo(480, yTop); ctx.lineTo(880, yTop); ctx.stroke(); ctx.setLineDash([]);
    ctx.save(); ctx.translate(740, (yTop + yLow) / 2 + 10); ctx.scale(bk, bk);
    rrect(ctx, -110, -48, 220, 90, 20); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, '+90 MIN', 0, 26, font(70, 400, D), C.white, 'center');
    ctx.restore();
  }
  ctx.restore();
  source(ctx, 'Durée de la journée de travail (ActivTrak, 2026)', t, 9.0);
}

// ------------------------------------------------------------------ S4 notifications flood (13.5 - 18.35)
const NOTES = Array.from({ length: 34 }, (_, i) => {
  const r = (s) => hash01(i, s);
  const tt = 13.58 + 4.5 * Math.pow(i / 34, 0.75);
  return { t0: tt, x: 70 + r(1) * 560, y: 300 + r(2) * 900, w: 300 + r(3) * 130, rot: (r(4) - 0.5) * 0.18, mail: i % 2 === 0 || tt < 15.5 };
});
function bubble(ctx, n, t) {
  const k = sp(t, n.t0, SPRING.bouncy);
  if (k <= 0.001) return;
  ctx.save();
  ctx.translate(n.x + n.w / 2, n.y + 60); ctx.rotate(n.rot); ctx.scale(k, k);
  rrect(ctx, -n.w / 2, -60, n.w, 120, 26); ctx.fillStyle = '#1C1C21'; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = '#2C2C33'; ctx.stroke();
  const ix = -n.w / 2 + 30, iy = -26;
  ctx.fillStyle = n.mail ? C.white : C.red;
  if (n.mail) {
    rrect(ctx, ix, iy, 64, 48, 8); ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ix + 4, iy + 6); ctx.lineTo(ix + 32, iy + 28); ctx.lineTo(ix + 60, iy + 6); ctx.stroke();
  } else {
    rrect(ctx, ix, iy, 64, 46, 16); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ix + 12, iy + 40); ctx.lineTo(ix + 6, iy + 60); ctx.lineTo(ix + 30, iy + 44); ctx.fill();
    ctx.fillStyle = C.white; for (let d = 0; d < 3; d++) { ctx.beginPath(); ctx.arc(ix + 18 + d * 14, iy + 23, 5, 0, M.TAU); ctx.fill(); }
  }
  ctx.fillStyle = '#4A4A52'; rrect(ctx, ix + 90, -22, n.w * 0.45, 16, 8); ctx.fill();
  ctx.fillStyle = '#34343B'; rrect(ctx, ix + 90, 8, n.w * 0.3, 14, 7); ctx.fill();
  ctx.restore();
}
function sNotifs(ctx, t) {
  bg(ctx, t, 1);
  for (const n of NOTES) bubble(ctx, n, t);
  ctx.save();
  shakeAt(ctx, t, 15.24, 18);
  const plate = (y, h) => { ctx.fillStyle = 'rgba(5,5,6,0.88)'; ctx.fillRect(0, y, W, h); };
  if (t >= 15.15) {
    const out = t > 16.7 ? E.inCubic(prog(t, 16.7, 16.9)) : 0;
    ctx.save(); ctx.translate(-out * W, 0);
    plate(600, 300);
    slam(ctx, 'MAILS', W / 2 - 120, 850, 250, C.white, t, 15.24);
    slam(ctx, 'X2', W / 2 + 260, 850, 250, C.red, t, 15.4);
    ctx.restore();
  }
  if (t >= 16.75) {
    const inn = E.outCubic(prog(t, 16.75, 16.95));
    ctx.save(); ctx.translate((1 - inn) * W, 0);
    plate(520, 440);
    text(ctx, 'MESSAGES', W / 2, 670, font(130, 400, D), C.white, 'center');
    slam(ctx, '+145 %', W / 2, 910, 260, C.red, t, 16.84);
    ctx.restore();
  }
  ctx.restore();
  chip(ctx, "APRÈS L'ARRIVÉE DE L'IA", W / 2, 330, t, 13.57, C.white, 'center');
  source(ctx, 'Source : ActivTrak, 10 584 salariés, 180 jours avant / après', t, 14.2);
}

// ------------------------------------------------------------------ S5 HBR: AI everywhere (18.35 - 25.15)
const HOURS = ['8H', '9H', '10H', '11H', '12H', '13H', '14H', '15H', '16H', '17H', '18H', '19H'];
function sDay(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 18.35, 18.7));
  ctx.save(); ctx.translate(0, (1 - enter) * -300);
  const title = 'HARVARD BUSINESS REVIEW';
  const nChars = Math.floor(title.length * prog(t, 18.9, 20.4));
  const tf = font(112, 400, D);
  text(ctx, title.slice(0, nChars), 90, 380, tf, C.white);
  if (nChars < title.length && Math.floor(t * 4) % 2 === 0) { ctx.font = tf; ctx.fillStyle = C.red; ctx.fillRect(90 + ctx.measureText(title.slice(0, nChars)).width + 8, 290, 10, 92); }
  chip(ctx, "8 MOIS D'OBSERVATION", 90, 470, t, 21.3);
  const y0 = 540, rh = 62, xL = 220, xR = W - 90;
  HOURS.forEach((h, i) => {
    const ri = sp(t, 18.6 + i * 0.09, SPRING.snappy);
    if (ri <= 0.001) return;
    const y = y0 + i * rh + (1 - ri) * 60;
    const lunch = h === '12H';
    text(ctx, h, 186, y + 44, font(34, 600, UI), lunch ? C.white : C.grey, 'right');
    ctx.fillStyle = lunch ? '#24242A' : '#121216'; rrect(ctx, xL, y + 6, xR - xL, rh - 14, 10); ctx.fill();
    if (lunch) text(ctx, 'PAUSE DÉJ', xL + 24, y + 44, font(40, 400, D), C.grey);
    const t0 = lunch ? 23.84 : 22.3 + i * 0.1;
    const g = E.outCubic(prog(t, t0, t0 + (lunch ? 0.25 : 0.4)));
    if (g > 0) {
      const frac = lunch ? 1 : 0.35 + 0.55 * hash01(i, 21);
      const bx = lunch ? xL : xL + (xR - xL) * (1 - frac) * hash01(i, 5);
      ctx.fillStyle = C.red; rrect(ctx, bx, y + 6, (xR - xL) * frac * g, rh - 14, 10); ctx.fill();
      if (g > 0.6) text(ctx, lunch ? 'IA, MÊME LÀ' : 'IA', bx + 22, y + 44, font(40, 400, D), C.white);
    }
  });
  ctx.restore();
  source(ctx, 'Étude dans une entreprise tech américaine, environ 200 salariés', t, 21.4);
}

// ------------------------------------------------------------------ S6 caveat stamp (25.15 - 27.65)
function sCaveat(ctx, t) {
  bg(ctx, t, 1);
  slam(ctx, 'ATTENTION', W / 2, 560, 170, C.white, t, 25.19);
  popWord(ctx, "C'EST UN LIEN,", W / 2, 810, 180, C.white, t, 26.0, 'center');
  const p = prog(t, 26.72, 26.86);
  if (p > 0) {
    ctx.save();
    ctx.translate(W / 2, 1050); ctx.rotate(-0.07);
    const s = lerp(1.8, 1, E.outCubic(p)) + 0.04 * wobble(t - 26.86, 3, 7);
    ctx.scale(s, s);
    ctx.strokeStyle = C.red; ctx.lineWidth = 12;
    rrect(ctx, -420, -130, 840, 200, 18); ctx.stroke();
    text(ctx, 'PAS UNE PREUVE.', 0, 30, font(150, 400, D), C.red, 'center');
    ctx.restore();
  }
}

// ------------------------------------------------------------------ S7 the trap: a to-do list that refills (27.65 - 32.0)
function sTrap(ctx, t) {
  bg(ctx, t, 0);
  popWord(ctx, 'LE PIÈGE', 90, 400, 170, C.red, t, 27.75);
  const n1 = sp(t, 30.64, SPRING.snappy), n2 = sp(t, 31.04, SPRING.snappy);
  const rows = [
    { s: 'Répondre aux mails', t0: 28.3, done: 29.6, y: 560 + (n1 + n2) * 130 },
    { s: 'Résumer la réunion', t0: 28.42, y: 690 + (n1 + n2) * 130 },
    { s: 'Préparer le rapport', t0: 28.54, y: 820 + (n1 + n2) * 130 },
    { s: 'Nouvelle tâche', t0: 30.64, nw: true, y: 560 + n2 * 130 },
    { s: 'Encore une tâche', t0: 31.04, nw: true, y: 560 },
  ];
  for (const it of rows) {
    const k = sp(t, it.t0, SPRING.bouncy);
    if (k <= 0.001) continue;
    const y = it.y - (1 - k) * 140;
    ctx.save(); ctx.globalAlpha = clamp(k * 2);
    rrect(ctx, 90, y, W - 180, 104, 20); ctx.fillStyle = it.nw ? '#2A0A11' : '#16161A'; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = it.nw ? C.red : '#2C2C33'; ctx.stroke();
    rrect(ctx, 124, y + 28, 48, 48, 10); ctx.lineWidth = 5; ctx.strokeStyle = it.nw ? C.red : C.white; ctx.stroke();
    text(ctx, it.s, 200, y + 66, font(46, 600, UI), it.nw ? C.white : C.grey);
    if (it.done && t >= it.done) {
      const c = E.outCubic(prog(t, it.done, it.done + 0.2));
      ctx.strokeStyle = C.red; ctx.lineWidth = 8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(132, y + 52); ctx.lineTo(132 + 12 * Math.min(1, c * 2), y + 52 + 12 * Math.min(1, c * 2));
      if (c > 0.5) ctx.lineTo(144 + 26 * (c - 0.5) * 2, y + 64 - 34 * (c - 0.5) * 2);
      ctx.stroke();
      ctx.fillStyle = C.grey; ctx.fillRect(196, y + 50, 440 * c, 5);
    }
    ctx.restore();
  }
  popWord(ctx, '+ VITE = + DE TÂCHES', W / 2, 1300, 92, C.white, t, 31.2, 'center');
}

// ------------------------------------------------------------------ S8 advice: lock the time (32.0 - 35.45)
function sLock(ctx, t) {
  bg(ctx, t, 1);
  chip(ctx, 'LE CONSEIL', 90, 360, t, 32.1);
  popWord(ctx, 'LE TEMPS GAGNÉ', 90, 560, 150, C.white, t, 33.0);
  const cx = W / 2, cy = 960;
  const k = sp(t, 32.1, SPRING.gentle);
  const close = E.outBack(prog(t, 34.5, 34.68), 2);
  ctx.save(); shakeAt(ctx, t, 34.62, 14);
  ctx.translate(cx, cy); ctx.scale(k, k);
  ctx.strokeStyle = C.white; ctx.lineWidth = 26; ctx.lineCap = 'butt';
  const lift = (1 - close) * 90;
  ctx.beginPath(); ctx.moveTo(-110, -90 - lift * 0.2); ctx.lineTo(-110, -150 - lift); ctx.arc(0, -150 - lift, 110, Math.PI, 0); ctx.lineTo(110, -90 - lift); ctx.stroke();
  rrect(ctx, -190, -90, 380, 300, 34); ctx.fillStyle = C.red; ctx.fill();
  ctx.strokeStyle = C.white; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(0, 60, 90, 0, M.TAU); ctx.stroke();
  const a = -Math.PI / 2 + Math.min(t, 34.62) * 2.2;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, 60); ctx.lineTo(Math.cos(a) * 66, 60 + Math.sin(a) * 66); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 60); ctx.lineTo(0, 20); ctx.stroke();
  ctx.restore();
  slam(ctx, 'GARDE-LE.', W / 2, 1290, 190, C.red, t, 34.62);
}

// ------------------------------------------------------------------ S9 question + end card (35.45 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 0);
  const up = E.inOutCubic(prog(t, 38.4, 38.8));
  ctx.save(); ctx.translate(0, -up * 1400);
  slam(ctx, 'ET TOI ?', W / 2, 640, 300, C.white, t, 35.5);
  const pill = (str, y, t0, red) => {
    const k = sp(t, t0, SPRING.bouncy); if (k <= 0.001) return;
    ctx.save(); ctx.translate(W / 2, y); ctx.scale(k, k);
    rrect(ctx, -380, -70, 760, 120, 60);
    if (red) { ctx.fillStyle = C.red; ctx.fill(); } else { ctx.lineWidth = 6; ctx.strokeStyle = C.white; ctx.stroke(); }
    text(ctx, str, 0, 14, font(56, 800, UI), C.white, 'center');
    ctx.restore();
  };
  pill('Je gagne du temps', 860, 36.62, false);
  pill("J'ai plus de boulot", 1020, 37.66, true);
  popWord(ctx, 'Réponds en commentaire', W / 2, 1180, 40, C.grey, t, 37.9, 'center', UI, 600);
  ctx.restore();
  if (t >= 38.45) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 38.52, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 38.7, 'center');
    const k = sp(t, 38.9, SPRING.bouncy);
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
  draw(ctx, u, tn) {
    const t = toOld(tn);
    if (t < 5.4) sClock(ctx, t);
    else if (t < 8.55) sPeople(ctx, t);
    else if (t < 13.57) sBars(ctx, t);
    else if (t < 18.35) sNotifs(ctx, t);
    else if (t < 25.19) sDay(ctx, t);
    else if (t < 27.65) sCaveat(ctx, t);
    else if (t < 32.0) sTrap(ctx, t);
    else if (t < 35.45) sLock(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
