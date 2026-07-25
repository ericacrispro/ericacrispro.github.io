/**
 * V7 · MOSTRUÁRIO
 *
 * A montra de um salão à noite. Fundo escuro, faixas horizontais de fotografias
 * que deslizam sem parar em direcções alternadas — o trabalho passa à frente dos
 * olhos. O contacto é a única coisa que nunca se mexe.
 *
 * Regras do padrão, respeitadas ao pé da letra:
 *  - o marquee anima SÓ `transform` (translate3d), com o conteúdo duplicado para
 *    o ciclo fechar em -50% sem salto;
 *  - pára em `:hover` e em `:focus-within` (cada faixa é focável);
 *  - em `prefers-reduced-motion` pára de vez e passa a faixa de scroll manual
 *    com scroll-snap (a cópia duplicada desaparece);
 *  - as faixas vivem dentro de invólucros com `overflow: hidden` — nunca há
 *    scroll horizontal no `<body>`;
 *  - a cópia duplicada leva `alt=""` + `aria-hidden`, o original leva o `alt` real.
 *
 * Nenhum texto está escrito aqui: tudo vem de `getContent()`.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import './v7.css'
import { getContent, type Content } from '../../i18n'
import { GALLERY, HEROES, PRODUTOS, ERICA, type Photo } from '../../shared/photos'
import { Picture } from '../../shared/Picture'
import { Logo } from '../../shared/Logo'
import { LangSwitch } from '../../shared/LangSwitch'
import { whatsappHref, externalLinkProps, CONTACT } from '../../shared/contact'
import { useReveal, usePrefersReducedMotion } from '../../shared/useReveal'

/* ------------------------------------------------------------------ ritmo --
 * As 25 fotografias são todas em retrato. Para as faixas não virarem uma fila
 * de rectângulos iguais, cada célula recebe uma largura e uma altura em fracção
 * da altura da faixa, e um alinhamento próprio. O padrão tem 5 posições e cada
 * faixa entra nele com um desfasamento diferente — nunca cai a mesma cadência.
 */
const RHYTHM = [
  { w: 0.72, h: 1, a: 'flex-end' },
  { w: 0.56, h: 0.8, a: 'center' },
  { w: 0.92, h: 0.92, a: 'flex-start' },
  { w: 0.64, h: 1, a: 'flex-end' },
  { w: 0.8, h: 0.85, a: 'center' },
] as const

/** As chaves de tom, na mesma ordem de `t.tons.items`. */
const TONE_KEYS = ['cobre', 'acaju', 'gengibre', 'cereja', 'laranja', 'ruivo-escuro'] as const

const at = (list: Photo[], i: number): Photo => list[i % list.length]

/**
 * A faixa só se mexe enquanto está à vista.
 *
 * Duas razões, e nenhuma é decorativa: (1) quatro marquees a correr ao mesmo
 * tempo aquecem o telemóvel sem ninguém os ver; (2) uma camada composta e
 * animada fora do ecrã sai **em branco** numa captura de página inteira — as
 * fotos desapareciam. Parada, a faixa pinta-se como conteúdo normal.
 *
 * Quem pediu menos movimento nunca chega a ligar nada — o CSS também o garante,
 * mas mais vale não pôr sequer o atributo. Sem `IntersectionObserver`, fica
 * sempre a correr — nunca ao contrário.
 */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      setInView(false)
      return
    }
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '120px 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  return { ref, inView }
}

type StripProps = {
  t: Content
  photos: Photo[]
  /** `esquerda` = o trabalho corre para a esquerda; `direita` = ao contrário. */
  dir: 'esquerda' | 'direita'
  /** Altura da faixa (CSS). As fotos são recortadas com `object-fit: cover`. */
  height: string
  /** Segundos por volta completa. Faixas diferentes, velocidades diferentes. */
  seconds: number
  /** Desfasamento no padrão de ritmo. */
  offset?: number
  /** Quantas fotos entram com prioridade de carregamento (só o hero). */
  priority?: number
}

function Strip({ t, photos, dir, height, seconds, offset = 0, priority = 0 }: StripProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  const copy = (dupe: boolean) => (
    <div className="v7-copy" aria-hidden={dupe || undefined}>
      {photos.map((p, i) => {
        const r = RHYTHM[(i + offset) % RHYTHM.length]
        return (
          <div
            key={`${p.slug}-${dupe ? 'd' : 'o'}`}
            className="v7-cell"
            style={{ '--w': r.w, '--h': r.h, alignSelf: r.a } as CSSProperties}
          >
            <Picture
              photo={p}
              alt={dupe ? '' : t.photoAlt[p.slug]}
              sizes="(min-width: 900px) 300px, 220px"
              priority={!dupe && i < priority}
            />
          </div>
        )
      })}
    </div>
  )

  return (
    <div
      ref={ref}
      className="v7-strip"
      data-dir={dir}
      data-live={inView ? 'true' : undefined}
      style={{ '--strip-h': height, '--dur': `${seconds}s` } as CSSProperties}
      tabIndex={0}
      role="group"
      aria-label={t.a11y.galeriaRegiao}
    >
      <div className="v7-track">
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  )
}

