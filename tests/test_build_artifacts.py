"""Tests for build artifacts: GPX XML validity, KML validity, and SW cache manifest integrity."""
import re
import json
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GPX_NS = '{http://www.topografix.com/GPX/1/1}'


def test_root_gpx_files_valid_xml():
    """All root combined GPX files must be valid GPX 1.1 XML."""
    root_gpxs = list(ROOT.glob("nyc_to_montreal_*.gpx"))
    assert len(root_gpxs) >= 3, f"Expected at least 3 combined GPX files, found {len(root_gpxs)}"
    for gpx_path in root_gpxs:
        tree = ET.parse(gpx_path)
        root = tree.getroot()
        assert root.tag == f"{GPX_NS}gpx", f"{gpx_path.name} root tag is {root.tag}, expected GPX 1.1"
        trks = root.findall(f"{GPX_NS}trk")
        assert len(trks) >= 3, f"{gpx_path.name} has only {len(trks)} tracks"
        for trk in trks:
            name = trk.find(f"{GPX_NS}name")
            assert name is not None and name.text, f"{gpx_path.name} has unnamed track"
            pts = trk.findall(f".//{GPX_NS}trkpt")
            assert len(pts) >= 100, f"{gpx_path.name} track '{name.text}' has too few points ({len(pts)})"


def test_per_day_gpx_files_valid_xml_and_named():
    """All split per-day GPX files must have unique, day-specific metadata names."""
    split_gpxs = list(ROOT.glob("gpx/*/*.gpx"))
    assert len(split_gpxs) >= 20, f"Expected at least 20 split GPX files, found {len(split_gpxs)}"
    for gpx_path in split_gpxs:
        tree = ET.parse(gpx_path)
        root = tree.getroot()
        assert root.tag == f"{GPX_NS}gpx", f"{gpx_path.name} invalid GPX root"
        meta_name = root.find(f"{GPX_NS}metadata/{GPX_NS}name")
        assert meta_name is not None and meta_name.text.strip(), f"{gpx_path.name} missing metadata name"
        trks = root.findall(f"{GPX_NS}trk")
        assert len(trks) == 1, f"{gpx_path.name} should have exactly 1 track, found {len(trks)}"
        pts = trks[0].findall(f".//{GPX_NS}trkpt")
        assert len(pts) >= 50, f"{gpx_path.name} has too few points ({len(pts)})"


def test_kml_files_valid_xml():
    """All KML files must be well-formed XML."""
    kmls = list(ROOT.glob("*.kml"))
    assert len(kmls) >= 3, f"Expected at least 3 KML files, found {len(kmls)}"
    for kml_path in kmls:
        tree = ET.parse(kml_path)
        root = tree.getroot()
        assert "kml" in root.tag.lower(), f"{kml_path.name} root tag {root.tag} not KML"


def test_service_worker_asset_manifest_integrity():
    """Every asset listed in sw.js cache manifest must exist on disk."""
    sw_path = ROOT / "sw.js"
    assert sw_path.exists(), "sw.js missing"
    content = sw_path.read_text(encoding="utf-8")

    # Match JSON array of assets in sw.js
    m = re.search(r'const\s+ASSETS\s*=\s*(\[.*?\]);', content, re.DOTALL)
    assert m, "Could not find ASSETS array in sw.js"
    assets = json.loads(m.group(1))
    assert len(assets) >= 15, f"ASSETS array has only {len(assets)} items"

    missing = []
    for asset in assets:
        if asset in ("./", ""):
            continue
        asset_path = ROOT / asset
        if not asset_path.exists():
            missing.append(asset)
    assert not missing, f"Files listed in sw.js missing on disk: {missing}"


def test_js_data_files_exist_and_non_empty():
    """route_data.js and strip_map_data.js must exist and be non-empty."""
    for fn in ("route_data.js", "strip_map_data.js", "app.js", "mta_route_maps.js"):
        p = ROOT / fn
        assert p.exists(), f"File {fn} missing"
        assert p.stat().st_size > 1000, f"File {fn} unexpectedly small ({p.stat().st_size} bytes)"
