/**
 * Gera os ficheiros de partilha e de separador:
 *
 *   og.jpg               1200×630 — o cartão que aparece no WhatsApp/Instagram
 *   favicon.svg          a chama da marca (separador, tema claro e escuro)
 *   favicon-32.png       alternativa para quem não lê SVG
 *   apple-touch-icon.png 180×180 — atalho no ecrã inicial do iPhone
 *
 *   npm run social
 *
 * O cartão é renderizado com o mesmo Chrome headless das capturas, usando as
 * fontes e a fotografia reais — é a marca dela, não um genérico.
 */
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
import { launchOptions } from './chrome.mjs'


const fontsAnton = readFileSync('site/src/assets/fonts/anton.css', 'utf8')
const fontsArchivo = readFileSync('site/src/assets/fonts/archivo.css', 'utf8')
const photo = readFileSync('site/src/assets/img/erica-retrato-estudio.jpg').toString('base64')
const icon = readFileSync('site/src/assets/logo/icone-branco.png').toString('base64')

const FIRE = '#EC6807'
const BURNT = '#1B0E05'
const OLIVE = '#5D541D'

/** O cartão: quase-preto queimado, a fotografia dela à direita, a frase que fica. */
const ogHtml = `<!doctype html><meta charset="utf-8">
<style>
  ${fontsAnton}
  ${fontsArchivo}
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; display: grid; grid-template-columns: 1.05fr 1fr; grid-template-rows: 630px; align-items: center;
    background: ${BURNT}; color: #fff; font-family: Archivo, sans-serif; overflow: hidden;
  }
  .copy { padding: 44px 34px 44px 60px; display: flex; flex-direction: column; justify-content: center; gap: 14px; min-height: 0; }
  .brand { display: flex; align-items: center; gap: 16px; }
  .brand img { height: 52px; width: auto; display: block; }
  .brand span { font-size: 19px; letter-spacing: 0.18em; text-transform: uppercase; color: ${FIRE}; font-weight: 600; }
  h1 {
    font-family: Anton, sans-serif; font-size: 60px; line-height: 0.95;
    letter-spacing: -0.01em; text-transform: uppercase; max-width: 11ch;
  }
  h1 em { font-style: normal; color: ${FIRE}; }
  p { font-size: 20px; line-height: 1.4; color: #E8DFD6; max-width: 32ch; }
  .rule { width: 96px; height: 4px; background: ${FIRE}; }
  .foot { font-size: 17px; color: #C9BCAE; letter-spacing: 0.01em; }
  .media { position: relative; height: 630px; overflow: hidden; }
  .media img { width: 100%; height: 100%; object-fit: cover; object-position: 52% 18%; }
  .fade { position: absolute; inset: 0; background: linear-gradient(90deg, ${BURNT} 0%, rgba(27,14,5,0.55) 20%, rgba(27,14,5,0) 52%); }
  .warm { position: absolute; inset: 0; background: ${OLIVE}; mix-blend-mode: color; opacity: 0.10; }
</style>
<div class="copy">
  <div class="brand">
    <img src="data:image/png;base64,${icon}" alt="">
    <span>Érica Gonçalves</span>
  </div>
  <h1>Ruivo não é uma cor <em>da lista.</em></h1>
  <div class="rule"></div>
  <p>Coloração, correcção e manutenção de ruivo, em Portugal.</p>
  <span class="foot">Especialista em ruivos · marcações pelo WhatsApp</span>
</div>
<div class="media">
  <img src="data:image/jpeg;base64,${photo}" alt="">
  <div class="warm"></div>
  <div class="fade"></div>
</div>`

/** Ícone de separador: a chama-raposa branca sobre o quase-preto da marca. */
const iconHtml = (size) => `<!doctype html><meta charset="utf-8">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: ${size}px; height: ${size}px; display: grid; place-items: center; background: ${BURNT}; }
  img { height: ${size * 0.74}px; width: auto; display: block; }
</style>
<img src="data:image/png;base64,${icon}" alt="">`

const browser = await puppeteer.launch(launchOptions())

async function shoot(html, width, height, out) {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: out })
  await page.close()
  console.log(`✓ ${out} (${width}×${height}, ${(readFileSync(out).length / 1024).toFixed(0)} KB)`)
}

// O WhatsApp engasga com cartão pesado (acima de ~300 KB às vezes nem o busca),
// por isso o entregável é JPEG, não PNG.
await shoot(ogHtml, 1200, 630, '.og-tmp.png')
await sharp('.og-tmp.png').jpeg({ quality: 86, progressive: true, mozjpeg: true }).toFile('og.jpg')
rmSync('.og-tmp.png')
console.log(`✓ og.jpg (1200×630, ${(readFileSync('og.jpg').length / 1024).toFixed(0)} KB)`)

await shoot(iconHtml(180), 180, 180, 'apple-touch-icon.png')
await shoot(iconHtml(32), 32, 32, 'favicon-32.png')

await browser.close()

/**
 * SVG para o favicon: nítido em qualquer tamanho. É uma chama desenhada à mão,
 * na mesma ideia do logótipo — não uma tentativa de decalcar a raposa, que a
 * 16px seria uma mancha.
 */
writeFileSync(
  'favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="${BURNT}"/>
  <path d="M16 4c3.4 4.2 6.6 7.1 6.6 11.6A6.6 6.6 0 0 1 16 22.2a6.6 6.6 0 0 1-6.6-6.6C9.4 11.1 12.6 8.2 16 4Z"
        fill="none" stroke="${FIRE}" stroke-width="1.9" stroke-linejoin="round"/>
  <path d="M16 12.2c1.5 1.9 2.9 3.2 2.9 5.1a2.9 2.9 0 0 1-5.8 0c0-1.9 1.4-3.2 2.9-5.1Z" fill="${FIRE}"/>
  <path d="M24.2 8.2l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6Z" fill="${FIRE}"/>
  <path d="M23.4 23.2l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5.5-1.3Z" fill="${FIRE}" opacity=".8"/>
</svg>
`,
)
console.log('✓ favicon.svg')
