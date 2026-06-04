---
theme: seriph
title: 'The PostGIS Almanac — Spatial Databases & AI-Assisted GIS for Public Health'
info: |
  ## The PostGIS Almanac
  Spatial Databases (PostGIS) & AI-Assisted GIS for Public Health Research.

  A two-hour, hands-on academic lecture — covering why spatial databases matter,
  PostGIS fundamentals in depth, setting up a lab (DuckDB + Docker PostGIS),
  connecting from SQL / Python / R, the modern (2026) geospatial stack, an
  end-to-end clinic-accessibility case study, and learning & doing GIS
  responsibly with generative AI.
class: text-center
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: slide-left
mdc: true
fonts:
  sans: Newsreader
  serif: Fraunces
  mono: IBM Plex Mono
  fallbacks: false
css: unocss
---

<div class="kicker">The Field Guide · A Two-Hour Lecture in Ten Parts</div>

# The PostGIS Almanac

## Spatial Databases & AI-Assisted GIS <br> for Public Health Research

<div class="ornament-rule mt-6">✦ &nbsp; ✦ &nbsp; ✦</div>

<div class="text-sm opacity-70 mt-4">
2026 edition · PostGIS 3.6 · PostgreSQL 18 · GeoParquet · DuckDB · generative AI
</div>

<div class="abs-br m-6 text-xs opacity-60">
Press <kbd>→</kbd> / <kbd>Space</kbd> to advance
</div>

<div class="abs-bl m-6 text-xs opacity-60">
<a href="/" target="_self">← Interactive lecture</a>
</div>

<!--
Speaker note: This is a ~2-hour hands-on lecture for public-health researchers who
know their domain but may be newer to databases and code. Goals: (1) introduce the
value of PostGIS, (2) build real fluency through a setup lab and a running case study,
(3) demonstrate access from SQL, Python, and R, and (4) equip the audience to learn
and perform GIS work responsibly with generative AI. Budget roughly: I (5m), II (10m),
III setup (15m), IV fundamentals (25m), V connecting (15m), VI stack (10m),
VII case study (25m), VIII AI (20m), IX quiz (10m), X wrap (5m). Take a 5-min break
after Part VI.
-->

---
layout: intro
---

<div class="kicker">Table of Contents</div>

# What we'll cover

<div class="grid grid-cols-2 gap-x-10 gap-y-1 mt-6 text-base">

<div>

**I.** &nbsp; Overview, goals & how this runs

**II.** &nbsp; Why spatial databases?

**III.** &nbsp; Setup — your lab environment <span class="badge-new">Hands-on</span>

**IV.** &nbsp; PostGIS fundamentals, in depth

**V.** &nbsp; Connecting & querying (SQL / Python / R)

</div>

<div>

**VI.** &nbsp; The modern geospatial stack (2026)

**VII.** &nbsp; Case study: clinic accessibility <span class="badge-new">Hands-on</span>

**VIII.** &nbsp; Learning & doing GIS with generative AI <span class="badge-new">Hands-on</span>

**IX.** &nbsp; Pop quiz

**X.** &nbsp; Summary & resources

</div>

</div>

<div class="callout takeaway mt-5">
<strong>Overall goal:</strong> Build real, hands-on fluency with PostGIS spatial databases
for public health — set up a working lab, carry one analysis end-to-end, and learn to
do GIS with generative AI as a copilot, responsibly.
</div>

---
layout: section
---

<div class="kicker">Part I</div>

# Overview

The "where" of public health, why it needs better tools, and how today runs

---

# Welcome — and how to follow along

This is a **hands-on** lecture. It's designed for researchers who may have limited prior experience with databases or programming, but who are familiar with public-health data.

<div class="grid grid-cols-2 gap-5 mt-3">

<div>

We'll alternate **concept → demo → you try it**. Watch for these markers:

<div class="lab-box mt-2">
<div class="lab-head"><span class="lab-tag">Lab</span> Hands-on exercise</div>
When you see this box, pause and run it yourself. Solutions follow.
</div>

<div class="text-sm mt-2">
Code is labelled by track:
<span class="track sql">SQL</span>
<span class="track py">Python</span>
<span class="track r">R</span>
<span class="track duck">DuckDB</span>
<span class="track docker">Docker</span>
</div>

</div>

<div>

<div class="callout ai-tip">
<strong>📅 2026 edition:</strong> Updated for today's ecosystem — PostGIS 3.6,
PostgreSQL 18, GeoParquet, DuckDB, <code>psycopg</code> v3, GeoPandas 1.x — plus a
hands-on guide to learning and doing GIS with generative AI. New material is marked
<span class="badge-new">New</span>.
</div>

<div class="card mt-2 text-sm">
<strong>Two ways to practice:</strong> a zero-setup <strong>DuckDB</strong> track that runs on
any laptop, and a full <strong>Docker PostGIS</strong> track for the real multi-user server
experience. We'll set up both in Part III.
</div>

</div>

</div>

---

# Learning objectives

By the end of today, you should be able to:

<div class="grid grid-cols-2 gap-x-8 gap-y-1 mt-4 text-sm">

<div>

<v-clicks>

- **Explain** why spatial databases beat CSVs and shapefiles for research
- **Stand up** a working PostGIS (Docker) and DuckDB spatial environment
- **Describe** geometry types, SRIDs/CRS, geometry vs. geography
- **Create** and use a spatial index — and read `EXPLAIN ANALYZE`

</v-clicks>

</div>

<div>

<v-clicks>

- **Write** spatial SQL: `ST_DWithin`, `ST_Intersects`, spatial joins, buffers
- **Connect** from Python (`geopandas`) and R (`sf`)
- **Carry** one public-health analysis end-to-end (clinic accessibility)
- **Use** generative AI to draft, translate, and debug GIS work — and verify it

</v-clicks>

</div>

</div>

<div class="callout takeaway mt-4">
<strong>The throughline:</strong> the <em>spatial SQL</em> you learn today transfers across
PostGIS, DuckDB, and AI-assisted workflows alike. Learn it once; use it everywhere.
</div>

---

# Today's agenda & timing

<div class="grid grid-cols-2 gap-x-8 text-sm mt-3">

<div>

<div class="step"><div class="num">I</div><div><strong>Overview & goals</strong> <span class="timing">~5 min</span></div></div>
<div class="step"><div class="num">II</div><div><strong>Why spatial databases</strong> <span class="timing">~10 min</span></div></div>
<div class="step"><div class="num">III</div><div><strong>Setup — your lab</strong> <span class="timing">~15 min</span> <span class="badge-new">Hands-on</span></div></div>
<div class="step"><div class="num">IV</div><div><strong>PostGIS fundamentals (deep)</strong> <span class="timing">~25 min</span></div></div>
<div class="step"><div class="num">V</div><div><strong>Connecting & querying</strong> <span class="timing">~15 min</span></div></div>

</div>

<div>

<div class="step"><div class="num">VI</div><div><strong>Modern stack</strong> <span class="timing">~10 min</span> · then a 5-min break</div></div>
<div class="step"><div class="num">VII</div><div><strong>Case study end-to-end</strong> <span class="timing">~25 min</span> <span class="badge-new">Hands-on</span></div></div>
<div class="step"><div class="num">VIII</div><div><strong>GIS with generative AI</strong> <span class="timing">~20 min</span> <span class="badge-new">Hands-on</span></div></div>
<div class="step"><div class="num">IX</div><div><strong>Pop quiz</strong> <span class="timing">~10 min</span></div></div>
<div class="step"><div class="num">X</div><div><strong>Summary & resources</strong> <span class="timing">~5 min</span></div></div>

</div>

</div>

<div class="callout lab mt-3">
<strong>Before we go further:</strong> if you can, start the Docker download now (Part III, slide
with the <code>docker run</code> command) — it pulls in the background while we cover concepts.
</div>

---
layout: section
---

<div class="kicker">Part II</div>

# Why Spatial Databases?

Spatial context, and the limits of flat files

---

# Spatial data in public health

Spatial data links information to a specific **location on Earth**. In public health, understanding *where* health events occur, vulnerable populations live, and services sit is fundamental.

<div class="grid grid-cols-2 gap-4 mt-4">

<div>

**Examples**

- Mapping disease outbreaks (influenza spread, cancer mortality by state)
- Hospital / clinic locations — geographic accessibility
- Patient addresses (anonymized / aggregated)
- Environmental exposure sources near communities
- Demographic data by census tract or ZIP code

</div>

<div>

<div class="card">
Visualizing such data on maps reveals patterns and trends not apparent from
tables alone — enabling <strong>targeted, geographically-focused interventions</strong>.
</div>

<div class="callout takeaway mt-3">
<strong>Key takeaway:</strong> Spatial context is crucial to understanding and
addressing many public health issues.
</div>

</div>

</div>

---

# The limits of traditional storage

CSVs and shapefiles are common — but they have real limits for large, complex, or collaborative work.

<div class="grid grid-cols-2 gap-5 mt-3">

<div>

#### 📄 Challenges with CSVs

<div class="text-sm">

- **No spatial understanding** — coordinates are just numbers
- **Type ambiguity** — precision loss (ZIPs lose leading zeros)
- **Inconsistent formatting** — delimiters, special characters
- **Limited querying** — no spatial queries built in
- **Scalability** — poor with very large datasets
- **Integrity / security** — no validation or access control

</div>

</div>

<div>

#### 🗂️ Challenges with Shapefiles

<div class="text-sm">

- **File proliferation** — `.shp` `.shx` `.dbf` `.prj` together
- **Duplication / inconsistency** — many versions appear
- **Attribute limits** — 10-char fields, no true nulls, 2 GB cap
- **Limited analysis** — complex queries need external GIS
- **No concurrent access** — not built for multi-user editing

