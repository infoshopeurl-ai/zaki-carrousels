// Delaware veut laisser des IA diriger des entreprises (projet AIC, brouillon au 19/11/2026): pure function of time.
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
  [B(2.3), 'erreur', 'thud'],
  [B(2.94), 'qui paie', 'impact'],
  [B(4.4), 'theorique', 'blip', { pitch: 'A5' }],
  [B(5.85), 'cut delaware', 'whoosh', { len: 0.4 }],
  [B(6.0), 'delaware', 'thud'],
  [B(7.5), 'counter', 'type', { len: 1.1 }],
  [B(8.6), 'millions', 'pop', { pitch: 'E5' }],
  [B(9.45), 'cut statut', 'whoosh', { len: 0.4 }],
  [B(10.26), 'inedit', 'impact'],
  [B(11.4), 'aic', 'pop', { pitch: 'C6' }],
  [B(14.25), 'cut agent', 'whoosh', { len: 0.4 }],
  [B(14.84), 'agent', 'blip', { pitch: 'A5' }],
  [B(16.6), 'contrats', 'pop', { pitch: 'C5' }],
  [B(17.44), 'achats', 'pop', { pitch: 'E5' }],
  [B(17.96), 'ventes', 'pop', { pitch: 'G5' }],
  [B(18.5), 'cut fournisseur', 'whoosh', { len: 0.4 }],
  [B(19.52), 'impaye', 'impact'],
  [B(20.36), 'attaque', 'thud'],
  [B(21.45), 'cut proprio', 'whoosh', { len: 0.4 }],
  [B(22.4), 'shield', 'bell', { pitch: 'C6' }],
  [B(23.76), 'fraude', 'thud', { pitch: 'C3' }],
  [B(24.4), 'violation', 'thud', { pitch: 'C3' }],
  [B(26.05), 'cut nuance', 'whoosh', { len: 0.4 }],
  [B(26.18), 'nuance', 'thud', { pitch: 'C3' }],
  [B(28.12), 'brouillon', 'click'],
  [B(29.4), 'congres', 'impact'],
  [B(30.85), 'cut conseil', 'whoosh', { len: 0.4 }],
  [B(32.16), 'signer', 'type', { len: 0.6 }],
  [B(33.5), 'loupe', 'blip', { pitch: 'E5' }],
  [B(34.52), 'reveal', 'thud'],
  [B(35.1), 'cut question', 'whoosh', { len: 0.4 }],
  [B(36.6), 'avec une ia', 'impact'],
  [B(37.3), 'end card', 'impact'],
  [B(37.8), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ['Si une IA dirige une entreprise', 0.1], ['et fait une erreur,', 1.86], ['qui paie ?', 2.94],
  ["La question n'a plus rien", 3.86], ['de théorique.', 4.82],
  ['Le Delaware,', 5.94], ['où sont enregistrées', 6.74], ['2,3 millions de sociétés,', 7.5],
  ['prépare un statut inédit :', 9.54], ["l'« entreprise", 11.28], ["d'intelligence artificielle ».", 11.86],
  ['Un agent IA', 14.42], ['en gérerait le quotidien :', 15.14], ['contrats, achats, ventes.', 16.6],
  ['Si un fournisseur', 18.62], ["n'est pas payé,", 19.26], ["il pourrait attaquer l'entreprise.", 20.1],
  ['Mais le propriétaire humain', 21.6], ['ne serait responsable', 22.5], ["qu'en cas de fraude", 23.36], ['ou de violation délibérée de la loi.', 24.1],
  ['Nuance :', 26.18], ["le texte n'est pas encore déposé,", 27.1], ['et un élu du Congrès', 28.54], ['enquête déjà.', 29.82],
  ['Le conseil :', 30.96], ['avant de signer avec une société,', 31.82], ['vérifie qui la dirige vraiment.', 33.5],
  ['Et toi,', 35.22], ['tu signerais avec une IA ?', 35.8],
  ["Abonne-toi pour l'actu IA", 37.36], ['de chaque jour.', 38.6],
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

// ------------------------------------------------------------------ S1 hook: an AI boss makes a mistake, who pays? (0 - 5.85)
function sHook(ctx, t) {
  bg(ctx, t, 0);
  ctx.save();
  shakeAt(ctx, t, 2.94, 20);
  popWord(ctx, 'SI UNE IA DIRIGE', 90, 360, 118, C.white, t, -0.3);
  popWord(ctx, 'UNE ENTREPRISE', 90, 478, 118, C.red, t, -0.22);
  const dy = 860;
  rrect(ctx, W / 2 - 150, dy - 330, 300, 260, 40); ctx.fillStyle = '#1E1E24'; ctx.fill();
  aiChip(ctx, W / 2, dy - 210, 0.95 + 0.02 * Math.sin(t * 3), t);
  tie(ctx, W / 2, dy - 98, 0.9, C.white);
  rrect(ctx, 120, dy - 40, W - 240, 60, 14); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
  ctx.fillStyle = '#101014'; ctx.fillRect(160, dy + 20, W - 320, 170);
  rrect(ctx, W / 2 - 170, dy - 100, 340, 62, 10); ctx.fillStyle = C.white; ctx.fill();
  text(ctx, 'PDG', W / 2, dy - 50, font(54, 400, D), C.ink, 'center');
  const ek = sp(t, 2.25, SPRING.bouncy);
  if (ek > 0.001 && t < 4.4) {
    ctx.save(); ctx.translate(W - 230, dy - 300); ctx.scale(ek, ek); ctx.rotate(0.06 + 0.05 * wobble(t - 2.25, 3, 6));
    rrect(ctx, -130, -60, 260, 120, 18); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, 'ERREUR', 0, 22, font(76, 400, D), C.white, 'center');
    ctx.restore();
  }
  for (let i = 0; i < 5; i++) {
    const t0 = 2.94 + i * 0.12;
    const p = E.outCubic(prog(t, t0, t0 + 0.6));
    if (p <= 0) continue;
    const x = lerp(-120 - 60 * i, [170, 330, 750, 910, 540][i], p), y = lerp(1300, 960 + 26 * Math.sin(i * 2.1), p);
    ctx.save(); ctx.translate(x, y); ctx.rotate(-0.3 + 0.15 * i + 0.05 * Math.sin(t * 3 + i));
    rrect(ctx, -70, -40, 140, 80, 10); ctx.fillStyle = i % 2 ? C.white : C.grey; ctx.fill();
    text(ctx, '$', 0, 22, font(64, 400, D), C.ink, 'center');
    ctx.restore();
  }
  slam(ctx, 'QUI PAIE ?', W / 2, 1210, 190, C.red, t, 2.94);
  ctx.restore();
  stamp(ctx, 'PLUS THÉORIQUE', W / 2, 640, 820, 110, t, 4.4, -0.07, C.white);
}

