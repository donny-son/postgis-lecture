import { defineAppSetup } from '@slidev/types'

// Workaround for a Slidev base-path navigation bug.
//
// When the deck is built with a non-root base (e.g. `--base /slides/` for
// deployment under https://postgis.son.do/slides/), Slidev's `getSlidePath`
// produces paths that already include the base — `/slides/2` — and then pushes
// them to the router. But vue-router's history base is *also* `/slides/`, and
// its routes are base-relative (`/:no`). vue-router does not strip the base
// from pushed paths, so `/slides/2` fails to match the slide route, falls
// through to the catch-all 404, and the URL ends up doubled: `/slides/slides/2`.
//
// We fix it at the router level: strip a leading base segment from any pushed
// path so the slide routes match again and URLs stay clean (`/slides/2`).
export default defineAppSetup(({ router }) => {
  const base = import.meta.env.BASE_URL
  // Nothing to do when deployed at the site root.
  if (!base || base === '/')
    return

  const strip = (path: string) =>
    path.startsWith(base) ? `/${path.slice(base.length)}` : path

  const fixLocation = (to: any) => {
    if (typeof to === 'string')
      return strip(to)
    if (to && typeof to.path === 'string')
      return { ...to, path: strip(to.path) }
    return to
  }

  const originalPush = router.push.bind(router)
  const originalReplace = router.replace.bind(router)
  router.push = (to: any) => originalPush(fixLocation(to))
  router.replace = (to: any) => originalReplace(fixLocation(to))
})
