---
theme: seriph
title: 'The PostGIS Almanac — Spatial Databases & AI-Assisted GIS for Public Health'
info: |
  ## The PostGIS Almanac
  Spatial Databases (PostGIS) & AI-Assisted GIS for Public Health Research.

  An academic presentation adapted from the interactive lecture — covering why
  spatial databases matter, PostGIS fundamentals, connecting from R & Python,
  the modern (2026) geospatial stack, real-world applications, and learning &
  doing GIS responsibly with generative AI.
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

<div class="kicker">The Field Guide · A Lecture in Nine Parts</div>

# The PostGIS Almanac

## Spatial Databases & AI-Assisted GIS <br> for Public Health Research

<div class="ornament-rule mt-6">✦ &nbsp; ✦ &nbsp; ✦</div>

<div class="text-sm opacity-70 mt-4">
2026 edition · PostGIS 3.6 · PostgreSQL 18 · GeoParquet · DuckDB · generative AI
</div>

<div class="abs-br m-6 text-xs opacity-60">
Press <kbd>→</kbd> / <kbd>Space</kbd> to advance
</div>

<!--
Speaker note: This deck is designed for public-health researchers who know their
domain but may be newer to databases and code. The goal is threefold: introduce
the value of PostGIS, demonstrate access from R and Python, and equip the audience
to learn and perform GIS work responsibly with the help of generative AI.
-->

---
layout: intro
---

<div class="kicker">Table of Contents</div>

# What we'll cover

<div class="grid grid-cols-2 gap-x-10 gap-y-1 mt-6 text-base">

<div>

**I.** &nbsp; Overview & goals
**II.** &nbsp; Why spatial databases?
**III.** &nbsp; PostGIS fundamentals
**IV.** &nbsp; Connecting & querying (R / Python)
**V.** &nbsp; The modern geospatial stack (2026)

</div>

<div>

**VI.** &nbsp; Real-world applications
**VII.** &nbsp; Learning GIS with generative AI
**VIII.** &nbsp; Pop quiz
**IX.** &nbsp; Summary & resources

</div>

</div>

<div class="callout takeaway mt-6">
<strong>Overall goal:</strong> Introduce the concept and benefits of PostGIS spatial
databases in public health, demonstrate basic data access with R and Python, and
equip you to learn and perform GIS work with generative AI — responsibly.
</div>

---
layout: section
---

<div class="kicker">Part I</div>

# Overview

The "where" of public health, and why it needs better tools

---

# Welcome

This presentation explores the concepts and benefits of using **PostGIS spatial databases** in public health research. It is designed for researchers who may have limited prior experience with databases or programming, but who are familiar with public health data.

We'll move through:

<v-clicks>

- **Why** spatial databases are crucial, and the limits of CSVs / shapefiles
- **PostGIS fundamentals** — geometry, coordinate systems, indexing
- **Connecting & querying** from R and Python
- **The modern (2026) geospatial stack** — DuckDB, GeoParquet, cloud-native formats
- **Real-world applications** in spatial epidemiology
- **Learning & doing GIS with generative AI** — safely and effectively

</v-clicks>

<div v-click class="callout ai-tip mt-4">
<strong>📅 2026 edition:</strong> Updated for today's ecosystem — PostGIS 3.6, PostgreSQL 18,
GeoParquet, DuckDB, <code>psycopg</code> v3, GeoPandas 1.x — plus a hands-on guide to
learning and doing GIS with generative AI. New material is marked <span class="badge-new">New</span>.
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
layout: section
---

<div class="kicker">Part III</div>

# PostGIS Fundamentals

PostgreSQL, the spatial extension, and core concepts

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
MultiPolygon) — collections of the same type.
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

# Core concept 3 — Spatial indexes

Like a book's index — but for **locations**. They dramatically speed up spatial queries ("what's near X?", "what's inside Y?").

<v-clicks>

- **Analogy:** a GPS that lets the database rapidly find spatial data
- **How (simplified):** pre-organizes data using bounding boxes (R-Trees) so the database doesn't scan everything
- **Usage:** create an index on a geometry column; the query planner uses it automatically

</v-clicks>

<div v-click class="callout takeaway mt-5">
<strong>Key takeaway:</strong> PostGIS stores geographic shapes (geometries),
understands their real-world coordinate systems (SRIDs), and uses spatial indexes
to make analysis powerful and efficient.
</div>

