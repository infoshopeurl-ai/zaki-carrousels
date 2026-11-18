# /// script
# dependencies = ["faster-whisper", "soundfile"]
# ///
import sys, json, soundfile as sf
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8")
for p in sys.argv[1:]:
    segs, _ = m.transcribe(sf.read(p, dtype="float32")[0], language="fr", word_timestamps=True)
    words = []
    for s in segs:
        for w in s.words:
            words.append({"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)})
    json.dump(words, open(p.rsplit('.',1)[0] + ".words.json", "w"), ensure_ascii=False)
    print(p, " ".join(x["w"] for x in words))
