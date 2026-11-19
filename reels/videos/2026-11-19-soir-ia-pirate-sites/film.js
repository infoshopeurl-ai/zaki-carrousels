// Une IA qui pirate seule des sites français (Google GTIG + Mandiant, 16/11/2026): pure function of time.
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
  [B(1.1), 'ghost typing', 'type', { len: 1.6 }],
  [B(1.76), 'lock opens', 'click'],
  [B(2.5), 'aux commandes', 'thud'],
  [B(3.94), 'stamp', 'impact'],
  [B(4.75), 'cut google', 'whoosh', { len: 0.4 }],
  [B(4.96), '16 nov', 'blip', { pitch: 'A5' }],
  [B(5.9), 'google', 'pop', { pitch: 'E5' }],
  [B(6.88), 'exploit typing', 'type', { len: 0.7 }],
  [B(7.88), 'server', 'thud'],
  [B(8.8), 'pirates', 'impact'],
  [B(9.55), 'cut pipeline', 'whoosh', { len: 0.4 }],
  [B(10.74), 'step 1', 'pop', { pitch: 'C5' }],
  [B(12.74), 'step 2', 'pop', { pitch: 'E5' }],
  [B(14.14), 'step 3', 'pop', { pitch: 'G5' }],
  [B(14.76), 'step 4', 'pop', { pitch: 'C6' }],
  [B(15.64), 'sans humain', 'impact'],
  [B(16.9), 'cut map', 'whoosh', { len: 0.4 }],
  [B(18.28), 'france', 'thud'],
  [B(18.86), 'medias', 'blip', { pitch: 'C5' }],
  [B(19.56), 'divert', 'blip', { pitch: 'E5' }],
  [B(20.54), 'education', 'blip', { pitch: 'A5' }],
  [B(21.3), 'cut speed', 'whoosh', { len: 0.5, from: 600, to: 2200 }],
  [B(24.08), 'orgs go red', 'type', { len: 1.2 }],
  [B(26.0), 'cut 4 jours', 'whoosh', { len: 0.4 }],
  [B(26.08), '4 jours', 'impact'],
  [B(27.48), 'alerte', 'blip', { pitch: 'A5' }],
  [B(28.2), 'cut nuance', 'whoosh', { len: 0.4 }],
  [B(28.34), 'nuance', 'thud', { pitch: 'C3' }],
  [B(30.64), 'question marks', 'thud', { pitch: 'G2' }],
  [B(31.3), 'cut reflexe', 'whoosh', { len: 0.4 }],
  [B(32.28), 'install tap', 'click'],
  [B(33.6), 'install done', 'bell', { pitch: 'C6' }],
  [B(34.15), 'cut question', 'whoosh', { len: 0.4 }],
  [B(34.78), 'souvent', 'thud'],
  [B(35.4), 'end card', 'impact'],
  [B(35.9), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ['Et si une IA pouvait pirater', 0.1], ['un site sans personne', 1.5], ['aux commandes ?', 2.5], ["Ce n'est plus une hypothèse.", 3.4],
  ['Le 16 novembre,', 4.82], ['Google a dévoilé', 5.9], ['« exploit_agent »,', 6.66], ['trouvé sur un serveur', 7.88], ['de pirates.', 8.72],
  ["Ces agents d'IA", 9.64], ['guettent les correctifs', 10.32], ['de logiciels web,', 11.18], ['retrouvent la faille réparée,', 12.32],
  ["rédigent l'attaque", 13.76], ["et l'exécutent,", 14.44], ['sans intervention humaine.', 15.42],
  ['Leur cible :', 17.02], ['des sites français', 18.02], ['de médias, de divertissement', 18.78], ["et d'éducation.", 20.14],
  ['Et tout va plus vite :', 21.42], ['sur une autre faille,', 22.68], ["des centaines d'organisations", 24.0], ['ont été attaquées', 25.16],
  ['4 jours seulement', 26.08], ["après l'alerte.", 27.08], ['Nuance :', 28.34], ['on ignore combien', 29.3], ['de sites ont été touchés.', 30.02],
  ['Le réflexe :', 31.42], ['installe les mises à jour', 32.28], ["dès qu'elles sortent.", 33.24], ['Tu les repousses souvent ?', 34.22],
  ["Abonne-toi pour l'actu IA", 35.38], ['de chaque jour.', 36.64],
];
const CAP_Y = 1385;
function captions(ctx, t) {
  let i = -1;
  for (let k = 0; k < CAP.length; k++) if (t >= CAP[k][1] - 0.04) i = k;
  if (i < 0) return;
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
function padlock(ctx, x, y, s, open, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 14; ctx.lineCap = 'round';
  ctx.save(); ctx.translate(0, -open * 30); ctx.translate(30, -40); ctx.rotate(-open * 0.6); ctx.translate(-30, 40);
  ctx.beginPath(); ctx.moveTo(-30, -36); ctx.lineTo(-30, -60); ctx.arc(0, -60, 30, Math.PI, 0); ctx.lineTo(30, -36); ctx.stroke();
  ctx.restore();
  rrect(ctx, -50, -40, 100, 84, 14); ctx.fillStyle = color; ctx.fill();
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(0, -6, 10, 0, M.TAU); ctx.fill(); ctx.fillRect(-4, -6, 8, 26);
  ctx.restore();
}
function cursor(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 56); ctx.lineTo(14, 43); ctx.lineTo(25, 66); ctx.lineTo(35, 61); ctx.lineTo(24, 39); ctx.lineTo(42, 39); ctx.closePath();
  ctx.fillStyle = color; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.restore();
}
function person(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(0, -40, 26, 0, M.TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-44, 40); ctx.quadraticCurveTo(-44, -6, 0, -6); ctx.quadraticCurveTo(44, -6, 44, 40); ctx.closePath(); ctx.fill();
  ctx.restore();
}

