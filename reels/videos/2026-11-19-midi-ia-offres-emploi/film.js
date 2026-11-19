// L'IA freine les offres d'emploi (Coface, 17/11/2026): pure function of time. window.seek(t) paints frame t.
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
  [B(2.68), 'door slams', 'impact'],
  [B(2.95), 'sign flips', 'click'],
  [B(3.38), 'des embauches', 'thud'],
  [B(4.3), 'cut study', 'whoosh', { len: 0.4 }],
  [B(5.14), 'coface typing', 'type', { len: 0.8 }],
  [B(6.1), '17 nov', 'blip', { pitch: 'A5' }],
  [B(7.25), 'cut counter', 'whoosh', { len: 0.4 }],
  [B(7.34), 'counter', 'type', { len: 0.6 }],
  [B(7.96), '25 000 lands', 'impact'],
  [B(9.3), 'cards vanish', 'whoosh', { len: 1.2, from: 1800, to: 500 }],
  [B(10.54), 'france travail', 'pop', { pitch: 'E5' }],
  [B(11.44), 'trimestre', 'pop', { pitch: 'A5' }],
  [B(12.5), 'cut year', 'whoosh', { len: 0.4 }],
  [B(12.6), 'T1', 'blip', { pitch: 'C5' }],
  [B(12.78), 'T2', 'blip', { pitch: 'E5' }],
  [B(12.9), '100 000', 'impact'],
  [B(12.96), 'T3', 'blip', { pitch: 'G5' }],
  [B(13.14), 'T4', 'blip', { pitch: 'C6' }],
  [B(14.3), 'cut metiers', 'whoosh', { len: 0.4 }],
  [B(15.26), 'vente', 'pop', { pitch: 'C5' }],
  [B(15.98), 'compta', 'pop', { pitch: 'E5' }],
  [B(16.94), 'info', 'pop', { pitch: 'G5' }],
  [B(17.82), 'droit', 'pop', { pitch: 'A5' }],
  [B(18.88), 'RH slam', 'impact'],
  [B(19.85), 'cut bars', 'whoosh', { len: 0.4 }],
  [B(20.58), 'bar drops', 'whoosh', { len: 0.4, from: 1600, to: 300 }],
  [B(20.88), '-42,8', 'impact'],
  [B(23.6), 'cut resist', 'whoosh', { len: 0.4 }],
  [B(24.56), 'artisanat', 'thud'],
  [B(25.36), 'sante', 'thud'],
  [B(26.04), 'industrie', 'thud'],
  [B(26.4), 'resistent', 'impact'],
  [B(27.1), 'nuance', 'thud', { pitch: 'C3' }],
  [B(28.54), 'correlation', 'thud', { pitch: 'G2' }],
  [B(29.62), 'stamp', 'impact'],
  [B(30.3), 'cut conseil', 'whoosh', { len: 0.4 }],
  [B(32.58), 'IA tag 1', 'pop', { pitch: 'C5' }],
  [B(32.84), 'IA tag 2', 'pop', { pitch: 'E5' }],
  [B(33.04), 'IA tag 3', 'pop', { pitch: 'A5' }],
  [B(34.52), 'piloter', 'impact'],
  [B(35.2), 'cut question', 'whoosh', { len: 0.4 }],
  [B(36.0), 'expose', 'thud'],
  [B(36.9), 'end card', 'impact'],
  [B(37.4), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ["L'IA ne licencie pas", 0.1], ['encore en France,', 1.28], ['mais elle empêche', 2.38], ['peut-être des embauches.', 2.98],
  ['Selon une étude de Coface', 4.38], ['publiée le 17 novembre,', 5.54], ["25 000 offres d'emploi", 7.34], ['de moins que prévu', 8.76],
  ['publiées sur France Travail', 9.98], ['en un seul trimestre.', 11.2], ['Près de 100 000 sur un an.', 12.6],
  ['Les plus touchés :', 14.38], ['vente,', 15.26], ['comptabilité,', 15.98], ['informatique,', 16.94], ['droit,', 17.82],
  ['et surtout', 18.12], ['les ressources humaines,', 18.68], ['avec des offres en baisse', 19.9], ['de 42,8 %', 20.78],
  ['par rapport à leur secteur.', 22.14], ["À l'inverse,", 23.66], ["l'artisanat,", 24.5], ['la santé', 25.26],
  ["et l'industrie résistent.", 25.62], ['Nuance :', 27.1], ["c'est une corrélation,", 28.18], ['pas une preuve.', 29.38],
  ['Le conseil :', 30.34], ['liste les tâches de ton métier', 31.18], ["que l'IA sait déjà faire,", 32.44],
  ['et apprends à les piloter.', 33.62], ['Ton métier est-il exposé ?', 35.26], ["Abonne-toi pour l'actu IA", 36.94], ['de chaque jour.', 38.28],
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
function downArrow(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.fillRect(-7, -26, 14, 30);
  ctx.beginPath(); ctx.moveTo(-20, 2); ctx.lineTo(20, 2); ctx.lineTo(0, 26); ctx.closePath(); ctx.fill();
  ctx.restore();
}

// ------------------------------------------------------------------ S1 hook: the hiring door shuts (0 - 4.3)
function sDoor(ctx, t) {
  bg(ctx, t, 0);
  ctx.save();
  shakeAt(ctx, t, 2.68, 22);
  let x = 90;
  for (const [w, t0] of [["L'IA", -0.3], ['NE', -0.26], ['LICENCIE', -0.22]]) x += popWord(ctx, w, x, 370, 128, C.white, t, t0) + 24;
  x = 90;
  for (const [w, t0] of [['PAS', 1.0], ['ENCORE.', 1.2]]) x += popWord(ctx, w, x, 500, 128, C.white, t, t0) + 24;
  // the door
  const cx = W / 2, top = 590, dw = 340, dh = 470;
  const k = 0.85 + 0.15 * sp(t, -0.4, SPRING.gentle);
  ctx.save();
  ctx.translate(cx, top + dh); ctx.scale(k, k); ctx.translate(-cx, -(top + dh));
  ctx.fillStyle = '#0E0E11'; ctx.fillRect(cx - dw / 2, top, dw, dh);
  const open = 1 - E.outBack(prog(t, 2.62, 2.8), 1.4); // 1 = open, 0 = shut
  if (open > 0.02) {
    ctx.save(); ctx.globalAlpha = clamp(open) * 0.9;
    const g = ctx.createLinearGradient(cx, top, cx, top + dh);
    g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0.08)');
    ctx.fillStyle = g; ctx.fillRect(cx - dw / 2, top, dw, dh);
    ctx.restore();
  }
  // door panel hinged on the left, foreshortened while open
  const pw = dw * lerp(1, 0.22, clamp(open));
  ctx.fillStyle = C.red; ctx.fillRect(cx - dw / 2, top, pw, dh);
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(cx - dw / 2 + pw * 0.12, top + 30, pw * 0.76, dh * 0.38);
  ctx.fillRect(cx - dw / 2 + pw * 0.12, top + dh * 0.5, pw * 0.76, dh * 0.42);
  ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(cx - dw / 2 + pw * 0.86, top + dh * 0.52, 12, 0, M.TAU); ctx.fill();
  ctx.strokeStyle = C.white; ctx.lineWidth = 14; ctx.strokeRect(cx - dw / 2 - 7, top - 7, dw + 14, dh + 7);
  ctx.restore();
  // the sign hanging on the frame: ON RECRUTE -> FERMÉ (flips around its vertical axis)
  const flip = prog(t, 2.86, 3.1);
  const sx = Math.max(0.02, Math.abs(Math.cos(flip * Math.PI)));
  const swing = 0.05 * Math.sin(t * 2.4) + (t > 2.68 ? 0.12 * Math.exp(-(t - 2.68) * 4) * Math.sin((t - 2.68) * 22) : 0);
  ctx.save();
  ctx.translate(cx, top - 6); ctx.rotate(swing);
  ctx.translate(0, 110); ctx.scale(sx, 1);
  const shut = flip >= 0.5;
  rrect(ctx, -190, -56, 380, 112, 18); ctx.fillStyle = shut ? C.ink : C.white; ctx.fill();
  if (shut) { ctx.lineWidth = 8; ctx.strokeStyle = C.red; ctx.stroke(); }
  text(ctx, shut ? 'FERMÉ' : 'ON RECRUTE', 0, 30, font(84, 400, D), shut ? C.red : C.ink, 'center');
  ctx.restore();
  popWord(ctx, 'MAIS ELLE EMPÊCHE', W / 2, 1170, 100, C.white, t, 2.34, 'center');
  slam(ctx, 'DES EMBAUCHES.', W / 2, 1290, 140, C.red, t, 3.38);
  ctx.restore();
}

