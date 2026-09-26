// Complete Data Structures for Both 6-Day Leisurely Tour and 5-Day Fast Tour (+ Acceleration Options)

const TOUR_DATA_6DAY = {
  id: "6day",
  title: "6-Day Leisurely Tour (Sunday to Friday)",
  totalDistanceMiles: 389,
  durationDays: 6,
  averageDailyMiles: 64.8,
  elevationGainFt: 11950,
  schedule: "Sunday Departure -> Friday Arrival in Montréal",
  pace: "Steady Leisurely Touring (12-14 mph / 19-23 km/h)",
  days: [
    {
      day: 1,
      dayOfWeek: "Sunday",
      name: "Sunday • Day 1: NYC to Brewster / Carmel",
      subtitle: "The Weekend Escape: Manhattan to Westchester & Putnam Greenways",
      distanceMiles: 54.2,
      distanceKm: 87.2,
      elevationFt: 1850,
      surface: "98% Paved Traffic-Free Rail Trail (Hudson River Greenway, South/North County, Putnam)",
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
        mile: 37,
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
      bailout: "Metro-North Harlem Line: Stations all along trail (Pleasantville, Katonah, Goldens Bridge, Brewster)."
    },
    {
      day: 2,
      dayOfWeek: "Monday",
      name: "Monday • Day 2: Brewster to Hudson, NY",
      subtitle: "Maybrook Trailway, Walkway Over the Hudson & Historic Warren Street",
      distanceMiles: 64.5,
      distanceKm: 103.8,
      elevationFt: 2350,
      surface: "70% Paved Rail Trail (Maybrook & Dutchess), 30% Scenic Low-Traffic Roads (Route 9G / River Rd)",
      color: "#0891b2",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Brewster+NY&destination=Warren+St+Hudson+NY&waypoints=Walkway+Over+the+Hudson+Highland+NY%7CRhinebeck+NY&travelmode=bicycling",
      startCoords: [41.3973, -73.6171],
      endCoords: [42.2529, -73.7910],
      track: [
        [41.3973, -73.6171], [41.4650, -73.6980], [41.5834, -73.8057], [41.7108, -73.9442],
        [41.7209, -73.9632], [41.9268, -73.9126], [41.9945, -73.8754], [42.0881, -73.8446],
        [42.2529, -73.7910]
      ],
      lunch: {
        name: "Underground Coffee & Ales / Walkway Cafe (Highland / Poughkeepsie)",
        location: "Highland, NY (immediately west of Walkway Over the Hudson)",
        mile: 37,
        notes: "Gourmet pressed sandwiches, espresso, craft beers, right after crossing the 212-ft high bridge!",
        coords: [41.7215, -73.9630],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Underground+Coffee+and+Ales+Highland+NY"
      },
      hotels: [
        { name: "The Barlow Hotel", address: "542 Warren St, Hudson, NY", phone: "(518) 828-2100", notes: "Boutique hospitality directly on historic Warren St with secure bike storage.", coords: [42.2510, -73.7870], googleUrl: "https://www.google.com/maps/search/?api=1&query=The+Barlow+Hotel+Hudson+NY" },
        { name: "The Wick, Hudson", address: "41 Cross St, Hudson, NY", phone: "(518) 249-6825", notes: "Modern luxury hotel 1 block from Hudson Amtrak station; cyclist friendly.", coords: [42.2525, -73.7980], googleUrl: "https://www.google.com/maps/search/?api=1&query=The+Wick+Hudson+NY" }
      ],
      bikeShops: [
        { name: "Bikeway - Hopewell Junction", address: "812 Route 82, Hopewell Junction, NY", phone: "(845) 223-8100", notes: "Direct rail-trail access at Mile 21.", coords: [41.5830, -73.8060], googleUrl: "https://www.google.com/maps/search/?api=1&query=Bikeway+Hopewell+Junction+NY" },
        { name: "Steiner's Sports - Hudson", address: "301 Warren St, Hudson, NY", phone: "(518) 828-5063", notes: "Right on Warren Street in Hudson. Mechanic on duty.", coords: [42.2530, -73.7915], googleUrl: "https://www.google.com/maps/search/?api=1&query=Steiner's+Sports+Hudson+NY" }
      ],
      bailout: "Metro-North Hudson Line at Poughkeepsie (Mile 37); Amtrak at Rhinecliff (Mile 47) and Hudson (Mile 64.5)."
    },
    {
      day: 3,
      dayOfWeek: "Tuesday",
      name: "Tuesday • Day 3: Hudson to Saratoga Springs, NY",
      subtitle: "Albany-Hudson Electric Trail, Troy Waterfront & Saratoga Spa Gateway",
      distanceMiles: 65.2,
      distanceKm: 104.9,
      elevationFt: 1850,
      surface: "65% Paved Rail Trails (AHET & Zim Smith), 35% Canal Roads & Bike Lanes",
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
        mile: 38,
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
      bailout: "Amtrak Albany-Rensselaer Station (Mile 36) and Amtrak Saratoga Springs Station (Mile 65)."
    },
    {
      day: 4,
      dayOfWeek: "Wednesday",
      name: "Wednesday • Day 4: Saratoga Springs to Ticonderoga, NY",
      subtitle: "Champlain Canalway, Birthplace of the US Navy & Fort Ticonderoga",
      distanceMiles: 61.8,
      distanceKm: 99.5,
      elevationFt: 2150,
      surface: "75% Scenic Low-Traffic State Highways (Route 4 & NY-22), 25% Canal Path",
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
        mile: 34,
        notes: "Wholesome sandwiches, soups, and espresso right next to Champlain Canal Lock 12 Park.",
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
      bailout: "Amtrak Fort Edward-Glens Falls (Mile 19), Whitehall Station (Mile 34), and Ticonderoga Station (Mile 60)."
    },
    {
      day: 5,
      dayOfWeek: "Thursday",
      name: "Thursday • Day 5: Ticonderoga to Plattsburgh, NY",
      subtitle: "Adirondack Coastline: Historic Essex, Ausable Chasm & Lake Vistas",
      distanceMiles: 55.2,
      distanceKm: 88.8,
      elevationFt: 1950,
      surface: "80% Scenic 2-Lane Highway (NY-9N / NY-22) with Lake Champlain Views, 20% Local Bikeways",
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
        mile: 27,
        notes: "Dine on the porch overlooking the Lake Champlain ferry to Vermont. Outstanding clam chowder, sandwiches, fresh pastries.",
        coords: [44.3105, -73.3540],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=The+Cup+Cafe+Main+St+Essex+NY"
      },
      hotels: [
        { name: "Best Western Plus Plattsburgh", address: "446 NY-3, Plattsburgh, NY", phone: "(518) 561-7000", notes: "Comfortable rooms, bike storage friendly, hearty complimentary breakfast.", coords: [44.6940, -73.4890], googleUrl: "https://www.google.com/maps/search/?api=1&query=Best+Western+Plus+Plattsburgh+NY" }
      ],
      bikeShops: [
        { name: "Maui North Ski, Bike & Board", address: "168 Margaret St, Plattsburgh, NY", phone: "(518) 563-7245", notes: "Full-service premier shop in downtown Plattsburgh.", coords: [44.6980, -73.4530], googleUrl: "https://www.google.com/maps/search/?api=1&query=Maui+North+Plattsburgh+NY" }
      ],
      bailout: "Amtrak Westport Station (Mile 15) and Amtrak Plattsburgh Station (Mile 55)."
    },
    {
      day: 6,
      dayOfWeek: "Friday",
      name: "Friday • Day 6: Plattsburgh to Montréal, QC (Canada)",
      subtitle: "Arrival Day! International Border, Chambly Canal & Bridge into Old Montréal",
      distanceMiles: 62.4,
      distanceKm: 100.4,
      elevationFt: 850,
      surface: "65% Route Verte Traffic-Free Bike Paths (Chambly Canal & Bridges), 35% Flat Country Roads",
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
        mile: 42,
        notes: "Riverside patio right at the start of the Chambly Canal! Savory crêpes, gourmet panini, Quebec cider, poutine.",
        coords: [45.3060, -73.2530],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Bistro+La+Trinquette+Saint-Jean-sur-Richelieu+QC"
      },
      hotels: [
        { name: "Hotel Monville (Certified 'Bienvenue Cyclistes')", address: "1041 Rue de Bleury, Montréal, QC", phone: "+1 (514) 379-2000", notes: "Sleek, modern, dedicated secure bike room, steps from Place d'Armes.", coords: [45.5035, -73.5630], googleUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Monville+Montreal+QC" },
        { name: "Fairmont The Queen Elizabeth", address: "900 René-Lévesque Blvd W, Montréal, QC", phone: "+1 (514) 861-3511", notes: "Grand historic hotel directly connected to Gare Centrale for Amtrak return!", coords: [45.5005, -73.5670], googleUrl: "https://www.google.com/maps/search/?api=1&query=Fairmont+The+Queen+Elizabeth+Montreal+QC" }
      ],
      bikeShops: [
        { name: "Performance Bégin", address: "470 Rue Saint-Jacques, Saint-Jean-sur-Richelieu, QC", phone: "(450) 348-3561", notes: "First major Quebec shop on Route Verte.", coords: [45.3080, -73.2580], googleUrl: "https://www.google.com/maps/search/?api=1&query=Performance+Begin+Saint-Jean-sur-Richelieu+QC" },
        { name: "Bicycles Quilicot", address: "1775 Rue Saint-Denis, Montréal, QC", phone: "(514) 499-9600", notes: "Montréal's iconic cycling hub.", coords: [45.5180, -73.5680], googleUrl: "https://www.google.com/maps/search/?api=1&query=Bicycles+Quilicot+Montreal+QC" }
      ],
      bailout: "Amtrak Adirondack Train #68 daily from Montreal Gare Centrale directly to New York Penn Station."
    }
  ]
};