</div>

</div>

</div>

<div class="text-sm opacity-80 mt-3">
These undermine research quality, reproducibility, and collaboration. Relational
databases (PostgreSQL) and spatial extensions (PostGIS) address them.
</div>

---

# Traditional files vs. a database approach

<div class="text-sm">

| Issue | With CSVs | With Shapefiles | Impact on research |
|---|---|---|---|
| **Data integrity** | Lat/lon as text, precision loss | Field names truncated; nulls → 0 | Inaccurate analysis; can't tell missing from true zero |
| **Scalability** | Slow on 1 M address records | 2 GB cap hit on national data | Can't analyze large / high-res data efficiently |
| **Spatial querying** | Can't query "clinics within 1 km" | Needs external GIS, complex steps | Slow, error-prone spatial questions |
| **Collaboration** | Overwrite risk on shared file | Hard to merge team edits | Hinders teamwork; data loss; reproducibility issues |
| **Coordinate system** | No embedded CRS info | `.prj` can be missing / wrong | Risk of misaligned spatial analysis |

</div>

<div class="callout takeaway mt-4">
<strong>Key takeaway:</strong> Spatial databases offer a more robust, efficient, and
powerful way to manage and analyze geographic health data — overcoming critical
limits of file-based approaches.
</div>

---

# The question we'll answer all day

To make this concrete, we'll carry **one realistic analysis** through the whole lecture.

<div class="grid grid-cols-2 gap-5 mt-3">

<div>

<div class="card">
<div class="kicker">Running case study</div>
<div class="font-semibold mt-1" style="color:var(--color-green-deep)">Clinic accessibility in Riverbend County</div>
<div class="text-sm mt-2">
"How many people live within <strong>5 km</strong> of a primary-care clinic, and which
<strong>districts</strong> are underserved relative to their population?"
</div>
</div>

</div>

<div>

**Our (synthetic) data** — three tables we'll build in Part III:

<div class="text-sm">

| Table | Geometry | Key columns |
|---|---|---|
| `clinics` | Point (4326) | `clinic_id`, `name` |
| `districts` | MultiPolygon (4326) | `district_id`, `name`, `population` |
| `blocks` | Point (4326) | `block_id`, `households`, `pop` |

</div>

<div class="callout lab mt-2 text-sm">
We use <strong>synthetic</strong> data on purpose — never real patient locations in a teaching
or AI context. More on that in Part VIII.
</div>

</div>

</div>

---
layout: section
---

<div class="kicker">Part III <span class="badge-new">Hands-on</span></div>

# Setup — Your Lab Environment

Two tracks: DuckDB for everyone, Docker PostGIS for the full experience

---

# Two tracks, one set of skills

You'll get the most out of today if you can run queries yourself. Pick a track — or do both.

<div class="grid grid-cols-2 gap-5 mt-3">

<div class="card">
<div><span class="track duck">DuckDB</span> <strong>Zero-setup, local</strong></div>
<div class="text-sm mt-2">

- One binary or `pip install` — **no server**
- Runs spatial SQL inside Python/R/CLI
- Reads GeoParquet & files directly
- Perfect for labs on any laptop

</div>
<div class="text-xs opacity-70 mt-2">Best if you want to start immediately.</div>
</div>

<div class="card">
<div><span class="track docker">Docker</span> <strong>Real PostGIS server</strong></div>
<div class="text-sm mt-2">

- A genuine multi-user PostgreSQL + PostGIS
- Concurrency, roles, indexes, `EXPLAIN`
- Mirrors a production research database
- Needs Docker Desktop installed

</div>
<div class="text-xs opacity-70 mt-2">Best if you want the authentic workflow.</div>
</div>

</div>

<div class="callout takeaway mt-3">
<strong>The SQL is nearly identical.</strong> DuckDB's <code>spatial</code> extension implements the
same <code>ST_*</code> functions. Learn the query once; run it in either engine.
</div>

---

# Track A — DuckDB in 60 seconds <span class="track duck">DuckDB</span>

The fastest path to running spatial SQL. No server, no accounts.

<div class="grid grid-cols-2 gap-4 mt-2">

<div>

