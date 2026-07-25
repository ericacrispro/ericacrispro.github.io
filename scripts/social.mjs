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
 *
 * A copy vem de `site/src/content/pt-pt.ts`, transpilado em memória: o cartão
 * já esteve com uma frase que o site tinha deixado de usar, e não volta a
 * acontecer. Mudar o conteúdo e correr `npm run social` chega.
 */
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
import { launchOptions } from './chrome.mjs'

/**
 * Colhe as frases do conteúdo pt-PT. É TypeScript e este script é Node puro,
 * portanto lê-se o ficheiro e extrai-se o que é preciso — poucos campos, todos
 * verificados: se algum deixar de existir, o script **pára** em vez de gerar um
 * cartão com um buraco. É a rede que faltava quando o cartão ficou meses com uma
 * frase que o site já não usava.
 */
function conteudo() {
  const ts = readFileSync('site/src/content/pt-pt.ts', 'utf8')

  const campo = (nome) => {
    const m = ts.match(new RegExp(`^\\s*${nome}:\\s*'((?:[^'\\\\]|\\\\.)*)'`, 'm'))
    if (!m) throw new Error(`social.mjs: campo "${nome}" não encontrado em content/pt-pt.ts`)
    return m[1].replace(/\\'/g, "'")
  }

  const linhas = ts.match(/^\s*titleLines:\s*\[([^\]]*)\]/m)
  if (!linhas) throw new Error('social.mjs: "titleLines" não encontrado em content/pt-pt.ts')
  const titleLines = [...linhas[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1].replace(/\\'/g, "'"))
  if (titleLines.length < 3) throw new Error(`social.mjs: "titleLines" tem ${titleLines.length} linhas, esperava 3`)

  return {
    brand: { name: campo('name'), tagline: campo('tagline') },
    hero: { titleLines, leadShort: campo('leadShort') },
  }
}

const t = conteudo()

const fontsAnton = readFileSync('site/src/assets/fonts/anton.css', 'utf8')
const fontsArchivo = readFileSync('site/src/assets/fonts/archivo.css', 'utf8')
const photo = readFileSync('site/src/assets/img/erica-retrato-estudio.jpg').toString('base64')
const icon = readFileSync('site/src/assets/logo/icone-branco.png').toString('base64')

const FIRE = '#EC6807'
const BURNT = '#1B0E05'

/**
 * A fotografia dela manda, e aparece INTEIRA — cabeça, ombros, o gesto.
 *
 * Duas tentativas antes desta falharam por razões opostas: um split meio a meio
 * com fade a atravessar a foto dava-lhe pouca área e deixava-a escura (lia-se
 * como uma captura do site); e a foto em `cover` de bordo a bordo ampliava o
 * rosto ao ponto de o cortar — as fotografias dela são 2688×4032, e num cartão
 * 1200×630 o `cover` deita fora dois terços da altura.
 *
 * Aqui a foto tem coluna própria, alta e larga, sem nada por cima: só uma
 * transição no bordo esquerdo para casar com a chapa de texto.
 */
const ogHtml = `<!doctype html><meta charset="utf-8">
<style>
  ${fontsAnton}
  ${fontsArchivo}
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    display: grid; grid-template-columns: 620px 580px; grid-template-rows: 630px;
    background: ${BURNT}; color: #fff; font-family: Archivo, sans-serif; overflow: hidden;
  }

  .base { padding: 0 40px 0 62px; display: flex; flex-direction: column; justify-content: center; gap: 15px; }
  .marca { display: flex; align-items: center; gap: 13px; }
  .marca img { height: 40px; width: auto; display: block; }
  .marca b {
    font-family: Anton, sans-serif; font-weight: 400;
    font-size: 23px; letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap;
  }
  .tag {
    font-size: 15px; letter-spacing: 0.19em; text-transform: uppercase;
    color: ${FIRE}; font-weight: 600;
  }
  h1 {
    font-family: Anton, sans-serif; font-weight: 400;
    font-size: 56px; line-height: 1.08; letter-spacing: -0.005em; text-transform: uppercase;
  }
  h1 em { font-style: normal; color: ${FIRE}; }
  .rule { width: 88px; height: 4px; background: ${FIRE}; }
  p { font-size: 21px; line-height: 1.4; color: #EFE6DC; max-width: 26ch; }

  .foto { position: relative; height: 630px; overflow: hidden; }
  .foto img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 14%; }
  /* Só o bordo casa com a chapa — o resto da fotografia fica limpo. */
  .foto::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to right, ${BURNT} 0%, rgba(27,14,5,0) 22%);
  }
</style>
<div class="base">
  <div class="marca">
    <img src="data:image/png;base64,${icon}" alt="">
    <b>${t.brand.name}</b>
  </div>
  <span class="tag">${t.brand.tagline}</span>
  <h1>${t.hero.titleLines[0]} ${t.hero.titleLines[1]} <em>${t.hero.titleLines[2]}</em></h1>
  <div class="rule"></div>
  <p>${t.hero.leadShort}</p>
</div>
<div class="foto">
  <img src="data:image/jpeg;base64,${photo}" alt="">
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