// ------------------------------------------------------------------ S2 the study (4.3 - 7.25)
function sStudy(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 4.3, 4.62));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  const x0 = 150, y0 = 330, cw = W - 300, ch = 740;
  ctx.save(); ctx.translate(W / 2, y0 + ch / 2); ctx.rotate(-0.025); ctx.translate(-W / 2, -(y0 + ch / 2));
  rrect(ctx, x0, y0, cw, ch, 28); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
  popWord(ctx, 'UNE ÉTUDE DE', x0 + 60, y0 + 120, 80, C.grey, t, 4.4);
  const title = 'COFACE';
  const n = Math.floor(title.length * prog(t, 5.1, 5.6));
  const tf = font(200, 400, D);
  text(ctx, title.slice(0, n), x0 + 56, y0 + 310, tf, C.white);
  if (n < title.length && t > 4.9 && Math.floor(t * 5) % 2 === 0) { ctx.font = tf; ctx.fillStyle = C.red; ctx.fillRect(x0 + 60 + ctx.measureText(title.slice(0, n)).width + 6, y0 + 150, 14, 160); }
  for (let i = 0; i < 6; i++) {
    const ly = y0 + 380 + i * 52;
    const g = E.outCubic(prog(t, 4.6 + i * 0.08, 5.0 + i * 0.08));
    const lw = (cw - 120) * (0.55 + 0.4 * hash01(i, 9)) * g;
    ctx.fillStyle = i === 3 ? (t > 6.6 ? C.red : '#3A3A42') : '#2E2E35';
    rrect(ctx, x0 + 60, ly, lw, 22, 11); ctx.fill();
  }
  ctx.restore();
  // magnifier sweeping across the report
  const mt = E.inOutSine(prog(t, 5.0, 6.7));
  const mx = lerp(260, 700, mt), my = lerp(820, 880, mt) + 20 * Math.sin(t * 3);
  ctx.save(); ctx.translate(mx, my);
  ctx.strokeStyle = C.white; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.arc(0, 0, 90, 0, M.TAU); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fill();
  ctx.lineWidth = 26; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(64, 64); ctx.lineTo(150, 150); ctx.stroke();
  ctx.restore();
  ctx.restore();
  chip(ctx, 'PUBLIÉE LE 17 NOVEMBRE', W / 2, 1200, t, 6.0, C.red, 'center');
  source(ctx, 'Baromètre AI-LERT : offres France Travail, 2026 vs 2022', t, 4.8);
}

