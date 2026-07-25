/**
 * Gera as entradas (`index.html` + `main.tsx`) das 10 versões.
 * Forma idêntica; só muda o id. Correr sempre que `scripts/versions.mjs` mudar.
 *
 *   npm run entries
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { VERSIONS } from './versions.mjs'

const SITE_URL = 'https://ericacrispro.github.io'

for (const { id, name, fonts, resumo } of VERSIONS) {
  mkdirSync(`site/versoes/${id}`, { recursive: true })

  writeFileSync(
    `site/versoes/${id}/index.html`,
    `<!doctype html>
<html lang="pt-PT">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>Érica Gonçalves — Especialista em Ruivos</title>
    <meta name="description" content="Coloração ruiva, correcção de cor e manutenção do tom, em Portugal. Marcações pelo WhatsApp." />
    <meta name="robots" content="noindex" />
    <meta name="theme-color" content="#EC6807" />

    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32.png" sizes="32x32" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <!-- Mandar a versão ${id.toUpperCase()} no WhatsApp mostra a marca dela, não um link pelado.
         A imagem precisa de URL absoluto. -->
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_PT" />
    <meta property="og:site_name" content="Érica Gonçalves" />
    <meta property="og:title" content="Érica Gonçalves — Especialista em Ruivos" />
    <meta property="og:description" content="Versão ${id.toUpperCase()} · ${name} — ${resumo}" />
    <meta property="og:url" content="${SITE_URL}/mockup/versoes/${id}/" />
    <meta property="og:image" content="${SITE_URL}/og.jpg" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Érica Gonçalves, especialista em ruivos, ao lado da frase “Ruivo não é uma cor da lista.”" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${SITE_URL}/og.jpg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
`,
  )

  const fontImports = fonts.map((f) => `import '../../src/assets/fonts/${f}.css'`).join('\n')

  writeFileSync(
    `site/versoes/${id}/main.tsx`,
    `// GERADO por scripts/entries.mjs — não editar à mão.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
${fontImports}
import '../../src/shared/tokens.css'
import { applyLangToDocument } from '../../src/i18n'
import { App } from '../../src/versions/${id}/App'

applyLangToDocument()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`,
  )
  console.log(`✓ site/versoes/${id}/ (${name})`)
}

/* ------------------------------------------------------------------ */
/* A página de escolha — gerada a partir da mesma lista, para não haver
   duas verdades sobre quais são as versões e como se chamam.          */

const cards = VERSIONS.map(
  ({ id, name, resumo }) => `        <li>
          <a class="card" href="./${id}/">
            <span class="shot">
              <img src="./shots/${id}-mobile.jpg" alt="" width="780" height="1688" onerror="this.closest('.shot').remove()" />
            </span>
            <span class="id">${id.toUpperCase()}</span>
            <h2>${name}</h2>
            <p class="desc">${resumo}</p>
          </a>
        </li>`,
).join('\n')

writeFileSync(
  'site/versoes/index.html',
  `<!doctype html>
<!-- GERADO por scripts/entries.mjs — não editar à mão. -->
<html lang="pt-PT">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dez caminhos para o teu site — Érica Gonçalves</title>
    <meta name="description" content="Dez direcções visuais para o site da Érica Gonçalves. Abre, compara, escolhe." />
    <meta name="robots" content="noindex" />
    <meta name="theme-color" content="#1B0E05" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32.png" sizes="32x32" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_PT" />
    <meta property="og:title" content="Dez caminhos para o teu site" />
    <meta property="og:description" content="Dez direcções visuais para escolher — cada uma abre a funcionar, no telemóvel e no computador." />
    <meta property="og:url" content="${SITE_URL}/mockup/versoes/" />
    <meta property="og:image" content="${SITE_URL}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="stylesheet" href="../src/assets/fonts.css" />
    <link rel="stylesheet" href="../src/shared/tokens.css" />
    <style>
      body {
        background: var(--fire-950);
        color: var(--fire-50);
        padding: var(--space-xl) var(--space-m) var(--space-2xl);
      }
      .wrap { max-width: 64rem; margin: 0 auto; }
      .back {
        display: inline-flex;
        align-items: center;
        min-height: 44px;
        margin-bottom: var(--space-m);
        padding: var(--space-2xs) 0;
        color: var(--fire-300);
        font-size: var(--step--1);
        text-decoration: none;
      }
      .back:hover, .back:focus-visible { color: var(--fire-50); }
      h1 { font-size: var(--step-4); }
      .lead { font-size: var(--step-1); margin-top: var(--space-s); max-width: 44ch; }
      header p.note { max-width: 52ch; color: var(--fire-300); margin-top: var(--space-s); }
      ul {
        list-style: none;
        padding: 0;
        margin: var(--space-xl) 0 0;
        display: grid;
        gap: var(--space-m);
        grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
      }
      a.card {
        display: grid;
        gap: var(--space-2xs);
        align-content: start;
        padding: var(--space-m);
        border: 1px solid color-mix(in oklch, var(--fire-400) 32%, transparent);
        border-radius: 1rem;
        text-decoration: none;
        background: color-mix(in oklch, var(--fire-900) 55%, transparent);
        transition:
          background 0.35s var(--ease-out-quart),
          transform 0.35s var(--ease-out-quart),
          border-color 0.35s var(--ease-out-quart);
      }
      a.card:hover, a.card:focus-visible {
        background: var(--fire-900);
        border-color: var(--fire-500);
        transform: translateY(-2px);
      }
      .shot {
        display: block;
        margin-bottom: var(--space-2xs);
        border-radius: 0.6rem;
        overflow: hidden;
        background: var(--fire-900);
      }
      .shot img { width: 100%; height: auto; aspect-ratio: 390 / 500; object-fit: cover; object-position: top center; }
      .id { font-size: var(--step--1); letter-spacing: 0.1em; color: var(--fire-500); font-weight: 700; }
      h2 { font-size: var(--step-2); }
      .desc { color: var(--fire-300); font-size: var(--step--1); line-height: 1.55; }
      footer {
        margin-top: var(--space-2xl);
        color: var(--fire-300);
        font-size: var(--step--1);
        border-top: 1px solid color-mix(in oklch, var(--fire-400) 25%, transparent);
        padding-top: var(--space-m);
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <header>
        <a class="back" href="../">← Rascunhos</a>
        <h1>Dez caminhos para o teu site</h1>
        <p class="lead">Érica — cada link abaixo é um site inteiro, a funcionar, no telemóvel e no computador. O mesmo conteúdo e a mesma marca; dez maneiras diferentes de te apresentar.</p>
        <p class="note">Abre, rola até ao fim, e diz-me qual é a tua. Dá para misturar: “gostei do início da 2 com a galeria da 3”.</p>
      </header>

      <ul>
${cards}
      </ul>

      <footer>
        <p>Rascunhos para escolha — não indexados. O site publicado continua em ericacrispro.github.io.</p>
      </footer>
    </div>
  </body>
</html>
`,
)
console.log('✓ site/versoes/index.html')
