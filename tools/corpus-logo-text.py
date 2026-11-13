"""Make assets/img/scholarly-corpus-logo+text.svg from assets/img/scholarly-corpus-logo.svg:
the corpus logo with "Dutch scholarly communication corpus / a shared resource" under it.

scholarly-corpus-logo.svg is the owner's original file with a C2PA manifest: never edit it.
This script copies its drawing (not the manifest) into a new file and adds the text as
outlines (Nunito, SIL Open Font License), so it looks the same everywhere as an <img>.

Run:  pip install fonttools
      python3 tools/corpus-logo-text.py path/to/Nunito-variable.ttf
"""
import re, sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

HERE = Path(__file__).resolve().parent.parent / "assets" / "img"
SRC, OUT = HERE / "scholarly-corpus-logo.svg", HERE / "scholarly-corpus-logo+text.svg"
NUNITO = sys.argv[1]
NAVY, ORANGE = "#104C73", "#D9531E"
LINES = [("DUTCH SCHOLARLY", 900, NAVY), ("COMMUNICATION CORPUS", 900, NAVY), ("A SHARED RESOURCE", 500, ORANGE)]

src = SRC.read_text()
vb = re.search(r'viewBox="([^"]+)"', src).group(1)
x0, y0, w, h = [float(v) for v in vb.split()]
inner = re.sub(r"<metadata>.*?</metadata>", "", src.split(">", 1)[1].rsplit("</svg>", 1)[0], flags=re.S)
inner = re.sub(r"<title>.*?</title>", "", inner, flags=re.S)

def text_path(txt, wght, width):
    f = instantiateVariableFont(TTFont(NUNITO), {"wght": wght})
    gs, cmap, upm = f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm
    names = [cmap[ord(c)] for c in txt]
    raw = sum(gs[n].width for n in names)
    return f, gs, names, raw, upm

# the widest line fills 90% of the logo width; all lines share that size
size = None
for txt, wght, _ in LINES[:2]:
    _, _, _, raw, upm = text_path(txt, wght, w)
    s = (w * .9) / raw * upm
    size = s if size is None else min(size, s)
gap, lh = size * .45, size * 1.12
paths, y = [], y0 + h + gap + size * .72
for i, (txt, wght, col) in enumerate(LINES):
    f, gs, names, raw, upm = text_path(txt, wght, w)
    fs = size * (.92 if i == 2 else 1)
    s = fs / upm
    x = x0 + w / 2 - raw * s / 2
    pen = SVGPathPen(gs)
    for n in names:
        gs[n].draw(TransformPen(pen, (s, 0, 0, -s, x, y))); x += gs[n].width * s
    paths.append(f'<path fill="{col}" d="{pen.getCommands()}"/>')
    y += lh
H = y - lh + size * .3 - y0
out = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:g} {y0:g} {w:g} {H:.0f}" width="{w:g}" height="{H:.0f}" role="img" aria-labelledby="t">\n'
       f'<title id="t">Dutch Scholarly Communication Corpus, a shared resource</title>\n'
       f'<rect x="{x0:g}" y="{y0:g}" width="{w:g}" height="{H:.0f}" fill="#fff"/>\n'
       f'<g>{inner.strip()}</g>\n' + "\n".join(paths) + "\n</svg>\n")
OUT.write_text(out)
print("wrote", OUT, len(out) // 1024, "KB")
