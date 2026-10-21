#!/usr/bin/env python3
"""Regenerate every data file the app and GPS devices use from one source of truth.

Inputs
  data/routes.json   bike-routed tracks (OpenStreetMap, routed along the official trail
                     relations), turn steps, elevation-derived climbing, surface summaries
  data/geo.json      geocoded coordinates of every stop
  tools/content.py   human-written content (hotels, food, shops, notes, itineraries)

Outputs
  route_data.js, strip_map_data.js, the combined nyc_to_montreal_*.gpx/.kml files,
  the per-day GPX files in gpx/<itinerary>/ (via tools/split_gpx.py, run automatically)
  and the markdown guides.

Run:  python3 tools/build.py
"""
import json, math, os, sys, html, urllib.parse
from xml.sax.saxutils import escape as xesc

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
import content as C

R = json.load(open(os.path.join(ROOT, "data", "routes.json")))
GEO = json.load(open(os.path.join(ROOT, "data", "geo.json")))
for k, v in C.EXTRA_GEO.items():
    GEO.setdefault(k, v)

MI = 1609.344

def hav(a, b):
    R_ = 6371008.8
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    d = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * R_ * math.asin(math.sqrt(d))

_cum = {}
def cum(key):
    if key not in _cum:
        c = R[key]["nav"]; out = [0.0]
        for i in range(1, len(c)):
            out.append(out[-1] + hav(c[i - 1], c[i]))
        # scale so the track length matches the routed distance exactly
        f = R[key]["mi"] * MI / out[-1]
        _cum[key] = [x * f for x in out]
    return _cum[key]

def along(key, pt):
    """(mile along route, miles off route) of the nearest track point"""
    c = R[key]["nav"]; cm = cum(key)
    i = min(range(len(c)), key=lambda k: (c[k][0] - pt[0]) ** 2 + ((c[k][1] - pt[1]) * 0.72) ** 2)
    return cm[i] / MI, hav(c[i], pt) / MI

def geo(k):
    g = GEO.get(k)
    return [round(g[0], 5), round(g[1], 5)] if g else None

def place_mile(key, place):
    g = geo(place)
    if not g: return None, None
    m, off = along(key, g)
    return round(m, 1), round(off, 1)

def fmt_mi(x): return f"{x:.1f}"

def stage_placeholders(key):
    """{st_x} and friends used in bailout / note text"""
    ph = {}
    for k in GEO:
        m, off = place_mile(key, k) if k.startswith("st_") or k in ("border223",) else (None, None)
        if m is not None: ph[k] = fmt_mi(m)
    for s in R[key]["steps"]:
        if s["name"].startswith("Lake Street [NY 9B]"):
            ph["lake9b"] = fmt_mi(s["mile"]); break
    ph.setdefault("lake9b", "?")
    return ph

def fill(text, key):
    if not text: return text
    class D(dict):
        def __missing__(self, k): return "{" + k + "}"
    return text.format_map(D(stage_placeholders(key)))

# ---------------------------------------------------------------------------
# Turn cues from routed steps
# ---------------------------------------------------------------------------
TRAILWORDS = ("Trail", "Trailway", "Greenway", "Bridge", "Causeway", "Canal", "Path", "Route verte", "Walkway", "Pont", "Ferry", "Piste", "Route 223", "Connector", "Sidepath")

def pretty_road(name):
    base, ref = name, ""
    if " [" in name:
        base, ref = name.split(" [", 1); ref = ref.rstrip("]")
    ref = ref.replace("NY ", "NY-").replace("US ", "US-").replace("CR ", "CR-").replace("VT ", "VT-")
    if ref and ref.isdigit(): ref = "Route " + ref
    if base == "(unnamed path)": base = "bike path"
    if ref and ref not in base and ref.replace("-", " ") not in base:
        return f"{base} ({ref})"
    return base

def surface_at(key, mile):
    s = R[key].get("surface")
    if s:
        for kind, a, b in s.get("unpaved", []):
            if a <= mile < b and kind != "unknown":
                return "Unpaved: " + kind.replace("_", " ")
    return None

def surf_label(key, name, mile):
    u = surface_at(key, mile)
    if u: return u
    if is_ferry(name): return "Ferry"
    if any(w in name for w in ("Pont ", "Trail", "Trailway", "Greenway", "Path", "Piste", "Walk", "Route verte", "Connector", "Causeway", "(unnamed path)")):
        return "Bike path"
    if "[" in name or name.startswith(("NY ", "US ", "Route ", "State Highway", "U.S. Route")): return "Road shoulder"
    return "Street"