// ------------------------------------------------------------------ S1 hook: a site hacked with nobody at the keyboard (0 - 4.75)
function sHook(ctx, t) {
  bg(ctx, t, 0);
  ctx.save();
  shakeAt(ctx, t, 3.94, 20);
  popWord(ctx, 'ET SI UNE IA', 90, 360, 120, C.white, t, -0.3);
  popWord(ctx, 'PIRATAIT UN SITE', 90, 480, 120, C.red, t, -0.22);
  // browser window
  const bx = 150, by = 540, bw = W - 300, bh = 360;
  rrect(ctx, bx, by, bw, bh, 24); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
  ctx.fillStyle = '#222228'; rrect(ctx, bx, by, bw, 60, 24); ctx.fill(); ctx.fillRect(bx, by + 36, bw, 24);
  for (let i = 0; i < 3; i++) { ctx.fillStyle = i === 0 ? C.red : C.dim; ctx.beginPath(); ctx.arc(bx + 36 + i * 32, by + 30, 9, 0, M.TAU); ctx.fill(); }
  rrect(ctx, bx + 150, by + 14, bw - 190, 32, 16); ctx.fillStyle = '#121216'; ctx.fill();
  text(ctx, 'monsite.fr', bx + 176, by + 40, font(24, 600, UI), C.grey);
  const hacked = t >= 1.76;
  for (let i = 0; i < 4; i++) {
    const lw = (bw - 260) * (0.5 + 0.45 * hash01(i, 4));
    ctx.fillStyle = hacked && hash01(i + Math.floor(t * 12), 7) < 0.35 ? C.red : '#2E2E35';
    rrect(ctx, bx + 40, by + 100 + i * 56, lw, 24, 12); ctx.fill();
  }
  const open = E.outBack(prog(t, 1.72, 1.95), 2);
  padlock(ctx, bx + bw - 110, by + 250, 1.0, Math.max(0, open), hacked ? C.red : C.white);
  // a cursor that moves on its own
  const cp = E.inOutCubic(prog(t, 0.6, 1.7));
  const cxp = lerp(bx + 120, bx + bw - 150, cp) + 18 * Math.sin(t * 5), cyp = lerp(by + 330, by + 240, cp) + 10 * Math.cos(t * 4);
  cursor(ctx, cxp, cyp, 1.1, C.white);
  // a keyboard with keys pressing themselves
  const kx = 150, ky = 940, kw = W - 300;
  rrect(ctx, kx, ky, kw, 190, 22); ctx.fillStyle = '#0E0E11'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
  const cols = 11, kgap = 10, ks = (kw - 40 - (cols - 1) * kgap) / cols;
  for (let r = 0; r < 3; r++) for (let c = 0; c < cols; c++) {
    const id = r * cols + c;
    const press = t > 0.9 && hash01(id + Math.floor(t * 9) * 37, 11) < 0.12;
    rrect(ctx, kx + 20 + c * (ks + kgap), ky + 20 + r * 54 + (press ? 4 : 0), ks, 44, 8);
    ctx.fillStyle = press ? C.red : '#24242A'; ctx.fill();
  }
  chip(ctx, 'SANS PERSONNE AUX COMMANDES', W / 2, 1210, t, 2.1, C.white, 'center');
  // stamp
  const p = prog(t, 3.9, 4.04);
  if (p > 0) {
    ctx.save(); ctx.translate(W / 2, 730); ctx.rotate(-0.08);
    const s = lerp(1.8, 1, E.outCubic(p)) + 0.04 * wobble(t - 4.04, 3, 7);
    ctx.scale(s, s);
    rrect(ctx, -440, -110, 880, 170, 18); ctx.fillStyle = 'rgba(5,5,6,0.9)'; ctx.fill();
    ctx.strokeStyle = C.red; ctx.lineWidth = 12; ctx.stroke();
    text(ctx, 'PLUS UNE HYPOTHÈSE', 0, 26, font(112, 400, D), C.red, 'center');
    ctx.restore();
  }
  ctx.restore();
}

