/**
 * Prepara as variantes do logótipo entregue pela Erica para uso no site.
 *
 *   node scripts/logos.mjs
 *
 * Os PNG originais são 1080×1080 com muita margem transparente à volta. Aqui
 * corta-se a margem (`.trim()`), reduz-se e exporta-se PNG + WebP.
 * Saída: `site/src/assets/logo/`.
 */
import sharp from 'sharp'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'

const SRC = "docs da erica/logos"
const OUT = 'site/src/assets/logo'

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

/** ficheiro original → nome de saída. */
const JOBS = [
  ["Marca d'gua.png", 'assinatura-duas-cores', 900],
  ["Marca d'gua 02.png", 'assinatura-oliva', 900],
  ["Marca d'gua 03.png", 'assinatura-laranja', 900],
  ["Marca d'gua branca.png", 'assinatura-branca', 900],
  ["Marca d'gua - cone.png", 'icone-duas-cores', 512],
  // Atenção: nos ficheiros do ícone e do selo, a numeração da Erica está ao
  // contrário da da assinatura — aqui o "02" é o laranja e o "03" o oliva.
  // Confirmado por amostragem de píxeis: 02 → #EC6807, 03 → #5D541D.
  ["Marca d'gua 02 - cone.png", 'icone-laranja', 512],
  ["Marca d'gua 03 - cone.png", 'icone-oliva', 512],
  ["Marca d'gua branca - cone.png", 'icone-branco', 512],
  ["Marca d'gua 02 - Sub-logo.png", 'selo-laranja', 640],
  ["Marca d'gua 03 - Sub-logo.png", 'selo-oliva', 640],
  ["Marca d'gua branca - Sub-logo.png", 'selo-branco', 640],
]

const dims = {}

for (const [file, name, width] of JOBS) {
  const base = sharp(`${SRC}/${file}`).trim({ threshold: 1 }).resize({ width, withoutEnlargement: true })
  await base.clone().png({ compressionLevel: 9, palette: true }).toFile(`${OUT}/${name}.png`)
  const info = await base.clone().webp({ quality: 92, alphaQuality: 100 }).toFile(`${OUT}/${name}.webp`)
  dims[name] = { width: info.width, height: info.height }
  console.log(`✓ ${name} (${info.width}×${info.height})`)
}

writeFileSync(
  'site/src/shared/logo.data.ts',
  `/** GERADO por \`node scripts/logos.mjs\` — dimensões reais de cada variante do logótipo. */
export const LOGO_DIMS: Record<string, { width: number; height: number }> = ${JSON.stringify(dims, null, 2)}
`,
)
console.log(`\n✓ ${JOBS.length} variantes · site/src/shared/logo.data.ts`)