---
layout: section
---

<div class="kicker">Part IV</div>

# Connecting & Querying

Reaching PostGIS from R, Python, and SQL

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
For demos, use a <strong>read-only account</strong> to prevent accidental
modification of data.
</div>

<div class="callout takeaway mt-3">
<strong>Key takeaway:</strong> These five pieces of information are the standard keys
to unlock almost any database.
</div>

</div>

</div>

---

# Connecting from R — `sf` + `DBI` + `RPostgres`

```r {all|2-4|7-12|15-19|22|25}
# 1. Load libraries  (install.packages(c("sf","DBI","RPostgres")) once)
library(sf)
library(DBI)
library(RPostgres)

# 2. Connection parameters (REPLACE with real details)
con <- dbConnect(RPostgres::Postgres(),
                 dbname   = "your_sample_db_name",
                 host     = "your_host_address",
                 port     = 5432,
                 user     = "readonly_user",
                 password = "readonly_password")

# 3. Read a spatial table into an sf object
sql <- "SELECT objectid, clinic_name, address, geom
        FROM health_clinics LIMIT 5;"
health_data_sf <- st_read(con, query = sql)

# 4. Inspect
print(health_data_sf)          # plot(st_geometry(health_data_sf))

# 5. Always close the connection
dbDisconnect(con)
```

<div class="callout takeaway mt-2">
<strong>Key takeaway:</strong> With <code>sf</code> and <code>DBI</code>, R connects to
PostGIS and brings spatial data into a familiar analysis environment.
</div>

---

# Connecting from Python — `geopandas` + `psycopg` v3

```python {all|2-3|6-10|13-16|19|22}
# pip install "geopandas>=1.0" "psycopg[binary]" "sqlalchemy>=2" geoalchemy2
# Note (2026): psycopg v3 is current; psycopg2 is legacy / maintenance-only.
import geopandas as gpd
from sqlalchemy import create_engine

# Build a SQLAlchemy engine — "+psycopg" selects the v3 driver
user, pw = "readonly_user", "readonly_password"
host, port, db = "your_host_address", 5432, "your_sample_db_name"
engine = create_engine(
    f"postgresql+psycopg://{user}:{pw}@{host}:{port}/{db}")

# Read a spatial table into a GeoDataFrame
sql = """SELECT objectid, clinic_name, address, geom
         FROM health_clinics LIMIT 5;"""
gdf = gpd.read_postgis(sql, engine, geom_col="geom")

# Inspect
print(gdf.head())              # gdf.explore()  -> interactive Leaflet map

# Good practice in longer scripts
engine.dispose()
```

<div class="callout takeaway mt-2">
<strong>Key takeaway:</strong> With <code>geopandas</code> and <code>SQLAlchemy</code>,
Python works with PostGIS intuitively — especially if you know <code>pandas</code>.
</div>

---

# A brief note on SQL

The `query` parameter in `st_read()` (R) and `read_postgis()` (Python) uses **SQL**. PostGIS extends SQL with many **spatial functions**:

<div class="grid grid-cols-2 gap-4 mt-3">

<div>

```sql
ST_Distance(a, b)     -- distance between geometries
ST_DWithin(a, b, d)   -- within distance d?
ST_Intersects(a, b)   -- do they overlap?
ST_Contains(a, b)     -- is b inside a?
ST_Buffer(g, d)       -- grow a zone around g
```

</div>

<div>

<div class="card text-sm">
Performing spatial operations <strong>in the database</strong> is often very
efficient — the server processes data before transferring it to R / Python.
</div>

</div>

</div>

<div class="callout takeaway mt-3">
<strong>Key takeaway:</strong> Basic SQL plus PostGIS spatial functions unlocks
powerful, efficient selection and manipulation directly in the database.
</div>

---
layout: section
---

<div class="kicker">Part V <span class="badge-new">New</span></div>

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

---
layout: section
---

<div class="kicker">Part VI</div>

# Real-World Applications

Spatial epidemiology, beyond simple mapping

---

# Use case 1 — Disease surveillance & clusters

<div class="grid grid-cols-2 gap-5 mt-2">

<div>

