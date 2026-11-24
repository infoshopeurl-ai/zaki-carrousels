// « Prouver qu'on n'a pas utilisé l'IA » : affaire Orélien / Goncourt, détecteurs d'IA faillibles (24/11/2026) : pure function of time.
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
  [B(1.22), 'seul', 'pop', { pitch: 'E5' }],
  [B(2.36), 'prouver', 'pop', { pitch: 'G5' }],
  [B(3.18), 'triche', 'impact'],
  [B(4.06), 'cut ecrivains', 'whoosh', { len: 0.4 }],
  [B(5.34), 'reel', 'thud', { pitch: 'C3' }],
  [B(6.14), 'cut septembre', 'whoosh', { len: 0.4 }],
  [B(6.26), 'septembre', 'impact'],
  [B(7.2), 'roman', 'pop', { pitch: 'E5' }],
  [B(8.74), 'retire', 'impact'],
  [B(10.86), 'cut detecteur', 'whoosh', { len: 0.4 }],
  [B(11.9), 'pangram', 'blip', { pitch: 'A5' }],
  [B(13.48), 'machine', 'impact'],
  [B(14.24), 'cut nie', 'whoosh', { len: 0.4 }],
  [B(14.58), 'nie', 'thud', { pitch: 'C3' }],
  [B(16.5), '2019', 'pop', { pitch: 'E5' }],
  [B(17.66), 'chatgpt', 'pop', { pitch: 'G5' }],
  [B(18.86), 'cut hic', 'whoosh', { len: 0.4 }],
  [B(20.68), 'trompent', 'impact'],
  [B(22.78), '1 sur 10000', 'blip', { pitch: 'C6' }],
  [B(23.74), 'mais', 'whoosh', { len: 0.3 }],
  [B(25.54), '2 pourcent', 'impact'],
  [B(26.18), 'cut logiciels', 'whoosh', { len: 0.4 }],
  [B(27.76), 'rec', 'click'],
  [B(28.24), 'etape 1', 'pop', { pitch: 'C5' }],
  [B(28.48), 'etape 2', 'pop', { pitch: 'E5' }],
  [B(28.96), 'etape 3', 'pop', { pitch: 'G5' }],
  [B(29.96), 'nuance', 'thud', { pitch: 'C3' }],
  [B(31.14), 'rien prouve', 'impact'],
  [B(34.12), 'cut conseil', 'whoosh', { len: 0.4 }],
  [B(35.5), 'brouillons', 'type', { len: 0.5 }],
  [B(36.24), 'historique', 'click'],
  [B(36.82), 'garde tout', 'impact'],
  [B(37.64), 'cut question', 'whoosh', { len: 0.4 }],
  [B(38.8), 'end card', 'impact'],
  [B(39.2), 'abonne', 'bell', { pitch: 'E6' }],
];