// ------------------------------------------------------------------ S2 Delaware: 2,3 million companies (5.85 - 9.45)
function sDelaware(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 5.85, 6.15));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  chip(ctx, 'ÉTATS-UNIS', 90, 300, t, 5.9, C.white);
  slam(ctx, 'DELAWARE', W / 2, 500, 210, C.white, t, 6.0);
  const cols = 12, rows = 5, cw = 62, g = 12, gx0 = (W - (cols * cw + (cols - 1) * g)) / 2, gy0 = 580;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c;
    const t0 = 6.7 + 1.6 * (i / (rows * cols)) + 0.15 * hash01(i, 9);
    const a = sp(t, t0, SPRING.snappy);
    if (a <= 0.001) continue;
    const h = 46 + 28 * hash01(i, 3);
    const x = gx0 + c * (cw + g), y = gy0 + r * 84 + (74 - h);
    ctx.save(); ctx.translate(x + cw / 2, y + h); ctx.scale(1, a);
    rrect(ctx, -cw / 2, -h, cw, h, 6); ctx.fillStyle = hash01(i, 5) < 0.18 ? C.red : '#2A2A31'; ctx.fill();
    ctx.restore();
  }
  const v = 2.3 * E.outCubic(prog(t, 7.5, 8.6));
  const vs = v.toFixed(1).replace('.', ',');
  if (t >= 7.45) {
    ctx.save(); shakeAt(ctx, t, 8.6, 10);
    text(ctx, vs, W / 2 - 30, 1170, font(230, 400, D), C.red, 'right');
    popWord(ctx, 'MILLIONS', W / 2, 1090, 100, C.white, t, 8.3);
    popWord(ctx, 'DE SOCIÉTÉS', W / 2, 1170, 70, C.grey, t, 8.6);
    ctx.restore();
  }
  ctx.restore();
  source(ctx, 'Dont plus des 2/3 du Fortune 500 (Technical.ly, 19/11/2026)', t, 8.0);
}