**Option 1 — Python** (what we'll use in labs)

```bash
pip install "duckdb>=1.1" "geopandas>=1.0"
```

```python
import duckdb
con = duckdb.connect("riverbend.duckdb")
con.sql("INSTALL spatial; LOAD spatial;")
con.sql("SELECT ST_Point(0, 0) AS p;").show()
```

</div>

<div>

**Option 2 — CLI** (great for quick checks)

```bash
# macOS / Linux
brew install duckdb        # or download the binary
duckdb riverbend.duckdb
```

```sql
INSTALL spatial; LOAD spatial;
SELECT ST_AsText(ST_Point(-117.4, 33.9));
-- POINT(-117.4 33.9)
```

</div>

</div>

<div class="callout lab mt-2">
<div class="lab-head"><span class="lab-tag">Lab 0a</span> Verify DuckDB</div>
Run either snippet. If you see a <code>POINT</code> printed, your spatial engine works. ✅
</div>

---

# Track B — Docker PostGIS in one command <span class="track docker">Docker</span>

The official image bundles PostgreSQL 18 + PostGIS 3.6. One command, a real server.

```bash
# Pull & run a PostGIS server (downloads ~600 MB the first time)
docker run -d --name almanac-pg \
  -e POSTGRES_PASSWORD=almanac \
  -e POSTGRES_DB=riverbend \
  -p 5432:5432 \
  postgis/postgis:18-3.6
```

<div class="grid grid-cols-2 gap-4 mt-1">

<div>

**Connect with `psql` (inside the container):**

```bash
docker exec -it almanac-pg \
  psql -U postgres -d riverbend
```

```sql
-- Turn on PostGIS in this database (once)
CREATE EXTENSION IF NOT EXISTS postgis;
SELECT postgis_full_version();
```

</div>

<div>

<div class="callout ai-tip text-sm">
<strong>Tip:</strong> <code>-d</code> runs it in the background. Stop/restart with
<code>docker stop almanac-pg</code> / <code>docker start almanac-pg</code>. Your data persists in
the container until you <code>docker rm</code> it.
</div>

<div class="callout caution text-sm mt-2">
<strong>Teaching only:</strong> a hard-coded password and open port are fine on your laptop —
never on a shared or internet-facing host.
</div>

</div>

</div>

---

# Lab 0 — confirm your environment <span class="track sql">SQL</span>

<div class="lab-box">
<div class="lab-head"><span class="lab-tag">Lab 0b</span> Prove PostGIS is alive</div>
Run this in <code>psql</code> (Docker) <em>or</em> the DuckDB shell. Both should return a version string and a valid point.
</div>

<div class="grid grid-cols-2 gap-4 mt-2">

<div>

<span class="track docker">Docker / PostGIS</span>

```sql
SELECT postgis_version();
-- 3.6 USE_GEOS=1 USE_PROJ=1 ...

SELECT ST_AsText(
  ST_SetSRID(ST_MakePoint(-117.4, 33.9), 4326)
);
-- POINT(-117.4 33.9)
```

</div>

<div>

<span class="track duck">DuckDB</span>

```sql
LOAD spatial;
SELECT version();        -- v1.1+

SELECT ST_AsText(
  ST_Point(-117.4, 33.9)
);
-- POINT (-117.4 33.9)
```

</div>

</div>

<div class="callout takeaway mt-2 text-sm">
<strong>Checkpoint:</strong> if both halves return a point, you're ready for everything that
follows. Stuck? Flag it now — the rest of the lecture builds on this.
</div>

---

# Loading the sample data <span class="track sql">SQL</span>

We'll generate the synthetic Riverbend tables directly in SQL, so everyone has identical data.

<div class="grid grid-cols-2 gap-4 mt-1">

<div>

**Clinics** — a handful of points

```sql
CREATE TABLE clinics (
  clinic_id int PRIMARY KEY,
  name      text,
  geom      geometry(Point, 4326)
);

INSERT INTO clinics VALUES
 (1,'Riverbend Family Health',
    ST_SetSRID(ST_MakePoint(-117.40, 33.95),4326)),
 (2,'Eastside Community Clinic',
    ST_SetSRID(ST_MakePoint(-117.31, 33.92),4326)),
 (3,'North Valley Health Center',
    ST_SetSRID(ST_MakePoint(-117.36, 34.02),4326));
```

</div>

<div>

**Blocks** — population points (generate a grid)

```sql
CREATE TABLE blocks AS
SELECT
  row_number() OVER () AS block_id,
  (50 + (random()*450))::int AS pop,
  ST_SetSRID(ST_MakePoint(
    -117.45 + gx*0.01,
     33.88 + gy*0.01), 4326) AS geom
FROM generate_series(0,18) gx,
     generate_series(0,16) gy;
```

<div class="text-xs opacity-70 mt-1">
~300 population points across the county. (DuckDB: use <code>range()</code> instead of
<code>generate_series</code> in a cross join — the AI can translate it; see Part VIII.)
</div>

</div>

</div>

<div class="callout lab mt-1 text-sm">
<div class="lab-head"><span class="lab-tag">Lab 0c</span> Create the tables</div>
Run both blocks. Then: <code>SELECT count(*) FROM blocks;</code> — expect ~323 rows.
</div>

---

# Districts, and a reusable data pack

```sql {all|1-6|8-14}
-- Districts: simple square cells acting as administrative areas
CREATE TABLE districts AS
SELECT
  d AS district_id,
  'District ' || d AS name,
  (8000 + (random()*40000))::int AS population,
  ST_SetSRID(
    ST_MakeEnvelope(                        -- xmin, ymin, xmax, ymax
      -117.45 + (d%3)*0.10,  33.88 + (d/3)*0.08,
      -117.35 + (d%3)*0.10,  33.96 + (d/3)*0.08
    ), 4326) AS geom
FROM generate_series(0,5) d;
```

<div class="grid grid-cols-2 gap-4 mt-1">

<div class="callout takeaway text-sm">
<strong>You now have three layers:</strong> <code>clinics</code> (points), <code>blocks</code>
(population points), and <code>districts</code> (polygons) — all in <strong>SRID 4326</strong>.
This is the data for our case study in Part VII.
</div>

<div class="callout ai-tip text-sm">
<strong>Prefer real files?</strong> The same tables ship as GeoParquet in the course pack.
DuckDB can read them straight from a URL or disk —
<code>SELECT * FROM 'clinics.parquet';</code> — no import step needed.
</div>

</div>

---
layout: section
---

<div class="kicker">Part IV</div>

# PostGIS Fundamentals, In Depth

Geometry, coordinate systems, geography vs. geometry, indexing, and relationships

---

# What are PostgreSQL and PostGIS?

<div class="grid grid-cols-2 gap-5 mt-2">

<div>

#### PostgreSQL

A powerful, open-source **object-relational database**. Known for reliability, data integrity, scalability, and extensibility. Free and community-supported.

#### PostGIS

An **extension** that teaches PostgreSQL to store, manage, and analyze geographic objects. It adds:

- **Spatial data types** — `geometry`, `geography`
- **Spatial indexes** — R-Tree via GiST
- **Spatial functions** — hundreds, for distance, intersection, buffers…

</div>

<div>

<div class="card">
<strong>Analogy:</strong> PostgreSQL is the filing cabinet; PostGIS adds special
folders and tools for maps inside it.
</div>

<div class="card mt-3">
<strong>Current (mid-2026):</strong> PostgreSQL <strong>18</strong> and PostGIS
<strong>3.6.x</strong>. Recent versions expand raster, vector-tile
(<code>ST_AsMVT</code>), and 3D support; modern PostgreSQL brings faster parallel
queries and better JSON. You don't need the newest version to learn — but knowing
what's current helps when reading docs and asking AI for help.
</div>

</div>

</div>

<div class="callout takeaway mt-3">
<strong>Key takeaway:</strong> PostGIS turns a very powerful database into a spatial
powerhouse for geographic information.
</div>

---

# Core concept 1 — Geometry types

PostGIS stores geographic features as specific geometry types.

<div class="grid grid-cols-3 gap-4 mt-4">

<div class="card">

### 📍 Point

A single location (X, Y).

<div class="text-xs mt-2 opacity-80">
<strong>PH examples:</strong> patient residence, clinic location, disease case site,
water sample point.
</div>

</div>

<div class="card">

### 〰️ LineString

Connected sequence of points.

<div class="text-xs mt-2 opacity-80">
<strong>PH examples:</strong> roads, rivers, transit routes, disease-vector paths.
</div>

</div>

<div class="card">

### 🏞️ Polygon

A closed area.

<div class="text-xs mt-2 opacity-80">
<strong>PH examples:</strong> county / state boundaries, service areas, exposure
zones, park boundaries.
</div>

</div>

</div>

<div class="text-sm opacity-80 mt-4">
PostGIS also supports <strong>Multi-geometries</strong> (MultiPoint, MultiLineString,
MultiPolygon) — collections of the same type — and <strong>GeometryCollections</strong>.
</div>

---

# How geometries are written — WKT & WKB

Every geometry has a human-readable and a binary form. You'll see both constantly.

<div class="grid grid-cols-2 gap-5 mt-2">

<div>

**WKT** — *Well-Known Text* (readable)

```sql
POINT(-117.4 33.9)
LINESTRING(0 0, 1 1, 2 1)
POLYGON((0 0, 4 0, 4 4, 0 4, 0 0))
```

**Constructing & inspecting**

```sql
SELECT ST_AsText(            -- geometry → WKT
  ST_GeomFromText('POINT(-117.4 33.9)', 4326)
);
SELECT ST_AsGeoJSON(geom)    -- → GeoJSON for web maps
FROM clinics LIMIT 1;
```

</div>

<div>

<div class="card text-sm">
<strong>WKB</strong> (<em>Well-Known Binary</em>) is the compact form actually stored on disk.
You rarely write it by hand — functions convert for you.
</div>

<div class="callout ai-tip text-sm mt-2">
<strong>Constructor cheat-sheet:</strong><br>
<code>ST_MakePoint(x, y)</code> — fast point<br>
<code>ST_SetSRID(geom, 4326)</code> — stamp a CRS<br>
<code>ST_GeomFromText(wkt, srid)</code> — from WKT<br>
<code>ST_AsText / ST_AsGeoJSON</code> — read it back
</div>

</div>

</div>

<div class="callout caution mt-2 text-sm">
<strong>Order matters:</strong> WKT and <code>ST_MakePoint</code> are <strong>(longitude, latitude)</strong> —
X then Y. Reversing them silently puts your data in the wrong hemisphere.
</div>

---

# Core concept 2 — Spatial reference systems (SRID)

An **SRS / CRS** defines how coordinate values map to real locations — the "language" or projection your data speaks.

<div class="grid grid-cols-2 gap-5 mt-2">

<div class="text-sm">

- **Crucial for** aligning layers and meaningful measurements (distance, area)
- **SRID** — a unique integer ID per SRS (stored in `spatial_ref_sys`)
- **WGS84 (EPSG:4326)** — geographic lat/lon in degrees; used by GPS
- **Projected (UTM, State Plane)** — flatten Earth to a plane (meters/feet); better for local distance & area
- **Rule:** every geometry must have a defined SRID; layers must share one (or be transformed with `ST_Transform()`)

</div>

<div>

<div class="card text-sm">
<div class="text-center font-semibold mb-2">SRID alignment</div>

<div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
<div>
<div style="color:var(--color-brick)">Layer A · SRID X</div>
<div style="color:var(--color-blue)">Layer B · SRID Y</div>
<div class="mt-1"><strong>Misaligned 🚫</strong></div>
</div>
<div class="text-xl">➡️</div>
<div>
<div style="color:var(--color-green-deep)">Both → SRID Z</div>
<div class="mt-1"><strong>Aligned ✅</strong></div>
</div>
</div>

</div>

<div class="text-xs opacity-70 text-center mt-1">
Layers with different SRIDs won't overlay unless transformed to a common system.
</div>

</div>

</div>

---

# The classic trap — degrees are not meters

Distance on lat/lon (SRID 4326) is measured in **degrees**, which is almost never what you want.

<div class="grid grid-cols-2 gap-5 mt-2">

<div>

```sql
-- WRONG: "0.045" — that's degrees, meaningless
SELECT ST_Distance(
  ST_SetSRID(ST_MakePoint(-117.40,33.95),4326),
  ST_SetSRID(ST_MakePoint(-117.36,34.02),4326)
);

-- RIGHT (option 1): transform to a metric CRS
SELECT ST_Distance(
  ST_Transform(a.geom, 32611),   -- UTM 11N, meters
  ST_Transform(b.geom, 32611)
) FROM clinics a, clinics b
WHERE a.clinic_id=1 AND b.clinic_id=3;
-- ≈ 8100  (meters)
```

</div>

<div>

```sql
-- RIGHT (option 2): cast to geography (meters on a sphere)
SELECT ST_Distance(
  a.geom::geography,
  b.geom::geography
) FROM clinics a, clinics b
WHERE a.clinic_id=1 AND b.clinic_id=3;
-- ≈ 8120  (meters)
```

<div class="callout caution text-sm mt-2">
<strong>If a distance looks like 0.0x</strong>, you're in degrees. Transform to a projected
CRS (e.g. the right UTM zone) or cast to <code>geography</code>.
</div>

</div>

</div>

---

# geometry vs. geography — which to use

PostGIS offers two spatial types. Choosing well saves you from the degrees-vs-meters trap.

<div class="grid grid-cols-2 gap-5 mt-2">

<div class="card">

#### `geometry` — Cartesian (flat)

<div class="text-sm">

- Math on a **flat plane** — fast
- Units are the CRS's units (degrees for 4326, meters for UTM)
- Hundreds of functions; the default for analysis
- **Best when** your data is in a projected CRS, or covers a small area

</div>

</div>

<div class="card">

#### `geography` — geodetic (round Earth)

<div class="text-sm">

- Math on the **spheroid** — distances/areas in **meters**, always
- Correct over long distances & across UTM zones
- Fewer functions, somewhat slower
- **Best when** data spans large areas in lat/lon and you want true meters

</div>

</div>

</div>

<div class="callout takeaway mt-3">
<strong>Rule of thumb:</strong> national or continental lat/lon data and you want meters →
<code>geography</code>. Local analysis or you've projected to UTM/State Plane →
<code>geometry</code>. You can cast between them: <code>geom::geography</code>.
</div>

---

# Core concept 3 — Spatial indexes

Like a book's index — but for **locations**. They dramatically speed up spatial queries ("what's near X?", "what's inside Y?").

<v-clicks>

- **Analogy:** a GPS that lets the database rapidly find spatial data
- **How (simplified):** PostGIS builds a **GiST** index over each geometry's **bounding box** (an R-Tree), so the planner skips most rows
- **Two-phase search:** a fast *index filter* on bounding boxes, then an *exact* check on the survivors

</v-clicks>

<div v-click>

```sql
-- Build a spatial index (do this on every geometry column you query)
CREATE INDEX blocks_geom_idx ON blocks USING GIST (geom);
ANALYZE blocks;            -- refresh planner statistics
```

</div>

<div v-click class="callout takeaway mt-2">
<strong>Functions that use the index automatically:</strong> <code>ST_DWithin</code>,
<code>ST_Intersects</code>, <code>ST_Contains</code>, <code>&&</code> — because they begin with a
bounding-box test. <code>ST_Distance</code> alone does <em>not</em>; prefer <code>ST_DWithin</code> for proximity.
</div>

---

# Proving the index works — `EXPLAIN ANALYZE`

The planner tells you whether it used your index. Reading this is a core skill.

<div class="grid grid-cols-2 gap-4 mt-1">

<div>

```sql
EXPLAIN ANALYZE
SELECT b.block_id
FROM blocks b, clinics c
WHERE c.clinic_id = 1
  AND ST_DWithin(
        b.geom::geography,
        c.geom::geography, 5000);
```

</div>

<div class="text-sm">

What to look for:

- ✅ **`Index Scan using blocks_geom_idx`** — good, the index is used
- ⚠️ **`Seq Scan`** on a big table — the index was skipped (missing index, wrong type, or a function wrapping the column)
- **`actual time=`** — real milliseconds; compare before/after adding the index
- **`rows=`** — estimate vs. actual; large gaps mean stale stats → run `ANALYZE`

</div>

</div>

<div class="callout lab mt-2 text-sm">
<div class="lab-head"><span class="lab-tag">Lab 1</span> Index & explain</div>
Create <code>blocks_geom_idx</code>, run the <code>EXPLAIN ANALYZE</code> above, and note the time.
Drop the index, re-run, and compare. (DuckDB users: skip — it auto-indexes; focus on the query.)
</div>

---

# Spatial relationships — the vocabulary

Most spatial questions reduce to a handful of relationship predicates. They return `true`/`false`.

<div class="grid grid-cols-2 gap-5 mt-2">

<div class="text-sm">

| Function | Asks… |
|---|---|
| `ST_Intersects(a,b)` | do they touch/overlap at all? |
| `ST_Contains(a,b)` | is **b** fully inside **a**? |
| `ST_Within(a,b)` | is **a** fully inside **b**? |
| `ST_DWithin(a,b,d)` | are they within distance **d**? |
| `ST_Touches(a,b)` | do they share only a boundary? |
| `ST_Crosses(a,b)` | does a line cross a polygon? |

</div>

<div>

<div class="card text-sm">
Under the hood these implement the <strong>DE-9IM</strong> model — a 3×3 matrix describing how two
geometries' interiors, boundaries, and exteriors relate. You rarely write DE-9IM directly,
but it's why the named predicates are precise and composable.
</div>

<div class="callout ai-tip text-sm mt-2">
<strong>Measurement companions:</strong> <code>ST_Distance</code>, <code>ST_Length</code>,
<code>ST_Area</code>, <code>ST_Buffer</code>, <code>ST_Intersection</code>, <code>ST_Union</code>,
<code>ST_Centroid</code>.
</div>

</div>

</div>

---

# The workhorse — spatial joins

A **spatial join** connects two tables by a spatial relationship instead of a shared key. This is where PostGIS earns its keep.

<div class="grid grid-cols-2 gap-4 mt-1">

<div>

```sql
-- Count population points inside each district
SELECT d.name,
       count(b.*)      AS n_blocks,
       sum(b.pop)      AS people
FROM districts d
JOIN blocks b
  ON ST_Contains(d.geom, b.geom)   -- the join!
GROUP BY d.name
ORDER BY people DESC;
```

</div>

<div class="text-sm">

How it works:

- The `ON` clause uses a **spatial predicate**, not `a.id = b.id`
- The planner uses the GiST index to avoid comparing every pair
- `JOIN` keeps matches; `LEFT JOIN` keeps districts with **zero** points too (watch for those!)

<div class="callout takeaway mt-2">
<strong>Pattern to memorize:</strong> <em>points-in-polygons</em> via
<code>JOIN … ON ST_Contains(poly, pt)</code> + <code>GROUP BY</code>. It answers a huge share of
public-health questions.
</div>

</div>

</div>

---

# Part IV — key takeaway

<div class="callout takeaway text-base">
<strong>PostGIS stores shapes (geometries) with a real-world coordinate system (SRID),</strong>
lets you choose <code>geometry</code> (flat, fast) or <code>geography</code> (true meters), uses
<strong>GiST spatial indexes</strong> to stay fast, and answers questions through
<strong>relationship predicates and spatial joins</strong>.
<br><br>
Watch the two classic traps: <strong>degrees vs. meters</strong>, and <strong>queries that
skip the index</strong> (<code>EXPLAIN ANALYZE</code> is your friend).
</div>

---
layout: section
---

<div class="kicker">Part V</div>

# Connecting & Querying

Reaching PostGIS from SQL, Python, and R

---

# General connection principles

To reach any database, you need five standard parameters:

<div class="grid grid-cols-2 gap-5 mt-3">

<div>

| Parameter | Meaning |
|---|---|
| **Host** | Server address (`localhost`, IP, domain) |
| **Port** | Endpoint — PostgreSQL default `5432` |
| **Database** | The specific db to connect to |
| **Username** | Your database user |
| **Password** | Password for that user |

</div>

<div>

<div class="card">
For demos and AI work, use a <strong>read-only account</strong> to prevent accidental
modification of data.
</div>

<div class="callout takeaway mt-3">
<strong>Key takeaway:</strong> These five pieces of information are the standard keys
to unlock almost any database. For our Docker server: host <code>localhost</code>, port
<code>5432</code>, db <code>riverbend</code>, user <code>postgres</code>, password <code>almanac</code>.
</div>

</div>

</div>

---

# A deeper note on SQL <span class="track sql">SQL</span>

PostGIS *is* SQL — the same `SELECT … FROM … WHERE … GROUP BY` you may know, plus spatial functions in the mix.

<div class="grid grid-cols-2 gap-4 mt-2">

<div>

```sql
SELECT                       -- columns / computed values
  d.name,
  count(b.*)        AS n,
  sum(b.pop)        AS people
FROM districts d             -- a table
JOIN blocks b                -- joined to another…
  ON ST_Contains(d.geom, b.geom)  -- …spatially
WHERE d.population > 10000   -- filter rows
GROUP BY d.name              -- aggregate
HAVING sum(b.pop) > 0        -- filter groups
ORDER BY people DESC         -- sort
LIMIT 10;                    -- cap output
```

</div>

<div>

<div class="card text-sm">
Spatial functions slot in <strong>anywhere an expression is allowed</strong> — in
<code>SELECT</code>, <code>WHERE</code>, <code>JOIN ... ON</code>, even <code>ORDER BY</code>.
</div>

<div class="card text-sm mt-2">

```sql
ST_Distance(a, b)    -- distance
ST_DWithin(a, b, d)  -- within d?
ST_Intersects(a, b)  -- overlap?
ST_Contains(a, b)    -- b inside a?
ST_Buffer(g, d)      -- grow a zone
```

</div>

<div class="text-xs opacity-75 mt-1">
Doing spatial work <strong>in the database</strong> means the server filters before sending data
to R/Python — often far faster.
</div>

</div>

</div>

---

# Connecting from Python — `geopandas` + `psycopg` v3 <span class="track py">Python</span>

```python {all|2-4|6-9|11-14|16|18}
# pip install "geopandas>=1.0" "psycopg[binary]" "sqlalchemy>=2" geoalchemy2
# Note (2026): psycopg v3 is current; psycopg2 is legacy / maintenance-only.
import geopandas as gpd
from sqlalchemy import create_engine

# Build a SQLAlchemy engine — "+psycopg" selects the v3 driver
user, pw = "postgres", "almanac"
host, port, db = "localhost", 5432, "riverbend"
engine = create_engine(f"postgresql+psycopg://{user}:{pw}@{host}:{port}/{db}")

# Read a spatial query straight into a GeoDataFrame
sql = """SELECT clinic_id, name, geom
         FROM clinics;"""
gdf = gpd.read_postgis(sql, engine, geom_col="geom")

print(gdf.head())              # gdf.explore()  -> interactive Leaflet map

engine.dispose()               # good practice in longer scripts
```

<div class="callout takeaway mt-2">
<strong>Key takeaway:</strong> with <code>geopandas</code> + SQLAlchemy, Python works with PostGIS
intuitively — especially if you know <code>pandas</code>. The result is a real GeoDataFrame you can map.
</div>

---

# Same skills, no server — DuckDB from Python <span class="track duck">DuckDB</span> <span class="track py">Python</span>

The identical analysis, running in-process over your local tables or files.

```python {all|3-5|7-12|14-15}
import duckdb, geopandas as gpd

con = duckdb.connect("riverbend.duckdb")
con.sql("LOAD spatial;")

# The SAME spatial SQL you'd run in PostGIS
df = con.sql("""
  SELECT d.name, sum(b.pop) AS people
  FROM districts d
  JOIN blocks b ON ST_Contains(d.geom, b.geom)
  GROUP BY d.name ORDER BY people DESC
""").df()

# Read big open data with zero import:
con.sql("SELECT count(*) FROM 'overture_places.parquet'")
```

<div class="callout takeaway mt-2 text-sm">
<strong>Notice:</strong> the <code>ST_Contains</code> spatial join is byte-for-byte the same as the
PostGIS version. <em>That's the payoff of learning spatial SQL once.</em>
</div>

---

# Supplement — connecting from R <span class="track r">R</span>

For R users, `sf` + `DBI` + `RPostgres` mirror the Python workflow exactly.

```r {all|2-4|6-11|13-15|18}
# install.packages(c("sf","DBI","RPostgres"))   # once
library(sf); library(DBI); library(RPostgres)

con <- dbConnect(RPostgres::Postgres(),
                 dbname   = "riverbend",
                 host     = "localhost",
                 port     = 5432,
                 user     = "postgres",
                 password = "almanac")

clinics <- st_read(con, query = "SELECT clinic_id, name, geom FROM clinics;")

print(clinics)            # plot(st_geometry(clinics))
dbDisconnect(con)         # always close
```

<div class="callout ai-tip mt-2 text-sm">
<strong>One mental model, three dialects:</strong> SQL is the engine; <code>geopandas</code> and
<code>sf</code> are thin, friendly wrappers. Pick the language you know — the spatial SQL is shared.
</div>

---

# Lab 2 — connect & run a spatial join <span class="track py">Python</span> <span class="track sql">SQL</span>

<div class="lab-box">
<div class="lab-head"><span class="lab-tag">Lab 2</span> Your first end-to-end query</div>

1. Connect from Python (PostGIS engine <em>or</em> DuckDB connection).
2. Run the population-per-district spatial join.
3. Print the busiest district. Bonus: <code>gdf.explore()</code> to see it on a map.

</div>

```python
# Works against either engine — just change how you read:
sql = """SELECT d.name, sum(b.pop) AS people
         FROM districts d
         JOIN blocks b ON ST_Contains(d.geom, b.geom)
         GROUP BY d.name ORDER BY people DESC"""

# PostGIS:  df = gpd.read_postgis(sql.replace(' geom',''), engine)  # no geom needed here
# DuckDB :  df = con.sql(sql).df()
print(df.head(1))     # -> the most-populated district
```

<div class="callout takeaway mt-1 text-sm">
<strong>Checkpoint:</strong> you've now connected, run a spatial join, and pulled results into a
dataframe — the core loop of every analysis to come.
</div>

---
layout: section
---

<div class="kicker">Part VI <span class="badge-new">New</span></div>

# The Modern Geospatial Stack

2026: think in terms of a stack, not a single tool

---

# PostGIS is no longer the only place for spatial SQL

A major shift: you can now run powerful spatial SQL **without a database server at all**.

<div class="grid grid-cols-2 gap-5 mt-2">

<div>

The biggest example is **DuckDB** with its `spatial` extension — an in-process analytical engine ("SQLite for analytics") that speaks much of the same `ST_*` SQL you learn for PostGIS.

<div class="text-sm mt-2">

- **No server** to install or manage — runs inside R, Python, or the CLI
- Reads / writes **GeoParquet**, GeoJSON, shapefiles; queries files on disk or in cloud storage (S3/GCS/Azure) directly
- Extremely fast over tens-to-hundreds of millions of features on a laptop

</div>

</div>

<div>

<div class="card text-sm">
<strong>Reach for DuckDB:</strong> ad-hoc analysis, one-off transforms, reading big
open-data files, reproducible notebook pipelines.
</div>

<div class="card mt-2 text-sm">
<strong>PostGIS is still better for:</strong> a shared, central, multi-user database;
enforced integrity; transactional editing; a long-lived authoritative dataset.
</div>

<div class="text-xs opacity-75 mt-2">
You can use them together — <code>pg_duckdb</code> and DuckDB's <code>postgres</code>
extension let DuckDB query a live PostGIS database.
</div>

</div>

</div>

---

# PostGIS vs. DuckDB — opposite by design <span class="badge-new">New</span>

Both speak `ST_*` SQL, so they look interchangeable. They aren't — they're **architecturally opposite tools** that happen to share a query language.

<div class="grid grid-cols-2 gap-5 mt-3">

<div class="card">
<div><span class="track docker">PostGIS</span> <strong>A spatial system of record</strong></div>
<div class="text-sm mt-2">

- **Client–server** — one long-running DB many people connect to
- **Row-oriented + MVCC** — concurrent reads *and* writes, live editing
- **Durable & governed** — roles, constraints, backups, one source of truth
- **Deepest toolbox** — geography, raster, topology, `ST_AsMVT`

</div>
<div class="text-xs opacity-70 mt-2">Shines when data is shared, edited, long-lived.</div>
</div>

<div class="card">
<div><span class="track duck">DuckDB</span> <strong>A spatial analytics engine</strong></div>
<div class="text-sm mt-2">

- **In-process** — a library inside Python/R/CLI; "SQLite for analytics"
- **Columnar + vectorized** — tears through scans, aggregations, joins
- **Files-first** — queries GeoParquet/CSV in place, often no import
- **Lean** — `pip install`, auto-builds spatial indexes at query time

</div>
<div class="text-xs opacity-70 mt-2">Shines for ad-hoc, single-analyst, big-file work.</div>
</div>

</div>

<div class="callout takeaway mt-3 text-sm">
<strong>One-liner:</strong> PostGIS is a <em>database you connect to</em>; DuckDB is a <em>library you run inside your script</em>.
</div>

---

# At a glance — same language, opposite engines

<div class="text-sm">

| Dimension | <span class="track docker">PostGIS</span> | <span class="track duck">DuckDB + spatial</span> |
|---|---|---|
| **Architecture** | Client–server; persistent process | Embedded, in-process (like SQLite) |
| **Sweet spot** | Transactional (OLTP) + many users | Analytical (OLAP) scans & joins |
| **Storage** | Row-oriented heap | Columnar, vectorized |
| **Concurrency** | Many readers *and* writers (MVCC) | One process; great parallel reads |
| **Getting data in** | Load into tables first | Query files in place — no import |
| **Spatial index** | Persistent GiST you `CREATE INDEX` | R-Tree built automatically |
| **`geography` type** | Yes — true geodetic metres | No — project or use sphere helpers |
| **Functions** | Hundreds; raster, topology, tiles | Growing GEOS-backed subset |
| **Setup** | Run a server / Docker | `pip install duckdb` |
| **Role** | Durable, shared source of truth | Fast analytical scratchpad / ETL |

</div>

---

# Same SQL — watch the dialect edges <span class="track sql">SQL</span>

The core predicates are identical. The differences are at the edges: point construction, the `geography` type, and how you generate rows.

<div class="grid grid-cols-2 gap-4 mt-1">

<div>

<span class="track docker">PostGIS</span>

```sql
-- Stamp an SRID on a point
ST_SetSRID(ST_MakePoint(-117.4,33.9),4326)

-- True metres via geography
ST_DWithin(a.geom::geography,
           b.geom::geography, 5000)

-- Generate rows
FROM generate_series(0,18) gx,
     generate_series(0,16) gy

-- Persistent index (you make it)
CREATE INDEX ON blocks USING GIST(geom);
```

</div>

<div>

<span class="track duck">DuckDB</span>

```sql
-- (x, y) directly
ST_Point(-117.4, 33.9)

-- No geography: project to metres…
ST_DWithin(ST_Transform(a.geom,
  'EPSG:4326','EPSG:32611'), …, 5000)
-- …or ST_Distance_Sphere(a, b)

-- range() in a cross join
FROM range(0,19) t(gx),
     range(0,17) u(gy)

-- No index needed; read files too:
SELECT * FROM 'blocks.parquet';
```

</div>

</div>

<div class="callout caution mt-2 text-sm">
<strong>The two gotchas:</strong> (1) DuckDB has <em>no <code>geography</code> type</em> — for metres, <code>ST_Transform</code> to a UTM CRS or use <code>ST_Distance_Sphere</code>; a bare lon/lat distance is in degrees. (2) <code>generate_series</code> as a row source differs — use <code>range()</code>.
</div>

---

# When to use which — and using both

<div class="grid grid-cols-2 gap-5 mt-2">

<div>

<div class="card text-sm">
<strong>Reach for <span class="track docker">PostGIS</span> when:</strong>

- Many analysts share one authoritative dataset
- You need concurrent edits, integrity, roles
- It backs an app, API, or live web map
- The dataset is long-lived and governed

</div>

<div class="card text-sm mt-2">
<strong>Reach for <span class="track duck">DuckDB</span> when:</strong>

- One analyst, one laptop, big files
- Ad-hoc analysis or a notebook pipeline
- Reading GeoParquet / cloud data directly
- Speed of setup matters more than sharing

</div>

</div>

<div>

<div class="callout ai-tip text-sm">
<strong>Better together — the common 2026 pattern:</strong> use DuckDB for the heavy lifting (scan a 50-million-row GeoParquet file, filter and aggregate to a tidy result), then write that result <em>into</em> PostGIS as the shared, governed table everyone queries and maps.
</div>

<div class="callout takeaway text-sm mt-2">
With <code>pg_duckdb</code> or DuckDB's <code>postgres</code> extension, each can even reach into the other <strong>live</strong> — no export step.
</div>

</div>

</div>

---

# Cloud-native geospatial formats

The "shapefile era" is fading. Modern formats are built for the cloud, for big data, and for streaming only the bytes you need.

<div class="grid grid-cols-2 gap-4 mt-4">

<div class="card">

#### 📦 GeoParquet
Columnar, compressed vector format — fast, tiny, the emerging standard for sharing large vector datasets. Read by GeoPandas, DuckDB, QGIS. A modern replacement for shapefiles / CSV exports.

</div>

<div class="card">

#### 🗺️ PMTiles & vector tiles
A single-file format for serving interactive maps cheaply (even from static hosting). PostGIS generates vector tiles directly with `ST_AsMVT`.

</div>

<div class="card">

#### 🛰️ COG & STAC (raster)
Cloud-Optimized GeoTIFFs stream just the pixels you need from imagery; STAC is the catalog standard for finding it — relevant for environmental-exposure work.

</div>

<div class="card">

#### 🌐 Overture Maps
A large, openly-licensed dataset (places, buildings, transport, admin areas) distributed as GeoParquet — free context for health analyses.

</div>

</div>

---

# Indexing beyond R-Trees, and choosing a tool

<div class="grid grid-cols-2 gap-5">

<div>

#### H3 — discrete global grids

Hexagonal-cell grid systems like **H3** are popular for aggregating and joining point data at scale. The `h3-pg` extension brings H3 into PostGIS — handy for **privacy-preserving aggregation** of patient locations into uniform cells.

</div>

<div class="text-sm">

| Your situation | Default tool |
|---|---|
| Shared, authoritative, many analysts | **PostGIS** |
| Ad-hoc analysis of big files on a laptop | **DuckDB + spatial** |
| Interactive dataframe workflow | **GeoPandas / sf** |
| Sharing / archiving a dataset | **GeoParquet** |
| Publishing an interactive web map | **PMTiles / ST_AsMVT** |

</div>

</div>

<div class="callout takeaway mt-4">
<strong>Key takeaway:</strong> Think in terms of a <em>stack</em>. PostGIS is your durable,
shared database; DuckDB + GeoParquet make ad-hoc and cloud analysis fast and cheap;
GeoPandas / sf remain your interactive home. The spatial SQL you learn transfers across all of it.
</div>

<div class="callout lab mt-2 text-sm">
<strong>☕ 5-minute break.</strong> When we return: we build the full clinic-accessibility analysis
end-to-end on your data.
</div>

---
layout: section
---

<div class="kicker">Part VII <span class="badge-new">Hands-on</span></div>

# Case Study — Clinic Accessibility

One question, carried end-to-end on your own database

---

# The analysis, start to finish

We'll answer our running question in **five steps**, each a short lab. By the end you'll have a reusable accessibility pipeline.

<div class="grid grid-cols-2 gap-x-8 text-sm mt-2">

<div>

<div class="step"><div class="num">1</div><div><strong>Inventory & sanity-check</strong> the data — counts, SRIDs, validity</div></div>
<div class="step"><div class="num">2</div><div><strong>Proximity</strong> — population within 5 km of any clinic</div></div>
<div class="step"><div class="num">3</div><div><strong>Service areas</strong> — buffers and what they cover</div></div>

</div>

<div>

<div class="step"><div class="num">4</div><div><strong>Aggregate by district</strong> — access rate per population</div></div>
<div class="step"><div class="num">5</div><div><strong>Validate</strong> — sanity checks before we trust it</div></div>

</div>

</div>

<div class="callout takeaway mt-3">
<strong>Question:</strong> "How many people live within 5 km of a clinic, and which districts are
underserved relative to population?" Every step is runnable in PostGIS <em>or</em> DuckDB.
</div>

---

# Step 1 — inventory & sanity-check <span class="track sql">SQL</span>

Before any analysis: confirm what you have. Counts, coordinate systems, and validity.

<div class="grid grid-cols-2 gap-4 mt-1">

<div>

```sql
-- How much data, and what SRID?
SELECT 'clinics' t, count(*), ST_SRID(geom) FROM clinics GROUP BY 3
UNION ALL
SELECT 'blocks', count(*), ST_SRID(geom) FROM blocks GROUP BY 3
UNION ALL
SELECT 'districts', count(*), ST_SRID(geom) FROM districts GROUP BY 3;

-- Any invalid polygons? (real data often has them)
SELECT district_id
FROM districts
WHERE NOT ST_IsValid(geom);
```

</div>

<div class="text-sm">

What we're checking:

- **All three layers share SRID 4326** → they'll align without transforming
- **Row counts** match what we loaded (~3 / ~323 / 6)
- **No invalid geometries** — if any, fix with `ST_MakeValid(geom)`

<div class="callout lab mt-2">
<div class="lab-head"><span class="lab-tag">Lab 3.1</span></div>
Run both queries. Confirm matching SRIDs and zero invalid rows before continuing.
</div>

</div>

</div>

---

# Step 2 — population within 5 km of a clinic <span class="track sql">SQL</span>

The core accessibility measure: which population points are "served"?

```sql {all|2-4|6-9}
-- Mark each block as served / unserved, using true meters via geography
SELECT
  sum(pop)                                   AS total_pop,
  sum(pop) FILTER (WHERE served)             AS served_pop,
  round(100.0 * sum(pop) FILTER (WHERE served) / sum(pop), 1) AS pct_served
FROM (
  SELECT b.pop,
         EXISTS (
           SELECT 1 FROM clinics c
           WHERE ST_DWithin(b.geom::geography, c.geom::geography, 5000)
         ) AS served
  FROM blocks b
) s;
```

<div class="grid grid-cols-2 gap-4 mt-1">

<div class="callout takeaway text-sm">
<strong>Why <code>ST_DWithin</code> + <code>::geography</code>:</strong> it uses the spatial index
<em>and</em> measures real meters — both traps from Part IV, avoided in one line.
</div>

<div class="callout lab text-sm">
<div class="lab-head"><span class="lab-tag">Lab 3.2</span></div>
Run it. What % of the county is within 5 km of a clinic? Try 3 km and 10 km — how sensitive is access to the threshold?
</div>

</div>

---

# Step 3 — service areas as buffers <span class="track sql">SQL</span>

Sometimes you want the **zone** itself — to map it, or intersect it with other layers.

<div class="grid grid-cols-2 gap-4 mt-1">

<div>

```sql
-- A 5 km service area around each clinic
SELECT clinic_id,
       ST_Buffer(geom::geography, 5000)::geometry AS svc
FROM clinics;

-- Union them into one combined coverage polygon
SELECT ST_Union(
         ST_Buffer(geom::geography, 5000)::geometry
       ) AS coverage
FROM clinics;
```

</div>

<div class="text-sm">

- `ST_Buffer` on `geography` grows a true-meter zone
- `ST_Union` dissolves overlapping buffers into one coverage shape
- Export `coverage` as GeoJSON to drop onto a web map, or intersect it with districts (next step)

<div class="callout caution mt-2">
<strong>Buffers are approximations</strong> of circles (segmented polygons) and ignore roads/terrain.
For travel-time access you'd use a routing service — note the assumption.
</div>

</div>

</div>

---

# Step 4 — access rate by district <span class="track sql">SQL</span>

Now the decision-relevant output: a **rate per district**, so we compare fairly across populations.

```sql {all|6-9|11-13}
SELECT
  d.name,
  d.population,
  sum(b.pop)                                   AS pop_in_blocks,
  sum(b.pop) FILTER (WHERE served)             AS served_pop,
  round(100.0 * sum(b.pop) FILTER (WHERE served)
        / nullif(sum(b.pop),0), 1)             AS pct_served
FROM districts d
JOIN blocks b ON ST_Contains(d.geom, b.geom)        -- points-in-polygons
CROSS JOIN LATERAL (
  SELECT EXISTS (SELECT 1 FROM clinics c
    WHERE ST_DWithin(b.geom::geography, c.geom::geography, 5000)) AS served
) x
GROUP BY d.name, d.population
ORDER BY pct_served ASC;          -- worst-served first
```

<div class="callout lab mt-1 text-sm">
<div class="lab-head"><span class="lab-tag">Lab 3.3</span></div>
Run it. Which two districts are <strong>least</strong> served? Those are where you'd target a new clinic.
</div>

---

# Step 5 — validate before you trust it <span class="track sql">SQL</span>

A number is not an answer until you've checked it. Build the habit now.

<div class="grid grid-cols-2 gap-5 mt-2">

<div class="text-sm">

**Cross-checks:**

- **Totals reconcile** — does `sum(served) ≤ total_pop`? Does district pop roughly match `population`?
- **Spot a known case** — pick one block next to a clinic; is it flagged served?
- **Boundary effects** — blocks near the county edge may have clinics *just outside* your data → undercount
- **Units** — distances in meters? `geography` confirms it
- **Sensitivity** — does the ranking hold at 3 km vs 5 km?

</div>

<div>

```sql
-- One block you can reason about by hand
SELECT b.block_id,
  ST_Distance(b.geom::geography,
              c.geom::geography)::int AS m
FROM blocks b
JOIN clinics c ON c.clinic_id = 1
ORDER BY m
LIMIT 3;       -- nearest blocks to clinic 1
```

<div class="callout takeaway mt-2 text-sm">
<strong>Validation is the analyst's job</strong> — not the database's, and certainly not the AI's.
</div>

</div>

</div>

---

# Extending the pattern — two more public-health questions

The same building blocks answer many questions. Notice the recurring verbs: *contain, within-distance, buffer, intersect, aggregate.*

<div class="grid grid-cols-2 gap-5 mt-2">

<div class="card">

#### 🦠 Disease surveillance & clusters
Cases (points) in districts (polygons), normalized by population.

```sql
SELECT d.name, count(c.*) AS cases
FROM districts d
JOIN cases c ON ST_Contains(d.geom,c.geom)
GROUP BY d.name;     -- ÷ population → rate
```

</div>

<div class="card">

#### 🏭 Environmental exposure
Who lives inside a pollutant buffer?

```sql
SELECT sum(b.pop) AS exposed
FROM blocks b, sources s
WHERE ST_DWithin(
  b.geom::geography,
  s.geom::geography, 2000);   -- 2 km
```

</div>

</div>

<div class="callout takeaway mt-3">
<strong>Key takeaway:</strong> PostGIS answers sophisticated spatial questions efficiently —
and once you know the handful of core predicates, new questions are recombinations of the same moves.
</div>

---
layout: section
---

<div class="kicker">Part VIII <span class="badge-new">Hands-on</span></div>

# Learning & Doing GIS with Generative AI 🤖

A tutor, translator, debugger, and copilot — used responsibly

---

# The mindset, and four ways AI helps

<div class="callout ai-tip">
<strong>Mindset:</strong> treat the AI as a tireless, fast, occasionally-overconfident
teaching assistant and pair-programmer — <em>not</em> an oracle. It excels at drafting,
explaining, and translating. <em>You</em> remain the analyst responsible for correctness,
ethics, and interpretation.
</div>

<div class="grid grid-cols-2 gap-4 mt-3">

<div class="card text-sm">

#### 1. Tutor & explainer 📖
Explains concepts at your level with public-health examples — SRIDs, geometry vs. geography, spatial joins, "why is my distance in degrees?".

</div>

<div class="card text-sm">

#### 2. Code generator & translator 🔁
Turns plain English into spatial SQL, or translates the same analysis between SQL, R (`sf`), and Python (`geopandas`).

</div>

<div class="card text-sm">

#### 3. Debugger & reviewer 🐞
Paste an error and your query; ask what's wrong, how to fix it, and whether it's using the spatial index.

</div>

<div class="card text-sm">

#### 4. Analysis copilot 🚀
Plans a whole analysis — what data, which functions, how to validate. Coding agents can even run code and iterate with you.

</div>

</div>

---

# How to write a good GIS prompt

The answer's quality depends heavily on the context you give. A reliable recipe:

<div class="grid grid-cols-2 gap-5 mt-3">

<div class="text-sm">

- **Role & level** — "You are a PostGIS expert helping a public-health researcher new to SQL."
- **Environment** — tool & version ("PostGIS 3.6, PostgreSQL 18"); language (SQL / R `sf` / Python `geopandas`)
- **The data** — table names, key columns, geometry column & type, and the **SRID** of each layer
- **The goal** — the precise question and the **units** you want (meters? rate per 1,000?)
- **The ask** — "explain each step", "use a spatial index", "keep it to one query"

</div>

<div>

<div class="prompt-box">
<span class="prompt-label">Generate spatial SQL</span>
<div class="prompt-text">You are a PostGIS expert (PostGIS 3.6 / PostgreSQL 18). I have:
- "cases": id, diagnosis_date, geom (Point, SRID 4326)
- "districts": district_id, name, population, geom (MultiPolygon, SRID 4326)
Write one query returning each district's name, case count, and cases per 1,000 population. Make sure it can use a spatial index, and explain each line.</div>
</div>

</div>

</div>

---

# Lab 4 — drive the AI, then verify it <span class="track py">Python</span> <span class="track sql">SQL</span>

<div class="lab-box">
<div class="lab-head"><span class="lab-tag">Lab 4</span> Prompt → run → verify</div>

Using your own Riverbend schema, ask an AI assistant to write the **5 km access rate by district** query (our Step 4). Then <strong>verify</strong> it against the answer you already have.

</div>

<div class="grid grid-cols-2 gap-4 mt-1">

<div>

<div class="prompt-box">
<span class="prompt-label">Your prompt</span>
<div class="prompt-text">You are a PostGIS 3.6 expert helping a public-health researcher. Tables (all SRID 4326):
- clinics(clinic_id, name, geom Point)
- blocks(block_id, pop, geom Point)
- districts(district_id, name, population, geom Polygon)
Write ONE query: per district, the % of block population within 5 km of any clinic. Use meters, use the spatial index, and explain each line.</div>
</div>

</div>

<div class="text-sm">

**Then check the AI's output against reality:**

1. Does it use `::geography` or `ST_Transform` (meters, not degrees)?
2. Does it use `ST_DWithin` (index) — not bare `ST_Distance`?
3. Run it. Does the ranking **match your Step 4 result**?
4. Ask a follow-up: *"add `EXPLAIN ANALYZE` and confirm the index is used."*

</div>

</div>

<div class="callout caution mt-1 text-sm">
If its numbers differ from yours, <strong>you</strong> find out why. That gap-hunting <em>is</em> the skill.
</div>

---

# Copy-ready prompt templates

Fill in the `[brackets]` and paste into your AI assistant of choice.

<div class="grid grid-cols-2 gap-3 mt-2">

<div>

<div class="prompt-box">
<span class="prompt-label">Explain a concept</span>
<div class="prompt-text">You are a patient GIS tutor. Explain [CONCEPT] to a public-health researcher who knows statistics but is new to spatial data. Use a concrete clinic/disease-mapping example, define jargon, and finish with one common mistake to avoid.</div>
</div>

<div class="prompt-box">
<span class="prompt-label">Translate between languages</span>
<div class="prompt-text">Here is a PostGIS SQL query: [PASTE]. Show the equivalent (a) in R using sf and (b) in Python using geopandas, reading from the same database. Note any behavioural differences.</div>
</div>

</div>

<div>

<div class="prompt-box">
<span class="prompt-label">Debug an error / empty result</span>
<div class="prompt-text">My PostGIS query returns [ERROR / "0 rows but I expected matches"]. Query: [PASTE]. SRIDs: [LIST]. Geometry columns: [LIST]. What are the most likely causes, ranked, and how do I check and fix each?</div>
</div>

<div class="prompt-box">
<span class="prompt-label">Plan & sanity-check</span>
<div class="prompt-text">I want to [GOAL, e.g. "estimate people within 5 km of a clinic in County X"]. I have [DATA]. Propose a step-by-step PostGIS workflow, flag CRS/units assumptions, and give three checks to confirm the results are sensible.</div>
</div>

</div>

</div>

---

# A safe AI-assisted workflow

Use AI as a **loop, not a one-shot**:

<div class="grid grid-cols-2 gap-x-6 mt-3">

<div>

<div class="step"><div class="num">1</div><div><strong>Frame the question yourself.</strong> Know what answer would make sense — rough magnitude, units, expected shape. Your guardrail against confident-but-wrong output.</div></div>

<div class="step"><div class="num">2</div><div><strong>Give rich context.</strong> Tool / version, table & column names, geometry types, SRIDs.</div></div>

<div class="step"><div class="num">3</div><div><strong>Ask for an explanation, not just code.</strong> "Explain each step" surfaces flawed assumptions.</div></div>

</div>

<div>

<div class="step"><div class="num">4</div><div><strong>Run on a small sample first.</strong> Use <code>LIMIT</code>, one district, or a known case you can predict.</div></div>

<div class="step"><div class="num">5</div><div><strong>Verify against reality.</strong> Check counts and a few records by hand; cross-check function names in the official docs.</div></div>

<div class="step"><div class="num">6</div><div><strong>Iterate.</strong> Feed back what you saw ("totals are 10× too high — a unit issue?") and refine.</div></div>

</div>

</div>

---

# Trust, but verify — common AI pitfalls in GIS

<div class="callout caution">
<strong>⚠️ AI can be confidently wrong.</strong> Watch for these GIS-specific failure modes:
</div>

<div class="grid grid-cols-2 gap-x-6 text-sm mt-1">

<div>

- **Invented functions/args** — confirm names in the [PostGIS reference](https://postgis.net/docs/reference.html)
- **SRID / units mistakes** — distance on SRID 4326 is in *degrees*; remember `ST_Transform` or the `geography` type
- **Invalid geometries** — real data self-intersects; run `ST_IsValid` / `ST_MakeValid`

</div>

<div>

- **Performance blind spots** — a "correct" query can be unusably slow; ask for `EXPLAIN ANALYZE` and index use
- **Outdated patterns** — it may suggest `psycopg2` instead of `psycopg` v3; state your versions
- **Statistical subtlety** — MAUP, edge effects, ecological fallacy are easy to gloss over; apply your expertise

</div>

</div>

<div class="callout takeaway mt-2 text-sm">
<strong>You met every one of these today:</strong> degrees vs. meters (Step 2), index use (Lab 1),
boundary effects (Step 5). That's exactly the checklist to run on AI output.
</div>

---

# 🔒 Data privacy & ethics (read this twice)

<div class="callout caution">
<strong>Never paste protected health information (PHI/PII) or precise patient locations
into a consumer AI chat.</strong> Patient addresses and coordinates are among the most
re-identifiable data that exist — pasting them into a public tool may violate HIPAA,
GDPR, IRB protocols, and data-use agreements.
</div>

<div class="text-sm mt-2">

- **Share schema, not data** — give the AI table/column structure, types, and SRIDs, never real rows
- **Use synthetic examples** when you need sample values (exactly what we did with Riverbend today)
- **De-identify and aggregate** first — to census tracts or H3 cells; apply small-cell suppression
- **Prefer approved / enterprise AI** (zero-retention, no-training) or local models near sensitive data — follow institutional policy first
- **Keep a human in the loop** — AI informs analysis; it does not make public-health decisions

</div>

<div class="callout ai-tip mt-2">
<strong>Good practice:</strong> "I have a points table of de-identified case locations
(SRID 4326) and a polygons table of census tracts; help me aggregate cases per tract"
— gives the AI everything it needs <em>without exposing a single real record.</em>
</div>

---

# The AI tooling landscape, and emerging applications <span class="badge-new">New</span>

<div class="grid grid-cols-2 gap-5">

<div>

#### Tooling landscape

<div class="text-sm">

- **💬 Chat assistants** — Claude, ChatGPT, Gemini: explain, draft, translate, debug
- **⌨️ In-editor** — Copilot, Cursor, notebook AI: autocomplete & refactor in place
- **🛠️ Coding agents** — Claude Code reads files, runs queries, iterates end-to-end
- **🔌 MCP & text-to-SQL** — connect AI to a *read-only* PostGIS to query in natural language (scope permissions tightly!)

</div>

</div>

<div>

#### Emerging GenAI in the field

<div class="text-sm">

- **🛰️ Geospatial foundation models** — Prithvi, Clay: flood/burn mapping from imagery
- **✂️ Promptable extraction** — SAM-for-geo (`samgeo`): buildings/water by click or prompt
- **💬 "Chat with your map"** — QGIS LLM plugins generate geoprocessing / SQL
- **🧪 Synthetic data** — privacy-preserving populations for sharing & teaching
- **🔎 Semantic + spatial search** — `pgvector` combines embeddings with spatial filters
- **🤝 Agentic copilots** & **🗺️ AI cartography**

</div>

</div>

</div>

<div class="callout caution mt-2 text-sm">
<strong>⚠️ Same rules apply:</strong> foundation-model outputs need ground-truthing,
generated code/SQL needs verification, and <strong>none of this excuses putting real PHI
into unapproved tools.</strong> Treat AI output as a draft to validate, not a result to publish.
</div>

---

# Part VIII — key takeaway

<div class="callout takeaway text-base">
<strong>Generative AI dramatically lowers the barrier to learning and doing GIS</strong>
— as a tutor, code translator, debugger, and analysis copilot.
<br><br>
Get the most from it by giving <strong>rich context</strong> (versions, schema, SRIDs),
asking for <strong>explanations</strong>, and <strong>verifying every result</strong> — exactly the
validation habits you practiced in the case study.
And never trade your participants' privacy for convenience:
<strong>share structure, not sensitive data.</strong>
</div>

---
layout: section
---

<div class="kicker">Part IX</div>

# Pop Quiz

Click to reveal each answer — test your recall

---

# Q1 · Q2

<div class="grid grid-cols-2 gap-6">

<div>

**Q1.** A key advantage of PostGIS over shapefiles for *collaborative* research?

<div class="text-sm mt-1">

A) Shapefiles support more advanced SQL
B) **PostGIS allows robust concurrent access & integrity**
C) Shapefiles handle large datasets better
D) PostGIS needs no coordinate systems