// ------------------------------------------------------------------ S3 25 000 missing ads (7.25 - 12.5)
const CARDS = Array.from({ length: 48 }, (_, i) => ({ i, gone: hash01(i, 31) < 0.42, tg: 9.3 + 1.6 * hash01(i, 17) }));
function sCounter(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 7.25, 7.5));
  ctx.save(); ctx.translate(0, (1 - enter) * 260); ctx.globalAlpha = enter;
  shakeAt(ctx, t, 7.96, 16);
  const tq = Math.floor(t * 20) / 20;
  const v = Math.round(25000 * E.outCubic(prog(tq, 7.25, 7.96)));
  const str = v >= 1000 ? `${Math.floor(v / 1000)} ${String(v % 1000).padStart(3, '0')}` : String(v);
  const big = t >= 7.96 ? 1 + 0.04 * wobble(t - 7.96, 3, 7) : 1;
  ctx.save(); ctx.translate(W / 2, 470); ctx.scale(big, big);
  text(ctx, str, 0, 0, font(270, 400, D), C.white, 'center');
  ctx.restore();
  popWord(ctx, "OFFRES D'EMPLOI", W / 2, 575, 84, C.white, t, 7.9, 'center');
  popWord(ctx, 'DE MOINS QUE PRÉVU', W / 2, 670, 84, C.red, t, 8.74, 'center');
  // a wall of job ads; some of them never get posted
  const cols = 8, cwid = 100, chh = 78, gx = 14, gy = 14;
  const gx0 = (W - (cols * cwid + (cols - 1) * gx)) / 2, gy0 = 730;
  for (const c of CARDS) {
    const cx = gx0 + (c.i % cols) * (cwid + gx), cy = gy0 + Math.floor(c.i / cols) * (chh + gy);
    const a = sp(t, 7.3 + c.i * 0.012, SPRING.snappy);
    if (a <= 0.001) continue;
    const goneK = c.gone ? E.outCubic(prog(t, c.tg, c.tg + 0.25)) : 0;
    ctx.save(); ctx.translate(cx + cwid / 2, cy + chh / 2); ctx.scale(a, a);
    if (goneK < 1) {
      ctx.globalAlpha = enter * (1 - goneK);
      rrect(ctx, -cwid / 2, -chh / 2, cwid, chh, 12); ctx.fillStyle = '#1C1C21'; ctx.fill();
      ctx.fillStyle = C.white; rrect(ctx, -cwid / 2 + 12, -chh / 2 + 14, 30, 30, 8); ctx.fill();
      ctx.fillStyle = '#4A4A52'; rrect(ctx, -cwid / 2 + 50, -chh / 2 + 18, 36, 10, 5); ctx.fill();
      rrect(ctx, -cwid / 2 + 12, -chh / 2 + 54, 74, 10, 5); ctx.fill();
    }
    if (goneK > 0) {
      ctx.globalAlpha = enter * goneK;
      ctx.setLineDash([10, 8]); ctx.lineWidth = 3; ctx.strokeStyle = C.red;
      rrect(ctx, -cwid / 2, -chh / 2, cwid, chh, 12); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
  }
  chip(ctx, 'SUR FRANCE TRAVAIL', 90, 1240, t, 10.5, C.white);
  chip(ctx, 'EN 1 TRIMESTRE', 580, 1240, t, 11.4, C.red);
  ctx.restore();
}