// ------------------------------------------------------------------ S2 Google finds exploit_agent on a pirate server (4.75 - 9.55)
function sGoogle(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 4.75, 5.05));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  // calendar page
  const k = sp(t, 4.9, SPRING.bouncy);
  ctx.save(); ctx.translate(250, 450); ctx.scale(k, k); ctx.rotate(-0.05);
  rrect(ctx, -140, -130, 280, 270, 24); ctx.fillStyle = C.white; ctx.fill();
  rrect(ctx, -140, -130, 280, 76, 24); ctx.fillStyle = C.red; ctx.fill(); ctx.fillRect(-140, -80, 280, 26);
  text(ctx, 'NOVEMBRE', 0, -76, font(50, 400, D), C.white, 'center');
  text(ctx, '16', 0, 110, font(170, 400, D), C.ink, 'center');
  ctx.restore();
  popWord(ctx, 'GOOGLE', 450, 420, 150, C.white, t, 5.88);
  popWord(ctx, 'A DÉVOILÉ', 455, 520, 90, C.grey, t, 6.2);
  // terminal typing the tool's name
  const tx = 90, ty = 600, tw = W - 180, th = 230;
  const tk = sp(t, 6.25, SPRING.snappy);
  if (tk > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(tk * 2); ctx.translate(0, (1 - tk) * 60);
    rrect(ctx, tx, ty, tw, th, 22); ctx.fillStyle = '#0B0B0E'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.red; ctx.stroke();
    text(ctx, 'outil trouvé :', tx + 40, ty + 64, font(34, 600, UI), C.grey);
    const name = 'EXPLOIT_AGENT';
    const n = Math.floor(name.length * prog(t, 6.88, 7.5));
    const f = font(130, 400, D);
    text(ctx, name.slice(0, n), tx + 40, ty + 190, f, C.white);
    ctx.font = f;
    if (Math.floor(t * 4) % 2 === 0 || n < name.length) { ctx.fillStyle = C.red; ctx.fillRect(tx + 48 + ctx.measureText(name.slice(0, n)).width, ty + 90, 16, 104); }
    ctx.restore();
  }
  // server rack on the pirates' side
  const sk = sp(t, 7.84, SPRING.bouncy);
  if (sk > 0.001) {
    ctx.save(); ctx.translate(W / 2, 1050); ctx.scale(sk, sk);
    shakeAt(ctx, t, 8.8, 14);
    for (let i = 0; i < 3; i++) {
      const y = -150 + i * 92;
      rrect(ctx, -300, y, 600, 78, 14); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
      for (let j = 0; j < 6; j++) { ctx.fillStyle = '#2E2E35'; ctx.fillRect(-260 + j * 40, y + 28, 24, 22); }
      const on = Math.floor(t * 6 + i * 2) % 3 !== 0;
      ctx.fillStyle = on ? C.red : '#3A1018'; ctx.beginPath(); ctx.arc(250, y + 39, 13, 0, M.TAU); ctx.fill();
    }
    ctx.restore();
  }
  chip(ctx, 'SERVEUR DE PIRATES', W / 2, 1230, t, 8.8, C.red, 'center');
  ctx.restore();
  source(ctx, 'Google Threat Intelligence + Mandiant, 16/11/2026', t, 5.3);
}