// ------------------------------------------------------------------ captions (script text, VO times)
const CAP = [
  ['Écrire un livre tout seul...', 0.1], ["et devoir prouver qu'on n'a pas triché.", 1.92],
  ["Pour les écrivains, c'est devenu réel.", 4.06],
  ['En septembre, le roman de Thélyson Orélien', 6.14], ['a été retiré de la sélection du Goncourt.', 8.38],
  ["Un détecteur d'IA, Pangram,", 10.86], ['le jugeait écrit par une machine.', 12.58],
  ["L'auteur nie,", 14.24], ['et dit avoir fini son manuscrit en 2019,', 14.88], ['avant ChatGPT.', 17.42],
  ['Le hic : ces détecteurs se trompent.', 18.86],
  ['Pangram annonce une erreur sur 10 000,', 21.44], ['mais une étude de 2025 en a trouvé 2 %.', 23.74],
  ['Du coup, des logiciels enregistrent', 26.18], ["chaque étape de l'écriture.", 28.24],
  ["Nuance : rien n'est prouvé,", 29.96], ["ni dans un sens ni dans l'autre.", 31.76],
  ['Le conseil :', 34.12], ['garde tes brouillons', 34.94], ["et l'historique de tes fichiers.", 35.92],
  ["On t'a déjà soupçonné ?", 37.64],
  ["Abonne-toi pour l'actu IA", 38.9], ['de chaque jour.', 40.18],
];
const CAP_Y = 1385;
function captions(ctx, t) {
  let i = -1;
  for (let k = 0; k < CAP.length; k++) if (t >= CAP[k][1] - 0.04) i = k;
  if (i < 0 || t > 41.6) return;
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

// ------------------------------------------------------------------ scene props
// a sheet of paper whose lines write themselves (p: 0..1)
function sheet(ctx, x, y, w, h, p, lines = 7, color = C.white) {
  rrect(ctx, x - w / 2, y - h / 2, w, h, 20); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
  const lh = (h - 80) / lines;
  for (let i = 0; i < lines; i++) {
    const q = clamp(p * lines - i);
    if (q <= 0) continue;
    const lw = (w - 80) * (i === lines - 1 ? 0.55 : 0.9 - 0.12 * hash01(i, 3));
    ctx.fillStyle = color; rrect(ctx, x - w / 2 + 40, y - h / 2 + 40 + i * lh, lw * q, Math.min(18, lh * 0.45), 9); ctx.fill();
  }
}
// a pen whose tip sits at (x, y)
function pen(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.7); ctx.scale(s, s);
  ctx.fillStyle = color; rrect(ctx, 14, -14, 170, 28, 10); ctx.fill();
  ctx.fillStyle = C.red; rrect(ctx, 150, -16, 40, 32, 8); ctx.fill();
  ctx.fillStyle = C.grey; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(16, -12); ctx.lineTo(16, 12); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// closed book seen from the front
function book(ctx, x, y, s, title1, title2, author, color = C.white) {
  if (s <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -180, -250, 360, 500, 18); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = color; ctx.stroke();
  ctx.fillStyle = C.red; ctx.fillRect(-180, -250, 34, 500);
  text(ctx, title1, 16, -110, font(62, 400, D), C.white, 'center');
  text(ctx, title2, 16, -50, font(62, 400, D), C.white, 'center');
  ctx.fillStyle = C.edge; ctx.fillRect(-90, 10, 212, 4);
  text(ctx, author, 16, 80, font(32, 800, UI), C.grey, 'center');
  ctx.restore();
}
function person(ctx, x, y, s, color) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(0, -70, 42, 0, M.TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-70, 70); ctx.quadraticCurveTo(-70, -10, 0, -10); ctx.quadraticCurveTo(70, -10, 70, 70); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function clockIcon(ctx, x, y, r, color) {
  ctx.save(); ctx.translate(x, y);
  ctx.strokeStyle = color; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, 0, r, 0, M.TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r * 0.6); ctx.moveTo(0, 0); ctx.lineTo(r * 0.45, r * 0.2); ctx.stroke();
  ctx.restore();
}

// ------------------------------------------------------------------ S1 hook: write alone, then prove you didn't cheat (0 - 4.06)
function sHook(ctx, t) {
  bg(ctx, t, 0);
  ctx.save();
  shakeAt(ctx, t, 3.18, 16);
  popWord(ctx, 'ÉCRIRE SEUL', 90, 330, 160, C.white, t, -0.3);
  const wp = prog(t, -0.2, 3.0);
  sheet(ctx, 380, 700, 540, 560, wp, 7);
  // the pen follows the line being written
  const li = Math.min(6, Math.floor(wp * 7)), lq = clamp(wp * 7 - li);
  const px = 380 - 270 + 40 + 460 * 0.85 * lq, py = 700 - 280 + 40 + li * (480 / 7) + 8;
  pen(ctx, px, py, 1.1, C.grey);
  popWord(ctx, 'ET', 720, 520, 110, C.grey, t, 1.95);
  popWord(ctx, 'PROUVER', 700, 640, 120, C.red, t, 2.36);
  stamp(ctx, 'PAS TRICHÉ ?', W / 2, 1150, 760, 130, t, 3.18, -0.06, C.red);
  ctx.restore();
}

