# Source of truth for all human-written tour content.
# Distances, climbing, mile markers, tracks and turn cues come from data/routes.json
# (bike-routed on OpenStreetMap along the official trail relations). Edit this file,
# then run `python3 tools/build.py` to regenerate the app data, GPX/KML and guides.
#
# Business details below were checked online on 2026-09-27. Hours change often,
# especially in October: call ahead. Items we could not verify say so explicitly.

TRIP_YEAR = 2026
VERIFIED_ON = "2026-09-27"

def gmaps(q):
    import urllib.parse
    return "https://www.google.com/maps/search/?api=1&query=" + urllib.parse.quote_plus(q)

# ---------------------------------------------------------------------------
# Places (hotels, food, shops). 'geo' keys refer to geocoded coordinates.
# ---------------------------------------------------------------------------
PLACES = {
    # --- Day 1 ---
    "trailside": dict(name="Trailside Cafe", address="1807 Commerce St, Yorktown Heights, NY", phone="(914) 302-7331",
                      notes="Beside the North County Trailway. Smoothies, paninis, wraps. Sunday hours listed as 8 AM to 3 or 4 PM (sources disagree): call ahead."),
    "yorktown_cycles": dict(name="Yorktown Cycles", address="1899 Commerce St, Yorktown Heights, NY", phone="(914) 245-5504",
                      notes="Next to the trail. CLOSED Sundays and Mondays (open Tue to Sat 10 to 5), so it is not available on a Sunday Day 1."),
    "heidis": dict(name="Heidi's Inn", address="1270 Route 22, Brewster, NY", phone="(845) 279-8011",
                   notes="Motel on NY-22, about 3 mi past the end of the Putnam Trailway (through Brewster village). Confirm bike storage when booking."),
    "comfort_brewster": dict(name="Comfort Inn Brewster", address="7-11 Peach Lake Rd, Brewster, NY", phone="(845) 363-0974",
                   notes="About 2 mi east of Brewster village near I-84. Free hot breakfast."),
    "route22cycles": dict(name="Route 22 Cycles", address="2237 Route 22, Brewster, NY", phone="(845) 784-6166",
                   notes="Hours not verified: call before relying on it."),
    "skihaus": dict(name="Ski Haus (bikes)", address="1611 Route 22, Brewster, NY", phone="(845) 279-3100",
                   notes="Listed Wed to Fri 11 to 6, Sat 11 to 5; closed Sun to Tue."),
    # --- Day 2 ---
    "hopewell_depot": dict(name="Bikeway at Hopewell Depot", address="Hopewell Depot, Dutchess Rail Trail, Hopewell Junction, NY", phone="(845) 463-4000",
                   notes="Seasonal rentals and repairs at the trailhead; main line is Bikeway's Wappingers Falls shop. Call for October hours."),
    "bread_alone": dict(name="Bread Alone Bakery & Cafe", address="45 E Market St, Rhinebeck, NY", phone="",
                   notes="Breakfast and lunch daily; listed open Mondays 7 AM to 5 PM."),
    "rhinebeck_bike": dict(name="Rhinebeck Bicycle Shop", address="10 Garden St, Rhinebeck, NY", phone="(845) 876-4025",
                   notes="Repairs, parts, rentals. One block from Bread Alone. Call for hours."),
    "barlow": dict(name="Hudson Whaler Hotel (formerly The Barlow)", address="542 Warren St, Hudson, NY", phone="(518) 217-4334",
                   notes="The Barlow Hotel was sold and reopened as the Hudson Whaler: same building, new name and phone number."),
    "wick": dict(name="The Wick, Hudson (Tribute Portfolio)", address="41 Cross St, Hudson, NY", phone="(518) 249-6825",
                   notes="Near the Hudson Amtrak station."),
    "steiners_hudson": dict(name="Steiner's Sports", address="301 Warren St, Hudson, NY", phone="(518) 828-5063",
                   notes="Bike sales and service. Listed Mon to Fri 10 to 6, Sat 10 to 5, Sun from 11."),
    # --- Day 3 ---
    "donpauls": dict(name="Don & Paul's Coffee Shoppe", address="68 Broad St, Waterford, NY", phone="",
                   notes="Diner on the route by the Waterford canal harbor. Listed Mon to Sat 7 AM to 7:30 PM, Sun 7 AM to 2 PM."),
    "steiners_valatie": dict(name="Steiner's Sports (Valatie)", address="3455 Route 9, Valatie, NY", phone="(518) 784-3663",
                   notes="In Valatie, just off the AHET around mile 15. Listed Mon to Wed 10 to 6, Thu and Fri 10 to 8, Sat 9 to 5, Sun 11 to 4."),
    "dovegate": dict(name="Dovegate Inn", address="184 Broad St, Schuylerville, NY", phone="(518) 695-3699",
                   notes="Historic 1800s B&B right on Broad St in Schuylerville village center. Booking ahead recommended (limited rooms); vacation rentals/Airbnbs also available in town or nearby Greenwich."),
    "hilton": dict(name="The Saratoga Hilton", address="534 Broadway, Saratoga Springs, NY", phone="(518) 584-4000", notes="Downtown on Broadway."),
    "holiday_sar": dict(name="Holiday Inn Saratoga Springs", address="232 Broadway, Saratoga Springs, NY", phone="(518) 584-4550", notes="South end of Broadway, on the way in."),
    "trek_saratoga": dict(name="Trek Bicycle Saratoga Springs", address="71 Church St, Saratoga Springs, NY", phone="(518) 583-0600",
                   notes="Replaces 'Saratoga Bicycle Specialties' from earlier drafts, which could not be found (110 Excelsior Ave is a hardware store)."),
    # --- Day 4 ---
    "stewarts_wh": dict(name="Stewart's Shops #211", address="60 Poultney St, Whitehall, NY", phone="",
                   notes="Convenience store with hot food and coffee. The reliable food stop in Whitehall."),
    "historic_grounds_closed": dict(name="Historic Grounds (CLOSED)", address="142 Main St, Whitehall, NY", phone="",
                   notes="Closed after a fire; listed closed as of July 2026. Do not plan on it."),
    "bw_ti": dict(name="Best Western Plus Ticonderoga Inn & Suites", address="260 Burgoyne Rd, Ticonderoga, NY", phone="(518) 585-2378",
                   notes="On the south side of town, right on the route."),
    "walkers": dict(name="Walker's Farm, Home & Tack", address="5565 State Route 4, Fort Ann, NY", phone="(518) 639-5223",
                   notes="Farm and hardware store, NOT a bike shop: basic tools and supplies only. Listed Mon to Fri 8 to 6, Sat 8 to 5, Sun 9 to 4."),
    "ricks": dict(name="Rick's Bike Shop", address="368 Ridge Rd, Queensbury, NY", phone="(518) 793-8986",
                   notes="Full shop, but about 5 mi west of the route near Fort Edward. Mon to Fri 10 to 6, Sat 10 to 5, closed Sun."),
    # --- Day 5 ---
    "stewarts_ph": dict(name="Stewart's Shops #103", address="4308 Main St, Port Henry, NY", phone="(518) 546-3025",
                   notes="Guaranteed food and water on Day 5. Top up here."),
    "pinkpig": dict(name="Pink Pig Cafe", address="2750 Essex Rd, Essex, NY", phone="(518) 962-8833",
                   notes="Next to the ferry dock. Hours are limited in the fall (one listing shows Fri to Sun hours and closed Mon to Wed; Thursday is unclear): call ahead. The Essex Ice Cream Cafe is summer-only, and 'The Cup Cafe' from earlier drafts does not appear to exist."),
    "stewarts_kees": dict(name="Stewart's Shops", address="1774 Main St, Keeseville, NY", phone="",
                   notes="Backup food stop on the route in Keeseville."),
    "bw_platt": dict(name="Best Western Plus Plattsburgh", address="446 Route 3, Plattsburgh, NY", phone="(518) 561-7750",
                   notes="On Route 3 by I-87 exit 37, about 2 mi west of downtown."),
    "maui": dict(name="Maui North Ski, Bike & Board", address="316 Cornelia St, Plattsburgh, NY", phone="(518) 563-7245",
                   notes="Full-service shop on the route into town. Listed Mon to Fri 10 to 6, Sat 10 to 5, Sun 12 to 4."),
    # --- Day 6 ---
    "lakeside_rp": dict(name="Lakeside Coffee Roasters", address="109 Lake St, Rouses Point, NY", phone="(518) 297-5600",
                   notes="Last US cafe before the border. Paninis, quiche, soups. Listed Tue to Fri 7:30 AM to 2 PM (one source says Fri closes 1:30), Sat and Sun 8 to 2, closed Mon. The Lake Street Cafe & Bakery listed in earlier drafts closed in Oct 2025."),
    "quality_sj": dict(name="Quality Hotel Centre de Congrès", address="725 Boul. du Séminaire N, Saint-Jean-sur-Richelieu, QC", phone="+1 (450) 300-5177",
                   notes="North side of town, near the canal. Choice Hotels toll-free: 1-800-667-3815."),
    "auberge_harris": dict(name="Auberge Harris", address="576 Rue Champlain, Saint-Jean-sur-Richelieu, QC", phone="+1 (450) 348-3821",
                   notes="Riverside inn close to the start of the canal path. Toll-free 1-800-668-3821."),
    "trinquette": dict(name="Bistro La Trinquette", address="290 Rue Champlain, Saint-Jean-sur-Richelieu, QC", phone="+1 (450) 349-1811",
                   notes="Pub-bistro with a big terrace, not a crêperie. Open late daily; lunch opening time not confirmed."),
    "cyclelm": dict(name="Cycle LM", address="270 Boul. Saint-Luc, Saint-Jean-sur-Richelieu, QC", phone="",
                   notes="Bike shop with a repair workshop, about 2.4 mi west of the route. Replaces 'Performance Bégin', which could not be found. Phone not verified: see cyclelm.com."),
    # --- Day 7 / Montreal ---
    "boulangerie_chambly": dict(name="Boulangerie du Vieux-Chambly", address="2403 Av. Bourgogne, Chambly, QC", phone="+1 (450) 447-9991",
                   notes="Bakery and cafe on the route, about 0.5 mi before Fort Chambly. Sandwiches and pastries. Replaces Fourquet Fourchette, which has closed."),
    "monville": dict(name="Hôtel Monville", address="1041 Rue de Bleury, Montréal, QC", phone="+1 (514) 379-2000",
                   notes="Downtown, about 0.5 mi from Place Jacques-Cartier. Ask about bike storage when booking."),
    "fairmont": dict(name="Fairmont The Queen Elizabeth", address="900 Boul. René-Lévesque O, Montréal, QC", phone="+1 (514) 861-3511",
                   notes="Above Gare Centrale. Unboxed bikes still cannot board Amtrak here."),
    "ca_roule": dict(name="Ça Roule Montréal / Montreal on Wheels", address="27 Rue de la Commune E, Montréal, QC", phone="+1 (514) 866-0633",
                   notes="Rental and repair shop at the finish in Old Montreal. October hours listed 10 AM to 5 PM daily."),
    "quilicot": dict(name="Bicycles Quilicot (Villeray)", address="7341 Rue Saint-Denis, Montréal, QC", phone="+1 (514) 303-4118",
                   notes="Full shop, 4 mi north of downtown. Call ahead to confirm bike boxes are available."),
    "mec": dict(name="MEC Montréal (Marché Central)", address="8989 Boul. de l'Acadie, Montréal, QC", phone="+1 (514) 788-5878",
                   notes="Outdoor store with bike service. Earlier drafts gave a Saint-Denis address; that is wrong."),
    # --- 5-day extras ---
    "pok_grand": dict(name="DoubleTree by Hilton Poughkeepsie", address="40 Civic Center Plaza, Poughkeepsie, NY", phone="(845) 485-5300",
                   notes="Formerly the Poughkeepsie Grand Hotel. About 0.4 mi from the Walkway Over the Hudson."),
    "hyatt_pok": dict(name="Hyatt Place Poughkeepsie", address="2165 South Rd, Poughkeepsie, NY", phone="(845) 632-3100",
                   notes="Alternative. About 5 mi SOUTH of the route on busy US-9."),
    "franklin_sq": dict(name="Best Western Plus Franklin Square Inn Troy/Albany", address="1 4th St, Troy, NY", phone="(518) 274-8800", notes="Downtown Troy."),
    "kinsley": dict(name="Hotel Kinsley", address="301 Wall St, Kingston, NY", phone="(845) 768-3620", notes="Only needed for the Kingston push option."),
    # --- Vermont ---
    "hotel_vt": dict(name="Hotel Vermont", address="41 Cherry St, Burlington, VT", phone="(802) 651-0080", notes="Downtown, near the lakefront path."),
    "courtyard_btv": dict(name="Courtyard Burlington Harbor", address="25 Cherry St, Burlington, VT", phone="(802) 864-4700", notes="Next door to Hotel Vermont."),
    "oldspokes": dict(name="Old Spokes Home", address="331 N Winooski Ave, Burlington, VT", phone="(802) 863-4475", notes="Tue to Fri 10 to 6, Sat 10 to 5; closed Sun and Mon."),
    "northstar": dict(name="North Star Sports", address="100 Main St, Burlington, VT", phone="(802) 863-3832", notes="Downtown bike shop near the waterfront."),
    "heros": dict(name="Hero's Welcome General Store", address="3537 US Route 2, North Hero, VT", phone="(802) 372-4161",
                   notes="Deli, bakery and general store on the lake. Standard hours Mon to Sat 7 to 6, Sun 8 to 5; hours are reduced seasonally."),
}

