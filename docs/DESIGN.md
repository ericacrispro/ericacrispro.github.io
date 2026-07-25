# Design system — site da Erica

Como o site é construído. A **identidade** (cores, logótipo, fontes) está em
`BRAND.md` e é lei; a **estratégia** está em `../PRODUCT.md`. Este ficheiro
descreve o **sistema** que as implementa.

## Stack

Vite 8 + React 19 + TypeScript, **multi-página** (uma entrada por versão). Sem
backend, sem router: cada versão é uma página estática independente.

```
site/
  index.html              # índice /mockup/ — a área de rascunhos (HTML puro)
  versoes/
    index.html            # escolha das 11 versões, com miniaturas
    v1/ … v11/            # uma entrada por versão: index.html + main.tsx (gerados)
  root/                   # a entrada do site publicado em /
  src/
    content/pt-pt.ts      # TODA a copy, em pt-PT — fonte de verdade
    content/pt-br.ts      # tradução, tipada contra o pt-PT
    content/en.ts         # idem
    i18n.ts               # getContent() · ?lang= · localStorage · setLang()
    config.ts             # WhatsApp, telefone, pendentes (Maps, Instagram)
    shared/tokens.css     # tokens da marca em OKLCH + reset + a11y
    shared/photos.ts      # as 25 fotografias, com srcset pronto
    shared/photos.data.ts # gerado por `npm run photos`
    shared/Picture.tsx    # <picture> + srcset, sem CLS
    shared/Logo.tsx       # as 11 variantes do logótipo
    shared/LangSwitch.tsx # selector de idioma (select nativo + variante em botões)
    shared/contact.ts     # whatsappHref(t, intent) — o CTA sai daqui
    shared/useReveal.ts   # animação de entrada segura (conteúdo visível por omissão)
    assets/fonts/*.css    # 8 famílias em base64, uma por ficheiro
    assets/fonts.css      # o trio da marca num só ficheiro
    assets/img/           # fotografias optimizadas (geradas)
    assets/logo/          # logótipo em 11 variantes (geradas)
    versions/v1..v11/     # o design de cada versão (App.tsx + css)
```

`npm run build` → `mockup/` (índice) + `mockup/versoes/vN/` (as 11), com
`base: './'` — caminhos relativos, portanto o mesmo build serve no GitHub Pages
e num domínio próprio, a qualquer profundidade. A raiz `/` continua a ser o
site publicado: **o build não lhe toca**.

Cuidado: `emptyOutDir` limpa `mockup/` a cada build — as miniaturas da página de
escolha regeneram-se depois (`npm run thumbs`), não editar nada à mão lá.

## Regras que o sistema impõe

- **Nenhuma copy no JSX.** Todo o texto vem de `content/pt-pt.ts` via
  `getContent()`. Consequência: traduzir = escrever um ficheiro; o TypeScript
  acusa a chave em falta. Três idiomas: pt-PT (omissão), pt-BR, EN.
- **Nenhum contacto escrito à mão.** WhatsApp/telefone saem de `config.ts` pelo
  `whatsappHref(t, intent)`. Trocar o número = uma linha, as 11 seguem.
- **Nenhum dado inventado.** Morada, Instagram e Maps ainda não existem: os
  campos são `null` em `config.ts` e as versões **escondem o bloco** em vez de
  mostrar texto falso.
- **Contacto é a primeira acção.** Toda a versão tem o WhatsApp alcançável em
  qualquer ponto do scroll no telemóvel (barra fixa, botão flutuante ou
  cabeçalho sticky — a forma varia, a garantia não).
- **Fotografias com `<picture>` + srcset** (WebP + JPEG, 2 larguras),
  `width`/`height` explícitos. Hero: `priority`.
- **Fontes self-hosted em base64** (`npm run fonts`). Sem Google Fonts em
  runtime: sem FOIT, sem terceiro, funciona offline. Cada versão importa só as
  famílias que usa (o `main.tsx` é gerado a partir de `scripts/versions.mjs`).

## Cor — o essencial

`#EC6807` é a marca, mas **não passa em contraste como texto sobre branco**
(3.2:1). Os três usos legítimos:

1. **superfície** — laranja no fundo, texto quase-preto por cima (6.4:1 ✓);
2. **display** — títulos grandes (≥ 3:1 chega para texto grande);
3. **detalhe** — filetes, ícones, sublinhados.

