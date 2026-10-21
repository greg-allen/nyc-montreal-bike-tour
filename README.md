# NYC to Montréal bike tour (Oct 4, 2026)

Hotel-to-hotel tour from New York City (Brooklyn on the 6- and 7-day plans) to Montréal on the Empire State Trail, the Lake Champlain shore, the Richelieu River and the Chambly Canal.

| Itinerary | Days | Total | Climb (est.) | Daily miles |
|:---|:---|:---|:---|:---|
| 7-Day Tour (Sunday to Saturday) | 7 | 454.4 mi | +11,800 ft | 71.9, 80.3, 77.7, 64.7, 73.6, 53.2, 33.0 |
| 6-Day Tour (Sunday to Friday) | 6 | 453.8 mi | +11,800 ft | 71.9, 80.3, 77.7, 64.7, 73.6, 85.6 |
| 5-Day Fast Tour | 5 | 449.6 mi | +11,000 ft | 102.5, 94.7, 93.2, 73.6, 85.6 |

Vermont variant (Essex ferry, Burlington, Island Line causeway, Champlain Islands) replaces Days 5 and 6 of the 7-day tour: 61.1 + 72.8 mi.

## Files
- `index.html`: the app. It works offline once loaded (libraries are bundled and a service worker caches the app), **except the background map tiles**, so download offline maps in your GPS or phone app.
- `gpx/7day/`, `gpx/6day/`, `gpx/5day/`, `gpx/vermont/`: **one GPX per day for each itinerary. Use these on bike computers.** (`gpx/vermont/…_day03.gpx` is the Sandbar bypass.) Also `gpx/return_montreal_to_rouses_point.gpx`.
- `nyc_to_montreal_*.gpx` / `.kml`: combined files per itinerary (KML for Google My Maps).
- `nyc_to_montreal_7_day_tour.md`, `nyc_to_montreal_bike_tour_guide.md` (6-day), `nyc_to_montreal_5_day_fast_tour.md`, `nyc_to_montreal_vermont_upgrade.md`: printable guides with full cue tables.
- `pdf/`: print-ready US Letter ride packets and single-day strip map + cue sheet PDFs for every itinerary.
- `jersey_cue_card.html`: pocket cue card.
- `AUDIT.md`: what was checked and corrected, and what is still unverified.
- `tools/`: `build.py` regenerates all data files from `tools/content.py` and `data/routes.json`.
- `LICENSE`: MIT (software) / CC BY 4.0 (guides) / ODbL (OpenStreetMap route data).

## Critical logistics (read before booking)

### 1. Getting home: Amtrak won't take an unboxed bike from Montréal
- The **Amtrak Adirondack** carries bikes on a coach rack **only between New York and Rouses Point, NY**. You cannot roll a bike onto the train in Montréal. Bike spots are limited and need a reservation.
- **Southbound train 68 leaves Montréal 11:10 AM and Rouses Point 2:15 PM, arriving New York 10:15 PM.** It runs **Sun and Tue to Sat. On Mondays it starts at Saratoga Springs**, so there's **no Monday train from Rouses Point** (Mon Oct 12 is Indigenous Peoples' / Columbus Day). *(Amtrak timetable dated Sep 27, 2026; recheck when booking.)*
- Northbound train 69 runs **daily** all the way to Montréal. Earlier drafts said Mon to Thu only; that was wrong.
- **Return options:**
  1. **Ride back to Rouses Point** (59.8 mi from Place Jacques-Cartier, file `gpx/return_montreal_to_rouses_point.gpx`). To make the 2:15 PM train, you'd need to leave Montréal by about 7:30 AM. A gentler version: take a half day to Saint-Jean-sur-Richelieu (35 mi), sleep there, then ride 25 flat miles to Rouses Point the next morning. You clear US customs on your bike at the Rouses Point–Lacolle 223 crossing.
  2. **Box the bikes** in Montréal and take a bus or flight. Call shops ahead to reserve boxes (Ça Roule in Old Montréal, Bicycles Quilicot, MEC).
  3. **One-way rental van or SUV** from Montréal to NYC.

### 2. The border (Rouses Point, NY ➔ Lacolle, QC on US-11 / Route 223)
- **Hours: 8 AM to 8 PM daily, on both the US and Canadian sides** (cut from 24 hours in January 2025). Cyclists use the regular car booths. The only nearby 24-hour crossing is the I-87 / A-15 freeway, where bikes aren't allowed, so **plan to reach the border well before 8 PM**, including on the ride back to Rouses Point.
- Phones: CBSA Border Information Service 1-800-959-2036; US CBP Rouses Point (518) 297-2441.
- Bring a **passport, passport card, Enhanced Driver's License or NEXUS card** (Canada has no 6-month validity rule).
- **No cannabis** in either direction: that's a federal offense in both countries. **Pepper spray made for use on people is a prohibited weapon in Canada.** Animal-deterrent sprays are handled differently, but simplest is to leave all sprays at home.
- Coming back into the US with a valuable bike: carry a photo of the serial number and receipt. Optionally, register it on CBP Form 4457 before you leave.

### 3. October daylight
- Sunrise is about **6:55 to 7:03 AM**. Sunset is **6:33 PM in NYC on Oct 4**, falling to **6:18 PM in Montréal on Oct 10**. Civil twilight ends about 28 minutes after sunset.
- At touring pace (11 to 13 mph rolling plus stops), an 80 to 90 mile day takes 8 to 9 hours. **Be rolling by 8:30 AM** on the long days (7-day: Day 2 is 80.3 mi, Day 3 is 77.7 mi; 5-day: Day 1 is 102.5 mi, Day 2 is 94.7 mi, Day 3 is 93.2 mi, Day 5 is 85.6 mi) and carry real lights.
- Wet leaves on rail trails are slippery: brake before turns and corners.

### 4. Food and water gaps
- **Day 4:** Whitehall's Historic Grounds cafe is **closed** after a fire. Use **Stewart's, 60 Poultney St**. After Whitehall, NY-22 has 23.5 mi of rolling road with almost nothing.
- **Day 5:** Essex options are thin in October (Pink Pig Cafe has limited fall hours, and the ice-cream cafe is summer-only). **Stewart's in Port Henry** (mile 15) and **Keeseville** (mile 56) are the reliable stops.
- **Sundays and Mondays:** many small bike shops are closed (for example, Yorktown Cycles is closed Sun and Mon). Carry tubes, a plug kit, a quick-link, a pump and a multitool.

### 5. Lodging
- Early October is peak foliage in the Adirondacks and on Lake Champlain. Book early and ask each hotel about indoor bike storage. **The Barlow Hotel in Hudson is now the Hudson Whaler (518-217-4334).**