# Extra coordinates for places that weren't geocoded automatically
# Coordinates below are approximate (not geocoded): they place pins on the map but no mile marker is shown.
EXTRA_GEO = {
    "dovegate": [43.1000, -73.5815],
    "route22cycles": [41.4430, -73.5760],   # approximate (Route 22 north of Brewster); not verified
    "skihaus": [41.4262, -73.5800],         # approximate; not verified
    "steiners_valatie": [42.4180, -73.6700], # approximate (Route 9, Valatie); not verified
    "walkers": [43.4150, -73.4910],          # approximate (Route 4, Fort Ann)
    "oldspokes": [44.4851, -73.2103],
    "northstar": [44.4760, -73.2156],
    "mec": [45.5303, -73.6620],
}

# ---------------------------------------------------------------------------
# Stage definitions. 'route' is the key in data/routes.json.
# ---------------------------------------------------------------------------
STAGES = {
    "D1": dict(title="NYC (Battery Park) to Brewster, NY", short="NYC → Brewster",
        subtitle="Hudson River Greenway, Bronx link, South & North County Trailways, Putnam Trailway",
        waterway="Hudson River", rail="Metro-North Harlem & Hudson Lines",
        lunch="trailside", hotels=["heidis", "comfort_brewster"], shops=["yorktown_cycles", "route22cycles", "skihaus"],
        surface_note="Almost entirely car-free paved path. About 4 mi of city streets through Inwood and the Bronx (Seaman Ave, Broadway, Broadway Bridge) and about 2.8 mi of streets and NY-22 through Brewster to the motel.",
        bailout="Metro-North: Brewster station (Harlem Line) is right on the route at mile {st_brewster}. Mid-route, the nearest Harlem Line stations are Pleasantville (about 1.2 mi east of the trail near mile {st_pleasantville}) and Chappaqua (about 2.2 mi east near mile {st_chappaqua}); Tarrytown (Hudson Line) is about 1.6 mi west near mile {st_tarrytown}. Bikes ride free with no permit, but NOT on weekday rush-hour trains or holidays (limit 4 per train on weekdays, 8 on weekends).",
        cue_notes={
            "Seaman Avenue": "Greenway ends at Dyckman St; continue up to Seaman Ave and ride north through Inwood.",
            "Broadway": "Busy street. Cross the Broadway Bridge over the Harlem River into Marble Hill. Ride single file.",
            "Putnam Greenway": "Van Cortlandt Park: the paved Putnam Trail runs north to the Yonkers line.",
            "South County Trailway": "Car-free paved rail trail through Westchester.",
            "North County Trailway": "At Eastview the trail becomes the North County Trailway.",
            "Putnam Trailway": "At Baldwin Place the trail becomes the Putnam County Trailway.",
            "Putnam Avenue": "Leave the trail in Brewster. Brewster Metro-North station is on your right.",
            "State Highway 22": "NY-22 north for 0.4 mi to Heidi's Inn on the right.",
        },
        extra_cues=[("gwb", "poi", "PASS", "George Washington Bridge / Little Red Lighthouse", "Greenway climbs away from the river north of the bridge; follow the bike signs."),
                    ("trailside", "lunch", "LUNCH", "Trailside Cafe, 1807 Commerce St", "Right beside the trail at Yorktown Heights. Yorktown Cycles next door is CLOSED Sun and Mon.")]),
    "D2": dict(title="Brewster to Hudson, NY", short="Brewster → Hudson",
        subtitle="Maybrook Trailway, Dutchess Rail Trail, NY-9G and the Empire State Trail's east-bank road route",
        waterway="Hudson River (east bank)", rail="Metro-North & Amtrak Empire Service",
        lunch="bread_alone", hotels=["barlow", "wick"], shops=["hopewell_depot", "rhinebeck_bike", "steiners_hudson"],
        surface_note="About 37 mi of paved rail trail (Maybrook and Dutchess Rail Trail). Then roads: NY-9G (a 55-mph highway with a wide shoulder) for about 15 mi, followed by the signed Empire State Trail on-road route (quiet county roads) from Rhinebeck to Hudson.",
        bailout="Metro-North Hudson Line and Amtrak at Poughkeepsie (about 0.5 mi off the route at mile {st_pok}). Amtrak at Rhinecliff (about 2 mi west of Rhinebeck, near mile {st_rhinecliff}) and Hudson (end of stage). Amtrak Empire Service carry-on bikes need a $20 reservation.",
        cue_notes={
            "Maybrook Trailway": "Paved rail trail west for 24 mi to Hopewell Junction.",
            "Dutchess Rail Trail": "Hopewell Depot trailhead (Bikeway rentals and repairs here, seasonal). Paved trail 13 mi to Poughkeepsie.",
            "Parker Avenue": "Trail ends in Poughkeepsie. OPTIONAL: the Walkway Over the Hudson entrance is about 0.5 mi west; riding across and back adds about 3 to 4 mi.",
            "Violet Avenue": "NY-9G north: wide shoulder, 55-mph traffic. Single file.",
            "East Market Street": "NY-308 west into Rhinebeck village.",
            "Mount Rutsen Road": "From here to Hudson the route follows the signed Empire State Trail on-road route on quiet county roads.",
            "Rhinebeck-Hudson Road": "NY-9G/23B north into Hudson.",
            "Warren Street": "Right on Warren St to the hotel (542 Warren St).",
        },
        extra_cues=[("bread_alone", "lunch", "LUNCH", "Bread Alone, 45 E Market St, Rhinebeck", "Open daily; Rhinebeck Bicycle Shop is one block away at 10 Garden St.")],
        alt_note="SHORTCUT: stay on NY-9G all the way from Poughkeepsie to Hudson (skip Rhinebeck village and the county-road section). That route is 83.3 mi instead of 89.6, but it's all 55-mph highway shoulder."),
    "D3": dict(title="Hudson to Schuylerville, NY", short="Hudson → Schuylerville",
        subtitle="Albany-Hudson Electric Trail, Dunn Bridge, Mohawk-Hudson Trail, Champlain Canalway Trail (Waterford, Mechanicville, Stillwater)",
        waterway="Hudson River & Champlain Canal", rail="Amtrak Empire Service (Albany-Rensselaer)",
        lunch="donpauls", hotels=["dovegate"], shops=["steiners_valatie"],
        surface_note="Mostly paved trail and canal paths: AHET, Mohawk-Hudson Bike-Hike Trail, and Champlain Canalway Trail via Waterford, Mechanicville, and Stillwater into Schuylerville. Stays 100% on the official Empire State Trail without highway detours.",
        bailout="Amtrak Albany-Rensselaer station is about 0.1 mi off the route at mile {st_albany}; it's the best bailout, with frequent Empire Service trains and a $20 bike reservation. Further north, Stewart's Shops in Mechanicville and Stillwater offer food and rest stops.",
        cue_notes={
            "Albany-Hudson Electric Trail": "Paved AHET. Several short on-road links follow; watch for trail signs.",
            "Dunn Memorial Bridge Path": "Cross the Hudson into Albany on the bridge's shared path.",
            "Mohawk-Hudson Bike-Hike Trail": "Riverside path north from the Corning Preserve.",
            "Broadway": "On-road through Watervliet and Cohoes: follow the Empire State Trail signs.",
            "Saratoga Street": "NY-32 north into Waterford.",
            "Old Champlain Canal Trail": "Canal towpath trail north toward Mechanicville.",
            "Hudson River Road": "US-4 / NY-32 along the Hudson River through Mechanicville and Stillwater.",
            "Surrender March Trail": "Historic trail approach through Saratoga National Historical Park into Schuylerville.",
        },
        extra_cues=[("donpauls", "lunch", "LUNCH", "Don & Paul's, 68 Broad St, Waterford", "Diner on the route by the Waterford canal harbor (Erie Canal Lock E2).")]),
    "D4": dict(title="Schuylerville to Ticonderoga, NY", short="Schuylerville → Ticonderoga",
        subtitle="Champlain Canalway Trail (US-4 & towpaths), Fort Edward, Fort Ann, Whitehall, NY-22",
        waterway="Champlain Canal / Lake Champlain", rail="Amtrak Adirondack (Fort Edward, Whitehall)",
        lunch="stewarts_wh", hotels=["bw_ti"], shops=["walkers", "ricks"],
        surface_note="Champlain Canalway Trail towpaths and road shoulders through Fort Edward, Fort Ann, and Whitehall, then rolling NY-22 into Ticonderoga. About 9 mi of compacted stone-dust canal towpath between Schuylerville and Fort Ann.",
        bailout="Amtrak Adirondack stops at Fort Edward (mile {st_fted}), Whitehall (mile {st_whitehall}) and Ticonderoga (about 1.1 mi off the route near the end). Northbound runs once daily and carry-on bikes need a reservation.",
        cue_notes={
            "Old Champlain Canal Towpath": "Towpath trail departing Schuylerville north along the canal.",
            "Champlain Canalway Trail": "Canalway trail: compacted stone dust or gravel through Fort Edward and Fort Ann.",
            "US Route 4": "US-4/NY-22 north into Whitehall.",
            "Broadway": "Whitehall village. Stewart's Shop is at 60 Poultney St, just off the route. Historic Grounds is CLOSED.",
            "State Highway 22": "NY-22 north: 23.5 rolling miles with few services. Fill bottles in Whitehall.",
            "Mount Hope Avenue": "Into Ticonderoga; the hotel is just ahead.",
        },
        extra_cues=[("stewarts_wh", "lunch", "LUNCH / RESUPPLY", "Stewart's Shops, 60 Poultney St, Whitehall", "Historic Grounds (listed in earlier drafts) is CLOSED after a fire.")]),
    "D5": dict(title="Ticonderoga to Plattsburgh, NY", short="Ticonderoga → Plattsburgh",
        subtitle="NY-9N/22 lakeshore: Crown Point, Port Henry, Westport, Essex, Willsboro, Keeseville, Ausable Chasm, US-9",
        waterway="Lake Champlain", rail="Amtrak Adirondack",
        lunch="pinkpig", hotels=["bw_platt"], shops=["maui"],
        surface_note="Paved two-lane state highway (NY-9N/22, then US-9) almost the whole way, with the hilliest terrain of the tour between Westport and Keeseville.",
        bailout="Amtrak Adirondack at Port Henry (mile {st_porthenry}), Westport (about 0.8 mi off the route near mile {st_westport}) and Plattsburgh (mile {st_platt}). Carry-on bikes need a reservation.",
        cue_notes={
            "State Highway 9N": "NY-9N/22 north along the lake.",
            "South Main Street": "Port Henry village. Stewart's #103 (4308 Main St) is the guaranteed food and water stop today.",
            "Champlain Avenue": "In Westport, follow NY-22 north toward Essex.",
            "Essex Road": "Into Essex. The ferry dock and Pink Pig Cafe are here.",
            "US 9": "US-9 north past Ausable Chasm toward Plattsburgh.",
            "Terry Gordon Bike Path": "Plattsburgh riverside path.",
            "Cornelia Street": "NY-3 west about 2 mi to the hotel (446 Route 3).",
        },
        extra_cues=[("stewarts_ph", "poi", "RESUPPLY", "Stewart's #103, Port Henry", "Reliable food and water. Essex options are limited in October."),
                    ("pinkpig", "lunch", "LUNCH (call ahead)", "Pink Pig Cafe, Essex (by the ferry dock)", "Fall hours are limited; the backup is Stewart's in Keeseville at mile 56."),
                    ("stewarts_kees", "poi", "RESUPPLY", "Stewart's, Keeseville", "Backup food stop.")]),
    "D6": dict(title="Plattsburgh, NY to Saint-Jean-sur-Richelieu, QC", short="Plattsburgh → Saint-Jean",
        subtitle="US-9, NY-9B to Rouses Point, border at US-11 / Route 223, Richelieu River",
        waterway="Lake Champlain / Richelieu River", rail="Amtrak Adirondack (Rouses Point)",
        lunch="lakeside_rp", hotels=["quality_sj", "auberge_harris"], shops=["cyclelm"],
        surface_note="Flat, paved country roads: US-9, NY-9B and Route 223, with a short path in Plattsburgh.",
        bailout="Amtrak Adirondack at Rouses Point (mile {st_rouses}): the last station where carry-on bikes are accepted. Southbound train 68 departs 2:15 PM (Sun and Tue to Sat; there is NO Monday service north of Saratoga). In Quebec, exo buses serve Saint-Jean to Montréal; check bike rules with exo.",
        cue_notes={
            "Margaret Street": "US-9 north out of Plattsburgh.",
            "Lake Street": "At mile {lake9b}: NY-9B (Lake St) north to Rouses Point. (Earlier drafts wrongly said stay on US-9, which goes to Champlain instead.)",
            "US 11": "US-11 north to the border.",
            "Route 223": "CANADA. Route 223 north along the west bank of the Richelieu.",
            "Boulevard du Séminaire Sud": "Into Saint-Jean-sur-Richelieu.",
            "Rue Champlain": "Riverfront; the canal path starts here.",
        },
        extra_cues=[("lakeside_rp", "lunch", "LUNCH", "Lakeside Coffee Roasters, 109 Lake St, Rouses Point", "Last US cafe: closes early afternoon and is closed Mondays."),
                    ("border223", "border", "BORDER", "Rouses Point–Lacolle 223 crossing (US-11 / Route 223)", "Open 8 AM to 8 PM daily on both sides (not 24 hours). Stop at the car booth with your passport, EDL or NEXUS card. No cannabis. Declare any food.")]),
    "D7": dict(title="Saint-Jean-sur-Richelieu to Old Montréal", short="Saint-Jean → Montréal",
        subtitle="Chambly Canal path, Chambly, Route Verte to Longueuil, Jacques-Cartier Bridge, Île Sainte-Hélène, Pont de la Concorde, Old Port",
        waterway="Richelieu & St. Lawrence", rail="Montréal Metro (Longueuil)",
        lunch="boulangerie_chambly", hotels=["monville", "fairmont"], shops=["ca_roule", "quilicot", "mec"],
        surface_note="The Chambly Canal path is a mix of asphalt and fine gravel. OpenStreetMap has no mapped path for about 4 mi in the middle, so the GPX uses Rue Jean-Talon (Route 223) right beside the canal there; if the towpath is open on the ground, ride it. After that it's bike paths and street bike lanes through Chambly, Saint-Hubert and Longueuil, then the Jacques-Cartier Bridge bike path.",
        bailout="Longueuil–Université-de-Sherbrooke Metro (Yellow Line) is on the route at mile {st_longueuil}; bikes are allowed outside weekday rush hours. Otherwise, use a taxi or van.",
        cue_notes={
            "Piste du Canal de Chambly": "Chambly Canal path along the canal (asphalt or fine gravel).",
            "Rue Jean-Talon": "GPX follows Route 223 beside the canal here because the path is unmapped in OpenStreetMap. If the towpath is open, ride it: it runs parallel.",
            "Avenue Bourgogne": "Chambly: Fort Chambly and the Boulangerie du Vieux-Chambly.",
            "Montée du Chemin-de-Chambly": "Separated bike path beside the road.",
            "Route verte 1": "Route Verte bike path into Longueuil.",
            "Pont Jacques-Cartier": "Jacques-Cartier Bridge bike path (open spring to late fall).",
            "Chemin du Tour-de-l'Isle": "Ramp down to Île Sainte-Hélène (Parc Jean-Drapeau).",
            "Pont de la Concorde": "Concorde Bridge to Cité du Havre.",
            "Rue de la Commune": "Old Port waterfront. Place Jacques-Cartier is just ahead.",
        },
        extra_cues=[("boulangerie_chambly", "lunch", "LUNCH", "Boulangerie du Vieux-Chambly, 2403 Av. Bourgogne", "Bakery and cafe right on the route.")]),
}