// ------------------------------------------------------------------ S3 a new legal status: the AI company (9.45 - 14.25)
function sStatut(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 9.45, 9.75));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'UN STATUT', 90, 380, 130, C.white, t, 9.5);
  const dx = W / 2, dy = 820;
  const dk = sp(t, 9.6, SPRING.gentle);
  ctx.save(); ctx.translate(dx, dy); ctx.scale(0.9 + 0.1 * dk, 0.9 + 0.1 * dk); ctx.rotate(-0.03); ctx.globalAlpha = clamp(dk * 2);
  rrect(ctx, -330, -360, 660, 720, 22); ctx.fillStyle = C.white; ctx.fill();
  text(ctx, 'STATUTS', 0, -270, font(60, 400, D), C.ink, 'center');
  ctx.fillStyle = '#D6D6DC';
  for (let i = 0; i < 4; i++) { rrect(ctx, -260, -220 + i * 44, 520 - 90 * (i % 2), 20, 10); ctx.fill(); }
  const name = 'AIC';
  const n = Math.floor(name.length * prog(t, 11.4, 11.8));
  text(ctx, name.slice(0, n), 0, 140, font(260, 400, D), C.red, 'center');
  const lines = ["ENTREPRISE D'INTELLIGENCE", 'ARTIFICIELLE'];
  lines.forEach((l, i) => {
    const k = sp(t, 11.9 + i * 0.4, SPRING.snappy);
    if (k <= 0.001) return;
    ctx.save(); ctx.globalAlpha = clamp(k * 2);
    text(ctx, l, 0, 220 + i * 52 + (1 - k) * 20, font(37, 800, UI), C.ink, 'center');
    ctx.restore();
  });
  ctx.restore();
  stamp(ctx, 'INÉDIT', W / 2 + 220, 345, 360, 100, t, 10.26, 0.1, C.red);
  ctx.restore();
}