def is_ferry(name):
    return name.startswith("FERRY") or "Bike Ferry" in name or name.startswith("Charlotte, VT - Essex")

ARROW = {"left": "↰", "right": "↱", "slight left": "↖", "slight right": "↗", "sharp left": "↰", "sharp right": "↱", "straight": "⬆", "uturn": "↶"}

def bearing(a, b):
    la1, la2 = math.radians(a[0]), math.radians(b[0]); dl = math.radians(b[1] - a[1])
    return math.degrees(math.atan2(math.sin(dl) * math.cos(la2), math.cos(la1) * math.sin(la2) - math.sin(la1) * math.cos(la2) * math.cos(dl)))

def geo_mod(key, loc, reach=40.0):
    """Turn modifier measured from the track itself. Used where a routing waypoint
    split the route at a junction, so the router reported depart/arrive with no turn."""
    c = R[key]["nav"]
    i = min(range(len(c)), key=lambda k: (c[k][0] - loc[0]) ** 2 + ((c[k][1] - loc[1]) * 0.72) ** 2)
    a = i
    while a > 0 and hav(c[a], c[i]) < reach: a -= 1
    b = i
    while b < len(c) - 1 and hav(c[i], c[b]) < reach: b += 1
    if a == i or b == i: return "straight"
    d = (bearing(c[i], c[b]) - bearing(c[a], c[i]) + 540) % 360 - 180
    side = "right" if d > 0 else "left"
    if abs(d) < 25: return "straight"
    if abs(d) < 60: return "slight " + side
    if abs(d) < 150: return side
    return "sharp " + side

def auto_cues(key, notes):
    steps = R[key]["steps"]; total = R[key]["mi"]
    cues = []; notes = dict(notes)
    # the day starts on a hotel driveway a few metres long: open with the first real road instead
    j0 = next((i for i, s in enumerate(steps) if s["mile"] < 0.25 and s["dist_mi"] >= 0.12), 0)
    for i, s in enumerate(steps):
        if i < j0:
            continue
        name = s["name"]; mod = s["mod"] or "straight"; typ = s["type"]
        if typ in ("depart", "arrive") and j0 < i < len(steps) - 1:
            mod = geo_mod(key, s["loc"])
            typ = "turn" if mod != "straight" else "new name"
        if s["dist_mi"] < 0.12 and not is_ferry(name) and i != j0:
            continue
        if cues and pretty_road(name) == cues[-1]["road"]:
            continue
        if typ in ("arrive", "depart", "new name", "notification") or mod == "straight":
            # a road-name change without a real turn: only cue it if it's significant
            significant = s["dist_mi"] >= 1.0 or any(w in name for w in TRAILWORDS) or is_ferry(name)
            if not significant and i != j0:
                continue
            action, turn = ("CONTINUE ONTO", "straight")
        elif "left" in mod:
            action, turn = (("BEAR LEFT" if "slight" in mod else "TURN LEFT"), ("bear-left" if "slight" in mod else "left"))
        elif "right" in mod:
            action, turn = (("BEAR RIGHT" if "slight" in mod else "TURN RIGHT"), ("bear-right" if "slight" in mod else "right"))
        else:
            action, turn = ("CONTINUE ONTO", "straight")
        if is_ferry(name):
            action, turn = ("BOARD FERRY", "ferry")
            name = name.replace("FERRY: ", "")
        if not cues:
            action = "DEPART ON"
        det = ""
        for k, v in list(notes.items()):
            if k.lower() in name.lower():
                det = fill(v, key); del notes[k]; break
        cues.append(dict(mile=0.0 if i == j0 else round(s["mile"], 1), icon=ARROW.get(mod, "⬆") if turn not in ("ferry",) else "⛴", turnDir=turn,
                         road=pretty_road(name), action=action, surface=surf_label(key, s["name"], s["mile"] + min(0.15, s["dist_mi"] / 2)),
                         detail=det, landmark="", corridorSide="center"))
    return cues