# 6-day finale and 5-day stages reuse the content above with overrides
STAGES["6D6"] = dict(STAGES["D6"], title="Plattsburgh, NY to Old Montréal, QC", short="Plattsburgh → Montréal",
    subtitle="US-9, NY-9B, border at US-11 / Route 223, Richelieu River, Chambly Canal, Jacques-Cartier Bridge, Old Port",
    waterway="Lake Champlain / Richelieu / St. Lawrence", rail="Amtrak (Rouses Point) & Montréal Metro",
    lunch="lakeside_rp", hotels=["monville", "fairmont"], shops=["cyclelm", "ca_roule", "quilicot"],
    surface_note=STAGES["D6"]["surface_note"] + " " + STAGES["D7"]["surface_note"],
    bailout=STAGES["D6"]["bailout"] + " Longueuil Metro is at mile {st_longueuil}.",
    cue_notes=dict(STAGES["D6"]["cue_notes"], **STAGES["D7"]["cue_notes"]),
    extra_cues=STAGES["D6"]["extra_cues"] + [("trinquette", "poi", "SNACK", "Saint-Jean waterfront (La Trinquette pub, 290 Rue Champlain)", "Pub-bistro; lunch hours not confirmed."),
                                            ("boulangerie_chambly", "poi", "SNACK", "Boulangerie du Vieux-Chambly", "Bakery on the route.")])
