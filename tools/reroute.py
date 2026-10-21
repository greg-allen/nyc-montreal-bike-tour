#!/usr/bin/env python3
"""Patch a section of one or more routes in data/routes.json with a freshly bike-routed section.

Each patch is anchored by two coordinates (A and B) on the existing track. Every route whose
track passes within ANCHOR_M of A and then B gets the part between them replaced by a new
section, routed on OpenStreetMap (routing.openstreetmap.de, bicycle profile) through the
patch's via points. A section can also include short hand-drawn pieces for connections that
exist on the ground but aren't connected in OpenStreetMap (each one must say who checked it).

The patch updates, for every route it touches: the nav and app tracks, the turn steps (miles
after the patch are shifted), the total distance, the elevation profile and estimated climbing
(SRTM 30 m from api.opentopodata.org, same method as the original audit: 600 m smoothing,
3 m threshold, applied as a difference so untouched parts keep their numbers), and the mile
ranges of unpaved sections.

Run:   python3 tools/reroute.py --list
       python3 tools/reroute.py PATCH [PATCH ...]   (then: python3 tools/build.py)
       python3 tools/reroute.py --dry-run PATCH     (show what would change)
"""
import argparse, json, math, os, sys, time, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROUTES = os.path.join(ROOT, "data", "routes.json")
MI = 1609.344
FT = 3.28084
ANCHOR_M = 30
UA = {"User-Agent": "mtl-bike-route-tools/1.0"}

