// Linear Route Diagram / Strip Map Module for NYC to Montreal Bike Tour
// Inspired by transit corridor strip maps (narrow terrain corridor, single bold black line, all turns prioritized)

const STRIP_MAP_ITINERARIES = {
  '6day': {
    id: '6day',
    code: '6D',
    color: '#0039A6',
    title: '6-Day Classic Expedition',
    subtitle: 'Corridor Strip Map: NYC (Battery Park) ➔ Hudson Valley ➔ Lake Champlain ➔ Montréal',
    schedule: 'Sun Oct 4 ➔ Fri Oct 9 (6 Days)',
    totalMiles: '445.0',
    totalKm: '716.2',
    elevationGain: '+14,500 ft',
    avgDaily: '74.2 mi/day',
    stages: [
      {
        stageNum: 1,
        dayOfWeek: 'Sunday',
        dateStr: 'Oct 4',
        name: 'NYC (Battery Park) to Brewster / Carmel, NY',
        distanceMiles: 60.0,
        elevationFt: 2000,
        waterway: 'Hudson River Corridor',
        railLine: 'Metro-North Hudson & Harlem Lines',
        surfaceSummary: 'Hudson River Greenway, Bronx Links, South & North County Trailways, Putnam Trailway',
        overnight: "Heidi's Inn / Comfort Inn Brewster (Mile 60.0)",
        elevProfile: [
          { mile: 0, elev: 10, label: 'Battery Park' },
          { mile: 14, elev: 25, label: 'Broadway Bridge' },
          { mile: 28, elev: 220, label: 'Elmsford' },
          { mile: 38, elev: 480, label: 'Yorktown (Lunch)' },
          { mile: 54, elev: 650, label: 'Mahopac Summit' },
          { mile: 60, elev: 460, label: 'Brewster' }
        ],
        cues: [
          { mile: 0.0, dist: 5.2, icon: '⬆', turnDir: 'straight', road: 'Battery Park (South Ferry)', action: 'DEPART NORTH', surface: 'Paved Greenway', detail: 'Enter dedicated Hudson River Greenway. Stay right on bike path along waterfront.', landmark: 'Statue of Liberty & NY Harbor', corridorSide: 'west' },
          { mile: 5.2, dist: 6.3, icon: '⬆', turnDir: 'straight', road: 'Hudson River Greenway', action: 'CONTINUE STRAIGHT', surface: 'Paved Greenway', detail: 'Pass Chelsea Piers, Intrepid Museum, and Midtown ferry terminals.', landmark: 'Midtown Cruise Terminal', corridorSide: 'west' },
          { mile: 11.5, dist: 1.7, icon: '⬆', turnDir: 'straight', road: 'Fort Washington Park', action: 'PASS UNDER GWB', surface: 'Paved Greenway', detail: 'Pass beneath George Washington Bridge and Little Red Lighthouse. Winding switchback.', landmark: 'George Washington Bridge', corridorSide: 'west' },
          { mile: 13.2, dist: 0.3, icon: '↱', turnDir: 'right', road: 'Dyckman Street', action: 'TURN RIGHT', surface: 'City Bike Lane', detail: 'Exit Hudson greenway onto Dyckman St heading east into Inwood.', landmark: 'Inwood Station (A Train)', corridorSide: 'east' },
          { mile: 13.5, dist: 0.7, icon: '↰', turnDir: 'left', action: 'TURN LEFT', road: 'Broadway (US-9 North)', surface: 'City Street', detail: 'Head north on Broadway under elevated 1-train tracks. Stay alert in traffic.', landmark: '1-Train Elevated Line', corridorSide: 'east' },
          { mile: 14.2, dist: 0.8, icon: '⬆', turnDir: 'straight', action: 'CROSS BRIDGE', road: 'Broadway Bridge', surface: 'Bridge Path', detail: 'Cross Harlem River Ship Canal into Marble Hill and The Bronx.', landmark: 'Harlem River Ship Canal', corridorSide: 'east' },
          { mile: 15.0, dist: 0.6, icon: '↱', turnDir: 'right', action: 'TURN RIGHT', road: 'Van Cortlandt Park South', surface: 'Dedicated Bike Lane', detail: 'Follow bike lane east past the Parade Ground toward park entrance.', landmark: 'Van Cortlandt Park Parade Ground', corridorSide: 'east' },
          { mile: 15.6, dist: 0.6, icon: '↰', turnDir: 'left', action: 'TURN LEFT', road: 'Bailey Ave / Old Putnam Trail', surface: 'Park Path', detail: 'Enter park pathway and head north toward Westchester County line.', landmark: 'Old Putnam Division Railbed', corridorSide: 'east' },
          { mile: 16.2, dist: 10.6, icon: '⬆', turnDir: 'straight', action: 'ENTER TRAILWAY', road: 'South County Trailway', surface: 'Paved Rail Trail', detail: 'Cross into Westchester County. Completely car-free paved rail trail begins.', landmark: 'Westchester County Line', corridorSide: 'center' },
          { mile: 26.8, dist: 2.7, icon: '⬆', turnDir: 'straight', action: 'CONTINUE STRAIGHT', road: 'South County Trailway (Elmsford)', surface: 'Paved Rail Trail', detail: 'Pass former New York Central Railroad depots in Ardsley and Elmsford.', landmark: 'Historic Elmsford Depot', corridorSide: 'center' },
          { mile: 29.5, dist: 8.7, icon: '⬆', turnDir: 'straight', action: 'TRANSITION', road: 'North County Trailway', surface: 'Paved Rail Trail', detail: 'Seamless transition at Eastview / Route 100C. Shaded, smooth asphalt.', landmark: 'Pocantico River Wetlands', corridorSide: 'center' },
          { mile: 38.2, dist: 10.2, icon: '🥪', turnDir: 'lunch', action: 'LUNCH STOP', road: 'Yorktown Heights Depot', surface: 'Paved Rail Trail', detail: 'Trailside Cafe (1807 Commerce St). Smoothies, paninis, outdoor tables on trail.', landmark: 'Trailside Cafe • Yorktown Cycles', corridorSide: 'center' },
          { mile: 48.4, dist: 5.6, icon: '⬆', turnDir: 'straight', action: 'TRANSITION', road: 'Putnam County Trailway', surface: 'Paved Rail Trail', detail: 'Enter Putnam County at Baldwin Place. Scenic winding railbed.', landmark: 'Putnam County Line', corridorSide: 'center' },
          { mile: 54.0, dist: 6.0, icon: '⬆', turnDir: 'straight', action: 'CONTINUE STRAIGHT', road: 'Lake Mahopac Trailway', surface: 'Paved Rail Trail', detail: 'Ride alongside Lake Mahopac shoreline through peaceful woods.', landmark: 'Lake Mahopac Shoreline', corridorSide: 'west' },
          { mile: 60.0, dist: 0.0, icon: '🚏', turnDir: 'terminus', action: 'ARRIVE TERMINUS', road: 'Brewster / Carmel, NY', surface: 'Town Street', detail: "Exit trailway to Heidi's Inn or Comfort Inn Brewster. Metro-North Brewster nearby.", landmark: "Heidi's Inn • Ⓜ️ Metro-North Harlem Line", corridorSide: 'center' }
        ]
      },
      {
        stageNum: 2,
        dayOfWeek: 'Monday',
        dateStr: 'Oct 5',
        name: 'Brewster to Hudson, NY',
        distanceMiles: 78.0,
        elevationFt: 3000,
        waterway: 'Hudson River (East Bank)',
        railLine: 'Metro-North Hudson Line & Amtrak Empire Service',
        surfaceSummary: 'Maybrook Trailway, Dutchess Rail Trail, Route 9G & Scenic River Road',
        overnight: 'The Barlow Hotel / The Wick Hudson (Mile 138.0)',
        elevProfile: [
          { mile: 60, elev: 460, label: 'Brewster' },
          { mile: 72, elev: 520, label: 'Stormville' },
          { mile: 81, elev: 310, label: 'Hopewell Jct' },
          { mile: 94, elev: 180, label: 'Poughkeepsie' },
          { mile: 112, elev: 220, label: 'Rhinebeck (Lunch)' },
          { mile: 125, elev: 350, label: 'Germantown Bluffs' },
          { mile: 138, elev: 120, label: 'Hudson' }
        ],
        cues: [
          { mile: 60.0, dist: 12.5, icon: '⬆', turnDir: 'straight', road: 'Maybrook Trailway', action: 'DEPART WEST', surface: 'Paved Rail Trail', detail: 'Pick up Maybrook Trailway heading west through Putnam and Dutchess woods.', landmark: 'Maybrook Railbed', corridorSide: 'center' },
          { mile: 72.5, dist: 8.5, icon: '⬆', turnDir: 'straight', road: 'Maybrook Trailway (Stormville)', action: 'CONTINUE WEST', surface: 'Paved Rail Trail', detail: 'Pass Stormville Airport and Appalachian Trail crossing.', landmark: 'Appalachian Trail Cross', corridorSide: 'center' },
          { mile: 81.0, dist: 12.0, icon: '⬆', turnDir: 'straight', road: 'Dutchess Rail Trail (Hopewell Jct)', action: 'MERGE NORTHWEST', surface: 'Paved Rail Trail', detail: 'Join Dutchess Rail Trail at historic Hopewell Depot. Bikeway shop at Mile 81.', landmark: 'Bikeway Shop (Hopewell)', corridorSide: 'center' },
          { mile: 93.0, dist: 1.5, icon: '🌊', turnDir: 'poi', road: 'Walkway Over the Hudson', action: 'SCENIC OPTION', surface: 'Pedestrian Deck', detail: 'Optional +2 mi out-and-back across bridge 212 ft above Hudson River. Spectacular views!', landmark: 'Walkway Over the Hudson', corridorSide: 'west' },
          { mile: 94.5, dist: 0.7, icon: '↱', turnDir: 'right', road: 'Buckingham Ave / Parker Ave', action: 'TURN RIGHT', surface: 'Town Street', detail: 'Exit rail trail in Poughkeepsie toward east-bank highways.', landmark: 'Poughkeepsie Gateway', corridorSide: 'east' },
          { mile: 95.2, dist: 5.8, icon: '↰', turnDir: 'left', road: 'Route 9G North (Violet Ave)', action: 'TURN LEFT', surface: 'Highway Shoulder', detail: 'Head north on Route 9G. Wide paved shoulders, rolling terrain.', landmark: 'Route 9G East Bank Trunk', corridorSide: 'east' },
          { mile: 101.0, dist: 11.0, icon: '⬆', turnDir: 'straight', road: 'Hyde Park (Route 9G)', action: 'PASS THROUGH', surface: 'Highway Shoulder', detail: 'Pass east of Roosevelt and Vanderbilt National Historic Sites.', landmark: 'Historic Hyde Park', corridorSide: 'east' },
          { mile: 112.0, dist: 5.5, icon: '🥪', turnDir: 'lunch', road: 'Historic Rhinebeck (Market St)', action: 'LUNCH STOP', surface: 'Village Center', detail: 'Rhinebeck Bagel / Market St Cafes. Rhinebeck Bicycle Shop on Montgomery St.', landmark: 'Rhinebeck • 🚆 Amtrak Rhinecliff (2 mi W)', corridorSide: 'west' },
          { mile: 117.5, dist: 6.5, icon: '↰', turnDir: 'bear-left', road: 'River Road', action: 'BEAR LEFT', surface: 'Scenic Country Road', detail: 'Low-traffic, tree-canopied scenic country road hugging Hudson River bluffs.', landmark: 'Hudson River Bluffs & Estates', corridorSide: 'west' },
          { mile: 124.0, dist: 14.0, icon: '↱', turnDir: 'right', road: 'Route 9G North (Clermont/Germantown)', action: 'TURN RIGHT', surface: 'Highway Shoulder', detail: 'Rejoin Route 9G past Clermont State Historic Site and local apple orchards.', landmark: 'Clermont & Germantown Orchards', corridorSide: 'east' },
          { mile: 138.0, dist: 0.0, icon: '🚏', turnDir: 'terminus', road: 'Hudson, NY (Warren Street)', action: 'ARRIVE TERMINUS', surface: 'City Street', detail: 'Turn left onto Warren St. Overnight at The Barlow Hotel or The Wick. Dinner on Warren St.', landmark: 'The Barlow Hotel • 🚆 Amtrak Hudson', corridorSide: 'west' }
        ]
      },
      {
        stageNum: 3,
        dayOfWeek: 'Tuesday',
        dateStr: 'Oct 6',
        name: 'Hudson to Saratoga Springs, NY',
        distanceMiles: 75.0,
        elevationFt: 2000,
        waterway: 'Hudson & Mohawk Rivers, Champlain Canal',
        railLine: 'Amtrak Empire Service & Adirondack',
        surfaceSummary: 'Albany-Hudson Electric Trail (AHET), Mohawk-Hudson Path, Zim Smith Trail',
        overnight: 'The Saratoga Hilton / Holiday Inn Saratoga (Mile 213.0)',
        elevProfile: [
          { mile: 138, elev: 120, label: 'Hudson' },
          { mile: 155, elev: 280, label: 'Kinderhook' },
          { mile: 174, elev: 60, label: 'Rensselaer' },
          { mile: 182, elev: 40, label: 'Waterford Lock 2' },
          { mile: 195, elev: 220, label: 'Round Lake' },
          { mile: 213, elev: 310, label: 'Saratoga Springs' }
        ],
        cues: [
          { mile: 138.0, dist: 9.0, icon: '⬆', turnDir: 'straight', road: 'Albany-Hudson Electric Trail (AHET)', action: 'DEPART NORTH', surface: 'Paved Rail Trail', detail: 'Pick up paved AHET trailway at 3rd & Mill St in Hudson heading north.', landmark: 'AHET Southern Terminus', corridorSide: 'center' },
          { mile: 147.0, dist: 12.0, icon: '⬆', turnDir: 'straight', road: 'Kinderhook (AHET)', action: 'PASS THROUGH', surface: 'Paved Rail Trail', detail: 'Cruise through historic Dutch hamlet. 100% car-free trail.', landmark: 'Martin Van Buren Historic Area', corridorSide: 'center' },
          { mile: 159.0, dist: 15.0, icon: '⬆', turnDir: 'straight', road: 'Niverville & Kinderhook Lake', action: 'CONTINUE NORTH', surface: 'Paved Rail Trail', detail: 'Trail follows shoreline of Kinderhook Lake and pine forests.', landmark: 'Kinderhook Lake Shoreline', corridorSide: 'center' },
          { mile: 174.0, dist: 1.5, icon: '⬆', turnDir: 'straight', road: 'Rensselaer Northern Terminus', action: 'TRANSITION', surface: 'City Trail Link', detail: 'AHET ends in Rensselaer across from Albany skyline.', landmark: '🚆 Amtrak Albany-Rensselaer Station', corridorSide: 'east' },
          { mile: 175.5, dist: 1.0, icon: '↰', turnDir: 'left', road: 'Dunn Memorial Bridge Bike Path', action: 'CROSS BRIDGE', surface: 'Bridge Path', detail: 'Cross Hudson River on protected multi-use path into downtown Albany.', landmark: 'Hudson River Crossing into Albany', corridorSide: 'west' },
          { mile: 176.5, dist: 5.5, icon: '↱', turnDir: 'right', road: 'Mohawk-Hudson Bike-Hike Trail', action: 'TURN RIGHT', surface: 'Paved Greenway', detail: 'Pick up paved riverfront greenway at Corning Preserve heading north.', landmark: 'Corning Preserve Waterfront', corridorSide: 'west' },
          { mile: 182.0, dist: 3.0, icon: '🥪', turnDir: 'lunch', road: 'Troy Waterfront / Waterford Lock 2', action: 'LUNCH STOP', surface: 'Canal Harbor', detail: 'Cross into Troy / Waterford. Lunch at Placid Baker / lockside park.', landmark: 'Waterford Lock 2 • Canal Confluence', corridorSide: 'west' },
          { mile: 185.0, dist: 10.0, icon: '↰', turnDir: 'left', road: 'Zim Smith Trail (Cohoes/Waterford)', action: 'TURN LEFT', surface: 'Paved Rail Trail', detail: 'Join paved Zim Smith Trail heading northwest toward Saratoga County.', landmark: 'Zim Smith Trailway Gate', corridorSide: 'center' },
          { mile: 195.0, dist: 7.0, icon: '⬆', turnDir: 'straight', road: 'Round Lake Village', action: 'PASS THROUGH', surface: 'Paved Rail Trail', detail: 'Paved trail skirts Round Lake and historic Victorian village.', landmark: 'Round Lake Victorian Village', corridorSide: 'center' },
          { mile: 202.0, dist: 5.0, icon: '↱', turnDir: 'bear-right', road: 'Eastline Road / Route 50 (Ballston Spa)', action: 'BEAR RIGHT', surface: 'Paved Shoulder', detail: 'Zim Smith Trail ends; follow wide paved shoulder/bike lane north toward Saratoga.', landmark: 'Ballston Spa Mineral Springs', corridorSide: 'center' },
          { mile: 207.0, dist: 6.0, icon: '↰', turnDir: 'left', road: 'Broadway (Route 9 North)', action: 'TURN LEFT', surface: 'City Boulevard', detail: 'Ride Broadway past Saratoga Spa State Park into downtown.', landmark: 'Saratoga Spa State Park', corridorSide: 'center' },
          { mile: 213.0, dist: 0.0, icon: '🚏', turnDir: 'terminus', road: 'Saratoga Springs, NY (Broadway)', action: 'ARRIVE TERMINUS', surface: 'City Street', detail: 'Arrive at The Saratoga Hilton. Broadway dining, natural mineral springs.', landmark: 'The Saratoga Hilton • 🚆 Amtrak', corridorSide: 'center' }
        ]
      },
      {
        stageNum: 4,
        dayOfWeek: 'Wednesday',
        dateStr: 'Oct 7',
        name: 'Saratoga Springs to Ticonderoga, NY',
        distanceMiles: 75.0,
        elevationFt: 2500,
        waterway: 'Champlain Canal & Southern Lake Champlain',
        railLine: 'Amtrak Adirondack Corridor',
        surfaceSummary: 'NY-29, Champlain Canalway Trail, US-4, NY-22 (Skips Whitehall lodging)',
        overnight: 'Best Western Plus Ticonderoga (Mile 288.0)',
        elevProfile: [
          { mile: 213, elev: 310, label: 'Saratoga' },
          { mile: 224, elev: 140, label: 'Schuylerville' },
          { mile: 245, elev: 150, label: 'Fort Ann' },
          { mile: 257, elev: 120, label: 'Whitehall Lock 12' },
          { mile: 270, elev: 480, label: 'South Bay Ridge' },
          { mile: 288, elev: 220, label: 'Ticonderoga' }
        ],
        cues: [
          { mile: 213.0, dist: 11.0, icon: '⬆', turnDir: 'straight', road: 'NY-29 East (Lake Ave)', action: 'DEPART EAST', surface: 'Road Shoulder', detail: 'Head east out of Saratoga Springs through rolling farmland toward Schuylerville.', landmark: 'Saratoga Battlefield Area', corridorSide: 'center' },
          { mile: 224.0, dist: 12.0, icon: '↰', turnDir: 'left', road: 'US-4 North / Champlain Canalway', action: 'TURN LEFT', surface: 'Canal Road / Path', detail: 'Join Champlain Canalway corridor heading north in historic Schuylerville.', landmark: 'Champlain Canal Lock 5', corridorSide: 'west' },
          { mile: 236.0, dist: 9.0, icon: '⬆', turnDir: 'straight', road: 'Fort Edward (US-4 / Canalway)', action: 'CONTINUE NORTH', surface: 'Paved Highway Shoulder', detail: 'Follow canal corridor past Fort Edward locks and Champlain Canal trail.', landmark: '🚆 Amtrak Fort Edward Station', corridorSide: 'west' },
          { mile: 245.0, dist: 12.0, icon: '⬆', turnDir: 'straight', road: 'Fort Ann (US-4 North)', action: 'PASS THROUGH', surface: 'Paved Highway Shoulder', detail: 'Wide paved shoulder on US-4. Historic canal locks line the highway.', landmark: "Walker's Hardware (Spares)", corridorSide: 'west' },
          { mile: 257.0, dist: 1.0, icon: '🥪', turnDir: 'lunch', road: 'Whitehall Lock 12 (Historic Grounds)', action: 'LUNCH STOP', surface: 'Canal Harbor', detail: 'Historic Grounds Restaurant & Coffee Bar (142 Main St). Full resupply before NY-22!', landmark: 'Lock 12 Whitehall • US Navy Birthplace', corridorSide: 'west' },
          { mile: 258.0, dist: 12.0, icon: '↰', turnDir: 'left', road: 'NY-22 North', action: 'TURN LEFT', surface: 'Highway Shoulder', detail: 'Climb out of Whitehall onto NY-22 North. (Skips weak Whitehall lodging directly to Ticonderoga).', landmark: '⚠️ Steep Climb out of Whitehall', corridorSide: 'east' },
          { mile: 270.0, dist: 12.0, icon: '⬆', turnDir: 'straight', road: 'NY-22 North (South Bay)', action: 'CONTINUE NORTH', surface: 'Highway Shoulder', detail: 'Rolling hills flanking South Bay of Lake Champlain and southern Adirondacks.', landmark: 'South Bay Lake Champlain', corridorSide: 'east' },
          { mile: 282.0, dist: 6.0, icon: '↱', turnDir: 'bear-right', road: 'NY-22 / NY-73 Junction', action: 'BEAR RIGHT', surface: 'Highway Shoulder', detail: 'Follow signs toward Fort Ticonderoga and town center.', landmark: 'Approaching Fort Ticonderoga', corridorSide: 'east' },
          { mile: 288.0, dist: 0.0, icon: '🚏', turnDir: 'terminus', road: 'Ticonderoga, NY (Burgoyne Rd)', action: 'ARRIVE TERMINUS', surface: 'Town Street', detail: 'Best Western Plus Ticonderoga (260 Burgoyne Rd). Full-service lodging, restaurant.', landmark: 'Best Western Plus • 🚆 Amtrak', corridorSide: 'center' }
        ]
      },
      {
        stageNum: 5,
        dayOfWeek: 'Thursday',
        dateStr: 'Oct 8',
        name: 'Ticonderoga to Plattsburgh, NY (Queen Stage)',
        distanceMiles: 70.0,
        elevationFt: 4000,
        waterway: 'Lake Champlain (Adirondack Coast)',
        railLine: 'Amtrak Adirondack Corridor',
        surfaceSummary: 'NY-9N / NY-22 Adirondack Coastline, US-9 Shoreline',
        overnight: 'Best Western Plus Plattsburgh / Comfort Inn (Mile 358.0)',
        elevProfile: [
          { mile: 288, elev: 220, label: 'Ticonderoga' },
          { mile: 306, elev: 150, label: 'Port Henry' },
          { mile: 316, elev: 240, label: 'Westport' },
          { mile: 326, elev: 120, label: 'Essex (Ferry)' },
          { mile: 338, elev: 680, label: 'Willsboro Summit' },
          { mile: 346, elev: 280, label: 'Ausable Chasm' },
          { mile: 358, elev: 130, label: 'Plattsburgh' }
        ],
        cues: [
          { mile: 288.0, dist: 9.0, icon: '⬆', turnDir: 'straight', road: 'NY-9N / NY-22 North', action: 'DEPART NORTH', surface: 'Highway Shoulder', detail: 'Rolling highway bluffs with panoramic views east across Lake Champlain to Vermont.', landmark: 'Lake Champlain Coastal Bluffs', corridorSide: 'east' },
          { mile: 297.0, dist: 9.0, icon: '⬆', turnDir: 'straight', road: 'Crown Point Historic Site', action: 'PASS THROUGH', surface: 'Highway Shoulder', detail: 'Pass Crown Point fortress ruins and the Lake Champlain Bridge to Vermont.', landmark: 'Crown Point Bridge to Vermont', corridorSide: 'east' },
          { mile: 306.0, dist: 10.0, icon: '⬆', turnDir: 'straight', road: 'Port Henry (Coastal Bluffs)', action: 'PASS THROUGH', surface: 'Highway Shoulder', detail: 'Historic iron-mining harbor. Fill all water bottles: 20-mile supply gap to Keeseville!', landmark: '💧 Mandatory Water Refill Point', corridorSide: 'east' },
          { mile: 316.0, dist: 10.0, icon: '⬆', turnDir: 'straight', road: 'Westport Harbor', action: 'PASS THROUGH', surface: 'Highway Shoulder', detail: 'Scenic Victorian lakeside village overlooking Green Mountains.', landmark: '🚆 Amtrak Westport Station', corridorSide: 'east' },
          { mile: 326.0, dist: 12.0, icon: '🥪', turnDir: 'lunch', road: 'Historic Essex, NY (Ferry Dock)', action: 'LUNCH STOP', surface: 'Harbor Village', detail: 'The Cup Cafe / Essex Ice Cream Cafe. Porch dining overlooking ferry to Charlotte, VT.', landmark: 'The Cup Cafe • ⛴️ Ferry to VT Slip', corridorSide: 'east' },
          { mile: 338.0, dist: 8.0, icon: '⬆', turnDir: 'straight', road: 'Willsboro & Keeseville', action: 'CONTINUE NORTH', surface: 'Highway Shoulder', detail: 'Punchy inland climbs over pine-forested ridges. Steepest grades of the tour.', landmark: 'Adirondack Pine Ridge Summit', corridorSide: 'west' },
          { mile: 346.0, dist: 4.0, icon: '🌊', turnDir: 'poi', road: 'Ausable Chasm Bridge', action: 'CROSS GORGE', surface: 'Bridge Shoulder', detail: 'Cross steel arch bridge directly over the deep sandstone canyon of Ausable Chasm.', landmark: 'Ausable Chasm Canyon & Falls', corridorSide: 'center' },
          { mile: 350.0, dist: 8.0, icon: '↱', turnDir: 'right', road: 'US-9 North (Lakeshore Rd)', action: 'TURN RIGHT', surface: 'Highway Shoulder', detail: 'Head north along flat shoreline toward Plattsburgh.', landmark: 'Lake Champlain Shoreline Route', corridorSide: 'east' },
          { mile: 358.0, dist: 0.0, icon: '🚏', turnDir: 'terminus', road: 'Plattsburgh, NY', action: 'ARRIVE TERMINUS', surface: 'City Highway', detail: 'Best Western Plus Plattsburgh (446 NY-3). Secure indoor bike storage, hearty dinner.', landmark: 'Best Western Plus • 🔧 Maui North Bike', corridorSide: 'center' }
        ]
      },
      {
        stageNum: 6,
        dayOfWeek: 'Friday',
        dateStr: 'Oct 9',
        name: 'Plattsburgh, NY to Montréal, QC (Canada)',
        distanceMiles: 87.0,
        elevationFt: 1200,
        waterway: 'Lake Champlain, Richelieu River & St. Lawrence River',
        railLine: 'Amtrak to Rouses Point (Bike service ends at border)',
        surfaceSummary: 'US-9, Rouses Point, QC-223 Richelieu River, Chambly Canal Towpath, Route Verte 1',
        overnight: 'Hotel Monville / Old Montréal (Mile 445.0)',
        elevProfile: [
          { mile: 358, elev: 130, label: 'Plattsburgh' },
          { mile: 372, elev: 150, label: 'Chazy' },
          { mile: 382, elev: 110, label: 'Rouses Point' },
          { mile: 385, elev: 95, label: 'Customs (QC-223)' },
          { mile: 406, elev: 85, label: 'Saint-Jean' },
          { mile: 420, elev: 75, label: 'Chambly Locks' },
          { mile: 445, elev: 80, label: 'Montréal Old Port' }
        ],
        cues: [
          { mile: 358.0, dist: 14.0, icon: '⬆', turnDir: 'straight', road: 'US-9 North (Plattsburgh to Chazy)', action: 'DEPART NORTH', surface: 'Highway Shoulder', detail: 'Wide, flat paved shoulders through Lake Champlain agricultural flats.', landmark: 'Champlain Valley Farmland', corridorSide: 'center' },
          { mile: 372.0, dist: 10.0, icon: '⬆', turnDir: 'straight', road: 'US-9 North (Chazy to Rouses Point)', action: 'CONTINUE NORTH', surface: 'Highway Shoulder', detail: 'Pass Chazy Orchards and Lake Champlain shoreline.', landmark: 'Chazy Apple Orchards', corridorSide: 'center' },
          { mile: 382.0, dist: 2.5, icon: '⬆', turnDir: 'straight', road: 'Rouses Point, NY', action: 'PASS THROUGH', surface: 'Town Street', detail: 'Final town in the United States. Amtrak Adirondack carry-on bike service ENDS here!', landmark: '🚆 Amtrak Adirondack Bike End Point', corridorSide: 'east' },
          { mile: 384.5, dist: 0.5, icon: '🛂', turnDir: 'border', road: 'U.S. / Canada Border (Lacolle / QC-223)', action: 'BORDER CUSTOMS', surface: 'Border Facility', detail: 'Stop at vehicle inspection booth. Passports/EDL required! Zero cannabis! Roll bike through.', landmark: '🇨🇦 Canada Customs Clearance', corridorSide: 'center' },
          { mile: 385.0, dist: 21.0, icon: '⬆', turnDir: 'straight', road: 'QC-223 North (Route du Richelieu)', action: 'CONTINUE NORTH', surface: 'Quiet Rural Highway', detail: 'Serene, flat, picturesque riding directly along the Richelieu River.', landmark: 'Richelieu River Heritage Route', corridorSide: 'east' },
          { mile: 406.0, dist: 1.0, icon: '🥪', turnDir: 'lunch', road: 'Saint-Jean-sur-Richelieu, QC', action: 'LUNCH STOP', surface: 'Riverfront Street', detail: 'Bistro La Trinquette (155 Rue Richelieu). Lockside patio, crepes, cider, poutine.', landmark: 'Bistro La Trinquette • 🔧 Performance Bégin', corridorSide: 'east' },
          { mile: 407.0, dist: 13.0, icon: '⬆', turnDir: 'straight', road: 'Chambly Canal National Historic Towpath', action: 'ENTER TOWPATH', surface: 'Car-Free Canal Towpath', detail: '20 km (12.5 miles) of continuous, car-free flat towpath along canal locks.', landmark: 'Chambly Canal National Historic Site', corridorSide: 'center' },
          { mile: 420.0, dist: 8.0, icon: '⬆', turnDir: 'straight', road: 'Fort Chambly National Historic Site', action: 'PASS FORTRESS', surface: 'Paved Park Path', detail: 'Pass massive 1711 stone French military fortress at foot of Richelieu rapids.', landmark: 'Fort Chambly French Fortress', corridorSide: 'center' },
          { mile: 428.0, dist: 10.0, icon: '↰', turnDir: 'left', road: 'Route Verte 1 (Longueuil / Saint-Lambert)', action: 'JOIN GREENWAY', surface: 'Paved Cycle Track', detail: 'Follow signed paved cycle path network through Saint-Lambert toward St. Lawrence River.', landmark: 'Route Verte 1 Cycleway', corridorSide: 'west' },
          { mile: 438.0, dist: 5.0, icon: '↱', turnDir: 'right', road: 'Jacques-Cartier Bridge (or Concorde)', action: 'CROSS ST. LAWRENCE', surface: 'Bridge Cycle Track', detail: 'Cross dramatic dedicated bridge cycle track with jaw-dropping Montréal skyline vistas.', landmark: 'St. Lawrence River & Skyline', corridorSide: 'center' },
          { mile: 443.0, dist: 2.0, icon: '⬆', turnDir: 'straight', road: 'Old Port Promenade / Rue de la Commune', action: 'ENTER OLD PORT', surface: 'Cobblestone / Path', detail: 'Ride past historic stone clocktower, quays, and cobblestone avenues.', landmark: 'Quais du Vieux-Port de Montréal', corridorSide: 'west' },
          { mile: 445.0, dist: 0.0, icon: '🏁', turnDir: 'finish', road: 'Place Jacques-Cartier, Old Montréal', action: 'TOUR VICTORY', surface: 'Historic Cobblestone', detail: 'Tour Complete! Celebrate at Place Jacques-Cartier. Overnight at Hotel Monville.', landmark: '🎉 TOUR FINISH: Place Jacques-Cartier', corridorSide: 'center' }
        ]
      }
    ]
  },

  '5day': {
    id: '5day',
    code: '5D',
    color: '#D97706',
    title: '5-Day Fast Tour Express',
    subtitle: 'Corridor Strip Map: NYC ➔ Poughkeepsie ➔ Troy ➔ Ticonderoga ➔ Plattsburgh ➔ Montréal',
    schedule: 'Sun Oct 4 ➔ Thu Oct 8 (5 Days)',
    totalMiles: '425.0',
    totalKm: '684.0',
    elevationGain: '+13,000 ft',
    avgDaily: '85.0 mi/day',
    stages: [
      {
        stageNum: 1,
        dayOfWeek: 'Sunday',
        dateStr: 'Oct 4',
        name: 'NYC to Poughkeepsie, NY (High-Tempo Century Opener)',
        distanceMiles: 95.0,
        elevationFt: 3000,
        waterway: 'Hudson River Corridor',
        railLine: 'Metro-North Harlem & Hudson Lines',
        surfaceSummary: 'Hudson River Greenway, South/North County Trailways, Maybrook & Dutchess Rail Trails',
        overnight: 'Poughkeepsie Grand Hotel / DoubleTree (Mile 95.0)',
        elevProfile: [
          { mile: 0, elev: 10, label: 'Battery Park' },
          { mile: 38, elev: 480, label: 'Yorktown' },
          { mile: 60, elev: 460, label: 'Brewster' },
          { mile: 81, elev: 310, label: 'Hopewell Jct' },
          { mile: 95, elev: 180, label: 'Poughkeepsie' }
        ],
        cues: [
          { mile: 0.0, dist: 13.2, icon: '⬆', turnDir: 'straight', road: 'Hudson River Greenway', action: 'DEPART NORTH', surface: 'Paved Greenway', detail: 'Full-length Hudson River Greenway sprint past George Washington Bridge.', landmark: 'Battery Park to GWB', corridorSide: 'west' },
          { mile: 13.2, dist: 3.0, icon: '↱', turnDir: 'right', road: 'Dyckman to Broadway & Bronx', action: 'TURN RIGHT', surface: 'City Streets', detail: 'Cross Broadway Bridge and enter Van Cortlandt Park onto rail trail.', landmark: 'Harlem River Ship Canal', corridorSide: 'east' },
          { mile: 16.2, dist: 22.0, icon: '⬆', turnDir: 'straight', road: 'South & North County Trailways', action: 'SPRINT TRAILWAY', surface: 'Paved Rail Trail', detail: 'Fast paceline on continuous paved Westchester rail trails.', landmark: 'Westchester County Railbed', corridorSide: 'center' },
          { mile: 38.2, dist: 10.2, icon: '🥪', turnDir: 'lunch', road: 'Yorktown Heights Depot', action: 'LUNCH STOP', surface: 'Paved Rail Trail', detail: 'Trailside Cafe. Quick 25-minute nutrition stop on the rail trail.', landmark: 'Trailside Cafe • Yorktown', corridorSide: 'center' },
          { mile: 48.4, dist: 11.6, icon: '⬆', turnDir: 'straight', road: 'Putnam Trailway to Brewster', action: 'CONTINUE THROUGH', surface: 'Paved Rail Trail', detail: 'Baldwin Place through Mahopac to Brewster rail junction.', landmark: 'Lake Mahopac', corridorSide: 'center' },
          { mile: 60.0, dist: 21.0, icon: '⬆', turnDir: 'straight', road: 'Maybrook Trailway to Hopewell Jct', action: 'JOIN MAYBROOK', surface: 'Paved Rail Trail', detail: 'Fast, smooth paved rail corridor through Dutchess woods.', landmark: 'Maybrook Trailway Corridor', corridorSide: 'center' },
          { mile: 81.0, dist: 14.0, icon: '⬆', turnDir: 'straight', road: 'Dutchess Rail Trail into Poughkeepsie', action: 'MERGE DUTCHESS', surface: 'Paved Rail Trail', detail: 'Continuous paved trail right to Poughkeepsie city limits.', landmark: 'Dutchess Rail Trailway', corridorSide: 'center' },
          { mile: 95.0, dist: 0.0, icon: '🚏', turnDir: 'terminus', road: 'Poughkeepsie, NY', action: 'ARRIVE TERMINUS', surface: 'City Street', detail: 'Poughkeepsie Grand Hotel. ⚡ (Option to push to Kingston: 125 mi total).', landmark: 'Poughkeepsie • Ⓜ️ Metro-North Terminus', corridorSide: 'west' }
        ]
      },
      {
        stageNum: 2,
        dayOfWeek: 'Monday',
        dateStr: 'Oct 5',
        name: 'Poughkeepsie to Troy, NY (East-Bank Century Push)',
        distanceMiles: 85.0,
        elevationFt: 2500,
        waterway: 'Hudson River (East Bank)',
        railLine: 'Amtrak Empire Service Corridor',
        surfaceSummary: 'Route 9G, Scenic River Rd, Historic Hudson, 36-mile Paved AHET Trail',
        overnight: 'Best Western Plus Franklin Square Inn Troy (Mile 180.0)',
        elevProfile: [
          { mile: 95, elev: 180, label: 'Poughkeepsie' },
          { mile: 112, elev: 220, label: 'Rhinebeck' },
          { mile: 138, elev: 120, label: 'Hudson (Lunch)' },
          { mile: 165, elev: 250, label: 'AHET Summit' },
          { mile: 180, elev: 45, label: 'Troy' }
        ],
        cues: [
          { mile: 95.0, dist: 17.0, icon: '⬆', turnDir: 'straight', road: 'Route 9G North (Poughkeepsie to Rhinebeck)', action: 'DEPART NORTH', surface: 'Highway Shoulder', detail: 'Rolling hills with wide paved shoulders on east bank past Hyde Park.', landmark: 'Route 9G East Bank', corridorSide: 'east' },
          { mile: 112.0, dist: 26.0, icon: '⬆', turnDir: 'straight', road: 'River Rd & Route 9G to Hudson', action: 'CRUISE THROUGH', surface: 'Country Roads', detail: 'Rolling estate country and Germantown apple orchards.', landmark: 'Germantown Orchards', corridorSide: 'west' },
          { mile: 138.0, dist: 1.0, icon: '🥪', turnDir: 'lunch', road: 'Warren Street, Hudson, NY', action: 'LUNCH STOP', surface: 'City Street', detail: "Le Gamin Cafe / Tanzy's. Quick espresso and savory crepes.", landmark: 'Warren St • 🚆 Amtrak Hudson', corridorSide: 'west' },
          { mile: 139.0, dist: 36.0, icon: '⬆', turnDir: 'straight', road: 'Albany-Hudson Electric Trail (AHET)', action: 'HAMMER AHET', surface: 'Paved Rail Trail', detail: '36 continuous miles of paved off-road trailway to Rensselaer.', landmark: '⚡ 36-Mi High-Speed Trailway', corridorSide: 'center' },
          { mile: 175.0, dist: 5.0, icon: '⬆', turnDir: 'straight', road: 'Rensselaer into Downtown Troy', action: 'CROSS TO TROY', surface: 'City Bike Lanes', detail: 'Follow riverfront bike path directly across into historic Troy.', landmark: 'Troy Riverfront', corridorSide: 'east' },
          { mile: 180.0, dist: 0.0, icon: '🚏', turnDir: 'terminus', road: 'Troy, NY (Franklin Square)', action: 'ARRIVE TERMINUS', surface: 'City Street', detail: 'Franklin Square Inn Troy. ⚡ (Option to push to Saratoga: 105 mi total).', landmark: 'Franklin Square Inn Troy', corridorSide: 'east' }
        ]
      },
      {
        stageNum: 3,
        dayOfWeek: 'Tuesday',
        dateStr: 'Oct 6',
        name: 'Troy to Ticonderoga, NY (Canal Corridor to Adirondacks)',
        distanceMiles: 87.0,
        elevationFt: 2500,
        waterway: 'Champlain Canal Corridor',
        railLine: 'Amtrak Adirondack Corridor',
        surfaceSummary: 'Mohawk-Hudson Path, US-4, Champlain Canalway Trail, NY-22',
        overnight: 'Best Western Plus Ticonderoga (Mile 267.0)',
        elevProfile: [
          { mile: 180, elev: 45, label: 'Troy' },
          { mile: 224, elev: 120, label: 'Whitehall (Lunch)' },
          { mile: 250, elev: 480, label: 'South Bay Ridge' },
          { mile: 267, elev: 220, label: 'Ticonderoga' }
        ],
        cues: [
          { mile: 180.0, dist: 6.0, icon: '⬆', turnDir: 'straight', road: 'Mohawk-Hudson Path to Waterford', action: 'DEPART NORTH', surface: 'Paved Greenway', detail: 'Ride riverfront path past Waterford Canal Lock 2.', landmark: 'Waterford Lock 2', corridorSide: 'west' },
          { mile: 186.0, dist: 38.0, icon: '⬆', turnDir: 'straight', road: 'Schuylerville, Fort Edward & Fort Ann', action: 'US-4 NORTH', surface: 'Highway Shoulder', detail: 'Paved highway shoulder tracing historic Champlain Canal.', landmark: 'Champlain Canal Locks', corridorSide: 'west' },
          { mile: 224.0, dist: 1.0, icon: '🥪', turnDir: 'lunch', road: 'Historic Grounds, Whitehall Lock 12', action: 'LUNCH STOP', surface: 'Canal Harbor', detail: 'Mid-day carb reload overlooking historic canal lock.', landmark: 'Whitehall Lock 12 Harbor', corridorSide: 'west' },
          { mile: 225.0, dist: 42.0, icon: '↰', turnDir: 'left', road: 'NY-22 North to Ticonderoga', action: 'HAMMER NY-22', surface: 'Highway Shoulder', detail: 'Rolling climbs flanking South Bay and Lake Champlain.', landmark: 'Adirondack Foothills', corridorSide: 'east' },
          { mile: 267.0, dist: 0.0, icon: '🚏', turnDir: 'terminus', road: 'Ticonderoga, NY', action: 'ARRIVE TERMINUS', surface: 'Town Street', detail: 'Best Western Plus Ticonderoga. ⚡ (Option to push to Essex: 105 mi total).', landmark: 'Best Western Plus Ticonderoga', corridorSide: 'center' }
        ]
      },
      {
        stageNum: 4,
        dayOfWeek: 'Wednesday',
        dateStr: 'Oct 7',
        name: 'Ticonderoga to Plattsburgh, NY (Queen Stage)',
        distanceMiles: 70.0,
        elevationFt: 4000,
        waterway: 'Lake Champlain (Adirondack Coast)',
        railLine: 'Amtrak Adirondack Corridor',
        surfaceSummary: 'NY-9N / NY-22 Adirondack Coastline, US-9 Shoreline',
        overnight: 'Best Western Plus Plattsburgh (Mile 337.0)',
        elevProfile: [
          { mile: 267, elev: 220, label: 'Ticonderoga' },
          { mile: 295, elev: 240, label: 'Westport' },
          { mile: 305, elev: 120, label: 'Essex (Lunch)' },
          { mile: 320, elev: 680, label: 'Willsboro Summit' },
          { mile: 337, elev: 130, label: 'Plattsburgh' }
        ],
        cues: [
          { mile: 267.0, dist: 38.0, icon: '⬆', turnDir: 'straight', road: 'Crown Point, Port Henry & Westport', action: 'DEPART NORTH', surface: 'Highway Shoulder', detail: 'Challenging coastal climbs with stunning Vermont views.', landmark: 'Adirondack Coast Bluffs', corridorSide: 'east' },
          { mile: 305.0, dist: 1.0, icon: '🥪', turnDir: 'lunch', road: 'The Cup Cafe, Historic Essex, NY', action: 'LUNCH STOP', surface: 'Harbor Dock', detail: 'Porch dining at ferry dock. Fill all water bottles.', landmark: 'The Cup Cafe • Essex Ferry', corridorSide: 'east' },
          { mile: 306.0, dist: 20.0, icon: '⬆', turnDir: 'straight', road: 'Willsboro, Keeseville & Ausable Chasm', action: 'CLIMB INLAND', surface: 'Highway Shoulder', detail: 'Steep rollers through Ausable pine forest and gorge.', landmark: 'Ausable Chasm Bridge', corridorSide: 'west' },
          { mile: 326.0, dist: 11.0, icon: '↱', turnDir: 'right', road: 'US-9 North into Plattsburgh', action: 'FLAT SPRINT', surface: 'Highway Shoulder', detail: 'High-speed paceline along shoreline into town.', landmark: 'Plattsburgh Shoreline Approach', corridorSide: 'east' },
          { mile: 337.0, dist: 0.0, icon: '🚏', turnDir: 'terminus', road: 'Plattsburgh, NY', action: 'ARRIVE TERMINUS', surface: 'City Highway', detail: 'Best Western Plus Plattsburgh. Carb up for final border sprint!', landmark: 'Best Western Plus Plattsburgh', corridorSide: 'center' }
        ]
      },
      {
        stageNum: 5,
        dayOfWeek: 'Thursday',
        dateStr: 'Oct 8',
        name: 'Plattsburgh to Montréal, QC (Victory Arrival!)',
        distanceMiles: 88.0,
        elevationFt: 1200,
        waterway: 'Richelieu River & St. Lawrence River',
        railLine: 'Amtrak Ends at Rouses Point',
        surfaceSummary: 'US-9, Rouses Point, QC-223 Richelieu River, Chambly Canal, Route Verte 1',
        overnight: 'Hotel Monville, Old Montréal (Mile 425.0)',
        elevProfile: [
          { mile: 337, elev: 130, label: 'Plattsburgh' },
          { mile: 361, elev: 110, label: 'Rouses Point' },
          { mile: 362, elev: 95, label: 'Customs' },
          { mile: 384, elev: 85, label: 'Saint-Jean' },
          { mile: 425, elev: 80, label: 'Montréal Finish' }
        ],
        cues: [
          { mile: 337.0, dist: 24.0, icon: '⬆', turnDir: 'straight', road: 'US-9 North to Rouses Point, NY', action: 'NORTH SPRINT', surface: 'Highway Shoulder', detail: 'Flat, fast morning paceline to northern border.', landmark: 'US Border Approach', corridorSide: 'center' },
          { mile: 361.0, dist: 1.0, icon: '🛂', turnDir: 'border', road: 'Lacolle / QC-223 International Booth', action: 'BORDER CUSTOMS', surface: 'Border Facility', detail: 'Passports ready! Vehicle booth clearance into Quebec.', landmark: '🇨🇦 Canada Customs Clearance', corridorSide: 'center' },
          { mile: 362.0, dist: 22.0, icon: '⬆', turnDir: 'straight', road: 'QC-223 North (Route du Richelieu)', action: 'CRUISE RICHELIEU', surface: 'Rural Highway', detail: 'Flat, peaceful riverside road into Saint-Jean.', landmark: 'Richelieu River Heritage', corridorSide: 'east' },
          { mile: 384.0, dist: 1.0, icon: '🥪', turnDir: 'lunch', road: 'Bistro La Trinquette, Saint-Jean', action: 'LUNCH STOP', surface: 'Riverfront', detail: 'Crepes & cider right at start of Chambly Canal.', landmark: 'Bistro La Trinquette', corridorSide: 'east' },
          { mile: 385.0, dist: 13.0, icon: '⬆', turnDir: 'straight', road: 'Chambly Canal National Historic Towpath', action: 'CAR-FREE CANAL', surface: 'Canal Towpath', detail: 'Flat gravel/paved path past historic stone locks.', landmark: 'Chambly Canal Towpath', corridorSide: 'center' },
          { mile: 398.0, dist: 22.0, icon: '↰', turnDir: 'left', road: 'Longueuil to Jacques-Cartier Bridge', action: 'ROUTE VERTE 1', surface: 'Cycle Track', detail: 'Follow greenway network across St. Lawrence River.', landmark: 'Jacques-Cartier Bridge', corridorSide: 'center' },
          { mile: 420.0, dist: 5.0, icon: '⬆', turnDir: 'straight', road: 'Quais du Vieux-Port to Place Jacques-Cartier', action: 'OLD PORT ENTRY', surface: 'Cobblestone', detail: 'Cobblestone promenade finish in historic center.', landmark: 'Quais du Vieux-Port', corridorSide: 'west' },
          { mile: 425.0, dist: 0.0, icon: '🏁', turnDir: 'finish', road: 'Place Jacques-Cartier, Old Montréal', action: 'TOUR VICTORY', surface: 'Historic Plaza', detail: 'Tour Complete! Thursday evening celebration in Quebec.', landmark: '🎉 TOUR FINISH: Old Montréal', corridorSide: 'center' }
        ]
      }
    ]
  },

  '7day': {
    id: '7day',
    code: '7D',
    color: '#E11D48',
    title: '7-Day Gentler Tour',
    subtitle: 'Corridor Strip Map: NYC ➔ Brewster ➔ Hudson ➔ Saratoga ➔ Ticonderoga ➔ Plattsburgh ➔ Saint-Jean ➔ Montréal',
    schedule: 'Sun Oct 4 ➔ Sat Oct 10 (7 Days)',
    totalMiles: '445.0',
    totalKm: '716.2',
    elevationGain: '+14,500 ft',
    avgDaily: '63.6 mi/day',
    stages: [] // Mirrors 6-day stages 1-5, then split Day 6 & 7 into Saint-Jean and Montréal
  },

  'vermont': {
    id: 'vermont',
    code: 'VT',
    color: '#059669',
    title: 'Vermont Champlain Islands Upgrade Variant',
    subtitle: 'Corridor Strip Map: Essex Ferry ➔ Burlington ➔ Island Line Causeway ➔ Champlain Islands ➔ Saint-Jean',
    schedule: 'Alternative Days 5 & 6 (Scenic Upgrade)',
    totalMiles: '455.0',
    totalKm: '732.2',
    elevationGain: '+13,200 ft',
    avgDaily: '75.8 mi/day',
    stages: [
      {
        stageNum: 'VT-1',
        dayOfWeek: 'Alternative Day 5',
        dateStr: 'Oct 8',
        name: 'Ticonderoga, NY ➔ Essex Ferry ➔ Burlington, VT',
        distanceMiles: 53.0,
        elevationFt: 2200,
        waterway: 'Lake Champlain (Ferry Crossing to Green Mountains)',
        railLine: 'Amtrak Ethan Allen Express (Burlington)',
        surfaceSummary: 'NY-9N/22, Essex-Charlotte Ferry ($6.25), Greenbush Rd, Burlington Greenway',
        overnight: 'Hotel Vermont / Courtyard Burlington Harbor (Mile 341.0)',
        elevProfile: [
          { mile: 288, elev: 220, label: 'Ticonderoga' },
          { mile: 306, elev: 150, label: 'Port Henry' },
          { mile: 326, elev: 120, label: 'Essex Ferry' },
          { mile: 329, elev: 100, label: 'Charlotte VT' },
          { mile: 335, elev: 280, label: 'Shelburne' },
          { mile: 341, elev: 110, label: 'Burlington Waterfront' }
        ],
        cues: [
          { mile: 288.0, dist: 9.0, icon: '⬆', turnDir: 'straight', road: 'NY-9N / NY-22 along Lake Champlain', action: 'DEPART NORTH', surface: 'Highway Shoulder', detail: 'Lake bluffs past Crown Point toward Essex ferry slip.', landmark: 'Crown Point Bridge', corridorSide: 'east' },
          { mile: 297.0, dist: 19.0, icon: '⬆', turnDir: 'straight', road: 'Port Henry & Westport', action: 'COASTAL BLUFFS', surface: 'Highway Shoulder', detail: 'Adirondack coastal roads overlooking Vermont Green Mountains.', landmark: 'Adirondack Coast Bluffs', corridorSide: 'east' },
          { mile: 316.0, dist: 10.0, icon: '🥪', turnDir: 'lunch', road: 'The Cup Cafe, Historic Essex, NY', action: 'LUNCH STOP', surface: 'Harbor Village', detail: 'Porch dining directly overlooking ferry dock before boarding.', landmark: 'The Cup Cafe Essex', corridorSide: 'east' },
          { mile: 326.0, dist: 3.0, icon: '⛴️', turnDir: 'ferry', road: 'Essex, NY ➔ Charlotte, VT Ferry', action: 'BOARD FERRY', surface: 'Open Car Deck', detail: 'Lake Champlain Transportation Co. ferry ($6.25/cyclist, hourly daily). 20-min crossing.', landmark: '⛴️ 20-Min Ferry Crossing to Vermont', corridorSide: 'east' },
          { mile: 329.0, dist: 10.0, icon: '⬆', turnDir: 'straight', road: 'Ferry Rd & Greenbush Road', action: 'WELCOME TO VT', surface: 'Paved Country Road', detail: 'Roll through gentle pastoral Vermont countryside toward Shelburne.', landmark: 'Green Mountain Views', corridorSide: 'east' },
          { mile: 339.0, dist: 2.0, icon: '↰', turnDir: 'left', road: 'Burlington Greenway (Island Line)', action: 'JOIN GREENWAY', surface: 'Paved Cycle Track', detail: 'Dedicated paved cycle path along Lake Champlain shoreline into downtown.', landmark: 'Burlington Waterfront Greenway', corridorSide: 'west' },
          { mile: 341.0, dist: 0.0, icon: '🚏', turnDir: 'terminus', road: 'Burlington, VT (Cherry Street)', action: 'ARRIVE TERMINUS', surface: 'City Waterfront', detail: 'Hotel Vermont (dedicated bike room). World-class craft beers at Foam Brewers.', landmark: 'Hotel Vermont • 🍻 Foam Brewers', corridorSide: 'west' }
        ]
      },
      {
        stageNum: 'VT-2',
        dayOfWeek: 'Alternative Day 6',
        dateStr: 'Oct 9',
        name: 'Burlington ➔ Colchester Causeway ➔ Champlain Islands ➔ Saint-Jean, QC',
        distanceMiles: 58.0,
        elevationFt: 900,
        waterway: 'Lake Champlain Open Waters & Causeway',
        railLine: 'Former Rutland Railroad Island Line',
        surfaceSummary: 'Island Line Trail, Colchester Causeway, Bike Ferry, Grand Isle, North Hero, US-2, QC-225',
        overnight: 'Quality Hotel Saint-Jean / Option into Montréal (Mile 399.0)',
        elevProfile: [
          { mile: 341, elev: 110, label: 'Burlington' },
          { mile: 346, elev: 100, label: 'Colchester Causeway' },
          { mile: 349, elev: 98, label: 'Bike Ferry Cut' },
          { mile: 363, elev: 115, label: 'North Hero (Hero\'s Welcome)' },
          { mile: 378, elev: 95, label: 'Noyan Customs' },
          { mile: 399, elev: 85, label: 'Saint-Jean' }
        ],
        cues: [
          { mile: 341.0, dist: 5.0, icon: '⬆', turnDir: 'straight', road: 'Burlington Greenway', action: 'DEPART NORTH', surface: 'Paved Cycle Track', detail: 'Ride north past North Beach through Delta Park.', landmark: 'Burlington Waterfront', corridorSide: 'west' },
          { mile: 346.0, dist: 3.0, icon: '🌊', turnDir: 'poi', road: 'Colchester Causeway (Island Line)', action: 'ENTER CAUSEWAY', surface: 'Crushed Limestone', detail: 'Ride 3 miles into the center of Lake Champlain on historic marble railway embankment.', landmark: '🌊 3-Mile Open Lake Causeway', corridorSide: 'center' },
          { mile: 349.0, dist: 0.5, icon: '⛴️', turnDir: 'ferry', road: 'Local Motion Bike Ferry ("The Cut")', action: 'BIKE FERRY', surface: 'Bike Ferry Boat', detail: 'Cross 200-ft gap to South Hero. (Fall bypass: Route 127 + US-2 Sandbar causeway +14 mi).', landmark: '⛴️ Local Motion Bike Ferry', corridorSide: 'center' },
          { mile: 349.5, dist: 13.5, icon: '⬆', turnDir: 'straight', road: 'South Hero & Grand Isle (US-2)', action: 'CHAMPLAIN ISLANDS', surface: 'Paved Island Highway', detail: 'Tranquil island cycling past apple orchards, vineyards, and lake views.', landmark: 'Champlain Island Orchards', corridorSide: 'center' },
          { mile: 363.0, dist: 1.0, icon: '🥪', turnDir: 'lunch', road: "Hero's Welcome General Store & Cafe", action: 'LUNCH STOP', surface: 'Island Harbor', detail: '3537 US-2, North Hero, VT. Gourmet dockside deli, fresh cider donuts.', landmark: "Hero's Welcome Lakeside Dock", corridorSide: 'east' },
          { mile: 364.0, dist: 14.0, icon: '⬆', turnDir: 'straight', road: 'US-2 North to Alburgh & Route 225', action: 'ALBURGH PENINSULA', surface: 'Rural Road', detail: 'Flat, quiet roads toward the Canadian border at Noyan.', landmark: 'Alburgh Peninsula', corridorSide: 'center' },
          { mile: 378.0, dist: 0.5, icon: '🛂', turnDir: 'border', road: 'Noyan / Clarenceville Customs (QC-225)', action: 'BORDER CUSTOMS', surface: 'Border Facility', detail: 'Direct border crossing into Quebec. Low vehicle traffic, roll up to inspection booth.', landmark: '🇨🇦 Canada Customs (Noyan)', corridorSide: 'center' },
          { mile: 378.5, dist: 20.5, icon: '⬆', turnDir: 'straight', road: 'QC-225 & QC-223 North to Saint-Jean', action: 'RIVER APPROACH', surface: 'Rural Paved Road', detail: 'Quiet French country roads connecting to the Richelieu River into Saint-Jean.', landmark: 'Richelieu River Basin', corridorSide: 'east' },
          { mile: 399.0, dist: 0.0, icon: '🚏', turnDir: 'terminus', road: 'Saint-Jean-sur-Richelieu, QC', action: 'ARRIVE TERMINUS', surface: 'Town Street', detail: 'Quality Hotel Centre de Congrès. Rejoin standard route for final 37 mi into Montréal.', landmark: 'Quality Hotel • Rejoin Route', corridorSide: 'center' }
        ]
      }
    ]
  }
};

