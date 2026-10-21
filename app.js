// Main application logic for NYC to Montreal Bike Tour Webpage
// Supports 6-Day Leisurely Tour AND 5-Day Fast Tour (+ Acceleration Options)

let currentTour = TOUR_DATA_6DAY;
let leafletMap;
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

let vermontLayerGroup = null;
let isVermontOverlayActive = false;


const DAY_COLORS = [
  '#2563eb', // Day 1: Blue
  '#0891b2', // Day 2: Cyan
  '#16a34a', // Day 3: Green
  '#d97706', // Day 4: Amber
  '#9333ea', // Day 5: Purple
  '#059669', // Day 6: Emerald
  '#e11d48'  // Day 7: Rose / Ruby
];

function renderStaticDataBits() {
  [['6day', TOUR_DATA_6DAY], ['5day', TOUR_DATA_5DAY], ['7day', TOUR_DATA_7DAY]].forEach(([id, t]) => {
    const el = document.getElementById(`tab-avg-${id}`);
    if (el) el.innerText = `(~${Math.round(t.averageDailyMiles)} mi/d)`;
  });
  const ret = document.getElementById('return-miles');
  if (ret && typeof RETURN_ROUTE !== 'undefined') ret.innerText = RETURN_ROUTE.distanceMiles;
  renderVermontSection();
}

function renderVermontSection() {
  const el = document.getElementById('vermont-generated');
  if (!el || typeof VERMONT_UPGRADE_DATA === 'undefined') return;
  const v = VERMONT_UPGRADE_DATA;
  el.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
      <div class="bg-white/5 border border-emerald-700/30 rounded-xl p-4 space-y-2">
        <div class="text-emerald-400 font-bold text-sm">⛴️ ${v.ferry.name}</div>
        <p class="text-slate-300 leading-relaxed">${v.ferry.crossingTime}. ${v.ferry.fare}. ${v.ferry.schedule}</p>
      </div>
      <div class="bg-white/5 border border-emerald-700/30 rounded-xl p-4 space-y-2">
        <div class="text-emerald-400 font-bold text-sm">🌊 ${v.bikeFerry.name}</div>
        <p class="text-slate-300 leading-relaxed">${v.bikeFerry.schedule} ${v.bikeFerry.fare}.</p>
        <p class="text-amber-300 leading-relaxed"><strong>If it isn't running:</strong> ${v.bikeFerry.fallBypass}</p>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${v.stages.map(st => `
        <div class="bg-emerald-950/40 border border-emerald-600/40 rounded-xl p-4 space-y-2 text-xs">
          <div class="flex items-center justify-between gap-2">
            <span class="font-black uppercase tracking-wider text-emerald-400">${st.stageId}</span>
            <span class="font-bold text-slate-300">${st.distanceMiles} mi &bull; +${st.elevationFt.toLocaleString()} ft (est.)</span>
          </div>
          <h4 class="font-bold text-white text-sm">${st.dayName}</h4>
          <p class="text-slate-300">${st.surface}</p>
          <p class="text-slate-300"><strong>Lunch (mile ${st.lunch.mile}):</strong> ${st.lunch.name}. ${st.lunch.notes}</p>
          <p class="text-slate-300"><strong>Overnight:</strong> ${st.hotels.map(h => `${h.name} (${h.phone})`).join(' / ')}</p>
          <a href="${st.gpx}" download class="inline-block mt-1 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold">⬇️ ${st.stageId} GPX</a>
        </div>`).join('')}
    </div>
    <p class="text-[11px] text-slate-400">${v.summary}</p>`;
}

// Offline support: cache the app, data and GPX files (needs http/https; file:// works without it
// because every library is bundled locally).
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => console.warn('Service worker registration failed:', err));
  });
}

// Guide tabs and shareable links. The URL hash holds the itinerary, the view and the guide tab,
// leaving out defaults (6-day, guide view, Route tab): #5day, #strip, #7day/strip, #weather, #5day/gear.
const GUIDE_TABS = ['route', 'weather', 'logistics', 'gear'];
const ITINERARY_IDS = ['6day', '5day', '7day', 'vermont', 'compare'];
let currentGuideTab = 'route';

function stateHash() {
  const parts = [];
  if (selectedItineraryId !== '6day') parts.push(selectedItineraryId);
  if (currentAppViewMode === 'strip') parts.push('strip');
  else if (currentGuideTab !== 'route') parts.push(currentGuideTab);
  return parts.length ? `#${parts.join('/')}` : '';
}

function syncHash() {
  const hash = stateHash();
  if (location.hash !== hash) history.replaceState(null, '', location.pathname + location.search + hash);
}

function applyHash() {
  const parts = location.hash.slice(1).split('/').filter(Boolean);
  const itinerary = parts.find(p => ITINERARY_IDS.includes(p)) || '6day';
  const view = parts.includes('strip') ? 'strip' : 'guide';
  const tab = parts.find(p => GUIDE_TABS.includes(p)) || 'route';
  if (view !== currentAppViewMode) setAppViewMode(view);
  if (itinerary !== selectedItineraryId) handleItinerarySelect(itinerary);
  if (currentAppViewMode === 'guide') showGuideTab(tab);
  syncHash();
}

function showGuideTab(name) {
  if (!GUIDE_TABS.includes(name)) name = 'route';
  currentGuideTab = name;
  GUIDE_TABS.forEach(t => {
    const panel = document.getElementById(`guide-tab-${t}`);
    const btn = document.getElementById(`guide-tab-btn-${t}`);
    if (panel) panel.hidden = t !== name;
    if (btn) {
      btn.classList.toggle('is-active', t === name);
      btn.setAttribute('aria-selected', String(t === name));
    }
  });
  syncHash();
  // Leaflet can't measure a map while its panel is hidden: resize now, and apply a fit that was deferred
  if (name === 'route' && leafletMap) {
    if (pendingMapFit) fitMapToRoute(pendingMapFit);
    else leafletMap.invalidateSize();
  }
}

