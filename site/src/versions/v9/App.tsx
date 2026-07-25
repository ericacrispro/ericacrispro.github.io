/**
 * V9 · "Conversa"
 *
 * O primeiro contacto da Érica é sempre por mensagem. Esta versão assume isso:
 * a página é a troca que ela já tem todos os dias — as dúvidas de quem chega
 * alinhadas a um lado, a voz dela do outro, e as fotografias a entrar como
 * prova enviada no meio da conversa.
 *
 * Não imita a interface de nenhuma aplicação de mensagens: a linguagem é a da
 * marca (laranja-fogo, quase-preto, Archivo grande). Não há horas, "visto às"
 * nem estados de leitura — seria simular uma conversa que não aconteceu.
 *
 * Ritmo deliberado: conversa · fotografia grande · conversa · galeria · conversa.
 * No telemóvel é uma coluna; a partir dos 60rem a conversa ganha uma fotografia
 * ao lado, para o desktop não ser uma coluna perdida no meio do ecrã.
 */
import type { ReactNode } from 'react'
import './v9.css'
import { getContent } from '../../i18n'
import { LangSwitch } from '../../shared/LangSwitch'
import { Logo } from '../../shared/Logo'
import { Picture } from '../../shared/Picture'
import { ERICA, GALLERY, HEROES, PRODUTOS, type Photo } from '../../shared/photos'
import { CONTACT, externalLinkProps, whatsappHref } from '../../shared/contact'
import { useReveal } from '../../shared/useReveal'

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

/** Ordem dos tons na carta (`t.tons.items`) — as chaves das fotografias. */
const TONE_KEYS = ['cobre', 'acaju', 'gengibre', 'cereja', 'laranja', 'ruivo-escuro']

type Side = 'them' | 'her'
type Tone = 'fire' | 'ink' | 'plain'

/**
 * Uma mensagem. `side` diz quem fala (esquerda = quem chega, direita = ela),
 * `tone` é a superfície. Entra escalonada, mas o conteúdo está visível por
 * omissão — a classe só sai, nunca entra depois.
 */
function Msg({
  side,
  tone = 'plain',
  delay = 0,
  className,
  children,
}: {
  side: Side
  tone?: Tone
  delay?: number
  className?: string
  children: ReactNode
}) {
  const { ref, revealed } = useReveal<HTMLParagraphElement>({ delay })
  return (
    <p ref={ref} className={cx('msg', `msg--${side}`, `msg--${tone}`, className, !revealed && 'is-entering')}>
      {children}
    </p>
  )
}

/** Bloco genérico que entra escalonado (mesmas regras do `Msg`). */
function Rise({ delay = 0, className, children }: { delay?: number; className?: string; children: ReactNode }) {
  const { ref, revealed } = useReveal<HTMLDivElement>({ delay })
  return (
    <div ref={ref} className={cx('rise', className, !revealed && 'is-entering')}>
      {children}
    </div>
  )
}

/** Quem está a falar: a chama-raposa + o primeiro nome. */
function Speaker({ name, alt, dark }: { name: string; alt: string; dark?: boolean }) {
  return (
    <p className="speaker">
      <Logo shape="icone" color={dark ? 'branca' : 'laranja'} alt={alt} height="1.4rem" className="speaker__mark" />
      <span>{name}</span>
    </p>
  )
}

/**
 * Uma fotografia enviada no meio da conversa.
 *
 * Sem `lazy`: o Chrome adia a pintura e a foto sai em branco na captura de
 * página inteira (armadilha já paga, `docs/DESIGN.md`).
 */
function Sent({
  photo,
  alt,
  sizes,
  className,
  priority,
}: {
  photo: Photo
  alt: string
  sizes: string
  className?: string
  priority?: boolean
}) {
  return (
    <figure className={cx('sent', className)}>
      <Picture photo={photo} alt={alt} sizes={sizes} priority={priority} className="sent__img" />
    </figure>
  )
}