// Initialize 7-Day Gentler stages based on 6-day stages 1-5 + split 6 & 7
STRIP_MAP_ITINERARIES['7day'].stages = [
  ...STRIP_MAP_ITINERARIES['6day'].stages.slice(0, 5),
  {
    stageNum: 6,
    dayOfWeek: 'Friday',
    dateStr: 'Oct 9',
    name: 'Plattsburgh to Saint-Jean-sur-Richelieu, QC (Border Day)',
    distanceMiles: 50.0,
    elevationFt: 800,
    waterway: 'Lake Champlain & Richelieu River',
    railLine: 'Amtrak to Rouses Point (Bike service ends at border)',
    surfaceSummary: 'US-9, Rouses Point, QC-223 along Richelieu River',
    overnight: 'Quality Hotel Centre de Congrès Saint-Jean (Mile 408.0)',
    elevProfile: [
      { mile: 358, elev: 130, label: 'Plattsburgh' },
      { mile: 382, elev: 110, label: 'Rouses Point' },
      { mile: 385, elev: 95, label: 'Customs' },
      { mile: 408, elev: 85, label: 'Saint-Jean' }
    ],
    cues: [
      { mile: 358.0, dist: 24.0, icon: '⬆', turnDir: 'straight', road: 'US-9 North to Rouses Point', action: 'DEPART NORTH', surface: 'Highway Shoulder', detail: 'Leisurely flat morning roll through Lake Champlain orchard country.', landmark: 'Champlain Farmland', corridorSide: 'center' },
      { mile: 382.0, dist: 2.5, icon: '⬆', turnDir: 'straight', road: 'Rouses Point, NY', action: 'PASS THROUGH', surface: 'Town Street', detail: 'Final US town. 🚆 Amtrak carry-on bike service ends here.', landmark: 'Rouses Point Harbor', corridorSide: 'east' },
      { mile: 384.5, dist: 0.5, icon: '🛂', turnDir: 'border', road: 'Lacolle / QC-223 International Booth', action: 'BORDER CUSTOMS', surface: 'Border Facility', detail: 'Zero-rush border inspection. Stop at vehicle booth with passport.', landmark: '🇨🇦 Canada Customs Clearance', corridorSide: 'center' },
      { mile: 385.0, dist: 22.0, icon: '⬆', turnDir: 'straight', road: 'QC-223 North (Route du Richelieu)', action: 'RIVER ROAD', surface: 'Rural Highway', detail: 'Peaceful, pastoral riverside riding. Farm stands and heritage barns.', landmark: 'Richelieu River Heritage', corridorSide: 'east' },
      { mile: 407.0, dist: 1.0, icon: '🥪', turnDir: 'lunch', road: 'Saint-Jean-sur-Richelieu, QC', action: 'LUNCH / FINISH', surface: 'Riverfront Street', detail: 'Bistro La Trinquette / Old Saint-Jean. Overnight at Quality Hotel.', landmark: 'Bistro La Trinquette', corridorSide: 'east' },
      { mile: 408.0, dist: 0.0, icon: '🚏', turnDir: 'terminus', road: 'Saint-Jean-sur-Richelieu, QC', action: 'ARRIVE TERMINUS', surface: 'Town Street', detail: 'Relaxed afternoon strolling canal locks, craft breweries, French dinner.', landmark: '🎉 Relaxed Border Evening in Quebec', corridorSide: 'center' }
    ]
  },
  {
    stageNum: 7,
    dayOfWeek: 'Saturday',
    dateStr: 'Oct 10',
    name: 'Saint-Jean-sur-Richelieu to Montréal, QC (Victory Lap!)',
    distanceMiles: 37.0,
    elevationFt: 600,
    waterway: 'Chambly Canal & St. Lawrence River',
    railLine: 'Exo Commuter Rail & STM Metro',
    surfaceSummary: 'Chambly Canal National Historic Towpath, Route Verte 1, Jacques-Cartier Bridge',
    overnight: 'Hotel Monville / Weekend in Montréal (Mile 445.0)',
    elevProfile: [
      { mile: 408, elev: 85, label: 'Saint-Jean' },
      { mile: 420, elev: 75, label: 'Fort Chambly' },
      { mile: 433, elev: 80, label: 'Longueuil' },
      { mile: 445, elev: 80, label: 'Montréal Finish' }
    ],
    cues: [
      { mile: 408.0, dist: 12.0, icon: '⬆', turnDir: 'straight', road: 'Chambly Canal Historic Towpath', action: 'ENTER TOWPATH', surface: 'Canal Towpath', detail: 'Car-free morning glide along tranquil historic canal towpath.', landmark: 'Chambly Canal Towpath', corridorSide: 'center' },
      { mile: 420.0, dist: 1.0, icon: '🏰', turnDir: 'poi', road: 'Fort Chambly National Historic Site', action: 'PASS FORTRESS', surface: 'Paved Park Path', detail: 'Pass stone battlements of Fort Chambly on the river basin.', landmark: 'Fort Chambly French Fortress', corridorSide: 'center' },
      { mile: 421.0, dist: 12.0, icon: '↰', turnDir: 'left', road: 'Longueuil / Saint-Lambert Greenways', action: 'ROUTE VERTE 1', surface: 'Paved Cycle Track', detail: 'Signed, dedicated multi-use cycle path network toward St. Lawrence River.', landmark: 'Route Verte 1 Network', corridorSide: 'center' },
      { mile: 433.0, dist: 5.0, icon: '↱', turnDir: 'right', road: 'Jacques-Cartier Bridge Cycle Track', action: 'CROSS BRIDGE', surface: 'Bridge Cycle Track', detail: 'Cross St. Lawrence River with iconic skyline view of Montréal.', landmark: 'St. Lawrence River & Skyline', corridorSide: 'center' },
      { mile: 438.0, dist: 7.0, icon: '⬆', turnDir: 'straight', road: 'Quais du Vieux-Port', action: 'OLD PORT ENTRY', surface: 'Historic Cobblestone', detail: 'Cobblestone promenade into Place Jacques-Cartier for noon victory celebration!', landmark: 'Quais du Vieux-Port de Montréal', corridorSide: 'west' },
      { mile: 445.0, dist: 0.0, icon: '🏁', turnDir: 'finish', road: 'Place Jacques-Cartier, Old Montréal', action: 'TOUR VICTORY', surface: 'Historic Plaza', detail: 'Grand Tour Victory! Arrive in time for celebratory French lunch and weekend exploring.', landmark: '🎉 TOUR FINISH: Old Montréal', corridorSide: 'center' }
    ]
  }
];

