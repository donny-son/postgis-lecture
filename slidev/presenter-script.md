# Presenter Script — The PostGIS Almanac

Spatial Databases & AI-Assisted GIS for Public Health Research
A two-hour, hands-on lecture in ten parts.

---

## How to use this script

- Each `###` heading below maps to one slide in `slides.md`, in order.
- Say: the spoken line — a natural script you can read or paraphrase. Don't read it word-for-word; it's a floor, not a ceiling.
- Do: stage directions — when to switch to a terminal, advance a click, start a timer.
- Time: rough budget for the slide. Total ≈ 120 min including a 5-min break after Part VI.
- Audience: public-health researchers who know their domain but may be newer to databases and code. Keep jargon defined; keep energy on the why.

Timing map: I (5m) · II (10m) · III (15m) · IV (25m) · V (15m) · VI (10m) → break (5m) · VII (25m) · VIII (20m) · IX (10m) · X (5m).

Before you start: open a terminal, have Docker running, and have a DuckDB shell ready so you can demo live. Tell people the slides are interactive and the repo is shareable.

---

## Part I — Overview (~5 min)

### Slide 1 — Title: The PostGIS Almanac
Time: 1 min
Say: "Welcome. Over the next two hours we're going to turn 'where' into something you can query. This is a hands-on lecture — by the end you'll have a working spatial database on your own laptop and you'll have carried a real public-health question from raw data to a defensible answer. We're using the 2026 stack: PostGIS 3.6, PostgreSQL 18, plus DuckDB, GeoParquet, and generative AI as a copilot."
Do: Introduce yourself in one line. Ask for a show of hands: "Who's written SQL before? Who's used a map in their research?" Calibrate.

### Slide 2 — What we'll cover (Table of Contents)
Time: 1 min
Say: "Ten parts. The left column is foundations — why this matters, setting up, the fundamentals. The right column is where it pays off — connecting from your language, the modern stack, a full case study, and doing all of this with AI responsibly. Three parts are hands-on; you'll be running queries yourself."
Do: Point at the three "Hands-on" badges. Set the expectation that laptops should be open.

### Slide 3 — Welcome and how to follow along
Time: 1 min
Say: "Here's the rhythm: concept, then demo, then you try it. When you see a 'Lab' box, that's your cue to stop and run something. Code is colour-tagged by track — SQL, Python, R, DuckDB, Docker — so you can follow the language you know. And there are two ways to practice: DuckDB, which runs on any laptop with zero setup, and a full Docker PostGIS server for the real multi-user experience. We set up both next."
Do: Mention that nobody gets left behind — the DuckDB track needs nothing but a pip install.

### Slide 4 — Learning objectives
Time: 1 min
Say: "By the end you'll be able to explain why a spatial database beats a pile of CSVs, stand up PostGIS and DuckDB, reason about geometry types and coordinate systems, write the core spatial SQL, connect from Python and R, carry one analysis end-to-end, and use AI to draft and debug GIS work — and critically, to verify it."
Do: Click through the bullets if you want the build; otherwise reveal all. Land the throughline: "The spatial SQL you learn today transfers everywhere — PostGIS, DuckDB, AI workflows alike. Learn it once, use it everywhere."

### Slide 5 — Today's agenda and timing
Time: 1 min
Say: "Here's the clock. We take a five-minute break after Part VI, roughly the one-hour mark. One favour: if you're doing the Docker track, kick off the image download now — it pulls about 600 megabytes in the background while we talk concepts, so it's ready when we need it."
Do: Trigger the Docker pull yourself on screen if you haven't, so people copy it. This is the single most important early action — a slow download here stalls Part III for everyone.

---

## Part II — Why Spatial Databases? (~10 min)

### Slide 6 — Section divider: Why Spatial Databases?
Time: 15 sec
Say: "First, motivation. Why not just use spreadsheets and shapefiles like everyone always has?"

### Slide 7 — Spatial data in public health
Time: 2 min
Say: "Almost every public-health question has a 'where' in it. Where are the outbreaks? Where do vulnerable people live? Where are the clinics, and can people actually reach them? Spatial data links information to a real location on Earth. Outbreak maps, clinic accessibility, anonymized patient addresses, environmental exposure sources, demographics by census tract — these are the bread and butter."
Do: Ask the room for an example from their own work. Tie it back: "A table can hide a cluster that a map makes obvious."
Say (takeaway): "Spatial context isn't decoration — it's often the whole point. It's what lets you target an intervention geographically instead of spraying resources everywhere."

### Slide 8 — The limits of traditional storage
Time: 3 min
Say: "So why not CSVs and shapefiles? CSVs have no idea your two columns are coordinates — they're just numbers. They quietly mangle data: ZIP codes lose their leading zeros, precision drops, and there's no spatial query at all. Shapefiles are better but come with their own baggage — they're actually four-plus files that must travel together, field names get truncated to ten characters, nulls silently become zero, there's a 2-gigabyte cap, and they were never built for two people to edit at once."
Do: The leading-zero and null-becomes-zero examples always land — name them slowly. "Imagine 'zero cases' that's actually 'missing data.' That's a published-paper-level error."