// ------------------------------------------------------------------ S4 a year = 4 quarters (12.5 - 14.3)
function sYear(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 12.5, 12.75));
  ctx.save(); ctx.translate((1 - enter) * -W * 0.6, 0);
  popWord(ctx, 'PRÈS DE', W / 2, 380, 110, C.white, t, 12.5, 'center');
  slam(ctx, '100 000', W / 2, 610, 240, C.red, t, 12.9);
  const bw = 196, gap = 24, x0 = (W - (4 * bw + 3 * gap)) / 2, by = 690, bh = 270;
  for (let q = 0; q < 4; q++) {
    const t0 = 12.6 + q * 0.18;
    const k = sp(t, t0, SPRING.bouncy);
    if (k <= 0.001) continue;
    const x = x0 + q * (bw + gap);
    ctx.save(); ctx.translate(x + bw / 2, by + bh); ctx.scale(1, k); ctx.translate(-(x + bw / 2), -(by + bh));
    rrect(ctx, x, by, bw, bh, 18); ctx.fillStyle = q === 2 ? C.white : '#1C1C21'; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = q === 2 ? C.white : C.edge; ctx.stroke();
    text(ctx, '25 000', x + bw / 2, by + 150, font(64, 400, D), q === 2 ? C.ink : C.white, 'center');
    ctx.restore();
    if (k > 0.5) text(ctx, `T${q + 1}`, x + bw / 2, by + bh + 60, font(40, 800, UI), q === 2 ? C.white : C.grey, 'center');
  }
  popWord(ctx, 'SUR UN AN', W / 2, 1150, 120, C.white, t, 13.36, 'center');
  ctx.restore();
  source(ctx, 'Estimation sur un an, Coface', t, 13.0);
}

