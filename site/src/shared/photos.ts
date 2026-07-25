/**
 * Acesso às fotografias. A estrutura vem de `photos.data.ts` (gerado por
 * `npm run photos`); os URLs vêm do Vite via `import.meta.glob`, para que
 * acrescentar uma foto ao manifesto não obrigue a mexer em código.
 *
 * Cada foto tem 2 larguras em JPEG e WebP — use com `<picture>` + `srcset`.
 */
import { PHOTO_META, type PhotoMeta } from './photos.data'

const urls = import.meta.glob('../assets/img/*.{jpg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

/** filename ("slug-640.webp") → URL final com hash. */
const byFile = new Map<string, string>()
for (const [path, url] of Object.entries(urls)) {
  byFile.set(path.slice(path.lastIndexOf('/') + 1), url)
}

const need = (file: string): string => {
  const url = byFile.get(file)
  if (!url) throw new Error(`foto em falta: ${file} — correr \`npm run photos\``)
  return url
}

export type Photo = PhotoMeta & {
  /** Maior JPEG — o `src` de fallback. */
  src: string
  /** Pronto para `<source type="image/webp">`. */
  webpSrcSet: string
  /** Pronto para `<img srcset>`. */
  jpgSrcSet: string
  /** Proporção, para `aspect-ratio` sem CLS. */
  ratio: number
}

const build = (m: PhotoMeta): Photo => ({
  ...m,
  src: need(`${m.slug}.jpg`),
  webpSrcSet: `${need(`${m.slug}-${m.small}.webp`)} ${m.small}w, ${need(`${m.slug}.webp`)} ${m.large}w`,
  jpgSrcSet: `${need(`${m.slug}-${m.small}.jpg`)} ${m.small}w, ${need(`${m.slug}.jpg`)} ${m.large}w`,
  ratio: m.width / m.height,
})

/** Todas as fotos, na ordem curada do manifesto. */
export const PHOTOS: Photo[] = PHOTO_META.map(build)

const bySlug = new Map(PHOTOS.map((p) => [p.slug, p]))

export function photo(slug: string): Photo {
  const p = bySlug.get(slug)
  if (!p) throw new Error(`slug de foto desconhecido: ${slug}`)
  return p
}

export const GALLERY: Photo[] = PHOTOS.filter((p) => p.group === 'gallery')
export const HEROES: Photo[] = PHOTOS.filter((p) => p.group === 'hero')
export const PRODUTOS: Photo[] = PHOTOS.filter((p) => p.group === 'produtos')

/** As três dela, por papel. */
export const ERICA = {
  hero: PHOTOS.find((p) => p.group === 'erica' && p.role === 'hero')!,
  sobre: PHOTOS.find((p) => p.group === 'erica' && p.role === 'sobre')!,
  prova: PHOTOS.find((p) => p.group === 'erica' && p.role === 'prova')!,
}

/** Tons de ruivo presentes na galeria, na ordem em que aparecem. */
export const TONES: string[] = [...new Set(GALLERY.map((p) => p.tone).filter(Boolean) as string[])]
