"""Markdown guide generation (called from build.py)."""
import os

ADVISORIES = """## Critical logistics (read before booking)

### 1. Getting home: Amtrak won't take an unboxed bike from Montréal
- The **Amtrak Adirondack** carries bikes on a coach rack **only between New York and Rouses Point, NY**. You cannot roll a bike onto the train in Montréal. Bike spots are limited and need a reservation.
- **Southbound train 68 leaves Montréal 11:10 AM and Rouses Point 2:15 PM, arriving New York 10:15 PM.** It runs **Sun and Tue to Sat. On Mondays it starts at Saratoga Springs**, so there's **no Monday train from Rouses Point** (Mon Oct 12 is Indigenous Peoples' / Columbus Day). *(Amtrak timetable dated Sep 27, 2026; recheck when booking.)*
- Northbound train 69 runs **daily** all the way to Montréal. Earlier drafts said Mon to Thu only; that was wrong.
- **Return options:**
  1. **Ride back to Rouses Point** ({ret_mi} mi from Place Jacques-Cartier, file `gpx/return_montreal_to_rouses_point.gpx`). To make the 2:15 PM train, you'd need to leave Montréal by about 7:30 AM. A gentler version: take a half day to Saint-Jean-sur-Richelieu ({ret_sj} mi), sleep there, then ride {ret_rp} flat miles to Rouses Point the next morning. You clear US customs on your bike at the Rouses Point–Lacolle 223 crossing.
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
- At touring pace (11 to 13 mph rolling plus stops), an 80 to 90 mile day takes 8 to 9 hours. **Be rolling by 8:30 AM** on the long days (Days 2 and 3 are {d2} and {d3} mi) and carry real lights.
- Wet leaves on rail trails are slippery: brake before turns and corners.

### 4. Food and water gaps
- **Day 4:** Whitehall's Historic Grounds cafe is **closed** after a fire. Use **Stewart's, 60 Poultney St**. After Whitehall, NY-22 has 23.5 mi of rolling road with almost nothing.
- **Day 5:** Essex options are thin in October (Pink Pig Cafe has limited fall hours, and the ice-cream cafe is summer-only). **Stewart's in Port Henry** (mile 15) and **Keeseville** (mile 56) are the reliable stops.
- **Sundays and Mondays:** many small bike shops are closed (for example, Yorktown Cycles is closed Sun and Mon). Carry tubes, a plug kit, a quick-link, a pump and a multitool.

### 5. Lodging
- Early October is peak foliage in the Adirondacks and on Lake Champlain. Book early and ask each hotel about indoor bike storage. **The Barlow Hotel in Hudson is now the Hudson Whaler (518-217-4334).**
"""

GPS_HOWTO = """## GPS files: which one to use
- **Bike computers (Garmin, Wahoo, Hammerhead, RideWithGPS app):** load the **one-file-per-day GPX** from `gpx/` and navigate it as a course/route. The device's own map generates turn prompts from the track. Each track follows real roads and trails, with 850 to 1,600 points per day. Earlier versions of these files had only 6 to 13 points per day and could not be used for navigation.
- **Phones:** import the combined `.kml` into Google My Maps, or the GPX into an offline map app (RideWithGPS, Organic Maps, Gaia). **Download offline maps before you leave:** the web app's background map needs a connection.
- **Paper backup:** print the strip maps (the Strip Maps view in the app, then Print). Cue miles reset each day and match the day GPX.
- **How these were made:** routed with the OpenStreetMap bike router (routing.openstreetmap.de), forced along the official Empire State Trail, Champlain Valley Trail, AHET, Zim Smith, Island Line and Chambly Canal geometry. Distances are measured along the tracks. Climbing is estimated from 30 m SRTM elevation data (smoothed); treat it as ±20%. Surfaces come from OpenStreetMap tags. **Ride-test anything that looks odd on your device's map before trusting it.**
"""

def md_table(rows):
    out = ["| " + " | ".join(rows[0]) + " |", "|" + "|".join([":---"] * len(rows[0])) + "|"]
    out += ["| " + " | ".join(str(c) for c in r) + " |" for r in rows[1:]]
    return "\n".join(out)

def place_line(p):
    ph = f" · {p['phone']}" if p.get("phone") else ""
    mi = ""
    if p.get("mile") is not None:
        mi = f" · mile {p['mile']:.1f}" + (f" ({p['offRouteMi']:.1f} mi off route)" if p.get("offRouteMi", 0) >= 0.2 else "")
    return f"**{p['name']}**, {p['address']}{ph}{mi}. {p['notes']}"

