/**
 * V4 · "Raposa"
 *
 * A marca conduz a página. O logótipo dela é uma chama que também é uma raposa —
 * o activo mais forte que existe. Esta versão vive disso: traço fino, desenho,
 * artesania. Base oliva (a cor da assinatura do logótipo), com o laranja
 * reservado para onde há calor a sério: o botão e a secção de contacto.
 *
 * O ornamento é desenhado em SVG inline — chama, estrela de quatro pontas,
 * mecha, selo circular. Onde é preciso o animal, entra o PNG do logótipo
 * (`Logo shape="icone"`): a raposa não se decalca.
 *
 * Sobre o traço que se desenha: cada forma tem DUAS camadas — uma base fina
 * sempre desenhada, e por cima a mesma forma que se desenha com
 * `stroke-dashoffset` quando entra no ecrã (`useReveal`). Consequência: o
 * desenho **nunca desaparece**, aconteça o que acontecer ao observador ou ao
 * renderizador. A animação enriquece; não decide o que se vê.
 */
import { useEffect, useRef, type ReactNode } from 'react'
import './v4.css'
import { getContent } from '../../i18n'
import { Picture } from '../../shared/Picture'
import { Logo } from '../../shared/Logo'
import { LangSwitch, LangTabs } from '../../shared/LangSwitch'
import { GALLERY, PRODUTOS, ERICA } from '../../shared/photos'
import { whatsappHref, externalLinkProps, CONTACT } from '../../shared/contact'
import { useReveal } from '../../shared/useReveal'

/* ------------------------------------------------------------------ desenho */

/** Contorno em duas camadas: base sempre visível + traço que se desenha por cima. */
function Traced({
  paths,
  viewBox,
  className,
  width = 1.6,
  cap = 'round',
  fit,
}: {
  paths: string[]
  viewBox: string
  className?: string
  width?: number
  cap?: 'round' | 'butt'
  fit?: 'none'
}) {
  const draw = (ink: boolean) =>
    paths.map((d, i) => (
      <path
        key={i}
        className={ink ? 'd' : undefined}
        pathLength={ink ? 1 : undefined}
        d={d}
        strokeWidth={width}
        strokeLinecap={cap}
        strokeLinejoin="round"
      />
    ))
  return (
    <svg
      className={className}
      viewBox={viewBox}
      fill="none"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio={fit === 'none' ? 'none' : undefined}
    >
      <g className="t-base">{draw(false)}</g>
      <g className="t-ink">{draw(true)}</g>
    </svg>
  )
}

/** A chama do logótipo, reduzida a contorno. Forma própria, não decalque. */
const FLAME = [
  'M52 141C22 135 5 113 6 86 7 57 26 34 41 3c3 27 17 41 35 60 17 18 22 42 15 59-7 17-22 22-39 19Z',
  'M50 131c-17-4-25-19-21-35 3-13 14-20 18-35 6 15 20 24 24 39 4 16-5 34-21 31Z',
]
const Flame = ({ className }: { className?: string }) => (
  <Traced className={className} viewBox="0 0 100 144" paths={FLAME} width={1.7} />
)

/** A estrela de quatro pontas do logótipo. Pontuação entre secções. */
const STAR = ['M50 3c2 27 20 45 47 47-27 2-45 20-47 47-2-27-20-45-47-47C30 48 48 30 50 3Z']
const Star = ({ className }: { className?: string }) => (
  <Traced className={className} viewBox="0 0 100 100" paths={STAR} width={2.4} />
)

/** Uma mecha desenhada — quatro fios. O mostruário da carta de tons. */
const STRAND = [
  'M10 4c14 16 14 40 0 62 0 12 4 20 10 26',
  'M28 4c15 18 12 42-2 64 1 12 6 21 12 26',
  'M46 4c14 18 11 42-3 64 1 12 7 21 13 26',
  'M62 6c9 20 5 42-6 60',
]
const Strand = ({ className }: { className?: string }) => (
  <Traced className={className} viewBox="0 0 72 96" paths={STRAND} width={2.6} />
)