// ------------------------------------------------------------------ S3 the assembly line: patch -> flaw -> attack -> run (9.55 - 16.9)
const STEPS = [['GUETTE LE CORRECTIF', 10.74], ['TROUVE LA FAILLE', 12.74], ["ÉCRIT L'ATTAQUE", 14.14], ['LA LANCE', 14.76]];
function sPipeline(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 9.55, 9.85));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  shakeAt(ctx, t, 15.64, 18);
  popWord(ctx, "CES AGENTS D'IA", 90, 380, 120, C.white, t, 9.6);
  const x0 = 100, y0 = 440, rh = 150;
  // connector rail fills from step to step
  ctx.fillStyle = '#24242A'; ctx.fillRect(x0 + 46, y0 + 60, 10, rh * 3);
  let fillH = 0;
  for (let i = 1; i < STEPS.length; i++) fillH += rh * E.outCubic(prog(t, STEPS[i][1] - 0.35, STEPS[i][1]));
  ctx.fillStyle = C.red; ctx.fillRect(x0 + 46, y0 + 60, 10, fillH);
  STEPS.forEach(([label, t0], i) => {
    const y = y0 + i * rh;
    const pre = sp(t, 9.9 + i * 0.1, SPRING.snappy);
    if (pre <= 0.001) return;
    const k = sp(t, t0, SPRING.bouncy);
    const on = t >= t0;
    ctx.save(); ctx.globalAlpha = clamp(pre * 2);
    ctx.beginPath(); ctx.arc(x0 + 51, y + 60, 40 + 6 * Math.sin(Math.PI * clamp(k)), 0, M.TAU);
    ctx.fillStyle = on ? C.red : C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = on ? C.red : C.edge; ctx.stroke();
    text(ctx, String(i + 1), x0 + 51, y + 84, font(64, 400, D), on ? C.white : C.dim, 'center');
    rrect(ctx, x0 + 120, y + 8, W - 2 * x0 - 120, 104, 20); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = on ? C.white : C.edge; ctx.stroke();
    if (on) text(ctx, label, x0 + 150 + (1 - clamp(k)) * 30, y + 86, font(76, 400, D), C.white);
    else { rrect(ctx, x0 + 150, y + 44, 320, 32, 12); ctx.fillStyle = '#24242A'; ctx.fill(); }
    ctx.restore();
  });
  // nobody in the loop
  const p = prog(t, 15.6, 15.76);
  if (p > 0) {
    const s = lerp(1.6, 1, E.outCubic(p)) + 0.03 * wobble(t - 15.76, 3, 7);
    ctx.save(); ctx.translate(W / 2, 1160); ctx.scale(s, s);
    rrect(ctx, -440, -100, 880, 200, 26); ctx.fillStyle = C.red; ctx.fill();
    person(ctx, -320, 20, 1.15, C.white);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 14; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-390, -60); ctx.lineTo(-250, 80); ctx.stroke();
    text(ctx, 'SANS HUMAIN', 60, 40, font(120, 400, D), C.white, 'center');
    ctx.restore();
  }
  ctx.restore();
}

