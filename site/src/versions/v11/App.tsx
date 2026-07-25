/**
 * V11 · Perfil
 *
 * Duas heranças, uma página.
 *
 * **Do portfólio do Silas vem a navegação**: no telemóvel a fotografia dela
 * ocupa a primeira tela inteira (100dvh, escurecida por baixo) e o conteúdo
 * entra a seguir numa coluna única, com uma barra de secções colada ao topo que
 * acende sozinha a secção que está a ser lida — não são separadores, tudo rola
 * junto. No computador (≥1024px) isso vira um split: retrato fixo à esquerda,
 * conteúdo a rolar à direita entre barra e rodapé fixos.
 *
 * **Da V3 vem a carta de tons como ferramenta**: escolher um dos seis tons
 * filtra a galeria, muda a descrição (região `aria-live`) e passa a ser a cor de
 * acento da página inteira (`data-tone`). O estado vive no `useState` + hash
 * (`#cobre`), portanto o link é partilhável. Sem tom escolhido = as 16 fotos.
 *
 * O hash é só do tom: a barra de secções rola sem lhe tocar, para o link
 * partilhado não perder o filtro.
 *
 * Regra do projecto: nenhum texto escrito aqui — tudo vem de `getContent()`.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import './v11.css'
import { getContent } from '../../i18n'
import { GALLERY, ERICA } from '../../shared/photos'
import { Picture } from '../../shared/Picture'
import { Logo } from '../../shared/Logo'
import { LangSwitch, LangTabs } from '../../shared/LangSwitch'
import { whatsappHref, externalLinkProps, CONTACT } from '../../shared/contact'
import { useReveal } from '../../shared/useReveal'
import { useSectionSpy, useHeroSnap, useTabStrip } from './useSectionSpy'

/** As chaves dos seis tons, na ordem de `t.tons.items` — as mesmas das fotos. */
const TONE_KEYS = ['cobre', 'acaju', 'gengibre', 'cereja', 'laranja', 'ruivo-escuro'] as const
type ToneKey = (typeof TONE_KEYS)[number]

const isTone = (v: string): v is ToneKey => (TONE_KEYS as readonly string[]).includes(v)

/** A ordem do documento é a ordem da barra: a carta de tons arma a galeria. */
const SECTIONS = ['sobre', 'tons', 'trabalho', 'servicos', 'processo', 'duvidas', 'contacto'] as const

/** Painel com entrada suave. Só desloca — nunca esconde (ver `useReveal`). */
function Panel({
  id,
  labelledBy,
  className,
  children,
}: {
  id: string
  labelledBy: string
  className?: string
  children: ReactNode
}) {
  const { ref, revealed } = useReveal<HTMLElement>({ threshold: 0.05 })
  return (
    <section
      id={id}
      ref={ref}
      aria-labelledby={labelledBy}
      className={`panel${className ? ` ${className}` : ''} rv${revealed ? '' : ' is-entering'}`}
    >
      {children}
    </section>
  )
}

