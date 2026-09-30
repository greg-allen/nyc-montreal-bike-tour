"""Validation tests for content definitions, POIs, and itinerary schemas."""
import sys
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))

import content as C

GEO = json.load(open(ROOT / "data" / "geo.json"))
for k, v in C.EXTRA_GEO.items():
    GEO.setdefault(k, v)

ROUTES = json.load(open(ROOT / "data" / "routes.json"))


def test_itinerary_definitions_exist():
    expected = {"6day", "5day", "7day"}
    assert expected.issubset(set(C.ITINERARIES.keys()))


def test_itinerary_stages_exist_in_routes():
    for iid, it in C.ITINERARIES.items():
        assert len(it["stages"]) >= 5, f"Itinerary {iid} has too few stages"
        for k, dow, date in it["stages"]:
            assert k in C.STAGES, f"Stage {k} in itinerary {iid} missing from STAGES"
            assert k in ROUTES, f"Stage {k} in itinerary {iid} missing from data/routes.json"
            assert dow in ("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")


def test_vermont_stages_exist_in_routes():
    for k, dow, date in C.VERMONT["stages"]:
        assert k in C.STAGES, f"Vermont stage {k} missing from STAGES"
        assert k in ROUTES, f"Vermont stage {k} missing from data/routes.json"


def test_all_stage_places_exist():
    """Verify referential integrity: all hotels, lunch, and shops must exist in PLACES."""
    for sk, stage in C.STAGES.items():
        if "lunch" in stage and stage["lunch"]:
            assert stage["lunch"] in C.PLACES, f"Stage {sk} lunch '{stage['lunch']}' not in PLACES"
        for h in stage.get("hotels", []):
            assert h in C.PLACES, f"Stage {sk} hotel '{h}' not in PLACES"
        for s in stage.get("shops", []):
            assert s in C.PLACES, f"Stage {sk} bike shop '{s}' not in PLACES"


def test_places_schema():
    """Every place in PLACES must have a non-empty name, address, and notes."""
    for pk, place in C.PLACES.items():
        assert "name" in place and place["name"].strip(), f"Place '{pk}' missing name"
        assert "address" in place and place["address"].strip(), f"Place '{pk}' missing address"
        assert "notes" in place, f"Place '{pk}' missing notes key"


def test_stage_places_have_geocodes():
    """Every place referenced in a stage should have coordinates in GEO or EXTRA_GEO."""
    missing = []
    for sk, stage in C.STAGES.items():
        keys = []
        if stage.get("lunch"):
            keys.append(stage["lunch"])
        keys.extend(stage.get("hotels", []))
        keys.extend(stage.get("shops", []))
        for pk in keys:
            if pk not in GEO:
                missing.append((sk, pk))
    assert not missing, f"Missing geocoded coordinates for: {missing}"


def test_geocode_bounding_box():
    """Verify that all geocoded POIs are along the NYC -> Montreal corridor."""
    # Latitudes roughly 40.5°N (NYC) to 46.0°N (Montreal area)
    # Longitudes roughly -74.5°W to -72.5°W
    for pk, coords in GEO.items():
        lat, lon = coords[0], coords[1]
        assert 40.0 <= lat <= 46.5, f"Place '{pk}' latitude {lat} out of bounds"
        assert -75.0 <= lon <= -72.0, f"Place '{pk}' longitude {lon} out of bounds"