export function App() {
  const t = getContent()
  const mark = t.a11y.marcaDecorativa
  const toneShot = (i: number): Photo | undefined => GALLERY.find((p) => p.tone === TONE_KEYS[i])

  return (
    <>
      <a className="skip-link" href="#conteudo">
        {t.a11y.skip}
      </a>

      <header className="top" id="topo">
        <div className="top__in">
          <p className="lockup">
            <Logo shape="icone" color="laranja" alt={mark} height="2.1rem" className="lockup__mark" priority />
            <span className="lockup__text">
              <span className="lockup__name">{t.brand.firstName}</span>
              <span className="lockup__sig">{t.brand.signature}</span>
            </span>
          </p>

          <nav className="topnav">
            <a href="#sobre">{t.nav.sobre}</a>
            <a href="#trabalho">{t.nav.trabalho}</a>
            <a href="#servicos">{t.nav.servicos}</a>
            <a href="#tons">{t.nav.tons}</a>
            <a href="#processo">{t.nav.processo}</a>
            <a href="#duvidas">{t.nav.duvidas}</a>
          </nav>

          <div className="top__right">
            <LangSwitch t={t} className="lang" />
            <a className="btn btn--ink top__cta" href={whatsappHref(t, 'geral')} {...externalLinkProps}>
              {t.cta.primaryShort}
            </a>
          </div>
        </div>
      </header>

      <main id="conteudo">
        {/* 1 · abertura — a primeira mensagem dela */}
        <section className="hero">
          <div className="wrap hero__in">
            <div className="thread hero__thread">
              <p className="chip chip--fire">{t.brand.tagline}</p>
              <h1 className="msg msg--her msg--fire hero__h1">
                {t.hero.titleLines.map((line) => (
                  <span key={line} className="hero__line">
                    {line}
                  </span>
                ))}
              </h1>
              <Msg side="her" tone="ink" delay={120}>
                {t.hero.lead}
              </Msg>
              <Rise className="actions" delay={220}>
                <a className="btn btn--fire" href={whatsappHref(t, 'geral')} {...externalLinkProps}>
                  {t.cta.primary}
                </a>
                <a className="btn btn--line" href={CONTACT.tel}>
                  {t.cta.secondary}
                </a>
              </Rise>
              <p className="hero__note">{t.hero.note}</p>
            </div>

            <Sent
              photo={ERICA.hero}
              alt={t.photoAlt[ERICA.hero.slug]}
              sizes="(min-width: 60rem) 40vw, 100vw"
              className="sent--hero"
              priority
            />
          </div>
        </section>

        {/* 2 · fotografia grande + três frases curtas: porquê só ruivos */}
        <section className="burst dark">
          <div className="wrap burst__in">
            <Sent
              photo={HEROES[0]}
              alt={t.photoAlt[HEROES[0].slug]}
              sizes="(min-width: 60rem) 45vw, 100vw"
              className="sent--tall"
              priority
            />
            <div className="thread burst__thread">
              <Speaker name={t.brand.firstName} alt={mark} dark />
              {t.manifesto.lines.map((line, i) => (
                <Msg key={line} side="her" tone={i === 2 ? 'fire' : 'ink'} delay={i * 140}>
                  {line}
                </Msg>
              ))}
              <Msg side="her" tone="ink" delay={440}>
                {t.manifesto.body}
              </Msg>
            </div>
          </div>
        </section>

        {/* 3 · quem é ela */}
        <section className="talk" id="sobre">
          <div className="wrap talk__in">
            <div className="thread">
              <h2 className="msg msg--them talk__topic">{t.sobre.title}</h2>
              <Speaker name={t.brand.firstName} alt={mark} />
              <Msg side="her" tone="fire">
                {t.sobre.lead}
              </Msg>
              {t.sobre.body.map((par, i) => (
                <Msg key={par.slice(0, 24)} side="her" tone="ink" delay={100 * (i + 1)}>
                  {par}
                </Msg>
              ))}
              <p className="chip chip--line">{t.sobre.badge}</p>
            </div>

            <Sent
              photo={ERICA.sobre}
              alt={t.photoAlt[ERICA.sobre.slug]}
              sizes="(min-width: 60rem) 34vw, 100vw"
              className="sent--side"
              priority
            />
          </div>
        </section>

        {/* 4 · o trabalho — as 16, enviadas de uma vez */}
        <section className="work dark" id="trabalho">
          <div className="wrap">
            <div className="work__head">
              <p className="kicker">{t.galeria.kicker}</p>
              <h2 className="work__title">{t.galeria.title}</h2>
              <p className="work__count">
                {GALLERY.length} {t.galeria.contagem}
              </p>
            </div>
            <div className="thread work__intro">
              <Msg side="her" tone="fire">
                {t.galeria.lead}
              </Msg>
            </div>

            <ul className="album">
              {GALLERY.map((p) => (
                <li className="album__cell" key={p.slug}>
                  <figure className="album__fig">
                    <Picture
                      photo={p}
                      alt={t.photoAlt[p.slug]}
                      sizes="(min-width: 64rem) 23vw, (min-width: 48rem) 31vw, 47vw"
                      priority
                      className="album__img"
                    />
                    {p.tone ? <figcaption className="album__tone">{t.galeria.tons[p.tone]}</figcaption> : null}
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5 · serviços */}
        <section className="serv" id="servicos">
          <div className="wrap">
            <div className="thread serv__head">
              <h2 className="msg msg--them">{t.servicos.title}</h2>
              <Speaker name={t.brand.firstName} alt={mark} />
              <Msg side="her" tone="fire">
                {t.servicos.lead}
              </Msg>
            </div>

            <ul className="serv__list">
              {t.servicos.items.map((s, i) => (
                <li className="serv__item" key={s.title}>
                  <p className="chip chip--line">{s.tag}</p>
                  <h3 className="serv__name">{s.title}</h3>
                  <p className="serv__body">{s.body}</p>
                  {i === 1 ? (
                    <a className="btn btn--small btn--line" href={whatsappHref(t, 'correcao')} {...externalLinkProps}>
                      {t.cta.primaryShort}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>

            <div className="thread serv__foot">
              <Msg side="her" tone="ink">
                {t.servicos.nota}
              </Msg>
              <Msg side="her" tone="fire" delay={90}>
                {t.cta.helper}
              </Msg>
              <Rise className="actions actions--right" delay={180}>
                <a className="btn btn--fire" href={whatsappHref(t, 'marcar')} {...externalLinkProps}>
                  {t.cta.primary}
                </a>
              </Rise>
            </div>
          </div>
        </section>

        {/* 6 · a carta de tons */}
        <section className="tons" id="tons">
          <div className="wrap">
            <div className="tons__head">
              <p className="kicker">{t.tons.kicker}</p>
              <h2 className="tons__title">{t.tons.title}</h2>
              <p className="tons__lead">{t.tons.lead}</p>
            </div>

            <dl className="tons__list">
              {t.tons.items.map((item, i) => {
                const shot = toneShot(i)
                return (
                  <div className="tone" key={item.name}>
                    {shot ? (
                      <Picture
                        photo={shot}
                        alt={t.photoAlt[shot.slug]}
                        sizes="(min-width: 60rem) 14rem, 8rem"
                        priority
                        className="tone__img"
                      />
                    ) : null}
                    <dt className="tone__name">{item.name}</dt>
                    <dd className="tone__body">{item.body}</dd>
                  </div>
                )
              })}
            </dl>
          </div>
        </section>

        {/* 7 · o produto */}
        <section className="prod">
          <div className="wrap prod__in">
            <div className="prod__text">
              <p className="kicker">{t.produtos.kicker}</p>
              <h2 className="prod__title">{t.produtos.title}</h2>
              <p className="prod__lead">{t.produtos.lead}</p>
            </div>
            <ul className="prod__shots">
              {PRODUTOS.map((p) => (
                <li key={p.slug}>
                  <Picture
                    photo={p}
                    alt={t.photoAlt[p.slug]}
                    sizes="(min-width: 60rem) 18rem, 45vw"
                    priority
                    className="prod__img"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8 · como funciona — a troca, passo a passo */}
        <section className="proc fire" id="processo">
          <div className="wrap">
            <div className="proc__head">
              <h2 className="proc__title">{t.processo.title}</h2>
              <p className="proc__lead">{t.processo.lead}</p>
            </div>
            <ol className="proc__list">
              {t.processo.steps.map((step, i) => (
                <li className={cx('proc__step', i % 2 === 0 ? 'proc__step--them' : 'proc__step--her')} key={step.title}>
                  <Rise delay={(i % 2) * 90} className="proc__bubble">
                    <span className="proc__num">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="proc__name">{step.title}</h3>
                    <p className="proc__body">{step.body}</p>
                  </Rise>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 9 · as dúvidas, tal como chegam */}
        <section className="faq" id="duvidas">
          <div className="wrap faq__in">
            <div className="faq__aside">
              <p className="kicker">{t.faq.kicker}</p>
              <h2 className="faq__title">{t.faq.title}</h2>
              <Sent
                photo={ERICA.prova}
                alt={t.photoAlt[ERICA.prova.slug]}
                sizes="(min-width: 60rem) 26rem, 100vw"
                className="sent--side"
                priority
              />
            </div>

            <dl className="faq__list">
              {t.faq.items.map((item, i) => (
                <Qa key={item.q} q={item.q} a={item.a} delay={(i % 2) * 110} />
              ))}
            </dl>
          </div>
        </section>

        {/* 10 · o contacto — a continuação natural da conversa */}
        <section className="close fire" id="contacto">
          <div className="wrap close__in">
            <div className="thread close__thread">
              <Speaker name={t.brand.firstName} alt={mark} />
              <h2 className="msg msg--her msg--ink close__title">{t.contacto.title}</h2>
              <Msg side="her" tone="ink" delay={110}>
                {t.contacto.lead}
              </Msg>
              <p className="close__sig">{t.brand.signature}</p>

              <Rise className="actions" delay={280}>
                <a className="btn btn--ink" href={whatsappHref(t, 'marcar')} {...externalLinkProps}>
                  {t.cta.primaryLong}
                </a>
                <a className="btn btn--line-ink" href={CONTACT.tel}>
                  {t.cta.secondaryLong}
                </a>
              </Rise>

              <dl className="close__meta">
                <div>
                  <dt>{t.contacto.whatsappLabel}</dt>
                  <dd>{CONTACT.phoneDisplay}</dd>
                </div>
                <div>
                  <dt>{t.contacto.horarioLabel}</dt>
                  <dd>{t.contacto.horarioPendente}</dd>
                </div>
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
                {CONTACT.instagramUrl ? (
                  <div>
                    <dt>{t.contacto.instagramLabel}</dt>
                    <dd>
                      <a href={CONTACT.instagramUrl} {...externalLinkProps}>
                        {CONTACT.instagramHandle ?? t.cta.instagram}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <Sent
              photo={HEROES[2]}
              alt={t.photoAlt[HEROES[2].slug]}
              sizes="(min-width: 60rem) 36vw, 100vw"
              className="sent--close"
              priority
            />
          </div>
        </section>
      </main>

      <footer className="foot dark">
        <div className="wrap foot__in">
          <Logo shape="assinatura" color="branca" alt={t.a11y.logo} height="3.4rem" className="foot__logo" />
          <div className="foot__col">
            <p className="foot__tagline">{t.footer.tagline}</p>
            <p className="foot__note">{t.footer.feitoPor}</p>
            <p className="foot__note">
              {t.brand.name} · {t.footer.direitos}
            </p>
          </div>
          <div className="foot__col foot__col--end">
            <LangSwitch t={t} variant="longo" className="lang lang--foot" id="lang-foot" />
            <a className="foot__top" href="#topo">
              {t.footer.voltarTopo}
            </a>
          </div>
        </div>
      </footer>

      {/* Barra fixa: o WhatsApp à mão em qualquer ponto do scroll, no telemóvel. */}
      <div className="bar">
        <a className="btn btn--fire bar__cta" href={whatsappHref(t, 'marcar')} {...externalLinkProps}>
          {t.cta.primary}
        </a>
        <a className="btn btn--line bar__tel" href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
          {t.cta.secondary}
        </a>
      </div>
    </>
  )
}

/** Um par pergunta/resposta: marcação de definição a sério, desenhada como troca. */
function Qa({ q, a, delay }: { q: string; a: string; delay: number }) {
  const { ref, revealed } = useReveal<HTMLDivElement>({ delay })
  return (
    <div ref={ref} className={cx('qa', !revealed && 'is-entering')}>
      <dt className="msg msg--them">{q}</dt>
      <dd className="msg msg--her msg--ink">{a}</dd>
    </div>
  )
}