// ------------------------------------------------------------------ S2 for writers, it's real now (4.06 - 6.14)
function sWriters(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 4.06, 4.36));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'LES ÉCRIVAINS', W / 2, 360, 150, C.white, t, 4.1, 'center');
  for (let i = 0; i < 5; i++) {
    const k = sp(t, 4.3 + i * 0.12, SPRING.bouncy);
    if (k <= 0.001) continue;
    ctx.save(); ctx.globalAlpha = clamp(k * 2);
    person(ctx, 180 + i * 180, 700 + (1 - k) * 80, 1.0, i === 2 ? C.red : C.dim);
    ctx.restore();
  }
  ctx.save(); shakeAt(ctx, t, 5.34, 16);
  slam(ctx, "C'EST RÉEL", W / 2, 1060, 190, C.red, t, 5.34);
  ctx.restore();
  ctx.restore();
}

// ------------------------------------------------------------------ S3 September: the novel removed from the Goncourt list (6.14 - 10.86)
function sGoncourt(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 6.14, 6.44));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  ctx.save(); shakeAt(ctx, t, 6.26, 14);
  slam(ctx, 'SEPTEMBRE 2026', W / 2, 330, 130, C.white, t, 6.26);
  ctx.restore();
  const bk = sp(t, 7.2, SPRING.bouncy);
  book(ctx, 280, 720, 0.82 * bk, "C'ÉTAIT ÇA", 'OU MOURIR', 'Thélyson Orélien');
  const lk = sp(t, 7.5, SPRING.gentle);
  if (lk > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(lk * 2); ctx.translate((1 - lk) * 120, 0);
    rrect(ctx, 520, 470, 480, 520, 26); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
    text(ctx, 'SÉLECTION', 760, 550, font(58, 400, D), C.white, 'center');
    text(ctx, 'GONCOURT', 760, 610, font(58, 400, D), C.red, 'center');
    for (let i = 0; i < 5; i++) {
      const y = 680 + i * 62;
      const hot = i === 2;
      ctx.fillStyle = hot ? C.white : C.dim; rrect(ctx, 570, y, hot ? 300 : 340 - i * 20, 22, 11); ctx.fill();
      if (hot) {
        const sk = E.outCubic(prog(t, 8.74, 9.1));
        if (sk > 0) { ctx.strokeStyle = C.red; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(555, y + 11); ctx.lineTo(555 + 340 * sk, y + 11); ctx.stroke(); }
      }
    }
    ctx.restore();
  }
  ctx.save(); shakeAt(ctx, t, 8.74, 16);
  stamp(ctx, 'RETIRÉ', W / 2, 1140, 520, 130, t, 8.74, -0.06, C.red);
  ctx.restore();
  ctx.restore();
  source(ctx, 'Académie Goncourt, 25/09/2026, via L-Post', t, 7.4);
}

// ------------------------------------------------------------------ S4 an AI detector scans it: "written by a machine" (10.86 - 14.24)
function sScan(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 10.86, 11.16));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, "DÉTECTEUR D'IA", 90, 330, 130, C.white, t, 10.9);
  sheet(ctx, W / 2, 700, 760, 520, 1, 7, C.grey);
  const sp1 = prog(t, 11.1, 13.3);
  if (sp1 > 0 && sp1 < 1) {
    const y = 700 - 260 + 520 * ((sp1 * 2) % 1);
    ctx.save(); ctx.fillStyle = 'rgba(255,31,61,0.18)'; ctx.fillRect(W / 2 - 380, 440, 760, y - 440);
    ctx.fillStyle = C.red; ctx.fillRect(W / 2 - 400, y - 4, 800, 8); ctx.restore();
  }
  chip(ctx, 'PANGRAM', W / 2, 470, t, 11.9, C.white, 'center');
  ctx.save(); shakeAt(ctx, t, 13.48, 16);
  if (t >= 13.3) { ctx.save(); ctx.fillStyle = 'rgba(255,31,61,0.28)'; rrect(ctx, W / 2 - 380, 440, 760, 520, 20); ctx.fill(); ctx.restore(); }
  stamp(ctx, 'ÉCRIT PAR UNE MACHINE', W / 2, 1140, 900, 96, t, 13.48, -0.05, C.red);
  ctx.restore();
  ctx.restore();
}

