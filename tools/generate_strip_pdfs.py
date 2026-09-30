#!/usr/bin/env python3
"""
generate_strip_pdfs.py: printable US Letter ride packets for every itinerary.

Each packet (pdf/nyc_to_montreal_<itinerary>_strip_maps.pdf) is laid out for
double-sided printing:

  cover            whole-route map in day colours, one card per day
  essentials       hotels and phone numbers, symbol legend, key facts
  per day          front: route map, stats, sunrise/sunset, hotel, lunch,
                          surface, bail-outs, elevation profile
                   back:  full turn-by-turn cue sheet (never truncated;
                          continues on extra pages when needed, padded
                          with a notes page so every day starts on a new sheet)

Single-day files (pdf/<itinerary>_stage<N>.pdf) hold just that day's pages.

Data comes straight from tools/build.py (content.py + data/routes.json), so run
`python3 tools/build.py` first if you changed routes or content.

Standard library only. Text uses the PDF base-14 Helvetica fonts with WinAnsi
encoding, so French accents print correctly.
"""

import datetime
import math
import os
import sys
import zlib

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build as B  # noqa: E402
import content as C  # noqa: E402
import pdf_fonts  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_DIR = os.path.join(ROOT, "pdf")
YEAR = 2026

PAGE_W, PAGE_H = 612.0, 792.0
M = 30.0                      # page margin
CW = PAGE_W - 2 * M           # content width


# ---------------------------------------------------------------------------
# Colour
# ---------------------------------------------------------------------------
def hexrgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))

def tint(rgb, t):
    """Mix toward white: t=0 original, t=1 white."""
    return tuple(c + (1 - c) * t for c in rgb)

def shade(rgb, t):
    return tuple(c * (1 - t) for c in rgb)

INK = hexrgb("#0f172a")
MUTED = hexrgb("#475569")
FAINT = hexrgb("#94a3b8")
RULE = hexrgb("#e2e8f0")
PANEL = hexrgb("#f8fafc")
WHITE = (1.0, 1.0, 1.0)
NAVY = hexrgb("#0b1a33")
AMBER = hexrgb("#fbbf24")
LUNCH = hexrgb("#ea580c")
BORDER = hexrgb("#15803d")
FERRY = hexrgb("#0284c7")
POI = hexrgb("#7c3aed")
START = hexrgb("#16a34a")
SURFACE_COLORS = {"Bike path": hexrgb("#16a34a"), "Street": hexrgb("#94a3b8"), "Road shoulder": hexrgb("#f59e0b"),
                  "Unpaved": hexrgb("#92400e"), "Ferry": hexrgb("#0284c7")}


# ---------------------------------------------------------------------------
# Text
# ---------------------------------------------------------------------------
FONTS = {"R": ("F1", pdf_fonts.HELVETICA), "B": ("F2", pdf_fonts.HELVETICA_BOLD),
         "I": ("F3", pdf_fonts.HELVETICA), "BI": ("F4", pdf_fonts.HELVETICA_BOLD)}
SUBST = {"→": "–", "➔": "–", "↔": "–", "≈": "~", "−": "-", " ": " ", " ": " ", " ": " "}

def enc(s):
    """Unicode -> WinAnsi bytes, dropping anything the base-14 fonts can't show (emoji etc.)."""
    s = "".join(SUBST.get(ch, ch) for ch in str(s))
    out = bytearray()
    for ch in s:
        try:
            out += ch.encode("cp1252")
        except UnicodeEncodeError:
            pass
    return bytes(out)

def pdfstr(b):
    parts = []
    for x in b:
        if x in (40, 41, 92):
            parts.append("\\" + chr(x))
        elif 32 <= x < 127:
            parts.append(chr(x))
        else:
            parts.append("\\%03o" % x)
    return "(" + "".join(parts) + ")"

def text_width(s, size, font="R", tracking=0.0):
    b = enc(s)
    w = FONTS[font][1]
    return sum(w[x - 32] if x >= 32 else 0 for x in b) * size / 1000.0 + tracking * max(0, len(b) - 1)

def wrap(s, size, width, font="R"):
    words = str(s).split()
    lines, cur = [], ""
    for wd in words:
        trial = (cur + " " + wd).strip()
        if text_width(trial, size, font) <= width:
            cur = trial
            continue
        if cur:
            lines.append(cur)
        # a single word wider than the column: hard-break it
        while text_width(wd, size, font) > width and len(wd) > 1:
            k = len(wd)
            while k > 1 and text_width(wd[:k], size, font) > width:
                k -= 1
            lines.append(wd[:k])
            wd = wd[k:]
        cur = wd
    if cur:
        lines.append(cur)
    return lines or [""]


# ---------------------------------------------------------------------------
# Page canvas
# ---------------------------------------------------------------------------
class Page:
    def __init__(self):
        self.ops = []

    def raw(self, s):
        self.ops.append(s)

    def data(self):
        return "".join(self.ops).encode("latin-1")

    # state
    def save(self): self.raw("q\n")
    def restore(self): self.raw("Q\n")
    def alpha(self, name): self.raw(f"/{name} gs\n")

    def clip_rect(self, x, y, w, h):
        self.raw(f"{x:.2f} {y:.2f} {w:.2f} {h:.2f} re W n\n")

    def _paint(self, fill, stroke, lw, dash=None, cap=0, join=0):
        s = ""
        if fill is not None:
            s += "%.3f %.3f %.3f rg " % fill
        if stroke is not None:
            s += "%.3f %.3f %.3f RG %.2f w %d J %d j " % (stroke + (lw, cap, join))
            s += ("[%s] 0 d " % " ".join("%.1f" % d for d in dash)) if dash else "[] 0 d "
        op = "B" if fill is not None and stroke is not None else ("f" if fill is not None else "S")
        return s, op

    def rect(self, x, y, w, h, fill=None, stroke=None, lw=1.0):
        s, op = self._paint(fill, stroke, lw)
        self.raw(f"{s}{x:.2f} {y:.2f} {w:.2f} {h:.2f} re {op}\n")

    def rrect(self, x, y, w, h, r, fill=None, stroke=None, lw=1.0):
        r = min(r, w / 2, h / 2)
        k = 0.5523 * r
        s, op = self._paint(fill, stroke, lw)
        self.raw(s + f"{x + r:.2f} {y:.2f} m {x + w - r:.2f} {y:.2f} l "
                 f"{x + w - r + k:.2f} {y:.2f} {x + w:.2f} {y + r - k:.2f} {x + w:.2f} {y + r:.2f} c "
                 f"{x + w:.2f} {y + h - r:.2f} l {x + w:.2f} {y + h - r + k:.2f} {x + w - r + k:.2f} {y + h:.2f} {x + w - r:.2f} {y + h:.2f} c "
                 f"{x + r:.2f} {y + h:.2f} l {x + r - k:.2f} {y + h:.2f} {x:.2f} {y + h - r + k:.2f} {x:.2f} {y + h - r:.2f} c "
                 f"{x:.2f} {y + r:.2f} l {x:.2f} {y + r - k:.2f} {x + r - k:.2f} {y:.2f} {x + r:.2f} {y:.2f} c h {op}\n")

    def circle(self, x, y, r, fill=None, stroke=None, lw=1.0):
        k = 0.5523 * r
        s, op = self._paint(fill, stroke, lw)
        self.raw(s + f"{x + r:.2f} {y:.2f} m {x + r:.2f} {y + k:.2f} {x + k:.2f} {y + r:.2f} {x:.2f} {y + r:.2f} c "
                 f"{x - k:.2f} {y + r:.2f} {x - r:.2f} {y + k:.2f} {x - r:.2f} {y:.2f} c "
                 f"{x - r:.2f} {y - k:.2f} {x - k:.2f} {y - r:.2f} {x:.2f} {y - r:.2f} c "
                 f"{x + k:.2f} {y - r:.2f} {x + r:.2f} {y - k:.2f} {x + r:.2f} {y:.2f} c h {op}\n")

    def poly(self, pts, stroke=None, lw=1.0, fill=None, close=False, dash=None, cap=1, join=1):
        if len(pts) < 2:
            return
        s, op = self._paint(fill, stroke, lw, dash, cap, join)
        path = f"{pts[0][0]:.2f} {pts[0][1]:.2f} m " + " ".join(f"{x:.2f} {y:.2f} l" for x, y in pts[1:])
        self.raw(f"{s}{path}{' h' if close else ''} {op}\n")

    def line(self, x1, y1, x2, y2, stroke=INK, lw=1.0, dash=None, cap=0):
        self.poly([(x1, y1), (x2, y2)], stroke=stroke, lw=lw, dash=dash, cap=cap)

    def text(self, x, y, s, size, font="R", color=INK, align="left", tracking=0.0, halo=None):
        b = enc(s)
        if not b:
            return
        if align != "left":
            w = text_width(s, size, font, tracking)
            x -= w if align == "right" else w / 2
        fid = FONTS[font][0]
        tc = f"{tracking:.2f} Tc "  # always set: Tc persists in the graphics state
        skew = " 1 0 0.2 1 %.2f %.2f Tm" % (x, y) if font in ("I", "BI") else ""
        pos = skew if skew else f" {x:.2f} {y:.2f} Td"
        if halo is not None:
            self.raw("q %.3f %.3f %.3f RG %.2f w 1 j 2 Tr BT /%s %.2f Tf %s%s %s Tj ET Q\n"
                     % (halo[0][0], halo[0][1], halo[0][2], halo[1], fid, size, tc, pos, pdfstr(b)))
        self.raw("%.3f %.3f %.3f rg BT /%s %.2f Tf %s%s %s Tj ET\n" % (color + (fid, size, tc, pos, pdfstr(b))))

    def para(self, x, y, s, size, width, font="R", color=INK, leading=1.28):
        """Wrapped paragraph; y is the first baseline. Returns the y below the last line."""
        for ln in wrap(s, size, width, font):
            self.text(x, y, ln, size, font, color)
            y -= size * leading
        return y


