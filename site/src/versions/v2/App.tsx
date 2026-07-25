/**
 * V2 · "Espelho" — o salão à noite.
 *
 * Fundo quase-preto queimado; a luz vem toda das fotografias. No desktop a
 * fotografia fica fixa numa coluna de 42% (sticky) e o conteúdo passa ao lado,
 * como quem está sentado à frente do espelho: o painel reflecte a secção onde
 * a pessoa está (troca de fotografia + nav marcada). No telemóvel a fotografia
 * é a primeira dobra inteira e o conteúdo desliza por cima dela.
 *
 * Regra do projecto respeitada aqui: nenhuma frase escrita no JSX — tudo vem de
 * `getContent()`; nenhum link de contacto à mão — sai de `shared/contact.ts`.
 *
 * Nota sobre `priority` em todas as fotografias: é o mesmo problema já
 * documentado em DESIGN.md ("lazy + captura de página inteira = foto branca").
 * Com `decoding="async"` (o omisso do `Picture`), a captura de página inteira
 * redimensiona a janela e o Chrome pinta os retratos vazios — todos. `priority`
 * é o único interruptor que o `Picture` expõe para `decoding="sync"`, e sem ele
 * `scripts/shots.mjs` mostra a página inteira sem uma única fotografia.
 */
import { useEffect, useState } from 'react'
import './v2.css'
import { getContent } from '../../i18n'
import { CONTACT, externalLinkProps, whatsappHref } from '../../shared/contact'
import { ERICA, GALLERY, HEROES, PRODUTOS, photo, type Photo } from '../../shared/photos'
import { Picture } from '../../shared/Picture'
import { Logo } from '../../shared/Logo'
import { LangSwitch, LangTabs } from '../../shared/LangSwitch'

/**
 * As fotografias do espelho, por cena. O índice 0 é o estado inicial — se o
 * IntersectionObserver não existir, o painel fica nesta e a página não perde
 * nada.
 */
const SCENES: Photo[] = [
  ERICA.hero, // 0 · abertura
  ERICA.sobre, // 1 · sobre
  HEROES[0], // 2 · trabalho
  HEROES[1], // 3 · serviços
  HEROES[2], // 4 · tons e dúvidas
  photo('erica-com-coloracao-kc-color'), // 5 · como funciona
  ERICA.prova, // 6 · contacto
]

/** Ordem dos tons em `t.tons.items` → slug do manifesto de fotos (independente do idioma). */
const TONE_SLUGS = ['cobre', 'acaju', 'gengibre', 'cereja', 'laranja', 'ruivo-escuro']

/** Fotografias que a galeria mostra a toda a largura, para quebrar a grelha. */
const WIDE = new Set([0, 9])

type Spot = { scene: number; nav: string }

/** Faixa de fotografia que só o telemóvel vê — no desktop está no espelho. */
function Band({ p, alt }: { p: Photo; alt: string }) {
  return (
    <figure className="v2-band">
      <Picture photo={p} alt={alt} sizes="100vw" priority />
    </figure>
  )
}