</div>

<div v-click class="answer mt-2 text-sm">
<strong>Answer: B.</strong> A database is built for concurrent multi-user access and
enforces integrity — critical for collaboration. Shapefiles are prone to versioning issues.
</div>

</div>

<div>

**Q2.** Best geometry type for administrative district boundaries (counties)?

<div class="text-sm mt-1">

A) Point
B) LineString
C) **Polygon**
D) MultiPoint

</div>

<div v-click class="answer mt-2 text-sm">
<strong>Answer: C.</strong> Polygons represent areas with defined boundaries — the right
choice for counties or states.
</div>

</div>

</div>

---

# Q3 · Q4

<div class="grid grid-cols-2 gap-6">

<div>

**Q3.** The primary purpose of an SRID?

<div class="text-sm mt-1">

A) Uniquely identify each record
B) Define map-feature styling
C) **Define the coordinate system & give real-world meaning**
D) Speed up non-spatial attribute queries

</div>

<div v-click class="answer mt-2 text-sm">
<strong>Answer: C.</strong> The SRID defines the CRS (e.g. WGS84, UTM), essential for
interpreting coordinates and aligning layers.
</div>

</div>

<div>

**Q4.** Your `ST_Distance` on SRID-4326 data returns `0.045`. What went wrong?

<div class="text-sm mt-1">

