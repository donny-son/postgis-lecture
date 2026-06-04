// PostGIS Almanac — Interactive Spatial Explorer
// MapLibre GL (render) + Turf (client geometry) + DuckDB-WASM (in-browser spatial SQL).
// All data is a simplified, reprojected (Korea 5179 -> WGS84 4326) snapshot in ./data.

const DATA = 'data/';

// ---- layer catalogue --------------------------------------------------------
// kind: 'fill' (polygons) or 'circle' (points). `color` drives swatch + style.
const LAYERS = [
  { id: 'provinces',     file: 'provinces.geojson',     kind: 'fill',   color: '#7a8c5a', label: 'Provinces (시도)',        on: true,  z: 1 },
  { id: 'districts',     file: 'districts.geojson',     kind: 'fill',   color: '#b07a4a', label: 'Districts (시군구)',      on: false, z: 2 },
  { id: 'hospitals',     file: 'hospitals.geojson',     kind: 'circle', color: '#b5402a', label: 'Hospitals & clinics',     on: true,  z: 6 },
  { id: 'air_sites',     file: 'air_sites.geojson',     kind: 'circle', color: '#3f6fae', label: 'Air-quality sites',       on: false, z: 6 },
  { id: 'rail_stations', file: 'rail_stations.geojson', kind: 'circle', color: '#7d5ba6', label: 'Rail stations',           on: false, z: 5 },
  { id: 'airports',      file: 'airports.geojson',      kind: 'circle', color: '#c79a2e', label: 'Airports',                on: false, z: 5 },
];

const geojsonCache = {};   // id -> FeatureCollection
const counts = {};         // id -> feature count

// ---- map --------------------------------------------------------------------
const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
    sources: {
      carto: {
        type: 'raster',
        tiles: ['https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png'],
        tileSize: 256,
        attribution: '© <a href="https://carto.com/">CARTO</a> · © OpenStreetMap contributors · GIS snapshot: teaching DB (Korea, SRID 5179→4326)',
      },
    },
    layers: [{ id: 'basemap', type: 'raster', source: 'carto' }],
  },
  center: [127.5, 36.2],
  zoom: 6.4,
  maxZoom: 16,
});
map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-right');

// ---- helpers ----------------------------------------------------------------
const $ = (s) => document.querySelector(s);
const fmt = (n) => n.toLocaleString('en-US');

async function loadJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.json();
}

// Accordion panels
document.querySelectorAll('.panel > h2').forEach((h) =>
  h.addEventListener('click', () => h.parentElement.classList.toggle('collapsed')));

// ---- stats header -----------------------------------------------------------
async function loadMeta() {
  try {
    const m = await loadJSON(DATA + 'meta.json');
    const c = m.counts;
    const cards = [
      ['hospitals', 'health facilities'],
      ['general_hospitals', 'general hospitals'],
      ['districts', 'districts'],
      ['air_sites', 'air sites'],
      ['bus_stops', 'bus stops'],
      ['rail_stations', 'rail stations'],
    ];
    $('#stats').innerHTML = cards
      .map(([k, lbl]) => `<div class="stat"><b>${fmt(c[k])}</b><span>${lbl}</span></div>`)
      .join('');
  } catch (e) { /* non-fatal */ }
}

// ---- add a data layer to the map -------------------------------------------
function addLayer(cfg, fc) {
  const srcId = `src-${cfg.id}`;
  map.addSource(srcId, { type: 'geojson', data: fc });

  if (cfg.kind === 'fill') {
    map.addLayer({
      id: `${cfg.id}-fill`, type: 'fill', source: srcId,
      paint: { 'fill-color': cfg.color, 'fill-opacity': 0.12 },
      layout: { visibility: cfg.on ? 'visible' : 'none' },
    });
    map.addLayer({
      id: `${cfg.id}-line`, type: 'line', source: srcId,
      paint: { 'line-color': cfg.color, 'line-width': 1.1, 'line-opacity': 0.8 },
      layout: { visibility: cfg.on ? 'visible' : 'none' },
    });
    map.on('click', `${cfg.id}-fill`, (e) => popup(e, cfg));
  } else {
    map.addLayer({
      id: `${cfg.id}-pt`, type: 'circle', source: srcId,
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 6, 2.2, 11, 4.5, 15, 8],
        'circle-color': cfg.color,
        'circle-opacity': 0.82,
        'circle-stroke-width': 0.6,
        'circle-stroke-color': '#fff',
      },
      layout: { visibility: cfg.on ? 'visible' : 'none' },
    });
    map.on('click', `${cfg.id}-pt`, (e) => popup(e, cfg));
    map.on('mouseenter', `${cfg.id}-pt`, () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', `${cfg.id}-pt`, () => (map.getCanvas().style.cursor = ''));
  }
}

