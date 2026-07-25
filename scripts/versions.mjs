/**
 * As 10 direcções visuais. Fonte única: `vite.config.ts`, `scripts/entries.mjs`,
 * `scripts/thumbs.mjs` e a página de escolha leem daqui.
 */
export const VERSIONS = [
  {
    id: 'v1',
    name: 'Chama',
    fonts: ['anton', 'archivo'],
    resumo:
      'Laranja da marca a cobrir o ecrã e a fotografia a sangrar de cima a baixo. Condensada, alta, impossível de ignorar.',
  },
  {
    id: 'v2',
    name: 'Espelho',
    fonts: ['bodoni-moda', 'archivo'],
    resumo:
      'Quase-preto queimado, luz de salão à noite. A tua fotografia fica fixa ao lado enquanto o conteúdo passa.',
  },
  {
    id: 'v3',
    name: 'Carta de Tons',
    fonts: ['epilogue', 'archivo'],
    resumo:
      'O site é a carta de cores. Escolhe-se um tom e a página inteira responde — trabalhos, descrição e contacto.',
  },
  {
    id: 'v4',
    name: 'Raposa',
    fonts: ['marcellus', 'epilogue'],
    resumo:
      'A chama-raposa do logótipo conduz a página, desenhada em traço e em movimento. Oliva, quente, artesanal.',
  },
  {
    id: 'v5',
    name: 'Estúdio',
    fonts: ['eb-garamond', 'archivo'],
    resumo: 'Claro, arejado e organizado. Uma grelha calma onde as fotografias fazem todo o barulho.',
  },
  {
    id: 'v6',
    name: 'Manifesto',
    fonts: ['bricolage-grotesque', 'archivo'],
    resumo: 'Tipografia enorme e frases curtas sobre laranja chapado. Poucas fotografias, todas gigantes.',
  },
  {
    id: 'v7',
    name: 'Mostruário',
    fonts: ['epilogue', 'bodoni-moda'],
    resumo: 'Faixas de fotografias em movimento contínuo, como uma montra. O trabalho passa; o contacto fica.',
  },
  {
    id: 'v8',
    name: 'Sussurro',
    fonts: ['marcellus', 'archivo'],
    resumo: 'Oliva escuro, muito ar e poucas coisas — a versão silenciosa. Elegância sem gritar.',
  },
  {
    id: 'v9',
    name: 'Conversa',
    fonts: ['archivo', 'sacramento'],
    resumo: 'Desenhada como uma conversa no telemóvel: as dúvidas em balões, a resposta na tua voz, o WhatsApp à mão.',
  },
  {
    id: 'v10',
    name: 'Cartaz',
    fonts: ['anton', 'bodoni-moda'],
    resumo: 'Blocos de cor chapada e retícula de impressão, como a embalagem de uma coloração. Gráfico e directo.',
  },
]

export const IDS = VERSIONS.map((v) => v.id)