STAGES["5D1"] = dict(STAGES["D1"], title="NYC to Poughkeepsie, NY", short="NYC → Poughkeepsie",
    subtitle="Hudson River Greenway, Westchester & Putnam trails, Maybrook Trailway, Dutchess Rail Trail",
    hotels=["pok_grand", "hyatt_pok"], shops=["yorktown_cycles", "hopewell_depot"],
    surface_note="About 95% car-free paved trail; city streets in Inwood/Bronx and through Brewster village.",
    bailout="Metro-North Harlem Line at Brewster (mile {st_brewster}); Metro-North Hudson Line and Amtrak at Poughkeepsie (end). Metro-North bikes are not allowed on rush-hour trains.",
    cue_notes=dict(STAGES["D1"]["cue_notes"], **{"North Main Street": "Brewster: turn onto the Maybrook Trailway just ahead.", "Maybrook Trailway": "Maybrook Trailway: 24 mi to Hopewell Junction.", "Dutchess Rail Trail": "Dutchess Rail Trail, 13 mi to Poughkeepsie."}),
    extra_cues=STAGES["D1"]["extra_cues"][1:])
STAGES["5D2"] = dict(STAGES["D2"], title="Poughkeepsie to Troy, NY", short="Poughkeepsie → Troy",
    subtitle="NY-9G, Rhinebeck, Empire State Trail to Hudson, Albany-Hudson Electric Trail, Albany, Troy",
    hotels=["franklin_sq"], shops=["rhinebeck_bike", "steiners_hudson", "steiners_valatie"],
    surface_note="NY-9G shoulder, quiet county roads (Empire State Trail on-road section), then the paved AHET and Mohawk-Hudson trail, with city streets at both ends.",
    bailout="Amtrak at Rhinecliff (2 mi from Rhinebeck), Hudson (mile {st_hudson}) and Albany-Rensselaer (mile {st_albany}).",
    cue_notes=dict(STAGES["D2"]["cue_notes"], **STAGES["D3"]["cue_notes"]),
    extra_cues=STAGES["D2"]["extra_cues"], alt_note=None)