let activeStripItinerary = '6day';
let activeStageFilter = 'all';

/* ============================================================
   SVG LINEAR CORRIDOR STRIP GENERATOR
============================================================ */
function buildStageLinearStripSvg(stage) {
  const cues = stage.cues;
  const rowHeight = 78;
  const topPad = 50;
  const bottomPad = 50;
  const svgHeight = topPad + cues.length * rowHeight + bottomPad;
  const svgWidth = 720;
  const corridorX = 180; // Center axis of the corridor strip

  // Calculate dynamic deflections along the single black line
  let curX = corridorX;
  const points = cues.map((cue, i) => {
    const y = topPad + i * rowHeight;
    if (cue.turnDir === 'right') {
      curX = Math.min(corridorX + 45, curX + 28);
    } else if (cue.turnDir === 'left') {
      curX = Math.max(corridorX - 45, curX - 28);
    } else if (cue.turnDir === 'bear-right') {
      curX = Math.min(corridorX + 35, curX + 16);
    } else if (cue.turnDir === 'bear-left') {
      curX = Math.max(corridorX - 35, curX - 16);
    }
    return { x: curX, y, cue, index: i };
  });

  // Construct the Single Bold Black Line path string
  let lineD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const midY = (p0.y + p1.y) / 2;
    lineD += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }

  // Construct the parallel water ribbon path on the left
  let waterD = `M 45 ${points[0].y - 20}`;
  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    const wx = Math.max(35, pt.x - 125);
    waterD += ` L ${wx} ${pt.y}`;
  }
  waterD += ` L 45 ${points[points.length - 1].y + 20}`;

  // SVG Markup Elements
  let nodesMarkup = '';
  points.forEach((pt, i) => {
    const cue = pt.cue;
    const isStart = i === 0;
    const isEnd = i === points.length - 1;
    const isLunch = cue.turnDir === 'lunch';
    const isBorder = cue.turnDir === 'border';
    const isFerry = cue.turnDir === 'ferry';

    // Connector guide line from node to right-side callout card
    nodesMarkup += `
      <line x1="${pt.x + 8}" y1="${pt.y}" x2="265" y2="${pt.y}" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3" />
    `;

    // Visual Turn/Station Node on the Single Black Line
    if (isStart || isEnd) {
      nodesMarkup += `
        <circle cx="${pt.x}" cy="${pt.y}" r="11" fill="#000000" stroke="#ffffff" stroke-width="3" />
        <circle cx="${pt.x}" cy="${pt.y}" r="5" fill="#ffffff" />
      `;
    } else if (isLunch) {
      nodesMarkup += `
        <circle cx="${pt.x}" cy="${pt.y}" r="9" fill="#ea580c" stroke="#ffffff" stroke-width="2.5" />
      `;
    } else if (isBorder) {
      nodesMarkup += `
        <circle cx="${pt.x}" cy="${pt.y}" r="9" fill="#16a34a" stroke="#ffffff" stroke-width="2.5" />
      `;
    } else if (isFerry) {
      nodesMarkup += `
        <circle cx="${pt.x}" cy="${pt.y}" r="9" fill="#0284c7" stroke="#ffffff" stroke-width="2.5" />
      `;
    } else {
      nodesMarkup += `
        <circle cx="${pt.x}" cy="${pt.y}" r="6.5" fill="#ffffff" stroke="#000000" stroke-width="3" />
      `;
    }

    // Mileage Tick on the immediate left of node
    nodesMarkup += `
      <text x="${pt.x - 14}" y="${pt.y + 4}" font-family="monospace" font-size="10" font-weight="900" fill="#0f172a" text-anchor="end">${cue.mile.toFixed(1)}</text>
    `;

    // Right-side Structured Turn Label (SVG Vector Typography for 100% crisp printing)
    const turnBadgeColor = isStart || isEnd ? '#000000' : (isLunch ? '#ea580c' : (isBorder ? '#16a34a' : (isFerry ? '#0284c7' : '#1e293b')));
    const turnLabel = `${cue.action}: ${cue.road}`;
    const truncatedLabel = turnLabel.length > 46 ? turnLabel.substring(0, 44) + '…' : turnLabel;

    nodesMarkup += `
      <g transform="translate(270, ${pt.y - 28})">
        <!-- Turn Direction Pill -->
        <rect x="0" y="4" width="28" height="22" rx="5" fill="${turnBadgeColor}" />
        <text x="14" y="19" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">${cue.icon}</text>

        <!-- Turn Action & Road Name -->
        <text x="36" y="15" font-family="sans-serif" font-size="12.5" font-weight="900" fill="#0f172a">${escapeXml(truncatedLabel)}</text>

        <!-- Leg Distance & Surface Badge -->
        <rect x="36" y="21" width="58" height="15" rx="3" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1"/>
        <text x="65" y="32" font-family="monospace" font-size="9" font-weight="bold" fill="#475569" text-anchor="middle">${cue.dist > 0 ? '+' + cue.dist.toFixed(1) + ' mi' : 'END'}</text>

        <rect x="98" y="21" width="110" height="15" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
        <text x="153" y="32" font-family="sans-serif" font-size="9" font-weight="bold" fill="#334155" text-anchor="middle">${escapeXml(cue.surface)}</text>

        <!-- Landmark / Gotcha Note -->
        ${cue.landmark ? `<text x="216" y="32" font-family="sans-serif" font-size="9.5" font-weight="600" fill="#0369a1">📍 ${escapeXml(cue.landmark)}</text>` : ''}
      </g>
    `;
  });

  return `
    <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="stripHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#f1f5f9" stroke-width="3" />
        </pattern>
      </defs>

      <!-- Narrow Corridor Buffer Background (1-Mile Swath of Terrain) -->
      <rect x="15" y="15" width="${svgWidth - 30}" height="${svgHeight - 30}" rx="14" fill="#ffffff" stroke="#000000" stroke-width="2" />

      <!-- Left Waterway Ribbon (Hudson / Champlain / Richelieu) -->
      <path d="${waterD}" fill="none" stroke="#bae6fd" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" opacity="0.8" />
      <text x="45" y="30" font-family="sans-serif" font-size="9" font-weight="900" fill="#0284c7" letter-spacing="0.1em">WATER CORRIDOR: ${escapeXml(stage.waterway || 'RIVERWAY')}</text>

      <!-- Parallel Passenger Rail Lifeline (Amtrak / Metro-North dashed line) -->
      <line x1="95" y1="${topPad - 10}" x2="95" y2="${svgHeight - bottomPad}" stroke="#64748b" stroke-width="2" stroke-dasharray="4,4" />
      <text x="95" y="${svgHeight - 15}" font-family="sans-serif" font-size="8.5" font-weight="bold" fill="#64748b" text-anchor="middle">RAIL LIFELINE: ${escapeXml(stage.railLine || 'AMTRAK')}</text>

      <!-- THE SINGLE BOLD BLACK LINE (The Route Trunk) -->
      <path d="${lineD}" fill="none" stroke="#000000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Turn Nodes, Lead Lines, and High-Contrast Labels -->
      ${nodesMarkup}
    </svg>
  `;
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/* ============================================================
   LINEAR STRIP MAP RENDERER
============================================================ */
function renderMtaRouteMap(itineraryId) {
  const container = document.getElementById('mta-route-map-content');
  if (!container) return;

  const data = STRIP_MAP_ITINERARIES[itineraryId];
  if (!data) return;

  // Render Full Itinerary Linear Strip Map
  const stagesToRender = activeStageFilter === 'all' 
    ? data.stages 
    : data.stages.filter(s => String(s.stageNum) === String(activeStageFilter));

  let stagesHtml = '';
  stagesToRender.forEach(stage => {
    // Generate the SVG linear strip for this stage
    const svgStrip = buildStageLinearStripSvg(stage);

    // Build mini elevation profile bar
    let elevPointsHtml = '';
    if (stage.elevProfile && stage.elevProfile.length > 0) {
      elevPointsHtml = stage.elevProfile.map(p => `
        <div class="flex flex-col items-center text-center">
          <span class="text-[9px] font-mono font-bold text-slate-500">${p.elev} ft</span>
          <div class="w-1.5 h-6 bg-slate-300 rounded-full my-0.5" style="height: ${Math.max(8, Math.min(32, (p.elev / 700) * 32))}px; background: #0f172a;"></div>
          <span class="text-[9px] font-bold text-slate-700 max-w-[65px] truncate">${p.label}</span>
          <span class="text-[8px] font-mono text-slate-400">m.${p.mile}</span>
        </div>
      `).join('');
    }

    stagesHtml += `
      <!-- Single Stage Linear Corridor Strip (Print Optimized Page Unit) -->
      <div class="bg-white rounded-2xl border-3 border-black shadow-md overflow-hidden mta-stage-block mb-8 break-inside-avoid">
        
        <!-- Linear Corridor Masthead Bar -->
        <div class="bg-black text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white text-black font-mono font-black flex items-center justify-center text-lg shadow-sm border border-slate-300 shrink-0">
              ${stage.stageNum}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-black uppercase tracking-widest text-amber-400">STAGE ${stage.stageNum} &bull; ${stage.dayOfWeek} (${stage.dateStr})</span>
                <span class="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold">CORRIDOR RIBBON</span>
              </div>
              <h3 class="text-base font-black text-white tracking-tight mt-0.5">${stage.name}</h3>
            </div>
          </div>
          <div class="flex items-center gap-2 text-xs font-mono font-black shrink-0">
            <span class="bg-white text-black px-3 py-1.5 rounded-lg border border-slate-300 shadow-2xs">🚴 ${stage.distanceMiles} MILES</span>
            <span class="bg-slate-800 text-amber-400 px-3 py-1.5 rounded-lg border border-slate-700">⛰️ +${stage.elevationFt} FT</span>
          </div>
        </div>

        <!-- Corridor Logistics & Safety Net Bar -->
        <div class="bg-slate-100 px-4 py-2.5 border-b border-slate-300 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-700">
          <div><strong class="text-slate-900">Surface Corridor:</strong> ${stage.surfaceSummary}</div>
          <div><strong class="text-slate-900">Overnight Terminus:</strong> <span class="bg-slate-200 text-slate-900 px-2 py-0.5 rounded font-bold">${stage.overnight}</span></div>
        </div>

        <!-- Main Linear Strip Corridor SVG (Single Bold Black Line with All Turns) -->
        <div class="p-3 sm:p-5 bg-slate-50/50 flex justify-center">
          <div class="w-full max-w-3xl bg-white rounded-xl shadow-xs border border-slate-200 p-2 sm:p-4">
            ${svgStrip}
          </div>
        </div>

        <!-- Stage Elevation Cross-Section Strip -->
        ${elevPointsHtml ? `
          <div class="px-5 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-500 shrink-0">
              Corridor Elevation Ribbon:
            </div>
            <div class="flex items-end justify-between gap-2 flex-1 overflow-x-auto py-1">
              ${elevPointsHtml}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  });

  // Stage Filter Buttons
  let filterPills = `
    <button onclick="setStageStripFilter('all')" class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeStageFilter === 'all' ? 'bg-black text-white font-black' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}">
      All Stages (Full Corridor)
    </button>
  `;
  data.stages.forEach(s => {
    filterPills += `
      <button onclick="setStageStripFilter('${s.stageNum}')" class="px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all ${String(activeStageFilter) === String(s.stageNum) ? 'bg-black text-white font-black' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}">
        Stage ${s.stageNum}
      </button>
    `;
  });

  container.innerHTML = `
    <!-- Linear Route Diagram Masthead -->
    <div class="bg-slate-950 text-white rounded-2xl p-5 sm:p-6 border-4 border-black shadow-xl space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-800 pb-4">
        <div class="flex items-start sm:items-center gap-3.5">
          <div class="w-14 h-14 rounded-full bg-white text-slate-950 font-black text-2xl flex items-center justify-center font-mono shadow-md border-2 border-black shrink-0">
            ${data.code}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded font-mono">
                LINEAR CORRIDOR DIAGRAM
              </span>
              <span class="text-xs font-bold text-slate-400">Path-First Navigation Strip</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">${data.title}</h2>
            <p class="text-xs text-slate-300 font-medium mt-0.5">${data.subtitle}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2 shrink-0 no-print">
          <button onclick="window.print()" class="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 border border-slate-300">
            <span>🖨️ Print Linear Strip Map</span>
          </button>
          <a href="nyc_to_montreal_${data.id === '6day' ? 'tour' : data.id + (data.id === 'vermont' ? '_upgrade' : '_tour')}.gpx" download class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-slate-700">
            <span>📥 Download GPX</span>
          </a>
          <button onclick="switchToDashboardView()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5 border border-slate-700">
            <span>🗺️ Interactive Map</span>
          </button>
        </div>
      </div>

      <!-- Corridor Concept Explanation Card -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div class="flex items-start gap-2.5">
          <span class="text-lg">📏</span>
          <div>
            <strong class="text-white">Linear Route Corridor Principle:</strong>
            <p class="text-slate-400 mt-0.5">Prioritizes the exact black route line over peripheral geography. Every road turn, angle change, surface transition, and landmark is mapped directly along the central ribbon.</p>
          </div>
        </div>
        <div class="flex items-center gap-3 text-slate-400 font-mono text-[11px] shrink-0 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3">
          <div><strong class="text-white">${data.totalMiles} MI</strong> Total</div>
          <div><strong class="text-amber-400">${data.elevationGain}</strong> Climb</div>
          <div><strong class="text-emerald-400">${data.avgDaily}</strong> Avg</div>
        </div>
      </div>
    </div>

    <!-- Stage Filter Bar -->
    <div class="bg-white p-3 rounded-2xl border-2 border-black shadow-sm flex flex-wrap items-center justify-between gap-2 no-print">
      <div class="flex items-center gap-2">
        <span class="text-xs font-black text-slate-900 uppercase tracking-wider pl-1">Corridor Filter:</span>
      </div>
      <div class="flex items-center gap-1.5 flex-wrap">
        ${filterPills}
      </div>
    </div>

    <!-- Stage Strip Blocks -->
    <div class="space-y-6">
      ${stagesHtml}
    </div>
  `;
}

