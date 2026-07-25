/**
 * Selector de idioma: pt-PT (principal), pt-BR, EN.
 *
 * É um `<select>` nativo de propósito — funciona no teclado, no leitor de ecrã e
 * no iOS sem uma linha de JS de menu. Cada versão veste-o pelo `className`.
 */
import { LANGS, getLang, setLang, type Lang } from '../i18n'
import type { Content } from '../i18n'

/** Etiquetas curtas para as versões que só têm espaço para três letras. */
export const SHORT_LABEL: Record<Lang, string> = { 'pt-PT': 'PT', 'pt-BR': 'BR', en: 'EN' }

type Props = {
  t: Content
  className?: string
  /** `curto` mostra PT/BR/EN; `longo` mostra o nome do idioma. */
  variant?: 'curto' | 'longo'
  id?: string
}

export function LangSwitch({ t, className, variant = 'curto', id = 'lang' }: Props) {
  const current = getLang()
  return (
    <>
      <label className="visually-hidden" htmlFor={id}>
        {t.nav.idioma}
      </label>
      <select
        id={id}
        className={className}
        value={current}
        onChange={(e) => setLang(e.target.value as Lang)}
      >
        {LANGS.map((lang) => (
          <option key={lang} value={lang}>
            {variant === 'curto' ? SHORT_LABEL[lang] : t.idiomas[lang]}
          </option>
        ))}
      </select>
    </>
  )
}

/**
 * Alternativa em botões, para as versões que querem os três idiomas visíveis.
 * `aria-current` marca o activo — não depende só de cor.
 */
export function LangTabs({ t, className }: { t: Content; className?: string }) {
  const current = getLang()
  return (
    <div className={className} role="group" aria-label={t.nav.idioma}>
      {LANGS.map((lang) => (
        <button
          key={lang}
          type="button"
          aria-current={lang === current ? 'true' : undefined}
          onClick={() => lang !== current && setLang(lang)}
        >
          {SHORT_LABEL[lang]}
        </button>
      ))}
    </div>
  )
}
