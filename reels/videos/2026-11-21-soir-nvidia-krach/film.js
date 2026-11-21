// Nvidia : pire semaine en Bourse depuis 2008, la SEC examine sa comptabilité (Reuters, 20/11/2026) : pure function of time.
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
  [B(1.78), 'degonfler', 'thud', { pitch: 'C3' }],
  [B(2.6), 'cut nvidia', 'whoosh', { len: 0.4 }],
  [B(2.68), 'nvidia', 'impact'],
  [B(3.96), 'puces', 'pop', { pitch: 'E5' }],
  [B(4.74), 'chatgpt', 'pop', { pitch: 'C6' }],
  [B(5.8), 'cut week', 'whoosh', { len: 0.4 }],
  [B(6.28), 'counter', 'type', { len: 0.5 }],
  [B(6.8), 'moins 23', 'impact'],
  [B(7.9), 'jour1', 'click'],
  [B(8.1), 'jour2', 'click'],
  [B(8.3), 'jour3', 'click'],
  [B(8.5), 'jour4', 'click'],
  [B(8.7), 'jour5', 'click'],
  [B(9.72), '2008', 'impact'],
  [B(10.8), 'cut vendredi', 'whoosh', { len: 0.4 }],
  [B(10.9), 'vendredi', 'thud'],
  [B(12.18), 'plonge', 'whoosh', { len: 0.5 }],
  [B(12.62), 'moins 14', 'impact'],
  [B(13.55), 'cut reuters', 'whoosh', { len: 0.4 }],
  [B(14.56), 'reuters', 'thud'],
  [B(15.58), 'gendarme', 'pop', { pitch: 'E5' }],
  [B(16.98), 'loupe', 'blip', { pitch: 'A5' }],
  [B(17.7), 'compta', 'impact'],
  [B(18.6), 'cut record', 'whoosh', { len: 0.4 }],
  [B(19.74), 'record', 'pop', { pitch: 'G5' }],
  [B(21.7), 'moitie', 'impact'],
  [B(23.05), 'cut nuance', 'whoosh', { len: 0.4 }],
  [B(23.16), 'nuance', 'thud', { pitch: 'C3' }],
  [B(25.1), 'fraude', 'click'],
  [B(25.8), 'cut conseil', 'whoosh', { len: 0.4 }],
  [B(26.9), 'jamais', 'thud'],
  [B(27.9), 'perdre', 'bell', { pitch: 'C6' }],
  [B(28.4), 'cut question', 'whoosh', { len: 0.4 }],
  [B(29.5), 'bulle', 'pop', { pitch: 'E5' }],
  [B(30.3), 'correction', 'impact'],
  [B(31.1), 'end card', 'impact'],
  [B(31.5), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ["Et si la bulle de l'IA", 0.1], ['commençait à se dégonfler ?', 1.22],
  ['Nvidia, le fabricant des puces', 2.68], ['qui font tourner ChatGPT,', 4.2],
  ['vient de perdre 23 % en Bourse', 5.86], ['en une seule semaine,', 7.64], ['sa pire depuis 2008.', 9.02],
  ['Vendredi,', 10.9], ["l'action a plongé de 14 %,", 11.72],
  ['après une info de Reuters :', 13.64], ['le gendarme de la Bourse américaine', 15.48], ['examine sa comptabilité.', 16.98],
  ['Depuis son record du 6 octobre,', 18.74], ['elle a perdu près de la moitié', 20.76], ['de sa valeur.', 22.08],
  ['Nuance :', 23.16], ['une enquête ne prouve aucune fraude.', 23.96],
  ['Le conseil :', 25.9], ['ne mise jamais ce que tu', 26.46], ['ne peux pas perdre.', 27.7],
  ['Et toi,', 28.55], ['bulle ou simple correction ?', 29.5],
  ["Abonne-toi pour l'actu IA", 31.16], ['de chaque jour.', 32.32],
];
const CAP_Y = 1385;
function captions(ctx, t) {
  let i = -1;
  for (let k = 0; k < CAP.length; k++) if (t >= CAP[k][1] - 0.04) i = k;
  if (i < 0 || t > 33.6) return;
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
function magnifier(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 14; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, 0, 60, 0, M.TAU); ctx.stroke();
  ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(44, 44); ctx.lineTo(100, 100); ctx.stroke();
  ctx.restore();
}


