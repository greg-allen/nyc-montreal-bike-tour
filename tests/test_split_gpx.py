import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from tools.split_gpx import run_tests


def test_split_gpx_suite():
    assert run_tests() is True