/** Faixa de texto — o letreiro da montra. Mesmo mecanismo, mesma pausa. */
function Ticker({ t, lines, seconds }: { t: Content; lines: readonly string[]; seconds: number }) {
  const { ref, inView } = useInView<HTMLDivElement>()

  const copy = (dupe: boolean) => (
    <div className="v7-tickerCopy" aria-hidden={dupe || undefined}>
      {lines.map((line, i) => (
        <span key={`${i}-${dupe ? 'd' : 'o'}`} className="v7-tickerItem">
          {line}
          <i className="v7-tickerDot" aria-hidden="true" />
        </span>
      ))}
    </div>
  )
  return (
    <div
      ref={ref}
      className="v7-ticker"
      data-live={inView ? 'true' : undefined}
      style={{ '--dur': `${seconds}s` } as CSSProperties}
      tabIndex={0}
      role="group"
      aria-label={t.manifesto.kicker}
    >
      <div className="v7-tickerTrack">
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  )
}

/**
 * Entrada suave que NUNCA esconde nada: só desloca. Se a animação não correr,
 * o conteúdo já está no sítio certo e legível.
 */
function Rise({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, revealed } = useReveal<HTMLDivElement>({ threshold: 0.1 })
  return (
    <div ref={ref} className={`v7-rise${revealed ? '' : ' is-entering'}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}

/**
 * Armadilha desta versão, resolvida aqui.
 *
 * As fotos são `eager` (o `<Picture>` já garante isso), mas o `<Picture>` também
 * pede `decoding="async"` a tudo o que não é hero. Uma foto carregada mas ainda
 * por descodificar pinta-se em branco quando a página é capturada inteira — e
 * numa página com meia centena de fotos em faixas, isso é quase tudo.
 *
 * Depois de montar, mandamos descodificar todas, uma a uma, sem bloquear a rede
 * nem roubar prioridade ao hero. A partir daí qualquer pintura é imediata:
 * captura de página inteira, mudança de separador ou o marquee a trazer a foto
 * seguinte para dentro do recorte.
 */
function useDecodedPhotos<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    let cancelled = false
    const decodeAll = async () => {
      for (const img of Array.from(root.querySelectorAll('img'))) {
        if (cancelled) return
        try {
          await img.decode()
        } catch {
          // Foto ainda a chegar (ou já substituída): o browser trata do resto.
        }
      }
    }
    void decodeAll()
    return () => {
      cancelled = true
    }
  }, [])
  return ref
}

export function App() {
  const t = getContent()
  const rootRef = useDecodedPhotos<HTMLDivElement>()

  /* A montra do hero: as fotos de destaque, ela própria e o produto. */
  const heroStrip: Photo[] = [HEROES[0], ERICA.hero, HEROES[1], ERICA.prova, at(HEROES, 2)]

  /* As 16 da galeria, distribuídas por três faixas — tons alternados, sem dois
     vizinhos do mesmo ruivo. */
  const g = GALLERY
  const row1: Photo[] = [g[0], g[5], g[2], g[8], g[11], g[1]]
  const row2: Photo[] = [g[6], g[4], g[9], g[13], g[15]]
  const row3: Photo[] = [g[10], g[7], g[3], g[14], g[12]]

  const tons = t.tons.items.map((item, i) => ({
    item,
    photo: GALLERY.find((p) => p.tone === TONE_KEYS[i]) ?? GALLERY[i],
  }))

  return (
    <div className="v7" ref={rootRef}>
      <a className="skip-link" href="#v7-main">
        {t.a11y.skip}
      </a>

      <header className="v7-header">
        <div className="v7-header-in">
          <a className="v7-brand" href="#v7-main">
            <Logo shape="icone" color="branca" alt="" className="v7-brand-mark" height="2.1rem" priority />
            <span className="v7-brand-text">
              <span className="v7-brand-name">{t.brand.name}</span>
              <span className="v7-brand-tag">{t.brand.tagline}</span>
            </span>
            <span className="visually-hidden">{t.a11y.logo}</span>
          </a>

          <nav className="v7-nav" aria-label={t.nav.contacto}>
            <a href="#v7-trabalho">{t.nav.trabalho}</a>
            <a href="#v7-servicos">{t.nav.servicos}</a>
            <a href="#v7-tons">{t.nav.tons}</a>
            <a href="#v7-duvidas">{t.nav.duvidas}</a>
          </nav>

          <div className="v7-header-actions">
            <LangSwitch t={t} className="v7-lang" id="v7-lang-topo" />
            <a className="v7-btn v7-btn--fire v7-header-cta" href={whatsappHref(t, 'marcar')} {...externalLinkProps}>
              {t.cta.primaryShort}
            </a>
          </div>
        </div>
      </header>

      <main id="v7-main">
        {/* ------------------------------------------------------------ hero */}
        <section className="v7-hero" aria-labelledby="v7-hero-title">
          <Strip t={t} photos={heroStrip} dir="esquerda" height="var(--h-hero)" seconds={34} priority={2} />

          <div className="v7-wrap v7-hero-copy">
            <h1 id="v7-hero-title" className="v7-h1">
              {t.hero.titleLines.map((line, i) => (
                <span key={i} className={i === 1 ? 'v7-h1-em' : undefined}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="v7-lead">{t.hero.lead}</p>
            <div className="v7-actions">
              <a className="v7-btn v7-btn--fire v7-btn--lg" href={whatsappHref(t, 'geral')} {...externalLinkProps}>
                {t.cta.primary}
              </a>
              <a className="v7-btn v7-btn--ghost v7-btn--lg" href={CONTACT.tel}>
                {t.cta.secondary}
              </a>
            </div>
            <p className="v7-note">{t.hero.note}</p>
          </div>

          <Strip t={t} photos={row1} dir="direita" height="var(--h-b)" seconds={40} offset={2} />
        </section>

        {/* ----------------------------------------------------------- sobre */}
        <section className="v7-section v7-section--panel" id="v7-sobre" aria-labelledby="v7-sobre-title">
          <div className="v7-wrap v7-sobre">
            <figure className="v7-sobre-fig">
              <Picture
                photo={ERICA.sobre}
                alt={t.photoAlt[ERICA.sobre.slug]}
                sizes="(min-width: 900px) 26rem, 100vw"
              />
              <figcaption className="v7-badge">{t.sobre.badge}</figcaption>
            </figure>
            <Rise className="v7-sobre-text">
              <h2 id="v7-sobre-title" className="v7-h2">
                {t.sobre.title}
              </h2>
              <p className="v7-sobre-lead">{t.sobre.lead}</p>
              {t.sobre.body.map((p, i) => (
                <p key={i} className="v7-body">
                  {p}
                </p>
              ))}
            </Rise>
          </div>
        </section>

        {/* --------------------------------------------------------- letreiro */}
        <Ticker t={t} lines={t.manifesto.lines} seconds={44} />

        {/* -------------------------------------------------------- trabalho */}
        <section className="v7-section v7-section--flush" id="v7-trabalho" aria-labelledby="v7-trabalho-title">
          <div className="v7-wrap">
            <Rise className="v7-intro">
              <p className="v7-kicker">{t.galeria.kicker}</p>
              <h2 id="v7-trabalho-title" className="v7-h2">
                {t.galeria.title}
              </h2>
              <p className="v7-lead v7-lead--sm">{t.galeria.lead}</p>
            </Rise>
          </div>

          <div className="v7-strips">
            <Strip t={t} photos={row2} dir="esquerda" height="var(--h-a)" seconds={38} offset={1} />
            <Strip t={t} photos={row3} dir="direita" height="var(--h-c)" seconds={32} offset={3} />
          </div>
        </section>

        {/* -------------------------------------------------------- serviços */}
        <section className="v7-section v7-section--panel" id="v7-servicos" aria-labelledby="v7-servicos-title">
          <div className="v7-wrap">
            <Rise className="v7-intro">
              <h2 id="v7-servicos-title" className="v7-h2">
                {t.servicos.title}
              </h2>
              <p className="v7-lead v7-lead--sm">{t.servicos.lead}</p>
            </Rise>

            <ul className="v7-servicos">
              {t.servicos.items.map((s, i) => (
                <li key={s.title} className={`v7-servico${i === 0 ? ' v7-servico--destaque' : ''}`}>
                  <p className="v7-tag">{s.tag}</p>
                  <h3 className="v7-h3">{s.title}</h3>
                  <p className="v7-body">{s.body}</p>
                </li>
              ))}
            </ul>
            <p className="v7-nota">{t.servicos.nota}</p>
          </div>
        </section>

        {/* ------------------------------------------------------------ tons */}
        <section className="v7-section" id="v7-tons" aria-labelledby="v7-tons-title">
          <div className="v7-wrap">
            <Rise className="v7-intro">
              <p className="v7-kicker">{t.tons.kicker}</p>
              <h2 id="v7-tons-title" className="v7-h2">
                {t.tons.title}
              </h2>
              <p className="v7-lead v7-lead--sm">{t.tons.lead}</p>
            </Rise>

            <ul className="v7-tons">
              {tons.map(({ item, photo }) => (
                <li key={item.name} className="v7-tom">
                  <Picture photo={photo} alt={t.photoAlt[photo.slug]} sizes="5rem" className="v7-tom-foto" />
                  <div className="v7-tom-text">
                    <h3 className="v7-h4">{item.name}</h3>
                    <p className="v7-body v7-body--sm">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* -------------------------------------------------------- produtos */}
        <section className="v7-section v7-section--panel" aria-labelledby="v7-produtos-title">
          <div className="v7-wrap v7-produtos">
            <Rise className="v7-produtos-text">
              <h2 id="v7-produtos-title" className="v7-h3">
                {t.produtos.title}
              </h2>
              <p className="v7-body">{t.produtos.lead}</p>
            </Rise>
            <div className="v7-produtos-fotos">
              {PRODUTOS.map((p) => (
                <Picture key={p.slug} photo={p} alt={t.photoAlt[p.slug]} sizes="(min-width: 900px) 12rem, 30vw" />
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- processo */}
        <section className="v7-section" id="v7-processo" aria-labelledby="v7-processo-title">
          <div className="v7-wrap">
            <Rise className="v7-intro">
              <h2 id="v7-processo-title" className="v7-h2">
                {t.processo.title}
              </h2>
              <p className="v7-lead v7-lead--sm">{t.processo.lead}</p>
            </Rise>
            <ol className="v7-passos">
              {t.processo.steps.map((s) => (
                <li key={s.title} className="v7-passo">
                  <h3 className="v7-h4">{s.title}</h3>
                  <p className="v7-body v7-body--sm">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ----------------------------------------------------------- faq */}
        <section className="v7-section v7-section--panel" id="v7-duvidas" aria-labelledby="v7-faq-title">
          <div className="v7-wrap v7-faq-wrap">
            <Rise className="v7-intro">
              <h2 id="v7-faq-title" className="v7-h2">
                {t.faq.title}
              </h2>
            </Rise>
            <div className="v7-faq">
              {t.faq.items.map((item) => (
                <details key={item.q} className="v7-faqItem">
                  <summary>
                    <span>{item.q}</span>
                  </summary>
                  <p className="v7-body v7-body--sm">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- contacto */}
        <section className="v7-section v7-contacto" id="v7-contacto" aria-labelledby="v7-contacto-title">
          <div className="v7-wrap v7-contacto-in">
            <p className="v7-kicker v7-kicker--ink">{t.contacto.kicker}</p>
            <h2 id="v7-contacto-title" className="v7-h2 v7-h2--ink">
              {t.contacto.title}
            </h2>
            <p className="v7-contacto-lead">{t.contacto.lead}</p>

            <div className="v7-actions v7-actions--center">
              <a className="v7-btn v7-btn--ink v7-btn--lg" href={whatsappHref(t, 'marcar')} {...externalLinkProps}>
                {t.cta.primaryLong}
              </a>
              <a className="v7-btn v7-btn--outline v7-btn--lg" href={CONTACT.tel}>
                {t.cta.secondaryLong}
              </a>
            </div>
            <p className="v7-contacto-helper">{t.cta.helper}</p>

            <dl className="v7-dados">
              <div>
                <dt>{t.contacto.whatsappLabel}</dt>
                <dd>
                  <a href={whatsappHref(t, 'geral')} {...externalLinkProps}>
                    {CONTACT.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt>{t.contacto.telefoneLabel}</dt>
                <dd>
                  <a href={CONTACT.tel}>{CONTACT.phoneDisplay}</a>
                </dd>
              </div>
              <div>
                <dt>{t.contacto.horarioLabel}</dt>
                <dd>{t.contacto.horarioPendente}</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <footer className="v7-footer">
        <div className="v7-wrap v7-footer-in">
          <div className="v7-footer-brand">
            <Logo shape="assinatura" color="branca" alt={t.a11y.logo} height="3.2rem" />
            <p className="v7-footer-tagline">{t.footer.tagline}</p>
          </div>
          <div className="v7-footer-meta">
            <p>{t.footer.feitoPor}</p>
            <p>
              {t.brand.name} — {t.footer.direitos}
            </p>
          </div>
          <div className="v7-footer-tools">
            <LangSwitch t={t} className="v7-lang" variant="longo" id="v7-lang-rodape" />
            <a className="v7-topo" href="#v7-main">
              {t.footer.voltarTopo}
            </a>
          </div>
        </div>
      </footer>

      {/* Barra fixa: no telemóvel o contacto está sempre a um polegar de distância. */}
      <div className="v7-bar">
        <a className="v7-btn v7-btn--fire v7-bar-main" href={whatsappHref(t, 'geral')} {...externalLinkProps}>
          {t.cta.primary}
        </a>
        <a className="v7-btn v7-btn--ghost v7-bar-tel" href={CONTACT.tel}>
          {t.cta.secondary}
        </a>
      </div>
    </div>
  )
}