// a bubble (soap-film circle) that can deflate
function bubbleBall(ctx, x, y, r, t, color = C.red) {
  if (r <= 1) return;
  ctx.save(); ctx.translate(x, y);
  const wob = 1 + 0.025 * Math.sin(t * 5.3);
  ctx.scale(wob, 2 - wob);
  const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
  g.addColorStop(0, 'rgba(255,31,61,0.10)'); g.addColorStop(0.8, 'rgba(255,31,61,0.22)'); g.addColorStop(1, 'rgba(255,31,61,0.55)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, M.TAU); ctx.fill();
  ctx.lineWidth = 8; ctx.strokeStyle = color; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath(); ctx.ellipse(-r * 0.42, -r * 0.45, r * 0.16, r * 0.08, -0.7, 0, M.TAU); ctx.fill();
  ctx.restore();
}
// a GPU chip with pins
function gpu(ctx, x, y, s, t, label = 'NVIDIA') {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = C.grey;
  for (let i = 0; i < 6; i++) {
    const o = -125 + i * 50;
    ctx.fillRect(o - 7, -190, 14, 36); ctx.fillRect(o - 7, 154, 14, 36);
    ctx.fillRect(-190, o - 7, 36, 14); ctx.fillRect(154, o - 7, 36, 14);
  }
  rrect(ctx, -160, -160, 320, 320, 30); ctx.fillStyle = '#1E1E24'; ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = C.red; ctx.stroke();
  rrect(ctx, -110, -110, 220, 220, 18); ctx.fillStyle = C.red; ctx.fill();
  // circuit shimmer
  const sh = (t * 0.8) % 1;
  ctx.save(); ctx.beginPath(); rrect(ctx, -110, -110, 220, 220, 18); ctx.clip();
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath(); const sx = -260 + sh * 520; ctx.moveTo(sx, -120); ctx.lineTo(sx + 60, -120); ctx.lineTo(sx - 40, 120); ctx.lineTo(sx - 100, 120); ctx.closePath(); ctx.fill();
  ctx.restore();
  text(ctx, label, 0, 22, font(66, 400, D), C.white, 'center');
  ctx.restore();
}
function ledger(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -300, -240, 600, 480, 24); ctx.fillStyle = C.white; ctx.fill();
  text(ctx, 'COMPTES 2026', -250, -170, font(56, 400, D), C.ink);
  for (let i = 0; i < 6; i++) {
    const yy = -110 + i * 58;
    rrect(ctx, -250, yy, 260 - (i % 3) * 50, 18, 9); ctx.fillStyle = '#D6D6DC'; ctx.fill();
    rrect(ctx, 120, yy, 130, 18, 9); ctx.fillStyle = i === 3 ? C.red : '#9A9AA2'; ctx.fill();
  }
  ctx.restore();
}
function coin(ctx, x, y, r, color = C.grey) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#8A8A92'; ctx.beginPath(); ctx.ellipse(0, 8, r, r * 0.35, 0, 0, M.TAU); ctx.fill();
  ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.35, 0, 0, M.TAU); ctx.fill();
  ctx.restore();
}

// ------------------------------------------------------------------ S1 hook: what if the AI bubble were deflating? (0 - 2.6)
function sHook(ctx, t) {
  bg(ctx, t, 0);
  ctx.save();
  shakeAt(ctx, t, 1.78, 16);
  const r = 300 * (t < 1.78 ? 1 : lerp(1, 0.62, E.outCubic(prog(t, 1.78, 2.5))));
  bubbleBall(ctx, W / 2, 800, r, t);
  text(ctx, 'IA', W / 2, 800 + 0.3 * r, font(r * 0.9, 400, D), C.white, 'center');
  popWord(ctx, 'ET SI LA BULLE', 90, 360, 124, C.white, t, -0.3);
  popWord(ctx, "DE L'IA", 90, 480, 124, C.red, t, -0.22);
  // air escaping
  if (t >= 1.78) {
    for (let i = 0; i < 7; i++) {
      const d = (t - 1.78 - i * 0.05);
      if (d < 0) continue;
      const a = -0.5 + hash01(i, 3) * 1.0;
      const dist = r + 30 + d * 500;
      ctx.save(); ctx.globalAlpha = clamp(1 - d * 1.2); ctx.strokeStyle = C.grey; ctx.lineWidth = 6; ctx.lineCap = 'round';
      const x0 = W / 2 + Math.cos(a) * dist, y0 = 800 + Math.sin(a) * dist;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + Math.cos(a) * 50, y0 + Math.sin(a) * 50); ctx.stroke();
      ctx.restore();
    }
  }
  slam(ctx, 'SE DÉGONFLAIT ?', W / 2, 1200, 150, C.red, t, 1.7);
  ctx.restore();
}