// Open a tab from elsewhere on the page and bring the tab bar into view below the sticky header
function openGuideTab(name) {
  showGuideTab(name);
  const tabs = document.querySelector('.guide-tabs');
  const header = document.querySelector('header');
  if (!tabs) return;
  const top = tabs.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0) - 8;
  window.scrollTo({ top, behavior: 'smooth' });
}

window.addEventListener('hashchange', applyHash);

document.addEventListener('DOMContentLoaded', () => {
  renderStaticDataBits();
  // Purge any previously cached key to ensure zero conflicts
  localStorage.removeItem('gmaps_api_key');
  renderActiveTour();
  renderChecklist();
  initLeafletMap();
  setupFilterControls();
  fetchTourWeather();
  applyHash();
});

let currentAppViewMode = 'guide'; // 'guide' | 'strip'
let selectedItineraryId = '6day'; // '6day' | '5day' | '7day' | 'vermont' | 'compare'

function updateItineraryTabsUI(tourId) {
  // The header's Print / PDF button opens the ready-made packet for the selected itinerary
  const printLink = document.getElementById('print-pdf-link');
  if (printLink) printLink.href = `pdf/nyc_to_montreal_${tourId === 'compare' ? '6day' : tourId}_strip_maps.pdf`;

  const tourIds = ['6day', '5day', '7day', 'vermont', 'compare'];
  tourIds.forEach(id => {
    const btn = document.getElementById(`tab-${id}`);
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(id === tourId));
    if (id === tourId) {
      if (id === 'vermont') {
        btn.className = "px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white shadow-sm transition-all flex items-center gap-1.5 ring-2 ring-emerald-400";
      } else if (id === '5day') {
        btn.className = "px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 shadow-sm transition-all flex items-center gap-1.5 ring-2 ring-amber-400";
      } else if (id === '7day') {
        btn.className = "px-3.5 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white shadow-sm transition-all flex items-center gap-1.5 ring-2 ring-rose-400";
      } else {
        btn.className = "px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white shadow-sm transition-all flex items-center gap-1.5 ring-2 ring-blue-400";
      }
    } else {
      btn.className = "px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5";
    }
  });
}

function handleItinerarySelect(tourId) {
  selectItinerary(tourId);
  syncHash();
}

