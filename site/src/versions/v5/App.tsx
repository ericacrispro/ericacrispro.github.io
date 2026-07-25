/**
 * V5 · Estúdio
 *
 * Claro, arejado e organizado — a versão que uma cliente nervosa acha
 * tranquilizadora. Grelha assimétrica de catálogo de exposição: o texto ocupa
 * colunas estreitas e desalinhadas, as fotografias tomam a tela e sangram das
 * margens. Laranja da marca com parcimónia: os botões, um filete, uma frase.
 *
 * Regra do projecto: nenhuma palavra escrita aqui — tudo vem de `getContent()`.
 */
import type { CSSProperties, ReactNode } from 'react'
import './v5.css'
import { getContent } from '../../i18n'
import { CONTACT } from '../../config'
import { ERICA, GALLERY, PRODUTOS } from '../../shared/photos'
import type { Photo } from '../../shared/photos'
import { Picture } from '../../shared/Picture'
import { Logo } from '../../shared/Logo'
import { LangSwitch } from '../../shared/LangSwitch'
import { whatsappHref, externalLinkProps } from '../../shared/contact'
import { useReveal } from '../../shared/useReveal'

/** Uma secção que entra suavemente. O conteúdo está visível por omissão. */
function Section({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  const { ref, revealed } = useReveal<HTMLElement>({ threshold: 0.04, rootMargin: '0px 0px -5% 0px' })
  return (
    <section id={id} ref={ref} className={['sec', className, revealed ? null : 'is-entering'].filter(Boolean).join(' ')}>
      {children}
    </section>
  )
}

/** Índice para escalonar a entrada dentro de uma lista. */
const step = (i: number): CSSProperties => ({ ['--i' as string]: i })

/**
 * Todas as fotografias vão com `priority`. Não é vaidade de performance: neste
 * projecto o `<Picture>` já é `eager` por omissão (a armadilha do `lazy` com
 * captura de página inteira está documentada), portanto o custo de rede é o
 * mesmo — o que muda é `decoding="sync"`, sem o qual as fotografias fora do
 * ecrã saem BRANCAS na captura de página inteira. Verificado nos seis viewports.
 */
const DECODE_SYNC = true

export function App() {
  const t = getContent()

  const waAgenda = whatsappHref(t, 'marcar')
  const waGeral = whatsappHref(t, 'geral')

  /** Nome do tom → chave do manifesto de fotos (ambos vêm do mesmo conteúdo). */
  const toneKey = new Map(Object.entries(t.galeria.tons).map(([key, nome]) => [nome, key]))
  const fotoDoTom = (nome: string): Photo | undefined => {
    const key = toneKey.get(nome)
    return key ? GALLERY.find((p) => p.tone === key) : undefined
  }

  return (
    <div className="v5" id="topo">
      <a className="skip-link" href="#conteudo">
        {t.a11y.skip}
      </a>

      <header className="hdr">
        <div className="wrap hdr__in">
          <a className="hdr__mark" href="#topo">
            <Logo shape="icone" color="laranja" alt={t.a11y.marcaDecorativa} height="1.9rem" priority />
            <span className="hdr__name">{t.brand.name}</span>
            <span className="hdr__tag">{t.brand.tagline}</span>
          </a>

          <nav className="hdr__nav" aria-label={t.nav.contacto}>
            <a href="#trabalho">{t.nav.trabalho}</a>
            <a href="#tons">{t.nav.tons}</a>
            <a href="#servicos">{t.nav.servicos}</a>
            <a href="#processo">{t.nav.processo}</a>
            <a href="#duvidas">{t.nav.duvidas}</a>
          </nav>

          <div className="hdr__end">
            <LangSwitch t={t} className="lang" id="lang-hdr" />
            <a className="btn btn--fire hdr__cta" href={waAgenda} {...externalLinkProps}>
              {t.cta.primaryShort}
            </a>
          </div>
        </div>
      </header>

      <main id="conteudo">
        {/* ---------------------------------------------------------------- hero */}
        <Section className="sec--hero">
          <div className="wrap hero">
            <div className="hero__text">
              <p className="fade hero__kicker" style={step(0)}>
                {t.brand.tagline}
              </p>
              <h1 className="fade hero__title" style={step(1)}>
                {t.hero.titleLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h1>
              <p className="fade hero__lead" style={step(2)}>
                <span className="wide-only">{t.hero.lead}</span>
                <span className="narrow-only">{t.hero.leadShort}</span>
              </p>
              <div className="fade hero__actions" style={step(3)}>
                <a className="btn btn--fire" href={waAgenda} {...externalLinkProps}>
                  {t.cta.primary}
                </a>
                <a className="btn btn--line" href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
                  {t.cta.secondary}
                </a>
              </div>
              <p className="fade hero__note" style={step(4)}>
                {t.hero.note}
              </p>
            </div>

            <figure className="fade hero__figure" style={step(2)}>
              <Picture
                photo={ERICA.hero}
                alt={t.photoAlt[ERICA.hero.slug]}
                sizes="(min-width: 60em) 46vw, 84vw"
                priority
                className="hero__img"
              />
            </figure>
          </div>
        </Section>

        {/* ----------------------------------------------------------- manifesto */}
        <Section className="sec--manifesto">
          <div className="wrap manifesto">
            <p className="fade manifesto__kicker" style={step(0)}>
              {t.manifesto.kicker}
            </p>
            <div className="manifesto__lines">
              {t.manifesto.lines.map((line, i) => (
                <p className="fade" key={line} style={step(i + 1)}>
                  {line}
                </p>
              ))}
            </div>
            <p className="fade manifesto__body" style={step(4)}>
              {t.manifesto.body}
            </p>
          </div>
        </Section>

        {/* --------------------------------------------------------------- sobre */}
        <Section id="sobre" className="sec--sobre">
          <div className="wrap sobre">
            <figure className="fade sobre__figure" style={step(0)}>
              <Picture
                photo={ERICA.sobre}
                alt={t.photoAlt[ERICA.sobre.slug]}
                sizes="(min-width: 60em) 42vw, 88vw"
                priority={DECODE_SYNC}
                className="sobre__img"
              />
            </figure>

            <div className="sobre__text">
              <p className="fade sec__kicker" style={step(1)}>
                {t.sobre.kicker}
              </p>
              <h2 className="fade sec__title" style={step(2)}>
                {t.sobre.title}
              </h2>
              <p className="fade sobre__lead" style={step(3)}>
                {t.sobre.lead}
              </p>
              {t.sobre.body.map((p, i) => (
                <p className="fade sobre__p" key={p.slice(0, 24)} style={step(4 + i)}>
                  {p}
                </p>
              ))}
              <p className="fade sobre__badge" style={step(7)}>
                {t.sobre.badge}
              </p>
            </div>
          </div>
        </Section>

        {/* ------------------------------------------------------------ trabalho */}
        <Section id="trabalho" className="sec--galeria">
          <div className="wrap wrap--wide">
            <div className="galeria__head">
              <h2 className="fade sec__title" style={step(0)}>
                {t.galeria.title}
              </h2>
              <p className="fade galeria__lead" style={step(1)}>
                {t.galeria.lead}
              </p>
              <p className="fade galeria__count" style={step(1)}>
                {GALLERY.length} {t.galeria.contagem}
              </p>
            </div>

            <div className="gal" role="group" aria-label={t.a11y.galeriaRegiao}>
              {GALLERY.map((p, i) => (
                <figure className="fade gal__item" key={p.slug} style={step(Math.min(i, 7))}>
                  <Picture
                    photo={p}
                    alt={t.photoAlt[p.slug]}
                    sizes="(min-width: 60em) 34vw, 46vw"
                    priority={DECODE_SYNC}
                    className="gal__img"
                  />
                  {p.tone ? <figcaption>{t.galeria.tons[p.tone]}</figcaption> : null}
                </figure>
              ))}
            </div>
          </div>
        </Section>

        {/* ------------------------------------------------------------ serviços */}
        <Section id="servicos" className="sec--servicos">
          <div className="wrap">
            <div className="sec__head">
              <p className="fade sec__kicker" style={step(0)}>
                {t.servicos.kicker}
              </p>
              <h2 className="fade sec__title" style={step(0)}>
                {t.servicos.title}
              </h2>
              <p className="fade sec__lead" style={step(1)}>
                {t.servicos.lead}
              </p>
            </div>

            <ul className="lista">
              {t.servicos.items.map((s, i) => (
                <li className="fade lista__row" key={s.title} style={step(i)}>
                  <h3 className="lista__title">{s.title}</h3>
                  <p className="lista__body">{s.body}</p>
                  <p className="lista__tag">{s.tag}</p>
                </li>
              ))}
            </ul>

            <p className="fade nota" style={step(6)}>
              {t.servicos.nota}
            </p>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- tons */}
        <Section id="tons" className="sec--tons">
          <div className="wrap">
            <div className="sec__head">
              <p className="fade sec__kicker" style={step(0)}>
                {t.tons.kicker}
              </p>
              <h2 className="fade sec__title" style={step(0)}>
                {t.tons.title}
              </h2>
              <p className="fade sec__lead" style={step(1)}>
                {t.tons.lead}
              </p>
            </div>

            <ul className="carta">
              {t.tons.items.map((tom, i) => {
                const foto = fotoDoTom(tom.name)
                return (
                  <li className="fade carta__row" key={tom.name} style={step(i)}>
                    {foto ? (
                      <Picture
                        photo={foto}
                        alt={t.photoAlt[foto.slug]}
                        sizes="(min-width: 60em) 12vw, 28vw"
                        priority={DECODE_SYNC}
                        className="carta__img"
                      />
                    ) : null}
                    <div className="carta__text">
                      <h3 className="carta__name">{tom.name}</h3>
                      <p className="carta__body">{tom.body}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </Section>

        {/* ------------------------------------------------------------ processo */}
        <Section id="processo" className="sec--processo">
          <div className="wrap">
            <div className="sec__head">
              <p className="fade sec__kicker" style={step(0)}>
                {t.processo.kicker}
              </p>
              <h2 className="fade sec__title" style={step(0)}>
                {t.processo.title}
              </h2>
              <p className="fade sec__lead" style={step(1)}>
                {t.processo.lead}
              </p>
            </div>

            <ol className="passos">
              {t.processo.steps.map((s, i) => (
                <li className="fade passos__item" key={s.title} style={step(i)}>
                  <span className="passos__n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className="passos__title">{s.title}</h3>
                  <p className="passos__body">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        {/* ------------------------------------------------------------ produtos */}
        <Section className="sec--produtos">
          <div className="wrap produtos">
            <div className="produtos__text">
              <p className="fade sec__kicker" style={step(0)}>
                {t.produtos.kicker}
              </p>
              <h2 className="fade sec__title" style={step(0)}>
                {t.produtos.title}
              </h2>
              <p className="fade sec__lead" style={step(1)}>
                {t.produtos.lead}
              </p>
            </div>
            <div className="produtos__fotos">
              {PRODUTOS.map((p, i) => (
                <Picture
                  key={p.slug}
                  photo={p}
                  alt={t.photoAlt[p.slug]}
                  sizes="(min-width: 60em) 22vw, 44vw"
                  priority={DECODE_SYNC}
                  className="fade produtos__img"
                  style={step(i + 1)}
                />
              ))}
            </div>
          </div>
        </Section>

        {/* -------------------------------------------------------------- dúvidas */}
        <Section id="duvidas" className="sec--faq">
          <div className="wrap faq">
            <div className="faq__head">
              <p className="fade sec__kicker" style={step(0)}>
                {t.faq.kicker}
              </p>
              <h2 className="fade sec__title" style={step(0)}>
                {t.faq.title}
              </h2>
            </div>
            <div className="faq__list">
              {t.faq.items.map((item, i) => (
                <details className="fade faq__item" key={item.q} style={step(i)}>
                  <summary>
                    <span>{item.q}</span>
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>

        {/* ------------------------------------------------------------ contacto */}
        <Section id="contacto" className="sec--contacto">
          <div className="wrap contacto">
            <div className="contacto__text">
              <p className="fade sec__kicker" style={step(0)}>
                {t.contacto.kicker}
              </p>
              <h2 className="fade sec__title" style={step(0)}>
                {t.contacto.title}
              </h2>
              <p className="fade contacto__lead" style={step(1)}>
                {t.contacto.lead}
              </p>

              <a className="fade btn btn--fire btn--big" href={waGeral} style={step(2)} {...externalLinkProps}>
                {t.cta.primaryLong}
              </a>
              <p className="fade contacto__helper" style={step(3)}>
                {t.cta.helper}
              </p>

              <dl className="fade contacto__dados" style={step(4)}>
                <div>
                  <dt>{t.contacto.whatsappLabel}</dt>
                  <dd>
                    <a href={waGeral} {...externalLinkProps}>
                      {CONTACT.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>{t.contacto.telefoneLabel}</dt>
                  <dd>
                    <a href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
                      {CONTACT.phoneDisplay}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <figure className="fade contacto__figure" style={step(2)}>
              <Picture
                photo={ERICA.prova}
                alt={t.photoAlt[ERICA.prova.slug]}
                sizes="(min-width: 60em) 40vw, 88vw"
                priority={DECODE_SYNC}
                className="contacto__img"
              />
            </figure>
          </div>
        </Section>
      </main>

      <footer className="rodape">
        <div className="wrap rodape__in">
          <div className="rodape__marca">
            <Logo shape="assinatura" color="duas-cores" alt={t.a11y.logo} height="3.4rem" />
            <p>{t.footer.tagline}</p>
          </div>

          <nav className="rodape__indice" aria-label={t.nav.trabalho}>
            <a href="#sobre">{t.nav.sobre}</a>
            <a href="#trabalho">{t.nav.trabalho}</a>
            <a href="#servicos">{t.nav.servicos}</a>
            <a href="#tons">{t.nav.tons}</a>
            <a href="#processo">{t.nav.processo}</a>
            <a href="#duvidas">{t.nav.duvidas}</a>
            <a href="#contacto">{t.nav.contacto}</a>
          </nav>

          <div className="rodape__fim">
            <div className="rodape__lang">
              <LangSwitch t={t} className="lang" variant="longo" id="lang-rodape" />
            </div>
            <a className="rodape__topo" href="#topo">
              {t.footer.voltarTopo}
            </a>
          </div>
        </div>

        <div className="wrap rodape__legal">
          <p>{t.footer.feitoPor}</p>
          <p>
            {t.brand.name} — {t.footer.direitos}
          </p>
        </div>
      </footer>

      {/* Barra de contacto: no telemóvel, o WhatsApp está sempre à mão. */}
      <div className="ctabar">
        <a className="btn btn--fire ctabar__main" href={waAgenda} {...externalLinkProps}>
          {t.cta.primary}
        </a>
        <a className="btn btn--line ctabar__tel" href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
          {t.cta.secondary}
        </a>
      </div>
    </div>
  )
}