def stage_md(d, key, C, R, build_cues):
    L = [f"### {d['name']}", f"*{d['subtitle']}*", "",
         f"- **Distance:** {d['distanceMiles']} mi ({d['distanceKm']} km) · **Climbing:** about +{d['elevationFt']:,} ft",
         f"- **Surface:** {d['surface']}",
         f"- **GPX:** [`{d['gpx']}`]({d['gpx']}) · [Google Maps (approximate; uses sampled waypoints)]({d['googleMapsDirUrl']})",
         f"- **Lunch:** {place_line(d['lunch'])}"]
    L.append("- **Lodging:** " + " / ".join(place_line(h) for h in d["hotels"]))
    L.append("- **Bike shops / supplies:** " + " / ".join(place_line(s) for s in d["bikeShops"]))
    L.append(f"- **Bailout:** {d['bailout']}")
    if d.get("altNote"): L.append(f"- **Option:** {d['altNote']}")
    if d.get("accelerateOption"): L.append(f"- **Push option:** {d['accelerateOption']['notes']}")
    L += ["", "<details><summary>Turn-by-turn cues</summary>", "", md_table([["Mile", "Action", "Road / place", "Leg", "Surface", "Notes"]] +
          [[f"{c['mile']:.1f}", c["action"], c["road"], (f"{c['dist']:.1f}" if c["dist"] else ""), c["surface"], c["detail"]] for c in build_cues(key, key)]),
          "", "</details>", ""]
    return "\n".join(L)

def itinerary_md(iid, fname, C, R, TOURS, build_cues, extra, adv):
    t = TOURS[iid]; it = C.ITINERARIES[iid]
    rows = [["Day", "Date", "Stage", "Miles", "Climb (est.)", "Lunch", "Overnight"]]
    for d, (k, dow, date) in zip(t["days"], it["stages"]):
        rows.append([d["day"], f"{dow[:3]} {date}", C.STAGES[k]["short"], d["distanceMiles"], f"+{d['elevationFt']:,}",
                     f"{d['lunch']['name']} (mi {d['lunch']['mile']:.0f})", d["hotels"][0]["name"]])
    L = [f"# NYC to Montréal: {t['title']}", "",
         f"**{t['totalDistanceMiles']} mi ({t['totalDistanceMiles'] * 1.609344:.0f} km) · about +{t['elevationGainFt']:,} ft · average {t['averageDailyMiles']} mi/day · {t['pace']}**", "",
         t["blurb"], "", "> Distances, climbing, mile markers and GPS tracks were regenerated on 2026-09-27 from routes that follow the real trails and roads. Earlier versions of this guide underestimated distances by 30 to 40 mi overall and contained wrong phone numbers, closed businesses and Amtrak errors. See `AUDIT.md`.", "",
         "## Itinerary at a glance", md_table(rows), "", extra, adv, GPS_HOWTO, "## Daily stages", ""]
    for d, (k, _, _) in zip(t["days"], it["stages"]):
        L.append(stage_md(d, k, C, R, build_cues))
    return "\n".join(L)

