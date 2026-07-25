/**
 * V1 · CHAMA
 *
 * Cartaz de concerto, não folheto de salão. O laranja da marca (--fire-500)
 * cobre a superfície, a fotografia sangra de cima a baixo e a chama-raposa do
 * logótipo entra recortada como marca de água. Anton condensada em caixa alta
 * faz o volume; Archivo trata do resto.
 *
 * Regra do projecto respeitada à risca: nenhuma palavra escrita aqui — tudo sai
 * de `getContent()`.
 */
import './v1.css'
import { getContent } from '../../i18n'
import { BRAND } from '../../config'
import { ERICA, GALLERY, HEROES, type Photo } from '../../shared/photos'
import { Picture } from '../../shared/Picture'
import { Logo } from '../../shared/Logo'
import { LangSwitch } from '../../shared/LangSwitch'
import { CONTACT, externalLinkProps, whatsappHref } from '../../shared/contact'
import { useReveal } from '../../shared/useReveal'

/** A foto do hero: caracóis cobre, sujeito centrado — aguenta o recorte vertical. */
const HERO_PHOTO: Photo = HEROES[1] ?? HEROES[0]

/** Marca de água: a chama-raposa, recortada pela margem. */
function Chama({ className, tone }: { className: string; tone: 'quente' | 'clara' }) {
  const t = getContent()
  return <Logo shape="icone" color={tone === 'clara' ? 'branca' : 'oliva'} alt={t.a11y.marcaDecorativa} className={className} />
}

