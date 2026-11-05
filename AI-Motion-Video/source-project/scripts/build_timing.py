#!/usr/bin/env python3
"""Build the curated Hindi/Hinglish transcript, subtitles and scene plan.

Timings are curated from three Faster-Whisper passes. Only obvious ASR spelling
errors and proper nouns are normalized; narration order and meaning are unchanged.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / "AI-Motion-Video"

# caption start, caption end, [(spoken word, word start, word end), ...]
CUES = [
    (0.42, 1.68, [("क्या",.42,.66),("तुम्हें",.66,.92),("भी",.92,1.06),("यही",1.06,1.20),("लगता",1.20,1.52),("है?",1.52,1.68)]),
    (1.70, 3.05, [("Python",1.70,2.02),("language",2.02,2.42),("का",2.42,2.56),("नाम",2.56,2.76)]),
    (3.12, 5.90, [("Python",3.12,3.52),("snake",3.56,3.92),("से",3.92,4.16),("relate",4.36,4.76),("करते",4.76,4.92),("हुए",4.92,5.26),("रखा",5.28,5.66),("है?",5.66,5.86)]),
    (6.52, 8.20, [("But",6.52,6.78),("ये",6.78,6.94),("कहीं",6.94,7.42),("भी",7.42,7.56),("सही",7.56,7.72),("नहीं",7.72,8.02),("है।",8.02,8.20)]),
    (8.32, 10.35, [("बात",8.32,8.62),("थी",8.62,8.78),("1989",8.78,9.44),("की।",9.44,10.24)]),
    (10.61, 12.51, [("जहाँ",10.61,10.75),("पर",10.75,10.89),("एक",10.89,11.09),("researcher",11.09,11.61),("Guido",11.61,11.90),("van",11.90,12.15),("Rossum",12.15,12.51)]),
    (12.55, 14.03, [("एक",12.55,12.83),("ऐसी",12.83,13.13),("language",13.13,13.53),("चाहता",13.53,13.85),("था",13.85,14.03)]),
    (14.03, 16.15, [("जोकि",14.03,14.27),("C",14.27,14.49),("से",14.49,14.65),("ज्यादा",14.65,14.91),("fast",14.91,15.29),("हो,",15.29,15.41),("simple",15.51,15.89),("हो।",15.89,16.15)]),
    (16.55, 19.00, [("वही",16.55,16.78),("उसी",16.78,17.04),("time",17.04,17.28),("अपनी",17.28,17.55),("Christmas",17.55,17.93),("की",17.93,18.07),("छुट्टियों",18.07,18.49),("में",18.49,18.85)]),
    (19.40, 21.20, [("एक",19.40,19.58),("hobby",19.58,19.96),("project",19.96,20.36),("start",20.36,20.68),("करता",20.68,21.02),("है।",21.02,21.18)]),
    (21.18, 22.44, [("जिसमें",21.18,21.48),("वो",21.58,21.66),("decide",21.66,22.04),("करता",22.04,22.32),("है,",22.32,22.44)]),
    (22.48, 24.24, [("मैं",22.48,22.62),("एक",22.62,22.80),("ऐसी",22.80,23.10),("language",23.10,23.42),("पर",23.42,23.60),("work",23.60,23.86),("करूँगा",23.86,24.20)]),
    (24.24, 27.42, [("जोकि",24.24,24.68),("C",24.68,25.10),("से",25.34,25.52),("ज्यादा",25.52,25.86),("fast",25.86,26.32),("हो",26.32,26.42),("और",26.42,26.66),("efficient",26.66,27.22),("हो।",27.22,27.42)]),
    (27.53, 29.40, [("और",27.53,27.83),("उसने",27.83,28.13),("इस",28.13,28.29),("language",28.29,28.67),("का",28.67,28.81),("नाम",28.81,29.09),("रखा",29.09,29.40)]),
    (29.47, 31.90, [("एक",29.47,29.69),("British",29.69,30.05),("comedy",30.05,30.49),("show",30.49,30.67),("से",30.67,30.75),("relate",30.75,30.99),("करते",30.99,31.20),("हुए",31.20,31.39),("जोकि",31.39,31.71),("था,",31.71,31.90)]),
    (32.30, 34.05, [("Monty",32.30,32.64),("Python's",32.64,33.14),("Flying",33.14,33.66),("Circus।",33.66,34.00)]),
    (34.17, 36.73, [("इसी",34.17,34.37),("के",34.37,34.55),("नाम",34.55,34.73),("पर",34.73,34.89),("उसने",34.89,35.21),("अपनी",35.21,35.59),("language",35.59,36.05),("का",36.05,36.21),("नाम",36.21,36.43),("रखा",36.43,36.67)]),
    (36.89, 37.35, [("Python।",36.89,37.29)]),
    (37.47, 40.19, [("ये",37.47,37.59),("Python",37.59,37.97),("language",37.97,38.37),("एक",38.37,38.61),("इतना",38.61,38.93),("बड़ा",38.93,39.13),("invention",39.13,39.73),("है,",39.73,39.90),("जोकि",39.90,40.19)]),
    (40.20, 40.95, [("machine",40.20,40.59),("learning,",40.59,40.95)]),
    (40.95, 42.50, [("artificial",40.95,41.53),("intelligence,",41.53,42.25)]),
    (42.51, 44.40, [("automation",42.51,43.29),("जैसे",43.29,43.53),("sectors",43.53,43.87),("में",43.87,44.21)]),
    (44.52, 46.34, [("काफी",44.52,44.83),("important",44.83,45.26),("role",45.26,45.56),("play",45.56,45.82),("करती",45.82,46.08),("है।",46.08,46.34)]),
    (46.39, 49.01, [("सोचो,",46.39,46.83),("एक",46.83,47.20),("उस",47.20,47.36),("पुराने",47.36,47.66),("time",47.66,47.88),("का",47.88,48.10),("छोटा",48.10,48.36),("सा",48.36,48.50),("invention,",48.50,49.00)]),
    (49.01, 50.22, [("जिसकी",49.01,49.36),("वजह",49.36,49.62),("से,",49.62,50.21)]),
    (50.26, 52.18, [("आज",50.26,50.50),("कितना",50.50,50.78),("बड़ा",50.78,50.98),("ecosystem",50.98,51.24),("बन",51.24,51.54),("चुका",51.54,51.74),("है।",51.74,52.08)]),
]

ROMAN_HINGLISH = {
    "क्या":"kya", "तुम्हें":"tumhe", "भी":"bhi", "यही":"yahi", "लगता":"lagta", "है":"hai",
    "का":"ka", "नाम":"naam", "से":"se", "करते":"karte", "हुए":"hue", "रखा":"rakha",
    "ये":"ye", "कहीं":"kahin", "सही":"sahi", "नहीं":"nahi", "बात":"baat", "थी":"thi", "की":"ki",
    "जहाँ":"jahan", "पर":"par", "एक":"ek", "ऐसी":"aisi", "चाहता":"chahta", "था":"tha",
    "जोकि":"joki", "ज्यादा":"zyada", "हो":"ho", "वही":"wahi", "उसी":"usi", "अपनी":"apni",
    "छुट्टियों":"chuttiyon", "में":"mein", "करता":"karta", "जिसमें":"jismein", "वो":"wo",
    "मैं":"main", "करूँगा":"karunga", "और":"aur", "उसने":"usne", "इस":"is", "इसी":"isi",
    "के":"ke", "इतना":"itna", "बड़ा":"bada", "जैसे":"jaise", "काफी":"kaafi", "करती":"karti",
    "सोचो":"socho", "उस":"us", "पुराने":"purane", "छोटा":"chhota", "सा":"sa", "जिसकी":"jiski",
    "वजह":"wajah", "आज":"aaj", "कितना":"kitna", "बन":"ban", "चुका":"chuka",
}


def roman_word(text: str) -> str:
    """Transliterate one timed token without changing its timestamp or Hinglish wording."""
    ending = ""
    while text and text[-1] in "?,।":
        mark = text[-1]
        text = text[:-1]
        ending = ("." if mark == "।" else mark) + ending
    return ROMAN_HINGLISH.get(text, text) + ending


def roman_text(text: str) -> str:
    return " ".join(roman_word(word) for word in text.split(" "))


CUES = [(start, end, [(roman_word(text), ws, we) for text, ws, we in items]) for start, end, items in CUES]
LOWERCASE_FIRST_CUES = {7, 8, 10, 13, 15, 20, 21, 22, 23, 25, 26}
for cue_index, (_, _, items) in enumerate(CUES, 1):
    text, ws, we = items[0]
    initial = text[:1].lower() if cue_index in LOWERCASE_FIRST_CUES else text[:1].upper()
    items[0] = (initial + text[1:], ws, we)

KEYWORDS = {"Python", "snake", "nahi", "1989", "Guido", "Rossum", "fast", "simple", "Christmas", "hobby", "project", "efficient", "British", "comedy", "Monty", "Python's", "Flying", "Circus", "invention", "machine", "learning", "artificial", "intelligence", "automation", "important", "ecosystem"}

KEYWORD_LOOKUP = {keyword.lower() for keyword in KEYWORDS}

SCENES = [
    {"id":"S01","start":0.00,"end":3.05,"title":"The Assumption","spoken":"क्या तुम्हें भी यही लगता है? Python language का नाम…","concept":"A confrontational kinetic-type cold open: PYTHON assembles letter by letter while a coiled line-art serpent and a huge question mark establish the assumption.","background":"Midnight indigo editorial grid, radial spotlight, fine film grain and restrained chartreuse accents.","objects":"Custom SVG serpent, sliced typographic masks, question-mark orbit and scanning rule.","typography":"Space Grotesk 800 with faux-3D extrusion; Inter for Roman Hinglish spoken captions.","camera":"Fast 4% push-in; slight perspective settling after the title lands.","transition":"A chartreuse scan bar wipes into the snake hypothesis.","sfx":"0.08 s soft impact; 1.66 s title slam; 2.88 s whoosh."},
    {"id":"S02","start":3.05,"end":8.26,"title":"Myth, Corrected","spoken":"Python snake से relate करते हुए रखा है? But ये कहीं भी सही नहीं है।","concept":"The serpent is visually connected to Python, then the connection breaks and a decisive NOT THE SNAKE correction replaces it.","background":"Deep navy with a drafting-board circle and restrained red correction marks.","objects":"Animated SVG snake path, broken connector, circular strike and editorial labels.","typography":"Condensed uppercase statement with mask reveal; oversized NAHIN as the emotional beat.","camera":"Lateral drift followed by a rapid 6% punch on ‘NAHIN’.","transition":"The strike circle becomes the rim of the 1989 timeline.","sfx":"4.30 s subtle digital ticks; 6.48 s low impact; 8.10 s morph whoosh."},
    {"id":"S03","start":8.26,"end":10.50,"title":"1989","spoken":"बात थी 1989 की।","concept":"A monumental date emerges from a moving archival timeline; no unrelated historical imagery.","background":"Warm charcoal paper texture meeting cool midnight blue, with a fine horizontal time ruler.","objects":"1989 extruded numerals, year ticks, a single glowing origin node and archival registration marks.","typography":"Tabular Space Grotesk numerals, very large and tightly tracked.","camera":"Timeline trucks left while the camera pushes toward the selected year.","transition":"The origin node expands into Guido’s research blueprint.","sfx":"8.28 s year impact; 9.36 s soft clock tick; 10.34 s whoosh."},
    {"id":"S04","start":10.50,"end":16.45,"title":"The Designer’s Brief","spoken":"जहाँ पर एक researcher Guido van Rossum एक ऐसी language चाहता था जोकि C से ज्यादा fast हो, simple हो।","concept":"A custom researcher identity card and code blueprint introduce Guido; FAST and SIMPLE become the two design requirements.","background":"Cyan-on-navy technical drafting surface with depth-separated grid planes.","objects":"GVR monogram, animated terminal lines, C block, two requirement cards and connecting paths.","typography":"Editorial nameplate plus monospaced code and bold requirement labels.","camera":"2.5D parallax push through foreground grid, identity card and rear code plane.","transition":"Terminal window folds into the laptop on the Christmas desk.","sfx":"11.05 s UI confirm; 14.86 s fast tick; 15.48 s simple chime."},
    {"id":"S05","start":16.45,"end":21.20,"title":"A Christmas Side Project","spoken":"वही उसी time अपनी Christmas की छुट्टियों में एक hobby project start करता है।","concept":"A cinematic 2.5D winter workspace: snow beyond the window, warm practical lights and a laptop where a side project runs for the first time.","background":"Cool blue night exterior contrasted with an amber interior, soft shadows and layered depth of field.","objects":"Snow layers, window mullions, desk, coffee steam, fairy lights, laptop code and HOBBY PROJECT stamp.","typography":"Small warm editorial labels; PROJECT START appears as a terminal confirmation.","camera":"Slow lateral dolly and push-in; snow and desk move at different depths.","transition":"Laptop screen zooms into the abstract 3D language core.","sfx":"16.60 s soft winter bell; 19.94 s project-start impact; 21.02 s screen whoosh."},
    {"id":"S06","start":21.20,"end":27.50,"title":"The Language Core","spoken":"जिसमें वो decide करता है, मैं एक ऐसी language पर work करूँगा जोकि C से ज्यादा fast हो और efficient हो।","concept":"An original Three.js metallic code core assembles from wireframe to solid while FAST and EFFICIENT lock into orbit.","background":"Dark technical void with volumetric-looking cones, sparse stars and a reflective floor grid.","objects":"Real-time Three.js icosahedron, chrome torus rings, point particles, orbiting C badge and typographic gauges.","typography":"Huge mask-revealed FAST and EFFICIENT; minimal monospaced annotations.","camera":"Deterministic 3D dolly from 9 to 6.8 units with gentle orbital rotation.","transition":"A chrome ring expands into a circular theatre spotlight.","sfx":"21.62 s decision click; 24.22 s core ignition; 25.84 s fast accent; 26.64 s efficient accent."},
    {"id":"S07","start":27.50,"end":34.05,"title":"The Real Namesake","spoken":"और उसने इस language का नाम रखा एक British comedy show से relate करते हुए, जोकि था Monty Python’s Flying Circus।","concept":"The technical world gives way to a custom retro theatre: curtains open, marquee bulbs illuminate and the comedy-show title takes the stage.","background":"Burgundy velvet, brass trim, dark stage floor and two warm spotlight cones.","objects":"Curtains, animated marquee, vintage title card, playful geometric circus orbit and subtle Union-Jack-inspired corner stripes.","typography":"Vintage serif-like stage lettering paired with clean Space Grotesk title blocks.","camera":"Proscenium dolly-in with a gentle handheld-free float; title cards arrive word by word.","transition":"Marquee bulbs fly forward and resolve into the Python name reveal.","sfx":"27.62 s curtain whoosh; 29.66 s marquee click; 32.28 s three soft show-title hits."},
    {"id":"S08","start":34.05,"end":37.45,"title":"Python Gets Its Name","spoken":"इसी के नाम पर उसने अपनी language का नाम रखा — Python।","concept":"A direct visual match: MONTY PYTHON collapses to a single glowing PYTHON nameplate and original two-colour Python-inspired mark.","background":"Clean midnight stage with ivory title card, blue/yellow brand accents and restrained spotlight.","objects":"Connecting name line, custom interlocking Python mark, extruded title and small naming seal.","typography":"PYTHON in massive 3D-shadowed capitals; Monty Python source line remains secondary.","camera":"Quick push on ‘Python’, then a controlled half-second hold.","transition":"The nameplate’s central node detonates into the invention network.","sfx":"34.16 s connection tone; 36.86 s naming impact; 37.32 s ignition whoosh."},
    {"id":"S09","start":37.45,"end":40.20,"title":"An Invention Expands","spoken":"ये Python language एक इतना बड़ा invention है, जोकि…","concept":"One small origin node branches into an increasingly dense connected system, making ‘how big an invention’ visible rather than literal.","background":"Deep blue network space with architectural grid and depth-faded nodes.","objects":"Animated SVG connections, moving pulses, expanding rings and an INVENTION central label.","typography":"INVENTION appears inside a technical focus frame; scale words stay sparse.","camera":"Pull-back reveals the network’s scale as new branches appear.","transition":"Three primary branches become the ML, AI and automation panels.","sfx":"37.48 s low ignition; 38.90 s expansion impact; 40.02 s tri-panel whoosh."},
    {"id":"S10","start":40.20,"end":46.35,"title":"Three Fields, One Language","spoken":"machine learning, artificial intelligence, automation जैसे sectors में काफी important role play करती है।","concept":"Three synchronized custom infographics: a neural graph for ML, a living processor for AI and an articulated robotic arm for automation.","background":"Three premium glass/metal instrument panels over a shared dark grid; cyan, violet and amber distinguish the fields.","objects":"Neural nodes, chip traces, robotic joints, gear teeth, data rails and sequential status lines.","typography":"Large numbered domain names; IMPORTANT ROLE resolves as the shared conclusion.","camera":"Virtual camera pans across the triptych, then lifts to show all three working together.","transition":"Panels collapse to one small origin cube, matching the final reflection.","sfx":"40.18 s ML ping; 40.94 s AI ping; 42.49 s automation servo; 44.50 s shared impact."},
    {"id":"S11","start":46.35,"end":52.233333,"title":"From Side Project to Ecosystem","spoken":"सोचो, एक उस पुराने time का छोटा सा invention, जिसकी वजह से आज कितना बड़ा ecosystem बन चुका है।","concept":"The tiny origin cube returns, then grows into a luminous Three.js ecosystem globe surrounded by the three fields and a 1989-to-today arc.","background":"Cinematic midnight-to-dawn gradient with a fine orbital horizon and atmospheric particles.","objects":"Three.js network sphere, orbiting rings and points; domain satellites, 1989 origin marker and final Python mark.","typography":"Small idea, big ecosystem: SMALL IDEA scales into ECOSYSTEM; final 1989 → TODAY lockup.","camera":"Measured 3D pull-back, final two-degree rise and stable end hold.","transition":"Clean final hold; music and visual motion resolve with the last spoken word.","sfx":"46.38 s reflective tone; 49.00 s growth whoosh; 50.96 s final warm impact; 52.08 s soft resolve."},
]


for scene in SCENES:
    scene["spoken"] = roman_text(scene["spoken"])


def srt_time(seconds: float) -> str:
    ms = round(seconds * 1000)
    hours, ms = divmod(ms, 3600000)
    minutes, ms = divmod(ms, 60000)
    secs, ms = divmod(ms, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{ms:03d}"


def subtitle_lines(words: list[dict]) -> list[str]:
    """Match the Remotion two-line caption balancing algorithm for the SRT."""
    def length(items: list[dict]) -> int:
        return sum(len(w["text"]) + 1 for w in items)
    if length(words) <= 30 or len(words) <= 3:
        return [" ".join(w["text"] for w in words)]
    best, score = 1, float("inf")
    for i in range(1, len(words)):
        a, b = length(words[:i]), length(words[i:])
        candidate = max(a, b) + abs(a-b)*0.18
        if candidate < score:
            best, score = i, candidate
    return [" ".join(w["text"] for w in words[:best]), " ".join(w["text"] for w in words[best:])]


def main() -> None:
    captions = []
    words = []
    for index, (start, end, items) in enumerate(CUES, 1):
        cue_words = []
        for text, word_start, word_end in items:
            word = {"id": len(words), "text": text, "start": word_start, "end": word_end, "keyword": text.strip(".,?।").lower() in KEYWORD_LOOKUP}
            words.append(word)
            cue_words.append(word)
        captions.append({"id": index, "start": start, "end": end, "text": " ".join(w["text"] for w in cue_words), "words": cue_words})

    full_text = " ".join(c["text"] for c in captions)
    scene_delivery = []
    for scene in SCENES:
        scene_words = [w for w in words if scene["start"] <= w["start"] < scene["end"]]
        scene_delivery.append({
            "scene": scene["id"], "start": scene["start"], "end": scene["end"],
            "words": len(scene_words),
            "wordsPerSecond": round(len(scene_words)/(scene["end"]-scene["start"]), 3),
            "visualChange": scene["title"], "reason": scene["concept"],
        })
    emphasis_beats = [
        {"time":6.52,"phrase":"But ये कहीं भी सही नहीं है","type":"myth correction / hard visual reversal"},
        {"time":8.78,"phrase":"1989","type":"date reveal"},
        {"time":11.61,"phrase":"Guido van Rossum","type":"character identity reveal"},
        {"time":17.55,"phrase":"Christmas","type":"warm environmental scene change"},
        {"time":19.96,"phrase":"project start","type":"terminal ignition"},
        {"time":25.86,"phrase":"fast","type":"kinetic typography accent"},
        {"time":26.66,"phrase":"efficient","type":"second kinetic typography accent"},
        {"time":32.30,"phrase":"Monty Python's Flying Circus","type":"central comedy-stage reveal"},
        {"time":36.89,"phrase":"Python","type":"name resolution impact"},
        {"time":40.20,"phrase":"machine learning","type":"first domain panel"},
        {"time":40.95,"phrase":"artificial intelligence","type":"second domain panel"},
        {"time":42.51,"phrase":"automation","type":"third domain panel"},
        {"time":50.98,"phrase":"ecosystem","type":"final globe expansion"},
    ]
    emphasis_beats = [{**beat, "phrase": roman_text(beat["phrase"])} for beat in emphasis_beats]
    transcript = {
        "audioFile": "audio/1104.MP3",
        "audioSha256": "6b8b155231d2e236010dec3156b1d9ff329e1aadb19a0e3f614d34f343c38367",
        "duration": 52.21875,
        "language": "hi",
        "languageName": "Hinglish (Roman script)",
        "script": "Latin",
        "languageProbability": 0.948018491268158,
        "asrModel": "OpenAI Whisper small, CTranslate2 int8, Faster-Whisper 1.2.1",
        "timingMethod": "Three offline ASR passes; pause-aligned re-transcription; manual normalization of obvious ASR spelling and proper nouns. Subtitles are Roman-script Hinglish, transliterated rather than translated. No narration added, removed or regenerated.",
        "fullText": full_text,
        "words": words,
        "captions": captions,
        "pauses": [
            {"start":0.0,"end":0.303832,"duration":0.303832},
            {"start":2.91546,"end":3.16619,"duration":0.250726},
            {"start":5.88612,"end":6.14633,"duration":0.260204},
            {"start":10.1527,"end":10.4672,"duration":0.31449},
            {"start":19.1763,"end":19.4072,"duration":0.230952},
            {"start":24.7069,"end":25.1305,"duration":0.423605},
            {"start":44.2569,"end":44.5255,"duration":0.268526}
        ],
        "structure": {"introduction":[0,8.26],"originAndExplanation":[8.26,37.45],"impact":[37.45,46.35],"conclusion":[46.35,52.21875]},
        "overallWordsPerSecond": round(len(words)/52.08, 3),
        "sceneDelivery": scene_delivery,
        "emphasisBeats": emphasis_beats,
    }
    scene_plan = {
        "project":"PYTHON — The Name Behind the Language",
        "format":{"width":1080,"height":1920,"fps":30,"duration":52.21875,"durationInFrames":1567,"aspectRatio":"9:16","videoCodec":"H.264","audioCodec":"AAC"},
        "creativeDirection":"Premium editorial technology documentary with kinetic typography, custom SVG infographics, cinematic 2.5D and selective real-time Three.js. Midnight navy, chartreuse, cyan, warm brass and burgundy form one consistent visual identity.",
        "subtitles":{"language":"Hinglish","script":"Latin","font":"Inter","translated":False,"transliterated":True},
        "audio":{"voice":"Original 1104.MP3, unedited and primary","music":"Original locally synthesized ambient cinematic score, ducked below narration","soundDesign":"Soft transition whooshes, restrained UI ticks and tonal impacts synchronized to visual events"},
        "scenes":SCENES,
    }

    (OUT / "subtitles").mkdir(parents=True, exist_ok=True)
    (OUT / "scenes").mkdir(parents=True, exist_ok=True)
    (OUT / "source-project" / "src" / "data").mkdir(parents=True, exist_ok=True)
    (OUT / "subtitles" / "transcript.json").write_text(json.dumps(transcript, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "transcript.json").write_text(json.dumps(transcript, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "scene-plan.json").write_text(json.dumps(scene_plan, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "scenes" / "scene-plan.json").write_text(json.dumps(scene_plan, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "source-project" / "src" / "data" / "transcript.json").write_text(json.dumps(transcript, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "source-project" / "src" / "data" / "scene-plan.json").write_text(json.dumps(scene_plan, ensure_ascii=False, indent=2), encoding="utf-8")
    delivery = {
        "overallWordsPerSecond": transcript["overallWordsPerSecond"],
        "measuredPauses": transcript["pauses"], "sceneDelivery": scene_delivery,
        "emphasisBeats": emphasis_beats, "structure": transcript["structure"],
        "method": "Words and timestamps from the reviewed Whisper timing master; pauses independently measured with FFmpeg silencedetect at -38 dB for at least 220 ms.",
    }
    (OUT / "audio" / "analysis").mkdir(parents=True, exist_ok=True)
    (OUT / "audio" / "analysis" / "narration-delivery.json").write_text(json.dumps(delivery, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "scenes" / "narration-analysis.json").write_text(json.dumps(delivery, ensure_ascii=False, indent=2), encoding="utf-8")

    srt = "\n\n".join(f"{c['id']}\n{srt_time(c['start'])} --> {srt_time(c['end'])}\n{chr(10).join(subtitle_lines(c['words']))}" for c in captions) + "\n"
    (OUT / "subtitles" / "transcript.srt").write_text(srt, encoding="utf-8")
    (OUT / "transcript.srt").write_text(srt, encoding="utf-8")
    text_lines = ["PYTHON — THE NAME BEHIND THE LANGUAGE", "Subtitles: Hinglish in Roman / Latin script (not translated)", "Duration: 52.21875 seconds", "", "FULL TRANSCRIPT", full_text, "", "TIMED TRANSCRIPT"]
    text_lines += [f"[{srt_time(c['start'])[:-4]} --> {srt_time(c['end'])[:-4]}] {c['text']}" for c in captions]
    (OUT / "subtitles" / "transcript.txt").write_text("\n".join(text_lines) + "\n", encoding="utf-8")
    (OUT / "transcript.txt").write_text("\n".join(text_lines) + "\n", encoding="utf-8")

    board = ["# Scene-by-Scene Storyboard", "", "![Rendered visual storyboard](storyboard-contact-sheet.jpg)", "", "**Format:** 1080×1920 · 30 fps · 11 scenes · 52.21875 seconds", "", "The original Hindi/Hinglish voice is the timing master. All visuals are original programmatic SVG, CSS and Three.js graphics; no unrelated stock footage is used.", ""]
    for scene in SCENES:
        board += [f"## {scene['id']} · {scene['start']:05.2f}–{scene['end']:05.2f} · {scene['title']}", "", f"**Narration:** {scene['spoken']}", "", f"**Visual concept:** {scene['concept']}", "", f"**Background:** {scene['background']}", "", f"**Animated objects:** {scene['objects']}", "", f"**Typography:** {scene['typography']}", "", f"**Camera:** {scene['camera']}", "", f"**Transition:** {scene['transition']}", "", f"**Sound:** {scene['sfx']}", ""]
    (OUT / "scenes" / "storyboard.md").write_text("\n".join(board), encoding="utf-8")
    print(f"Built {len(words)} timed words, {len(captions)} subtitle cues and {len(SCENES)} scenes.")


if __name__ == "__main__":
    main()
