/**
 * V6 · MANIFESTO
 *
 * Atitude. Um ecrã, uma ideia. As três frases de `t.manifesto.lines` são a
 * espinha: cada uma ocupa um ecrã inteiro, em tipografia enorme, sobre laranja
 * chapado e quase-preto alternados. Entre elas, fotografias gigantes que
 * interrompem o texto como uma pancada.
 *
 * A galeria completa (as 16) existe no fim, compacta — é a prova, não o palco.
 *
 * Tipografia: Bricolage Grotesque (variável, eixos `opsz` + `wght`) + Archivo.
 * O contraste de peso é feito dentro da mesma família — é aí que está o carácter.
 */
import type { CSSProperties } from 'react'
import './v6.css'
import { getContent } from '../../i18n'
import { GALLERY, photo } from '../../shared/photos'
import { Picture } from '../../shared/Picture'
import { Logo } from '../../shared/Logo'
import { LangSwitch } from '../../shared/LangSwitch'
import { whatsappHref, externalLinkProps, CONTACT } from '../../shared/contact'
import { useReveal } from '../../shared/useReveal'

/* ------------------------------------------------------------------ *
 * Entrada. O conteúdo está visível por omissão; `is-entering` só existe
 * antes de o elemento aparecer no ecrã (ver shared/useReveal.ts).
 * ------------------------------------------------------------------ */
function useEnter<T extends HTMLElement = HTMLDivElement>(threshold = 0.16, delay = 0) {
  const { ref, revealed } = useReveal<T>({ threshold, rootMargin: '0px 0px -6% 0px', delay })
  return { ref, cls: revealed ? '' : ' is-entering' }
}

/** Uma frase partida em palavras, para a entrada escalonada. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className="v6-w" style={{ '--i': i } as CSSProperties}>
          {w}
        </span>
      ))}
    </>
  )
}

/** Um ecrã inteiro com uma só frase. */
function Shout({ text, tone }: { text: string; tone: 'fire' | 'night' }) {
  const { ref, cls } = useEnter<HTMLDivElement>(0.25)
  return (
    <div ref={ref} className={`v6-screen v6-screen--${tone}${cls}`}>
      <p className="v6-shout">
        <Words text={text} />
      </p>
    </div>
  )
}

/** Uma fotografia gigante, a interromper. */
function Shot({ slug, alt, tall }: { slug: string; alt: string; tall?: boolean }) {
  const { ref, cls } = useEnter<HTMLElement>(0.12)
  return (
    <figure ref={ref} className={`v6-shot${tall ? ' v6-shot--tall' : ''}${cls}`}>
      <Picture photo={photo(slug)} alt={alt} sizes="100vw" ratio="auto" />
    </figure>
  )
}

