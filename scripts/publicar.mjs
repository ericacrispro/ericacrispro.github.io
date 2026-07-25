/**
 * Prepara TUDO o que vai para o ar, pela ordem certa.
 *
 *   npm run publicar [vN]
 *
 * A ordem importa e é fácil de errar à mão:
 *   1. build das 10 → `mockup/`  (isto APAGA `mockup/` inteiro, miniaturas incluídas)
 *   2. servidor local a servir esse build
 *   3. miniaturas das 10 → `mockup/versoes/shots/`
 *   4. promove a versão escolhida para a raiz `/`
 *
 * Correr o build depois das miniaturas apaga-as e a página de escolha fica com
 * dez cartões sem imagem — foi o que aconteceu, é por isso que este script existe.
 *
 * Sem argumento, mantém na raiz a versão que lá está.
 */
import { execFileSync, spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { VERSIONS } from './versions.mjs'

const alvo = process.argv[2]
if (alvo && !VERSIONS.some((v) => v.id === alvo)) {
  console.error(`versão desconhecida: ${alvo} (${VERSIONS.map((v) => v.id).join(', ')})`)
  process.exit(1)
}

const run = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit' })
const PORT = 5199

console.log('\n▸ 1/4  build das 10 versões → mockup/')
run('npx', ['vite', 'build'])

console.log(`\n▸ 2/4  servidor em http://localhost:${PORT}`)
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })

// Espera que o servidor responda de facto, em vez de adivinhar um `sleep`.
let pronto = false
for (let i = 0; i < 40 && !pronto; i++) {
  try {
    await fetch(`http://localhost:${PORT}/versoes/v1/`)
    pronto = true
  } catch {
    await new Promise((r) => setTimeout(r, 500))
  }
}
if (!pronto) {
  server.kill()
  console.error('o servidor não arrancou — a abortar')
  process.exit(1)
}

try {
  console.log('\n▸ 3/4  miniaturas das 10')
  run('node', ['scripts/thumbs.mjs', `http://localhost:${PORT}`])
} finally {
  server.kill()
}

if (alvo) {
  console.log(`\n▸ 4/4  promover ${alvo.toUpperCase()} para a raiz /`)
  run('node', ['scripts/promote.mjs', alvo])
} else {
  const main = readFileSync('site/root/main.tsx', 'utf8')
  const atual = main.match(/versions\/(v\d+)\//)?.[1] ?? '?'
  console.log(`\n▸ 4/4  reconstruir a raiz (continua a ${atual.toUpperCase()})`)
  run('node', ['scripts/promote.mjs', atual])
}

console.log('\n✓ pronto para publicar:')
console.log('    git add -A && git commit -m "..." && git push origin main')
console.log('  Para conferir antes:  node scripts/serve-root.mjs')
