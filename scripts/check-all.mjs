/**
 * Portão de qualidade de TODAS as versões, de uma vez.
 *
 *   npm run build
 *   npx vite preview --port 5190 --strictPort &
 *   node scripts/check-all.mjs http://localhost:5190
 *
 * Corre o `shots.mjs` sobre cada versão e resume no fim quem passou e quem não.
 * As capturas ficam em `/tmp/shots-<id>/`.
 */
import { execFileSync } from 'node:child_process'
import { IDS } from './versions.mjs'

const base = (process.argv[2] || 'http://localhost:5190').replace(/\/$/, '')
const falhas = []

for (const id of IDS) {
  process.stdout.write(`\n──────── ${id} ────────\n`)
  try {
    execFileSync('node', ['scripts/shots.mjs', `${base}/versoes/${id}/`, `/tmp/shots-${id}`, id], {
      stdio: 'inherit',
    })
  } catch {
    falhas.push(id)
  }
}

console.log('\n════════ resumo ════════')
if (falhas.length === 0) {
  console.log(`✓ as ${IDS.length} versões passaram nos seis viewports`)
} else {
  console.log(`✗ com problemas: ${falhas.join(', ')}`)
  process.exitCode = 1
}
console.log('  (o automático é só o chão — OLHA os *-fold.png, sobretudo 375×667)')
