// Deutsche Telekom investit 100 M EUR dans Mistral (communiqué du 19/11/2026) : pure function of time.
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
  [B(2.22), 'finance', 'pop', { pitch: 'E5' }],
  [B(3.36), 'allemands', 'impact'],
  [B(4.26), 'cut cheque', 'whoosh', { len: 0.4 }],
  [B(5.48), 'telekom', 'thud'],
  [B(6.74), 'counter', 'type', { len: 0.5 }],
  [B(7.6), 'cent millions', 'impact'],
  [B(8.4), 'cut startup', 'whoosh', { len: 0.4 }],
  [B(8.96), 'paris', 'pop', { pitch: 'C6' }],
  [B(10.24), 'le chat', 'blip', { pitch: 'A5' }],
  [B(11.1), 'cut objectif', 'whoosh', { len: 0.4 }],
  [B(12.78), 'usine', 'click'],
  [B(13.5), 'admin', 'click'],
  [B(15.38), 'souveraine', 'impact'],
  [B(16.45), 'cut europe', 'whoosh', { len: 0.4 }],
  [B(17.0), 'europe', 'pop', { pitch: 'G5' }],
  [B(18.0), 'usa barre', 'thud', { pitch: 'C3' }],
  [B(18.75), 'cut septembre', 'whoosh', { len: 0.4 }],
  [B(20.72), 'trois milliards', 'impact'],
  [B(22.2), 'samsung', 'pop', { pitch: 'E5' }],
  [B(24.2), 'vingt et un', 'impact'],
  [B(25.45), 'cut nuance', 'whoosh', { len: 0.4 }],
  [B(25.52), 'nuance', 'thud', { pitch: 'C3' }],
  [B(26.84), 'soixante', 'impact'],
  [B(28.04), 'anthropic', 'pop', { pitch: 'C6' }],
  [B(30.78), 'mille six cents', 'impact'],
  [B(32.95), 'cut conseil', 'whoosh', { len: 0.4 }],
  [B(33.9), 'teste', 'blip', { pitch: 'A5' }],
  [B(34.48), 'gratuit', 'pop', { pitch: 'G5' }],
  [B(35.68), 'check', 'bell', { pitch: 'C6' }],
  [B(36.45), 'cut question', 'whoosh', { len: 0.4 }],
  [B(38.12), 'europeenne', 'impact'],
  [B(39.0), 'end card', 'impact'],
  [B(39.4), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ["Le champion français de l'IA", 0.1], ["vient d'être financé...", 1.54], ['par les Allemands.', 2.78],
  ['Le 19 novembre, Deutsche Telekom', 4.26], ["a investi 100 millions d'euros", 6.08], ['dans Mistral,', 7.54],
  ['la start-up parisienne', 8.44], ["derrière l'assistant Le Chat.", 9.48],
  ['Objectif :', 11.18], ['proposer aux usines', 12.28], ['et aux administrations allemandes', 13.36], ['une IA dite souveraine,', 14.6],
  ['hébergée en Europe', 16.54], ["plutôt qu'aux États-Unis.", 17.28],
  ['En septembre,', 18.8], ['Mistral avait déjà levé', 19.7], ["3 milliards d'euros,", 20.72], ['avec Samsung en tête,', 21.98],
  ['pour une valeur proche de 21 milliards.', 23.42],
  ['Nuance :', 25.52], ["c'est plus de 60 fois moins", 26.36], ["qu'Anthropic, le créateur de Claude,", 27.8],
  ['valorisé environ', 29.64], ['1 600 milliards de dollars.', 30.78],
  ['Conseil :', 33.02], ['teste Le Chat gratuitement', 33.9], ['sur une vraie tâche.', 35.08],
  ['Et toi,', 36.48], ['tu ferais confiance', 37.04], ['à une IA européenne ?', 37.58],
  ["Abonne-toi pour l'actu IA", 39.22], ['de chaque jour.', 40.46],
];
const CAP_Y = 1385;
function captions(ctx, t) {
  let i = -1;
  for (let k = 0; k < CAP.length; k++) if (t >= CAP[k][1] - 0.04) i = k;
  if (i < 0 || t > 41.7) return;
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
// Mistral as a plain white name card (no logo) with a tag
function mistralCard(ctx, x, y, s, tag = 'FRANCE') {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -250, -150, 500, 300, 36); ctx.fillStyle = C.white; ctx.fill();
  text(ctx, 'MISTRAL', 0, 30, font(150, 400, D), C.ink, 'center');
  rrect(ctx, -110, 70, 220, 54, 27); ctx.fillStyle = C.ink; ctx.fill();
  text(ctx, tag, 0, 108, font(30, 800, UI), C.white, 'center');
  ctx.restore();
}
// a bank cheque
function cheque(ctx, x, y, s, amount, payee) {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.04);
  rrect(ctx, -400, -190, 800, 380, 28); ctx.fillStyle = '#F2F2F4'; ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = C.red; ctx.stroke();
  text(ctx, 'DEUTSCHE TELEKOM', -350, -120, font(46, 400, D), C.ink);
  text(ctx, 'PAYEZ À', -350, -40, font(28, 800, UI), '#6A6A72');
  text(ctx, payee, -200, -40, font(44, 400, D), C.ink);
  ctx.fillStyle = '#C8C8CE'; ctx.fillRect(-350, -20, 520, 4);
  rrect(ctx, -350, 20, 700, 110, 18); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#C8C8CE'; ctx.stroke();
  text(ctx, amount, 0, 104, font(96, 400, D), C.red, 'center');
  ctx.restore();
}
function factory(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(-120, 90); ctx.lineTo(-120, -10); ctx.lineTo(-60, -50); ctx.lineTo(-60, -10); ctx.lineTo(0, -50); ctx.lineTo(0, -10);
  ctx.lineTo(60, -50); ctx.lineTo(60, -130); ctx.lineTo(100, -130); ctx.lineTo(100, 90); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C.ink; for (let i = 0; i < 3; i++) ctx.fillRect(-95 + i * 60, 20, 34, 34);
  ctx.restore();
}
function townhall(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(-130, -40); ctx.lineTo(0, -120); ctx.lineTo(130, -40); ctx.closePath(); ctx.fill();
  for (let i = 0; i < 4; i++) ctx.fillRect(-105 + i * 64, -30, 32, 100);
  ctx.fillRect(-135, 76, 270, 22);
  ctx.restore();
}
function server(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < 3; i++) {
    rrect(ctx, -110, -105 + i * 72, 220, 60, 12); ctx.fillStyle = '#2A2A31'; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
    ctx.fillStyle = (Math.floor(t * 4 + i) % 2) ? C.red : C.grey;
    ctx.beginPath(); ctx.arc(-76, -75 + i * 72, 9, 0, M.TAU); ctx.fill();
    ctx.fillStyle = C.dim; ctx.fillRect(-40, -80 + i * 72, 120, 10);
  }
  ctx.restore();
}
function lock(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(0, -30, 40, Math.PI, 0); ctx.lineTo(40, 0); ctx.moveTo(-40, 0); ctx.lineTo(-40, -30); ctx.stroke();
  rrect(ctx, -62, -6, 124, 100, 16); ctx.fillStyle = color; ctx.fill();
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(0, 36, 12, 0, M.TAU); ctx.fill(); ctx.fillRect(-5, 36, 10, 30);
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

// ------------------------------------------------------------------ S1 hook: the French AI champion financed by Germans (0 - 4.26)
function sHook(ctx, t) {
  bg(ctx, t, 0);
  ctx.save();
  shakeAt(ctx, t, 3.36, 18);
  popWord(ctx, 'LE CHAMPION', 90, 340, 130, C.white, t, -0.3);
  popWord(ctx, "FRANÇAIS DE L'IA", 90, 460, 110, C.red, t, -0.22);
  const tilt = 0.03 * Math.sin(t * 2);
  ctx.save(); ctx.translate(W / 2, 760); ctx.rotate(tilt); mistralCard(ctx, 0, 0, 1 + 0.03 * wobble(t - 3.36, 3, 6)); ctx.restore();
  // coins dropping onto the card from "financé"
  for (let i = 0; i < 8; i++) {
    const t0 = 2.22 + i * 0.1;
    if (t < t0) continue;
    const d = t - t0, fallP = clamp(d / 0.5);
    const x = W / 2 - 200 + hash01(i, 5) * 400;
    const y = lerp(470, 600 - (i % 3) * 10, E.outBounce(fallP));
    ctx.save();
    ctx.fillStyle = '#B3122A'; ctx.beginPath(); ctx.ellipse(x, y + 8, 34, 12, 0, 0, M.TAU); ctx.fill();
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.ellipse(x, y, 34, 12, 0, 0, M.TAU); ctx.fill();
    ctx.restore();
  }
  popWord(ctx, 'FINANCÉ...', W / 2, 1040, 100, C.grey, t, 2.22, 'center');
  slam(ctx, 'PAR LES ALLEMANDS', W / 2, 1200, 130, C.red, t, 3.36);
  ctx.restore();
}

// ------------------------------------------------------------------ S2 Nov 19: Deutsche Telekom writes a 100 M EUR cheque (4.26 - 8.4)
function sCheque(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 4.26, 4.56));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  chip(ctx, '19 NOVEMBRE', 90, 330, t, 4.3, C.red);
  popWord(ctx, 'DEUTSCHE TELEKOM', 90, 480, 120, C.white, t, 5.48);
  popWord(ctx, 'OPÉRATEUR TÉLÉCOM ALLEMAND', 90, 550, 46, C.grey, t, 5.9, 'left', UI, 800);
  const v = Math.round(100 * E.outCubic(prog(t, 6.74, 7.6)));
  const ck = sp(t, 4.4, SPRING.gentle);
  ctx.save(); shakeAt(ctx, t, 7.6, 14);
  cheque(ctx, W / 2, 860, 0.62 + 0.38 * ck, t >= 6.74 ? v + ' MILLIONS €' : '... €', t >= 7.6 ? 'MISTRAL' : '');
  ctx.restore();
  stamp(ctx, 'INVESTI', W / 2 + 230, 1150, 360, 90, t, 7.7, 0.07, C.red);
  ctx.restore();
  source(ctx, 'Communiqué Deutsche Telekom, 19/11/2026', t, 5.0);
}