// ------------------------------------------------------------------ S5 the most exposed jobs (14.3 - 19.85)
const JOBS = [['VENTE', 15.22, 90, 480], ['COMPTABILITÉ', 15.94, 550, 480], ['INFORMATIQUE', 16.9, 90, 650], ['DROIT', 17.78, 550, 650]];
function sJobs(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 14.3, 14.6));
  ctx.save(); ctx.translate(0, (1 - enter) * -300);
  shakeAt(ctx, t, 18.88, 20);
  popWord(ctx, 'LES PLUS TOUCHÉS', 90, 400, 130, C.white, t, 14.34);
  JOBS.forEach(([name, t0, x, y], i) => {
    const pre = sp(t, 14.45 + i * 0.1, SPRING.snappy);
    if (pre <= 0.001) return;
    const k = sp(t, t0, SPRING.bouncy);
    const s = 0.9 + 0.1 * pre + 0.08 * Math.sin(Math.PI * clamp(k));
    ctx.save(); ctx.translate(x + 220, y + 70); ctx.scale(s, s);
    rrect(ctx, -220, -70, 440, 140, 22); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = k > 0.02 ? C.red : C.edge; ctx.stroke();
    ctx.globalAlpha = 0.35 + 0.65 * clamp(k * 2);
    text(ctx, name, -196, 22, font(54, 400, D), k > 0.02 ? C.white : C.dim);
    if (k > 0.02) { const pulse = 1 + 0.06 * Math.sin((t - t0) * 6); downArrow(ctx, 178, 2, 1.15 * pulse * clamp(k), C.red); }
    else { ctx.fillStyle = C.dim; text(ctx, '?', 178, 24, font(62, 400, D), C.dim, 'center'); }
    ctx.restore();
  });
  popWord(ctx, 'ET SURTOUT', 90, 880, 56, C.grey, t, 18.1);
  const p = prog(t, 18.88, 19.04);
  if (p > 0) {
    const s = lerp(1.6, 1, E.outCubic(p)) + 0.03 * wobble(t - 19.04, 3, 7);
    ctx.save(); ctx.translate(W / 2, 1030); ctx.scale(s, s);
    rrect(ctx, -450, -120, 900, 240, 26); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, 'RESSOURCES', -400, -10, font(110, 400, D), C.white);
    text(ctx, 'HUMAINES', -400, 92, font(110, 400, D), C.white);
    downArrow(ctx, 330, 0, 3, C.white);
    ctx.restore();
  }
  ctx.restore();
}