STAGES["5D3"] = dict(STAGES["D4"], title="Troy to Ticonderoga, NY", short="Troy → Ticonderoga",
    subtitle="Waterford, Old Champlain Canal Trail, US-4 through Stillwater & Schuylerville, canal towpaths, Whitehall, NY-22",
    bailout="Amtrak Adirondack at Fort Edward (mile {st_fted}), Whitehall and Ticonderoga. Carry-on bikes need a reservation.")
STAGES["VT1"] = dict(title="Ticonderoga, NY to Burlington, VT (via Essex ferry)", short="Ticonderoga → Burlington",
    subtitle="NY-9N/22 to Essex, Essex–Charlotte ferry, Lake Champlain Bikeways (Greenbush Rd, Spear St), Burlington Greenway",
    waterway="Lake Champlain", rail="Amtrak Ethan Allen Express (Burlington)",
    lunch="pinkpig", hotels=["hotel_vt", "courtyard_btv"], shops=["oldspokes", "northstar"],
    surface_note="NY-9N/22 shoulders to Essex; a ferry crossing; quiet Vermont roads (Lake Rd, Greenbush Rd, Spear St) with about 1.4 mi on US-7 through Shelburne village; then paved paths into Burlington.",
    bailout="Amtrak Adirondack at Port Henry (mile {st_porthenry}) before the ferry. In Burlington, Amtrak's Ethan Allen Express runs to NYC; check carry-on bike availability when booking.",
    cue_notes={"State Highway 9N": "NY-9N/22 north along the lake.", "South Main Street": "Port Henry: Stewart's #103 for food and water.",
               "Charlotte, VT - Essex, NY": "FERRY to Charlotte, VT: about 20 min crossing, $6.75 per cyclist. In the early-fall schedule, Essex departures run every 30 min 10:30 AM to 5:30 PM (hourly before and after).",
               "Lake Road": "Vermont: quiet Lake Champlain Bikeways roads.", "Spear Street": "Spear St north into South Burlington.",
               "Burlington Greenway": "Lakefront path into downtown Burlington."},
    extra_cues=[("stewarts_ph", "poi", "RESUPPLY", "Stewart's #103, Port Henry", "Reliable food and water."),
                ("pinkpig", "lunch", "LUNCH (call ahead)", "Pink Pig Cafe, Essex (by the ferry dock)", "Fall hours are limited.")])