// ------------------------------------------------------------------ S4 the AI agent runs daily business (14.25 - 18.5)
const TASKS = [['CONTRATS', 16.6], ['ACHATS', 17.44], ['VENTES', 17.96]];
function sAgent(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 14.25, 14.55));
  ctx.save(); ctx.translate((1 - enter) * -W * 0.6, 0);
  popWord(ctx, 'UN AGENT IA', 90, 380, 130, C.white, t, 14.35);
  popWord(ctx, 'AU QUOTIDIEN', 90, 490, 90, C.red, t, 15.8);
  const ak = sp(t, 14.8, SPRING.bouncy);
  aiChip(ctx, 250, 760, 1.1 * ak, t);
  const lx = 440, ly = 600;
  rrect(ctx, lx, ly, 560, 440, 26); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
  text(ctx, "AUJOURD'HUI", lx + 40, ly + 70, font(36, 800, UI), C.grey);
  TASKS.forEach(([label, t0], i) => {
    const y = ly + 140 + i * 105;
    const on = t >= t0;
    const k = sp(t, t0, SPRING.bouncy);
    rrect(ctx, lx + 40, y - 34, 64, 64, 14); ctx.fillStyle = on ? C.red : '#24242A'; ctx.fill();
    if (on) check(ctx, lx + 72, y - 2, clamp(k) * 1.1, C.white);
    if (on) text(ctx, label, lx + 134 + (1 - clamp(k)) * 30, y + 26, font(80, 400, D), C.white);
    else { rrect(ctx, lx + 134, y - 14, 260, 28, 12); ctx.fillStyle = '#24242A'; ctx.fill(); }
  });
  const pulse = (t * 1.6) % 1;
  ctx.save();
  ctx.strokeStyle = C.red; ctx.lineWidth = 6; ctx.setLineDash([14, 14]); ctx.lineDashOffset = -t * 60;
  ctx.globalAlpha = clamp(ak);
  ctx.beginPath(); ctx.moveTo(370, 760); ctx.lineTo(lx, 760); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(lerp(370, lx, pulse), 760, 9, 0, M.TAU); ctx.fill();
  ctx.restore();
  chip(ctx, 'SANS PDG HUMAIN', W / 2, 1200, t, 15.88, C.white, 'center');
  ctx.restore();
}

// ------------------------------------------------------------------ S5 unpaid supplier can sue the company (18.5 - 21.45)
function sSupplier(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 18.5, 18.8));
  ctx.save(); ctx.translate((1 - enter) * W * 0.6, 0);
  popWord(ctx, 'UN FOURNISSEUR', 90, 380, 120, C.white, t, 18.6);
  const ik = sp(t, 18.9, SPRING.bouncy);
  if (ik > 0.001) {
    ctx.save(); ctx.translate(320, 720); ctx.scale(ik, ik); ctx.rotate(-0.06);
    shakeAt(ctx, t, 19.52, 14);
    rrect(ctx, -200, -250, 400, 500, 20); ctx.fillStyle = C.white; ctx.fill();
    text(ctx, 'FACTURE', 0, -170, font(66, 400, D), C.ink, 'center');
    ctx.fillStyle = '#D6D6DC';
    for (let i = 0; i < 4; i++) { rrect(ctx, -150, -110 + i * 46, 300 - 70 * (i % 2), 20, 10); ctx.fill(); }
    text(ctx, 'À PAYER', 0, 160, font(80, 400, D), C.ink, 'center');
    ctx.restore();
  }
  stamp(ctx, 'IMPAYÉE', 320, 740, 400, 100, t, 19.52, -0.2, C.red);
  const ap = E.outCubic(prog(t, 20.2, 20.6));
  if (ap > 0) {
    ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 16; ctx.lineCap = 'round';
    const x0 = 560, x1 = lerp(560, 690, ap);
    ctx.beginPath(); ctx.moveTo(x0, 720); ctx.lineTo(x1, 720); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1 - 30, 690); ctx.lineTo(x1 + 6, 720); ctx.lineTo(x1 - 30, 750); ctx.stroke();
    ctx.restore();
  }
  const ck = sp(t, 19.0, SPRING.bouncy);
  if (ck > 0.001) {
    ctx.save(); ctx.translate(850, 720); ctx.scale(ck, ck);
    shakeAt(ctx, t, 20.4, 16);
    rrect(ctx, -130, -150, 260, 300, 22); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = t >= 20.36 ? C.red : C.edge; ctx.stroke();
    aiChip(ctx, 0, -20, 0.62, t);
    text(ctx, 'AIC', 0, 120, font(56, 400, D), C.white, 'center');
    ctx.restore();
  }
  chip(ctx, "PEUT ATTAQUER L'ENTREPRISE", W / 2, 1180, t, 20.36, C.red, 'center');
  ctx.restore();
}