// ------------------------------------------------------------------ S6 HR: -42,8 % vs their sector (19.85 - 23.6)
function sBars(ctx, t) {
  bg(ctx, t, 1);
  const base = 1160, full = 600;
  const enter = E.outCubic(prog(t, 19.85, 20.15));
  ctx.save(); ctx.translate(0, (1 - enter) * 300); ctx.globalAlpha = enter;
  shakeAt(ctx, t, 20.88, 18);
  slam(ctx, '-42,8 %', W / 2, 470, 230, C.red, t, 20.88);
  const bars = [
    { x: 180, label: 'LEUR SECTEUR', col: C.grey, t0: 19.9 },
    { x: 620, label: 'RH', col: C.red, t0: 20.0, drop: 0.572 },
  ];
  for (const b of bars) {
    const g = E.outCubic(prog(t, b.t0, b.t0 + 0.45));
    let hh = full * g;
    if (b.drop) hh *= lerp(1, b.drop, E.outBack(prog(t, 20.58, 21.0), 1.2));
    ctx.fillStyle = b.col; ctx.fillRect(b.x, base - hh, 280, hh);
    text(ctx, b.label, b.x + 140, base + 72, font(66, 400, D), C.white, 'center');
  }
  const miss = prog(t, 20.7, 21.0);
  if (miss > 0) {
    ctx.save(); ctx.globalAlpha = miss * enter;
    ctx.setLineDash([16, 12]); ctx.lineWidth = 5; ctx.strokeStyle = C.red;
    ctx.strokeRect(620, base - full, 280, full * (1 - 0.572)); ctx.setLineDash([]);
    ctx.strokeStyle = C.white; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(460, base - full); ctx.lineTo(620, base - full); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
  source(ctx, 'Offres RH vs tendance du secteur, 3e trimestre 2026 (Coface)', t, 20.2);
}

// ------------------------------------------------------------------ S7 the jobs that hold (23.6 - 27.05)
const SAFE = [['ARTISANAT', 24.5, 470], ['SANTÉ', 25.3, 640], ['INDUSTRIE', 25.98, 810]];
// rows wait as grey bars, then light up on their word
function sSafe(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 23.6, 23.9));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  chip(ctx, "À L'INVERSE", W / 2, 360, t, 23.62, C.white, 'center');
  SAFE.forEach(([name, t0, y], i) => {
    const pre = sp(t, 23.75 + i * 0.12, SPRING.snappy);
    if (pre <= 0.001) return;
    const k = sp(t, t0, SPRING.bouncy);
    ctx.save(); ctx.translate(0, (1 - pre) * 80); ctx.globalAlpha = clamp(pre * 2);
    rrect(ctx, 90, y, W - 180, 140, 22); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = k > 0.02 ? C.white : C.edge; ctx.stroke();
    if (k > 0.02) { ctx.save(); ctx.globalAlpha = clamp(k * 2); text(ctx, name, 130 + (1 - clamp(k)) * 40, y + 96, font(84, 400, D), C.white); ctx.restore(); }
    else { rrect(ctx, 130, y + 50, 300, 40, 12); ctx.fillStyle = '#24242A'; ctx.fill(); }
    const d = E.outCubic(prog(t, t0 + 0.05, t0 + 0.6));
    const lx0 = 560, lx1 = 940, ly = y + 70;
    ctx.strokeStyle = C.white; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let s = 0; s <= 24; s++) {
      const f = s / 24; if (f > d) break;
      const px = lerp(lx0, lx1, f), py = ly + 10 * Math.sin(f * 9 + y) * (1 - f * 0.3);
      if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  });
  slam(ctx, 'RÉSISTENT.', W / 2, 1180, 200, C.white, t, 26.4);
  ctx.restore();
}