STAGES["VT2"] = dict(title="Burlington, VT to Saint-Jean-sur-Richelieu, QC", short="Burlington → Saint-Jean",
    subtitle="Island Line Trail, Colchester Causeway, Local Motion bike ferry, Champlain Islands (US-2), Rouses Point, Route 223",
    waterway="Lake Champlain / Richelieu", rail="Amtrak Adirondack (Rouses Point)",
    lunch="heros", hotels=["quality_sj", "auberge_harris"], shops=["cyclelm"],
    surface_note="Paved Island Line path; about 3 mi of crushed-stone causeway; a short bike ferry; then US-2 shoulders through the islands and flat Route 223 in Quebec.",
    bailout="Amtrak Adirondack at Rouses Point (mile {st_rouses}); southbound departs 2:15 PM, with no Monday service north of Saratoga.",
    cue_notes={"Colchester Causeway": "Causeway into the lake: crushed stone, 3 mi.",
               "Local Motion Bike Ferry": "BIKE FERRY across the Cut. 2026 fall schedule: Fri 10 AM to 5 PM, Sat and Sun 10 AM to 6 PM, through Mon Oct 12 (Indigenous Peoples' Day), last day of the season. Suggested donation $5 one way. If it isn't running, use the Sandbar bypass (see stage notes).",
               "U.S. Route 2": "US-2 north through the Champlain Islands.", "Rouses Point Bridge": "US-2 bridge back into New York (Rouses Point).",
               "US 11": "US-11 north to the border.", "Route 223": "CANADA. Route 223 north along the Richelieu."},
    extra_cues=[("heros", "lunch", "LUNCH", "Hero's Welcome, North Hero", "General store, deli and bakery on the lake."),
                ("border223", "border", "BORDER", "Rouses Point–Lacolle 223 crossing", "Open 8 AM to 8 PM daily on both sides (not 24 hours). Car booth; passport, EDL or NEXUS.")])