def para_height(s, size, width, font="R", leading=1.28):
    return len(wrap(s, size, width, font)) * size * leading


# ---------------------------------------------------------------------------
# Vector icons (turn arrows and symbols) drawn in a size x size box at (x, y)
# ---------------------------------------------------------------------------
def _arrow(pg, pts, color, lw):
    pg.poly(pts, stroke=color, lw=lw, cap=0, join=1)
    (x1, y1), (x2, y2) = pts[-2], pts[-1]
    a = math.atan2(y2 - y1, x2 - x1)
    h = lw * 2.2
    tip = (x2 + math.cos(a) * h * 0.9, y2 + math.sin(a) * h * 0.9)
    l = (x2 + math.cos(a + 2.4) * h, y2 + math.sin(a + 2.4) * h)
    r = (x2 + math.cos(a - 2.4) * h, y2 + math.sin(a - 2.4) * h)
    pg.poly([tip, l, r], fill=color, close=True)

def icon(pg, kind, x, y, size, bg, fg=WHITE, round_=True):
    """kind: straight, left, right, bear-left, bear-right, uturn, start, finish, terminus, lunch, border, ferry, poi."""
    if round_:
        pg.circle(x + size / 2, y + size / 2, size / 2, fill=bg)
    else:
        pg.rrect(x, y, size, size, size * 0.22, fill=bg)
    s = size
    P = lambda u, v: (x + u * s, y + v * s)  # noqa: E731
    lw = max(0.8, s * 0.11)
    if kind == "straight":
        _arrow(pg, [P(.5, .2), P(.5, .62)], fg, lw)
    elif kind == "left":
        _arrow(pg, [P(.62, .18), P(.62, .52), P(.34, .52)], fg, lw)
    elif kind == "right":
        _arrow(pg, [P(.38, .18), P(.38, .52), P(.66, .52)], fg, lw)
    elif kind == "bear-left":
        _arrow(pg, [P(.58, .18), P(.58, .42), P(.38, .62)], fg, lw)
    elif kind == "bear-right":
        _arrow(pg, [P(.42, .18), P(.42, .42), P(.62, .62)], fg, lw)
    elif kind == "uturn":
        _arrow(pg, [P(.62, .2), P(.62, .66), P(.38, .66), P(.38, .42)], fg, lw)
    elif kind == "start":
        pg.poly([P(.38, .28), P(.38, .72), P(.74, .5)], fill=fg, close=True)
    elif kind in ("finish", "terminus"):
        if kind == "finish":
            n = 4; q = s * 0.5 / n; ox, oy = x + s * 0.25, y + s * 0.25
            for i in range(n):
                for j in range(n):
                    pg.rect(ox + i * q, oy + j * q, q, q, fill=fg if (i + j) % 2 == 0 else bg)
            pg.rect(ox, oy, s * 0.5, s * 0.5, stroke=fg, lw=0.4)
        else:  # bed
            pg.rect(x + s * .22, y + s * .3, s * .56, s * .1, fill=fg)
            pg.rect(x + s * .22, y + s * .3, s * .07, s * .38, fill=fg)
            pg.rect(x + s * .71, y + s * .3, s * .07, s * .2, fill=fg)
            pg.rrect(x + s * .31, y + s * .42, s * .17, s * .1, s * .04, fill=fg)
            pg.rect(x + s * .48, y + s * .4, s * .23, s * .1, fill=fg)
    elif kind == "lunch":  # fork and knife
        pg.line(*P(.38, .22), *P(.38, .78), stroke=fg, lw=lw * .8)
        for u in (.31, .38, .45):
            pg.line(*P(u, .58), *P(u, .78), stroke=fg, lw=lw * .55)
        pg.line(*P(.31, .58), *P(.45, .58), stroke=fg, lw=lw * .55)
        pg.poly([P(.6, .22), P(.6, .78), P(.7, .62), P(.66, .5), P(.66, .22)], fill=fg, close=True)
    elif kind == "border":  # flag
        pg.line(*P(.32, .2), *P(.32, .8), stroke=fg, lw=lw * .8)
        pg.poly([P(.33, .8), P(.72, .7), P(.33, .56)], fill=fg, close=True)
    elif kind == "ferry":
        pg.poly([P(.2, .5), P(.8, .5), P(.68, .34), P(.3, .34)], fill=fg, close=True)
        pg.rect(x + s * .42, y + s * .5, s * .18, s * .14, fill=fg)
        pg.line(*P(.2, .24), *P(.8, .24), stroke=fg, lw=lw * .6, dash=(s * .08, s * .06))
    else:  # poi pin
        pg.circle(x + s * .5, y + s * .58, s * .17, fill=fg)
        pg.poly([P(.37, .52), P(.63, .52), P(.5, .24)], fill=fg, close=True)
        pg.circle(x + s * .5, y + s * .58, s * .07, fill=bg)

KIND_COLORS = {"lunch": LUNCH, "border": BORDER, "ferry": FERRY, "poi": POI, "start": START}

def cue_kind(c, first):
    t = c.get("turnDir", "")
    if first:
        return "start"
    if t in ("finish", "terminus", "lunch", "border", "ferry", "poi"):
        return t
    if t in ("left", "right", "bear-left", "bear-right", "straight"):
        return t
    if c.get("icon") == "↶":
        return "uturn"
    return "straight"