### Slide 9 — Traditional files vs. a database approach
Time: 3 min
Say: "Let's make it concrete across five dimensions: integrity, scale, spatial querying, collaboration, and coordinate systems. In every row, the file-based approach has a failure mode that directly hurts research — inaccurate analysis, hitting a size wall on national data, error-prone manual spatial steps, overwriting a colleague's work, or a missing projection file that silently misaligns everything."
Do: Don't read the whole table. Pick two rows — "collaboration" and "coordinate system" — and tell the story.
Say (takeaway): "A spatial database fixes all five at once. That's the pitch for the rest of the day."

### Slide 10 — The question we'll answer all day
Time: 2 min
Say: "To keep this grounded, we carry one realistic question the whole way through: clinic accessibility in a fictional place called Riverbend County. 'How many people live within five kilometres of a primary-care clinic, and which districts are underserved relative to their population?' We'll build three synthetic tables — clinics as points, districts as polygons, and population blocks as points. Note the word synthetic: we never use real patient locations in a teaching or AI context, and I'll explain why in Part VIII."
Do: Emphasize the synthetic-data choice now; it pays off in the privacy discussion later.

---

## Part III — Setup: Your Lab Environment (~15 min, hands-on)

### Slide 11 — Section divider: Setup
Time: 15 sec
Say: "Hands-on time. Laptops open. We'll get everyone to a working spatial engine."

### Slide 12 — Two tracks, one set of skills
Time: 2 min
Say: "Two tracks. DuckDB is zero-setup — one pip install, no server, runs spatial SQL right inside Python or the command line, and reads files directly. Docker PostGIS is a genuine multi-user server with concurrency, roles, and real indexes — it mirrors a production research database. Pick one, or do both. Here's the key point: the SQL is nearly identical. DuckDB implements the same `ST_` functions. Learn the query once; run it in either engine."
Do: Tell people which track you'll demo live (recommend DuckDB for speed, mention Docker for realism).

### Slide 13 — Track A: DuckDB in 60 seconds
Time: 2.5 min
Do: Switch to a terminal and run it live. `pip install` then the three-line Python snippet, or the CLI version.
Say: "Watch — `pip install duckdb geopandas`, then in Python: connect, `INSTALL spatial; LOAD spatial;`, and select a point. If you see a POINT print out, your spatial engine works. That's Lab 0a. Go ahead and run either snippet now."
Do: Pause ~60 seconds. Walk the room or watch chat for thumbs-up.

### Slide 14 — Track B: Docker PostGIS in one command
Time: 3 min
Do: Show the `docker run` command. If your pull from Slide 5 finished, start the container live.
Say: "One command spins up PostgreSQL 18 with PostGIS 3.6. The `-d` flag runs it in the background. Then we exec into it with `psql`, and turn PostGIS on for the database with `CREATE EXTENSION postgis`. Two warnings: your data persists until you `docker rm` the container, so stop and start freely. And — this hard-coded password and open port are fine on your laptop for teaching, but never on a shared or internet-facing host."
Do: Say the security caveat with weight; researchers reuse these snippets.

### Slide 15 — Lab 0: confirm your environment
Time: 2 min
Say: "Lab 0b — prove PostGIS is alive. Run `postgis_version()` and make a point, in whichever engine you chose. Both halves should return a version string and a valid point. This is the checkpoint: if this works, everything else today works. If it doesn't, flag it now — don't suffer in silence, because the rest builds on this."
Do: Pause. Actively troubleshoot stragglers here — it's the cheapest place to fix problems.

### Slide 16 — Loading the sample data
Time: 2.5 min
Do: Run the CREATE TABLE and INSERT statements live so everyone ends with identical data.
Say: "Now the Riverbend data. Clinics are just three points. Blocks are population points — we generate a grid with `generate_series`, about 300 points scattered across the county, each with a random population. Run both. Then `SELECT count(*) FROM blocks` — you should see around 323 rows. DuckDB users: `generate_series` in a cross join differs slightly — use `range()` — and the AI can translate that for you, which is a nice preview of Part VIII."

### Slide 17 — Districts, and a reusable data pack
Time: 2 min
Do: Run the districts block. Use the `{all|1-6|8-14}` click build to walk the two halves.
Say: "Last layer: six districts, built as simple square envelopes standing in for administrative areas, each with a population. And now you have three layers — points, population points, and polygons — all in SRID 4326. That's our case-study dataset. If you'd rather use real files, the same tables ship as GeoParquet and DuckDB reads them straight from disk or a URL — no import step."
Do: Confirm everyone has three tables before moving on. This is the gate into the fundamentals.

---

## Part IV — PostGIS Fundamentals, In Depth (~25 min)