# ---------------------------------------------------------------------------
# Itineraries
# ---------------------------------------------------------------------------
ITINERARIES = {
    "7day": dict(title="7-Day Tour (Sunday to Saturday)", code="7D", color="#e11d48",
        stages=[("D1", "Sunday", "Oct 4"), ("D2", "Monday", "Oct 5"), ("D3", "Tuesday", "Oct 6"), ("D4", "Wednesday", "Oct 7"),
                ("D5", "Thursday", "Oct 8"), ("D6", "Friday", "Oct 9"), ("D7", "Saturday", "Oct 10")],
        pace="Comfortable touring (11 to 13 mph rolling)",
        blurb="Recommended. The border day and the Montréal arrival are split, so the last two days are short and flat."),
    "6day": dict(title="6-Day Tour (Sunday to Friday)", code="6D", color="#0039A6",
        stages=[("D1", "Sunday", "Oct 4"), ("D2", "Monday", "Oct 5"), ("D3", "Tuesday", "Oct 6"), ("D4", "Wednesday", "Oct 7"),
                ("D5", "Thursday", "Oct 8"), ("6D6", "Friday", "Oct 9")],
        pace="Steady touring (12 to 14 mph rolling)",
        blurb="Same as the 7-day tour through Plattsburgh, then one long flat day (with the border crossing) all the way to Montréal."),
    "5day": dict(title="5-Day Fast Tour", code="5D", color="#d97706",
        stages=[("5D1", "Sunday", "Oct 4"), ("5D2", "Monday", "Oct 5"), ("5D3", "Tuesday", "Oct 6"), ("D5", "Wednesday", "Oct 7"), ("6D6", "Thursday", "Oct 8")],
        pace="Fast (14 to 17 mph rolling); strong riders on light bikes only",
        blurb="Three days over 90 miles. In October daylight this leaves almost no margin for mechanicals, headwinds or getting lost."),
}

