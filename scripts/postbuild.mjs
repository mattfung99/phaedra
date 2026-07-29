// Runs after the SSG build:
//  1. copies index.html -> 404.html so client-side deep links work on GitHub Pages
//     (real posts are pre-rendered to their own 200 files; 404 only catches unknowns)
//  2. generates sitemap.xml from the pre-rendered public pages (admin/login excluded)
import { readdirSync, statSync, copyFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const DIST = 'dist'
const SITE_URL = (
  process.env.SITE_URL || 'https://mattfung99.github.io/phaedra'
).replace(/\/$/, '')
const EXCLUDE = ['admin', 'login']

copyFileSync(join(DIST, 'index.html'), join(DIST, '404.html'))

const routes = []
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      walk(full)
    } else if (entry === 'index.html') {
      routes.push(relative(DIST, dir).split('\\').join('/'))
    }
  }
}
walk(DIST)

const urls = routes
  .filter((r) => !EXCLUDE.some((e) => r === e || r.startsWith(`${e}/`)))
  .map((r) => (r === '' ? `${SITE_URL}/` : `${SITE_URL}/${r}/`))
  .sort()

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`
writeFileSync(join(DIST, 'sitemap.xml'), xml)
console.log(`postbuild: wrote 404.html + sitemap.xml (${urls.length} urls)`)