// ------------------------------------------------------------------ S2 Nvidia makes the chips that run ChatGPT (2.6 - 5.8)
function sChip(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 2.6, 2.9));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'NVIDIA', 90, 380, 190, C.white, t, 2.64);
  popWord(ctx, 'FABRIQUE LES PUCES DE L\'IA', 90, 470, 62, C.grey, t, 3.96);
  ctx.save(); shakeAt(ctx, t, 2.68, 14);
  gpu(ctx, 330, 830, 0.95 * sp(t, 2.7, SPRING.bouncy), t);
  ctx.restore();
  // power line from chip to ChatGPT
  const p = E.inOutCubic(prog(t, 4.3, 4.75));
  if (p > 0) {
    ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 10; ctx.setLineDash([24, 18]); ctx.lineDashOffset = -t * 120;
    ctx.beginPath(); ctx.moveTo(520, 830); ctx.lineTo(lerp(520, 680, p), 830); ctx.stroke();
    ctx.restore();
  }
  const ck = sp(t, 4.74, SPRING.bouncy);
  if (ck > 0.001) {
    ctx.save(); ctx.translate(830, 830); ctx.scale(ck, ck);
    rrect(ctx, -160, -120, 320, 240, 40); ctx.fillStyle = C.white; ctx.fill();
    text(ctx, 'CHATGPT', 0, 22, font(80, 400, D), C.ink, 'center');
    ctx.restore();
  }
  chip(ctx, 'ET LA PLUPART DES IA', W / 2, 1150, t, 5.0, C.white, 'center');
  ctx.restore();
}

// ------------------------------------------------------------------ S3 -23 % in one week, worst since 2008 (5.8 - 10.8)
const DAYS = [['LUN'], ['MAR'], ['MER'], ['JEU'], ['VEN']];
function sWeek(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 5.8, 6.1));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'EN BOURSE', 90, 330, 80, C.grey, t, 5.86);
  const v = Math.round(23 * E.outCubic(prog(t, 5.9, 6.8)));
  if (t >= 5.85) {
    ctx.save(); shakeAt(ctx, t, 6.8, 14);
    text(ctx, '-' + v + ' %', 90, 610, font(300, 400, D), C.red);
    ctx.restore();
  }
  popWord(ctx, 'EN UNE SEMAINE', 90, 700, 84, C.white, t, 7.64);
  // five day tiles flip red one after the other, each with a down arrow
  DAYS.forEach(([l], i) => {
    const t0 = 7.9 + i * 0.2;
    const k = sp(t, t0, SPRING.bouncy);
    const x = 175 + i * 182, y = 930;
    ctx.save(); ctx.translate(x, y); ctx.scale(0.85 + 0.15 * k, 0.85 + 0.15 * k);
    rrect(ctx, -78, -110, 156, 220, 22); ctx.fillStyle = k > 0.5 ? C.red : C.card; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = k > 0.5 ? C.red : C.edge; ctx.stroke();
    text(ctx, l, 0, -50, font(40, 800, UI), k > 0.5 ? C.white : C.grey, 'center');
    if (k > 0.5) {
      ctx.strokeStyle = C.white; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(0, 70); ctx.moveTo(-28, 42); ctx.lineTo(0, 70); ctx.lineTo(28, 42); ctx.stroke();
    }
    ctx.restore();
  });
  ctx.restore();
  stamp(ctx, 'PIRE DEPUIS 2008', W / 2, 1220, 760, 110, t, 9.72, -0.06, C.red);
  source(ctx, 'Investing.com, Yahoo Finance, 20/11/2026', t, 8.0);
}

// ------------------------------------------------------------------ S4 Friday: -14 % crash (10.8 - 13.55)
const CURVE = [0, 0.05, 0.02, 0.09, 0.06, 0.12, 0.1, 0.16, 0.13, 0.18, 0.15];
function sFriday(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 10.8, 11.1));
  ctx.save(); ctx.translate((1 - enter) * W * 0.6, 0);
  popWord(ctx, 'VENDREDI', 90, 380, 170, C.white, t, 10.9);
  // price line: wiggles along then plunges
  const x0 = 110, x1 = W - 110, top = 620, bot = 1120;
  rrect(ctx, 90, 540, W - 180, 640, 26); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
  const pts = CURVE.map((v, i) => [x0 + 40 + i * 45, top + 60 + v * 300]);
  const drop = E.inCubic(prog(t, 12.18, 12.62));
  pts.push([pts[pts.length - 1][0] + 60, lerp(pts[pts.length - 1][1], bot - 40, drop * 0.5)]);
  pts.push([x1 - 60, lerp(pts[pts.length - 1][1], bot - 40, drop)]);
  const reveal = prog(t, 11.0, 12.1);
  const n = reveal < 1 ? Math.max(2, Math.floor(reveal * (CURVE.length))) : pts.length;
  ctx.save(); ctx.strokeStyle = drop > 0 ? C.red : C.white; ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath(); pts.slice(0, n).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  const [ex, ey] = pts[n - 1];
  ctx.fillStyle = drop > 0 ? C.red : C.white; ctx.beginPath(); ctx.arc(ex, ey, 18, 0, M.TAU); ctx.fill();
  ctx.restore();
  ctx.save(); shakeAt(ctx, t, 12.62, 22);
  slam(ctx, '-14 %', 340, 1090, 210, C.red, t, 12.62);
  ctx.restore();
  ctx.restore();
  source(ctx, 'Clôture : 125,53 $ (Investing.com, 20/11/2026)', t, 12.8);
}