def build_cues(stage_key, route_key):
    st = C.STAGES[stage_key]
    cues = auto_cues(route_key, st.get("cue_notes", {}))
    for place, kind, action, road, detail in st.get("extra_cues", []):
        m, off = place_mile(route_key, place)
        if m is None: continue
        icon = {"lunch": "🥪", "border": "🛂", "poi": "📍"}.get(kind, "📍")
        extra = f" ({off:.1f} mi off route)" if off and off >= 0.2 else ""
        cues.append(dict(mile=m, icon=icon, turnDir=kind if kind in ("lunch", "border") else "poi", road=road + extra,
                         action=action, surface="", detail=fill(detail, route_key), landmark="", corridorSide="center"))
    cues.sort(key=lambda c: c["mile"])
    # arrival
    end_place = st["hotels"][0]
    cues.append(dict(mile=R[route_key]["mi"], icon="🏁" if route_key in ("D7", "6D6") else "🚏",
                     turnDir="finish" if route_key in ("D7", "6D6") else "terminus",
                     road=C.PLACES[end_place]["name"] if route_key != "D7" else "Place Jacques-Cartier, Old Montréal",
                     action="ARRIVE", surface="", detail=C.PLACES[end_place]["address"] if route_key != "D7" else "Finish. Hôtel Monville is 0.5 mi west.",
                     landmark="", corridorSide="center"))
    for i, c in enumerate(cues):
        nxt = cues[i + 1]["mile"] if i + 1 < len(cues) else c["mile"]
        c["dist"] = round(max(0.0, nxt - c["mile"]), 1)
        if not c["surface"]:
            c["surface"] = "—"
    return cues

# ---------------------------------------------------------------------------
# Stage records
# ---------------------------------------------------------------------------
def place_rec(route_key, pk, with_mile=True):
    p = C.PLACES[pk]; g = geo(pk)
    rec = dict(name=p["name"], address=p["address"], phone=p.get("phone", ""), notes=p["notes"], coords=g,
               googleUrl=C.gmaps(p["name"] + ", " + p["address"]))
    if with_mile and g and pk not in C.EXTRA_GEO:
        m, off = place_mile(route_key, pk)
        rec["mile"] = m; rec["offRouteMi"] = off
    return rec

def sample_waypoints(key, n=8):
    c = R[key]["nav"]; out = []
    for i in range(1, n + 1):
        out.append(c[int(len(c) * i / (n + 1))])
    return out

def gmaps_dir(key):
    c = R[key]["nav"]
    wp = "|".join(f"{a:.5f},{b:.5f}" for a, b in sample_waypoints(key, 8))
    return ("https://www.google.com/maps/dir/?api=1&travelmode=bicycling&origin=" + f"{c[0][0]:.5f},{c[0][1]:.5f}"
            + "&destination=" + f"{c[-1][0]:.5f},{c[-1][1]:.5f}" + "&waypoints=" + urllib.parse.quote(wp, safe=",|"))

def surface_text(key):
    st_key = key
    txt = C.STAGES[st_key]["surface_note"]
    s = R[key].get("surface")
    if s:
        unp = [u for u in s.get("unpaved", []) if u[0] != "unknown"]
        if unp:
            tot = sum(b - a for _, a, b in unp)
            txt += f" Unpaved per OpenStreetMap: about {tot:.1f} mi (" + ", ".join(f"mi {a:.1f} to {b:.1f} {k.replace('_', ' ')}" for k, a, b in unp) + ")."
        else:
            txt += " No unpaved sections tagged in OpenStreetMap."
    return txt

SPLIT_PREFIX = {"6day": ("6day", "nyc_to_montreal_tour"), "5day": ("5day", "nyc_to_montreal_5day_tour"),
                "7day": ("7day", "nyc_to_montreal_7day_tour"), "vermont": ("vermont", "nyc_to_montreal_vermont_upgrade")}

def day_gpx_path(iid, idx):
    d, prefix = SPLIT_PREFIX[iid]
    return f"gpx/{d}/{prefix}_day{idx:02d}.gpx"

def stage_record(stage_key, idx, dow, date, color, iid):
    st = C.STAGES[stage_key]; r = R[stage_key]
    lunch = place_rec(stage_key, st["lunch"])
    rec = dict(day=idx, dayOfWeek=dow, dateStr=date, name=f"{dow} • Day {idx}: {st['title']}", subtitle=st["subtitle"],
               distanceMiles=r["mi"], distanceKm=round(r["mi"] * 1.609344, 1), elevationFt=r["gain_ft"],
               surface=surface_text(stage_key), color=color, googleMapsDirUrl=gmaps_dir(stage_key),
               startCoords=[round(x, 5) for x in r["nav"][0]], endCoords=[round(x, 5) for x in r["nav"][-1]],
               track=[[round(a, 5), round(b, 5)] for a, b in r["app"]],
               lunch=dict(lunch, location=lunch["address"]),
               hotels=[place_rec(stage_key, h) for h in st["hotels"]],
               bikeShops=[place_rec(stage_key, s) for s in st["shops"]],
               bailout=fill(st["bailout"], stage_key), gpx=day_gpx_path(iid, idx))
    if st.get("alt_note"): rec["altNote"] = st["alt_note"]
    return rec

DAY_COLORS = ["#2563eb", "#0891b2", "#16a34a", "#d97706", "#9333ea", "#059669", "#e11d48"]

