/**
 * A primeira acção de todo o site: entrar em contacto.
 *
 * Nenhuma versão constrói o link do WhatsApp à mão — sai daqui, com a mensagem
 * já escrita no idioma activo. Trocar o número é uma linha em `config.ts`.
 */
import { CONTACT } from '../config'
import type { Content } from '../i18n'

export type ContactIntent = 'geral' | 'marcar' | 'correcao'

/** Link do WhatsApp com a mensagem certa para o contexto do botão. */
export function whatsappHref(t: Content, intent: ContactIntent = 'geral'): string {
  const message =
    intent === 'marcar'
      ? t.cta.whatsappMessageAgenda
      : intent === 'correcao'
        ? t.cta.whatsappMessageCorrecao
        : t.cta.whatsappMessage
  return CONTACT.whatsapp(message)
}

/** Atributos comuns a qualquer botão de WhatsApp (abre noutro separador, sem referrer). */
export const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const

export { CONTACT }
