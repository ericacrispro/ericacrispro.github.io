/**
 * V3 · Carta de Tons
 *
 * O site É a carta de cores. A pergunta de quem chega — "qual é o meu ruivo?" —
 * tem aqui uma ferramenta, não um folheto: escolhe-se um dos seis tons e a
 * página responde inteira (a galeria filtra, a descrição muda, o CTA leva a
 * mensagem certa, a cor do tom passa a ser a cor da página).
 *
 * Estado: `useState` + hash da URL (`#cobre`) para o link ser partilhável.
 * Sem tom escolhido = a carta inteira, todas as 16 fotografias.
 *
 * Regra do projecto: nenhum texto escrito aqui — tudo vem de `getContent()`.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import './v3.css'
import { getContent } from '../../i18n'
import { GALLERY, photo } from '../../shared/photos'
import { Picture } from '../../shared/Picture'
import { Logo } from '../../shared/Logo'
import { LangSwitch, LangTabs } from '../../shared/LangSwitch'
import { whatsappHref, externalLinkProps, CONTACT } from '../../shared/contact'
import { useReveal } from '../../shared/useReveal'

/**
 * As chaves dos seis tons, na ordem de `t.tons.items` (que é a ordem da carta).
 * São as mesmas chaves do `tone` das fotos e do `t.galeria.tons`, portanto o
 * nome de cada uma vem sempre do conteúdo, nos três idiomas.
 */
const TONE_KEYS = ['cobre', 'acaju', 'gengibre', 'cereja', 'laranja', 'ruivo-escuro'] as const
type ToneKey = (typeof TONE_KEYS)[number]

const isTone = (v: string): v is ToneKey => (TONE_KEYS as readonly string[]).includes(v)

/** Secção com entrada suave. Só desloca — nunca esconde (ver `useReveal`). */
function Section({
  id,
  className,
  labelledBy,
  children,
}: {
  id?: string
  className: string
  labelledBy?: string
  children: ReactNode
}) {
  const { ref, revealed } = useReveal<HTMLElement>()
  return (
    <section
      id={id}
      ref={ref}
      aria-labelledby={labelledBy}
      className={`${className} rv${revealed ? '' : ' is-entering'}`}
    >
      {children}
    </section>
  )
}