### Slide 18 — Section divider: PostGIS Fundamentals
Time: 15 sec
Say: "Now the concepts that make the SQL make sense. This is the densest part — but every idea here you'll use in the case study."

### Slide 19 — What are PostgreSQL and PostGIS?
Time: 2.5 min
Say: "PostgreSQL is a powerful open-source relational database — reliable, free, extensible. PostGIS is an extension that teaches it about geography: spatial data types, spatial indexes, and hundreds of spatial functions. The analogy: PostgreSQL is the filing cabinet; PostGIS adds special folders and tools for maps inside it. As of mid-2026 we're on PostgreSQL 18 and PostGIS 3.6 — you don't need the newest version to learn, but knowing what's current helps when you read docs or ask an AI for help."

### Slide 20 — Core concept 1: Geometry types
Time: 2.5 min
Say: "Three building blocks. A Point is a single location — a clinic, a case, a water sample. A LineString is a connected path — a road, a river, a transit route. A Polygon is a closed area — a county, a service zone, an exposure area. And each has a 'Multi' version for collections, plus geometry collections. That's the whole vocabulary of shapes."
Do: For each, ask the room for a public-health example beyond the ones listed.

### Slide 21 — How geometries are written: WKT & WKB
Time: 2.5 min
Say: "Every geometry has two forms. WKT — Well-Known Text — is the human-readable one: `POINT(-117.4 33.9)`. WKB is the compact binary actually stored on disk; you almost never write it by hand. You'll constantly use a handful of converters: `ST_MakePoint` for a fast point, `ST_SetSRID` to stamp a coordinate system on it, `ST_GeomFromText` to parse WKT, and `ST_AsText` or `ST_AsGeoJSON` to read it back."
Do: Land the caution hard: "One trap that bites everyone — WKT and `ST_MakePoint` are longitude first, then latitude. X then Y. Reverse them and your clinic silently jumps to the wrong hemisphere. No error — just wrong."

### Slide 22 — Core concept 2: Spatial reference systems (SRID)
Time: 2.5 min
Say: "A coordinate reference system is the language your coordinates speak — it maps numbers to real places. The SRID is a unique integer naming that system. WGS84, EPSG 4326, is geographic lat/lon in degrees — what GPS gives you. Projected systems like UTM or State Plane flatten the Earth to a plane in meters or feet, which is better for local distance and area. Two rules: every geometry must have a defined SRID, and layers must share one — or you transform with `ST_Transform`. Two layers in different SRIDs simply won't line up."
Do: Use the diagram: misaligned → transform both to a common system → aligned.

### Slide 23 — The classic trap: degrees are not meters
Time: 3 min
Do: Run the WRONG query live. Let the `0.045` appear.
Say: "Here's that trap in action. Distance between two clinics on raw 4326 comes back as `0.045`. Zero-point-zero-four-five what? Degrees. Meaningless for a clinic. Two fixes: transform both points to a metric CRS — the right UTM zone — and now you get about 8,100 meters. Or cast to `geography`, which measures true meters on a sphere — about 8,120. Either is right; the bare version is always wrong."
Say: "The tell: if a distance looks like `0.0`-something, you're in degrees. Memorize that reflex."

### Slide 24 — geometry vs. geography: which to use
Time: 2.5 min
Say: "Two spatial types, and choosing well saves you from that trap. `geometry` does math on a flat plane — fast, units are whatever the CRS uses, hundreds of functions; it's the default, best when your data is projected or covers a small area. `geography` does math on the round Earth — distances and areas always in meters, correct over long distances and across UTM zones, but fewer functions and a bit slower."
Say (rule of thumb): "National or continental lat/lon data and you want meters → `geography`. Local work, or you've projected to UTM → `geometry`. And you can cast between them with `::geography`. That cast is how we'll get true meters in the case study."

### Slide 25 — Core concept 3: Spatial indexes
Time: 2.5 min
Say: "Spatial indexes are why a database beats a file at scale. Like a book's index, but for locations. Without one, the database checks every single row. With one — using a GiST index, an R-Tree over each geometry's bounding box — the planner skips almost everything. It works in two phases: a fast, approximate filter on bounding boxes, then an exact check on the few survivors."
Do: Click to reveal the `CREATE INDEX ... USING GIST` line. "Build one on every geometry column you query, then `ANALYZE` to refresh statistics."
Say (takeaway): "Functions like `ST_DWithin`, `ST_Intersects`, `ST_Contains` use the index automatically because they start with a bounding-box test. Bare `ST_Distance` does not — so for proximity, always prefer `ST_DWithin`."

