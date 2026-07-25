/**
 * Promove uma versão para o site público (raiz `/`).
 *
 *   npm run promote v3
 *
 * Quando a Erica escolher outra, troca-se o argumento: um comando, sem
 * reescrever nada à mão.
 *
 *  1. aponta `site/root/main.tsx` para a versão escolhida (e importa as fontes dela);
 *  2. constrói com `vite.root.config.ts` numa pasta temporária;
 *  3. copia `index.html` + `assets/` para a raiz do repositório.
 *
 * O que NÃO faz, de propósito: nunca corre o Vite com `outDir` na raiz —
 * `emptyOutDir` apagava tudo. Só `index.html` e `assets/` são substituídos;
 * CNAME, robots.txt, docs/, site/ e mockup/ ficam intactos.
 */
import { writeFileSync, rmSync, cpSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { VERSIONS } from './versions.mjs'

const id = process.argv[2]
const version = VERSIONS.find((v) => v.id === id)
if (!version) {
  console.error(`uso: npm run promote <${VERSIONS.map((v) => v.id).join('|')}>`)
  process.exit(1)
}

const fontImports = version.fonts.map((f) => `import '../src/assets/fonts/${f}.css'`).join('\n')

writeFileSync(
  'site/root/main.tsx',
  `// GERADO por scripts/promote.mjs — não editar à mão.
// A versão publicada hoje na raiz do site é a ${id.toUpperCase()} · ${version.name}.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
${fontImports}
import '../src/shared/tokens.css'
import { applyLangToDocument } from '../src/i18n'
import { App } from '../src/versions/${id}/App'

applyLangToDocument()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`,
)
console.log(`✓ site/root/main.tsx → versions/${id} (${version.name})`)

execSync('npx vite build --config vite.root.config.ts', { stdio: 'inherit' })

// Substitui só o que é gerado. `force: true` não reclama se ainda não existir.
rmSync('assets', { recursive: true, force: true })
cpSync('.build-root/assets', 'assets', { recursive: true })
cpSync('.build-root/root/index.html', 'index.html')
rmSync('.build-root', { recursive: true, force: true })

if (!existsSync('index.html') || !existsSync('assets')) {
  console.error('✗ a raiz não recebeu o build — a abortar sem publicar')
  process.exit(1)
}

console.log(`\n✓ ${id.toUpperCase()} · ${version.name} promovida para a raiz /`)
console.log('  index.html + assets/ actualizados. robots.txt e /mockup/ intactos.')