export function App() {
  const t = getContent()
  const [tone, setTone] = useState<ToneKey | null>(null)
  /** Só depois de a pessoa mexer é que a galeria se anima (nunca no primeiro pintar). */
  const [deal, setDeal] = useState(0)

  // O hash torna a escolha partilhável: /versoes/v3/#cobre abre já filtrado.
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

  const heroPhoto = photo('caracois-ruivos-cobre-volume')
  const ericaPhoto = photo('erica-sorriso-salao')
  const cartaPhoto = photo('kc-color-gama-tons-ruivos')
  const maoPhoto = photo('erica-com-coloracao-kc-color')

  const shots = useMemo(() => (tone ? GALLERY.filter((p) => p.tone === tone) : GALLERY), [tone])
  const index = tone ? TONE_KEYS.indexOf(tone) : -1
  const escolhido = index >= 0 ? t.tons.items[index] : null

  const year = new Date().getFullYear()

  return (
    <div className="v3" data-tone={tone ?? undefined}>
      <a className="skip-link" href="#main">
        {t.a11y.skip}
      </a>

      <header className="hd" id="topo">
        <div className="hd-in">
          <div className="hd-brand">
            <Logo shape="icone" color="laranja" alt={t.a11y.marcaDecorativa} height="2rem" priority />
            <span className="hd-names">
              <span className="hd-name">{t.brand.name}</span>
              <span className="hd-tag">{t.brand.tagline}</span>
            </span>
          </div>
          <div className="hd-tools">
            <LangSwitch t={t} className="lang" id="lang-hd" />
            <a className="btn btn-ink hd-cta" href={whatsappHref(t)} {...externalLinkProps}>
              {t.cta.primaryShort}
            </a>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-t">
          <div className="hero-copy">
            <h1 id="hero-t" className="hero-title">
              {t.hero.titleLines.map((linha) => (
                <span className="hero-line" key={linha}>
                  {linha}
                </span>
              ))}
            </h1>
            <p className="hero-lead">{t.hero.lead}</p>
            <div className="hero-actions">
              <a className="btn btn-tone btn-big" href={whatsappHref(t)} {...externalLinkProps}>
                {t.cta.primary}
              </a>
              <a className="btn btn-line btn-big" href="#carta">
                {t.cta.verTrabalho}
              </a>
            </div>
            <p className="hero-note">{t.hero.note}</p>
          </div>

          <figure className="hero-fig">
            <Picture
              photo={heroPhoto}
              alt={t.photoAlt[heroPhoto.slug]}
              className="hero-img"
              sizes="(min-width: 1000px) 48vw, 100vw"
              priority
            />
            <div className="hero-carta" aria-hidden="true">
              {TONE_KEYS.map((k) => (
                <span key={k} data-sw={k} />
              ))}
            </div>
          </figure>
        </section>

        <Section id="sobre" className="sobre" labelledBy="sobre-t">
          <figure className="sobre-fig">
            <Picture
              photo={ericaPhoto}
              alt={t.photoAlt[ericaPhoto.slug]}
              className="sobre-img"
              sizes="(min-width: 1000px) 34vw, 100vw"
              priority
            />
            <figcaption className="sobre-badge">{t.sobre.badge}</figcaption>
          </figure>
          <div className="sobre-copy">
            <h2 id="sobre-t">{t.sobre.title}</h2>
            <p className="sobre-lead">{t.sobre.lead}</p>
            {t.sobre.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </Section>

        {/* ---------- A carta de tons: o coração desta versão ---------- */}
        <section id="carta" className="carta" aria-labelledby="carta-t">
          <div className="carta-head">
            <p className="kicker">{t.tons.kicker}</p>
            <h2 id="carta-t">{t.tons.title}</h2>
            <p className="carta-lead">{t.tons.lead}</p>
          </div>

          <div className="carta-body">
            <div className="deck-wrap">
              <div className="deck" role="group" aria-label={t.galeria.filtroLabel}>
                <button
                  type="button"
                  className="chip chip-todos"
                  aria-pressed={tone === null}
                  onClick={() => choose(null)}
                >
                  <span className="chip-sw chip-sw-todos" aria-hidden="true">
                    {TONE_KEYS.map((k) => (
                      <i key={k} data-sw={k} />
                    ))}
                  </span>
                  <span className="chip-name">{t.galeria.filtroTodos}</span>
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
                    <span className="chip-sw" aria-hidden="true" />
                    <span className="chip-name">{t.galeria.tons[k]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="carta-main">
              <div className="painel" aria-live="polite">
                <span className="painel-rule" aria-hidden="true" />
                <h3 className="painel-nome">{escolhido ? escolhido.name : t.galeria.filtroTodos}</h3>
                <p className="painel-texto">{escolhido ? escolhido.body : t.galeria.lead}</p>
                <p className="painel-conta">
                  <strong>{shots.length}</strong> {t.galeria.contagem}
                </p>
                <a
                  className="btn btn-tone"
                  href={whatsappHref(t, escolhido ? 'marcar' : 'geral')}
                  {...externalLinkProps}
                >
                  {t.cta.primary}
                </a>
                <p className="painel-nota">{t.cta.helperShort}</p>
              </div>

              <h3 className="gal-titulo">{t.galeria.title}</h3>

              {shots.length === 0 ? (
                <p className="gal-vazio">{t.galeria.vazio}</p>
              ) : (
                <ul
                  /* O mosaico (a primeira de cada cinco, maior) só faz sentido
                     com fotografias que cheguem — nos tons de poucas, grelha
                     regular, que é como se lê um mostruário. */
                  className={`gal${shots.length >= 6 ? ' gal-mosaico' : ''}${deal ? ' is-dealing' : ''}`}
                  key={`${tone ?? 'todos'}-${deal}`}
                >
                  {shots.map((p, i) => (
                    <li className="gal-item" key={p.slug} style={{ '--i': i } as CSSProperties}>
                      <figure>
                        <Picture
                          photo={p}
                          alt={t.photoAlt[p.slug]}
                          className="gal-img"
                          sizes="(min-width: 1000px) 30vw, (min-width: 600px) 45vw, 92vw"
                          /* `priority` = descodificação síncrona. Sem ela, o
                             Chrome pinta a captura de página inteira antes de
                             descodificar e metade da galeria sai em branco —
                             a mesma armadilha do `lazy`, documentada no DESIGN. */
                          priority
                        />
                        <figcaption className="gal-cap">
                          <i className="dot" data-sw={p.tone ?? undefined} aria-hidden="true" />
                          {t.galeria.tons[p.tone ?? '']}
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <Section className="prod" labelledBy="prod-t">
          <div className="prod-copy">
            <h2 id="prod-t">{t.produtos.title}</h2>
            <p>{t.produtos.lead}</p>
          </div>
          <div className="prod-figs">
            <Picture
              photo={cartaPhoto}
              alt={t.photoAlt[cartaPhoto.slug]}
              className="prod-img"
              sizes="(min-width: 768px) 26vw, 46vw"
              priority
            />
            <Picture
              photo={maoPhoto}
              alt={t.photoAlt[maoPhoto.slug]}
              className="prod-img"
              sizes="(min-width: 768px) 26vw, 46vw"
              priority
            />
          </div>
        </Section>

        <Section id="servicos" className="serv" labelledBy="serv-t">
          <div className="serv-head">
            <h2 id="serv-t">{t.servicos.title}</h2>
            <p className="serv-lead">{t.servicos.lead}</p>
          </div>
          <ul className="serv-list">
            {t.servicos.items.map((s, i) => (
              <li className={i === 0 ? 'serv-item serv-item-destaque' : 'serv-item'} key={s.title}>
                <p className="serv-tag">{s.tag}</p>
                <h3 className="serv-nome">{s.title}</h3>
                <p className="serv-texto">{s.body}</p>
                {i === 1 && (
                  <a className="btn btn-line btn-sm" href={whatsappHref(t, 'correcao')} {...externalLinkProps}>
                    {t.cta.primary}
                  </a>
                )}
              </li>
            ))}
          </ul>
          <p className="serv-nota">{t.servicos.nota}</p>
        </Section>

        <Section id="processo" className="proc" labelledBy="proc-t">
          <div className="proc-head">
            <p className="kicker">{t.processo.kicker}</p>
            <h2 id="proc-t">{t.processo.title}</h2>
            <p className="proc-lead">{t.processo.lead}</p>
          </div>
          <ol className="proc-list">
            {t.processo.steps.map((s, i) => (
              <li className="proc-item" key={s.title}>
                <span className="proc-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="proc-nome">{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="duvidas" className="faq" labelledBy="faq-t">
          <h2 id="faq-t">{t.faq.title}</h2>
          <div className="faq-list">
            {t.faq.items.map((item) => (
              <details className="faq-item" key={item.q}>
                <summary>
                  <span className="faq-q">{item.q}</span>
                  <span className="faq-sinal" aria-hidden="true" />
                </summary>
                <p className="faq-a">{item.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section id="contacto" className="cont" labelledBy="cont-t">
          <div className="cont-in">
            <h2 id="cont-t">{t.contacto.title}</h2>
            <p className="cont-lead">{t.contacto.lead}</p>
            <div className="cont-actions">
              <a className="btn btn-ink btn-big" href={whatsappHref(t, 'marcar')} {...externalLinkProps}>
                {t.cta.primaryLong}
              </a>
              <a className="btn btn-vazado btn-big" href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
                {t.cta.secondary} · {CONTACT.phoneDisplay}
              </a>
            </div>
            <p className="cont-nota">{t.cta.helper}</p>
          </div>
        </Section>
      </main>

      <footer className="ft">
        <div className="ft-in">
          <Logo shape="assinatura" color="branca" alt={t.a11y.logo} height="3.4rem" className="ft-logo" />
          <p className="ft-tagline">{t.footer.tagline}</p>
          <p className="ft-nota">{t.footer.feitoPor}</p>
          <div className="ft-lang">
            <span className="ft-lang-label">{t.footer.idiomaLabel}</span>
            <LangTabs t={t} className="lang-tabs" />
          </div>
          <p className="ft-legal">
            {year} {t.brand.name}. {t.footer.direitos}
          </p>
          <a className="ft-topo" href="#topo">
            {t.footer.voltarTopo}
          </a>
        </div>
      </footer>

      {/* Barra fixa: no telemóvel o contacto está à mão em qualquer ponto do scroll. */}
      <div className="barra">
        <a className="btn btn-tone barra-cta" href={whatsappHref(t, 'marcar')} {...externalLinkProps}>
          {t.cta.primary}
        </a>
        <a className="btn btn-vazado barra-tel" href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
          {t.cta.secondary}
        </a>
      </div>
    </div>
  )
}
