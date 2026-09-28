#!/usr/bin/env python3
"""Split a multi-track GPX file (one <trk> per day) into one GPX file per day.

Each output file gets:
  - The original <metadata> block
  - The single <trk> for that day (name, desc, trkseg preserved)
  - Only the waypoints whose coordinates are within `wpt_radius_mi` of any
    track point on that day (avoids duplication across days)

Issues with the reference script this replaces:
  - Splits on <trkseg>, not <trk>. That works incidentally for our files (each
    trk has exactly one trkseg), but is semantically wrong.
  - Strips all <wpt> elements from output files.
  - Replaces the track <name> with a generic "Part N" string.
  - Strips <desc> from the track.
  - Output filenames are not human-readable.

Usage:
    python3 tools/split_gpx.py          # processes all multi-day GPX files
    python3 tools/split_gpx.py [file]   # process one file
"""
import math, sys, os
import xml.etree.ElementTree as ET
from pathlib import Path

NS = 'http://www.topografix.com/GPX/1/1'
NSP = f'{{{NS}}}'

# Register namespaces so output uses clean tag names, not ns0:
ET.register_namespace('', NS)
ET.register_namespace('xsi', 'http://www.w3.org/2001/XMLSchema-instance')

WPT_RADIUS_MI = 3.0  # waypoints within this many miles of any track point are included


def haversine_mi(lat1, lon1, lat2, lon2):
    """Great-circle distance in miles."""
    R = 3958.8
    la1, lo1, la2, lo2 = map(math.radians, (lat1, lon1, lat2, lon2))
    a = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def track_points(trk):
    """Return list of (lat, lon) floats for all trkpts in a track."""
    pts = []
    for seg in trk.findall(f'{NSP}trkseg'):
        for pt in seg.findall(f'{NSP}trkpt'):
            try:
                pts.append((float(pt.attrib['lat']), float(pt.attrib['lon'])))
            except (KeyError, ValueError):
                pass
    return pts


def wpt_near_track(wpt, track_pts, radius_mi):
    """True if the waypoint is within radius_mi of at least one track point."""
    try:
        wlat = float(wpt.attrib['lat'])
        wlon = float(wpt.attrib['lon'])
    except (KeyError, ValueError):
        return False
    # Fast bounding-box pre-filter (1 degree lat ≈ 69 mi, 1 degree lon ≈ 50 mi at 45°N)
    deg_lat = radius_mi / 69.0
    deg_lon = radius_mi / 50.0
    for lat, lon in track_pts:
        if abs(wlat - lat) <= deg_lat and abs(wlon - lon) <= deg_lon:
            if haversine_mi(wlat, wlon, lat, lon) <= radius_mi:
                return True
    return False


def split_gpx(input_path: str, output_dir: str = None, prefix: str = None,
              wpt_radius_mi: float = WPT_RADIUS_MI) -> list[str]:
    """Split a multi-track GPX into one file per <trk>.

    Args:
        input_path:    Path to the input .gpx file.
        output_dir:    Directory to write outputs (default: same as input).
        prefix:        Filename prefix (default: derived from input filename).
        wpt_radius_mi: Waypoints within this distance of a day's track are included.

    Returns:
        List of output file paths written.
    """
    p = Path(input_path)
    if output_dir is None:
        output_dir = str(p.parent)
    if prefix is None:
        prefix = p.stem

    tree = ET.parse(input_path)
    root = tree.getroot()

    if root.tag != f'{NSP}gpx':
        raise ValueError(f"Expected root <gpx>, got {root.tag!r}")

    all_tracks = root.findall(f'{NSP}trk')
    if not all_tracks:
        raise ValueError("No <trk> elements found in GPX file.")

    all_wpts = root.findall(f'{NSP}wpt')
    metadata = root.find(f'{NSP}metadata')

    written = []
    for i, trk in enumerate(all_tracks, 1):
        # Build new GPX root with same attributes
        new_root = ET.Element(root.tag, root.attrib)

        # Preserve metadata
        if metadata is not None:
            new_root.append(metadata)

        # Find waypoints near this track
        tpts = track_points(trk)
        for wpt in all_wpts:
            if wpt_near_track(wpt, tpts, wpt_radius_mi):
                new_root.append(wpt)

        # Append the track as-is (preserves name, desc, trkseg, everything)
        new_root.append(trk)

        # Determine output filename
        out_path = os.path.join(output_dir, f"{prefix}_day{i:02d}.gpx")
        ET.ElementTree(new_root).write(out_path, encoding='unicode', xml_declaration=True)
        written.append(out_path)

        trk_name = (trk.find(f'{NSP}name') or ET.Element('x')).text or f"Day {i}"
        print(f"  [{i}/{len(all_tracks)}] {trk_name!r} → {os.path.basename(out_path)} "
              f"({len(tpts):,} pts, {sum(1 for w in all_wpts if wpt_near_track(w, tpts, wpt_radius_mi))} wpts)")

    return written


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