### Slide 26 — Proving the index works: EXPLAIN ANALYZE
Time: 3 min
Do: Run `EXPLAIN ANALYZE` live so people see real output.
Say: "How do you know the index was used? Ask the planner. `EXPLAIN ANALYZE` shows the actual plan and real timings. Look for `Index Scan using blocks_geom_idx` — good. A `Seq Scan` on a big table is the warning sign: the index got skipped. Watch `actual time` to compare before and after, and watch for big gaps between estimated and actual rows — that means stale stats, so run `ANALYZE`."
Say: "Lab 1 — create the index, run EXPLAIN ANALYZE, note the time. Then drop the index, re-run, and feel the difference. DuckDB users auto-index, so just focus on reading the query."
Do: Pause for the lab if time allows; otherwise demo and move on.

### Slide 27 — Spatial relationships: the vocabulary
Time: 2 min
Say: "Most spatial questions reduce to a handful of yes/no predicates. `ST_Intersects` — do they touch at all? `ST_Contains` — is B fully inside A? `ST_Within` is the reverse. `ST_DWithin` — are they within distance D? Plus `Touches` and `Crosses`. Under the hood these implement a formal model called DE-9IM — you rarely write it directly, but it's why these predicates are precise and composable. And alongside them, the measurement functions: `Distance`, `Length`, `Area`, `Buffer`, `Intersection`, `Union`, `Centroid`."

### Slide 28 — The workhorse: spatial joins
Time: 2.5 min
Say: "This is where PostGIS earns its keep. A spatial join connects two tables by a spatial relationship instead of a shared key. Here we count population points inside each district: `JOIN blocks ON ST_Contains(district.geom, block.geom)`, then `GROUP BY`. The `ON` clause is a spatial predicate, not `a.id = b.id`, and the planner uses the GiST index to avoid comparing every pair. One thing to watch: a plain `JOIN` drops districts with zero points — use `LEFT JOIN` if you need to see the empty ones."
Say (takeaway): "Memorize this pattern: points-in-polygons via `JOIN ON ST_Contains` plus `GROUP BY`. It answers a huge share of public-health questions."

### Slide 29 — Part IV key takeaway
Time: 1 min
Say: "To recap the fundamentals: PostGIS stores shapes with a real-world coordinate system, lets you pick flat-and-fast `geometry` or true-meters `geography`, stays fast with GiST indexes, and answers questions through predicates and spatial joins. And watch the two classic traps all day: degrees versus meters, and queries that quietly skip the index. `EXPLAIN ANALYZE` is your friend."

---

## Part V — Connecting & Querying (~15 min)

### Slide 30 — Section divider: Connecting & Querying
Time: 15 sec
Say: "You won't always live in `psql`. Let's reach PostGIS from the languages you actually work in."

### Slide 31 — General connection principles
Time: 2 min
Say: "Any database connection needs five things: host, port, database, username, password. PostgreSQL's default port is 5432. For our Docker server those are: localhost, 5432, riverbend, postgres, and the password 'almanac'. One professional habit — for demos and especially AI work, connect with a read-only account so nothing can accidentally modify your data."

### Slide 32 — A deeper note on SQL
Time: 2 min
Say: "Reassurance for the SQL-nervous: PostGIS is just SQL. The same SELECT, FROM, WHERE, GROUP BY, ORDER BY you may already know — spatial functions just slot in anywhere an expression is allowed: in SELECT, in WHERE, in the JOIN's ON, even ORDER BY. And doing the spatial work in the database means the server filters before it sends data to R or Python — often dramatically faster than pulling everything out first."

### Slide 33 — Connecting from Python: geopandas + psycopg v3
Time: 3 min
Do: Walk the `{all|2-4|...}` click build. Run it live if your server is up.
Say: "Python. Install geopandas, psycopg, SQLAlchemy. Note for 2026: psycopg version 3 is current — the old psycopg2 is maintenance-only. Build a SQLAlchemy engine — the `+psycopg` part selects the v3 driver — then `gpd.read_postgis` reads a spatial query straight into a GeoDataFrame. That's a real geospatial dataframe: `gdf.explore()` drops it on an interactive Leaflet map."
Say (takeaway): "If you know pandas, this feels immediately familiar. The result is a true GeoDataFrame you can map."

### Slide 34 — Same skills, no server: DuckDB from Python
Time: 2 min
Say: "The identical analysis with no server at all. Connect to a DuckDB file, `LOAD spatial`, and run the same `ST_Contains` spatial join — byte-for-byte the same SQL as PostGIS. And you can point it straight at a GeoParquet file with zero import. That's the payoff of learning spatial SQL once: it moves with you."

### Slide 35 — Supplement: connecting from R
Time: 2 min
Say: "For the R users — `sf` plus `DBI` plus `RPostgres` mirror the Python workflow exactly. Same five connection parameters, then `st_read` with a query pulls results into an `sf` object you can plot. One mental model, three dialects: SQL is the engine; geopandas and sf are thin, friendly wrappers. Use the language you know."