export function App() {
  const t = getContent()

  const panelsRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  const ids = useMemo(() => [...SECTIONS], [])
  const { current, goTo } = useSectionSpy(ids, panelsRef)
  useTabStrip(tabsRef, current)
  useHeroSnap(contentRef)

  const [tone, setTone] = useState<ToneKey | null>(null)
  /** Só depois de a pessoa escolher é que a galeria se anima (nunca ao pintar). */
  const [deal, setDeal] = useState(0)

  // O hash torna a escolha partilhável: /versoes/v11/#cobre abre já filtrado.
  useEffect(() => {
    const read = () => {
      const raw = decodeURIComponent(window.location.hash.replace('#', ''))
      setTone(isTone(raw) ? raw : null)
    }
    read()
    window.addEventListener('hashchange', read)
    return () => window.removeEventListener('hashchange', read)
  }, [])

  const choose = useCallback((next: ToneKey | null) => {
    setTone(next)
    setDeal((n) => n + 1)
    // `replaceState` em vez de `location.hash`: muda o link sem saltar a página.
    const { pathname, search } = window.location
    window.history.replaceState(null, '', next ? `${pathname}${search}#${next}` : `${pathname}${search}`)
  }, [])

  const toTop = useCallback(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const opts: ScrollToOptions = { top: 0, behavior: reduced ? 'auto' : 'smooth' }
    const desktop = window.matchMedia('(min-width: 1024px)').matches
    if (desktop) panelsRef.current?.scrollTo(opts)
    else window.scrollTo(opts)
  }, [])

  const nav = useMemo(
    () => [
      { id: 'sobre', label: t.nav.sobre },
      { id: 'tons', label: t.nav.tons },
      { id: 'trabalho', label: t.nav.trabalho },
      { id: 'servicos', label: t.nav.servicos },
      { id: 'processo', label: t.nav.processo },
      { id: 'duvidas', label: t.nav.duvidas },
      { id: 'contacto', label: t.nav.contacto },
    ],
    [t],
  )

  const shots = useMemo(() => (tone ? GALLERY.filter((p) => p.tone === tone) : GALLERY), [tone])
  const index = tone ? TONE_KEYS.indexOf(tone) : -1
  const escolhido = index >= 0 ? t.tons.items[index] : null

  const year = new Date().getFullYear()

  return (
    <div className="v11" data-tone={tone ?? undefined}>
      <a className="skip-link" href="#main">
        {t.a11y.skip}
      </a>

      <div className="shell">
        {/* --------------- primeira tela: é ela que abre a página --------------- */}
        <header className="hero" id="topo">
          <Picture
            photo={ERICA.hero}
            alt={t.photoAlt[ERICA.hero.slug]}
            className="hero__media"
            sizes="(min-width: 1024px) 42vw, 100vw"
            ratio="auto"
            priority
          />
          <div className="hero__scrim" aria-hidden="true" />

          <div className="hero__top">
            <LangSwitch t={t} className="lang lang--hero" id="lang-hero" />
          </div>

          <div className="hero__body">
            {/* O `Logo` traz `display:block` inline quando recebe altura — por
                isso a marca vive dentro de um invólucro, que é quem o CSS
                esconde ou mostra. */}
            <span className="hero__mark rise rise-1">
              <Logo shape="icone" color="branca" alt={t.a11y.marcaDecorativa} height="2.5rem" priority />
            </span>
            <h1 className="hero__name rise rise-2">{t.brand.name}</h1>
            <p className="hero__role rise rise-3">{t.brand.tagline}</p>
            <p className="hero__pitch rise rise-3">{t.hero.leadShort}</p>

            <div className="hero__actions rise rise-4">
              <a className="btn btn-tone" href={whatsappHref(t)} {...externalLinkProps}>
                {t.cta.primary}
              </a>
              <a className="btn btn-ghost" href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
                {t.cta.secondary}
              </a>
            </div>

            <a
              className="hero__hint rise rise-5"
              href="#sobre"
              onClick={(e) => {
                e.preventDefault()
                goTo('sobre')
              }}
            >
              <span className="hero__arrow" aria-hidden="true" />
              {t.hero.scroll}
              <span className="hero__arrow" aria-hidden="true" />
            </a>
          </div>
        </header>

        {/* -------------------- o conteúdo, em coluna única --------------------- */}
        <div className="content" ref={contentRef}>
          <nav className="tabbar">
            <div className="tabs" ref={tabsRef}>
              {nav.map((s) => (
                <a
                  key={s.id}
                  className="tab"
                  href={`#${s.id}`}
                  aria-current={current === s.id ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    goTo(s.id)
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
            {/* O contacto vive na barra: alcançável em qualquer ponto do scroll,
                e como a barra está no topo não tapa nada em baixo. */}
            <a className="btn btn-tone tabbar__cta" href={whatsappHref(t)} {...externalLinkProps}>
              {t.cta.primaryShort}
            </a>
          </nav>

          <main className="panels" id="main" ref={panelsRef} tabIndex={-1}>
            {/* ------------------------------ sobre ------------------------------ */}
            <Panel id="sobre" labelledBy="sobre-t" className="sobre">
              <p className="manifesto">
                {t.manifesto.lines.map((linha) => (
                  <span key={linha}>{linha}</span>
                ))}
              </p>

              <div className="sobre__grid">
                <figure className="sobre__fig">
                  <Picture
                    photo={ERICA.sobre}
                    alt={t.photoAlt[ERICA.sobre.slug]}
                    className="sobre__img"
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 34vw, 92vw"
                    priority
                  />
                  <figcaption className="sobre__badge">{t.sobre.badge}</figcaption>
                </figure>

                <div className="sobre__copy">
                  <h2 id="sobre-t">{t.sobre.title}</h2>
                  <p className="sobre__lead">{t.sobre.lead}</p>
                  {t.sobre.body.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
              </div>
            </Panel>

            {/* ----------------- a carta de tons (herdada da V3) ------------------ */}
            <Panel id="tons" labelledBy="tons-t" className="tons">
              <div className="panel__head">
                <h2 id="tons-t">{t.tons.title}</h2>
                <p>{t.tons.lead}</p>
              </div>

              <div className="deck" role="group" aria-label={t.galeria.filtroLabel}>
                <button
                  type="button"
                  className="chip chip--todos"
                  aria-pressed={tone === null}
                  onClick={() => choose(null)}
                >
                  <span className="chip__sw chip__sw--todos" aria-hidden="true">
                    {TONE_KEYS.map((k) => (
                      <i key={k} data-sw={k} />
                    ))}
                  </span>
                  <span className="chip__name">{t.galeria.filtroTodos}</span>
                </button>

                {TONE_KEYS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    className="chip"
                    data-sw={k}
                    aria-pressed={tone === k}
                    onClick={() => choose(tone === k ? null : k)}
                  >
                    <span className="chip__sw" aria-hidden="true" />
                    <span className="chip__name">{t.galeria.tons[k]}</span>
                  </button>
                ))}
              </div>

              <div className="painel" aria-live="polite">
                <span className="painel__rule" aria-hidden="true" />
                <h3 className="painel__nome">{escolhido ? escolhido.name : t.galeria.filtroTodos}</h3>
                <p className="painel__texto">{escolhido ? escolhido.body : t.galeria.lead}</p>
                <p className="painel__conta">
                  <strong>{shots.length}</strong> {t.galeria.contagem}
                </p>
                <a
                  className="btn btn-tone"
                  href={whatsappHref(t, escolhido ? 'marcar' : 'geral')}
                  {...externalLinkProps}
                >
                  {t.cta.primary}
                </a>
                <p className="painel__nota">{t.cta.helperShort}</p>
              </div>
            </Panel>

            {/* ------------------------- o trabalho dela ------------------------- */}
            <Panel id="trabalho" labelledBy="trab-t" className="trabalho">
              <div className="panel__head">
                <h2 id="trab-t">{t.galeria.title}</h2>
                <p>{t.galeria.lead}</p>
              </div>

              {tone && (
                <p className="gal__filtro">
                  <span className="gal__filtro-nome">
                    <i className="dot" data-sw={tone} aria-hidden="true" />
                    {t.galeria.tons[tone]}
                  </span>
                  <button type="button" className="gal__limpar" onClick={() => choose(null)}>
                    {t.galeria.filtroTodos}
                  </button>
                </p>
              )}

              {shots.length === 0 ? (
                <p className="gal__vazio">{t.galeria.vazio}</p>
              ) : (
                <ul
                  className={`gal${shots.length >= 6 ? ' gal--mosaico' : ''}${deal ? ' is-dealing' : ''}`}
                  key={`${tone ?? 'todos'}-${deal}`}
                  aria-label={t.a11y.galeriaRegiao}
                >
                  {shots.map((p, i) => (
                    <li className="gal__item" key={p.slug} style={{ '--i': i } as CSSProperties}>
                      <figure>
                        <Picture
                          photo={p}
                          alt={t.photoAlt[p.slug]}
                          className="gal__img"
                          sizes="(min-width: 1024px) 20vw, (min-width: 600px) 30vw, 46vw"
                          /* `priority` = descodificação síncrona: sem ela metade
                             da galeria sai em branco nas capturas (ver DESIGN). */
                          priority
                        />
                        <figcaption className="gal__cap">
                          <i className="dot" data-sw={p.tone ?? undefined} aria-hidden="true" />
                          {t.galeria.tons[p.tone ?? '']}
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            {/* ---------------------------- serviços ----------------------------- */}
            <Panel id="servicos" labelledBy="serv-t" className="serv">
              <div className="panel__head">
                <h2 id="serv-t">{t.servicos.title}</h2>
                <p>{t.servicos.lead}</p>
              </div>

              <ul className="serv__list">
                {t.servicos.items.map((s, i) => (
                  <li className={i === 0 ? 'serv__item serv__item--destaque' : 'serv__item'} key={s.title}>
                    <p className="serv__tag">{s.tag}</p>
                    <h3 className="serv__nome">{s.title}</h3>
                    <p className="serv__texto">{s.body}</p>
                    {i === 1 && (
                      <a
                        className="btn btn-line btn-sm"
                        href={whatsappHref(t, 'correcao')}
                        {...externalLinkProps}
                      >
                        {t.cta.primary}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              <p className="serv__nota">{t.servicos.nota}</p>
            </Panel>

            {/* ---------------------------- processo ----------------------------- */}
            <Panel id="processo" labelledBy="proc-t" className="proc">
              <div className="panel__head">
                <h2 id="proc-t">{t.processo.title}</h2>
                <p>{t.processo.lead}</p>
              </div>

              <ol className="proc__list">
                {t.processo.steps.map((s, i) => (
                  <li className="proc__item" key={s.title}>
                    <span className="proc__num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="proc__nome">{s.title}</h3>
                    <p>{s.body}</p>
                  </li>
                ))}
              </ol>
            </Panel>

            {/* ----------------------------- dúvidas ----------------------------- */}
            <Panel id="duvidas" labelledBy="faq-t" className="faq">
              <div className="panel__head">
                <h2 id="faq-t">{t.faq.title}</h2>
              </div>

              <div className="faq__list">
                {t.faq.items.map((item) => (
                  <details className="faq__item" key={item.q}>
                    <summary>
                      <span className="faq__q">{item.q}</span>
                      <span className="faq__sinal" aria-hidden="true" />
                    </summary>
                    <p className="faq__a">{item.a}</p>
                  </details>
                ))}
              </div>
            </Panel>

            {/* ---------------- contacto: fecha a página, como deve --------------- */}
            <Panel id="contacto" labelledBy="cont-t" className="cont">
              <div className="panel__head">
                <h2 id="cont-t">{t.contacto.title}</h2>
                <p>{t.contacto.lead}</p>
              </div>

              <div className="cont__actions">
                <a className="btn btn-tone btn-big" href={whatsappHref(t, 'marcar')} {...externalLinkProps}>
                  {t.cta.primaryLong}
                </a>
                <a className="btn btn-line btn-big" href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
                  {t.cta.secondary} · {CONTACT.phoneDisplay}
                </a>
              </div>
              <p className="cont__nota">{t.cta.helper}</p>
            </Panel>
          </main>

          <footer className="foot">
            <div className="foot__logo">
              <Logo shape="assinatura" color="branca" alt={t.a11y.logo} height="3rem" />
            </div>
            <p className="foot__tagline">{t.footer.tagline}</p>
            <p className="foot__nota">{t.footer.feitoPor}</p>

            <div className="foot__lang">
              <span className="foot__lang-label">{t.footer.idiomaLabel}</span>
              <LangTabs t={t} className="lang-tabs" />
            </div>

            <p className="foot__legal">
              {year} {t.brand.name}. {t.footer.direitos}
            </p>

            <button type="button" className="foot__topo" onClick={toTop}>
              {t.footer.voltarTopo}
            </button>
          </footer>
        </div>
      </div>
    </div>
  )
}