function selectItinerary(tourId) {
  selectedItineraryId = tourId;
  updateItineraryTabsUI(tourId);

  // If in Strip Map mode:
  if (currentAppViewMode === 'strip') {
    if (tourId === 'compare') {
      // Compare is side-by-side tables and maps in the guide; switch to guide view
      setAppViewMode('guide');
      switchTourMode('compare');
      return;
    }
    // Keep the guide's tour in step, so the KML link, Copy for Google Docs and the guide view match
    switchTourMode(tourId === 'vermont' ? '7day' : tourId);
    updateItineraryTabsUI(tourId);
    if (typeof renderMtaRouteMap === 'function') {
      renderMtaRouteMap(tourId);
    }
    return;
  }

  // If in Guide mode:
  if (tourId === 'vermont') {
    showGuideTab('route');
    // The Vermont variant replaces Days 5 and 6 of the 7-day tour, so show that tour underneath it.
    if (currentTour !== TOUR_DATA_7DAY) {
      switchTourMode('7day');
      updateItineraryTabsUI('vermont');
    }
    if (typeof isVermontOverlayActive !== 'undefined' && !isVermontOverlayActive) {
      toggleVermontOverlay();
    }
    const vtSection = document.getElementById('vermont-upgrade-section');
    if (vtSection) {
      setTimeout(() => {
        vtSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    return;
  }

  // Standard tour mode in guide
  switchTourMode(tourId);
}

function setAppViewMode(mode) {
  currentAppViewMode = mode;
  const dashboardView = document.getElementById('tour-dashboard-view');
  const routeMapView = document.getElementById('mta-route-map-view');
  const btnGuide = document.getElementById('view-mode-guide');
  const btnStrip = document.getElementById('view-mode-strip');
  const tabCompare = document.getElementById('tab-compare');
  if (btnGuide) btnGuide.setAttribute('aria-pressed', String(mode !== 'strip'));
  if (btnStrip) btnStrip.setAttribute('aria-pressed', String(mode === 'strip'));

  if (mode === 'strip') {
    if (dashboardView) dashboardView.classList.add('hidden');
    if (routeMapView) routeMapView.classList.remove('hidden');

    if (btnStrip) {
      btnStrip.className = "px-3.5 py-1.5 text-xs font-black rounded-lg bg-black text-white shadow-xs transition-all flex items-center gap-1.5";
    }
    if (btnGuide) {
      btnGuide.className = "px-3.5 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1.5";
    }

    if (tabCompare) tabCompare.classList.add('opacity-40');

    // Determine tour to display
    let stripId = selectedItineraryId;
    if (stripId === 'compare') stripId = '6day';
    if (!['6day', '5day', '7day', 'vermont'].includes(stripId)) {
      stripId = '6day';
    }
    if (typeof renderMtaRouteMap === 'function') {
      renderMtaRouteMap(stripId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Guide mode
    if (routeMapView) routeMapView.classList.add('hidden');
    if (dashboardView) dashboardView.classList.remove('hidden');

    if (btnGuide) {
      btnGuide.className = "px-3.5 py-1.5 text-xs font-black rounded-lg bg-blue-600 text-white shadow-xs transition-all flex items-center gap-1.5";
    }
    if (btnStrip) {
      btnStrip.className = "px-3.5 py-1.5 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1.5";
    }

    if (tabCompare) tabCompare.classList.remove('opacity-40');

    setTimeout(() => {
      if (typeof leafletMap !== 'undefined' && leafletMap && typeof leafletMap.invalidateSize === 'function') {
        leafletMap.invalidateSize();
      }
    }, 100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  syncHash();
}

function switchTourMode(tourType) {
  const kmlLink = document.getElementById('kml-download-link');
  const compareSection = document.getElementById('compare-section');
  const legendNormal = document.getElementById('map-legend-normal');
  const legendCompare = document.getElementById('map-legend-compare');

  updateItineraryTabsUI(tourType);

  if (tourType === 'compare') {
    showGuideTab('route');
    isCompareMode = true;
    if (compareSection) compareSection.classList.remove('hidden');
    renderCompareSection();
    if (legendNormal) legendNormal.classList.add('hidden');
    if (legendCompare) legendCompare.classList.remove('hidden');

    renderCompareStats();
    renderCompareMap();
    setupFilterControls();
    fetchTourWeather();

    if (compareSection) {
      setTimeout(() => {
        compareSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    return;
  }

  isCompareMode = false;
  if (compareSection) compareSection.classList.add('hidden');
  if (legendCompare) legendCompare.classList.add('hidden');
  if (legendNormal) legendNormal.classList.remove('hidden');

  if (tourType === '7day') {
    currentTour = TOUR_DATA_7DAY;
    if (kmlLink) {
      kmlLink.href = "nyc_to_montreal_7day_tour.kml";
      kmlLink.download = "nyc_to_montreal_7day_tour.kml";
    }
  } else if (tourType === '5day') {
    currentTour = TOUR_DATA_5DAY;
    if (kmlLink) {
      kmlLink.href = "nyc_to_montreal_5day_tour.kml";
      kmlLink.download = "nyc_to_montreal_5day_tour.kml";
    }
  } else {
    currentTour = TOUR_DATA_6DAY;
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

function renderCompareSection() {
  const el = document.getElementById('compare-generated');
  if (!el) return;
  const tours = [
    { t: TOUR_DATA_7DAY, key: '7day', border: 'border-rose-300', text: 'text-rose-700', note: 'Recommended. The border day and the Montréal finish are split, so the last two days are short and flat.' },
    { t: TOUR_DATA_6DAY, key: '6day', border: 'border-blue-300', text: 'text-blue-700', note: 'Same as the 7-day through Plattsburgh, then one long flat day (with the border crossing) to Montréal.' },
    { t: TOUR_DATA_5DAY, key: '5day', border: 'border-amber-300', text: 'text-amber-700', note: 'Three days over 90 miles in October daylight. Strong riders on light bikes only.' }
  ];
  const cards = tours.map(({ t, key, border, text, note }) => `
    <div class="bg-white rounded-2xl border-2 ${border} shadow-sm p-5 space-y-3 flex flex-col justify-between">
      <div class="space-y-3">
        <h3 class="text-lg font-black text-slate-900">${t.title}</h3>
        <p class="text-xs text-slate-600">${note}</p>
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="bg-slate-50 rounded-lg p-2"><div class="text-[10px] uppercase text-slate-500 font-bold">Total</div><div class="text-sm font-extrabold ${text}">${t.totalDistanceMiles} mi</div></div>
          <div class="bg-slate-50 rounded-lg p-2"><div class="text-[10px] uppercase text-slate-500 font-bold">Per day</div><div class="text-sm font-extrabold ${text}">${t.averageDailyMiles} mi</div></div>
          <div class="bg-slate-50 rounded-lg p-2"><div class="text-[10px] uppercase text-slate-500 font-bold">Climb (est.)</div><div class="text-sm font-extrabold ${text}">+${t.elevationGainFt.toLocaleString()} ft</div></div>
        </div>
        <div class="text-[11px] text-slate-700"><strong>Longest day:</strong> ${Math.max(...t.days.map(d => d.distanceMiles))} mi</div>
      </div>
      <button onclick="switchTourMode('${key}')" class="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-white font-bold text-xs">Select ${t.durationDays}-Day Tour &rarr;</button>
    </div>`).join('');
  const maxDays = 7;
  let rows = '';
  for (let i = 0; i < maxDays; i++) {
    rows += `<tr class="border-t border-slate-200 align-top"><td class="py-2.5 px-3 font-bold">Day ${i + 1}</td>` +
      tours.map(({ t }) => {
        const d = t.days[i];
        return d ? `<td class="py-2.5 px-3"><div class="font-bold text-slate-900">${d.dayOfWeek} ${d.dateStr}: ${d.name.split(': ').slice(1).join(': ')}</div><div class="text-slate-600">${d.distanceMiles} mi · +${d.elevationFt.toLocaleString()} ft · overnight ${d.hotels[0].name}</div>${d.accelerateOption ? `<div class="text-amber-700 mt-1">⚡ ${d.accelerateOption.notes}</div>` : ''}</td>` : '<td class="py-2.5 px-3 text-slate-400">—</td>';
      }).join('') + '</tr>';
  }
  el.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">${cards}</div>
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto mt-6">
      <table class="w-full text-left text-xs border-collapse">
        <thead class="bg-slate-50"><tr><th class="py-3 px-3">Day</th>${tours.map(({ t }) => `<th class="py-3 px-3">${t.title}</th>`).join('')}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function renderCompareStats() {
  const elDist = document.getElementById('stat-total-dist');
  if (elDist) elDist.innerText = `${TOUR_DATA_5DAY.totalDistanceMiles}–${TOUR_DATA_7DAY.totalDistanceMiles} mi by itinerary`;
  
  const elSched = document.getElementById('stat-schedule');
  if (elSched) elSched.innerText = "7-Day vs 6-Day vs 5-Day";
  
  const elAvg = document.getElementById('stat-avg-miles');
  if (elAvg) elAvg.innerText = `(${TOUR_DATA_7DAY.averageDailyMiles} vs ${TOUR_DATA_6DAY.averageDailyMiles} vs ${TOUR_DATA_5DAY.averageDailyMiles} mi/day)`;

  const elPace = document.getElementById('stat-pace');
  if (elPace) elPace.innerText = "Gentler Touring vs Classic Endurance vs Fast";
  const elClimb = document.getElementById('stat-total-climb');
  if (elClimb) elClimb.innerText = `+${TOUR_DATA_5DAY.elevationGainFt.toLocaleString()} to +${TOUR_DATA_7DAY.elevationGainFt.toLocaleString()} ft`;

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

  setCompareSummaryPills(pillStage, pillDist, pillElev);
}

function setCompareSummaryPills(pillStage, pillDist, pillElev) {
  if (pillStage) {
    pillStage.innerText = "⚖️ Comparing Tour Itineraries";
    pillStage.className = "badge-tag bg-purple-50 text-purple-800 border border-purple-200 font-bold shadow-xs transition-all";
  }
  if (pillDist) pillDist.innerText = `🚴 ${TOUR_DATA_7DAY.averageDailyMiles} vs ${TOUR_DATA_6DAY.averageDailyMiles} vs ${TOUR_DATA_5DAY.averageDailyMiles} mi/day`;
  if (pillElev) pillElev.innerText = `⛰️ +${TOUR_DATA_5DAY.elevationGainFt.toLocaleString()}–${TOUR_DATA_7DAY.elevationGainFt.toLocaleString()} ft total (est.)`;
}

function renderActiveTour() {
  const elDist = document.getElementById('stat-total-dist');
  if (elDist) elDist.innerText = `${currentTour.totalDistanceMiles} mi (${Math.round(currentTour.totalDistanceMiles * 1.60934)} km)`;
  
  const elSched = document.getElementById('stat-schedule');
  if (elSched) {
    if (currentTour.durationDays === 7) {
      elSched.innerText = "Sun Oct 4 → Sat Oct 10 (7 Days)";
    } else if (currentTour.durationDays === 5) {
      elSched.innerText = "Sun Oct 4 → Thu Oct 8 (5 Days)";
    } else {
      elSched.innerText = "Sun Oct 4 → Fri Oct 9 (6 Days)";
    }
  }
  
  const elAvg = document.getElementById('stat-avg-miles');
  if (elAvg) elAvg.innerText = `(~${currentTour.averageDailyMiles} mi/day)`;

  const elPace = document.getElementById('stat-pace');
  if (elPace) elPace.innerText = currentTour.pace;

  const elClimb = document.getElementById('stat-total-climb');
  if (elClimb) elClimb.innerText = `+${currentTour.elevationGainFt.toLocaleString()} ft`;

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
// Fit the map to a route. While the Route tab is hidden the map has no size (Leaflet then computes a
// broken view), so the fit waits until showGuideTab('route') reveals the map.
let pendingMapFit = null;

function fitMapToRoute(tracks) {
  const el = document.getElementById('map');
  if (leafletMap && el && el.offsetWidth > 0) {
    leafletMap.invalidateSize();
    leafletMap.fitBounds(tracks, { padding: [30, 30] });
    pendingMapFit = null;
  } else {
    pendingMapFit = tracks;
  }
}

// Stadia Maps tiles (authorized by domain in Stadia dashboard; localhost works for development),
// with automatic fallback to keyless Esri/OSM tiles if the current domain isn't registered in Stadia.
const STADIA_ATTRIBUTION = '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
let stadiaDomainBlocked = false;

function addBaseLayers(map) {
  const stadia = style => L.tileLayer(`https://tiles.stadiamaps.com/tiles/${style}/{z}/{x}/{y}{r}.png`, {
    attribution: STADIA_ATTRIBUTION,
    maxZoom: 20,
    crossOrigin: true
  });
  const esriTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, USGS, NPS, NRCAN, &copy; OpenStreetMap contributors',
    maxZoom: 19,
    crossOrigin: true
  });
  const esriStreets = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, TomTom',
    maxZoom: 19,
    crossOrigin: true
  });
  const osmStandard = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    crossOrigin: true
  });

  const outdoors = stadia('outdoors');
  const stadiaStreet = stadia('osm_bright');

  if (stadiaDomainBlocked) {
    esriTopo.addTo(map);
    setTimeout(() => updateMapBadge("Map: Esri Topo"), 0);
  } else {
    outdoors.on('tileerror', () => {
      if (!stadiaDomainBlocked && navigator.onLine !== false) {
        stadiaDomainBlocked = true;
        if (map.hasLayer(outdoors)) {
          map.removeLayer(outdoors);
          esriTopo.addTo(map);
          updateMapBadge("Map: Esri Topo");
        }
      }
    });
    outdoors.addTo(map);
  }

  L.control.layers({
    "Outdoors (Stadia)": outdoors,
    "Street Map (Stadia)": stadiaStreet,
    "Topographic (Esri)": esriTopo,
    "Street Map (Esri)": esriStreets,
    "OpenStreetMap": osmStandard
  }, null, { position: 'topright' }).addTo(map);
}

function initLeafletMap() {
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

  addBaseLayers(leafletMap);

  dayLayers = {};
  Object.values(poiLayers).forEach(layer => layer.clearLayers());
  vermontLayerGroup = null;
  isVermontOverlayActive = false;
  const vtResetBtn = document.getElementById('btn-toggle-vermont');
  if (vtResetBtn) {
    vtResetBtn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-all flex items-center gap-1.5 shadow-2xs";
    vtResetBtn.innerHTML = '<span>🌲 Vermont Upgrade</span><span class="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-extrabold uppercase">Overlay</span>';
  }

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
  fitMapToRoute(allTracks);
  // The container may not have its final size yet (fonts/CSS still settling): refit once layout is done.
  setTimeout(() => fitMapToRoute(allTracks), 250);

  setTimeout(() => {
    if (leafletMap && typeof leafletMap.invalidateSize === 'function') {
      leafletMap.invalidateSize();
    }
  }, 200);

  updateMapBadge("Map: Stadia Outdoors");
}

/* ============================================================
   COMPARE MODE MAP IMPLEMENTATION (Both Routes Overlaid)
============================================================ */
function renderCompareMap() {
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

  addBaseLayers(leafletMap);

  compareLayers = {
    sixDay: L.layerGroup(),
    fiveDay: L.layerGroup(),
    sevenDay: L.layerGroup(),
    accelerate: L.layerGroup(),
    markers: L.layerGroup(),
    lunch: L.layerGroup(),
    bikeShops: L.layerGroup()
  };

  vermontLayerGroup = null;
  isVermontOverlayActive = false;
  const vtCompBtn = document.getElementById('btn-toggle-vermont');
  if (vtCompBtn) {
    vtCompBtn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-all flex items-center gap-1.5 shadow-2xs";
    vtCompBtn.innerHTML = '<span>🌲 Vermont Upgrade</span><span class="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-extrabold uppercase">Overlay</span>';
  }

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
      <p class="text-xs text-gray-700 mb-1">Crossed on Day 5 (5-Day Tour) or Day 6 (6- and 7-Day Tours). Passports required!</p>
    </div>
  `);
  compareLayers.markers.addLayer(borderMarker);

  // 7-Day Tour: Days 1 to 5 are the 6-Day route, so draw only where it differs (Days 6 and 7, Solid Rose)
  TOUR_DATA_7DAY.days.slice(5).forEach(day => {
    compareLayers.sevenDay.addLayer(L.polyline(day.track, {
      color: '#e11d48', weight: 3, opacity: 0.9, lineCap: 'round', lineJoin: 'round'
    }).bindPopup(`
      <div class="p-2">
        <span class="inline-block px-2 py-0.5 text-xs font-bold text-rose-800 rounded mb-1" style="background:#ffe4e6;">🗓️ 7-Day Tour • Stage ${day.day}</span>
        <h4 class="font-bold text-gray-900">${day.name}</h4>
        <span class="text-xs font-semibold text-rose-700">${day.distanceMiles} mi • +${day.elevationFt} ft climbing</span>
        <p class="text-xs text-gray-600 mt-1">Days 1 to 5 follow the 6-Day route.</p>
      </div>
    `));
  });
  const sevenDayStop = TOUR_DATA_7DAY.days[5].hotels[0];
  compareLayers.sevenDay.addLayer(L.marker(sevenDayStop.coords, { icon: L.divIcon({
    className: 'custom-pin',
    html: `<div style="background:#e11d48; color:white; width:28px; height:28px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 6px rgba(0,0,0,0.3); font-size:11px; font-weight:bold;">7D</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  }) }).bindPopup(`
    <div class="p-2">
      <span class="inline-block px-2 py-0.5 text-xs font-bold text-rose-800 rounded mb-1" style="background:#ffe4e6;">🗓️ 7-Day Overnight (Stage 6)</span>
      <h4 class="font-bold text-gray-900">${sevenDayStop.name}</h4>
      <p class="text-xs text-gray-600 mb-1">${sevenDayStop.address}</p>
      <p class="text-xs font-mono text-rose-700 font-semibold mb-1">${sevenDayStop.phone}</p>
    </div>
  `));

  // Add all layers to map
  compareLayers.sixDay.addTo(leafletMap);
  compareLayers.sevenDay.addTo(leafletMap);
  compareLayers.fiveDay.addTo(leafletMap);
  compareLayers.accelerate.addTo(leafletMap);
  compareLayers.markers.addTo(leafletMap);
  compareLayers.lunch.addTo(leafletMap);

  const allTracks = [
    ...TOUR_DATA_6DAY.days.flatMap(d => d.track),
    ...TOUR_DATA_5DAY.days.flatMap(d => d.track)
  ];
  fitMapToRoute(allTracks);
  setTimeout(() => fitMapToRoute(allTracks), 250);

  setTimeout(() => {
    if (leafletMap && typeof leafletMap.invalidateSize === 'function') {
      leafletMap.invalidateSize();
    }
  }, 200);

  updateMapBadge("Comparing Both Routes (6-Day Blue vs 5-Day Amber)");
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
    if (pillDist) pillDist.innerText = `🚴 ${currentTour.totalDistanceMiles} mi / ${Math.round(currentTour.totalDistanceMiles * 1.609344)} km`;
    if (pillElev) pillElev.innerText = `⛰️ +${currentTour.elevationGainFt.toLocaleString()} ft`;
    const pillWeather = document.getElementById('map-pill-weather');
    if (pillWeather) pillWeather.innerText = `🌤️ ${currentTour.days[0].dateStr}–${currentTour.days[currentTour.days.length - 1].dateStr} Weather`;
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
      setCompareSummaryPills(pillStage, pillDist, pillElev);
    } else if (val === 'compare-6day') {
      if (compareLayers.sixDay) compareLayers.sixDay.eachLayer(l => l.setStyle({ weight: 7, opacity: 1.0 }));
      if (compareLayers.fiveDay) compareLayers.fiveDay.eachLayer(l => l.setStyle({ weight: 2, opacity: 0.2 }));
      const sixTracks = TOUR_DATA_6DAY.days.flatMap(d => d.track);
      if (leafletMap) leafletMap.flyToBounds(sixTracks, { padding: [30, 30], duration: 1.0 });
      if (pillStage) pillStage.innerText = "🗓️ 6-Day Tour Highlighted (Solid Blue)";
      if (pillDist) pillDist.innerText = `🚴 ${TOUR_DATA_6DAY.totalDistanceMiles} mi • ${TOUR_DATA_6DAY.averageDailyMiles} mi/day avg`;
      if (pillElev) pillElev.innerText = `⛰️ +${TOUR_DATA_6DAY.elevationGainFt.toLocaleString()} ft total (est.)`;
    } else if (val === 'compare-5day') {
      if (compareLayers.sixDay) compareLayers.sixDay.eachLayer(l => l.setStyle({ weight: 2, opacity: 0.2 }));
      if (compareLayers.fiveDay) compareLayers.fiveDay.eachLayer(l => l.setStyle({ weight: 7, opacity: 1.0 }));
      const fiveTracks = TOUR_DATA_5DAY.days.flatMap(d => d.track);
      if (leafletMap) leafletMap.flyToBounds(fiveTracks, { padding: [30, 30], duration: 1.0 });
      if (pillStage) pillStage.innerText = "⚡ 5-Day Fast Tour Highlighted (Dashed Amber)";
      if (pillDist) pillDist.innerText = `🚴 ${TOUR_DATA_5DAY.totalDistanceMiles} mi • ${TOUR_DATA_5DAY.averageDailyMiles} mi/day avg`;
      if (pillElev) pillElev.innerText = `⛰️ +${TOUR_DATA_5DAY.elevationGainFt.toLocaleString()} ft total (est.)`;
    } else if (val === 'compare-accel') {
      const accelCoords = TOUR_DATA_5DAY.days.filter(d => d.accelerateOption).map(d => d.endCoords);
      if (leafletMap && accelCoords.length > 0) {
        leafletMap.flyToBounds(accelCoords, { padding: [60, 60], duration: 1.0 });
      }
      if (pillStage) pillStage.innerText = "⚡ Push options (not recommended)";
      if (pillDist) pillDist.innerText = "🚴 Every push option is a 125+ mile day";
      if (pillElev) pillElev.innerText = "⛰️ Kingston, Essex, Saint-Jean";
    }
    return;
  }

  updateMapPills(val);

  if (val === 'all') {
    if (leafletMap) {
      Object.entries(dayLayers).forEach(([num, layer]) => {
        layer.addTo(leafletMap);
        layer.setStyle({ weight: 5, opacity: 0.85 });
      });
      const allTracks = currentTour.days.flatMap(d => d.track);
      leafletMap.flyToBounds(allTracks, { padding: [30, 30], duration: 1.0 });
    }
  } else {
    const dayNum = parseInt(val, 10);
    const targetDay = currentTour.days.find(d => d.day === dayNum);
    if (!targetDay) return;

    if (leafletMap) {
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
        if (leafletMap) {
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
        }
      };
    }
  });
}

