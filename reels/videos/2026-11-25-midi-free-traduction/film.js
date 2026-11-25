// Free Mobile lance « Traduction Live » : appels traduits en direct par l'IA (lancé le 24/11/2026) : pure function of time.
// Scenes are timed in SECONDS on the voice-over (audio/vo/words.json, placed +0.1 s);
// HITS are converted to beats (120 bpm, 0.5 s per beat) so sfx land on the same frames.
import * as M from './lib/motion.js';

const { W, H, E, prog, lerp, clamp, spring, SPRING, wobble, font, text, fill, rrect } = M;

const C = { ink: '#050506', red: '#FF1F3D', white: '#FFFFFF', grey: '#BEBEC4', dim: '#3A3A40', line: '#16080C', card: '#16161A', edge: '#2C2C33' };
const D = 'Display', UI = 'UI';
const MAXW = 900;
const sp = (t, t0, cfg = SPRING.snappy) => (t < t0 ? 0 : spring(t - t0, cfg));
const B = (s) => s / 0.5;

// ------------------------------------------------------------------ sound hits (beats)
const HITS = [
  [B(0.0), 'hook', 'impact'],
  [B(1.46), 'hotel', 'pop', { pitch: 'E5' }],
  [B(1.82), 'japon', 'pop', { pitch: 'G5' }],
  [B(2.84), 'francais', 'impact'],
  [B(3.78), 'cut date', 'whoosh', { len: 0.4 }],
  [B(4.16), '24 nov', 'impact'],
  [B(5.46), 'free', 'pop', { pitch: 'E5' }],
  [B(6.88), 'direct', 'blip', { pitch: 'A5' }],
  [B(7.68), 'cut ia', 'whoosh', { len: 0.4 }],
  [B(7.84), 'ia', 'pop', { pitch: 'C5' }],
  [B(8.48), '10', 'impact'],
  [B(9.7), 'premiere', 'thud', { pitch: 'C3' }],
  [B(10.78), 'cut prix', 'whoosh', { len: 0.4 }],
  [B(11.02), 'zero', 'impact'],
  [B(12.02), 'free max', 'pop', { pitch: 'E5' }],
  [B(12.72), 'pro max', 'pop', { pitch: 'G5' }],
  [B(13.8), 'cut appli', 'whoosh', { len: 0.4 }],
  [B(14.06), 'pas appli', 'thud', { pitch: 'C3' }],
  [B(15.06), 'diese 1', 'click'],
  [B(15.32), 'diese 2', 'click'],
  [B(16.72), 'cut demande', 'whoosh', { len: 0.4 }],
  [B(17.24), 'langue', 'blip', { pitch: 'A5' }],
  [B(18.0), 'chacun', 'pop', { pitch: 'E5' }],
  [B(18.28), 'entend', 'pop', { pitch: 'G5' }],
  [B(19.98), 'cut prive', 'whoosh', { len: 0.4 }],
  [B(20.74), 'prevenu', 'bell', { pitch: 'C6' }],
  [B(23.06), 'pas enregistre', 'impact'],
  [B(24.08), 'nuance', 'thud', { pitch: 'C3' }],
  [B(25.84), 'contresens', 'impact'],
  [B(27.46), 'sante', 'pop', { pitch: 'E5' }],
  [B(28.2), 'admin', 'pop', { pitch: 'G5' }],
  [B(28.94), 'cut conseil', 'whoosh', { len: 0.4 }],
  [B(30.1), 'attendez', 'type', { len: 1.4 }],
  [B(32.14), 'repondre', 'click'],
  [B(32.98), 'cut question', 'whoosh', { len: 0.4 }],
  [B(34.55), 'end card', 'impact'],
  [B(34.9), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ['Et si tu pouvais appeler', 0.1], ['un hôtel au Japon...', 1.32], ['en parlant français ?', 2.46],
  ['Depuis le 24 novembre,', 3.78], ['Free Mobile traduit', 5.46], ['les appels en direct', 6.34],
  ["grâce à l'IA, dans 10 langues.", 7.18],
  ['Une première en France,', 9.6], ['sans surcoût pour les forfaits', 10.78], ['Free Max et Free Pro Max.', 12.02],
  ["Pas d'appli : on tape ##", 13.8], ["pendant l'appel,", 15.62], ['on demande la langue,', 16.72], ["et chacun entend l'autre", 17.5], ['dans la sienne.', 18.9],
  ['Ton correspondant est prévenu,', 19.98], ['et Free assure que rien', 21.16], ["n'est enregistré.", 22.86],
  ['Nuance : la machine peut', 24.08], ['faire des contresens,', 25.56], ['à éviter pour la santé', 26.68], ["ou l'administratif.", 27.74],
  ['Conseil : attendez la fin', 28.94], ['de chaque traduction', 30.92], ['avant de répondre.', 31.72],
  ['Quelle langue te manque le plus ?', 32.98],
  ["Abonne-toi pour l'actu IA", 34.66], ['de chaque jour.', 36.02],
];
const CAP_Y = 1385;
function captions(ctx, t) {
  let i = -1;
  for (let k = 0; k < CAP.length; k++) if (t >= CAP[k][1] - 0.04) i = k;
  if (i < 0 || t > 37.4) return;
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
// largest size <= size whose text fits maxW
function fit(ctx, str, size, fam, weight, maxW = MAXW) {
  ctx.font = font(size, weight, fam);
  const w = ctx.measureText(str).width;
  return w > maxW ? Math.floor((size * maxW) / w) : size;
}
function popWord(ctx, str, x, y, size, color, t, t0, align = 'left', fam = D, weight = 400) {
  const k = sp(t, t0, SPRING.bouncy);
  size = fit(ctx, str, size, fam, weight);
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
  size = fit(ctx, str, size, D, 400);
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
// speech bubble with text; tail bottom-left or bottom-right
function bubble(ctx, str, x, y, color, txt, t, t0, tail = 'left', size = 40) {
  const k = sp(t, t0, SPRING.bouncy);
  if (k <= 0.001) return;
  const f = font(size, 800, UI);
  ctx.font = f; const w = ctx.measureText(str).width + 60, h = size + 50;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha = clamp(k * 2);
  rrect(ctx, -w / 2, -h / 2, w, h, 26); ctx.fillStyle = color; ctx.fill();
  const tx = tail === 'left' ? -w / 2 + 40 : w / 2 - 40, dir = tail === 'left' ? -1 : 1;
  ctx.beginPath(); ctx.moveTo(tx - 16, h / 2 - 2); ctx.lineTo(tx + dir * 26, h / 2 + 30); ctx.lineTo(tx + 16, h / 2 - 2); ctx.closePath(); ctx.fill();
  text(ctx, str, 0, size * 0.36, f, txt, 'center');
  ctx.restore();
}
// handset icon
function handset(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineWidth = 18; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, 0, 50, Math.PI * 0.75, Math.PI * 1.75); ctx.stroke();
  ctx.fillStyle = color;
  ctx.save(); ctx.rotate(Math.PI * 0.75); rrect(ctx, 38, -20, 34, 40, 10); ctx.fill(); ctx.restore();
  ctx.save(); ctx.rotate(Math.PI * 1.75); rrect(ctx, 38, -20, 34, 40, 10); ctx.fill(); ctx.restore();
  ctx.restore();
}
// smartphone with a call screen
function phone(ctx, x, y, s, label, sub, t, ring) {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -170, -320, 340, 640, 50); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.grey; ctx.stroke();
  rrect(ctx, -50, -296, 100, 18, 9); ctx.fillStyle = C.edge; ctx.fill();
  ctx.fillStyle = C.edge; ctx.beginPath(); ctx.arc(0, -150, 70, 0, M.TAU); ctx.fill();
  text(ctx, label, 0, 20, font(54, 400, D), C.white, 'center');
  text(ctx, sub, 0, 66, font(28, 600, UI), C.grey, 'center');
  if (t >= ring) {
    for (let i = 0; i < 3; i++) {
      const ph = ((t - ring) * 0.9 + i / 3) % 1;
      ctx.save(); ctx.globalAlpha = (1 - ph) * 0.8; ctx.strokeStyle = C.red; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(0, -150, 70 + ph * 60, 0, M.TAU); ctx.stroke(); ctx.restore();
    }
  }
  rrect(ctx, -60, 170, 120, 120, 60); ctx.fillStyle = C.red; ctx.fill();
  handset(ctx, 0, 230, 0.55, C.white);
  ctx.restore();
}
function person(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(0, -60, 55, 0, M.TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-95, 110); ctx.quadraticCurveTo(-95, 10, 0, 10); ctx.quadraticCurveTo(95, 10, 95, 110); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function key(ctx, str, x, y, s, lit) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -65, -65, 130, 130, 65); ctx.fillStyle = lit ? C.red : C.card; ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = lit ? C.red : C.edge; ctx.stroke();
  text(ctx, str, 0, 26, font(76, 400, D), lit ? C.white : C.grey, 'center');
  ctx.restore();
}
function cross(ctx, x, y, r, p, color = C.red, lw = 16) {
  if (p <= 0) return;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round';
  const a = clamp(p * 2), b = clamp(p * 2 - 1);
  ctx.beginPath(); ctx.moveTo(x - r, y - r); ctx.lineTo(x - r + 2 * r * a, y - r + 2 * r * a); ctx.stroke();
  if (b > 0) { ctx.beginPath(); ctx.moveTo(x + r, y - r); ctx.lineTo(x + r - 2 * r * b, y - r + 2 * r * b); ctx.stroke(); }
  ctx.restore();
}