function popup(e, cfg) {
  if (pickMode) return; // don't popup while choosing a buffer centre
  const p = e.features[0].properties;
  let html = '';
  if (cfg.id === 'hospitals') {
    html = `<span class="popup-type">${p.category}</span><br><b>${p.name || '—'}</b>` +
           (p.beds > 0 ? `<br>${fmt(Math.round(p.beds))} beds` : '') +
           (p.address ? `<br><span style="font-size:.72rem;color:#666">${p.address}</span>` : '');
  } else if (cfg.kind === 'fill') {
    html = `<span class="popup-type">${cfg.label}</span><br><b>${p.name}</b><br>` +
           `<span style="font-size:.72rem;color:#666">adm_cd ${p.adm_cd}</span>`;
  } else {
    html = `<span class="popup-type">${cfg.label}</span><br><b>${p.name || p.station || '—'}</b>` +
           (p.line ? `<br>${p.line}` : '') + (p.address ? `<br><span style="font-size:.72rem;color:#666">${p.address}</span>` : '');
  }
  new maplibregl.Popup({ closeButton: false, maxWidth: '260px' })
    .setLngLat(e.lngLat).setHTML(html).addTo(map);
}

// ---- layer toggles UI -------------------------------------------------------
function buildLayerUI() {
  $('#layer-list').innerHTML = LAYERS.map((c) => `
    <label class="layer">
      <input type="checkbox" data-layer="${c.id}" ${c.on ? 'checked' : ''}>
      <span class="swatch" style="background:${c.color}"></span>
      <span class="name">${c.label}</span>
      <span class="ct" id="ct-${c.id}">…</span>
    </label>`).join('');

  $('#layer-list').querySelectorAll('input').forEach((cb) =>
    cb.addEventListener('change', () => {
      const id = cb.dataset.layer;
      const vis = cb.checked ? 'visible' : 'none';
      ['-fill', '-line', '-pt'].forEach((sfx) => {
        if (map.getLayer(id + sfx)) map.setLayoutProperty(id + sfx, 'visibility', vis);
      });
    }));
}

// ============================================================================
//  BUFFER / PROXIMITY TOOL  (Turf — mirrors ST_Buffer + ST_DWithin)
// ============================================================================
let pickMode = false;
let centerLngLat = null;
let centerMarker = null;

function setBadge(t) { $('#map-badge').innerHTML = t; }

$('#pick-center').addEventListener('click', () => {
  pickMode = true;
  $('#crosshair-note').classList.add('show');
  map.getCanvas().style.cursor = 'crosshair';
});

map.on('click', (e) => {
  if (!pickMode) return;
  pickMode = false;
  $('#crosshair-note').classList.remove('show');
  map.getCanvas().style.cursor = '';
  centerLngLat = [e.lngLat.lng, e.lngLat.lat];
  if (centerMarker) centerMarker.remove();
  centerMarker = new maplibregl.Marker({ color: '#b5402a' }).setLngLat(centerLngLat).addTo(map);
  drawBuffer();
});

$('#radius').addEventListener('input', () => {
  $('#radius-val').textContent = fmt(+$('#radius').value) + ' m';
  if (centerLngLat) drawBuffer();
});
$('#buffer-target').addEventListener('change', () => centerLngLat && drawBuffer());
$('#clear-buffer').addEventListener('click', clearBuffer);

