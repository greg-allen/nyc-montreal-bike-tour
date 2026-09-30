"""Tests for route continuity, stage handoffs, and coordinate sanity in data/routes.json."""
import sys
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))

import content as C

ROUTES = json.load(open(ROOT / "data" / "routes.json"))


def haversine_miles(pt1, pt2):
    R = 3958.8
    la1, lo1, la2, lo2 = map(math.radians, (pt1[0], pt1[1], pt2[0], pt2[1]))
    d = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * R * math.asin(math.sqrt(d))


def test_stage_handoff_continuity():
    """Verify that Day N ends where Day N+1 starts for all multi-day itineraries."""
    for iid, it in C.ITINERARIES.items():
        stages = [k for k, _, _ in it["stages"]]
        for s1_key, s2_key in zip(stages, stages[1:]):
            s1 = ROUTES[s1_key]
            s2 = ROUTES[s2_key]
            end_pt = s1["nav"][-1]
            start_pt = s2["nav"][0]
            dist_mi = haversine_miles(end_pt, start_pt)
            assert dist_mi <= 0.1, (
                f"Itinerary {iid}: Gap of {dist_mi:.2f} miles between end of {s1_key} "
                f"({end_pt}) and start of {s2_key} ({start_pt})"
            )


def test_route_coordinates_validity():
    """All nav and app track points must have valid coordinates in corridor."""
    for rk, r in ROUTES.items():
        assert len(r["nav"]) >= 50, f"Route {rk} has too few nav points ({len(r['nav'])})"
        assert len(r["app"]) >= 20, f"Route {rk} has too few app points ({len(r['app'])})"

        for pt in r["nav"]:
            lat, lon = pt[0], pt[1]
            assert 40.5 <= lat <= 46.0, f"Route {rk} nav latitude {lat} outside corridor"
            assert -74.5 <= lon <= -72.0, f"Route {rk} nav longitude {lon} outside corridor"

        for pt in r["app"]:
            lat, lon = pt[0], pt[1]
            assert 40.5 <= lat <= 46.0, f"Route {rk} app latitude {lat} outside corridor"
            assert -74.5 <= lon <= -72.0, f"Route {rk} app longitude {lon} outside corridor"


def test_distance_and_climbing_sanity():
    """Verify distance and elevation gain are within realistic bounds for each stage."""
    for rk, r in ROUTES.items():
        assert 10.0 <= r["mi"] <= 130.0, f"Route {rk} distance {r['mi']} mi out of expected range"
        assert 0 <= r["gain_ft"] <= 10_000, f"Route {rk} gain {r['gain_ft']} ft out of expected range"


def test_steps_monotonic_progression():
    """Steps in each route must be ordered by mile."""
    for rk, r in ROUTES.items():
        steps = r.get("steps", [])
        if not steps:
            continue
        miles = [s["mile"] for s in steps]
        for m1, m2 in zip(miles, miles[1:]):
            assert m2 >= m1 - 0.05, f"Route {rk} steps out of order: {m1} followed by {m2}"
        # Last step should not exceed total distance
        assert steps[-1]["mile"] <= r["mi"] + 0.5, (
            f"Route {rk} last step mile {steps[-1]['mile']} exceeds total mi {r['mi']}"
        )
