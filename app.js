// Main application logic for NYC to Montreal Bike Tour Webpage
// Supports 6-Day Leisurely Tour AND 5-Day Fast Tour (+ Acceleration Options)
// Supports Leaflet (Zero API Key) and Google Maps JavaScript API

let currentTour = TOUR_DATA_6DAY;
let mapMode = 'leaflet'; // 'leaflet' or 'google'
let leafletMap;
let googleMap;
let isCompareMode = false;
let dayLayers = {};
let poiLayers = {
  hotels: L.layerGroup(),
  lunch: L.layerGroup(),
  bikeShops: L.layerGroup(),
  accelerate: L.layerGroup(),
  bailouts: L.layerGroup()
};
let compareLayers = {
  sixDay: null,
  fiveDay: null,
  accelerate: null,
  markers: null
};

let googleDayPolylines = [];
let googleMarkers = [];
let googleBicyclingLayer = null;

const DAY_COLORS = [
  '#2563eb', // Day 1: Blue
  '#0891b2', // Day 2: Cyan
  '#16a34a', // Day 3: Green
  '#d97706', // Day 4: Amber
  '#9333ea', // Day 5: Purple
  '#059669', // Day 6: Emerald
  '#e11d48'  // Day 7: Rose / Ruby
];

document.addEventListener('DOMContentLoaded', () => {
  // Purge any previously cached key to ensure zero conflicts
  localStorage.removeItem('gmaps_api_key');
  renderActiveTour();
  renderChecklist();
  initLeafletMap();
  setupFilterControls();
  fetchTourWeather();
});