### Slide 36 — Lab 2: connect & run a spatial join
Time: 3.5 min
Say: "Lab 2 — your first end-to-end query. Connect from Python, either to PostGIS or to DuckDB, run the population-per-district spatial join, and print the busiest district. Bonus: `gdf.explore()` to see it on a map. The snippet works against either engine — you just change how you read the result."
Do: Pause and let people run it. Walk the room. This is the moment connection clicks for most people.
Say (checkpoint): "If you got a result, you've now done the core loop of every analysis: connect, run a spatial join, pull it into a dataframe."

---

## Part VI — The Modern Geospatial Stack (~10 min, then break)

### Slide 37 — Section divider: The Modern Geospatial Stack
Time: 15 sec
Say: "Zoom out. In 2026, think in terms of a stack, not a single tool."

### Slide 38 — PostGIS is no longer the only place for spatial SQL
Time: 2 min
Say: "A genuine shift: you can now run serious spatial SQL with no database server at all. The biggest example is DuckDB with its spatial extension — 'SQLite for analytics' — speaking much of the same `ST_` SQL. No server to manage, reads and writes GeoParquet and shapefiles, queries files on disk or in the cloud directly, and it's blisteringly fast over tens to hundreds of millions of features on a laptop. Reach for it for ad-hoc analysis and big open-data files. PostGIS is still better when you need a shared, central, multi-user, governed database."

### Slide 39 — PostGIS vs. DuckDB: opposite by design
Time: 2.5 min
Say: "They speak the same `ST_` language, so they look interchangeable. They're not — they're architecturally opposite tools that happen to share a query language. PostGIS is a client-server system of record: one long-running database many people connect to, row-oriented with concurrent reads and writes, durable and governed, the deepest toolbox. DuckDB is an in-process analytics engine: a library inside your script, columnar and vectorized, files-first, lean."
Say (one-liner): "The one-liner to remember: PostGIS is a database you connect to; DuckDB is a library you run inside your script."

### Slide 40 — At a glance: same language, opposite engines
Time: 1.5 min
Do: Don't read the whole table. Hit three rows.
Say: "Three rows that matter most: architecture — server versus embedded. Getting data in — PostGIS you load into tables first, DuckDB queries files in place. And the `geography` type — PostGIS has it for true geodetic meters; DuckDB doesn't, so you project or use sphere helpers. Hold that last one; it's the next slide's gotcha."

### Slide 41 — Same SQL, watch the dialect edges
Time: 2 min
Say: "The core predicates are identical. The differences are at the edges. Point construction: PostGIS uses `ST_SetSRID(ST_MakePoint(...))`; DuckDB takes `ST_Point(x, y)` directly. Meters: PostGIS casts to `geography`; DuckDB has no geography, so you `ST_Transform` to a UTM CRS or use `ST_Distance_Sphere`. And generating rows: `generate_series` in PostGIS, `range()` in DuckDB. Two gotchas to circle: no `geography` type in DuckDB, and a different row-generator. Everything else transfers."

### Slide 42 — When to use which, and using both
Time: 1.5 min
Say: "Reach for PostGIS when many analysts share one authoritative dataset, you need concurrent edits and roles, or it backs an app or live map. Reach for DuckDB when it's one analyst, one laptop, big files, ad-hoc work. And the common 2026 pattern is both: use DuckDB for the heavy lifting — scan a 50-million-row GeoParquet, filter and aggregate to a tidy result — then write that result into PostGIS as the shared table everyone queries. With `pg_duckdb` they can even reach into each other live."

### Slide 43 — Cloud-native geospatial formats
Time: 1.5 min
Say: "Quickly, the modern formats — the shapefile era is fading. GeoParquet: columnar, compressed, tiny, the emerging standard for sharing large vector data. PMTiles and vector tiles: a single file that serves interactive maps cheaply, even from static hosting — PostGIS generates them with `ST_AsMVT`. COG and STAC for raster imagery, relevant to environmental-exposure work. And Overture Maps — a huge, openly-licensed dataset of places and buildings as GeoParquet, free context for health analyses."

### Slide 44 — Indexing beyond R-Trees, and choosing a tool
Time: 1.5 min
Say: "One more: H3, a hexagonal global grid that's popular for aggregating point data at scale — and notably, for privacy-preserving aggregation of patient locations into uniform cells, which we'll come back to. The little table is your cheat sheet for tool choice: shared and authoritative → PostGIS; big files on a laptop → DuckDB; interactive dataframe → GeoPandas or sf; archiving → GeoParquet; web map → PMTiles. The through-line again: the spatial SQL transfers across all of it."
Do: Call the break here.
Say: "Five-minute break. When we come back, we build the full clinic-accessibility analysis end-to-end on your own data. Stand up, stretch, refill."

---

## Part VII — Case Study: Clinic Accessibility (~25 min, hands-on)

### Slide 45 — Section divider: Case Study
Time: 15 sec
Say: "Welcome back. Everything we've learned, applied to one question, on your own database."

