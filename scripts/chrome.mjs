/**
 * Onde está o Chrome headless, e como fazê-lo arrancar neste WSL.
 *
 * O `chrome-headless-shell` do cache do puppeteer precisa de `libasound.so.2`,
 * que o Ubuntu do WSL não traz. A biblioteca extrai-se sem `sudo`:
 *
 *   mkdir -p ~/.cache/chrome-libs && cd ~/.cache/chrome-libs
 *   apt-get download libasound2t64 && dpkg-deb -x libasound2t64_*.deb .
 *
 * `~/.cache/chrome-libs` é de propósito: a primeira tentativa deste projecto
 * pôs a biblioteca numa pasta temporária, que desapareceu entre sessões e
 * partiu todas as capturas. Fica no cache do utilizador, que persiste.
 */
import { existsSync, readdirSync } from 'node:fs'
import { execSync } from 'node:child_process'

/** Caminho do binário, ou `null` se o puppeteer nunca descarregou o Chrome. */
export function chromePath() {
  const cacheDir = `${process.env.HOME}/.cache/puppeteer/chrome-headless-shell`
  if (!existsSync(cacheDir)) return null
  const version = readdirSync(cacheDir).sort().pop()
  if (!version) return null
  const bin = `${cacheDir}/${version}/chrome-headless-shell-linux64/chrome-headless-shell`
  return existsSync(bin) ? bin : null
}

/**
 * Põe `libasound.so.2` no `LD_LIBRARY_PATH`. Procura primeiro o cache estável;
 * as pastas temporárias ficam como recurso, para quem já as tenha.
 */
export function ensureChromeLibs() {
  const stable = `${process.env.HOME}/.cache/chrome-libs/usr/lib/x86_64-linux-gnu`
  const dir = existsSync(`${stable}/libasound.so.2`)
    ? stable
    : execSync(
        'find /tmp/claude-* -maxdepth 10 -type d -path "*chrome/libs/usr/lib/x86_64-linux-gnu" 2>/dev/null | head -1',
        { shell: '/bin/bash' },
      )
        .toString()
        .trim()

  if (dir) {
    process.env.LD_LIBRARY_PATH = [dir, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':')
    return dir
  }
  console.error(
    'aviso: libasound.so.2 não encontrada — o Chrome headless não arranca.\n' +
      '  mkdir -p ~/.cache/chrome-libs && cd ~/.cache/chrome-libs \\\n' +
      '    && apt-get download libasound2t64 && dpkg-deb -x libasound2t64_*.deb .',
  )
  return null
}

/** O que basta para `puppeteer.launch({ ...launchOptions() })`. */
export function launchOptions() {
  ensureChromeLibs()
  const executablePath = chromePath()
  if (!executablePath) {
    console.error('chrome-headless-shell não encontrado no cache do puppeteer')
    process.exit(1)
  }
  return { executablePath, args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'] }
}