def itinerary_record(iid):
    it = C.ITINERARIES[iid]
    days = [stage_record(k, i + 1, dow, date, DAY_COLORS[i], iid) for i, (k, dow, date) in enumerate(it["stages"])]
    if iid == "5day":
        for d, (k, _, _) in zip(days, it["stages"]):
            if k in C.PUSH_OPTIONS_5DAY:
                d["accelerateOption"] = dict(name="Push option (not recommended in October)", notes=C.PUSH_OPTIONS_5DAY[k],
                    targetTown={"5D1": "Kingston, NY", "5D2": "Saratoga Springs, NY", "5D3": "Essex, NY", "D5": "Saint-Jean-sur-Richelieu, QC"}[k],
                    distanceMiles={"5D1": round(R["5D1"]["mi"] + R["PUSH_KINGSTON"]["mi"]), "5D2": 130, "5D3": round(R["5D3"]["mi"] + place_mile("D5", "pinkpig")[0]),
                                   "D5": round(R["D5"]["mi"] + place_mile("6D6", "trinquette")[0])}[k],
                    extraMiles=None, checkpointMile=None, googleMapsUrl="", hotel=None)
    tot = round(sum(d["distanceMiles"] for d in days), 1)
    gain = sum(d["elevationFt"] for d in days)
    return dict(id=iid, title=it["title"], totalDistanceMiles=tot, durationDays=len(days), averageDailyMiles=round(tot / len(days), 1),
                elevationGainFt=gain, schedule=" → ".join(f"{d['dayOfWeek'][:3]} {d['dateStr']}" for d in (days[0], days[-1])),
                pace=it["pace"], blurb=it["blurb"], days=days)

TOURS = {k: itinerary_record(k) for k in ("7day", "6day", "5day")}

def vermont_record():
    stages = []
    for vi, (k, dow, date) in enumerate(C.VERMONT["stages"], 1):
        st = C.STAGES[k]; r = R[k]
        stages.append(dict(stageId=k.replace("VT", "VT-"), dayName=f"Alternative {dow} ({date}): {st['title']}", distanceMiles=r["mi"],
            elevationFt=r["gain_ft"], surface=surface_text(k), startCoords=r["nav"][0], endCoords=r["nav"][-1],
            track=[[round(a, 5), round(b, 5)] for a, b in r["app"]], lunch=dict(place_rec(k, st["lunch"]), location=C.PLACES[st["lunch"]]["address"]),
            hotels=[place_rec(k, h) for h in st["hotels"]], bikeShops=[place_rec(k, s) for s in st["shops"]],
            bailout=fill(st["bailout"], k), gpx=day_gpx_path("vermont", vi)))
    return dict(id="vermont_upgrade", title=C.VERMONT["title"], summary=f"Replaces {C.VERMONT['replaces']}. {C.VERMONT['note']}",
        ferry=dict(name="Lake Champlain Ferries: Essex, NY ➔ Charlotte, VT", crossingTime="About 20 minutes",
                   schedule="Early-fall 2026 schedule: from Essex every 30 min 10:30 AM to 5:30 PM, hourly 6:30 to 10:30 AM and 5:30 to 8:30 PM. Hourly all day from Nov 5. Check ferries.com the day before.",
                   fare="$6.75 per cyclist, one way", location="Essex ferry dock (next to the Pink Pig Cafe)", notes="Walk your bike on. Customer service: (802) 864-9804."),
        bikeFerry=dict(name="Local Motion Island Line Bike Ferry (Colchester Causeway 'Cut')", crossing="Short gap in the causeway between Colchester and South Hero",
                   fare="Suggested donation: $5 one way / $10 round trip",
                   schedule="Fall 2026: Fri 10 AM to 5 PM, Sat and Sun 10 AM to 6 PM, Sep 11 to Oct 12 (Mon Oct 12 is the last day, 10 to 5). No Mon to Thu service.",
                   fallBypass=C.VERMONT["bypass"].format(bypass_mi=R["VT_BYPASS"]["mi"])),
        stages=stages)

VT = vermont_record()

# ---------------------------------------------------------------------------
# route_data.js
# ---------------------------------------------------------------------------
def js(o):
    import re
    txt = json.dumps(o, ensure_ascii=False, indent=1)
    # keep [lat, lon] pairs on one line so generated files stay readable
    return re.sub(r"\[\n\s*(-?\d+(?:\.\d+)?),\n\s*(-?\d+(?:\.\d+)?)\n\s*\]", r"[\1,\2]", txt)

def old_checklist():
    src = open(os.path.join(ROOT, "route_data.js")).read()
    i = src.index("const PACKING_CHECKLIST")
    return src[i:]