function clearBuffer() {
  centerLngLat = null;
  if (centerMarker) { centerMarker.remove(); centerMarker = null; }
  ['buffer-poly', 'buffer-hits'].forEach((id) => {
    if (map.getLayer(id)) map.removeLayer(id);
    if (map.getSource(id)) map.removeSource(id);
  });
  $('#buffer-result').style.display = 'none';
  $('#buffer-sql').style.display = 'none';
}

function drawBuffer() {
  const radius = +$('#radius').value;
  const targetId = $('#buffer-target').value;
  const center = turf.point(centerLngLat);
  const ring = turf.buffer(center, radius, { units: 'meters' });

  // (re)draw the buffer polygon
  if (map.getSource('buffer-poly')) map.getSource('buffer-poly').setData(ring);
  else {
    map.addSource('buffer-poly', { type: 'geojson', data: ring });
    map.addLayer({ id: 'buffer-poly', type: 'fill', source: 'buffer-poly',
      paint: { 'fill-color': '#b5402a', 'fill-opacity': 0.12, 'fill-outline-color': '#b5402a' } },
      firstPointLayer());
  }

  // count + collect features within radius (true geodesic distance == ST_DWithin)
  const fc = geojsonCache[targetId];
  const hits = { type: 'FeatureCollection', features: [] };
  if (fc) for (const f of fc.features) {
    if (f.geometry.type !== 'Point') continue;
    if (turf.distance(center, f, { units: 'meters' }) <= radius) hits.features.push(f);
  }
  if (map.getSource('buffer-hits')) map.getSource('buffer-hits').setData(hits);
  else {
    map.addSource('buffer-hits', { type: 'geojson', data: hits });
    map.addLayer({ id: 'buffer-hits', type: 'circle', source: 'buffer-hits',
      paint: { 'circle-radius': 5, 'circle-color': '#1f7a3d', 'circle-stroke-width': 1, 'circle-stroke-color': '#fff' } });
  }

  const total = fc ? fc.features.length : 0;
  const tgtLabel = LAYERS.find((l) => l.id === targetId).label;
  $('#buffer-result').style.display = 'block';
  $('#buffer-result').innerHTML =
    `<b>${fmt(hits.features.length)}</b> of ${fmt(total)} ${tgtLabel.toLowerCase()} ` +
    `within <b>${fmt(radius)} m</b><br>` +
    `<span style="font-size:.72rem;color:#555">centre ${centerLngLat[1].toFixed(4)}°N, ${centerLngLat[0].toFixed(4)}°E</span>`;

  // live PostGIS SQL echo — the real thing this visual represents
  $('#buffer-sql').style.display = 'block';
  $('#buffer-sql').innerHTML =
`<span class="kw">SELECT</span> <span class="fn">count</span>(*)
<span class="kw">FROM</span> ${targetId === 'hospitals' ? 'hospitals' : targetId} t
<span class="kw">WHERE</span> <span class="fn">ST_DWithin</span>(
  t.geom::<span class="fn">geography</span>,
  <span class="fn">ST_SetSRID</span>(<span class="fn">ST_MakePoint</span>(<span class="num">${centerLngLat[0].toFixed(5)}</span>, <span class="num">${centerLngLat[1].toFixed(5)}</span>), <span class="num">4326</span>)::<span class="fn">geography</span>,
  <span class="num">${radius}</span>);`;
}

// keep buffer fills under point layers
function firstPointLayer() {
  for (const c of LAYERS) if (c.kind === 'circle' && map.getLayer(`${c.id}-pt`)) return `${c.id}-pt`;
  return undefined;
}