### Slide 46 — The analysis, start to finish
Time: 1.5 min
Say: "Five steps, each a short lab. One: inventory and sanity-check the data. Two: proximity — population within five kilometres of a clinic. Three: service areas as buffers. Four: aggregate by district into an access rate. Five: validate before we trust it. By the end you'll have a reusable accessibility pipeline — and every step runs in PostGIS or DuckDB."

### Slide 47 — Step 1: inventory & sanity-check
Time: 3 min
Do: Run both queries live.
Say: "Rule one of analysis: before you compute anything, confirm what you have. This UNION query reports each layer's row count and SRID. We're checking three things: all three layers share SRID 4326, so they'll align without transforming; the counts match what we loaded — about 3, 323, and 6; and `ST_IsValid` finds no broken polygons. Real-world data will have invalid geometries — self-intersecting boundaries — and the fix is `ST_MakeValid`. Lab 3.1: run both, confirm matching SRIDs and zero invalid rows before continuing."

### Slide 48 — Step 2: population within 5 km of a clinic
Time: 4 min
Do: Run it live. Use the `{all|2-4|6-9}` build to walk inner then outer query.
Say: "The core measure. For each block, does any clinic sit within 5,000 meters? That's the `EXISTS` subquery with `ST_DWithin` and `::geography`. The outer query then sums population, sums the served population with a FILTER, and computes a percentage. Look at that one line — `ST_DWithin(b.geom::geography, c.geom::geography, 5000)` — it dodges both traps from Part IV at once: it uses the spatial index and it measures real meters."
Say: "Lab 3.2: run it. What percent of the county is within 5 km? Then try 3 km and 10 km — how sensitive is access to the threshold? That sensitivity is itself a finding."

### Slide 49 — Step 3: service areas as buffers
Time: 3 min
Do: Run the buffer and union queries; if you can, `ST_AsGeoJSON` the result and show it on a map.
Say: "Sometimes you want the zone itself — to map it or intersect it. `ST_Buffer` on `geography` grows a true five-kilometre-radius service area around each clinic. `ST_Union` then dissolves the overlapping buffers into one combined coverage polygon you could drop onto a web map. One honest caveat: buffers are circular approximations — segmented polygons that ignore roads and terrain. For real travel-time access you'd use a routing service. Always state that assumption."

### Slide 50 — Step 4: access rate by district
Time: 4 min
Do: Run it live. This is the decision-relevant output — let it breathe.
Say: "Now the output a decision-maker actually wants: a rate per district, so we compare fairly across populations of different sizes. We combine two patterns — the points-in-polygons spatial join with `ST_Contains` to assign blocks to districts, and the within-5km served check via a lateral subquery. Group by district, order by percent served ascending, so the worst-served districts surface at the top."
Say: "Lab 3.3: run it. Which two districts are least served? Those are exactly where you'd consider siting a new clinic. That's the whole point — we've turned a map into a ranked, actionable list."

### Slide 51 — Step 5: validate before you trust it
Time: 3 min
Say: "A number is not an answer until you've checked it — build this habit now. Five cross-checks: do the totals reconcile, is served population never greater than total? Spot-check a known case — pick a block right next to a clinic; is it flagged served? Watch boundary effects — blocks near the county edge may have a clinic just outside your data, so you undercount access. Confirm your units are meters. And test sensitivity — does the ranking hold at 3 km versus 5 km? The little query finds the three nearest blocks to clinic 1 so you can reason about one case by hand."
Say (takeaway): "Validation is the analyst's job — not the database's, and certainly not the AI's. Hold that thought; it's the bridge to Part VIII."

### Slide 52 — Extending the pattern: two more questions
Time: 2 min
Say: "The same building blocks answer far more than clinic access. Notice the recurring verbs: contain, within-distance, buffer, intersect, aggregate. Disease surveillance — cases in districts, normalized by population, is the same points-in-polygons join. Environmental exposure — who lives inside a two-kilometre pollutant buffer — is the same `ST_DWithin`. Once you know the handful of core moves, new questions are just recombinations."

---

## Part VIII — Learning & Doing GIS with Generative AI (~20 min, hands-on)

### Slide 53 — Section divider: GIS with Generative AI
Time: 15 sec
Say: "Last big part — and a timely one. How to use AI to learn and do this work, without getting burned."

### Slide 54 — The mindset, and four ways AI helps
Time: 2.5 min
Say: "Set the mindset first: treat AI as a tireless, fast, occasionally overconfident teaching assistant and pair-programmer — not an oracle. It's excellent at drafting, explaining, and translating. You stay responsible for correctness, ethics, and interpretation. Four concrete roles: a tutor that explains SRIDs or 'why is my distance in degrees' at your level; a code generator and translator between SQL, R, and Python; a debugger you paste errors into; and an analysis copilot that plans a whole workflow — and coding agents can even run the code and iterate with you."