CHECKLIST_FIXES = [
    ("High-power 800+ lumen headlight (for October 6:25 PM sunset)", "Bright headlight (400+ lumens) and daytime-visible rear light: sunsets are 6:18 to 6:33 PM on tour dates"),
    ("Smartphone with offline downloaded Google Maps (Albany to Montreal)", "Smartphone with the offline map area downloaded (Google Maps offline areas cover NYC to Montréal in 3 to 4 downloads) plus the day GPX files"),
    ("Photo of bike serial number & purchase receipt on phone (CBP proof of US origin upon re-entry)", "Photo of bike serial number & purchase receipt (optional: register high-value items on CBP Form 4457 before leaving)"),
]

def write_route_data():
    cl = old_checklist()
    for a, b in CHECKLIST_FIXES:
        cl = cl.replace(a, b)
    parts = ["// GENERATED FILE: do not edit by hand. Edit tools/content.py and run `python3 tools/build.py`.",
             f"// Routes: bike-routed on OpenStreetMap along the official trail relations; distances and climbing measured from the tracks.",
             f"// Business details verified online {C.VERIFIED_ON}; call ahead, hours change in October.", ""]
    parts.append(f"const TOUR_DATA_6DAY = {js(TOURS['6day'])};\n")
    parts.append(f"const TOUR_DATA_7DAY = {js(TOURS['7day'])};\n")
    parts.append(f"const TOUR_DATA_5DAY = {js(TOURS['5day'])};\n")
    parts.append(f"const VERMONT_UPGRADE_DATA = {js(VT)};\n")
    parts.append(f"const RETURN_ROUTE = {js(dict(distanceMiles=R['RETURN']['mi'], elevationFt=R['RETURN']['gain_ft'], track=[[round(a,5),round(b,5)] for a,b in R['RETURN']['app']], gpx='gpx/return_montreal_to_rouses_point.gpx'))};\n")
    parts.append("// Global default export for compatibility\nconst TOUR_DATA = TOUR_DATA_6DAY;\n")
    parts.append(cl)
    open(os.path.join(ROOT, "route_data.js"), "w").write("\n".join(parts))

# ---------------------------------------------------------------------------
# strip_map_data.js
# ---------------------------------------------------------------------------
def elev_profile(key, n=16):
    """Coarse profile (about n points) for the web strip map; data/routes.json holds ~0.25 mi samples."""
    full = R[key]["profile"]
    step = max(1, round((len(full) - 1) / (n - 1)))
    prof = full[::step]
    if prof[-1] != full[-1]: prof.append(full[-1])
    st = C.STAGES[key]
    out = []
    for m, e in prof:
        out.append(dict(mile=round(m, 1), elev=e, label=""))
    out[0]["label"] = "Start"; out[-1]["label"] = "Finish"
    lm, _ = place_mile(key, st["lunch"])
    if lm is not None:
        j = min(range(len(out)), key=lambda i: abs(out[i]["mile"] - lm))
        if 0 < j < len(out) - 1: out[j]["label"] = "Lunch"
    return out

def strip_stage(num, key, dow, date):
    st = C.STAGES[key]; r = R[key]
    return dict(stageNum=num, dayOfWeek=dow, dateStr=date, name=st["title"], distanceMiles=r["mi"], elevationFt=r["gain_ft"],
                waterway=st["waterway"], railLine=st["rail"], surfaceSummary=surface_text(key),
                overnight=C.PLACES[st["hotels"][0]]["name"], elevProfile=elev_profile(key), cues=build_cues(key, key),
                altNote=st.get("alt_note") or "")