# ---------------------------------------------------------------------------
# Patches. Coordinates are (lat, lon). 'a'/'b' may be "start"/"end" for a day's endpoints.
# 'routes' limits a patch to those route keys (required when an anchor is "start" or "end").
# Pieces: ("route", [via points]) bike-routes from the previous piece's end through the vias;
#         ("line", [points], [steps]) is drawn as given (steps: (name, type, modifier) at each
#         listed point index). The last piece always ends at B.
# ---------------------------------------------------------------------------
PATCHES = {
    "les-prince": dict(
        why="Ride feedback 2026-10-04: the Rivington/Bowery/Prince/Mulberry/Jersey/Crosby jog and 0.9 mi of "
            "busy Houston St are replaced by the Prince St bike lane, 6th Ave and Charlton St, as ridden. "
            "Also removes a 0.1 mi back-and-forth where the old track joined the Hudson River Greenway.",
        a=(40.721625, -73.993484), b=(40.729659, -74.010858),
        pieces=[("route", [(40.72463, -73.99859), (40.72696, -74.00344), (40.72734, -74.00744)])]),
    "brewster-arrive": dict(
        why="Ride feedback 2026-10-04: the trail passes 0.4 mi from the Comfort Inn. The old track rode 3 mi past it "
            "and looped back over Dingle Ridge and Nichols Rd (about 6.3 mi). A short gravel track links the trail "
            "to Danbury Rd; it isn't connected in OpenStreetMap, but was ride-tested on Oct 4, 2026.",
        routes=["D1"], a=(41.38912, -73.58821), b="end",
        pieces=[("line", [(41.38912, -73.58821), (41.38877, -73.58899), (41.38866, -73.58912)],
                 [(0, "Gravel access track to Danbury Road", "turn", "right"),
                  (2, "Danbury Road [US 6; US 202]", "turn", "left")]),
                ("route", [])]),
    "brewster-depart": dict(
        why="Ride feedback 2026-10-05: the old track rode east to Joes Hill Rd to join the trail, then back west "
            "through Brewster village streets (with a 0.1 mi out-and-back on Putnam Ave). Now: Danbury Rd to the "
            "gravel access track and the Maybrook Trailway all the way west.",
        routes=["D2"], a="start", b=(41.40632, -73.61936),
        pieces=[("route", [(41.38877, -73.58899)]),
                ("line", [(41.38877, -73.58899), (41.38912, -73.58821), (41.38962, -73.58920)],
                 [(0, "Gravel access track to the Maybrook Trailway", "turn", "right"),
                  (1, "Maybrook Trailway", "turn", "left")]),
                ("route", [(41.39352, -73.59420), (41.40381, -73.618148)])]),
    "cohoes-blvd": dict(
        why="Ride feedback 2026-10-06: the old track left the Cohoes Blvd path at Bridge Ave and looped west "
            "through downtown Cohoes (Columbia, Main, White, High, Ontario) back to the same corner. Now it stays "
            "on the Cohoes Blvd path (OSM way 1216058523, bicycle=designated) to its north end and continues on "
            "Saratoga St (NY-32) to the Waterford bridge. The router won't use that path, so it is drawn from "
            "its OpenStreetMap geometry.",
        a=(42.76913, -73.697656), b=(42.776851, -73.696802),
        pieces=[("line", [(42.76913, -73.697656), (42.769434, -73.697556), (42.770115, -73.69738), (42.770348, -73.697314),
                          (42.770655, -73.697245), (42.771196, -73.697122), (42.771732, -73.697001), (42.772112, -73.696916),
                          (42.772503, -73.696833), (42.773807, -73.696538), (42.773882, -73.696545), (42.774047, -73.69652),
                          (42.774179, -73.696495), (42.774537, -73.696458), (42.774763, -73.696481), (42.774943, -73.696536),
                          (42.775171, -73.696653), (42.775329, -73.696774), (42.775486, -73.696942), (42.775627, -73.697141),
                          (42.775663, -73.697206), (42.77622, -73.69713)],
                 [(0, "Cohoes Boulevard", "new name", "straight"),
                  (20, "Saratoga Street [NY 32]", "new name", "straight")]),
                ("route", [])]),
    "waterford-spur": dict(
        why="The old track turned south onto the canal trail at 5th St in Waterford and came straight back "
            "(0.3 mi out-and-back, a stray routing point).",
        a=(42.791029, -73.680972), b=(42.792661, -73.679434), pieces=[("route", [])]),
    "schuylerville-arrive": dict(
        why="Simpler arrival: Burgoyne St to Green St and Spring St, dropping the Clancy St / University St zigzag.",
        routes=["D3"], a=(43.09911, -73.59540), b="end",
        pieces=[("route", [(43.1000, -73.5853), (43.10229, -73.58437)])]),
    "fort-miller-river-rd": dict(
        why="Ride feedback 2026-10-07: the unnamed path off Dix Bridge Rd was hard to find, "
            "and River Rd is a quiet alternative to 1.5 mi of US-4, as ride-tested.",
        a=(43.117155, -73.575235), b=(43.150531, -73.576994),
        pieces=[("route", [(43.12017, -73.57188), (43.14014, -73.58894)])]),
    "rouses-point-lake-st": dict(
        why="Ride feedback 2026-10-09: the old track zigzagged through 11 Rouses Point side streets. Riders "
            "rode straight up Lake St (NY-9B / US-11), past Lakeside Coffee Roasters.",
        routes=["6D6"], a=(44.97533, -73.36383), b=(44.99609, -73.36542), pieces=[("route", [(44.98434, -73.36362)])]),
}

# ---------------------------------------------------------------------------
def hav(a, b):
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    d = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * 6371008.8 * math.asin(math.sqrt(d))

def cumlen(pts):
    out = [0.0]
    for a, b in zip(pts, pts[1:]):
        out.append(out[-1] + hav(a, b))
    return out

def seg_dist(p, a, b):
    """distance in metres from p to segment ab, and the fraction along it"""
    k = math.cos(math.radians(p[0]))
    ax, ay, bx, by, px, py = a[1] * k, a[0], b[1] * k, b[0], p[1] * k, p[0]
    dx, dy = bx - ax, by - ay
    L = dx * dx + dy * dy
    t = 0 if L == 0 else max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / L))
    q = (a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1]))
    return hav(p, q), t, q

def locate(nav, p, after=0):
    """(index of segment start, projected point, distance) of the nearest track segment at or after index 'after'"""
    best = None
    for i in range(after, len(nav) - 1):
        d, t, q = seg_dist(p, nav[i], nav[i + 1])
        if best is None or d < best[2]:
            best = (i, q, d)
    return best

