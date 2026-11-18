# Vidéos animées « actu IA » : guide de fabrication

Format validé par Zaki le 18/11/2026 (exemple : `exemples/2026-11-18-ia-bosser-plus/`).
Vidéo verticale 9:16, 1080x1920, 60 i/s, 38 à 45 s, voix off française + texte animé + sous-titres.

## Ligne éditoriale
- Ton : informatif, pédagogique, posé (« prof »). La page donne l'info : pas de « je », pas de
  « Pas un gourou / juste un mec qui apprend ».
- Accroche dans la 1re phrase (contradiction, chiffre choc ou question), puis 3-4 faits chiffrés et
  sourcés, une nuance honnête (ex. « lien, pas preuve »), un conseil concret, une question au public,
  et toujours la fin : « Abonne-toi pour l'actu IA de chaque jour. »
- Seulement des faits vérifiés (newsletter + recherche web). Les sources s'affichent en petit à l'écran.
- Environ 100-110 mots (≈ 40 s avec la voix Vincent). Nombres écrits en toutes lettres dans le texte
  envoyé au TTS (« quatre-vingt-dix minutes »), chiffres dans les sous-titres.

## Voix (Sunra)
- Projet Sunra « Reels actu IA » : `a2de60f5-e9a0-48d0-a19c-35d66f980d97`.
- `create_audio` model `heygen-voice-1`, voice `Vincent`, language `fr`, expressiveness `0.35`,
  auto_confirm true, un `request_id` unique par vidéo. Coût ≈ 3 crédits. Puis `get_job` pour l'URL (wav).
- Une seule prise : ne jamais relancer une génération réussie.

## Chaîne de fabrication (depuis le dossier de travail)
```
SK=$(dirname $(dirname $(find / -path "*motion-reel/scripts/render.mjs" 2>/dev/null | head -1)))
mkdir -p reels-work && cd reels-work && npm init -y >/dev/null && npm i -D playwright >/dev/null 2>&1
node $SK/scripts/scaffold.mjs <film> --title "<titre>" --duration 43 --formats 9x16
cp -r <repo>/reels/template/* <film>/          # index.html, lib/motion.js, fonts (Bebas + Inter)
curl -o <film>/audio/vo/voice.wav <url Sunra>
ffmpeg -i <film>/audio/vo/voice.wav -ar 16000 -ac 1 v16.wav && uv run <repo>/reels/tools/asr.py v16.wav
   # -> v16.words.json : timings mot par mot (secondes) pour caler scènes, HITS et sous-titres
ffmpeg -i <film>/audio/vo/voice.wav -af "adelay=100,apad,loudnorm=I=-16" -t <durée> -ar 48000 -ac 2 <film>/audio/vo.wav
   # la voix démarre à +0,1 s : ajouter 0,1 aux timings du words.json
uv run $SK/scripts/beats.py <film> --synth --flavor lofi --bpm 120 --mode minor --tonic A --duration <durée>
# écrire <film>/film.js (voir plus bas), puis :
node $SK/scripts/render.mjs --film <film> --contact --format 9x16 --every 4   # regarder phone_9x16_p1.png, corriger
node $SK/scripts/sfx.mjs <film>
node $SK/scripts/render.mjs --film <film> --format 9x16 --video-only           # ~8 min
node $SK/scripts/mix.mjs <film>                                                # -> out/<film>/final.mp4
```
Lire le SKILL.md de motion-reel (studio rules) avant d'écrire film.js.

## Écrire film.js
Partir de `exemples/2026-11-18-ia-bosser-plus/film.js` et garder sa boîte à outils :
`bg` (fond noir quadrillé + halo rouge, décale tout de 110 px vers le bas), `popWord`, `slam`, `chip`,
`source`, `shakeAt`, `captions` (liste CAP [texte, seconde]), HITS en beats (`B(s)`).
- Dans l'exemple, TMAP sert seulement à recaler une ancienne prise : pour une nouvelle vidéo, écrire
  directement les secondes lues dans words.json et supprimer TMAP (`B = s => s / 0.5`, `draw(ctx,u,t)`).
- Couleurs : noir #050506, rouge #FF1F3D, blanc, gris #BEBEC4. Polices : Display = Bebas Neue (titres,
  chiffres), UI = Inter 400/600/800 (sous-titres, chips, sources). Pas d'autre police, pas d'emoji,
  pas de symbole hors latin de base (≠, ×, → interdits).
- 1 scène par idée (6 à 9 scènes), un élément nouveau toutes les 2-4 s, l'accroche visible dès la
  1re image (rien qui part de zéro), chaque scène démarre au mot qui l'annonce (pas d'écran vide).
- Une métaphore visuelle par fait (horloge qui s'emballe, compteur + points, course de barres,
  notifications qui s'empilent, frise d'une journée, tampon, to-do list, cadenas...).
- Sous-titres à CAP_Y 1385 (+110), contenu entre y≈300 et 1300 (+110). Fin : « ET TOI ? » puis carte
  « L'ACTU IA, CHAQUE JOUR. » + bouton « Abonne-toi » tenus ≥ 2 s.
