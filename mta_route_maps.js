// MTA Bus Map Inspired Turn-by-Turn Route Maps Module for NYC to Montreal Bike Tour
// Features: Single continuous black line schematic, complete turn cues, MTA transit styling, and print formatting.

const MTA_ITINERARIES = {
  '6day': {
    id: '6day',
    code: '6D',
    color: '#0039A6', // MTA Subway Royal Blue
    accentColor: '#1d4ed8',
    badgeText: 'MTA ROUTE 6D',
    title: '6-Day Classic Expedition',
    subtitle: 'NYC (Battery Park) ➔ Hudson Valley ➔ Lake Champlain ➔ Montréal',
    schedule: 'Sunday, Oct 4 ➔ Friday, Oct 9 (6 Days)',
    totalMiles: '445.0',
    totalKm: '716.2',
    elevationGain: '+14,500 ft',
    avgDaily: '74.2 mi/day',
    pace: 'Moderate Touring (14–16 mph rolling)',
    finishDay: 'Friday Afternoon Arrival in Old Port',
    stages: [
      {
        stageNum: 1,
        dayOfWeek: 'Sunday',
        dateStr: 'Oct 4',
        name: 'NYC (Battery Park) to Brewster / Carmel, NY',
        distanceMiles: 60.0,
        elevationFt: 2000,
        surface: 'Hudson River Greenway, Bronx Links, South & North County Trailways, Putnam Trailway',
        overnight: "Heidi's Inn / Comfort Inn Brewster",
        cues: [
          { mile: 0.0, dist: 5.2, icon: '⬆', type: 'start', action: 'DEPART NORTH', road: 'Battery Park (South Ferry)', detail: 'Enter dedicated Hudson River Greenway. Stay right on bike path along waterfront.', surface: 'Paved Greenway', poi: '🗽 Statue of Liberty & Harbor Views' },
          { mile: 5.2, dist: 6.3, icon: '⬆', type: 'straight', action: 'CONTINUE STRAIGHT', road: 'Hudson River Greenway', detail: 'Pass Chelsea Piers, Intrepid Sea-Air-Space Museum, and Midtown ferry terminals.', surface: 'Paved Greenway', poi: '🚢 Hudson River Waterfront' },
          { mile: 11.5, dist: 1.7, icon: '⬆', type: 'straight', action: 'PASS UNDER', road: 'George Washington Bridge', detail: 'Ride beneath bridge tower past the Little Red Lighthouse. Short winding switchback.', surface: 'Paved Greenway', poi: '🌉 GWB & Little Red Lighthouse' },
          { mile: 13.2, dist: 0.3, icon: '↱', type: 'right', action: 'TURN RIGHT', road: 'Dyckman Street', detail: 'Exit greenway onto Dyckman St heading east into Inwood neighborhood.', surface: 'City Bike Lane', poi: 'Inwood Station (A Train)' },
          { mile: 13.5, dist: 0.7, icon: '↰', type: 'left', action: 'TURN LEFT', road: 'Broadway (US-9 North)', detail: 'Head north on Broadway under elevated 1-train tracks.', surface: 'City Street', poi: '⚠️ Urban Traffic Caution' },
          { mile: 14.2, dist: 0.8, icon: '⬆', type: 'straight', action: 'CROSS BRIDGE', road: 'Broadway Bridge', detail: 'Cross Harlem River Ship Canal into Marble Hill and The Bronx.', surface: 'Bridge Path', poi: 'Harlem River Ship Canal' },
          { mile: 15.0, dist: 0.6, icon: '↱', type: 'right', action: 'TURN RIGHT', road: 'Van Cortlandt Park South', detail: 'Follow bike lane east past the Parade Ground.', surface: 'Paved Bike Lane', poi: 'Van Cortlandt Park Gate' },
          { mile: 15.6, dist: 0.6, icon: '↰', type: 'left', action: 'TURN LEFT', road: 'Bailey Ave / Old Putnam Trail', detail: 'Enter park pathway and head north toward Westchester County line.', surface: 'Paved Path', poi: 'Van Cortlandt Golf Course' },
          { mile: 16.2, dist: 10.6, icon: '⬆', type: 'straight', action: 'ENTER TRAILWAY', road: 'South County Trailway', detail: 'Cross into Westchester County. Completely car-free paved rail trail begins.', surface: 'Paved Rail Trail', poi: '🌲 Westchester Green Corridor' },
          { mile: 26.8, dist: 2.7, icon: '⬆', type: 'straight', action: 'CONTINUE STRAIGHT', road: 'South County Trailway (Elmsford)', detail: 'Pass former New York Central Railroad stations in Ardsley and Elmsford.', surface: 'Paved Rail Trail', poi: 'Old Putnam Depot Marker' },
          { mile: 29.5, dist: 8.7, icon: '⬆', type: 'straight', action: 'TRANSITION', road: 'North County Trailway', detail: 'Seamless transition at Eastview / Route 100C. Shaded, smooth asphalt.', surface: 'Paved Rail Trail', poi: 'Pocantico River Wetlands' },
          { mile: 38.2, dist: 10.2, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'Yorktown Heights Depot', detail: 'Trailside Cafe (1807 Commerce St). Smoothies, paninis, outdoor tables on trail.', surface: 'Paved Rail Trail', poi: '🥪 Lunch: Trailside Cafe / Yorktown Cycles' },
          { mile: 48.4, dist: 5.6, icon: '⬆', type: 'straight', action: 'TRANSITION', road: 'Putnam County Trailway', detail: 'Enter Putnam County at Baldwin Place. Scenic winding railbed.', surface: 'Paved Rail Trail', poi: 'Putnam County Line' },
          { mile: 54.0, dist: 6.0, icon: '⬆', type: 'straight', action: 'CONTINUE STRAIGHT', road: 'Lake Mahopac Trailway', detail: 'Ride alongside Lake Mahopac shoreline through peaceful woods.', surface: 'Paved Rail Trail', poi: '🌊 Lake Mahopac Vistas' },
          { mile: 60.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Brewster / Carmel, NY', detail: 'Exit trailway to Heidi\'s Inn or Comfort Inn Brewster. Metro-North Brewster nearby.', surface: 'Town Street', poi: '🏨 Heidi\'s Inn • Ⓜ️ Metro-North Harlem Line' }
        ]
      },
      {
        stageNum: 2,
        dayOfWeek: 'Monday',
        dateStr: 'Oct 5',
        name: 'Brewster to Hudson, NY',
        distanceMiles: 78.0,
        elevationFt: 3000,
        surface: 'Maybrook Trailway, Dutchess Rail Trail, Route 9G & Scenic River Road',
        overnight: 'The Barlow Hotel / The Wick Hudson',
        cues: [
          { mile: 60.0, dist: 12.5, icon: '⬆', type: 'start', action: 'DEPART WEST', road: 'Maybrook Trailway', detail: 'Pick up Maybrook Trailway heading west through Putnam and Dutchess counties.', surface: 'Paved Rail Trail', poi: 'Maybrook Railbed' },
          { mile: 72.5, dist: 8.5, icon: '⬆', type: 'straight', action: 'CONTINUE WEST', road: 'Maybrook Trailway (Stormville)', detail: 'Pass Stormville Airport and Appalachian Trail connector.', surface: 'Paved Rail Trail', poi: 'Appalachian Trail Cross' },
          { mile: 81.0, dist: 12.0, icon: '⬆', type: 'straight', action: 'MERGE NORTHWEST', road: 'Dutchess Rail Trail (Hopewell Jct)', detail: 'Join Dutchess Rail Trail at historic Hopewell Depot. Bikeway shop at Mile 81.', surface: 'Paved Rail Trail', poi: '🔧 Bikeway Shop (Hopewell)' },
          { mile: 93.0, dist: 1.5, icon: '🌊', type: 'poi', action: 'SCENIC OPTION', road: 'Walkway Over the Hudson', detail: 'Optional +2 mi out-and-back across bridge 212 ft above Hudson River. Spectacular!', surface: 'Pedestrian Deck', poi: '🌉 Walkway Over the Hudson' },
          { mile: 94.5, dist: 0.7, icon: '↱', type: 'right', action: 'TURN RIGHT', road: 'Buckingham Ave / Parker Ave', detail: 'Exit rail trail in Poughkeepsie toward east-bank highways.', surface: 'Town Street', poi: 'Ⓜ️ Metro-North Hudson Station (1 mi W)' },
          { mile: 95.2, dist: 5.8, icon: '↰', type: 'left', action: 'TURN LEFT', road: 'Route 9G North (Violet Ave)', detail: 'Head north on Route 9G. Wide paved shoulders, rolling terrain.', surface: 'Highway Shoulder', poi: 'East Bank Corridor' },
          { mile: 101.0, dist: 11.0, icon: '⬆', type: 'straight', action: 'PASS THROUGH', road: 'Hyde Park (Route 9G)', detail: 'Pass east of Roosevelt and Vanderbilt National Historic Sites.', surface: 'Highway Shoulder', poi: 'Historic Hyde Park' },
          { mile: 112.0, dist: 5.5, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'Historic Rhinebeck (Market St)', detail: 'Rhinebeck Bagel / Market St Cafes. Rhinebeck Bicycle Shop on Montgomery St.', surface: 'Village Center', poi: '🥪 Lunch: Rhinebeck • 🚆 Amtrak Rhinecliff (2 mi W)' },
          { mile: 117.5, dist: 6.5, icon: '↰', type: 'bear-left', action: 'BEAR LEFT', road: 'River Road', detail: 'Low-traffic, tree-canopied scenic country road hugging Hudson River bluffs.', surface: 'Scenic Country Road', poi: 'Estate Farmlands & River Glimpses' },
          { mile: 124.0, dist: 14.0, icon: '↱', type: 'right', action: 'TURN RIGHT', road: 'Route 9G North (Clermont/Germantown)', detail: 'Rejoin Route 9G past Clermont State Historic Site and local apple orchards.', surface: 'Highway Shoulder', poi: '🍎 Germantown Orchards' },
          { mile: 138.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Hudson, NY (Warren Street)', detail: 'Turn left onto Warren St. Overnight at The Barlow Hotel or The Wick. Dinner on Warren St.', surface: 'City Street', poi: '🏨 The Barlow Hotel • 🚆 Amtrak Hudson Station' }
        ]
      },
      {
        stageNum: 3,
        dayOfWeek: 'Tuesday',
        dateStr: 'Oct 6',
        name: 'Hudson to Saratoga Springs, NY',
        distanceMiles: 75.0,
        elevationFt: 2000,
        surface: 'Albany-Hudson Electric Trail (AHET), Mohawk-Hudson Path, Zim Smith Trail',
        overnight: 'The Saratoga Hilton / Holiday Inn Saratoga',
        cues: [
          { mile: 138.0, dist: 9.0, icon: '⬆', type: 'start', action: 'DEPART NORTH', road: 'Albany-Hudson Electric Trail (AHET)', detail: 'Pick up paved AHET trailway at 3rd & Mill St in Hudson heading north.', surface: 'Paved Rail Trail', poi: 'AHET Southern Terminus' },
          { mile: 147.0, dist: 12.0, icon: '⬆', type: 'straight', action: 'PASS THROUGH', road: 'Kinderhook (AHET)', detail: 'Cruise through historic Dutch hamlet. 100% car-free trail.', surface: 'Paved Rail Trail', poi: 'Martin Van Buren Historic Area' },
          { mile: 159.0, dist: 15.0, icon: '⬆', type: 'straight', action: 'CONTINUE NORTH', road: 'Niverville & Kinderhook Lake', detail: 'Trail follows shoreline of Kinderhook Lake and pine forests.', surface: 'Paved Rail Trail', poi: '🌊 Kinderhook Lake' },
          { mile: 174.0, dist: 1.5, icon: '⬆', type: 'straight', action: 'TRANSITION', road: 'Rensselaer Northern Terminus', detail: 'AHET ends in Rensselaer across from Albany skyline.', surface: 'City Trail Link', poi: '🚆 Amtrak Albany-Rensselaer Station' },
          { mile: 175.5, dist: 1.0, icon: '↰', type: 'left', action: 'CROSS BRIDGE', road: 'Dunn Memorial Bridge Bike Path', detail: 'Cross Hudson River on protected multi-use path into downtown Albany.', surface: 'Bridge Path', poi: 'Hudson River Crossing' },
          { mile: 176.5, dist: 5.5, icon: '↱', type: 'right', action: 'TURN RIGHT', road: 'Mohawk-Hudson Bike-Hike Trail', detail: 'Pick up paved riverfront greenway at Corning Preserve heading north.', surface: 'Paved Greenway', poi: 'Corning Preserve Waterfront' },
          { mile: 182.0, dist: 3.0, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'Troy Waterfront / Waterford Lock 2', detail: 'Cross into Troy / Waterford. Lunch at Placid Baker / lockside park.', surface: 'Canal Harbor', poi: '🥪 Lunch: Lock 2 Harbor • Champlain Canal Confluence' },
          { mile: 185.0, dist: 10.0, icon: '↰', type: 'left', action: 'TURN LEFT', road: 'Zim Smith Trail (Cohoes/Waterford)', detail: 'Join paved Zim Smith Trail heading northwest toward Saratoga County.', surface: 'Paved Rail Trail', poi: 'Zim Smith Trailway' },
          { mile: 195.0, dist: 7.0, icon: '⬆', type: 'straight', action: 'PASS THROUGH', road: 'Round Lake Village', detail: 'Paved trail skirts Round Lake and historic Victorian village.', surface: 'Paved Rail Trail', poi: 'Round Lake Auditorium' },
          { mile: 202.0, dist: 5.0, icon: '↱', type: 'bear-right', action: 'BEAR RIGHT', road: 'Eastline Road / Route 50 (Ballston Spa)', detail: 'Zim Smith Trail ends; follow wide paved shoulder/bike lane north toward Saratoga.', surface: 'Paved Shoulder', poi: 'Ballston Spa Springs' },
          { mile: 207.0, dist: 6.0, icon: '↰', type: 'left', action: 'TURN LEFT', road: 'Broadway (Route 9 North)', detail: 'Ride Broadway past Saratoga Spa State Park into downtown.', surface: 'City Boulevard', poi: 'Saratoga Spa State Park' },
          { mile: 213.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Saratoga Springs, NY (Broadway)', detail: 'Arrive at The Saratoga Hilton. Broadway dining, natural mineral springs.', surface: 'City Street', poi: '🏨 The Saratoga Hilton • 🚆 Amtrak Saratoga Station' }
        ]
      },
      {
        stageNum: 4,
        dayOfWeek: 'Wednesday',
        dateStr: 'Oct 7',
        name: 'Saratoga Springs to Ticonderoga, NY',
        distanceMiles: 75.0,
        elevationFt: 2500,
        surface: 'NY-29, Champlain Canalway Trail, US-4, NY-22 (Skips Whitehall lodging)',
        overnight: 'Best Western Plus Ticonderoga',
        cues: [
          { mile: 213.0, dist: 11.0, icon: '⬆', type: 'start', action: 'DEPART EAST', road: 'NY-29 East (Lake Ave)', detail: 'Head east out of Saratoga Springs through rolling farmland toward Schuylerville.', surface: 'Road Shoulder', poi: 'Saratoga Battlefield Area' },
          { mile: 224.0, dist: 12.0, icon: '↰', type: 'left', action: 'TURN LEFT', road: 'US-4 North / Champlain Canalway', detail: 'Join Champlain Canalway corridor heading north in historic Schuylerville.', surface: 'Canal Road / Path', poi: 'Champlain Canal Lock 5' },
          { mile: 236.0, dist: 9.0, icon: '⬆', type: 'straight', action: 'CONTINUE NORTH', road: 'Fort Edward (US-4 / Canalway)', detail: 'Follow canal corridor past Fort Edward locks and Champlain Canal trail.', surface: 'Paved Highway Shoulder', poi: '🚆 Amtrak Fort Edward Station' },
          { mile: 245.0, dist: 12.0, icon: '⬆', type: 'straight', action: 'PASS THROUGH', road: 'Fort Ann (US-4 North)', detail: 'Wide paved shoulder on US-4. Historic canal locks line the highway.', surface: 'Paved Highway Shoulder', poi: 'Walker\'s Hardware (Spares)' },
          { mile: 257.0, dist: 1.0, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'Whitehall Lock 12 (Historic Grounds)', detail: 'Historic Grounds Restaurant & Coffee Bar (142 Main St). Full resupply before NY-22!', surface: 'Canal Harbor', poi: '🥪 Lunch: Lock 12 Whitehall • Birthplace of US Navy' },
          { mile: 258.0, dist: 12.0, icon: '↰', type: 'left', action: 'TURN LEFT', road: 'NY-22 North', detail: 'Climb out of Whitehall onto NY-22 North. (Skips weak Whitehall lodging directly to Ticonderoga).', surface: 'Highway Shoulder', poi: '⚠️ Long Climb out of Whitehall' },
          { mile: 270.0, dist: 12.0, icon: '⬆', type: 'straight', action: 'CONTINUE NORTH', road: 'NY-22 North (South Bay)', detail: 'Rolling hills flanking South Bay of Lake Champlain and southern Adirondacks.', surface: 'Highway Shoulder', poi: '🌊 South Bay Lake Champlain' },
          { mile: 282.0, dist: 6.0, icon: '↱', type: 'bear-right', action: 'BEAR RIGHT', road: 'NY-22 / NY-73 Junction', detail: 'Follow signs toward Fort Ticonderoga and town center.', surface: 'Highway Shoulder', poi: 'Approaching Fort Ticonderoga' },
          { mile: 288.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Ticonderoga, NY (Burgoyne Rd)', detail: 'Best Western Plus Ticonderoga (260 Burgoyne Rd). Full-service lodging, restaurant.', surface: 'Town Street', poi: '🏨 Best Western Plus Ticonderoga • 🚆 Amtrak Station' }
        ]
      },
      {
        stageNum: 5,
        dayOfWeek: 'Thursday',
        dateStr: 'Oct 8',
        name: 'Ticonderoga to Plattsburgh, NY (Queen Stage)',
        distanceMiles: 70.0,
        elevationFt: 4000,
        surface: 'NY-9N / NY-22 Adirondack Coastline, US-9 Shoreline',
        overnight: 'Best Western Plus Plattsburgh / Comfort Inn',
        cues: [
          { mile: 288.0, dist: 9.0, icon: '⬆', type: 'start', action: 'DEPART NORTH', road: 'NY-9N / NY-22 North', detail: 'Rolling highway bluffs with panoramic views east across Lake Champlain to Vermont.', surface: 'Highway Shoulder', poi: 'Lake Champlain Bluffs' },
          { mile: 297.0, dist: 9.0, icon: '⬆', type: 'straight', action: 'PASS THROUGH', road: 'Crown Point Historic Site', detail: 'Pass Crown Point fortress ruins and the Lake Champlain Bridge to Vermont.', surface: 'Highway Shoulder', poi: 'Crown Point Bridge to VT' },
          { mile: 306.0, dist: 10.0, icon: '⬆', type: 'straight', action: 'PASS THROUGH', road: 'Port Henry (Coastal Bluffs)', detail: 'Historic iron-mining harbor. Fill all water bottles: 20-mile supply gap to Keeseville!', surface: 'Highway Shoulder', poi: '💧 Mandatory Water Refill Point' },
          { mile: 316.0, dist: 10.0, icon: '⬆', type: 'straight', action: 'PASS THROUGH', road: 'Westport Harbor', detail: 'Scenic Victorian lakeside village overlooking Green Mountains.', surface: 'Highway Shoulder', poi: '🚆 Amtrak Westport Station' },
          { mile: 326.0, dist: 12.0, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'Historic Essex, NY (Ferry Dock)', detail: 'The Cup Cafe / Essex Ice Cream Cafe. Porch dining overlooking ferry to Charlotte, VT.', surface: 'Harbor Village', poi: '🥪 Lunch: The Cup Cafe • ⛴️ Ferry to VT Divergence' },
          { mile: 338.0, dist: 8.0, icon: '⬆', type: 'straight', action: 'CONTINUE NORTH', road: 'Willsboro & Keeseville', detail: 'Punchy inland climbs over pine-forested ridges. Steepest grades of the tour.', surface: 'Highway Shoulder', poi: 'Adirondack Foothills' },
          { mile: 346.0, dist: 4.0, icon: '🌊', type: 'poi', action: 'CROSS GORGE', road: 'Ausable Chasm Bridge', detail: 'Cross steel arch bridge directly over the deep sandstone canyon of Ausable Chasm.', surface: 'Bridge Shoulder', poi: '🌊 Ausable Chasm Gorge' },
          { mile: 350.0, dist: 8.0, icon: '↱', type: 'right', action: 'TURN RIGHT', road: 'US-9 North (Lakeshore Rd)', detail: 'Head north along flat shoreline toward Plattsburgh.', surface: 'Highway Shoulder', poi: 'Flat Coastal Approach' },
          { mile: 358.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Plattsburgh, NY', detail: 'Best Western Plus Plattsburgh (446 NY-3). Secure indoor bike storage, hearty dinner.', surface: 'City Highway', poi: '🏨 Best Western Plus • 🔧 Maui North Bike Shop' }
        ]
      },
      {
        stageNum: 6,
        dayOfWeek: 'Friday',
        dateStr: 'Oct 9',
        name: 'Plattsburgh, NY to Montréal, QC (Canada)',
        distanceMiles: 87.0,
        elevationFt: 1200,
        surface: 'US-9, Rouses Point, QC-223 Richelieu River, Chambly Canal Towpath, Route Verte 1',
        overnight: 'Hotel Monville / Old Montréal',
        cues: [
          { mile: 358.0, dist: 14.0, icon: '⬆', type: 'start', action: 'DEPART NORTH', road: 'US-9 North (Plattsburgh to Chazy)', detail: 'Wide, flat paved shoulders through Lake Champlain agricultural flats.', surface: 'Highway Shoulder', poi: 'Champlain Valley Farmland' },
          { mile: 372.0, dist: 10.0, icon: '⬆', type: 'straight', action: 'CONTINUE NORTH', road: 'US-9 North (Chazy to Rouses Point)', detail: 'Pass Chazy Orchards and Lake Champlain shoreline.', surface: 'Highway Shoulder', poi: '🍎 Chazy Apple Country' },
          { mile: 382.0, dist: 2.5, icon: '⬆', type: 'straight', action: 'PASS THROUGH', road: 'Rouses Point, NY', detail: 'Final town in the United States. Amtrak Adirondack carry-on bike service ENDS here!', surface: 'Town Street', poi: '🚆 Amtrak Adirondack Bike End Point' },
          { mile: 384.5, dist: 0.5, icon: '🛂', type: 'border', action: 'BORDER CUSTOMS', road: 'U.S. / Canada Border (Lacolle / QC-223)', detail: 'Stop at vehicle inspection booth. Passports/EDL required! Zero cannabis! Roll bike through.', surface: 'Border Facility', poi: '🇨🇦 Canada Customs Clearance Booth' },
          { mile: 385.0, dist: 21.0, icon: '⬆', type: 'straight', action: 'CONTINUE NORTH', road: 'QC-223 North (Route du Richelieu)', detail: 'Serene, flat, picturesque riding directly along the Richelieu River.', surface: 'Quiet Rural Highway', poi: '🌊 Historic Richelieu River' },
          { mile: 406.0, dist: 1.0, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'Saint-Jean-sur-Richelieu, QC', detail: 'Bistro La Trinquette (155 Rue Richelieu). Lockside patio, crepes, cider, poutine.', surface: 'Riverfront Street', poi: '🥪 Lunch: Bistro La Trinquette • 🔧 Performance Bégin' },
          { mile: 407.0, dist: 13.0, icon: '⬆', type: 'straight', action: 'ENTER TOWPATH', road: 'Chambly Canal National Historic Site Path', detail: '20 km (12.5 miles) of continuous, car-free flat towpath along canal locks.', surface: 'Car-Free Canal Towpath', poi: '🛶 Historic Chambly Canal Locks' },
          { mile: 420.0, dist: 8.0, icon: '⬆', type: 'straight', action: 'PASS FORTRESS', road: 'Fort Chambly National Historic Site', detail: 'Pass massive 1711 stone French military fortress at foot of Richelieu rapids.', surface: 'Paved Park Path', poi: '🏰 Fort Chambly Fortress' },
          { mile: 428.0, dist: 10.0, icon: '↰', type: 'left', action: 'JOIN GREENWAY', road: 'Route Verte 1 (Longueuil / Saint-Lambert)', detail: 'Follow signed paved cycle path network through Saint-Lambert toward St. Lawrence River.', surface: 'Paved Cycle Track', poi: 'Route Verte 1 Signage' },
          { mile: 438.0, dist: 5.0, icon: '↱', type: 'right', action: 'CROSS ST. LAWRENCE', road: 'Jacques-Cartier Bridge (or Pont de la Concorde)', detail: 'Cross dramatic dedicated bridge cycle track with jaw-dropping Montréal skyline vistas.', surface: 'Bridge Cycle Track', poi: '🌉 St. Lawrence River & Skyline' },
          { mile: 443.0, dist: 2.0, icon: '⬆', type: 'straight', action: 'ENTER OLD PORT', road: 'Old Port Promenade / Rue de la Commune', detail: 'Ride past historic stone clocktower, quays, and cobblestone avenues.', surface: 'Cobblestone / Path', poi: 'Quais du Vieux-Port' },
          { mile: 445.0, dist: 0.0, icon: '🏁', type: 'finish', action: 'TOUR VICTORY', road: 'Place Jacques-Cartier, Old Montréal', detail: 'Tour Complete! Celebrate at Place Jacques-Cartier. Overnight at Hotel Monville.', surface: 'Historic Cobblestone', poi: '🎉 TOUR FINISH: Old Montréal • Hotel Monville' }
        ]
      }
    ]
  },

  '5day': {
    id: '5day',
    code: '5D',
    color: '#D97706', // MTA Fast Amber/Orange
    accentColor: '#b45309',
    badgeText: 'MTA ROUTE 5D',
    title: '5-Day Fast Tour Express',
    subtitle: 'NYC ➔ Poughkeepsie ➔ Troy ➔ Ticonderoga ➔ Plattsburgh ➔ Montréal',
    schedule: 'Sunday, Oct 4 ➔ Thursday, Oct 8 (5 Days)',
    totalMiles: '425.0',
    totalKm: '684.0',
    elevationGain: '+13,000 ft',
    avgDaily: '85.0 mi/day',
    pace: 'High-Tempo Endurance (16–19 mph rolling)',
    finishDay: 'Thursday Evening Arrival in Old Port',
    stages: [
      {
        stageNum: 1,
        dayOfWeek: 'Sunday',
        dateStr: 'Oct 4',
        name: 'NYC to Poughkeepsie, NY (High-Tempo Opener)',
        distanceMiles: 95.0,
        elevationFt: 3000,
        surface: 'Hudson River Greenway, South/North County Trailways, Maybrook & Dutchess Rail Trails',
        overnight: 'Poughkeepsie Grand Hotel / DoubleTree',
        cues: [
          { mile: 0.0, dist: 13.2, icon: '⬆', type: 'start', action: 'DEPART NORTH', road: 'Battery Park to Dyckman St', detail: 'Full-length Hudson River Greenway sprint past GWB.', surface: 'Paved Greenway', poi: 'Battery Park to GWB' },
          { mile: 13.2, dist: 3.0, icon: '↱', type: 'right', action: 'TURN RIGHT', road: 'Dyckman to Broadway & Bronx', detail: 'Cross Broadway Bridge and enter Van Cortlandt Park.', surface: 'City Streets', poi: 'Harlem River Ship Canal' },
          { mile: 16.2, dist: 22.0, icon: '⬆', type: 'straight', action: 'SPRINT TRAILWAY', road: 'South & North County Trailways', detail: 'Fast paceline on continuous paved Westchester rail trails.', surface: 'Paved Rail Trail', poi: 'Westchester County' },
          { mile: 38.2, dist: 10.2, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'Yorktown Heights Depot (Trailside Cafe)', detail: 'Quick 25-minute nutrition stop on the rail trail.', surface: 'Paved Rail Trail', poi: '🥪 Quick Fuel Stop' },
          { mile: 48.4, dist: 11.6, icon: '⬆', type: 'straight', action: 'CONTINUE THROUGH', road: 'Putnam Trailway to Brewster', detail: 'Baldwin Place through Mahopac to Brewster rail junction.', surface: 'Paved Rail Trail', poi: 'Putnam Trailway' },
          { mile: 60.0, dist: 21.0, icon: '⬆', type: 'straight', action: 'JOIN MAYBROOK', road: 'Maybrook Trailway to Hopewell Jct', detail: 'Fast, smooth paved rail corridor through Dutchess woods.', surface: 'Paved Rail Trail', poi: 'Maybrook Railbed' },
          { mile: 81.0, dist: 14.0, icon: '⬆', type: 'straight', action: 'MERGE DUTCHESS', road: 'Dutchess Rail Trail into Poughkeepsie', detail: 'Continuous paved trail right to Poughkeepsie city limits.', surface: 'Paved Rail Trail', poi: 'Dutchess Rail Trail' },
          { mile: 95.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Poughkeepsie, NY', detail: 'Poughkeepsie Grand Hotel. ⚡ (Option to push to Kingston: 125 mi total).', surface: 'City Street', poi: '🏨 Poughkeepsie Finish • Ⓜ️ Metro-North Terminus' }
        ]
      },
      {
        stageNum: 2,
        dayOfWeek: 'Monday',
        dateStr: 'Oct 5',
        name: 'Poughkeepsie to Troy, NY (East-Bank Century Push)',
        distanceMiles: 85.0,
        elevationFt: 2500,
        surface: 'Route 9G, Scenic River Rd, Historic Hudson, 36-mile Paved AHET Trail',
        overnight: 'Best Western Plus Franklin Square Inn Troy',
        cues: [
          { mile: 95.0, dist: 17.0, icon: '⬆', type: 'start', action: 'DEPART NORTH', road: 'Route 9G North (Poughkeepsie to Rhinebeck)', detail: 'Rolling hills with wide paved shoulders on east bank.', surface: 'Highway Shoulder', poi: 'East Bank Byway' },
          { mile: 112.0, dist: 26.0, icon: '⬆', type: 'straight', action: 'CRUISE THROUGH', road: 'River Rd & Route 9G to Hudson', detail: 'Rolling estate country and Germantown orchards.', surface: 'Country Roads', poi: 'Germantown Orchards' },
          { mile: 138.0, dist: 1.0, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'Warren Street, Hudson, NY', detail: 'Le Gamin Cafe / Tanzy\'s. Quick espresso and savory crepes.', surface: 'City Street', poi: '🥪 Lunch: Hudson Warren St' },
          { mile: 139.0, dist: 36.0, icon: '⬆', type: 'straight', action: 'HAMMER AHET', road: 'Albany-Hudson Electric Trail (AHET)', detail: '36 continuous miles of paved off-road trailway to Rensselaer.', surface: 'Paved Rail Trail', poi: '⚡ 36-Mi High Speed Trail' },
          { mile: 175.0, dist: 5.0, icon: '⬆', type: 'straight', action: 'CROSS TO TROY', road: 'Rensselaer into Downtown Troy', detail: 'Follow riverfront bike path directly across into historic Troy.', surface: 'City Bike Lanes', poi: 'Hudson River Confluence' },
          { mile: 180.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Troy, NY (Franklin Square)', detail: 'Franklin Square Inn Troy. ⚡ (Option to push to Saratoga: 105 mi total).', surface: 'City Street', poi: '🏨 Franklin Square Inn • Troy Riverfront' }
        ]
      },
      {
        stageNum: 3,
        dayOfWeek: 'Tuesday',
        dateStr: 'Oct 6',
        name: 'Troy to Ticonderoga, NY (Canal Corridor to Adirondacks)',
        distanceMiles: 87.0,
        elevationFt: 2500,
        surface: 'Mohawk-Hudson Path, US-4, Champlain Canalway Trail, NY-22',
        overnight: 'Best Western Plus Ticonderoga',
        cues: [
          { mile: 180.0, dist: 6.0, icon: '⬆', type: 'start', action: 'DEPART NORTH', road: 'Mohawk-Hudson Path to Waterford', detail: 'Ride riverfront path past Waterford Canal Lock 2.', surface: 'Paved Greenway', poi: 'Waterford Lock 2' },
          { mile: 186.0, dist: 38.0, icon: '⬆', type: 'straight', action: 'US-4 NORTH', road: 'Schuylerville, Fort Edward & Fort Ann', detail: 'Paved highway shoulder tracing historic Champlain Canal.', surface: 'Highway Shoulder', poi: 'Champlain Canal Corridor' },
          { mile: 224.0, dist: 1.0, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'Historic Grounds, Whitehall Lock 12', detail: 'Mid-day carb reload overlooking historic canal lock.', surface: 'Canal Harbor', poi: '🥪 Lunch: Whitehall Lock 12' },
          { mile: 225.0, dist: 42.0, icon: '↰', type: 'left', action: 'HAMMER NY-22', road: 'NY-22 North to Ticonderoga', detail: 'Rolling climbs flanking South Bay and Lake Champlain.', surface: 'Highway Shoulder', poi: 'Lake Champlain Bluffs' },
          { mile: 267.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Ticonderoga, NY', detail: 'Best Western Plus Ticonderoga. ⚡ (Option to push to Essex: 105 mi total).', surface: 'Town Street', poi: '🏨 Best Western Plus Ticonderoga' }
        ]
      },
      {
        stageNum: 4,
        dayOfWeek: 'Wednesday',
        dateStr: 'Oct 7',
        name: 'Ticonderoga to Plattsburgh, NY (Queen Stage)',
        distanceMiles: 70.0,
        elevationFt: 4000,
        surface: 'NY-9N / NY-22 Adirondack Coastline, US-9 Shoreline',
        overnight: 'Best Western Plus Plattsburgh',
        cues: [
          { mile: 267.0, dist: 38.0, icon: '⬆', type: 'start', action: 'DEPART NORTH', road: 'Crown Point, Port Henry & Westport', detail: 'Challenging coastal climbs with stunning Vermont views.', surface: 'Highway Shoulder', poi: 'Adirondack Bluffs' },
          { mile: 305.0, dist: 1.0, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'The Cup Cafe, Historic Essex, NY', detail: 'Porch dining at ferry dock. Fill all water bottles.', surface: 'Harbor Dock', poi: '🥪 Lunch: Essex Ferry Dock' },
          { mile: 306.0, dist: 20.0, icon: '⬆', type: 'straight', action: 'CLIMB INLAND', road: 'Willsboro, Keeseville & Ausable Chasm', detail: 'Steep rollers through Ausable pine forest and gorge.', surface: 'Highway Shoulder', poi: 'Ausable Chasm Gorge' },
          { mile: 326.0, dist: 11.0, icon: '↱', type: 'right', action: 'FLAT SPRINT', road: 'US-9 North into Plattsburgh', detail: 'High-speed paceline along shoreline into town.', surface: 'Highway Shoulder', poi: 'Plattsburgh Approach' },
          { mile: 337.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Plattsburgh, NY', detail: 'Best Western Plus Plattsburgh. Carb up for final border sprint!', surface: 'City Highway', poi: '🏨 Best Western Plus Plattsburgh' }
        ]
      },
      {
        stageNum: 5,
        dayOfWeek: 'Thursday',
        dateStr: 'Oct 8',
        name: 'Plattsburgh to Montréal, QC (Victory Arrival!)',
        distanceMiles: 88.0,
        elevationFt: 1200,
        surface: 'US-9, Rouses Point, QC-223 Richelieu River, Chambly Canal, Route Verte 1',
        overnight: 'Hotel Monville, Old Montréal',
        cues: [
          { mile: 337.0, dist: 24.0, icon: '⬆', type: 'start', action: 'NORTH SPRINT', road: 'US-9 North to Rouses Point, NY', detail: 'Flat, fast morning paceline to northern border.', surface: 'Highway Shoulder', poi: 'US Border Town' },
          { mile: 361.0, dist: 1.0, icon: '🛂', type: 'border', action: 'BORDER CUSTOMS', road: 'Lacolle / QC-223 International Booth', detail: 'Passports ready! Vehicle booth clearance into Quebec.', surface: 'Border Facility', poi: '🇨🇦 Canada Customs Clearance' },
          { mile: 362.0, dist: 22.0, icon: '⬆', type: 'straight', action: 'CRUISE RICHELIEU', road: 'QC-223 North (Route du Richelieu)', detail: 'Flat, peaceful riverside road into Saint-Jean.', surface: 'Rural Highway', poi: 'Richelieu River' },
          { mile: 384.0, dist: 1.0, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'Bistro La Trinquette, Saint-Jean', detail: 'Crepes & cider right at start of Chambly Canal.', surface: 'Riverfront', poi: '🥪 Lunch: Saint-Jean' },
          { mile: 385.0, dist: 13.0, icon: '⬆', type: 'straight', action: 'CAR-FREE CANAL', road: 'Chambly Canal National Historic Towpath', detail: 'Flat gravel/paved path past historic stone locks.', surface: 'Canal Towpath', poi: 'Chambly Canal Towpath' },
          { mile: 398.0, dist: 22.0, icon: '↰', type: 'left', action: 'ROUTE VERTE 1', road: 'Longueuil to Jacques-Cartier Bridge', detail: 'Follow greenway network across St. Lawrence River.', surface: 'Cycle Track', poi: 'Bridge into Montréal' },
          { mile: 420.0, dist: 5.0, icon: '⬆', type: 'straight', action: 'OLD PORT ENTRY', road: 'Quais du Vieux-Port to Place Jacques-Cartier', detail: 'Cobblestone promenade finish in historic center.', surface: 'Cobblestone', poi: 'Vieux-Port Promenade' },
          { mile: 425.0, dist: 0.0, icon: '🏁', type: 'finish', action: 'TOUR VICTORY', road: 'Place Jacques-Cartier, Old Montréal', detail: 'Tour Complete! Thursday evening celebration in Quebec.', surface: 'Historic Plaza', poi: '🎉 TOUR FINISH: Old Montréal' }
        ]
      }
    ]
  },

  '7day': {
    id: '7day',
    code: '7D',
    color: '#E11D48', // MTA Ruby Rose
    accentColor: '#be123c',
    badgeText: 'MTA ROUTE 7D',
    title: '7-Day Gentler Tour',
    subtitle: 'NYC ➔ Brewster ➔ Hudson ➔ Saratoga ➔ Ticonderoga ➔ Plattsburgh ➔ Saint-Jean ➔ Montréal',
    schedule: 'Sunday, Oct 4 ➔ Saturday, Oct 10 (7 Days)',
    totalMiles: '445.0',
    totalKm: '716.2',
    elevationGain: '+14,500 ft',
    avgDaily: '63.6 mi/day',
    pace: 'Gentle Leisure Touring (12–14 mph rolling)',
    finishDay: 'Saturday Mid-Day Victory Lap into Old Montréal',
    stages: [
      {
        stageNum: 1,
        dayOfWeek: 'Sunday',
        dateStr: 'Oct 4',
        name: 'NYC (Battery Park) to Brewster / Carmel, NY',
        distanceMiles: 60.0,
        elevationFt: 2000,
        surface: 'Hudson River Greenway, Bronx Links, South & North County Trailways, Putnam Trailway',
        overnight: "Heidi's Inn / Comfort Inn Brewster",
        cues: [
          { mile: 0.0, dist: 13.2, icon: '⬆', type: 'start', action: 'DEPART NORTH', road: 'Battery Park to Dyckman St', detail: 'Hudson River Greenway past Chelsea Piers, GWB & Little Red Lighthouse.', surface: 'Paved Greenway', poi: 'Hudson Greenway' },
          { mile: 13.2, dist: 3.0, icon: '↱', type: 'right', action: 'TURN RIGHT', road: 'Dyckman to Broadway & Bronx', detail: 'Cross Broadway Bridge and enter Van Cortlandt Park.', surface: 'City Streets', poi: 'Van Cortlandt Park' },
          { mile: 16.2, dist: 22.0, icon: '⬆', type: 'straight', action: 'ENTER TRAILWAY', road: 'South & North County Trailways', detail: 'Continuous paved rail trail through Westchester County.', surface: 'Paved Rail Trail', poi: 'Westchester Green Corridor' },
          { mile: 38.2, dist: 10.2, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'Trailside Cafe, Yorktown Heights', detail: 'Gourmet lunch directly on the trailway.', surface: 'Paved Rail Trail', poi: '🥪 Lunch: Trailside Cafe' },
          { mile: 48.4, dist: 11.6, icon: '⬆', type: 'straight', action: 'TRANSITION', road: 'Putnam County Trailway', detail: 'Scenic rail trail skirting Lake Mahopac directly into Brewster.', surface: 'Paved Rail Trail', poi: 'Lake Mahopac' },
          { mile: 60.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Brewster / Carmel, NY', detail: 'Heidi\'s Inn / Comfort Inn Brewster. Metro-North Harlem Line.', surface: 'Town Street', poi: '🏨 Heidi\'s Inn • Ⓜ️ Metro-North' }
        ]
      },
      {
        stageNum: 2,
        dayOfWeek: 'Monday',
        dateStr: 'Oct 5',
        name: 'Brewster to Hudson, NY',
        distanceMiles: 78.0,
        elevationFt: 3000,
        surface: 'Maybrook Trailway, Dutchess Rail Trail, Route 9G & River Road',
        overnight: 'The Barlow Hotel / The Wick Hudson',
        cues: [
          { mile: 60.0, dist: 21.0, icon: '⬆', type: 'start', action: 'MAYBROOK TRAILWAY', road: 'Brewster to Hopewell Junction', detail: 'Paved railbed through forested Dutchess County.', surface: 'Paved Rail Trail', poi: 'Maybrook Corridor' },
          { mile: 81.0, dist: 13.5, icon: '⬆', type: 'straight', action: 'DUTCHESS RAIL TRAIL', road: 'Hopewell Jct to Poughkeepsie', detail: 'Paved trail directly to Poughkeepsie. (Optional Walkway detour).', surface: 'Paved Rail Trail', poi: 'Dutchess Trailway' },
          { mile: 94.5, dist: 17.5, icon: '↰', type: 'left', action: 'ROUTE 9G NORTH', road: 'Violet Ave into Rhinebeck', detail: 'Rolling hills past historic Hyde Park estates.', surface: 'Highway Shoulder', poi: 'East Bank Route 9G' },
          { mile: 112.0, dist: 5.5, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'Market St, Historic Rhinebeck', detail: 'Rhinebeck Bagel / cafes on vibrant village street.', surface: 'Village Center', poi: '🥪 Lunch: Rhinebeck' },
          { mile: 117.5, dist: 20.5, icon: '↰', type: 'bear-left', action: 'RIVER ROAD & 9G', road: 'River Rd through Germantown to Hudson', detail: 'Quiet country lanes and apple orchards into Warren St.', surface: 'Scenic Country Road', poi: 'River Road & Orchards' },
          { mile: 138.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Hudson, NY (Warren Street)', detail: 'The Barlow Hotel / The Wick. 🚆 Amtrak Hudson Station.', surface: 'City Street', poi: '🏨 The Barlow Hotel • 🚆 Amtrak' }
        ]
      },
      {
        stageNum: 3,
        dayOfWeek: 'Tuesday',
        dateStr: 'Oct 6',
        name: 'Hudson to Saratoga Springs, NY',
        distanceMiles: 75.0,
        elevationFt: 2000,
        surface: 'Albany-Hudson Electric Trail (AHET), Mohawk-Hudson Path, Zim Smith Trail',
        overnight: 'The Saratoga Hilton',
        cues: [
          { mile: 138.0, dist: 36.0, icon: '⬆', type: 'start', action: 'DEPART AHET', road: 'Albany-Hudson Electric Trail', detail: '36 continuous miles of paved off-road pathway to Rensselaer.', surface: 'Paved Rail Trail', poi: 'AHET Trailway' },
          { mile: 174.0, dist: 8.0, icon: '↰', type: 'left', action: 'CROSS HUDSON', road: 'Dunn Memorial Bridge & Mohawk-Hudson Path', detail: 'Bridge into Albany, north along Corning Preserve greenway.', surface: 'Paved Greenway', poi: 'Albany Riverfront' },
          { mile: 182.0, dist: 3.0, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'Troy / Waterford Lock 2 Harbor', detail: 'Placid Baker / Whistling Kettle overlooking canal locks.', surface: 'Canal Harbor', poi: '🥪 Lunch: Waterford Lock 2' },
          { mile: 185.0, dist: 22.0, icon: '↰', type: 'left', action: 'ZIM SMITH TRAIL', road: 'Waterford to Ballston Spa', detail: 'Smooth paved trail through Round Lake into Ballston Spa.', surface: 'Paved Rail Trail', poi: 'Zim Smith Trail' },
          { mile: 207.0, dist: 6.0, icon: '↰', type: 'left', action: 'BROADWAY ENTRY', road: 'Broadway into Saratoga Springs', detail: 'Wide boulevard past Saratoga Spa State Park into downtown.', surface: 'City Boulevard', poi: 'Saratoga Spa Park' },
          { mile: 213.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Saratoga Springs, NY', detail: 'The Saratoga Hilton / Holiday Inn. 🚆 Amtrak Saratoga Station.', surface: 'City Street', poi: '🏨 The Saratoga Hilton' }
        ]
      },
      {
        stageNum: 4,
        dayOfWeek: 'Wednesday',
        dateStr: 'Oct 7',
        name: 'Saratoga Springs to Ticonderoga, NY',
        distanceMiles: 75.0,
        elevationFt: 2500,
        surface: 'NY-29, Champlain Canalway Trail, US-4, NY-22',
        overnight: 'Best Western Plus Ticonderoga',
        cues: [
          { mile: 213.0, dist: 11.0, icon: '⬆', type: 'start', action: 'DEPART EAST', road: 'NY-29 to Schuylerville', detail: 'Rolling farmland toward Hudson River and Saratoga Battlefield.', surface: 'Road Shoulder', poi: 'Saratoga Battlefield' },
          { mile: 224.0, dist: 33.0, icon: '↰', type: 'left', action: 'CHAMPLAIN CANAL', road: 'US-4 North to Whitehall', detail: 'Canal corridor past Fort Edward and Fort Ann locks.', surface: 'Highway Shoulder', poi: 'Champlain Canal Locks' },
          { mile: 257.0, dist: 1.0, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'Historic Grounds, Whitehall Lock 12', detail: 'Hearty meal overlooking canal lock. Full water resupply.', surface: 'Canal Harbor', poi: '🥪 Lunch: Whitehall Lock 12' },
          { mile: 258.0, dist: 30.0, icon: '↰', type: 'left', action: 'NY-22 NORTH', road: 'Whitehall to Ticonderoga', detail: 'Rolling climbs flanking South Bay and Lake Champlain.', surface: 'Highway Shoulder', poi: 'Lake Champlain Bluffs' },
          { mile: 288.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Ticonderoga, NY', detail: 'Best Western Plus Ticonderoga. Full-service dining on site.', surface: 'Town Street', poi: '🏨 Best Western Plus Ticonderoga' }
        ]
      },
      {
        stageNum: 5,
        dayOfWeek: 'Thursday',
        dateStr: 'Oct 8',
        name: 'Ticonderoga to Plattsburgh, NY (Queen Stage)',
        distanceMiles: 70.0,
        elevationFt: 4000,
        surface: 'NY-9N / NY-22 Adirondack Coastline, US-9 Shoreline',
        overnight: 'Best Western Plus Plattsburgh',
        cues: [
          { mile: 288.0, dist: 38.0, icon: '⬆', type: 'start', action: 'DEPART COAST', road: 'Crown Point, Port Henry, Westport', detail: 'Adirondack coastal bluffs overlooking Green Mountains.', surface: 'Highway Shoulder', poi: 'Crown Point Bridge' },
          { mile: 326.0, dist: 1.0, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'The Cup Cafe, Historic Essex, NY', detail: 'Porch dining overlooking ferry dock to Vermont. Fill bottles.', surface: 'Harbor Dock', poi: '🥪 Lunch: Essex Ferry Dock' },
          { mile: 327.0, dist: 19.0, icon: '⬆', type: 'straight', action: 'CLIMB INLAND', road: 'Willsboro & Keeseville', detail: 'Challenging rollers through Ausable pine forest.', surface: 'Highway Shoulder', poi: 'Adirondack Rollers' },
          { mile: 346.0, dist: 4.0, icon: '🌊', type: 'poi', action: 'CROSS GORGE', road: 'Ausable Chasm Bridge', detail: 'Spectacular stone gorge and waterfall crossing.', surface: 'Bridge Shoulder', poi: '🌊 Ausable Chasm Gorge' },
          { mile: 350.0, dist: 8.0, icon: '↱', type: 'right', action: 'US-9 NORTH', road: 'Shoreline road into Plattsburgh', detail: 'Flat finish into city lodging district.', surface: 'Highway Shoulder', poi: 'Plattsburgh Approach' },
          { mile: 358.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Plattsburgh, NY', detail: 'Best Western Plus Plattsburgh. Relaxed evening before border day.', surface: 'City Highway', poi: '🏨 Best Western Plus Plattsburgh' }
        ]
      },
      {
        stageNum: 6,
        dayOfWeek: 'Friday',
        dateStr: 'Oct 9',
        name: 'Plattsburgh to Saint-Jean-sur-Richelieu, QC (Border Day)',
        distanceMiles: 50.0,
        elevationFt: 800,
        surface: 'US-9, Rouses Point, QC-223 along Richelieu River',
        overnight: 'Quality Hotel Centre de Congrès Saint-Jean',
        cues: [
          { mile: 358.0, dist: 24.0, icon: '⬆', type: 'start', action: 'DEPART NORTH', road: 'US-9 North to Rouses Point', detail: 'Leisurely flat morning roll through Lake Champlain orchard country.', surface: 'Highway Shoulder', poi: 'Champlain Farmland' },
          { mile: 382.0, dist: 2.5, icon: '⬆', type: 'straight', action: 'PASS THROUGH', road: 'Rouses Point, NY', detail: 'Final US town. 🚆 Amtrak carry-on bike service ends here.', surface: 'Town Street', poi: 'Rouses Point Marina' },
          { mile: 384.5, dist: 0.5, icon: '🛂', type: 'border', action: 'BORDER CUSTOMS', road: 'Lacolle / QC-223 International Booth', detail: 'Zero-rush border inspection. Stop at vehicle booth with passport.', surface: 'Border Facility', poi: '🇨🇦 Canada Customs Clearance' },
          { mile: 385.0, dist: 22.0, icon: '⬆', type: 'straight', action: 'RIVER ROAD', road: 'QC-223 North (Route du Richelieu)', detail: 'Peaceful, pastoral riverside riding. Farm stands and heritage barns.', surface: 'Rural Highway', poi: 'Richelieu River Heritage' },
          { mile: 407.0, dist: 1.0, icon: '🥪', type: 'lunch', action: 'LUNCH / FINISH', road: 'Saint-Jean-sur-Richelieu, QC', detail: 'Bistro La Trinquette / Old Saint-Jean. Overnight at Quality Hotel.', surface: 'Riverfront Street', poi: '🏨 Quality Hotel • 🥪 Bistro La Trinquette' },
          { mile: 408.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Saint-Jean-sur-Richelieu, QC', detail: 'Relaxed afternoon strolling canal locks, craft breweries, French dinner.', surface: 'Town Street', poi: '🎉 Relaxed Border Evening in Quebec' }
        ]
      },
      {
        stageNum: 7,
        dayOfWeek: 'Saturday',
        dateStr: 'Oct 10',
        name: 'Saint-Jean-sur-Richelieu to Montréal, QC (Victory Lap!)',
        distanceMiles: 37.0,
        elevationFt: 600,
        surface: 'Chambly Canal National Historic Towpath, Route Verte 1, Jacques-Cartier Bridge',
        overnight: 'Hotel Monville / Weekend in Montréal',
        cues: [
          { mile: 408.0, dist: 12.0, icon: '⬆', type: 'start', action: 'ENTER TOWPATH', road: 'Chambly Canal Historic Towpath', detail: 'Car-free morning glide along tranquil historic canal towpath.', surface: 'Canal Towpath', poi: 'Chambly Canal Towpath' },
          { mile: 420.0, dist: 1.0, icon: '🏰', type: 'poi', action: 'PASS FORTRESS', road: 'Fort Chambly National Historic Site', detail: 'Pass stone battlements of Fort Chambly on the river basin.', surface: 'Paved Park Path', poi: '🏰 Fort Chambly Fortress' },
          { mile: 421.0, dist: 12.0, icon: '↰', type: 'left', action: 'ROUTE VERTE 1', road: 'Longueuil / Saint-Lambert Greenways', detail: 'Signed, dedicated multi-use cycle path network toward St. Lawrence River.', surface: 'Paved Cycle Track', poi: 'Route Verte 1 Cycle Track' },
          { mile: 433.0, dist: 5.0, icon: '↱', type: 'right', action: 'CROSS BRIDGE', road: 'Jacques-Cartier Bridge Cycle Track', detail: 'Cross St. Lawrence River with iconic skyline view of Montréal.', surface: 'Bridge Cycle Track', poi: '🌉 St. Lawrence River & Skyline' },
          { mile: 438.0, dist: 7.0, icon: '⬆', type: 'straight', action: 'OLD PORT ENTRY', road: 'Quais du Vieux-Port', detail: 'Cobblestone promenade into Place Jacques-Cartier for noon victory celebration!', surface: 'Historic Cobblestone', poi: 'Vieux-Port Promenade' },
          { mile: 445.0, dist: 0.0, icon: '🏁', type: 'finish', action: 'TOUR VICTORY', road: 'Place Jacques-Cartier, Old Montréal', detail: 'Grand Tour Victory! Arrive in time for celebratory French lunch and weekend exploring.', surface: 'Historic Plaza', poi: '🎉 TOUR FINISH: Old Montréal' }
        ]
      }
    ]
  },

  'vermont': {
    id: 'vermont',
    code: 'VT',
    color: '#059669', // MTA Forest Emerald
    accentColor: '#047857',
    badgeText: 'MTA ROUTE VT',
    title: 'Vermont Champlain Islands Upgrade Variant',
    subtitle: 'Essex Ferry ➔ Burlington ➔ Island Line Colchester Causeway ➔ Champlain Islands ➔ Saint-Jean',
    schedule: 'Alternative Days 5 & 6 (Scenic Upgrade)',
    totalMiles: '455.0',
    totalKm: '732.2',
    elevationGain: '+13,200 ft',
    avgDaily: '75.8 mi/day',
    pace: 'Premier Scenic Touring (14–16 mph rolling)',
    finishDay: 'Friday Arrival via Champlain Islands & Chambly Canal',
    stages: [
      {
        stageNum: 'VT-1',
        dayOfWeek: 'Alternative Day 5',
        dateStr: 'Oct 8',
        name: 'Ticonderoga, NY ➔ Essex Ferry ➔ Burlington, VT',
        distanceMiles: 53.0,
        elevationFt: 2200,
        surface: 'NY-9N/22, Essex-Charlotte Ferry ($6.25), Greenbush Rd, Burlington Greenway',
        overnight: 'Hotel Vermont / Courtyard Burlington Harbor',
        cues: [
          { mile: 288.0, dist: 9.0, icon: '⬆', type: 'start', action: 'DEPART NORTH', road: 'NY-9N / NY-22 along Lake Champlain', detail: 'Lake bluffs past Crown Point toward Essex ferry slip.', surface: 'Highway Shoulder', poi: 'Crown Point Bridge' },
          { mile: 297.0, dist: 19.0, icon: '⬆', type: 'straight', action: 'COASTAL BLUFFS', road: 'Port Henry & Westport', detail: 'Adirondack coastal roads overlooking Vermont Green Mountains.', surface: 'Highway Shoulder', poi: 'Lake Champlain Bluffs' },
          { mile: 316.0, dist: 10.0, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'The Cup Cafe, Historic Essex, NY', detail: 'Porch dining directly overlooking ferry dock before boarding.', surface: 'Harbor Village', poi: '🥪 Lunch: The Cup Cafe Essex' },
          { mile: 326.0, dist: 3.0, icon: '⛴️', type: 'ferry', action: 'BOARD FERRY', road: 'Essex, NY ➔ Charlotte, VT Ferry', detail: 'Lake Champlain Transportation Co. ferry ($6.25/cyclist, hourly daily). 20-min crossing.', surface: 'Open Car Deck', poi: '⛴️ 20-Min Ferry Across Lake' },
          { mile: 329.0, dist: 10.0, icon: '⬆', type: 'straight', action: 'WELCOME TO VT', road: 'Ferry Rd & Greenbush Road', detail: 'Roll through gentle pastoral Vermont countryside toward Shelburne.', surface: 'Paved Country Road', poi: '🌲 Green Mountain Vistas' },
          { mile: 339.0, dist: 2.0, icon: '↰', type: 'left', action: 'JOIN GREENWAY', road: 'Burlington Greenway (Island Line)', detail: 'Dedicated paved cycle path along Lake Champlain shoreline into downtown.', surface: 'Paved Cycle Track', poi: 'Burlington Waterfront' },
          { mile: 341.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Burlington, VT (Cherry Street)', detail: 'Hotel Vermont (dedicated bike room). World-class craft beers at Foam Brewers.', surface: 'City Waterfront', poi: '🏨 Hotel Vermont • 🍻 Foam Brewers' }
        ]
      },
      {
        stageNum: 'VT-2',
        dayOfWeek: 'Alternative Day 6',
        dateStr: 'Oct 9',
        name: 'Burlington ➔ Colchester Causeway ➔ Champlain Islands ➔ Saint-Jean, QC',
        distanceMiles: 58.0,
        elevationFt: 900,
        surface: 'Island Line Trail, Colchester Causeway, Bike Ferry, Grand Isle, North Hero, US-2, QC-225',
        overnight: 'Quality Hotel Saint-Jean / Option into Montréal',
        cues: [
          { mile: 341.0, dist: 5.0, icon: '⬆', type: 'start', action: 'DEPART NORTH', road: 'Burlington Greenway', detail: 'Ride north past North Beach through Delta Park.', surface: 'Paved Cycle Track', poi: 'Burlington Waterfront' },
          { mile: 346.0, dist: 3.0, icon: '🌊', type: 'poi', action: 'ENTER CAUSEWAY', road: 'Colchester Causeway (Island Line)', detail: 'Ride 3 miles into the center of Lake Champlain on historic marble railway embankment.', surface: 'Crushed Limestone', poi: '🌊 3-Mile Open Lake Causeway' },
          { mile: 349.0, dist: 0.5, icon: '⛴️', type: 'ferry', action: 'BIKE FERRY', road: 'Local Motion Bike Ferry ("The Cut")', detail: 'Cross 200-ft gap to South Hero. (Fall bypass: Route 127 + US-2 Sandbar causeway +14 mi).', surface: 'Bike Ferry Boat', poi: '⛴️ Local Motion Bike Ferry' },
          { mile: 349.5, dist: 13.5, icon: '⬆', type: 'straight', action: 'CHAMPLAIN ISLANDS', road: 'South Hero & Grand Isle (US-2)', detail: 'Tranquil island cycling past apple orchards, vineyards, and lake views.', surface: 'Paved Island Highway', poi: '🍎 Champlain Island Orchards' },
          { mile: 363.0, dist: 1.0, icon: '🥪', type: 'lunch', action: 'LUNCH STOP', road: 'Hero\'s Welcome General Store & Cafe', detail: '3537 US-2, North Hero, VT. Gourmet dockside deli, fresh cider donuts.', surface: 'Island Harbor', poi: '🥪 Lunch: Hero\'s Welcome Dock' },
          { mile: 364.0, dist: 14.0, icon: '⬆', type: 'straight', action: 'ALBURGH PENINSULA', road: 'US-2 North to Alburgh & Route 225', detail: 'Flat, quiet roads toward the Canadian border at Noyan.', surface: 'Rural Road', poi: 'Alburgh Peninsula' },
          { mile: 378.0, dist: 0.5, icon: '🛂', type: 'border', action: 'BORDER CUSTOMS', road: 'Noyan / Clarenceville Customs (QC-225)', detail: 'Direct border crossing into Quebec. Low vehicle traffic, roll up to inspection booth.', surface: 'Border Facility', poi: '🇨🇦 Canada Customs (Noyan)' },
          { mile: 378.5, dist: 20.5, icon: '⬆', type: 'straight', action: 'RIVER APPROACH', road: 'QC-225 & QC-223 North to Saint-Jean', detail: 'Quiet French country roads connecting to the Richelieu River into Saint-Jean.', surface: 'Rural Paved Road', poi: 'Richelieu River Basin' },
          { mile: 399.0, dist: 0.0, icon: '🚏', type: 'terminus', action: 'ARRIVE TERMINUS', road: 'Saint-Jean-sur-Richelieu, QC', detail: 'Quality Hotel Centre de Congrès. Rejoin standard route for final 37 mi into Montréal.', surface: 'Town Street', poi: '🏨 Quality Hotel Saint-Jean • Rejoin Route' }
        ]
      }
    ]
  }
};

// Active Route Map State
let currentMtaItineraryId = '6day';

/* ============================================================
   MTA ROUTE MAP TAB SWITCHING & RENDERING
============================================================ */
function switchMtaRouteTab(itineraryId) {
  currentMtaItineraryId = itineraryId;

  // Update tabs active state
  ['6day', '5day', '7day', 'vermont'].forEach(id => {
    const tabEl = document.getElementById(`mta-tab-${id}`);
    if (tabEl) {
      if (id === itineraryId) {
        tabEl.className = "px-3.5 py-2 text-xs font-black rounded-xl bg-slate-950 text-white shadow-sm transition-all flex items-center gap-1.5 ring-2 ring-slate-800";
      } else {
        tabEl.className = "px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5";
      }
    }
  });

  renderMtaRouteMap(itineraryId);
}

function renderMtaRouteMap(itineraryId) {
  const container = document.getElementById('mta-route-map-content');
  if (!container) return;

  const data = MTA_ITINERARIES[itineraryId];
  if (!data) return;

  let stagesHtml = '';
  data.stages.forEach(stage => {
    let cuesHtml = '';
    stage.cues.forEach(cue => {
      let iconBadgeClass = "bg-slate-900 text-white";
      if (cue.type === 'start' || cue.type === 'terminus' || cue.type === 'finish') {
        iconBadgeClass = "bg-black text-white ring-4 ring-slate-200";
      } else if (cue.type === 'lunch') {
        iconBadgeClass = "bg-orange-600 text-white ring-2 ring-orange-200";
      } else if (cue.type === 'border') {
        iconBadgeClass = "bg-emerald-700 text-white ring-2 ring-emerald-200";
      } else if (cue.type === 'ferry') {
        iconBadgeClass = "bg-sky-600 text-white ring-2 ring-sky-200";
      }

      cuesHtml += `
        <div class="relative pl-8 pb-5 group transition-all">
          <!-- The Single Continuous Black Line Tick / Station Node -->
          <div class="absolute left-[11px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-black z-10 group-hover:scale-125 transition-transform"></div>
          
          <div class="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-2xs transition-all space-y-1">
            <div class="flex flex-wrap items-center justify-between gap-1 text-[11px]">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full ${iconBadgeClass} font-mono font-bold flex items-center justify-center text-xs shrink-0">
                  ${cue.icon}
                </span>
                <span class="font-mono font-black text-slate-950 text-xs">MILE ${cue.mile.toFixed(1)}</span>
                ${cue.dist > 0 ? `<span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">+${cue.dist.toFixed(1)} mi</span>` : ''}
              </div>
              <span class="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                ${cue.surface}
              </span>
            </div>

            <div class="pt-0.5">
              <div class="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span class="text-blue-700 font-extrabold">${cue.action}:</span>
                <span>${cue.road}</span>
              </div>
              <p class="text-[11px] text-slate-600 leading-snug mt-0.5">${cue.detail}</p>
              ${cue.poi ? `<div class="mt-1 text-[10px] font-bold text-slate-800 flex items-center gap-1"><span>📍</span> ${cue.poi}</div>` : ''}
            </div>
          </div>
        </div>
      `;
    });

    stagesHtml += `
      <!-- Stage Strip Block -->
      <div class="bg-white rounded-2xl border-2 border-slate-900 shadow-sm overflow-hidden mta-stage-block break-inside-avoid">
        <!-- Stage Masthead -->
        <div class="bg-slate-950 text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-white text-black font-mono font-black flex items-center justify-center text-base shadow-inner">
              ${stage.stageNum}
            </div>
            <div>
              <div class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">${stage.dayOfWeek} &bull; ${stage.dateStr}</div>
              <h3 class="text-sm font-black text-white">${stage.name}</h3>
            </div>
          </div>
          <div class="flex items-center gap-2 text-xs font-mono font-bold shrink-0">
            <span class="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700">🚴 ${stage.distanceMiles} MI</span>
            <span class="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700">⛰️ +${stage.elevationFt} FT</span>
          </div>
        </div>

        <!-- Stage Route & Lodging Banner -->
        <div class="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-700 font-medium">
          <div><strong class="text-slate-900">Surface:</strong> ${stage.surface}</div>
          <div><strong class="text-slate-900">Overnight:</strong> ${stage.overnight}</div>
        </div>

        <!-- Turn-by-Turn Linear Strip with The Single Black Line -->
        <div class="p-4 relative">
          <!-- The Continuous Black Line Backbone -->
          <div class="absolute left-[31px] top-6 bottom-6 w-1 bg-black z-0"></div>

          <div class="space-y-0 relative z-10">
            ${cuesHtml}
          </div>
        </div>
      </div>
    `;
  });

  // Render complete HTML for this itinerary
  container.innerHTML = `
    <!-- MTA Timetable Masthead -->
    <div class="bg-slate-950 text-white rounded-2xl p-5 sm:p-6 border-4 border-black shadow-lg space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-800 pb-4">
        <div class="flex items-start sm:items-center gap-3.5">
          <div class="w-14 h-14 rounded-full bg-white text-slate-950 font-black text-2xl flex items-center justify-center font-mono shadow-md border-2 border-black shrink-0">
            ${data.code}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-black uppercase tracking-widest bg-slate-800 text-slate-200 px-2.5 py-0.5 rounded border border-slate-700">
                ${data.badgeText}
              </span>
              <span class="text-xs font-bold text-slate-400">All-Times Bicycle Service</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">${data.title}</h2>
            <p class="text-xs text-slate-300 font-medium mt-0.5">${data.subtitle}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2 shrink-0 no-print">
          <button onclick="window.print()" class="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 border border-slate-300">
            <span>🖨️ Print Route Map</span>
          </button>
          <a href="nyc_to_montreal_${data.id === '6day' ? 'tour' : data.id + (data.id === 'vermont' ? '_upgrade' : '_tour')}.gpx" download class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-slate-700">
            <span>📥 Download GPX</span>
          </a>
          <button onclick="switchToDashboardView()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5 border border-slate-700">
            <span>🗺️ Interactive Map</span>
          </button>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div class="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <div class="text-[10px] text-slate-400 font-sans uppercase font-bold">Total Corridor</div>
          <div class="text-base font-black text-white">${data.totalMiles} MI <span class="text-xs text-slate-400">(${data.totalKm} km)</span></div>
        </div>
        <div class="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <div class="text-[10px] text-slate-400 font-sans uppercase font-bold">Total Elevation</div>
          <div class="text-base font-black text-amber-400">${data.elevationGain}</div>
        </div>
        <div class="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <div class="text-[10px] text-slate-400 font-sans uppercase font-bold">Daily Average</div>
          <div class="text-base font-black text-emerald-400">${data.avgDaily}</div>
        </div>
        <div class="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <div class="text-[10px] text-slate-400 font-sans uppercase font-bold">Schedule</div>
          <div class="text-xs font-bold text-slate-200 mt-1">${data.finishDay}</div>
        </div>
      </div>
    </div>

    <!-- The Single Black Line Visual Schematic Corridor Map -->
    <div class="bg-white rounded-2xl border-2 border-black p-5 shadow-sm space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-black"></span>
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider">MTA Schematic Strip Map &bull; The Single Continuous Corridor Line</h3>
        </div>
        <span class="text-[11px] font-mono text-slate-500">Scale: Topological / Linear Cues</span>
      </div>

      <!-- Scalable SVG Strip Map Rendering The Single Black Line -->
      <div class="w-full overflow-x-auto py-2">
        <svg viewBox="0 0 1100 130" class="w-full min-w-[850px] h-auto font-sans" xmlns="http://www.w3.org/2000/svg">
          <!-- Background Base Track Guidelines -->
          <rect x="0" y="0" width="1100" height="130" fill="#f8fafc" rx="12" stroke="#e2e8f0" stroke-width="1.5"/>
          
          <!-- Water Corridor Underlays (Hudson, Champlain, Richelieu) -->
          <path d="M 50 65 Q 250 50 500 65 T 900 65 L 1050 65" fill="none" stroke="#e0f2fe" stroke-width="26" stroke-linecap="round"/>
          <text x="180" y="32" font-size="10" font-weight="bold" fill="#0284c7" letter-spacing="0.1em">HUDSON RIVER CORRIDOR</text>
          <text x="620" y="32" font-size="10" font-weight="bold" fill="#0284c7" letter-spacing="0.1em">LAKE CHAMPLAIN</text>
          <text x="940" y="32" font-size="10" font-weight="bold" fill="#0284c7" letter-spacing="0.1em">RICHELIEU / MONTRÉAL</text>

          <!-- THE SINGLE BOLD BLACK LINE (The Route Trunk) -->
          <path d="M 60 65 L 1040 65" fill="none" stroke="#000000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>

          <!-- Key Waypoints & Stations along the Single Black Line -->
          <!-- 1. NYC Battery Park -->
          <circle cx="60" cy="65" r="9" fill="#000000" stroke="#ffffff" stroke-width="3"/>
          <circle cx="60" cy="65" r="4" fill="#ffffff"/>
          <text x="60" y="90" font-size="11" font-weight="900" fill="#000000" text-anchor="middle">NYC START</text>
          <text x="60" y="103" font-size="9" font-family="monospace" font-weight="bold" fill="#64748b" text-anchor="middle">Battery Park (0.0 mi)</text>

          <!-- 2. Van Cortlandt / Westchester Link -->
          <circle cx="210" cy="65" r="5" fill="#ffffff" stroke="#000000" stroke-width="3"/>
          <line x1="210" y1="65" x2="210" y2="45" stroke="#000000" stroke-width="1.5"/>
          <text x="210" y="40" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">Van Cortlandt ↱</text>
          <text x="210" y="103" font-size="9" font-family="monospace" fill="#64748b" text-anchor="middle">Mile 15.0</text>

          <!-- 3. Brewster / Poughkeepsie Node -->
          <circle cx="360" cy="65" r="8" fill="#000000" stroke="#ffffff" stroke-width="2.5"/>
          <text x="360" y="90" font-size="11" font-weight="900" fill="#000000" text-anchor="middle">${data.id === '5day' ? 'POUGHKEEPSIE' : 'BREWSTER'}</text>
          <text x="360" y="103" font-size="9" font-family="monospace" font-weight="bold" fill="#64748b" text-anchor="middle">${data.id === '5day' ? 'Mile 95.0' : 'Mile 60.0'}</text>

          <!-- 4. Hudson / Troy Hub -->
          <circle cx="510" cy="65" r="8" fill="#000000" stroke="#ffffff" stroke-width="2.5"/>
          <text x="510" y="90" font-size="11" font-weight="900" fill="#000000" text-anchor="middle">${data.id === '5day' ? 'TROY / ALBANY' : 'HUDSON, NY'}</text>
          <text x="510" y="103" font-size="9" font-family="monospace" font-weight="bold" fill="#64748b" text-anchor="middle">${data.id === '5day' ? 'Mile 180.0' : 'Mile 138.0'}</text>

          <!-- 5. Saratoga / Ticonderoga -->
          <circle cx="660" cy="65" r="8" fill="#000000" stroke="#ffffff" stroke-width="2.5"/>
          <text x="660" y="90" font-size="11" font-weight="900" fill="#000000" text-anchor="middle">${data.id === '5day' ? 'TICONDEROGA' : 'SARATOGA'}</text>
          <text x="660" y="103" font-size="9" font-family="monospace" font-weight="bold" fill="#64748b" text-anchor="middle">${data.id === '5day' ? 'Mile 267.0' : 'Mile 213.0'}</text>

          <!-- 6. Plattsburgh / Burlington Node -->
          <circle cx="810" cy="65" r="8" fill="#000000" stroke="#ffffff" stroke-width="2.5"/>
          <text x="810" y="90" font-size="11" font-weight="900" fill="#000000" text-anchor="middle">${data.id === 'vermont' ? 'BURLINGTON ⛵' : 'PLATTSBURGH'}</text>
          <text x="810" y="103" font-size="9" font-family="monospace" font-weight="bold" fill="#64748b" text-anchor="middle">${data.id === 'vermont' ? 'Mile 341.0' : (data.id === '5day' ? 'Mile 337.0' : 'Mile 358.0')}</text>

          <!-- 7. International Border -->
          <circle cx="920" cy="65" r="6" fill="#10b981" stroke="#000000" stroke-width="2"/>
          <line x1="920" y1="65" x2="920" y2="45" stroke="#10b981" stroke-width="2" stroke-dasharray="3,2"/>
          <text x="920" y="40" font-size="9" font-weight="900" fill="#047857" text-anchor="middle">BORDER 🛂</text>
          <text x="920" y="103" font-size="9" font-family="monospace" fill="#047857" text-anchor="middle">Lacolle/Noyan</text>

          <!-- 8. MONTRÉAL FINISH -->
          <circle cx="1040" cy="65" r="10" fill="#000000" stroke="#ffffff" stroke-width="3"/>
          <circle cx="1040" cy="65" r="5" fill="#e11d48"/>
          <text x="1040" y="90" font-size="11" font-weight="900" fill="#e11d48" text-anchor="middle">MONTRÉAL 🏁</text>
          <text x="1040" y="103" font-size="9" font-family="monospace" font-weight="bold" fill="#64748b" text-anchor="middle">Place Jacques-Cartier</text>
        </svg>
      </div>

      <div class="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
        <div class="flex items-center gap-3">
          <span class="flex items-center gap-1 font-bold text-slate-900"><span class="w-3 h-3 rounded-full bg-black inline-block"></span> Single Black Line Trunk</span>
          <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Canada Customs</span>
          <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span> Tour Terminus</span>
        </div>
        <span class="text-slate-400">Printed directly from browser via Print / PDF</span>
      </div>
    </div>

    <!-- Complete Turn-by-Turn Cue Sheets for this Itinerary -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
            <span>📋 Turn-by-Turn Detailed Cue Sheets</span>
          </h3>
          <p class="text-xs text-slate-500">Every turn, highway shoulder, rail trail junction, lunch stop, and overnight terminus along the single black line.</p>
        </div>
        <span class="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
          ${data.stages.length} Stages &bull; All Turns
        </span>
      </div>

      ${stagesHtml}
    </div>
  `;
}

/* ============================================================
   VIEW TOGGLING (Dashboard vs MTA Route Map Tab)
============================================================ */
function showMtaRouteMapTab(itineraryId) {
  const dashboardView = document.getElementById('tour-dashboard-view');
  const routeMapView = document.getElementById('mta-route-map-view');
  
  if (dashboardView) dashboardView.classList.add('hidden');
  if (routeMapView) routeMapView.classList.remove('hidden');

  const itId = itineraryId || currentMtaItineraryId || '6day';

  // Update master view navigation bar
  const tabDashboard = document.getElementById('nav-tab-dashboard');
  if (tabDashboard) {
    tabDashboard.className = "px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center gap-1.5 border border-slate-700";
  }

  ['6day', '5day', '7day', 'vermont'].forEach(id => {
    const navBtn = document.getElementById(`nav-tab-${id}-map`);
    if (navBtn) {
      if (id === itId) {
        navBtn.className = "px-3.5 py-2 text-xs font-black rounded-xl bg-white text-slate-950 shadow-md transition-all flex items-center gap-1.5 ring-2 ring-blue-400";
      } else {
        navBtn.className = "px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center gap-1.5 border border-slate-700";
      }
    }
  });

  switchMtaRouteTab(itId);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchToDashboardView() {
  const dashboardView = document.getElementById('tour-dashboard-view');
  const routeMapView = document.getElementById('mta-route-map-view');
  
  if (routeMapView) routeMapView.classList.add('hidden');
  if (dashboardView) dashboardView.classList.remove('hidden');

  // Update master view navigation bar
  const tabDashboard = document.getElementById('nav-tab-dashboard');
  if (tabDashboard) {
    tabDashboard.className = "px-3.5 py-2 text-xs font-black rounded-xl bg-blue-600 text-white shadow-sm transition-all flex items-center gap-1.5 ring-2 ring-blue-400";
  }

  ['6day', '5day', '7day', 'vermont'].forEach(id => {
    const navBtn = document.getElementById(`nav-tab-${id}-map`);
    if (navBtn) {
      navBtn.className = "px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center gap-1.5 border border-slate-700";
    }
  });

  // Re-trigger map resize so Leaflet renders properly
  setTimeout(() => {
    if (typeof leafletMap !== 'undefined' && leafletMap && typeof leafletMap.invalidateSize === 'function') {
      leafletMap.invalidateSize();
    }
  }, 100);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCurrentTourMtaMap() {
  if (typeof currentTour !== 'undefined' && currentTour === TOUR_DATA_5DAY) {
    showMtaRouteMapTab('5day');
  } else if (typeof currentTour !== 'undefined' && currentTour === TOUR_DATA_7DAY) {
    showMtaRouteMapTab('7day');
  } else {
    showMtaRouteMapTab('6day');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderMtaRouteMap('6day');
});