def dp(pts, tol_m):
    """Douglas-Peucker simplification"""
    if len(pts) < 3:
        return list(pts)
    keep = [False] * len(pts); keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        i, j = stack.pop()
        best, bi = 0, None
        for k in range(i + 1, j):
            d = seg_dist(pts[k], pts[i], pts[j])[0]
            if d > best:
                best, bi = d, k
        if bi is not None and best > tol_m:
            keep[bi] = True; stack += [(i, bi), (bi, j)]
    return [p for p, k in zip(pts, keep) if k]

def get_json(url, tries=4):
    for t in range(tries):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60))
        except Exception:
            if t == tries - 1:
                raise
            time.sleep(2 + 3 * t)

def osrm(points):
    s = ";".join(f"{lo:.6f},{la:.6f}" for la, lo in points)
    url = (f"https://routing.openstreetmap.de/routed-bike/route/v1/driving/{s}"
           "?overview=full&geometries=geojson&steps=true&continue_straight=true")
    r = get_json(url)
    if r.get("code") != "Ok":
        raise SystemExit(f"routing failed: {r}")
    route = r["routes"][0]
    geom = [(round(la, 6), round(lo, 6)) for lo, la in route["geometry"]["coordinates"]]
    steps = []
    for leg in route["legs"]:
        for s in leg["steps"]:
            if s["name"]:
                nm = s["name"] + (f" [{s['ref']}]" if s.get("ref") else "")
            else:
                nm = s.get("ref") or "(unnamed path)"
            m = s["maneuver"]
            steps.append(dict(name=nm, dist_m=s["distance"], type=m["type"], mod=m.get("modifier", ""),
                              loc=[round(m["location"][1], 6), round(m["location"][0], 6)]))
    return geom, steps, route["distance"]

def elevations(pts):
    out = []
    for i in range(0, len(pts), 100):
        chunk = pts[i:i + 100]
        url = "https://api.opentopodata.org/v1/srtm30m?locations=" + "|".join(f"{a:.6f},{b:.6f}" for a, b in chunk)
        r = get_json(url)
        out += [x["elevation"] if x["elevation"] is not None else 0.0 for x in r["results"]]
        time.sleep(1.1)
    return out