### Slide 55 — How to write a good GIS prompt
Time: 2.5 min
Say: "Output quality tracks input context. A reliable recipe: state the role and your level; state the environment — tool, version, language; describe the data — table names, key columns, the geometry column and type, and crucially the SRID of each layer; state the goal precisely, including the units you want; and state the ask — 'explain each step', 'use a spatial index', 'one query'. The example on the right gives the AI everything: versions, two tables with their geometry types and SRIDs, and a precise request for a per-1,000 rate."

### Slide 56 — Lab 4: drive the AI, then verify it
Time: 4 min
Do: This is the centrepiece lab. Open an AI assistant on screen and actually run the prompt live.
Say: "Lab 4 — the most important exercise of the day. Using your own Riverbend schema, ask an AI to write the 5-km-access-rate-by-district query — our Step 4 — then verify it against the answer you already computed. Here's the prompt; notice it states all SRIDs, all tables, the units, and asks for an explanation."
Say: "Then check the AI like a reviewer: does it use `::geography` or `ST_Transform` — meters, not degrees? Does it use `ST_DWithin`, not bare `ST_Distance`? Run it — does the ranking match your Step 4? And follow up: 'add EXPLAIN ANALYZE and confirm the index is used.'"
Do: Pause and let people run it.
Say (caution): "If its numbers differ from yours, you find out why. That gap-hunting is the skill we're teaching. The AI wrote the code; you own the answer."

### Slide 57 — Copy-ready prompt templates
Time: 1.5 min
Say: "Four reusable templates — fill in the brackets and paste into any assistant. Explain a concept with a clinic example and one common mistake. Translate a query between SQL, sf, and geopandas. Debug an error or an empty result by giving SRIDs and geometry columns. And plan-and-sanity-check a whole workflow with three confirmation checks. Grab these from the repo; they're a starting kit."

### Slide 58 — A safe AI-assisted workflow
Time: 2 min
Say: "Use AI as a loop, not a one-shot. Six steps. One: frame the question yourself — know what a sensible answer looks like; that's your guardrail against confident-but-wrong output. Two: give rich context. Three: ask for an explanation, not just code — it surfaces flawed assumptions. Four: run on a small sample first, a `LIMIT` or a known case. Five: verify against reality, and cross-check function names in the official docs. Six: iterate — feed back what you saw, like 'totals are 10× too high, is it a unit issue?'"

### Slide 59 — Trust, but verify: common AI pitfalls in GIS
Time: 2.5 min
Say: "AI can be confidently wrong in GIS-specific ways. It invents functions and arguments — confirm names in the PostGIS reference. It makes SRID and unit mistakes — degrees on 4326. It forgets that real geometries are invalid. It has performance blind spots — a 'correct' query can be unusably slow. It suggests outdated patterns like psycopg2 — so state your versions. And it glosses over statistical subtlety — MAUP, edge effects, the ecological fallacy — where your expertise is irreplaceable."
Say (takeaway): "And notice — you met every one of these today: degrees versus meters in Step 2, index use in Lab 1, boundary effects in Step 5. That's not a coincidence; it's exactly the checklist to run on AI output."

### Slide 60 — Data privacy & ethics (read this twice)
Time: 3 min — slow down, this is the most important slide ethically.
Say: "Read this one twice. Never paste protected health information — patient addresses or precise coordinates — into a consumer AI chat. Patient locations are among the most re-identifiable data that exist, and pasting them into a public tool may violate HIPAA, GDPR, your IRB protocol, and your data-use agreements all at once."
Say: "What to do instead: share schema, not data — table and column structure, types, SRIDs, never real rows. Use synthetic examples — exactly what we did with Riverbend all day. De-identify and aggregate first, to census tracts or H3 cells, with small-cell suppression. Prefer approved, zero-retention, no-training enterprise AI, or local models near sensitive data — and follow your institution's policy first. And always keep a human in the loop: AI informs analysis; it does not make public-health decisions."
Do: This is the slide to make eye contact and drop the slides for a moment.

### Slide 61 — The AI tooling landscape, and emerging applications
Time: 2 min
Say: "The landscape, briefly. Chat assistants — Claude, ChatGPT, Gemini — to explain and draft. In-editor tools like Copilot and Cursor for autocomplete in place. Coding agents like Claude Code that read files, run queries, and iterate end-to-end. And MCP or text-to-SQL connecting AI to a read-only PostGIS — scope those permissions tightly. On the research frontier: geospatial foundation models like Prithvi and Clay for flood and burn mapping; promptable extraction like SAM-for-geo; 'chat with your map' QGIS plugins; synthetic data for privacy; and `pgvector` combining embeddings with spatial filters."
Say (caution): "Same rules apply: foundation-model output needs ground-truthing, generated code needs verification, and none of it excuses putting real PHI into an unapproved tool."

### Slide 62 — Part VIII key takeaway
Time: 1 min
Say: "To close the AI part: generative AI dramatically lowers the barrier to learning and doing GIS — tutor, translator, debugger, copilot. Get the most from it with rich context, by asking for explanations, and by verifying every result — the same validation habits you practiced in the case study. And never trade your participants' privacy for convenience: share structure, not sensitive data."

