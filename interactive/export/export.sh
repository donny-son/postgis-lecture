#!/usr/bin/env bash
#
# export.sh — build the GeoJSON snapshots the /interactive explorer ships.
#
# These are SMALL, simplified, reprojected (Korea 5179 -> WGS84 4326) extracts
# of the real teaching database, so the whole explorer runs client-side on a
# static host (GitHub Pages) with no live database connection required.
#
# Re-run whenever the source data changes:
#   set -a && source ../../.env && set +a   # provides DB_URL (read-only)
#   ./export.sh
#
# Requires: psql on PATH and a reachable, read-only $DB_URL.
set -euo pipefail

DB_URL="${DB_URL:?Set DB_URL (e.g. 'set -a && source ../../.env && set +a')}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/data"
mkdir -p "$OUT"

# Emit one GeoJSON FeatureCollection from an arbitrary feature subquery.
# $1 = output filename, $2 = SQL producing rows of json features named "f".
emit() {
  local file="$1" inner="$2"
  echo "  -> $file"
  psql "$DB_URL" -X -q -t -A -o "$OUT/$file" -c "
    SELECT json_build_object(
      'type','FeatureCollection',
      'features', COALESCE(json_agg(f), '[]'::json)
    )
    FROM ( $inner ) s;"
}

echo "Exporting snapshots to $OUT"

# --- Provinces (SIDO): 17 polygons, simplified to ~200 m in projected space ---
emit provinces.geojson "
  SELECT json_build_object(
    'type','Feature',
    'properties', json_build_object('adm_cd',adm_cd,'name',adm_nm),
    'geometry', ST_AsGeoJSON(ST_Transform(
                  ST_SimplifyPreserveTopology(geometry, 200), 4326), 6)::json
  ) AS f
  FROM \"SIDO_BORDERS\"
  WHERE year = 2022"

# --- Districts (SGG): 250 polygons, simplified to ~120 m -----------------------
emit districts.geojson "
  SELECT json_build_object(
    'type','Feature',
    'properties', json_build_object('adm_cd',adm_cd,'name',adm_nm),
    'geometry', ST_AsGeoJSON(ST_Transform(
                  ST_SimplifyPreserveTopology(geometry, 120), 4326), 6)::json
  ) AS f
  FROM \"SGG_BORDERS\"
  WHERE year = 2022"

# --- Hospitals: all general + regular hospitals, plus a sample of clinics ------
# Korean s_type buckets mapped to English categories for the legend.
emit hospitals.geojson "
  SELECT json_build_object(
    'type','Feature',
    'properties', json_build_object(
       'name', name, 's_type', s_type,
       'category', CASE
         WHEN s_type='종합병원' THEN 'General hospital'
         WHEN s_type='병원' THEN 'Hospital'
         WHEN s_type LIKE '요양병원%' THEN 'Nursing hospital'
         WHEN s_type='한방병원' THEN 'Oriental hospital'
         WHEN s_type='의원' THEN 'Clinic'
         WHEN s_type='치과의원' THEN 'Dental clinic'
         WHEN s_type='한의원' THEN 'Oriental clinic'
         WHEN s_type LIKE '보건%' THEN 'Public health center'
         ELSE 'Other' END,
       'beds', COALESCE(n_bed,0), 'address', address),
    'geometry', ST_AsGeoJSON(ST_Transform(geom,4326), 6)::json
  ) AS f
  FROM (
    -- every hospital with beds (the decision-relevant facilities)
    SELECT name,s_type,n_bed,address,geom FROM hospitals
      WHERE s_type IN ('종합병원','병원','한방병원','정신병원')
         OR s_type LIKE '요양병원%'
    UNION ALL
    -- a reproducible 1-in-40 sample of the dense outpatient clinics
    SELECT name,s_type,n_bed,address,geom FROM hospitals
      WHERE s_type IN ('의원','치과의원','한의원','보건소','보건지소','보건진료소')
        AND abs(hashtext(name||COALESCE(address,''))) % 40 = 0
  ) h
  WHERE geom IS NOT NULL"

# --- Air-quality monitoring sites (latest snapshot year) -----------------------
emit air_sites.geojson "
  SELECT json_build_object(
    'type','Feature',
    'properties', json_build_object('station',station_cd,'name',adm_nm,'address',address,'year',year),
    'geometry', ST_AsGeoJSON(ST_Transform(geometry,4326), 6)::json
  ) AS f
  FROM \"AIR_KOREA_MONITORING_SITES\"
  WHERE year = (SELECT max(year) FROM \"AIR_KOREA_MONITORING_SITES\")
    AND geometry IS NOT NULL"

# --- Airports ------------------------------------------------------------------
emit airports.geojson "
  SELECT json_build_object(
    'type','Feature',
    'properties', json_build_object('name',name,'address',address),
    'geometry', ST_AsGeoJSON(ST_Transform(geometry,4326), 6)::json
  ) AS f
  FROM airport
  WHERE geometry IS NOT NULL AND year = (SELECT max(year) FROM airport)"

# --- Rail stations -------------------------------------------------------------
emit rail_stations.geojson "
  SELECT json_build_object(
    'type','Feature',
    'properties', json_build_object('name', \"STATION_NA\", 'line', \"RAILWAY\"),
    'geometry', ST_AsGeoJSON(ST_Transform(geometry,4326), 6)::json
  ) AS f
  FROM railstation
  WHERE geometry IS NOT NULL AND year = (SELECT max(year) FROM railstation)"

# --- Dataset metadata: live counts so the UI can show real totals --------------
echo "  -> meta.json"
psql "$DB_URL" -X -q -t -A -o "$OUT/meta.json" -c "
  SELECT json_build_object(
    'generated', now()::date,
    'srid_source', 5179,
    'srid_web', 4326,
    'counts', json_build_object(
      'hospitals', (SELECT count(*) FROM hospitals),
      'general_hospitals', (SELECT count(*) FROM hospitals WHERE s_type='종합병원'),
      'provinces', (SELECT count(*) FROM \"SIDO_BORDERS\" WHERE year=2022),
      'districts', (SELECT count(*) FROM \"SGG_BORDERS\" WHERE year=2022),
      'air_sites', (SELECT count(*) FROM \"AIR_KOREA_MONITORING_SITES\" WHERE year=(SELECT max(year) FROM \"AIR_KOREA_MONITORING_SITES\")),
      'bus_stops', (SELECT count(*) FROM bus_stop),
      'rail_stations', (SELECT count(*) FROM railstation WHERE year=(SELECT max(year) FROM railstation)),
      'airports', (SELECT count(*) FROM airport WHERE year=(SELECT max(year) FROM airport))
    )
  );"

echo "Done. Sizes:"
( cd "$OUT" && ls -la *.geojson *.json )