// ------------------------------------------------------------------ S6 the human owner is shielded, except fraud / law violation (21.45 - 26.05)
function sOwner(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 21.45, 21.75));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'LE PROPRIÉTAIRE', 90, 380, 120, C.white, t, 21.6);
  popWord(ctx, 'HUMAIN', 90, 490, 110, C.red, t, 22.26);
  const pk = sp(t, 21.8, SPRING.bouncy);
  if (pk > 0.001) person(ctx, 300, 760, 2.4 * pk, C.white);
  const sk = sp(t, 22.4, SPRING.bouncy);
  if (sk > 0.001) shield(ctx, 560, 720, 1.5 * sk, C.red);
  chip(ctx, 'PROTÉGÉ', 680, 620, t, 22.62, C.white);
  const ek = sp(t, 23.2, SPRING.snappy);
  if (ek > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(ek * 2); ctx.translate(0, (1 - ek) * 40);
    rrect(ctx, 90, 900, W - 180, 330, 26); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
    text(ctx, 'RESPONSABLE SEULEMENT SI :', 130, 970, font(38, 800, UI), C.grey);
    ctx.restore();
  }
  const ex = [['FRAUDE', 23.76, 1070], ['VIOLATION DE LA LOI', 24.4, 1180]];
  ex.forEach(([l, t0, y]) => {
    const k = sp(t, t0, SPRING.bouncy);
    if (k <= 0.001) return;
    ctx.save(); ctx.translate(130 + (1 - clamp(k)) * 40, y); ctx.globalAlpha = clamp(k * 2);
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(24, -26, 22, 0, M.TAU); ctx.fill();
    text(ctx, l, 70, 6, font(84, 400, D), C.white);
    ctx.restore();
  });
  ctx.restore();
}

// ------------------------------------------------------------------ S7 caveat: still a draft, Congress probe (26.05 - 30.85)
const STAGES = [['BROUILLON', 27.3], ['DÉPOSÉ', 99], ['VOTÉ', 99]];
function sCaveat(ctx, t) {
  bg(ctx, t, 0);
  slam(ctx, 'NUANCE', W / 2, 460, 190, C.white, t, 26.18);
  const x0 = 180, x1 = W - 180, ty = 640;
  const tk = sp(t, 26.9, SPRING.snappy);
  if (tk > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(tk * 2);
    ctx.strokeStyle = C.edge; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x0, ty); ctx.lineTo(x1, ty); ctx.stroke();
    STAGES.forEach(([l, t0], i) => {
      const x = lerp(x0, x1, i / 2);
      const on = t >= t0;
      const pulse = on ? 1 + 0.12 * Math.sin((t - t0) * 7) : 1;
      ctx.fillStyle = on ? C.red : C.card; ctx.beginPath(); ctx.arc(x, ty, 34 * pulse, 0, M.TAU); ctx.fill();
      ctx.lineWidth = 5; ctx.strokeStyle = on ? C.red : C.dim; ctx.stroke();
      text(ctx, l, x, ty + 100, font(58, 400, D), on ? C.white : C.dim, 'center');
    });
    ctx.restore();
  }
  chip(ctx, 'PAS ENCORE DÉPOSÉ', W / 2, 860, t, 28.12, C.white, 'center');
  const ck = sp(t, 29.4, SPRING.bouncy);
  if (ck > 0.001) {
    ctx.save(); ctx.translate(W / 2, 1080); ctx.scale(ck, ck);
    shakeAt(ctx, t, 29.4, 12);
    rrect(ctx, -420, -100, 840, 200, 28); ctx.fillStyle = C.red; ctx.fill();
    magnifier(ctx, -300, -14, 0.9 + 0.05 * Math.sin(t * 4), C.white);
    text(ctx, 'ENQUÊTE', 80, -2, font(96, 400, D), C.white, 'center');
    text(ctx, 'DU CONGRÈS', 80, 68, font(52, 400, D), C.white, 'center');
    ctx.restore();
  }
  source(ctx, 'Examen possible en janvier 2027 ; lettre de James Comer, 26/10/2026', t, 27.2);
}