// ------------------------------------------------------------------ S5 Reuters: the US market watchdog examines its accounting (13.55 - 18.6)
function sProbe(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 13.55, 13.85));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  if (t < 15.45) {
    popWord(ctx, 'INFO', 90, 360, 140, C.white, t, 13.62);
    popWord(ctx, 'REUTERS', 90, 480, 130, C.red, t, 14.56);
  } else {
    popWord(ctx, 'LE GENDARME', 90, 360, 140, C.white, t, 15.5);
    popWord(ctx, 'DE LA BOURSE (SEC)', 90, 470, 92, C.red, t, 16.2);
  }
  const lk = sp(t, 13.7, SPRING.gentle);
  if (lk > 0.001) { ctx.save(); ctx.globalAlpha = clamp(lk * 2); ledger(ctx, W / 2, 860, 0.9 + 0.1 * lk); ctx.restore(); }
  const mk = sp(t, 16.98, SPRING.bouncy);
  if (mk > 0.001) {
    const mx = W / 2 + 160 * Math.sin((t - 16.98) * 2.2), my = 880 + 50 * Math.cos((t - 16.98) * 3.1);
    ctx.save(); ctx.globalAlpha = clamp(mk * 2); magnifier(ctx, mx, my, 1.3 * mk, C.red); ctx.restore();
  }
  stamp(ctx, 'COMPTABILITÉ', W / 2, 1210, 640, 100, t, 17.7, -0.05, C.red);
  ctx.restore();
  source(ctx, 'Reuters, 20/11/2026 (la SEC ne commente pas)', t, 14.8);
}

// ------------------------------------------------------------------ S6 since the Oct 6 record: nearly half its value gone (18.6 - 23.05)
function sHalf(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 18.6, 18.9));
  ctx.save(); ctx.translate((1 - enter) * W * 0.6, 0);
  popWord(ctx, 'DEPUIS LE RECORD', 90, 360, 110, C.white, t, 18.74);
  chip(ctx, '6 OCTOBRE', 90, 450, t, 19.74, C.red);
  // two bars: record value vs Friday value (239 $ -> 125,53 $)
  const k1 = E.outCubic(prog(t, 19.0, 19.5));
  const shrink = E.inOutCubic(prog(t, 20.9, 21.8));
  const full = 560;
  const bx = 160, by = 1140;
  rrect(ctx, bx, by - full * k1, 300, full * k1, 20); ctx.fillStyle = C.grey; ctx.fill();
  if (t >= 19.2) text(ctx, '239 $', bx + 150, by - full * k1 - 30, font(72, 400, D), C.white, 'center');
  text(ctx, 'RECORD', bx + 150, by + 56, font(36, 800, UI), C.grey, 'center');
  if (t >= 20.76) {
    const h = full * lerp(1, 125.53 / 239.24, shrink);
    ctx.save(); ctx.setLineDash([16, 14]); ctx.strokeStyle = C.dim; ctx.lineWidth = 4;
    rrect(ctx, 620, by - full, 300, full, 20); ctx.stroke(); ctx.restore();
    rrect(ctx, 620, by - h, 300, h, 20); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, shrink >= 1 ? '125 $' : '', 770, by - h - 30, font(72, 400, D), C.white, 'center');
    text(ctx, 'VENDREDI', 770, by + 56, font(36, 800, UI), C.grey, 'center');
  }
  ctx.save(); shakeAt(ctx, t, 21.7, 16);
  slam(ctx, '-48 %', 770, 525, 150, C.white, t, 21.7);
  ctx.restore();
  ctx.restore();
  source(ctx, 'Prix de clôture, Motley Fool, 20/11/2026', t, 19.6);
}