// ------------------------------------------------------------------ S3 a Paris start-up behind Le Chat (8.4 - 11.1)
function sStartup(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 8.4, 8.7));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'START-UP', 90, 370, 150, C.white, t, 8.45);
  popWord(ctx, 'PARISIENNE', 90, 500, 130, C.red, t, 8.96);
  mistralCard(ctx, 330, 790, 0.72 * sp(t, 8.45, SPRING.bouncy), 'PARIS');
  const bk = sp(t, 9.5, SPRING.bouncy);
  if (bk > 0.001) {
    ctx.save(); ctx.translate(800, 820); ctx.scale(bk, bk);
    ctx.fillStyle = C.red; rrect(ctx, -190, -110, 380, 200, 40); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-120, 80); ctx.lineTo(-160, 150); ctx.lineTo(-50, 88); ctx.closePath(); ctx.fill();
    text(ctx, 'LE CHAT', 0, 28, font(92, 400, D), C.white, 'center');
    ctx.restore();
  }
  const lp = E.inOutCubic(prog(t, 9.1, 9.5));
  if (lp > 0) {
    ctx.save(); ctx.strokeStyle = C.grey; ctx.lineWidth = 8; ctx.setLineDash([18, 14]); ctx.lineDashOffset = -t * 100;
    ctx.beginPath(); ctx.moveTo(520, 800); ctx.lineTo(lerp(520, 600, lp), 800); ctx.stroke(); ctx.restore();
  }
  chip(ctx, "SON ASSISTANT D'IA", W / 2, 1120, t, 10.3, C.white, 'center');
  ctx.restore();
}