---

## Part IX — Pop Quiz (~10 min)

### Slide 63 — Section divider: Pop Quiz
Time: 15 sec
Say: "Quick recall check — eight questions. I'll read each, give you a moment, take a guess from the room, then we reveal. No pressure; this is for you to see what stuck."
Do: Decide your format: hands, chat, or call-outs. Reveal answers with a click.

### Slide 64 — Q1 & Q2
Time: 2.5 min
Say (Q1): "Q1 — a key advantage of PostGIS over shapefiles for collaborative research?"
Do: Take guesses, then click. Answer B — robust concurrent access and integrity; shapefiles have versioning problems.
Say (Q2): "Q2 — best geometry type for county boundaries?"
Do: Click. Answer C, Polygon — areas with defined boundaries.

### Slide 65 — Q3 & Q4
Time: 2.5 min
Say (Q3): "Q3 — the primary purpose of an SRID?"
Do: Click. Answer C — it defines the coordinate system and gives coordinates real-world meaning.
Say (Q4): "Q4 — your `ST_Distance` on 4326 data returns `0.045`. What went wrong?"
Do: This is the day's signature trap — let them answer with confidence. Click. Answer B — it's in degrees; transform to a metric CRS or cast to `geography`.

### Slide 66 — Q5 & Q6
Time: 2.5 min
Say (Q5): "Q5 — to find clinics within 2 km efficiently, the best function?"
Do: Click. Answer B, `ST_DWithin` — tests proximity and uses the index; bare `ST_Distance` can't.
Say (Q6): "Q6 — fast, one-off analysis of a 50-million-row GeoParquet file, no server?"
Do: Click. Answer B, DuckDB with spatial — no server, reads GeoParquet directly, fast.

### Slide 67 — Q7 & Q8
Time: 2 min
Say (Q7): "Q7 — using AI on patient case locations, the most appropriate practice?"
Do: Click. Answer B — describe schema, types, SRIDs plus synthetic examples; never real PHI. Callback to Slide 60.
Say (Q8): "Q8 — a spatial join counting points in polygons is written as…?"
Do: Click. Answer B — `JOIN ON ST_Contains(poly, pt)` plus `GROUP BY`, the pattern from the case study.

---

## Part X — Summary & Resources (~5 min)

### Slide 68 — Section divider: Summary & Resources
Time: 10 sec
Say: "Let's land the plane."

### Slide 69 — Quick summary: what you can now do
Time: 1.5 min
Say: "Look back at what you can now do: set up a lab from one command; reason about geometry types, SRIDs, indexes; avoid the degrees-versus-meters and skip-the-index traps; write spatial predicates, buffers, and the points-in-polygons join; connect from SQL, Python, and R; carry an analysis end-to-end with validation; use the modern GeoParquet-and-DuckDB stack; and work with generative AI using rich context, verification, and privacy."
Say (bottom line): "Bottom line: PostGIS is a durable, shared spatial foundation — and the spatial SQL you learned today carries across the entire modern, AI-assisted ecosystem."

### Slide 70 — Resources for further learning
Time: 1.5 min
Say: "All the links to keep going — official PostGIS and PostgreSQL docs and the spatial SQL reference; geopandas, psycopg, and sf; the modern stack — DuckDB Spatial, GeoParquet, Overture, and the Spatial SQL book; and the GenAI-in-geospatial frontier — Prithvi, Clay, segment-geospatial, pgvector. The slides and repo are yours; everything's clickable."

### Slide 71 — Thank you
Time: 1 min
Say: "Thank you. One ask to keep the momentum: re-run the clinic-accessibility case study on your own data, with an AI assistant as your tutor — and verify every result. Remember the three habits we drilled all day: state your tool and version, share schema and SRIDs but never PHI, and verify every result. Questions — I'm happy to stay."
Do: Open the floor. Share the repo link and your contact.

---

## Quick reference — live-demo checklist

Run these yourself on screen at the moments flagged above:

1. Slide 5 — kick off `docker pull` / `docker run` so it downloads during Part II–III.
2. Slide 13 — DuckDB `pip install` + 3-line point test.
3. Slide 14 — `docker run` PostGIS + `CREATE EXTENSION postgis`.
4. Slide 16–17 — create `clinics`, `blocks`, `districts`; `SELECT count(*)`.
5. Slide 23 — the WRONG distance (`0.045`) then the two fixes.
6. Slide 26 — `EXPLAIN ANALYZE` with and without the index.
7. Slides 47–51 — the five case-study steps, in order, live.
8. Slide 56 — prompt a real AI assistant, then verify against Step 4.

If you fall behind: Parts IV and VII are the core — protect their time. Trim Part VI (talk to one comparison slide), shorten the quiz to four questions, and reference the resources slide rather than reading it.