export function App() {
  const t = getContent()
  const year = new Date().getFullYear()

  const hero = useReveal<HTMLElement>({ threshold: 0.01, rootMargin: '0px' })
  const manifesto = useReveal<HTMLElement>({ threshold: 0.2 })

  /** Ordem dos tons: vem do próprio conteúdo, alinhada com `t.tons.items`. */
  const toneKeys = Object.keys(t.galeria.tons)
  const toneShot = (key: string): Photo | undefined =>
    [...GALLERY].reverse().find((p) => p.tone === key)

  const waMarcar = whatsappHref(t, 'marcar')
  const waGeral = whatsappHref(t, 'geral')
  const waCorreccao = whatsappHref(t, 'correcao')

  return (
    <div className="v1" id="v1-topo">
      <a className="skip-link" href="#conteudo">
        {t.a11y.skip}
      </a>

      <header className="v1-header">
        <a className="v1-header__brand" href="#v1-topo">
          <Logo shape="assinatura" color="branca" alt={t.a11y.logo} height="2rem" priority />
        </a>

        <nav className="v1-nav" aria-label={t.nav.contacto}>
          <a href="#sobre">{t.nav.sobre}</a>
          <a href="#trabalho">{t.nav.trabalho}</a>
          <a href="#servicos">{t.nav.servicos}</a>
          <a href="#tons">{t.nav.tons}</a>
          <a href="#duvidas">{t.nav.duvidas}</a>
        </nav>

        <div className="v1-header__tools">
          <LangSwitch t={t} className="v1-select" id="v1-lang-topo" />
          <a className="v1-btn v1-btn--fogo v1-header__cta" href={waMarcar} {...externalLinkProps}>
            {t.cta.primary}
          </a>
        </div>
      </header>

      <main id="conteudo">
        {/* ---------------------------------------------------------- HERO */}
        <section className={`v1-hero${hero.revealed ? '' : ' is-entering'}`} ref={hero.ref} aria-label={t.brand.tagline}>
          <div className="v1-hero__color">
            <Chama className="v1-hero__mark" tone="quente" />
            <div className="v1-hero__text">
              <h1 className="v1-hero__title">
                {t.hero.titleLines.map((linha) => (
                  <span className="v1-line" key={linha}>
                    <span>{linha}</span>
                  </span>
                ))}
              </h1>
              <p className="v1-hero__lead">
                <span className="v1-xs">{t.hero.leadShort}</span>
                <span className="v1-sm">{t.hero.lead}</span>
              </p>
              <div className="v1-hero__acao">
                <a className="v1-btn v1-btn--ink" href={waMarcar} {...externalLinkProps}>
                  {t.cta.primary}
                </a>
                <p className="v1-hero__nota">{t.hero.note}</p>
              </div>
            </div>
            <p className="v1-hero__scroll">{t.hero.scroll}</p>
          </div>

          <Picture
            className="v1-hero__foto"
            photo={HERO_PHOTO}
            alt={t.photoAlt[HERO_PHOTO.slug]}
            sizes="(min-width: 900px) 44vw, 100vw"
            priority
            ratio="auto"
          />
        </section>

        {/* ----------------------------------------------------- MANIFESTO */}
        <section
          className={`v1-manifesto${manifesto.revealed ? '' : ' is-entering'}`}
          ref={manifesto.ref}
          aria-label={t.manifesto.kicker}
        >
          <p className="v1-kicker">{t.manifesto.kicker}</p>
          <p className="v1-manifesto__linhas">
            {t.manifesto.lines.map((linha) => (
              <span key={linha}>{linha}</span>
            ))}
          </p>
          <p className="v1-manifesto__corpo">{t.manifesto.body}</p>
        </section>

        {/* --------------------------------------------------------- SOBRE */}
        <section className="v1-sobre" id="sobre">
          <div className="v1-sobre__media">
            <Picture
              className="v1-sobre__foto"
              photo={ERICA.sobre}
              alt={t.photoAlt[ERICA.sobre.slug]}
              sizes="(min-width: 900px) 42vw, 100vw"
              ratio="auto"
            />
            <Picture
              className="v1-sobre__inset"
              photo={ERICA.prova}
              alt={t.photoAlt[ERICA.prova.slug]}
              sizes="(min-width: 900px) 16vw, 40vw"
              ratio="auto"
            />
          </div>

          <div className="v1-sobre__texto">
            <h2 className="v1-h2">{t.sobre.title}</h2>
            <p className="v1-lead">{t.sobre.lead}</p>
            {t.sobre.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="v1-badge">{t.sobre.badge}</p>
          </div>
        </section>

        {/* ------------------------------------------------------- GALERIA */}
        <section className="v1-galeria" id="trabalho">
          <div className="v1-galeria__topo">
            <h2 className="v1-h2 v1-h2--claro">{t.galeria.title}</h2>
            <p className="v1-lead v1-lead--claro">{t.galeria.lead}</p>
            <p className="v1-contagem">
              {GALLERY.length} {t.galeria.contagem}
            </p>
          </div>

          <div className="v1-grid">
            {GALLERY.map((p) => (
              <Picture
                key={p.slug}
                className="v1-shot"
                photo={p}
                alt={t.photoAlt[p.slug]}
                sizes="(min-width: 860px) 25vw, 50vw"
                ratio="auto"
              />
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------ SERVIÇOS */}
        <section className="v1-servicos" id="servicos">
          <div className="v1-servicos__topo">
            <h2 className="v1-h2">{t.servicos.title}</h2>
            <p className="v1-lead">{t.servicos.lead}</p>
          </div>

          <ul className="v1-servicos__lista">
            {t.servicos.items.map((s) => (
              <li key={s.title}>
                <h3 className="v1-servico__titulo">{s.title}</h3>
                <p className="v1-servico__tag">{s.tag}</p>
                <p className="v1-servico__corpo">{s.body}</p>
              </li>
            ))}
          </ul>

          <p className="v1-servicos__nota">{t.servicos.nota}</p>
        </section>

        {/* ---------------------------------------------------------- TONS */}
        <section className="v1-tons" id="tons">
          <div className="v1-tons__topo">
            <h2 className="v1-h2">{t.tons.title}</h2>
            <p className="v1-lead">{t.tons.lead}</p>
          </div>

          <ul className="v1-tons__lista">
            {t.tons.items.map((tom, i) => {
              const shot = toneShot(toneKeys[i] ?? '')
              return (
                <li key={tom.name}>
                  {shot ? (
                    <Picture
                      className="v1-tom__amostra"
                      photo={shot}
                      alt={t.photoAlt[shot.slug]}
                      sizes="120px"
                      ratio="auto"
                    />
                  ) : null}
                  <div className="v1-tom__texto">
                    <h3 className="v1-tom__nome">{tom.name}</h3>
                    <p>{tom.body}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        {/* ------------------------------------------------------- PROCESSO */}
        <section className="v1-processo" id="processo">
          <div className="v1-processo__topo">
            <h2 className="v1-h2 v1-h2--claro">{t.processo.title}</h2>
            <p className="v1-lead v1-lead--claro">{t.processo.lead}</p>
          </div>

          <ol className="v1-passos">
            {t.processo.steps.map((passo) => (
              <li key={passo.title}>
                <h3 className="v1-passo__titulo">{passo.title}</h3>
                <p>{passo.body}</p>
              </li>
            ))}
          </ol>

          <a className="v1-btn v1-btn--fogo v1-processo__cta" href={waCorreccao} {...externalLinkProps}>
            {t.cta.primaryLong}
          </a>
        </section>

        {/* ----------------------------------------------------------- FAQ */}
        <section className="v1-faq" id="duvidas">
          <h2 className="v1-h2">{t.faq.title}</h2>
          <div className="v1-faq__lista">
            {t.faq.items.map((item) => (
              <details className="v1-faq__item" key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------ CONTACTO */}
        <section className="v1-contacto" id="contacto">
          <Chama className="v1-contacto__mark" tone="quente" />

          <div className="v1-contacto__texto">
            <h2 className="v1-h2 v1-h2--gigante">{t.contacto.title}</h2>
            <p className="v1-lead">{t.contacto.lead}</p>

            <a className="v1-btn v1-btn--ink v1-btn--largo" href={waGeral} {...externalLinkProps}>
              {t.cta.primaryLong}
            </a>
            <p className="v1-hero__nota">{t.cta.helper}</p>

            <dl className="v1-factos">
              <div>
                <dt>{t.contacto.telefoneLabel}</dt>
                <dd>
                  <a href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
                    {CONTACT.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt>{t.contacto.horarioLabel}</dt>
                <dd>{t.contacto.horarioPendente}</dd>
              </div>
              {BRAND.city ? (
                <div>
                  <dt>{t.contacto.localLabel}</dt>
                  <dd>{BRAND.city}</dd>
                </div>
              ) : null}
              {CONTACT.instagramUrl ? (
                <div>
                  <dt>{t.contacto.instagramLabel}</dt>
                  <dd>
                    <a href={CONTACT.instagramUrl} {...externalLinkProps}>
                      {t.cta.instagram}
                    </a>
                  </dd>
                </div>
              ) : null}
              {CONTACT.mapsUrl ? (
                <div>
                  <dt>{t.contacto.localLabel}</dt>
                  <dd>
                    <a href={CONTACT.mapsUrl} {...externalLinkProps}>
                      {t.cta.maps}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <Picture
            className="v1-contacto__foto"
            photo={ERICA.hero}
            alt={t.photoAlt[ERICA.hero.slug]}
            sizes="(min-width: 900px) 34vw, 100vw"
            ratio="auto"
          />
        </section>
      </main>

      <footer className="v1-footer">
        <div className="v1-footer__marca">
          <Logo shape="assinatura" color="branca" alt={t.a11y.logo} height="3.25rem" />
          <p className="v1-footer__tagline">{t.footer.tagline}</p>
        </div>

        <div className="v1-footer__fim">
          <p>{t.footer.feitoPor}</p>
          <p>
            © {year} {t.brand.name}. {t.footer.direitos}
          </p>
        </div>

        <div className="v1-footer__tools">
          <LangSwitch t={t} variant="longo" className="v1-select v1-select--claro" id="v1-lang-rodape" />
          <a className="v1-toplink" href="#v1-topo">
            {t.footer.voltarTopo}
          </a>
        </div>
      </footer>

      {/* Barra fixa: o WhatsApp ao alcance do polegar em qualquer ponto do scroll. */}
      <div className="v1-barra">
        <a className="v1-btn v1-btn--fogo v1-barra__wa" href={waMarcar} {...externalLinkProps}>
          <span className="v1-xs">{t.cta.primaryShort}</span>
          <span className="v1-sm">{t.cta.primary}</span>
        </a>
        <a className="v1-btn v1-btn--linha" href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
          {t.cta.secondary}
        </a>
      </div>
    </div>
  )
}