def write_strip():
    data = {}
    for iid in ("6day", "5day", "7day"):
        it = C.ITINERARIES[iid]; t = TOURS[iid]
        data[iid] = dict(id=iid, code=it["code"], color=it["color"], title=it["title"],
                         subtitle="Turn-by-turn strip map (miles reset each day, matching the day GPX files)",
                         schedule=f"{it['stages'][0][1][:3]} {it['stages'][0][2]} ➔ {it['stages'][-1][1][:3]} {it['stages'][-1][2]} ({len(it['stages'])} days)",
                         totalMiles=f"{t['totalDistanceMiles']:.1f}", totalKm=f"{t['totalDistanceMiles'] * 1.609344:.1f}",
                         elevationGain=f"+{t['elevationGainFt']:,} ft (est.)", avgDaily=f"{t['averageDailyMiles']} mi/day",
                         stages=[strip_stage(i + 1, k, dow, date) for i, (k, dow, date) in enumerate(it["stages"])])
    vt_st = [strip_stage(k.replace("VT", "VT-"), k, "Alternative " + dow, date) for (k, dow, date) in C.VERMONT["stages"]]
    vt_total = sum(R[k]["mi"] for k, _, _ in C.VERMONT["stages"])
    data["vermont"] = dict(id="vermont", code="VT", color="#10b981", title=C.VERMONT["title"],
                           subtitle=f"Replaces {C.VERMONT['replaces']}", schedule="Thu Oct 8 ➔ Fri Oct 9 (then Day 7 as normal)",
                           totalMiles=f"{vt_total:.1f}", totalKm=f"{vt_total * 1.609344:.1f}",
                           elevationGain=f"+{sum(R[k]['gain_ft'] for k, _, _ in C.VERMONT['stages']):,} ft (est.)", avgDaily=f"{vt_total / 2:.1f} mi/day",
                           stages=vt_st)
    open(os.path.join(ROOT, "strip_map_data.js"), "w").write(
        "// GENERATED FILE: do not edit by hand. Edit tools/content.py and run `python3 tools/build.py`.\n"
        "// Cue miles reset at the start of each day and are measured along the day's GPX track.\n"
        f"const STRIP_MAP_ITINERARIES = {js(data)};\n")

# ---------------------------------------------------------------------------
# GPX / KML
# ---------------------------------------------------------------------------
def wpt_list(key):
    st = C.STAGES[key]; out = []
    def add(pk, sym, prefix):
        g = geo(pk)
        if not g: return
        p = C.PLACES.get(pk)
        m, off = place_mile(key, pk)
        name = (p["name"] if p else pk)
        desc = (f"Mile {m:.1f}" + (f", {off:.1f} mi off route" if off >= 0.2 else "") + ". ") + ((p["address"] + ". " + (p.get("phone") or "") + ". " + p["notes"]) if p else "")
        out.append((g, f"{prefix}{name}", desc, sym))
    add(st["lunch"], "Restaurant", "Lunch: ")
    for h in st["hotels"]: add(h, "Lodging", "Hotel: ")
    for s in st["shops"]: add(s, "Bike Trail", "Bike: ")
    for pk, kind, action, road, detail in st.get("extra_cues", []):
        if pk in C.PLACES and pk != st["lunch"]:
            add(pk, "Convenience Store" if "stewarts" in pk else "Restaurant", "Food: ")
        elif pk == "border223":
            g = geo(pk); m, _ = place_mile(key, pk)
            out.append((g, "BORDER: Rouses Point–Lacolle 223", f"Mile {m:.1f}. Open 8 AM to 8 PM daily (both sides). Passport, EDL or NEXUS. No cannabis.", "Crossing"))
    for sk in [k for k in GEO if k.startswith("st_")]:
        m, off = place_mile(key, sk)
        if m is not None and off <= 1.0 and 0.5 < m < R[key]["mi"] + 0.5:
            out.append((geo(sk), "Station: " + GEO[sk][2].split(",")[0] if len(GEO[sk]) > 2 else sk, f"Mile {m:.1f}, {off:.1f} mi off route.", "Train"))
    return out

def densify(pts, max_m=200):
    """Insert interpolated points so no two consecutive track points are more than max_m apart."""
    out = [pts[0]]
    for a, b in zip(pts, pts[1:]):
        n = int(hav(a, b) // max_m)
        for i in range(1, n + 1):
            f = i / (n + 1)
            out.append((a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f))
        out.append(b)
    return out

def gpx_doc(name, desc, tracks, wpts):
    L = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<gpx version="1.1" creator="mtl_bike tools/build.py" xmlns="http://www.topografix.com/GPX/1/1" '
         'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">',
         f'  <metadata><name>{xesc(name)}</name><desc>{xesc(desc)}</desc></metadata>']
    seen = set()
    for g, n, d, sym in wpts:
        if (n, tuple(g)) in seen: continue
        seen.add((n, tuple(g)))
        L.append(f'  <wpt lat="{g[0]:.5f}" lon="{g[1]:.5f}"><name>{xesc(n)}</name><desc>{xesc(d)}</desc><sym>{xesc(sym)}</sym></wpt>')
    for tn, td, pts in tracks:
        L.append(f'  <trk><name>{xesc(tn)}</name><desc>{xesc(td)}</desc><trkseg>')
        L.extend(f'    <trkpt lat="{a:.6f}" lon="{b:.6f}"/>' for a, b in densify(pts))
        L.append('  </trkseg></trk>')
    L.append('</gpx>\n')
    return "\n".join(L)

def track_desc(key):
    r = R[key]
    return f"{r['mi']} mi ({r['mi'] * 1.609344:.1f} km), about +{r['gain_ft']:,} ft. Routed on OpenStreetMap along the official trails."