// ------------------------------------------------------------------ S4 targets: French sites (16.9 - 21.3)
const FR = [[0.47, 0.0], [0.62, 0.08], [0.8, 0.17], [0.97, 0.27], [0.93, 0.45], [0.86, 0.55], [0.92, 0.72], [0.98, 0.86], [0.78, 0.93], [0.62, 0.88], [0.52, 0.99], [0.3, 0.93], [0.17, 0.89], [0.23, 0.62], [0.19, 0.48], [0.02, 0.38], [0.04, 0.29], [0.25, 0.3], [0.3, 0.18], [0.42, 0.15]];
const TARGETS = [[18.86, 0.55, 0.25], [19.56, 0.72, 0.62], [20.54, 0.38, 0.7]];
function sMap(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 16.9, 17.2));
  ctx.save(); ctx.translate((1 - enter) * -W * 0.6, 0);
  popWord(ctx, 'LEUR CIBLE', 90, 380, 130, C.white, t, 16.98);
  const mx = 260, my = 440, ms = 540;
  const mk = sp(t, 17.1, SPRING.gentle);
  ctx.save(); ctx.translate(mx + ms / 2, my + ms / 2); ctx.scale(0.9 + 0.1 * mk, 0.9 + 0.1 * mk); ctx.translate(-(mx + ms / 2), -(my + ms / 2));
  ctx.globalAlpha = clamp(mk * 2);
  const hot = t >= 18.28;
  ctx.beginPath(); FR.forEach(([a, b], i) => { const px = mx + a * ms, py = my + b * ms; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }); ctx.closePath();
  ctx.fillStyle = hot ? '#2A0A12' : C.card; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = hot ? C.red : C.grey; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(mx + 1.02 * ms, my + 0.98 * ms, 18, 36, 0.2, 0, M.TAU); ctx.fill(); ctx.stroke();
  TARGETS.forEach(([t0, a, b]) => {
    const k = sp(t, t0, SPRING.bouncy);
    if (k <= 0.001) return;
    const px = mx + a * ms, py = my + b * ms, r = 46 * k + 6 * Math.sin((t - t0) * 6);
    ctx.strokeStyle = C.white; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(px, py, r, 0, M.TAU); ctx.stroke();
    ctx.beginPath(); ctx.arc(px, py, r * 0.45, 0, M.TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px - r - 16, py); ctx.lineTo(px + r + 16, py); ctx.moveTo(px, py - r - 16); ctx.lineTo(px, py + r + 16); ctx.stroke();
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(px, py, 10, 0, M.TAU); ctx.fill();
  });
  ctx.restore();
  chip(ctx, 'SITES FRANÇAIS', W / 2, 1080, t, 18.2, C.red, 'center');
  chip(ctx, 'MÉDIAS', 80, 1190, t, 18.86, C.white);
  chip(ctx, 'DIVERTISSEMENT', 290, 1190, t, 19.56, C.white);
  chip(ctx, 'ÉDUCATION', 700, 1190, t, 20.54, C.white);
  ctx.restore();
}

// ------------------------------------------------------------------ S5 faster: hundreds of organisations hit (21.3 - 25.9)
const ORGS = Array.from({ length: 50 }, (_, i) => ({ i, tr: 24.05 + 1.5 * hash01(i, 23) }));
function sSpeed(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 21.3, 21.6));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'TOUT VA', 90, 390, 140, C.white, t, 21.4);
  const k = sp(t, 21.8, SPRING.bouncy);
  if (k > 0.001) {
    ctx.save(); ctx.translate(470 + (1 - clamp(k)) * 400, 390); ctx.transform(1, 0, -0.18, 1, 0, 0);
    text(ctx, 'PLUS VITE', 0, 0, font(140, 400, D), C.red);
    ctx.restore();
  }
  chip(ctx, 'SUR UNE AUTRE FAILLE', 90, 510, t, 22.7, C.white);
  // grid of organisations (buildings) turning red
  const cols = 10, cw = 74, chh = 74, g = 14, gx0 = (W - (cols * cw + (cols - 1) * g)) / 2, gy0 = 590;
  for (const o of ORGS) {
    const a = sp(t, 21.7 + o.i * 0.012, SPRING.snappy);
    if (a <= 0.001) continue;
    const x = gx0 + (o.i % cols) * (cw + g), y = gy0 + Math.floor(o.i / cols) * (chh + g);
    const red = t >= o.tr;
    ctx.save(); ctx.translate(x + cw / 2, y + chh / 2); const s = a * (red ? 1 + 0.15 * Math.exp(-(t - o.tr) * 8) : 1); ctx.scale(s, s);
    rrect(ctx, -cw / 2, -chh / 2, cw, chh, 10); ctx.fillStyle = red ? C.red : C.card; ctx.fill();
    ctx.fillStyle = red ? 'rgba(5,5,6,0.45)' : '#2E2E35';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) ctx.fillRect(-24 + c * 18, -24 + r * 18, 10, 10);
    ctx.restore();
  }
  popWord(ctx, 'DES CENTAINES', 90, 1150, 100, C.white, t, 24.0);
  popWord(ctx, "D'ORGANISATIONS", 90, 1260, 100, C.red, t, 24.6);
  ctx.restore();
}