VERMONT = dict(title="Vermont Champlain Islands Variant", replaces="Days 5 and 6 of the 7-day tour (Thu Oct 8 and Fri Oct 9)",
    stages=[("VT1", "Thursday", "Oct 8"), ("VT2", "Friday", "Oct 9")],
    note="Designed for the 7-day tour: the Local Motion bike ferry runs only Fri to Sun (plus Mon Oct 12), so the island day must fall on Fri Oct 9. On the 6-day plan this variant would make the last day about 111 mi. On the 5-day plan the island day would be a Thursday, when the bike ferry doesn't run.",
    bypass="From Burlington, go north through Winooski and Colchester on US-2/US-7 (a busy 4-lane road for about 5.6 mi), then take US-2 west over the Sandbar causeway to South Hero. That's {bypass_mi} mi to South Hero, versus about 14.6 mi via the causeway (about +5 mi, not the +14 mi in earlier drafts).")

PUSH_OPTIONS_5DAY = {
    "5D1": "Push to Kingston: from the DoubleTree, cross the Walkway Over the Hudson and ride north on the west bank to Kingston (+22 mi, about 125 mi total). Earlier drafts said the Walkway-to-Kingston leg was 30 mi (via the Wallkill Valley Rail Trail it is); via Route 9W/HVRT it's about 16 to 20 mi.",
    "5D2": "Push to Saratoga Springs: from Troy, go via Waterford and the Zim Smith Trail (about +34 mi, about 130 mi total). Not realistic in October daylight.",
    "5D3": "Push to Essex: Ticonderoga to Essex is 38 mi (about 131 mi total). Earlier drafts said +18 mi; that was wrong.",
    "D5": "Push to Saint-Jean-sur-Richelieu: Plattsburgh to Saint-Jean is 53 mi, including the border (about 126 mi total). Not recommended.",
}