// ------------------------------------------------------------------ S8 advice: before signing, check who runs it (30.85 - 35.1)
function sAdvice(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 30.85, 31.15));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'LE CONSEIL', 90, 390, 150, C.red, t, 30.95);
  const cx = W / 2, cy = 800;
  const ck = sp(t, 31.4, SPRING.gentle);
  if (ck > 0.001) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(0.9 + 0.1 * ck, 0.9 + 0.1 * ck); ctx.rotate(0.03); ctx.globalAlpha = clamp(ck * 2);
    rrect(ctx, -330, -340, 660, 680, 22); ctx.fillStyle = C.white; ctx.fill();
    text(ctx, 'CONTRAT', 0, -250, font(70, 400, D), C.ink, 'center');
    ctx.fillStyle = '#D6D6DC';
    for (let i = 0; i < 3; i++) { rrect(ctx, -260, -190 + i * 44, 520 - 80 * (i % 2), 20, 10); ctx.fill(); }
    text(ctx, 'DIRIGÉ PAR :', -260, 20, font(40, 800, UI), C.ink);
    const reveal = t >= 34.52;
    rrect(ctx, 0, -30, 270, 70, 12); ctx.fillStyle = reveal ? C.red : '#D6D6DC'; ctx.fill();
    if (reveal) text(ctx, 'HUMAIN OU IA ?', 135, 20, font(46, 400, D), C.white, 'center');
    ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-260, 250); ctx.lineTo(260, 250); ctx.stroke();
    const sp2 = prog(t, 32.16, 32.9);
    if (sp2 > 0) {
      ctx.strokeStyle = C.red; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath();
      const N = 60;
      for (let i = 0; i <= N * sp2; i++) { const u = i / N; const x = -220 + 300 * u, y = 220 + 26 * Math.sin(u * 18) * (1 - u * 0.5); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      ctx.stroke();
    }
    ctx.restore();
  }
  const mp = E.inOutCubic(prog(t, 33.4, 34.4));
  if (t >= 33.4) magnifier(ctx, lerp(W - 140, cx + 330, mp), lerp(1150, cy + 130, mp), 1.0, C.red);
  chip(ctx, 'VÉRIFIE QUI LA DIRIGE', W / 2, 1230, t, 33.5, C.white, 'center');
  ctx.restore();
}

// ------------------------------------------------------------------ S9 question + end card (35.1 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 0);
  const up = E.inOutCubic(prog(t, 37.2, 37.6));
  ctx.save(); ctx.translate(0, -up * 1400);
  popWord(ctx, 'ET TOI ?', W / 2, 460, 150, C.grey, t, 35.2, 'center');
  popWord(ctx, 'TU SIGNERAIS', W / 2, 660, 170, C.white, t, 35.85, 'center');
  slam(ctx, 'AVEC UNE IA ?', W / 2, 850, 170, C.red, t, 36.6);
  popWord(ctx, 'Réponds en commentaire', W / 2, 990, 44, C.grey, t, 36.8, 'center', UI, 600);
  ctx.restore();
  if (t >= 37.22) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 37.3, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 37.5, 'center');
    const k = sp(t, 37.8, SPRING.bouncy);
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
    if (t < 5.85) sHook(ctx, t);
    else if (t < 9.45) sDelaware(ctx, t);
    else if (t < 14.25) sStatut(ctx, t);
    else if (t < 18.5) sAgent(ctx, t);
    else if (t < 21.45) sSupplier(ctx, t);
    else if (t < 26.05) sOwner(ctx, t);
    else if (t < 30.85) sCaveat(ctx, t);
    else if (t < 35.1) sAdvice(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
