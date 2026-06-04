# Interactive Spatial Explorer

A zero-install, in-browser companion to **The PostGIS Almanac** lecture, deployed at
**[postgis.son.do/interactive](https://postgis.son.do/interactive/)**.

Students explore **real Korean public-health GIS** on a live map — toggle layers, drop a
**buffer** to count facilities within a radius (the visual form of `ST_Buffer` + `ST_DWithin`),
and run the lecture's `ST_*` spatial SQL in an **in-browser DuckDB console** — with no
database server and nothing to install.

## How it works

A browser cannot open a raw PostgreSQL connection, and the site is hosted on static
GitHub Pages. So instead of a live DB connection, the explorer ships a **small, simplified,
reprojected snapshot** of the teaching database and runs everything client-side:

| Concern | Tool |
|---|---|
| Map rendering | **MapLibre GL JS** (no API key) over a CARTO basemap |
| Client geometry (buffers, point-in-radius) | **Turf.js** |
| In-browser spatial SQL (`ST_Contains`, `ST_Distance`, `ST_Buffer`…) | **DuckDB-WASM** + `spatial` extension |
| Data | GeoJSON in [`data/`](./data), exported from PostGIS (5179 → 4326) |

Everything except the CDN libraries is static. The DuckDB `spatial` extension loads from
the DuckDB extension repository at first query.

## Files

```
interactive/
  index.html        # shell + sidebar
  app.js            # map, layers, buffer tool, DuckDB console
  style.css         # "Vintage Almanac" theme (matches the deck)
  data/*.geojson    # simplified, reprojected snapshot layers
  data/meta.json    # live row counts shown in the header
  export/export.sh  # regenerates data/ from a read-only DB_URL
```

## Refreshing / extending the data

The snapshot is built by one re-runnable script. It needs `psql` and a read-only
`DB_URL` (never commit credentials — `.env` is git-ignored):

```bash
set -a && source ../../.env && set +a   # provides DB_URL
cd interactive/export && ./export.sh
```

`export.sh` is also the clearest reference for the exact PostGIS SQL used to build each
layer — simplification, `ST_Transform`, and the Korean→English category mapping for
hospital types. Add a new `emit ...` block to ship another layer, then register it in the
`LAYERS` array in `app.js`.

## Local preview

```bash
cd interactive && python3 -m http.server 8899
# open http://localhost:8899/
```
