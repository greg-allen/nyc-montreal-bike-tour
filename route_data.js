// Complete Data Structures for NYC to Montréal Bike Tour
// Features: 6-Day Revised Tour (~445 mi), 5-Day Honest Fast Tour (~425 mi), 7-Day Gentler Variant & Vermont Upgrade Option
// Incorporates all field audits, accurate mileages, elevation gains, Amtrak rules, and border protocols.

const TOUR_DATA_6DAY = {
  id: "6day",
  title: "6-Day Classic Tour (Sunday to Friday)",
  totalDistanceMiles: 445,
  durationDays: 6,
  averageDailyMiles: 74.2,
  elevationGainFt: 14500,
  schedule: "Sunday Departure -> Friday Arrival in Montréal (~74 mi/day)",
  pace: "Steady Endurance Touring (12-14 mph / 19-23 km/h)",
  days: [
    {
      day: 1,
      dayOfWeek: "Sunday",
      name: "Sunday • Day 1: NYC to Brewster / Carmel",
      subtitle: "The Weekend Escape: Manhattan to Westchester & Putnam Greenways",
      distanceMiles: 60.0,
      distanceKm: 96.6,
      elevationFt: 2000,
      surface: "Paved Rail Trails (Hudson River Greenway, South/North County, Putnam) with connecting city street sections in the Bronx and Yonkers",
      color: "#2563eb",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Battery+Park+New+York+NY&destination=Brewster+NY&waypoints=Trailside+Cafe+Yorktown+Heights+NY&travelmode=bicycling",
      startCoords: [40.7033, -74.0170],
      endCoords: [41.3973, -73.6171],
      track: [
        [40.7033, -74.0170], [40.7580, -74.0048], [40.8517, -73.9404], [40.8785, -73.9215],
        [40.8978, -73.8860], [40.9312, -73.8765], [40.9985, -73.8582], [41.0534, -73.8187],
        [41.1398, -73.7994], [41.2052, -73.7850], [41.2720, -73.7820], [41.3485, -73.7420],
        [41.3973, -73.6171]
      ],
      lunch: {
        name: "Trailside Cafe (Yorktown Heights)",
        location: "1807 Commerce St, Yorktown Heights, NY",
        mile: 38,
        notes: "Directly alongside the rail trail! Fresh fruit smoothies, paninis, wraps, outdoor tables.",
        coords: [41.2720, -73.7820],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Trailside+Cafe+1807+Commerce+St+Yorktown+Heights+NY"
      },
      hotels: [
        { name: "Heidi's Inn", address: "1270 Route 22, Brewster, NY", phone: "(845) 279-8011", notes: "Cyclist-friendly motel, convenient ground-floor rooms with bike roll-in.", coords: [41.4110, -73.5950], googleUrl: "https://www.google.com/maps/search/?api=1&query=Heidi's+Inn+Brewster+NY" },
        { name: "Comfort Inn Brewster", address: "7-11 Peach Lake Rd, Brewster, NY", phone: "(845) 483-7848", notes: "Spacious rooms, indoor pool, complimentary hot breakfast.", coords: [41.3850, -73.5820], googleUrl: "https://www.google.com/maps/search/?api=1&query=Comfort+Inn+Brewster+NY" }
      ],
      bikeShops: [
        { name: "Yorktown Cycles", address: "1899 Commerce St, Yorktown Heights, NY", phone: "(914) 245-5504", notes: "Right by the trail & lunch stop. Open Sundays for tubes, CO2.", coords: [41.2725, -73.7815], googleUrl: "https://www.google.com/maps/search/?api=1&query=Yorktown+Cycles+Yorktown+Heights+NY" },
        { name: "Brewster Bicycle", address: "870 Route 22, Brewster, NY", phone: "(845) 278-8422", notes: "Near Brewster overnight. Touring gear, tubes, quick adjustments.", coords: [41.4010, -73.6050], googleUrl: "https://www.google.com/maps/search/?api=1&query=Brewster+Bicycle+Brewster+NY" }
      ],
      bailout: "Metro-North Harlem Line: Frequent bike-friendly commuter train service all along corridor (Pleasantville, Chappaqua, Mt Kisco, Katonah, Goldens Bridge, Brewster). No reservation required; avoid peak hours."
    },
    {
      day: 2,
      dayOfWeek: "Monday",
      name: "Monday • Day 2: Brewster to Hudson, NY",
      subtitle: "Maybrook Trailway, Dutchess Rail Trail & East-Bank Scenic Byways",
      distanceMiles: 78.0,
      distanceKm: 125.5,
      elevationFt: 3000,
      surface: "55% Paved Rail Trail (Maybrook & Dutchess Rail Trail), 45% Rolling East-Bank Roads (Route 9/9G & River Rd via Hyde Park & Rhinebeck)",
      color: "#0891b2",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Brewster+NY&destination=Warren+St+Hudson+NY&waypoints=Rhinebeck+NY&travelmode=bicycling",
      startCoords: [41.3973, -73.6171],
      endCoords: [42.2529, -73.7910],
      track: [
        [41.3973, -73.6171], [41.4650, -73.6980], [41.5834, -73.8057], [41.7108, -73.9442],
        [41.7209, -73.9632], [41.9268, -73.9126], [41.9945, -73.8754], [42.0881, -73.8446],
        [42.2529, -73.7910]
      ],
      lunch: {
        name: "Rhinebeck Bagel / Market St Cafes (Rhinebeck, NY)",
        location: "Market St & Route 9G, Rhinebeck, NY",
        mile: 52,
        notes: "Lively historic village dining on the east bank. Gourmet sandwiches, fresh salads, local bakeries. (Note: Walkway Over the Hudson is an optional +2 mi out-and-back scenic detour at Poughkeepsie before continuing north on the east bank).",
        coords: [41.9268, -73.9126],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Rhinebeck+Bagel+Market+St+Rhinebeck+NY"
      },
      hotels: [
        { name: "The Barlow Hotel", address: "542 Warren St, Hudson, NY", phone: "(518) 828-2100", notes: "Boutique hospitality directly on historic Warren St with secure bike storage.", coords: [42.2510, -73.7870], googleUrl: "https://www.google.com/maps/search/?api=1&query=The+Barlow+Hotel+Hudson+NY" },
        { name: "The Wick, Hudson", address: "41 Cross St, Hudson, NY", phone: "(518) 249-6825", notes: "Modern luxury hotel 1 block from Hudson Amtrak station; cyclist friendly.", coords: [42.2525, -73.7980], googleUrl: "https://www.google.com/maps/search/?api=1&query=The+Wick+Hudson+NY" }
      ],
      bikeShops: [
        { name: "Bikeway - Hopewell Junction", address: "812 Route 82, Hopewell Junction, NY", phone: "(845) 223-8100", notes: "Direct rail-trail access at Mile 21.", coords: [41.5830, -73.8060], googleUrl: "https://www.google.com/maps/search/?api=1&query=Bikeway+Hopewell+Junction+NY" },
        { name: "Steiner's Sports - Hudson", address: "301 Warren St, Hudson, NY", phone: "(518) 828-5063", notes: "Right on Warren Street in Hudson. Mechanic on duty.", coords: [42.2530, -73.7915], googleUrl: "https://www.google.com/maps/search/?api=1&query=Steiner's+Sports+Hudson+NY" }
      ],
      bailout: "Metro-North Hudson Line at Poughkeepsie (Mile 42 - frequent service to NYC); Amtrak Empire Service at Rhinecliff (Mile 54) and Hudson (Mile 78)."
    },
    {
      day: 3,
      dayOfWeek: "Tuesday",
      name: "Tuesday • Day 3: Hudson to Saratoga Springs, NY",
      subtitle: "Albany-Hudson Electric Trail, Mohawk-Hudson Path & Saratoga Gateway",
      distanceMiles: 75.0,
      distanceKm: 120.7,
      elevationFt: 2000,
      surface: "65% Paved Rail Trails (36-mile AHET & Zim Smith to Ballston Spa), 35% Canal Roads & Connecting Lanes into Saratoga",
      color: "#16a34a",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Hudson+NY&destination=Saratoga+Springs+NY&waypoints=Kinderhook+NY%7CWaterford+Harbor+Visitor+Center+Waterford+NY%7CRound+Lake+NY&travelmode=bicycling",
      startCoords: [42.2529, -73.7910],
      endCoords: [43.0831, -73.7846],
      track: [
        [42.2529, -73.7910], [42.3450, -73.7350], [42.3948, -73.7001], [42.4200, -73.6800],
        [42.5162, -73.6104], [42.5850, -73.6900], [42.6526, -73.7562], [42.7300, -73.6900],
        [42.7909, -73.6818], [42.9034, -73.6882], [43.0010, -73.7900], [43.0831, -73.7846]
      ],
      lunch: {
        name: "Troy Waterfront / Placid Baker & Whistling Kettle",
        location: "Downtown Troy & Waterford Canal Harbor, NY",
        mile: 44,
        notes: "Artisan baked goods, gourmet sandwiches, savory quiches, and outdoor river seating by the historic locks.",
        coords: [42.7315, -73.6890],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=The+Placid+Baker+Troy+NY"
      },
      hotels: [
        { name: "The Saratoga Hilton", address: "534 Broadway, Saratoga Springs, NY", phone: "(518) 584-4000", notes: "Center of historic Broadway, bike storage available, walking distance to springs.", coords: [43.0845, -73.7840], googleUrl: "https://www.google.com/maps/search/?api=1&query=The+Saratoga+Hilton+Saratoga+Springs+NY" },
        { name: "Holiday Inn Saratoga Springs", address: "232 Broadway, Saratoga Springs, NY", phone: "(518) 584-4550", notes: "Comfortable, cyclist-friendly, indoor heated pool.", coords: [43.0780, -73.7870], googleUrl: "https://www.google.com/maps/search/?api=1&query=Holiday+Inn+Saratoga+Springs+NY" }
      ],
      bikeShops: [
        { name: "Down Tube Bicycle Works", address: "466 Madison Ave, Albany, NY", phone: "(518) 434-1711", notes: "Albany touring & commuter specialists.", coords: [42.6565, -73.7690], googleUrl: "https://www.google.com/maps/search/?api=1&query=Down+Tube+Bicycle+Works+Albany+NY" },
        { name: "Saratoga Bicycle Specialties", address: "110 Excelsior Ave, Saratoga Springs, NY", phone: "(518) 587-0071", notes: "Full-service Saratoga shop, road & gravel specialists.", coords: [43.0885, -73.7750], googleUrl: "https://www.google.com/maps/search/?api=1&query=Saratoga+Bicycle+Specialties+Saratoga+Springs+NY" }
      ],
      bailout: "Amtrak Empire Service at Albany-Rensselaer (Mile 36); Amtrak Adirondack / Ethan Allen at Saratoga Springs (Mile 75 - verify weekday schedule)."
    },
    {
      day: 4,
      dayOfWeek: "Wednesday",
      name: "Wednesday • Day 4: Saratoga Springs to Ticonderoga, NY",
      subtitle: "Champlain Canalway, Schuylerville, Lock 12 & Fort Ticonderoga",
      distanceMiles: 75.0,
      distanceKm: 120.7,
      elevationFt: 2500,
      surface: "75% Scenic Low-Traffic Highways (US-4 & NY-22), 25% Canal Path. (Skips weak Whitehall lodging directly to full-service Fort Ticonderoga)",
      color: "#d97706",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Saratoga+Springs+NY&destination=Ticonderoga+NY&waypoints=Schuylerville+NY%7CHistoric+Grounds+Whitehall+NY&travelmode=bicycling",
      startCoords: [43.0831, -73.7846],
      endCoords: [43.8478, -73.4257],
      track: [
        [43.0831, -73.7846], [43.1009, -73.5784], [43.2678, -73.5857], [43.4145, -73.4907],
        [43.5556, -73.4040], [43.6850, -73.4150], [43.8423, -73.4046], [43.8478, -73.4257]
      ],
      lunch: {
        name: "Historic Grounds Restaurant & Coffee Bar (Whitehall)",
        location: "142 Main St, Whitehall, NY",
        mile: 44,
        notes: "Wholesome sandwiches, soups, and espresso right next to Champlain Canal Lock 12 Park. Prime resupply before pushing north on NY-22.",
        coords: [43.5560, -73.4045],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Historic+Grounds+Whitehall+NY"
      },
      hotels: [
        { name: "Best Western Plus Ticonderoga", address: "260 Burgoyne Rd, Ticonderoga, NY", phone: "(518) 585-1800", notes: "Extremely popular with cyclists and touring groups, large clean rooms, hot breakfast.", coords: [43.8465, -73.4350], googleUrl: "https://www.google.com/maps/search/?api=1&query=Best+Western+Plus+Ticonderoga+NY" }
      ],
      bikeShops: [
        { name: "Rick's Bike Shop (Queensbury detour)", address: "368 Dix Ave, Queensbury, NY", phone: "(518) 793-8986", notes: "Massive inventory of parts and touring equipment.", coords: [43.3160, -73.6190], googleUrl: "https://www.google.com/maps/search/?api=1&query=Rick's+Bike+Shop+Queensbury+NY" },
        { name: "Walker's Hardware & Supply", address: "5565 NY-4, Fort Ann, NY", phone: "(518) 639-5223", notes: "Emergency tubes, pumps, metric tools.", coords: [43.4150, -73.4910], googleUrl: "https://www.google.com/maps/search/?api=1&query=Walker's+Farm+Home+Fort+Ann+NY" }
      ],
      bailout: "Amtrak Adirondack: Fort Edward (Mile 24), Whitehall (Mile 44), and Ticonderoga Station (Mile 73). (Service operates Mon-Thu north to Montreal; advance bike reservation required; carry-on rack in coach)."
    },
    {
      day: 5,
      dayOfWeek: "Thursday",
      name: "Thursday • Day 5: Ticonderoga to Plattsburgh, NY",
      subtitle: "Adirondack Coastline: Crown Point, Historic Essex & Ausable Chasm",
      distanceMiles: 70.0,
      distanceKm: 112.7,
      elevationFt: 4000,
      surface: "85% Scenic 2-Lane Highway (NY-9N / NY-22) with Lake Champlain Views, 15% Local Bikeways. Hardest stage: rolling Adirondack climbs and highway shoulders.",
      color: "#9333ea",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Ticonderoga+NY&destination=Plattsburgh+NY&waypoints=Essex+NY%7CAusable+Chasm+NY&travelmode=bicycling",
      startCoords: [43.8478, -73.4257],
      endCoords: [44.6995, -73.4529],
      track: [
        [43.8478, -73.4257], [44.0539, -73.4607], [44.1834, -73.4357], [44.3101, -73.3537],
        [44.3645, -73.3876], [44.5242, -73.4862], [44.5778, -73.5282], [44.6995, -73.4529]
      ],
      lunch: {
        name: "The Cup Cafe / Essex Ice Cream Cafe (Historic Essex, NY)",
        location: "Main St, Essex, NY",
        mile: 38,
        notes: "Dine on the porch overlooking the Lake Champlain ferry to Vermont. Outstanding clam chowder, sandwiches, fresh pastries. Crucial food/water resupply point!",
        coords: [44.3105, -73.3540],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=The+Cup+Cafe+Main+St+Essex+NY"
      },
      hotels: [
        { name: "Best Western Plus Plattsburgh", address: "446 NY-3, Plattsburgh, NY", phone: "(518) 561-7000", notes: "Comfortable rooms, bike storage friendly, hearty complimentary breakfast.", coords: [44.6940, -73.4890], googleUrl: "https://www.google.com/maps/search/?api=1&query=Best+Western+Plus+Plattsburgh+NY" }
      ],
      bikeShops: [
        { name: "Maui North Ski, Bike & Board", address: "168 Margaret St, Plattsburgh, NY", phone: "(518) 563-7245", notes: "Full-service premier shop in downtown Plattsburgh.", coords: [44.6980, -73.4530], googleUrl: "https://www.google.com/maps/search/?api=1&query=Maui+North+Plattsburgh+NY" }
      ],
      bailout: "Amtrak Adirondack at Westport Station (Mile 28) and Plattsburgh Station (Mile 70). (Verify Mon-Thu schedule)."
    },
    {
      day: 6,
      dayOfWeek: "Friday",
      name: "Friday • Day 6: Plattsburgh to Montréal, QC (Canada)",
      subtitle: "Arrival Day! US-9 to Rouses Point, QC-223 Richelieu River, Chambly Canal & Old Montréal",
      distanceMiles: 87.0,
      distanceKm: 140.0,
      elevationFt: 1200,
      surface: "55% Flat Paved Country Roads (US-9 to Rouses Point & QC-223), 45% Dedicated Route Verte Bike Paths (Chambly Canal towpath to Chambly, Longueuil paths & St. Lawrence bridge). Flat, fast, celebratory.",
      color: "#059669",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Plattsburgh+NY&destination=Vieux-Montr%C3%A9al+QC&waypoints=Rouses+Point+NY%7CBistro+La+Trinquette+Saint-Jean-sur-Richelieu+QC%7CChambly+Canal+National+Historic+Site+QC&travelmode=bicycling",
      startCoords: [44.6995, -73.4529],
      endCoords: [45.5017, -73.5673],
      track: [
        [44.6995, -73.4529], [44.8911, -73.4326], [44.9939, -73.3646], [45.0064, -73.3670],
        [45.1311, -73.2625], [45.3056, -73.2533], [45.3850, -73.2680], [45.4497, -73.2872],
        [45.4593, -73.5134], [45.4750, -73.5450], [45.5017, -73.5673]
      ],
      lunch: {
        name: "Bistro La Trinquette (Saint-Jean-sur-Richelieu)",
        location: "155 Rue Richelieu, Saint-Jean-sur-Richelieu, QC",
        mile: 48,
        notes: "Riverside patio right at the start of the Chambly Canal! Savory crêpes, gourmet panini, Quebec cider, poutine.",
        coords: [45.3060, -73.2530],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Bistro+La+Trinquette+Saint-Jean-sur-Richelieu+QC"
      },
      hotels: [
        { name: "Hotel Monville (Certified 'Bienvenue Cyclistes')", address: "1041 Rue de Bleury, Montréal, QC", phone: "+1 (514) 379-2000", notes: "Sleek, modern, dedicated secure bike room, steps from Place d'Armes.", coords: [45.5035, -73.5630], googleUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Monville+Montreal+QC" },
        { name: "Fairmont The Queen Elizabeth", address: "900 René-Lévesque Blvd W, Montréal, QC", phone: "+1 (514) 861-3511", notes: "Grand historic hotel directly connected to Gare Centrale.", coords: [45.5005, -73.5670], googleUrl: "https://www.google.com/maps/search/?api=1&query=Fairmont+The+Queen+Elizabeth+Montreal+QC" }
      ],
      bikeShops: [
        { name: "Performance Bégin", address: "470 Rue Saint-Jacques, Saint-Jean-sur-Richelieu, QC", phone: "(450) 348-3561", notes: "First major Quebec shop on Route Verte.", coords: [45.3080, -73.2580], googleUrl: "https://www.google.com/maps/search/?api=1&query=Performance+Begin+Saint-Jean-sur-Richelieu+QC" },
        { name: "Bicycles Quilicot", address: "1775 Rue Saint-Denis, Montréal, QC", phone: "(514) 499-9600", notes: "Montréal's iconic cycling hub; sells airline/bus cardboard bike boxes.", coords: [45.5180, -73.5680], googleUrl: "https://www.google.com/maps/search/?api=1&query=Bicycles+Quilicot+Montreal+QC" }
      ],
      bailout: "CRITICAL AMTRAK RULE: Carry-on bicycle service on the Amtrak Adirondack ENDS at Rouses Point, NY (Mile 24). You CANNOT roll an unboxed bicycle onto the train at Montreal Gare Centrale! Return options: 1) Ride ~48 mi back south to Rouses Point to board; 2) Box bike in Montreal (Bicycles Quilicot / MEC) for cargo/bus; 3) One-way car rental (Enterprise/Avis from downtown/YUL to NYC)."
    }
  ]
};

const TOUR_DATA_7DAY = {
  id: "7day",
  title: "7-Day Gentler Tour (Sunday to Saturday)",
  totalDistanceMiles: 445,
  durationDays: 7,
  averageDailyMiles: 63.6,
  elevationGainFt: 14500,
  schedule: "Sunday Departure -> Saturday Arrival in Montréal (~64 mi/day)",
  pace: "Comfortable Leisure Touring (11-13 mph / 18-21 km/h) • Recommended for October Daylight",
  days: [
    {
      day: 1,
      dayOfWeek: "Sunday",
      name: "Sunday • Day 1: NYC to Brewster / Carmel",
      subtitle: "The Weekend Escape: Manhattan to Westchester & Putnam Greenways",
      distanceMiles: 60.0,
      distanceKm: 96.6,
      elevationFt: 2000,
      surface: "Paved Rail Trails (Hudson River Greenway, South/North County, Putnam) with connecting city street sections in the Bronx and Yonkers",
      color: "#2563eb",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Battery+Park+New+York+NY&destination=Brewster+NY&waypoints=Trailside+Cafe+Yorktown+Heights+NY&travelmode=bicycling",
      startCoords: [40.7033, -74.0170],
      endCoords: [41.3973, -73.6171],
      track: [
        [40.7033, -74.0170], [40.7580, -74.0048], [40.8517, -73.9404], [40.8785, -73.9215],
        [40.8978, -73.8860], [40.9312, -73.8765], [40.9985, -73.8582], [41.0534, -73.8187],
        [41.1398, -73.7994], [41.2052, -73.7850], [41.2720, -73.7820], [41.3485, -73.7420],
        [41.3973, -73.6171]
      ],
      lunch: {
        name: "Trailside Cafe (Yorktown Heights)",
        location: "1807 Commerce St, Yorktown Heights, NY",
        mile: 38,
        notes: "Directly alongside the rail trail! Fresh fruit smoothies, paninis, wraps, outdoor tables.",
        coords: [41.2720, -73.7820],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Trailside+Cafe+1807+Commerce+St+Yorktown+Heights+NY"
      },
      hotels: [
        { name: "Heidi's Inn", address: "1270 Route 22, Brewster, NY", phone: "(845) 279-8011", notes: "Cyclist-friendly motel, convenient ground-floor rooms with bike roll-in.", coords: [41.4110, -73.5950], googleUrl: "https://www.google.com/maps/search/?api=1&query=Heidi's+Inn+Brewster+NY" },
        { name: "Comfort Inn Brewster", address: "7-11 Peach Lake Rd, Brewster, NY", phone: "(845) 483-7848", notes: "Spacious rooms, indoor pool, complimentary hot breakfast.", coords: [41.3850, -73.5820], googleUrl: "https://www.google.com/maps/search/?api=1&query=Comfort+Inn+Brewster+NY" }
      ],
      bikeShops: [
        { name: "Yorktown Cycles", address: "1899 Commerce St, Yorktown Heights, NY", phone: "(914) 245-5504", notes: "Right by the trail & lunch stop. Open Sundays for tubes, CO2.", coords: [41.2725, -73.7815], googleUrl: "https://www.google.com/maps/search/?api=1&query=Yorktown+Cycles+Yorktown+Heights+NY" },
        { name: "Brewster Bicycle", address: "870 Route 22, Brewster, NY", phone: "(845) 278-8422", notes: "Near Brewster overnight. Touring gear, tubes, quick adjustments.", coords: [41.4010, -73.6050], googleUrl: "https://www.google.com/maps/search/?api=1&query=Brewster+Bicycle+Brewster+NY" }
      ],
      bailout: "Metro-North Harlem Line: Frequent bike-friendly commuter train service all along corridor (Pleasantville, Chappaqua, Mt Kisco, Katonah, Goldens Bridge, Brewster). No reservation required; avoid peak hours."
    },
    {
      day: 2,
      dayOfWeek: "Monday",
      name: "Monday • Day 2: Brewster to Hudson, NY",
      subtitle: "Maybrook Trailway, Dutchess Rail Trail & East-Bank Scenic Byways",
      distanceMiles: 78.0,
      distanceKm: 125.5,
      elevationFt: 3000,
      surface: "55% Paved Rail Trail (Maybrook & Dutchess Rail Trail), 45% Rolling East-Bank Roads (Route 9/9G & River Rd via Hyde Park & Rhinebeck)",
      color: "#0891b2",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Brewster+NY&destination=Warren+St+Hudson+NY&waypoints=Rhinebeck+NY&travelmode=bicycling",
      startCoords: [41.3973, -73.6171],
      endCoords: [42.2529, -73.7910],
      track: [
        [41.3973, -73.6171], [41.4650, -73.6980], [41.5834, -73.8057], [41.7108, -73.9442],
        [41.7209, -73.9632], [41.9268, -73.9126], [41.9945, -73.8754], [42.0881, -73.8446],
        [42.2529, -73.7910]
      ],
      lunch: {
        name: "Rhinebeck Bagel / Market St Cafes (Rhinebeck, NY)",
        location: "Market St & Route 9G, Rhinebeck, NY",
        mile: 52,
        notes: "Lively historic village dining on the east bank. Gourmet sandwiches, fresh salads, local bakeries. (Note: Walkway Over the Hudson is an optional +2 mi out-and-back scenic detour at Poughkeepsie before continuing north on the east bank).",
        coords: [41.9268, -73.9126],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Rhinebeck+Bagel+Market+St+Rhinebeck+NY"
      },
      hotels: [
        { name: "The Barlow Hotel", address: "542 Warren St, Hudson, NY", phone: "(518) 828-2100", notes: "Boutique hospitality directly on historic Warren St with secure bike storage.", coords: [42.2510, -73.7870], googleUrl: "https://www.google.com/maps/search/?api=1&query=The+Barlow+Hotel+Hudson+NY" },
        { name: "The Wick, Hudson", address: "41 Cross St, Hudson, NY", phone: "(518) 249-6825", notes: "Modern luxury hotel 1 block from Hudson Amtrak station; cyclist friendly.", coords: [42.2525, -73.7980], googleUrl: "https://www.google.com/maps/search/?api=1&query=The+Wick+Hudson+NY" }
      ],
      bikeShops: [
        { name: "Bikeway - Hopewell Junction", address: "812 Route 82, Hopewell Junction, NY", phone: "(845) 223-8100", notes: "Direct rail-trail access at Mile 21.", coords: [41.5830, -73.8060], googleUrl: "https://www.google.com/maps/search/?api=1&query=Bikeway+Hopewell+Junction+NY" },
        { name: "Steiner's Sports - Hudson", address: "301 Warren St, Hudson, NY", phone: "(518) 828-5063", notes: "Right on Warren Street in Hudson. Mechanic on duty.", coords: [42.2530, -73.7915], googleUrl: "https://www.google.com/maps/search/?api=1&query=Steiner's+Sports+Hudson+NY" }
      ],
      bailout: "Metro-North Hudson Line at Poughkeepsie (Mile 42 - frequent service to NYC); Amtrak Empire Service at Rhinecliff (Mile 54) and Hudson (Mile 78)."
    },
    {
      day: 3,
      dayOfWeek: "Tuesday",
      name: "Tuesday • Day 3: Hudson to Saratoga Springs, NY",
      subtitle: "Albany-Hudson Electric Trail, Mohawk-Hudson Path & Saratoga Gateway",
      distanceMiles: 75.0,
      distanceKm: 120.7,
      elevationFt: 2000,
      surface: "65% Paved Rail Trails (36-mile AHET & Zim Smith to Ballston Spa), 35% Canal Roads & Connecting Lanes into Saratoga",
      color: "#16a34a",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Hudson+NY&destination=Saratoga+Springs+NY&waypoints=Kinderhook+NY%7CWaterford+Harbor+Visitor+Center+Waterford+NY%7CRound+Lake+NY&travelmode=bicycling",
      startCoords: [42.2529, -73.7910],
      endCoords: [43.0831, -73.7846],
      track: [
        [42.2529, -73.7910], [42.3450, -73.7350], [42.3948, -73.7001], [42.4200, -73.6800],
        [42.5162, -73.6104], [42.5850, -73.6900], [42.6526, -73.7562], [42.7300, -73.6900],
        [42.7909, -73.6818], [42.9034, -73.6882], [43.0010, -73.7900], [43.0831, -73.7846]
      ],
      lunch: {
        name: "Troy Waterfront / Waterford Lock 2 Park Cafes",
        location: "River St, Troy, NY & Waterford Harbor",
        mile: 44,
        notes: "Artisan baked goods, gourmet sandwiches, savory quiches, and outdoor river seating by the historic locks.",
        coords: [42.7315, -73.6890],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Troy+Waterfront+Farmers+Market+Troy+NY"
      },
      hotels: [
        { name: "The Saratoga Hilton", address: "534 Broadway, Saratoga Springs, NY", phone: "(518) 584-4000", notes: "Center of historic Broadway, bike storage available, walking distance to natural mineral springs.", coords: [43.0845, -73.7840], googleUrl: "https://www.google.com/maps/search/?api=1&query=The+Saratoga+Hilton+Saratoga+Springs+NY" },
        { name: "Holiday Inn Saratoga Springs", address: "232 Broadway, Saratoga Springs, NY", phone: "(518) 584-4550", notes: "Comfortable, cyclist-friendly, indoor heated pool.", coords: [43.0780, -73.7870], googleUrl: "https://www.google.com/maps/search/?api=1&query=Holiday+Inn+Saratoga+Springs+NY" }
      ],
      bikeShops: [
        { name: "Down Tube Bicycle Works", address: "466 Madison Ave, Albany, NY", phone: "(518) 434-1711", notes: "Albany touring & commuter specialists.", coords: [42.6565, -73.7690], googleUrl: "https://www.google.com/maps/search/?api=1&query=Down+Tube+Bicycle+Works+Albany+NY" },
        { name: "Saratoga Bicycle Specialties", address: "110 Excelsior Ave, Saratoga Springs, NY", phone: "(518) 587-0071", notes: "Full-service Saratoga shop, road & gravel specialists.", coords: [43.0885, -73.7750], googleUrl: "https://www.google.com/maps/search/?api=1&query=Saratoga+Bicycle+Specialties+Saratoga+Springs+NY" }
      ],
      bailout: "Amtrak Empire Service at Albany-Rensselaer (Mile 36); Amtrak Adirondack at Saratoga Springs (Mile 75 - verify schedule)."
    },
    {
      day: 4,
      dayOfWeek: "Wednesday",
      name: "Wednesday • Day 4: Saratoga Springs to Ticonderoga, NY",
      subtitle: "Champlain Canalway, Schuylerville, Lock 12 & Fort Ticonderoga",
      distanceMiles: 75.0,
      distanceKm: 120.7,
      elevationFt: 2500,
      surface: "75% Scenic Low-Traffic State Highways (US-4 & NY-22) with Paved Shoulders, 25% Canal Path. Finishes directly in Ticonderoga to ensure dependable lodging.",
      color: "#d97706",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Saratoga+Springs+NY&destination=Ticonderoga+NY&waypoints=Schuylerville+NY%7CWhitehall+NY&travelmode=bicycling",
      startCoords: [43.0831, -73.7846],
      endCoords: [43.8478, -73.4257],
      track: [
        [43.0831, -73.7846], [43.1009, -73.5784], [43.2678, -73.5857], [43.4145, -73.4907],
        [43.5556, -73.4040], [43.6850, -73.4150], [43.8423, -73.4046], [43.8478, -73.4257]
      ],
      lunch: {
        name: "Historic Grounds Restaurant & Coffee Bar (Whitehall, NY)",
        location: "142 Main St, Whitehall, NY",
        mile: 44,
        notes: "Wholesome sandwiches, soups, and espresso right next to Champlain Canal Lock 12 Park. Prime resupply before pushing north on NY-22.",
        coords: [43.5560, -73.4045],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Historic+Grounds+Whitehall+NY"
      },
      hotels: [
        { name: "Best Western Plus Ticonderoga", address: "260 Burgoyne Rd, Ticonderoga, NY", phone: "(518) 585-1800", notes: "Extremely popular with cyclists and touring groups, large clean rooms, hot breakfast.", coords: [43.8465, -73.4350], googleUrl: "https://www.google.com/maps/search/?api=1&query=Best+Western+Plus+Ticonderoga+NY" }
      ],
      bikeShops: [
        { name: "Rick's Bike Shop (Queensbury detour)", address: "368 Dix Ave, Queensbury, NY", phone: "(518) 793-8986", notes: "Massive inventory of parts and touring equipment.", coords: [43.3160, -73.6190], googleUrl: "https://www.google.com/maps/search/?api=1&query=Rick's+Bike+Shop+Queensbury+NY" },
        { name: "Walker's Hardware & Supply", address: "5565 NY-4, Fort Ann, NY", phone: "(518) 639-5223", notes: "Emergency tubes, pumps, metric tools.", coords: [43.4150, -73.4910], googleUrl: "https://www.google.com/maps/search/?api=1&query=Walker's+Farm+Home+Fort+Ann+NY" }
      ],
      bailout: "Amtrak Adirondack: Fort Edward (Mile 24), Whitehall (Mile 44), and Ticonderoga Station (Mile 73). (Service operates Mon-Thu north to Montreal; advance bike reservation required; carry-on rack in coach)."
    },
    {
      day: 5,
      dayOfWeek: "Thursday",
      name: "Thursday • Day 5: Ticonderoga to Plattsburgh, NY",
      subtitle: "Adirondack Coastline: Crown Point, Historic Essex & Ausable Chasm",
      distanceMiles: 70.0,
      distanceKm: 112.7,
      elevationFt: 4000,
      surface: "85% Scenic 2-Lane Highway (NY-9N / NY-22) with Lake Champlain Views, 15% Local Bikeways. Hardest stage: rolling Adirondack climbs and highway shoulders.",
      color: "#9333ea",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Ticonderoga+NY&destination=Plattsburgh+NY&waypoints=Essex+NY%7CAusable+Chasm+NY&travelmode=bicycling",
      startCoords: [43.8478, -73.4257],
      endCoords: [44.6995, -73.4529],
      track: [
        [43.8478, -73.4257], [44.0539, -73.4607], [44.1834, -73.4357], [44.3101, -73.3537],
        [44.3645, -73.3876], [44.5242, -73.4862], [44.5778, -73.5282], [44.6995, -73.4529]
      ],
      lunch: {
        name: "The Cup Cafe / Essex Ice Cream Cafe (Historic Essex, NY)",
        location: "Main St, Essex, NY",
        mile: 38,
        notes: "Dine on the porch overlooking the Lake Champlain ferry to Vermont. Outstanding clam chowder, sandwiches, fresh pastries. Crucial food/water resupply point!",
        coords: [44.3105, -73.3540],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=The+Cup+Cafe+Main+St+Essex+NY"
      },
      hotels: [
        { name: "Best Western Plus Plattsburgh", address: "446 NY-3, Plattsburgh, NY", phone: "(518) 561-7000", notes: "Comfortable rooms, bike storage friendly, hearty complimentary breakfast.", coords: [44.6940, -73.4890], googleUrl: "https://www.google.com/maps/search/?api=1&query=Best+Western+Plus+Plattsburgh+NY" }
      ],
      bikeShops: [
        { name: "Maui North Ski, Bike & Board", address: "168 Margaret St, Plattsburgh, NY", phone: "(518) 563-7245", notes: "Full-service premier shop in downtown Plattsburgh.", coords: [44.6980, -73.4530], googleUrl: "https://www.google.com/maps/search/?api=1&query=Maui+North+Plattsburgh+NY" }
      ],
      bailout: "Amtrak Adirondack at Westport Station (Mile 28) and Plattsburgh Station (Mile 70). (Verify Mon-Thu schedule)."
    },
    {
      day: 6,
      dayOfWeek: "Friday",
      name: "Friday • Day 6: Plattsburgh to Saint-Jean-sur-Richelieu, QC (Canada)",
      subtitle: "US-9 to Rouses Point, Canadian Border Crossing & QC-223 Along Richelieu River",
      distanceMiles: 50.0,
      distanceKm: 80.5,
      elevationFt: 800,
      surface: "70% Flat Paved Rural Roads (US-9 & QC-223), 30% Local Cycle Lanes. Relaxed border crossing day with ample daylight to clear customs.",
      color: "#059669",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Plattsburgh+NY&destination=Saint-Jean-sur-Richelieu+QC&waypoints=Rouses+Point+NY%7CLacolle+QC&travelmode=bicycling",
      startCoords: [44.6995, -73.4529],
      endCoords: [45.3056, -73.2533],
      track: [
        [44.6995, -73.4529], [44.8911, -73.4326], [44.9939, -73.3646], [45.0064, -73.3670],
        [45.1311, -73.2625], [45.3056, -73.2533]
      ],
      lunch: {
        name: "Lakeside Coffee & Bakery / Chazy Orchards",
        location: "Lake Champlain shoreline, Rouses Point, NY",
        mile: 24,
        notes: "Final U.S. stop right before border customs at Rouses Point / Lacolle. Fresh pastries, espresso, hearty sandwiches.",
        coords: [44.9939, -73.3646],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Rouses+Point+NY+bakery"
      },
      hotels: [
        { name: "Quality Hotel Centre de Congrès", address: "725 Boul. du Séminaire N, Saint-Jean-sur-Richelieu, QC", phone: "+1 (450) 515-5755", notes: "Premier regional hotel with indoor pool, on-site dining, and secure bike storage.", coords: [45.3120, -73.2640], googleUrl: "https://www.google.com/maps/search/?api=1&query=Quality+Hotel+Centre+de+Congres+Saint-Jean-sur-Richelieu" },
        { name: "Auberge Harris", address: "576 Rue Champlain, Saint-Jean-sur-Richelieu, QC", phone: "+1 (450) 348-4408", notes: "Certified 'Bienvenue Cyclistes' waterfront inn, direct river views.", coords: [45.2980, -73.2490], googleUrl: "https://www.google.com/maps/search/?api=1&query=Auberge+Harris+Saint-Jean-sur-Richelieu" }
      ],
      bikeShops: [
        { name: "Performance Bégin", address: "470 Rue Saint-Jacques, Saint-Jean-sur-Richelieu, QC", phone: "(450) 348-3561", notes: "Full-service Quebec workshop, tubes, tires, and accessories.", coords: [45.3080, -73.2580], googleUrl: "https://www.google.com/maps/search/?api=1&query=Performance+Begin+Saint-Jean-sur-Richelieu+QC" }
      ],
      bailout: "Amtrak Adirondack at Rouses Point, NY (Mile 24 - last roll-on station); Exo public bus network in Saint-Jean-sur-Richelieu connecting to Montreal."
    },
    {
      day: 7,
      dayOfWeek: "Saturday",
      name: "Saturday • Day 7: Saint-Jean to Downtown Montréal (Victory Lap!)",
      subtitle: "Chambly Canal National Historic Site, Longueuil Greenway & Jacques-Cartier Bridge",
      distanceMiles: 37.0,
      distanceKm: 59.5,
      elevationFt: 600,
      surface: "85% Car-Free Dedicated Paths (Chambly Canal gravel/paved towpath, Longueuil greenway, St. Lawrence bridge path), 15% Urban Bike Lanes. A joyful, flat morning cruise into Old Port!",
      color: "#e11d48",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Saint-Jean-sur-Richelieu+QC&destination=Place+Jacques-Cartier+Montreal+QC&waypoints=Chambly+Canal+National+Historic+Site+QC%7CLongueuil+QC&travelmode=bicycling",
      startCoords: [45.3056, -73.2533],
      endCoords: [45.5017, -73.5673],
      track: [
        [45.3056, -73.2533], [45.3850, -73.2680], [45.4497, -73.2872], [45.4593, -73.5134],
        [45.4750, -73.5450], [45.5017, -73.5673]
      ],
      lunch: {
        name: "Fourquet Fourchette / Bistro du Canal (Chambly) or Old Port Montreal",
        location: "Chambly Basin National Historic Site, QC",
        mile: 12,
        notes: "Scenic terrace overlooking Fort Chambly rapids! Savory crepes and Quebec craft cider, or push directly into Old Port for celebratory victory poutine.",
        coords: [45.4497, -73.2872],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Fourquet+Fourchette+Chambly+QC"
      },
      hotels: [
        { name: "Hotel Monville (Certified 'Bienvenue Cyclistes')", address: "1041 Rue de Bleury, Montréal, QC", phone: "+1 (514) 379-2000", notes: "Sleek, modern, dedicated secure bike room, steps from Place d'Armes in Downtown Montreal.", coords: [45.5035, -73.5630], googleUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Monville+Montreal+QC" },
        { name: "Fairmont The Queen Elizabeth", address: "900 René-Lévesque Blvd W, Montréal, QC", phone: "+1 (514) 861-3511", notes: "Grand historic hotel directly connected to Gare Centrale.", coords: [45.5005, -73.5670], googleUrl: "https://www.google.com/maps/search/?api=1&query=Fairmont+The+Queen+Elizabeth+Montreal+QC" }
      ],
      bikeShops: [
        { name: "Bicycles Quilicot", address: "1775 Rue Saint-Denis, Montréal, QC", phone: "(514) 499-9600", notes: "Premier Montreal bike shop with mechanics & cardboard transit boxes.", coords: [45.5180, -73.5680], googleUrl: "https://www.google.com/maps/search/?api=1&query=Bicycles+Quilicot+Montreal+QC" },
        { name: "MEC Montréal", address: "4394 Rue Saint-Denis, Montréal, QC", phone: "(514) 788-5878", notes: "Touring gear, bike bags, tools, and accessories.", coords: [45.5230, -73.5820], googleUrl: "https://www.google.com/maps/search/?api=1&query=MEC+Montreal" }
      ],
      bailout: "Longueuil Metro Station (Yellow Line - rolls directly under St. Lawrence River to Berri-UQAM); REM light rail; Montreal taxi vans."
    }
  ]
};

const TOUR_DATA_5DAY = {
  id: "5day",
  title: "5-Day High-Tempo Tour (Honest Edition)",
  totalDistanceMiles: 425,
  durationDays: 5,
  averageDailyMiles: 85.0,
  elevationGainFt: 13000,
  schedule: "Honest 5-Day High-Tempo Expedition (~85 mi/day)",
  pace: "Fast Endurance Touring (14-17 mph / 22-27 km/h) • Athletic riders on light setups only",
  days: [
    {
      day: 1,
      dayOfWeek: "Day 1",
      name: "Day 1: NYC to Poughkeepsie / Highland",
      subtitle: "Westchester Trailways, Maybrook & Walkway Over the Hudson",
      distanceMiles: 95.0,
      distanceKm: 152.9,
      elevationFt: 3000,
      surface: "85% Paved Rail Trails (Hudson River, North County, Maybrook, Dutchess Rail Trail), 15% City/Road Links",
      color: "#2563eb",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Battery+Park+New+York+NY&destination=Poughkeepsie+NY&waypoints=Trailside+Cafe+Yorktown+Heights+NY%7CHopewell+Junction+NY&travelmode=bicycling",
      accelerateOption: {
        name: "Push to Kingston Stockade",
        distanceMiles: 125.0,
        extraMiles: 30.0,
        checkpointMile: 90,
        targetTown: "Kingston, NY",
        notes: "Reality check: Walkway to Kingston is ~30 miles north via Wallkill Valley trail or Route 9W/River Rd. Only attempt if rolling into Poughkeepsie before 2:00 PM with strong legs and full daylight!",
        googleMapsUrl: "https://www.google.com/maps/dir/?api=1&origin=Battery+Park+New+York+NY&destination=Kingston+NY&waypoints=Trailside+Cafe+Yorktown+Heights+NY%7CWalkway+Over+the+Hudson+Highland+NY&travelmode=bicycling",
        hotel: { name: "Hotel Kinsley / Best Western Plus Kingston", phone: "(845) 768-3620" }
      },
      startCoords: [40.7033, -74.0170],
      endCoords: [41.7108, -73.9442],
      track: [
        [40.7033, -74.0170], [40.8517, -73.9404], [40.8978, -73.8860], [41.0534, -73.8187],
        [41.2720, -73.7820], [41.3973, -73.6171], [41.5834, -73.8057], [41.7108, -73.9442]
      ],
      lunch: {
        name: "Trailside Cafe (Yorktown Heights)",
        location: "1807 Commerce St, Yorktown Heights, NY",
        mile: 38,
        notes: "Directly on trail. High-protein paninis, smoothies, quick turnaround.",
        coords: [41.2720, -73.7820],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Trailside+Cafe+Yorktown+Heights+NY"
      },
      hotels: [
        { name: "Hyatt Place Poughkeepsie", address: "2165 South Rd, Poughkeepsie, NY", phone: "(845) 380-0000", notes: "Modern, bike-friendly baseline finish.", coords: [41.6500, -73.9300], googleUrl: "https://www.google.com/maps/search/?api=1&query=Hyatt+Place+Poughkeepsie+NY" },
        { name: "Hotel Kinsley (Kingston - Accelerated Finish)", address: "301 Wall St, Kingston, NY", phone: "(845) 768-3620", notes: "Historic Stockade boutique hotel if taking the +30 mi push.", coords: [41.9335, -74.0190], googleUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Kinsley+Kingston+NY" }
      ],
      bikeShops: [
        { name: "Yorktown Cycles", address: "1899 Commerce St, Yorktown Heights, NY", phone: "(914) 245-5504", notes: "Mile 38 on trail.", coords: [41.2725, -73.7815], googleUrl: "https://www.google.com/maps/search/?api=1&query=Yorktown+Cycles+Yorktown+Heights+NY" },
        { name: "Bikeway - Hopewell Junction", address: "812 Route 82, Hopewell Junction, NY", phone: "(845) 223-8100", notes: "Mile 72 on trail.", coords: [41.5830, -73.8060], googleUrl: "https://www.google.com/maps/search/?api=1&query=Bikeway+Hopewell+Junction+NY" }
      ],
      bailout: "Metro-North Hudson Line at Poughkeepsie Station (Mile 95)."
    },
    {
      day: 2,
      dayOfWeek: "Day 2",
      name: "Day 2: Poughkeepsie to Troy (via Hudson + AHET)",
      subtitle: "Hudson Escarpment, Warren Street & Albany-Hudson Electric Trail",
      distanceMiles: 85.0,
      distanceKm: 136.8,
      elevationFt: 2500,
      surface: "60% Paved Rail Trail (AHET), 40% Scenic Secondary Roads (Route 9G & River Rd via Rhinebeck)",
      color: "#0891b2",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Poughkeepsie+NY&destination=Troy+NY&waypoints=Rhinebeck+NY%7CWarren+St+Hudson+NY%7CKinderhook+NY&travelmode=bicycling",
      accelerateOption: {
        name: "Push to Saratoga Springs Spa",
        distanceMiles: 105.0,
        extraMiles: 20.0,
        checkpointMile: 78,
        targetTown: "Saratoga Springs, NY",
        notes: "At Waterford Lock 2, take the Zim Smith Trail to Ballston Spa and roads into Saratoga. Only feasible if arriving at Waterford by 3:00 PM.",
        googleMapsUrl: "https://www.google.com/maps/dir/?api=1&origin=Poughkeepsie+NY&destination=Saratoga+Springs+NY&waypoints=Warren+St+Hudson+NY%7CWaterford+NY&travelmode=bicycling",
        hotel: { name: "The Saratoga Hilton / Holiday Inn Saratoga", phone: "(518) 584-4000" }
      },
      startCoords: [41.7108, -73.9442],
      endCoords: [42.7300, -73.6900],
      track: [
        [41.7108, -73.9442], [41.9268, -73.9126], [42.0881, -73.8446], [42.2529, -73.7910],
        [42.3948, -73.7001], [42.5162, -73.6104], [42.6526, -73.7562], [42.7300, -73.6900]
      ],
      lunch: {
        name: "Le Gamin Cafe / Tanzy's (Hudson, NY)",
        location: "Warren St, Hudson, NY",
        mile: 42,
        notes: "Quick, delicious French savory crepes & espresso in vibrant Hudson.",
        coords: [42.2515, -73.7880],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Le+Gamin+Cafe+Hudson+NY"
      },
      hotels: [
        { name: "Best Western Plus Franklin Square Inn Troy", address: "1 4th St, Troy, NY", phone: "(518) 274-8800", notes: "Downtown Troy baseline finish across from riverfront.", coords: [42.7320, -73.6910], googleUrl: "https://www.google.com/maps/search/?api=1&query=Franklin+Square+Inn+Troy+NY" },
        { name: "The Saratoga Hilton (Accelerated Finish)", address: "534 Broadway, Saratoga Springs, NY", phone: "(518) 584-4000", notes: "If taking the push to Saratoga.", coords: [43.0845, -73.7840], googleUrl: "https://www.google.com/maps/search/?api=1&query=The+Saratoga+Hilton" }
      ],
      bikeShops: [
        { name: "Steiner's Sports", address: "301 Warren St, Hudson, NY", phone: "(518) 828-5063", notes: "Mile 42 on Warren St.", coords: [42.2530, -73.7915], googleUrl: "https://www.google.com/maps/search/?api=1&query=Steiner's+Sports+Hudson+NY" },
        { name: "Down Tube Bicycle Works", address: "466 Madison Ave, Albany, NY", phone: "(518) 434-1711", notes: "Mile 78 in Albany.", coords: [42.6565, -73.7690], googleUrl: "https://www.google.com/maps/search/?api=1&query=Down+Tube+Bicycle+Works+Albany+NY" }
      ],
      bailout: "Amtrak Hudson Station (Mile 42) and Amtrak Albany-Rensselaer (Mile 78)."
    },
    {
      day: 3,
      dayOfWeek: "Day 3",
      name: "Day 3: Troy to Ticonderoga",
      subtitle: "Champlain Canalway, Whitehall Lock 12 & Adirondack Foothills",
      distanceMiles: 87.0,
      distanceKm: 140.0,
      elevationFt: 2500,
      surface: "75% Low-Traffic Highways (US-4 & NY-22), 25% Canal Path",
      color: "#16a34a",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Troy+NY&destination=Ticonderoga+NY&waypoints=Schuylerville+NY%7CWhitehall+NY&travelmode=bicycling",
      accelerateOption: {
        name: "Push to Historic Essex / Westport",
        distanceMiles: 105.0,
        extraMiles: 18.0,
        checkpointMile: 85,
        targetTown: "Essex, NY",
        notes: "At Ticonderoga, pushing 18 miles north along Champlain bluffs into Essex. Very hilly finish!",
        googleMapsUrl: "https://www.google.com/maps/dir/?api=1&origin=Troy+NY&destination=Essex+NY&waypoints=Whitehall+NY%7CTiconderoga+NY&travelmode=bicycling",
        hotel: { name: "The Inn on the Library Lawn (Essex) / Stone House B&B", phone: "(518) 546-3400" }
      },
      startCoords: [42.7300, -73.6900],
      endCoords: [43.8478, -73.4257],
      track: [
        [42.7300, -73.6900], [42.7909, -73.6818], [43.1009, -73.5784], [43.2678, -73.5857],
        [43.5556, -73.4040], [43.6850, -73.4150], [43.8423, -73.4046], [43.8478, -73.4257]
      ],
      lunch: {
        name: "Historic Grounds Restaurant & Coffee Bar (Whitehall)",
        location: "142 Main St, Whitehall, NY",
        mile: 56,
        notes: "Hearty paninis, soups, espresso overlooking Champlain Canal Lock 12.",
        coords: [43.5560, -73.4045],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Historic+Grounds+Whitehall+NY"
      },
      hotels: [
        { name: "Best Western Plus Ticonderoga", address: "260 Burgoyne Rd, Ticonderoga, NY", phone: "(518) 585-1800", notes: "Clean, cyclist-friendly baseline finish.", coords: [43.8465, -73.4350], googleUrl: "https://www.google.com/maps/search/?api=1&query=Best+Western+Plus+Ticonderoga+NY" }
      ],
      bikeShops: [
        { name: "Rick's Bike Shop (Queensbury detour)", address: "368 Dix Ave, Queensbury, NY", phone: "(518) 793-8986", notes: "Massive inventory of parts and accessories.", coords: [43.3160, -73.6190], googleUrl: "https://www.google.com/maps/search/?api=1&query=Rick's+Bike+Shop+Queensbury+NY" }
      ],
      bailout: "Amtrak Fort Edward (Mile 36), Whitehall (Mile 56), and Ticonderoga (Mile 85). (Carry-on rack in coach; verify Mon-Thu schedule)."
    },
    {
      day: 4,
      dayOfWeek: "Day 4",
      name: "Day 4: Ticonderoga to Plattsburgh (Queen Stage)",
      subtitle: "Adirondack Coast, Rolling Bluffs & Ausable Chasm",
      distanceMiles: 70.0,
      distanceKm: 112.7,
      elevationFt: 4000,
      surface: "85% Scenic 2-Lane Highway (NY-9N / NY-22) with Lake Champlain Views, 15% Local Paths. Hardest climbing day of tour.",
      color: "#d97706",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Ticonderoga+NY&destination=Plattsburgh+NY&waypoints=Essex+NY%7CAusable+Chasm+NY&travelmode=bicycling",
      accelerateOption: {
        name: "Push into Saint-Jean, QC (Border Push)",
        distanceMiles: 120.0,
        extraMiles: 50.0,
        checkpointMile: 68,
        targetTown: "Saint-Jean-sur-Richelieu, QC (Canada)",
        notes: "Reality check: Plattsburgh to Saint-Jean is ~50 miles (not 24!). A true border push means a grueling 120-mile / +4,500 ft day with customs clearance. Not recommended in October daylight.",
        googleMapsUrl: "https://www.google.com/maps/dir/?api=1&origin=Ticonderoga+NY&destination=Saint-Jean-sur-Richelieu+QC&waypoints=Essex+NY%7CPlattsburgh+NY%7CRouses+Point+NY&travelmode=bicycling",
        hotel: { name: "Quality Hotel Centre de Congrès (Saint-Jean-sur-Richelieu, QC)", phone: "+1 (450) 515-5755" }
      },
      startCoords: [43.8478, -73.4257],
      endCoords: [44.6995, -73.4529],
      track: [
        [43.8478, -73.4257], [44.0539, -73.4607], [44.1834, -73.4357], [44.3101, -73.3537],
        [44.3645, -73.3876], [44.5242, -73.4862], [44.6995, -73.4529]
      ],
      lunch: {
        name: "The Cup Cafe / Essex Ice Cream Cafe",
        location: "Main St, Essex, NY",
        mile: 38,
        notes: "Lakeside dining on the porch watching the ferry to Charlotte, Vermont.",
        coords: [44.3105, -73.3540],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=The+Cup+Cafe+Essex+NY"
      },
      hotels: [
        { name: "Best Western Plus Plattsburgh", address: "446 NY-3, Plattsburgh, NY", phone: "(518) 561-7000", notes: "Comfortable baseline finish.", coords: [44.6940, -73.4890], googleUrl: "https://www.google.com/maps/search/?api=1&query=Best+Western+Plus+Plattsburgh" }
      ],
      bikeShops: [
        { name: "Maui North Ski, Bike & Board", address: "168 Margaret St, Plattsburgh, NY", phone: "(518) 563-7245", notes: "Downtown Plattsburgh premier shop.", coords: [44.6980, -73.4530], googleUrl: "https://www.google.com/maps/search/?api=1&query=Maui+North+Plattsburgh+NY" }
      ],
      bailout: "Amtrak Westport (Mile 28) and Amtrak Plattsburgh (Mile 70)."
    },
    {
      day: 5,
      dayOfWeek: "Day 5",
      name: "Day 5: Plattsburgh to Downtown Montréal (The Grand Finish!)",
      subtitle: "Rouses Point, QC-223 Richelieu River, Chambly Canal & Old Port Victory",
      distanceMiles: 88.0,
      distanceKm: 141.6,
      elevationFt: 1200,
      surface: "55% Flat Rural Roads (US-9 & QC-223), 45% Route Verte Dedicated Paths (Chambly Canal to Chambly, Longueuil & Bridge)",
      color: "#059669",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Plattsburgh+NY&destination=Vieux-Montr%C3%A9al+QC&waypoints=Rouses+Point+NY%7CBistro+La+Trinquette+Saint-Jean-sur-Richelieu+QC%7CChambly+Canal+National+Historic+Site+QC&travelmode=bicycling",
      startCoords: [44.6995, -73.4529],
      endCoords: [45.5017, -73.5673],
      track: [
        [44.6995, -73.4529], [44.9939, -73.3646], [45.0064, -73.3670], [45.3056, -73.2533],
        [45.4497, -73.2872], [45.4593, -73.5134], [45.5017, -73.5673]
      ],
      lunch: {
        name: "Bistro La Trinquette (Saint-Jean-sur-Richelieu)",
        location: "155 Rue Richelieu, Saint-Jean-sur-Richelieu, QC",
        mile: 48,
        notes: "Riverside patio right at the start of the Chambly Canal! Savory crêpes, gourmet panini, Quebec cider, poutine.",
        coords: [45.3060, -73.2530],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Bistro+La+Trinquette+Saint-Jean-sur-Richelieu+QC"
      },
      hotels: [
        { name: "Hotel Monville (Certified 'Bienvenue Cyclistes')", address: "1041 Rue de Bleury, Montréal, QC", phone: "+1 (514) 379-2000", notes: "Sleek, modern, dedicated secure bike room, steps from Place d'Armes.", coords: [45.5035, -73.5630], googleUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Monville+Montreal+QC" },
        { name: "Fairmont The Queen Elizabeth", address: "900 René-Lévesque Blvd W, Montréal, QC", phone: "+1 (514) 861-3511", notes: "Grand historic hotel directly connected to Gare Centrale.", coords: [45.5005, -73.5670], googleUrl: "https://www.google.com/maps/search/?api=1&query=Fairmont+The+Queen+Elizabeth+Montreal+QC" }
      ],
      bikeShops: [
        { name: "Bicycles Quilicot", address: "1775 Rue Saint-Denis, Montréal, QC", phone: "(514) 499-9600", notes: "Montréal's iconic cycling hub.", coords: [45.5180, -73.5680], googleUrl: "https://www.google.com/maps/search/?api=1&query=Bicycles+Quilicot+Montreal+QC" }
      ],
      bailout: "CRITICAL AMTRAK RULE: Carry-on bicycle service on the Amtrak Adirondack ENDS at Rouses Point, NY (Mile 24). You CANNOT roll an unboxed bicycle onto the train at Montreal Gare Centrale! Return options: 1) Ride ~48 mi back to Rouses Point; 2) Box bike in Montreal (Bicycles Quilicot / MEC) for cargo/bus; 3) One-way rental car (Enterprise/Avis)."
    }
  ]
};

// 7-Day Gentler Variant & Alternative Route Options
const TOUR_VARIANTS = {
  sevenDayOption: {
    title: "7-Day Gentler Option (Recommended for October Daylight)",
    description: "In October, with only ~11 hours of daylight and chilly morning temperatures, 80+ mile days leave zero margin for mechanicals or adverse weather. A 7-day schedule keeps daily mileage around 60–65 miles.",
    splits: [
      {
        name: "Option A: Split Day 2 (Hudson Valley)",
        stages: [
          "Day 1: Battery Park to Brewster / Carmel (~60 mi)",
          "Day 2: Brewster to Rhinebeck (~60 mi via Maybrook & Dutchess Rail Trails)",
          "Day 3: Rhinebeck to Albany / Troy (~55 mi via Hudson & AHET)",
          "Day 4: Troy to Saratoga Springs / Schuylerville (~45–50 mi)",
          "Day 5: Saratoga to Ticonderoga (~75 mi)",
          "Day 6: Ticonderoga to Plattsburgh (~70 mi)",
          "Day 7: Plattsburgh to Montréal (~87 mi)"
        ]
      },
      {
        name: "Option B: Split Day 6 (Quebec Border & Victory Lap)",
        stages: [
          "Days 1–5: Follow standard 6-Day itinerary to Plattsburgh",
          "Day 6: Plattsburgh to Saint-Jean-sur-Richelieu (~50 mi, including border crossing)",
          "Day 7: Saint-Jean to Old Montréal (~37 mi short victory cruise along Chambly Canal & bridge)"
        ]
      }
    ]
  },
  vermontUpgrade: {
    title: "Vermont Champlain Islands Upgrade Variant",
    description: "At Essex, NY (Day 5), take the Charlotte–Essex Ferry across Lake Champlain into Vermont. Ride north through Burlington, traverse the spectacular Island Line Trail (former railway causeway extending into the open lake), and pedal through the Champlain Islands (Grand Isle, North Hero, Isle La Motte) before crossing back into Rouses Point, NY to rejoin the main route into Quebec. Widely considered the most scenic riding in the entire Northeast.",
    advisory: "Check the Island Line Bike Ferry schedule (Local Motion) before departure — service typically winds down around Columbus Day / mid-October."
  }
};

// Global default export for compatibility
const TOUR_DATA = TOUR_DATA_6DAY;

const PACKING_CHECKLIST = [
  { 
    category: "Bike Repairs & Spares", 
    items: [
      "2x Spare inner tubes (correct valve length for your rims)", 
      "Tubeless plug kit & valve core tool (if running tubeless)", 
      "Compact mini-pump / CO2 inflator + 3 cartridges", 
      "Park Tool tire boots & self-adhesive patches", 
      "Multi-tool with chain breaker & Torx T25", 
      "Quick links (missing links) matching your chain speed", 
      "2x Tough tire levers", 
      "Mini chain lube bottle & rag", 
      "Daylight-visible rear red strobe (minimum 50+ lumens)", 
      "High-power 800+ lumen headlight (for October 6:25 PM sunset)", 
      "Compact cable lock / Ottolock for cafe stops"
    ] 
  },
  { 
    category: "Electronics & Tech", 
    items: [
      "GPS bike computer (Garmin / Wahoo / Hammerhead) loaded with GPX tracks", 
      "Smartphone with offline downloaded Google Maps (Albany to Montreal)", 
      "10,000–20,000 mAh external battery power bank (cold drains batteries 30% faster)", 
      "Charging cables (USB-C, Lightning, GPS mount cable)", 
      "Handlebar phone mount (Quad Lock or similar)", 
      "Zip-top waterproof baggies for phone and electronics"
    ] 
  },
  { 
    category: "October Riding Apparel & Cold Kit", 
    items: [
      "2–3 pairs quality cycling bibs / padded shorts", 
      "2–3 breathable moisture-wicking jerseys", 
      "1 packable waterproof rain/wind shell jacket", 
      "1 thermal wind vest or lightweight mid-layer", 
      "1 pair arm warmers & thermal knee/leg warmers", 
      "1 pair full-finger windproof cycling gloves (for 35–42°F morning starts)", 
      "Thermal ear-covering skullcap or Merino buff/neck gaiter", 
      "3 pairs merino wool cycling socks", 
      "Cycling shoes with walkable recessed cleats (SPD) + toe covers", 
      "UV protection sunglasses (clear or low-light lenses for late afternoons)", 
      "Cycling helmet with reflective safety strips"
    ] 
  },
  { 
    category: "Border Documents, Legal & Personal", 
    items: [
      "Valid Passport, Enhanced Driver's License (EDL), or NEXUS card (no 6-month validity requirement for Canada)", 
      "Photo of bike serial number & purchase receipt on phone (CBP proof of US origin upon re-entry)", 
      "Zero-Cannabis compliance check (transporting ANY cannabis across the border is illegal under federal law)", 
      "Bear spray rules: Labeled animal deterrent spray is permitted; human pepper spray is strictly prohibited under Canadian Criminal Code", 
      "Credit cards (no foreign transaction fee recommended) & photo ID", 
      "$50–$100 CAD cash for rural Quebec farm stands and cafes", 
      "1 set lightweight casual clothes & shoes for evening dinners", 
      "Compact toiletry kit + travel chamois butter / sunscreen", 
      "Personal health insurance cards & emergency contact card"
    ] 
  }
];