// ------------------------------------------------------------------ S7 caveat: an inquiry proves no fraud (23.05 - 25.8)
function sNuance(ctx, t) {
  bg(ctx, t, 0);
  slam(ctx, 'NUANCE', W / 2, 440, 190, C.white, t, 23.16);
  chip(ctx, 'UNE ENQUÊTE', W / 2, 640, t, 23.7, C.white, 'center');
  popWord(ctx, 'NE PROUVE AUCUNE', W / 2, 820, 110, C.white, t, 24.34, 'center');
  const fk = sp(t, 24.74, SPRING.bouncy);
  if (fk > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(fk * 2);
    text(ctx, 'FRAUDE', W / 2, 1010, font(190, 400, D), C.dim, 'center');
    const p = E.outCubic(prog(t, 25.1, 25.35));
    ctx.strokeStyle = C.red; ctx.lineWidth = 18; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(W / 2 - 290, 950); ctx.lineTo(W / 2 - 290 + 580 * p, 950); ctx.stroke();
    ctx.restore();
  }
  source(ctx, "L'enquête peut se clore sans poursuites (Reuters)", t, 24.0);
}

// ------------------------------------------------------------------ S8 advice: never bet what you can't afford to lose (25.8 - 28.4)
function sAdvice(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 25.8, 26.1));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'LE CONSEIL', 90, 380, 150, C.red, t, 25.9);
  popWord(ctx, 'NE MISE JAMAIS', 90, 500, 110, C.white, t, 26.9);
  // two coin stacks: what you can lose (bet) vs what you can't (locked)
  for (let i = 0; i < 6; i++) {
    const t0 = 26.1 + i * 0.06;
    if (t < t0) continue;
    coin(ctx, 300, 1040 - i * 34 - (1 - E.outCubic(prog(t, t0, t0 + 0.2))) * 120, 110, C.grey);
  }
  for (let i = 0; i < 9; i++) {
    const t0 = 26.2 + i * 0.05;
    if (t < t0) continue;
    coin(ctx, 780, 1040 - i * 34 - (1 - E.outCubic(prog(t, t0, t0 + 0.2))) * 120, 110, t >= 27.9 ? C.red : C.grey);
  }
  text(ctx, 'CE QUE TU', 300, 1120, font(40, 800, UI), C.grey, 'center');
  text(ctx, 'PEUX PERDRE', 300, 1166, font(40, 800, UI), C.grey, 'center');
  text(ctx, 'LE RESTE', 780, 1120, font(40, 800, UI), C.white, 'center');
  text(ctx, 'ON N\'Y TOUCHE PAS', 780, 1166, font(40, 800, UI), C.white, 'center');
  stamp(ctx, 'INTOUCHABLE', 780, 680, 460, 80, t, 27.9, 0.06, C.red);
  ctx.restore();
  source(ctx, "Une info, pas un conseil d'investissement", t, 26.3);
}

// ------------------------------------------------------------------ S9 question + end card (28.4 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 0);
  const up = E.inOutCubic(prog(t, 30.9, 31.3));
  ctx.save(); ctx.translate(0, -up * 1400);
  popWord(ctx, 'ET TOI ?', W / 2, 420, 150, C.grey, t, 28.45, 'center');
  const bk = sp(t, 29.5, SPRING.bouncy);
  if (bk > 0.001) { bubbleBall(ctx, 300, 720, 170 * bk, t); text(ctx, 'BULLE', 300, 745, font(90, 400, D), C.white, 'center'); }
  popWord(ctx, 'OU', W / 2, 745, 80, C.grey, t, 29.94, 'center');
  const ck = sp(t, 30.06, SPRING.bouncy);
  if (ck > 0.001) {
    ctx.save(); ctx.translate(800, 720); ctx.scale(ck, ck);
    ctx.strokeStyle = C.white; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(-150, -80); ctx.lineTo(-60, 20); ctx.lineTo(10, -30); ctx.lineTo(150, 80); ctx.stroke();
    ctx.restore();
  }
  slam(ctx, 'SIMPLE CORRECTION ?', W / 2, 1020, 130, C.red, t, 30.3);
  popWord(ctx, 'Réponds en commentaire', W / 2, 1140, 44, C.grey, t, 30.5, 'center', UI, 600);
  ctx.restore();
  if (t >= 30.92) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 31.05, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 31.25, 'center');
    const k = sp(t, 31.5, SPRING.bouncy);
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
    if (t < 2.6) sHook(ctx, t);
    else if (t < 5.8) sChip(ctx, t);
    else if (t < 10.8) sWeek(ctx, t);
    else if (t < 13.55) sFriday(ctx, t);
    else if (t < 18.6) sProbe(ctx, t);
    else if (t < 23.05) sHalf(ctx, t);
    else if (t < 25.8) sNuance(ctx, t);
    else if (t < 28.4) sAdvice(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
