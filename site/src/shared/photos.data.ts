/**
 * GERADO por `npm run photos` — não editar à mão.
 * Estrutura das fotografias. Os textos alternativos estão no conteúdo, por
 * idioma: `content.photoAlt[slug]`.
 */

export type PhotoGroup = 'erica' | 'hero' | 'gallery' | 'produtos'

export type PhotoMeta = {
  slug: string
  group: PhotoGroup
  /** Papel dentro do grupo `erica`: hero | sobre | prova. */
  role: string | null
  /** Tom do ruivo, quando aplicável — usado pelas versões que filtram por cor. */
  tone: string | null
  /** Rosto identificável? As versões prudentes preferem `false`. */
  faceVisible: boolean | null
  /** Dimensões do original (proporção real, para evitar CLS). */
  width: number
  height: number
  /** Larguras geradas. */
  small: number
  large: number
}

export const PHOTO_META: PhotoMeta[] = [
  {
    "slug": "erica-retrato-estudio",
    "group": "erica",
    "role": "hero",
    "tone": null,
    "faceVisible": null,
    "width": 2688,
    "height": 4032,
    "small": 900,
    "large": 1600
  },
  {
    "slug": "erica-sorriso-salao",
    "group": "erica",
    "role": "sobre",
    "tone": null,
    "faceVisible": null,
    "width": 2316,
    "height": 3088,
    "small": 900,
    "large": 1600
  },
  {
    "slug": "erica-raposa-croche",
    "group": "erica",
    "role": "prova",
    "tone": null,
    "faceVisible": null,
    "width": 1080,
    "height": 1420,
    "small": 900,
    "large": 1600
  },
  {
    "slug": "ruivo-acaju-camadas-longas",
    "group": "hero",
    "role": null,
    "tone": null,
    "faceVisible": null,
    "width": 3024,
    "height": 4032,
    "small": 1100,
    "large": 1900
  },
  {
    "slug": "caracois-ruivos-cobre-volume",
    "group": "hero",
    "role": null,
    "tone": null,
    "faceVisible": null,
    "width": 3024,
    "height": 4032,
    "small": 1100,
    "large": 1900
  },
  {
    "slug": "ruivo-acaju-ondas-medias",
    "group": "hero",
    "role": null,
    "tone": null,
    "faceVisible": null,
    "width": 1200,
    "height": 1600,
    "small": 1100,
    "large": 1900
  },
  {
    "slug": "ruivo-laranja-vivo-ondas-longas",
    "group": "gallery",
    "role": null,
    "tone": "laranja",
    "faceVisible": true,
    "width": 3024,
    "height": 4032,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "ruivo-cobre-ondas-volumosas",
    "group": "gallery",
    "role": null,
    "tone": "cobre",
    "faceVisible": true,
    "width": 3024,
    "height": 4032,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "ruivo-gengibre-franja-cortina",
    "group": "gallery",
    "role": null,
    "tone": "gengibre",
    "faceVisible": true,
    "width": 3024,
    "height": 4032,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "ruivo-gengibre-ondas-compridas",
    "group": "gallery",
    "role": null,
    "tone": "gengibre",
    "faceVisible": true,
    "width": 3024,
    "height": 4032,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "ruivo-cereja-vinho-ondas",
    "group": "gallery",
    "role": null,
    "tone": "cereja",
    "faceVisible": true,
    "width": 3024,
    "height": 4032,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "ruivo-acaju-liso-camadas",
    "group": "gallery",
    "role": null,
    "tone": "acaju",
    "faceVisible": true,
    "width": 3024,
    "height": 4032,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "caracois-acaju-compridos",
    "group": "gallery",
    "role": null,
    "tone": "acaju",
    "faceVisible": true,
    "width": 3024,
    "height": 4032,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "ruivo-cereja-medio-camadas",
    "group": "gallery",
    "role": null,
    "tone": "cereja",
    "faceVisible": true,
    "width": 3024,
    "height": 4032,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "ruivo-escuro-liso-comprido",
    "group": "gallery",
    "role": null,
    "tone": "ruivo-escuro",
    "faceVisible": true,
    "width": 3024,
    "height": 4032,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "ruivo-cobre-dourado-ondas",
    "group": "gallery",
    "role": null,
    "tone": "cobre",
    "faceVisible": true,
    "width": 1536,
    "height": 2048,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "erica-com-cliente-ruivo-comprido",
    "group": "gallery",
    "role": null,
    "tone": "cobre",
    "faceVisible": true,
    "width": 1080,
    "height": 1423,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "coloracao-fantasia-laranja-fogo",
    "group": "gallery",
    "role": null,
    "tone": "laranja",
    "faceVisible": false,
    "width": 1080,
    "height": 1576,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "caracois-acaju-medios",
    "group": "gallery",
    "role": null,
    "tone": "acaju",
    "faceVisible": true,
    "width": 3024,
    "height": 4032,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "ruivo-gengibre-comprido-ondulado",
    "group": "gallery",
    "role": null,
    "tone": "gengibre",
    "faceVisible": true,
    "width": 3024,
    "height": 4032,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "ruivo-acaju-escuro-medio",
    "group": "gallery",
    "role": null,
    "tone": "acaju",
    "faceVisible": true,
    "width": 1200,
    "height": 1600,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "ruivo-cobre-caramelo-liso",
    "group": "gallery",
    "role": null,
    "tone": "cobre",
    "faceVisible": false,
    "width": 1078,
    "height": 1440,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "kc-color-cachorro-caramelo-frasco",
    "group": "produtos",
    "role": null,
    "tone": null,
    "faceVisible": null,
    "width": 4000,
    "height": 6000,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "kc-color-gama-tons-ruivos",
    "group": "produtos",
    "role": null,
    "tone": null,
    "faceVisible": null,
    "width": 4000,
    "height": 6000,
    "small": 640,
    "large": 1200
  },
  {
    "slug": "erica-com-coloracao-kc-color",
    "group": "produtos",
    "role": null,
    "tone": null,
    "faceVisible": null,
    "width": 2688,
    "height": 4032,
    "small": 640,
    "large": 1200
  }
]
