"""Tests for the printable ride packets written by tools/generate_strip_pdfs.py."""
import re
import sys
import zlib
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).parent.parent
PDF_DIR = REPO_ROOT / "pdf"
sys.path.insert(0, str(REPO_ROOT / "tools"))

import generate_strip_pdfs as G  # noqa: E402

ITINERARIES = ("6day", "5day", "7day", "vermont")


def page_count(data):
    m = re.search(rb"/Type\s*/Pages\s*/Kids\s*\[[^\]]+\]\s*/Count\s*(\d+)", data)
    assert m, "no /Pages /Count"
    return int(m.group(1))


def pdf_text(data):
    """All text drawn in the PDF, one string per Tj, in drawing order."""
    out = []
    for raw in re.findall(rb"stream\n(.*?)\nendstream", data, re.S):
        try:
            s = zlib.decompress(raw)
        except zlib.error:
            s = raw
        for m in re.finditer(rb"\(((?:\\.|[^\\)])*)\)\s*Tj", s):
            b = re.sub(rb"\\([0-7]{3})", lambda x: bytes([int(x.group(1), 8)]), m.group(1))
            b = re.sub(rb"\\(.)", rb"\1", b)
            out.append(b.decode("cp1252"))
    return out


def norm(s):
    return " ".join(G.enc(s).decode("cp1252").split())


@pytest.fixture(scope="module")
def models():
    return {iid: G.itinerary_model(iid) for iid in ITINERARIES}


@pytest.mark.parametrize("iid", ITINERARIES)
def test_packet_exists_and_is_us_letter(iid):
    path = Path(G.packet_name(iid))
    assert path.exists(), f"missing {path.name}: run tools/generate_strip_pdfs.py"
    data = path.read_bytes()
    assert data.startswith(b"%PDF-1.4") and b"%%EOF" in data[-100:]
    assert data.count(b"/MediaBox [0 0 612.0 792.0]") == page_count(data), "every page must be US Letter"


@pytest.mark.parametrize("iid", ITINERARIES)
def test_packet_prints_one_sheet_per_day_side(iid, models):
    """Cover + essentials, then every day starts on a fresh sheet when printed double-sided."""
    data = Path(G.packet_name(iid)).read_bytes()
    n = page_count(data)
    days = len(models[iid]["days"])
    assert n % 2 == 0, f"{iid}: odd page count {n} breaks double-sided printing"
    assert n >= 2 + 2 * days, f"{iid}: {n} pages is too few for {days} days"


@pytest.mark.parametrize("iid", ITINERARIES)
def test_single_day_pdfs_exist(iid, models):
    for d in models[iid]["days"]:
        path = Path(G.stage_name(iid, d))
        assert path.exists(), f"missing {path.name}"
        assert 2 <= page_count(path.read_bytes()) <= 4, f"{path.name}: expected overview + 1-3 cue pages"


@pytest.mark.parametrize("iid", ITINERARIES)
def test_every_cue_is_printed_in_full(iid, models):
    """No truncation: each cue's road and its whole note must appear in the day's PDF."""
    for d in models[iid]["days"]:
        text = norm(" ".join(pdf_text(Path(G.stage_name(iid, d)).read_bytes())))
        for c in d["cues"]:
            assert norm(c["road"]) in text, f"{iid} {d['label']}: road '{c['road']}' missing from PDF"
            if c.get("detail"):
                assert norm(c["detail"]) in text, f"{iid} {d['label']} mile {c['mile']}: note not printed in full: {c['detail'][:60]}"


@pytest.mark.parametrize("iid", ITINERARIES)
def test_hotel_phone_numbers_printed(iid, models):
    text = " ".join(pdf_text(Path(G.packet_name(iid)).read_bytes()))
    for d in models[iid]["days"]:
        for h in d["hotels"][:1]:
            if h.get("phone") and d["key"] != "D7":
                assert h["phone"] in text, f"{iid} {d['label']}: {h['name']} phone {h['phone']} not in packet"


def test_text_encoding_keeps_french_accents():
    assert G.enc("Hôtel Montréal, Rue de la Gauchetière") == "Hôtel Montréal, Rue de la Gauchetière".encode("cp1252")
    assert G.enc("🏁 Finish → Old Port") == " Finish – Old Port".encode("cp1252")


def test_wrap_never_exceeds_width():
    s = "Jacques-Cartier Bridge bike path (open spring to late fall). At the island end, take the ramp down to Île Sainte-Hélène."
    for ln in G.wrap(s, 7.5, 120):
        assert G.text_width(ln, 7.5) <= 120.01


def test_sun_times_nyc_october():
    import datetime
    rise, sset = G.sun_times(datetime.date(2026, 10, 4), 40.7128, -74.0060)
    # published values for NYC on 2026-10-04: sunrise about 6:55 AM, sunset about 6:36 PM (EDT)
    assert rise.startswith("6:5") and sset.startswith("6:3"), (rise, sset)