A) The geometries are invalid
B) **It's in degrees — transform to a metric CRS or cast to `geography`**
C) The spatial index is missing
D) Nothing; 0.045 km is correct

</div>

<div v-click class="answer mt-2 text-sm">
<strong>Answer: B.</strong> On 4326, distance is in degrees. Use <code>ST_Transform</code> to a
projected CRS or cast to <code>geography</code> for true meters.
</div>

</div>

</div>

---

# Q5 · Q6

<div class="grid grid-cols-2 gap-6">

<div>

**Q5.** To find clinics within 2 km of an address *efficiently*, the best function?

<div class="text-sm mt-1">

A) `ST_Area()`
B) **`ST_DWithin()`**
C) `ST_Union()`
D) `ST_Distance()` in a `WHERE`

</div>

<div v-click class="answer mt-2 text-sm">
<strong>Answer: B.</strong> <code>ST_DWithin(a, b, distance)</code> tests proximity <em>and</em>
leverages the spatial index. A bare <code>ST_Distance</code> filter cannot use the index.
</div>

</div>

<div>

**Q6.** Fast, one-off analysis of a 50-M-row GeoParquet file on your laptop, no server?

<div class="text-sm mt-1">

A) A shapefile in a spreadsheet
B) **DuckDB with the spatial extension**
C) Emailing the file to a colleague
D) Converting everything to CSV first

