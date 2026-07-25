/**
 * Contactos e dados fixos. Fonte única — trocar aqui muda as 10 versões.
 *
 * PENDENTE (a Erica ainda vai passar): URL do Google Maps do salão, morada
 * exacta, handle do Instagram e o domínio próprio. Enquanto forem `null`, as
 * versões escondem o bloco correspondente em vez de mostrar dado inventado.
 */

export const WHATSAPP_NUMBER = '351932386898'

export const CONTACT = {
  /** Número dela, formatado para leitura humana. */
  phoneDisplay: '+351 932 386 898',
  /** Link do WhatsApp com mensagem pré-preenchida (a mensagem vem do conteúdo, por idioma). */
  whatsapp(message: string) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  },
  /** Ligação directa — alternativa para quem não usa WhatsApp. */
  tel: `tel:+${WHATSAPP_NUMBER}`,
  /** PENDENTE: pedir à Erica. Enquanto for null, o botão do Instagram não aparece. */
  instagramHandle: null as string | null,
  instagramUrl: null as string | null,
  /** PENDENTE: pedir à Erica o link do Google Maps do salão. */
  mapsUrl: null as string | null,
}

export const BRAND = {
  name: 'Erica Gonçalves',
  tagline: 'Especialista em Ruivos',
  /** PENDENTE: morada exacta do salão. Por agora só o país. */
  city: null as string | null,
  country: 'Portugal',
}

/** Domínio próprio ainda não existe — o site vive no GitHub Pages. */
export const SITE_URL = 'https://ericacrispro.github.io'