def resample(pts, step_m):
    cm = cumlen(pts); total = cm[-1]
    out, j = [], 0
    n = max(1, int(total // step_m))
    for k in range(n + 1):
        d = min(total, k * total / n)
        while j < len(pts) - 2 and cm[j + 1] < d:
            j += 1
        seg = cm[j + 1] - cm[j] or 1
        t = (d - cm[j]) / seg
        out.append((pts[j][0] + t * (pts[j + 1][0] - pts[j][0]), pts[j][1] + t * (pts[j + 1][1] - pts[j][1])))
    return out, total / n

def climb_m(pts):
    """Climbing estimate: SRTM every ~30 m, 600 m moving average, 3 m hysteresis."""
    if len(pts) < 2 or cumlen(pts)[-1] < 50:
        return 0.0
    sp, step = resample(pts, 30)
    el = elevations(sp)
    w = max(1, int(round(300 / step)))
    sm = [sum(el[max(0, i - w):i + w + 1]) / len(el[max(0, i - w):i + w + 1]) for i in range(len(el))]
    gain, ref = 0.0, sm[0]
    for e in sm[1:]:
        if e - ref >= 3:
            gain += e - ref; ref = e
        elif e < ref:
            ref = e
    return gain

# ---------------------------------------------------------------------------
def find_anchors(r, patch):
    assert "routes" in patch or "start" not in (patch["a"], patch["b"]) and "end" not in (patch["a"], patch["b"]), "start/end patches need 'routes'"
    nav = r["nav"]
    if patch["a"] == "start":
        ia, qa = 0, tuple(nav[0])
    else:
        ia, qa, d = locate(nav, patch["a"])
        if d > ANCHOR_M:
            return None
    if patch["b"] == "end":
        ib, qb = len(nav) - 1, tuple(nav[-1])
    else:
        ib, qb, d = locate(nav, patch["b"], after=ia)
        if d > ANCHOR_M:
            return None
        ib += 1  # keep the point after the projection
    if ib <= ia:
        return None
    return ia, qa, ib, qb

def build_section(patch, qa, qb):
    """returns (geometry, steps with dist_m, routed metres) from qa to qb"""
    geom, steps, metres = [tuple(qa)], [], 0.0
    pieces = patch["pieces"]
    for n, piece in enumerate(pieces):
        start = geom[-1]
        last = n == len(pieces) - 1
        if piece[0] == "route":
            nxt = pieces[n + 1][1][0] if not last and pieces[n + 1][0] == "line" else None
            end = qb if last else nxt
            g, st, d = osrm([start] + list(piece[1]) + [end])
            geom += g[1:]
            steps += st; metres += d
        else:
            pts = [tuple(p) for p in piece[1]]
            if hav(start, pts[0]) > 1:
                geom.append(pts[0])
            cm = cumlen(pts)
            marks = {i: (nm, ty, mo) for i, nm, ty, mo in piece[2]}
            idx = sorted(marks)
            for j, i in enumerate(idx):
                nm, ty, mo = marks[i]
                end_i = idx[j + 1] if j + 1 < len(idx) else len(pts) - 1
                steps.append(dict(name=nm, dist_m=cm[end_i] - cm[i], type=ty, mod=mo, loc=[pts[i][0], pts[i][1]]))
            geom += pts[1:]; metres += cm[-1]
    if hav(geom[-1], qb) > 1:
        geom.append(tuple(qb))
    return geom, steps, metres

def apply_patch(key, r, patch, dry=False):
    nav = [tuple(p) for p in r["nav"]]
    anchors = find_anchors(r, patch)
    if not anchors:
        return None
    ia, qa, ib, qb = anchors
    navcm = cumlen(nav); f = r["mi"] * MI / navcm[-1]          # routed miles per nav metre
    a_mi = (navcm[ia] + hav(nav[ia], qa)) * f / MI
    b_mi = (navcm[ib] - hav(qb, nav[ib])) * f / MI if patch["b"] != "end" else r["mi"]
    old_sec = [qa] + nav[ia + 1:ib] + ([qb] if patch["b"] != "end" else [])
    geom, steps, metres = build_section(patch, qa, qb)
    new_len_mi = metres / MI
    delta = new_len_mi - (b_mi - a_mi)
    print(f"  {key}: mi {a_mi:.2f}-{b_mi:.2f} ({b_mi - a_mi:.2f} mi) -> {new_len_mi:.2f} mi ({delta:+.2f})")
    for s in steps:
        if s["dist_m"] >= 15:
            print(f"      {s['dist_m'] / MI:5.2f} {s['type']:<12} {s['mod']:<12} {s['name']}")
    if dry:
        return delta

    # --- tracks
    new_nav_sec = dp(geom, 4)
    head = nav[:ia + 1] + ([qa] if hav(nav[ia], qa) > 1 else [])
    tail = ([qb] if patch["b"] != "end" and hav(qb, nav[ib]) > 1 else []) + (nav[ib:] if patch["b"] != "end" else [])
    new_nav = head + new_nav_sec[1:] + tail
    if patch["b"] == "end":
        new_nav = head + new_nav_sec[1:]
    app = [tuple(p) for p in r["app"]]
    app_ia = max(i for i, p in enumerate(app) if i == 0 or p in set(nav[:ia + 1]))
    app_ib = min([i for i, p in enumerate(app) if p in set(nav[ib:])] or [len(app) - 1]) if patch["b"] != "end" else len(app)
    new_app = app[:app_ia + 1] + dp(geom, 15)[1:] + (app[app_ib:] if patch["b"] != "end" else [])

    # --- steps
    old = r["steps"]
    before = [dict(s) for s in old if s["mile"] < a_mi - 0.005]
    if before:
        before[-1]["dist_mi"] = round(max(0.0, a_mi - before[-1]["mile"]), 2)
    mid, m = [], a_mi
    for s in steps:
        mid.append(dict(mile=round(m, 2), name=s["name"], dist_mi=round(s["dist_m"] / MI, 2), type=s["type"], mod=s["mod"], loc=s["loc"]))
        m += s["dist_m"] / MI
    after = []
    if patch["b"] != "end":
        active = [s for s in old if s["mile"] <= b_mi]
        nxt = [s for s in old if s["mile"] > b_mi]
        if mid and mid[-1]["type"] == "arrive":
            mid.pop()
        if active and (not nxt or nxt[0]["mile"] - b_mi > 0.005):
            s0 = active[-1]
            rest = s0["mile"] + s0["dist_mi"] - b_mi
            after.append(dict(mile=round(b_mi + delta, 2), name=s0["name"], dist_mi=round(max(0.0, rest), 2), type="arrive", mod="",
                              loc=[round(qb[0], 6), round(qb[1], 6)]))
        for s in nxt:
            after.append(dict(s, mile=round(s["mile"] + delta, 2)))
    else:
        if mid and mid[-1]["type"] != "arrive":
            pass
    new_steps = before + mid + after

    # --- distance, profile, climbing, surfaces
    new_mi = round(r["mi"] + delta, 1)
    prof = r["profile"]
    keep_a = [p for p in prof if p[0] < a_mi]
    keep_b = [[round(p[0] + delta, 2), p[1]] for p in prof if p[0] > b_mi]
    sec_pts, step = resample(geom, 400)
    sec_el = elevations(sec_pts)
    sec_prof = [[round(a_mi + i * step / MI * (new_len_mi * MI / cumlen(geom)[-1]), 2), round(e * FT)] for i, e in enumerate(sec_el)]
    new_prof = keep_a + [p for p in sec_prof if (not keep_a or p[0] > keep_a[-1][0]) and (not keep_b or p[0] < keep_b[0][0])] + keep_b
    if new_prof[-1][0] != new_mi and patch["b"] == "end":
        new_prof[-1][0] = new_mi
    old_gain, new_gain = climb_m(old_sec), climb_m(geom)
    gain = int(round((r["gain_ft"] + (new_gain - old_gain) * FT) / 100.0) * 100)
    print(f"      climbing on the section: {old_gain * FT:.0f} ft -> {new_gain * FT:.0f} ft; day {r['gain_ft']} -> {gain} ft")
    surf = r.get("surface")
    if surf and surf.get("unpaved"):
        nu = []
        for kind, x, y in surf["unpaved"]:
            if y <= a_mi:
                nu.append([kind, x, y])
            elif x >= b_mi:
                nu.append([kind, round(x + delta, 1), round(y + delta, 1)])
            else:
                print(f"      WARNING: unpaved {kind} {x}-{y} overlaps the patch; check the new section's surface by hand")
        surf = dict(surf, unpaved=nu, unpaved_mi=round(sum(y - x for _, x, y in nu), 1))

    r.update(mi=new_mi, gain_ft=gain, nav=[[round(a, 6), round(b, 6)] for a, b in new_nav],
             app=[[round(a, 6), round(b, 6)] for a, b in new_app], steps=new_steps, profile=new_prof, surface=surf)
    return delta

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("patches", nargs="*")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--only", help="comma-separated route keys to limit the patch to")
    a = ap.parse_args()
    if a.list or not a.patches:
        for k, p in PATCHES.items():
            print(f"{k}: {p['why']}")
        return
    R = json.load(open(ROUTES))
    only = set(a.only.split(",")) if a.only else None
    for name in a.patches:
        patch = PATCHES[name]
        print(f"{name}:")
        hit = False
        for key, r in R.items():
            if (only and key not in only) or ("routes" in patch and key not in patch["routes"]):
                continue
            if apply_patch(key, r, patch, dry=a.dry_run) is not None:
                hit = True
        if not hit:
            print("  (no route passes both anchors)")
    if not a.dry_run:
        with open(ROUTES, "w") as f:
            json.dump(R, f, indent=2, ensure_ascii=False)
        print("data/routes.json updated; now run python3 tools/build.py")

if __name__ == "__main__":
    main()