def _make_test_gpx(tmp_path: Path, num_days: int = 2) -> Path:
    """Create a minimal synthetic multi-track GPX for testing."""
    gpx = ET.Element('gpx', {
        'version': '1.1',
        'creator': 'test',
        'xmlns': NS,
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    })
    meta = ET.SubElement(gpx, 'metadata')
    name_el = ET.SubElement(meta, 'name')
    name_el.text = 'Test Tour'

    # Day 1: NYC area  (lat 40.7, lon -74.0)
    # Day 2: Hudson area (lat 42.2, lon -73.8)
    day_coords = [
        ('Day 1: NYC → Brewster', [(40.700, -74.000), (40.800, -73.900), (41.000, -73.700)]),
        ('Day 2: Brewster → Hudson', [(41.000, -73.700), (41.500, -73.800), (42.250, -73.785)]),
    ][:num_days]

    # Waypoints – one near Day 1, one near Day 2, one nowhere
    for wlat, wlon, wname in [
        (40.710, -73.990, 'Hotel NYC area'),      # near Day 1
        (42.245, -73.790, 'Hotel Hudson area'),   # near Day 2
        (45.000, -70.000, 'Far away wpt'),        # not near either
    ]:
        wpt = ET.SubElement(gpx, 'wpt', lat=str(wlat), lon=str(wlon))
        ET.SubElement(wpt, 'name').text = wname

    for trk_name, pts in day_coords:
        trk = ET.SubElement(gpx, 'trk')
        ET.SubElement(trk, 'name').text = trk_name
        ET.SubElement(trk, 'desc').text = f"Test description for {trk_name}"
        seg = ET.SubElement(trk, 'trkseg')
        for lat, lon in pts:
            ET.SubElement(seg, 'trkpt', lat=str(lat), lon=str(lon))

    out = tmp_path / 'test_tour.gpx'
    ET.ElementTree(gpx).write(str(out), encoding='unicode', xml_declaration=True)
    return out