// ------------------------------------------------------------------ S5 he denies: manuscript finished in 2019, before ChatGPT (14.24 - 18.86)
function sDeny(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 14.24, 14.54));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  ctx.save(); shakeAt(ctx, t, 14.58, 14);
  slam(ctx, "L'AUTEUR NIE", W / 2, 380, 170, C.white, t, 14.58);
  ctx.restore();
  chip(ctx, "« JAMAIS UTILISÉ L'IA »", W / 2, 500, t, 14.9, C.red, 'center');
  const lp = E.outCubic(prog(t, 15.0, 16.4));
  const x0 = 110, x1 = 970, y = 800;
  ctx.save(); ctx.strokeStyle = C.edge; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, lp), y); ctx.stroke(); ctx.restore();
  const X = (yr) => lerp(x0, x1, (yr - 2018) / 6);
  for (let yr = 2018; yr <= 2024; yr++) {
    if (X(yr) > lerp(x0, x1, lp) + 1) continue;
    ctx.fillStyle = C.dim; ctx.fillRect(X(yr) - 3, y - 18, 6, 36);
  }
  const a = sp(t, 16.5, SPRING.bouncy);
  if (a > 0.001) {
    ctx.save(); ctx.translate(X(2019), y); ctx.scale(a, a);
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(0, 0, 26, 0, M.TAU); ctx.fill();
    text(ctx, '2019', 0, -150, font(110, 400, D), C.white, 'center');
    text(ctx, 'Manuscrit fini', 0, -70, font(38, 800, UI), C.grey, 'center');
    ctx.restore();
  }
  const b = sp(t, 17.66, SPRING.bouncy);
  if (b > 0.001) {
    const xc = X(2022.9);
    ctx.save(); ctx.translate(xc, y); ctx.scale(b, b);
    ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, 26, 0, M.TAU); ctx.fill();
    text(ctx, 'CHATGPT', 0, 140, font(100, 400, D), C.red, 'center');
    text(ctx, 'Fin 2022', 0, 200, font(38, 800, UI), C.grey, 'center');
    ctx.restore();
  }
  chip(ctx, 'AVANT', (X(2019) + X(2022.9)) / 2, 660, t, 17.42, C.white, 'center');
  ctx.restore();
  source(ctx, 'Thélyson Orélien à Libération, via L-Post, 28/09/2026', t, 15.0);
}

