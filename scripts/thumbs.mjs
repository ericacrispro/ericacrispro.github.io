/**
 * Miniaturas das versões para a página de escolha (`mockup/versoes/index.html`).
 * Correr DEPOIS do build (o build limpa o outDir) e com o servidor no ar.
 *
 *   npx vite preview --port 5190 --strictPort &
 *   npm run thumbs
 *
 * Duas capturas por versão: `vN.png` (desktop 1440×900, para o cartão) e
 * `vN-mobile.png` (390×844) — porque a escolha dela vai ser feita no telemóvel.
 */
import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
import { launchOptions } from './chrome.mjs'
import { IDS } from './versions.mjs'

const base = (process.argv[2] || 'http://localhost:5190').replace(/\/$/, '')
const OUT = 'mockup/versoes/shots'
mkdirSync(OUT, { recursive: true })


const browser = await puppeteer.launch(launchOptions())

for (const id of IDS) {
  for (const [w, h, suffix] of [
    [1440, 900, ''],
    [390, 844, '-mobile'],
  ]) {
    const page = await browser.newPage()
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 })
    // pt-PT explícito: o Chrome headless reporta en-US e as miniaturas saíam em inglês.
    await page.goto(`${base}/versoes/${id}/?lang=pt-PT`, { waitUntil: 'networkidle0', timeout: 60_000 })
    await new Promise((r) => setTimeout(r, 1800))
    // JPEG, não PNG: as capturas em PNG davam ~8 MB no repositório para nada.
    const buf = await page.screenshot({ type: 'png' })
    await sharp(buf)
      .resize({ width: suffix ? 780 : 1440, withoutEnlargement: true })
      .jpeg({ quality: 78, progressive: true, mozjpeg: true })
      .toFile(`${OUT}/${id}${suffix}.jpg`)
    await page.close()
  }
  console.log(`✓ ${OUT}/${id}.jpg + ${id}-mobile.jpg`)
}

await browser.close()