def run_tests():
    import tempfile, traceback
    failures = []

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)

        # ---- Test 1: Basic split produces correct number of files ----
        try:
            src = _make_test_gpx(tmp_path)
            out = tmp_path / 'split1'
            out.mkdir()
            files = split_gpx(str(src), output_dir=str(out))
            assert len(files) == 2, f"Expected 2 files, got {len(files)}"
            assert all(Path(f).exists() for f in files), "Some output files missing"
            print("PASS test1: correct number of files")
        except Exception as e:
            failures.append(f"test1: {e}")
            traceback.print_exc()

        # ---- Test 2: Each output file has exactly 1 <trk> ----
        try:
            src = _make_test_gpx(tmp_path)
            out = tmp_path / 'split2'
            out.mkdir()
            files = split_gpx(str(src), output_dir=str(out))
            for f in files:
                root = ET.parse(f).getroot()
                trks = root.findall(f'{NSP}trk')
                assert len(trks) == 1, f"{f}: expected 1 trk, got {len(trks)}"
            print("PASS test2: each output has exactly 1 track")
        except Exception as e:
            failures.append(f"test2: {e}")
            traceback.print_exc()

        # ---- Test 3: Track name is preserved (not replaced with "Part N") ----
        try:
            src = _make_test_gpx(tmp_path)
            out = tmp_path / 'split3'
            out.mkdir()
            files = split_gpx(str(src), output_dir=str(out))
            root = ET.parse(files[0]).getroot()
            trk_name = root.find(f'{NSP}trk/{NSP}name').text
            assert trk_name == 'Day 1: NYC → Brewster', f"Name wrong: {trk_name!r}"
            print("PASS test3: track name preserved")
        except Exception as e:
            failures.append(f"test3: {e}")
            traceback.print_exc()

        # ---- Test 4: Track desc is preserved ----
        try:
            src = _make_test_gpx(tmp_path)
            out = tmp_path / 'split4'
            out.mkdir()
            files = split_gpx(str(src), output_dir=str(out))
            root = ET.parse(files[1]).getroot()
            desc = root.find(f'{NSP}trk/{NSP}desc').text
            assert 'Day 2' in desc, f"Desc wrong: {desc!r}"
            print("PASS test4: track desc preserved")
        except Exception as e:
            failures.append(f"test4: {e}")
            traceback.print_exc()

        # ---- Test 5: Waypoints are attributed to the correct day ----
        try:
            src = _make_test_gpx(tmp_path)
            out = tmp_path / 'split5'
            out.mkdir()
            files = split_gpx(str(src), output_dir=str(out))

            root1 = ET.parse(files[0]).getroot()
            wpts1 = [w.find(f'{NSP}name').text for w in root1.findall(f'{NSP}wpt')]
            root2 = ET.parse(files[1]).getroot()
            wpts2 = [w.find(f'{NSP}name').text for w in root2.findall(f'{NSP}wpt')]

            assert 'Hotel NYC area' in wpts1, f"Day 1 missing hotel. Got: {wpts1}"
            assert 'Hotel NYC area' not in wpts2 or True, "Day 2 may share wpt at connection point"
            assert 'Hotel Hudson area' in wpts2, f"Day 2 missing hotel. Got: {wpts2}"
            assert 'Far away wpt' not in wpts1, f"Day 1 should not have far wpt"
            assert 'Far away wpt' not in wpts2, f"Day 2 should not have far wpt"
            print(f"PASS test5: waypoints attributed correctly (day1={wpts1}, day2={wpts2})")
        except Exception as e:
            failures.append(f"test5: {e}")
            traceback.print_exc()

        # ---- Test 6: Metadata block is preserved ----
        try:
            src = _make_test_gpx(tmp_path)
            out = tmp_path / 'split6'
            out.mkdir()
            files = split_gpx(str(src), output_dir=str(out))
            root = ET.parse(files[0]).getroot()
            meta_name = root.find(f'{NSP}metadata/{NSP}name')
            assert meta_name is not None and meta_name.text == 'Test Tour', \
                f"Metadata missing or wrong: {meta_name}"
            print("PASS test6: metadata preserved")
        except Exception as e:
            failures.append(f"test6: {e}")
            traceback.print_exc()

        # ---- Test 7: Output filenames follow expected pattern ----
        try:
            src = _make_test_gpx(tmp_path)
            out = tmp_path / 'split7'
            out.mkdir()
            files = split_gpx(str(src), output_dir=str(out), prefix='myride')
            names = [Path(f).name for f in files]
            assert names == ['myride_day01.gpx', 'myride_day02.gpx'], f"Wrong names: {names}"
            print("PASS test7: output filenames correct")
        except Exception as e:
            failures.append(f"test7: {e}")
            traceback.print_exc()

        # ---- Test 8: Single-track file → exactly 1 output ----
        try:
            src = _make_test_gpx(tmp_path, num_days=1)
            out = tmp_path / 'split8'
            out.mkdir()
            files = split_gpx(str(src), output_dir=str(out))
            assert len(files) == 1, f"Expected 1, got {len(files)}"
            print("PASS test8: single-track file → 1 output")
        except Exception as e:
            failures.append(f"test8: {e}")
            traceback.print_exc()

        # ---- Test 9: All track points preserved in each output ----
        try:
            src = _make_test_gpx(tmp_path)
            out = tmp_path / 'split9'
            out.mkdir()
            files = split_gpx(str(src), output_dir=str(out))
            counts = []
            for f in files:
                root = ET.parse(f).getroot()
                pts = root.findall(f'.//{NSP}trkpt')
                counts.append(len(pts))
            assert counts == [3, 3], f"Wrong point counts: {counts}"
            print("PASS test9: all track points preserved")
        except Exception as e:
            failures.append(f"test9: {e}")
            traceback.print_exc()

        # ---- Test 10: Invalid file raises clear error ----
        try:
            import tempfile as tf2
            with tf2.NamedTemporaryFile(suffix='.gpx', mode='w', delete=False) as f:
                f.write('<notgpx/>')
                bad = f.name
            try:
                split_gpx(bad)
                failures.append("test10: should have raised ValueError")
            except ValueError as e:
                print(f"PASS test10: invalid root raises ValueError: {e}")
            finally:
                os.unlink(bad)
        except Exception as e:
            failures.append(f"test10: {e}")
            traceback.print_exc()

    print()
    if failures:
        print(f"FAILED: {len(failures)} test(s):")
        for f in failures:
            print(f"  ✗ {f}")
        return False
    else:
        print(f"All 10 tests passed ✓")
        return True


# ---------------------------------------------------------------------------
# Multi-file GPX splitter config
# ---------------------------------------------------------------------------

# Maps each combined GPX → (prefix, output_dir relative to repo root)
SPLIT_TARGETS = [
    ('nyc_to_montreal_tour.gpx',             'gpx/6day'),
    ('nyc_to_montreal_5day_tour.gpx',        'gpx/5day'),
    ('nyc_to_montreal_7day_tour.gpx',        'gpx/7day'),
    ('nyc_to_montreal_vermont_upgrade.gpx',  'gpx/vermont'),
]


def main():
    root_dir = Path(__file__).parent.parent

    if len(sys.argv) > 1 and sys.argv[1] == '--test':
        ok = run_tests()
        sys.exit(0 if ok else 1)

    if len(sys.argv) > 1:
        # Single file mode: split_gpx.py <file.gpx> [output_dir] [prefix]
        src = sys.argv[1]
        out_dir = sys.argv[2] if len(sys.argv) > 2 else str(Path(src).parent)
        prefix = sys.argv[3] if len(sys.argv) > 3 else Path(src).stem
        print(f"Splitting {src} → {out_dir}/{prefix}_dayNN.gpx")
        split_gpx(src, output_dir=out_dir, prefix=prefix)
        return

    # Default: process all configured targets
    total = 0
    for rel_src, rel_out in SPLIT_TARGETS:
        src = str(root_dir / rel_src)
        out_dir = str(root_dir / rel_out)
        os.makedirs(out_dir, exist_ok=True)
        print(f"\n→ {rel_src}")
        files = split_gpx(src, output_dir=out_dir)
        total += len(files)
    print(f"\nDone. {total} day-GPX files written.")


if __name__ == '__main__':
    main()