/* ============================================================
   VERMONT CHAMPLAIN ISLANDS UPGRADE OVERLAY
============================================================ */
function toggleVermontOverlay() {
  const btn = document.getElementById('btn-toggle-vermont');

  if (isVermontOverlayActive) {
    if (leafletMap && vermontLayerGroup) {
      leafletMap.removeLayer(vermontLayerGroup);
    }
    vermontLayerGroup = null;
    isVermontOverlayActive = false;

    if (btn) {
      btn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-all flex items-center gap-1.5 shadow-2xs";
      btn.innerHTML = '<span>🌲 Vermont Upgrade</span><span class="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-extrabold uppercase">Overlay</span>';
    }
    updateMapBadge(isCompareMode ? "Comparing Tours" : "Map: Stadia Outdoors");
    return;
  }

  if (!leafletMap) {
    alert("Please switch to the Free Leaflet map to view the Vermont route overlay.");
    return;
  }

  if (typeof VERMONT_UPGRADE_DATA === 'undefined') {
    console.error("VERMONT_UPGRADE_DATA not found in route_data.js");
    return;
  }

  vermontLayerGroup = L.layerGroup();

  // 1. Stage VT-1 track (Ticonderoga to Essex, cyan)
  const vt1 = VERMONT_UPGRADE_DATA.stages[0];
  const polyVt1 = L.polyline(vt1.track, {
    color: '#06b6d4', // Cyan
    weight: 5.5,
    opacity: 0.95,
    lineCap: 'round',
    lineJoin: 'round'
  }).bindPopup(`
    <div class="p-2">
      <span class="inline-block px-2 py-0.5 text-xs font-bold bg-cyan-100 text-cyan-800 rounded mb-1">🌲 Vermont Upgrade • Stage VT-1</span>
      <h4 class="font-bold text-gray-900">${vt1.dayName}</h4>
      <span class="text-xs font-semibold text-cyan-700">${vt1.distanceMiles} mi • +${vt1.elevationFt} ft</span>
      <p class="text-xs text-gray-600 mt-1">${vt1.surface}</p>
      <p class="text-xs text-slate-500 mt-1">Crosses Lake Champlain on the Essex–Charlotte ferry (${VERMONT_UPGRADE_DATA.ferry.fare}).</p>
    </div>
  `);
  vermontLayerGroup.addLayer(polyVt1);

  // 2. Essex-Charlotte ferry (the VT-1 track already follows the ferry; this highlights it)
  const ferryInfo = VERMONT_UPGRADE_DATA.ferry;
  const ferryLine = L.polyline([
    [44.3107, -73.3509], // Essex dock
    [44.3014, -73.2972]  // Charlotte dock
  ], {
    color: '#0284c7', // Sky Blue
    weight: 4,
    dashArray: '6, 8',
    opacity: 0.9
  }).bindPopup(`
    <div class="p-2">
      <span class="inline-block px-2 py-0.5 text-xs font-bold bg-sky-100 text-sky-800 rounded mb-1">⛴️ Ferry Crossing</span>
      <h4 class="font-bold text-gray-900">${ferryInfo.name}</h4>
      <p class="text-xs text-gray-700 mt-1"><strong>Duration:</strong> ${ferryInfo.crossingTime}</p>
      <p class="text-xs text-gray-700"><strong>Schedule:</strong> ${ferryInfo.schedule}</p>
      <p class="text-xs font-bold text-sky-800"><strong>Fare:</strong> ${ferryInfo.fare}</p>
    </div>
  `);
  vermontLayerGroup.addLayer(ferryLine);

  // 3. Stage VT-2 track (Burlington -> Island Line Causeway -> Champlain Islands -> Saint-Jean, emerald)
  const vt2 = VERMONT_UPGRADE_DATA.stages[1];
  const polyVt2 = L.polyline(vt2.track, {
    color: '#10b981', // Emerald
    weight: 5.5,
    opacity: 0.95,
    lineCap: 'round',
    lineJoin: 'round'
  }).bindPopup(`
    <div class="p-2">
      <span class="inline-block px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded mb-1">🌲 Vermont Upgrade • Stage VT-2</span>
      <h4 class="font-bold text-gray-900">${vt2.dayName}</h4>
      <span class="text-xs font-semibold text-emerald-700">${vt2.distanceMiles} mi • +${vt2.elevationFt} ft</span>
      <p class="text-xs text-gray-600 mt-1">${vt2.surface}</p>
      <p class="text-xs text-slate-500 mt-1">Colchester Causeway, Local Motion bike ferry (Fri–Sun only in fall), Champlain Islands, then Rouses Point and Route 223.</p>
    </div>
  `);
  vermontLayerGroup.addLayer(polyVt2);

  // 4. Vermont POI pins (text comes from route_data.js so it stays in sync with the guides)
  const bikeFerry = VERMONT_UPGRADE_DATA.bikeFerry;
  const vtLunch = vt2.lunch;
  const vtHotel = vt1.hotels[0];
  const vtPins = [
    {
      coords: [44.3107, -73.3509],
      icon: '⛴️',
      bg: '#0284c7',
      html: `
        <div class="p-2">
          <span class="inline-block px-2 py-0.5 text-xs font-bold bg-sky-100 text-sky-800 rounded mb-1">⛴️ Lake Champlain Ferry</span>
          <h4 class="font-bold text-gray-900">Essex, NY Ferry Dock (mile ${vt1.lunch.mile})</h4>
          <p class="text-xs text-gray-600">${ferryInfo.fare}. ${ferryInfo.schedule}</p>
          <p class="text-xs text-gray-700 mt-1">Food: ${vt1.lunch.name}. ${vt1.lunch.notes}</p>
        </div>
      `
    },
    {
      coords: vtHotel.coords,
      icon: '🏨',
      bg: '#4f46e5',
      html: `
        <div class="p-2">
          <span class="inline-block px-2 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-800 rounded mb-1">🏨 Overnight</span>
          <h4 class="font-bold text-gray-900">${vtHotel.name}</h4>
          <p class="text-xs text-gray-600">${vtHotel.address} &bull; ${vtHotel.phone}</p>
          <p class="text-xs text-gray-700 mt-1">${vtHotel.notes}</p>
        </div>
      `
    },
    {
      coords: [44.5663, -73.3119],
      icon: '🌊',
      bg: '#0891b2',
      html: `
        <div class="p-2">
          <span class="inline-block px-2 py-0.5 text-xs font-bold bg-cyan-100 text-cyan-800 rounded mb-1">🌊 Island Line Trail</span>
          <h4 class="font-bold text-gray-900">Colchester Causeway</h4>
          <p class="text-xs text-gray-700">About 3 mi of crushed-stone path on the old marble rail causeway, out into Lake Champlain.</p>
        </div>
      `
    },
    {
      coords: [44.5904, -73.3127],
      icon: '⛴️',
      bg: '#059669',
      html: `
        <div class="p-2">
          <span class="inline-block px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded mb-1">⛴️ Bike Ferry ("The Cut")</span>
          <h4 class="font-bold text-gray-900">${bikeFerry.name}</h4>
          <p class="text-xs text-gray-700">${bikeFerry.schedule} ${bikeFerry.fare}.</p>
          <p class="text-xs text-gray-700 mt-1"><em>If closed:</em> ${bikeFerry.fallBypass}</p>
        </div>
      `
    },
    {
      coords: vtLunch.coords,
      icon: '🥪',
      bg: '#ea580c',
      html: `
        <div class="p-2">
          <span class="inline-block px-2 py-0.5 text-xs font-bold bg-orange-100 text-orange-800 rounded mb-1">🥪 Lunch Stop</span>
          <h4 class="font-bold text-gray-900">${vtLunch.name}</h4>
          <p class="text-xs text-gray-600">${vtLunch.address} (mile ${vtLunch.mile})${vtLunch.phone ? ' &bull; ' + vtLunch.phone : ''}</p>
          <p class="text-xs text-gray-700 mt-1">${vtLunch.notes}</p>
        </div>
      `
    },
    {
      coords: [45.0103, -73.3709],
      icon: '🇨🇦',
      bg: '#16a34a',
      html: `
        <div class="p-2">
          <span class="inline-block px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded mb-1">🇨🇦 Canada Customs</span>
          <h4 class="font-bold text-gray-900">Rouses Point–Lacolle 223 (US-11 / Route 223)</h4>
          <p class="text-xs text-gray-700">Open 8 AM to 8 PM daily (both sides). The route returns to NY over the US-2 bridge and crosses here, the same crossing as the main route. Passport, EDL or NEXUS.</p>
        </div>
      `
    }
  ];

  vtPins.forEach(pin => {
    const pinIcon = L.divIcon({
      className: 'custom-pin',
      html: `<div style="background:${pin.bg}; width:30px; height:30px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 6px rgba(0,0,0,0.35); font-size:15px;">${pin.icon}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
    const marker = L.marker(pin.coords, { icon: pinIcon }).bindPopup(pin.html);
    vermontLayerGroup.addLayer(marker);
  });

  vermontLayerGroup.addTo(leafletMap);
  isVermontOverlayActive = true;

  if (btn) {
    btn.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white border border-emerald-700 transition-all flex items-center gap-1.5 shadow-md ring-2 ring-emerald-400";
    btn.innerHTML = '<span>🌲 Vermont Overlay Active</span><span class="text-[10px] bg-white text-emerald-800 px-1.5 py-0.5 rounded font-extrabold uppercase">ON</span>';
  }

  // Fly map to show the Vermont variant corridor
  const vtPoints = [...vt1.track, ...vt2.track];
  leafletMap.flyToBounds(vtPoints, { padding: [40, 40], duration: 1.2 });
  updateMapBadge("🌲 Vermont Upgrade Active (Cyan & Emerald Overlay)");
}

/* ============================================================
   LIVE WEATHER TRACKING & CYCLING RISK MATRIX (Open-Meteo)
============================================================ */
let tourStartDate = "2026-10-04";
let tourWeatherData = {};

// Fallback when no live forecast is available (offline, or the date is more than 16 days out).
// These are rough early-October climate normals for each stage's end point, NOT a forecast;
// the UI labels them as "Typical" so nobody mistakes them for a prediction.
const OCTOBER_CLIMATE_FALLBACK = {
  1: { tempMax: 67, tempMin: 47, rainProb: 30, windSpeed: 8, windDir: 225, weatherCode: 2 }, // Brewster / Poughkeepsie
  2: { tempMax: 65, tempMin: 44, rainProb: 30, windSpeed: 8, windDir: 225, weatherCode: 2 }, // Hudson / Troy
  3: { tempMax: 64, tempMin: 42, rainProb: 30, windSpeed: 8, windDir: 225, weatherCode: 2 }, // Schuylerville / Ticonderoga
  4: { tempMax: 62, tempMin: 40, rainProb: 30, windSpeed: 8, windDir: 225, weatherCode: 2 }, // Ticonderoga / Plattsburgh
  5: { tempMax: 60, tempMin: 41, rainProb: 30, windSpeed: 9, windDir: 225, weatherCode: 2 }, // Plattsburgh / Montreal
  6: { tempMax: 60, tempMin: 41, rainProb: 30, windSpeed: 9, windDir: 225, weatherCode: 2 }, // Saint-Jean / Montreal
  7: { tempMax: 59, tempMin: 42, rainProb: 30, windSpeed: 9, windDir: 225, weatherCode: 2 }  // Montreal
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

// One forecast request per location per page visit: itineraries share overnight towns, and switching
// tours or tabs refetched every day (enough to hit Open-Meteo's rate limit).
const forecastCache = new Map();

function fetchForecast(url) {
  if (!forecastCache.has(url)) {
    forecastCache.set(url, fetch(url).then(res => {
      if (!res.ok) throw new Error("Weather API failed");
      return res.json();
    }).catch(err => {
      forecastCache.delete(url); // retry next time instead of caching the failure
      throw err;
    }));
  }
  return forecastCache.get(url);
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

      const data = await fetchForecast(url);

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
        <div>
          <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${w.isLive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}">${w.isLive ? 'Live forecast' : 'Typical Oct weather, not a forecast'}</span>
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

  const liveCount = weatherList.filter(item => item.w.isLive).length;
  const statusEl = document.getElementById('weather-summary-text');
  if (statusEl) {
    statusEl.innerText = liveCount === weatherList.length
      ? `Live forecast (Open-Meteo) for all ${liveCount} stages.`
      : liveCount === 0
        ? `No live forecast available (offline, or more than 16 days out). Showing typical early-October values only.`
        : `Live forecast for ${liveCount} of ${weatherList.length} stages; the rest show typical early-October values.`;
  }

  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="flex flex-wrap items-center gap-4 text-slate-800">
        <div>
          <span class="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">Overall Trip Outlook</span>
          <span class="font-extrabold text-blue-900 text-sm">🛡️ Tour Risk: ${avgRisk}/10${liveCount === 0 ? ' (typical values, not a forecast)' : ''}</span>
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

// Feedback form (Google Form). 'dayField' is the entry ID of the "Itinerary and day" question,
// taken from the form's pre-filled link. While 'url' is empty the buttons stay hidden.
const FEEDBACK_FORM = {
  url: 'https://docs.google.com/forms/d/e/1FAIpQLSeDura6hWc2IsvVfC4hfnianb-JxMLV5e6jpbTa3fX6u5Dh5w/viewform',
  dayField: 'entry.785229534'
};

function feedbackLink(day) {
  if (!FEEDBACK_FORM.url) return '';
  const label = `${currentTour.title}, Day ${day.day}: ${day.name.split(': ').slice(1).join(': ')}`;
  const href = `${FEEDBACK_FORM.url}?usp=pp_url&${FEEDBACK_FORM.dayField}=${encodeURIComponent(label)}`;
  return `<a href="${href}" target="_blank" rel="noopener" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1">✉️ Report a problem</a>`;
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
            🗺️ Google Maps (approx.) &rarr;
          </a>
          ${day.gpx ? `<a href="${day.gpx}" download class="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm">⬇️ Day GPX</a>` : ''}
          <button onclick="focusDayOnMap(${day.day})" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1">
            📍 Center
          </button>
          ${feedbackLink(day)}
        </div>
      </div>
      <div class="p-5 space-y-4">
        ${day.altNote ? `<div class="text-xs bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3"><strong>Option:</strong> ${day.altNote}</div>` : ''}
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

  showGuideTab('route');
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

function buildGuideText() {
  const t = currentTour;
  const strip = (typeof STRIP_MAP_ITINERARIES !== 'undefined') ? STRIP_MAP_ITINERARIES[t.id] : null;
  const lines = [
    `NYC to Montréal: ${t.title}`,
    `${t.totalDistanceMiles} mi total, about +${t.elevationGainFt.toLocaleString()} ft (estimated), ${t.averageDailyMiles} mi/day. ${t.pace}.`,
    '',
    'Return: Amtrak Adirondack carries bikes only between NYC and Rouses Point, NY. Southbound leaves Rouses Point 2:15 PM (Sun, Tue-Sat); no Monday train from Rouses Point.',
    'Border: Rouses Point-Lacolle 223 (US-11 / Route 223), open 8 AM to 8 PM daily on both sides. Passport, passport card, EDL or NEXUS. No cannabis, no pepper spray.',
    ''
  ];
  t.days.forEach((d, i) => {
    lines.push(`${d.name} (${d.dateStr})`);
    lines.push(`  ${d.distanceMiles} mi / ${d.distanceKm} km, about +${d.elevationFt.toLocaleString()} ft. GPX: ${d.gpx}`);
    lines.push(`  Lunch (mile ${d.lunch.mile}): ${d.lunch.name}, ${d.lunch.address}${d.lunch.phone ? ', ' + d.lunch.phone : ''}. ${d.lunch.notes}`);
    d.hotels.forEach(h => lines.push(`  Hotel: ${h.name}, ${h.address}, ${h.phone}. ${h.notes}`));
    lines.push(`  Bailout: ${d.bailout}`);
    if (d.altNote) lines.push(`  Option: ${d.altNote}`);
    const st = strip && strip.stages[i];
    if (st) {
      lines.push('  Cues:');
      st.cues.forEach(c => lines.push(`    ${c.mile.toFixed(1).padStart(5)}  ${c.action} ${c.road}${c.detail ? ' | ' + c.detail : ''}`));
    }
    lines.push('');
  });
  return lines.join('\n');
}

function copyGuideForGoogleDoc() {
  const guideText = buildGuideText();
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
