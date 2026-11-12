"""Generate the DURF puzzle set: six different jigsaw pieces, one per theme, that fit together
as a 3 x 2 puzzle (themes 1-3 on top, 4-6 below).

Every piece is drawn in the same frame (viewBox -26 -26 152 152, the cell itself is 0..100),
so pieces can be laid over each other at (col*100, row*100) to assemble the puzzle, and a
pictogram centred in the frame sits in the middle of the piece.

Run: python3 tools/puzzle-set.py   (writes assets/icons/puzzle-set/)
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "assets" / "icons" / "puzzle-set"
COLOURS = {1: "#EE7628", 2: "#F6DA44", 3: "#177ABF", 4: "#17A95D", 5: "#5C1B61", 6: "#83201B"}

# Shared edges. Vertical edge between (r,c) and (r,c+1): +1 = the knob points right.
V = {(0, 0): +1, (0, 1): -1, (1, 0): -1, (1, 1): +1}
# Horizontal edge between (r,c) and (r+1,c): +1 = the knob points down.
H = {0: +1, 1: -1, 2: +1}
# Outer edges, per piece: +1 knob out, -1 hole in.
OUTER = {1: {"T": +1, "L": -1}, 2: {"T": -1}, 3: {"T": -1, "R": -1},
         4: {"L": +1, "B": -1}, 5: {"B": +1}, 6: {"R": +1, "B": +1}}

# The SURF puzzle style: a square with slightly rounded corners, a round knob (a circle that
# sticks out over the edge) or a round hole (the same circle cut away) in the middle of a side.
R = 16      # radius of knob and hole
D = 9       # the circle's centre lies D beyond the edge (knob) or D inside it (hole)
CORNER = 4  # corner radius
C = round((R * R - D * D) ** .5, 2)   # half the width where the circle crosses the edge


def edge(p0, p1, kind):
    """From p0 to p1 (clockwise round the piece). kind +1 knob out, -1 hole, 0 straight."""
    (x0, y0), (x1, y1) = p0, p1
    L = ((x1 - x0) ** 2 + (y1 - y0) ** 2) ** .5
    ux, uy = (x1 - x0) / L, (y1 - y0) / L
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    if kind == 0:
        return [f"L{x1},{y1}"]
    a = (round(mx - ux * C, 2), round(my - uy * C, 2))
    b = (round(mx + ux * C, 2), round(my + uy * C, 2))
    sweep = 1 if kind > 0 else 0       # clockwise on screen goes round the outside
    return [f"L{a[0]},{a[1]}", f"A{R},{R} 0 1 {sweep} {b[0]},{b[1]}", f"L{x1},{y1}"]


def sides(n):
    r, c = divmod(n - 1, 3)
    o = OUTER[n]
    s = {}
    s["T"] = -H[c] if r == 1 else o["T"] if "T" in o else 0
    s["B"] = H[c] if r == 0 else o.get("B", 0)
    s["L"] = -V[(r, c - 1)] if c > 0 else o.get("L", 0)
    s["R"] = V[(r, c)] if c < 2 else o.get("R", 0)
    return s


def piece_path(n):
    s = sides(n)
    k = CORNER
    d = [f"M{k},0"]
    d += edge((k, 0), (100 - k, 0), s["T"]) + [f"A{k},{k} 0 0 1 100,{k}"]
    d += edge((100, k), (100, 100 - k), s["R"]) + [f"A{k},{k} 0 0 1 {100 - k},100"]
    d += edge((100 - k, 100), (k, 100), s["B"]) + [f"A{k},{k} 0 0 1 0,{100 - k}"]
    d += edge((0, 100 - k), (0, k), s["L"]) + [f"A{k},{k} 0 0 1 {k},0"]
    return " ".join(d) + " Z"


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    paths = {n: piece_path(n) for n in range(1, 7)}
    for n, d in paths.items():
        (OUT / f"piece-{n}.svg").write_text(
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-26 -26 152 152">\n'
            f'  <title>DURF puzzle piece, theme {n}</title>\n'
            f'  <path fill="{COLOURS[n]}" d="{d}"/>\n</svg>\n')
    group = "\n".join(
        f'  <path fill="{COLOURS[n]}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round" transform="translate({((n - 1) % 3) * 100} {((n - 1) // 3) * 100})" d="{d}"/>'
        for n, d in paths.items())
    (OUT / "puzzle-set.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-26 -26 352 252">\n'
        f'  <title>DURF puzzle: the six themes fitted together</title>\n{group}\n</svg>\n')
    for n in paths:
        print(n, sides(n))


if __name__ == "__main__":
    main()