</div>

<div v-click class="answer mt-2 text-sm">
<strong>Answer: B.</strong> DuckDB + `spatial` needs no server, reads GeoParquet directly,
and runs spatial SQL fast over tens of millions of rows.
</div>

</div>

</div>

---

# Q7 · Q8

<div class="grid grid-cols-2 gap-6">

<div>

**Q7.** Using a generative AI assistant on patient case locations — most appropriate practice?

<div class="text-sm mt-1">

A) Paste the full coordinate table for full context
B) **Describe the schema (tables/columns, types, SRIDs) + synthetic examples — never real PHI**
C) Trust the query without checking
D) Skip stating your PostGIS version

</div>

<div v-click class="answer mt-2 text-sm">
<strong>Answer: B.</strong> Share <em>structure, not sensitive data.</em> Schema + SRIDs +
synthetic examples give the AI what it needs without exposing re-identifiable data — and you still verify.
</div>

</div>

<div>

**Q8.** A spatial join counting points in polygons is typically written as…

<div class="text-sm mt-1">

A) `JOIN ON a.id = b.id`
B) **`JOIN ON ST_Contains(poly.geom, pt.geom)` + `GROUP BY`**
C) Two separate queries merged in a spreadsheet
D) `ORDER BY ST_Area(geom)`