// ------------------------------------------------------------------ S1 hook: call Japan in French (0 - 3.78)
function sHook(ctx, t) {
  bg(ctx, t, 0);
  popWord(ctx, 'APPELER LE JAPON', W / 2, 330, 150, C.white, t, -0.3, 'center');
  const pk = sp(t, -0.4, SPRING.gentle);
  ctx.save(); ctx.globalAlpha = clamp(pk * 2);
  phone(ctx, 270, 720, 0.92 * pk, 'HÔTEL', 'Tokyo, Japon', t, 1.46);
  ctx.restore();
  bubble(ctx, 'Bonjour !', 760, 560, C.white, C.ink, t, 1.82, 'left', 52);
  bubble(ctx, 'Une chambre', 760, 720, C.card, C.white, t, 2.2, 'left', 44);
  bubble(ctx, 'pour 2 nuits ?', 760, 860, C.card, C.white, t, 2.5, 'left', 44);
  ctx.save(); shakeAt(ctx, t, 2.84, 16);
  slam(ctx, 'EN FRANÇAIS ?', W / 2, 1230, 170, C.red, t, 2.84);
  ctx.restore();
}

// ------------------------------------------------------------------ S2 since 24 Nov, Free translates calls live (3.78 - 7.68)
function sDate(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 3.78, 4.08));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'DEPUIS LE', W / 2, 330, 100, C.grey, t, 3.8, 'center');
  ctx.save(); shakeAt(ctx, t, 4.16, 14);
  slam(ctx, '24 NOVEMBRE', W / 2, 500, 180, C.white, t, 4.16);
  ctx.restore();
  const fk = sp(t, 5.46, SPRING.bouncy);
  if (fk > 0.001) {
    ctx.save(); ctx.translate(W / 2, 700); ctx.scale(fk, fk);
    rrect(ctx, -300, -80, 600, 160, 80); ctx.fillStyle = C.red; ctx.fill();
    handset(ctx, -200, 0, 0.6, C.white);
    text(ctx, 'FREE MOBILE', 50, 32, font(90, 400, D), C.white, 'center');
    ctx.restore();
  }
  popWord(ctx, 'TRADUIT LES APPELS', W / 2, 940, 110, C.white, t, 5.74, 'center');
  const lk = sp(t, 6.88, SPRING.bouncy);
  if (lk > 0.001) {
    ctx.save(); ctx.translate(W / 2, 1100); ctx.scale(lk, lk);
    rrect(ctx, -230, -60, 460, 120, 60); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.red; ctx.stroke();
    const pulse = 0.6 + 0.4 * Math.abs(Math.sin((t - 6.88) * 4));
    ctx.fillStyle = C.red; ctx.globalAlpha = pulse; ctx.beginPath(); ctx.arc(-150, 0, 22, 0, M.TAU); ctx.fill(); ctx.globalAlpha = 1;
    text(ctx, 'EN DIRECT', 30, 26, font(76, 400, D), C.white, 'center');
    ctx.restore();
  }
  ctx.restore();
  source(ctx, 'Free, via Le Monde Informatique, 24/11/2026', t, 5.0);
}