// ------------------------------------------------------------------ S4 goal: factories + administrations, a sovereign AI (11.1 - 16.45)
function sGoal(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 11.1, 11.4));
  ctx.save(); ctx.translate((1 - enter) * W * 0.6, 0);
  popWord(ctx, 'OBJECTIF', 90, 370, 160, C.white, t, 11.15);
  popWord(ctx, "ÉQUIPER L'ALLEMAGNE", 90, 460, 66, C.grey, t, 11.6);
  const fk = sp(t, 12.3, SPRING.bouncy);
  if (fk > 0.001) { factory(ctx, 300, 770, 1.3 * fk, C.white); text(ctx, 'USINES', 300, 940, font(54, 400, D), C.white, 'center'); }
  const ak = sp(t, 13.5, SPRING.bouncy);
  if (ak > 0.001) { townhall(ctx, 780, 770, 1.3 * ak, C.grey); text(ctx, 'ADMINISTRATIONS', 780, 940, font(54, 400, D), C.grey, 'center'); }
  ctx.restore();
  stamp(ctx, 'IA SOUVERAINE', W / 2, 1140, 760, 120, t, 15.38, -0.05, C.red);
  source(ctx, 'Telekom, Mobile Europe, 20/11/2026', t, 12.0);
}

// ------------------------------------------------------------------ S5 hosted in Europe rather than in the US (16.45 - 18.75)
function sEurope(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 16.45, 16.75));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'HÉBERGÉE', 90, 370, 160, C.white, t, 16.5);
  const ek = sp(t, 16.6, SPRING.bouncy);
  ctx.save(); ctx.translate(310, 790); ctx.scale(0.6 + 0.4 * ek, 0.6 + 0.4 * ek);
  rrect(ctx, -210, -250, 420, 500, 30); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.red; ctx.stroke();
  server(ctx, 0, -30, 1, t); lock(ctx, 120, 110, 0.6, C.red);
  text(ctx, 'EUROPE', 0, 210, font(76, 400, D), C.white, 'center');
  ctx.restore();
  const uk = sp(t, 17.3, SPRING.bouncy);
  if (uk > 0.001) {
    ctx.save(); ctx.translate(780, 790); ctx.scale(0.6 + 0.4 * uk, 0.6 + 0.4 * uk); ctx.globalAlpha = clamp(uk * 2);
    rrect(ctx, -210, -250, 420, 500, 30); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = C.edge; ctx.stroke();
    ctx.globalAlpha *= 0.45; server(ctx, 0, -30, 1, 0); ctx.globalAlpha = clamp(uk * 2);
    text(ctx, 'ÉTATS-UNIS', 0, 210, font(70, 400, D), C.grey, 'center');
    const p = E.outCubic(prog(t, 18.0, 18.25));
    ctx.strokeStyle = C.red; ctx.lineWidth = 20; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-170, -200); ctx.lineTo(-170 + 340 * p, -200 + 400 * p); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
  chip(ctx, 'TES DONNÉES RESTENT EN EUROPE', W / 2, 1180, t, 17.1, C.white, 'center');
}

