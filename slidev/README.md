# The PostGIS Almanac — Slidev Presentation

An academic web presentation of the lecture **"Spatial Databases (PostGIS) &
AI-Assisted GIS for Public Health Research"**, built with
[Slidev](https://sli.dev/).

It is a slide-deck adaptation of the interactive lecture in the repository root
(`index.html`), preserving its content and the warm "Vintage Almanac" aesthetic
(Fraunces · Newsreader · IBM Plex Mono; terracotta + botanical-green palette).

## Contents

The deck follows the lecture's nine parts:

1. **Overview** — goals and scope
2. **Why spatial databases?** — spatial data in public health; limits of CSV / shapefiles
3. **PostGIS fundamentals** — PostgreSQL & PostGIS; geometry types, SRID, spatial indexes
4. **Connecting & querying** — R (`sf`/`DBI`), Python (`geopandas`/`psycopg` v3), SQL
5. **The modern geospatial stack (2026)** — DuckDB, GeoParquet, cloud-native formats, H3
6. **Real-world applications** — surveillance, accessibility, environmental exposure
7. **Learning GIS with generative AI** — tutor/translator/debugger/copilot, prompts, safety, privacy
8. **Pop quiz** — seven click-to-reveal questions
9. **Summary & resources**

## Getting started

Requires Node.js 18+.

```bash
npm install     # install dependencies
npm run dev     # start the dev server (opens http://localhost:3030)
```

Then edit `slides.md` — changes hot-reload in the browser.

## Build & export

```bash
npm run build       # static site -> dist/  (deploy anywhere)
npm run export      # export to PDF / PNG (needs playwright-chromium)
```

## Presenting

- Navigate with the arrow keys / space.
- Press `f` for fullscreen, `o` for the slide overview, `d` for dark mode.
- The presenter view (with speaker notes) is at `/presenter`.

## Customization

- **Content** lives in `slides.md` (Markdown, one slide per `---` separator).
- **Theme & palette** live in `styles/index.css` (imported via `style.css`),
  ported from the lecture's `tokens.css`.

## Relationship to the original lecture

Interactive behaviors in the HTML lecture (collapsible cards, copyable code,
tabs) are reframed for a linear talk: cards become side-by-side panels, tabs
become consecutive slides, and quiz answers reveal on click (`v-click`). All
substantive content is carried over.
