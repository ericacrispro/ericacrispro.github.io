# Marca — Erica Gonçalves

Identidade extraída dos ficheiros que a Erica entregou (`docs da erica/logos/`).
**Provisório até ela mandar a paleta oficial** — os hex abaixo foram lidos
pixel a pixel dos PNG do logótipo, portanto são exactos, mas o *papel* de cada
cor (o que é fundo, o que é acento) foi decidido aqui, não por ela.

## O logótipo

Uma **chama** desenhada em traço fino que, vista de outro modo, é uma **raposa**
de perfil — o animal ruivo, a cor ruiva, o fogo. Duas estrelas de quatro pontas
completam. Ao lado, "ERICA" numa romana de contraste alto e tracking largo, com
"Gonçalves" numa assinatura manuscrita a atravessar. Por baixo, "ESPECIALISTA EM
RUIVOS" em maiúsculas espaçadas.

Variantes entregues (todas 1080×1080 PNG com transparência):

| Ficheiro | Uso |
|---|---|
| `Marca d'gua.png` | Assinatura completa a duas cores (laranja + oliva) — a principal |
| `Marca d'gua 02.png` | Tudo em oliva |
| `Marca d'gua 03.png` | Tudo em laranja |
| `Marca d'gua branca.png` | Tudo a branco — para fundos escuros/fotografia |
| `… - cone.png` | Só a chama-raposa (ícone; serve de favicon e de selo) |
| `… - Sub-logo.png` | Selo circular com o nome à volta |

## Cores

Lidas do logótipo (valores exactos, não aproximados):

| Hex | Papel | OKLCH |
|---|---|---|
| `#EC6807` | **Laranja-fogo** — a cor da marca, do cabelo, da chama | `oklch(0.667 0.185 45)` |
| `#5D541D` | **Oliva escuro** — a assinatura, o contraponto terroso | `oklch(0.42 0.072 100)` |
| `#FFFFFF` | Branco — a variante para fotografia | — |

Derivadas construídas em `site/src/shared/tokens.css` (mesma matiz, luminosidade
variada) para dar profundidade sem inventar cor nova: brasa `#7A2F04`, âmbar
claro, oliva claro, e um neutro quente-frio de croma ~0 para o corpo.

**Estratégia de cor**: *committed* a *drenched* — a marca é uma cor. Laranja a
sério, não laranja como detalhe. O erro a evitar é diluir isto num creme
"beleza/wellness": bege é o default de IA da categoria, e aqui há uma cor
própria, forte, que já vem do logótipo e do cabelo.

## Tipografia

O logótipo já dita o registo: **romana de contraste alto** (o "ERICA") +
**assinatura manuscrita** (o "Gonçalves"). O sistema devolve isso:

| Fonte | Papel | Porquê |
|---|---|---|
| **Bodoni Moda** | Títulos display | Didone de contraste alto — o parente vivo do "ERICA" do logótipo |
| **Archivo** | Corpo | Grotesca de grelha estreita, legível a 14px no telemóvel, acentos PT completos |
| **Sacramento** | Assinatura (uso raro) | Monolinear, ecoa o "Gonçalves" — nunca em corpo de texto |
| **Marcellus** | Display alternativo | Romana de capitais, ar de placa de salão clássico |
| **Anton** | Display de cartaz | Condensada pesada, para as versões que gritam |
| **Epilogue** | Sans alternativa | Geométrica-humanista com carácter |
| **EB Garamond** | Serifada de leitura | Old-style, para as versões editoriais |
| **Bricolage Grotesque** | Display irregular | Variável, com estranheza deliberada |

Todas em Google Fonts, servidas **self-hosted em base64** (`npm run fonts`) —
sem CDN, sem FOIT, funciona offline. Cada versão importa só as famílias que usa.

## Notas

- A raposa/chama é o activo mais forte da marca: usar como ícone, como marca de
  água, como forma recortada. Não a redesenhar.
- "Especialista em ruivos" é o posicionamento inteiro numa linha — repetir.
- Evitar: rosa-milennial de salão, dourado de "luxo" genérico, bege-creme de IA,
  e fotografia de stock. As fotos reais do trabalho dela são a prova.