// ------------------------------------------------------------------ S8 caveat stamp (27.05 - 30.3)
function sCaveat(ctx, t) {
  bg(ctx, t, 1);
  slam(ctx, 'NUANCE', W / 2, 520, 190, C.white, t, 27.1);
  popWord(ctx, "C'EST UNE", W / 2, 720, 120, C.white, t, 28.1, 'center');
  popWord(ctx, 'CORRÉLATION,', W / 2, 870, 150, C.white, t, 28.48, 'center');
  const p = prog(t, 29.58, 29.72);
  if (p > 0) {
    ctx.save();
    ctx.translate(W / 2, 1100); ctx.rotate(-0.07);
    const s = lerp(1.8, 1, E.outCubic(p)) + 0.04 * wobble(t - 29.72, 3, 7);
    ctx.scale(s, s);
    ctx.strokeStyle = C.red; ctx.lineWidth = 12;
    rrect(ctx, -440, -120, 880, 180, 18); ctx.stroke();
    text(ctx, 'PAS UNE PREUVE.', 0, 24, font(130, 400, D), C.red, 'center');
    ctx.restore();
  }
  source(ctx, "Les auteurs ne prouvent pas que l'IA en est la cause", t, 28.6);
}

// ------------------------------------------------------------------ S9 advice: list your tasks, steer the AI (30.3 - 35.2)
const TASKS = [['Trier les mails', 31.2, 32.58], ['Rédiger un compte rendu', 31.34, 32.84], ['Faire un tableau', 31.48, 33.04]];
function sAdvice(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 30.3, 30.6));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'LE CONSEIL', 90, 390, 150, C.red, t, 30.36);
  popWord(ctx, 'LISTE TES TÂCHES', 90, 520, 104, C.white, t, 31.12);
  TASKS.forEach(([s, t0, tIA], i) => {
    const k = sp(t, t0, SPRING.bouncy);
    if (k <= 0.001) return;
    const y = 570 + i * 124 - (1 - k) * 100;
    ctx.save(); ctx.globalAlpha = clamp(k * 2);
    rrect(ctx, 90, y, W - 180, 104, 20); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
    rrect(ctx, 124, y + 28, 48, 48, 10); ctx.lineWidth = 5; ctx.strokeStyle = C.white; ctx.stroke();
    text(ctx, s, 200, y + 66, font(44, 600, UI), C.grey);
    const b = sp(t, tIA, SPRING.bouncy);
    if (b > 0.001) {
      ctx.save(); ctx.translate(W - 160, y + 52); ctx.scale(b, b);
      rrect(ctx, -48, -32, 96, 64, 32); ctx.fillStyle = C.red; ctx.fill();
      text(ctx, 'IA', 0, 18, font(52, 400, D), C.white, 'center');
      ctx.restore();
    }
    ctx.restore();
  });
  popWord(ctx, 'APPRENDS À LES', W / 2, 1060, 96, C.white, t, 33.6, 'center');
  ctx.save(); shakeAt(ctx, t, 34.52, 14);
  slam(ctx, 'PILOTER.', W / 2, 1250, 190, C.red, t, 34.52);
  ctx.restore();
  ctx.restore();
}

// ------------------------------------------------------------------ S10 question + end card (35.2 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 1);
  const up = E.inOutCubic(prog(t, 36.8, 37.2));
  ctx.save(); ctx.translate(0, -up * 1400);
  popWord(ctx, 'TON MÉTIER', W / 2, 640, 190, C.white, t, 35.22, 'center');
  slam(ctx, 'EST-IL EXPOSÉ ?', W / 2, 860, 140, C.red, t, 36.0);
  popWord(ctx, 'Réponds en commentaire', W / 2, 990, 44, C.grey, t, 36.2, 'center', UI, 600);
  ctx.restore();
  if (t >= 36.84) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 36.9, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 37.1, 'center');
    const k = sp(t, 37.4, SPRING.bouncy);
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
    if (t < 4.3) sDoor(ctx, t);
    else if (t < 7.25) sStudy(ctx, t);
    else if (t < 12.5) sCounter(ctx, t);
    else if (t < 14.3) sYear(ctx, t);
    else if (t < 19.85) sJobs(ctx, t);
    else if (t < 23.6) sBars(ctx, t);
    else if (t < 27.05) sSafe(ctx, t);
    else if (t < 30.3) sCaveat(ctx, t);
    else if (t < 35.2) sAdvice(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
