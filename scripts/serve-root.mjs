/**
 * Serve a raiz do repositório tal como o GitHub Pages a serve.
 *
 *   node scripts/serve-root.mjs [porta]
 *
 * Existe porque `vite preview` serve a partir de `site/` (é o `root` do config)
 * e não da raiz — não dá para conferir o site publicado nem o `/mockup/`.
 * Aqui vê-se exactamente o que vai para o ar, incluindo os caminhos relativos.
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PORT = Number(process.argv[2] || 5192)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
}

createServer(async (req, res) => {
  const [pathname, query = ''] = req.url.split('?')
  // `normalize` + o corte dos `../` impede sair da raiz do repositório.
  const rel = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '')
  let path = join(ROOT, rel)

  try {
    if ((await stat(path)).isDirectory()) {
      // `/mockup` → `/mockup/`. Sem isto, os caminhos relativos da página
      // resolvem contra a directoria-pai e a página abre sem CSS — é o que o
      // GitHub Pages faz, e o servidor local tem de fazer igual.
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { location: `${pathname}/${query ? `?${query}` : ''}` }).end()
        return
      }
      path = join(path, 'index.html')
    }
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('não encontrado')
    return
  }

  try {
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' }).end(await readFile(path))
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('não encontrado')
  }
}).listen(PORT, () => console.log(`raiz do repositório em http://localhost:${PORT}`))
