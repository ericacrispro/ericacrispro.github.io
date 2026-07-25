/**
 * Baixa as famílias do Google Fonts e embute-as como data URI (subset `latin`).
 * Resultado: `site/src/assets/fonts/<slug>.css` — sem CDN, sem FOIT, funciona
 * offline e dentro de artifacts com CSP.
 *
 *   npm run fonts
 *
 * `fonts.css` é o trio da marca (Bodoni Moda + Archivo + Sacramento) num só
 * ficheiro; as outras famílias ficam avulsas e cada versão importa só a sua.
 *
 * Subset `latin` chega para português (ã ç õ é í ú â ê ô à). `latin-ext` é para
 * o Leste Europeu — dobrava o peso sem ganho.
 */
import { writeFileSync, mkdirSync } from 'node:fs'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

const OUT = 'site/src/assets/fonts'
mkdirSync(OUT, { recursive: true })

/** slug → especificação da família como o Google Fonts a pede. */
const FAMILIES = {
  'bodoni-moda': 'Bodoni Moda:ital,opsz,wght@0,6..96,400..800;1,6..96,400..700',
  archivo: 'Archivo:ital,wght@0,400..700;1,400',
  sacramento: 'Sacramento',
  marcellus: 'Marcellus',
  anton: 'Anton',
  epilogue: 'Epilogue:ital,wght@0,400..800;1,400',
  'eb-garamond': 'EB Garamond:ital,wght@0,400..700;1,400',
  'bricolage-grotesque': 'Bricolage Grotesque:opsz,wght@12..96,300..800',
}

/** O trio da marca vai junto em fonts.css — é o que quase toda a versão usa. */
const CORE = ['bodoni-moda', 'archivo', 'sacramento']

const wanted = new Set(['latin'])

/** Descarrega uma família e devolve o CSS com os woff2 já em base64. */
async function fetchFamily(spec) {
  const url =
    'https://fonts.googleapis.com/css2?family=' +
    encodeURIComponent(spec).replace(/%3A/g, ':').replace(/%40/g, '@').replace(/%2C/g, ',').replace(/%3B/g, ';') +
    '&display=swap'
  const css = await fetch(url, { headers: { 'User-Agent': UA } }).then((r) => r.text())
  if (css.startsWith('<')) throw new Error(`Google recusou "${spec}" — verifica o nome da família`)

  let out = ''
  // Cada bloco vem precedido de um comentário com o nome do subset.
  for (const block of css.split('/* ').slice(1)) {
    const subset = block.slice(0, block.indexOf(' */')).trim()
    if (!wanted.has(subset)) continue
    let face = block.slice(block.indexOf('*/') + 2)
    const m = face.match(/url\((https:\/\/[^)]+\.woff2)\)/)
    if (!m) continue
    const buf = Buffer.from(await fetch(m[1], { headers: { 'User-Agent': UA } }).then((r) => r.arrayBuffer()))
    face = face.replace(m[0], `url(data:font/woff2;base64,${buf.toString('base64')})`)
    out += face.trim() + '\n'
  }
  if (!out) throw new Error(`nenhum @font-face latin em "${spec}"`)
  return out
}

const bySlug = {}
for (const [slug, spec] of Object.entries(FAMILIES)) {
  const css = await fetchFamily(spec)
  bySlug[slug] = css
  const body = `/* ${spec.split(':')[0]} — self-hosted (base64, subset latin). Gerado por scripts/fonts.mjs. */\n${css}`
  writeFileSync(`${OUT}/${slug}.css`, body)
  console.log(`✓ ${slug}.css — ${(body.length / 1024).toFixed(0)} KB`)
}

const core =
  '/* Trio da marca: Bodoni Moda (display) + Archivo (corpo) + Sacramento (assinatura).\n' +
  '   Gerado por scripts/fonts.mjs — não editar à mão. */\n' +
  CORE.map((s) => bySlug[s]).join('\n')
writeFileSync('site/src/assets/fonts.css', core)
console.log(`\n✓ fonts.css (trio da marca) — ${(core.length / 1024).toFixed(0)} KB`)
