/**
 * V8 · Sussurro — a versão silenciosa.
 *
 * Oliva escuro a cobrir quase tudo, muito ar, uma fotografia de cada vez.
 * O laranja aparece três vezes: no filete que abre cada secção, no botão de
 * contacto e no progresso da galeria. Em mais lado nenhum.
 *
 * Assinatura recorrente: **o filete** — um traço de 1px que cresce da esquerda
 * quando a secção entra. É o mesmo gesto no cabeçalho de cada secção, debaixo
 * da fotografia activa da galeria e ao longo do processo.
 */
import { useState, type ReactNode } from 'react'
import './v8.css'
import { getContent } from '../../i18n'
import { Picture } from '../../shared/Picture'
import { Logo } from '../../shared/Logo'
import { LangSwitch } from '../../shared/LangSwitch'
import { GALLERY, ERICA, photo } from '../../shared/photos'
import { CONTACT, whatsappHref, externalLinkProps } from '../../shared/contact'
import { useReveal } from '../../shared/useReveal'

/** O traço de luz. Decorativo — cresce quando a secção entra. */
function Filete() {
  return <span className="v8-filete" aria-hidden="true" />
}

/** Secção com revelação segura: o conteúdo está visível por omissão. */
function Sec({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  const { ref, revealed } = useReveal<HTMLElement>({ threshold: 0.05, rootMargin: '0px 0px -6% 0px' })
  return (
    <section
      id={id}
      ref={ref}
      className={['v8-sec', className, revealed ? null : 'is-entering'].filter(Boolean).join(' ')}
    >
      {children}
    </section>
  )
}

/**
 * Todas as fotos entram `priority`: a captura de página inteira não pinta o que
 * foi descodificado em assíncrono e nunca esteve no ecrã (armadilha do projecto).
 */
function Cabeca({ title, lead, className }: { title: string; lead?: string; className?: string }) {
  return (
    <div className={['v8-cabeca', className].filter(Boolean).join(' ')}>
      <Filete />
      <h2 className="v8-h2 v8-sobe">{title}</h2>
      {lead ? <p className="v8-lead v8-sobe">{lead}</p> : null}
    </div>
  )
}

/** Uma fotografia de cada vez, grande. As 16 continuam todas alcançáveis. */
function Galeria({ t }: { t: ReturnType<typeof getContent> }) {
  const [i, setI] = useState(0)
  const total = GALLERY.length
  const actual = GALLERY[i]
  const tom = actual.tone ? t.galeria.tons[actual.tone] : null
  const ir = (d: number) => setI((n) => (n + d + total) % total)

  return (
    <Sec id="trabalho" className="v8-sec--galeria">
      <div className="v8-wrap v8-galeria">
        <Cabeca title={t.galeria.title} lead={t.galeria.lead} className="v8-ga-cabeca" />

        <Picture
          key={actual.slug}
          photo={actual}
          alt={t.photoAlt[actual.slug]}
          className="v8-palco v8-sobe"
          sizes="(min-width: 62rem) 26rem, (min-width: 40rem) 34rem, 100vw"
          priority
        />

        <div className="v8-palco-lado v8-sobe">
          <p className="v8-tom" aria-live="polite">
            {tom}
          </p>
          <div className="v8-progresso" aria-hidden="true">
            <span style={{ transform: `scaleX(${(i + 1) / total})` }} />
          </div>
          <div className="v8-setas">
            <button type="button" className="v8-seta" onClick={() => ir(-1)} aria-label={t.a11y.fotoAnterior}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M15 4 7 12l8 8" fill="none" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </button>
            <button type="button" className="v8-seta" onClick={() => ir(1)} aria-label={t.a11y.fotoSeguinte}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </button>
          </div>
        </div>

        <div className="v8-tira v8-sobe" role="group" aria-label={t.a11y.galeriaRegiao}>
          {GALLERY.map((p, idx) => (
            <button
              key={p.slug}
              type="button"
              className={idx === i ? 'v8-mini is-activa' : 'v8-mini'}
              aria-label={t.photoAlt[p.slug]}
              aria-current={idx === i ? 'true' : undefined}
              onClick={() => setI(idx)}
            >
              <Picture photo={p} alt="" sizes="64px" priority />
            </button>
          ))}
        </div>
      </div>
    </Sec>
  )
}

export function App() {
  const t = getContent()
  const heroFoto = photo('caracois-ruivos-cobre-volume')

  return (
    <div className="v8">
      <a className="skip-link" href="#conteudo">
        {t.a11y.skip}
      </a>

      <header className="v8-topo" id="topo">
        <div className="v8-wrap v8-topo-linha">
          <div className="v8-marca">
            <Logo shape="icone" color="branca" alt={t.a11y.logo} height="1.9rem" priority />
            <span className="v8-marca-nome">{t.brand.name}</span>
          </div>

          <nav className="v8-nav" aria-label={t.nav.contacto}>
            <a href="#trabalho">{t.nav.trabalho}</a>
            <a href="#servicos">{t.nav.servicos}</a>
            <a href="#tons">{t.nav.tons}</a>
            <a href="#contacto">{t.nav.contacto}</a>
          </nav>

          <LangSwitch t={t} className="v8-lang" id="v8-lang-topo" />
        </div>
      </header>

      <main id="conteudo">
        {/* ---------------------------------------------------------- hero */}
        <section className="v8-hero">
          <div className="v8-wrap v8-hero-grelha">
            <div className="v8-hero-texto">
              <p className="v8-tagline">{t.brand.tagline}</p>
              <h1 className="v8-h1">
                {t.hero.titleLines.map((linha) => (
                  <span key={linha}>{linha}</span>
                ))}
              </h1>
              <p className="v8-hero-lead">{t.hero.lead}</p>
              <div className="v8-hero-accao">
                <a className="v8-btn v8-btn--fogo" href={whatsappHref(t, 'geral')} {...externalLinkProps}>
                  {t.cta.primary}
                </a>
                <p className="v8-nota">{t.hero.note}</p>
              </div>
            </div>

            <div className="v8-hero-foto">
              <Picture
                photo={heroFoto}
                alt={t.photoAlt[heroFoto.slug]}
                sizes="(min-width: 62rem) 27rem, (min-width: 40rem) 34rem, 100vw"
                priority
              />
              <p className="v8-scroll" aria-hidden="true">
                <span>{t.hero.scroll}</span>
                <i />
              </p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- manifesto */}
        <Sec className="v8-sec--manifesto">
          <div className="v8-wrap v8-wrap--estreito">
            <Filete />
            <h2 className="v8-kicker v8-sobe">{t.manifesto.kicker}</h2>
            <p className="v8-manifesto v8-sobe">
              {t.manifesto.lines.map((linha) => (
                <span key={linha}>{linha}</span>
              ))}
            </p>
            <p className="v8-corpo v8-sobe">{t.manifesto.body}</p>
          </div>
          <Logo shape="icone" color="branca" alt={t.a11y.marcaDecorativa} className="v8-agua" height="26rem" />
        </Sec>

        {/* --------------------------------------------------------- sobre */}
        <Sec className="v8-sec--sobre">
          <div className="v8-wrap v8-sobre-grelha">
            <div className="v8-sobre-foto v8-sobe">
              <Picture
                photo={ERICA.sobre}
                alt={t.photoAlt[ERICA.sobre.slug]}
                sizes="(min-width: 62rem) 24rem, (min-width: 40rem) 26rem, 100vw"
                priority
              />
              <p className="v8-selo-linha">
                <Filete />
                <span>{t.sobre.badge}</span>
              </p>
            </div>
            <div className="v8-sobre-texto">
              <Cabeca title={t.sobre.title} />
              <p className="v8-sobre-lead v8-sobe">{t.sobre.lead}</p>
              {t.sobre.body.map((p) => (
                <p key={p} className="v8-corpo v8-sobe">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Sec>

        {/* ------------------------------------------------------- galeria */}
        <Galeria t={t} />

        {/* ------------------------------------------------------ serviços */}
        <Sec id="servicos" className="v8-sec--servicos">
          <div className="v8-wrap">
            <Cabeca title={t.servicos.title} lead={t.servicos.lead} />
            <ul className="v8-servicos">
              {t.servicos.items.map((s, idx) => (
                <li key={s.title} className={idx === 0 ? 'v8-servico v8-servico--destaque v8-sobe' : 'v8-servico v8-sobe'}>
                  <h3 className="v8-h3">{s.title}</h3>
                  <p className="v8-tag">{s.tag}</p>
                  <p className="v8-corpo">{s.body}</p>
                </li>
              ))}
            </ul>
            <p className="v8-nota v8-nota--recuada v8-sobe">{t.servicos.nota}</p>
          </div>
        </Sec>

        {/* ---------------------------------------------------- carta tons */}
        <Sec id="tons" className="v8-sec--tons">
          <div className="v8-wrap">
            <Cabeca title={t.tons.title} lead={t.tons.lead} />
            <dl className="v8-tons">
              {t.tons.items.map((tom) => (
                <div key={tom.name} className="v8-tom-linha v8-sobe">
                  <dt className="v8-h3">{tom.name}</dt>
                  <dd className="v8-corpo">{tom.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Sec>

        {/* ------------------------------------------------------ processo */}
        <Sec className="v8-sec--processo">
          <div className="v8-wrap v8-wrap--medio">
            <Cabeca title={t.processo.title} lead={t.processo.lead} />
            <ol className="v8-processo">
              {t.processo.steps.map((s, idx) => (
                <li key={s.title} className="v8-passo v8-sobe">
                  <span className="v8-num" aria-hidden="true">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="v8-h3">{s.title}</h3>
                    <p className="v8-corpo">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Sec>

        {/* --------------------------------------------------------- dúvidas */}
        <Sec className="v8-sec--faq">
          <div className="v8-wrap v8-wrap--medio">
            <Cabeca title={t.faq.title} />
            <div className="v8-faq">
              {t.faq.items.map((f) => (
                <details key={f.q} className="v8-sobe">
                  <summary>
                    <span>{f.q}</span>
                  </summary>
                  <p className="v8-corpo">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Sec>

        {/* ------------------------------------------------------- contacto */}
        <Sec id="contacto" className="v8-sec--contacto">
          <div className="v8-wrap v8-contacto-grelha">
            <div className="v8-contacto-foto v8-sobe">
              <Picture
                photo={ERICA.prova}
                alt={t.photoAlt[ERICA.prova.slug]}
                sizes="(min-width: 62rem) 26rem, (min-width: 40rem) 26rem, 100vw"
                priority
              />
            </div>
            <div className="v8-contacto-texto">
              <Cabeca title={t.contacto.title} lead={t.contacto.lead} />
              <div className="v8-contacto-accoes v8-sobe">
                <a className="v8-btn v8-btn--fogo" href={whatsappHref(t, 'marcar')} {...externalLinkProps}>
                  {t.cta.primaryLong}
                </a>
                <a className="v8-btn v8-btn--linha" href={CONTACT.tel}>
                  {t.cta.secondaryLong}
                </a>
              </div>
              <p className="v8-nota v8-sobe">{t.cta.helper}</p>
            </div>
          </div>
        </Sec>
      </main>

      <footer className="v8-rodape">
        <div className="v8-wrap v8-rodape-corpo">
          <Logo shape="selo" color="branca" alt={t.a11y.marcaDecorativa} height="4.5rem" />
          <p className="v8-rodape-tagline">{t.footer.tagline}</p>
          <p className="v8-nota">{t.footer.feitoPor}</p>
          <div className="v8-rodape-fim">
            <p className="v8-nota">{t.footer.direitos}</p>
            <a className="v8-topo-link" href="#topo">
              {t.footer.voltarTopo}
            </a>
          </div>
        </div>
      </footer>

      {/* Contacto ao alcance do polegar em qualquer ponto do scroll. */}
      <div className="v8-barra">
        <a className="v8-btn v8-btn--fogo v8-barra-cta" href={whatsappHref(t, 'geral')} {...externalLinkProps}>
          {t.cta.primary}
        </a>
        <a className="v8-btn v8-btn--linha v8-barra-tel" href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
          {t.cta.secondary}
        </a>
      </div>
    </div>
  )
}
