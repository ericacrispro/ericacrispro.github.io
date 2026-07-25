/**
 * V10 · CARTAZ — impressão gráfica.
 *
 * A linguagem é a de uma embalagem de coloração e de um cartaz serigrafado:
 * blocos de cor chapada encaixados sem folga, retícula de meio-tom, e registo
 * de cores ligeiramente desalinhado. Sem gradientes, sem sombras suaves — só
 * aresta, chapa e contraste.
 *
 * Regras do projecto respeitadas aqui:
 *  - zero texto no JSX: tudo sai de `getContent()`;
 *  - `alt` sempre de `t.photoAlt[slug]`;
 *  - o que é `null` em `config.ts` (morada, Maps, Instagram) não aparece;
 *  - as fotos de produto são o produto profissional que ela USA — entram sob
 *    `t.produtos` ("O que uso"), nunca como marca dela;
 *  - o WhatsApp está à mão em qualquer ponto do scroll (barra fixa no
 *    telemóvel, botão no cabeçalho colado no desktop).
 */
import { useEffect } from 'react'
import './v10.css'
import { getContent } from '../../i18n'
import { LangSwitch } from '../../shared/LangSwitch'
import { Logo } from '../../shared/Logo'
import { Picture } from '../../shared/Picture'
import { ERICA, GALLERY, HEROES, PRODUTOS } from '../../shared/photos'
import { CONTACT, externalLinkProps, whatsappHref } from '../../shared/contact'
import { useReveal } from '../../shared/useReveal'

/**
 * Deslize curto de encaixe. Segue a regra da casa: o conteúdo está **visível
 * por omissão** — a classe só desloca 0,9rem, nunca esconde. Se o observador
 * nunca disparar, a página fica legível na mesma.
 */
function useBloco(delay = 0) {
  const { ref, revealed } = useReveal<HTMLElement>({
    threshold: 0.02,
    rootMargin: '0px 0px -4% 0px',
    delay,
  })
  return { ref, className: revealed ? 'v10-anim' : 'v10-anim is-entering' }
}

/**
 * Esta é uma página longa e cheia de fotografias. O Chrome só **descodifica**
 * uma imagem quando ela se aproxima do ecrã — mesmo com `eager` — e numa
 * página deste comprimento isso deixa a galeria por pintar no primeiro scroll
 * (e branca nas capturas de página inteira, a armadilha do `DESIGN.md`).
 * Depois do `load`, mandamos descodificar tudo em segundo plano: as fotos já
 * estão prontas quando a pessoa lá chega.
 */
function useFotosProntas() {
  useEffect(() => {
    let vivo = true
    const descodificar = () => {
      if (!vivo) return
      for (const img of Array.from(document.querySelectorAll<HTMLImageElement>('.v10 img'))) {
        img.decode().catch(() => {
          /* ainda a carregar — o browser pinta na mesma quando chegar */
        })
      }
    }
    if (document.readyState === 'complete') descodificar()
    else window.addEventListener('load', descodificar, { once: true })
    return () => {
      vivo = false
      window.removeEventListener('load', descodificar)
    }
  }, [])
}

