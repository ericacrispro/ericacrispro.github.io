import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const entry = (p: string) => fileURLToPath(new URL(p, import.meta.url))

/**
 * Build do SITE PÚBLICO (a versão promovida para a raiz `/`).
 *
 * Sai numa pasta temporária — `scripts/promote.mjs` copia o resultado para a
 * raiz do repositório. NUNCA apontar `outDir` directamente para a raiz:
 * `emptyOutDir` apagava o repositório inteiro (docs, site/, mockup/, CNAME…).
 *
 * Que versão está publicada: `npm run promote v3` reescreve
 * `site/root/main.tsx` a apontar para ela.
 */
export default defineConfig({
  root: 'site',
  base: './',
  plugins: [react()],
  build: {
    outDir: '../.build-root',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: { index: entry('site/root/index.html') },
    },
  },
})