const TOUR_DATA_5DAY = {
  id: "5day",
  title: "5-Day Fast Tour (+ Acceleration Push Options)",
  totalDistanceMiles: 389,
  durationDays: 5,
  averageDailyMiles: 77.8,
  elevationGainFt: 11950,
  schedule: "High-Tempo 5-Day Expedition (Can Shave to 4 Days if Motoring)",
  pace: "Fast Endurance Touring (14-17 mph / 22-27 km/h)",
  days: [
    {
      day: 1,
      dayOfWeek: "Day 1",
      name: "Day 1: NYC to Poughkeepsie / Highland (Push to Kingston)",
      subtitle: "Westchester Trailways, Maybrook & Walkway Over the Hudson",
      distanceMiles: 74.8,
      distanceKm: 120.4,
      elevationFt: 2650,
      surface: "92% Paved Rail Trails (Hudson River, North County, Maybrook, Dutchess Rail Trail)",
      color: "#2563eb",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Battery+Park+New+York+NY&destination=Poughkeepsie+NY&waypoints=Trailside+Cafe+Yorktown+Heights+NY%7CHopewell+Junction+NY&travelmode=bicycling",
      accelerateOption: {
        name: "Push to Kingston Stockade",
        distanceMiles: 90.8,
        extraMiles: 16.0,
        checkpointMile: 72,
        targetTown: "Kingston, NY",
        notes: "At the Walkway Over the Hudson, if feeling great by 3:00 PM, push 16 miles north via Hudson Valley Rail Trail and River Rd into historic Kingston Stockade!",
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
        mile: 37,
        notes: "Directly on trail. High-protein paninis, smoothies, quick turnaround.",
        coords: [41.2720, -73.7820],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Trailside+Cafe+Yorktown+Heights+NY"
      },
      hotels: [
        { name: "Hyatt Place Poughkeepsie", address: "2165 South Rd, Poughkeepsie, NY", phone: "(845) 380-0000", notes: "Modern, bike-friendly baseline finish.", coords: [41.6500, -73.9300], googleUrl: "https://www.google.com/maps/search/?api=1&query=Hyatt+Place+Poughkeepsie+NY" },
        { name: "Hotel Kinsley (Kingston - Accelerated Finish)", address: "301 Wall St, Kingston, NY", phone: "(845) 768-3620", notes: "Historic Stockade boutique hotel if taking the +16 mi push.", coords: [41.9335, -74.0190], googleUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Kinsley+Kingston+NY" }
      ],
      bikeShops: [
        { name: "Yorktown Cycles", address: "1899 Commerce St, Yorktown Heights, NY", phone: "(914) 245-5504", notes: "Mile 37 on trail.", coords: [41.2725, -73.7815], googleUrl: "https://www.google.com/maps/search/?api=1&query=Yorktown+Cycles+Yorktown+Heights+NY" },
        { name: "Bikeway - Hopewell Junction", address: "812 Route 82, Hopewell Junction, NY", phone: "(845) 223-8100", notes: "Mile 58 on trail.", coords: [41.5830, -73.8060], googleUrl: "https://www.google.com/maps/search/?api=1&query=Bikeway+Hopewell+Junction+NY" }
      ],
      bailout: "Metro-North Hudson Line at Poughkeepsie Station (Mile 72)."
    },
    {
      day: 2,
      dayOfWeek: "Day 2",
      name: "Day 2: Poughkeepsie to Albany / Troy (Push to Saratoga)",
      subtitle: "Hudson Escarpment, Warren Street & Albany-Hudson Electric Trail",
      distanceMiles: 76.5,
      distanceKm: 123.1,
      elevationFt: 2300,
      surface: "65% Paved Rail Trail (AHET), 35% Scenic Secondary Roads (Route 9G / River Rd)",
      color: "#0891b2",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Poughkeepsie+NY&destination=Troy+NY&waypoints=Rhinebeck+NY%7CWarren+St+Hudson+NY%7CKinderhook+NY&travelmode=bicycling",
      accelerateOption: {
        name: "Push to Saratoga Springs Spa",
        distanceMiles: 92.5,
        extraMiles: 16.0,
        checkpointMile: 70,
        targetTown: "Saratoga Springs, NY",
        notes: "At Waterford Lock 2, if legs are rolling strong by 3:30 PM, bypass Albany/Troy and take the paved Zim Smith Trail into Saratoga Springs for evening spa mineral baths!",
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
        mile: 38,
        notes: "Quick, delicious French savory crepes & espresso in vibrant Hudson.",
        coords: [42.2515, -73.7880],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Le+Gamin+Cafe+Hudson+NY"
      },
      hotels: [
        { name: "Renaissance Albany Hotel", address: "144 State St, Albany, NY", phone: "(518) 992-2500", notes: "Downtown baseline finish across from Capitol.", coords: [42.6520, -73.7580], googleUrl: "https://www.google.com/maps/search/?api=1&query=Renaissance+Albany+Hotel" },
        { name: "The Saratoga Hilton (Accelerated Finish)", address: "534 Broadway, Saratoga Springs, NY", phone: "(518) 584-4000", notes: "If taking the +16 mi push to Saratoga.", coords: [43.0845, -73.7840], googleUrl: "https://www.google.com/maps/search/?api=1&query=The+Saratoga+Hilton" }
      ],
      bikeShops: [
        { name: "Steiner's Sports", address: "301 Warren St, Hudson, NY", phone: "(518) 828-5063", notes: "Mile 38 on Warren St.", coords: [42.2530, -73.7915], googleUrl: "https://www.google.com/maps/search/?api=1&query=Steiner's+Sports+Hudson+NY" },
        { name: "Down Tube Bicycle Works", address: "466 Madison Ave, Albany, NY", phone: "(518) 434-1711", notes: "Mile 70 in Albany.", coords: [42.6565, -73.7690], googleUrl: "https://www.google.com/maps/search/?api=1&query=Down+Tube+Bicycle+Works+Albany+NY" }
      ],
      bailout: "Amtrak Hudson Station (Mile 38) and Amtrak Albany-Rensselaer (Mile 70)."
    },
    {
      day: 3,
      dayOfWeek: "Day 3",
      name: "Day 3: Albany / Troy to Ticonderoga (Push to Essex / Westport)",
      subtitle: "Champlain Canalway, Whitehall Lock 12 & Adirondack Foothills",
      distanceMiles: 78.2,
      distanceKm: 125.8,
      elevationFt: 2600,
      surface: "75% Scenic Low-Traffic Highways (US-4 & NY-22), 25% Canal Path",
      color: "#16a34a",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Troy+NY&destination=Ticonderoga+NY&waypoints=Schuylerville+NY%7CWhitehall+NY&travelmode=bicycling",
      accelerateOption: {
        name: "Push to Historic Essex / Westport",
        distanceMiles: 96.2,
        extraMiles: 18.0,
        checkpointMile: 76,
        targetTown: "Essex, NY",
        notes: "At Ticonderoga, if you arrive before 4:00 PM and have daylight, push 18 miles north along Lake Champlain bluffs to historic Essex / Westport!",
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
        mile: 54,
        notes: "Hearty paninis, soups, espresso overlooking Champlain Canal Lock 12.",
        coords: [43.5560, -73.4045],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Historic+Grounds+Whitehall+NY"
      },
      hotels: [
        { name: "Best Western Plus Ticonderoga", address: "260 Burgoyne Rd, Ticonderoga, NY", phone: "(518) 585-1800", notes: "Clean, cyclist-friendly baseline finish.", coords: [43.8465, -73.4350], googleUrl: "https://www.google.com/maps/search/?api=1&query=Best+Western+Plus+Ticonderoga+NY" },
        { name: "The Stone House B&B (Port Henry / Moriah)", address: "Port Henry, NY", phone: "(518) 546-3400", notes: "Historic lakeside Victorian B&B if pushing past Ti.", coords: [44.0540, -73.4610], googleUrl: "https://www.google.com/maps/search/?api=1&query=Stone+House+BandB+Port+Henry+NY" }
      ],
      bikeShops: [
        { name: "Rick's Bike Shop (Queensbury detour)", address: "368 Dix Ave, Queensbury, NY", phone: "(518) 793-8986", notes: "Massive inventory of parts and accessories.", coords: [43.3160, -73.6190], googleUrl: "https://www.google.com/maps/search/?api=1&query=Rick's+Bike+Shop+Queensbury+NY" }
      ],
      bailout: "Amtrak Fort Edward (Mile 36), Whitehall (Mile 54), and Ticonderoga (Mile 76)."
    },
    {
      day: 4,
      dayOfWeek: "Day 4",
      name: "Day 4: Ticonderoga to Plattsburgh (THE BORDER PUSH to Saint-Jean, QC!)",
      subtitle: "Adirondack Coast, Ausable Chasm & Canada Border Crossing",
      distanceMiles: 72.4,
      distanceKm: 116.5,
      elevationFt: 2350,
      surface: "80% Scenic 2-Lane Highway (NY-9N / NY-22) with Lake Champlain Views, 20% Local Paths",
      color: "#d97706",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Ticonderoga+NY&destination=Plattsburgh+NY&waypoints=Essex+NY%7CAusable+Chasm+NY&travelmode=bicycling",
      accelerateOption: {
        name: "THE BORDER PUSH into Saint-Jean, QC!",
        distanceMiles: 96.4,
        extraMiles: 24.0,
        checkpointMile: 55,
        targetTown: "Saint-Jean-sur-Richelieu, QC (Canada)",
        notes: "At Plattsburgh, if rolling strong by 2:30 PM: ride 24 miles to Rouses Point, CROSS THE CANADIAN BORDER at Lacolle, and sleep in Saint-Jean-sur-Richelieu! This sets up a tiny 28-mile sprint into Montreal on Day 5!",
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
        mile: 27,
        notes: "Lakeside dining on the porch watching the ferry to Vermont.",
        coords: [44.3105, -73.3540],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=The+Cup+Cafe+Essex+NY"
      },
      hotels: [
        { name: "Best Western Plus Plattsburgh", address: "446 NY-3, Plattsburgh, NY", phone: "(518) 561-7000", notes: "Comfortable baseline finish.", coords: [44.6940, -73.4890], googleUrl: "https://www.google.com/maps/search/?api=1&query=Best+Western+Plus+Plattsburgh" },
        { name: "Quality Hotel Centre de Congrès (Saint-Jean, QC - Border Push)", address: "Saint-Jean-sur-Richelieu, QC", phone: "+1 (450) 515-5755", notes: "If executing the grand border push into Canada.", coords: [45.3080, -73.2580], googleUrl: "https://www.google.com/maps/search/?api=1&query=Quality+Hotel+Saint-Jean-sur-Richelieu+QC" }
      ],
      bikeShops: [
        { name: "Maui North Ski, Bike & Board", address: "168 Margaret St, Plattsburgh, NY", phone: "(518) 563-7245", notes: "Downtown Plattsburgh premier shop.", coords: [44.6980, -73.4530], googleUrl: "https://www.google.com/maps/search/?api=1&query=Maui+North+Plattsburgh+NY" }
      ],
      bailout: "Amtrak Westport (Mile 15) and Amtrak Plattsburgh (Mile 55)."
    },
    {
      day: 5,
      dayOfWeek: "Day 5",
      name: "Day 5: Plattsburgh (or Saint-Jean) to Downtown Montréal (The Grand Finish!)",
      subtitle: "Chambly Canal Path, St. Lawrence Bridge & Old Montréal Victory Lap",
      distanceMiles: 62.4,
      distanceKm: 100.4,
      elevationFt: 850,
      surface: "65% Route Verte Dedicated Paths (Chambly Canal & Bridges), 35% Flat Country Roads",
      color: "#059669",
      googleMapsDirUrl: "https://www.google.com/maps/dir/?api=1&origin=Plattsburgh+NY&destination=Vieux-Montr%C3%A9al+QC&waypoints=Rouses+Point+NY%7CBistro+La+Trinquette+Saint-Jean-sur-Richelieu+QC%7CChambly+Canal+National+Historic+Site+QC&travelmode=bicycling",
      accelerateOption: {
        name: "Morning Victory Cruise (If Accelerated on Day 4)",
        distanceMiles: 28.5,
        targetTown: "Downtown Montréal, QC",
        notes: "If you pushed across the Canadian border on Day 4 to Saint-Jean, Day 5 is an effortless 28-mile sprint along the Chambly Canal into Old Montréal in time for brunch at 11:30 AM!",
        googleMapsUrl: "https://www.google.com/maps/dir/?api=1&origin=Saint-Jean-sur-Richelieu+QC&destination=Vieux-Montr%C3%A9al+QC&waypoints=Chambly+Canal+National+Historic+Site+QC&travelmode=bicycling"
      },
      startCoords: [44.6995, -73.4529],
      endCoords: [45.5017, -73.5673],
      track: [
        [44.6995, -73.4529], [44.9939, -73.3646], [45.0064, -73.3670], [45.3056, -73.2533],
        [45.4497, -73.2872], [45.4593, -73.5134], [45.5017, -73.5673]
      ],
      lunch: {
        name: "Celebratory Finish / Bistro La Trinquette (St-Jean) or Old Montréal Terrace",
        location: "Old Montréal (Place Jacques-Cartier / Rue Saint-Paul)",
        mile: 42,
        notes: "Celebrate with French-Canadian lunch, fresh poutine, and craft beer on a historic cobblestone terrace!",
        coords: [45.5030, -73.5550],
        googleUrl: "https://www.google.com/maps/search/?api=1&query=Old+Montreal+QC"
      },
      hotels: [
        { name: "Hotel Monville (Certified 'Bienvenue Cyclistes')", address: "1041 Rue de Bleury, Montréal, QC", phone: "+1 (514) 379-2000", notes: "Sleek, modern, dedicated secure bike room, steps from Place d'Armes.", coords: [45.5035, -73.5630], googleUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Monville+Montreal+QC" },
        { name: "Fairmont The Queen Elizabeth", address: "900 René-Lévesque Blvd W, Montréal, QC", phone: "+1 (514) 861-3511", notes: "Grand historic hotel directly connected to Gare Centrale for Amtrak return!", coords: [45.5005, -73.5670], googleUrl: "https://www.google.com/maps/search/?api=1&query=Fairmont+The+Queen+Elizabeth+Montreal+QC" }
      ],
      bikeShops: [
        { name: "Bicycles Quilicot", address: "1775 Rue Saint-Denis, Montréal, QC", phone: "(514) 499-9600", notes: "Montréal's iconic cycling hub.", coords: [45.5180, -73.5680], googleUrl: "https://www.google.com/maps/search/?api=1&query=Bicycles+Quilicot+Montreal+QC" }
      ],
      bailout: "Amtrak Adirondack Train #68 daily from Montreal Gare Centrale directly back to New York Penn Station."
    }
  ]
};

// Global default export for compatibility
const TOUR_DATA = TOUR_DATA_6DAY;

const PACKING_CHECKLIST = [
  { category: "Bike Repairs & Spares", items: ["2x Spare inner tubes (correct valve length)", "Tubeless plug kit & valve core tool", "Compact mini-pump / CO2 inflator + 3 cartridges", "Park Tool tire boots & patches", "Multi-tool with chain breaker & Torx T25", "Quick links for your chain speed", "2x Tough tire levers", "Mini chain lube bottle & rag", "USB safety rear blinker (run during daylight)", "USB 400+ lumen headlight", "Compact cable lock / Ottolock"] },
  { category: "Electronics & Tech", items: ["GPS bike computer (Garmin / Wahoo) with offline maps", "Smartphone with offline Google Maps / RideWithGPS", "10,000–20,000 mAh external battery power bank", "Charging cables (USB-C, Lightning, GPS mount cable)", "Handlebar phone mount (Quad Lock or similar)"] },
  { category: "Riding Apparel", items: ["2–3 pairs quality cycling bibs / padded shorts", "2–3 breathable moisture-wicking jerseys", "1 packable waterproof rain/wind shell jacket", "1 pair arm warmers / UV sun sleeves", "3 pairs merino wool cycling socks", "Cycling shoes with walkable recessed cleats (SPD)", "UV protection sunglasses", "Cycling helmet with safety lights"] },
  { category: "Off-Bike & Personal", items: ["Valid Passport (at least 6 months validity)", "Credit cards (no foreign transaction fee recommended)", "$50–$100 CAD cash for rural Quebec farm stands", "1 set lightweight casual clothes & shoes for dinners", "Compact toiletry kit + travel chamois butter / sunscreen", "Personal health insurance cards & emergency contact card"] }
];
