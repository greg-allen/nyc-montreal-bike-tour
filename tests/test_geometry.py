"""Unit tests for geometry, distance, and string formatting helpers in tools/build.py."""
import sys
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))

from build import hav, densify, pretty_road


def test_haversine_zero_distance():
    pt = (40.7128, -74.0060)
    assert hav(pt, pt) == 0.0


def test_haversine_symmetry():
    nyc = (40.7128, -74.0060)
    albany = (42.6526, -73.7562)
    d1 = hav(nyc, albany)
    d2 = hav(albany, nyc)
    assert math.isclose(d1, d2, rel_tol=1e-9)
    # NYC to Albany is roughly 215-225 km (around 135-140 mi)
    assert 210_000 < d1 < 230_000


def test_densify_short_segment():
    # Two points 50 meters apart with max_m=200 should NOT be interpolated
    p1 = (40.7128, -74.0060)
    p2 = (40.7132, -74.0060)  # ~44 meters
    densified = densify([p1, p2], max_m=200)
    assert len(densified) == 2
    assert densified[0] == p1
    assert densified[1] == p2


def test_densify_long_segment():
    # Two points ~1000 meters apart with max_m=200 should have intermediate points added
    p1 = (40.7000, -74.0000)
    p2 = (40.7090, -74.0000)  # ~1000 meters
    dist = hav(p1, p2)
    assert dist > 900
    densified = densify([p1, p2], max_m=200)
    assert len(densified) >= 5
    assert densified[0] == p1
    assert densified[-1] == p2
    # Verify no two consecutive points are further than max_m apart
    for a, b in zip(densified, densified[1:]):
        assert hav(a, b) <= 205  # allowing slight rounding margin


def test_pretty_road_unnamed():
    assert pretty_road("(unnamed path)") == "bike path"


def test_pretty_road_with_ref():
    assert pretty_road("Lake Avenue [NY 29]") == "Lake Avenue (NY-29)"
    assert pretty_road("Broadway Avenue [US 4; NY 22]") == "Broadway Avenue (US-4; NY-22)"
    assert pretty_road("Burgoyne Street [CR 338]") == "Burgoyne Street (CR-338)"


def test_pretty_road_plain():
    assert pretty_road("Main Street") == "Main Street"
    assert pretty_road("South County Trailway") == "South County Trailway"
