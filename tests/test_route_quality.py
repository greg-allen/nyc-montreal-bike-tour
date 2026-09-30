"""Regression tests for route and cue problems found while auditing the tour.

Each test guards a specific failure that reached the generated guides before:
out-and-back spurs from stray routing waypoints, a day's track stopping short of
its hotel, cue notes that silently never attach to a cue, days whose first
cue wasn't at mile 0, and weekday/date mismatches.
"""
import datetime
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))

import build as B  # noqa: E402
import content as C  # noqa: E402

GPX_NS = "{http://www.topografix.com/GPX/1/1}"
MI = 1609.344

# every stage actually ridden in some itinerary, with its (itinerary, day index, weekday, date)
RIDDEN = []
for iid, it in C.ITINERARIES.items():
    for i, (k, dow, date) in enumerate(it["stages"], 1):
        RIDDEN.append((iid, i, k, dow, date))
for i, (k, dow, date) in enumerate(C.VERMONT["stages"], 1):
    RIDDEN.append(("vermont", i, k, dow, date))
STAGE_KEYS = sorted({k for _, _, k, _, _ in RIDDEN})

# Out-and-backs that are real and intentional (stage -> list of (from_mile, to_mile)).
KNOWN_SPURS = {
    # Saint-Jean: the Chambly Canal path is only reachable from its south end,
    # so Day 7 rides down Rue Champlain and back up the path on the other bank.
    "D7": [(0.3, 2.7)],
}


def spurs(nav, gap_m=600, near_m=40):
    """Places where the track comes back within near_m of itself after riding more than gap_m."""
    cm = [0.0]
    for a, b in zip(nav, nav[1:]):
        cm.append(cm[-1] + B.hav(a, b))
    k = math.cos(math.radians(nav[0][0]))
    cells = {}
    for i, p in enumerate(nav):
        cells.setdefault((int(p[0] / 0.0005), int(p[1] * k / 0.0005)), []).append(i)
    out, i = [], 0
    while i < len(nav):
        p = nav[i]
        cx, cy = int(p[0] / 0.0005), int(p[1] * k / 0.0005)
        hit = None
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                for j in cells.get((cx + dx, cy + dy), ()):
                    if j > i and cm[j] - cm[i] > gap_m and B.hav(p, nav[j]) < near_m and (hit is None or j > hit):
                        hit = j
        if hit:
            out.append((round(cm[i] / MI, 1), round(cm[hit] / MI, 1)))
            i = hit
        else:
            i += 1
    return out


@pytest.mark.parametrize("key", STAGE_KEYS)
def test_no_unexpected_out_and_back_spurs(key):
    found = spurs(B.R[key]["nav"])
    allowed = KNOWN_SPURS.get(key, [])
    unexpected = [s for s in found if not any(abs(s[0] - a) < 0.5 and abs(s[1] - b) < 0.5 for a, b in allowed)]
    assert not unexpected, f"{key}: track doubles back on itself at miles {unexpected} (stray routing waypoint?)"


@pytest.mark.parametrize("iid,idx,key,dow,date", RIDDEN)
def test_day_ends_at_its_hotel(iid, idx, key, dow, date):
    end = B.R[key]["nav"][-1]
    if key == "D7":
        target, name = (45.5075, -73.5520), "Place Jacques-Cartier"
    else:
        hk = C.STAGES[key]["hotels"][0]
        target, name = B.geo(hk), C.PLACES[hk]["name"]
    d = B.hav(end, target) / MI
    assert d <= 0.25, f"{iid} day {idx} ({key}) ends {d:.2f} mi from {name}"


@pytest.mark.parametrize("iid", list(C.ITINERARIES))
def test_next_day_starts_where_previous_ended(iid):
    keys = [k for k, _, _ in C.ITINERARIES[iid]["stages"]]
    for a, b in zip(keys, keys[1:]):
        gap = B.hav(B.R[a]["nav"][-1], B.R[b]["nav"][0])
        assert gap <= 150, f"{iid}: {a} ends {gap:.0f} m from where {b} starts"


@pytest.mark.parametrize("key", STAGE_KEYS)
def test_every_cue_note_attaches_to_a_cue(key):
    """A cue note whose road name never matches a cue is silently dropped from every guide."""
    details = " || ".join(c.get("detail", "") for c in B.build_cues(key, key))
    missing = [name for name, note in C.STAGES[key].get("cue_notes", {}).items() if B.fill(note, key) not in details]
    assert not missing, f"{key}: cue notes never shown (no cue matches these roads): {missing}"