/** Um arco fino — o gesto do pincel. Assina o fim de uma secção. */
const RULE = ['M0 12h176', 'M224 12h176']

/**
 * Invólucro do traço: quando entra no ecrã, a camada de cima redesenha-se.
 * Uma vez, sem repetição. Decorativo por definição.
 */
function Drawn({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, revealed } = useReveal<HTMLSpanElement>({ threshold: 0.12, delay })
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={['v4-drawn', revealed ? 'is-drawn' : '', className ?? ''].filter(Boolean).join(' ')}
    >
      {children}
    </span>
  )
}

/** Filete com a estrela ao centro. */
function StarRule() {
  return (
    <Drawn className="v4-rule">
      <Traced viewBox="0 0 400 24" paths={RULE} width={1} cap="butt" fit="none" />
      <Star className="v4-rule__star" />
    </Drawn>
  )
}

/** Selo circular com o nome a correr à volta — decorativo (o nome está em texto no rodapé). */
function Seal({ name, tagline }: { name: string; tagline: string }) {
  return (
    <svg className="v4-seal" viewBox="0 0 200 200" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <path id="v4-seal-top" d="M100 100m-77 0a77 77 0 0 1 154 0" />
        <path id="v4-seal-bottom" d="M100 100m-77 0a77 77 0 0 0 154 0" />
      </defs>
      <g className="t-base">
        <circle cx="100" cy="100" r="95" strokeWidth="1.3" />
        <circle cx="100" cy="100" r="89" strokeWidth="1.3" />
      </g>
      <g className="t-ink">
        <circle className="d" pathLength={1} cx="100" cy="100" r="95" strokeWidth="1.3" />
        <circle className="d" pathLength={1} cx="100" cy="100" r="89" strokeWidth="1.3" />
      </g>
      <text className="v4-seal__text">
        <textPath href="#v4-seal-top" startOffset="50%" textAnchor="middle">
          {name}
        </textPath>
      </text>
      <text className="v4-seal__text">
        <textPath href="#v4-seal-bottom" startOffset="50%" textAnchor="middle">
          {tagline}
        </textPath>
      </text>
    </svg>
  )
}

/**
 * A chama que acompanha o scroll: fixa na margem, vai-se desenhando à medida
 * que a página desce. Sem JS ou com movimento reduzido, fica desenhada.
 */
function ScrollFlame() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const measure = () => {
      raf = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const p = max > 8 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1
      el.style.setProperty('--v4-progress', String(0.18 + p * 0.82))
    }
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div className="v4-scrollflame" ref={ref} aria-hidden="true">
      <Flame />
    </div>
  )
}

/* -------------------------------------------------------------------- página */

/** Chaves só para pintar a mecha de cada tom — a ordem é a de `t.tons.items`. */
const TONE_KEYS = ['cobre', 'acaju', 'gengibre', 'cereja', 'laranja', 'escuro']

/**
 * Os nomes das variantes do ícone já correspondem à cor real (o mapeamento
 * trocado em `scripts/logos.mjs` foi corrigido). Ficam nomeados para o resto do
 * ficheiro se ler pela intenção, não pela cor.
 */
const ICON_ORANGE = 'laranja' as const
const ICON_OLIVE = 'oliva' as const

