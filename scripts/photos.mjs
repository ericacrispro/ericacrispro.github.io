/**
 * Optimiza as fotografias da Erica (`docs da erica/`, git-ignorado) para
 * `site/src/assets/img/` (versionado) e gera `site/src/shared/photos.data.ts`.
 *
 *   npm run photos
 *
 * A curadoria (que foto entra, em que papel, com que tom) está em
 * `scripts/photo-manifest.json`. Este script só executa: recorta nada, roda o
 * EXIF (sharp `.rotate()`), gera 2 larguras em JPEG progressivo + WebP.
 *
 * Os textos alternativos NÃO vivem aqui — vivem no conteúdo, por idioma
 * (`site/src/content/*.ts`, chave `photoAlt[slug]`). Aqui só a estrutura.
 */
import sharp from 'sharp'
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'

const SRC = 'docs da erica'
const OUT = 'site/src/assets/img'
const manifest = JSON.parse(readFileSync('scripts/photo-manifest.json', 'utf8'))

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

/** Larguras por papel. O hero precisa de resolução; a galeria vive em grelha. */
const WIDTHS = {
  erica: [900, 1600],
  hero: [1100, 1900],
  gallery: [640, 1200],
  produtos: [640, 1200],
}

const entries = []
const seen = new Set()

for (const group of ['erica', 'hero', 'gallery', 'produtos']) {
  for (const item of manifest[group] ?? []) {
    if (seen.has(item.slug)) continue
    seen.add(item.slug)

    const widths = WIDTHS[group]
    const input = `${SRC}/${item.file}`
    const meta = await sharp(input).rotate().metadata()

    for (const w of widths) {
      const suffix = w === Math.max(...widths) ? '' : `-${w}`
      const base = sharp(input).rotate().resize({ width: w, withoutEnlargement: true })
      await base.clone().jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile(`${OUT}/${item.slug}${suffix}.jpg`)
      await base.clone().webp({ quality: 76 }).toFile(`${OUT}/${item.slug}${suffix}.webp`)
    }

    entries.push({
      slug: item.slug,
      group,
      role: item.role ?? null,
      tone: item.tone ?? null,
      faceVisible: item.faceVisible ?? null,
      width: meta.width,
      height: meta.height,
      small: Math.min(...widths),
      large: Math.max(...widths),
    })
    console.log(`✓ ${item.slug} (${meta.width}×${meta.height})`)
  }
}

const ts = `/**
 * GERADO por \`npm run photos\` — não editar à mão.
 * Estrutura das fotografias. Os textos alternativos estão no conteúdo, por
 * idioma: \`content.photoAlt[slug]\`.
 */

export type PhotoGroup = 'erica' | 'hero' | 'gallery' | 'produtos'

export type PhotoMeta = {
  slug: string
  group: PhotoGroup
  /** Papel dentro do grupo \`erica\`: hero | sobre | prova. */
  role: string | null
  /** Tom do ruivo, quando aplicável — usado pelas versões que filtram por cor. */
  tone: string | null
  /** Rosto identificável? As versões prudentes preferem \`false\`. */
  faceVisible: boolean | null
  /** Dimensões do original (proporção real, para evitar CLS). */
  width: number
  height: number
  /** Larguras geradas. */
  small: number
  large: number
}

export const PHOTO_META: PhotoMeta[] = ${JSON.stringify(entries, null, 2)}
`

writeFileSync('site/src/shared/photos.data.ts', ts)
console.log(`\n✓ ${entries.length} fotografias · site/src/shared/photos.data.ts`)
