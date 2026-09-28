#!/usr/bin/env python3
"""Update D3 (Hudson -> Schuylerville) and D4 (Schuylerville -> Ticonderoga) in data/routes.json."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ROUTES_PATH = ROOT / "data" / "routes.json"

def apply():
    with open(ROUTES_PATH) as f:
        routes = json.load(f)

    d3_old = routes['D3']
    d4_old = routes['D4']
    d53 = routes['5D3']

    # 1. D3 Nav & App (Hudson -> Waterford -> Schuylerville)
    d3_nav = d3_old['nav'][:880] + d53['nav'][58:340]
    d3_app = d3_old['app'][:333] + d53['app'][22:141]

    # 2. D3 Steps
    shift_d3 = 52.06 - 4.41
    d3_steps = []
    for s in d3_old['steps'][:81]:
        d3_steps.append(dict(s))
    for s in d53['steps'][16:34]:
        s_copy = dict(s)
        s_copy['mile'] = round(s['mile'] + shift_d3, 2)
        d3_steps.append(s_copy)

    # 3. D4 Nav & App (Schuylerville -> Ticonderoga)
    d4_nav = d53['nav'][339:]
    d4_app = d53['app'][140:]

    # 4. D4 Steps
    shift_d4 = -28.24
    d4_steps = [
        {'mile': 0.0, 'name': 'State Highway 29 [NY 29]', 'dist_mi': 0.08, 'type': 'depart', 'mod': 'right', 'loc': [43.099934, -73.581314]}
    ]
    for s in d53['steps'][34:]:
        s_copy = dict(s)
        s_copy['mile'] = round(s['mile'] + shift_d4, 2)
        d4_steps.append(s_copy)

    # 5. Profiles
    d3_prof = d3_old['profile']
    d53_prof = d53['profile']

    def get_elev_d3(m):
        if m <= 52.06:
            for i in range(len(d3_prof)-1):
                if d3_prof[i][0] <= m <= d3_prof[i+1][0]:
                    frac = (m - d3_prof[i][0]) / (d3_prof[i+1][0] - d3_prof[i][0])
                    return round(d3_prof[i][1] + frac * (d3_prof[i+1][1] - d3_prof[i][1]))
            return d3_prof[-1][1]
        else:
            m_5d3 = 4.41 + (m - 52.06)
            for i in range(len(d53_prof)-1):
                if d53_prof[i][0] <= m_5d3 <= d53_prof[i+1][0]:
                    frac = (m_5d3 - d53_prof[i][0]) / (d53_prof[i+1][0] - d53_prof[i][0])
                    return round(d53_prof[i][1] + frac * (d53_prof[i+1][1] - d53_prof[i][1]))
            return d53_prof[-1][1]

    new_d3_prof = [[round(i * 75.9 / 15, 1), get_elev_d3(round(i * 75.9 / 15, 1))] for i in range(16)]

    def get_elev_d4(m):
        m_5d3 = 28.24 + m
        for i in range(len(d53_prof)-1):
            if d53_prof[i][0] <= m_5d3 <= d53_prof[i+1][0]:
                frac = (m_5d3 - d53_prof[i][0]) / (d53_prof[i+1][0] - d53_prof[i][0])
                return round(d53_prof[i][1] + frac * (d53_prof[i+1][1] - d53_prof[i][1]))
        return d53_prof[-1][1]

    new_d4_prof = [[round(i * 64.6 / 15, 1), get_elev_d4(round(i * 64.6 / 15, 1))] for i in range(16)]

    # 6. Surfaces
    new_d4_unpaved = []
    if d4_old.get('surface') and 'unpaved' in d4_old['surface']:
        for kind, a, b in d4_old['surface']['unpaved']:
            new_a = max(0.0, round(a - 11.5, 1))
            new_b = max(0.0, round(b - 11.5, 1))
            if new_b > 0:
                new_d4_unpaved.append([kind, new_a, new_b])

    new_d4_surface = {
        'tot': {
            'unknown': 1.86,
            'paved': round(64.6 - (4.85 + 2.61 + 1.86), 1),
            'compacted': 4.85,
            'unpaved': 2.61
        },
        'unpaved': new_d4_unpaved
    }

    # Update routes dict
    routes['D3'] = {
        'mi': 75.9,
        'gain_ft': 1200,
        'nav': d3_nav,
        'app': d3_app,
        'profile': new_d3_prof,
        'steps': d3_steps,
        'pois': ['mi', 'kinderhook', 'valatie', 'st_albany', 'waterford_vc', 'mechanicville', 'schuylerville', 'dovegate', 'placid'],
        'surface': None
    }

    routes['D4'] = {
        'mi': 64.6,
        'gain_ft': 2100,
        'nav': d4_nav,
        'app': d4_app,
        'profile': new_d4_prof,
        'steps': d4_steps,
        'pois': ['mi', 'schuylerville', 'dovegate', 'fort_edward', 'st_fted', 'fort_ann', 'whitehall', 'stewarts_wh', 'st_whitehall', 'lockhistoric', 'st_ti', 'bw_ti', 'ricks'],
        'surface': new_d4_surface
    }

    with open(ROUTES_PATH, 'w') as f:
        json.dump(routes, f)

    print('Updated data/routes.json successfully with Schuylerville routes!')

if __name__ == '__main__':
    apply()