function setStageStripFilter(filter) {
  activeStageFilter = filter;
  renderMtaRouteMap(activeStripItinerary);
}

/* ============================================================
   TAB SWITCHING & VIEW TOGGLING
============================================================ */
function switchMtaRouteTab(itineraryId) {
  activeStripItinerary = itineraryId;
  activeStageFilter = 'all';
  renderMtaRouteMap(itineraryId);
}

function showMtaRouteMapTab(itineraryId) {
  if (typeof handleItinerarySelect === 'function') {
    handleItinerarySelect(itineraryId);
  }
  if (typeof setAppViewMode === 'function') {
    setAppViewMode('strip');
  } else {
    const dashboardView = document.getElementById('tour-dashboard-view');
    const routeMapView = document.getElementById('mta-route-map-view');
    if (dashboardView) dashboardView.classList.add('hidden');
    if (routeMapView) routeMapView.classList.remove('hidden');
    renderMtaRouteMap(itineraryId || '6day');
  }
}

function switchToDashboardView() {
  if (typeof setAppViewMode === 'function') {
    setAppViewMode('guide');
  } else {
    const dashboardView = document.getElementById('tour-dashboard-view');
    const routeMapView = document.getElementById('mta-route-map-view');
    if (routeMapView) routeMapView.classList.add('hidden');
    if (dashboardView) dashboardView.classList.remove('hidden');
  }
}

function showCurrentTourMtaMap() {
  if (typeof setAppViewMode === 'function') {
    setAppViewMode('strip');
  } else {
    showMtaRouteMapTab('6day');
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    renderMtaRouteMap('6day');
  });
}