@pytest.mark.parametrize("key", STAGE_KEYS)
def test_cue_sheet_spans_the_whole_day(key):
    cues = B.build_cues(key, key)
    mi = B.R[key]["mi"]
    assert cues[0]["mile"] == 0.0, f"{key}: first cue is at mile {cues[0]['mile']}, riders get no directions before it"
    assert cues[-1]["action"] == "ARRIVE" and cues[-1]["mile"] == mi, f"{key}: cue sheet must end with ARRIVE at mile {mi}"
    miles = [c["mile"] for c in cues]
    assert miles == sorted(miles), f"{key}: cues out of order"
    assert all(0 <= m <= mi for m in miles), f"{key}: cue mile outside 0..{mi}"
    assert not any(c["road"] == "bike path" and c["action"] == "DEPART ON" and c.get("dist", 0) > 0.3 for c in cues[:1]), \
        f"{key}: day opens on an unnamed path for more than 0.3 mi; name the first real road"


@pytest.mark.parametrize("key", STAGE_KEYS)
def test_no_long_stretch_without_a_cue_off_trail(key):
    """More than 15 mi between cues is fine on a rail trail or a highway, suspicious anywhere else."""
    cues = B.build_cues(key, key)
    for a, b in zip(cues, cues[1:]):
        if b["mile"] - a["mile"] > 15:
            assert a["surface"] in ("Bike path", "Road shoulder") or "Route" in a["road"] or "NY-" in a["road"] or "US-" in a["road"], \
                f"{key}: {b['mile'] - a['mile']:.1f} mi with no cue after mile {a['mile']} on {a['road']}"


@pytest.mark.parametrize("iid,idx,key,dow,date", RIDDEN)
def test_weekday_matches_date(iid, idx, key, dow, date):
    d = datetime.datetime.strptime(f"{date} 2026", "%b %d %Y").date()
    assert d.strftime("%A") == dow, f"{iid} day {idx}: {date} 2026 is a {d.strftime('%A')}, not {dow}"


@pytest.mark.parametrize("iid", list(C.ITINERARIES))
def test_itinerary_dates_are_consecutive(iid):
    ds = [datetime.datetime.strptime(f"{date} 2026", "%b %d %Y").date() for _, _, date in C.ITINERARIES[iid]["stages"]]
    assert all((b - a).days == 1 for a, b in zip(ds, ds[1:])), f"{iid}: dates are not consecutive: {ds}"


@pytest.mark.parametrize("key", STAGE_KEYS)
def test_elevation_profile_is_dense_and_spans_the_day(key):
    prof = B.R[key]["profile"]
    mi = B.R[key]["mi"]
    assert len(prof) >= mi * 2, f"{key}: only {len(prof)} elevation samples for {mi} mi"
    assert prof[0][0] == 0 and abs(prof[-1][0] - mi) < 0.2, f"{key}: profile spans {prof[0][0]}..{prof[-1][0]}, day is {mi} mi"
    assert all(-50 < e < 3000 for _, e in prof), f"{key}: implausible elevation in profile"


@pytest.mark.parametrize("iid,idx,key,dow,date", RIDDEN)
def test_day_gpx_matches_route_data(iid, idx, key, dow, date):
    path = ROOT / B.day_gpx_path(iid, idx)
    root = ET.parse(path).getroot()
    pts = [(float(p.get("lat")), float(p.get("lon"))) for p in root.iter(f"{GPX_NS}trkpt")]
    nav = B.R[key]["nav"]
    assert B.hav(pts[0], nav[0]) < 50 and B.hav(pts[-1], nav[-1]) < 50, f"{path.name}: endpoints differ from data/routes.json"
    length = sum(B.hav(a, b) for a, b in zip(pts, pts[1:])) / MI
    assert abs(length - B.R[key]["mi"]) / B.R[key]["mi"] < 0.01, f"{path.name}: track is {length:.1f} mi, route data says {B.R[key]['mi']}"
    desc = root.find(f"{GPX_NS}metadata/{GPX_NS}desc").text
    assert desc.startswith(f"{B.R[key]['mi']} mi"), f"{path.name}: metadata says '{desc[:20]}', expected {B.R[key]['mi']} mi"


def test_itinerary_totals_match_sum_of_days():
    raw = (ROOT / "route_data.js").read_text()
    for iid, t in B.TOURS.items():
        m = re.search(r"const TOUR_DATA_%s = (\{.*?\n\});" % iid.upper(), raw, re.S)
        assert m, f"TOUR_DATA_{iid.upper()} missing from route_data.js"
        data = json.loads(m.group(1))
        assert data["totalDistanceMiles"] == round(sum(d["distanceMiles"] for d in data["days"]), 1)
        assert data["totalDistanceMiles"] == t["totalDistanceMiles"], f"route_data.js is stale for {iid}: run tools/build.py"