export function App() {
  const t = getContent()
  const zap = whatsappHref(t, 'geral')
  const zapMarcar = whatsappHref(t, 'marcar')
  const zapCorrecao = whatsappHref(t, 'correcao')

  const navLinks = [
    { href: '#v4-sobre', label: t.nav.sobre },
    { href: '#v4-trabalho', label: t.nav.trabalho },
    { href: '#v4-tons', label: t.nav.tons },
    { href: '#v4-servicos', label: t.nav.servicos },
    { href: '#v4-processo', label: t.nav.processo },
    { href: '#v4-duvidas', label: t.nav.duvidas },
    { href: '#v4-contacto', label: t.nav.contacto },
  ]

  const last = GALLERY.length - 1

  return (
    <div className="v4">
      <a className="skip-link" href="#v4-main">
        {t.a11y.skip}
      </a>

      <ScrollFlame />

      <header className="v4-header">
        <div className="v4-header__in">
          <a className="v4-header__brand" href="#v4-main" aria-label={t.a11y.logo}>
            <Logo shape="assinatura" color="branca" alt={t.a11y.marcaDecorativa} height="2.1rem" priority />
          </a>

          <nav className="v4-nav" aria-label={t.brand.name}>
            <ul>
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="v4-header__end">
            <LangSwitch t={t} className="v4-lang" id="v4-lang" />
            <a className="v4-btn v4-btn--fire v4-header__cta" href={zap} {...externalLinkProps}>
              {t.cta.primaryShort}
            </a>
          </div>
        </div>
      </header>

      <main id="v4-main">
        {/* ---------------------------------------------------------- hero */}
        <section className="v4-hero">
          <Picture
            photo={ERICA.hero}
            alt={t.photoAlt[ERICA.hero.slug]}
            className="v4-hero__media"
            sizes="(min-width: 900px) 50vw, 100vw"
            priority
          />

          <div className="v4-hero__body">
            <p className="v4-kicker v4-kicker--fire">{t.brand.tagline}</p>
            <h1 className="v4-hero__title">
              {t.hero.titleLines.map((line, i) => (
                <span key={line} className={i === 0 ? 'v4-hero__line is-hot' : 'v4-hero__line'}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="v4-hero__lead">{t.hero.lead}</p>
            <div className="v4-actions">
              <a className="v4-btn v4-btn--fire v4-btn--lg" href={zapMarcar} {...externalLinkProps}>
                {t.cta.primary}
              </a>
              <a className="v4-btn v4-btn--ghost" href={CONTACT.tel}>
                {t.cta.secondaryLong}
              </a>
            </div>
            <p className="v4-hero__note">{t.hero.note}</p>
          </div>

          <Drawn className="v4-hero__flame">
            <Flame />
          </Drawn>
        </section>

        {/* ----------------------------------------------------- manifesto */}
        <section className="v4-band v4-band--paper v4-manifesto" aria-label={t.manifesto.kicker}>
          <div className="v4-wrap v4-manifesto__in">
            <div className="v4-manifesto__mark">
              <Logo shape="icone" color={ICON_ORANGE} alt={t.a11y.marcaDecorativa} height="clamp(4rem, 12vw, 7.5rem)" />
            </div>
            <div>
              <p className="v4-kicker">{t.manifesto.kicker}</p>
              <p className="v4-manifesto__lines">
                {t.manifesto.lines.map((line, i) => (
                  <span key={line} className={i === 2 ? 'v4-manifesto__line is-hot' : 'v4-manifesto__line'}>
                    {line}
                  </span>
                ))}
              </p>
              <p className="v4-p v4-p--wide">{t.manifesto.body}</p>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- sobre */}
        <section className="v4-band v4-band--olive" id="v4-sobre" aria-labelledby="v4-sobre-t">
          <div className="v4-wrap v4-sobre">
            <div className="v4-sobre__media">
              <Picture
                photo={ERICA.sobre}
                alt={t.photoAlt[ERICA.sobre.slug]}
                sizes="(min-width: 900px) 42vw, 92vw"
                ratio={0.8}
                priority
              />
              <p className="v4-sobre__badge">
                <Star className="v4-inline-star" />
                {t.sobre.badge}
              </p>
            </div>
            <div className="v4-sobre__text">
              <h2 className="v4-h2" id="v4-sobre-t">
                {t.sobre.title}
              </h2>
              <p className="v4-lead">{t.sobre.lead}</p>
              {t.sobre.body.map((p) => (
                <p key={p.slice(0, 24)} className="v4-p">
                  {p}
                </p>
              ))}
              <a className="v4-link" href={zapCorrecao} {...externalLinkProps}>
                {t.cta.primaryLong}
              </a>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ trabalho */}
        <section className="v4-band v4-band--paper" id="v4-trabalho" aria-labelledby="v4-trab-t">
          <div className="v4-wrap">
            <StarRule />
            <div className="v4-head">
              <h2 className="v4-h2" id="v4-trab-t">
                {t.galeria.title}
              </h2>
              <p className="v4-lead">{t.galeria.lead}</p>
              <p className="v4-count">
                {GALLERY.length} {t.galeria.contagem}
              </p>
            </div>
          </div>

          {/* As 16. `priority` (não `lazy`) por causa da armadilha já paga: com
              decode assíncrono, a captura de página inteira sai com as fotos em
              branco — e é por essas capturas que a Erica vai escolher. */}
          <ul className="v4-grid" aria-label={t.a11y.galeriaRegiao}>
            {GALLERY.map((p, i) => (
              <li key={p.slug} className={`v4-cell${i % 7 === 0 || i === last ? ' is-wide' : ''}`}>
                <figure>
                  <Picture
                    photo={p}
                    alt={t.photoAlt[p.slug]}
                    sizes="(min-width: 1100px) 26vw, (min-width: 700px) 34vw, 50vw"
                    priority
                  />
                  <figcaption>{p.tone ? t.galeria.tons[p.tone] : t.galeria.title}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------------------- tons */}
        <section className="v4-band v4-band--dark" id="v4-tons" aria-labelledby="v4-tons-t">
          <div className="v4-wrap">
            <div className="v4-head">
              <p className="v4-kicker v4-kicker--fire">{t.tons.kicker}</p>
              <h2 className="v4-h2" id="v4-tons-t">
                {t.tons.title}
              </h2>
              <p className="v4-lead">{t.tons.lead}</p>
            </div>

            <ul className="v4-tons">
              {t.tons.items.map((item, i) => (
                <li key={item.name} className={`v4-tone v4-tone--${TONE_KEYS[i] ?? 'cobre'}`}>
                  <Drawn className="v4-tone__swatch" delay={i * 70}>
                    <Strand />
                  </Drawn>
                  <div>
                    <h3 className="v4-h3">{item.name}</h3>
                    <p className="v4-p">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------------ serviços */}
        <section className="v4-band v4-band--paper" id="v4-servicos" aria-labelledby="v4-serv-t">
          <div className="v4-wrap">
            <div className="v4-head">
              <h2 className="v4-h2" id="v4-serv-t">
                {t.servicos.title}
              </h2>
              <p className="v4-lead">{t.servicos.lead}</p>
            </div>

            <div className="v4-first">
              <Drawn className="v4-first__flame">
                <Flame />
              </Drawn>
              <div>
                <p className="v4-tag">{t.servicos.items[0].tag}</p>
                <h3 className="v4-h2 v4-h2--sm">{t.servicos.items[0].title}</h3>
                <p className="v4-p v4-p--wide">{t.servicos.items[0].body}</p>
              </div>
            </div>

            <ul className="v4-servs">
              {t.servicos.items.slice(1).map((s) => (
                <li key={s.title}>
                  <p className="v4-tag">{s.tag}</p>
                  <h3 className="v4-h3">{s.title}</h3>
                  <p className="v4-p">{s.body}</p>
                </li>
              ))}
            </ul>

            <p className="v4-nota">{t.servicos.nota}</p>
          </div>
        </section>

        {/* ------------------------------------------------------ processo */}
        <section className="v4-band v4-band--olive" id="v4-processo" aria-labelledby="v4-proc-t">
          <div className="v4-wrap">
            <div className="v4-head">
              <h2 className="v4-h2" id="v4-proc-t">
                {t.processo.title}
              </h2>
              <p className="v4-lead">{t.processo.lead}</p>
            </div>

            <ol className="v4-steps">
              {t.processo.steps.map((s, i) => (
                <li key={s.title}>
                  <span className="v4-steps__n">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="v4-h3">{s.title}</h3>
                  <p className="v4-p">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------ produtos */}
        <section className="v4-band v4-band--paper v4-produtos" aria-labelledby="v4-prod-t">
          <div className="v4-wrap v4-produtos__in">
            <div>
              <h2 className="v4-h2 v4-h2--sm" id="v4-prod-t">
                {t.produtos.title}
              </h2>
              <p className="v4-p v4-p--wide">{t.produtos.lead}</p>
            </div>
            <ul className="v4-produtos__strip">
              {PRODUTOS.map((p) => (
                <li key={p.slug}>
                  <Picture photo={p} alt={t.photoAlt[p.slug]} sizes="(min-width: 900px) 18vw, 32vw" ratio={0.72} priority />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------------- dúvidas */}
        <section className="v4-band v4-band--dark" id="v4-duvidas" aria-labelledby="v4-faq-t">
          <div className="v4-wrap v4-wrap--narrow">
            <div className="v4-head">
              <p className="v4-kicker v4-kicker--fire">{t.faq.kicker}</p>
              <h2 className="v4-h2" id="v4-faq-t">
                {t.faq.title}
              </h2>
            </div>
            <ul className="v4-faq">
              {t.faq.items.map((item) => (
                <li key={item.q}>
                  <details>
                    <summary>
                      <span>{item.q}</span>
                      <Star className="v4-faq__star" />
                    </summary>
                    <p className="v4-p">{item.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------------ contacto */}
        <section className="v4-band v4-band--fire" id="v4-contacto" aria-labelledby="v4-cont-t">
          <div className="v4-wrap v4-contacto">
            <div className="v4-contacto__seal">
              <Drawn className="v4-contacto__ring">
                <Seal name={t.brand.name} tagline={t.brand.tagline} />
              </Drawn>
              <Logo shape="icone" color={ICON_OLIVE} alt={t.a11y.marcaDecorativa} height="clamp(3.4rem, 11vw, 5.25rem)" />
            </div>
            <div className="v4-contacto__text">
              <p className="v4-kicker v4-kicker--ink">{t.contacto.kicker}</p>
              <h2 className="v4-h2" id="v4-cont-t">
                {t.contacto.title}
              </h2>
              <p className="v4-lead">{t.contacto.lead}</p>
              <div className="v4-actions">
                <a className="v4-btn v4-btn--ink v4-btn--lg" href={zapMarcar} {...externalLinkProps}>
                  {t.cta.primary}
                </a>
                <a className="v4-btn v4-btn--outline" href={CONTACT.tel}>
                  {t.cta.secondaryLong}
                </a>
              </div>
              <p className="v4-contacto__helper">{t.cta.helper}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="v4-footer">
        <div className="v4-wrap v4-footer__in">
          <div className="v4-footer__brand">
            <Logo shape="assinatura" color="branca" alt={t.a11y.logo} height="2.6rem" />
            <p className="v4-footer__tagline">{t.footer.tagline}</p>
            <p className="v4-footer__note">{t.footer.feitoPor}</p>
          </div>
          <div className="v4-footer__meta">
            <p className="v4-footer__label">{t.footer.idiomaLabel}</p>
            <LangTabs t={t} className="v4-langtabs" />
            <a className="v4-link v4-link--sm" href="#v4-main">
              {t.footer.voltarTopo}
            </a>
            <p className="v4-footer__rights">
              {t.brand.name} · {t.footer.direitos}
            </p>
          </div>
        </div>
      </footer>

      {/* Barra fixa: o WhatsApp a um polegar de distância em qualquer ponto do scroll. */}
      <div className="v4-bar">
        <a className="v4-btn v4-btn--fire v4-bar__main" href={zapMarcar} {...externalLinkProps}>
          {t.cta.primary}
        </a>
        <a className="v4-btn v4-btn--ghost v4-bar__tel" href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
          {t.cta.secondary}
        </a>
      </div>
    </div>
  )
}