export function App() {
  const t = getContent()
  const waGeral = whatsappHref(t, 'geral')
  const waMarcar = whatsappHref(t, 'marcar')
  const ano = new Date().getFullYear()

  // Quem abre a página é ela; o trabalho em clientes vem na galeria.
  const fotoHero = ERICA.hero
  const fotoManifesto = HEROES[0]

  const nav = [
    { href: '#trabalho', label: t.nav.trabalho },
    { href: '#tons', label: t.nav.tons },
    { href: '#servicos', label: t.nav.servicos },
    { href: '#sobre', label: t.nav.sobre },
    { href: '#duvidas', label: t.nav.duvidas },
    { href: '#contacto', label: t.nav.contacto },
  ]

  const bSobre = useBloco()
  const bGaleria = useBloco()
  const bTons = useBloco()
  const bServicos = useBloco()
  const bProdutos = useBloco()
  const bProcesso = useBloco()
  const bFaq = useBloco()
  const bContacto = useBloco()

  useFotosProntas()

  return (
    <div className="v10">
      <a className="skip-link" href="#conteudo">
        {t.a11y.skip}
      </a>

      <header className="v10-topo">
        <div className="v10-topo__in">
          <div className="v10-marca">
            <Logo shape="icone" color="laranja" alt="" height="1.75rem" priority />
            <span className="v10-marca__txt">
              <span className="v10-marca__nome">{t.brand.name}</span>
              <span className="v10-marca__tag">{t.brand.tagline}</span>
            </span>
          </div>

          <nav className="v10-nav">
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="v10-topo__dir">
            <LangSwitch t={t} className="v10-lang" />
            <a className="v10-topo__wa" href={waGeral} {...externalLinkProps}>
              {t.cta.primaryShort}
            </a>
          </div>
        </div>
      </header>

      <main id="conteudo" className="v10-main">
        {/* ---------------------------------------------------------- CARTAZ */}
        <section className="v10-hero">
          <div className="v10-hero__chapa">
            <p className="v10-hero__kicker">{t.brand.tagline}</p>
            <h1 className="v10-hero__h1">
              {t.hero.titleLines.map((linha) => (
                <span key={linha} className="v10-hero__linha">
                  {linha}
                </span>
              ))}
            </h1>
            <p className="v10-hero__lead v10-hero__lead--curto">{t.hero.leadShort}</p>
            <p className="v10-hero__lead v10-hero__lead--longo">{t.hero.lead}</p>
            <div className="v10-hero__accoes">
              <a className="v10-btn v10-btn--k v10-hero__wa" href={waMarcar} {...externalLinkProps}>
                {t.cta.primary}
              </a>
              <a className="v10-btn v10-btn--vazio" href="#trabalho">
                {t.cta.verTrabalho}
              </a>
            </div>
            <p className="v10-hero__nota">{t.hero.note}</p>
          </div>

          <div className="v10-hero__foto">
            <Picture
              photo={fotoHero}
              alt={t.photoAlt[fotoHero.slug]}
              priority
              sizes="(min-width: 900px) 46vw, 100vw"
            />
          </div>

          <div className="v10-barracores" aria-hidden="true">
            <i data-tom="cobre" />
            <i data-tom="acaju" />
            <i data-tom="gengibre" />
            <i data-tom="cereja" />
            <i data-tom="laranja" />
            <i data-tom="ruivo-escuro" />
          </div>
        </section>

        {/* ------------------------------------------------------ MANIFESTO */}
        <section className="v10-manifesto">
          <div className="v10-manifesto__fundo" aria-hidden="true">
            <Picture photo={fotoManifesto} alt="" sizes="100vw" />
          </div>
          <div className="v10-manifesto__in">
            <p className="v10-kicker v10-kicker--l">{t.manifesto.kicker}</p>
            <p className="v10-manifesto__linhas">
              {t.manifesto.lines.map((linha) => (
                <span key={linha}>{linha}</span>
              ))}
            </p>
            <p className="v10-manifesto__corpo">{t.manifesto.body}</p>
          </div>
        </section>

        {/* ----------------------------------------------------------- SOBRE */}
        <section id="sobre" ref={bSobre.ref} className={`v10-sobre ${bSobre.className}`}>
          <div className="v10-sobre__in">
            <div className="v10-sobre__foto">
              <Picture
                photo={ERICA.sobre}
                alt={t.photoAlt[ERICA.sobre.slug]}
                sizes="(min-width: 900px) 42vw, 100vw"
              />
              <p className="v10-selo">{t.sobre.badge}</p>
            </div>
            <div className="v10-sobre__txt">
              <p className="v10-kicker">{t.sobre.kicker}</p>
              <h2 className="v10-h2">{t.sobre.title}</h2>
              <p className="v10-sobre__lead">{t.sobre.lead}</p>
              {t.sobre.body.map((p) => (
                <p key={p} className="v10-corpo">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- TRABALHO */}
        <section
          id="trabalho"
          ref={bGaleria.ref}
          className={`v10-galeria ${bGaleria.className}`}
          aria-label={t.a11y.galeriaRegiao}
        >
          <div className="v10-galeria__cab">
            <div>
              <p className="v10-kicker v10-kicker--l">{t.galeria.kicker}</p>
              <h2 className="v10-h2 v10-h2--claro">{t.galeria.title}</h2>
            </div>
            <div className="v10-galeria__meta">
              <p className="v10-galeria__conta">
                <b>{GALLERY.length}</b> {t.galeria.contagem}
              </p>
              <p className="v10-galeria__lead">{t.galeria.lead}</p>
            </div>
          </div>

          <ul className="v10-grelha">
            {GALLERY.map((foto, i) => (
              <li key={foto.slug} className="v10-cel" data-largo={i % 4 === 0 ? 'sim' : undefined}>
                <div className="v10-cel__foto" data-corte={String(i % 3)}>
                  <Picture
                    photo={foto}
                    alt={t.photoAlt[foto.slug]}
                    sizes={
                      i % 4 === 0
                        ? '(min-width: 1100px) 48vw, (min-width: 700px) 64vw, 48vw'
                        : '(min-width: 1100px) 24vw, (min-width: 700px) 32vw, 48vw'
                    }
                  />
                </div>
                {foto.tone ? (
                  <p className="v10-chip" data-tom={foto.tone}>
                    {t.galeria.tons[foto.tone]}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------------------- TONS */}
        <section id="tons" ref={bTons.ref} className={`v10-tons ${bTons.className}`}>
          <div className="v10-tons__cab">
            <p className="v10-kicker">{t.tons.kicker}</p>
            <h2 className="v10-h2">{t.tons.title}</h2>
            <p className="v10-corpo v10-tons__lead">{t.tons.lead}</p>
          </div>
          <ul className="v10-carta">
            {t.tons.items.map((tom, i) => (
              <li key={tom.name} className="v10-tom" data-i={String(i)}>
                <h3 className="v10-tom__nome">{tom.name}</h3>
                <p className="v10-tom__corpo">{tom.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* --------------------------------------------------------- SERVIÇOS */}
        <section id="servicos" ref={bServicos.ref} className={`v10-servicos ${bServicos.className}`}>
          <div className="v10-servicos__cab">
            <h2 className="v10-h2 v10-h2--claro">{t.servicos.title}</h2>
            <p className="v10-servicos__lead">{t.servicos.lead}</p>
          </div>
          <ul className="v10-bandas">
            {t.servicos.items.map((s, i) => (
              <li key={s.title} className="v10-banda" data-i={String(i % 3)}>
                <p className="v10-banda__tag">{s.tag}</p>
                <h3 className="v10-banda__titulo">{s.title}</h3>
                <p className="v10-banda__corpo">{s.body}</p>
              </li>
            ))}
          </ul>
          <p className="v10-servicos__nota">{t.servicos.nota}</p>
        </section>

        {/* --------------------------------------------------------- PRODUTOS */}
        <section ref={bProdutos.ref} className={`v10-produtos ${bProdutos.className}`}>
          <div className="v10-produtos__cab">
            <p className="v10-kicker v10-kicker--l">{t.produtos.kicker}</p>
            <h2 className="v10-h2 v10-h2--claro">{t.produtos.title}</h2>
            <p className="v10-produtos__lead">{t.produtos.lead}</p>
          </div>
          <ul className="v10-produtos__fila">
            {PRODUTOS.map((foto) => (
              <li key={foto.slug} className="v10-prod">
                <div className="v10-prod__foto">
                  <Picture photo={foto} alt={t.photoAlt[foto.slug]} sizes="(min-width: 800px) 30vw, 86vw" />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* --------------------------------------------------------- PROCESSO */}
        <section id="processo" ref={bProcesso.ref} className={`v10-processo ${bProcesso.className}`}>
          <div className="v10-processo__cab">
            <p className="v10-kicker v10-kicker--l">{t.processo.kicker}</p>
            <h2 className="v10-h2 v10-h2--claro">{t.processo.title}</h2>
            <p className="v10-processo__lead">{t.processo.lead}</p>
          </div>
          <ol className="v10-passos">
            {t.processo.steps.map((s, i) => (
              <li key={s.title} className="v10-passo">
                <span className="v10-passo__n" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="v10-passo__titulo">{s.title}</h3>
                <p className="v10-passo__corpo">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------------- DÚVIDAS */}
        <section id="duvidas" ref={bFaq.ref} className={`v10-faq ${bFaq.className}`}>
          <div className="v10-faq__cab">
            <p className="v10-kicker">{t.faq.kicker}</p>
            <h2 className="v10-h2">{t.faq.title}</h2>
          </div>
          <div className="v10-faq__lista">
            {t.faq.items.map((f, i) => (
              <details key={f.q} className="v10-qa" open={i === 0}>
                <summary>
                  <span>{f.q}</span>
                </summary>
                <p className="v10-qa__a">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------------- CONTACTO */}
        <section id="contacto" ref={bContacto.ref} className={`v10-contacto ${bContacto.className}`}>
          <div className="v10-contacto__in">
            <p className="v10-kicker">{t.contacto.kicker}</p>
            <h2 className="v10-h2 v10-contacto__h2">{t.contacto.title}</h2>
            <p className="v10-contacto__lead">{t.contacto.lead}</p>

            <div className="v10-contacto__accoes">
              <a className="v10-btn v10-btn--k v10-btn--grande" href={waMarcar} {...externalLinkProps}>
                {t.cta.primary}
              </a>
              <a className="v10-btn v10-btn--vazio" href={CONTACT.tel}>
                {t.cta.secondary}
              </a>
            </div>
            <p className="v10-contacto__helper">{t.cta.helper}</p>

            <dl className="v10-fichas">
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
                  <a href={CONTACT.tel}>{CONTACT.phoneDisplay}</a>
                </dd>
              </div>
              <div>
                <dt>{t.contacto.horarioLabel}</dt>
                <dd>{t.contacto.horarioPendente}</dd>
              </div>
              {CONTACT.instagramUrl && CONTACT.instagramHandle ? (
                <div>
                  <dt>{t.contacto.instagramLabel}</dt>
                  <dd>
                    <a href={CONTACT.instagramUrl} {...externalLinkProps}>
                      {CONTACT.instagramHandle}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </section>
      </main>

      <footer className="v10-rodape">
        <div className="v10-rodape__in">
          <Logo shape="assinatura" color="branca" alt={t.a11y.logo} height="4rem" className="v10-rodape__logo" />
          <p className="v10-rodape__tagline">{t.footer.tagline}</p>
          <p className="v10-rodape__nota">{t.footer.feitoPor}</p>

          <div className="v10-rodape__barra">
            <LangSwitch t={t} className="v10-lang v10-lang--rodape" variant="longo" id="lang-rodape" />
            <a className="v10-rodape__topo" href="#conteudo">
              {t.footer.voltarTopo}
            </a>
          </div>

          <p className="v10-rodape__legal">
            {ano} · {t.brand.name} · {t.footer.direitos}
          </p>
        </div>
        <div className="v10-barracores v10-barracores--rodape" aria-hidden="true">
          <i data-tom="ruivo-escuro" />
          <i data-tom="laranja" />
          <i data-tom="cereja" />
          <i data-tom="gengibre" />
          <i data-tom="acaju" />
          <i data-tom="cobre" />
        </div>
      </footer>

      {/* O contacto ao alcance do polegar, em qualquer ponto do scroll. */}
      <div className="v10-bar">
        <a className="v10-bar__wa" href={waMarcar} aria-label={t.cta.primaryLong} {...externalLinkProps}>
          {t.cta.primaryShort}
        </a>
        <a className="v10-bar__tel" href={CONTACT.tel} aria-label={t.cta.secondaryLong}>
          {t.cta.secondary}
        </a>
      </div>
    </div>
  )
}
