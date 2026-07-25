# Érica Gonçalves — site (cabeleireira, especialista em ruivos)

> **Este ficheiro é o ponto de partida.** Uma sessão nova deve lê-lo primeiro,
> depois `PRODUCT.md` (estratégia), `docs/BRAND.md` (identidade) e
> `docs/DESIGN.md` (o sistema).

## O que é

Site profissional da **Érica Gonçalves**, cabeleireira **especialista em
ruivos** em Portugal. Publicado no **GitHub Pages** (site de utilizador, serve
do branch `main`, raiz `/`). Ainda **sem domínio próprio** — vive em
`ericacrispro.github.io`; quando ela comprar um, junta-se um `CNAME` e aponta-se
o DNS.

Irmão do projecto da Aline (`../alineferezin.github.io`, psicóloga): mesma
stack, mesmo toolkit, mesma disciplina. **Marca completamente diferente** — ali
verde e acolhimento clínico, aqui fogo e ofício.

## Regras inegociáveis

1. **Mobile-first a sério.** Desenhar dos 320px para cima. O caso duro é o
   iPhone SE (375×667): a primeira dobra tem de funcionar lá.
2. **Contacto é a primeira acção.** O CTA de todo o site é falar com ela pelo
   **WhatsApp** — `+351 932 386 898`. Tem de estar alcançável em qualquer ponto
   do scroll no telemóvel.
3. **Três idiomas, por esta ordem:** **pt-PT** (principal, é onde ela
   trabalha), **pt-BR**, **inglês**. Nenhum texto no JSX — tudo em
   `site/src/content/`.
4. **Nada de dado inventado.** Sem morada, preços, horários, depoimentos ou anos
   de experiência. O que falta está `null` em `config.ts` e o bloco esconde-se.
5. **`/` tem de funcionar sempre**, para ela poder ver a qualquer momento.
6. **Dez versões para ela escolher** em `/mockup/versoes/`. A escolhida promove-se
   para a raiz com `npm run promote vN`.

## Quem é a Érica (extraído dos materiais dela)

- Cabeleireira em **Portugal**, com uma especialidade só: **cor ruiva** —
  coloração, correcção do que correu mal noutro sítio, e manutenção do tom.
- É **ela própria ruiva** — bob de caracóis, laranja vivo. É parte do argumento.
- Marca: **chama que também é raposa**, "ERICA Gonçalves", *"ESPECIALISTA EM
  RUIVOS"*. Laranja `#EC6807` + oliva `#5D541D`.
- Entregou 35 fotografias: 3 dela, 28 de trabalhos em clientes, 4 de produto.
- Voz: quente, directa, sem misticismo de "bem-estar". Três palavras:
  **fogo, mão, verdade**.

## Materiais

`docs da erica/` (git-ignorado — ~100 MB, fica local):

| Pasta | O que tem |
|---|---|
| `erica/` | 3 fotografias dela |
| `clients/` | 28 fotografias de trabalhos |
| `produtos/` | 4 fotografias da coloração profissional que usa |
| `logos/` | 11 variantes do logótipo (PNG 1080×1080 com transparência) |

A curadoria (que foto entra, em que papel, com que tom de ruivo) está em
`scripts/photo-manifest.json`. `npm run photos` regenera as versões optimizadas.

## Estado (24/07/2026)

Base pronta e as 10 versões construídas. **A escolha é dela.** A versão promovida
para `/` é um palpite; troca-se com um comando.

### Pendências à espera da Érica

- **Paleta oficial** (a actual foi extraída do logótipo, pixel a pixel)
- **Morada + link do Google Maps** do salão
- **Instagram** (handle e URL)
- **Confirmação dos serviços** (os do site são inferidos das fotografias)
- **Autorização de imagem** das clientes com rosto identificável
- **Domínio próprio**

## Comandos

Ver `docs/DESIGN.md` para a lista completa. Os quatro do dia-a-dia:

```bash
npm run dev            # versões em /versoes/vN/, índice em /
npm run build          # as 10 → mockup/
npm run shots <url> <dir> <prefixo>   # portão de qualidade: 6 viewports, falha se houver bug
npm run promote v3     # publica a versão escolhida na raiz /
```

## Publicar

```bash
git add -A && git commit -m "..." && git push origin main
```

30–60s de propagação. Verificar:
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://ericacrispro.github.io/
```