export function App() {
  const t = getContent()
  const wa = whatsappHref(t)
  const waMarcar = whatsappHref(t, 'marcar')

  const hero = useEnter<HTMLElement>(0.05)
  const manifesto = useEnter<HTMLDivElement>(0.25)
  const sobre = useEnter<HTMLElement>(0.12)
  const servicos = useEnter<HTMLElement>(0.1)
  const tons = useEnter<HTMLElement>(0.1)
  const processo = useEnter<HTMLElement>(0.1)
  const trabalho = useEnter<HTMLElement>(0.08)
  const duvidas = useEnter<HTMLElement>(0.1)
  const contacto = useEnter<HTMLElement>(0.12)

  return (
    <div className="v6">
      <a className="skip-link" href="#conteudo">
        {t.a11y.skip}
      </a>

      <main id="conteudo">
        {/* ---------------------------------------------------- HERO */}
        <section className={`v6-hero${hero.cls}`} id="top" ref={hero.ref} aria-labelledby="v6-h1">
          <div className="v6-hero-photo">
            <Picture
              photo={photo('erica-retrato-estudio')}
              alt={t.photoAlt['erica-retrato-estudio']}
              sizes="100vw"
              ratio="auto"
              priority
            />
          </div>

          <header className="v6-top">
            <Logo shape="assinatura" color="branca" alt={t.a11y.logo} height="2.4rem" priority />
          </header>

          <div className="v6-hero-body">
            <h1 className="v6-roar" id="v6-h1">
              {t.hero.titleLines.map((line, i) => (
                <span className="v6-roar-line" key={i} style={{ '--i': i } as CSSProperties}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="v6-hero-lead">{t.hero.leadShort}</p>
            <a className="v6-cta" href={wa} {...externalLinkProps}>
              {t.cta.primary}
            </a>
            <p className="v6-hero-note">{t.hero.note}</p>
          </div>
        </section>

        {/* ----------------------------------------------- MANIFESTO */}
        <section className="v6-manifesto" aria-labelledby="v6-manifesto-t">
          <div ref={manifesto.ref} className={`v6-screen v6-screen--fire${manifesto.cls}`}>
            <h2 className="v6-kicker v6-kicker--ink" id="v6-manifesto-t">
              {t.manifesto.kicker}
            </h2>
            <p className="v6-shout">
              <Words text={t.manifesto.lines[0]} />
            </p>
          </div>

          <Shot slug="ruivo-acaju-camadas-longas" alt={t.photoAlt['ruivo-acaju-camadas-longas']} tall />

          <Shout text={t.manifesto.lines[1]} tone="night" />

          <Shot slug="ruivo-acaju-ondas-medias" alt={t.photoAlt['ruivo-acaju-ondas-medias']} tall />

          <Shout text={t.manifesto.lines[2]} tone="fire" />

          <div className="v6-screen v6-screen--night v6-screen--prose">
            <p className="v6-prose">{t.manifesto.body}</p>
          </div>
        </section>

        {/* --------------------------------------------------- SOBRE */}
        <section className="v6-sobre" ref={sobre.ref} aria-labelledby="v6-sobre-t">
          <div className={`v6-sobre-photo${sobre.cls}`}>
            <Picture
              photo={photo('caracois-ruivos-cobre-volume')}
              alt={t.photoAlt['caracois-ruivos-cobre-volume']}
              sizes="(min-width: 900px) 50vw, 100vw"
              ratio="auto"
            />
          </div>
          <div className={`v6-sobre-body${sobre.cls}`}>
            <h2 className="v6-title" id="v6-sobre-t">
              {t.sobre.title}
            </h2>
            <p className="v6-sobre-lead">{t.sobre.lead}</p>
            {t.sobre.body.map((p, i) => (
              <p className="v6-p" key={i}>
                {p}
              </p>
            ))}
            <p className="v6-badge">{t.sobre.badge}</p>
          </div>
        </section>

        {/* ------------------------------------------------ SERVIÇOS */}
        <section className="v6-servicos" ref={servicos.ref} aria-labelledby="v6-servicos-t">
          <div className={`v6-head${servicos.cls}`}>
            <h2 className="v6-title" id="v6-servicos-t">
              {t.servicos.title}
            </h2>
            <p className="v6-lead">{t.servicos.lead}</p>
          </div>
          <ul className={`v6-list${servicos.cls}`}>
            {t.servicos.items.map((item, i) => (
              <li className="v6-row" key={i} style={{ '--i': i } as CSSProperties}>
                <h3 className="v6-row-title">{item.title}</h3>
                <p className="v6-row-tag">{item.tag}</p>
                <p className="v6-row-body">{item.body}</p>
              </li>
            ))}
          </ul>
          <p className="v6-nota">{t.servicos.nota}</p>
        </section>

        {/* ---------------------------------------------------- TONS */}
        <section className="v6-tons" ref={tons.ref} aria-labelledby="v6-tons-t">
          <div className={`v6-head${tons.cls}`}>
            <h2 className="v6-title v6-title--light" id="v6-tons-t">
              {t.tons.title}
            </h2>
            <p className="v6-lead v6-lead--light">{t.tons.lead}</p>
          </div>
          <ul className={`v6-index${tons.cls}`}>
            {t.tons.items.map((item, i) => (
              <li className="v6-index-row" key={i} style={{ '--i': i } as CSSProperties}>
                <h3 className="v6-index-name">{item.name}</h3>
                <p className="v6-index-body">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------ PROCESSO */}
        <section className="v6-processo" ref={processo.ref} aria-labelledby="v6-processo-t">
          <div className={`v6-head${processo.cls}`}>
            <h2 className="v6-title" id="v6-processo-t">
              {t.processo.title}
            </h2>
            <p className="v6-lead">{t.processo.lead}</p>
          </div>
          <ol className={`v6-steps${processo.cls}`}>
            {t.processo.steps.map((step, i) => (
              <li className="v6-step" key={i} style={{ '--i': i } as CSSProperties}>
                <p className="v6-step-n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="v6-step-title">{step.title}</h3>
                <p className="v6-step-body">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------ TRABALHO */}
        <section className="v6-trabalho" ref={trabalho.ref} aria-labelledby="v6-trabalho-t">
          <div className={`v6-head${trabalho.cls}`}>
            <p className="v6-kicker">{t.galeria.kicker}</p>
            <h2 className="v6-title v6-title--light" id="v6-trabalho-t">
              {t.galeria.title}
            </h2>
            <p className="v6-lead v6-lead--light">{t.galeria.lead}</p>
          </div>
          <ul className={`v6-grid${trabalho.cls}`} aria-label={t.a11y.galeriaRegiao}>
            {GALLERY.map((p, i) => (
              <li className="v6-cell" key={p.slug} style={{ '--i': i } as CSSProperties}>
                <Picture
                  photo={p}
                  alt={t.photoAlt[p.slug]}
                  sizes="(min-width: 1100px) 12vw, (min-width: 560px) 24vw, 48vw"
                  ratio="auto"
                />
              </li>
            ))}
          </ul>
        </section>

        {/* -------------------------------------------------- DÚVIDAS */}
        <section className="v6-faq" ref={duvidas.ref} aria-labelledby="v6-faq-t">
          <h2 className={`v6-title${duvidas.cls}`} id="v6-faq-t">
            {t.faq.title}
          </h2>
          <div className={`v6-qs${duvidas.cls}`}>
            {t.faq.items.map((item, i) => (
              <details className="v6-q" key={i} style={{ '--i': i } as CSSProperties}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ CONTACTO */}
        <section className="v6-contacto" ref={contacto.ref} aria-labelledby="v6-contacto-t">
          <div className={`v6-contacto-photo${contacto.cls}`}>
            <Picture
              photo={photo('erica-sorriso-salao')}
              alt={t.photoAlt['erica-sorriso-salao']}
              sizes="(min-width: 900px) 45vw, 100vw"
              ratio="auto"
            />
          </div>
          <div className={`v6-contacto-body${contacto.cls}`}>
            <p className="v6-kicker v6-kicker--ink">{t.contacto.kicker}</p>
            <h2 className="v6-shout v6-shout--small" id="v6-contacto-t">
              {t.contacto.title}
            </h2>
            <p className="v6-contacto-lead">{t.contacto.lead}</p>
            <a className="v6-cta v6-cta--dark" href={waMarcar} {...externalLinkProps}>
              {t.cta.primary}
            </a>
            <p className="v6-helper">{t.cta.helper}</p>
            <a className="v6-tel" href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
              <span className="v6-tel-label">{t.contacto.telefoneLabel}</span>
              <span className="v6-tel-n">{CONTACT.phoneDisplay}</span>
            </a>
          </div>
        </section>
      </main>

      {/* -------------------------------------------------- RODAPÉ */}
      <footer className="v6-footer">
        <div className="v6-footer-brand">
          <Logo shape="icone" color="branca" alt={t.a11y.marcaDecorativa} height="3rem" />
          <p className="v6-footer-tagline">{t.footer.tagline}</p>
        </div>
        <div className="v6-footer-meta">
          <p className="v6-footer-line">{t.brand.name}</p>
          <p className="v6-footer-line">{t.footer.direitos}</p>
          <p className="v6-footer-line">{t.footer.feitoPor}</p>
        </div>
        <div className="v6-footer-tools">
          <LangSwitch t={t} className="v6-select" variant="longo" id="v6-lang-footer" />
          <a className="v6-up" href="#top">
            {t.footer.voltarTopo}
          </a>
        </div>
      </footer>

      {/* ---------------------------------- BARRA FIXA DE CONTACTO */}
      <div className="v6-bar">
        <a className="v6-bar-cta" href={wa} {...externalLinkProps} aria-label={t.cta.primaryLong}>
          {t.cta.primaryShort}
        </a>
        <a className="v6-bar-tel" href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
          {t.cta.secondary}
        </a>
        <LangSwitch t={t} className="v6-select v6-select--bar" id="v6-lang-bar" />
      </div>
    </div>
  )
}