</div>

<div v-click class="answer mt-2 text-sm">
<strong>Answer: B.</strong> Spatial joins relate tables by a spatial predicate, not a shared key —
the points-in-polygons pattern you used in the case study.
</div>

</div>

</div>

---
layout: section
---

<div class="kicker">Part X</div>

# Summary & Resources

---

# Quick summary — what you can now do

<div class="grid grid-cols-2 gap-x-6 text-sm">

<div>

- **Set up a lab** — Docker PostGIS and/or DuckDB spatial, from one command
- **Reason about fundamentals** — geometry types, SRID/CRS, geometry vs. geography, indexes
- **Avoid the classic traps** — degrees vs. meters; queries that skip the index (`EXPLAIN ANALYZE`)
- **Write spatial SQL** — predicates, buffers, and the points-in-polygons spatial join

</div>

<div>

- **Connect** from SQL, Python (`geopandas`/`psycopg` v3), and R (`sf`)
- **Carry an analysis end-to-end** — the clinic-accessibility pipeline, with validation
- **Use the modern stack** — GeoParquet, DuckDB, Overture; the same SQL transfers
- **Work with generative AI** — draft, translate, debug — with rich context, verification, and privacy

</div>

</div>

<div class="callout takeaway mt-3">
<strong>Bottom line:</strong> PostGIS is a durable, shared spatial foundation — and the
spatial SQL you learned today carries across the whole modern, AI-assisted ecosystem.
</div>