// ------------------------------------------------------------------ S6 the catch: detectors are wrong. 1 in 10,000 vs 2 % (18.86 - 26.18)
function sErrors(ctx, t) {
  bg(ctx, t, 1);
  const enter = E.outCubic(prog(t, 18.86, 19.16));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  const second = t >= 23.74;
  if (!second) {
    popWord(ctx, 'LE HIC', 90, 330, 150, C.red, t, 18.9);
    ctx.save(); shakeAt(ctx, t, 20.68, 16);
    slam(ctx, 'ILS SE TROMPENT', W / 2, 520, 130, C.white, t, 20.68);
    ctx.restore();
    // a human text flagged "IA ?" by a glitching detector (before the dot grid)
    const dk = sp(t, 19.0, SPRING.gentle) * (1 - E.outCubic(prog(t, 21.1, 21.4)));
    if (dk > 0.001) {
      ctx.save(); ctx.globalAlpha = clamp(dk * 2); ctx.translate(0, (1 - dk) * 60);
      sheet(ctx, W / 2, 860, 640, 380, 1, 5, C.grey);
      text(ctx, 'TEXTE HUMAIN', W / 2, 1000, font(40, 800, UI), C.white, 'center');
      const on = t >= 19.9 && Math.floor((t - 19.9) * 6) % 2 === 0;
      const lk = sp(t, 19.9, SPRING.bouncy);
      if (lk > 0.001) {
        ctx.save(); ctx.translate(W / 2 + 230, 700); ctx.rotate(0.08); ctx.scale(lk, lk);
        rrect(ctx, -110, -55, 220, 110, 20); ctx.fillStyle = on || t >= 20.68 ? C.red : C.card; ctx.fill();
        ctx.lineWidth = 5; ctx.strokeStyle = C.red; ctx.stroke();
        text(ctx, 'IA ?', 0, 26, font(80, 400, D), C.white, 'center');
        ctx.restore();
      }
      ctx.restore();
    }
    const gk = E.outCubic(prog(t, 21.3, 22.2));
    if (gk > 0) {
      const s = 6.6, x0 = W / 2 - 50 * s, y0 = 600;
      ctx.save(); ctx.globalAlpha = gk;
      ctx.fillStyle = C.dim;
      const rows = Math.ceil(100 * gk);
      for (let r = 0; r < rows; r++) for (let c = 0; c < 100; c++) ctx.fillRect(x0 + c * s, y0 + r * s, 4, 4);
      ctx.restore();
      const rk = sp(t, 22.78, SPRING.bouncy);
      if (rk > 0.001) {
        ctx.save(); ctx.translate(x0 + 63 * s + 2, y0 + 41 * s + 2);
        ctx.strokeStyle = C.red; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 40 * rk, 0, M.TAU); ctx.stroke();
        ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(0, 0, 9 * rk, 0, M.TAU); ctx.fill();
        ctx.restore();
      }
      popWord(ctx, '1 SUR 10 000', W / 2, 1190, 100, C.white, t, 22.78, 'center');
    }
    chip(ctx, 'SELON PANGRAM', 560, 290, t, 21.44, C.white);
  } else {
    popWord(ctx, 'UNE ÉTUDE', 90, 330, 130, C.white, t, 23.76);
    chip(ctx, '2025', 650, 290, t, 24.42, C.red);
    const s = 66, x0 = W / 2 - 5 * s + s / 2, y0 = 500;
    for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
      const k = sp(t, 23.9 + (r + c) * 0.035, SPRING.bouncy);
      if (k <= 0.001) continue;
      const hot = (r === 2 && c === 7) || (r === 6 && c === 3);
      const red = hot && t >= 25.54;
      const rr = (red ? 26 : 18) * k * (red ? 1 + 0.15 * wobble(t - 25.54, 3, 7) : 1);
      ctx.fillStyle = red ? C.red : C.dim;
      ctx.beginPath(); ctx.arc(x0 + c * s, y0 + r * s, rr, 0, M.TAU); ctx.fill();
    }
    ctx.save(); shakeAt(ctx, t, 25.54, 18);
    stamp(ctx, "2 % D'ERREURS", W / 2, 1180, 700, 110, t, 25.54, -0.05, C.red);
    ctx.restore();
  }
  ctx.restore();
  if (!second) source(ctx, 'Pangram, via CNN, 21/10/2026', t, 21.6);
  else source(ctx, 'Université du Maryland (2025), via CNN', t, 24.2);
}

// ------------------------------------------------------------------ S7 software records every writing step (26.18 - 29.96)
function sRecord(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 26.18, 26.48));
  ctx.save(); ctx.translate(0, (1 - enter) * 300);
  popWord(ctx, 'DES LOGICIELS', 90, 330, 130, C.white, t, 26.2);
  popWord(ctx, 'ENREGISTRENT', 90, 450, 130, C.red, t, 27.4);
  const rk = sp(t, 27.76, SPRING.bouncy);
  if (rk > 0.001) {
    ctx.save(); ctx.translate(860, 300); ctx.scale(rk, rk);
    rrect(ctx, -110, -50, 220, 100, 50); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.red; ctx.stroke();
    if (Math.floor((t - 27.76) * 2.4) % 2 === 0) { ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(-50, 0, 18, 0, M.TAU); ctx.fill(); }
    text(ctx, 'REC', 25, 16, font(52, 400, D), C.white, 'center');
    ctx.restore();
  }
  const steps = [[28.24, '09:12', 0.3], [28.48, '10:47', 0.6], [28.96, '14:05', 1.0]];
  // empty slots wait for each step (no blank screen while the VO sets it up)
  steps.forEach(([t0], i) => {
    const k = sp(t, 26.5 + i * 0.12, SPRING.gentle);
    if (k <= 0.001 || t >= t0 + 0.05) return;
    ctx.save(); ctx.globalAlpha = clamp(k * 2) * 0.9; ctx.translate(230 + i * 310, 870 + (1 - k) * 60);
    ctx.setLineDash([16, 12]); ctx.strokeStyle = C.dim; ctx.lineWidth = 5;
    rrect(ctx, -130, -160, 260, 320, 20); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, String(i + 1), 0, 30, font(110, 400, D), C.dim, 'center');
    ctx.restore();
  });
  // a pen writing across the slots before REC
  const pp = prog(t, 26.6, 28.2);
  if (pp > 0 && pp < 1) pen(ctx, lerp(120, 960, pp), 640 + 14 * Math.sin(pp * 40), 1.0, C.grey);
  steps.forEach(([t0, hh, p], i) => {
    const k = sp(t, t0, SPRING.bouncy);
    if (k <= 0.001) return;
    const x = 230 + i * 310, y = 870;
    ctx.save(); ctx.translate(x, y + (1 - k) * 120); ctx.globalAlpha = clamp(k * 2);
    sheet(ctx, 0, 0, 260, 320, p, 5, i === 2 ? C.white : C.grey);
    text(ctx, 'ÉTAPE ' + (i + 1), 0, -200, font(48, 400, D), i === 2 ? C.red : C.white, 'center');
    clockIcon(ctx, -50, 210, 18, C.grey);
    text(ctx, hh, 30, 222, font(36, 800, UI), C.grey, 'center');
    ctx.restore();
  });
  ctx.restore();
  source(ctx, "Workings, ObraVera, d'après Wired, novembre 2026", t, 27.0);
}