# ---------------------------------------------------------------------------
# Sun
# ---------------------------------------------------------------------------
def sun_times(date, lat, lon, utc_offset=-4):
    """NOAA sunrise/sunset (local clock, EDT). Accurate to about a minute."""
    n = date.timetuple().tm_yday
    g = 2 * math.pi / 365 * (n - 1)
    eqt = 229.18 * (0.000075 + 0.001868 * math.cos(g) - 0.032077 * math.sin(g) - 0.014615 * math.cos(2 * g) - 0.040849 * math.sin(2 * g))
    dec = (0.006918 - 0.399912 * math.cos(g) + 0.070257 * math.sin(g) - 0.006758 * math.cos(2 * g)
           + 0.000907 * math.sin(2 * g) - 0.002697 * math.cos(3 * g) + 0.00148 * math.sin(3 * g))
    la = math.radians(lat)
    ha = math.degrees(math.acos(math.cos(math.radians(90.833)) / (math.cos(la) * math.cos(dec)) - math.tan(la) * math.tan(dec)))
    def clock(mins):
        mins = (mins + utc_offset * 60) % 1440
        h, m = divmod(int(round(mins)), 60)
        return f"{(h - 1) % 12 + 1}:{m:02d} {'AM' if h < 12 else 'PM'}"
    return clock(720 - 4 * (lon + ha) - eqt), clock(720 - 4 * (lon - ha) - eqt)

def parse_date(s):
    return datetime.datetime.strptime(f"{s} {YEAR}", "%b %d %Y").date()


# ---------------------------------------------------------------------------
# Itinerary model
# ---------------------------------------------------------------------------
def short_title(key):
    t = C.STAGES[key]["title"]
    return t

def day_model(key, num, label, dow, date, color):
    st = C.STAGES[key]; r = B.R[key]
    cues = B.build_cues(key, key)
    if key == "D7":
        end_name = "Place Jacques-Cartier, Old Montréal"
    else:
        end_name = C.PLACES[st["hotels"][0]]["name"]
    return dict(key=key, num=num, label=label, dow=dow, date=date, color=hexrgb(color),
                title=st["title"], short=st.get("short", st["title"]), subtitle=st.get("subtitle", ""),
                mi=r["mi"], km=round(r["mi"] * 1.609344, 1), gain=r["gain_ft"], profile=r["profile"],
                nav=r["nav"], app=r["app"], cues=cues,
                hotels=[B.place_rec(key, h) for h in st["hotels"]],
                lunch=B.place_rec(key, st["lunch"]) if st.get("lunch") else None,
                shops=[B.place_rec(key, s) for s in st.get("shops", [])],
                bailout=B.fill(st.get("bailout", ""), key), surface=B.surface_text(key),
                alt=st.get("alt_note") or "", end_name=end_name,
                gpx=B.day_gpx_path(*GPX_IDX[(key, num)]) if (key, num) in GPX_IDX else "")

GPX_IDX = {}

def itinerary_model(iid):
    if iid == "vermont":
        stages = C.VERMONT["stages"]
        days = []
        for i, (k, dow, date) in enumerate(stages, 1):
            GPX_IDX[(k, f"VT-{i}")] = ("vermont", i)
            days.append(day_model(k, f"VT-{i}", f"Alt. day {i}", dow, date, B.DAY_COLORS[3 + i]))
        title = "Vermont Champlain Islands variant"
        kicker = f"OCTOBER 8 – 9, {YEAR}  ·  REPLACES 7-DAY DAYS 5 & 6"
        note = f"Replaces {C.VERMONT['replaces']}. {C.VERMONT['note']}"
    else:
        it = C.ITINERARIES[iid]
        days = []
        for i, (k, dow, date) in enumerate(it["stages"], 1):
            GPX_IDX[(k, i)] = (iid, i)
            days.append(day_model(k, i, f"Day {i}", dow, date, B.DAY_COLORS[(i - 1) % len(B.DAY_COLORS)]))
        d0, d1 = parse_date(days[0]["date"]), parse_date(days[-1]["date"])
        title = it["title"]
        kicker = f"OCTOBER {d0.day} – {d1.day}, {YEAR}  ·  {len(days)}-DAY TOUR"
        note = it.get("blurb", "")
    tot = round(sum(d["mi"] for d in days), 1)
    return dict(id=iid, title=title, kicker=kicker, note=note, days=days, mi=tot, km=round(tot * 1.609344, 1),
                gain=sum(d["gain"] for d in days))


# ---------------------------------------------------------------------------
# Geometry helpers
# ---------------------------------------------------------------------------
def cumulative(nav, total_mi):
    out = [0.0]
    for a, b in zip(nav, nav[1:]):
        out.append(out[-1] + B.hav(a, b))
    f = total_mi / (out[-1] / B.MI) if out[-1] else 1
    return [x / B.MI * f for x in out]

def point_at(nav, cm, mile):
    if mile <= 0:
        return nav[0]
    for i in range(1, len(cm)):
        if cm[i] >= mile:
            t = (mile - cm[i - 1]) / max(1e-9, cm[i] - cm[i - 1])
            return (nav[i - 1][0] + t * (nav[i][0] - nav[i - 1][0]), nav[i - 1][1] + t * (nav[i][1] - nav[i - 1][1]))
    return nav[-1]

class Projection:
    """Equirectangular projection fitted into a box, north up."""
    def __init__(self, pts, x, y, w, h, pad=0.08):
        lats = [p[0] for p in pts]; lons = [p[1] for p in pts]
        self.k = math.cos(math.radians((min(lats) + max(lats)) / 2))
        xs = [lo * self.k for lo in lons]
        dx, dy = max(xs) - min(xs), max(lats) - min(lats)
        dx, dy = max(dx, 1e-4), max(dy, 1e-4)
        self.s = min(w * (1 - 2 * pad) / dx, h * (1 - 2 * pad) / dy)
        self.cx, self.cy = (max(xs) + min(xs)) / 2, (max(lats) + min(lats)) / 2
        self.ox, self.oy = x + w / 2, y + h / 2
        self.box = (x, y, w, h)

    def __call__(self, p):
        return (self.ox + (p[1] * self.k - self.cx) * self.s, self.oy + (p[0] - self.cy) * self.s)

    def pt_per_mile(self):
        return self.s / 69.0  # one degree of latitude is ~69 mi

def nice_step(span, target):
    raw = span / max(1, target)
    for s in (1, 2, 2.5, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000):
        if s >= raw:
            return s
    return 1000


# ---------------------------------------------------------------------------
# Components
# ---------------------------------------------------------------------------
def band(pg, x, y, w, h, color, r=10):
    pg.rrect(x, y, w, h, r, fill=color)
    # a subtle diagonal sheen for depth
    pg.save(); pg.alpha("A10")
    pg.poly([(x + w * .55, y), (x + w, y), (x + w, y + h), (x + w * .72, y + h)], fill=WHITE, close=True)
    pg.restore()

def stat(pg, x, y, value, label, color=WHITE, sub=None, size=20):
    pg.text(x, y, value, size, "B", color)
    pg.text(x, y - 11, label.upper(), 6.5, "B", sub or color, tracking=0.9)

def section_title(pg, x, y, s, color, icon_kind=None):
    if icon_kind:
        icon(pg, icon_kind, x, y - 3, 11, color)
        x += 15
    pg.text(x, y, s.upper(), 7.5, "B", color, tracking=1.1)