// ------------------------------------------------------------------ S3 AI, 10 languages, a first in France (7.68 - 10.78)
const LANGS = ['FRANÇAIS', 'ANGLAIS', 'ESPAGNOL', 'ALLEMAND', 'ITALIEN', 'PORTUGAIS', 'RUSSE', 'CHINOIS', 'CORÉEN', 'JAPONAIS'];
function sLangs(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 7.68, 7.98));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  chip(ctx, "GRÂCE À L'IA", 90, 300, t, 7.7, C.white);
  ctx.save(); shakeAt(ctx, t, 8.48, 16);
  slam(ctx, '10', 270, 700, 380, C.red, t, 8.48);
  ctx.restore();
  popWord(ctx, 'LANGUES', 270, 830, 110, C.white, t, 8.74, 'center');
  LANGS.forEach((l, i) => {
    const t0 = 7.75 + i * 0.07;
    const k = sp(t, t0, SPRING.bouncy);
    if (k <= 0.001) return;
    const y = 370 + i * 64;
    ctx.save(); ctx.translate(540 + (1 - k) * 200, y); ctx.globalAlpha = clamp(k * 2);
    rrect(ctx, 0, -28, 440, 54, 27); ctx.fillStyle = i === 9 ? C.red : C.card; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = i === 9 ? C.red : C.edge; ctx.stroke();
    text(ctx, l, 220, 13, font(34, 800, UI), C.white, 'center');
    ctx.restore();
  });
  ctx.save(); shakeAt(ctx, t, 9.7, 14);
  stamp(ctx, 'UNE PREMIÈRE EN FRANCE', W / 2, 1150, 900, 100, t, 9.7, -0.04, C.white);
  ctx.restore();
  ctx.restore();
  source(ctx, 'Univers Freebox, IT-Connect, 24/11/2026', t, 8.0);
}

