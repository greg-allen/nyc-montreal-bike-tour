"""Tests for generator functions and data building logic in tools/build.py."""
import sys
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))

import build as B
import content as C


def test_place_mile_on_route():
    """Verify that place_mile locates a known POI along the route."""
    m, off = B.place_mile("D1", "trailside")
    assert m is not None
    assert 10.0 <= m <= 70.0, f"Expected Trailside Cafe on D1 to be between mi 10-70, got {m}"
    assert off <= 1.0, f"Trailside Cafe off route by {off} mi, expected <= 1.0"


def test_surface_at_and_text():
    """Verify surface queries along stage with unpaved canalway segments."""
    txt = B.surface_text("D4")
    assert "paved" in txt.lower() or "unpaved" in txt.lower() or "compacted" in txt.lower()


def test_stage_placeholders():
    """Verify placeholder dict generated for stage notes."""
    ph = B.stage_placeholders("D1")
    assert isinstance(ph, dict)
    assert len(ph) >= 1


def test_elev_profile_generation():
    """Verify elevation profile list of dicts is generated."""
    prof = B.elev_profile("D1")
    assert len(prof) >= 5, "Expected points in elevation profile"
    assert prof[0]["label"] == "Start"
    assert prof[-1]["label"] == "Finish"
    for item in prof:
        assert "mile" in item and "elev" in item and "label" in item


def test_gpx_doc_generation():
    """Verify gpx_doc produces well-formed GPX 1.1 XML string."""
    name = "Test Route"
    desc = "Test Description"
    tracks = [("Track 1", "Desc 1", [(40.7128, -74.0060), (40.7200, -74.0000)])]
    wpts = [([40.7128, -74.0060], "Wpt 1", "Wpt Desc", "Restaurant")]
    xml_str = B.gpx_doc(name, desc, tracks, wpts)
    assert "<?xml" in xml_str
    assert "<gpx" in xml_str
    assert "Track 1" in xml_str
    assert "Wpt 1" in xml_str


def test_kml_doc_generation():
    """Verify kml_doc produces well-formed KML XML string."""
    folders = [("Day 1: Test", "D1", [])]
    kml_str = B.kml_doc("Test KML", folders)
    assert "<?xml" in kml_str
    assert "<kml" in kml_str
    assert "Day 1: Test" in kml_str
