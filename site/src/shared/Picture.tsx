/**
 * `<picture>` com WebP + JPEG e `srcset`, dimensões explícitas (sem CLS).
 *
 * Armadilhas já pagas no projecto da Aline, respeitadas aqui:
 *  - `<picture>` é inline por natureza: leva `display:block` nos tokens.
 *  - `loading="lazy"` + captura de página inteira = foto branca no screenshot.
 *    Por isso o `lazy` é opt-in explícito, nunca o default.
 *  - **`decoding="async"` tem o mesmo efeito** (descoberto por vários agentes ao
 *    construir as versões): o Chrome headless redimensiona a janela para a
 *    captura e não chega a descodificar as imagens que nunca estiveram no ecrã,
 *    e a página sai sem uma única fotografia. Como é por estas capturas que a
 *    Érica escolhe, o default aqui é `sync`. Em produção o custo é baixo: as
 *    imagens já vêm em duas larguras e ~60–120 KB cada.
 */
import type { Photo } from './photos'

type Props = {
  photo: Photo
  alt: string
  className?: string
  /** `sizes` do srcset. Default: largura total do ecrã. */
  sizes?: string
  /** Hero: `eager` + `high`. Tudo o resto: `eager` + `low` (ver armadilha acima). */
  priority?: boolean
  /** Só para grelhas muito longas, e nunca acima da dobra. */
  lazy?: boolean
  style?: React.CSSProperties
  /** Sobrepõe a proporção real (quando o CSS recorta com `object-fit`). */
  ratio?: number | 'auto'
}

export function Picture({ photo, alt, className, sizes = '100vw', priority, lazy, style, ratio }: Props) {
  const aspect = ratio === 'auto' ? undefined : ratio ? String(ratio) : undefined
  return (
    <picture className={className} style={style}>
      <source type="image/webp" srcSet={photo.webpSrcSet} sizes={sizes} />
      <img
        src={photo.src}
        srcSet={photo.jpgSrcSet}
        sizes={sizes}
        alt={alt}
        width={photo.width}
        height={photo.height}
        loading={lazy ? 'lazy' : 'eager'}
        fetchPriority={priority ? 'high' : 'low'}
        decoding="sync"
        style={aspect ? { aspectRatio: aspect } : undefined}
      />
    </picture>
  )
}
