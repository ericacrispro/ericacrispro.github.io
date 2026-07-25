/**
 * Três idiomas, por ordem de prioridade: **pt-PT** (onde ela trabalha),
 * **pt-BR** (a clientela brasileira em Portugal) e **EN**.
 *
 * O tipo vem do pt-PT: os outros ficheiros são obrigados a ter as mesmas chaves.
 * O idioma escolhido fica em `localStorage` e no `?lang=`, para o link partilhado
 * abrir na língua certa.
 */
import { ptPT } from './content/pt-pt'
import { ptBR } from './content/pt-br'
import { en } from './content/en'

export type Content = typeof ptPT

export const LANGS = ['pt-PT', 'pt-BR', 'en'] as const
export type Lang = (typeof LANGS)[number]

export const DEFAULT_LANG: Lang = 'pt-PT'

const DICT: Record<Lang, Content> = { 'pt-PT': ptPT, 'pt-BR': ptBR, en }

const STORAGE_KEY = 'erica:lang'

const isLang = (v: string | null | undefined): v is Lang => LANGS.includes((v ?? '') as Lang)

/**
 * Ordem: `?lang=` → escolha guardada → idioma do browser → pt-PT.
 * O browser só decide entre pt-BR e EN; qualquer outro português cai em pt-PT.
 */
export function getLang(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG

  const param = new URLSearchParams(window.location.search).get('lang')
  if (isLang(param)) return param

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isLang(saved)) return saved
  } catch {
    // localStorage bloqueado (modo privado) — segue para o browser.
  }

  const nav = (navigator.languages?.[0] ?? navigator.language ?? '').toLowerCase()
  if (nav.startsWith('pt-br')) return 'pt-BR'
  if (nav.startsWith('pt')) return 'pt-PT'
  if (nav.startsWith('en')) return 'en'
  return DEFAULT_LANG
}

export function getContent(lang: Lang = getLang()): Content {
  return DICT[lang]
}

/** Sincroniza `<html lang>`, título e meta description com o idioma activo. */
export function applyLangToDocument(lang: Lang = getLang()): Content {
  const t = getContent(lang)
  document.documentElement.lang = t.meta.lang
  document.title = t.meta.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  return t
}

/** Guarda a escolha e recarrega — as versões são estáticas, não há estado a perder. */
export function setLang(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // sem localStorage: o ?lang= abaixo garante que a escolha vale nesta sessão.
  }
  const url = new URL(window.location.href)
  url.searchParams.set('lang', lang)
  window.location.replace(url.toString())
}