// ------------------------------------------------------------------ S6 four days after the alert (25.9 - 28.2)
function sDays(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 26.0, 26.2));
  ctx.save(); ctx.translate((1 - enter) * W * 0.6, 0);
  shakeAt(ctx, t, 26.08, 18);
  slam(ctx, '4 JOURS', W / 2, 560, 280, C.red, t, 26.08);
  popWord(ctx, 'SEULEMENT', W / 2, 680, 100, C.white, t, 26.7, 'center');
  // timeline J0..J4
  const x0 = 140, x1 = W - 140, ty = 940;
  ctx.strokeStyle = C.edge; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x0, ty); ctx.lineTo(x1, ty); ctx.stroke();
  const run = E.inOutCubic(prog(t, 26.1, 27.4));
  ctx.strokeStyle = C.red; ctx.beginPath(); ctx.moveTo(x0, ty); ctx.lineTo(lerp(x0, x1, run), ty); ctx.stroke();
  for (let d = 0; d <= 4; d++) {
    const x = lerp(x0, x1, d / 4);
    const on = run >= d / 4 - 0.001;
    ctx.fillStyle = on ? C.red : C.card; ctx.beginPath(); ctx.arc(x, ty, d === 0 || d === 4 ? 30 : 20, 0, M.TAU); ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = on ? C.red : C.edge; ctx.stroke();
    text(ctx, `J${d}`, x, ty + 90, font(52, 400, D), on ? C.white : C.dim, 'center');
  }
  chip(ctx, 'ALERTE', x0 - 50, ty - 90, t, 26.0, C.white);
  chip(ctx, 'ATTAQUE', x1 - 140, ty - 90, t, 27.3, C.red);
  ctx.restore();
  source(ctx, 'Faille PaperCut, août 2026 (GreyNoise, cité par Google)', t, 26.4);
}

// ------------------------------------------------------------------ S7 caveat: the victim count is unknown (28.2 - 31.3)
function sCaveat(ctx, t) {
  bg(ctx, t, 0);
  slam(ctx, 'NUANCE', W / 2, 500, 190, C.white, t, 28.34);
  const k = sp(t, 29.25, SPRING.bouncy);
  if (k > 0.001) {
    ctx.save(); ctx.translate(W / 2, 790); ctx.scale(k, k);
    rrect(ctx, -400, -150, 800, 300, 30); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
    text(ctx, 'SITES TOUCHÉS', 0, -80, font(44, 800, UI), C.grey, 'center');
    // digits scramble and never settle
    const step = Math.floor(t * 14);
    let s = '';
    for (let i = 0; i < 4; i++) s += t >= 30.64 ? '?' : String(Math.floor(hash01(step * 7 + i, 5) * 10));
    text(ctx, s, 0, 110, font(200, 400, D), t >= 30.64 ? C.red : C.white, 'center', 18);
    ctx.restore();
  }
  popWord(ctx, 'ON NE SAIT PAS.', W / 2, 1140, 130, C.red, t, 30.64, 'center');
  source(ctx, 'Le rapport ne chiffre pas les victimes françaises', t, 29.4);
}