// ------------------------------------------------------------------ S4 no extra cost, Free Max / Free Pro Max (10.78 - 13.8)
function sPrice(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 10.78, 11.08));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'SANS SURCOÛT', W / 2, 330, 100, C.grey, t, 10.8, 'center');
  ctx.save(); shakeAt(ctx, t, 11.02, 16);
  slam(ctx, '0 EURO', W / 2, 540, 250, C.red, t, 11.02);
  ctx.restore();
  popWord(ctx, 'DE PLUS', W / 2, 650, 100, C.white, t, 11.3, 'center');
  const cards = [['FREE MAX', 12.02, 290], ['FREE PRO MAX', 12.72, 790]];
  for (const [lab, t0, x] of cards) {
    const k = sp(t, t0, SPRING.bouncy);
    if (k <= 0.001) continue;
    ctx.save(); ctx.translate(x, 920); ctx.scale(k, k); ctx.rotate((x < 500 ? -1 : 1) * 0.03);
    rrect(ctx, -220, -150, 440, 300, 30); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.red; ctx.stroke();
    text(ctx, 'FORFAIT', 0, -70, font(30, 800, UI), C.grey, 'center');
    text(ctx, lab, 0, 20, font(fit(ctx, lab, 84, D, 400, 380), 400, D), C.white, 'center');
    rrect(ctx, -150, 60, 300, 56, 28); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, 'INCLUS', 0, 101, font(36, 800, UI), C.white, 'center');
    ctx.restore();
  }
  ctx.restore();
  source(ctx, 'Free, via IT-Connect, 24/11/2026', t, 11.4);
}