def write_all(ROOT, C, R, TOURS, VT, place_mile, build_cues, surface_text, fill):
    ret_sj = place_mile("RETURN", "trinquette")[0]
    adv = ADVISORIES.format(ret_mi=R["RETURN"]["mi"], ret_sj=f"{ret_sj:.0f}", ret_rp=f"{R['RETURN']['mi'] - ret_sj:.0f}",
                            d2=R["D2"]["mi"], d3=R["D3"]["mi"], d4=R["D4"]["mi"])
    files = {"7day": "nyc_to_montreal_7_day_tour.md", "6day": "nyc_to_montreal_bike_tour_guide.md", "5day": "nyc_to_montreal_5_day_fast_tour.md"}
    extras = {
        "7day": "**Why 7 days:** the 6-day plan's last day is " + f"{R['6D6']['mi']}" + " mi including the border. Splitting it at Saint-Jean-sur-Richelieu gives a short border day and a " + f"{R['D7']['mi']}" + "-mi Saturday finish along the Chambly Canal. Days 2 and 3 are still long (" + f"{R['D2']['mi']:.0f} and {R['D3']['mi']:.0f}" + " mi): start early.\n",
        "6day": "**Note:** Day 6 is " + f"{R['6D6']['mi']}" + " mi with a border crossing, finishing in Montréal before the 6:19 PM sunset. The 7-day version splits it at Saint-Jean-sur-Richelieu.\n",
        "5day": "**Reality check:** this schedule means three days over 90 miles in October daylight. The 'push' options in earlier drafts are all 125+ mile days; they're listed per stage for completeness, but they aren't recommended.\n",
    }
    for iid, fn in files.items():
        open(os.path.join(ROOT, fn), "w").write(itinerary_md(iid, fn, C, R, TOURS, build_cues, extras[iid], adv))
    # Vermont
    L = [f"# NYC to Montréal: {VT['title']}", "", f"**Replaces {C.VERMONT['replaces']}.** {C.VERMONT['note']}", "",
         "## Ferries", f"- **Essex ➔ Charlotte car ferry:** {VT['ferry']['schedule']} Fare {VT['ferry']['fare']}. {VT['ferry']['notes']}",
         f"- **Island Line bike ferry:** {VT['bikeFerry']['schedule']} {VT['bikeFerry']['fare']}.",
         f"- **If the bike ferry isn't running:** {VT['bikeFerry']['fallBypass']} (GPX: `gpx/vt_sandbar_bypass.gpx`)", "",
         "## Stages", ""]
    for i, s in enumerate(VT["stages"]):
        k = C.VERMONT["stages"][i][0]
        d = dict(name=s["dayName"], subtitle=C.STAGES[k]["subtitle"], distanceMiles=s["distanceMiles"], distanceKm=round(s["distanceMiles"] * 1.609344, 1),
                 elevationFt=s["elevationFt"], surface=s["surface"], gpx=s["gpx"], googleMapsDirUrl="", lunch=s["lunch"], hotels=s["hotels"],
                 bikeShops=s["bikeShops"], bailout=s["bailout"])
        L.append(stage_md(d, k, C, R, build_cues).replace(" · [Google Maps (approximate; uses sampled waypoints)]()", ""))
    L.append(f"Then ride Day 7 (Saint-Jean ➔ Old Montréal, {R['D7']['mi']} mi) as in the 7-day guide.\n")
    L.append("*Comparison:* the New York route for these two days (Days 5 and 6) is " + f"{R['D5']['mi'] + R['D6']['mi']:.1f}" + " mi. The Vermont variant is " + f"{R['VT1']['mi'] + R['VT2']['mi']:.1f}" + " mi and less hilly on the island day.\n")
    open(os.path.join(ROOT, "nyc_to_montreal_vermont_upgrade.md"), "w").write("\n".join(L))
    # README
    rows = [["Itinerary", "Days", "Total", "Climb (est.)", "Daily miles"]]
    for iid in ("7day", "6day", "5day"):
        t = TOURS[iid]
        rows.append([t["title"], t["durationDays"], f"{t['totalDistanceMiles']} mi", f"+{t['elevationGainFt']:,} ft", ", ".join(str(d["distanceMiles"]) for d in t["days"])])
    readme = ["# NYC to Montréal bike tour (Oct 4, 2026)", "",
              "Hotel-to-hotel tour from Battery Park to Old Montréal on the Empire State Trail, the Lake Champlain shore, the Richelieu River and the Chambly Canal.", "",
              md_table(rows), "",
              "Vermont variant (Essex ferry, Burlington, Island Line causeway, Champlain Islands) replaces Days 5 and 6 of the 7-day tour: " + f"{R['VT1']['mi']} + {R['VT2']['mi']} mi.", "",
              "## Files", "- `index.html`: the app. It works offline once loaded (libraries are bundled and a service worker caches the app), **except the background map tiles**, so download offline maps in your GPS or phone app.",
              "- `gpx/`: **one GPX per day. Use these on bike computers.** Also `gpx/return_montreal_to_rouses_point.gpx` and `gpx/vt_sandbar_bypass.gpx`.",
              "- `nyc_to_montreal_*.gpx` / `.kml`: combined files per itinerary (KML for Google My Maps).",
              "- `nyc_to_montreal_7_day_tour.md`, `nyc_to_montreal_bike_tour_guide.md` (6-day), `nyc_to_montreal_5_day_fast_tour.md`, `nyc_to_montreal_vermont_upgrade.md`: printable guides with full cue tables.",
              "- `jersey_cue_card.html`: pocket cue card.", "- `AUDIT.md`: what was checked and corrected, and what is still unverified.",
              "- `tools/`: `build.py` regenerates all data files from `tools/content.py` and `data/routes.json`.", "",
              ADVISORIES.format(ret_mi=R["RETURN"]["mi"], ret_sj=f"{ret_sj:.0f}", ret_rp=f"{R['RETURN']['mi'] - ret_sj:.0f}", d2=R["D2"]["mi"], d3=R["D3"]["mi"], d4=R["D4"]["mi"])]
    open(os.path.join(ROOT, "README.md"), "w").write("\n".join(readme))