**Question:** Where are cases concentrated? Are there more in District A vs. B, accounting for population?

**PostGIS role:** store case locations (points) and administrative boundaries (polygons).

**Conceptual SQL:**

```sql
SELECT d.name, COUNT(c.*) AS cases
FROM districts d
JOIN cases c
  ON ST_Contains(d.geom, c.geom)
GROUP BY d.name;
-- then divide by population for a rate
```

</div>

<div>

<div class="card" style="border-style:dashed;border-color:var(--color-green-soft);background:var(--color-green-tint)">
<div class="text-center font-medium" style="color:var(--color-green-deep)">
Conceptual map: cases in districts
</div>
<div class="text-xs text-center mt-2" style="color:var(--color-green-deep)">
District polygons with disease-case points overlaid; districts color-coded by
rate (cases per population).
</div>
</div>

</div>

</div>

---

# Use case 2 — Healthcare accessibility

<div class="grid grid-cols-2 gap-5 mt-2">

<div>

**Question:** How many households are within 5 km of a clinic? Which clinics serve a neighborhood?

**PostGIS role:** clinic locations (points), household points or census-block centroids / polygons.

**Conceptual SQL:**

```sql
-- proximity
ST_DWithin(clinic.geom, household.geom, 5000)

-- service areas, then overlap with areas
ST_Buffer(clinic.geom, 5000)
ST_Intersects(buffer, neighborhood.geom)
```

</div>

<div>

<div class="card" style="border-style:dashed;border-color:var(--color-green-soft);background:var(--color-green-tint)">
<div class="text-center font-medium" style="color:var(--color-green-deep)">
Conceptual map: clinic access
</div>
<div class="text-xs text-center mt-2" style="color:var(--color-green-deep)">
Clinic points with 5 km circular buffers; households / census blocks highlighted
when they fall within a buffer, indicating access.
</div>
</div>

</div>

</div>

---

# Use case 3 — Environmental exposure

<div class="grid grid-cols-2 gap-5 mt-2">

<div>

**Question:** Which communities are exposed to pollutants from an industrial site (within a 2 km buffer)? How many people?

**PostGIS role:** pollution source (point / polygon), community boundaries (polygons with population).

**Conceptual SQL:**

```sql
ST_Buffer(source.geom, 2000)       -- exposure zone
ST_Intersects(zone, community.geom)
ST_Intersection(zone, community.geom)
  -- estimate exposed population share
```

</div>

<div>

<div class="card" style="border-style:dashed;border-color:var(--color-green-soft);background:var(--color-green-tint)">
<div class="text-center font-medium" style="color:var(--color-green-deep)">
Conceptual map: exposure zones
</div>
<div class="text-xs text-center mt-2" style="color:var(--color-green-deep)">
An industrial site with a 2 km buffer; community polygons (census tracts)
highlighted where they overlap the buffer.
</div>
</div>

<div class="callout takeaway mt-3">
<strong>Key takeaway:</strong> PostGIS answers sophisticated spatial questions
efficiently — often computing directly in the database via spatial SQL.
</div>

</div>

</div>

---
layout: section
---

<div class="kicker">Part VII <span class="badge-new">New</span></div>

# Learning GIS with Generative AI 🤖

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
- **Use synthetic examples** when you need sample values ("a clinic at lng/lat 0,0")
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

# Part VII — key takeaway

<div class="callout takeaway text-base">
<strong>Generative AI dramatically lowers the barrier to learning and doing GIS</strong>
— as a tutor, code translator, debugger, and analysis copilot.
<br><br>
Get the most from it by giving <strong>rich context</strong> (versions, schema, SRIDs),
asking for <strong>explanations</strong>, and <strong>verifying every result</strong>.
And never trade your participants' privacy for convenience:
<strong>share structure, not sensitive data.</strong>
</div>

---
layout: section
---

<div class="kicker">Part VIII</div>

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

**Q4.** Benefit of using a SQL query inside `st_read()` / `read_postgis()`?

<div class="text-sm mt-1">

A) It's the only way to load data
B) **Server-side filtering & processing — efficient for big data**
C) It bypasses connection parameters
D) It auto-converts to a shapefile

</div>

<div v-click class="answer mt-2 text-sm">
<strong>Answer: B.</strong> SQL lets you select columns, filter rows, or compute on the
server before transfer — very efficient on large tables.
</div>

