# Accuracy audit — 2026-09-27

Scope: every guide, GPS file, the web app, and the jersey cue card, for the Oct 4, 2026 departure.
Everything below was checked against primary sources where possible (Amtrak timetable, CBP/CBSA,
operators' own sites) and otherwise against current business listings. **Hours in October change
often — call ahead for anything you depend on.**

## How the routes were rebuilt
- Each day was bike-routed on OpenStreetMap (routing.openstreetmap.de, bicycle profile), with routing
  points snapped onto the official trail geometry downloaded from OpenStreetMap: Empire State Trail
  (Hudson River Greenway, Putnam Trail, South/North County, Putnam County, Maybrook, Dutchess Rail Trail,
  east-bank on-road section), AHET, Mohawk-Hudson, Champlain Valley Trail, Zim Smith, Island Line,
  Lake Champlain Bikeways, Chambly Canal path, NY-9G and QC Route 223.
- Road-by-road sequences were reviewed for every day; detours that were artifacts of the routing points
  were fixed (e.g. the Day 2 route leaving the Dutchess Rail Trail for NY-376, Day 6 wandering into
  Vermont, VT Day 1 using 11 mi of US-7).
- Distances are measured along the tracks. Climbing is estimated from 30 m SRTM data (600 m smoothing,
  3 m threshold): treat it as ±20%. Surfaces come from OpenStreetMap tags.
- Daylight computed for each overnight location and date.
- `tools/build.py` regenerates `route_data.js`, `strip_map_data.js`, all GPX/KML, the guides and the
  service worker from `tools/content.py` + `data/routes.json`, so numbers can no longer drift between files.

## Distances: old vs. measured

| Stage | Old | Measured | Note |
|:---|---:|---:|:---|
| D1 NYC → Brewster (Heidi's Inn) | 60 | 67.5 | Heidi's is about 3 mi past the trail end |
| D2 Brewster → Hudson | 78 | 89.6 | official EST east-bank route; NY-9G straight through is 83.3 |
| D3 Hudson → Saratoga | 75 | 82.1 | |
| D4 Saratoga → Ticonderoga | 75 | 75.9 | ~8 mi compacted/gravel towpath |
| D5 Ticonderoga → Plattsburgh | 70 | 72.5 | hotel is 2 mi west of downtown |
| D6 Plattsburgh → Saint-Jean | 50 | 54.7 | |
| D7 Saint-Jean → Old Montréal | 37 | 35.8 | |
| 6-day finale Plattsburgh → Montréal | 87 | 87.9 | |
| 5-day D1 / D2 / D3 | 95 / 85 / 87 | 103.1 / 95.9 / 92.9 | |
| Vermont VT-1 / VT-2 | 53 / 58 | 60.7 / 75.4 | |
| Return Old Montréal → Rouses Point | "48" | 59.8 | |
| **7-day total** | 445 | **478.1** | |
| **6-day total** | 445 | **475.5** | |
| **5-day total** | 425 | **452.3** | |
| Climbing (6-/7-day) | 14,500–14,900 ft | ~12,100 ft | estimate |

Push options (5-day): Ticonderoga → Essex is 38 mi, not 18; Waterford → Saratoga is ~30 mi, not 20;
Walkway → Kingston is ~16–20 mi via 9W (30 mi only via the Wallkill Valley trail). All push days are 125+ mi.

## Critical corrections
1. **GPS files were unusable** (6–13 points per day = straight lines). Replaced with road-following tracks
   (850–1,600 points/day) and one GPX file per day in `gpx/` for bike computers.
2. **App failed offline** (Tailwind, Leaflet and fonts from CDNs; `app.js` crashed without Leaflet). Libraries
   are now bundled in `vendor/`, and a service worker caches the app, data and GPX files. Map tiles are
   cached only after being viewed once — use a GPS device/app with offline maps for real navigation.
3. **Amtrak Adirondack** (timetable dated 2026-09-27): southbound leaves Rouses Point **2:15 PM** (not 11:30 AM);
   **no Monday service north of Saratoga** (the guide suggested a Monday return); northbound runs **daily**
   (not Mon–Thu). Bike rule (NYC–Rouses Point only) was correct.
4. **Border hours:** the Rouses Point–Lacolle 223 crossing is **8 AM–8 PM on both sides** (since Jan 2025), not 24/7.
5. **Wrong turn cues:** Chazy → Rouses Point is **NY-9B**, not US-9; "NY-22/NY-73 junction" doesn't exist;
   the Port Henry "20-mile gap to Keeseville" note was wrong (39 mi, with Westport and Essex between).
6. **Montréal entry** was described three incompatible ways. Now one route: Route Verte → Longueuil →
   Jacques-Cartier Bridge → Île Sainte-Hélène → Pont de la Concorde → Old Port.
7. **Vermont variant:** bike ferry runs **Fri–Sun only** Sep 11–Oct 12 (so it only works on the 7-day plan's
   Friday); Sandbar bypass adds ~5 mi (not 14); the variant crosses
   at Rouses Point (not Noyan). Essex ferry: **$6.75**, every 30 min 10:30–5:30 from Essex (not "hourly, $6.25").
8. **Map bug:** the web map opened at maximum zoom (blank) because it fitted bounds before layout; fixed.
9. The strip-map cue notes were never displayed; a full cue table now renders under each strip.
10. Weather fallback values were invented and shown as if live; they're now labelled "Typical Oct weather,
    not a forecast", with realistic early-October normals.

## Businesses corrected
| Item | Was | Now |
|:---|:---|:---|
| Historic Grounds, Whitehall (Day 4 lunch) | "prime resupply" | **Closed after fire** → Stewart's, 60 Poultney St |
| The Cup Cafe, Essex (Day 5 lunch) | listed | **Not found** → Pink Pig Cafe (limited fall hours) + Stewart's Port Henry/Keeseville |
| Lake Street Cafe, Rouses Point | listed | **Closed Oct 2025** → Lakeside Coffee Roasters, 109 Lake St |
| Fourquet Fourchette, Chambly | listed | **Closed** → Boulangerie du Vieux-Chambly |
| Tanzy's, Hudson | listed | **Closed** (removed) |
| The Barlow Hotel, Hudson | (518) 828-2100 | **Now the Hudson Whaler**, (518) 217-4334 |
| Best Western Ticonderoga | (518) 585-1800 | (518) 585-2378 |
| Best Western Plattsburgh | (518) 561-7000 | (518) 561-7750 |
| Comfort Inn Brewster | (845) 483-7848 | (845) 363-0974 |
| Quality Hotel Saint-Jean | (450) 515-5755 | (450) 300-5177 |
| Auberge Harris | (450) 348-4408 | (450) 348-3821 |
| Hyatt Place Poughkeepsie | (845) 380-0000 | (845) 632-3100 (and 5 mi off route → DoubleTree at the Walkway instead) |
| Bistro La Trinquette | 155 Rue Richelieu, crêperie | 290 Rue Champlain, pub-bistro |
| Yorktown Cycles | "open Sundays" | **closed Sun & Mon** |
| Brewster Bicycle | listed | not found → Route 22 Cycles / Ski Haus |
| Saratoga Bicycle Specialties | 110 Excelsior Ave | not found (hardware store) → Trek Saratoga, 71 Church St |
| Downtube, Albany | listed | listed closed/appointment only (removed) |
| Performance Bégin, Saint-Jean | listed | not found → Cycle LM |
| Bicycles Quilicot | 1775 St-Denis, (514) 499-9600 | 7341 St-Denis, (514) 303-4118 |
| MEC Montréal | 4394 St-Denis | 8989 Boul. de l'Acadie |
| Maui North | 168 Margaret St | 316 Cornelia St |
| Rick's Bike Shop | 368 Dix Ave | 368 Ridge Rd |
| Walker's Hardware | "tubes, pumps" | Walker's Farm, Home & Tack (not a bike shop) |
| Lacolle CBSA / US CBP phones | (450) 246-3865 / (518) 298-8346 | CBSA BIS 1-800-959-2036 / CBP Rouses Point (518) 297-2441 |

Verified correct: Heidi's Inn, Trailside Cafe, The Wick, Saratoga Hilton, Holiday Inn Saratoga,
Steiner's Hudson, Franklin Square Inn, Hotel Kinsley, Hotel Monville, Fairmont Queen Elizabeth,
Hero's Welcome, Hotel Vermont, Courtyard Burlington, Old Spokes Home, North Star Sports.

## Still unverified / check before you go
- October hours for Pink Pig Cafe (Essex), Lakeside Coffee Roasters (closes ~1:30–2 PM), La Trinquette lunch,
  Bikeway at Hopewell Depot, Route 22 Cycles, Cycle LM phone.
- Hotel bike storage: none of the "secure bike room" claims in earlier drafts could be confirmed — ask when booking.
- The Chambly Canal path has a ~4 mi gap in OpenStreetMap; the GPX uses parallel Route 223 there.
  Ride the towpath if it's open.
- Router choices on a few short urban links (Poughkeepsie side streets to NY-9G, Cohoes, Chambly streets)
  are reasonable but not ride-tested. Preview each day on your device's map before the trip.
- Reserve Amtrak bike spots early (limited per train, $20 on Empire Service).

## Sources
Amtrak Adirondack timetable (content.amtrak.com/content/timetable/Adirondack.pdf); amtrak.com/adirondack-train;
cbp.gov/about/contact/ports/champlain-new-york-0712; CBSA hours-of-service change (canada.ca, Nov 2024);
localmotion.org/bike_ferry; ferries.com (Charlotte–Essex rates & schedule); mta.info bike rules;
empiretrail.ny.gov; parks.canada.ca (Chambly Canal); OpenStreetMap contributors (routes, surfaces);
OpenTopoData SRTM 30 m (elevation); business websites and current listings (Yelp, Tripadvisor, Choice, Hilton,
Best Western, Stewart's) as of 2026-09-27.