def draw_route_map(pg, box, day, context, markers=True):
    x, y, w, h = box
    pg.rrect(x, y, w, h, 8, fill=hexrgb("#eef3f8"))
    proj = Projection(day["app"], x, y, w, h, pad=0.1)
    pg.save(); pg.clip_rect(x, y, w, h)
    # graticule
    lat0, lat1 = min(p[0] for p in day["app"]) - 1, max(p[0] for p in day["app"]) + 1
    lon0, lon1 = min(p[1] for p in day["app"]) - 1, max(p[1] for p in day["app"]) + 1
    step = 0.1 if (proj.s > 900) else 0.25
    g = math.floor(lat0 / step) * step
    while g <= lat1:
        a, b = proj((g, lon0)), proj((g, lon1))
        pg.line(a[0], a[1], b[0], b[1], stroke=hexrgb("#dde5ee"), lw=0.5)
        g += step
    g = math.floor(lon0 / step) * step
    while g <= lon1:
        a, b = proj((lat0, g)), proj((lat1, g))
        pg.line(a[0], a[1], b[0], b[1], stroke=hexrgb("#dde5ee"), lw=0.5)
        g += step
    # US / Canada line (45th parallel along this corridor)
    if min(p[0] for p in day["app"]) - 0.3 < 45.0 < max(p[0] for p in day["app"]) + 0.3:
        a, b = proj((45.0, lon0)), proj((45.0, lon1))
        pg.line(a[0], a[1], b[0], b[1], stroke=hexrgb("#b91c1c"), lw=0.9, dash=(4, 2.5))
        pg.text(x + 8, a[1] + 4, "CANADA", 6, "B", hexrgb("#b91c1c"), tracking=1)
        pg.text(x + 8, a[1] - 9, "USA", 6, "B", hexrgb("#b91c1c"), tracking=1)
    # neighbouring days, faint, for context
    for other in context:
        if other is day:
            continue
        pg.poly([proj(p) for p in other["app"]], stroke=hexrgb("#c3cfdc"), lw=1.6)
    pts = [proj(p) for p in day["app"]]
    pg.poly(pts, stroke=WHITE, lw=6.5)
    pg.poly(pts, stroke=day["color"], lw=3.0)
    pg.restore()
    if not markers:
        return proj
    nav, cm = day["nav"], cumulative(day["nav"], day["mi"])
    avoid = [proj(nav[0]), proj(nav[-1])] + [proj(point_at(nav, cm, c["mile"])) for c in day["cues"]
                                             if cue_kind(c, False) in ("lunch", "border", "ferry")]
    # mile markers (skipped where they'd sit under a stop icon)
    ms = 5 if day["mi"] < 45 else 10
    m = ms
    while m < day["mi"]:
        px, py = proj(point_at(nav, cm, m))
        if all(math.hypot(px - ax, py - ay) > 15 for ax, ay in avoid):
            pg.circle(px, py, 5.6, fill=WHITE, stroke=day["color"], lw=1)
            pg.text(px, py - 2.1, f"{m:g}", 5.6, "B", INK, align="center")
        m += ms
    # special stops
    for c in day["cues"]:
        k = cue_kind(c, False)
        if k in ("lunch", "border", "ferry"):
            px, py = proj(point_at(nav, cm, c["mile"]))
            icon(pg, k, px - 7, py - 7, 14, KIND_COLORS[k])
    sx, sy = proj(nav[0]); ex, ey = proj(nav[-1])
    icon(pg, "start", sx - 8, sy - 8, 16, START)
    icon(pg, "finish" if day["key"] in ("D7", "6D6") else "terminus", ex - 8, ey - 8, 16, INK)
    # start / finish labels
    parts = [p.strip() for p in day["short"].replace("→", "|").split("|")]
    if len(parts) == 2:
        for (px, py), name in (((sx, sy), parts[0]), ((ex, ey), parts[1])):
            al = "left" if px < x + w * 0.6 else "right"
            tx = px + 12 if al == "left" else px - 12
            pg.text(tx, py - 3, name, 8, "B", INK, align=al, halo=(WHITE, 2.6))
    # scale bar + north arrow
    ppm = proj.pt_per_mile()
    sb = nice_step(60 / ppm, 1)
    L = sb * ppm
    bx, by = x + 10, y + 10
    pg.rect(bx - 4, by - 4, L + 34, 14, fill=WHITE)
    pg.line(bx, by + 2, bx + L, by + 2, stroke=INK, lw=1.4)
    pg.line(bx, by, bx, by + 4, stroke=INK, lw=1); pg.line(bx + L, by, bx + L, by + 4, stroke=INK, lw=1)
    pg.text(bx + L + 4, by, f"{sb:g} mi", 6, "B", INK)
    nx, ny = x + w - 14, y + h - 22
    pg.poly([(nx, ny + 12), (nx - 4.5, ny), (nx, ny + 3), (nx + 4.5, ny)], fill=INK, close=True)
    pg.text(nx, ny - 8, "N", 6.5, "B", INK, align="center")
    return proj

def draw_profile(pg, box, day, compact=False):
    x, y, w, h = box
    prof = day["profile"]
    color = day["color"]
    lo_v = min(e for _, e in prof); hi_v = max(e for _, e in prof)
    step = nice_step(max(hi_v - lo_v, 100), 4)
    lo = 0 if lo_v < step * 2 else math.floor(lo_v / step) * step
    hi = max(lo + step, math.ceil(hi_v / step) * step)
    padl = 0 if compact else 34
    padb = 0 if compact else 14
    gx, gy, gw, gh = x + padl, y + padb, w - padl - (0 if compact else 6), h - padb - (0 if compact else 18)
    X = lambda m: gx + gw * m / max(0.1, day["mi"])  # noqa: E731
    Y = lambda e: gy + gh * (e - lo) / (hi - lo)  # noqa: E731
    if not compact:
        v = lo
        while v <= hi + 0.1:
            pg.line(gx, Y(v), gx + gw, Y(v), stroke=RULE, lw=0.5)
            pg.text(gx - 4, Y(v) - 2, f"{v:,.0f} ft", 5.8, "R", MUTED, align="right")
            v += step
        ms = 5 if day["mi"] < 45 else 10
        m = 0
        while m <= day["mi"] + 0.01:
            pg.text(X(m), y + 3, f"{m:g}", 5.8, "R", MUTED, align="center")
            m += ms
        pg.text(gx + gw, y + 3, "mi", 5.8, "B", MUTED, align="left")
    pts = [(X(mi), Y(e)) for mi, e in prof]
    pg.poly([(pts[0][0], gy)] + pts + [(pts[-1][0], gy)], fill=tint(color, 0.72), close=True)
    pg.poly(pts, stroke=color, lw=1.1 if compact else 1.5)
    if compact:
        return
    # markers for special stops
    for c in day["cues"]:
        k = cue_kind(c, False)
        if k in ("lunch", "border", "ferry"):
            px = X(c["mile"])
            pg.line(px, gy, px, gy + gh + 2, stroke=KIND_COLORS[k], lw=0.8, dash=(2, 1.5))
            icon(pg, k, px - 6, gy + gh + 2, 12, KIND_COLORS[k])
    # high point
    mi_hi, e_hi = max(prof, key=lambda p: p[1])
    pg.circle(X(mi_hi), Y(e_hi), 2.2, fill=shade(color, 0.3))
    al = "right" if X(mi_hi) > gx + gw * 0.8 else "left"
    pg.text(X(mi_hi) + (-5 if al == "right" else 5), Y(e_hi) + 3, f"High point {e_hi:,} ft (mi {mi_hi:.0f})", 6.2, "B", shade(color, 0.35), align=al, halo=(WHITE, 2))


# ---------------------------------------------------------------------------
# Pages
# ---------------------------------------------------------------------------
def footer(pg, left, right):
    pg.line(M, 40, M + CW, 40, stroke=RULE, lw=0.6)
    pg.text(M, 30, left, 6.3, "R", MUTED)
    pg.text(M + CW, 30, right, 6.3, "B", MUTED, align="right")