// ------------------------------------------------------------------ S8 caveat: nothing is proven either way (29.96 - 34.12)
function sNuance(ctx, t) {
  bg(ctx, t, 1);
  slam(ctx, 'NUANCE', W / 2, 360, 180, C.white, t, 29.96);
  const ap = sp(t, 30.3, SPRING.gentle);
  if (ap > 0.001) {
    let ang = 0;
    if (t >= 32.12) ang -= 0.18 * Math.exp(-(t - 32.12) * 2.2) * Math.cos((t - 32.12) * 3);
    if (t >= 32.84) ang += 0.26 * Math.exp(-(t - 32.84) * 2.2) * Math.cos((t - 32.84) * 3);
    ctx.save(); ctx.globalAlpha = clamp(ap * 2); ctx.translate(W / 2, 560);
    ctx.fillStyle = C.grey; ctx.fillRect(-8, 0, 16, 380); rrect(ctx, -120, 370, 240, 30, 12); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, 18, 0, M.TAU); ctx.fill();
    ctx.rotate(ang);
    ctx.fillStyle = C.white; rrect(ctx, -360, -8, 720, 16, 8); ctx.fill();
    for (const [sx, lab, col] of [[-330, 'IA', C.red], [330, 'HUMAIN', C.white]]) {
      ctx.save(); ctx.translate(sx, 0); ctx.rotate(-ang);
      ctx.strokeStyle = C.grey; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-90, 170); ctx.moveTo(0, 0); ctx.lineTo(90, 170); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-120, 170); ctx.quadraticCurveTo(0, 250, 120, 170); ctx.closePath(); ctx.fillStyle = C.card; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.stroke();
      text(ctx, lab, 0, 150, font(56, 400, D), col, 'center');
      ctx.restore();
    }
    ctx.restore();
  }
  ctx.save(); shakeAt(ctx, t, 31.14, 16);
  stamp(ctx, "RIEN N'EST PROUVÉ", W / 2, 1140, 860, 110, t, 31.14, -0.05, C.red);
  ctx.restore();
}