// ------------------------------------------------------------------ S5 no app, type ## during the call (13.8 - 16.72)
function sKeys(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 13.8, 14.1));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  const ak = sp(t, 13.85, SPRING.bouncy);
  if (ak > 0.001) {
    ctx.save(); ctx.translate(180, 330); ctx.scale(ak * 0.8, ak * 0.8);
    rrect(ctx, -90, -90, 180, 180, 44); ctx.fillStyle = C.edge; ctx.fill();
    rrect(ctx, -40, -40, 80, 80, 16); ctx.fillStyle = C.grey; ctx.fill();
    ctx.restore();
    cross(ctx, 180, 330, 90, prog(t, 14.06, 14.4));
  }
  popWord(ctx, "PAS D'APPLI", 320, 380, 140, C.white, t, 14.0);
  const kk = sp(t, 14.6, SPRING.gentle);
  const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  const flash = (t >= 15.06 && t < 15.26) || (t >= 15.32 && t < 15.52);
  if (kk > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(kk * 2);
    labels.forEach((l, i) => {
      const cx = 180 + (i % 3) * 150, cy = 560 + Math.floor(i / 3) * 145;
      const press = l === '#' && flash ? 0.88 : 1;
      key(ctx, l, cx, cy, kk * press, l === '#' && t >= 15.06);
    });
    ctx.restore();
  }
  const n = (t >= 15.06 ? 1 : 0) + (t >= 15.32 ? 1 : 0);
  if (n > 0) {
    const k = sp(t, 15.06, SPRING.bouncy);
    ctx.save(); ctx.translate(820, 740); ctx.scale(k, k);
    rrect(ctx, -170, -130, 340, 260, 36); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, '#'.repeat(n), 0, 70, font(220, 400, D), C.white, 'center');
    ctx.restore();
  }
  popWord(ctx, "PENDANT", 820, 960, 80, C.white, t, 15.62, 'center');
  popWord(ctx, "L'APPEL", 820, 1050, 80, C.red, t, 15.92, 'center');
  ctx.restore();
}

// ------------------------------------------------------------------ S6 ask the language, each hears the other in theirs (16.72 - 19.98)
function sDuo(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 16.72, 17.02));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  bubble(ctx, '« Ok Free, traduis en... »', W / 2, 320, C.white, C.ink, t, 16.74, 'left', 50);
  chip(ctx, 'ON DEMANDE LA LANGUE', W / 2, 470, t, 17.24, C.red, 'center');
  const pa = sp(t, 17.5, SPRING.bouncy), pb = sp(t, 17.7, SPRING.bouncy);
  if (pa > 0.001) person(ctx, 200, 880, 1.1 * pa, C.grey);
  if (pb > 0.001) person(ctx, 880, 880, 1.1 * pb, C.red);
  const lp = E.outCubic(prog(t, 17.9, 18.3));
  if (lp > 0) {
    ctx.save(); ctx.setLineDash([16, 14]); ctx.lineDashOffset = -t * 60; ctx.strokeStyle = C.white; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(330, 840); ctx.lineTo(330 + 420 * lp, 840); ctx.stroke(); ctx.restore();
    const mk = sp(t, 18.2, SPRING.bouncy);
    if (mk > 0.001) {
      ctx.save(); ctx.translate(540, 840); ctx.scale(mk, mk);
      rrect(ctx, -70, -50, 140, 100, 30); ctx.fillStyle = C.red; ctx.fill();
      text(ctx, 'IA', 0, 22, font(64, 400, D), C.white, 'center');
      ctx.restore();
    }
  }
  bubble(ctx, 'FRANÇAIS', 230, 650, C.card, C.white, t, 18.0, 'left', 40);
  bubble(ctx, 'JAPONAIS', 850, 650, C.card, C.white, t, 18.28, 'right', 40);
  popWord(ctx, 'CHACUN DANS SA LANGUE', W / 2, 1160, 96, C.white, t, 18.9, 'center');
  ctx.restore();
}