def cover_page(it):
    pg = Page()
    days = it["days"]
    # hero
    hx, hy, hw, hh = M, PAGE_H - M - 178, CW, 178
    pg.rrect(hx, hy, hw, hh, 12, fill=NAVY)
    # whole-trip elevation silhouette along the bottom of the hero
    pg.save(); pg.clip_rect(hx, hy, hw, hh)
    tot = sum(d["mi"] for d in days); off = 0.0
    top = max(e for d in days for _, e in d["profile"])
    for d in days:
        pts = [(hx + hw * (off + mi) / tot, hy + 6 + 58 * e / top) for mi, e in d["profile"]]
        pg.save(); pg.alpha("A35")
        pg.poly([(pts[0][0], hy)] + pts + [(pts[-1][0], hy)], fill=d["color"], close=True)
        pg.restore()
        pg.poly(pts, stroke=tint(d["color"], 0.25), lw=0.9)
        off += d["mi"]
    pg.restore()
    pg.text(hx + 24, hy + hh - 30, it["kicker"], 8.5, "B", AMBER, tracking=1.6)
    if it["id"] == "vermont":
        ts = 34
        while text_width("LAKE CHAMPLAIN", ts, "B") > hw - 250:
            ts -= 1
        pg.text(hx + 22, hy + hh - 70, "LAKE CHAMPLAIN", ts, "B", WHITE)
        pg.text(hx + 22, hy + hh - 70 - ts * 1.05, "ISLANDS VARIANT", ts, "B", AMBER)
    else:
        pg.text(hx + 22, hy + hh - 70, "NEW YORK", 38, "B", WHITE)
        pg.text(hx + 22, hy + hh - 108, "TO", 38, "B", AMBER)
        pg.text(hx + 22 + text_width("TO ", 38, "B"), hy + hh - 108, "MONTRÉAL", 38, "B", WHITE)
    sx = hx + hw - 208
    stat(pg, sx, hy + hh - 58, f"{it['mi']:.1f}", "miles", WHITE, AMBER, 24)
    stat(pg, sx + 104, hy + hh - 58, f"{it['km']:.0f}", "kilometres", WHITE, AMBER, 24)
    stat(pg, sx, hy + hh - 104, f"+{it['gain']:,}", "feet of climbing", WHITE, AMBER, 24)
    stat(pg, sx + 104, hy + hh - 104, f"{len(days)}", "days of riding" if len(days) > 2 else "days", WHITE, AMBER, 24)

    # overview map column
    top_y = hy - 14
    mx, mw = M, 176
    my, mh = 56, top_y - 56
    pg.rrect(mx, my, mw, mh, 10, fill=hexrgb("#eef3f8"))
    allpts = [p for d in days for p in d["app"]]
    proj = Projection(allpts, mx, my, mw, mh, pad=0.07)
    lat_lo, lat_hi = min(p[0] for p in allpts), max(p[0] for p in allpts)
    if lat_lo < 45.0 < lat_hi:
        a = proj((45.0, -80)); b = proj((45.0, -60))
        pg.save(); pg.clip_rect(mx, my, mw, mh)
        pg.line(a[0], a[1], b[0], b[1], stroke=hexrgb("#b91c1c"), lw=0.9, dash=(4, 2.5))
        pg.restore()
        pg.text(mx + 8, a[1] + 4, "CANADA", 6, "B", hexrgb("#b91c1c"), tracking=1)
        pg.text(mx + 8, a[1] - 9, "USA", 6, "B", hexrgb("#b91c1c"), tracking=1)
    for d in days:
        pg.poly([proj(p) for p in d["app"]], stroke=WHITE, lw=6)
    for d in days:
        pg.poly([proj(p) for p in d["app"]], stroke=d["color"], lw=3.2)
    sx0, sy0 = proj(days[0]["nav"][0])
    icon(pg, "start", sx0 - 7, sy0 - 7, 14, START)
    for i, d in enumerate(days):
        ex, ey = proj(d["nav"][-1])
        last = i == len(days) - 1 and d["key"] in ("D7", "6D6")
        r = 7.5
        pg.circle(ex, ey, r, fill=INK if last else WHITE, stroke=d["color"], lw=1.6)
        lab = "FIN" if last else str(d["num"] if isinstance(d["num"], int) else i + 1)
        pg.text(ex, ey - 2.4, lab, 6.2 if last else 7, "B", WHITE if last else INK, align="center")
        town = d["short"].split("→")[-1].strip()
        al = "right" if ex > mx + mw * 0.55 else "left"
        pg.text(ex + (-11 if al == "right" else 11), ey - 3, town, 7.2, "B", INK, align=al, halo=(hexrgb("#eef3f8"), 2.6))
    start_name = days[0]["short"].split("→")[0].strip()
    al = "right" if sx0 > mx + mw * 0.55 else "left"
    pg.text(sx0 + (-11 if al == "right" else 11), sy0 - 3, start_name, 7.2, "B", INK, align=al, halo=(hexrgb("#eef3f8"), 2.6))
    ny = my + mh - 24
    pg.poly([(mx + mw - 14, ny + 12), (mx + mw - 18.5, ny), (mx + mw - 14, ny + 3), (mx + mw - 9.5, ny)], fill=INK, close=True)
    pg.text(mx + mw - 14, ny - 8, "N", 6.5, "B", INK, align="center")

    # day cards
    cx = mx + mw + 14
    cw = M + CW - cx
    gap = 7
    ch = min(84, (mh - gap * (len(days) - 1)) / len(days))
    cy = top_y
    for d in days:
        cy -= ch
        pg.rrect(cx, cy, cw, ch, 9, fill=PANEL, stroke=RULE, lw=0.6)
        pg.rrect(cx, cy, 52, ch, 9, fill=d["color"])
        pg.rect(cx + 40, cy, 12, ch, fill=d["color"])
        lab = d["label"].split()
        pg.text(cx + 26, cy + ch / 2 + 6, " ".join(lab[:-1]).upper(), 6.5, "B", tint(d["color"], 0.6), align="center", tracking=1)
        pg.text(cx + 26, cy + ch / 2 - 14, lab[-1], 22, "B", WHITE, align="center")
        tx = cx + 64
        dt = parse_date(d["date"])
        pg.text(tx, cy + ch - 16, f"{d['dow'].upper()}, {dt.strftime('%B').upper()} {dt.day}", 6.8, "B", d["color"], tracking=1)
        tsz = 11.5
        while tsz > 8 and text_width(d["title"], tsz, "B") > cw - 64 - 92 - 24:
            tsz -= 0.25
        pg.text(tx, cy + ch - 31, d["title"], tsz, "B", INK)
        hotel = d["end_name"]
        pg.text(tx, cy + ch - 45, f"{d['mi']:.1f} mi  ·  +{d['gain']:,} ft  ·  {len(d['cues'])} cues", 7.8, "R", MUTED)
        tonight = ("Finish: " if d["key"] in ("D7", "6D6") else "Tonight: ") + hotel
        tl = wrap(tonight, 7.5, cw - 64 - 92 - 24, "B")
        for j, ln in enumerate(tl[:2]):
            pg.text(tx, cy + 12 + 9 * (len(tl[:2]) - 1 - j), ln, 7.5, "B", INK)
        # sparkline of the day's climbing
        spw = 92
        draw_profile(pg, (cx + cw - spw - 12, cy + 10, spw, ch - 26), d, compact=True)
    # spare room under the cards (short itineraries): show the plan notes
    if cy - my > 140 and it["note"]:
        ny_ = cy - 14
        pg.rrect(cx, my, cw, ny_ - my, 9, fill=PANEL, stroke=RULE, lw=0.6)
        section_title(pg, cx + 14, ny_ - 20, "About this variant" if it["id"] == "vermont" else "About this plan", INK, "poi")
        pg.para(cx + 14, ny_ - 38, it["note"], 8.6, cw - 28, "R", INK)
    footer(pg, "Miles reset each day and match that day's GPX file.  Emergency: 911 in the US and Canada.",
           f"Printed ride packet · {it['title']}")
    return pg