Para laranja em corpo de texto sobre claro, usar `--fire-800` (brasa, 9.4:1).

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Vite dev. As versões em `/versoes/vN/`, o índice em `/` |
| `npm run build` | Build das 11 → `mockup/` |
| `npm run fonts` | Descarrega as 8 famílias e embute em base64 (subset `latin`) |
| `npm run photos` | Optimiza as fotos de `docs da erica/` → `src/assets/img/` + `photos.data.ts` |
| `node scripts/logos.mjs` | Corta e optimiza as 11 variantes do logótipo |
| `npm run entries` | Regenera as entradas das 11 versões |
| `npm run shots` | `npm run shots <url> <dir> <prefixo>` — captura 320/375/390/414/768/1440 e **falha** se houver erro de consola, imagem partida, overflow horizontal ou alvo de toque < 44px |
| `npm run thumbs` | Miniaturas JPEG (desktop + telemóvel) para a página de escolha |
| `node scripts/serve-root.mjs` | Serve a RAIZ do repositório como o GitHub Pages a serve (o `vite preview` serve `site/`, não a raiz) |
| `npm run promote v3` | Publica a versão escolhida na raiz `/` |
| `npm run social` | Gera `og.jpg`, favicons e ícone de iOS |

`scripts/shots.mjs` é o portão de qualidade: nenhuma versão é entregue sem sair
0 nos seis viewports.

## Armadilhas já pagas (não repetir)

- **Reveal que segura `opacity: 0`** trava a secção invisível para sempre (o
  Chrome pausa animações em separador oculto/recarregamento). Regra: conteúdo
  **visível por omissão**; a animação só enriquece. `useReveal()` já implementa
  isto, com rede de segurança de 1,5 s.
- **`loading="lazy"` + captura de página inteira**: o Chrome adia a pintura e a
  foto sai em branco. Por isso `Picture` é `eager` por omissão.
- **`<picture>` é inline**: `height: 100%` na `<img>` mede a `<picture>`, não o
  contentor. Os tokens já dão `display: block`.
- **Medida de linha**: mirar ~56ch com Archivo dá os 65–75 caracteres reais.
- **Fotografias todas em retrato** (3024×4032 na maioria). Não há uma única
  paisagem — qualquer hero de ecrã inteiro em desktop precisa de `object-fit:
  cover` com `object-position` pensado, ou de composição em duas colunas.

## Acessibilidade (chão, não tecto)

Contraste AA verificado em todas (corpo ≥ 4.5:1, display ≥ 3:1), landmarks
semânticos, `h1` único, skip-link, foco visível, `prefers-reduced-motion` com
alternativa em toda a animação, alvos de toque ≥ 44px, `alt` descritivo vindo de
`content.photoAlt[slug]`.

## Armadilhas encontradas ao construir as 10

Além das já listadas acima, estas apareceram durante a construção e estão
resolvidas na raiz — não voltar a resolvê-las versão a versão:

- **Cascata: `tokens.css` chega DEPOIS do CSS da versão no build de produção.**
  O Vite ordena os *chunks* assim, e um `:root` sem camada anulava as fontes
  que cada versão define — a V1 saía em Bodoni em vez de Anton, e só no build,
  nunca em `dev`. Resolvido pondo `tokens.css` inteiro em `@layer base`: regras
  em camada perdem para regras sem camada, seja qual for a ordem de carregamento.
- **`decoding="async"` deixa fotografias em branco nas capturas.** Quatro
  agentes tropeçaram nisto de forma independente: o Chrome headless redimensiona
  a janela para a captura de página inteira e não descodifica o que nunca esteve
  no ecrã. Como é por estas capturas que a Erica escolhe, `Picture` é
  `decoding="sync"` por omissão.
- **A biblioteca do Chrome tem de viver num sítio estável.** `libasound.so.2`
  ficou primeiro numa pasta temporária e desapareceu entre sessões, partindo
  todas as capturas. Vive agora em `~/.cache/chrome-libs`; `scripts/chrome.mjs`
  procura lá e explica como a repor.
- **Barra fixa a tapar botões na primeira dobra.** Um botão do herói encostado
  ao fim do ecrã fica por baixo da barra de contacto. Cada versão reserva
  `--cta-bar-height`; onde o herói não cabia (V4), a fotografia encolhe e o par
  de botões redundante desaparece — a barra já leva a mesma acção.
- **O Chrome headless reporta `en-US`.** As miniaturas saíam todas em inglês;
  `thumbs.mjs` pede `?lang=pt-PT` explicitamente.