def write_gpx():
    os.makedirs(os.path.join(ROOT, "gpx"), exist_ok=True)
    # Per-day files are produced from the combined files by tools/split_gpx.py (see split_days()).
    # The return ride isn't part of any itinerary, so it gets its own file.
    open(os.path.join(ROOT, "gpx", "return_montreal_to_rouses_point.gpx"), "w").write(
        gpx_doc("Return ride: Old Montréal to Rouses Point Amtrak", track_desc("RETURN"),
                [("Old Montréal → Rouses Point Amtrak", track_desc("RETURN") + " Southbound Adirondack departs Rouses Point 2:15 PM (no Monday service).", R["RETURN"]["nav"])],
                [(geo("st_rouses"), "Rouses Point Amtrak", "Board southbound Adirondack (train 68) 2:15 PM Sun and Tue to Sat. Reserve a bike spot.", "Train"),
                 (geo("border223"), "US border (Rouses Point–Lacolle 223)", "Open 8 AM to 8 PM daily. Clear US CBP on your bike.", "Crossing")]))
    combined = {"7day": "nyc_to_montreal_7day_tour.gpx", "6day": "nyc_to_montreal_tour.gpx", "5day": "nyc_to_montreal_5day_tour.gpx"}
    for iid, fn in combined.items():
        it = C.ITINERARIES[iid]; tracks = []; wp = []
        for i, (k, dow, date) in enumerate(it["stages"]):
            tracks.append((f"Day {i + 1} ({dow} {date}): {C.STAGES[k]['title']}", track_desc(k), R[k]["nav"]))
            wp += wpt_list(k)
        open(os.path.join(ROOT, fn), "w").write(gpx_doc(it["title"], f"{TOURS[iid]['totalDistanceMiles']} mi total. For bike computers, prefer the one-file-per-day GPX files in gpx/.", tracks, wp))
    # Track order matters: split_gpx numbers them _day01, _day02, _day03 (bypass) in gpx/vermont/.
    tracks = [(f"{k}: {C.STAGES[k]['title']}", track_desc(k), R[k]["nav"]) for k, _, _ in C.VERMONT["stages"]] + [("Bypass: Burlington → South Hero via Sandbar", track_desc("VT_BYPASS"), R["VT_BYPASS"]["nav"])]
    open(os.path.join(ROOT, "nyc_to_montreal_vermont_upgrade.gpx"), "w").write(gpx_doc(C.VERMONT["title"], C.VERMONT["note"], tracks, wpt_list("VT1") + wpt_list("VT2")))

def split_days():
    """Single source for per-day GPX files: split the combined files we just wrote."""
    import glob, split_gpx
    for rel_src, rel_out in split_gpx.SPLIT_TARGETS:
        out = os.path.join(ROOT, rel_out)
        os.makedirs(out, exist_ok=True)
        for old in glob.glob(os.path.join(out, "*.gpx")):
            os.remove(old)  # drop stale files if an itinerary gets shorter
        import contextlib, io
        with contextlib.redirect_stdout(io.StringIO()):
            split_gpx.split_gpx(os.path.join(ROOT, rel_src), output_dir=out)

def kml_doc(name, folders):
    L = ['<?xml version="1.0" encoding="UTF-8"?>', '<kml xmlns="http://www.opengis.net/kml/2.2"><Document>', f'<name>{xesc(name)}</name>']
    colors = ["ffeb6325", "ffd49108", "ff4aa316", "ff0677d9", "ffea3393", "ff699605", "ff483fe1"]
    for i, c in enumerate(colors):
        L.append(f'<Style id="d{i}"><LineStyle><color>{c}</color><width>4</width></LineStyle></Style>')
    for i, (fname, key, wpts) in enumerate(folders):
        L.append(f'<Folder><name>{xesc(fname)}</name>')
        L.append(f'<Placemark><name>{xesc(fname)} ({R[key]["mi"]} mi)</name><description>{xesc(track_desc(key))}</description><styleUrl>#d{i % 7}</styleUrl><LineString><tessellate>1</tessellate><coordinates>')
        L.append(" ".join(f"{b:.6f},{a:.6f}" for a, b in R[key]["nav"]))
        L.append('</coordinates></LineString></Placemark>')
        for g, n, d, _ in wpts:
            L.append(f'<Placemark><name>{xesc(n)}</name><description>{xesc(d)}</description><Point><coordinates>{g[1]:.5f},{g[0]:.5f}</coordinates></Point></Placemark>')
        L.append('</Folder>')
    L.append('</Document></kml>\n')
    return "\n".join(L)