// ------------------------------------------------------------------ S6 September: 3 bn EUR raised, Samsung leads, ~21 bn value (18.75 - 25.45)
function sRaise(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 18.75, 19.05));
  ctx.save(); ctx.translate((1 - enter) * W * 0.6, 0);
  chip(ctx, 'SEPTEMBRE 2026', 90, 330, t, 18.8, C.red);
  popWord(ctx, 'MISTRAL A LEVÉ', 90, 470, 110, C.white, t, 19.0);
  const v = 3 * E.outCubic(prog(t, 19.9, 20.72));
  if (t >= 19.9) {
    ctx.save(); shakeAt(ctx, t, 20.72, 14);
    text(ctx, (t >= 20.72 ? '3' : v.toFixed(1).replace('.', ',')) + ' MDS €', 90, 700, font(230, 400, D), C.red);
    ctx.restore();
  }
  chip(ctx, 'SAMSUNG EN TÊTE', 90, 790, t, 22.2, C.white);
  const vk = E.outCubic(prog(t, 23.5, 24.2));
  if (t >= 23.4) {
    text(ctx, 'VALEUR', 90, 900, font(60, 400, D), C.grey);
    for (let i = 0; i < 7; i++) {
      const h = (60 + i * 30) * clamp(vk * 7 - i);
      rrect(ctx, 90 + i * 70, 1210 - h, 50, h, 10); ctx.fillStyle = i === 6 ? C.red : C.grey; ctx.fill();
    }
    ctx.save(); shakeAt(ctx, t, 24.2, 12);
    slam(ctx, '21 MDS €', 800, 1150, 150, C.white, t, 24.2);
    ctx.restore();
  }
  ctx.restore();
  source(ctx, 'Euronews 08/09/2026, Solutions Numériques', t, 20.0);
}