def essentials_page(it):
    pg = Page()
    days = it["days"]
    band(pg, M, PAGE_H - M - 54, CW, 54, NAVY)
    pg.text(M + 18, PAGE_H - M - 22, "BEFORE YOU ROLL", 8, "B", AMBER, tracking=1.6)
    pg.text(M + 18, PAGE_H - M - 43, "Where we sleep, what the symbols mean, what to carry", 15, "B", WHITE)
    y = PAGE_H - M - 78

    # hotels table
    section_title(pg, M, y, "Where we sleep", INK, "terminus"); y -= 20
    cols = (M, M + 66, M + 300, M + 456)
    widths = (66, 234, 156, CW - 456)
    pg.rect(M, y - 4, CW, 14, fill=PANEL)
    for cx_, h in zip(cols, ("NIGHT", "HOTEL", "ADDRESS", "PHONE")):
        pg.text(cx_ + 8, y, h, 6.5, "B", MUTED, tracking=0.8)
    y -= 20
    for d in days:
        if d["key"] == "D7" or not d["hotels"]:
            continue
        hs = d["hotels"]; h0 = hs[0]
        dt = parse_date(d["date"])
        name_lines = wrap(h0["name"], 8.3, widths[1] - 14, "B")
        sub = ["Suggested: book ahead"]
        if len(hs) > 1:
            sub += wrap(f"Backup: {hs[1]['name']}" + (f", {hs[1]['phone']}" if hs[1].get("phone") else ""), 6.6, widths[1] - 14)
        addr = wrap(h0["address"], 7.4, widths[2] - 14)
        rh = max(len(name_lines) * 10 + len(sub) * 8.5, len(addr) * 9.5, 20) + 8
        pg.rect(M, y - rh + 10, 3, rh - 4, fill=d["color"])
        pg.text(cols[0] + 8, y, f"{d['dow'][:3]} {dt.strftime('%b')} {dt.day}", 8.3, "B", INK)
        pg.text(cols[0] + 8, y - 10, d["label"], 6.6, "R", MUTED)
        yy = y
        for ln in name_lines:
            pg.text(cols[1] + 8, yy, ln, 8.3, "B", INK); yy -= 10
        for j, ln in enumerate(sub):
            pg.text(cols[1] + 8, yy, ln, 6.6, "R", MUTED); yy -= 8.5
        yy = y
        for ln in addr:
            pg.text(cols[2] + 8, yy, ln, 7.4, "R", INK); yy -= 9.5
        pg.text(cols[3] + 8, y, h0.get("phone") or "", 8.3, "B", INK)
        y -= rh
        pg.line(M, y + 8, M + CW, y + 8, stroke=RULE, lw=0.5)
    y -= 10

    # legend
    section_title(pg, M, y, "Reading the cue sheets", INK, "straight"); y -= 18
    legend = [("start", START, "Start of the day"), ("straight", INK, "Continue onto"), ("left", INK, "Turn left"),
              ("right", INK, "Turn right"), ("bear-left", INK, "Bear left"), ("bear-right", INK, "Bear right"),
              ("lunch", LUNCH, "Lunch or resupply"), ("border", BORDER, "Border crossing"), ("ferry", FERRY, "Ferry"),
              ("poi", POI, "Point of interest"), ("terminus", INK, "Tonight's hotel"), ("finish", INK, "Finish")]
    colw = CW / 4
    for i, (k, col, lab) in enumerate(legend):
        lx = M + (i % 4) * colw; ly = y - (i // 4) * 20
        icon(pg, k, lx, ly - 4, 14, col)
        pg.text(lx + 20, ly + 0.5, lab, 8, "R", INK)
    y -= 20 * math.ceil(len(legend) / 4) + 4
    pg.text(M, y, "Coloured bar on each cue = what you're riding on:", 7.5, "B", MUTED)
    lx = M + 200
    for name, col in SURFACE_COLORS.items():
        pg.rect(lx, y - 1, 4, 9, fill=col)
        pg.text(lx + 8, y, name, 7.5, "R", INK)
        lx += text_width(name, 7.5) + 26
    y -= 14
    pg.text(M, y, "MILE is the distance from the start of that day, measured along the day's GPX track. LEG is how far until the next cue.", 7.3, "R", MUTED)
    y -= 24

    # key facts pulled from the day data (border, ferries, stations)
    section_title(pg, M, y, "Good to know", INK, "poi"); y -= 16
    facts = []
    for d in days:
        for c in d["cues"]:
            if c.get("turnDir") == "border":
                facts.append(("border", BORDER, f"{d['label']}, mile {c['mile']:.1f}: {c['road']}", c.get("detail", "")))
            if c.get("turnDir") == "ferry":
                facts.append(("ferry", FERRY, f"{d['label']}, mile {c['mile']:.1f}: {c['road']}", c.get("detail", "")))
    if it["id"] == "vermont":
        vt = B.VT
        facts.append(("ferry", FERRY, vt["ferry"]["name"], f"{vt['ferry']['schedule']} {vt['ferry']['fare']}. {vt['ferry']['notes']}"))
        facts.append(("ferry", FERRY, vt["bikeFerry"]["name"], f"{vt['bikeFerry']['schedule']} {vt['bikeFerry']['fare']}."))
    facts.append(("poi", POI, "Hours and closures", "Business hours were checked online on 2026-09-27. October hours change often: call ahead before relying on a lunch stop or bike shop."))
    facts.append(("poi", POI, "Emergency", "Dial 911 in both the US and Canada. Each day's front page lists bail-out options (trains, buses, Metro)."))
    if it["note"]:
        facts.append(("poi", POI, "About this plan", it["note"]))
    seen = set()
    for k, col, head, body in facts:
        if (head, body) in seen:
            continue
        seen.add((head, body))
        need = 12 + para_height(body, 7.6, CW - 24)
        if y - need < 52:
            break
        icon(pg, k, M, y - 4, 13, col)
        pg.text(M + 20, y, head, 8.4, "B", INK)
        y = pg.para(M + 20, y - 11, body, 7.6, CW - 24, "R", MUTED) - 7
    footer(pg, "Details come from the tour app (tools/content.py). Verify open hours and phone numbers before riding.",
           it["title"])
    return pg

def info_card(pg, x, y_top, w, kind, color, title, lines, size):
    """lines: list of (text, font, color). Returns the card height."""
    inner = w - 22
    h = 20
    wrapped = []
    for t, f, col in lines:
        if not t:
            continue
        ls = wrap(t, size, inner, f)
        wrapped.append((ls, f, col))
        h += len(ls) * size * 1.3 + 2.5
    h += 4
    pg.rrect(x, y_top - h, w, h, 7, fill=PANEL)
    pg.rect(x, y_top - h, 3, h, fill=color)
    icon(pg, kind, x + 9, y_top - 16, 11, color)
    pg.text(x + 25, y_top - 12.5, title.upper(), 7, "B", color, tracking=1.1)
    yy = y_top - 20 - size
    for ls, f, col in wrapped:
        for ln in ls:
            pg.text(x + 12, yy, ln, size, f, col)
            yy -= size * 1.3
        yy -= 2.5
    return h

def day_cards(d):
    cards = []
    hs = d["hotels"]
    if d["key"] != "D7" and hs:
        h0 = hs[0]
        lines = [(h0["name"], "B", INK), (f"{h0['address']}  ·  {h0.get('phone', '')}", "R", INK),
                 (h0.get("notes", ""), "R", MUTED)]
        if len(hs) > 1:
            lines.append((f"Backup: {hs[1]['name']}, {hs[1].get('phone', '')}", "R", MUTED))
        cards.append(("terminus", INK, "Tonight" if d["key"] != "6D6" else "Finish hotel", lines))
    elif d["key"] == "D7":
        lines = [("Finish at Place Jacques-Cartier, Old Montréal.", "B", INK)]
        for h in hs:
            lines.append((f"{h['name']}: {h['address']}  ·  {h.get('phone', '')}", "R", INK))
        cards.append(("finish", INK, "Finish", lines))
    if d["lunch"]:
        L = d["lunch"]
        where = f"Mile {L['mile']:.1f}" if L.get("mile") is not None else ""
        if L.get("offRouteMi") and L["offRouteMi"] >= 0.2:
            where += f", {L['offRouteMi']:.1f} mi off route"
        cards.append(("lunch", LUNCH, "Lunch", [(L["name"], "B", INK), (f"{where}  ·  {L['address']}" + (f"  ·  {L['phone']}" if L.get("phone") else ""), "R", INK),
                                             (L.get("notes", ""), "R", MUTED)]))
    cards.append(("straight", SURFACE_COLORS["Bike path"], "Road & surface", [(d["surface"], "R", INK)]))
    if d["bailout"]:
        cards.append(("poi", POI, "If things go wrong", [(d["bailout"], "R", INK)]))
    if d["shops"]:
        shop_lines = []
        for s in d["shops"]:
            where = f"mi {s['mile']:.1f}" if s.get("mile") is not None else ""
            if where and s.get("offRouteMi") and s["offRouteMi"] >= 0.2:
                where += f", {s['offRouteMi']:.1f} mi off route"
            shop_lines.append((s["name"] + (f" ({where})" if where else "") + (f"  ·  {s['phone']}" if s.get("phone") else ""), "R", INK))
        cards.append(("poi", MUTED, "Bike shops", shop_lines))
    if d["alt"]:
        cards.append(("poi", MUTED, "Route note", [(d["alt"], "R", MUTED)]))
    return cards

def day_header(pg, d, h, subtitle=True, right_text=None):
    x, y = M, PAGE_H - M - h
    band(pg, x, y, CW, h, d["color"])
    dt = parse_date(d["date"])
    pg.text(x + 18, y + h - 22, f"{d['label'].upper()}  ·  {d['dow'].upper()}, {dt.strftime('%B').upper()} {dt.day}", 8, "B", tint(d["color"], 0.65), tracking=1.4)
    maxw = (CW - 270) if subtitle else (CW - 60 - text_width(right_text or "", 8, "B"))
    tsize = 21 if subtitle else 15
    while tsize > 12 and text_width(d["title"], tsize, "B") > maxw:
        tsize -= 0.5
    pg.text(x + 18, y + h - 47, d["title"], tsize, "B", WHITE)
    if subtitle and d["subtitle"]:
        yy = y + h - 62
        for ln in wrap(d["subtitle"], 7.8, CW - 270)[:3]:
            pg.text(x + 18, yy, ln, 7.8, "R", tint(d["color"], 0.8)); yy -= 10
    if right_text:
        pg.text(x + CW - 18, y + h - 22, right_text, 8, "B", WHITE, align="right")
    return y

def overview_page(it, d):
    pg = Page()
    hy = day_header(pg, d, 104)
    # stats in the header
    sx = M + CW - 232
    lat, lon = d["nav"][0]
    rise, sset = sun_times(parse_date(d["date"]), lat, lon)
    stat(pg, sx, hy + 58, f"{d['mi']:.1f}", "miles", WHITE, tint(d["color"], 0.7), 22)
    stat(pg, sx + 78, hy + 58, f"+{d['gain']:,}", "ft climb", WHITE, tint(d["color"], 0.7), 22)
    stat(pg, sx + 160, hy + 58, f"{d['km']:.0f}", "km", WHITE, tint(d["color"], 0.7), 22)
    pg.text(sx, hy + 18, f"Sunrise {rise}   ·   Sunset {sset}", 7.8, "B", WHITE)

    body_top = hy - 12
    prof_h = 128
    prof_y = 50
    map_w = 236
    map_y = prof_y + prof_h + 14
    map_h = body_top - map_y
    draw_route_map(pg, (M, map_y, map_w, map_h), d, it["days"])

    # right column cards, shrink text until they fit
    cx = M + map_w + 12
    cw = M + CW - cx
    cards = day_cards(d)
    for size in (8.0, 7.6, 7.2, 6.8, 6.4, 6.0):
        dummy = Page()
        tot = sum(info_card(dummy, 0, 1000, cw, *c, size) for c in cards) + 7 * (len(cards) - 1)
        if tot <= map_h:
            break
    yy = body_top
    for c in cards:
        yy -= info_card(pg, cx, yy, cw, *c, size) + 7

    # elevation profile
    pg.rrect(M, prof_y, CW, prof_h, 8, fill=PANEL)
    pg.text(M + 12, prof_y + prof_h - 15, "ELEVATION", 7, "B", d["color"], tracking=1.1)
    pg.text(M + 76, prof_y + prof_h - 15, f"+{d['gain']:,} ft of climbing over {d['mi']:.1f} mi", 7, "R", MUTED)
    draw_profile(pg, (M + 8, prof_y + 6, CW - 16, prof_h - 22), d)
    gpx = d["gpx"]
    footer(pg, f"GPX: {gpx}   ·   Cue sheet on the back   ·   Emergency 911", f"{it['title']}  ·  {d['label']}")
    return pg

ACTION_SHORT = {"TURN LEFT": "Left", "TURN RIGHT": "Right", "BEAR LEFT": "Bear left", "BEAR RIGHT": "Bear right",
                "CONTINUE ONTO": "Continue", "DEPART ON": "Start on", "ARRIVE": "Arrive", "BOARD FERRY": "Ferry"}

def cue_rows(d):
    rows = []
    for i, c in enumerate(d["cues"]):
        k = cue_kind(c, i == 0)
        act = ACTION_SHORT.get(c["action"], c["action"].title())
        surf = c.get("surface") or ""
        if surf.startswith("Unpaved"):
            sc = SURFACE_COLORS["Unpaved"]
        else:
            sc = SURFACE_COLORS.get(surf)
        note = c.get("detail") or ""
        if surf.startswith("Unpaved"):
            note = (surf.upper() + ". " + note).strip()
        rows.append(dict(mile=c["mile"], kind=k, action=act, road=c["road"], leg=c.get("dist", 0.0), note=note, surf=sc))
    return rows

ROW_STYLES = [(8.6, 7.8), (8.2, 7.4), (7.8, 7.1), (7.4, 6.8), (7.0, 6.5)]
COLS = dict(mile=34, icon=20, action=52, road=164, leg=40)

def row_height(r, rs, ns):
    note_w = CW - sum(COLS.values()) - 10
    rl = len(wrap(r["road"], rs, COLS["road"] - 6, "B"))
    nl = len(wrap(r["note"], ns, note_w, "R")) if r["note"] else 1
    return max(rl * rs * 1.22, nl * ns * 1.25, 12) + 4.5

def cue_pages(it, d):
    rows = cue_rows(d)
    top = PAGE_H - M - 52 - 28
    bottom = 50
    avail = top - bottom
    chosen = None
    for npages in (1, 2, 3, 4):
        for rs, ns in ROW_STYLES:
            hs = [row_height(r, rs, ns) for r in rows]
            # greedy pagination
            pages, cur = 1, 0.0
            for h_ in hs:
                if cur + h_ > avail:
                    pages += 1; cur = 0.0
                cur += h_
            if pages <= npages:
                chosen = (rs, ns, hs)
                break
        if chosen:
            break
    rs, ns, hs = chosen
    groups, cur, acc = [[]], 0.0, 0
    for r, h_ in zip(rows, hs):
        if cur + h_ > avail:
            groups.append([]); cur = 0.0
        groups[-1].append((r, h_)); cur += h_
    out = []
    note_w = CW - sum(COLS.values()) - 10
    for gi, grp in enumerate(groups):
        pg = Page()
        pagelab = f"CUE SHEET {gi + 1} OF {len(groups)}" if len(groups) > 1 else "CUE SHEET"
        hy = day_header(pg, d, 52, subtitle=False, right_text=f"{pagelab}   ·   {d['mi']:.1f} MI   ·   +{d['gain']:,} FT")
        # column heads
        y = hy - 16
        x = M
        heads = [("MILE", COLS["mile"], "right"), ("", COLS["icon"], "left"), ("DO", COLS["action"], "left"),
                 ("ROAD / PATH", COLS["road"], "left"), ("LEG", COLS["leg"], "right"), ("NOTES", note_w, "left")]
        for name, w, al in heads:
            if name:
                pg.text(x + (w - 6 if al == "right" else 6), y, name, 6.5, "B", MUTED, align=al, tracking=0.8)
            x += w
        pg.line(M, y - 5, M + CW, y - 5, stroke=INK, lw=0.8)
        y -= 5
        for r, h_ in grp:
            ry = y - h_
            special = r["kind"] in ("lunch", "border", "ferry", "poi", "finish", "terminus", "start")
            bg = {"lunch": tint(LUNCH, 0.9), "border": tint(BORDER, 0.9), "ferry": tint(FERRY, 0.9), "poi": tint(POI, 0.92),
                  "finish": tint(d["color"], 0.86), "terminus": tint(d["color"], 0.86), "start": tint(START, 0.9)}.get(r["kind"])
            if bg:
                pg.rect(M, ry, CW, h_, fill=bg)
            if r["surf"]:
                pg.rect(M, ry + 1, 3.2, h_ - 2, fill=r["surf"])
            base = y - 3 - rs
            x = M
            pg.text(x + COLS["mile"] - 6, base, f"{r['mile']:.1f}", rs + 0.6, "B", INK, align="right")
            x += COLS["mile"]
            col = KIND_COLORS.get(r["kind"], d["color"] if r["kind"] in ("finish", "terminus") else INK)
            if r["kind"] in ("finish", "terminus"):
                col = INK
            icon(pg, r["kind"], x + 1, base - 3.5, 14, col)
            x += COLS["icon"]
            pg.text(x + 6, base, r["action"], rs - 0.6, "B", col if special else d["color"])
            x += COLS["action"]
            yy = base
            for ln in wrap(r["road"], rs, COLS["road"] - 6, "B"):
                pg.text(x + 6, yy, ln, rs, "B", INK); yy -= rs * 1.22
            x += COLS["road"]
            if r["leg"] and r["kind"] not in ("finish", "terminus"):
                pg.text(x + COLS["leg"] - 6, base, f"{r['leg']:.1f} mi", rs - 0.6, "R", MUTED, align="right")
            x += COLS["leg"]
            if r["note"]:
                yy = base
                for ln in wrap(r["note"], ns, note_w, "R"):
                    pg.text(x + 6, yy, ln, ns, "R", INK if special else hexrgb("#334155")); yy -= ns * 1.25
            pg.line(M, ry, M + CW, ry, stroke=RULE, lw=0.5)
            y = ry
        footer(pg, f"Miles from the start of {d['label']}, measured along {d['gpx']}.  Verify business hours before relying on them.",
               f"{it['title']}  ·  {d['label']}")
        out.append(pg)
    return out

def notes_page(it, d):
    pg = Page()
    hy = day_header(pg, d, 52, subtitle=False, right_text="NOTES")
    y = hy - 30
    while y > 60:
        pg.line(M, y, M + CW, y, stroke=RULE, lw=0.6)
        y -= 22
    footer(pg, "Left blank so the next day starts on a fresh sheet when printed double-sided.", f"{it['title']}  ·  {d['label']}")
    return pg


# ---------------------------------------------------------------------------
# PDF writer
# ---------------------------------------------------------------------------
def write_pdf(pages, path, title):
    objs = [None, None]
    objs.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
    objs.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")
    objs.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>")
    objs.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-BoldOblique /Encoding /WinAnsiEncoding >>")
    objs.append(b"<< /A10 << /Type /ExtGState /ca 0.10 /CA 0.10 >> /A35 << /Type /ExtGState /ca 0.35 /CA 0.35 >> >>")
    info_num = len(objs) + 1
    objs.append(b"<< /Title " + pdfstr(enc(title)).encode("latin-1") + b" /Creator (tools/generate_strip_pdfs.py) >>")
    kids = []
    for pg in pages:
        data = zlib.compress(pg.data(), 9)
        objs.append(b"<< /Length %d /Filter /FlateDecode >>\nstream\n" % len(data) + data + b"\nendstream")
        cnum = len(objs)
        objs.append((f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_W:.1f} {PAGE_H:.1f}] "
                     f"/Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R /F4 6 0 R >> /ExtGState 7 0 R >> "
                     f"/Contents {cnum} 0 R >>").encode("ascii"))
        kids.append(len(objs))
    objs[0] = b"<< /Type /Catalog /Pages 2 0 R >>"
    objs[1] = f"<< /Type /Pages /Kids [{' '.join(f'{k} 0 R' for k in kids)}] /Count {len(kids)} >>".encode("ascii")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        offs = []
        for i, o in enumerate(objs, 1):
            offs.append(f.tell())
            f.write(b"%d 0 obj\n" % i + o + b"\nendobj\n")
        x = f.tell()
        f.write(b"xref\n0 %d\n0000000000 65535 f \n" % (len(objs) + 1))
        for o in offs:
            f.write(b"%010d 00000 n \n" % o)
        f.write(b"trailer\n<< /Size %d /Root 1 0 R /Info %d 0 R >>\nstartxref\n%d\n%%%%EOF\n" % (len(objs) + 1, info_num, x))


def day_pages(it, d, pad=True):
    pages = [overview_page(it, d)] + cue_pages(it, d)
    if pad and len(pages) % 2:
        pages.append(notes_page(it, d))
    return pages

def packet_name(iid):
    return os.path.join(PDF_DIR, f"nyc_to_montreal_{iid}_strip_maps.pdf")

def stage_name(iid, d):
    n = d["num"] if isinstance(d["num"], int) else d["num"]
    return os.path.join(PDF_DIR, f"{iid}_stage{n}.pdf")

def main():
    print("Generating ride packets...")
    for iid in ("6day", "5day", "7day", "vermont"):
        it = itinerary_model(iid)
        pages = [cover_page(it), essentials_page(it)]
        for d in it["days"]:
            dp = day_pages(it, d)
            pages += dp
            write_pdf(day_pages(it, d, pad=False), stage_name(iid, d), f"{it['title']}: {d['label']} {d['title']}")
        write_pdf(pages, packet_name(iid), f"NYC to Montréal ride packet: {it['title']}")
        print(f"  {os.path.relpath(packet_name(iid), ROOT)}: {len(pages)} pages, {len(it['days'])} single-day files")


if __name__ == "__main__":
    main()
