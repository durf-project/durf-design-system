"""Draw assets/img/corpus-shared-resource.svg: the Dutch Scholarly Communication Corpus as a
shared resource, a bookshelf in the six theme colours with a network of links. The text is
converted to outlines (Nunito, SIL Open Font License), so the image looks the same everywhere.

Run: pip install fonttools; python3 tools/corpus-shelf.py path/to/Nunito-variable.ttf assets/img/corpus-shared-resource.svg
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
FONT = sys.argv[1]; OUT = sys.argv[2]

def text_path(txt, weight, size, cx, baseline, spacing=0.0):
    f = instantiateVariableFont(TTFont(FONT), {"wght": weight})
    gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f["head"].unitsPerEm
    s = size / upm
    names = [cmap[ord(c)] for c in txt]
    width = sum(gs[n].width for n in names) + spacing * upm * (len(txt) - 1)
    x = cx - width * s / 2
    pen = SVGPathPen(gs)
    for n in names:
        tp = TransformPen(pen, (s, 0, 0, -s, x, baseline))
        gs[n].draw(tp)
        x += gs[n].width * s + spacing * size
    return pen.getCommands()

C = dict(orange="#EE7628", yellow="#F6DA44", blue="#177ABF", navy="#134C78", green="#17A95D", purple="#5C1B61", red="#83201B")

def book(x, y, w, h, col, rot=0, pivot=None):
    t = ""
    if rot:
        px, py = pivot if pivot else (x + w / 2, y + h)
        t = f' transform="rotate({rot} {px} {py})"'
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{C[col]}"{t}/>'

books = [
  # top shelf, standing on y=443
  book(237, 207, 66, 236, "orange"), book(303, 236, 33, 207, "yellow"),
  book(392, 238, 55, 205, "yellow", -17, (392, 443)),
  book(503, 237, 54, 206, "blue"), book(558, 207, 59, 236, "navy"), book(618, 218, 50, 225, "green"),
  book(700, 238, 52, 205, "green", -14, (700, 443)),
  book(862, 235, 52, 208, "purple", 18, (914, 443)),
  book(934, 207, 30, 236, "red", 12, (964, 443)),
  book(997, 237, 51, 206, "red"),
  # bottom shelf, standing on y=760
  book(151, 572, 51, 188, "green"), book(204, 533, 60, 227, "purple"),
  book(312, 550, 55, 210, "purple", -18, (312, 760)),
  book(398, 707, 254, 53, "red"), book(416, 655, 216, 50, "blue"), book(443, 615, 174, 38, "yellow"),
  book(722, 536, 60, 224, "red", 14, (782, 760)),
  book(800, 578, 66, 182, "green", 5, (866, 760)),
  book(885, 551, 50, 209, "blue"), book(937, 520, 59, 240, "yellow"), book(997, 571, 51, 189, "orange"),
]
nodes = {"A": (434, 302), "B": (476, 407), "C": (850, 328), "D": (567, 555)}
lines = [((410, 302), "A"), ("A", (503, 272)), ("A", "B"), ("B", (330, 605)), ((330, 612), "D"),
         ("D", (548, 445)), ("D", (768, 585)), ((720, 276), "C"), ((745, 374), "C"), ("C", (800, 535))]
P = lambda p: nodes[p] if isinstance(p, str) else p
net = "".join(f'<line x1="{P(a)[0]}" y1="{P(a)[1]}" x2="{P(b)[0]}" y2="{P(b)[1]}"/>' for a, b in lines)
dots = "".join(f'<circle cx="{x}" cy="{y}" r="10"/>' for x, y in nodes.values())

frame = (f'<path fill="{C["navy"]}" fill-rule="evenodd" d="M100,105H1100V810H100Z M150,155V445H1050V155Z M150,493V760H1050V493Z"/>')
corner = (f'<g fill="{C["orange"]}"><path d="M100,280 L280,105 L297,105 L100,297Z"/>'
          f'<rect x="150" y="155" width="70" height="13"/><rect x="207" y="155" width="13" height="73"/>'
          f'<rect x="1050" y="760" width="50" height="50"/></g>')
t1 = text_path("DUTCH SCHOLARLY", 900, 70, 600, 922, .01)
t2 = text_path("COMMUNICATION CORPUS", 900, 70, 600, 1003, .01)
t3 = text_path("A SHARED RESOURCE", 500, 66, 600, 1085)
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="70 75 1060 1050" width="1060" height="1050" role="img" aria-labelledby="t">
  <title id="t">Dutch Scholarly Communication Corpus, a shared resource: a bookshelf with books in the six DURF theme colours, connected by a network of links</title>
  <rect x="70" y="75" width="1060" height="1050" fill="#fff"/>
  {frame}
  {corner}
  <g>{"".join(books)}</g>
  <g stroke="{C["blue"]}" stroke-width="3.5" fill="none">{net}</g>
  <g fill="#fff" stroke="{C["blue"]}" stroke-width="3.5">{dots}</g>
  <path fill="{C["navy"]}" d="{t1} {t2}"/>
  <path fill="#DD5A1E" d="{t3}"/>
</svg>
'''
open(OUT, "w").write(svg)
