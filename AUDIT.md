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
  It also runs `tools/split_gpx.py` on the combined files, so the per-day GPX files are always regenerated
  together with everything else (there used to be two separate per-day pipelines that could disagree).

## Post-ride review (2026-10-13)
Riders completed the 6-day itinerary Oct 4–9, 2026. Recorded GPS tracks were compared with the planned
tracks (every point more than 60 m off the plan, both ways), and stops were found from the timestamps. Sections
were patched with `tools/reroute.py` (each patch records why), then everything was rebuilt with `tools/build.py`.

| Patch | Days | Change |
|:---|:---|---:|
| `les-prince`: Prince St bike lane, 6th Ave, Charlton St instead of the Mulberry/Jersey/Crosby jog and 0.9 mi of Houston St (as ridden) | 1 | −0.2 mi |
| `brewster-arrive`: leave the Maybrook Trailway on a short gravel track to Danbury Rd, 0.4 mi from the Comfort Inn, instead of riding 3 mi past it and looping back over Dingle Ridge / Nichols Rd (as ridden) | 1 | −4.0 mi, ~−400 ft |
| `brewster-depart`: same track back up to the trail and west on it, instead of east to Joes Hill Rd and back through Brewster streets (with a 0.1 mi Putnam Ave out-and-back) | 2 | −3.1 mi |
| `cohoes-blvd`: stay on the Cohoes Blvd path to Saratoga St instead of looping through downtown Cohoes (ride feedback) | 3 | −0.7 mi |
| `waterford-spur`: remove a 0.3 mi out-and-back onto the canal trail at 5th St | 3 | −0.3 mi |
| `schuylerville-arrive`: Burgoyne St → Green St → Spring St, dropping the Clancy/University zigzag | 3 | 0.0 mi |
| `fort-miller-river-rd`: CR-70A/CR-113 instead of a hard-to-find unnamed path, and River Rd instead of 1.5 mi of US-4 (as ridden) | 4 (and 5-day Day 3) | +0.4 mi |
| `rouses-point-lake-st`: straight up Lake St instead of 11 side streets (as ridden) | 6-day Day 6 | −1.1 mi |

The gravel access track at Brewster and the north end of the Cohoes Blvd path are not connected to the road
network in OpenStreetMap, so those pieces are drawn by hand from OSM geometry and the recorded GPS track.

New lunch stops from the ride: **Bubby's Take Away Kitchen**, 19 W Market St, Red Hook (Day 2) and **Whitehall
Market**, 192 Broadway, Whitehall (Day 4). Both locations match the recorded stops to within 40 m. Hours are not
verified for either.

Checked and left as planned: the parallel Wurtemburg Rd beside NY-9G on Day 2 (about 210 ft more climbing), the
US-9/Livingston variation and southwest approach into Hudson on Day 2 (longer), the Day 3 exit from Hudson
(breakfast detour), the Plattsburgh lakeside path on Day 5, and the Saint-Jean, Chambly,
Saint-Hubert and Longueuil variations on Day 6 (a lunch detour and parallel one-way streets). A cue note now
marks where to leave the Old Champlain Canal Trail at Upper Newtown Rd (easy turn to miss).

New totals: 7-day 454.4 mi, 6-day 453.8 mi, 5-day 449.6 mi.

## Distances: old vs. measured