// ------------------------------------------------------------------ S9 advice: keep your drafts and version history (34.12 - 37.64)
function sAdvice(ctx, t) {
  bg(ctx, t, 0);
  const enter = E.outCubic(prog(t, 34.12, 34.42));
  ctx.save(); ctx.translate((1 - enter) * W * 0.7, 0);
  popWord(ctx, 'LE CONSEIL', 90, 330, 150, C.red, t, 34.14);
  for (let i = 0; i < 3; i++) {
    const k = sp(t, 34.94 + i * 0.22, SPRING.bouncy);
    if (k <= 0.001) continue;
    ctx.save(); ctx.translate(290 + i * 22, 720 - i * 26 + (1 - k) * 140); ctx.rotate(-0.08 + i * 0.06); ctx.globalAlpha = clamp(k * 2);
    sheet(ctx, 0, 0, 340, 420, 0.4 + i * 0.3, 6, i === 2 ? C.white : C.grey);
    ctx.restore();
  }
  popWord(ctx, 'BROUILLONS', 300, 1010, 70, C.white, t, 35.5, 'center');
  const hk = sp(t, 36.1, SPRING.gentle);
  if (hk > 0.001) {
    ctx.save(); ctx.globalAlpha = clamp(hk * 2); ctx.translate((1 - hk) * 160, 0);
    rrect(ctx, 560, 470, 440, 500, 26); ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.edge; ctx.stroke();
    clockIcon(ctx, 615, 540, 24, C.red);
    text(ctx, 'HISTORIQUE', 655, 558, font(52, 400, D), C.white);
    const rows = ["Aujourd'hui 14:05", "Aujourd'hui 10:47", 'Hier 18:30', 'Lundi 09:12'];
    rows.forEach((r, i) => {
      const k = sp(t, 36.3 + i * 0.12, SPRING.bouncy);
      if (k <= 0.001) return;
      const y = 630 + i * 82;
      ctx.save(); ctx.globalAlpha = clamp(k * 2);
      rrect(ctx, 590, y, 380, 64, 14); ctx.fillStyle = i === 0 ? C.red : C.ink; ctx.fill();
      text(ctx, r, 612, y + 43, font(32, 800, UI), C.white);
      ctx.restore();
    });
    ctx.restore();
  }
  ctx.restore();
  ctx.save(); shakeAt(ctx, t, 36.82, 16);
  stamp(ctx, 'GARDE TOUT', W / 2, 1150, 620, 120, t, 36.82, -0.06, C.red);
  ctx.restore();
}

// ------------------------------------------------------------------ S10 question + end card (37.64 - end)
function sEnd(ctx, t) {
  bg(ctx, t, 1);
  const up = E.inOutCubic(prog(t, 38.7, 39.05));
  ctx.save(); ctx.translate(0, -up * 1400);
  slam(ctx, 'ET TOI ?', W / 2, 480, 220, C.white, t, 37.64);
  popWord(ctx, 'DÉJÀ SOUPÇONNÉ', W / 2, 760, 130, C.red, t, 38.04, 'center');
  popWord(ctx, "D'AVOIR UTILISÉ L'IA ?", W / 2, 880, 90, C.white, t, 38.2, 'center');
  ctx.restore();
  if (t >= 38.7) {
    ctx.save(); ctx.translate(0, (1 - up) * 1400);
    popWord(ctx, "L'ACTU IA,", W / 2, 640, 190, C.white, t, 38.8, 'center');
    popWord(ctx, 'CHAQUE JOUR.', W / 2, 820, 190, C.red, t, 39.0, 'center');
    const k = sp(t, 39.2, SPRING.bouncy);
    ctx.save(); ctx.translate(W / 2, 1010); ctx.scale(k, k);
    rrect(ctx, -280, -66, 560, 124, 62); ctx.fillStyle = C.red; ctx.fill();
    text(ctx, 'Abonne-toi', 0, 18, font(60, 800, UI), C.white, 'center');
    ctx.restore();
    popWord(ctx, 'Réponds en commentaire', W / 2, 1180, 44, C.grey, t, 39.5, 'center', UI, 600);
    ctx.restore();
  }
}

M.film({
  fonts: [font(100, 400, D), font(40, 400, UI), font(40, 600, UI), font(40, 800, UI)],
  hits: HITS,
  draw(ctx, u, t) {
    if (t < 4.06) sHook(ctx, t);
    else if (t < 6.14) sWriters(ctx, t);
    else if (t < 10.86) sGoncourt(ctx, t);
    else if (t < 14.24) sScan(ctx, t);
    else if (t < 18.86) sDeny(ctx, t);
    else if (t < 26.18) sErrors(ctx, t);
    else if (t < 29.96) sRecord(ctx, t);
    else if (t < 34.12) sNuance(ctx, t);
    else if (t < 37.64) sAdvice(ctx, t);
    else sEnd(ctx, t);
    captions(ctx, t);
  },
});