// ============================================================================
//  DUCKDB-WASM SPATIAL SQL CONSOLE
// ============================================================================
const EXAMPLES = [
  { t: 'Health facilities by category', sql:
`SELECT category, count(*) AS n
FROM hospitals
GROUP BY category
ORDER BY n DESC;` },
  { t: 'Spatial join — facilities per province', sql:
`-- points-in-polygons, the workhorse pattern
SELECT p.name AS province, count(*) AS facilities
FROM provinces p
JOIN hospitals h
  ON ST_Contains(p.geom, h.geom)
GROUP BY p.name
ORDER BY facilities DESC;` },
  { t: 'Proximity — distance to a point (metres)', sql:
`-- DuckDB has no geography type: project 4326 -> Korea 5179 for true metres
SELECT name, s_type,
  ST_Distance(
    ST_Transform(geom, 'EPSG:4326', 'EPSG:5179'),
    ST_Transform(ST_Point(126.9779, 37.5663), 'EPSG:4326', 'EPSG:5179')
  )::INT AS metres_from_seoul_cityhall
FROM hospitals
ORDER BY metres_from_seoul_cityhall
LIMIT 10;` },
  { t: 'Buffer / service area as WKT', sql:
`SELECT name,
  ST_AsText(ST_Buffer(
    ST_Transform(geom,'EPSG:4326','EPSG:5179'), 1000)) AS service_area_1km
FROM hospitals
WHERE category = 'General hospital'
LIMIT 5;` },
  { t: 'General hospitals only', sql:
`SELECT name, beds, address
FROM hospitals
WHERE category = 'General hospital' AND beds > 0
ORDER BY beds DESC
LIMIT 15;` },
];

function buildExamples() {
  $('#examples').innerHTML = EXAMPLES
    .map((e, i) => `<a data-ex="${i}">▸ ${e.t}</a>`).join('');
  $('#examples').querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => { $('#sql-input').value = EXAMPLES[+a.dataset.ex].sql; }));
}

let duck = null;           // { db, conn }
let duckReady = false;
let duckBooting = null;

function duckStatus(msg, cls = '') { const el = $('#duck-status'); el.textContent = msg; el.className = 'duck-status ' + cls; }