</div>

</div>

---

# Q5 · Q6

<div class="grid grid-cols-2 gap-6">

<div>

**Q5.** To find clinics within 2 km of an address, the most direct & efficient function?

<div class="text-sm mt-1">

A) `ST_Area()`
B) **`ST_DWithin()`**
C) `ST_Union()`
D) `ST_Centroid()`

</div>

<div v-click class="answer mt-2 text-sm">
<strong>Answer: B.</strong> `ST_DWithin(a, b, distance)` efficiently tests proximity and
leverages spatial indexes.
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

# Q7

**Q7.** Using a generative AI assistant on de-identified patient case locations — which practice is most appropriate?

<div class="text-sm mt-2">

A) Paste the full table of patient coordinates so the AI has complete context
B) **Describe the schema (tables/columns, geometry types, SRIDs) and use synthetic example values — never real PHI**
C) Trust the generated query without checking, since AI rarely makes mistakes
D) Skip stating your PostGIS version because it never matters

</div>

<div v-click class="answer mt-3">
<strong>Answer: B.</strong> Share <em>structure, not sensitive data.</em> Giving the AI your
schema and SRIDs (plus synthetic examples) provides everything it needs without exposing
re-identifiable health information — and you should verify the output and state your tool versions.
</div>

---
layout: section
---

<div class="kicker">Part IX</div>

# Summary & Resources

---

# Quick summary — benefits recap

<div class="grid grid-cols-2 gap-x-6 text-sm">

<div>

- **Overcomes flat-file limits** — structured, secure, scalable storage; better integrity, attributes, concurrency
- **Enables complex spatial analysis** — proximity, containment, overlay, buffering in the database
- **Promotes integrity & scalability** — enforces types and relationships; manages very large data
- **Facilitates collaboration** — centralized, consistent, multi-user access

</div>

<div>

- **Integrates with R & Python** — `sf` / `DBI`; `geopandas` / SQLAlchemy / `psycopg` v3
- **Fits a modern stack** — complements GeoParquet, DuckDB + spatial, Overture Maps; spatial SQL transfers across them
- **Pairs well with generative AI** — accelerates learning & analysis *when* you give rich context, verify results, and protect sensitive data

</div>

</div>

<div class="callout takeaway mt-3">
<strong>Bottom line:</strong> PostGIS is a durable, shared spatial foundation — and the
spatial SQL you learn carries across the whole modern, AI-assisted ecosystem.
</div>

---

# Resources for further learning

<div class="grid grid-cols-2 gap-x-8 text-sm">

<div>

**Official**
- PostGIS — [postgis.net](https://postgis.net)
- PostgreSQL — [postgresql.org](https://postgresql.org)
- Spatial SQL reference — [postgis.net/docs/reference.html](https://postgis.net/docs/reference.html)

**R packages**
- `sf` — [r-spatial.github.io/sf](https://r-spatial.github.io/sf/)
- `DBI` — [dbi.r-dbi.org](https://dbi.r-dbi.org)
- `RPostgres` — [rpostgres.r-dbi.org](https://rpostgres.r-dbi.org)

**Python packages**
- `geopandas` — [geopandas.org](https://geopandas.org)
- `SQLAlchemy` — [sqlalchemy.org](https://sqlalchemy.org)
- `psycopg` — [psycopg.org/docs](https://www.psycopg.org/docs/)

</div>

<div>

**Modern stack** <span class="badge-new">New</span>
- DuckDB Spatial — [duckdb.org → spatial](https://duckdb.org/docs/stable/core_extensions/spatial/overview)
- GeoParquet — [geoparquet.org](https://geoparquet.org)
- Overture Maps — [overturemaps.org](https://overturemaps.org)
- Cloud-Native Geo Forum — [cloudnativegeo.org](https://cloudnativegeo.org)

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

Hands-on practice is highly encouraged — try working through one of the use cases
with an AI assistant as your tutor.

<div class="text-sm opacity-70 mt-6">
Always state your tool + version, share schema & SRIDs (not PHI), verify every result.
</div>

<div class="abs-br m-6 text-xs opacity-60">
Built with <a href="https://sli.dev" target="_blank">Slidev</a>
</div>