// ------------------------------------------------------------------ S7 warned, nothing recorded (19.98 - 24.08)
function sPrivacy(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 19.98, 20.28));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  const nk = sp(t, 20.0, SPRING.bouncy);
  if (nk > 0.001) {
    ctx.save(); ctx.translate(W / 2, 400 + (1 - nk) * -80); ctx.globalAlpha = clamp(nk * 2);
    rrect(ctx, -440, -90, 880, 180, 36); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
    rrect(ctx, -400, -50, 100, 100, 26); ctx.fillStyle = C.red; ctx.fill();
    handset(ctx, -350, 0, 0.4, C.white);
    text(ctx, 'Appel traduit par une IA', -270, -10, font(40, 800, UI), C.white);
    text(ctx, 'Ton correspondant est averti', -270, 42, font(32, 600, UI), C.grey);
    ctx.restore();
  }
  chip(ctx, 'PRÉVENU', W / 2, 570, t, 20.74, C.white, 'center');
  const rk = sp(t, 21.56, SPRING.bouncy);
  if (rk > 0.001) {
    ctx.save(); ctx.translate(W / 2, 820); ctx.scale(rk, rk);
    rrect(ctx, -220, -110, 440, 220, 40); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.grey; ctx.stroke();
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(-100, 0, 46, 0, M.TAU); ctx.fill();
    text(ctx, 'REC', 60, 42, font(120, 400, D), C.white, 'center');
    ctx.restore();
  }
  ctx.save(); shakeAt(ctx, t, 23.06, 16);
  stamp(ctx, 'PAS ENREGISTRÉ', W / 2, 1080, 780, 120, t, 23.06, -0.06, C.red);
  ctx.restore();
  popWord(ctx, 'SELON FREE', W / 2, 1240, 46, C.grey, t, 23.3, 'center', UI, 800);
  ctx.restore();
}

// ------------------------------------------------------------------ S8 caveat: mistranslations; avoid health / admin (24.08 - 28.94)
function sNuance(ctx, t) {
  bg(ctx, t, 1);
  slam(ctx, 'NUANCE', W / 2, 380, 180, C.white, t, 24.08);
  const bk = sp(t, 24.5, SPRING.gentle);
  if (bk > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(bk * 2); ctx.translate(W / 2, 600);
    rrect(ctx, -430, -100, 860, 200, 34); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
    text(ctx, 'TRADUCTION', -380, -40, font(30, 800, UI), C.grey);
    const lp = prog(t, 24.9, 25.7);
    for (let i = 0; i < 2; i++) {
      const p = clamp(lp * 2 - i);
      if (p <= 0) continue;
      ctx.fillStyle = C.white; rrect(ctx, -380, -5 + i * 50, (i ? 460 : 740) * p, 24, 12); ctx.fill();
    }
    if (t >= 25.84) {
      const wp = prog(t, 25.84, 26.2);
      ctx.strokeStyle = C.red; ctx.lineWidth = 6; ctx.beginPath();
      for (let x = 0; x <= 400 * wp; x += 4) ctx.lineTo(-100 + x, 80 + 8 * Math.sin(x / 10));
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.save(); shakeAt(ctx, t, 25.84, 14);
  slam(ctx, 'CONTRESENS', W / 2, 840, 150, C.red, t, 25.84);
  ctx.restore();
  popWord(ctx, 'À ÉVITER POUR', W / 2, 970, 70, C.grey, t, 26.7, 'center');
  const items = [['SANTÉ', 270, 27.46], ['ADMINISTRATIF', 700, 28.2]];
  for (const [lab, x, t0] of items) {
    const k = sp(t, t0, SPRING.bouncy);
    if (k <= 0.001) continue;
    ctx.save(); ctx.translate(x, 1110); ctx.scale(k, k);
    const f = font(48, 800, UI); ctx.font = f; const w = ctx.measureText(lab).width + 70;
    rrect(ctx, -w / 2, -50, w, 100, 50); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.red; ctx.stroke();
    text(ctx, lab, 0, 17, f, C.white, 'center');
    ctx.restore();
  }
}

// ------------------------------------------------------------------ S9 advice: wait for the end of each translation (28.94 - 32.98)
function sAdvice(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 28.94, 29.24));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'LE CONSEIL', 90, 340, 150, C.red, t, 28.96);
  popWord(ctx, 'ATTENDS LA FIN', 90, 490, 110, C.white, t, 30.1);
  const ck = sp(t, 29.3, SPRING.gentle);
  if (ck > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(ck * 2); ctx.translate(W / 2, 720);
    rrect(ctx, -430, -120, 860, 240, 36); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
    const p = E.inOutCubic(prog(t, 30.1, 31.9));
    text(ctx, p < 1 ? 'Traduction en cours...' : 'Traduction terminée', -380, -30, font(40, 800, UI), p < 1 ? C.grey : C.white);
    rrect(ctx, -380, 20, 760, 50, 25); ctx.fillStyle = C.ink; ctx.fill();
    rrect(ctx, -380, 20, Math.max(50, 760 * p), 50, 25); ctx.fillStyle = C.red; ctx.fill();
    ctx.restore();
  }
  ctx.restore();
  const rk = sp(t, 32.0, SPRING.bouncy);
  if (rk > 0.001) {
    const press = t >= 32.14 ? 1 - 0.1 * Math.exp(-(t - 32.14) * 8) : 1;
    ctx.save(); ctx.translate(W / 2, 1050); ctx.scale(rk * press, rk * press);
    rrect(ctx, -320, -80, 640, 160, 80); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, 'PUIS RÉPONDS', 0, 32, font(96, 400, D), C.white, 'center');
    ctx.restore();
  }
}