| Stage | Old | Measured | Note |
|:---|---:|---:|:---|
| D1 NYC → Brewster (Heidi's Inn) | 60 | 67.5 | Heidi's is about 3 mi past the trail end |
| D2 Brewster → Hudson** | 78 | 81.7 | trails, then NY-9G, US-9 via Red Hook, Blue Hill Rd (was 89.6 via the EST's Rhinebeck/Tivoli county roads) |
| D3 Hudson → Schuylerville (Dovegate Inn)* | 75 (to Saratoga) | 76.9 | ~8.5 mi unpaved (canal trails) |
| D4 Schuylerville → Ticonderoga* | 75 (from Saratoga) | 64.4 | ~8 mi compacted/gravel towpath |
| D5 Ticonderoga → Plattsburgh | 70 | 72.5 | hotel is 2 mi west of downtown |
| D6 Plattsburgh → Saint-Jean | 50 | 54.7 | |
| D7 Saint-Jean → Old Montréal | 37 | 35.8 | |
| 6-day finale Plattsburgh → Montréal | 87 | 87.9 | |
| 5-day D1 / D2 / D3 | 95 / 85 / 87 | 103.1 / 95.9 / 92.9 | |
| Vermont VT-1 / VT-2 | 53 / 58 | 60.7 / 72.8 | VT-2 now stays on US-2 (router had used 2 unpaved side roads) |
| Return Old Montréal → Rouses Point | "48" | 59.8 | |
| **7-day total** | 445 | **453.5** | |
| **6-day total** | 445 | **450.9** | |
| **5-day total** | 425 | **452.3** | |
| Climbing (6-/7-day) | 14,500–14,900 ft | ~10,900 ft | estimate |

\* The Day 3 overnight was moved from Saratoga Springs to Schuylerville on 2026-09-28 (edit in `tools/content.py`). Both days were re-routed along the Empire State Trail (Waterford → Mechanicville → Stillwater → Schuylerville on the Old Champlain Canal Trail and US-4) rather than spliced from existing tracks. The Saratoga version was 82.1 + 75.9 mi.

\*\* Day 2 was changed on 2026-09-28 to the shorter, flatter option: same Maybrook + Dutchess rail trails (37 mi), then NY-9G, US-9 through Red Hook (lunch: Red Hook Diner, open daily) and Blue Hill Rd (CR-31) into Hudson: 81.7 mi and about 1,400 ft of climbing, versus 89.6 mi and about 1,900 ft on the Empire State Trail's county-road route via Rhinebeck and Tivoli. No unpaved sections per OpenStreetMap. Confirmed 81.7 mi by independent Valhalla map-matching.

Surfaces were measured against OpenStreetMap unpaved-way tags along every route (5 m match). Unpaved stretches per day are listed in each day's Surface line and marked in the cue sheets.

Push options (5-day): Ticonderoga → Essex is 38 mi, not 18; the Day 2 push to Saratoga was removed (2026-09-28) along with the Saratoga overnight;
Walkway → Kingston is ~16–20 mi via 9W (30 mi only via the Wallkill Valley trail). All push days are 125+ mi.

## 6-day distance audit (2026-09-28)
Three independent checks on the 6-day itinerary (now 450.9 mi after the Day 2 change):

1. **Internal consistency:** GPX track length, app data, strip map, cue sheet and guides agree for every day
   (differences ≤0.3 mi from rounding/track simplification); km conversions correct; the six days sum to
   the itinerary total; each day starts where the previous one ended.
2. **Named trails vs. published lengths** (measured inside the tracks): Hudson River Greenway 12.9 mi (~11–13
   published); South County 14.4 (14.1); North County 20.6 (22.1; the two together are 35.0 vs 36.2, −3%, likely
   where OpenStreetMap places the name change); Putnam 11.9 (~12); Maybrook 23.9 (23–25); Dutchess Rail Trail 13.2
   (13.4); AHET 32.4 span / 27.5 on-trail (36 end to end incl. on-street links / 26.6 built); Chambly Canal corridor
   13.6 (12.4, plus the unmapped middle section on Route 223).
3. **Independent map-matching** of each day's GPX with a different router (Valhalla, bicycle profile):

| Day | Stated | Valhalla | Diff |
|:---|---:|---:|---:|
| 1 NYC → Brewster | 67.5 | 67.7 | +0.3% |
| 2 Brewster → Hudson (new route) | 81.7 | 81.7 | 0.0% |
| 3 Hudson → Schuylerville | 76.9 | 76.9 | 0.0% |
| 4 Schuylerville → Ticonderoga | 64.4 | 64.4 | 0.0% |
| 5 Ticonderoga → Plattsburgh | 72.5 | 72.6 | +0.1% |
| 6 Plattsburgh → Montréal | 87.9 | 86.6 | −1.5% (Valhalla left short unmatched gaps on bridge paths / the canal) |
| **Total** | **450.9** | **450.0** | **−0.2%** |

## Critical corrections
1. **GPS files were unusable** (6–13 points per day = straight lines). Replaced with road-following tracks
   (850–1,600 points/day), with one GPX file per day per itinerary in `gpx/7day/`, `gpx/6day/`, `gpx/5day/` and `gpx/vermont/` for bike computers.
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