// ------------------------------------------------------------------ S8 advice: install updates right away (31.3 - 34.15)
function sAdvice(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 31.3, 31.6));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'LE RÉFLEXE', 90, 390, 150, C.red, t, 31.38);
  // phone
  const px = W / 2 - 230, py = 440, pw = 460, ph = 700;
  rrect(ctx, px, py, pw, ph, 56); ctx.fillStyle = '#0E0E11'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.white; ctx.stroke();
  rrect(ctx, W / 2 - 60, py + 22, 120, 26, 13); ctx.fillStyle = '#24242A'; ctx.fill();
  const nk = sp(t, 31.5, SPRING.bouncy);
  if (nk > 0.001) {
    ctx.save(); ctx.translate(0, (1 - nk) * -120); ctx.globalAlpha = clamp(nk * 2);
    rrect(ctx, px + 30, py + 90, pw - 60, 230, 26); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
    text(ctx, 'Mise à jour', px + 60, py + 150, font(40, 800, UI), C.white);
    text(ctx, 'disponible', px + 60, py + 198, font(40, 800, UI), C.grey);
    const pressed = t >= 32.28 && t < 32.45;
    const done = t >= 33.6;
    ctx.save(); ctx.translate(W / 2, py + 262); const bs = pressed ? 0.92 : 1; ctx.scale(bs, bs);
    rrect(ctx, -170, -34, 340, 68, 34); ctx.fillStyle = done ? C.white : C.red; ctx.fill();
    text(ctx, done ? 'À jour' : 'Installer', 0, 13, font(36, 800, UI), done ? C.ink : C.white, 'center');
    ctx.restore();
    ctx.restore();
  }
  if (t >= 32.28 && t < 32.6) { const r = 30 + 200 * prog(t, 32.28, 32.6); ctx.save(); ctx.globalAlpha = 1 - prog(t, 32.28, 32.6); ctx.strokeStyle = C.white; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(W / 2, py + 262, r, 0, M.TAU); ctx.stroke(); ctx.restore(); }
  const pr = E.inOutCubic(prog(t, 32.5, 33.6));
  if (t >= 32.4) {
    rrect(ctx, px + 50, py + 400, pw - 100, 30, 15); ctx.fillStyle = '#24242A'; ctx.fill();
    if (pr > 0.01) { rrect(ctx, px + 50, py + 400, (pw - 100) * pr, 30, 15); ctx.fillStyle = C.red; ctx.fill(); }
    text(ctx, `${Math.round(pr * 100)} %`, W / 2, py + 520, font(100, 400, D), C.white, 'center');
  }
  if (t >= 33.6) { const k = sp(t, 33.6, SPRING.bouncy); padlock(ctx, W / 2, py + 630, 0.9 * k, 0, C.white); }
  ctx.restore();
  chip(ctx, "DÈS QU'ELLES SORTENT", W / 2, 1250, t, 33.24, C.white, 'center');
}

// ------------------------------------------------------------------ S9 question + end card (34.15 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 0);
  const up = E.inOutCubic(prog(t, 35.3, 35.7));
  ctx.save(); ctx.translate(0, -up * 1400);
  popWord(ctx, 'TU LES', W / 2, 560, 190, C.white, t, 34.2, 'center');
  popWord(ctx, 'REPOUSSES', W / 2, 740, 190, C.white, t, 34.45, 'center');
  slam(ctx, 'SOUVENT ?', W / 2, 920, 170, C.red, t, 34.78);
  popWord(ctx, 'Réponds en commentaire', W / 2, 1050, 44, C.grey, t, 34.9, 'center', UI, 600);
  ctx.restore();
  if (t >= 35.32) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 35.4, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 35.6, 'center');
    const k = sp(t, 35.9, SPRING.bouncy);
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
    if (t < 4.75) sHook(ctx, t);
    else if (t < 9.55) sGoogle(ctx, t);
    else if (t < 16.9) sPipeline(ctx, t);
    else if (t < 21.3) sMap(ctx, t);
    else if (t < 26.0) sSpeed(ctx, t);
    else if (t < 28.2) sDays(ctx, t);
    else if (t < 31.3) sCaveat(ctx, t);
    else if (t < 34.15) sAdvice(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