def write_kml():
    combined = {"7day": "nyc_to_montreal_7day_tour.kml", "6day": "nyc_to_montreal_tour.kml", "5day": "nyc_to_montreal_5day_tour.kml"}
    for iid, fn in combined.items():
        it = C.ITINERARIES[iid]
        folders = [(f"Day {i + 1} ({dow} {date}): {C.STAGES[k]['title']}", k, wpt_list(k)) for i, (k, dow, date) in enumerate(it["stages"])]
        open(os.path.join(ROOT, fn), "w").write(kml_doc(it["title"], folders))
    folders = [(f"{C.STAGES[k]['title']}", k, wpt_list(k)) for k, _, _ in C.VERMONT["stages"]]
    open(os.path.join(ROOT, "nyc_to_montreal_vermont_upgrade.kml"), "w").write(kml_doc(C.VERMONT["title"], folders))


# ---------------------------------------------------------------------------
# Service worker (offline support). Lists every app file; version = content hash.
# ---------------------------------------------------------------------------
SW_TEMPLATE = r"""// GENERATED by tools/build.py: offline cache for the tour app.
const VERSION = '__VERSION__';
const APP_CACHE = 'mtl-bike-app-' + VERSION;
const TILE_CACHE = 'mtl-bike-tiles-v2';
const TILE_LIMIT = 3000;
const ASSETS = __ASSETS__;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(APP_CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => (k.startsWith('mtl-bike-app-') && k !== APP_CACHE) || (k.startsWith('mtl-bike-tiles-') && k !== TILE_CACHE)).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});

function isTile(url) {
  return /tiles\.stadiamaps\.com\/tiles\/|server\.arcgisonline\.com\/ArcGIS\/rest\/services\/|tile\.openstreetmap\.org\//.test(url);
}

async function trimTiles() {
  const cache = await caches.open(TILE_CACHE);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - TILE_LIMIT; i++) await cache.delete(keys[i]);
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = req.url;
  if (url.includes('api.open-meteo.com')) return; // live weather: always network, app falls back itself
  if (isTile(url) || url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
    // map tiles & fonts you've already viewed stay available offline
    event.respondWith(caches.open(TILE_CACHE).then(async cache => {
      const hit = await cache.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res.ok || res.type === 'opaque') { cache.put(req, res.clone()); trimTiles(); }
        return res;
      } catch (e) { return hit || Response.error(); }
    }));
    return;
  }
  if (new URL(url).origin === self.location.origin) {
    // app files: network first (so updates show up), cache when offline
    event.respondWith(fetch(req).then(res => {
      if (res.ok) caches.open(APP_CACHE).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('index.html'))));
  }
});
"""

def write_sw():
    import hashlib, glob
    files = ["index.html", "styles.css", "app.js", "route_data.js", "strip_map_data.js", "mta_route_maps.js",
             "jersey_cue_card.html", "vendor/tailwind.css", "vendor/tailwind-cuecard.css",
             "vendor/leaflet/leaflet.min.js", "vendor/leaflet/leaflet.min.css"] + \
            sorted(os.path.relpath(f, ROOT) for f in glob.glob(os.path.join(ROOT, "vendor/leaflet/images/*.png"))) + \
            sorted(os.path.relpath(f, ROOT) for f in glob.glob(os.path.join(ROOT, "gpx/**/*.gpx"), recursive=True)) + \
            sorted(os.path.relpath(f, ROOT) for f in glob.glob(os.path.join(ROOT, "pdf/*.pdf"))) + \
            sorted(os.path.basename(f) for f in glob.glob(os.path.join(ROOT, "nyc_to_montreal_*.*")))
    h = hashlib.sha256()
    for f in files:
        h.update(f.encode()); h.update(open(os.path.join(ROOT, f), "rb").read())
    sw = SW_TEMPLATE.replace("__VERSION__", h.hexdigest()[:12]).replace("__ASSETS__", json.dumps(["./"] + files, indent=2))
    open(os.path.join(ROOT, "sw.js"), "w").write(sw)

# ---------------------------------------------------------------------------
if __name__ == "__main__":
    write_route_data(); write_strip(); write_gpx(); split_days(); write_kml()
    import guides; guides.write_all(ROOT, C, R, TOURS, VT, place_mile, build_cues, surface_text, fill)
    import generate_strip_pdfs; generate_strip_pdfs.main()
    write_sw()
    for iid, t in TOURS.items():
        print(f"{iid}: {t['totalDistanceMiles']} mi, +{t['elevationGainFt']:,} ft, " + ", ".join(f"{d['distanceMiles']}" for d in t["days"]))
