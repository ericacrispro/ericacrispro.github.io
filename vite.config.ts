import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { IDS } from './scripts/versions.mjs'

const entry = (p: string) => fileURLToPath(new URL(p, import.meta.url))

/**
 * Build da ÁREA DE RASCUNHOS.
 *
 * O GitHub Pages serve estático a partir da raiz do repositório. Esta área é
 * construída inteira em `/mockup/` — o índice em `/mockup/`, as 10 versões em
 * `/mockup/versoes/vN/`. A raiz `/` continua a ser o site publicado: este build
 * não lhe toca.
 *
 * `base: './'` ⇒ caminhos relativos. O MESMO build serve em
 * `ericacrispro.github.io` e num domínio próprio, a qualquer profundidade.
 */
export default defineConfig({
  root: 'site',
  base: './',
  plugins: [react()],
  build: {
    outDir: '../mockup',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        hub: entry('site/index.html'),
        versoes: entry('site/versoes/index.html'),
        ...Object.fromEntries(IDS.map((id) => [id, entry(`site/versoes/${id}/index.html`)])),
      },
    },
  },
})