function switchTourMode(tourType) {
  const tab7 = document.getElementById('tab-7day');
  const tab6 = document.getElementById('tab-6day');
  const tab5 = document.getElementById('tab-5day');
  const tabComp = document.getElementById('tab-compare');
  const kmlLink = document.getElementById('kml-download-link');
  const compareSection = document.getElementById('compare-section');
  const legendNormal = document.getElementById('map-legend-normal');
  const legendCompare = document.getElementById('map-legend-compare');

  const btnActive = "px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white shadow-sm transition-all flex items-center gap-1.5";
  const btnInactive = "px-4 py-2 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5";

  if (tourType === 'compare') {
    isCompareMode = true;
    if (tabComp) tabComp.className = btnActive;
    if (tab7) tab7.className = btnInactive;
    if (tab6) tab6.className = btnInactive;
    if (tab5) tab5.className = btnInactive;

    if (compareSection) compareSection.classList.remove('hidden');
    if (legendNormal) legendNormal.classList.add('hidden');
    if (legendCompare) legendCompare.classList.remove('hidden');

    renderCompareStats();
    renderCompareMap();
    setupFilterControls();
    fetchTourWeather();

    // Scroll smoothly to comparison section if initiated
    if (compareSection) {
      setTimeout(() => {
        compareSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    return;
  }

  // Otherwise, 7day, 6day, or 5day mode
  isCompareMode = false;
  if (compareSection) compareSection.classList.add('hidden');
  if (legendCompare) legendCompare.classList.add('hidden');
  if (legendNormal) legendNormal.classList.remove('hidden');

  if (tourType === '7day') {
    currentTour = TOUR_DATA_7DAY;
    if (tab7) tab7.className = btnActive;
    if (tab6) tab6.className = btnInactive;
    if (tab5) tab5.className = btnInactive;
    if (tabComp) tabComp.className = btnInactive;
    if (kmlLink) {
      kmlLink.href = "nyc_to_montreal_7day_tour.kml";
      kmlLink.download = "nyc_to_montreal_7day_tour.kml";
    }
  } else if (tourType === '5day') {
    currentTour = TOUR_DATA_5DAY;
    if (tab5) tab5.className = btnActive;
    if (tab7) tab7.className = btnInactive;
    if (tab6) tab6.className = btnInactive;
    if (tabComp) tabComp.className = btnInactive;
    if (kmlLink) {
      kmlLink.href = "nyc_to_montreal_5day_tour.kml";
      kmlLink.download = "nyc_to_montreal_5day_tour.kml";
    }
  } else {
    currentTour = TOUR_DATA_6DAY;
    if (tab6) tab6.className = btnActive;
    if (tab7) tab7.className = btnInactive;
    if (tab5) tab5.className = btnInactive;
    if (tabComp) tabComp.className = btnInactive;
    if (kmlLink) {
      kmlLink.href = "nyc_to_montreal_tour.kml";
      kmlLink.download = "nyc_to_montreal_tour.kml";
    }
  }

  renderActiveTour();
  initLeafletMap();
  setupFilterControls();
  fetchTourWeather();
}

function renderCompareStats() {
  const elDist = document.getElementById('stat-total-dist');
  if (elDist) elDist.innerText = `~425–445 mi (684–716 km) corridor`;
  
  const elSched = document.getElementById('stat-schedule');
  if (elSched) elSched.innerText = "7-Day vs 6-Day vs 5-Day";
  
  const elAvg = document.getElementById('stat-avg-miles');
  if (elAvg) elAvg.innerText = "(~64 vs ~74 vs ~85 mi/day)";

  const elPace = document.getElementById('stat-pace');
  if (elPace) elPace.innerText = "Gentler Touring vs Classic Endurance vs Fast";

  // Update Day Selector Dropdown for Compare Mode
  const daySelect = document.getElementById('day-filter-select');
  if (daySelect) {
    daySelect.innerHTML = `
      <option value="all">All Stages (Comparing Itineraries)</option>
      <option value="compare-6day">Highlight 6-Day Tour Only (Solid Blue)</option>
      <option value="compare-5day">Highlight 5-Day Fast Tour Only (Dashed Amber)</option>
      <option value="compare-accel">Highlight ⚡ Accelerate Checkpoints</option>
    `;
  }

  const pillStage = document.getElementById('map-pill-stage');
  const pillDist = document.getElementById('map-pill-distance');
  const pillElev = document.getElementById('map-pill-elevation');

  if (pillStage) {
    pillStage.innerText = "⚖️ Comparing Tour Itineraries";
    pillStage.className = "badge-tag bg-purple-50 text-purple-800 border border-purple-200 font-bold shadow-xs transition-all";
  }
  if (pillDist) pillDist.innerText = "🚴 ~64 vs ~74 vs ~85 mi/day";
  if (pillElev) pillElev.innerText = "⛰️ ~2,000–2,600 ft/day avg";
}

function renderActiveTour() {
  const elDist = document.getElementById('stat-total-dist');
  if (elDist) elDist.innerText = `${currentTour.totalDistanceMiles} mi (${Math.round(currentTour.totalDistanceMiles * 1.60934)} km)`;
  
  const elSched = document.getElementById('stat-schedule');
  if (elSched) {
    if (currentTour.durationDays === 7) {
      elSched.innerText = "Sun → Sat (7 Days)";
    } else if (currentTour.durationDays === 5) {
      elSched.innerText = "5 Days";
    } else {
      elSched.innerText = "Sun → Fri (6 Days)";
    }
  }
  
  const elAvg = document.getElementById('stat-avg-miles');
  if (elAvg) elAvg.innerText = `(~${currentTour.averageDailyMiles} mi/day)`;

  const elPace = document.getElementById('stat-pace');
  if (elPace) elPace.innerText = currentTour.pace;

  // Update Day Selector Dropdown
  const daySelect = document.getElementById('day-filter-select');
  if (daySelect) {
    let options = `<option value="all">All ${currentTour.days.length} Stages</option>`;
    currentTour.days.forEach(d => {
      options += `<option value="${d.day}">${d.name}</option>`;
    });
    daySelect.innerHTML = options;
  }

  renderDaysAccordion();
  renderBikeShopsTable();
  updateMapPills('all');
}

/* ============================================================
   LEAFLET MAP IMPLEMENTATION
============================================================ */
function initLeafletMap() {
  mapMode = 'leaflet';
  const container = document.getElementById('map');
  if (!container) return;

  if (typeof L === 'undefined') {
    console.warn("Leaflet library not ready yet, retrying in 150ms...");
    setTimeout(initLeafletMap, 150);
    return;
  }

  container.innerHTML = '';
  if (leafletMap) {
    try { leafletMap.remove(); } catch (e) {}
  }

  leafletMap = L.map('map').setView([43.0, -73.6], 7);

  // 100% Free, Zero-Key Public GIS Tiles (Esri ArcGIS Online & OSM HOT - Never blocks or requires a key)
  const esriStreets = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, METI, TomTom',
    maxZoom: 19
  });

  const esriTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, USGS, NPS, NRCAN',
    maxZoom: 18
  });

  const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP',
    maxZoom: 18
  });

  const osmHot = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team',
    subdomains: 'abc',
    maxZoom: 19
  });

  // Default to Esri Streets (Crisp road cycling map, 100% free, zero API key)
  esriStreets.addTo(leafletMap);

  const baseMaps = {
    "Esri Street Map (Default)": esriStreets,
    "Esri Topographic": esriTopo,
    "Esri Satellite": esriSatellite,
    "OpenStreetMap (HOT)": osmHot
  };
  L.control.layers(baseMaps, null, { position: 'topright' }).addTo(leafletMap);

  dayLayers = {};
  Object.values(poiLayers).forEach(layer => layer.clearLayers());

  currentTour.days.forEach((day, index) => {
    const color = DAY_COLORS[index % DAY_COLORS.length];
    
    const polyline = L.polyline(day.track, {
      color: color,
      weight: 5,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round'
    }).bindPopup(`
      <div class="p-1">
        <strong class="text-sm font-bold text-gray-900">${day.name}</strong><br>
        <span class="text-xs font-semibold text-blue-700">${day.distanceMiles} mi • +${day.elevationFt} ft</span><br>
        <p class="text-xs text-gray-600 mt-1">${day.surface}</p>
        <a href="${day.googleMapsDirUrl}" target="_blank" class="mt-2 inline-flex items-center text-xs font-bold text-blue-600 hover:underline">
          🗺️ Open Turn-by-Turn in Google Maps &rarr;
        </a>
      </div>
    `);

    dayLayers[day.day] = polyline;
    polyline.addTo(leafletMap);

    // Accelerate Option Marker
    if (day.accelerateOption) {
      const boltIcon = L.divIcon({
        className: 'custom-pin',
        html: '<div style="background:#eab308; width:30px; height:30px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 6px rgba(0,0,0,0.3); font-size:15px;">⚡</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      const boltMarker = L.marker(day.endCoords, { icon: boltIcon })
        .bindPopup(`
          <div class="p-2">
            <span class="inline-block px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-900 rounded mb-1">⚡ Accelerate Checkpoint</span>
            <h4 class="font-bold text-gray-900">${day.accelerateOption.name}</h4>
            <p class="text-xs text-gray-700 mt-1">${day.accelerateOption.notes}</p>
            <p class="text-xs font-bold text-amber-800 mt-1">Target Finish: ${day.accelerateOption.targetTown} (${day.accelerateOption.distanceMiles} mi total)</p>
            <a href="${day.accelerateOption.googleMapsUrl}" target="_blank" class="mt-2 inline-block text-xs font-bold text-amber-700 underline">
              🗺️ Open Accelerated Route in Google Maps &rarr;
            </a>
          </div>
        `);
      poiLayers.accelerate.addLayer(boltMarker);
    }

    // Lunch Marker
    if (day.lunch) {
      const lunchIcon = L.divIcon({
        className: 'custom-pin pin-lunch',
        html: '🥪',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      const lunchMarker = L.marker(day.lunch.coords, { icon: lunchIcon })
        .bindPopup(`
          <div class="p-2">
            <span class="inline-block px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800 rounded mb-1">Lunch Stop</span>
            <h4 class="font-bold text-gray-900">${day.lunch.name}</h4>
            <p class="text-xs text-gray-600 mb-1">${day.lunch.location} (Mile ${day.lunch.mile})</p>
            <p class="text-xs text-gray-700 mb-2">${day.lunch.notes}</p>
            <a href="${day.lunch.googleUrl}" target="_blank" class="text-xs font-semibold text-blue-600 hover:underline">📍 Google Maps</a>
          </div>
        `);
      poiLayers.lunch.addLayer(lunchMarker);
    }

    // Hotels Markers
    day.hotels.forEach(hotel => {
      const hotelIcon = L.divIcon({
        className: 'custom-pin pin-hotel',
        html: '🏨',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      const hotelMarker = L.marker(hotel.coords, { icon: hotelIcon })
        .bindPopup(`
          <div class="p-2">
            <span class="inline-block px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded mb-1">Hotel</span>
            <h4 class="font-bold text-gray-900">${hotel.name}</h4>
            <p class="text-xs text-gray-600 mb-1">${hotel.address}</p>
            <p class="text-xs font-mono text-indigo-600 mb-1 font-semibold">${hotel.phone}</p>
            <p class="text-xs text-gray-700 mb-2">${hotel.notes}</p>
            <a href="${hotel.googleUrl}" target="_blank" class="text-xs font-semibold text-blue-600 hover:underline">📍 Google Maps</a>
          </div>
        `);
      poiLayers.hotels.addLayer(hotelMarker);
    });

    // Bike Shops Markers
    day.bikeShops.forEach(shop => {
      const bikeIcon = L.divIcon({
        className: 'custom-pin pin-bike',
        html: '🔧',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      const bikeMarker = L.marker(shop.coords, { icon: bikeIcon })
        .bindPopup(`
          <div class="p-2">
            <span class="inline-block px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-800 rounded mb-1">Bike Shop</span>
            <h4 class="font-bold text-gray-900">${shop.name}</h4>
            <p class="text-xs text-gray-600 mb-1">${shop.address}</p>
            <p class="text-xs font-mono text-red-600 mb-1 font-semibold">${shop.phone}</p>
            <p class="text-xs text-gray-700 mb-2">${shop.notes}</p>
            <a href="${shop.googleUrl}" target="_blank" class="text-xs font-semibold text-blue-600 hover:underline">📍 Google Maps</a>
          </div>
        `);
      poiLayers.bikeShops.addLayer(bikeMarker);
    });
  });

  // Border Marker
  const borderIcon = L.divIcon({
    className: 'custom-pin pin-border',
    html: '🇨🇦',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
  const borderMarker = L.marker([45.0064, -73.3670], { icon: borderIcon })
    .bindPopup(`
      <div class="p-2">
        <span class="inline-block px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded mb-1">Canada Border</span>
        <h4 class="font-bold text-gray-900">U.S. / Canada Border (Lacolle)</h4>
        <p class="text-xs text-gray-700 mb-1">Passports required! Cyclists stop at vehicle booth.</p>
      </div>
    `);
  poiLayers.bailouts.addLayer(borderMarker);

  poiLayers.hotels.addTo(leafletMap);
  poiLayers.lunch.addTo(leafletMap);
  poiLayers.bikeShops.addTo(leafletMap);
  poiLayers.accelerate.addTo(leafletMap);
  poiLayers.bailouts.addTo(leafletMap);

  const allTracks = currentTour.days.flatMap(d => d.track);
  leafletMap.fitBounds(allTracks, { padding: [30, 30] });

  setTimeout(() => {
    if (leafletMap && typeof leafletMap.invalidateSize === 'function') {
      leafletMap.invalidateSize();
    }
  }, 200);

  updateMapBadge("Free Map (Esri Streets / Zero Key)");
}

/* ============================================================
   COMPARE MODE MAP IMPLEMENTATION (Both Routes Overlaid)
============================================================ */
function renderCompareMap() {
  mapMode = 'leaflet';
  const container = document.getElementById('map');
  if (!container) return;

  if (typeof L === 'undefined') {
    setTimeout(renderCompareMap, 150);
    return;
  }

  container.innerHTML = '';
  if (leafletMap) {
    try { leafletMap.remove(); } catch (e) {}
  }

  leafletMap = L.map('map').setView([43.0, -73.6], 7);

  // 100% Free Public GIS Tiles (Esri Streets & Topo)
  const esriStreets = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, METI, TomTom',
    maxZoom: 19
  });

  const esriTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, USGS, NPS, NRCAN',
    maxZoom: 18
  });

  esriStreets.addTo(leafletMap);

  const baseMaps = {
    "Esri Street Map (Default)": esriStreets,
    "Esri Topographic": esriTopo
  };
  L.control.layers(baseMaps, null, { position: 'topright' }).addTo(leafletMap);

  compareLayers = {
    sixDay: L.layerGroup(),
    fiveDay: L.layerGroup(),
    accelerate: L.layerGroup(),
    markers: L.layerGroup(),
    lunch: L.layerGroup(),
    bikeShops: L.layerGroup()
  };

  // 1. Add 6-Day Tour Tracks & Overnight Pins (Solid Royal Blue)
  TOUR_DATA_6DAY.days.forEach(day => {
    const polyline = L.polyline(day.track, {
      color: '#2563eb', // Royal Blue
      weight: 5,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round'
    }).bindPopup(`
      <div class="p-2">
        <span class="inline-block px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 rounded mb-1">🗓️ 6-Day Tour • Stage ${day.day}</span>
        <h4 class="font-bold text-gray-900">${day.name}</h4>
        <span class="text-xs font-semibold text-blue-700">${day.distanceMiles} mi • +${day.elevationFt} ft climbing</span>
        <p class="text-xs text-gray-600 mt-1">${day.subtitle || ''}</p>
        <p class="text-xs text-slate-500 mt-1"><strong>Surface:</strong> ${day.surface}</p>
        <a href="${day.googleMapsDirUrl}" target="_blank" class="mt-2 inline-block text-xs font-bold text-blue-600 hover:underline">
          🗺️ Open Stage Turn-by-Turn in Google Maps &rarr;
        </a>
      </div>
    `);
    compareLayers.sixDay.addLayer(polyline);

    // 6-Day Overnight Hotel Pin
    if (day.hotels && day.hotels.length > 0) {
      const primaryHotel = day.hotels[0];
      const hotelIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background:#2563eb; color:white; width:28px; height:28px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 6px rgba(0,0,0,0.3); font-size:11px; font-weight:bold;">6D</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      const marker = L.marker(primaryHotel.coords, { icon: hotelIcon }).bindPopup(`
        <div class="p-2">
          <span class="inline-block px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 rounded mb-1">🗓️ 6-Day Overnight (Stage ${day.day})</span>
          <h4 class="font-bold text-gray-900">${primaryHotel.name}</h4>
          <p class="text-xs text-gray-600 mb-1">${primaryHotel.address}</p>
          <p class="text-xs font-mono text-blue-600 font-semibold mb-1">${primaryHotel.phone}</p>
          <p class="text-xs text-gray-700">${primaryHotel.notes}</p>
          <a href="${primaryHotel.googleUrl}" target="_blank" class="mt-1 inline-block text-xs font-semibold text-blue-600 hover:underline">📍 Google Maps</a>
        </div>
      `);
      compareLayers.markers.addLayer(marker);
    }

    // Lunch Pin
    if (day.lunch) {
      const lunchIcon = L.divIcon({
        className: 'custom-pin pin-lunch',
        html: '🥪',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
      const lunchMarker = L.marker(day.lunch.coords, { icon: lunchIcon }).bindPopup(`
        <div class="p-2">
          <span class="inline-block px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800 rounded mb-1">Lunch Stop</span>
          <h4 class="font-bold text-gray-900">${day.lunch.name}</h4>
          <p class="text-xs text-gray-600 mb-1">${day.lunch.location} (Mile ${day.lunch.mile})</p>
          <p class="text-xs text-gray-700 mb-2">${day.lunch.notes}</p>
          <a href="${day.lunch.googleUrl}" target="_blank" class="text-xs font-semibold text-blue-600 hover:underline">📍 Google Maps</a>
        </div>
      `);
      compareLayers.lunch.addLayer(lunchMarker);
    }
  });

  // 2. Add 5-Day Fast Tour Tracks & Overnight Pins (Dashed Amber)
  TOUR_DATA_5DAY.days.forEach(day => {
    const polyline = L.polyline(day.track, {
      color: '#d97706', // Amber
      weight: 4.5,
      dashArray: '8, 8',
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).bindPopup(`
      <div class="p-2">
        <span class="inline-block px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-900 rounded mb-1">⚡ 5-Day Fast Tour • Stage ${day.day}</span>
        <h4 class="font-bold text-gray-900">${day.name}</h4>
        <span class="text-xs font-semibold text-amber-800">${day.distanceMiles} mi • +${day.elevationFt} ft climbing</span>
        <p class="text-xs text-gray-600 mt-1">${day.subtitle || ''}</p>
        <p class="text-xs text-slate-500 mt-1"><strong>Surface:</strong> ${day.surface}</p>
        <a href="${day.googleMapsDirUrl}" target="_blank" class="mt-2 inline-block text-xs font-bold text-amber-700 hover:underline">
          🗺️ Open Stage Turn-by-Turn in Google Maps &rarr;
        </a>
      </div>
    `);
    compareLayers.fiveDay.addLayer(polyline);

    // 5-Day Overnight Hotel Pin
    if (day.hotels && day.hotels.length > 0) {
      const primaryHotel = day.hotels[0];
      const hotelIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background:#d97706; color:white; width:28px; height:28px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 6px rgba(0,0,0,0.3); font-size:11px; font-weight:bold;">5D</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      const marker = L.marker(primaryHotel.coords, { icon: hotelIcon }).bindPopup(`
        <div class="p-2">
          <span class="inline-block px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-900 rounded mb-1">⚡ 5-Day Overnight (Stage ${day.day})</span>
          <h4 class="font-bold text-gray-900">${primaryHotel.name}</h4>
          <p class="text-xs text-gray-600 mb-1">${primaryHotel.address}</p>
          <p class="text-xs font-mono text-amber-700 font-semibold mb-1">${primaryHotel.phone}</p>
          <p class="text-xs text-gray-700">${primaryHotel.notes}</p>
          <a href="${primaryHotel.googleUrl}" target="_blank" class="mt-1 inline-block text-xs font-semibold text-amber-700 hover:underline">📍 Google Maps</a>
        </div>
      `);
      compareLayers.markers.addLayer(marker);
    }

    // ⚡ Accelerate Checkpoint Marker
    if (day.accelerateOption) {
      const boltIcon = L.divIcon({
        className: 'custom-pin',
        html: '<div style="background:#eab308; width:30px; height:30px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 6px rgba(0,0,0,0.3); font-size:15px;">⚡</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      const boltMarker = L.marker(day.endCoords, { icon: boltIcon }).bindPopup(`
        <div class="p-2">
          <span class="inline-block px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-900 rounded mb-1">⚡ 5-Day Accelerate Checkpoint</span>
          <h4 class="font-bold text-gray-900">${day.accelerateOption.name}</h4>
          <p class="text-xs text-gray-700 mt-1">${day.accelerateOption.notes}</p>
          <p class="text-xs font-bold text-amber-800 mt-1">Target: ${day.accelerateOption.targetTown} (${day.accelerateOption.distanceMiles} mi total)</p>
          <a href="${day.accelerateOption.googleMapsUrl}" target="_blank" class="mt-2 inline-block text-xs font-bold text-amber-700 underline">
            🗺️ Open Accelerated Route in Google Maps &rarr;
          </a>
        </div>
      `);
      compareLayers.accelerate.addLayer(boltMarker);
    }
  });

  // 3. Canada Border Marker
  const borderIcon = L.divIcon({
    className: 'custom-pin pin-border',
    html: '🇨🇦',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
  const borderMarker = L.marker([45.0064, -73.3670], { icon: borderIcon }).bindPopup(`
    <div class="p-2">
      <span class="inline-block px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded mb-1">Canada Border</span>
      <h4 class="font-bold text-gray-900">U.S. / Canada Border (Lacolle)</h4>
      <p class="text-xs text-gray-700 mb-1">Crossed on Day 5 (5-Day Tour) or Day 6 (6-Day Tour). Passports required!</p>
    </div>
  `);
  compareLayers.markers.addLayer(borderMarker);

  // Add all layers to map
  compareLayers.sixDay.addTo(leafletMap);
  compareLayers.fiveDay.addTo(leafletMap);
  compareLayers.accelerate.addTo(leafletMap);
  compareLayers.markers.addTo(leafletMap);
  compareLayers.lunch.addTo(leafletMap);

  const allTracks = [
    ...TOUR_DATA_6DAY.days.flatMap(d => d.track),
    ...TOUR_DATA_5DAY.days.flatMap(d => d.track)
  ];
  leafletMap.fitBounds(allTracks, { padding: [30, 30] });

  setTimeout(() => {
    if (leafletMap && typeof leafletMap.invalidateSize === 'function') {
      leafletMap.invalidateSize();
    }
  }, 200);

  updateMapBadge("Comparing Both Routes (6-Day Blue vs 5-Day Amber)");
}

/* ============================================================
   GOOGLE MAPS JAVASCRIPT API IMPLEMENTATION
============================================================ */
function loadGoogleMapsApiKey() {
  const key = document.getElementById('gmaps-key-input').value.trim();
  if (!key) {
    alert("Please enter a valid Google Maps JavaScript API key.");
    return;
  }
  localStorage.setItem('gmaps_api_key', key);
  initGoogleMaps(key);
}

function switchToFreeMap() {
  localStorage.removeItem('gmaps_api_key');
  document.getElementById('gmaps-key-input').value = '';
  initLeafletMap();
}

function initGoogleMaps(apiKey) {
  if (!window.google || !window.google.maps) {
    const existingScript = document.getElementById('gmaps-script');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'gmaps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=onGoogleMapsLoaded`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      alert("Failed to load Google Maps API. Please check your API key.");
      initLeafletMap();
    };
    window.onGoogleMapsLoaded = renderGoogleMapInstance;
    document.head.appendChild(script);
  } else {
    renderGoogleMapInstance();
  }
}

function renderGoogleMapInstance() {
  mapMode = 'google';
  const container = document.getElementById('map');
  container.innerHTML = '';

  googleMap = new google.maps.Map(container, {
    center: { lat: 43.0, lng: -73.6 },
    zoom: 7,
    mapTypeId: 'terrain',
    mapTypeControl: true,
    fullscreenControl: true,
    streetViewControl: true
  });

  googleBicyclingLayer = new google.maps.BicyclingLayer();
  googleBicyclingLayer.setMap(googleMap);

  googleDayPolylines = [];
  googleMarkers = [];
  const bounds = new google.maps.LatLngBounds();
  const infoWindow = new google.maps.InfoWindow();

  currentTour.days.forEach((day, index) => {
    const color = DAY_COLORS[index % DAY_COLORS.length];
    const pathCoords = day.track.map(pt => ({ lat: pt[0], lng: pt[1] }));
    pathCoords.forEach(c => bounds.extend(c));

    const polyline = new google.maps.Polyline({
      path: pathCoords,
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 0.9,
      strokeWeight: 5,
      map: googleMap
    });

    polyline.addListener('click', (e) => {
      infoWindow.setContent(`
        <div style="padding: 6px; font-family: sans-serif;">
          <strong style="font-size: 14px;">${day.name}</strong><br>
          <span style="color: #2563eb; font-weight: bold;">${day.distanceMiles} mi / +${day.elevationFt} ft</span><br>
          <a href="${day.googleMapsDirUrl}" target="_blank" style="display: inline-block; margin-top: 6px; font-size: 12px; font-weight: bold; color: #1d4ed8;">
            🗺️ Open Directions in Google Maps &rarr;
          </a>
        </div>
      `);
      infoWindow.setPosition(e.latLng);
      infoWindow.open(googleMap);
    });

    googleDayPolylines.push({ day: day.day, polyline: polyline, path: pathCoords });

    // Accelerate option marker
    if (day.accelerateOption) {
      const marker = new google.maps.Marker({
        position: { lat: day.endCoords[0], lng: day.endCoords[1] },
        map: googleMap,
        title: `⚡ Accelerate: ${day.accelerateOption.name}`,
        icon: { url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png' }
      });
      marker.category = 'accelerate';
      marker.addListener('click', () => {
        infoWindow.setContent(`
          <div style="padding: 6px; font-family: sans-serif;">
            <span style="background: #fef3c7; color: #92400e; padding: 2px 6px; font-size: 11px; font-weight: bold; border-radius: 4px;">⚡ Accelerate Checkpoint</span>
            <h4 style="margin: 4px 0; font-size: 14px;">${day.accelerateOption.name}</h4>
            <p style="font-size: 12px; color: #555; margin: 2px 0;">${day.accelerateOption.notes}</p>
            <p style="font-size: 12px; font-weight: bold; color: #b45309; margin: 4px 0;">Target: ${day.accelerateOption.targetTown} (${day.accelerateOption.distanceMiles} mi total)</p>
            <a href="${day.accelerateOption.googleMapsUrl}" target="_blank" style="font-size: 12px; color: #1d4ed8; font-weight: bold;">🗺️ Open Accelerated Route &rarr;</a>
          </div>
        `);
        infoWindow.open(googleMap, marker);
      });
      googleMarkers.push(marker);
    }

    // Lunch Marker
    if (day.lunch) {
      const marker = new google.maps.Marker({
        position: { lat: day.lunch.coords[0], lng: day.lunch.coords[1] },
        map: googleMap,
        title: `Lunch: ${day.lunch.name}`,
        icon: { url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png' }
      });
      marker.category = 'lunch';
      marker.addListener('click', () => {
        infoWindow.setContent(`
          <div style="padding: 6px; font-family: sans-serif;">
            <span style="background: #ffedd5; color: #9a3412; padding: 2px 6px; font-size: 11px; font-weight: bold; border-radius: 4px;">Lunch</span>
            <h4 style="margin: 4px 0; font-size: 14px;">${day.lunch.name}</h4>
            <p style="font-size: 12px; color: #555; margin: 2px 0;">${day.lunch.location} (Mile ${day.lunch.mile})</p>
            <a href="${day.lunch.googleUrl}" target="_blank" style="font-size: 12px; color: #1d4ed8; font-weight: bold;">📍 View in Google Maps</a>
          </div>
        `);
        infoWindow.open(googleMap, marker);
      });
      googleMarkers.push(marker);
    }

    // Hotels
    day.hotels.forEach(hotel => {
      const marker = new google.maps.Marker({
        position: { lat: hotel.coords[0], lng: hotel.coords[1] },
        map: googleMap,
        title: `Hotel: ${hotel.name}`,
        icon: { url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }
      });
      marker.category = 'hotels';
      marker.addListener('click', () => {
        infoWindow.setContent(`
          <div style="padding: 6px; font-family: sans-serif;">
            <span style="background: #e0e7ff; color: #3730a3; padding: 2px 6px; font-size: 11px; font-weight: bold; border-radius: 4px;">Hotel</span>
            <h4 style="margin: 4px 0; font-size: 14px;">${hotel.name}</h4>
            <p style="font-size: 12px; color: #555; margin: 2px 0;">${hotel.address}</p>
            <p style="font-size: 12px; font-family: monospace; color: #4338ca; font-weight: bold; margin: 2px 0;">${hotel.phone}</p>
            <a href="${hotel.googleUrl}" target="_blank" style="font-size: 12px; color: #1d4ed8; font-weight: bold;">📍 View in Google Maps</a>
          </div>
        `);
        infoWindow.open(googleMap, marker);
      });
      googleMarkers.push(marker);
    });

    // Bike Shops
    day.bikeShops.forEach(shop => {
      const marker = new google.maps.Marker({
        position: { lat: shop.coords[0], lng: shop.coords[1] },
        map: googleMap,
        title: `Bike Shop: ${shop.name}`,
        icon: { url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }
      });
      marker.category = 'bikeShops';
      marker.addListener('click', () => {
        infoWindow.setContent(`
          <div style="padding: 6px; font-family: sans-serif;">
            <span style="background: #fee2e2; color: #991b1b; padding: 2px 6px; font-size: 11px; font-weight: bold; border-radius: 4px;">Bike Shop</span>
            <h4 style="margin: 4px 0; font-size: 14px;">${shop.name}</h4>
            <p style="font-size: 12px; color: #555; margin: 2px 0;">${shop.address}</p>
            <p style="font-size: 12px; font-family: monospace; color: #b91c1c; font-weight: bold; margin: 2px 0;">${shop.phone}</p>
            <a href="${shop.googleUrl}" target="_blank" style="font-size: 12px; color: #1d4ed8; font-weight: bold;">📍 View in Google Maps</a>
          </div>
        `);
        infoWindow.open(googleMap, marker);
      });
      googleMarkers.push(marker);
    });
  });

  googleMap.fitBounds(bounds);
  updateMapBadge("Google Maps Active (Cycling Layer)");
}

function updateMapBadge(text) {
  const badge = document.getElementById('active-map-badge');
  if (badge) badge.innerText = text;
}

/* ============================================================
   CONTROLS & ACCORDION
============================================================ */
function updateMapPills(val) {
  const pillStage = document.getElementById('map-pill-stage');
  const pillDist = document.getElementById('map-pill-distance');
  const pillElev = document.getElementById('map-pill-elevation');

  if (val === 'all') {
    if (pillStage) {
      pillStage.innerText = "All Stages";
      pillStage.className = "badge-tag bg-slate-100 text-slate-800 border border-slate-200 font-bold shadow-xs transition-all";
    }
    if (pillDist) pillDist.innerText = `🚴 ${currentTour.totalDistanceMiles} mi / 626 km`;
    if (pillElev) pillElev.innerText = `⛰️ +${currentTour.elevationGainFt.toLocaleString()} ft`;
    const pillWeather = document.getElementById('map-pill-weather');
    if (pillWeather) pillWeather.innerText = "🌤️ Oct 4–9 Forecast";
  } else {
    const dayNum = parseInt(val, 10);
    const targetDay = currentTour.days.find(d => d.day === dayNum);
    if (!targetDay) return;

    if (pillStage) {
      const stageLabel = targetDay.dayOfWeek ? `${targetDay.dayOfWeek} • Stage ${targetDay.day}` : `Stage ${targetDay.day}`;
      pillStage.innerText = stageLabel;
      // Add subtle color highlight matching stage
      pillStage.className = "badge-tag bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold shadow-xs transition-all";
    }
    if (pillDist) {
      pillDist.innerText = `🚴 ${targetDay.distanceMiles} mi / ${targetDay.distanceKm} km`;
    }
    if (pillElev) {
      pillElev.innerText = `⛰️ +${targetDay.elevationFt.toLocaleString()} ft`;
    }
    const pillWeather = document.getElementById('map-pill-weather');
    if (pillWeather && tourWeatherData[dayNum]) {
      const w = tourWeatherData[dayNum];
      pillWeather.innerText = `${w.icon} ${w.tempMax}°/${w.tempMin}°F • 🛡️ Risk: ${w.riskScore}/10 (${w.riskLevel})`;
    }
  }
}

function zoomToStage(val) {
  if (isCompareMode) {
    const pillStage = document.getElementById('map-pill-stage');
    const pillDist = document.getElementById('map-pill-distance');
    const pillElev = document.getElementById('map-pill-elevation');

    if (val === 'all') {
      if (compareLayers.sixDay) compareLayers.sixDay.eachLayer(l => l.setStyle({ weight: 5, opacity: 0.85 }));
      if (compareLayers.fiveDay) compareLayers.fiveDay.eachLayer(l => l.setStyle({ weight: 4.5, opacity: 0.95 }));
      const allTracks = [
        ...TOUR_DATA_6DAY.days.flatMap(d => d.track),
        ...TOUR_DATA_5DAY.days.flatMap(d => d.track)
      ];
      if (leafletMap) leafletMap.flyToBounds(allTracks, { padding: [30, 30], duration: 1.0 });
      if (pillStage) pillStage.innerText = "⚖️ Comparing 6-Day vs 5-Day";
      if (pillDist) pillDist.innerText = "🚴 64.8 vs 77.8 mi/day avg";
      if (pillElev) pillElev.innerText = "⛰️ ~2,000 vs ~2,400 ft/day";
    } else if (val === 'compare-6day') {
      if (compareLayers.sixDay) compareLayers.sixDay.eachLayer(l => l.setStyle({ weight: 7, opacity: 1.0 }));
      if (compareLayers.fiveDay) compareLayers.fiveDay.eachLayer(l => l.setStyle({ weight: 2, opacity: 0.2 }));
      const sixTracks = TOUR_DATA_6DAY.days.flatMap(d => d.track);
      if (leafletMap) leafletMap.flyToBounds(sixTracks, { padding: [30, 30], duration: 1.0 });
      if (pillStage) pillStage.innerText = "🗓️ 6-Day Tour Highlighted (Solid Blue)";
      if (pillDist) pillDist.innerText = "🚴 ~445 mi • ~74.2 mi/day avg";
      if (pillElev) pillElev.innerText = "⛰️ +14,500 ft Total";
    } else if (val === 'compare-5day') {
      if (compareLayers.sixDay) compareLayers.sixDay.eachLayer(l => l.setStyle({ weight: 2, opacity: 0.2 }));
      if (compareLayers.fiveDay) compareLayers.fiveDay.eachLayer(l => l.setStyle({ weight: 7, opacity: 1.0 }));
      const fiveTracks = TOUR_DATA_5DAY.days.flatMap(d => d.track);
      if (leafletMap) leafletMap.flyToBounds(fiveTracks, { padding: [30, 30], duration: 1.0 });
      if (pillStage) pillStage.innerText = "⚡ 5-Day Fast Tour Highlighted (Dashed Amber)";
      if (pillDist) pillDist.innerText = "🚴 ~425 mi • ~85.0 mi/day avg";
      if (pillElev) pillElev.innerText = "⛰️ +13,000 ft Total";
    } else if (val === 'compare-accel') {
      const accelCoords = TOUR_DATA_5DAY.days.filter(d => d.accelerateOption).map(d => d.endCoords);
      if (leafletMap && accelCoords.length > 0) {
        leafletMap.flyToBounds(accelCoords, { padding: [60, 60], duration: 1.0 });
      }
      if (pillStage) pillStage.innerText = "⚡ 4 Accelerate Checkpoints";
      if (pillDist) pillDist.innerText = "🚴 +16 to +24 extra miles per day";
      if (pillElev) pillElev.innerText = "⛰️ Kingston, Saratoga, Essex, Saint-Jean";
    }
    return;
  }

  updateMapPills(val);

  if (val === 'all') {
    if (mapMode === 'leaflet' && leafletMap) {
      Object.entries(dayLayers).forEach(([num, layer]) => {
        layer.addTo(leafletMap);
        layer.setStyle({ weight: 5, opacity: 0.85 });
      });
      const allTracks = currentTour.days.flatMap(d => d.track);
      leafletMap.flyToBounds(allTracks, { padding: [30, 30], duration: 1.0 });
    } else if (mapMode === 'google' && googleMap) {
      const allBounds = new google.maps.LatLngBounds();
      googleDayPolylines.forEach(item => {
        item.polyline.setMap(googleMap);
        item.path.forEach(pt => allBounds.extend(pt));
      });
      googleMap.fitBounds(allBounds);
    }
  } else {
    const dayNum = parseInt(val, 10);
    const targetDay = currentTour.days.find(d => d.day === dayNum);
    if (!targetDay) return;

    if (mapMode === 'leaflet' && leafletMap) {
      // Highlight the selected stage while dimming others
      Object.entries(dayLayers).forEach(([num, layer]) => {
        const isCurrent = parseInt(num, 10) === dayNum;
        if (isCurrent) {
          layer.addTo(leafletMap);
          layer.setStyle({ weight: 8, opacity: 1.0 });
          layer.bringToFront();
        } else {
          layer.setStyle({ weight: 3, opacity: 0.25 });
        }
      });

      // Gather coordinates for track, lunch, and hotels for full stage view
      const pointsToBound = [...targetDay.track];
      if (targetDay.lunch) pointsToBound.push(targetDay.lunch.coords);
      targetDay.hotels.forEach(h => pointsToBound.push(h.coords));

      // Zoom in smoothly to the exact stage!
      leafletMap.flyToBounds(pointsToBound, {
        padding: [60, 60],
        maxZoom: 13,
        duration: 1.2
      });
    } else if (mapMode === 'google' && googleMap) {
      const singleBounds = new google.maps.LatLngBounds();
      googleDayPolylines.forEach(item => {
        if (item.day === dayNum) {
          item.polyline.setMap(googleMap);
          item.path.forEach(pt => singleBounds.extend(pt));
        } else {
          item.polyline.setMap(null);
        }
      });
      googleMap.fitBounds(singleBounds);
    }
  }
}

function setupFilterControls() {
  const daySelect = document.getElementById('day-filter-select');
  if (daySelect) {
    daySelect.onchange = (e) => {
      zoomToStage(e.target.value);
    };
  }

  ['hotels', 'lunch', 'bikeShops'].forEach(cat => {
    const el = document.getElementById(`toggle-${cat.toLowerCase()}`);
    if (el) {
      el.onchange = (e) => {
        if (mapMode === 'leaflet' && leafletMap) {
          if (isCompareMode) {
            if (cat === 'hotels' && compareLayers.markers) {
              if (e.target.checked) leafletMap.addLayer(compareLayers.markers);
              else leafletMap.removeLayer(compareLayers.markers);
            } else if (cat === 'lunch' && compareLayers.lunch) {
              if (e.target.checked) leafletMap.addLayer(compareLayers.lunch);
              else leafletMap.removeLayer(compareLayers.lunch);
            }
          } else {
            if (poiLayers[cat]) {
              if (e.target.checked) leafletMap.addLayer(poiLayers[cat]);
              else leafletMap.removeLayer(poiLayers[cat]);
            }
          }
        } else if (mapMode === 'google' && googleMap) {
          googleMarkers.forEach(m => {
            if (m.category === cat) m.setMap(e.target.checked ? googleMap : null);
          });
        }
      };
    }
  });
}

/* ============================================================
   LIVE WEATHER TRACKING & CYCLING RISK MATRIX (Open-Meteo)
============================================================ */
let tourStartDate = "2026-10-04";
let tourWeatherData = {};

// Fallback historical climate data for October in Hudson Valley / Adirondacks / Quebec
const OCTOBER_CLIMATE_FALLBACK = {
  1: { tempMax: 68, tempMin: 56, rainProb: 25, windSpeed: 8, windDir: 195, weatherCode: 2 }, // Brewster
  2: { tempMax: 72, tempMin: 56, rainProb: 25, windSpeed: 11, windDir: 185, weatherCode: 2 }, // Hudson
  3: { tempMax: 62, tempMin: 42, rainProb: 20, windSpeed: 10, windDir: 320, weatherCode: 1 }, // Saratoga
  4: { tempMax: 58, tempMin: 36, rainProb: 20, windSpeed: 6, windDir: 190, weatherCode: 1 },  // Ticonderoga
  5: { tempMax: 56, tempMin: 44, rainProb: 35, windSpeed: 9, windDir: 355, weatherCode: 61 }, // Plattsburgh
  6: { tempMax: 58, tempMin: 41, rainProb: 20, windSpeed: 8, windDir: 200, weatherCode: 2 },  // Saint-Jean / Montreal
  7: { tempMax: 59, tempMin: 42, rainProb: 15, windSpeed: 7, windDir: 195, weatherCode: 1 }   // Montreal (7-day victory lap)
};

function addDaysToDate(baseDateStr, daysToAdd) {
  const parts = baseDateStr.split('-');
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  d.setDate(d.getDate() + daysToAdd);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateDisplay(dateStr) {
  const parts = dateStr.split('-');
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function decodeWmoWeather(code) {
  switch (code) {
    case 0: return { text: "Clear Sky", icon: "☀️" };
    case 1: return { text: "Mainly Clear", icon: "🌤️" };
    case 2: return { text: "Partly Cloudy", icon: "⛅" };
    case 3: return { text: "Overcast", icon: "☁️" };
    case 45:
    case 48: return { text: "Fog / Mist", icon: "🌫️" };
    case 51:
    case 53:
    case 55: return { text: "Light Drizzle", icon: "🌦️" };
    case 56:
    case 57: return { text: "Freezing Drizzle", icon: "🌧️" };
    case 61: return { text: "Light Rain", icon: "🌦️" };
    case 63: return { text: "Moderate Rain", icon: "🌧️" };
    case 65: return { text: "Heavy Rain", icon: "🌧️" };
    case 66:
    case 67: return { text: "Freezing Rain", icon: "🌨️" };
    case 71:
    case 73:
    case 75: return { text: "Snow Flurries", icon: "🌨️" };
    case 80:
    case 81:
    case 82: return { text: "Rain Showers", icon: "🌦️" };
    case 95:
    case 96:
    case 99: return { text: "Thunderstorm", icon: "⛈️" };
    default: return { text: "Partly Cloudy", icon: "⛅" };
  }
}

function getWindDescription(speedMph, dirDeg) {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const val = Math.floor((dirDeg / 22.5) + 0.5) % 16;
  const compass = directions[val];

  let effect = "Crosswind";
  if (dirDeg >= 135 && dirDeg <= 225) {
    effect = "Tailwind 🚀";
  } else if (dirDeg >= 315 || dirDeg <= 45) {
    effect = "Headwind ⚠️";
  }

  return `${speedMph} mph ${compass} (${effect})`;
}

function calculateWeatherRisk(forecast) {
  let risk = 1;
  let reasons = [];
  let kitAdvice = "";

  // 1. Rain Risk
  if (forecast.rainProb >= 70) {
    risk += 4;
    reasons.push(`${forecast.rainProb}% rain`);
  } else if (forecast.rainProb >= 45) {
    risk += 3;
    reasons.push(`${forecast.rainProb}% rain`);
  } else if (forecast.rainProb >= 25) {
    risk += 2;
    reasons.push(`${forecast.rainProb}% chance showers`);
  } else if (forecast.rainProb >= 15) {
    risk += 1;
  }

  if ([63, 65, 82, 95, 96, 99].includes(forecast.weatherCode)) {
    risk += 1;
    reasons.push("Heavy precipitation potential");
  }

  // 2. Wind & Direction Risk (Traveling north bearing 0°)
  const isHeadwind = (forecast.windDir >= 315 || forecast.windDir <= 45);
  const isTailwind = (forecast.windDir >= 135 && forecast.windDir <= 225);

  if (forecast.windSpeed >= 20) {
    risk += 3;
    reasons.push(`High wind (${forecast.windSpeed} mph)`);
  } else if (forecast.windSpeed >= 13) {
    risk += 2;
    reasons.push(`Breezy (${forecast.windSpeed} mph)`);
  } else if (forecast.windSpeed >= 9) {
    risk += 1;
  }

  if (isHeadwind && forecast.windSpeed >= 10) {
    risk += 1;
    reasons.push("North headwind resistance");
  } else if (isTailwind && forecast.windSpeed >= 8) {
    risk = Math.max(1, risk - 1); // Tailwind relief!
  }

  // 3. Morning Low Temperature Risk
  if (forecast.tempMin < 36) {
    risk += 3;
    reasons.push(`Near-freezing start (${forecast.tempMin}°F)`);
    kitAdvice = "Thermal jacket, full-finger winter gloves, neck gaiter, and shoe covers. Watch for morning frost on wooden bridges.";
  } else if (forecast.tempMin < 45) {
    risk += 2;
    reasons.push(`Chilly morning (${forecast.tempMin}°F)`);
    kitAdvice = "Long-sleeve thermal base layer, wind vest/jacket, knee warmers, and mid-weight gloves for the first 2 hours.";
  } else if (forecast.tempMin < 53) {
    risk += 1;
    kitAdvice = "Arm warmers and packable wind shell. Comfortable short sleeve riding by late morning.";
  } else {
    kitAdvice = "Mild fall conditions. Standard short sleeve jersey with light arm warmers for the start.";
  }

  if (forecast.rainProb >= 35) {
    kitAdvice += " Pack waterproof rain shell, rear clip-on fender, and zip-top baggies for phone/electronics.";
  }

  risk = Math.max(1, Math.min(10, Math.round(risk)));

  let riskLevel = "Low";
  let badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-300";
  if (risk >= 7) {
    riskLevel = "High";
    badgeColor = "bg-red-100 text-red-800 border-red-300";
  } else if (risk >= 4) {
    riskLevel = "Moderate";
    badgeColor = "bg-amber-100 text-amber-800 border-amber-300";
  }

  return {
    score: risk,
    level: riskLevel,
    badgeColor,
    reasons: reasons.length ? reasons.join(" • ") : "Dry & favorable wind",
    kitAdvice,
    isHeadwind,
    isTailwind
  };
}

async function fetchTourWeather() {
  const summaryEl = document.getElementById('weather-summary-text');
  if (summaryEl) summaryEl.innerText = `Fetching live ECMWF & NOAA forecast relative to ${formatDateDisplay(tourStartDate)}...`;

  const daysToFetch = currentTour.days;
  const fetchPromises = daysToFetch.map(async (day) => {
    const stageDate = addDaysToDate(tourStartDate, day.day - 1);
    const coords = day.endCoords;
    const fallback = OCTOBER_CLIMATE_FALLBACK[day.day] || { tempMax: 62, tempMin: 44, rainProb: 20, windSpeed: 8, windDir: 180, weatherCode: 2 };

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords[0]}&longitude=${coords[1]}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,winddirection_10m_dominant&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York&forecast_days=16`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather API failed");
      const data = await res.json();

      const timeArr = data.daily?.time || [];
      const dIdx = timeArr.indexOf(stageDate);

      let tempMax = fallback.tempMax;
      let tempMin = fallback.tempMin;
      let rainProb = fallback.rainProb;
      let windSpeed = fallback.windSpeed;
      let windDir = fallback.windDir;
      let weatherCode = fallback.weatherCode;
      let isLive = false;

      if (dIdx !== -1) {
        tempMax = Math.round(data.daily.temperature_2m_max[dIdx]);
        tempMin = Math.round(data.daily.temperature_2m_min[dIdx]);
        rainProb = Math.round(data.daily.precipitation_probability_max[dIdx] ?? fallback.rainProb);
        windSpeed = Math.round(data.daily.windspeed_10m_max[dIdx] ?? fallback.windSpeed);
        windDir = Math.round(data.daily.winddirection_10m_dominant[dIdx] ?? fallback.windDir);
        weatherCode = data.daily.weathercode[dIdx] ?? fallback.weatherCode;
        isLive = true;
      }

      const weatherDecoded = decodeWmoWeather(weatherCode);
      const windText = getWindDescription(windSpeed, windDir);
      const risk = calculateWeatherRisk({ tempMax, tempMin, rainProb, windSpeed, windDir, weatherCode });

      tourWeatherData[day.day] = {
        dateStr: stageDate,
        dateFormatted: formatDateDisplay(stageDate),
        tempMax,
        tempMin,
        rainProb,
        windSpeed,
        windDir,
        windText,
        weatherCode,
        conditionText: weatherDecoded.text,
        icon: weatherDecoded.icon,
        riskScore: risk.score,
        riskLevel: risk.level,
        riskBadgeColor: risk.badgeColor,
        kitAdvice: risk.kitAdvice,
        isHeadwind: risk.isHeadwind,
        isTailwind: risk.isTailwind,
        reasons: risk.reasons,
        isLive
      };
    } catch (err) {
      console.warn(`Weather fetch failed for Stage ${day.day}, using climate model:`, err);
      const weatherDecoded = decodeWmoWeather(fallback.weatherCode);
      const windText = getWindDescription(fallback.windSpeed, fallback.windDir);
      const risk = calculateWeatherRisk(fallback);

      tourWeatherData[day.day] = {
        dateStr: stageDate,
        dateFormatted: formatDateDisplay(stageDate),
        tempMax: fallback.tempMax,
        tempMin: fallback.tempMin,
        rainProb: fallback.rainProb,
        windSpeed: fallback.windSpeed,
        windDir: fallback.windDir,
        windText,
        weatherCode: fallback.weatherCode,
        conditionText: weatherDecoded.text,
        icon: weatherDecoded.icon,
        riskScore: risk.score,
        riskLevel: risk.level,
        riskBadgeColor: risk.badgeColor,
        kitAdvice: risk.kitAdvice,
        isHeadwind: risk.isHeadwind,
        isTailwind: risk.isTailwind,
        reasons: risk.reasons,
        isLive: false
      };
    }
  });

  await Promise.all(fetchPromises);
  renderWeatherDashboard();
  renderDaysAccordion();
}

function renderWeatherDashboard() {
  const container = document.getElementById('weather-cards-grid');
  const summaryEl = document.getElementById('weather-trip-summary');
  if (!container) return;

  const days = currentTour.days;
  const weatherList = days.map(d => ({ day: d, w: tourWeatherData[d.day] })).filter(item => item.w);

  if (weatherList.length === 0) return;

  // Render stage cards
  container.innerHTML = weatherList.map(({ day, w }) => `
    <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between hover:shadow-md transition-all">
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-black uppercase tracking-wider text-slate-500">Stage ${day.day}</span>
          <span class="text-[10px] font-bold text-slate-700">${w.dateFormatted}</span>
        </div>
        <div class="flex items-center gap-2 pt-0.5">
          <span class="text-2xl">${w.icon}</span>
          <div>
            <div class="text-xs font-black text-slate-900 leading-tight">${w.tempMax}° <span class="text-[11px] font-normal text-slate-500">/ ${w.tempMin}°F</span></div>
            <div class="text-[10px] text-slate-600 truncate">${w.conditionText}</div>
          </div>
        </div>
        <div class="pt-1 text-[11px] space-y-0.5 text-slate-600">
          <div class="flex items-center justify-between">
            <span>Rain:</span>
            <span class="font-bold ${w.rainProb >= 40 ? 'text-amber-800' : 'text-slate-800'}">${w.rainProb}%</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Wind:</span>
            <span class="font-semibold text-slate-800 truncate" title="${w.windText}">${w.windSpeed} mph ${w.isTailwind ? '🚀' : w.isHeadwind ? '⚠️' : ''}</span>
          </div>
        </div>
      </div>
      <div class="mt-2.5 pt-2 border-t border-slate-200">
        <span class="w-full inline-block text-center py-0.5 rounded text-[10px] font-extrabold border ${w.riskBadgeColor}">
          🛡️ Risk: ${w.riskScore}/10 (${w.riskLevel})
        </span>
      </div>
    </div>
  `).join('');

  // Trip Summary calculations
  const maxTemps = weatherList.map(item => item.w.tempMax);
  const minTemps = weatherList.map(item => item.w.tempMin);
  const rainProbs = weatherList.map(item => item.w.rainProb);
  const tailwindsCount = weatherList.filter(item => item.w.isTailwind).length;
  const avgRisk = (weatherList.reduce((acc, item) => acc + item.w.riskScore, 0) / weatherList.length).toFixed(1);

  const highestTemp = Math.max(...maxTemps);
  const lowestTemp = Math.min(...minTemps);
  const maxRain = Math.max(...rainProbs);

  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="flex flex-wrap items-center gap-4 text-slate-800">
        <div>
          <span class="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Overall Trip Outlook</span>
          <span class="font-extrabold text-blue-900 text-sm">🛡️ Tour Risk: ${avgRisk}/10 (${avgRisk <= 3 ? 'Optimal Cycling' : 'Favorable with Advisories'})</span>
        </div>
        <div class="h-6 w-px bg-blue-200 hidden sm:block"></div>
        <div>
          <span class="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Temps (Low / High)</span>
          <span class="font-bold text-slate-900">${lowestTemp}°F morning &rarr; ${highestTemp}°F peak</span>
        </div>
        <div class="h-6 w-px bg-blue-200 hidden sm:block"></div>
        <div>
          <span class="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Wind Advantage</span>
          <span class="font-bold text-emerald-800">${tailwindsCount} of ${weatherList.length} Stages have Tailwinds 🚀</span>
        </div>
        <div class="h-6 w-px bg-blue-200 hidden sm:block"></div>
        <div>
          <span class="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Peak Rain Risk</span>
          <span class="font-bold ${maxRain >= 40 ? 'text-amber-800' : 'text-emerald-800'}">${maxRain}% Max Probability</span>
        </div>
      </div>
      <div class="text-[11px] font-semibold text-blue-800 shrink-0">
        📅 ${formatDateDisplay(tourStartDate)} &rarr; ${weatherList[weatherList.length - 1]?.w?.dateFormatted || ''}
      </div>
    `;
  }
}

function renderDayWeatherBox(dayNum) {
  const w = tourWeatherData[dayNum];
  if (!w) return '';

  return `
    <div class="bg-gradient-to-r from-sky-50 via-blue-50/40 to-slate-50 border border-sky-200 rounded-xl p-3.5 space-y-2.5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div class="flex items-center gap-3">
          <span class="text-3xl">${w.icon}</span>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black text-slate-900">${w.dateFormatted}</span>
              <span class="text-xs font-semibold text-slate-600">&bull; ${w.conditionText}</span>
            </div>
            <div class="text-xs text-slate-700 mt-0.5">
              <span class="font-extrabold text-blue-900">${w.tempMax}°F</span> High / <span class="font-medium text-slate-600">${w.tempMin}°F Low</span> &bull; 
              <span class="font-semibold ${w.rainProb >= 40 ? 'text-amber-800' : 'text-slate-700'}">💧 ${w.rainProb}% Rain</span> &bull; 
              <span class="font-semibold text-slate-700">💨 ${w.windText}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="badge-tag border font-extrabold ${w.riskBadgeColor} shadow-2xs">
            🛡️ Risk: ${w.riskScore}/10 (${w.riskLevel})
          </span>
        </div>
      </div>
      <div class="text-xs bg-white/90 p-2.5 rounded-lg border border-sky-100 text-slate-700 flex items-start gap-2">
        <span class="font-bold text-slate-900 shrink-0">🧥 Layer Advice:</span>
        <span class="text-slate-600">${w.kitAdvice}</span>
      </div>
    </div>
  `;
}

function updateTourStartDate(newDateStr) {
  if (!newDateStr) return;
  tourStartDate = newDateStr;
  fetchTourWeather();
}

function refreshWeatherData() {
  tourWeatherData = {};
  fetchTourWeather();
}

function renderDaysAccordion() {
  const container = document.getElementById('days-container');
  if (!container) return;

  container.innerHTML = currentTour.days.map((day, idx) => `
    <div class="day-card bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div class="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-sm" style="background-color: ${DAY_COLORS[idx]}">
              ${day.dayOfWeek}
            </span>
            <h3 class="text-lg font-bold text-slate-900">${day.name}</h3>
          </div>
          <p class="text-sm text-slate-500 font-medium">${day.subtitle}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <span class="badge-tag bg-blue-50 text-blue-700 border border-blue-200">🚴 ${day.distanceMiles} mi / ${day.distanceKm} km</span>
          <span class="badge-tag bg-amber-50 text-amber-700 border border-amber-200">⛰️ +${day.elevationFt} ft</span>
          <a href="${day.googleMapsDirUrl}" target="_blank" class="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 shadow-sm">
            🗺️ Baseline in Maps &rarr;
          </a>
          <button onclick="focusDayOnMap(${day.day})" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1">
            📍 Center
          </button>
        </div>
      </div>
      <div class="p-5 space-y-4">
        <!-- Live Weather & Cycling Risk Box -->
        ${renderDayWeatherBox(day.day)}

        <!-- Trail Surface -->
        <div class="text-xs flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span class="font-bold text-slate-700 shrink-0">Trail Surface:</span>
          <span class="text-slate-600">${day.surface}</span>
        </div>

        <!-- ⚡ Accelerate Push Callout (If Available) -->
        ${day.accelerateOption ? `
          <div class="bg-amber-50/80 border-2 border-amber-300 rounded-xl p-4 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                <span class="text-base">⚡</span>
                <span>Accelerate Push Option: ${day.accelerateOption.name}</span>
              </div>
              <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                ${day.accelerateOption.distanceMiles} mi total (+${day.accelerateOption.extraMiles} mi)
              </span>
            </div>
            <p class="text-xs text-amber-950 leading-relaxed font-medium">
              ${day.accelerateOption.notes}
            </p>
            <div class="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-amber-200">
              <span class="text-xs text-amber-900">
                <strong>Target Hotel:</strong> ${day.accelerateOption.hotel?.name || day.accelerateOption.targetTown} (${day.accelerateOption.hotel?.phone || ''})
              </span>
              <a href="${day.accelerateOption.googleMapsUrl}" target="_blank" class="text-xs font-bold px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center gap-1">
                🗺️ Open Accelerated Route in Google Maps &rarr;
              </a>
            </div>
          </div>
        ` : ''}

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Lunch Card -->
          <div class="bg-orange-50/70 border border-orange-200/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">
                <span>🥪 Lunch & Refreshment</span>
                <a href="${day.lunch.googleUrl}" target="_blank" class="text-[11px] font-semibold text-orange-700 underline">Open in Maps &rarr;</a>
              </div>
              <h4 class="text-sm font-bold text-slate-900">${day.lunch.name}</h4>
              <p class="text-xs text-slate-600 mt-0.5">${day.lunch.location} <span class="font-semibold text-orange-700">(Mile ${day.lunch.mile})</span></p>
              <p class="text-xs text-slate-700 mt-1.5">${day.lunch.notes}</p>
            </div>
          </div>

          <!-- Hotels Card -->
          <div class="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-3.5">
            <div class="flex items-center gap-1.5 text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">
              <span>🏨 Overnight Hotel Recommendations</span>
            </div>
            <div class="space-y-2 mt-1">
              ${day.hotels.map(h => `
                <div class="text-xs border-b border-indigo-100 last:border-0 pb-1.5 last:pb-0">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-900">${h.name}</span>
                    <a href="tel:${h.phone.replace(/[^0-9+]/g, '')}" class="font-mono text-indigo-700 font-semibold hover:underline">${h.phone}</a>
                  </div>
                  <div class="flex items-center justify-between mt-0.5">
                    <p class="text-slate-500 text-[11px]">${h.address}</p>
                    <a href="${h.googleUrl}" target="_blank" class="text-[10px] text-blue-600 hover:underline">Google Maps</a>
                  </div>
                  <p class="text-slate-700 mt-0.5">${h.notes}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Bike Shops & Bailouts -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div class="text-xs bg-red-50/60 border border-red-200/70 rounded-xl p-3">
            <span class="font-bold text-red-800 block mb-1">🔧 Bike Shops & Repair Support:</span>
            ${day.bikeShops.map(s => `
              <div class="mt-1 flex items-start justify-between gap-2">
                <div>
                  <span class="font-semibold text-slate-900">${s.name}</span> (${s.phone}) - <span class="text-slate-600">${s.notes}</span>
                </div>
                <a href="${s.googleUrl}" target="_blank" class="text-[10px] text-red-700 font-semibold underline shrink-0">Maps</a>
              </div>
            `).join('')}
          </div>

          <div class="text-xs bg-sky-50/60 border border-sky-200/70 rounded-xl p-3">
            <span class="font-bold text-sky-800 block mb-1">🚆 Rail Bailout & Contingency:</span>
            <p class="text-slate-700 leading-relaxed">${day.bailout}</p>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function focusDayOnMap(dayNum) {
  const select = document.getElementById('day-filter-select');
  if (select) select.value = dayNum.toString();

  zoomToStage(dayNum);

  const mapSec = document.getElementById('map-section');
  if (mapSec) mapSec.scrollIntoView({ behavior: 'smooth' });
}

function renderBikeShopsTable() {
  const container = document.getElementById('bike-shops-table-body');
  if (!container) return;

  let allShops = [];
  currentTour.days.forEach(day => {
    day.bikeShops.forEach(shop => {
      allShops.push({ ...shop, day: day.day, dayOfWeek: day.dayOfWeek });
    });
  });

  container.innerHTML = allShops.map(shop => `
    <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td class="py-3 px-4 font-semibold text-slate-900 text-xs">
        <span class="inline-block px-1.5 py-0.5 rounded text-white text-[10px] font-bold mr-1" style="background-color: ${DAY_COLORS[(shop.day - 1) % DAY_COLORS.length]}">
          ${shop.dayOfWeek.slice(0, 3)}
        </span>
        ${shop.name}
      </td>
      <td class="py-3 px-4 text-xs text-slate-600">
        ${shop.address}
        <a href="${shop.googleUrl}" target="_blank" class="ml-1 text-blue-600 hover:underline">[Map]</a>
      </td>
      <td class="py-3 px-4 text-xs font-mono font-semibold text-sky-700">
        <a href="tel:${shop.phone.replace(/[^0-9+]/g, '')}" class="hover:underline">${shop.phone}</a>
      </td>
      <td class="py-3 px-4 text-xs text-slate-700">${shop.notes}</td>
    </tr>
  `).join('');
}

function renderChecklist() {
  const container = document.getElementById('checklist-container');
  if (!container) return;

  const savedState = JSON.parse(localStorage.getItem('mtl_bike_checklist') || '{}');

  container.innerHTML = PACKING_CHECKLIST.map((category, catIdx) => `
    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <h4 class="font-bold text-sm text-slate-900 mb-3 flex items-center justify-between">
        <span>${category.category}</span>
        <span class="text-xs font-normal text-slate-400">(${category.items.length} items)</span>
      </h4>
      <div class="space-y-2">
        ${category.items.map((item, itemIdx) => {
          const key = `item_${catIdx}_${itemIdx}`;
          const isChecked = savedState[key] ? 'checked' : '';
          return `
            <label class="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
              <input type="checkbox" data-key="${key}" ${isChecked} onchange="toggleChecklistItem('${key}', this.checked)" class="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500">
              <span class="${isChecked ? 'line-through text-slate-400' : ''}">${item}</span>
            </label>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function toggleChecklistItem(key, checked) {
  const savedState = JSON.parse(localStorage.getItem('mtl_bike_checklist') || '{}');
  savedState[key] = checked;
  localStorage.setItem('mtl_bike_checklist', JSON.stringify(savedState));
  renderChecklist();
}

function copyGuideForGoogleDoc() {
  const guideText = document.getElementById('raw-markdown-content')?.innerText || '';
  navigator.clipboard.writeText(guideText).then(() => {
    const btn = document.getElementById('copy-doc-btn');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '✅ Copied to Clipboard!';
      btn.classList.add('bg-emerald-600', 'text-white');
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.classList.remove('bg-emerald-600', 'text-white');
      }, 3000);
    }
  });
}