---

# Resources for further learning

<div class="grid grid-cols-2 gap-x-8 text-sm">

<div>

**Official**
- PostGIS — [postgis.net](https://postgis.net)
- PostgreSQL — [postgresql.org](https://postgresql.org)
- Spatial SQL reference — [postgis.net/docs/reference.html](https://postgis.net/docs/reference.html)
- PostGIS Docker image — [hub.docker.com/r/postgis/postgis](https://hub.docker.com/r/postgis/postgis)

**Python & R**
- `geopandas` — [geopandas.org](https://geopandas.org)
- `psycopg` — [psycopg.org/docs](https://www.psycopg.org/docs/)
- `sf` — [r-spatial.github.io/sf](https://r-spatial.github.io/sf/)

</div>

<div>

**Modern stack** <span class="badge-new">New</span>
- DuckDB Spatial — [duckdb.org → spatial](https://duckdb.org/docs/stable/core_extensions/spatial/overview)
- GeoParquet — [geoparquet.org](https://geoparquet.org)
- Overture Maps — [overturemaps.org](https://overturemaps.org)
- *Spatial SQL* (Forrest book) & PostGIS in Action

**GenAI in geospatial** <span class="badge-new">New</span>
- Prithvi — [ibm-nasa-geospatial](https://huggingface.co/ibm-nasa-geospatial)
- Clay — [madewithclay.org](https://madewithclay.org)
- `segment-geospatial` — [samgeo.gishub.org](https://samgeo.gishub.org)
- `pgvector` — [github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)

</div>

</div>

---
layout: center
class: text-center
---

<div class="kicker">The PostGIS Almanac</div>

# Thank you

<div class="ornament-rule mt-4 mb-6">✦ &nbsp; ✦ &nbsp; ✦</div>

Keep the momentum: re-run the clinic-accessibility case study on your own data,
with an AI assistant as your tutor — and verify every result.

<div class="text-sm opacity-70 mt-6">
Always state your tool + version, share schema & SRIDs (not PHI), verify every result.
</div>

<div class="abs-br m-6 text-xs opacity-60">
Built with <a href="https://sli.dev" target="_blank">Slidev</a>
</div>