async function bootDuck() {
  if (duckBooting) return duckBooting;
  duckBooting = (async () => {
    duckStatus('Starting DuckDB-WASM…');
    const duckdb = await import('https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.29.0/+esm');
    const bundles = duckdb.getJsDelivrBundles();
    const bundle = await duckdb.selectBundle(bundles);
    const workerUrl = URL.createObjectURL(
      new Blob([`importScripts("${bundle.mainWorker}");`], { type: 'text/javascript' }));
    const worker = new Worker(workerUrl);
    const db = new duckdb.AsyncDuckDB(new duckdb.ConsoleLogger(), worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    URL.revokeObjectURL(workerUrl);
    const conn = await db.connect();

    duckStatus('Loading spatial extension…');
    await conn.query('INSTALL spatial; LOAD spatial;');

    duckStatus('Loading snapshot tables…');
    for (const cfg of LAYERS) {
      await db.registerFileURL(cfg.file, new URL(DATA + cfg.file, location.href).href,
        duckdb.DuckDBDataProtocol.HTTP, false);
      // ST_Read flattens GeoJSON properties into columns + a `geom` column
      await conn.query(`CREATE TABLE ${cfg.id} AS SELECT * FROM ST_Read('${cfg.file}');`);
    }
    duck = { db, conn, duckdb };
    duckReady = true;
    duckStatus('DuckDB ready · spatial extension loaded · 6 tables', 'ok');
  })().catch((err) => {
    console.error(err);
    duckStatus('DuckDB/spatial failed to load (network or browser limit). The map & buffer tools still work. ' + err.message, 'err');
    throw err;
  });
  return duckBooting;
}

function renderTable(rows, cols) {
  if (!rows.length) { $('#sql-result').innerHTML = '<p class="hint">0 rows.</p>'; return; }
  const head = `<tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>`;
  const body = rows.slice(0, 200).map((r) =>
    `<tr>${cols.map((c) => `<td>${fmtCell(r[c])}</td>`).join('')}</tr>`).join('');
  $('#sql-result').innerHTML = `<table>${head}${body}</table>` +
    (rows.length > 200 ? `<p class="hint">Showing 200 of ${fmt(rows.length)} rows.</p>` : '');
}
function fmtCell(v) {
  if (v == null) return '<span style="color:#999">∅</span>';
  if (typeof v === 'bigint') return v.toString();
  if (v instanceof Uint8Array) return '«geom»';
  const s = String(v);
  return s.length > 80 ? s.slice(0, 80) + '…' : s;
}

async function runSQL() {
  try {
    await bootDuck();
  } catch { return; }
  const sql = $('#sql-input').value.trim().replace(/;\s*$/, '');
  if (!sql) return;
  duckStatus('Running…');
  const t0 = performance.now();
  try {
    const res = await duck.conn.query(sql);
    const cols = res.schema.fields.map((f) => f.name);
    const rows = res.toArray().map((r) => r.toJSON());
    renderTable(rows, cols);
    duckStatus(`${fmt(rows.length)} rows · ${(performance.now() - t0).toFixed(0)} ms`, 'ok');
    lastResult = { rows, cols };
  } catch (err) {
    $('#sql-result').innerHTML = '';
    duckStatus('SQL error: ' + err.message, 'err');
  }
}

// Plot a query result that includes a geometry column onto the map.
let lastResult = null;
async function plotSQL() {
  if (!duckReady) { await runSQL(); }
  // re-run wrapping geometry as GeoJSON so we can render it
  const sql = $('#sql-input').value.trim().replace(/;\s*$/, '');
  try {
    await bootDuck();
    const wrapped = `SELECT *, ST_AsGeoJSON(geom) AS __gj FROM (${sql}) q`;
    const res = await duck.conn.query(wrapped);
    const rows = res.toArray().map((r) => r.toJSON());
    const features = rows.filter((r) => r.__gj).map((r) => ({
      type: 'Feature', properties: {}, geometry: JSON.parse(r.__gj),
    }));
    if (!features.length) { duckStatus('No geometry column to plot (alias it `geom`).', 'err'); return; }
    const fc = { type: 'FeatureCollection', features };
    if (map.getSource('sql-plot')) map.getSource('sql-plot').setData(fc);
    else {
      map.addSource('sql-plot', { type: 'geojson', data: fc });
      map.addLayer({ id: 'sql-plot-pt', type: 'circle', source: 'sql-plot',
        filter: ['==', ['geometry-type'], 'Point'],
        paint: { 'circle-radius': 6, 'circle-color': '#e0a500', 'circle-stroke-width': 1.4, 'circle-stroke-color': '#000' } });
      map.addLayer({ id: 'sql-plot-poly', type: 'line', source: 'sql-plot',
        filter: ['!=', ['geometry-type'], 'Point'],
        paint: { 'line-color': '#e0a500', 'line-width': 2 } });
    }
    try { map.fitBounds(turf.bbox(fc), { padding: 60, maxZoom: 13, duration: 600 }); } catch {}
    duckStatus(`Plotted ${fmt(features.length)} geometries.`, 'ok');
  } catch (err) {
    duckStatus('Plot failed: ' + err.message + ' — does the query return a `geom` column?', 'err');
  }
}

$('#run-sql').addEventListener('click', runSQL);
$('#map-sql').addEventListener('click', plotSQL);
$('#sql-input').addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); runSQL(); }
});

// ============================================================================
//  BOOT
// ============================================================================
map.on('load', async () => {
  buildLayerUI();
  buildExamples();
  await loadMeta();

  // load layers in z-order (polygons first so points sit on top)
  for (const cfg of [...LAYERS].sort((a, b) => a.z - b.z)) {
    try {
      const fc = await loadJSON(DATA + cfg.file);
      geojsonCache[cfg.id] = fc;
      counts[cfg.id] = fc.features.length;
      $('#ct-' + cfg.id).textContent = fmt(fc.features.length);
      addLayer(cfg, fc);
    } catch (e) {
      $('#ct-' + cfg.id).textContent = '⚠';
      console.error('layer failed', cfg.id, e);
    }
  }
  $('#veil').classList.add('hidden');
  setBadge('Click any feature for details · use <b>Buffer &amp; proximity</b> to draw a service area');
});