// ------------------------------------------------------------------ S10 question + end card (32.98 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 1);
  const up = E.inOutCubic(prog(t, 34.45, 34.8));
  ctx.save(); ctx.translate(0, -up * 1400);
  slam(ctx, 'ET TOI ?', W / 2, 460, 220, C.white, t, 32.98);
  popWord(ctx, 'QUELLE LANGUE', W / 2, 640, 120, C.white, t, 33.26, 'center');
  popWord(ctx, 'TE MANQUE ?', W / 2, 770, 120, C.red, t, 33.56, 'center');
  ['ANGLAIS', 'ESPAGNOL', 'CHINOIS', 'JAPONAIS'].forEach((l, i) => {
    chip(ctx, l, 290 + (i % 2) * 500, 920 + Math.floor(i / 2) * 110, t, 33.7 + i * 0.12, i % 2 ? C.red : C.white, 'center');
  });
  ctx.restore();
  if (t >= 34.45) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 34.55, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 34.75, 'center');
    const k = sp(t, 34.9, SPRING.bouncy);
    ctx.save(); ctx.translate(W / 2, 1010); ctx.scale(k, k);
    rrect(ctx, -280, -66, 560, 124, 62); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, 'Abonne-toi', 0, 18, font(60, 800, UI), C.white, 'center');
    ctx.restore();
    popWord(ctx, 'Réponds en commentaire', W / 2, 1180, 44, C.grey, t, 35.2, 'center', UI, 600);
    ctx.restore();
  }
}

M.film({
  fonts: [font(100, 400, D), font(40, 400, UI), font(40, 600, UI), font(40, 800, UI)],
  hits: HITS,
  draw(ctx, u, t) {
    if (t < 3.78) sHook(ctx, t);
    else if (t < 7.68) sDate(ctx, t);
    else if (t < 10.78) sLangs(ctx, t);
    else if (t < 13.8) sPrice(ctx, t);
    else if (t < 16.72) sKeys(ctx, t);
    else if (t < 19.98) sDuo(ctx, t);
    else if (t < 24.08) sPrivacy(ctx, t);
    else if (t < 28.94) sNuance(ctx, t);
    else if (t < 32.98) sAdvice(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