/** Que secção está no meio do ecrã — alimenta o espelho e a marcação da nav. */
function useSpot(): Spot {
  const [spot, setSpot] = useState<Spot>({ scene: 0, nav: '' })

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'))
    if (!els.length || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const el = e.target as HTMLElement
          const scene = Number(el.dataset.scene)
          if (Number.isNaN(scene)) continue
          setSpot({ scene, nav: el.dataset.nav ?? '' })
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return spot
}

export function App() {
  const t = getContent()
  const spot = useSpot()
  const ano = new Date().getFullYear()

  const links = [
    { id: 'sobre', label: t.nav.sobre },
    { id: 'trabalho', label: t.nav.trabalho },
    { id: 'tons', label: t.nav.tons },
    { id: 'servicos', label: t.nav.servicos },
    { id: 'processo', label: t.nav.processo },
    { id: 'duvidas', label: t.nav.duvidas },
    { id: 'contacto', label: t.nav.contacto },
  ]

  return (
    <div className="v2" id="topo">
      <a className="skip-link" href="#conteudo">
        {t.a11y.skip}
      </a>

      <header className="v2-head">
        <Logo shape="icone" color="branca" alt={t.a11y.logo} className="v2-head__mark" priority />
        <LangTabs t={t} className="v2-langs" />
      </header>

      <div className="v2-shell">
        {/* ── O espelho: fica, enquanto o conteúdo passa. Só no desktop. ── */}
        <aside className="v2-mirror" aria-label={t.brand.tagline}>
          <div className="v2-mirror__inner">
            <div className="v2-mirror__halo" aria-hidden="true" />
            <div className="v2-mirror__stage">
              {SCENES.map((p, i) => (
                <Picture
                  key={p.slug + i}
                  photo={p}
                  alt={i === 0 ? t.photoAlt[p.slug] : ''}
                  sizes="42vw"
                  priority
                  className={`v2-mirror__shot${i === spot.scene ? ' is-on' : ''}`}
                />
              ))}
            </div>
            <div className="v2-mirror__veil" aria-hidden="true" />

            <div className="v2-mirror__panel">
              <Logo shape="assinatura" color="branca" alt="" height="2.75rem" className="v2-mirror__sign" />
              <nav className="v2-mirror__nav" aria-label={t.nav.contacto}>
                <ul>
                  {links.map((l) => (
                    <li key={l.id}>
                      <a href={`#${l.id}`} aria-current={spot.nav === l.id ? 'true' : undefined}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <a
                className="v2-btn v2-btn--fire"
                href={whatsappHref(t, 'marcar')}
                {...externalLinkProps}
                aria-label={t.cta.primaryLong}
              >
                {t.cta.primary}
              </a>
              <p className="v2-mirror__helper">{t.cta.helperShort}</p>
            </div>
          </div>
        </aside>

        <main className="v2-column" id="conteudo">
          {/* ── Primeira dobra ─────────────────────────────────────────── */}
          <section className="v2-hero" data-scene="0">
            <div className="v2-hero__photo">
              <Picture photo={ERICA.hero} alt={t.photoAlt[ERICA.hero.slug]} sizes="100vw" priority />
              <span className="v2-hero__scrim" aria-hidden="true" />
            </div>
            <div className="v2-hero__inner">
              <h1 className="v2-hero__title">
                {t.hero.titleLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h1>
              <p className="v2-hero__note">{t.hero.note}</p>
            </div>
          </section>

          <div className="v2-flow">
            {/* ── Abertura + manifesto ─────────────────────────────────── */}
            <section className="v2-open" aria-label={t.manifesto.kicker} data-scene="0" data-nav="">
              <p className="v2-open__lead">{t.hero.lead}</p>
              <div className="v2-actions">
                <a
                  className="v2-btn v2-btn--fire"
                  href={whatsappHref(t)}
                  {...externalLinkProps}
                  aria-label={t.cta.primaryLong}
                >
                  {t.cta.primary}
                </a>
                <a className="v2-btn v2-btn--ghost" href="#trabalho">
                  {t.cta.verTrabalho}
                </a>
              </div>
              <p className="v2-open__helper">{t.cta.helper}</p>

              <div className="v2-manifesto">
                <p className="v2-manifesto__lines">
                  {t.manifesto.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
                <p className="v2-manifesto__body">{t.manifesto.body}</p>
              </div>
            </section>

            {/* ── Quem é ela ───────────────────────────────────────────── */}
            <section className="v2-sec" id="sobre" aria-label={t.sobre.kicker} data-scene="1" data-nav="sobre">
              <Band p={ERICA.sobre} alt={t.photoAlt[ERICA.sobre.slug]} />
              <h2 className="v2-title">{t.sobre.title}</h2>
              <p className="v2-sec__lead">{t.sobre.lead}</p>
              <div className="v2-prose">
                {t.sobre.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="v2-badge">{t.sobre.badge}</p>
            </section>

            {/* ── O trabalho: as 16 ────────────────────────────────────── */}
            <section className="v2-sec" id="trabalho" aria-label={t.a11y.galeriaRegiao} data-scene="2" data-nav="trabalho">
              <h2 className="v2-title">{t.galeria.title}</h2>
              <p className="v2-sec__lead">{t.galeria.lead}</p>
              <p className="v2-count">
                <strong>{GALLERY.length}</strong> {t.galeria.contagem}
              </p>
              <div className="v2-grid">
                {GALLERY.map((p, i) => (
                  <figure key={p.slug} className={`v2-shot${WIDE.has(i) ? ' v2-shot--wide' : ''}`}>
                    <Picture
                      photo={p}
                      alt={t.photoAlt[p.slug]}
                      sizes={WIDE.has(i) ? '(min-width: 1024px) 50vw, 92vw' : '(min-width: 1024px) 25vw, 46vw'}
                      priority
                    />
                    {p.tone ? <figcaption>{t.galeria.tons[p.tone]}</figcaption> : null}
                  </figure>
                ))}
              </div>
            </section>

            {/* ── Carta de tons ────────────────────────────────────────── */}
            <section className="v2-sec" id="tons" aria-label={t.tons.kicker} data-scene="4" data-nav="tons">
              <Band p={HEROES[2]} alt={t.photoAlt[HEROES[2].slug]} />
              <h2 className="v2-title">{t.tons.title}</h2>
              <p className="v2-sec__lead">{t.tons.lead}</p>
              <ul className="v2-tons">
                {t.tons.items.map((item, i) => {
                  const slug = TONE_SLUGS[i]
                  const p = GALLERY.find((g) => g.tone === slug)
                  return (
                    <li key={item.name}>
                      {p ? (
                        <Picture
                          photo={p}
                          alt={t.photoAlt[p.slug]}
                          sizes="120px"
                          priority
                          className="v2-tons__thumb"
                        />
                      ) : null}
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.body}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>

            {/* ── Serviços + produto ───────────────────────────────────── */}
            <section className="v2-sec" id="servicos" aria-label={t.servicos.kicker} data-scene="3" data-nav="servicos">
              <Band p={HEROES[1]} alt={t.photoAlt[HEROES[1].slug]} />
              <h2 className="v2-title">{t.servicos.title}</h2>
              <p className="v2-sec__lead">{t.servicos.lead}</p>
              <ul className="v2-serv">
                {t.servicos.items.map((item, i) => (
                  <li key={item.title} className={i === 0 ? 'is-first' : undefined}>
                    <h3>{item.title}</h3>
                    <p className="v2-serv__tag">{item.tag}</p>
                    <p className="v2-serv__body">{item.body}</p>
                  </li>
                ))}
              </ul>
              <p className="v2-note">{t.servicos.nota}</p>

              <div className="v2-prod">
                <h3 className="v2-prod__title">{t.produtos.title}</h3>
                <p className="v2-prod__lead">{t.produtos.lead}</p>
                <div className="v2-prod__row">
                  {PRODUTOS.map((p) => (
                    <Picture key={p.slug} photo={p} alt={t.photoAlt[p.slug]} sizes="(min-width: 1024px) 15vw, 30vw" priority />
                  ))}
                </div>
              </div>
            </section>

            {/* ── Como funciona ────────────────────────────────────────── */}
            <section className="v2-sec" id="processo" aria-label={t.processo.kicker} data-scene="5" data-nav="processo">
              <h2 className="v2-title">{t.processo.title}</h2>
              <p className="v2-sec__lead">{t.processo.lead}</p>
              <ol className="v2-steps">
                {t.processo.steps.map((s) => (
                  <li key={s.title}>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* ── Dúvidas ──────────────────────────────────────────────── */}
            <section className="v2-sec" id="duvidas" aria-label={t.faq.kicker} data-scene="4" data-nav="duvidas">
              <h2 className="v2-title">{t.faq.title}</h2>
              <div className="v2-faq">
                {t.faq.items.map((item) => (
                  <details key={item.q}>
                    <summary>
                      <span>{item.q}</span>
                      <span className="v2-faq__mark" aria-hidden="true" />
                    </summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* ── Contacto ─────────────────────────────────────────────── */}
            <section className="v2-sec v2-contact" id="contacto" aria-label={t.contacto.kicker} data-scene="6" data-nav="contacto">
              <Band p={ERICA.prova} alt={t.photoAlt[ERICA.prova.slug]} />
              <h2 className="v2-title">{t.contacto.title}</h2>
              <p className="v2-sec__lead">{t.contacto.lead}</p>
              <div className="v2-actions v2-actions--stack">
                <a
                  className="v2-btn v2-btn--fire v2-btn--big"
                  href={whatsappHref(t, 'marcar')}
                  {...externalLinkProps}
                  aria-label={t.cta.primaryLong}
                >
                  {t.cta.primary}
                </a>
                <a className="v2-btn v2-btn--ghost" href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
                  <span>{t.cta.secondary}</span>
                  <span className="v2-btn__sub">{CONTACT.phoneDisplay}</span>
                </a>
              </div>
              <dl className="v2-facts">
                <div>
                  <dt>{t.contacto.whatsappLabel}</dt>
                  <dd>{CONTACT.phoneDisplay}</dd>
                </div>
                <div>
                  <dt>{t.contacto.horarioLabel}</dt>
                  <dd>{t.contacto.horarioPendente}</dd>
                </div>
              </dl>
            </section>
          </div>
        </main>
      </div>

      <footer className="v2-foot">
        <div className="v2-foot__brand">
          <Logo shape="assinatura" color="branca" alt="" height="3rem" />
          <p>{t.footer.tagline}</p>
        </div>
        <div className="v2-foot__meta">
          <p>{t.footer.feitoPor}</p>
          <p>
            <span>{t.brand.name}</span> <span>{ano}</span> <span>{t.footer.direitos}</span>
          </p>
        </div>
        <div className="v2-foot__tools">
          <LangSwitch t={t} variant="longo" className="v2-select" id="v2-lang" />
          <a className="v2-top" href="#topo">
            {t.footer.voltarTopo}
          </a>
        </div>
      </footer>

      {/* ── Barra de contacto: no telemóvel, em qualquer ponto do scroll. ── */}
      <div className="v2-bar">
        <a
          className="v2-btn v2-btn--fire"
          href={whatsappHref(t, 'marcar')}
          {...externalLinkProps}
          aria-label={t.cta.primaryLong}
        >
          {t.cta.primaryShort}
        </a>
        <a className="v2-btn v2-btn--ghost" href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
          {t.cta.secondary}
        </a>
      </div>
    </div>
  )
}
