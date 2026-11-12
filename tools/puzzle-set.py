"""Generate the DURF puzzle set: six different jigsaw pieces, one per theme, that fit together
as a 3 x 2 puzzle (themes 1-3 on top, 4-6 below).

Every piece is drawn in the same frame (viewBox -35 -35 170 170, the cell itself is 0..100),
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

# One edge from (0,0) to (1,0); v is the bulge (positive = to the left of travel, scaled below).
TAB = [((0.00, 0), (0.30, 0), (0.37, 0)),
       ((0.44, 0), (0.46, .06), (0.41, .12)),
       ((0.33, .22), (0.37, .33), (0.50, .33)),
       ((0.63, .33), (0.67, .22), (0.59, .12)),
       ((0.54, .06), (0.56, 0), (0.63, 0)),
       ((0.70, 0), (1.00, 0), (1.00, 0))]


def edge(p0, p1, bulge):
    """Cubic segments from p0 to p1; bulge +1 goes to the left of the direction of travel."""
    (x0, y0), (x1, y1) = p0, p1
    dx, dy = x1 - x0, y1 - y0
    nx, ny = dy, -dx          # left normal in SVG coordinates (y down)
    def pt(u, v):
        return (round(x0 + dx * u + nx * v * bulge, 2), round(y0 + dy * u + ny * v * bulge, 2))
    if bulge == 0:
        return [f"L{x1},{y1}"]
    segs = [f"L{pt(*TAB[0][2])[0]},{pt(*TAB[0][2])[1]}"]
    for c1, c2, p in TAB[1:]:
        a, b, c = pt(*c1), pt(*c2), pt(*p)
        segs.append(f"C{a[0]},{a[1]} {b[0]},{b[1]} {c[0]},{c[1]}")
    return segs


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
    # clockwise: top (left->right), right (top->bottom), bottom (right->left), left (bottom->top).
    # Going clockwise in SVG coordinates, "outward" is to the left of travel.
    d = ["M0,0"]
    d += edge((0, 0), (100, 0), s["T"])
    d += edge((100, 0), (100, 100), s["R"])
    d += edge((100, 100), (0, 100), s["B"])
    d += edge((0, 100), (0, 0), s["L"])
    return " ".join(d) + " Z"


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    paths = {n: piece_path(n) for n in range(1, 7)}
    for n, d in paths.items():
        (OUT / f"piece-{n}.svg").write_text(
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-35 -35 170 170">\n'
            f'  <title>DURF puzzle piece, theme {n}</title>\n'
            f'  <path fill="{COLOURS[n]}" d="{d}"/>\n</svg>\n')
    group = "\n".join(
        f'  <path fill="{COLOURS[n]}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round" transform="translate({((n - 1) % 3) * 100} {((n - 1) // 3) * 100})" d="{d}"/>'
        for n, d in paths.items())
    (OUT / "puzzle-set.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-35 -35 370 270">\n'
        f'  <title>DURF puzzle: the six themes fitted together</title>\n{group}\n</svg>\n')
    for n in paths:
        print(n, sides(n))


if __name__ == "__main__":
    main()
