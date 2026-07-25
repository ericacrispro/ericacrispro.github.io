/**
 * O logótipo da Érica, nas variantes que ela entregou.
 *
 * `assinatura` = marca completa (chama-raposa + ERICA Gonçalves + especialista
 * em ruivos). `icone` = só a chama-raposa. `selo` = versão circular.
 *
 * Cor: `branca` para fundos escuros/fotografia, `laranja` e `oliva` para fundos
 * claros, `duas-cores` para a assinatura oficial sobre branco.
 */
import { LOGO_DIMS } from './logo.data'

const files = import.meta.glob('../assets/logo/*.{png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const url = (name: string, ext: string): string => {
  const hit = Object.entries(files).find(([p]) => p.endsWith(`/${name}.${ext}`))
  if (!hit) throw new Error(`logótipo em falta: ${name}.${ext} — correr \`node scripts/logos.mjs\``)
  return hit[1]
}

export type LogoShape = 'assinatura' | 'icone' | 'selo'
export type LogoColor = 'duas-cores' | 'laranja' | 'oliva' | 'branca'

type Props = {
  shape?: LogoShape
  color?: LogoColor
  /** Texto para leitores de ecrã. Vazio quando o nome já está em texto ao lado. */
  alt: string
  className?: string
  /** Altura em CSS; a largura segue a proporção real. */
  height?: string
  priority?: boolean
}

/** O ícone e o selo não têm variante "duas-cores" com o mesmo sufixo do resto. */
function nameFor(shape: LogoShape, color: LogoColor): string {
  if (shape === 'assinatura') return `assinatura-${color}`
  if (shape === 'icone') return color === 'branca' ? 'icone-branco' : `icone-${color}`
  return color === 'branca' ? 'selo-branco' : `selo-${color === 'duas-cores' ? 'oliva' : color}`
}

export function Logo({ shape = 'assinatura', color = 'duas-cores', alt, className, height, priority }: Props) {
  const name = nameFor(shape, color)
  const dim = LOGO_DIMS[name] ?? { width: 1, height: 1 }
  return (
    <picture className={className} style={height ? { height, display: 'block' } : undefined}>
      <source type="image/webp" srcSet={url(name, 'webp')} />
      <img
        src={url(name, 'png')}
        alt={alt}
        width={dim.width}
        height={dim.height}
        loading="eager"
        fetchPriority={priority ? 'high' : 'low'}
        style={height ? { height: '100%', width: 'auto' } : undefined}
      />
    </picture>
  )
}