// ------------------------------------------------------------------ S7 caveat: 60x smaller than Anthropic (25.45 - 32.95)
function sNuance(ctx, t) {
  bg(ctx, t, 0);
  slam(ctx, 'NUANCE', W / 2, 360, 170, C.white, t, 25.5);
  ctx.save(); shakeAt(ctx, t, 26.84, 14);
  slam(ctx, 'PLUS DE 60 FOIS MOINS', W / 2, 500, 96, C.red, t, 26.84);
  ctx.restore();
  const base = 1190;
  const mk = sp(t, 25.6, SPRING.bouncy);
  if (mk > 0.001) {
    const s = 60 * mk;
    rrect(ctx, 170 - s / 2, base - s, s, s, 6); ctx.fillStyle = C.white; ctx.fill();
    text(ctx, 'MISTRAL', 170, base + 50, font(44, 400, D), C.white, 'center');
    text(ctx, '21 MDS €', 170, base - 70, font(40, 800, UI), C.grey, 'center');
  }
  const ak = E.outCubic(prog(t, 28.04, 30.9));
  if (t >= 28.0) {
    const s = lerp(60, 560, ak);
    const x = 680;
    rrect(ctx, x - s / 2, base - s, s, s, 20); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, 'ANTHROPIC', x, base + 50, font(44, 400, D), C.white, 'center');
    if (t >= 29.3) popWord(ctx, '(CLAUDE)', x, base - s + 90, 60, C.white, t, 29.3, 'center');
    if (t >= 30.78) {
      ctx.save(); shakeAt(ctx, t, 30.78, 16);
      slam(ctx, '1 600 MDS $', x, base - s / 2 + 60, 130, C.white, t, 30.78);
      ctx.restore();
    }
  }
  source(ctx, 'Anthropic : valeur diluée après son IPO (Brief IA, 21/11)', t, 28.3);
}

// ------------------------------------------------------------------ S8 advice: test Le Chat for free on a real task (32.95 - 36.45)
function sAdvice(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 32.95, 33.25));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'LE CONSEIL', 90, 370, 150, C.red, t, 33.0);
  popWord(ctx, 'TESTE LE CHAT', 90, 490, 110, C.white, t, 33.9);
  const wk = sp(t, 33.3, SPRING.gentle);
  ctx.save(); ctx.translate(W / 2, 850); ctx.scale(0.8 + 0.2 * wk, 0.8 + 0.2 * wk); ctx.globalAlpha = clamp(wk * 2);
  rrect(ctx, -400, -230, 800, 460, 36); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
  const msg = 'Résume ce contrat en 5 points';
  const n = Math.floor(msg.length * prog(t, 34.0, 35.0));
  rrect(ctx, -340, -170, 680, 100, 24); ctx.fillStyle = C.white; ctx.fill();
  text(ctx, msg.slice(0, n) + ((t * 2) % 1 < 0.5 && n < msg.length ? '|' : ''), -310, -105, font(40, 600, UI), C.ink);
  if (t >= 35.1) {
    for (let i = 0; i < 3; i++) {
      const k = clamp((t - 35.1 - i * 0.12) / 0.2);
      rrect(ctx, -340, -30 + i * 64, (560 - i * 80) * k, 36, 18); ctx.fillStyle = C.dim; ctx.fill();
    }
  }
  ctx.restore();
  chip(ctx, 'GRATUIT', 690, 600, t, 34.48, C.red);
  check(ctx, W - 180, 1170, 1.2, prog(t, 35.68, 36.0), C.red);
  popWord(ctx, 'SUR UNE VRAIE TÂCHE', 90, 1200, 84, C.white, t, 35.08);
  ctx.restore();
}

// ------------------------------------------------------------------ S9 question + end card (36.45 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 0);
  const up = E.inOutCubic(prog(t, 38.95, 39.3));
  ctx.save(); ctx.translate(0, -up * 1400);
  popWord(ctx, 'ET TOI ?', W / 2, 420, 150, C.grey, t, 36.48, 'center');
  popWord(ctx, 'TU FERAIS CONFIANCE À UNE', W / 2, 600, 72, C.white, t, 37.04, 'center');
  chip(ctx, 'IA AMÉRICAINE', 300, 1120, t, 37.4, C.white, 'center');
  chip(ctx, 'IA EUROPÉENNE', 780, 1120, t, 38.12, C.red, 'center');
  ctx.save(); shakeAt(ctx, t, 38.12, 14);
  slam(ctx, 'IA EUROPÉENNE ?', W / 2, 820, 150, C.red, t, 38.12);
  ctx.restore();
  popWord(ctx, 'Réponds en commentaire', W / 2, 960, 44, C.grey, t, 38.4, 'center', UI, 600);
  ctx.restore();
  if (t >= 38.97) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 39.05, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 39.25, 'center');
    const k = sp(t, 39.4, SPRING.bouncy);
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
    if (t < 4.26) sHook(ctx, t);
    else if (t < 8.4) sCheque(ctx, t);
    else if (t < 11.1) sStartup(ctx, t);
    else if (t < 16.45) sGoal(ctx, t);
    else if (t < 18.75) sEurope(ctx, t);
    else if (t < 25.45) sRaise(ctx, t);
    else if (t < 32.95) sNuance(ctx, t);
    else if (t < 36.45) sAdvice(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
